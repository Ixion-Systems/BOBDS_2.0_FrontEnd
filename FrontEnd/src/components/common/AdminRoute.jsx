import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
  const { user, setIsAdminMode } = useAuth();
  const [status, setStatus] = useState('loading'); // 'loading' | 'authorized' | 'denied'

  useEffect(() => {
    let cancelled = false;

    const verifyAdmin = async () => {
      // Sin usuario en contexto, denegar inmediatamente
      if (!user) {
        if (!cancelled) {
          setIsAdminMode(false);
          setStatus('denied');
        }
        return;
      }

      try {
        const response = await fetch(`/api/admin/check?t=${Date.now()}`);
        if (!cancelled) {
          if (response.ok) {
            const data = await response.json();
            if (data.isAdmin) {
              setIsAdminMode(true);
              setStatus('authorized');
            } else {
              setIsAdminMode(false);
              setStatus('denied');
            }
          } else {
            setIsAdminMode(false);
            setStatus('denied');
          }
        }
      } catch (error) {
        console.error("Error verificando admin:", error);
        if (!cancelled) {
          setIsAdminMode(false);
          setStatus('denied');
        }
      }
    };

    verifyAdmin();
    return () => { cancelled = true; };
  }, [user, setIsAdminMode]);

  if (status === 'loading') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === 'denied') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
