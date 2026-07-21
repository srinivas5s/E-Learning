import { Course } from "../models/course.model.js";
import AppError from "../utils/AppError.js";

// ── Helpers ───────────────────────────────────────────────────────────────────

const assertOwnerOrAdmin = (course, user) => {
    const isOwner = course.instructor._id
        ? course.instructor._id.toString() === user._id.toString()
        : course.instructor.toString() === user._id.toString();

    if (!isOwner && user.role !== "admin") {
        throw new AppError("You are not authorized to modify this course", 403);
    }
};

// ── Create ────────────────────────────────────────────────────────────────────

export const createCourse = async (instructorId, data) => {
    const course = await Course.create({
        ...data,
        instructor: instructorId,
        status: "draft",
        isPublished: false,
    });
    return course;
};

// ── Get all courses (public) ──────────────────────────────────────────────────

export const getAllCourses = async (query) => {
    const {
        search,
        category,
        level,
        language,
        minPrice,
        maxPrice,
        sort = "newest",
        page = 1,
        limit = 12,
    } = query;

    const filter = { status: "published" };

    // Full-text search
    if (search) {
        filter.$text = { $search: search };
    }

    // Filters
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (language) filter.language = language;

    // Price range
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Sort options
    const sortMap = {
        newest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        popular: { studentsEnrolled: -1 },
        topRated: { averageRating: -1 },
        priceLow: { price: 1 },
        priceHigh: { price: -1 },
    };
    const sortOption = sortMap[sort] || sortMap.newest;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Course.countDocuments(filter);

    const courses = await Course.find(filter)
        .populate("instructor", "name avatar")
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .select("-description -requirements -learningOutcomes");
    // Exclude heavy fields from listing — only needed on detail page

    return {
        courses,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
            hasNext: Number(page) < Math.ceil(total / Number(limit)),
            hasPrev: Number(page) > 1,
        },
    };
};

// ── Get single course by slug (public) ────────────────────────────────────────

export const getCourseBySlug = async (slug) => {
    const course = await Course.findOne({ slug, status: "published" })
        .populate("instructor", "name avatar bio");

    if (!course) throw new AppError("Course not found", 404);

    return course;
};

// ── Get instructor's own courses ──────────────────────────────────────────────

export const getInstructorCourses = async (instructorId, query = {}) => {
    const { status, page = 1, limit = 10 } = query;

    const filter = { instructor: instructorId };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Course.countDocuments(filter);

    const courses = await Course.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select("title slug thumbnail status price studentsEnrolled averageRating createdAt");

    return {
        courses,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
        },
    };
};

// ── Get single course by ID (instructor/admin — any status) ──────────────────

export const getCourseById = async (courseId, user) => {
    const course = await Course.findById(courseId)
        .populate("instructor", "name avatar email");

    if (!course) throw new AppError("Course not found", 404);

    // Students can only see published courses
    if (user.role === "student" && course.status !== "published") {
        throw new AppError("Course not found", 404);
    }

    return course;
};

// ── Update course ─────────────────────────────────────────────────────────────

export const updateCourse = async (courseId, user, data) => {
    const course = await Course.findById(courseId);
    if (!course) throw new AppError("Course not found", 404);

    assertOwnerOrAdmin(course, user);

    // Prevent manually setting slug or instructor via update
    delete data.slug;
    delete data.instructor;
    delete data.studentsEnrolled;
    delete data.averageRating;

    // Apply updates
    Object.assign(course, data);
    await course.save(); // triggers pre-save hooks (slug, status sync)

    return course;
};

// ── Publish / Unpublish ───────────────────────────────────────────────────────

export const togglePublish = async (courseId, user) => {
    const course = await Course.findById(courseId);
    if (!course) throw new AppError("Course not found", 404);

    assertOwnerOrAdmin(course, user);

    // Guard: must have minimum content before publishing
    if (!course.isPublished) {
        const missing = [];
        if (!course.title) missing.push("title");
        if (!course.description) missing.push("description");
        if (!course.category) missing.push("category");
        if (course.learningOutcomes.length < 1) missing.push("at least 1 learning outcome");
        if (course.requirements.length < 1) missing.push("at least 1 requirement");

        if (missing.length > 0) {
            throw new AppError(
                `Cannot publish. Missing: ${missing.join(", ")}`,
                400
            );
        }
    }

    course.isPublished = !course.isPublished;
    course.status = course.isPublished ? "published" : "draft";
    await course.save();

    return course;
};

// ── Delete course ─────────────────────────────────────────────────────────────

export const deleteCourse = async (courseId, user) => {
    const course = await Course.findById(courseId);
    if (!course) throw new AppError("Course not found", 404);

    assertOwnerOrAdmin(course, user);

    // Prevent deleting a course with enrolled students
    if (course.studentsEnrolled > 0) {
        throw new AppError(
            "Cannot delete a course that has enrolled students. Unpublish it instead.",
            400
        );
    }

    await course.deleteOne();
};