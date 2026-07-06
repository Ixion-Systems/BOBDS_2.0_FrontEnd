import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageLoader from './PageLoader';

const AdminRoute = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isVerifiedAdmin, setIsVerifiedAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      // 1. Si no hay usuario o su flag local es falsa, ni siquiera consultamos a la DB.
      if (!user || !user.isAdmin) {
        setLoading(false);
        navigate('/dashboard', { replace: true });
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
            setLoading(false);
            return; // OK, it's an admin
          }
        }
      } catch (error) {
        console.error("Error verificando admin en la BD:", error);
      } 
      
      // If we reach here, verification failed or user is not admin
      setLoading(false);
      navigate('/dashboard', { replace: true });
    };
    
    checkAdmin();
  }, [user, navigate]);

  if (loading) {
    return <PageLoader />;
  }

  // Si después de todo no es admin verificado, devolvemos null porque el useEffect ya hizo el navigate
  if (!isVerifiedAdmin) {
    return null;
  }

  return <Outlet />;
};

export default AdminRoute;
