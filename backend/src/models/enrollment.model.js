import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
    {
        // ── Relations ────────────────────────────────────────────────────────────
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Student reference is required"],
            index: true,
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course reference is required"],
            index: true,
        },

        enrollmentType: {
            type: String,
            enum: ["free", "paid"],
            required: [true, "Enrollment type is required"],
        },

        status: {
            type: String,
            enum: ["active", "cancelled", "completed"],
            default: "active",
        },

        paymentStatus: {
            type: String,
            enum: ["free", "pending", "paid", "refunded"],
            default: "free",
        },

        pricePaid: {
            type: Number,
            default: 0,
            min: 0,
        },

        // ── Progress tracking ─────────────────────────────────────────────────────────
        completedLessons: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Lesson",
            default: [],
        },

        currentLesson: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson",
            default: null,
        },

        progressPercent: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        lastAccessedAt: {
            type: Date,
            default: null,
        },

        // ── Timestamps ────────────────────────────────────────────────────────────
        enrolledAt: {
            type: Date,
            default: Date.now,
        },

        completedAt: {
            type: Date,
            default: null,
        },

        cancelledAt: {
            type: Date,
            default: null,
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
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ course: 1, status: 1 });
enrollmentSchema.index({ student: 1, status: 1 });

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);