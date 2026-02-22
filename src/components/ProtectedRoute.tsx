import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('employer' | 'jobseeker')[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const currentUser = useStore((state) => state.currentUser);
  const authLoading = useStore((state) => state.authLoading);
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
