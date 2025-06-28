// front_end/src/App.tsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

// Guest-only route guard
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

// Wrapper for RecommendationsPage to extract :childId param
const RecommendationsPageWrapper: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  return <RecommendationsPage childId={parseInt(childId || "0", 10)} />;
};

// Protected-only route guard
const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const App: React.FC = () => {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // When refresh interceptor succeeds
    const handleRefreshSuccess = () => {
      refreshUser();
    };
    // When token is invalidated
    const handleUnauthorized = () => {
      toast.warning("Session expired. Please log in again.");
      navigate("/login");
    };

    window.addEventListener("auth-refresh-success", handleRefreshSuccess);
    window.addEventListener("auth-unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth-refresh-success", handleRefreshSuccess);
      window.removeEventListener("auth-unauthorized", handleUnauthorized);
    };
  }, [refreshUser, navigate]);

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

export default App;
