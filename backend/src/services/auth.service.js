import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import AppError from "../utils/AppError.js";

export const registerUser = async ({ name, email, password, role }) => {
    // 1. Check if email already taken
    const existing = await User.findOne({ email });
    if (existing) throw new AppError("Email already registered", 409);

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Create user
    const user = await User.create({ name, email, password: hashedPassword, role });

    return user;
};


export const loginUser = async ({ email, password }) => {
    // 1. Find user (include password for comparison)
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new AppError("Invalid email or password", 401);

    // 2. Check account status
    if (user.isBanned) throw new AppError("Your account has been banned", 403);
    if (!user.isActive) throw new AppError("Your account is deactivated", 403);

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError("Invalid email or password", 401);

    // 4. Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    return { user, accessToken, refreshToken };
};


export const getProfile = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    return user;
};


export const updateProfile = async (userId, { name, bio }) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { name, bio },
        { new: true, runValidators: true }
    );
    if (!user) throw new AppError("User not found", 404);
    return user;
};


export const changePassword = async (userId, { currentPassword, newPassword }) => {
    // 1. Get user with password
    const user = await User.findById(userId).select("+password");
    if (!user) throw new AppError("User not found", 404);

    // 2. Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new AppError("Current password is incorrect", 401);

    // 3. Hash and save new password
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
};