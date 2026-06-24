import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || !user.isAdmin) {
    // Si no es admin, lo expulsamos al dashboard normal
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
