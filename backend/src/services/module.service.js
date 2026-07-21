import { Module } from "../models/module.model.js";
import { Lesson } from "../models/lesson.model.js";
import { Course } from "../models/course.model.js";
import AppError   from "../utils/AppError.js";

// ── Helpers ───────────────────────────────────────────────────────────────────

const assertCourseOwner = async (courseId, user) => {
  const course = await Course.findById(courseId);
  if (!course) throw new AppError("Course not found", 404);

  const isOwner = course.instructor.toString() === user._id.toString();
  if (!isOwner && user.role !== "admin") {
    throw new AppError("You are not authorized to modify this course", 403);
  }

  return course;
};


const assertModuleInCourse = async (moduleId, courseId) => {
  const module = await Module.findOne({ _id: moduleId, course: courseId });
  if (!module) throw new AppError("Module not found in this course", 404);
  return module;
};

// ── Create ────────────────────────────────────────────────────────────────────

export const createModule = async (courseId, user, data) => {
  await assertCourseOwner(courseId, user);

  // Auto-assign order: place at end
  const lastModule = await Module.findOne({ course: courseId })
    .sort({ order: -1 })
    .select("order");

  const order = lastModule ? lastModule.order + 1 : 1;

  const module = await Module.create({
    ...data,
    course: courseId,
    order,
  });

  return module;
};

// ── Get modules by course ─────────────────────────────────────────────────────

export const getModulesByCourse = async (courseId, user) => {
  // Students only see published modules
  const filter = { course: courseId };
  const isPrivileged = user && (user.role === "instructor" || user.role === "admin");

  if (!isPrivileged) {
    filter.isPublished = true;
  } else {
    // Verify instructor owns this course
    const course = await Course.findById(courseId);
    if (!course) throw new AppError("Course not found", 404);

    if (user.role === "instructor") {
      const isOwner = course.instructor.toString() === user._id.toString();
      if (!isOwner) filter.isPublished = true; // not owner — treat as student
    }
  }

  const modules = await Module.find(filter)
    .sort({ order: 1 })
    .populate({
      path:    "lessons",
      match:   isPrivileged ? {} : { isPublished: true },
      select:  "title slug order isPreview isPublished video.duration",
      options: { sort: { order: 1 } },
    });

  return modules;
};

// ── Update ────────────────────────────────────────────────────────────────────

export const updateModule = async (courseId, moduleId, user, data) => {
  await assertCourseOwner(courseId, user);
  const module = await assertModuleInCourse(moduleId, courseId);

  Object.assign(module, data);
  await module.save();

  return module;
};

// ── Delete ────────────────────────────────────────────────────────────────────

export const deleteModule = async (courseId, moduleId, user) => {
  await assertCourseOwner(courseId, user);
  const module = await assertModuleInCourse(moduleId, courseId);

  // Delete all lessons inside this module
  await Lesson.deleteMany({ module: moduleId });

  await module.deleteOne();

  // Re-normalize order of remaining modules
  const remaining = await Module.find({ course: courseId }).sort({ order: 1 });
  const bulkOps   = remaining.map((m, i) => ({
    updateOne: {
      filter: { _id: m._id },
      update: { $set: { order: i + 1 } },
    },
  }));
  if (bulkOps.length > 0) await Module.bulkWrite(bulkOps);
};

// ── Reorder ───────────────────────────────────────────────────────────────────

export const reorderModules = async (courseId, user, moduleIds) => {
  await assertCourseOwner(courseId, user);

  // Verify all IDs belong to this course
  const existing = await Module.find({ course: courseId }).select("_id");
  const existingIds = existing.map((m) => m._id.toString());

  const invalid = moduleIds.filter((id) => !existingIds.includes(id));
  if (invalid.length > 0) {
    throw new AppError(`Invalid module IDs: ${invalid.join(", ")}`, 400);
  }

  // Bulk update order based on array position
  const bulkOps = moduleIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id, course: courseId },
      update: { $set: { order: index + 1 } },
    },
  }));

  await Module.bulkWrite(bulkOps);

  // Return updated modules in new order
  return Module.find({ course: courseId }).sort({ order: 1 });
};