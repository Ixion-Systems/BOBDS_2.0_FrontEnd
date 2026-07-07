import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
  const { user, setIsAdminMode } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const verifyAdmin = async () => {
      // Sin usuario en contexto, expulsar
      if (!user) {
        setIsAdminMode(false);
        window.location.replace('/dashboard');
        return;
      }

      try {
        const response = await fetch(`/api/admin/check?t=${Date.now()}`);
        if (cancelled) return;

        if (response.ok) {
          const data = await response.json();
          if (data.isAdmin) {
            setIsAdminMode(true);
            setIsAuthorized(true);
            setIsChecking(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error verificando admin:", error);
      }

      // Si llegamos aquí, no es admin - redirección dura del navegador
      if (!cancelled) {
        setIsAdminMode(false);
        window.location.replace('/dashboard');
      }
    };

    verifyAdmin();
    return () => { cancelled = true; };
  }, [user, setIsAdminMode]);

  // Mientras verifica, mostrar spinner simple
  if (isChecking) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Seguridad adicional: si no está autorizado, no renderizar nada
  if (!isAuthorized) {
    return null;
  }

  return <Outlet />;
};

export default AdminRoute;
