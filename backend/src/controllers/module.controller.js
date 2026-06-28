import catchAsync from "../utils/catchAsync.js";
import * as moduleService from "../services/module.service.js";

// ── Create module ─────────────────────────────────────────────────────────────
export const createModule = catchAsync(async (req, res) => {
    const module = await moduleService.createModule(
        req.params.courseId,
        req.user,
        req.body
    );

    res.status(201).json({
        status: "success",
        message: "Module created successfully",
        data: { module },
    });
});

// ── Get modules by course ─────────────────────────────────────────────────────
export const getModulesByCourse = catchAsync(async (req, res) => {
    const modules = await moduleService.getModulesByCourse(
        req.params.courseId,
        req.user  // may be undefined for public access
    );

    res.status(200).json({
        status: "success",
        data: { modules, total: modules.length },
    });
});

// ── Update module ─────────────────────────────────────────────────────────────
export const updateModule = catchAsync(async (req, res) => {
    const module = await moduleService.updateModule(
        req.params.courseId,
        req.params.moduleId,
        req.user,
        req.body
    );

    res.status(200).json({
        status: "success",
        message: "Module updated successfully",
        data: { module },
    });
});

// ── Delete module ─────────────────────────────────────────────────────────────
export const deleteModule = catchAsync(async (req, res) => {
    await moduleService.deleteModule(
        req.params.courseId,
        req.params.moduleId,
        req.user
    );

    res.status(200).json({
        status: "success",
        message: "Module and its lessons deleted successfully",
        data: null,
    });
});

// ── Reorder modules ───────────────────────────────────────────────────────────
export const reorderModules = catchAsync(async (req, res) => {
    const modules = await moduleService.reorderModules(
        req.params.courseId,
        req.user,
        req.body.modules  // array of ordered module IDs
    );

    res.status(200).json({
        status: "success",
        message: "Modules reordered successfully",
        data: { modules },
    });
});