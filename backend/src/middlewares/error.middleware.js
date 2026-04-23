const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        err.message = `${field} already exists`;
        err.statusCode = 409;
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        err.message = Object.values(err.errors).map((e) => e.message).join(", ");
        err.statusCode = 422;
    }

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        err.message = `Invalid ${err.path}: ${err.value}`;
        err.statusCode = 400;
    }

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};

export default errorHandler;