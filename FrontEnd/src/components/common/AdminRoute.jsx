import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageLoader from './PageLoader';

const AdminRoute = () => {
  const { user } = useAuth();
  const [isVerifiedAdmin, setIsVerifiedAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      // 1. Si no hay usuario o su flag local es falsa, ni siquiera consultamos a la DB.
      if (!user || !user.isAdmin) {
        setLoading(false);
        return;
      }

      // 2. Si dice ser admin localmente, lo verificamos en vivo contra la base de datos
      try {
        const response = await fetch('/api/admin/users');
        if (response.ok) {
          const users = await response.json();
          const currentUser = users.find(u => u.Email === (user.email || user.Email));
          
          if (currentUser && currentUser.isAdmin) {
            setIsVerifiedAdmin(true);
          }
        }
      } catch (error) {
        console.error("Error verificando admin en la BD:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAdmin();
  }, [user]);

  if (loading) {
    return <PageLoader />;
  }

  // Si después de todo no es admin verificado, lo expulsamos al dashboard
  if (!isVerifiedAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
