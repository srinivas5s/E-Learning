import Joi from "joi";

export const createModuleSchema = Joi.object({
    title: Joi.string().trim().min(3).max(150).required()
        .messages({
            "string.min": "Title must be at least 3 characters",
            "string.max": "Title cannot exceed 150 characters",
            "any.required": "Module title is required",
        }),

    description: Joi.string().trim().max(500).optional().allow("")
        .messages({
            "string.max": "Description cannot exceed 500 characters",
        }),
});

export const updateModuleSchema = Joi.object({
    title: Joi.string().trim().min(3).max(150)
        .messages({
            "string.min": "Title must be at least 3 characters",
            "string.max": "Title cannot exceed 150 characters",
        }),

    description: Joi.string().trim().max(500).allow(""),

    isPublished: Joi.boolean(),

}).min(1).messages({
    "object.min": "At least one field is required to update",
});

// Accepts an ordered array of module IDs
// e.g. { modules: ["id1", "id2", "id3"] }
export const reorderModulesSchema = Joi.object({
    modules: Joi.array()
        .items(Joi.string().hex().length(24).required())
        .min(1)
        .required()
        .messages({
            "array.min": "At least one module ID is required",
            "any.required": "modules array is required",
            "string.hex": "Each module ID must be a valid ObjectId",
            "string.length": "Each module ID must be 24 characters",
        }),
});