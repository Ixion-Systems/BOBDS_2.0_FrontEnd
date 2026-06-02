import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLoading } from '../../context/LoadingContext';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerQuickTransition } = useLoading();

  const handleLogout = () => {
    logout();
    triggerQuickTransition(() => navigate('/login'));
  };

  const handleNavigation = (path) => {
    if (location.pathname !== path) {
      triggerQuickTransition(() => navigate(path));
    }
  };

  const isActive = (path) => {
    // Para la ruta de unidades, queremos que siga activa en subrutas (ej. /dashboard/units/register)
    if (path === '/dashboard/units' && location.pathname.startsWith('/dashboard/units')) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Spacer for Sidebar to prevent content overlapping when collapsed */}
      <div className="w-[90px] shrink-0 h-full hidden lg:block z-0"></div>

      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 w-[90px] hover:w-[280px] h-full bg-[#0a0a0a]/95 backdrop-blur-xl border-r border-outline/10 flex flex-col items-center group-hover/sidebar:items-start py-8 z-50 transition-all duration-300 ease-in-out group/sidebar overflow-y-auto overflow-x-hidden shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
        {/* Logo */}
        <div className="mb-12 w-full flex justify-center group-hover/sidebar:justify-start group-hover/sidebar:px-6 transition-all duration-300">
          <div className="flex items-center">
            <img alt="B.O.B.D.S. Logo" className="w-14 h-14 object-contain filter brightness-125 contrast-125 shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCppyL-WygC4QjNBtEJsR5RIXCmZGGk-DDfEjRaOIZmm6u2u-hUG9Lp9FXxOi9-ZS42woIqJOwYlyIpa2L2tyaabCy7zUn_Tt8Bo-utwqJwWyGBZc3DcaMJIwK2RpWnT8jN4JiNV1wGfrUHa5S-5NPEX7ve0GpRURr0qmAk4LvTrjVygnoYtNELr991O2iNk1OVM0HyLEzTnDyU_I3k_YQVzu2c0uC7xbLN1lWJQGVMBxKi0ecjRSB6HiWCWDj1g4wC32zNcU_KNQ8"/>
            <span className="font-display font-bold text-2xl opacity-0 group-hover/sidebar:opacity-100 whitespace-nowrap text-[#e4e2e1] max-w-0 overflow-hidden group-hover/sidebar:max-w-[150px] group-hover/sidebar:ml-4 transition-all duration-300">BOBDS</span>
          </div>
        </div>
        
        {/* Nav Icons */}
        <nav className="flex flex-col gap-6 flex-1 w-full items-center group-hover/sidebar:items-start">
          <button 
            onClick={() => handleNavigation('/dashboard')}
            className="w-full flex items-center justify-center group-hover/sidebar:justify-start px-0 group-hover/sidebar:px-6 py-3 text-outline hover:text-[#FFD700] group/item transition-all duration-300 relative font-cta"
          >
            <span className={`material-symbols-outlined shrink-0 transition-colors ${isActive('/dashboard') ? 'icon-fill text-[#FFD700]' : ''}`}>home</span>
            <span className={`opacity-0 group-hover/sidebar:opacity-100 whitespace-nowrap font-medium max-w-0 overflow-hidden group-hover/sidebar:max-w-[200px] group-hover/sidebar:ml-4 transition-all duration-300 ${isActive('/dashboard') ? 'text-[#FFD700]' : ''}`}>Página Principal</span>
            {isActive('/dashboard') && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FFD700] rounded-r-full shadow-[0_0_8px_rgba(255,215,0,0.4)]"></div>
            )}
          </button>
          <button 
            onClick={() => handleNavigation('/dashboard/units')}
            className="w-full flex items-center justify-center group-hover/sidebar:justify-start px-0 group-hover/sidebar:px-6 py-3 text-outline hover:text-[#FFD700] group/item transition-all duration-300 relative font-cta"
          >
            <span className={`material-symbols-outlined shrink-0 transition-colors ${isActive('/dashboard/units') ? 'icon-fill text-[#FFD700]' : ''}`}>list</span>
            <span className={`opacity-0 group-hover/sidebar:opacity-100 whitespace-nowrap font-medium max-w-0 overflow-hidden group-hover/sidebar:max-w-[200px] group-hover/sidebar:ml-4 transition-all duration-300 ${isActive('/dashboard/units') ? 'text-[#FFD700]' : ''}`}>Listado de Unidades</span>
            {isActive('/dashboard/units') && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FFD700] rounded-r-full shadow-[0_0_8px_rgba(255,215,0,0.4)]"></div>
            )}
          </button>
          <button 
            onClick={() => handleNavigation('/dashboard/write-order')}
            className="w-full flex items-center justify-center group-hover/sidebar:justify-start px-0 group-hover/sidebar:px-6 py-3 text-outline hover:text-[#FFD700] group/item transition-all duration-300 relative font-cta"
          >
            <span className={`material-symbols-outlined shrink-0 transition-colors ${isActive('/dashboard/write-order') ? 'icon-fill text-[#FFD700]' : ''}`}>add_circle</span>
            <span className={`opacity-0 group-hover/sidebar:opacity-100 whitespace-nowrap font-medium max-w-0 overflow-hidden group-hover/sidebar:max-w-[200px] group-hover/sidebar:ml-4 transition-all duration-300 ${isActive('/dashboard/write-order') ? 'text-[#FFD700]' : ''}`}>Redactar una Orden</span>
            {isActive('/dashboard/write-order') && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FFD700] rounded-r-full shadow-[0_0_8px_rgba(255,215,0,0.4)]"></div>
            )}
          </button>
          <button className="w-full flex items-center justify-center group-hover/sidebar:justify-start px-0 group-hover/sidebar:px-6 py-3 text-outline hover:text-[#FFD700] group/item transition-all duration-300 font-cta">
            <span className="material-symbols-outlined shrink-0">history</span>
            <span className="opacity-0 group-hover/sidebar:opacity-100 whitespace-nowrap max-w-0 overflow-hidden group-hover/sidebar:max-w-[200px] group-hover/sidebar:ml-4 transition-all duration-300">Historial de Órdenes</span>
          </button>
          <button className="w-full flex items-center justify-center group-hover/sidebar:justify-start px-0 group-hover/sidebar:px-6 py-3 text-outline hover:text-[#FFD700] group/item transition-all duration-300 font-cta">
            <span className="material-symbols-outlined shrink-0">group</span>
            <span className="opacity-0 group-hover/sidebar:opacity-100 whitespace-nowrap max-w-0 overflow-hidden group-hover/sidebar:max-w-[200px] group-hover/sidebar:ml-4 transition-all duration-300">Usuarios Vinculados</span>
          </button>
        </nav>
        
        {/* Settings / Logout */}
        <div className="w-full mt-auto mb-4 flex flex-col gap-2">
          <button className="w-full flex items-center justify-center group-hover/sidebar:justify-start px-0 group-hover/sidebar:px-6 py-3 text-outline hover:text-[#FFD700] group/item transition-all duration-300 font-cta">
            <span className="material-symbols-outlined shrink-0">settings</span>
            <span className="opacity-0 group-hover/sidebar:opacity-100 whitespace-nowrap max-w-0 overflow-hidden group-hover/sidebar:max-w-[200px] group-hover/sidebar:ml-4 transition-all duration-300">Ajustes</span>
          </button>
          <button onClick={handleLogout} className="w-full flex items-center justify-center group-hover/sidebar:justify-start px-0 group-hover/sidebar:px-6 py-3 text-outline hover:text-red-500 group/item transition-all duration-300 font-cta">
            <span className="material-symbols-outlined shrink-0">logout</span>
            <span className="opacity-0 group-hover/sidebar:opacity-100 whitespace-nowrap max-w-0 overflow-hidden group-hover/sidebar:max-w-[200px] group-hover/sidebar:ml-4 transition-all duration-300">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
