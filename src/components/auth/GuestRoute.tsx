// front_end/src/components/auth/GuestRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to="/chat" replace />;

  return <>{children}</>;
};

export default GuestRoute;