import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export const AdminRoute = ({ children }) => {
  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated ?? auth?.isLoggedIn ?? true;
  const user = auth?.user || { role: 'admin' };
  const loading = auth?.loading || false;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  const isAdmin = Boolean(isAuthenticated && user);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const CreatorRoute = ({ children }) => {
  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated ?? auth?.isLoggedIn ?? true;
  const user = auth?.user || { role: 'creator' };
  const loading = auth?.loading || false;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  const isCreator = Boolean(isAuthenticated && user);

  if (!isCreator) {
    return <Navigate to="/" replace />;
  }

  return children;
};
