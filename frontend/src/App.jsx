import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "./components/layout/MainLayout.jsx";
import ProtectedRoute from "./components/ui/ProtectedRoute.jsx";

// Auth pages
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";

// Placeholder pages — replace each in future phases
const HomePage = () => <PlaceholderPage title="Home" emoji="🏠" />;
const CoursesPage = () => <PlaceholderPage title="Courses" emoji="📚" />;
const AboutPage = () => <PlaceholderPage title="About" emoji="ℹ️" />;
const ContactPage = () => <PlaceholderPage title="Contact" emoji="✉️" />;
const Dashboard = () => <PlaceholderPage title="Dashboard" emoji="🎛️" protected />;
const ProfilePage = () => <PlaceholderPage title="Profile" emoji="👤" protected />;
const NotFound = () => <PlaceholderPage title="404 — Page Not Found" emoji="🔍" />;

const App = () => (
  <Routes>

    {/* ── Auth pages — no Navbar/Footer ──────────────────────────────── */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    {/* ── Main layout — Navbar + Footer ──────────────────────────────── */}
    <Route element={<MainLayout />}>

      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-courses" element={<CoursesPage />} />
        <Route path="/settings" element={<ProfilePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Route>

  </Routes>
);

// ── Reusable placeholder ──────────────────────────────────────────────────────
const PlaceholderPage = ({ title, emoji }) => (
  <div
    className="min-h-[60vh] flex flex-col items-center justify-center gap-3 px-4"
    style={{ color: "var(--color-text)" }}
  >
    <span className="text-5xl">{emoji}</span>
    <h1
      className="text-2xl font-bold"
      style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}
    >
      {title}
    </h1>
    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
      This page will be built in a future phase.
    </p>
  </div>
);

export default App;