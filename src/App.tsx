// front_end/src/App.tsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import ThemeToggle from "./context/ThemeToggle"; // ✅ Theme toggle

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import ChildProfilePage from "./pages/Profile"; // Optional route

// 👤 Guest-only route wrapper
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to="/chat" replace />;
  return <>{children}</>;
};

// 🔐 Authenticated-only route wrapper
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text transition-colors duration-300">
          <header className="p-4 flex justify-between items-center">
            <Header />
            <ThemeToggle /> {/* 🌓 Theme switcher in the header */}
          </header>

          <main className="flex-grow p-4 bg-gray-50 dark:bg-gray-900">
            <Routes>
              {/* Public (guest-only) routes */}
              <Route path="/" element={<GuestRoute><Home /></GuestRoute>} />
              <Route path="/home" element={<GuestRoute><Home /></GuestRoute>} />
              <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

              {/* Semi-public routes */}
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Authenticated-only routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/child-profiles/:childId" element={<ChildProfilePage />} />
              </Route>

              {/* Catch-all fallback */}
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
