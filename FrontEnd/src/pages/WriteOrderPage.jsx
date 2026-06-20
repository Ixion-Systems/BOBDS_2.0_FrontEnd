import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { createPortal } from 'react-dom';
import { useAlert } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';

/* Modal de Confirmación de Envío */
const ConfirmOrderModal = ({ isOpen, onClose, onConfirm, orderDetails }) => {
  const bgRef = useRef(null);
  const lineRef = useRef(null);
  const dataRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) setIsClosing(false);
  }, [isOpen]);

  useGSAP(() => {
    if (isOpen && !isClosing && lineRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(bgRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' });
      tl.fromTo(lineRef.current, 
        { scaleX: 0, scaleY: 0.01, opacity: 0 }, 
        { scaleX: 1, opacity: 1, duration: 0.2, ease: 'power3.out' }
      );
      tl.to(lineRef.current, { scaleY: 1, duration: 0.3, ease: 'power4.inOut' });
      tl.fromTo(dataRef.current, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
        "-=0.15"
      );
    }
  }, [isOpen, isClosing]);

  const handleClose = () => {
    setIsClosing(true);
    const tl = gsap.timeline({ onComplete: () => {
      setIsClosing(false);
      onClose();
    }});
    tl.to(dataRef.current, { opacity: 0, y: 20, duration: 0.2, ease: 'power2.in' });
    tl.to(lineRef.current, { scaleY: 0.01, duration: 0.25, ease: 'power4.inOut' });
    tl.to(lineRef.current, { scaleX: 0, opacity: 0, duration: 0.2, ease: 'power3.in' });
    tl.to(bgRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, "-=0.1");
  };

  if (!isOpen && !isClosing) return null;

  return createPortal(
    <div ref={bgRef} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm opacity-0 p-4">
      <div 
        ref={lineRef}
        className="glass-panel w-full max-w-md bg-[#131313]/95 border border-[#FFD700]/30 rounded-2xl shadow-[0_0_50px_rgba(255,215,0,0.15)] overflow-hidden origin-center opacity-0"
      >
        <div ref={dataRef} className="flex flex-col items-center gap-6 p-8 text-center opacity-0">
          <span className="material-symbols-outlined text-[#FFD700] text-6xl drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]">send</span>
          <h2 className="font-display text-2xl text-white uppercase tracking-widest">¿Enviar Orden?</h2>
          <p className="font-body-md text-on-surface-variant opacity-80">
            Estás a punto de enviar la directiva <strong className="text-[#FFD700]">"{orderDetails?.orden}"</strong> a la unidad seleccionada.
          </p>
          <div className="flex gap-4 w-full mt-4">
            <button 
              onClick={handleClose}
              className="flex-1 py-3 px-4 rounded-xl border border-outline/20 text-on-surface hover:bg-surface-variant transition-all font-cta"
            >
              Cancelar
            </button>
            <button 
              onClick={() => { handleClose(); onConfirm(); }}
              className="flex-1 py-3 px-4 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/50 hover:bg-[#FFD700] text-[#FFD700] hover:text-black shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all font-cta uppercase tracking-widest"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

/* Página Principal */
const WriteOrderPage = () => {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { user } = useAuth();

  const [units, setUnits] = useState([]);
  const [unit, setUnit] = useState('');
  const [directive, setDirective] = useState('');
  const [notes, setNotes] = useState('');
  
  const [success, setSuccess] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  /* Cierre del Dropdown al Hacer Clic Fuera */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await fetch(`/api/units/user?email=${user.email}`);
        if (res.ok) {
          const data = await res.json();
          setUnits(data);
        }
      } catch (err) {
        console.error("Error al obtener unidades:", err);
      }
    };
    if (user?.email) fetchUnits();
  }, [user]);

  useEffect(() => {
    if (success) {
      const tl = gsap.timeline({ 
        onComplete: () => {
          gsap.killTweensOf('.fullscreen-speed-lines > div');
          gsap.killTweensOf('.speed-bg-pulse');
          setSuccess(false);
          setUnit('');
          setDirective('');
          setNotes('');
        } 
      });
      
      // Animación de Ecualizador pegado al piso (más bajo)
      gsap.fromTo('.fullscreen-speed-lines > div', 
        { scaleY: 0.1 }, 
        { scaleY: "random(0.5, 1.5)", duration: "random(0.2, 0.4)", repeat: -1, yoyo: true, ease: 'sine.inOut' } 
      );
      
      // Animación de parpadeo del gradiente coordinado
      gsap.fromTo('.speed-bg-pulse', 
        { opacity: 0.3 }, 
        { opacity: 1, duration: 0.25, repeat: -1, yoyo: true, ease: 'sine.inOut' } 
      );
      
      tl.to('.success-circle', { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' })
        .to('.success-check', { opacity: 1, duration: 0.3 })
        .to('.success-circle', { borderColor: '#34d399', boxShadow: '0 0 30px rgba(52,211,153,0.6)', duration: 0.3 })
        .to('.success-check', { color: '#34d399', textShadow: '0 0 10px rgba(52,211,153,0.8)', duration: 0.3 }, "<")
        .to('.success-circle', { y: 20, scale: 0.9, duration: 0.4, ease: 'power2.inOut' })
        .to('.speed-bg-wrapper', { opacity: 1, duration: 0.5 })
        .to('.fullscreen-speed-lines', { opacity: 1, duration: 0.5 }, "<")
        .to('.success-circle', { y: -1500, duration: 0.8, ease: 'power4.in' }, "-=0.2");
    }
  }, [success, navigate]);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    // Animación de entrada de la página
    tl.fromTo(containerRef.current, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
    
    // Animación del card
    tl.fromTo(cardRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
      "-=0.3"
    );

  }, { scope: containerRef });

  const handleTransmitClick = () => {
    if (!unit || !directive.trim()) {
      showAlert('Por favor selecciona una unidad y escribe una orden.', 'error');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmTransmit = async () => {
    try {
      const response = await fetch('/api/orders/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idUnidad: unit,
          orden: directive,
          notas: notes
        })
      });

      const data = await response.text();

      if (!response.ok) {
        showAlert(data, 'error');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      showAlert('Error de conexión al servidor.', 'error');
    }
  };

  const hasUnits = units.length > 0;
  
  // Función auxiliar para obtener el nombre de la unidad seleccionada
  const getSelectedUnitLabel = () => {
    if (!unit) return 'Selecciona una unidad...';
    const selected = units.find(u => u.idUnidad === unit);
    if (!selected) return 'Selecciona una unidad...';

    return (
      <span className="flex items-center gap-2">
        {selected.nombre} 
        <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#FFD700]/20 text-[#FFD700]">
          ID: {selected.idUnidad}
        </span>
      </span>
    );
  };

  return (
    <main ref={containerRef} className="flex-1 h-[100dvh] overflow-hidden relative z-10 p-2 lg:p-4 ml-[90px] w-[calc(100%-90px)] flex flex-col">
      <div className="w-full mx-auto flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center py-2 relative">
        
        <header className="w-full px-0 lg:px-2 mb-6 lg:mb-10 flex items-center justify-between relative mt-auto">
          <div className="flex-1 flex justify-start">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 lg:gap-3 text-on-surface-variant hover:text-[#FFD700] transition-all duration-300 font-cta text-xs lg:text-sm tracking-[0.2em] uppercase group whitespace-nowrap z-[60]"
              title="Volver"
            >
              <span className="material-symbols-outlined text-[20px] lg:text-[24px] group-hover:-translate-x-2 transition-transform duration-300">keyboard_backspace</span>
              <span className="opacity-80 group-hover:opacity-100 transition-opacity hidden sm:inline">Volver</span>
            </button>
          </div>
          
          <div className="flex flex-col items-center gap-2 lg:gap-4 shrink-0">
            <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-on-surface tracking-[0.1em] lg:tracking-[0.2em] uppercase text-glow text-center m-0">
              REDACTAR UNA ORDEN
            </h1>
            <div className="h-1 lg:h-1.5 w-24 lg:w-32 bg-[#FFD700] rounded-full shadow-[0_0_15px_rgba(255,215,0,0.5)] mt-2"></div>
          </div>

          <div className="flex-1 hidden sm:block"></div>
        </header>

        <div ref={cardRef} className={`w-full max-w-4xl mb-auto glass-panel rounded-2xl lg:rounded-[2rem] p-6 md:p-8 lg:p-10 flex flex-col gap-8 bg-[#131313]/85 backdrop-blur-md border border-[rgba(255,215,0,0.1)] shadow-[0_12px_40px_0_rgba(0,0,0,0.8)] relative overflow-hidden transition-opacity duration-500 ${success ? 'opacity-0' : 'opacity-100'}`}>
          {/* Decorative Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-50"></div>
          
          <form className="space-y-8 flex-1 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block font-label-sm text-xs lg:text-sm text-[#FFD700] uppercase tracking-widest flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-[18px]">memory</span> Unidad Objetivo
                </label>
                {/* Custom Select Dropdown */}
                <div className="relative group" ref={dropdownRef}>
                  <div 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`w-full bg-[#000000]/50 border ${dropdownOpen ? 'border-[#FFD700] ring-1 ring-[#FFD700]/20' : 'border-white/20 hover:border-[#FFD700]/50'} text-on-surface font-display text-sm lg:text-body-md rounded-xl py-4 pl-5 pr-12 transition-all cursor-pointer flex items-center justify-between select-none`}
                  >
                    <span className={!unit ? 'text-surface-container-highest' : 'text-on-surface'}>
                      {getSelectedUnitLabel()}
                    </span>
                  </div>
                  
                  <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 ${dropdownOpen ? 'text-[#FFD700]' : 'text-[#FFD700]/60 group-hover:text-[#FFD700]'} transition-colors`}>
                    <span className={`material-symbols-outlined transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                  </div>
                  
                  {/* Dropdown Menu Overlay */}
                  {dropdownOpen && (
                    <div className="absolute z-[100] mt-2 w-full bg-[#0a0a0a] border border-[#FFD700]/30 rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.9)] overflow-hidden max-h-40 overflow-y-auto custom-scrollbar flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-2 space-y-1">
                        {units.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-on-surface-variant/70 italic font-display text-center">No tienes unidades registradas</div>
                        ) : (
                          units.map((u) => (
                            <div 
                              key={u.idUnidad} 
                              onClick={() => {
                                setUnit(u.idUnidad);
                                setDropdownOpen(false);
                              }}
                              className={`cursor-pointer px-4 py-3 rounded-lg font-display text-sm transition-all flex items-center gap-3 ${
                                unit === u.idUnidad 
                                  ? 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30' 
                                  : 'text-on-surface hover:bg-white/10 border border-transparent'
                              }`}
                            >
                              <div className={`w-2 h-2 rounded-full transition-all ${unit === u.idUnidad ? 'bg-[#FFD700] shadow-[0_0_8px_#FFD700]' : 'bg-white/20'}`}></div>
                              <span className="flex items-center gap-2">
                                {u.nombre} 
                                <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${unit === u.idUnidad ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'bg-white/10 text-on-surface-variant'}`}>
                                  ID: {u.idUnidad}
                                </span>
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block font-label-sm text-xs lg:text-sm text-[#FFD700] uppercase tracking-widest flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-[18px]">terminal</span> Orden
                </label>
                <div className="relative">
                  <input 
                    value={directive}
                    onChange={(e) => setDirective(e.target.value)}
                    className="w-full bg-[#000000]/50 border border-white/20 text-on-surface font-display text-sm lg:text-body-md rounded-xl py-4 pl-5 pr-14 hover:border-[#FFD700]/50 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/20 transition-all outline-none" 
                    maxLength={50} 
                    placeholder="Ej. Iniciar escaneo de diagnóstico..." 
                    type="text"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-on-surface-variant/60 font-mono tracking-tighter pointer-events-none">
                    <span>{directive.length}</span>/50
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block font-label-sm text-xs lg:text-sm text-[#FFD700] uppercase tracking-widest flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[18px]">subject</span> Notas Suplementarias (Opcional)
              </label>
              <div className="relative">
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-full min-h-[120px] bg-[#000000]/50 border border-white/20 text-on-surface font-display text-sm lg:text-body-md rounded-xl py-4 pl-5 pr-14 hover:border-[#FFD700]/50 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/20 transition-all outline-none resize-none" 
                  maxLength={200} 
                  placeholder="Parámetros adicionales o contexto para el operador..." 
                  rows={5}
                />
                <div className="absolute right-4 bottom-4 text-[10px] text-on-surface-variant/60 font-mono tracking-tighter pointer-events-none">
                  <span>{notes.length}</span>/200
                </div>
              </div>
            </div>

            <div className="pt-8 mt-auto border-t border-white/10 flex justify-between items-center gap-6">
              <div className="hidden md:flex flex-col items-start opacity-40">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#FFD700]">Protocolo: Secure_Draft_v4</span>
                <span className="text-[10px] font-mono text-on-surface-variant">Conexión cifrada de extremo a extremo.</span>
              </div>
              <button 
                onClick={handleTransmitClick}
                disabled={!hasUnits}
                className={`font-cta text-xs lg:text-sm px-8 lg:px-12 py-4 rounded-xl transition-all duration-300 flex items-center justify-center uppercase tracking-widest group w-full md:w-auto ${
                  hasUnits 
                    ? 'bg-[#FFD700] text-black hover:bg-[#FFEA00] shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_0_35px_rgba(255,215,0,0.6)] active:scale-95' 
                    : 'bg-surface-container-highest text-on-surface-variant/50 cursor-not-allowed opacity-60'
                }`} 
                type="button"
              >
                Enviar Orden
                <span className={`material-symbols-outlined ml-3 text-[18px] lg:text-[22px] ${hasUnits ? 'group-hover:translate-x-1' : ''} transition-transform`}>send</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Overlay de Éxito renderizado en Portal para cubrir la pantalla completa y Sidebar */}
      {createPortal(
        <div 
          className={`overlay-container fixed inset-0 z-[9999] flex items-center justify-center bg-black pointer-events-none ${success ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Gradiente suave amarillo (de abajo hacia arriba) con pulso */}
          <div className="speed-bg-wrapper opacity-0 pointer-events-none">
            <div className="speed-bg-pulse absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#FFD700]/30 to-transparent"></div>
          </div>
          
          {/* Ecualizador anclado al piso */}
          <div className="fullscreen-speed-lines absolute inset-x-0 bottom-0 h-[45%] opacity-0 pointer-events-none">
            {Array.from({ length: 60 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute w-[2px] bg-white rounded-t-full opacity-30 origin-bottom"
                style={{
                  left: `${(i * 100) / 60}%`,
                  bottom: 0,
                  height: `${Math.random() * 40 + 10}%`
                }}
              ></div>
            ))}
          </div>

          <div className="success-circle w-24 h-24 rounded-full border-4 border-white flex items-center justify-center opacity-0 scale-50 shadow-[0_0_30px_rgba(255,255,255,0.4)] relative z-10">
            <span className="material-symbols-outlined text-[48px] text-white success-check opacity-0 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10" style={{ textShadow: '0 0 10px rgba(255,255,255,0.8)' }}>check</span>
          </div>
        </div>,
        document.body
      )}

      {/* Modal de Confirmación */}
      <ConfirmOrderModal 
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmTransmit}
        orderDetails={{ orden: directive }}
      />
    </main>
  );
};

export default WriteOrderPage;
