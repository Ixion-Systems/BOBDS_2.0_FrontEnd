import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const AdminUsersPage = () => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [activeTab, setActiveTab] = useState('unidades'); // 'unidades' | 'ordenes'
  
  const [userUnits, setUserUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);
  const [unitOrders, setUnitOrders] = useState([]);
  const [triggerUnitFetch, setTriggerUnitFetch] = useState(0);
  const [triggerOrderFetch, setTriggerOrderFetch] = useState(0);

  // Modals state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: '', id: null, closing: false });
  const [infoModal, setInfoModal] = useState({ isOpen: false, unit: null, closing: false });
  const [orderInfoModal, setOrderInfoModal] = useState({ isOpen: false, order: null, closing: false });

  const deleteBgRef = useRef(null);
  const deletePanelRef = useRef(null);
  const infoBgRef = useRef(null);
  const infoPanelRef = useRef(null);
  const orderInfoBgRef = useRef(null);
  const orderInfoPanelRef = useRef(null);

  useEffect(() => {
    fetchUsers();

    const eventSource = new EventSource('/api/stream', { withCredentials: true });
    
    eventSource.addEventListener('unit_update', () => {
      setTriggerUnitFetch(prev => prev + 1);
    });

    eventSource.addEventListener('order_update', () => {
      setTriggerOrderFetch(prev => prev + 1);
    });

    eventSource.onerror = (error) => {
      console.error('SSE Error in AdminUsersPage:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchUserUnits(selectedUser.Email);
    } else {
      setUserUnits([]);
      setUnitOrders([]);
      setSelectedUnit('');
    }
  }, [selectedUser, triggerUnitFetch]);

  useEffect(() => {
    if (activeTab === 'ordenes' && selectedUnit) {
      fetchUnitOrders(selectedUnit);
    } else {
      setUnitOrders([]);
    }
  }, [activeTab, selectedUnit, triggerOrderFetch]);

  useGSAP(() => {
    if (deleteModal.isOpen && !deleteModal.closing) {
      gsap.fromTo(deleteBgRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' });
      gsap.fromTo(deletePanelRef.current, { scale: 0.9, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' });
    }
    if (infoModal.isOpen && !infoModal.closing) {
      gsap.fromTo(infoBgRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' });
      gsap.fromTo(infoPanelRef.current, { scale: 0.9, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' });
    }
    if (orderInfoModal.isOpen && !orderInfoModal.closing) {
      gsap.fromTo(orderInfoBgRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' });
      gsap.fromTo(orderInfoPanelRef.current, { scale: 0.9, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' });
    }
  }, [deleteModal.isOpen, deleteModal.closing, infoModal.isOpen, infoModal.closing, orderInfoModal.isOpen, orderInfoModal.closing]);

  const mainRef = useRef(null);

  useGSAP(() => {
    if (mainRef.current) {
      gsap.fromTo(mainRef.current.children, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, []);

  useGSAP(() => {
    if (selectedUser) {
      if (activeTab === 'unidades') {
        gsap.fromTo('.units-view', 
          { opacity: 0, y: 10 }, 
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
        );
        if (userUnits.length > 0) {
          gsap.fromTo('.unit-item', 
            { opacity: 0, x: -20 }, 
            { opacity: 1, x: 0, stagger: 0.05, duration: 0.3, ease: 'power2.out', delay: 0.1 }
          );
        }
      } else if (activeTab === 'ordenes') {
        gsap.fromTo('.orders-view', 
          { opacity: 0, y: 10 }, 
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
        );
        if (unitOrders.length > 0) {
          gsap.fromTo('.order-item', 
            { opacity: 0, x: -20 }, 
            { opacity: 1, x: 0, stagger: 0.05, duration: 0.3, ease: 'power2.out', delay: 0.1 }
          );
        }
      }
    }
  }, [activeTab, userUnits, unitOrders, selectedUser]);

  const closeDeleteModal = () => {
    setDeleteModal(prev => ({ ...prev, closing: true }));
    const tl = gsap.timeline({ onComplete: () => setDeleteModal({ isOpen: false, type: '', id: null, closing: false }) });
    tl.to(deletePanelRef.current, { scale: 0.9, opacity: 0, y: 10, duration: 0.2, ease: 'power2.in' });
    tl.to(deleteBgRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, "-=0.1");
  };

  const closeInfoModal = () => {
    setInfoModal(prev => ({ ...prev, closing: true }));
    const tl = gsap.timeline({ onComplete: () => setInfoModal({ isOpen: false, unit: null, closing: false }) });
    tl.to(infoPanelRef.current, { scale: 0.9, opacity: 0, y: 10, duration: 0.2, ease: 'power2.in' });
    tl.to(infoBgRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, "-=0.1");
  };

  const openOrderInfoModal = (order) => {
    setOrderInfoModal({ isOpen: true, order, closing: false });
  };

  const closeOrderInfoModal = () => {
    setOrderInfoModal(prev => ({ ...prev, closing: true }));
    const tl = gsap.timeline({ onComplete: () => setOrderInfoModal({ isOpen: false, order: null, closing: false }) });
    tl.to(orderInfoPanelRef.current, { scale: 0.9, opacity: 0, y: 10, duration: 0.2, ease: 'power2.in' });
    tl.to(orderInfoBgRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, "-=0.1");
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) setUsers(await res.json());
    } catch (e) {
      showAlert('Error al cargar usuarios', 'error');
    }
  };

  const fetchUserUnits = async (email) => {
    try {
      const res = await fetch(`/api/admin/users/${email}/units`);
      if (res.ok) {
        const units = await res.json();
        setUserUnits(units);
        if (units.length > 0) setSelectedUnit(units[0].idUnidad);
        else setSelectedUnit('');
      }
    } catch (e) {
      showAlert('Error al cargar unidades', 'error');
    }
  };

  /* Funciones de Acción y Fetch */
  const fetchUnitOrders = async (unitId) => {
    try {
      const res = await fetch(`/api/admin/units/${unitId}/orders`);
      if (res.ok) {
        setUnitOrders(await res.json());
      }
    } catch (e) {
      showAlert('Error al cargar órdenes', 'error');
    }
  };

  /* Confirmación de Acción (Eliminar / Cancelar) */
  const confirmAction = async () => {
    const { type, id, action } = deleteModal; // 'action' puede ser 'delete' o 'cancel'
    try {
      let endpoint = '';
      let method = 'DELETE';
      
      if (action === 'cancel' && type === 'orden') {
        endpoint = `/api/admin/orders/${id}/cancel?adminEmail=${user.email}`;
        method = 'POST';
      } else {
        endpoint = `/api/admin/${type === 'usuario' ? 'users' : type === 'unidad' ? 'units' : 'orders'}/${id}?adminEmail=${user.email}`;
      }

      const res = await fetch(endpoint, { method });
      if (res.ok) {
        showAlert(action === 'cancel' ? 'Orden cancelada.' : `${type.toUpperCase()} eliminado.`, 'success');
        if (type === 'usuario') {
          if (selectedUser?.IDUsuario === id) setSelectedUser(null);
          fetchUsers();
        } else if (type === 'unidad') {
          fetchUserUnits(selectedUser.Email);
        } else if (type === 'orden') {
          fetchUnitOrders(selectedUnit);
        }
      } else {
        const err = await res.json();
        showAlert(err.error || `Error al ${action === 'cancel' ? 'cancelar' : 'eliminar'}`, 'error');
      }
    } catch (e) {
      showAlert('Error de red', 'error');
    } finally {
      closeDeleteModal();
    }
  };

  const openActionModal = (type, id, action = 'delete') => {
    setDeleteModal({ isOpen: true, type, id, action, closing: false });
  };

  const [loadingInfo, setLoadingInfo] = useState(false);

  const openInfoModal = async (unit) => {
    setInfoModal({ isOpen: true, unit, closing: false, details: null });
    setLoadingInfo(true);
    try {
      const res = await fetch(`/api/admin/units/${unit.idUnidad}`);
      if (res.ok) {
        const details = await res.json();
        setInfoModal(prev => ({ ...prev, details }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingInfo(false);
    }
  };

  return (
    <div ref={mainRef} className="w-full h-[calc(100vh-6rem)] max-w-7xl mx-auto px-4 py-6 flex flex-col overflow-hidden">
      <div className="mb-4 shrink-0">
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">Gestión Estructural</h1>
        <p className="text-outline mt-1 font-body text-md">Control jerárquico de usuarios y sus recursos.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
        {/* COLUMNA IZQUIERDA: USUARIOS */}
        <div className="w-full md:w-1/3 bg-[#121212]/[0.85] backdrop-blur-md rounded-2xl border border-outline/10 flex flex-col shadow-lg overflow-hidden shrink-0">
          <div className="p-4 border-b border-outline/10 shrink-0 bg-[#1a1a1a]/[0.85] backdrop-blur-md">
            <h2 className="text-xl font-display font-bold text-white flex items-center">
              <span className="material-symbols-outlined text-[#FFD700] mr-2">group</span> 
              Usuarios
              <span className="ml-2 bg-white/5 border border-outline/10 px-2.5 py-0.5 rounded-full text-[#FFD700] text-sm font-mono">{users.length}</span>
            </h2>
          </div>
          <div className="p-4 overflow-y-auto space-y-2 flex-1 custom-scrollbar">
            {users.map(u => (
              <div 
                key={u.IDUsuario} 
                onClick={() => setSelectedUser(u)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedUser?.IDUsuario === u.IDUsuario ? 'bg-[#FFD700]/10 border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.2)]' : 'bg-[#1a1a1a]/[0.85] backdrop-blur-md border-outline/10 hover:border-[#FFD700]/50'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-medium truncate">{u.NombreUsuario}</h3>
                    <p className="text-xs text-outline truncate">{u.Email}</p>
                    {u.isAdmin && <span className="inline-block mt-1 px-2 py-0.5 bg-[#FFD700]/20 text-[#FFD700] text-[10px] rounded-full uppercase tracking-wider font-bold">Admin</span>}
                  </div>
                  {u.Email !== user.email && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); openActionModal('usuario', u.IDUsuario, 'delete'); }} 
                      className="p-1.5 text-red-500 hover:bg-red-500/20 rounded-lg transition-all"
                      title="Eliminar usuario"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: RECURSOS */}
        <div className="w-full md:w-2/3 bg-[#121212]/[0.85] backdrop-blur-md rounded-2xl border border-outline/10 flex flex-col shadow-lg overflow-hidden">
          {selectedUser ? (
            <>
              {/* HEADER TAB */}
              <div className="p-4 border-b border-outline/10 shrink-0 bg-[#1a1a1a]/[0.85] backdrop-blur-md flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center text-[#FFD700] font-bold text-lg">
                    {selectedUser.NombreUsuario.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-white">{selectedUser.NombreUsuario}</h2>
                    <p className="text-sm text-outline">Recursos Asignados</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveTab('unidades')}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all ${activeTab === 'unidades' ? 'bg-[#FFD700] text-black shadow-[0_0_10px_rgba(255,215,0,0.3)]' : 'bg-white/5 text-white hover:bg-white/10 border border-outline/10'}`}
                  >
                    <span className="material-symbols-outlined align-middle mr-2 text-[18px]">memory</span>
                    Unidades
                  </button>
                  <button 
                    onClick={() => setActiveTab('ordenes')}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all ${activeTab === 'ordenes' ? 'bg-[#FFD700] text-black shadow-[0_0_10px_rgba(255,215,0,0.3)]' : 'bg-white/5 text-white hover:bg-white/10 border border-outline/10'}`}
                  >
                    <span className="material-symbols-outlined align-middle mr-2 text-[18px]">receipt_long</span>
                    Órdenes
                  </button>
                </div>
              </div>

              {/* CONTENIDO DERECHO (Scroll) */}
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                
                {activeTab === 'unidades' && (() => {
                  const ownUnits = userUnits.filter(u => u.rol === 'Propietario');
                  const linkedUnits = userUnits.filter(u => u.rol !== 'Propietario');
                  
                  return (
                  <div className="units-view space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    {userUnits.length === 0 ? (
                      <p className="text-outline text-center py-8">Este usuario no posee unidades asignadas.</p>
                    ) : (
                      <>
                        {/* Unidades Propias */}
                        {ownUnits.length > 0 && (
                          <div className="space-y-4">
                            <h3 className="text-white font-semibold flex items-center mb-4 border-b border-outline/10 pb-2">
                              Unidades Propias
                              <span className="ml-2 bg-[#FFD700]/20 border border-[#FFD700]/30 px-2 py-0.5 rounded-full text-[#FFD700] text-xs font-mono">{ownUnits.length}</span>
                            </h3>
                            <div className="grid gap-4">
                              {ownUnits.map(unit => (
                                <div key={unit.idUnidad} className="unit-item bg-[#1a1a1a]/[0.85] backdrop-blur-md border border-outline/10 p-4 rounded-xl flex items-center justify-between group hover:border-[#FFD700]/50 transition-all">
                                  <div>
                                    <h4 className="text-white font-medium">{unit.nombre || 'Sin Nombre'}</h4>
                                    <p className="text-xs text-outline">ID: {unit.idUnidad} · Estado: {unit.estado}</p>
                                  </div>
                                  <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openInfoModal(unit)} className="p-2 text-[#FFD700] hover:bg-[#FFD700]/20 rounded-lg transition-colors flex items-center justify-center" title="Ver Info">
                                      <span className="material-symbols-outlined text-[20px]">info</span>
                                    </button>
                                    <button onClick={() => openActionModal('unidad', unit.idUnidad, 'delete')} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors flex items-center justify-center" title="Eliminar">
                                      <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Unidades Vinculadas */}
                        {linkedUnits.length > 0 && (
                          <div className="space-y-4">
                            <h3 className="text-white font-semibold flex items-center mb-4 border-b border-outline/10 pb-2">
                              Unidades Vinculadas
                              <span className="ml-2 bg-white/5 border border-outline/10 px-2 py-0.5 rounded-full text-white/70 text-xs font-mono">{linkedUnits.length}</span>
                            </h3>
                            <div className="grid gap-4">
                              {linkedUnits.map(unit => (
                                <div key={unit.idUnidad} className="unit-item bg-[#1a1a1a]/[0.85] backdrop-blur-md border border-outline/10 p-4 rounded-xl flex items-center justify-between group hover:border-[#FFD700]/50 transition-all">
                                  <div className="flex-1">
                                    <h4 className="text-white font-medium flex items-center gap-3">
                                      {unit.nombre || 'Sin Nombre'}
                                      <span className="bg-white/10 text-on-surface-variant px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border border-white/5">{unit.rol}</span>
                                    </h4>
                                    <p className="text-xs text-outline mt-1">ID: {unit.idUnidad} · Estado: {unit.estado}</p>
                                  </div>
                                  <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openInfoModal(unit)} className="p-2 text-[#FFD700] hover:bg-[#FFD700]/20 rounded-lg transition-colors flex items-center justify-center" title="Ver Info">
                                      <span className="material-symbols-outlined text-[20px]">info</span>
                                    </button>
                                    <button onClick={() => openActionModal('unidad', unit.idUnidad, 'delete')} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors flex items-center justify-center" title="Desvincular">
                                      <span className="material-symbols-outlined text-[20px]">link_off</span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )})()}

                {activeTab === 'ordenes' && (
                  <div className="orders-view space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {userUnits.length === 0 ? (
                      <p className="text-outline text-center py-8">No hay unidades para consultar órdenes.</p>
                    ) : (
                      <>
                        <div className="mb-6 relative z-50">
                          <label className="block text-sm font-medium text-outline mb-2">Seleccionar Unidad</label>
                          <div className="relative group">
                            <div 
                              onClick={() => setIsUnitDropdownOpen(!isUnitDropdownOpen)}
                              className={`w-full bg-[#000000]/50 border ${isUnitDropdownOpen ? 'border-[#FFD700] ring-1 ring-[#FFD700]/20' : 'border-white/20 hover:border-[#FFD700]/50'} text-white font-body-md rounded-xl px-4 py-4 transition-all cursor-pointer flex items-center justify-between select-none`}
                            >
                              {selectedUnit ? (
                                <span className="flex items-center gap-2">
                                  {userUnits.find(u => u.idUnidad === selectedUnit)?.nombre || 'Sin Nombre'}
                                  <span className="bg-[#FFD700]/20 text-[#FFD700] px-2 py-0.5 rounded font-mono text-[10px] uppercase tracking-wider ml-1">ID: {selectedUnit}</span>
                                </span>
                              ) : (
                                <span className="text-outline/50">Selecciona una unidad...</span>
                              )}
                              <span className={`material-symbols-outlined transition-transform duration-300 ${isUnitDropdownOpen ? 'rotate-180 text-[#FFD700]' : 'text-white/50 group-hover:text-[#FFD700]'}`}>expand_more</span>
                            </div>
                            
                            {isUnitDropdownOpen && (
                              <div className="absolute top-full left-0 w-full mt-2 bg-[#0a0a0a] border border-[#FFD700]/30 rounded-xl overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.9)] max-h-48 overflow-y-auto custom-scrollbar z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                                {userUnits.map(unit => (
                                  <div 
                                    key={unit.idUnidad}
                                    onClick={() => {
                                      setSelectedUnit(unit.idUnidad);
                                      setIsUnitDropdownOpen(false);
                                    }}
                                    className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-all ${
                                      selectedUnit === unit.idUnidad 
                                        ? 'bg-[#FFD700]/20 text-[#FFD700] border-l-2 border-[#FFD700]' 
                                        : 'text-white hover:bg-white/10 border-l-2 border-transparent'
                                    }`}
                                  >
                                    <div className={`w-2 h-2 rounded-full transition-all ${selectedUnit === unit.idUnidad ? 'bg-[#FFD700] shadow-[0_0_8px_#FFD700]' : 'bg-white/20'}`}></div>
                                    <span className="flex items-center gap-2 text-sm">
                                      {unit.nombre || 'Sin Nombre'}
                                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase tracking-wider ${selectedUnit === unit.idUnidad ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'bg-white/10 text-on-surface-variant'}`}>
                                        ID: {unit.idUnidad}
                                      </span>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {selectedUnit && (
                          <div>
                            <h3 className="text-white font-semibold flex items-center mb-4">
                              Órdenes Transmitidas
                              <span className="ml-2 bg-white/5 border border-outline/10 px-2 py-0.5 rounded-full text-[#FFD700] text-xs font-mono">{unitOrders.length}</span>
                            </h3>
                            {unitOrders.length === 0 ? (
                              <p className="text-outline text-center py-4">No hay órdenes en esta unidad.</p>
                            ) : (
                              <div className="space-y-2">
                                {unitOrders.map(order => {
                                  const isCancelable = order.estado?.toUpperCase() === 'EN COLA' || order.estado?.toUpperCase() === 'EN CURSO';
                                  
                                  return (
                                    <div key={order.idOrden} className="order-item bg-white/5 border border-outline/10 p-4 rounded-xl flex items-center justify-between group hover:border-[#FFD700]/30 transition-all">
                                      <div>
                                        <h4 className="text-white font-medium text-sm">Comando: <span className="text-[#FFD700]">{order.orden}</span></h4>
                                        <p className="text-xs text-outline mt-1">ID: #{order.idOrden} · Estado: {order.estado}</p>
                                      </div>
                                      <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openOrderInfoModal(order)} className="p-2 text-[#FFD700] hover:bg-[#FFD700]/20 rounded-lg transition-colors flex items-center justify-center" title="Ver Detalles">
                                          <span className="material-symbols-outlined text-[20px]">info</span>
                                        </button>
                                        
                                        {isCancelable ? (
                                          <button onClick={() => openActionModal('orden', order.idOrden, 'cancel')} className="p-2 text-orange-500 hover:bg-orange-500/20 rounded-lg transition-colors flex items-center justify-center" title="Cancelar Orden">
                                            <span className="material-symbols-outlined text-[20px]">stop_circle</span>
                                          </button>
                                        ) : (
                                          <button onClick={() => openActionModal('orden', order.idOrden, 'delete')} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors flex items-center justify-center" title="Eliminar Orden">
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-outline p-8 text-center">
              <span className="material-symbols-outlined text-[64px] mb-4 opacity-20">touch_app</span>
              <h2 className="text-xl font-medium text-white mb-2">Selecciona un Usuario</h2>
              <p>Haz clic en un usuario de la lista de la izquierda para ver y administrar sus unidades y órdenes asignadas.</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {deleteModal.isOpen && (
        <div ref={deleteBgRef} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] opacity-0" onClick={closeDeleteModal}>
          <div ref={deletePanelRef} onClick={e => e.stopPropagation()} className={`bg-[#121212]/[0.85] backdrop-blur-md border ${deleteModal.action === 'cancel' ? 'border-orange-500/30 shadow-[0_0_40px_rgba(249,115,22,0.15)]' : 'border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.15)]'} rounded-2xl p-6 w-full max-w-md opacity-0`}>
            <h2 className="text-2xl font-display font-bold text-white mb-2">{deleteModal.action === 'cancel' ? 'Confirmar Cancelación' : 'Confirmar Eliminación'}</h2>
            <p className="text-outline mb-6 text-sm">
              {deleteModal.action === 'cancel' ? (
                <>¿Estás seguro de que deseas cancelar la <strong>{deleteModal.type}</strong> con ID: <span className="text-[#FFD700]">{deleteModal.id}</span>? Quedará registro en el historial.</>
              ) : (
                <>¿Estás completamente seguro de que deseas forzar la eliminación de este(a) <strong>{deleteModal.type}</strong> con ID: <span className="text-[#FFD700]">{deleteModal.id}</span>? Esta acción destruirá los vínculos en la base de datos permanentemente.</>
              )}
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={closeDeleteModal} className="px-5 py-2 rounded-lg font-medium text-white hover:bg-white/10 transition-colors">
                Cerrar
              </button>
              <button onClick={confirmAction} className={`px-5 py-2 rounded-lg font-medium text-white transition-colors ${deleteModal.action === 'cancel' ? 'bg-orange-600 hover:bg-orange-500' : 'bg-red-600 hover:bg-red-500'}`}>
                {deleteModal.action === 'cancel' ? 'Sí, Cancelar' : 'Sí, Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {infoModal.isOpen && infoModal.unit && (
        <div ref={infoBgRef} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] opacity-0" onClick={closeInfoModal}>
          <div ref={infoPanelRef} onClick={e => e.stopPropagation()} className="bg-[#121212]/[0.85] backdrop-blur-md border border-[#FFD700]/30 rounded-2xl p-6 w-full max-w-md shadow-[0_0_40px_rgba(255,215,0,0.15)] opacity-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#FFD700]">memory</span> 
                {infoModal.unit.nombre || 'Sin Nombre'}
              </h2>
              <button onClick={closeInfoModal} className="text-outline hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-4 text-sm bg-[#1a1a1a]/[0.85] backdrop-blur-md p-4 rounded-xl border border-outline/10">
              <div className="flex justify-between border-b border-outline/10 pb-2 items-center">
                <span className="text-outline">ID de Unidad</span>
                <span className="text-white font-mono">{infoModal.unit.idUnidad}</span>
              </div>
              <div className="flex justify-between border-b border-outline/10 pb-2 items-center">
                <span className="text-outline">Estado</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${infoModal.unit.estado === 'Activo' || infoModal.unit.estado === 'Online' ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-red-500/20 border-red-500/30 text-red-400'}`}>
                  {infoModal.unit.estado}
                </span>
              </div>
              <div className="flex justify-between border-b border-outline/10 pb-2 items-center">
                <span className="text-outline">Rol del Usuario</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${(() => {
                  const val = infoModal.unit.rol;
                  if (val === 'Invitado') return 'bg-white/5 border-white/10 text-white/80';
                  if (val === 'Operador') return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
                  if (val === 'Administrador') return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
                  if (val === 'Co-Propietario') return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
                  if (val === 'Propietario') return 'bg-[#FFD700]/10 border-[#FFD700]/20 text-[#FFD700]';
                  return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
                })()}`}>{infoModal.unit.rol}</span>
              </div>
              {infoModal.details ? (
                <>
                  <div className="flex justify-between border-b border-outline/10 pb-2 items-center">
                    <span className="text-outline">Fecha de Creación</span>
                    <span className="text-white">{new Date(Number(infoModal.details.CreatedAtMs)).toLocaleString()}</span>
                  </div>
                  {infoModal.details.Descripcion && (
                    <div className="flex flex-col border-b border-outline/10 pb-2">
                      <span className="text-outline mb-1">Descripción</span>
                      <p className="text-white whitespace-pre-wrap">{infoModal.details.Descripcion}</p>
                    </div>
                  )}
                </>
              ) : loadingInfo ? (
                <div className="text-center py-2 text-[#FFD700] animate-pulse font-medium text-xs">Cargando más detalles...</div>
              ) : null}
              <p className="text-xs text-center text-outline/50 mt-4 italic">El código de vinculación está encriptado por motivos de seguridad.</p>
            </div>
          </div>
        </div>
      )}

      {/* Order Info Modal */}
      {orderInfoModal.isOpen && orderInfoModal.order && (
        <div ref={orderInfoBgRef} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] opacity-0" onClick={closeOrderInfoModal}>
          <div ref={orderInfoPanelRef} onClick={e => e.stopPropagation()} className="bg-[#121212]/[0.85] backdrop-blur-md border border-[#FFD700]/30 rounded-2xl p-6 w-full max-w-lg shadow-[0_0_40px_rgba(255,215,0,0.15)] opacity-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#FFD700]">receipt_long</span> 
                Orden #{orderInfoModal.order.idOrden}
              </h2>
              <button onClick={closeOrderInfoModal} className="text-outline hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-4 text-sm bg-[#1a1a1a]/[0.85] backdrop-blur-md p-4 rounded-xl border border-outline/10">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col border-b border-outline/10 pb-2">
                  <span className="text-outline text-xs uppercase tracking-widest mb-1">Estado</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold border inline-block w-max ${orderInfoModal.order.estado === 'Finalizada' || orderInfoModal.order.estado === 'FINALIZADA' ? 'bg-green-500/20 border-green-500/30 text-green-400' : orderInfoModal.order.estado === 'En Cola' || orderInfoModal.order.estado === 'Pendiente' ? 'bg-[#FFD700]/20 border-[#FFD700]/30 text-[#FFD700]' : 'bg-blue-500/20 border-blue-500/30 text-blue-400'}`}>
                    {orderInfoModal.order.estado}
                  </span>
                </div>
                <div className="flex flex-col border-b border-outline/10 pb-2">
                  <span className="text-outline text-xs uppercase tracking-widest mb-1">Remitente</span>
                  <span className="text-white font-mono truncate" title={orderInfoModal.order.userEmail || 'Sistema'}>{orderInfoModal.order.userEmail || 'Sistema'}</span>
                </div>
                <div className="flex flex-col border-b border-outline/10 pb-2">
                  <span className="text-outline text-xs uppercase tracking-widest mb-1">Emisión</span>
                  <span className="text-white font-mono">{orderInfoModal.order.createdAtMs ? new Date(orderInfoModal.order.createdAtMs).toLocaleString() : (orderInfoModal.order.fechaHora || 'Desconocida')}</span>
                </div>
                <div className="flex flex-col border-b border-outline/10 pb-2">
                  <span className="text-outline text-xs uppercase tracking-widest mb-1">Finalización</span>
                  <span className="text-[#FFD700] font-mono">{orderInfoModal.order.finishedAtMs ? new Date(orderInfoModal.order.finishedAtMs).toLocaleString() : 'En proceso...'}</span>
                </div>
                <div className="flex flex-col border-b border-outline/10 pb-2 col-span-2">
                  <span className="text-outline text-xs uppercase tracking-widest mb-1">Duración Total</span>
                  <span className="text-white font-mono">{orderInfoModal.order.durationMs ? `${(orderInfoModal.order.durationMs / 1000).toFixed(1)} segundos` : '-'}</span>
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="text-outline text-xs uppercase tracking-widest mb-1">Directiva</span>
                  <div className="bg-black/50 border border-white/10 rounded-lg p-3 text-white font-display text-base">
                    {orderInfoModal.order.orden}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
