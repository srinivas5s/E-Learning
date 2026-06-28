import Joi from "joi";

// ── Shared sub-schemas ────────────────────────────────────────────────────────

const videoSchema = Joi.object({
    url: Joi.string().uri().allow("").optional(),
    publicId: Joi.string().allow("").optional(),
    duration: Joi.number().min(0).optional(),
    thumbnail: Joi.string().uri().allow("").optional(),
});

const attachmentSchema = Joi.object({
    name: Joi.string().trim().max(200).required()
        .messages({ "any.required": "Attachment name is required" }),
    url: Joi.string().uri().required()
        .messages({ "any.required": "Attachment URL is required" }),
    publicId: Joi.string().allow("").optional(),
    size: Joi.number().min(0).optional(),
    type: Joi.string().allow("").optional(),
});

// ── Schemas ───────────────────────────────────────────────────────────────────

export const createLessonSchema = Joi.object({
    title: Joi.string().trim().min(3).max(150).required()
        .messages({
            "string.min": "Title must be at least 3 characters",
            "string.max": "Title cannot exceed 150 characters",
            "any.required": "Lesson title is required",
        }),

    description: Joi.string().trim().max(2000).allow("").optional()
        .messages({
            "string.max": "Description cannot exceed 2000 characters",
        }),

    // moduleId is taken from the URL param, not the body
    // courseId is derived from the module in the service

    video: videoSchema.optional(),
    attachments: Joi.array().items(attachmentSchema).default([]),

    isPreview: Joi.boolean().default(false),
    order: Joi.number().min(0).optional(),
});

export const updateLessonSchema = Joi.object({
    title: Joi.string().trim().min(3).max(150),
    description: Joi.string().trim().max(2000).allow(""),
    video: videoSchema,
    attachments: Joi.array().items(attachmentSchema),
    isPreview: Joi.boolean(),
    isPublished: Joi.boolean(),

}).min(1).messages({
    "object.min": "At least one field is required to update",
});

// Ordered array of lesson IDs within a module
// e.g. { lessons: ["id1", "id2", "id3"] }
export const reorderLessonsSchema = Joi.object({
    lessons: Joi.array()
        .items(Joi.string().hex().length(24).required())
        .min(1)
        .required()
        .messages({
            "array.min": "At least one lesson ID is required",
            "any.required": "lessons array is required",
            "string.hex": "Each lesson ID must be a valid ObjectId",
            "string.length": "Each lesson ID must be 24 characters",
        }),
});