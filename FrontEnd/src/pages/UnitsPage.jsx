import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Mock Data simulando respuesta del servidor
const mockUnits = [
  { idUnidad: 'U-001', nombre: 'Robot Alpha', estado: 'ACTIVO', rol: 'Propietario' },
  { idUnidad: 'U-002', nombre: 'Robot Beta', estado: 'INACTIVO', rol: 'Invitado' },
  { idUnidad: 'U-003', nombre: 'Brazo Robot X1', estado: 'ACTIVO', rol: 'Operador' },
  { idUnidad: 'U-004', nombre: 'Dron Recon', estado: 'INACTIVO', rol: 'Administrador' },
  { idUnidad: 'U-005', nombre: 'Rover de Carga', estado: 'ACTIVO', rol: 'Co-Propietario' },
  { idUnidad: 'U-006', nombre: 'Sistema Defensa', estado: 'INACTIVO', rol: 'Operador' },
];

const getRoleColor = (rol) => {
  switch (rol) {
    case 'Invitado': return 'bg-white/5 border-white/10 text-on-surface opacity-80';
    case 'Operador': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
    case 'Administrador': return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
    case 'Co-Propietario': return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
    case 'Propietario': return 'bg-[#FFD700]/10 border-[#FFD700]/20 text-[#FFD700]';
    default: return 'bg-white/5 border-white/10 text-on-surface';
  }
};

const roleWeights = {
  'Propietario': 5,
  'Co-Propietario': 4,
  'Administrador': 3,
  'Operador': 2,
  'Invitado': 1
};

