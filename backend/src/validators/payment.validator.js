import Joi from "joi";

const objectId = Joi.string().hex().length(24).messages({
    "string.hex": "Must be a valid ObjectId",
    "string.length": "Must be a valid ObjectId",
});

export const createOrderSchema = Joi.object({
    courseId: objectId.required()
        .messages({ "any.required": "Course ID is required" }),
});