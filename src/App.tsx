// front_end/src/App.tsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/layout/Header";
import Navbar from "./components/layout/Navbar";

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
import Feedback from './pages/Feedback';

// Main App Component
const App: React.FC = () => {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* All routes accessible without authentication */}
            <Route
              path="/login"
              element={
                <main className="flex-grow bg-gray-50 p-4">
                  <Login />
                </main>
              }
            />
            <Route
              path="/register"
              element={
                <main className="flex-grow bg-gray-50 p-4">
                  <Register />
                </main>
              }
            />
            {/* All other routes with Navbar */}
            <Route
              path="*"
              element={
                <>
                  <Navbar />
          <main className="flex-grow bg-gray-50 p-4">
            <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/home" element={<Home />} />
                      <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/profile" element={<Profile />} />
                      <Route path="/chat" element={<Chat />} />
                <Route path="/child-profiles/:childId" element={<ChildProfilePage />} />
                <Route path="/feedback" element={<Feedback />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
                </>
              }
            />
          </Routes>
        </div>
      </ErrorBoundary>
    </AuthProvider>
  );
};

export default App;