import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './DashboardPage.css';

const DashboardPage = () => {

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
                <span className="font-label-sm text-[10px] lg:text-xs px-3 lg:px-4 py-1 lg:py-1.5 bg-[#1a1a1a]/[0.85] backdrop-blur-md text-outline rounded border border-[#FFD700]/30 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full shadow-[0_0_4px_rgba(255,215,0,0.5)]" style={{ backgroundColor: '#FFD700' }}></span>
                  V2
                </span>
              </div>
              <div className="flex-1 flex flex-col gap-3 lg:gap-4 overflow-y-auto pl-1 lg:pl-2 pr-1 lg:pr-2 custom-scrollbar min-h-0">
                {/* Update Item 1 */}
                <div className="update-item group relative pl-4 lg:pl-5 border-l border-outline/20 hover:border-[#FFD700] transition-colors duration-300">
                  <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-none bg-[#131313] border border-outline group-hover:bg-[#FFD700] group-hover:border-[#FFD700] transition-colors duration-300 rotate-45"></div>
                  <span className="font-label-sm text-[10px] lg:text-[11px] tracking-[0.1em] text-outline mb-1 block uppercase text-left">Fase 10 - Gestión de Permisos</span>
                  <h3 className="font-headline-md text-[16px] lg:text-[18px] text-on-surface mb-1 text-left">Roles Jerárquicos</h3>
                  <p className="font-body-lg text-[13px] lg:text-[14px] text-on-surface-variant opacity-80 leading-snug text-left">
                    Soporte para múltiples usuarios operando una unidad bajo los roles de Invitado, Operador, Administrador, Co-Propietario y Propietario.
                  </p>
                </div>
                {/* Update Item 2 */}
                <div className="update-item group relative pl-4 lg:pl-5 border-l border-outline/20 hover:border-[#FFD700] transition-colors duration-300">
                  <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-none bg-[#131313] border border-outline group-hover:bg-[#FFD700] group-hover:border-[#FFD700] transition-colors duration-300 rotate-45"></div>
                  <span className="font-label-sm text-[10px] lg:text-[11px] tracking-[0.1em] text-outline mb-1 block uppercase text-left">Fase 11 - Trazabilidad</span>
                  <h3 className="font-headline-md text-[16px] lg:text-[18px] text-on-surface mb-1 text-left">Monitoreo de Auditoría</h3>
                  <p className="font-body-lg text-[13px] lg:text-[14px] text-on-surface-variant opacity-80 leading-snug text-left">
                    Nuevo panel para administradores con historial de acceso, modificación de unidades y emisión de órdenes registrado y filtrable.
                  </p>
                </div>
                {/* Update Item 3 */}
                <div className="update-item group relative pl-4 lg:pl-5 border-l border-outline/20 hover:border-[#FFD700] transition-colors duration-300">
                  <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-none bg-[#131313] border border-outline group-hover:bg-[#FFD700] group-hover:border-[#FFD700] transition-colors duration-300 rotate-45"></div>
                  <span className="font-label-sm text-[10px] lg:text-[11px] tracking-[0.1em] text-outline mb-1 block uppercase text-left">Fase 12 - UI/UX</span>
                  <h3 className="font-headline-md text-[16px] lg:text-[18px] text-on-surface mb-1 text-left">Componentes y GSAP</h3>
                  <p className="font-body-lg text-[13px] lg:text-[14px] text-on-surface-variant opacity-80 leading-snug text-left">
                    Se han rediseñado los comboboxes y modales de confirmación con menús flotantes estilo oscuro (dark-mode), incluyendo animaciones GSAP sincronizadas.
                  </p>
                </div>
                {/* Update Item 4 */}
                <div className="update-item group relative pl-4 lg:pl-5 border-l border-outline/20 hover:border-[#FFD700] transition-colors duration-300">
                  <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-none bg-[#131313] border border-outline group-hover:bg-[#FFD700] group-hover:border-[#FFD700] transition-colors duration-300 rotate-45"></div>
                  <span className="font-label-sm text-[10px] lg:text-[11px] tracking-[0.1em] text-outline mb-1 block uppercase text-left">Fase 13 - Estructura Interna</span>
                  <h3 className="font-headline-md text-[16px] lg:text-[18px] text-on-surface mb-1 text-left">Separación de Unidades</h3>
                  <p className="font-body-lg text-[13px] lg:text-[14px] text-on-surface-variant opacity-80 leading-snug text-left">
                    Listados estructurados y segregación de datos separando las unidades nativas del usuario de las delegadas/vinculadas.
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
              <div className="flex-1 bg-[#1a1a1a]/[0.85] backdrop-blur-md/50 rounded-md border border-outline/10 p-3 lg:p-5 font-mono text-[#a0a0a0] flex flex-col gap-2.5 lg:gap-4 overflow-y-auto custom-scrollbar text-[12px] lg:text-[14px] text-left lg:mt-2 min-h-0">
                  <div className="dev-note-item flex items-start gap-2.5 lg:gap-3 pb-2.5 lg:pb-4 border-b border-outline/5 hover:text-[#FFD700] transition-colors duration-300 group/note text-left shrink-0">
                    <span className="text-[#FFD700] shrink-0 mt-0.5 opacity-80 group-hover/note:opacity-100 transition-opacity">&lt;/&gt;</span>
                    <span className="leading-tight text-left"><strong className="text-[#FFD700]/90 font-normal">Criptografía SHA-256:</strong> Algoritmos hash implementados en backend para Login/Signup.</span>
                  </div>
                  <div className="dev-note-item flex items-start gap-2.5 lg:gap-3 pb-2.5 lg:pb-4 border-b border-outline/5 hover:text-[#FFD700] transition-colors duration-300 group/note text-left shrink-0">
                    <span className="text-[#FFD700] shrink-0 mt-0.5 opacity-80 group-hover/note:opacity-100 transition-opacity">&lt;/&gt;</span>
                    <span className="leading-tight text-left"><strong className="text-[#FFD700]/90 font-normal">ReentrantReadWriteLock & Semaphores:</strong> Escalabilidad y atomicidad combinadas en backend para proteger recursos críticos.</span>
                  </div>
                  <div className="dev-note-item flex items-start gap-2.5 lg:gap-3 pb-2.5 lg:pb-4 border-b border-outline/5 hover:text-[#FFD700] transition-colors duration-300 group/note text-left shrink-0">
                    <span className="text-[#FFD700] shrink-0 mt-0.5 opacity-80 group-hover/note:opacity-100 transition-opacity">&lt;/&gt;</span>
                    <span className="leading-tight text-left"><strong className="text-[#FFD700]/90 font-normal">Componentes Dropdown UI:</strong> Se descartaron los selectivos nativos en favor de Comboboxes CSS Grid absolutos optimizados.</span>
                  </div>
                  <div className="dev-note-item flex items-start gap-2.5 lg:gap-3 pb-2.5 lg:pb-4 border-b border-outline/5 hover:text-[#FFD700] transition-colors duration-300 group/note text-left shrink-0">
                    <span className="text-[#FFD700] shrink-0 mt-0.5 opacity-80 group-hover/note:opacity-100 transition-opacity">&lt;/&gt;</span>
                    <span className="leading-tight text-left"><strong className="text-[#FFD700]/90 font-normal">GSAP Modals:</strong> Múltiples portales React modales rediseñados con líneas de energía, glow, elásticos.</span>
                  </div>
                  <div className="dev-note-item flex items-start gap-2.5 lg:gap-3 hover:text-[#FFD700] transition-colors duration-300 group/note text-left shrink-0">
                    <span className="text-[#FFD700] shrink-0 mt-0.5 opacity-80 group-hover/note:opacity-100 transition-opacity">&lt;/&gt;</span>
                    <span className="leading-tight text-left"><strong className="text-[#FFD700]/90 font-normal">Auditoría Action-Log:</strong> Interceptor (o capa de servicios) persistiendo interacciones (Email/Acción/Target) globalmente.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
  );
};

export default DashboardPage;
