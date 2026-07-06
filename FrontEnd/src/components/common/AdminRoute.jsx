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
      // 1. Si no hay usuario en contexto, redirigimos
      if (!user) {
        setLoading(false);
        navigate('/dashboard', { replace: true });
        return;
      }

      // 2. Verificamos en vivo contra la base de datos con el endpoint ligero
      try {
        const response = await fetch('/api/admin/check');
        if (response.ok) {
          const data = await response.json();
          if (data.isAdmin) {
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
