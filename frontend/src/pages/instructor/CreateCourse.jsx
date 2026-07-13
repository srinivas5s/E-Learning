import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateCourse } from "../../services/useCourse.js";
import ArrayInput from "../../components/instructor/ArrayInput.jsx";
import { CATEGORIES, LEVELS, LANGUAGES } from "../../constants/courseConstants.js";

// ── Reusable section card ─────────────────────────────────────────────────────
const Section = ({ title, subtitle, children }) => (
  <div
    className="rounded-2xl p-6 sm:p-8"
    style={{
      backgroundColor: "var(--color-bg-card)",
      border: "1px solid var(--color-border)",
    }}
  >
    <div className="mb-6">
      <h2
        className="text-base font-bold"
        style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
          {subtitle}
        </p>
      )}
    </div>
    <div className="space-y-5">{children}</div>
  </div>
);

// ── Field wrapper ─────────────────────────────────────────────────────────────
const Field = ({ label, error, hint, children }) => (
  <div>
    {label && <label className="form-label">{label}</label>}
    {children}
    {hint && !error && (
      <p className="text-xs mt-1.5" style={{ color: "var(--color-text-muted)" }}>{hint}</p>
    )}
    {error && <p className="error-msg">{error}</p>}
  </div>
);

// ── Error border helper ───────────────────────────────────────────────────────
const errStyle = (hasError) => hasError ? {
  borderColor: "var(--color-error)",
  boxShadow: "0 0 0 3px rgba(248,113,113,0.12)",
} : {};

