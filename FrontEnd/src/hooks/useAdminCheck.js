import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Hook que verifica contra el servidor si el usuario actual es administrador.
 * Si no lo es, ejecuta window.location.replace('/dashboard') inmediatamente.
 * Uso: const { isAdmin, loading } = useAdminCheck();
 */
const useAdminCheck = () => {
  const { user, setIsAdminMode } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      if (!user) {
        setIsAdminMode(false);
        window.location.replace('/dashboard');
        return;
      }

      try {
        const res = await fetch(`/api/admin/check?t=${Date.now()}`);
        if (cancelled) return;

        if (res.ok) {
          const data = await res.json();
          if (data.isAdmin) {
            setIsAdminMode(true);
            setIsAdmin(true);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error('Error verificando admin:', e);
      }

      // No es admin o hubo error
      if (!cancelled) {
        setIsAdminMode(false);
        window.location.replace('/dashboard');
      }
    };

    check();
    return () => { cancelled = true; };
  }, [user, setIsAdminMode]);

  return { isAdmin, loading };
};

export default useAdminCheck;
