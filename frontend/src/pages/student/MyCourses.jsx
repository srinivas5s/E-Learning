import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import enrollmentApi from "../../api/enrollment.api.js";
import EnrolledCourseCard from "../../components/student/EnrolledCourseCard.jsx";

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden animate-pulse"
                style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
                <div className="h-40" style={{ backgroundColor: "var(--color-border)" }} />
                <div className="p-4 space-y-3">
                    <div className="h-4 rounded w-3/4" style={{ backgroundColor: "var(--color-border)" }} />
                    <div className="h-3 rounded w-1/2" style={{ backgroundColor: "var(--color-border)" }} />
                    <div className="h-9 rounded" style={{ backgroundColor: "var(--color-border)" }} />
                </div>
            </div>
        ))}
    </div>
);

// ── Empty state ───────────────────────────────────────────────────────────────
const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <span className="text-6xl mb-4">🎓</span>
        <h2 className="text-lg font-bold mb-2"
            style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}>
            You haven't enrolled in any courses yet
        </h2>
        <p className="text-sm mb-6 max-w-sm" style={{ color: "var(--color-text-muted)" }}>
            Browse our course catalog and start learning something new today.
        </p>
        <Link to="/courses" className="btn-primary px-6 py-2.5 text-sm rounded-xl"
            style={{ backgroundColor: "var(--color-primary)" }}>
            Browse Courses
        </Link>
    </div>
);

// ── Error state ───────────────────────────────────────────────────────────────
const ErrorState = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <span className="text-4xl mb-3">⚠️</span>
        <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
            Couldn't load your courses
        </p>
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{message}</p>
    </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const MyCourses = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        enrollmentApi.getMyEnrollments()
            .then((res) => setEnrollments(res.data.data.enrollments || []))
            .catch((err) => setError(err.response?.data?.message || "Something went wrong"))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6" style={{ backgroundColor: "var(--color-bg)" }}>
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold"
                        style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}>
                        My Courses
                    </h1>
                    <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                        {loading ? "Loading your courses…" : `${enrollments.length} course${enrollments.length === 1 ? "" : "s"} enrolled`}
                    </p>
                </div>

                {/* States */}
                {loading && <Skeleton />}
                {!loading && error && <ErrorState message={error} />}
                {!loading && !error && enrollments.length === 0 && <EmptyState />}

                {!loading && !error && enrollments.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrollments.map((enrollment) => (
                            <EnrolledCourseCard key={enrollment._id} enrollment={enrollment} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyCourses;