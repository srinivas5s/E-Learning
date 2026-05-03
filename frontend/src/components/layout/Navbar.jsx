import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import ThemeToggle from "../ui/ThemeToggle.jsx";

// ── Icons ─────────────────────────────────────────────────────────────────────
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ── Nav links config ──────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Courses", to: "/courses" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

// ── Avatar initials helper ────────────────────────────────────────────────────
const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

// ── Main Component ────────────────────────────────────────────────────────────
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const dropRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
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

        {/* ── Logo ─────────────────────────────────────────────────────────── */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: "var(--color-primary)" }}>
            L
          </div>
          <span className="font-bold text-lg hidden sm:block"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}>
            LearnFlow
          </span>
        </Link>

        {/* ── Desktop Nav Links ─────────────────────────────────────────────── */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded-lg block transition-colors duration-150
                   ${isActive
                    ? "font-semibold"
                    : "hover:bg-opacity-10"}`
                }
                style={({ isActive }) => ({
                  color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
                  backgroundColor: isActive ? "rgba(99,102,241,0.08)" : "transparent",
                })}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* ── Right Side ───────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2">

          {/* Theme toggle — always visible */}
          <ThemeToggle />

          {/* ── Guest buttons ─────────────────────────────────────────────── */}
          {!isAuthenticated && (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="btn-ghost text-sm px-4 py-2">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-sm px-4 py-2">
                Get Started
              </Link>
            </div>
          )}

          {/* ── User Avatar Dropdown ──────────────────────────────────────── */}
          {isAuthenticated && (
            <div className="relative hidden md:block" ref={dropRef}>
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all duration-150"
                style={{
                  border: "1px solid var(--color-border)",
                  backgroundColor: dropOpen ? "var(--color-bg-card)" : "transparent",
                }}
              >
                {/* Avatar circle */}
                <div className="w-7 h-7 rounded-full flex items-center justify-center
                                text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: "var(--color-primary)" }}>
                  {getInitials(user?.name)}
                </div>
                <span className="text-sm font-medium max-w-25 truncate"
                  style={{ color: "var(--color-text)" }}>
                  {user?.name?.split(" ")[0]}
                </span>
                <span style={{ color: "var(--color-text-muted)" }}
                  className={`transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`}>
                  <ChevronDown />
                </span>
              </button>

              {/* Dropdown menu */}
              {dropOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 rounded-xl shadow-lg py-1 z-50
                             animate-[fadeIn_0.15s_ease]"
                  style={{
                    backgroundColor: "var(--color-bg-card)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  {/* User info */}
                  <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--color-text)" }}>
                      {user?.name}
                    </p>
                    <p className="text-xs truncate mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                      {user?.email}
                    </p>
                    <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                      style={{ backgroundColor: "rgba(99,102,241,0.12)", color: "var(--color-primary)" }}>
                      {user?.role}
                    </span>
                  </div>

                  {/* Links */}
                  {[
                    { label: "Dashboard", to: "/dashboard" },
                    { label: "My Courses", to: "/my-courses" },
                    { label: "Profile", to: "/profile" },
                    { label: "Settings", to: "/settings" },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setDropOpen(false)}
                      className="block px-4 py-2.5 text-sm transition-colors duration-100"
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

                  {/* Logout */}
                  <div style={{ borderTop: "1px solid var(--color-border)" }} className="mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm transition-colors duration-100"
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

          {/* ── Hamburger (mobile) ────────────────────────────────────────── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg
                       transition-colors duration-150"
            style={{
              color: "var(--color-text-muted)",
              backgroundColor: menuOpen ? "var(--color-bg-card)" : "transparent",
              border: "1px solid var(--color-border)",
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ──────────────────────────────────────────────────────── */}
      {menuOpen && (
        <div
          className="md:hidden px-4 pb-4 pt-2 space-y-1"
          style={{
            backgroundColor: "var(--color-bg-nav)",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          {/* Nav links */}
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150
                 ${isActive ? "font-semibold" : ""}`
              }
              style={({ isActive }) => ({
                color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
                backgroundColor: isActive ? "rgba(99,102,241,0.08)" : "transparent",
              })}
            >
              {link.label}
            </NavLink>
          ))}

          <div className="pt-2" style={{ borderTop: "1px solid var(--color-border)" }}>
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className="btn-ghost w-full text-center py-2.5">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}
                  className="btn-primary w-full text-center py-2.5">
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="pt-2 space-y-1">
                {/* User info strip */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg"
                  style={{ backgroundColor: "var(--color-bg-card)" }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center
                                  text-sm font-bold text-white shrink-0"
                    style={{ backgroundColor: "var(--color-primary)" }}>
                    {getInitials(user?.name)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--color-text)" }}>
                      {user?.name}
                    </p>
                    <p className="text-xs truncate" style={{ color: "var(--color-text-muted)" }}>
                      {user?.email}
                    </p>
                  </div>
                </div>

                {[
                  { label: "Dashboard", to: "/dashboard" },
                  { label: "My Courses", to: "/my-courses" },
                  { label: "Profile", to: "/profile" },
                  { label: "Settings", to: "/settings" },
                ].map((item) => (
                  <Link key={item.to} to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 rounded-lg text-sm transition-colors duration-150"
                    style={{ color: "var(--color-text-muted)" }}>
                    {item.label}
                  </Link>
                ))}

                <button onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm mt-1"
                  style={{ color: "var(--color-error)" }}>
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