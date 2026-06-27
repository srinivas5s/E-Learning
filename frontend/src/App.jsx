import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "./components/layout/MainLayout.jsx";
import ProtectedRoute from "./components/ui/ProtectedRoute.jsx";

// Public pages
import Home from "./pages/home/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
// import MyCourses from "./pages/student/MyCourses.jsx";
// import Profile from "./pages/student/Profile.jsx";

// Instructor pages
import InstructorDashboard from "./pages/instructor/InstructorDashboard.jsx";
import CreateCourse from "./features/courses/pages/CreateCourse.jsx"
import ManageCourses from "./features/courses/pages/ManageCourses.jsx";
import CoursesPage from "./features/courses/pages/CoursesPage.jsx";
import CourseDetail from "./features/courses/pages/CourseDetail.jsx";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
// import AdminUsers from "./pages/admin/AdminUsers.jsx";
// import AdminCourses from "./pages/admin/AdminCourses.jsx";

// ── 404 ───────────────────────────────────────────────────────────────────────
const NotFound = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 px-4"
    style={{ backgroundColor: "var(--color-bg)" }}>
    <span className="text-6xl">🔍</span>
    <h1 className="text-3xl font-bold"
      style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}>
      404 — Page Not Found
    </h1>
    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
      The page you're looking for doesn't exist.
    </p>
    <a href="/" className="btn-primary px-6 py-2.5 text-sm rounded-xl mt-2"
      style={{ backgroundColor: "var(--color-primary)" }}>
      Go Home
    </a>
  </div>
);

// ── App ───────────────────────────────────────────────────────────────────────
const App = () => (
  <Routes>

    {/* ── Auth pages — no Navbar/Footer ──────────────────────────────────── */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    {/* ── Public pages — with Navbar/Footer ──────────────────────────────── */}
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/courses/:slug" element={<CourseDetail />} />

      {/* ── Student routes ─────────────────────────────────────────────── */}
      <Route element={<ProtectedRoute roles={["student"]} />}>
        <Route path="/dashboard" element={<StudentDashboard />} />
        {/* <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/profile" element={<Profile />} /> */}
      </Route>

      {/* ── Instructor routes ───────────────────────────────────────────── */}
      <Route element={<ProtectedRoute roles={["instructor"]} />}>
        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
        <Route path="/instructor/create-course" element={<CreateCourse />} />
        <Route path="/instructor/manage-courses" element={<ManageCourses />} />
      </Route>

      {/* ── Admin routes ────────────────────────────────────────────────── */}
      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        {/* <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/courses" element={<AdminCourses />} /> */}
      </Route>

      {/* ── Shared protected routes (any logged-in role) ────────────────── */}
      <Route element={<ProtectedRoute />}>
        {/* <Route path="/settings" element={<Profile />} /> */}
      </Route>

      {/* ── 404 ─────────────────────────────────────────────────────────── */}
      <Route path="*" element={<NotFound />} />
    </Route>

  </Routes>
);

export default App;