import React, { useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { triggerQuickTransition } = useLoading();

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const panel1Ref = useRef(null);
  const panel2Ref = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo(headerRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
      .fromTo(panel1Ref.current, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, "-=0.4")
      .fromTo(panel2Ref.current, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, "-=0.6");
    
    gsap.fromTo('.update-item', { opacity: 0, x: -15 }, { opacity: 1, x: 0, stagger: 0.15, duration: 0.5, ease: 'power2.out', delay: 0.6 });
    gsap.fromTo('.dev-note-item', { opacity: 0, x: -15 }, { opacity: 1, x: 0, stagger: 0.1, duration: 0.4, ease: 'power2.out', delay: 0.8 });
  }, { scope: containerRef });

  const handleLogout = () => {
    logout();
    triggerQuickTransition(() => navigate('/login'));
  };

  return (
    <div className="bg-surface-container-lowest text-on-surface h-[100dvh] w-full overflow-hidden flex font-body-lg antialiased selection:bg-surface-variant selection:text-[#FFD700]" style={{ backgroundColor: '#0c0c0c' }}>
      {/* Geometric Animated Background */}
      <div className="bg-geo-wrapper w-full h-full absolute inset-0 overflow-hidden">
        <div className="geo-polygon geo-hex top-1/4 left-[20%] scale-[1.5] opacity-[0.35]" style={{ animationDuration: '90s', borderColor: 'rgba(255, 215, 0, 0.15)' }}></div>
        <div className="geo-polygon geo-triangle top-[60%] left-[80%] scale-[2] opacity-[0.3]" style={{ animationDirection: 'reverse', animationDuration: '110s', borderColor: 'rgba(255, 215, 0, 0.12)' }}></div>
        <div className="geo-polygon geo-hex w-[1400px] h-[1600px] top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '-30s', opacity: 0.25, borderColor: 'rgba(255, 215, 0, 0.1)' }}></div>
        <div className="geo-polygon geo-diamond top-[75%] left-[25%] w-[800px] h-[800px] opacity-[0.2]" style={{ animationDuration: '65s', border: '1px dashed rgba(255,215,0,0.2)' }}></div>
        <div className="geo-polygon geo-triangle top-[10%] left-[65%] w-[600px] h-[600px] opacity-[0.35]" style={{ animationDirection: 'reverse', animationDuration: '55s', animationDelay: '-15s', borderColor: 'rgba(255, 215, 0, 0.15)' }}></div>
      </div>
      
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
          <button className="w-full flex items-center justify-center group-hover/sidebar:justify-start px-0 group-hover/sidebar:px-6 py-3 text-primary group/item transition-all duration-300 relative font-cta">
            <span className="material-symbols-outlined icon-fill shrink-0" style={{ color: '#FFD700' }}>home</span>
            <span className="opacity-0 group-hover/sidebar:opacity-100 whitespace-nowrap font-medium max-w-0 overflow-hidden group-hover/sidebar:max-w-[200px] group-hover/sidebar:ml-4 transition-all duration-300" style={{ color: '#FFD700' }}>Página Principal</span>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FFD700] rounded-r-full shadow-[0_0_8px_rgba(255,215,0,0.4)]"></div>
          </button>
          <button className="w-full flex items-center justify-center group-hover/sidebar:justify-start px-0 group-hover/sidebar:px-6 py-3 text-outline hover:text-[#FFD700] group/item transition-all duration-300 font-cta">
            <span className="material-symbols-outlined shrink-0">list</span>
            <span className="opacity-0 group-hover/sidebar:opacity-100 whitespace-nowrap max-w-0 overflow-hidden group-hover/sidebar:max-w-[200px] group-hover/sidebar:ml-4 transition-all duration-300">Listado de Unidades</span>
          </button>
          <button className="w-full flex items-center justify-center group-hover/sidebar:justify-start px-0 group-hover/sidebar:px-6 py-3 text-outline hover:text-[#FFD700] group/item transition-all duration-300 font-cta">
            <span className="material-symbols-outlined shrink-0">add_circle</span>
            <span className="opacity-0 group-hover/sidebar:opacity-100 whitespace-nowrap max-w-0 overflow-hidden group-hover/sidebar:max-w-[200px] group-hover/sidebar:ml-4 transition-all duration-300">Redactar una Orden</span>
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
      
      {/* Main Workspace */}
      <main ref={containerRef} className="flex-1 h-full overflow-y-auto lg:overflow-hidden relative z-10 flex items-center justify-center p-6 pl-[110px] lg:pl-8 lg:p-8 w-full max-w-full lg:max-w-[calc(100vw-90px)]">
        <div className="max-w-7xl w-full min-h-max lg:h-full mx-auto flex flex-col gap-6 lg:gap-10 items-center justify-center py-12 lg:py-0">
          {/* Header Section */}
          <header ref={headerRef} className="text-center w-full">
            <h1 className="font-display text-[32px] md:text-[48px] lg:text-[64px] font-bold text-on-surface leading-[1.1] tracking-tight">
              Bienvenido a BOBDS<br/>
              <span className="text-[#FFD700] text-glow inline-block mt-1 lg:mt-3 text-[20px] md:text-[32px] lg:text-[40px]">¿Listo para Empezar?</span>
            </h1>
          </header>
          
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-stretch w-full flex-1 max-h-none lg:max-h-[60vh]">
            {/* Updates Panel */}
            <div ref={panel1Ref} className="glass-panel-dashboard rounded-[0.25rem] p-5 lg:p-8 flex flex-col lg:h-full overflow-hidden">
              <div className="flex justify-between items-start mb-4 lg:mb-6 border-b border-outline/10 pb-3 lg:pb-4 shrink-0">
                <div className="flex items-center gap-3 lg:gap-4">
                  <span className="material-symbols-outlined text-[#FFD700] text-xl lg:text-3xl">campaign</span>
                  <h2 className="font-headline-md text-lg lg:text-[24px] text-on-surface tracking-wide">Tablón de Actualizaciones</h2>
                </div>
                <span className="font-label-sm text-[10px] lg:text-xs px-3 lg:px-4 py-1 lg:py-1.5 bg-[#1a1a1a] text-outline rounded border border-[#FFD700]/30 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full shadow-[0_0_4px_rgba(255,215,0,0.5)]" style={{ backgroundColor: '#FFD700' }}></span>
                  V1
                </span>
              </div>
              <div className="flex-1 flex flex-col gap-3 lg:gap-4 overflow-y-auto pl-1 lg:pl-2 pr-1 lg:pr-2 custom-scrollbar min-h-0">
                {/* Update Item 1 */}
                <div className="update-item group relative pl-4 lg:pl-5 border-l border-outline/20 hover:border-[#FFD700] transition-colors duration-300">
                  <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-none bg-[#131313] border border-outline group-hover:bg-[#FFD700] group-hover:border-[#FFD700] transition-colors duration-300 rotate-45"></div>
                  <span className="font-label-sm text-[10px] lg:text-[11px] tracking-[0.1em] text-outline mb-1 block uppercase text-left">Fase 1 - Landing Page</span>
                  <h3 className="font-headline-md text-[16px] lg:text-[18px] text-on-surface mb-1 text-left">Presentación Inmersiva</h3>
                  <p className="font-body-lg text-[13px] lg:text-[14px] text-on-surface-variant opacity-80 leading-snug text-left">
                    Se desarrolló la web de inicio con un diseño interactivo, animaciones fluidas y estética Glassmorphism moderna.
                  </p>
                </div>
                {/* Update Item 2 */}
                <div className="update-item group relative pl-4 lg:pl-5 border-l border-outline/20 hover:border-[#FFD700] transition-colors duration-300">
                  <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-none bg-[#131313] border border-outline group-hover:bg-[#FFD700] group-hover:border-[#FFD700] transition-colors duration-300 rotate-45"></div>
                  <span className="font-label-sm text-[10px] lg:text-[11px] tracking-[0.1em] text-outline mb-1 block uppercase text-left">Fase 2 - Verificación y Acceso</span>
                  <h3 className="font-headline-md text-[16px] lg:text-[18px] text-on-surface mb-1 text-left">Identidad Segura</h3>
                  <p className="font-body-lg text-[13px] lg:text-[14px] text-on-surface-variant opacity-80 leading-snug text-left">
                    El sistema ahora cuenta con un Log In robusto y validación de doble factor (2FA) a través de correo electrónico.
                  </p>
                </div>
                {/* Update Item 3 */}
                <div className="update-item group relative pl-4 lg:pl-5 border-l border-outline/20 hover:border-[#FFD700] transition-colors duration-300">
                  <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-none bg-[#131313] border border-outline group-hover:bg-[#FFD700] group-hover:border-[#FFD700] transition-colors duration-300 rotate-45"></div>
                  <span className="font-label-sm text-[10px] lg:text-[11px] tracking-[0.1em] text-outline mb-1 block uppercase text-left">Fase 3 - Aplicativo</span>
                  <h3 className="font-headline-md text-[16px] lg:text-[18px] text-on-surface mb-1 text-left">Centro de Mando Activo</h3>
                  <p className="font-body-lg text-[13px] lg:text-[14px] text-on-surface-variant opacity-80 leading-snug text-left">
                    El Dashboard centraliza operaciones. Sus rutas protegidas garantizan que solo el personal autorizado pueda acceder.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Dev Notes Panel */}
            <div ref={panel2Ref} className="glass-panel-dashboard rounded-[0.25rem] p-5 lg:p-8 flex flex-col lg:h-full overflow-hidden">
              <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6 border-b border-outline/10 pb-3 lg:pb-4 shrink-0">
                <span className="material-symbols-outlined text-[#FFD700] text-xl lg:text-3xl">code</span>
                <h2 className="font-headline-md text-lg lg:text-[24px] text-on-surface tracking-wide">Notas del Desarrollador</h2>
              </div>
              <div className="flex-1 bg-[#1a1a1a]/50 rounded-md border border-outline/10 p-3 lg:p-5 font-mono text-[#a0a0a0] flex flex-col gap-2.5 lg:gap-4 overflow-y-auto custom-scrollbar text-[12px] lg:text-[14px] text-left lg:mt-2 min-h-0">
                  <div className="dev-note-item flex items-start gap-2.5 lg:gap-3 pb-2.5 lg:pb-4 border-b border-outline/5 hover:text-[#FFD700] transition-colors duration-300 group/note text-left shrink-0">
                    <span className="text-[#FFD700] shrink-0 mt-0.5 opacity-80 group-hover/note:opacity-100 transition-opacity">&lt;/&gt;</span>
                    <span className="leading-tight text-left"><strong className="text-[#FFD700]/90 font-normal">Java Spring Boot:</strong> Servicio SMTP configurado para correos electrónicos.</span>
                  </div>
                  <div className="dev-note-item flex items-start gap-2.5 lg:gap-3 pb-2.5 lg:pb-4 border-b border-outline/5 hover:text-[#FFD700] transition-colors duration-300 group/note text-left shrink-0">
                    <span className="text-[#FFD700] shrink-0 mt-0.5 opacity-80 group-hover/note:opacity-100 transition-opacity">&lt;/&gt;</span>
                    <span className="leading-tight text-left"><strong className="text-[#FFD700]/90 font-normal">React Router v6:</strong> Uso de ProtectedRoute previniendo renderizados ilegales.</span>
                  </div>
                  <div className="dev-note-item flex items-start gap-2.5 lg:gap-3 pb-2.5 lg:pb-4 border-b border-outline/5 hover:text-[#FFD700] transition-colors duration-300 group/note text-left shrink-0">
                    <span className="text-[#FFD700] shrink-0 mt-0.5 opacity-80 group-hover/note:opacity-100 transition-opacity">&lt;/&gt;</span>
                    <span className="leading-tight text-left"><strong className="text-[#FFD700]/90 font-normal">AuthContext:</strong> Bifurcación entre localStorage y sessionStorage funcional.</span>
                  </div>
                  <div className="dev-note-item flex items-start gap-2.5 lg:gap-3 pb-2.5 lg:pb-4 border-b border-outline/5 hover:text-[#FFD700] transition-colors duration-300 group/note text-left shrink-0">
                    <span className="text-[#FFD700] shrink-0 mt-0.5 opacity-80 group-hover/note:opacity-100 transition-opacity">&lt;/&gt;</span>
                    <span className="leading-tight text-left"><strong className="text-[#FFD700]/90 font-normal">Jackson JSON:</strong> Implementación de @JsonInclude para ofuscación de Tokens.</span>
                  </div>
                  <div className="dev-note-item flex items-start gap-2.5 lg:gap-3 pb-2.5 lg:pb-4 border-b border-outline/5 hover:text-[#FFD700] transition-colors duration-300 group/note text-left shrink-0">
                    <span className="text-[#FFD700] shrink-0 mt-0.5 opacity-80 group-hover/note:opacity-100 transition-opacity">&lt;/&gt;</span>
                    <span className="leading-tight text-left"><strong className="text-[#FFD700]/90 font-normal">GSAP 3:</strong> Integrado timeline management para micro-interacciones.</span>
                  </div>
                  <div className="dev-note-item flex items-start gap-2.5 lg:gap-3 hover:text-[#FFD700] transition-colors duration-300 group/note text-left shrink-0">
                    <span className="text-[#FFD700] shrink-0 mt-0.5 opacity-80 group-hover/note:opacity-100 transition-opacity">&lt;/&gt;</span>
                    <span className="leading-tight text-left"><strong className="text-[#FFD700]/90 font-normal">TailwindCSS:</strong> Sistema de diseño Glassmorphism estructurado globalmente.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
};

export default DashboardPage;
