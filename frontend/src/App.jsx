import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage    from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import ProtectedRoute from "./components/ui/ProtectedRoute.jsx";
 
// Placeholder dashboard — replace in next phase
const Dashboard = () => (
  <div className="min-h-screen flex items-center justify-center">
    <h1 className="text-2xl font-bold text-white">Dashboard 🎉</h1>
  </div>
);
 
const App = () => (
  <Routes>
    <Route path="/login"    element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/dashboard" element={
      <ProtectedRoute><Dashboard /></ProtectedRoute>
    } />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);
 
export default App;
 
