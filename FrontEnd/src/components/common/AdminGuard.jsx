import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminGuard = ({ children }) => {
  const { user, setIsAdminMode } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const verifyAdmin = async () => {
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

      if (!cancelled) {
        setIsAdminMode(false);
        window.location.replace('/dashboard');
      }
    };

    verifyAdmin();
    return () => { cancelled = true; };
  }, [user, setIsAdminMode]);

  if (isChecking) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return children;
};

export default AdminGuard;
