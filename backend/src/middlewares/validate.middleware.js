import AppError from "../utils/AppError.js";


const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false, 
        stripUnknown: true,  
        convert: true,  
    });

    if (error) {
        const message = error.details
            .map((d) => d.message.replace(/['"]/g, ""))
            .join(", ");
        return next(new AppError(message, 422));
    }

    req.body = value; 
    next();
};

export default validate;