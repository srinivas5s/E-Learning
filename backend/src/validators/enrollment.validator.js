import Joi from "joi";

// ── Shared ────────────────────────────────────────────────────────────────────

const objectId = Joi.string().hex().length(24).messages({
    "string.hex": "Must be a valid ObjectId",
    "string.length": "Must be a valid ObjectId",
});

// ── Schemas ───────────────────────────────────────────────────────────────────

export const createEnrollmentSchema = Joi.object({
    courseId: objectId.required()
        .messages({ "any.required": "Course ID is required" }),
});

export const courseParamSchema = Joi.object({
    courseId: objectId.required()
        .messages({ "any.required": "Course ID is required" }),
});

export const lessonParamSchema = Joi.object({
    courseId: objectId.required()
        .messages({ "any.required": "Course ID is required" }),
    lessonId: objectId.required()
        .messages({ "any.required": "Lesson ID is required" }),
});

export const updateCurrentLessonSchema = Joi.object({
    lessonId: objectId.required()
        .messages({ "any.required": "Lesson ID is required" }),
});