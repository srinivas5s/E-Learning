import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
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

        // Set only after successful payment verification creates the Enrollment
        enrollment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Enrollment",
            default: null,
            index: true,
        },

        // ── Razorpay identifiers ─────────────────────────────────────────────────
        razorpayOrderId: {
            type: String,
            required: [true, "Razorpay order ID is required"],
        },

        // Populated after payment succeeds
        razorpayPaymentId: {
            type: String,
        },

        // Populated after signature verification
        razorpaySignature: {
            type: String,
        },

        // ── Amount ───────────────────────────────────────────────────────────────
        // Smallest currency unit (e.g. paise for INR) — ₹999 is stored as 99900.
        // Always derived server-side from Course price, never trusted from the client.
        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: [0, "Amount cannot be negative"],
        },

        currency: {
            type: String,
            required: true,
            default: "INR",
        },

        // ── Status ───────────────────────────────────────────────────────────────
        status: {
            type: String,
            enum: ["created", "pending", "paid", "failed", "refunded"],
            required: true,
            default: "created",
        },

        // Populated after successful payment — e.g. "card", "upi", "netbanking"
        paymentMethod: {
            type: String,
            default: null,
        },

        // Minimal failure context — Razorpay's short error description only,
        // never raw gateway response payloads or sensitive card/bank details
        failureReason: {
            type: String,
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
// unique + sparse: razorpayPaymentId/razorpaySignature are absent on many
// documents (before payment succeeds) — sparse excludes those from the
// uniqueness constraint so multiple "not yet paid" docs can coexist.
paymentSchema.index({ razorpayOrderId: 1 }, { unique: true, sparse: true });
paymentSchema.index({ razorpayPaymentId: 1 }, { unique: true, sparse: true });

export const Payment = mongoose.model("Payment", paymentSchema);