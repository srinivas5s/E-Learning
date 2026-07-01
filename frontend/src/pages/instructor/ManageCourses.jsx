import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetInstructorCourses,
  useTogglePublish,
  useDeleteCourse,
} from "../../services/useCourse.js";
import {
  STATUS_BADGE,
  LEVEL_BADGE,
  formatPrice,
  formatDuration,
} from "../../constants/courseConstants.js";

// ── Icons ─────────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const EyeIcon = ({ off }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    {off ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

// ── Confirm Delete Modal ──────────────────────────────────────────────────────
const DeleteModal = ({ course, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
    <div
      className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
      style={{
        backgroundColor: "var(--color-bg-card)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
        style={{ backgroundColor: "rgba(248,113,113,0.1)" }}>
        🗑️
      </div>
      <h3 className="text-base font-bold mb-2"
        style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}>
        Delete Course?
      </h3>
      <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
        Are you sure you want to delete
      </p>
      <p className="text-sm font-semibold mb-4" style={{ color: "var(--color-text)" }}>
        "{course.title}"
      </p>
      <p className="text-xs mb-6 px-3 py-2 rounded-lg"
        style={{ backgroundColor: "rgba(248,113,113,0.08)", color: "var(--color-error)" }}>
        This action cannot be undone.
      </p>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 btn-ghost py-2.5 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white
                     transition-all duration-150 disabled:opacity-60"
          style={{ backgroundColor: "var(--color-error)" }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white
                               rounded-full animate-spin" />
              Deleting…
            </span>
          ) : "Yes, Delete"}
        </button>
      </div>
    </div>
  </div>
);

// ── Empty State ───────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-5"
      style={{ backgroundColor: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
      📚
    </div>
    <h3 className="text-lg font-bold mb-2"
      style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}>
      No courses yet
    </h3>
    <p className="text-sm mb-6 max-w-xs" style={{ color: "var(--color-text-muted)" }}>
      Create your first course and start sharing your knowledge with students.
    </p>
    <Link
      to="/instructor/create-course"
      className="btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      <PlusIcon /> Create Your First Course
    </Link>
  </div>
);

// ── Skeleton loader ───────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <div className="flex items-center gap-4 p-4 rounded-xl animate-pulse"
    style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
    <div className="w-24 h-16 rounded-lg shrink-0"
      style={{ backgroundColor: "var(--color-border)" }} />
    <div className="flex-1 space-y-2">
      <div className="h-4 rounded w-2/3" style={{ backgroundColor: "var(--color-border)" }} />
      <div className="h-3 rounded w-1/3" style={{ backgroundColor: "var(--color-border)" }} />
    </div>
    <div className="hidden sm:flex gap-2">
      <div className="w-16 h-6 rounded-full" style={{ backgroundColor: "var(--color-border)" }} />
      <div className="w-16 h-6 rounded-full" style={{ backgroundColor: "var(--color-border)" }} />
    </div>
    <div className="flex gap-2">
      <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: "var(--color-border)" }} />
      <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: "var(--color-border)" }} />
      <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: "var(--color-border)" }} />
    </div>
  </div>
);

