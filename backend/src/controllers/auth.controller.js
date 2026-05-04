import catchAsync from "../utils/catchAsync.js";
import * as authService from "../services/auth.service.js";

export const register = catchAsync(async (req, res) => {
    const { name, email, password, role } = req.body;
     const { user, accessToken, refreshToken } = await authService.registerUser({ name, email, password, role });

     res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
        status: "success",
        message: "Account created successfully",
        data: { user, accessToken },
    });
});

export const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.loginUser({ email, password });

    // Set refresh token in httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
        status: "success",
        message: "Logged in successfully",
        data: { user, accessToken },
    });
});

export const logout = catchAsync(async (req, res) => {
    res.clearCookie("refreshToken");
    res.status(200).json({
        status: "success",
        message: "Logged out successfully",
    });
});

export const getMe = catchAsync(async (req, res) => {
    const user = await authService.getProfile(req.user._id);
    res.status(200).json({
        status: "success",
        data: { user },
    });
});

export const updateMe = catchAsync(async (req, res) => {
    const { name, bio } = req.body;
    const user = await authService.updateProfile(req.user._id, { name, bio });
    res.status(200).json({
        status: "success",
        data: { user },
    });
});

export const changePassword = catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user._id, { currentPassword, newPassword });
    res.status(200).json({
        status: "success",
        message: "Password changed successfully",
    });
});