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