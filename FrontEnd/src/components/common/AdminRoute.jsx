import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageLoader from './PageLoader';

const AdminRoute = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/users/all');
        if (response.ok) {
          const users = await response.json();
          // El email puede venir en user.email o user.Email dependiendo del origen
          const currentUser = users.find(u => u.Email === (user.email || user.Email));
          if (currentUser && currentUser.isAdmin) {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error("Error verificando admin:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [user]);

  if (loading) {
    return <PageLoader />;
  }

  if (!user || !isAdmin) {
    // Si no es admin, lo expulsamos al dashboard normal
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
