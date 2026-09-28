import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles = ['ROLE_ADMIN'],
  redirectPath = '/login',
}) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    return <Navigate to={redirectPath} replace />;
  }

  try {
    const user = JSON.parse(userStr);
    if (allowedRoles && !allowedRoles.includes(user.rol)) {
      return <Navigate to="/" replace />;
    }
  } catch {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
