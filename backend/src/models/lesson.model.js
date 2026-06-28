import mongoose from "mongoose";
import slugify from "slugify";

const attachmentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        url: { type: String, required: true },
        publicId: { type: String, default: "" }, // Cloudinary public ID
        size: { type: Number, default: 0 }, // bytes
        type: { type: String, default: "" }, // mime type e.g. "application/pdf"
    },
    { _id: true }
);

const videoSchema = new mongoose.Schema(
    {
        url: { type: String, default: "" }, // Cloudinary/stream URL
        publicId: { type: String, default: "" }, // Cloudinary public ID
        duration: { type: Number, default: 0 }, // seconds
        thumbnail: { type: String, default: "" }, // auto-generated thumbnail URL
    },
    { _id: false }
);

const lessonSchema = new mongoose.Schema(
    {
        // ── Core ────────────────────────────────────────────────────────────────
        title: {
            type: String,
            required: [true, "Lesson title is required"],
            trim: true,
            minlength: [3, "Title must be at least 3 characters"],
            maxlength: [150, "Title cannot exceed 150 characters"],
        },

        slug: {
            type: String,
            lowercase: true,
            index: true,
        },

        description: {
            type: String,
            trim: true,
            maxlength: [2000, "Description cannot exceed 2000 characters"],
            default: "",
        },

        // ── Relations ────────────────────────────────────────────────────────────
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course reference is required"],
            index: true,
        },

        module: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Module",
            required: [true, "Module reference is required"],
            index: true,
        },

        // ── Ordering ─────────────────────────────────────────────────────────────
        // Position within the parent module (1-based)
        order: {
            type: Number,
            default: 0,
            min: 0,
        },

        // ── Content ──────────────────────────────────────────────────────────────
        video: {
            type: videoSchema,
            default: () => ({}),
        },

        attachments: {
            type: [attachmentSchema],
            default: [],
        },

        // ── Access control ────────────────────────────────────────────────────────
        // Free preview — visible to non-enrolled users
        isPreview: {
            type: Boolean,
            default: false,
        },

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
lessonSchema.index({ module: 1, order: 1 });       // fetch lessons in a module in order
lessonSchema.index({ course: 1, order: 1 });       // fetch all lessons in a course
lessonSchema.index({ module: 1, isPublished: 1 }); // public — only published lessons
lessonSchema.index({ slug: 1, course: 1 }, { unique: true, sparse: true }); // slug unique per course

// ── Virtual: video duration formatted ────────────────────────────────────────
lessonSchema.virtual("videoDurationFormatted").get(function () {
    const secs = this.video?.duration || 0;
    if (!secs) return "0:00";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
});

// ── Pre-save: auto-generate slug from title ───────────────────────────────────
lessonSchema.pre("save", async function (next) {
    if (!this.isModified("title")) return next();

    const baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    // Slug must be unique within the same course
    while (
        await mongoose.model("Lesson").exists({
            slug,
            course: this.course,
            _id: { $ne: this._id },
        })
    ) {
        slug = `${baseSlug}-${count}`;
        count++;
    }

    this.slug = slug;
    next();
});

export const Lesson = mongoose.model("Lesson", lessonSchema);