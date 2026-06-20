import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import ThemeToggle from "../ui/ThemeToggle.jsx";

// ── Icons ─────────────────────────────────────────────────────────────────────
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronDown = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
    style={{
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.2s ease",
    }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ── Role-based nav links config ───────────────────────────────────────────────
const NAV_LINKS = {
  public: [
    { label: "Home", to: "/" },
    { label: "Courses", to: "/courses" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ],
  student: [
    { label: "Dashboard", to: "/dashboard" },
    { label: "My Courses", to: "/my-courses" },
    { label: "Profile", to: "/profile" },
  ],
  instructor: [
    { label: "Dashboard", to: "/instructor/dashboard" },
    { label: "Create Course", to: "/instructor/create-course" },
    { label: "Manage Courses", to: "/instructor/manage-courses" },
  ],
  admin: [
    { label: "Admin Panel", to: "/admin/dashboard" },
    { label: "Users", to: "/admin/users" },
    { label: "Courses", to: "/admin/courses" },
  ],
};

// ── Dropdown links per role ───────────────────────────────────────────────────
const DROPDOWN_LINKS = {
  student: [
    { label: "My Dashboard", to: "/dashboard" },
    { label: "My Courses", to: "/my-courses" },
    { label: "Profile", to: "/profile" },
    { label: "Settings", to: "/settings" },
  ],
  instructor: [
    { label: "Dashboard", to: "/instructor/dashboard" },
    { label: "Create Course", to: "/instructor/create-course" },
    { label: "Manage Courses", to: "/instructor/manage-courses" },
    { label: "Settings", to: "/settings" },
  ],
  admin: [
    { label: "Admin Dashboard", to: "/admin/dashboard" },
    { label: "Manage Users", to: "/admin/users" },
    { label: "Manage Courses", to: "/admin/courses" },
    { label: "Settings", to: "/settings" },
  ],
};

// ── Role badge config ─────────────────────────────────────────────────────────
const ROLE_BADGE = {
  student: { label: "Student", color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
  instructor: { label: "Instructor", color: "#0ea5e9", bg: "rgba(14,165,233,0.12)" },
  admin: { label: "Admin", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const AVATAR_BG = {
  student: "#6366f1",
  instructor: "#0ea5e9",
  admin: "#f59e0b",
};

// ── NavLink item ──────────────────────────────────────────────────────────────
const NavItem = ({ to, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className="nav-link"
    style={({ isActive }) => ({
      color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
      backgroundColor: isActive ? "rgba(99,102,241,0.08)" : "transparent",
      padding: "6px 12px",
      borderRadius: "8px",
      fontWeight: isActive ? 600 : 500,
      fontSize: "14px",
      display: "block",
      transition: "all 0.15s ease",
    })}
    onMouseEnter={(e) => {
      if (!e.currentTarget.classList.contains("active"))
        e.currentTarget.style.color = "var(--color-text)";
    }}
    onMouseLeave={(e) => {
      if (!e.currentTarget.classList.contains("active"))
        e.currentTarget.style.color = "var(--color-text-muted)";
    }}
  >
    {label}
  </NavLink>
);

// ── Main Component ────────────────────────────────────────────────────────────
const Navbar = () => {
  const { user, isAuthenticated, isStudent, isInstructor, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  // Resolve which nav links to show based on role
  const navLinks = !isAuthenticated
    ? NAV_LINKS.public
    : isAdmin
      ? NAV_LINKS.admin
      : isInstructor
        ? NAV_LINKS.instructor
        : NAV_LINKS.student;

  const dropLinks = user?.role ? DROPDOWN_LINKS[user.role] : [];
  const badge = user?.role ? ROLE_BADGE[user.role] : null;
  const avatarBg = user?.role ? AVATAR_BG[user.role] : "#6366f1";

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const handleLogout = async () => {
    setDropOpen(false);
    setMenuOpen(false);
    await logout();
    navigate("/login");
  };

  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-md"
      style={{
        backgroundColor: "var(--color-bg-nav)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* ── Logo ──────────────────────────────────────────────────────────── */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center
                          text-white text-sm font-bold"
            style={{ backgroundColor: "var(--color-primary)" }}>
            L
          </div>
          <span className="font-bold text-lg hidden sm:block"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}>
            LearnFlow
          </span>
        </Link>

        {/* ── Desktop nav links ──────────────────────────────────────────────── */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavItem to={link.to} label={link.label} />
            </li>
          ))}
        </ul>

        {/* ── Right side ────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2">

          <ThemeToggle />

          {/* ── Guest buttons ───────────────────────────────────────────────── */}
          {!isAuthenticated && (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="btn-ghost text-sm px-4 py-2">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-sm px-4 py-2"
                style={{ backgroundColor: "var(--color-primary)" }}>
                Get Started
              </Link>
            </div>
          )}

          {/* ── User avatar dropdown ─────────────────────────────────────────── */}
          {isAuthenticated && (
            <div className="relative hidden md:block" ref={dropRef}>
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg
                           transition-all duration-150"
                style={{
                  border: "1px solid var(--color-border)",
                  backgroundColor: dropOpen ? "var(--color-bg-card)" : "transparent",
                }}
              >
                {/* Avatar */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center
                             text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: avatarBg }}
                >
                  {getInitials(user?.name)}
                </div>

                {/* Name */}
                <span className="text-sm font-medium max-w-22.5 truncate"
                  style={{ color: "var(--color-text)" }}>
                  {user?.name?.split(" ")[0]}
                </span>

                <ChevronDown open={dropOpen} />
              </button>

              {/* Dropdown */}
              {dropOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl py-1 z-50"
                  style={{
                    backgroundColor: "var(--color-bg-card)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  {/* User info */}
                  <div className="px-4 py-3"
                    style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <p className="text-sm font-semibold truncate"
                      style={{ color: "var(--color-text)" }}>
                      {user?.name}
                    </p>
                    <p className="text-xs truncate mt-0.5"
                      style={{ color: "var(--color-text-muted)" }}>
                      {user?.email}
                    </p>
                    {/* Role badge */}
                    {badge && (
                      <span
                        className="inline-block mt-2 text-xs font-semibold
                                   px-2 py-0.5 rounded-full capitalize"
                        style={{ backgroundColor: badge.bg, color: badge.color }}
                      >
                        {badge.label}
                      </span>
                    )}
                  </div>

                  {/* Role-specific links */}
                  <div className="py-1">
                    {dropLinks.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setDropOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm
                                   transition-colors duration-100"
                        style={{ color: "var(--color-text-muted)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.06)";
                          e.currentTarget.style.color = "var(--color-text)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "var(--color-text-muted)";
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  {/* Logout */}
                  <div style={{ borderTop: "1px solid var(--color-border)" }}
                    className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm
                                 transition-colors duration-100"
                      style={{ color: "var(--color-error)" }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(248,113,113,0.06)"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Hamburger ────────────────────────────────────────────────────── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg
                       transition-colors duration-150"
            style={{
              color: "var(--color-text-muted)",
              border: "1px solid var(--color-border)",
              backgroundColor: menuOpen ? "var(--color-bg-card)" : "transparent",
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* ── Mobile menu ───────────────────────────────────────────────────────── */}
      {menuOpen && (
        <div
          className="md:hidden px-4 pb-5 pt-2 space-y-1"
          style={{
            backgroundColor: "var(--color-bg-nav)",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          {/* Nav links */}
          {navLinks.map((link) => (
            <NavItem
              key={link.to}
              to={link.to}
              label={link.label}
              onClick={() => setMenuOpen(false)}
            />
          ))}

          <div className="pt-3" style={{ borderTop: "1px solid var(--color-border)" }}>

            {/* Guest */}
            {!isAuthenticated && (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className="btn-ghost w-full text-center py-2.5 text-sm">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}
                  className="btn-primary w-full text-center py-2.5 text-sm"
                  style={{ backgroundColor: "var(--color-primary)" }}>
                  Get Started
                </Link>
              </div>
            )}

            {/* Logged in */}
            {isAuthenticated && (
              <div className="space-y-1 pt-2">
                {/* User info strip */}
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl mb-2"
                  style={{ backgroundColor: "var(--color-bg-card)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center
                                  text-sm font-bold text-white shrink-0"
                    style={{ backgroundColor: avatarBg }}>
                    {getInitials(user?.name)}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="text-sm font-semibold truncate"
                      style={{ color: "var(--color-text)" }}>
                      {user?.name}
                    </p>
                    <p className="text-xs truncate"
                      style={{ color: "var(--color-text-muted)" }}>
                      {user?.email}
                    </p>
                  </div>
                  {badge && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                      style={{ backgroundColor: badge.bg, color: badge.color }}>
                      {badge.label}
                    </span>
                  )}
                </div>

                {/* Role-specific dropdown links */}
                {dropLinks.map((item) => (
                  <NavItem
                    key={item.to}
                    to={item.to}
                    label={item.label}
                    onClick={() => setMenuOpen(false)}
                  />
                ))}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm
                             font-medium transition-colors duration-150 mt-1"
                  style={{ color: "var(--color-error)" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(248,113,113,0.06)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;