import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const { user, isAdminMode, setIsAdminMode } = useAuth();
  const { triggerOrbitalTransition } = useLoading();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if current user is admin by fetching all users
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (response.ok) {
          const users = await response.json();
          const currentUser = users.find(u => u.Email === user?.email);
          if (currentUser && currentUser.isAdmin) {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [user]);

  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
    if (!isAdminMode) {
      triggerOrbitalTransition(() => navigate('/dashboard/admin'));
    } else {
      triggerOrbitalTransition(() => navigate('/dashboard'));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">Ajustes</h1>
        <p className="text-outline mt-2 font-body text-lg">Configuración de tu cuenta y preferencias del sistema.</p>
      </div>

      <div className="bg-[#121212]/[0.85] backdrop-blur-md rounded-2xl border border-outline/10 p-6 flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-display font-semibold text-white mb-2">Perfil</h2>
          <p className="text-outline">Sesión iniciada como: <span className="text-[#FFD700]">{user?.email}</span></p>
        </div>

        {loading ? (
          <p className="text-outline">Cargando permisos...</p>
        ) : (
          isAdmin && (
            <div className="border-t border-outline/10 pt-6">
              <h2 className="text-2xl font-display font-semibold text-white mb-4">Opciones de Administrador</h2>
              <div className="bg-[#1a1a1a]/[0.85] backdrop-blur-md p-4 rounded-xl border border-[#FFD700]/20 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium text-lg">Panel de Administración</h3>
                  <p className="text-outline text-sm">Accede a las herramientas de monitoreo y control de usuarios.</p>
                </div>
                <button
                  onClick={toggleAdminMode}
                  className="bg-[#FFD700] text-black font-semibold py-2 px-6 rounded-lg hover:bg-[#e6c200] transition-colors shadow-[0_0_15px_rgba(255,215,0,0.3)] font-cta whitespace-nowrap"
                >
                  {isAdminMode ? 'Salir del Panel Admin' : 'Panel Admin'}
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