const UnitsPage = () => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();

  useGSAP(() => {
    const tl = gsap.timeline();
    
    // Animar Header
    tl.fromTo(headerRef.current, 
      { y: -30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
    
    // Animar Cards en Stagger
    tl.fromTo('.unit-card', 
      { y: 40, opacity: 0 }, 
      { y: 0, opacity: 1, stagger: 0.15, duration: 0.6, ease: 'power2.out' }, 
      "-=0.4"
    );
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="flex-1 h-[100dvh] overflow-hidden relative z-10 p-8 lg:p-12 pt-16 ml-[90px] w-[calc(100%-90px)] flex flex-col">
      <div className="max-w-6xl mx-auto flex flex-col h-full w-full">
        {/* Header Area */}
        <header ref={headerRef} className="w-full shrink-0 flex flex-col">
          <div className="flex justify-end mb-12">
            <div className="text-right">
              <h2 className="font-display text-[56px] font-bold text-on-surface tracking-tighter opacity-90 uppercase leading-none">
                Lista de Unidades
              </h2>
              <div className="h-1.5 w-48 bg-[#FFD700] ml-auto mt-4 rounded-full shadow-[0_0_15px_#FFD700]"></div>
            </div>
          </div>
          
          <div className="flex gap-6 mb-8">
            <button 
              onClick={() => navigate('/dashboard/units/register')}
              className="px-10 py-4 bg-[#FFD700]/10 border border-[#FFD700]/50 text-[#FFD700] font-cta rounded-lg hover:bg-[#FFD700] hover:text-black transition-all duration-300 active:scale-95 shadow-[0_0_15px_rgba(255,215,0,0.15)] hover:shadow-[0_0_25px_rgba(255,215,0,0.4)] uppercase tracking-[0.15em] text-sm font-bold flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Registrar Unidad
            </button>
            <button className="px-10 py-4 bg-[#1a1a1a]/60 border border-outline/30 text-on-surface font-cta rounded-lg hover:border-outline/80 hover:bg-[#2a2a2a]/80 transition-all duration-300 active:scale-95 shadow-xl uppercase tracking-[0.15em] text-sm font-bold flex items-center gap-3">
              <span className="material-symbols-outlined text-lg">link</span>
              Vincular Unidad
            </button>
          </div>
        </header>

        {/* Unit List Content (Scrollable Area) */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-12 pr-4 custom-scrollbar">
          
          {[...mockUnits].sort((a, b) => roleWeights[b.rol] - roleWeights[a.rol]).map((unit) => {
            const isActive = unit.estado === 'ACTIVO';
            const roleColorClass = getRoleColor(unit.rol);
            
            // Reglas de botones
            const canModify = unit.rol !== 'Invitado';
            const canDelete = !['Invitado', 'Operador'].includes(unit.rol);

            return (
              <div key={unit.idUnidad} className={`unit-card glass-panel group overflow-hidden p-4 px-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,215,0,0.08)] border border-[rgba(255,215,0,0.1)] border-l-4 rounded-xl backdrop-blur-md ${isActive ? 'bg-[#131313]/85 border-l-[#FFD700]' : 'bg-[#131313]/60 border-l-outline/30 opacity-80 hover:opacity-100'}`}>
                {/* 
                  Uso de CSS Grid para alinear columnas a la izquierda.
                  1ra col: Nombre (ocupa máx 250px o se adapta)
                  2da col: Estado (ocupa aprox 180px)
                  3ra col: Rol (ocupa aprox 200px)
                  4ta col: Botones (ocupa el espacio restante y empuja su contenido a la derecha mediante justify-self-end)
                */}
                <div className="grid grid-cols-[250px_180px_200px_1fr] items-center gap-4 w-full">
                  
                  {/* Nombre */}
                  <h3 
                    title={unit.nombre}
                    className={`font-display text-2xl group-hover:translate-x-2 transition-transform duration-300 font-bold pr-4 text-left ${isActive ? 'text-[#FFD700]' : 'text-on-surface'}`}
                  >
                    {unit.nombre.substring(0, 15)}
                  </h3>
                  
                  {/* Estado */}
                  <div className="flex items-center gap-3">
                    <span className="font-body-md text-on-surface-variant text-[11px] uppercase tracking-widest opacity-60">Estado:</span>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${isActive ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 shadow-[0_0_5px_#34d399]' : 'bg-red-500 shadow-[0_0_5px_#ef4444]'}`}></span>
                      <span className={`font-headline-md text-xs uppercase tracking-widest ${isActive ? 'text-emerald-400' : 'text-red-500'}`}>
                        {unit.estado}
                      </span>
                    </div>
                  </div>
                  
                  {/* Rol */}
                  <div className="flex items-center gap-3">
                    <span className="font-body-md text-on-surface-variant text-[11px] uppercase tracking-widest opacity-60">Rol:</span>
                    <span className={`font-headline-md text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${roleColorClass}`}>
                      {unit.rol}
                    </span>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-3 justify-self-end">
                    <button className="bg-black/50 border border-white/10 font-cta uppercase tracking-widest text-on-surface hover:bg-[#FFD700] hover:text-black hover:border-[#FFD700] transition-all px-6 py-2.5 text-[11px] rounded-full">
                      Ver Info
                    </button>
                    
                    <button 
                      disabled={!canModify}
                      className={`font-cta uppercase tracking-widest px-6 py-2.5 text-[11px] rounded-full border transition-all ${
                        canModify 
                          ? 'bg-[#051640]/40 border-[#4a90e2]/30 text-[#4a90e2] hover:bg-[#4a90e2] hover:text-white' 
                          : 'bg-white/5 border-white/5 text-white/20 cursor-not-allowed'
                      }`}
                    >
                      Modificar
                    </button>
                    
                    <button 
                      disabled={!canDelete}
                      className={`font-cta uppercase tracking-widest px-6 py-2.5 text-[11px] rounded-full border transition-all ${
                        canDelete 
                          ? 'bg-[#FF0000]/10 border-[#FF0000]/30 text-[#FF0000] hover:bg-[#FF0000] hover:text-white' 
                          : 'bg-white/5 border-white/5 text-white/20 cursor-not-allowed'
                      }`}
                    >
                      Eliminar
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
          
        </div>
      </div>
    </main>
  );
};

export default UnitsPage;
