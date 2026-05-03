import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Spinner = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div
      className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
      style={{ borderColor: "var(--color-primary)", borderTopColor: "transparent" }}
    />
  </div>
);

// Works both as a wrapper (<ProtectedRoute><Page /></ProtectedRoute>)
// and as a layout route (<Route element={<ProtectedRoute />}>)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Layout route usage
  return children ?? <Outlet />;
};

export default ProtectedRoute;