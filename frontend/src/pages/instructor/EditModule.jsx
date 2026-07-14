import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { moduleApi } from "../../api/content.api.js";
import { useModules } from "../../services/useModules.js";
import ModuleForm from "../../components/instructor/ModuleForm.jsx";

const BackIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
);

const Skeleton = () => (
    <div className="rounded-2xl p-6 animate-pulse"
        style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
        <div className="h-4 rounded w-1/3 mb-6" style={{ backgroundColor: "var(--color-border)" }} />
        <div className="h-10 rounded mb-4" style={{ backgroundColor: "var(--color-border)" }} />
        <div className="h-24 rounded mb-4" style={{ backgroundColor: "var(--color-border)" }} />
        <div className="flex justify-end gap-3">
            <div className="h-9 w-20 rounded-lg" style={{ backgroundColor: "var(--color-border)" }} />
            <div className="h-9 w-28 rounded-lg" style={{ backgroundColor: "var(--color-border)" }} />
        </div>
    </div>
);

const EditModule = () => {
    const { courseId, moduleId } = useParams();
    const navigate = useNavigate();

    const [module, setModule] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [fetchErr, setFetchErr] = useState(null);

    const { saving, updateModule } = useModules(courseId);

    // Fetch module data to pre-fill form
    useEffect(() => {
        moduleApi.getAll(courseId)
            .then((res) => {
                const found = (res.data.data.modules || []).find((m) => m._id === moduleId);
                if (found) setModule(found);
                else setFetchErr("Module not found");
            })
            .catch((err) => setFetchErr(err.response?.data?.message || "Failed to load module"))
            .finally(() => setFetching(false));
    }, [courseId, moduleId]);

    const handleSubmit = async (data) => {
        const updated = await updateModule(moduleId, data);
        if (updated) navigate(`/instructor/courses/${courseId}/content`);
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
                        Edit Module
                    </h1>
                    {module && (
                        <p className="text-sm mt-1 truncate" style={{ color: "var(--color-text-muted)" }}>
                            {module.title}
                        </p>
                    )}
                </div>

                {fetching && <Skeleton />}

                {fetchErr && (
                    <div
                        className="px-4 py-3 rounded-xl text-sm"
                        style={{
                            backgroundColor: "rgba(248,113,113,0.08)",
                            border: "1px solid rgba(248,113,113,0.2)",
                            color: "var(--color-error)",
                        }}
                    >
                        ⚠️ {fetchErr}
                    </div>
                )}

                {!fetching && module && (
                    <div className="rounded-2xl p-6"
                        style={{
                            backgroundColor: "var(--color-bg-card)",
                            border: "1px solid var(--color-border)",
                        }}>
                        <ModuleForm
                            initial={module}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            saving={saving}
                        />
                    </div>
                )}

            </div>
        </div>
    );
};

export default EditModule;