// front_end/src/App.tsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import ChildProfilePage from "./pages/Profile";

// Guest and Protected Route Wrappers
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to="/chat" replace />;
  return <>{children}</>;
};

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

// Main App Component
const App: React.FC = () => {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow bg-gray-50 p-4">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<GuestRoute><Home /></GuestRoute>} />
              <Route path="/home" element={<GuestRoute><Home /></GuestRoute>} />
              <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/Chat" element={<Chat />} />
                <Route path="/child-profiles/:childId" element={<ChildProfilePage />} />
              </Route>

              {/* Fallback for unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ErrorBoundary>
    </AuthProvider>
  );
};

export default App;