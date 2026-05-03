import { useTheme } from "../../context/ThemeContext.jsx";

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
       viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41
             M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
       viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative w-9 h-9 rounded-lg flex items-center justify-center
                 transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        backgroundColor: "var(--color-bg-card)",
        border:          "1px solid var(--color-border)",
        color:           "var(--color-text-muted)",
      }}
    >
      {/* Animated icon swap */}
      <span
        className="absolute transition-all duration-300"
        style={{
          opacity:   isDark ? 1 : 0,
          transform: isDark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.5)",
        }}
      >
        <MoonIcon />
      </span>
      <span
        className="absolute transition-all duration-300"
        style={{
          opacity:   isDark ? 0 : 1,
          transform: isDark ? "rotate(-90deg) scale(0.5)" : "rotate(0deg) scale(1)",
        }}
      >
        <SunIcon />
      </span>
    </button>
  );
};

export default ThemeToggle;