// ── Main Component ────────────────────────────────────────────────────────────
const CreateCourse = () => {
  const navigate = useNavigate();
  const { loading, create } = useCreateCourse();

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "",
    level: "beginner",
    language: "English",
    price: 0,
    discountPrice: 0,
    requirements: [],
    learningOutcomes: [],
    duration: 0,
  });

  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    set(name, type === "number" ? Number(value) : value);
  };

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    else if (form.title.length < 5) e.title = "Min 5 characters";
    if (!form.description.trim()) e.description = "Description is required";
    else if (form.description.length < 20) e.description = "Min 20 characters";
    if (!form.category) e.category = "Please select a category";
    if (form.price < 0) e.price = "Price cannot be negative";
    if (form.discountPrice > 0 && form.discountPrice >= form.price)
      e.discountPrice = "Must be less than original price";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      document.querySelector(".error-msg")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const course = await create(form);
    if (course) navigate("/instructor/manage-courses");
  };

  const discount = form.price > 0 && form.discountPrice > 0 && form.discountPrice < form.price;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/instructor/manage-courses")}
            className="flex items-center gap-1.5 text-sm mb-4 transition-colors duration-150"
            style={{ color: "var(--color-text-muted)" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-text)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to My Courses
          </button>

          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}
          >
            Create New Course
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
            Fill in the details below. Saved as draft — publish anytime from Manage Courses.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">

          {/* ── 1. Basic Info ──────────────────────────────────────────── */}
          <Section title="Basic Information" subtitle="Core details students see first">

            <Field label="Course Title *" error={errors.title}
              hint="A clear, specific title performs better in search">
              <div className="relative">
                <input
                  name="title" type="text"
                  className="input-field pr-16"
                  placeholder="e.g. Complete React Developer Course"
                  value={form.title}
                  onChange={handleChange}
                  maxLength={150}
                  style={errStyle(errors.title)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: form.title.length > 130 ? "var(--color-error)" : "var(--color-text-muted)" }}>
                  {form.title.length}/150
                </span>
              </div>
            </Field>

            <Field label="Subtitle" hint="Short tagline shown under the title">
              <input
                name="subtitle" type="text"
                className="input-field"
                placeholder="e.g. Build modern web apps with React 18, Hooks & Redux"
                value={form.subtitle}
                onChange={handleChange}
                maxLength={300}
              />
            </Field>

            <Field label="Description *" error={errors.description}
              hint="Minimum 20 characters. What will students learn?">
              <div className="relative">
                <textarea
                  name="description"
                  rows={5}
                  className="input-field resize-none"
                  placeholder="Describe your course — what it covers, who it's for, what makes it unique..."
                  value={form.description}
                  onChange={handleChange}
                  style={errStyle(errors.description)}
                />
                <span className="absolute bottom-2.5 right-3 text-xs"
                  style={{ color: "var(--color-text-muted)" }}>
                  {form.description.length} chars
                </span>
              </div>
            </Field>

          </Section>

          {/* ── 2. Categorization ─────────────────────────────────────── */}
          <Section title="Categorization" subtitle="Help students find your course">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <Field label="Category *" error={errors.category}>
                <select name="category" className="input-field"
                  value={form.category} onChange={handleChange}
                  style={errStyle(errors.category)}>
                  <option value="" disabled>Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>

              <Field label="Level">
                <select name="level" className="input-field"
                  value={form.level} onChange={handleChange}>
                  {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </Field>

              <Field label="Language">
                <select name="language" className="input-field"
                  value={form.language} onChange={handleChange}>
                  {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>

            </div>
          </Section>

          {/* ── 3. Pricing ────────────────────────────────────────────── */}
          <Section title="Pricing" subtitle="Set price to 0 for a free course">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <Field label="Original Price (₹)" error={errors.price}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                    style={{ color: "var(--color-text-muted)" }}>₹</span>
                  <input name="price" type="number" min="0"
                    className="input-field pl-7"
                    placeholder="0" value={form.price}
                    onChange={handleChange}
                    style={errStyle(errors.price)} />
                </div>
              </Field>

              <Field label="Discount Price (₹)" error={errors.discountPrice}
                hint="Must be less than original price">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                    style={{ color: "var(--color-text-muted)" }}>₹</span>
                  <input name="discountPrice" type="number" min="0"
                    className="input-field pl-7"
                    placeholder="0" value={form.discountPrice}
                    onChange={handleChange}
                    style={errStyle(errors.discountPrice)} />
                </div>
              </Field>

            </div>

            {/* Discount preview */}
            {discount && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm"
                style={{ backgroundColor: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <span style={{ color: "#10b981" }}>✓</span>
                <span style={{ color: "#10b981" }}>
                  Students save ₹{(form.price - form.discountPrice).toLocaleString()} —{" "}
                  {Math.round((1 - form.discountPrice / form.price) * 100)}% off
                </span>
              </div>
            )}
          </Section>

          {/* ── 4. Thumbnail ──────────────────────────────────────────── */}
          <Section title="Course Thumbnail" subtitle="Cloudinary upload — Phase 3">
            <div
              className="flex flex-col items-center justify-center gap-3 py-10
                         rounded-xl border-2 border-dashed"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: "rgba(99,102,241,0.1)" }}>
                🖼️
              </div>
              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                  Thumbnail upload coming in Phase 3
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                  Cloudinary integration will be added soon
                </p>
              </div>
            </div>
          </Section>

          {/* ── 5. Course Content ─────────────────────────────────────── */}
          <Section title="Course Content" subtitle="Help students know what to expect">

            <Field label="Total Duration (minutes)" hint="Approximate total video duration">
              <div className="relative">
                <input name="duration" type="number" min="0"
                  className="input-field pr-20"
                  placeholder="e.g. 300"
                  value={form.duration} onChange={handleChange} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: "var(--color-text-muted)" }}>
                  {form.duration > 0
                    ? `${Math.floor(form.duration / 60)}h ${form.duration % 60}m`
                    : "mins"}
                </span>
              </div>
            </Field>

            <ArrayInput
              label="What Students Will Learn *"
              placeholder="e.g. Build REST APIs with Node.js"
              values={form.learningOutcomes}
              onChange={(val) => set("learningOutcomes", val)}
            />

            <ArrayInput
              label="Requirements / Prerequisites *"
              placeholder="e.g. Basic knowledge of JavaScript"
              values={form.requirements}
              onChange={(val) => set("requirements", val)}
            />

          </Section>

          {/* ── Actions ───────────────────────────────────────────────── */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between
                       gap-3 px-6 py-4 rounded-2xl"
            style={{
              backgroundColor: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p className="text-xs text-center sm:text-left"
              style={{ color: "var(--color-text-muted)" }}>
              Course saves as <strong style={{ color: "var(--color-text)" }}>Draft</strong>.
              Publish it from Manage Courses whenever you're ready.
            </p>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate("/instructor/manage-courses")}
                className="flex-1 sm:flex-none btn-ghost px-5 py-2.5 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none btn-primary px-6 py-2.5 text-sm"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white
                                     rounded-full animate-spin" />
                    Creating…
                  </span>
                ) : "Save as Draft"}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateCourse;