import AppError from "../utils/AppError.js";

/**
 * Factory that returns an Express middleware validating req.body against a Joi schema.
 * Usage: validate(createCourseSchema)
 */
const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false, // collect ALL errors, not just first
        stripUnknown: true,  // remove fields not in schema
        convert: true,  // coerce types (string "5" → number 5)
    });

    if (error) {
        const message = error.details
            .map((d) => d.message.replace(/['"]/g, ""))
            .join(", ");
        return next(new AppError(message, 422));
    }

    req.body = value; // use cleaned + coerced values
    next();
};

export default validate;