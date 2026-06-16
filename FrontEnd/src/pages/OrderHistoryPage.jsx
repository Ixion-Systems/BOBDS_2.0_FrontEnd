import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';

const getStatusColor = (estado) => {
  switch (estado?.toUpperCase()) {
    case 'EN COLA': return { bg: 'bg-red-500', shadow: 'shadow-[0_0_15px_#ef4444]', text: 'text-red-500', wrapper: 'bg-red-500/10 border-red-500/20' };
    case 'EN CURSO': return { bg: 'bg-orange-500', shadow: 'shadow-[0_0_15px_#f97316]', text: 'text-orange-500', wrapper: 'bg-orange-500/10 border-orange-500/20' };
    case 'FINALIZADA': return { bg: 'bg-emerald-400', shadow: 'shadow-[0_0_15px_#34d399]', text: 'text-emerald-400', wrapper: 'bg-emerald-500/10 border-emerald-500/20' };
    default: return { bg: 'bg-gray-500', shadow: 'shadow-none', text: 'text-gray-400', wrapper: 'bg-gray-500/10 border-gray-500/20' };
  }
};

const InfoModal = ({ isOpen, onClose, loading, orderInfo }) => {
  const bgRef = useRef(null);
  const lineRef = useRef(null);
  const dataRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  // Reset isClosing when reopened
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
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
    <div ref={bgRef} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 opacity-0">
      <div 
        ref={lineRef} 
        className="w-full max-w-2xl bg-[#131313]/95 border border-[#FFD700]/30 rounded-2xl shadow-[0_0_50px_rgba(255,215,0,0.15)] overflow-hidden origin-center opacity-0"
      >
        <div ref={dataRef} className="flex flex-col opacity-0">
          <div className="border-b border-white/10 p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#FFD700] text-3xl">info</span>
              <h2 className="font-display text-2xl text-white uppercase tracking-widest">Información de Orden</h2>
            </div>
            <button 
              onClick={handleClose}
              className="text-on-surface-variant hover:text-red-500 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
          
          <div className="p-8 pb-10">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-t-[#FFD700] border-r-[#FFD700] border-b-transparent border-l-transparent animate-spin"></div>
                <span className="font-cta uppercase tracking-widest text-on-surface-variant text-sm">Cargando detalles...</span>
              </div>
            ) : orderInfo ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="block font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-1">ID de Orden</span>
                    <span className="font-mono text-white text-lg bg-white/5 px-3 py-1 rounded border border-white/10">#{orderInfo.idOrden}</span>
                  </div>
                  <div>
                    <span className="block font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-1">Estado</span>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(orderInfo.estado).wrapper}`}>
                      <span className={`w-2 h-2 rounded-full animate-pulse ${getStatusColor(orderInfo.estado).bg} ${getStatusColor(orderInfo.estado).shadow}`}></span>
                      <span className={`font-headline-md text-xs uppercase tracking-widest ${getStatusColor(orderInfo.estado).text}`}>
                        {orderInfo.estado}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="block font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-1">Fecha y Hora</span>
                    <span className="font-mono text-white text-md bg-white/5 px-3 py-1 rounded border border-white/10 inline-block">
                      {orderInfo.createdAtMs ? new Date(orderInfo.createdAtMs).toLocaleString() : (orderInfo.fechaHora || 'Desconocida')}
                    </span>
                  </div>
                </div>
                
                <div>
                  <span className="block font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-1">Directiva</span>
                  <div className="bg-[#000000]/50 border border-white/10 rounded-xl p-4 text-on-surface font-display text-lg">
                    {orderInfo.orden}
                  </div>
                </div>

                <div>
                  <span className="block font-label-sm text-xs text-[#FFD700] uppercase tracking-widest mb-1">Notas Suplementarias</span>
                  <div className="bg-[#000000]/50 border border-[#FFD700]/20 rounded-xl p-4 text-on-surface-variant font-display text-md min-h-[100px] whitespace-pre-wrap">
                    {orderInfo.notas || <span className="italic opacity-50">Sin notas adicionales...</span>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-red-500 font-cta tracking-widest uppercase">
                No se pudo cargar la información.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const DeleteOrderModal = ({ isOpen, onClose, onConfirm, orderToDelete }) => {
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
          <h2 className="font-display text-2xl text-white uppercase tracking-widest">¿Eliminar Orden?</h2>
          <p className="font-body-md text-on-surface-variant opacity-80">
            Estás a punto de eliminar la orden <strong className="text-white">#{orderToDelete?.idOrden}</strong>. Esta acción es irreversible y borrará el registro del historial.
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

const OrderHistoryPage = () => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [units, setUnits] = useState([]);
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState(null);

  const [sortOrder, setSortOrder] = useState('newest');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef(null);
  const [triggerFetch, setTriggerFetch] = useState(0);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedOrderInfo, setSelectedOrderInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedUnit = units.find(u => u.idUnidad === selectedUnitId);
  const canDelete = selectedUnit && !['Invitado', 'Operador'].includes(selectedUnit.rol);

  useEffect(() => {
    const fetchUnits = async () => {
      if (!user?.email) return;
      try {
        setLoading(true);
        const response = await fetch(`/api/units/user?email=${encodeURIComponent(user.email)}`);
        if (!response.ok) throw new Error('Error al obtener las unidades');
        const data = await response.json();
        setUnits(data);
        if (data.length > 0) {
          setSelectedUnitId(data[0].idUnidad);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, [user]);

  const fetchOrders = async (idUnidad) => {
    if (!idUnidad) return;
    try {
      setLoadingOrders(true);
      setError(null);
      const response = await fetch(`/api/orders/unit/${encodeURIComponent(idUnidad)}`);
      if (!response.ok) throw new Error('Error al obtener las órdenes');
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (selectedUnitId) {
      fetchOrders(selectedUnitId);
    }
  }, [selectedUnitId, triggerFetch]);

  useEffect(() => {
    const eventSource = new EventSource('/api/stream', { withCredentials: true });

    eventSource.addEventListener('order_update', (event) => {
      console.log('Order updated via SSE:', event.data);
      setTriggerFetch(prev => prev + 1);
    });

    eventSource.onerror = (error) => {
      console.error('SSE Error in OrderHistoryPage:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    setShowDeleteModal(false);
    
    try {
      const response = await fetch(`/api/orders/${orderToDelete.idOrden}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setOrders(prev => prev.filter(o => o.idOrden !== orderToDelete.idOrden));
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

  const handleVerInfo = async (idOrden) => {
    try {
      setLoadingInfo(true);
      setShowInfoModal(true);
      setSelectedOrderInfo(null);
      const response = await fetch(`/api/orders/${idOrden}`);
      if (!response.ok) throw new Error('Error al cargar detalles de la orden');
      const data = await response.json();
      setSelectedOrderInfo(data);
    } catch (err) {
      setError(err.message);
      setShowInfoModal(false);
    } finally {
      setLoadingInfo(false);
    }
  };

  useGSAP(() => {
    gsap.fromTo(headerRef.current, 
      { y: -30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
  }, { scope: containerRef });

  useGSAP(() => {
    if (!loadingOrders && orders.length > 0) {
      gsap.fromTo('.order-card', 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, { scope: containerRef, dependencies: [orders, loadingOrders] });

  useGSAP(() => {
    if (deleteSuccess) {
      gsap.set(['.delete-circle', '.delete-icon', '.delete-speed-bg-wrapper', '.delete-speed-lines'], { clearProps: 'all' });

      const tl = gsap.timeline({ 
        onComplete: () => {
            gsap.killTweensOf('.delete-speed-lines > div');
            gsap.killTweensOf('.delete-speed-bg-pulse');
            setDeleteSuccess(false);
            setOrderToDelete(null);
            fetchOrders(selectedUnitId);
        } 
      });

      gsap.fromTo('.delete-speed-lines > div', 
        { scaleY: 0.1 }, 
        { scaleY: "random(0.5, 1.5)", duration: "random(0.2, 0.4)", repeat: -1, yoyo: true, ease: 'sine.inOut' } 
      );
      
      gsap.fromTo('.delete-speed-bg-pulse', 
        { opacity: 0.3 }, 
        { opacity: 1, duration: 0.25, repeat: -1, yoyo: true, ease: 'sine.inOut' } 
      );
      
      gsap.set('.delete-circle', { scale: 0.5, opacity: 0, y: 0, borderColor: '#ffffff', boxShadow: '0 0 30px rgba(255,255,255,0.4)' });
      gsap.set('.delete-icon', { opacity: 0, color: '#ffffff', textShadow: '0 0 10px rgba(255,255,255,0.8)' });
      gsap.set('.delete-speed-bg-wrapper', { opacity: 0 });
      gsap.set('.delete-speed-lines', { opacity: 0 });

      tl.to('.delete-circle', { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' })
        .to('.delete-icon', { opacity: 1, duration: 0.3 })
        .to('.delete-circle', { borderColor: '#ef4444', boxShadow: '0 0 30px rgba(239,68,68,0.6)', duration: 0.3 })
        .to('.delete-icon', { color: '#ef4444', textShadow: '0 0 10px rgba(239,68,68,0.8)', duration: 0.3 }, "<")
        .to('.delete-circle', { y: -20, scale: 0.9, duration: 0.4, ease: 'power2.inOut' })
        .to('.delete-speed-bg-wrapper', { opacity: 1, duration: 0.5 })
        .to('.delete-speed-lines', { opacity: 1, duration: 0.5 }, "<")
        .to('.delete-circle', { y: 1500, duration: 0.8, ease: 'power4.in' }, "-=0.2");
    }
  }, { dependencies: [deleteSuccess] });

  const getSelectedUnitLabel = () => {
    if (!selectedUnitId) return 'Selecciona una unidad...';
    const selected = units.find(u => u.idUnidad === selectedUnitId);
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
    <main ref={containerRef} className="flex-1 h-[100dvh] overflow-hidden relative z-10 p-8 lg:p-12 pt-16 ml-[90px] w-[calc(100%-90px)] flex flex-col">
      <div className="max-w-6xl mx-auto flex flex-col h-full w-full">
        <header ref={headerRef} className="w-full shrink-0 flex flex-col relative z-50">
          <div className="flex justify-end mb-12">
            <div className="text-right">
              <h2 className="font-display text-[56px] font-bold text-on-surface tracking-tighter opacity-90 uppercase leading-none">
                Historial de Órdenes
              </h2>
              <div className="h-1.5 w-48 bg-[#FFD700] ml-auto mt-4 rounded-full shadow-[0_0_15px_#FFD700]"></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-8 w-full pr-4">
            <div className="flex items-center gap-6 w-full max-w-lg">
              <span className="font-display text-xl text-on-surface font-bold uppercase tracking-widest shrink-0">Unidad:</span>
              <div className="relative flex-1 group" ref={dropdownRef}>
                <div 
                  onClick={() => { if (!loading && units.length > 0) setDropdownOpen(!dropdownOpen); }}
                  className={`w-full bg-[#000000]/50 border ${dropdownOpen ? 'border-[#FFD700] ring-1 ring-[#FFD700]/20' : 'border-white/20 hover:border-[#FFD700]/50'} text-on-surface font-display text-sm lg:text-body-md rounded-xl py-4 pl-5 pr-12 transition-all cursor-pointer flex items-center justify-between select-none ${loading || units.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <span className={!selectedUnitId ? 'text-surface-container-highest' : 'text-on-surface'}>
                    {getSelectedUnitLabel()}
                  </span>
                </div>
                
                <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 ${dropdownOpen ? 'text-[#FFD700]' : 'text-[#FFD700]/60 group-hover:text-[#FFD700]'} transition-colors`}>
                  <span className={`material-symbols-outlined transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                </div>
                
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
                              setSelectedUnitId(u.idUnidad);
                              setDropdownOpen(false);
                            }}
                            className={`cursor-pointer px-4 py-3 rounded-lg font-display text-sm transition-all flex items-center gap-3 ${
                              selectedUnitId === u.idUnidad 
                                ? 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30' 
                                : 'text-on-surface hover:bg-white/10 border border-transparent'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full transition-all ${selectedUnitId === u.idUnidad ? 'bg-[#FFD700] shadow-[0_0_8px_#FFD700]' : 'bg-white/20'}`}></div>
                            <span className="flex items-center gap-2">
                              {u.nombre} 
                              <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${selectedUnitId === u.idUnidad ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'bg-white/10 text-on-surface-variant'}`}>
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

            <div className="relative w-48 group z-[60]" ref={sortDropdownRef}>
              <div 
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className={`w-full bg-[#000000]/50 border ${sortDropdownOpen ? 'border-[#FFD700] ring-1 ring-[#FFD700]/20' : 'border-white/20 hover:border-[#FFD700]/50'} text-on-surface font-display text-sm rounded-xl py-3 pl-4 pr-10 transition-all cursor-pointer flex items-center justify-between select-none shadow-[0_0_15px_rgba(255,255,255,0.05)]`}
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-[#FFD700]">sort</span>
                  {sortOrder === 'newest' ? 'Más Nuevo' : 'Más Antiguo'}
                </span>
                <span className={`material-symbols-outlined absolute right-3 transition-transform duration-300 ${sortDropdownOpen ? 'rotate-180 text-[#FFD700]' : 'text-white/50 group-hover:text-[#FFD700]'}`}>expand_more</span>
              </div>
              
              {sortDropdownOpen && (
                <div className="absolute right-0 z-[100] mt-2 w-full bg-[#0a0a0a] border border-[#FFD700]/30 rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2 space-y-1">
                    <div 
                      onClick={() => { setSortOrder('newest'); setSortDropdownOpen(false); }}
                      className={`cursor-pointer px-4 py-2 rounded-lg font-display text-sm transition-all flex items-center gap-3 ${
                        sortOrder === 'newest' ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'text-on-surface hover:bg-white/10'
                      }`}
                    >
                      Más Nuevo
                    </div>
                    <div 
                      onClick={() => { setSortOrder('oldest'); setSortDropdownOpen(false); }}
                      className={`cursor-pointer px-4 py-2 rounded-lg font-display text-sm transition-all flex items-center gap-3 ${
                        sortOrder === 'oldest' ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'text-on-surface hover:bg-white/10'
                      }`}
                    >
                      Más Antiguo
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto space-y-4 pb-12 pr-4 custom-scrollbar">
          
          {loadingOrders && (
            <div className="text-center py-10 text-on-surface-variant font-cta tracking-widest uppercase">
              Cargando historial...
            </div>
          )}

          {!loadingOrders && error && (
            <div className="text-center py-10 text-red-500 font-cta tracking-widest uppercase bg-red-500/10 rounded-lg">
              {error}
            </div>
          )}

          {!loadingOrders && orders.length === 0 && !error && selectedUnitId && (
            <div className="text-center py-10 text-on-surface-variant font-cta tracking-widest uppercase bg-white/5 rounded-xl border border-white/10">
              No hay órdenes registradas para esta unidad.
            </div>
          )}

          {!loadingOrders && [...orders].sort((a, b) => {
            const statusWeight = { 'EN COLA': 1, 'EN CURSO': 2, 'FINALIZADA': 3 };
            const sA = statusWeight[a.estado?.toUpperCase()] || 4;
            const sB = statusWeight[b.estado?.toUpperCase()] || 4;
            
            if (sA !== sB) {
              return sA - sB;
            }
            
            const parseDate = (dStr) => dStr ? new Date(dStr.replace(' ', 'T')).getTime() : 0;
            const tA = a.createdAtMs || parseDate(a.fechaHora) || 0;
            const tB = b.createdAtMs || parseDate(b.fechaHora) || 0;
            
            if (tA !== tB) {
              return sortOrder === 'newest' ? tB - tA : tA - tB;
            }
            
            // Tiebreaker: idOrden
            return sortOrder === 'newest' ? b.idOrden - a.idOrden : a.idOrden - b.idOrden;
          }).map((order) => {
            const statusStyle = getStatusColor(order.estado);

            return (
              <div key={order.idOrden} className="order-card glass-panel group overflow-hidden p-4 px-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,215,0,0.08)] border border-[rgba(255,215,0,0.1)] border-l-4 rounded-xl backdrop-blur-md bg-[#131313]/60 border-l-outline/30 opacity-80 hover:opacity-100">
                <div className="grid grid-cols-[1fr_220px_auto] items-center gap-6 md:gap-10 w-full">
                  
                  <div className="flex flex-col justify-center">
                    <h3 
                      title={order.orden}
                      className="font-display text-xl group-hover:translate-x-2 transition-transform duration-300 font-bold pr-4 text-left text-on-surface group-hover:text-[#FFD700] whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {order.orden.length > 50 ? order.orden.substring(0, 50) + '...' : order.orden}
                    </h3>
                    <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mt-1 opacity-60 group-hover:translate-x-2 transition-transform duration-300">
                      {order.createdAtMs ? new Date(order.createdAtMs).toLocaleString() : (order.fechaHora || 'Desconocida')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="font-body-md text-on-surface-variant text-[11px] uppercase tracking-widest opacity-60">Estado:</span>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${statusStyle.wrapper}`}>
                      <span className={`w-2 h-2 rounded-full animate-pulse ${statusStyle.bg} ${statusStyle.shadow}`}></span>
                      <span className={`font-headline-md text-xs uppercase tracking-widest ${statusStyle.text}`}>
                        {order.estado}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-self-end">
                    <button 
                      onClick={() => handleVerInfo(order.idOrden)}
                      className="bg-black/50 border border-white/10 font-cta uppercase tracking-widest text-on-surface hover:bg-[#FFD700] hover:text-black hover:border-[#FFD700] transition-all px-6 py-2.5 text-[11px] rounded-full"
                    >
                      Ver Info
                    </button>
                    
                    <button 
                      disabled={!canDelete}
                      onClick={() => { setOrderToDelete(order); setShowDeleteModal(true); }}
                      className={`font-cta uppercase tracking-widest px-6 py-2.5 text-[11px] rounded-full border transition-all ${
                        canDelete 
                          ? 'bg-[#FF0000]/10 border-[#FF0000]/30 text-[#FF0000] hover:bg-[#FF0000] hover:text-white' 
                          : 'bg-white/5 border-white/5 text-white/20 cursor-not-allowed'
                      }`}
                      title={!canDelete ? 'No tienes permisos para eliminar órdenes en esta unidad' : ''}
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

      <InfoModal 
        isOpen={showInfoModal} 
        onClose={() => setShowInfoModal(false)} 
        loading={loadingInfo} 
        orderInfo={selectedOrderInfo} 
      />

      {/* Delete Confirmation Modal */}
      <DeleteOrderModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setOrderToDelete(null);
        }}
        onConfirm={confirmDelete}
        orderToDelete={orderToDelete}
      />

      {/* Delete Success Overlay */}
      {createPortal(
        <div 
          className={`delete-overlay-container fixed inset-0 z-[9999] flex items-center justify-center bg-black pointer-events-none ${deleteSuccess ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="delete-speed-bg-wrapper opacity-0 pointer-events-none">
            <div className="delete-speed-bg-pulse absolute inset-x-0 top-0 h-[60%] bg-gradient-to-b from-[#FFD700]/30 to-transparent"></div>
          </div>
          <div className="delete-speed-lines absolute inset-x-0 top-0 h-[45%] opacity-0 pointer-events-none">
            {Array.from({ length: 60 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute w-[2px] bg-white rounded-b-full opacity-30 origin-top"
                style={{ left: `${(i * 100) / 60}%`, top: 0, height: `${Math.random() * 40 + 10}%` }}
              ></div>
            ))}
          </div>

          <div className="delete-circle w-24 h-24 rounded-full border-4 border-white flex items-center justify-center opacity-0 scale-50 shadow-[0_0_30px_rgba(255,255,255,0.4)] relative z-10">
            <span className="material-symbols-outlined text-[48px] text-white delete-icon opacity-0 z-10" style={{ textShadow: '0 0 10px rgba(255,255,255,0.8)' }}>delete</span>
          </div>
        </div>,
        document.body
      )}
    </main>
  );
};

export default OrderHistoryPage;