// ── Course Row ────────────────────────────────────────────────────────────────
const CourseRow = ({ course, onPublishToggle, onDelete, publishingId, navigate }) => {
  const status = STATUS_BADGE[course.status] || STATUS_BADGE.draft;
  const level = LEVEL_BADGE[course.level] || LEVEL_BADGE.beginner;
  const isPublishing = publishingId === course._id;

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200
                 group hover:shadow-md"
      style={{
        backgroundColor: "var(--color-bg-card)",
        border: "1px solid var(--color-border)",
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--color-border)"}
    >
      {/* Thumbnail */}
      <div
        className="w-24 h-16 rounded-lg shrink-0 flex items-center justify-center text-2xl
                   overflow-hidden"
        style={{ backgroundColor: "rgba(99,102,241,0.08)" }}
      >
        {course.thumbnail?.url
          ? <img src={course.thumbnail.url} alt={course.title}
            className="w-full h-full object-cover" />
          : "📚"}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold truncate mb-1"
          style={{ color: "var(--color-text-heading)" }}>
          {course.title}
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-xs"
          style={{ color: "var(--color-text-muted)" }}>
          <span>{formatPrice(course.price)}</span>
          <span>·</span>
          <span>{course.studentsEnrolled} students</span>
          {course.duration > 0 && (
            <>
              <span>·</span>
              <span>{formatDuration(course.duration)}</span>
            </>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: level.bg, color: level.color }}
        >
          {level.label}
        </span>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: status.bg, color: status.color }}
        >
          {status.label}
        </span>
      </div>

      {/* Rating */}
      <div className="hidden md:flex items-center gap-1 shrink-0">
        <span className="text-xs font-bold" style={{ color: "#f59e0b" }}>★</span>
        <span className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>
          {course.averageRating > 0 ? course.averageRating : "—"}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">

        {/* Edit */}
        <button
          onClick={() => navigate(`/instructor/edit-course/${course._id}`)}
          title="Edit course"
          className="w-8 h-8 rounded-lg flex items-center justify-center
                     transition-all duration-150"
          style={{
            color: "var(--color-text-muted)",
            backgroundColor: "transparent",
            border: "1px solid var(--color-border)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-primary)";
            e.currentTarget.style.borderColor = "var(--color-primary)";
            e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-text-muted)";
            e.currentTarget.style.borderColor = "var(--color-border)";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <EditIcon />
        </button>

        {/* Publish / Unpublish */}
        <button
          onClick={() => onPublishToggle(course._id)}
          disabled={isPublishing}
          title={course.isPublished ? "Unpublish" : "Publish"}
          className="w-8 h-8 rounded-lg flex items-center justify-center
                     transition-all duration-150 disabled:opacity-50"
          style={{
            color: course.isPublished ? "#10b981" : "var(--color-text-muted)",
            backgroundColor: course.isPublished ? "rgba(16,185,129,0.08)" : "transparent",
            border: `1px solid ${course.isPublished ? "rgba(16,185,129,0.3)" : "var(--color-border)"}`,
          }}
          onMouseEnter={(e) => {
            if (!isPublishing) {
              e.currentTarget.style.backgroundColor = course.isPublished
                ? "rgba(248,113,113,0.08)" : "rgba(16,185,129,0.08)";
              e.currentTarget.style.color = course.isPublished ? "#f87171" : "#10b981";
              e.currentTarget.style.borderColor = course.isPublished
                ? "rgba(248,113,113,0.3)" : "rgba(16,185,129,0.3)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = course.isPublished
              ? "rgba(16,185,129,0.08)" : "transparent";
            e.currentTarget.style.color = course.isPublished ? "#10b981" : "var(--color-text-muted)";
            e.currentTarget.style.borderColor = course.isPublished
              ? "rgba(16,185,129,0.3)" : "var(--color-border)";
          }}
        >
          {isPublishing
            ? <span className="w-3 h-3 border border-current border-t-transparent
                               rounded-full animate-spin" />
            : <EyeIcon off={course.isPublished} />}
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(course)}
          title="Delete course"
          className="w-8 h-8 rounded-lg flex items-center justify-center
                     transition-all duration-150"
          style={{
            color: "var(--color-text-muted)",
            backgroundColor: "transparent",
            border: "1px solid var(--color-border)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-error)";
            e.currentTarget.style.borderColor = "rgba(248,113,113,0.4)";
            e.currentTarget.style.backgroundColor = "rgba(248,113,113,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-text-muted)";
            e.currentTarget.style.borderColor = "var(--color-border)";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <TrashIcon />
        </button>

      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const ManageCourses = () => {
  const navigate = useNavigate();

  const { data, loading, fetch } = useGetInstructorCourses();
  const { loading: publishing, toggle } = useTogglePublish();
  const { loading: deleting, remove } = useDeleteCourse();

  const [publishingId, setPublishingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => { fetch({ status: statusFilter }); }, [statusFilter]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handlePublishToggle = async (id) => {
    setPublishingId(id);
    const updated = await toggle(id);
    if (updated) {
      // Update course in-place without full refetch
      fetch({ status: statusFilter });
    }
    setPublishingId(null);
  };

  const handleDeleteConfirm = async () => {
    const success = await remove(deleteTarget._id);
    if (success) {
      setDeleteTarget(null);
      fetch({ status: statusFilter });
    }
  };

  const courses = data?.courses || [];
  const pagination = data?.pagination || {};

  // ── Summary stats ─────────────────────────────────────────────────────────────
  const totalPublished = courses.filter((c) => c.status === "published").length;
  const totalDraft = courses.filter((c) => c.status === "draft").length;
  const totalStudents = courses.reduce((sum, c) => sum + (c.studentsEnrolled || 0), 0);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="max-w-5xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}>
              My Courses
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
              Manage, edit, and publish your courses
            </p>
          </div>
          <Link
            to="/instructor/create-course"
            className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm
                       rounded-xl self-start sm:self-auto"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <PlusIcon /> New Course
          </Link>
        </div>

        {/* ── Summary cards ──────────────────────────────────────────── */}
        {!loading && courses.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total Courses", value: pagination.total || courses.length, color: "#6366f1", bg: "rgba(99,102,241,0.08)" },
              { label: "Published", value: totalPublished, color: "#10b981", bg: "rgba(16,185,129,0.08)" },
              { label: "Total Students", value: totalStudents, color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
            ].map(({ label, value, color, bg }) => (
              <div key={label}
                className="text-center py-4 px-3 rounded-xl"
                style={{ backgroundColor: bg, border: `1px solid ${color}20` }}>
                <p className="text-xl font-bold" style={{ color, fontFamily: "var(--font-heading)" }}>
                  {value}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── Filter tabs ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-4">
          {[
            { value: "", label: "All" },
            { value: "published", label: "Published" },
            { value: "draft", label: "Drafts" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
              style={{
                backgroundColor: statusFilter === tab.value
                  ? "var(--color-primary)" : "var(--color-bg-card)",
                color: statusFilter === tab.value
                  ? "#fff" : "var(--color-text-muted)",
                border: `1px solid ${statusFilter === tab.value
                  ? "var(--color-primary)" : "var(--color-border)"}`,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Course list ─────────────────────────────────────────────── */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
          </div>
        ) : courses.length === 0 ? (
          <div
            className="rounded-2xl"
            style={{
              backgroundColor: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
            }}
          >
            <EmptyState />
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map((course) => (
              <CourseRow
                key={course._id}
                course={course}
                navigate={navigate}
                onPublishToggle={handlePublishToggle}
                onDelete={setDeleteTarget}
                publishingId={publishingId}
              />
            ))}
          </div>
        )}

        {/* ── Pagination ──────────────────────────────────────────────── */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              disabled={!pagination.hasPrev}
              onClick={() => fetch({ status: statusFilter, page: pagination.page - 1 })}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150
                         disabled:opacity-40 disabled:cursor-not-allowed btn-ghost"
            >
              ← Previous
            </button>
            <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              disabled={!pagination.hasNext}
              onClick={() => fetch({ status: statusFilter, page: pagination.page + 1 })}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150
                         disabled:opacity-40 disabled:cursor-not-allowed btn-ghost"
            >
              Next →
            </button>
          </div>
        )}

      </div>

      {/* ── Delete confirmation modal ────────────────────────────────── */}
      {deleteTarget && (
        <DeleteModal
          course={deleteTarget}
          loading={deleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default ManageCourses;