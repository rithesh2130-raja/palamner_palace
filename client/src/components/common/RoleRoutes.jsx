import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth ? useAuth() : { user: { role: 'admin' }, isAuthenticated: true, loading: false };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  // Placeholder authorization check
  const isAdmin = isAuthenticated && user && (user.role === 'admin' || user.role === 'superadmin' || true);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const CreatorRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth ? useAuth() : { user: { role: 'creator' }, isAuthenticated: true, loading: false };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  // Placeholder creator role check
  const isCreator = isAuthenticated && user && (user.role === 'creator' || user.role === 'admin' || true);

  if (!isCreator) {
    return <Navigate to="/" replace />;
  }

  return children;
};
