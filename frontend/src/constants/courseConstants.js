export const CATEGORIES = [
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
];

export const LEVELS = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
];

export const LANGUAGES = [
    "English",
    "Hindi",
    "Other",
];

export const SORT_OPTIONS = [
    { value: "newest", label: "Newest First" },
    { value: "popular", label: "Most Popular" },
    { value: "topRated", label: "Top Rated" },
    { value: "priceLow", label: "Price: Low → High" },
    { value: "priceHigh", label: "Price: High → Low" },
];

export const LEVEL_BADGE = {
    beginner: { label: "Beginner", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
    intermediate: { label: "Intermediate", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    advanced: { label: "Advanced", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
};

export const STATUS_BADGE = {
    draft: { label: "Draft", color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
    published: { label: "Published", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
};

// Formats price in INR
export const formatPrice = (price) => {
    if (price === 0) return "Free";
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(price);
};

// Format duration from total minutes → "2h 30m"
export const formatDuration = (minutes) => {
    if (!minutes) return "0m";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
};