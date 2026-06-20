import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

// ── Spinner shown while auth is hydrating ─────────────────────────────────────
const AuthSpinner = () => (
  <div
    className="min-h-screen flex items-center justify-center"
    style={{ backgroundColor: "var(--color-bg)" }}
  >
    <div className="flex flex-col items-center gap-4">
      <div
        className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
        style={{
          borderColor:    "var(--color-primary)",
          borderTopColor: "transparent",
        }}
      />
      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        Loading…
      </p>
    </div>
  </div>
);

// ── Unauthorized page — shown when role doesn't match ────────────────────────
const Unauthorized = () => (
  <div
    className="min-h-screen flex flex-col items-center justify-center gap-4 px-4"
    style={{ backgroundColor: "var(--color-bg)" }}
  >
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
      style={{ backgroundColor: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}
    >
      🚫
    </div>
    <h1
      className="text-2xl font-bold"
      style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}
    >
      Access Denied
    </h1>
    <p className="text-sm text-center max-w-xs" style={{ color: "var(--color-text-muted)" }}>
      You don't have permission to view this page.
    </p>
    <a
      href="/"
      className="btn-primary px-6 py-2.5 text-sm rounded-xl mt-2"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      Go Home
    </a>
  </div>
);

// ── ProtectedRoute ────────────────────────────────────────────────────────────
//
// Usage as a layout route (wraps child routes):
//   <Route element={<ProtectedRoute />}>               ← any logged-in user
//   <Route element={<ProtectedRoute roles={["admin"]} />}>  ← admin only
//   <Route element={<ProtectedRoute roles={["instructor", "admin"]} />}>
//
// Props:
//   roles — optional array of allowed roles. If omitted, any logged-in user passes.

const ProtectedRoute = ({ roles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // 1. Still hydrating — show spinner, don't redirect yet
  if (loading) return <AuthSpinner />;

  // 2. Not logged in — send to /login, remember where they came from
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Logged in but role not allowed — show access denied
  if (roles && !roles.includes(user.role)) {
    return <Unauthorized />;
  }

  // 4. All checks passed — render child routes
  return <Outlet />;
};

export default ProtectedRoute;