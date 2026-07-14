import { useParams, useNavigate } from "react-router-dom";
import { useModules } from "../../services/useModules.js";
import ModuleForm from "../../components/instructor/ModuleForm.jsx";

const BackIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
);

const CreateModule = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { saving, createModule } = useModules(courseId);

    const handleSubmit = async (data) => {
        const module = await createModule(data);
        if (module) navigate(`/instructor/courses/${courseId}/content`);
    };

    const handleCancel = () =>
        navigate(`/instructor/courses/${courseId}/content`);

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6"
            style={{ backgroundColor: "var(--color-bg)" }}>
            <div className="max-w-2xl mx-auto">

                <div className="mb-8">
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-1.5 text-sm mb-4 transition-colors duration-150"
                        style={{ color: "var(--color-text-muted)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
                    >
                        <BackIcon /> Back to Course Content
                    </button>

                    <h1
                        className="text-2xl font-bold"
                        style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}
                    >
                        Add New Module
                    </h1>
                    <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                        Modules are sections of your course (e.g. "Week 1", "Introduction").
                    </p>
                </div>

                <div className="rounded-2xl p-6"
                    style={{
                        backgroundColor: "var(--color-bg-card)",
                        border: "1px solid var(--color-border)",
                    }}>
                    <ModuleForm
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        saving={saving}
                    />
                </div>

            </div>
        </div>
    );
};

export default CreateModule;