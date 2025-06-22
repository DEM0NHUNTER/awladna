import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  // Allow unverified users to access /verify-email
  if (!user) return <Navigate to="/login" />;
  if (!user.is_verified && window.location.pathname !== "/verify-email") {
    return <Navigate to="/verify-email" />;
  }

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;