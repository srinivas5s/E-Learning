import { Routes, Route } from "react-router-dom";

// Layouts
import MainLayout     from "./components/layout/MainLayout.jsx";
import ProtectedRoute from "./components/ui/ProtectedRoute.jsx";

// Auth pages
import LoginPage    from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";

// Home
import Home  from "./pages/home/Home.jsx";
import About   from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

// Placeholder pages — replace in future phases
const CoursesPage = () => <PlaceholderPage title="Courses"   emoji="📚" />;
const AboutPage = About;;
const ContactPage = Contact;;
const Dashboard   = () => <PlaceholderPage title="Dashboard" emoji="🎛️" />;
const ProfilePage = () => <PlaceholderPage title="Profile"   emoji="👤" />;
const NotFound    = () => <PlaceholderPage title="404 — Page Not Found" emoji="🔍" />;

const App = () => (
  <Routes>
    {/* Auth — no Navbar/Footer */}
    <Route path="/login"    element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    {/* Main layout — Navbar + Footer */}
    <Route element={<MainLayout />}>
      <Route path="/"        element={<Home />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/about"   element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="/profile"    element={<ProfilePage />} />
        <Route path="/my-courses" element={<CoursesPage />} />
        <Route path="/settings"   element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

const PlaceholderPage = ({ title, emoji }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 px-4"
       style={{ color: "var(--color-text)" }}>
    <span className="text-5xl">{emoji}</span>
    <h1 className="text-2xl font-bold"
        style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}>
      {title}
    </h1>
    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
      This page will be built in a future phase.
    </p>
  </div>
);

export default App;