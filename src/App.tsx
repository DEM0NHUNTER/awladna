import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  useParams,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ErrorBoundary from "./components/ErrorBoundary";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import RecommendationsPage from "./pages/RecommendationsPage";
import NotFound from "./pages/NotFound";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Guest-only route guard
const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, childProfiles } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (user) {
    if (childProfiles.length > 0) {
      return <Navigate to={`/chat/${childProfiles[0].child_id}`} replace />;
    } else {
      return <Navigate to="/profile" replace />;
    }
  }
  return <>{children}</>;
};

// ✅ Auth-only route guard
const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

// ✅ Wrapper for dynamic childId param
const RecommendationsPageWrapper: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  return <RecommendationsPage childId={parseInt(childId || "0", 10)} />;
};

// ✅ Main App Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Guest-only pages */}
      <Route path="/" element={<GuestRoute><Home /></GuestRoute>} />
      <Route path="/home" element={<GuestRoute><Home /></GuestRoute>} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

      {/* Open pages */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected pages */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat/:childId" element={<Chat />} />
        <Route path="/recommendations/:childId" element={<RecommendationsPageWrapper />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const AppWrapper = () => {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = () => {
      toast.warning("Session expired. Please log in again.");
      navigate("/login");
    };

    const handleRefreshSuccess = async () => {
      await refreshUser?.();
    };

    window.addEventListener("auth-unauthorized", handleUnauthorized);
    window.addEventListener("auth-refresh-success", handleRefreshSuccess);

    return () => {
      window.removeEventListener("auth-unauthorized", handleUnauthorized);
      window.removeEventListener("auth-refresh-success", handleRefreshSuccess);
    };
  }, [navigate, refreshUser]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} />
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow bg-gray-50 p-4">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </ErrorBoundary>
    </>
  );
};
// ✅ Final Exported Component with Context Providers
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <AppWrapper />
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
