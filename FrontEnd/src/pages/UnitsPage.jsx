import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';

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
  const { user } = useAuth();

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const fetchUnits = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/units/user?email=${encodeURIComponent(user.email)}`);
      if (!response.ok) {
        throw new Error('Error al obtener las unidades');
      }
      const data = await response.json();
      setUnits(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, [user]);

  const confirmDelete = async () => {
    if (!unitToDelete) return;
    setShowDeleteModal(false);
    
    try {
      const response = await fetch(`/api/units/DeleteUnit/${unitToDelete.idUnidad}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Actualización optimista: removemos la unidad del estado antes de que empiece o termine la animación
        setUnits(prev => prev.filter(u => u.idUnidad !== unitToDelete.idUnidad));
        setShowDeleteModal(false);
        setDeleteSuccess(true);
      } else {
        const errorMsg = await response.text();
        setError(errorMsg);
      }
    } catch (err) {
      setError('Error de conexión al eliminar');
    }
  };

  useGSAP(() => {
    // Animar Header solo una vez
    gsap.fromTo(headerRef.current, 
      { y: -30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
  }, { scope: containerRef });

  useGSAP(() => {
    // Animar Cards cuando ya no se está cargando y hay unidades
    if (!loading && units.length > 0) {
      gsap.fromTo('.unit-card', 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, { scope: containerRef, dependencies: [units, loading] });

  useGSAP(() => {
    if (deleteSuccess) {
      const tl = gsap.timeline({ 
        onComplete: () => {
            gsap.killTweensOf('.delete-speed-lines > div');
            gsap.killTweensOf('.delete-speed-bg-pulse');
            setDeleteSuccess(false);
            setUnitToDelete(null);
            fetchUnits();
        } 
      });

      // Animación de Ecualizador pegado al techo (más bajo)
      gsap.fromTo('.delete-speed-lines > div', 
        { scaleY: 0.1 }, 
        { scaleY: "random(0.5, 1.5)", duration: "random(0.2, 0.4)", repeat: -1, yoyo: true, ease: 'sine.inOut' } 
      );
      
      // Animación de parpadeo del gradiente coordinado
      gsap.fromTo('.delete-speed-bg-pulse', 
        { opacity: 0.3 }, 
        { opacity: 1, duration: 0.25, repeat: -1, yoyo: true, ease: 'sine.inOut' } 
      );
      
      tl.to('.delete-circle', { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' })
        .to('.delete-icon', { opacity: 1, duration: 0.3 })
        .to('.delete-circle', { borderColor: '#ef4444', boxShadow: '0 0 30px rgba(239,68,68,0.6)', duration: 0.3 })
        .to('.delete-icon', { color: '#ef4444', textShadow: '0 0 10px rgba(239,68,68,0.8)', duration: 0.3 }, "<")
        .to('.delete-circle', { y: -20, scale: 0.9, duration: 0.4, ease: 'power2.inOut' })
        .to('.delete-speed-bg-wrapper', { opacity: 1, duration: 0.5 })
        .to('.delete-speed-lines', { opacity: 1, duration: 0.5 }, "<")
        .to('.delete-circle', { y: 1500, duration: 0.8, ease: 'power4.in' }, "-=0.2");
        // Quitamos el fade out del overlay para que no muestre la lista vieja si hay lag
    }
  }, { dependencies: [deleteSuccess] });

  return (
    <main ref={containerRef} className="flex-1 h-[100dvh] overflow-hidden relative z-10 p-8 lg:p-12 pt-16 ml-[90px] w-[calc(100%-90px)] flex flex-col">
      <div className="max-w-6xl mx-auto flex flex-col h-full w-full">
        {/* Header Area */}
        <header ref={headerRef} className="w-full shrink-0 flex flex-col">
          <div className="flex justify-end mb-12">
            <div className="text-right">
              <h2 className="font-display text-[56px] font-bold text-on-surface tracking-tighter opacity-90 uppercase leading-none">
                Listado de Unidades
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
          
          {loading && (
            <div className="text-center py-10 text-on-surface-variant font-cta tracking-widest uppercase">
              Cargando unidades...
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-10 text-red-500 font-cta tracking-widest uppercase bg-red-500/10 rounded-lg">
              {error}
            </div>
          )}

          {!loading && units.length === 0 && !error && (
            <div className="text-center py-10 text-on-surface-variant font-cta tracking-widest uppercase">
              No tenés ninguna unidad vinculada.
            </div>
          )}

          {!loading && [...units].sort((a, b) => (roleWeights[b.rol] || 0) - (roleWeights[a.rol] || 0)).map((unit) => {
            const isActive = unit.estado?.toUpperCase() === 'ACTIVO';
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
                      onClick={() => { setUnitToDelete(unit); setShowDeleteModal(true); }}
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

      {/* Delete Confirmation Modal en Portal */}
      {showDeleteModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="glass-panel p-8 rounded-2xl border border-red-500/30 bg-[#131313]/95 flex flex-col items-center gap-6 max-w-md w-full mx-4 shadow-[0_0_50px_rgba(239,68,68,0.15)] text-center">
            <span className="material-symbols-outlined text-red-500 text-6xl drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">warning</span>
            <h2 className="font-display text-2xl text-white uppercase tracking-widest">¿Eliminar Unidad?</h2>
            <p className="font-body-md text-on-surface-variant opacity-80">
              Estás a punto de eliminar la unidad <strong className="text-white">"{unitToDelete?.nombre}"</strong>. Esta acción revocará el acceso a todos los usuarios vinculados permanentemente.
            </p>
            <div className="flex gap-4 w-full mt-4">
              <button 
                onClick={() => {
                  setShowDeleteModal(false);
                  setUnitToDelete(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl border border-outline/20 text-on-surface hover:bg-surface-variant transition-all font-cta"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all font-cta"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Success Overlay en Portal */}
      {createPortal(
        <div 
          className={`delete-overlay-container fixed inset-0 z-[9999] flex items-center justify-center bg-black pointer-events-none ${deleteSuccess ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Gradiente suave amarillo (de arriba hacia abajo) con pulso */}
          <div className="delete-speed-bg-wrapper opacity-0 pointer-events-none">
            <div className="delete-speed-bg-pulse absolute inset-x-0 top-0 h-[60%] bg-gradient-to-b from-[#FFD700]/30 to-transparent"></div>
          </div>
          
          {/* Ecualizador anclado al techo */}
          <div className="delete-speed-lines absolute inset-x-0 top-0 h-[45%] opacity-0 pointer-events-none">
            {Array.from({ length: 60 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute w-[2px] bg-white rounded-b-full opacity-30 origin-top"
                style={{
                  left: `${(i * 100) / 60}%`,
                  top: 0,
                  height: `${Math.random() * 40 + 10}%`
                }}
              ></div>
            ))}
          </div>

          <div className="delete-circle w-24 h-24 rounded-full border-4 border-white flex items-center justify-center opacity-0 scale-50 shadow-[0_0_30px_rgba(255,255,255,0.4)] relative z-10">
            <span className="material-symbols-outlined text-[48px] text-white delete-icon opacity-0 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10" style={{ textShadow: '0 0 10px rgba(255,255,255,0.8)' }}>delete</span>
          </div>
        </div>,
        document.body
      )}
    </main>
  );
};

export default UnitsPage;
