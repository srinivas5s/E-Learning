import mongoose from "mongoose";
import slugify from "slugify";

const courseSchema = new mongoose.Schema(
  {
    // ── Core ───────────────────────────────────────────────────────────────
    title: {
      type:      String,
      required:  [true, "Course title is required"],
      trim:      true,
      minlength: [5,   "Title must be at least 5 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },

    slug: {
      type:   String,
      unique: true,
      lowercase: true,
      index: true,
    },

    subtitle: {
      type:      String,
      trim:      true,
      maxlength: [300, "Subtitle cannot exceed 300 characters"],
    },

    description: {
      type:      String,
      required:  [true, "Course description is required"],
      minlength: [20, "Description must be at least 20 characters"],
    },

    // ── Media ──────────────────────────────────────────────────────────────
    thumbnail: {
      url:       { type: String, default: "" },
      publicId:  { type: String, default: "" },
    },

    // ── Categorization ─────────────────────────────────────────────────────
    category: {
      type:     String,
      required: [true, "Category is required"],
      enum: [
        "Web Development",
        "Mobile Development",
        "Data Science",
        "Machine Learning",
        "UI/UX Design",
        "DevOps",
        "Cybersecurity",
        "Business",
        "Marketing",
        "Photography",
        "Music",
        "Other",
      ],
    },

    level: {
      type:     String,
      required: [true, "Level is required"],
      enum:     ["beginner", "intermediate", "advanced"],
      default:  "beginner",
    },

    language: {
      type:    String,
      default: "English",
      trim:    true,
    },

    // ── Pricing ────────────────────────────────────────────────────────────
    price: {
      type:    Number,
      required: [true, "Price is required"],
      min:     [0, "Price cannot be negative"],
      default: 0,
    },

    discountPrice: {
      type:    Number,
      min:     [0, "Discount price cannot be negative"],
      default: 0,
      validate: {
        validator(val) {
          // discountPrice must be less than price (skip if price is 0)
          return this.price === 0 || val < this.price;
        },
        message: "Discount price must be less than the original price",
      },
    },

    // ── Content ────────────────────────────────────────────────────────────
    requirements: {
      type:    [String],
      default: [],
    },

    learningOutcomes: {
      type:    [String],
      default: [],
    },

    duration: {
      type:    Number, // total minutes
      default: 0,
      min:     0,
    },

    // ── Relations ──────────────────────────────────────────────────────────
    instructor: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: [true, "Instructor is required"],
      index:    true,
    },

    studentsEnrolled: {
      type:    Number,
      default: 0,
      min:     0,
    },

    // ── Ratings ────────────────────────────────────────────────────────────
    averageRating: {
      type:    Number,
      default: 0,
      min:     [0, "Rating cannot be below 0"],
      max:     [5, "Rating cannot exceed 5"],
      set:     (val) => Math.round(val * 10) / 10, // round to 1 decimal
    },

    totalRatings: {
      type:    Number,
      default: 0,
    },

    // ── Publishing ─────────────────────────────────────────────────────────
    isPublished: {
      type:    Boolean,
      default: false,
    },

    status: {
      type:    String,
      enum:    ["draft", "published"],
      default: "draft",
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
courseSchema.index({ title: "text", description: "text" }); // full-text search
courseSchema.index({ category: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ instructor: 1, status: 1 });
courseSchema.index({ price: 1 });
courseSchema.index({ averageRating: -1 });
courseSchema.index({ createdAt: -1 });

// ── Virtuals ──────────────────────────────────────────────────────────────────
// Effective price — what students actually pay
courseSchema.virtual("effectivePrice").get(function () {
  return this.discountPrice > 0 ? this.discountPrice : this.price;
});

// Discount percentage
courseSchema.virtual("discountPercent").get(function () {
  if (!this.discountPrice || this.price === 0) return 0;
  return Math.round((1 - this.discountPrice / this.price) * 100);
});

// ── Pre-save: auto-generate slug from title ────────────────────────────────────
courseSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();

  let baseSlug = slugify(this.title, { lower: true, strict: true });
  let slug     = baseSlug;
  let count    = 1;

  // Ensure slug is unique — append number if collision
  while (await mongoose.model("Course").exists({ slug, _id: { $ne: this._id } })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  this.slug = slug;
  next();
});

// ── Pre-save: sync isPublished with status ─────────────────────────────────────
courseSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.isPublished = this.status === "published";
  }
  if (this.isModified("isPublished")) {
    this.status = this.isPublished ? "published" : "draft";
  }
  next();
});

export const Course = mongoose.model("Course", courseSchema);