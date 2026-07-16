import { useNavigate } from "react-router-dom";
import { useCreateCourse } from "../../services/useCourse.js";
import CourseForm from "../../components/instructor/CourseForm.jsx";

// ── Icons ─────────────────────────────────────────────────────────────────────
const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const CreateCourse = () => {
  const navigate = useNavigate();
  const { loading, create } = useCreateCourse();

  const goToManageCourses = () => navigate("/instructor/manage-courses");

  const handleSubmit = async (formData) => {
    const course = await create(formData);
    if (course) goToManageCourses();
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={goToManageCourses}
            className="flex items-center gap-1.5 text-sm mb-4 transition-colors duration-150"
            style={{ color: "var(--color-text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
          >
            <BackIcon /> Back to My Courses
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

        <CourseForm
          isEdit={false}
          onSubmit={handleSubmit}
          onCancel={goToManageCourses}
          saving={loading}
        />

      </div>
    </div>
  );
};

export default CreateCourse;