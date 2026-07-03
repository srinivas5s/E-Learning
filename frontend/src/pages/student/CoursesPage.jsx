import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetAllCourses } from "../../services/useCourse.js";
import CourseCard from "../../components/student/CourseCard.jsx";
import {
  CATEGORIES,
  LEVELS,
  SORT_OPTIONS,
} from "../../constants/courseConstants.js";

// ── Icons ─────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden animate-pulse"
    style={{ backgroundColor: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
    <div className="h-44" style={{ backgroundColor: "var(--color-border)" }} />
    <div className="p-4 space-y-3">
      <div className="h-4 rounded w-4/5" style={{ backgroundColor: "var(--color-border)" }} />
      <div className="h-3 rounded w-2/5" style={{ backgroundColor: "var(--color-border)" }} />
      <div className="h-3 rounded w-3/5" style={{ backgroundColor: "var(--color-border)" }} />
      <div className="flex justify-between pt-2">
        <div className="h-5 rounded w-1/4" style={{ backgroundColor: "var(--color-border)" }} />
        <div className="h-6 rounded w-1/5" style={{ backgroundColor: "var(--color-border)" }} />
      </div>
    </div>
  </div>
);

// ── Filter Sidebar ─────────────────────────────────────────────────────────────
const FilterSidebar = ({ filters, onChange, onClear, hasActive }) => {
  const selectStyle = {
    backgroundColor: "var(--color-bg-input)",
    border: "1px solid var(--color-border)",
    color: "var(--color-text)",
  };

  return (
    <div
      className="rounded-2xl p-5 h-fit"
      style={{
        backgroundColor: "var(--color-bg-card)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold flex items-center gap-2"
          style={{ color: "var(--color-text-heading)" }}>
          <FilterIcon /> Filters
        </h3>
        {hasActive && (
          <button
            onClick={onClear}
            className="text-xs font-medium transition-colors duration-150"
            style={{ color: "var(--color-primary)" }}
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-5">

        {/* Category */}
        <div>
          <label className="form-label">Category</label>
          <select
            className="input-field text-sm"
            value={filters.category}
            onChange={(e) => onChange("category", e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Level */}
        <div>
          <label className="form-label">Level</label>
          <div className="space-y-2">
            {[{ value: "", label: "All Levels" }, ...LEVELS].map((l) => (
              <label key={l.value}
                className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="level"
                  value={l.value}
                  checked={filters.level === l.value}
                  onChange={() => onChange("level", l.value)}
                  className="accent-indigo-500"
                />
                <span className="text-sm transition-colors duration-150"
                  style={{
                    color: filters.level === l.value
                      ? "var(--color-primary)" : "var(--color-text-muted)"
                  }}>
                  {l.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price range */}
        <div>
          <label className="form-label">Price Range (₹)</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min="0"
              placeholder="Min"
              className="input-field text-sm"
              value={filters.minPrice}
              onChange={(e) => onChange("minPrice", e.target.value)}
            />
            <input
              type="number"
              min="0"
              placeholder="Max"
              className="input-field text-sm"
              value={filters.maxPrice}
              onChange={(e) => onChange("maxPrice", e.target.value)}
            />
          </div>
          {/* Quick price filters */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[
              { label: "Free", min: "0", max: "0" },
              { label: "Under ₹999", min: "0", max: "999" },
              { label: "Under ₹4999", min: "0", max: "4999" },
            ].map((p) => (
              <button
                key={p.label}
                onClick={() => { onChange("minPrice", p.min); onChange("maxPrice", p.max); }}
                className="text-xs px-2.5 py-1 rounded-full transition-all duration-150"
                style={{
                  backgroundColor: filters.minPrice === p.min && filters.maxPrice === p.max
                    ? "var(--color-primary)" : "var(--color-bg-input)",
                  color: filters.minPrice === p.min && filters.maxPrice === p.max
                    ? "#fff" : "var(--color-text-muted)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

// ── Active filter chips ───────────────────────────────────────────────────────
const FilterChip = ({ label, onRemove }) => (
  <span
    className="inline-flex items-center gap-1.5 text-xs font-medium
               px-3 py-1.5 rounded-full"
    style={{
      backgroundColor: "rgba(99,102,241,0.1)",
      color: "var(--color-primary)",
      border: "1px solid rgba(99,102,241,0.25)",
    }}
  >
    {label}
    <button onClick={onRemove} className="opacity-70 hover:opacity-100 transition-opacity">
      <CloseIcon />
    </button>
  </span>
);

// ── Empty state ───────────────────────────────────────────────────────────────
const EmptyState = ({ hasFilters, onClear }) => (
  <div className="col-span-full flex flex-col items-center justify-center
                  py-20 text-center">
    <span className="text-5xl mb-4">{hasFilters ? "🔍" : "📭"}</span>
    <h3 className="text-lg font-bold mb-2"
      style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}>
      {hasFilters ? "No courses found" : "No courses yet"}
    </h3>
    <p className="text-sm mb-5 max-w-xs" style={{ color: "var(--color-text-muted)" }}>
      {hasFilters
        ? "Try adjusting your search or filters to find what you're looking for."
        : "Check back soon — new courses are being added regularly."}
    </p>
    {hasFilters && (
      <button
        onClick={onClear}
        className="btn-primary px-6 py-2.5 text-sm"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        Clear Filters
      </button>
    )}
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, loading, fetch } = useGetAllCourses();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    level: searchParams.get("level") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });

  // Build query and fetch
  const loadCourses = useCallback((page = 1) => {
    const params = { page, limit: 12, sort };
    if (search) params.search = search;
    if (filters.category) params.category = filters.category;
    if (filters.level) params.level = filters.level;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    fetch(params);
  }, [search, sort, filters]);

  useEffect(() => { loadCourses(1); }, [loadCourses]);

  // Sync URL params
  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (sort !== "newest") params.sort = sort;
    if (filters.category) params.category = filters.category;
    if (filters.level) params.level = filters.level;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    setSearchParams(params, { replace: true });
  }, [search, sort, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ category: "", level: "", minPrice: "", maxPrice: "" });
    setSearch("");
    setSearchInput("");
  };

  const hasActiveFilters =
    filters.category || filters.level ||
    filters.minPrice || filters.maxPrice || search;

  const courses = data?.courses || [];
  const pagination = data?.pagination || {};

  // Active chip labels
  const chips = [
    filters.category && { key: "category", label: filters.category },
    filters.level && { key: "level", label: filters.level },
    filters.minPrice && { key: "minPrice", label: `Min ₹${filters.minPrice}` },
    filters.maxPrice && { key: "maxPrice", label: `Max ₹${filters.maxPrice}` },
    search && { key: "search", label: `"${search}"` },
  ].filter(Boolean);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="max-w-7xl mx-auto">

        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2"
            style={{ color: "var(--color-primary)" }}>
            All Courses
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}>
            Explore{" "}
            <span style={{ color: "var(--color-primary)" }}>500+ Courses</span>
          </h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Learn from industry experts at your own pace.
          </p>
        </div>

        {/* ── Search + Sort bar ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--color-text-muted)" }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                className="input-field pl-9 pr-4"
                placeholder="Search courses, topics, instructors..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn-primary px-5 text-sm rounded-xl"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Search
            </button>
          </form>

          {/* Sort */}
          <select
            className="input-field w-full sm:w-48 text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl
                       text-sm font-medium transition-all duration-150"
            style={{
              backgroundColor: showFilters ? "var(--color-primary)" : "var(--color-bg-card)",
              color: showFilters ? "#fff" : "var(--color-text-muted)",
              border: `1px solid ${showFilters ? "var(--color-primary)" : "var(--color-border)"}`,
            }}
          >
            <FilterIcon />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-red-400" />
            )}
          </button>
        </div>

        {/* ── Active filter chips ─────────────────────────────────────── */}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {chips.map((chip) => (
              <FilterChip
                key={chip.key}
                label={chip.label}
                onRemove={() => {
                  if (chip.key === "search") { setSearch(""); setSearchInput(""); }
                  else handleFilterChange(chip.key, "");
                }}
              />
            ))}
            <button
              onClick={clearFilters}
              className="text-xs font-medium transition-colors duration-150 px-2"
              style={{ color: "var(--color-text-muted)" }}
            >
              Clear all
            </button>
          </div>
        )}

        {/* ── Layout: sidebar + grid ─────────────────────────────────── */}
        <div className="flex gap-6 items-start">

          {/* Sidebar — desktop always, mobile toggled */}
          <aside className={`w-64 shrink-0 ${showFilters ? "block" : "hidden"} sm:block`}>
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onClear={clearFilters}
              hasActive={!!hasActiveFilters}
            />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Results count */}
            {!loading && (
              <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
                {pagination.total
                  ? `Showing ${courses.length} of ${pagination.total} courses`
                  : courses.length > 0
                    ? `${courses.length} courses`
                    : ""}
              </p>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                : courses.length === 0
                  ? <EmptyState hasFilters={!!hasActiveFilters} onClear={clearFilters} />
                  : courses.map((course) => (
                    <CourseCard key={course._id} course={course} />
                  ))
              }
            </div>

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  disabled={!pagination.hasPrev}
                  onClick={() => loadCourses(pagination.page - 1)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all
                             duration-150 btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                {/* Page numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter((p) =>
                      p === 1 ||
                      p === pagination.totalPages ||
                      Math.abs(p - pagination.page) <= 1
                    )
                    .reduce((acc, p, i, arr) => {
                      if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "..." ? (
                        <span key={`dot-${i}`} className="px-2 py-2 text-sm"
                          style={{ color: "var(--color-text-muted)" }}>…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => loadCourses(p)}
                          className="w-9 h-9 rounded-lg text-sm font-medium transition-all duration-150"
                          style={{
                            backgroundColor: p === pagination.page
                              ? "var(--color-primary)" : "var(--color-bg-card)",
                            color: p === pagination.page
                              ? "#fff" : "var(--color-text-muted)",
                            border: `1px solid ${p === pagination.page
                              ? "var(--color-primary)" : "var(--color-border)"}`,
                          }}
                        >
                          {p}
                        </button>
                      )
                    )}
                </div>

                <button
                  disabled={!pagination.hasNext}
                  onClick={() => loadCourses(pagination.page + 1)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all
                             duration-150 btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;