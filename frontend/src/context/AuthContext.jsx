import { createContext, useContext, useEffect, useRef, useState } from "react";
import authApi from "../api/auth.api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const hydrated = useRef(false);

  // ── Hydrate on app load ───────────────────────────────────────────────────
  // Runs once. If a token exists, verify it and restore the user.
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const token = localStorage.getItem("accessToken");

    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .getMe()
      .then((res) => setUser(res.data.data.user))
      .catch(() => localStorage.removeItem("accessToken"))
      .finally(() => setLoading(false));
  }, []);

  // ── login ─────────────────────────────────────────────────────────────────
  const login = (userData, token) => {
    localStorage.setItem("accessToken", token);
    setUser(userData);
  };

  // ── logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    try { await authApi.logout(); } catch { /* silent */ }
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  // ── Role helpers ──────────────────────────────────────────────────────────
  const isStudent = user?.role === "student";
  const isInstructor = user?.role === "instructor";
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isStudent,
        isInstructor,
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};