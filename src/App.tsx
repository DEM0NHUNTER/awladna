// front_end/src/App.tsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate, useParams } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import toast from "react-hot-toast";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Chat from "./pages/Chat";
import RecommendationsPage from "./pages/RecommendationsPage";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Guest-only route guard
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
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

const RecommendationsPageWrapper = () => {
  const { childId } = useParams();
  return <RecommendationsPage childId={parseInt(childId || "0", 10)} />;
};

// Protected-only route guard
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

// Main App Component
const App: React.FC = () => {
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
            <Routes>
              {/* Public (guest-only) routes */}
              <Route path="/" element={<GuestRoute><Home /></GuestRoute>} />
              <Route path="/home" element={<GuestRoute><Home /></GuestRoute>} />
              <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

              {/* Open routes */}
              {/* <Route path="/verify-email" element={<VerifyEmail />} /> */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/chat/:childId" element={<Chat />} />
                <Route path="/recommendations/:childId" element={<RecommendationsPageWrapper />} />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ErrorBoundary>
    </>
  );
};

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
