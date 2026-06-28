import { Lesson } from "../models/lesson.model.js";
import { Module } from "../models/module.model.js";
import { Course } from "../models/course.model.js";
import AppError   from "../utils/AppError.js";

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Verify module exists and requesting user owns the parent course.
 * Returns { module, course }.
 */
const assertModuleOwner = async (moduleId, user) => {
  const module = await Module.findById(moduleId).populate("course");
  if (!module) throw new AppError("Module not found", 404);

  const course  = module.course;
  const isOwner = course.instructor.toString() === user._id.toString();

  if (!isOwner && user.role !== "admin") {
    throw new AppError("You are not authorized to modify this module", 403);
  }

  return { module, course };
};

/**
 * Verify lesson exists and belongs to the given module.
 */
const assertLessonInModule = async (lessonId, moduleId) => {
  const lesson = await Lesson.findOne({ _id: lessonId, module: moduleId });
  if (!lesson) throw new AppError("Lesson not found in this module", 404);
  return lesson;
};

// ── Create ────────────────────────────────────────────────────────────────────

export const createLesson = async (moduleId, user, data) => {
  const { module, course } = await assertModuleOwner(moduleId, user);

  // Auto-assign order: place at end of module
  const lastLesson = await Lesson.findOne({ module: moduleId })
    .sort({ order: -1 })
    .select("order");

  const order = lastLesson ? lastLesson.order + 1 : 1;

  const lesson = await Lesson.create({
    ...data,
    module:  moduleId,
    course:  course._id,
    order,
  });

  return lesson;
};

// ── Get lessons by module ─────────────────────────────────────────────────────

export const getLessonsByModule = async (moduleId, user) => {
  // Verify module exists
  const module = await Module.findById(moduleId);
  if (!module) throw new AppError("Module not found", 404);

  const isPrivileged = user && (user.role === "instructor" || user.role === "admin");

  const filter = { module: moduleId };

  if (!isPrivileged) {
    filter.isPublished = true;
  } else if (user.role === "instructor") {
    // Check ownership — if not owner, treat as student
    const course  = await Course.findById(module.course);
    const isOwner = course?.instructor.toString() === user._id.toString();
    if (!isOwner) filter.isPublished = true;
  }

  const lessons = await Lesson.find(filter)
    .sort({ order: 1 })
    .select("-attachments"); // exclude attachments from list — fetched on detail

  return lessons;
};

// ── Get single lesson ─────────────────────────────────────────────────────────

export const getLessonById = async (lessonId, user) => {
  const lesson = await Lesson.findById(lessonId)
    .populate("module", "title course")
    .populate("course", "title instructor");

  if (!lesson) throw new AppError("Lesson not found", 404);

  const isPrivileged = user && (user.role === "instructor" || user.role === "admin");

  if (!isPrivileged) {
    // Students can only access published lessons
    // unless the lesson is marked as free preview
    if (!lesson.isPublished && !lesson.isPreview) {
      throw new AppError("Lesson not found", 404);
    }
  } else if (user.role === "instructor") {
    const isOwner =
      lesson.course.instructor.toString() === user._id.toString();
    if (!isOwner && !lesson.isPublished) {
      throw new AppError("Lesson not found", 404);
    }
  }

  return lesson;
};

// ── Update ────────────────────────────────────────────────────────────────────

export const updateLesson = async (moduleId, lessonId, user, data) => {
  await assertModuleOwner(moduleId, user);
  const lesson = await assertLessonInModule(lessonId, moduleId);

  // Prevent overwriting course/module refs
  delete data.course;
  delete data.module;

  Object.assign(lesson, data);
  await lesson.save(); // triggers slug pre-save if title changed

  return lesson;
};

// ── Publish / Unpublish ───────────────────────────────────────────────────────

export const togglePublishLesson = async (moduleId, lessonId, user) => {
  await assertModuleOwner(moduleId, user);
  const lesson = await assertLessonInModule(lessonId, moduleId);

  // Guard: must have a video before publishing
  if (!lesson.isPublished && !lesson.video?.url) {
    throw new AppError(
      "Cannot publish a lesson without a video. Upload a video first.",
      400
    );
  }

  lesson.isPublished = !lesson.isPublished;
  await lesson.save();

  return lesson;
};

// ── Delete ────────────────────────────────────────────────────────────────────

export const deleteLesson = async (moduleId, lessonId, user) => {
  await assertModuleOwner(moduleId, user);
  const lesson = await assertLessonInModule(lessonId, moduleId);

  await lesson.deleteOne();

  // Re-normalize order of remaining lessons in the module
  const remaining = await Lesson.find({ module: moduleId }).sort({ order: 1 });
  const bulkOps   = remaining.map((l, i) => ({
    updateOne: {
      filter: { _id: l._id },
      update: { $set: { order: i + 1 } },
    },
  }));
  if (bulkOps.length > 0) await Lesson.bulkWrite(bulkOps);
};

// ── Reorder lessons ───────────────────────────────────────────────────────────

export const reorderLessons = async (moduleId, user, lessonIds) => {
  await assertModuleOwner(moduleId, user);

  // Verify all IDs belong to this module
  const existing    = await Lesson.find({ module: moduleId }).select("_id");
  const existingIds = existing.map((l) => l._id.toString());

  const invalid = lessonIds.filter((id) => !existingIds.includes(id));
  if (invalid.length > 0) {
    throw new AppError(`Invalid lesson IDs: ${invalid.join(", ")}`, 400);
  }

  const bulkOps = lessonIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id, module: moduleId },
      update: { $set: { order: index + 1 } },
    },
  }));

  await Lesson.bulkWrite(bulkOps);

  return Lesson.find({ module: moduleId }).sort({ order: 1 });
};