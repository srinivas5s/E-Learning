import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
    {
        // ── Core ──────────────────────────────────────────────────────────────────
        title: {
            type: String,
            required: [true, "Module title is required"],
            trim: true,
            minlength: [3, "Title must be at least 3 characters"],
            maxlength: [150, "Title cannot exceed 150 characters"],
        },

        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"],
            default: "",
        },

        // ── Relations ─────────────────────────────────────────────────────────────
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course reference is required"],
            index: true,
        },

        // ── Ordering ──────────────────────────────────────────────────────────────
        // Position of this module within the course (1-based)
        order: {
            type: Number,
            default: 0,
            min: 0,
        },

        // ── Publishing ────────────────────────────────────────────────────────────
        isPublished: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform(_, ret) {
                delete ret.__v;
                return ret;
            },
        },
        toObject: { virtuals: true },
    }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
moduleSchema.index({ course: 1, order: 1 });   // fetch modules for a course in order
moduleSchema.index({ course: 1, isPublished: 1 }); // filter published modules

// ── Virtual: lessons count ────────────────────────────────────────────────────
// Populated via aggregation where needed — not stored to avoid stale data
moduleSchema.virtual("lessons", {
    ref: "Lesson",
    localField: "_id",
    foreignField: "module",
    options: { sort: { order: 1 } },
});

export const Module = mongoose.model("Module", moduleSchema);