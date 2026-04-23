import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

export const protect = catchAsync(async (req, res, next) => {
    // 1. Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new AppError("You are not logged in", 401));
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (err) {
        return next(new AppError("Invalid or expired token", 401));
    }

    // 3. Check user still exists
    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError("User no longer exists", 401));

    // 4. Check account status
    if (user.isBanned) return next(new AppError("Your account has been banned", 403));
    if (!user.isActive) return next(new AppError("Your account is deactivated", 403));

    req.user = user;
    next();
});

// Usage: authorize("admin") or authorize("admin", "instructor")
export const authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new AppError("You do not have permission", 403));
    }
    next();
};