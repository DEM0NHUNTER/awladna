//src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";

import Header from "./components/layout/Header";
import Navbar from "./components/layout/Navbar";

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
import Feedback from "./pages/Feedback";

// Layout wrapper for routes with Navbar
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Navbar />
    <main className="flex-grow bg-gray-50 p-4">{children}</main>
  </>
);

// Main App Component
const App: React.FC = () => {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* Public routes */}
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

            {/* Protected/layout routes */}
            <Route
              path="/"
              element={
                <MainLayout>
                  <Login />
                </MainLayout>
              }
            />
            <Route
              path="/home"
              element={
                <MainLayout>
                  <Home />
                </MainLayout>
              }
            />
            <Route
              path="/dashboard"
              element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              }
            />
            <Route
              path="/verify-email"
              element={
                <MainLayout>
                  <VerifyEmail />
                </MainLayout>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <MainLayout>
                  <ForgotPassword />
                </MainLayout>
              }
            />
            <Route
              path="/reset-password"
              element={
                <MainLayout>
                  <ResetPassword />
                </MainLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <MainLayout>
                  <Profile />
                </MainLayout>
              }
            />
            <Route
              path="/chat"
              element={
                <MainLayout>
                  <Chat />
                </MainLayout>
              }
            />
            <Route
              path="/child-profiles/:childId"
              element={
                <MainLayout>
                  <ChildProfilePage />
                </MainLayout>
              }
            />
            <Route
              path="/feedback"
              element={
                <MainLayout>
                  <Feedback />
                </MainLayout>
              }
            />
            {/* Redirect unmatched routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </ErrorBoundary>
    </AuthProvider>
  );
};

export default App;
