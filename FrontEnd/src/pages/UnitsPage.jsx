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

const ModifyUnitModal = ({ isOpen, onClose, onConfirm, unitToModify }) => {
  const bgRef = useRef(null);
  const lineRef = useRef(null);
  const dataRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    if (isOpen && unitToModify) {
      setIsClosing(false);
      setNombre(unitToModify.nombre || '');
      setDescripcion(unitToModify.descripcion || '');
    }
  }, [isOpen, unitToModify]);

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

  const handleConfirm = () => {
    onConfirm({ nombre, descripcion });
  };

  if (!isOpen && !isClosing) return null;

  return createPortal(
    <div ref={bgRef} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm opacity-0 p-4">
      <div 
        ref={lineRef}
        className="glass-panel w-full max-w-lg bg-[#131313]/95 border border-[#FFD700]/30 rounded-2xl shadow-[0_0_50px_rgba(255,215,0,0.15)] overflow-hidden origin-center opacity-0"
      >
        <div ref={dataRef} className="flex flex-col p-8 opacity-0">
          <div className="flex items-center gap-4 mb-6">
            <span className="material-symbols-outlined text-[#FFD700] text-4xl drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]">edit</span>
            <h2 className="font-display text-2xl text-white uppercase tracking-widest">Modificar Unidad</h2>
          </div>
          
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest opacity-80">Nombre de Unidad</label>
              <input 
                type="text" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onClick={() => { if (nombre === unitToModify?.nombre) setNombre(''); }}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-body-md focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/50 outline-none transition-all placeholder:text-white/20"
                placeholder="Nombre de la unidad..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest opacity-80">Descripción</label>
              <textarea 
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                onClick={() => { if (descripcion === unitToModify?.descripcion) setDescripcion(''); }}
                className="w-full h-32 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-body-md focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/50 outline-none transition-all resize-none placeholder:text-white/20 custom-scrollbar"
                placeholder="Descripción de la unidad..."
              ></textarea>
            </div>
          </div>

          <div className="flex gap-4 w-full mt-8">
            <button 
              onClick={handleClose}
              className="flex-1 py-3 px-4 rounded-xl border border-outline/20 text-on-surface hover:bg-surface-variant transition-all font-cta"
            >
              Cancelar
            </button>
            <button 
              onClick={handleConfirm}
              className="flex-1 py-3 px-4 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/50 hover:bg-[#FFD700] text-[#FFD700] hover:text-black shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all font-cta uppercase tracking-widest"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const DeleteUnitModal = ({ isOpen, onClose, onConfirm, unitToDelete }) => {
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

  const handleConfirm = () => {
    setIsClosing(true);
    const tl = gsap.timeline({ onComplete: () => {
      setIsClosing(false);
      onConfirm();
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
        className="glass-panel w-full max-w-md bg-[#131313]/95 border border-red-500/30 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.15)] overflow-hidden origin-center opacity-0"
      >
        <div ref={dataRef} className="flex flex-col items-center gap-6 p-8 text-center opacity-0">
          <span className="material-symbols-outlined text-red-500 text-6xl drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">warning</span>
          <h2 className="font-display text-2xl text-white uppercase tracking-widest">¿Eliminar Unidad?</h2>
          <p className="font-body-md text-on-surface-variant opacity-80">
            Estás a punto de eliminar la unidad <strong className="text-white">"{unitToDelete?.nombre}"</strong>. Esta acción revocará el acceso a todos los usuarios vinculados permanentemente.
          </p>
          <div className="flex gap-4 w-full mt-4">
            <button 
              onClick={handleClose}
              className="flex-1 py-3 px-4 rounded-xl border border-outline/20 text-on-surface hover:bg-surface-variant transition-all font-cta"
            >
              Cancelar
            </button>
            <button 
              onClick={handleConfirm}
              className="flex-1 py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all font-cta"
            >
              Sí, Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const UnlinkUnitModal = ({ isOpen, onClose, onConfirm, unitToUnlink }) => {
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

  const handleConfirm = () => {
    setIsClosing(true);
    const tl = gsap.timeline({ onComplete: () => {
      setIsClosing(false);
      onConfirm();
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
        className="glass-panel w-full max-w-md bg-[#131313]/95 border border-orange-500/30 rounded-2xl shadow-[0_0_50px_rgba(249,115,22,0.15)] overflow-hidden origin-center opacity-0"
      >
        <div ref={dataRef} className="flex flex-col items-center gap-6 p-8 text-center opacity-0">
          <span className="material-symbols-outlined text-orange-500 text-6xl drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]">link_off</span>
          <h2 className="font-display text-2xl text-white uppercase tracking-widest">¿Desvincular Unidad?</h2>
          <p className="font-body-md text-on-surface-variant opacity-80">
            Estás a punto de desvincularte de la unidad <strong className="text-white">"{unitToUnlink?.nombre}"</strong>. Perderás el acceso a la misma hasta que vuelvas a usar un código de vinculación.
          </p>
          <div className="flex gap-4 w-full mt-4">
            <button 
              onClick={handleClose}
              className="flex-1 py-3 px-4 rounded-xl border border-outline/20 text-on-surface hover:bg-surface-variant transition-all font-cta"
            >
              Cancelar
            </button>
            <button 
              onClick={handleConfirm}
              className="flex-1 py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all font-cta"
            >
              Sí, Desvincular
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const InfoUnitModal = ({ isOpen, onClose, unitId, userRole }) => {
  const bgRef = useRef(null);
  const lineRef = useRef(null);
  const dataRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [unitInfo, setUnitInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (isOpen && unitId) {
      setIsClosing(false);
      setIsCodeVisible(false);
      fetchUnitInfo();
    } else {
      setUnitInfo(null);
    }
  }, [isOpen, unitId]);

  const fetchUnitInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/units/info/${unitId}`);
      if (!res.ok) throw new Error('Error obteniendo info');
      const data = await res.json();
      setUnitInfo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/units/${unitId}/generate-code`, { method: 'POST' });
      if (!res.ok) throw new Error('Error generando código');
      await fetchUnitInfo();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

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

  const canGenerate = ['Propietario', 'Co-Propietario'].includes(userRole);
  const canViewCode = ['Propietario', 'Co-Propietario', 'Administrador'].includes(userRole);
  const isExpired = unitInfo?.estadoCodigo?.includes('Vencido');
  const isCodeEmpty = unitInfo?.estadoCodigo === 'Vacío' || !unitInfo?.codVinculacion;

  return createPortal(
    <div ref={bgRef} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm opacity-0 p-4" onClick={handleClose}>
      <div 
        ref={lineRef}
        onClick={(e) => e.stopPropagation()}
        className="glass-panel w-full max-w-2xl bg-[#131313]/95 border border-[#FFD700]/30 rounded-2xl shadow-[0_0_50px_rgba(255,215,0,0.1)] overflow-hidden origin-center opacity-0"
      >
        <div ref={dataRef} className="flex flex-col p-8 opacity-0 relative">
          <button 
            onClick={handleClose}
            className="absolute top-6 right-6 text-on-surface-variant hover:text-red-500 transition-colors duration-300"
          >
            <span className="material-symbols-outlined text-[28px]">close</span>
          </button>
          
          <h2 className="font-display text-3xl uppercase tracking-widest mb-6">
            <span className="text-white">INFORMACIÓN DE</span> <span className="text-[#FFD700]">UNIDAD</span>
          </h2>
          
          {loading && !unitInfo && (
            <div className="text-center py-10 text-on-surface-variant font-cta tracking-widest uppercase">
              Cargando info...
            </div>
          )}

          {error && !unitInfo && (
            <div className="text-center py-10 text-red-500 font-cta tracking-widest uppercase">
              {error}
            </div>
          )}

          {unitInfo && (
            <div className="space-y-6 flex flex-col h-full">
              <div className="grid grid-cols-2 gap-8">
                {/* Columna Izquierda */}
                <div className="space-y-6">
                  <div>
                    <span className="block font-body-md text-on-surface-variant text-[11px] uppercase tracking-widest opacity-60 mb-1">Propietario</span>
                    <span className="font-display text-xl text-white truncate block">{unitInfo.propietario}</span>
                  </div>
                  <div>
                    <span className="block font-body-md text-on-surface-variant text-[11px] uppercase tracking-widest opacity-60 mb-1">Nombre de la Unidad</span>
                    <span className="font-body-md text-white truncate block">{unitInfo.nombre}</span>
                  </div>
                  <div>
                    <span className="block font-body-md text-on-surface-variant text-[11px] uppercase tracking-widest opacity-60 mb-1">ID Unidad</span>
                    <span className="font-mono text-sm text-[#FFD700] bg-[#FFD700]/10 px-3 py-1.5 rounded border border-[#FFD700]/20 inline-block">{unitInfo.idUnidad}</span>
                  </div>
                  <div>
                    <span className="block font-body-md text-on-surface-variant text-[11px] uppercase tracking-widest opacity-60 mb-1">Fecha de Creación</span>
                    <span className="font-mono text-sm text-white bg-white/10 px-3 py-1.5 rounded border border-white/20 inline-block">
                      {unitInfo.createdAtMs ? new Date(unitInfo.createdAtMs).toLocaleString() : 'Desconocida'}
                    </span>
                  </div>
                </div>
                
                {/* Columna Derecha */}
                <div className="flex flex-col h-full">
                  <span className="block font-body-md text-on-surface-variant text-[11px] uppercase tracking-widest opacity-60 mb-1">Descripción</span>
                  <p className="font-body-md text-on-surface opacity-90 break-all leading-relaxed">{unitInfo.descripcion || 'Sin descripción'}</p>
                </div>
              </div>

              {canViewCode && (
                <div className="mt-8 pt-6 border-t border-white/10 shrink-0">
                  <div className="flex justify-between items-end mb-4">
                    <span className="block font-display text-lg text-[#FFD700] uppercase tracking-widest">Código de Vinculación</span>
                    {canGenerate && (
                      <button 
                        onClick={handleGenerateCode}
                        disabled={loading}
                        className="bg-[#FFD700]/10 border border-[#FFD700]/50 text-[#FFD700] font-cta text-[11px] uppercase tracking-widest px-4 py-2 rounded hover:bg-[#FFD700] hover:text-black transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {loading ? 'Generando...' : 'Generar Nuevo'}
                      </button>
                    )}
                  </div>
                  
                  <div className="flex flex-col p-6 bg-black/40 border border-white/5 rounded-xl relative">
                    <div className="flex justify-between items-center w-full mb-2">
                      <span className="text-on-surface-variant text-[10px] uppercase tracking-widest">Token Secreto</span>
                      <div className="flex gap-2">
                          <button onClick={() => setIsCodeVisible(!isCodeVisible)} className="text-on-surface-variant hover:text-white transition-colors" title={isCodeVisible ? "Ocultar" : "Mostrar"}>
                              <span className="material-symbols-outlined text-[18px]">{isCodeVisible ? 'visibility_off' : 'visibility'}</span>
                          </button>
                          <button 
                              onClick={() => {
                                  navigator.clipboard.writeText(unitInfo.codVinculacion);
                                  setCopySuccess(true);
                                  setTimeout(() => setCopySuccess(false), 2000);
                              }} 
                              className="text-on-surface-variant hover:text-[#FFD700] transition-colors" 
                              title="Copiar al portapapeles"
                              disabled={isCodeEmpty}
                          >
                              <span className="material-symbols-outlined text-[18px]">{copySuccess ? 'check' : 'content_copy'}</span>
                          </button>
                      </div>
                    </div>

                    <div className="flex justify-center w-full my-2">
                      {isCodeEmpty ? (
                        <span className="font-mono text-2xl tracking-[0.3em] text-on-surface-variant/50">---- ---- --</span>
                      ) : (
                        <span className={`font-mono text-3xl tracking-[0.2em] font-bold ${isExpired ? 'text-red-500/70 line-through' : 'text-white'}`}>
                          {isCodeVisible ? unitInfo.codVinculacion : '••-••••-••'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center mt-4">
                    <span className={`font-cta text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border ${
                      isCodeEmpty ? 'bg-white/5 border-white/10 text-on-surface-variant' :
                      isExpired ? 'bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.2)]'
                    }`}>
                      {unitInfo.estadoCodigo}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
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

  const [showModifyModal, setShowModifyModal] = useState(false);
  const [unitToModify, setUnitToModify] = useState(null);
  const [modifySuccess, setModifySuccess] = useState(false);

  const [showUnlinkModal, setShowUnlinkModal] = useState(false);
  const [unitToUnlink, setUnitToUnlink] = useState(null);
  const [unlinkSuccess, setUnlinkSuccess] = useState(false);

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoUnitData, setInfoUnitData] = useState({ id: null, role: null });
  const [actionLoading, setActionLoading] = useState(false);

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

  const confirmModify = async (nuevosDatos) => {
    if (!unitToModify || actionLoading) return;
    setActionLoading(true);
    try {
      const response = await fetch(`/api/units/update/${unitToModify.idUnidad}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevosDatos)
      });
      if (response.ok) {
        setShowModifyModal(false);
        setModifySuccess(true);
      } else {
        const errorMsg = await response.text();
        setError(errorMsg);
      }
    } catch (err) {
      setError('Error de conexión al modificar');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();

    const eventSource = new EventSource('/api/stream', { withCredentials: true });

    eventSource.addEventListener('unit_update', (event) => {
      console.log('Unit updated via SSE:', event.data);
      fetchUnits();
    });

    eventSource.onerror = (error) => {
      console.error('SSE Error in UnitsPage:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [user]);

  const confirmDelete = async () => {
    if (!unitToDelete || actionLoading) return;
    setActionLoading(true);
    setShowDeleteModal(false);
    
    try {
      const response = await fetch(`/api/units/DeleteUnit/${unitToDelete.idUnidad}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setUnits(prev => prev.filter(u => u.idUnidad !== unitToDelete.idUnidad));
        setDeleteSuccess(true);
      } else {
        const errorMsg = await response.text();
        setError(errorMsg);
      }
    } catch (err) {
      setError('Error de conexión al eliminar');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmUnlink = async () => {
    if (!unitToUnlink || actionLoading) return;
    setActionLoading(true);
    setShowUnlinkModal(false);
    
    try {
      const response = await fetch(`/api/units/unlink/${unitToUnlink.idUnidad}?email=${encodeURIComponent(user.email)}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setUnits(prev => prev.filter(u => u.idUnidad !== unitToUnlink.idUnidad));
        setUnlinkSuccess(true);
      } else {
        const errorMsg = await response.text();
        setError(errorMsg);
      }
    } catch (err) {
      setError('Error de conexión al desvincular');
    } finally {
      setActionLoading(false);
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
    if (deleteSuccess || unlinkSuccess || modifySuccess) {
      const tl = gsap.timeline({ 
        onComplete: () => {
            gsap.killTweensOf('.delete-speed-lines > div');
            gsap.killTweensOf('.delete-speed-bg-pulse');
            setDeleteSuccess(false);
            setUnlinkSuccess(false);
            setModifySuccess(false);
            setUnitToDelete(null);
            setUnitToUnlink(null);
            setUnitToModify(null);
            fetchUnits();
        } 
      });

      // Animación de Ecualizador pegado al techo (más bajo) o piso según acción
      gsap.fromTo('.delete-speed-lines > div', 
        { scaleY: 0.1 }, 
        { scaleY: "random(0.5, 1.5)", duration: "random(0.2, 0.4)", repeat: -1, yoyo: true, ease: 'sine.inOut' } 
      );
      
      // Animación de parpadeo del gradiente coordinado
      gsap.fromTo('.delete-speed-bg-pulse', 
        { opacity: 0.3 }, 
        { opacity: 1, duration: 0.25, repeat: -1, yoyo: true, ease: 'sine.inOut' } 
      );
      
      const mainColor = modifySuccess ? '#34d399' : (unlinkSuccess ? '#f97316' : '#ef4444');
      const glowColor = modifySuccess ? 'rgba(52,211,153,0.6)' : (unlinkSuccess ? 'rgba(249,115,22,0.6)' : 'rgba(239,68,68,0.6)');
      const textGlow = modifySuccess ? 'rgba(52,211,153,0.8)' : (unlinkSuccess ? 'rgba(249,115,22,0.8)' : 'rgba(239,68,68,0.8)');
      
      const startY = modifySuccess ? 20 : -20;
      const endY = modifySuccess ? -1500 : 1500;

      gsap.set('.delete-circle', { scale: 0.5, opacity: 0, y: 0, borderColor: '#ffffff', boxShadow: '0 0 30px rgba(255,255,255,0.4)' });
      gsap.set('.delete-icon', { opacity: 0, color: '#ffffff', textShadow: '0 0 10px rgba(255,255,255,0.8)' });
      gsap.set('.delete-speed-bg-wrapper', { opacity: 0 });
      gsap.set('.delete-speed-lines', { opacity: 0 });

      tl.to('.delete-circle', { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' })
        .to('.delete-icon', { opacity: 1, duration: 0.3 })
        .to('.delete-circle', { borderColor: mainColor, boxShadow: `0 0 30px ${glowColor}`, duration: 0.3 })
        .to('.delete-icon', { color: mainColor, textShadow: `0 0 10px ${textGlow}`, duration: 0.3 }, "<")
        .to('.delete-circle', { y: startY, scale: 0.9, duration: 0.4, ease: 'power2.inOut' })
        .to('.delete-speed-bg-wrapper', { opacity: 1, duration: 0.5 })
        .to('.delete-speed-lines', { opacity: 1, duration: 0.5 }, "<")
        .to('.delete-circle', { y: endY, duration: 0.8, ease: 'power4.in' }, "-=0.2");
    }
  }, { dependencies: [deleteSuccess, unlinkSuccess, modifySuccess] });

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
            <button 
              onClick={() => navigate('/dashboard/units/link')}
              className="px-10 py-4 bg-[#1a1a1a]/[0.85] backdrop-blur-md/60 border border-outline/30 text-on-surface font-cta rounded-lg hover:border-outline/80 hover:bg-[#2a2a2a]/80 transition-all duration-300 active:scale-95 shadow-xl uppercase tracking-[0.15em] text-sm font-bold flex items-center gap-3"
            >
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
            const canUnlink = unit.rol !== 'Propietario';

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
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-colors duration-500 ${isActive ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${isActive ? 'bg-emerald-400 shadow-[0_0_5px_#34d399]' : 'bg-red-500 shadow-[0_0_5px_#ef4444]'}`}></span>
                      <span key={unit.estado} className={`animate-pop-in font-headline-md text-xs uppercase tracking-widest transition-colors duration-500 ${isActive ? 'text-emerald-400' : 'text-red-500'}`}>
                        {unit.estado}
                      </span>
                    </div>
                  </div>
                  
                  {/* Rol */}
                  <div className="flex items-center gap-3">
                    <span className="font-body-md text-on-surface-variant text-[11px] uppercase tracking-widest opacity-60">Rol:</span>
                    <span key={unit.rol} className={`animate-pop-in transition-colors duration-500 font-headline-md text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${roleColorClass}`}>
                      {unit.rol}
                    </span>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-3 justify-self-end items-center">
                    {canUnlink && (
                      <button 
                        onClick={() => { setUnitToUnlink(unit); setShowUnlinkModal(true); }}
                        className="font-cta uppercase tracking-widest w-8 h-8 p-0 flex items-center justify-center rounded-full border transition-all bg-transparent border-orange-500/30 text-orange-400 hover:bg-orange-500 hover:text-white"
                        title="Desvincularme"
                      >
                        <span className="material-symbols-outlined text-[16px] leading-none block">link_off</span>
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setInfoUnitData({ id: unit.idUnidad, role: unit.rol });
                        setShowInfoModal(true);
                      }}
                      className="bg-black/50 border border-white/10 font-cta uppercase tracking-widest text-on-surface hover:bg-[#FFD700] hover:text-black hover:border-[#FFD700] transition-all px-6 py-2.5 text-[11px] rounded-full"
                    >
                      Ver Info
                    </button>
                    
                    <button 
                      disabled={!canModify}
                      onClick={() => { setUnitToModify(unit); setShowModifyModal(true); }}
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
      <DeleteUnitModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setUnitToDelete(null);
        }}
        onConfirm={confirmDelete}
        unitToDelete={unitToDelete}
      />

      <UnlinkUnitModal
        isOpen={showUnlinkModal}
        onClose={() => {
          setShowUnlinkModal(false);
          setUnitToUnlink(null);
        }}
        onConfirm={confirmUnlink}
        unitToUnlink={unitToUnlink}
      />

      <ModifyUnitModal
        isOpen={showModifyModal}
        onClose={() => {
          setShowModifyModal(false);
          setUnitToModify(null);
        }}
        onConfirm={confirmModify}
        unitToModify={unitToModify}
      />

      <InfoUnitModal 
        isOpen={showInfoModal}
        onClose={() => {
          setShowInfoModal(false);
          setInfoUnitData({ id: null, role: null });
        }}
        unitId={infoUnitData.id}
        userRole={infoUnitData.role}
      />

      {/* Delete/Unlink/Modify Success Overlay en Portal */}
      {createPortal(
        <div 
          className={`delete-overlay-container fixed inset-0 z-[9999] flex items-center justify-center bg-black pointer-events-none ${deleteSuccess || unlinkSuccess || modifySuccess ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Gradiente suave amarillo (de arriba hacia abajo) con pulso. Para modifySuccess es de abajo hacia arriba */}
          <div className="delete-speed-bg-wrapper opacity-0 pointer-events-none">
            <div className={`delete-speed-bg-pulse absolute inset-x-0 ${modifySuccess ? 'bottom-0 bg-gradient-to-t' : 'top-0 bg-gradient-to-b'} h-[60%] from-[#FFD700]/30 to-transparent`}></div>
          </div>
          
          {/* Ecualizador anclado al techo o piso */}
          <div className={`delete-speed-lines absolute inset-x-0 ${modifySuccess ? 'bottom-0' : 'top-0'} h-[45%] opacity-0 pointer-events-none`}>
            {Array.from({ length: 60 }).map((_, i) => (
              <div 
                key={i} 
                className={`absolute w-[2px] bg-white ${modifySuccess ? 'rounded-t-full origin-bottom' : 'rounded-b-full origin-top'} opacity-30`}
                style={{
                  left: `${(i * 100) / 60}%`,
                  ...(modifySuccess ? { bottom: 0 } : { top: 0 }),
                  height: `${Math.random() * 40 + 10}%`
                }}
              ></div>
            ))}
          </div>

          <div className="delete-circle w-24 h-24 rounded-full border-4 border-white flex items-center justify-center opacity-0 scale-50 shadow-[0_0_30px_rgba(255,255,255,0.4)] relative z-10">
            <span className="material-symbols-outlined text-[48px] text-white delete-icon opacity-0 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10" style={{ textShadow: '0 0 10px rgba(255,255,255,0.8)' }}>
              {modifySuccess ? 'check' : (unlinkSuccess ? 'link_off' : 'delete')}
            </span>
          </div>
        </div>,
        document.body
      )}
    </main>
  );
};

export default UnitsPage;
