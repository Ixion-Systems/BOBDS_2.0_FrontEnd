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

  // Modals state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: '', id: null, closing: false });
  const [infoModal, setInfoModal] = useState({ isOpen: false, unit: null, closing: false });

  const deleteBgRef = useRef(null);
  const deletePanelRef = useRef(null);
  const infoBgRef = useRef(null);
  const infoPanelRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchUserUnits(selectedUser.Email);
    } else {
      setUserUnits([]);
      setUnitOrders([]);
      setSelectedUnit('');
    }
  }, [selectedUser]);

  useEffect(() => {
    if (activeTab === 'ordenes' && selectedUnit) {
      fetchUnitOrders(selectedUnit);
    } else {
      setUnitOrders([]);
    }
  }, [activeTab, selectedUnit]);

  useGSAP(() => {
    if (deleteModal.isOpen && !deleteModal.closing) {
      gsap.fromTo(deleteBgRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' });
      gsap.fromTo(deletePanelRef.current, { scale: 0.9, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' });
    }
    if (infoModal.isOpen && !infoModal.closing) {
      gsap.fromTo(infoBgRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' });
      gsap.fromTo(infoPanelRef.current, { scale: 0.9, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' });
    }
  }, [deleteModal.isOpen, deleteModal.closing, infoModal.isOpen, infoModal.closing]);

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

  const confirmDelete = async () => {
    const { type, id } = deleteModal;
    try {
      let endpoint = `/api/admin/${type === 'usuario' ? 'users' : type === 'unidad' ? 'units' : 'orders'}/${id}?adminEmail=${user.email}`;
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        showAlert(`${type.toUpperCase()} eliminado.`, 'success');
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
        showAlert(err.error || 'Error al eliminar', 'error');
      }
    } catch (e) {
      showAlert('Error de red', 'error');
    } finally {
      closeDeleteModal();
    }
  };

  const openDeleteModal = (type, id) => {
    setDeleteModal({ isOpen: true, type, id, closing: false });
  };

  const openInfoModal = (unit) => {
    setInfoModal({ isOpen: true, unit, closing: false });
  };

  return (
    <div className="w-full h-[calc(100vh-6rem)] max-w-7xl mx-auto px-4 py-6 flex flex-col overflow-hidden">
      <div className="mb-4 shrink-0">
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">Gestión Estructural</h1>
        <p className="text-outline mt-1 font-body text-md">Control jerárquico de usuarios y sus recursos.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
        {/* COLUMNA IZQUIERDA: USUARIOS */}
        <div className="w-full md:w-1/3 bg-[#121212] rounded-2xl border border-outline/10 flex flex-col shadow-lg overflow-hidden shrink-0">
          <div className="p-4 border-b border-outline/10 shrink-0 bg-[#1a1a1a]">
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
                className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedUser?.IDUsuario === u.IDUsuario ? 'bg-[#FFD700]/10 border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.2)]' : 'bg-[#1a1a1a] border-outline/10 hover:border-[#FFD700]/50'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-medium truncate">{u.NombreUsuario}</h3>
                    <p className="text-xs text-outline truncate">{u.Email}</p>
                    {u.isAdmin && <span className="inline-block mt-1 px-2 py-0.5 bg-[#FFD700]/20 text-[#FFD700] text-[10px] rounded-full uppercase tracking-wider font-bold">Admin</span>}
                  </div>
                  {u.Email !== user.email && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); openDeleteModal('usuario', u.IDUsuario); }} 
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
        <div className="w-full md:w-2/3 bg-[#121212] rounded-2xl border border-outline/10 flex flex-col shadow-lg overflow-hidden">
          {selectedUser ? (
            <>
              {/* HEADER TAB */}
              <div className="p-4 border-b border-outline/10 shrink-0 bg-[#1a1a1a] flex flex-col gap-4">
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
                
                {activeTab === 'unidades' && (
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold flex items-center mb-4">
                      Unidades
                      <span className="ml-2 bg-white/5 border border-outline/10 px-2 py-0.5 rounded-full text-[#FFD700] text-xs font-mono">{userUnits.length}</span>
                    </h3>
                    {userUnits.length === 0 ? (
                      <p className="text-outline text-center py-8">Este usuario no posee unidades asignadas.</p>
                    ) : (
                      userUnits.map(unit => (
                        <div key={unit.idUnidad} className="bg-[#1a1a1a] border border-outline/10 p-4 rounded-xl flex items-center justify-between group hover:border-[#FFD700]/50 transition-all">
                          <div>
                            <h4 className="text-white font-medium">{unit.nombre || 'Sin Nombre'}</h4>
                            <p className="text-xs text-outline">ID: {unit.idUnidad} · Estado: {unit.estado}</p>
                          </div>
                          <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openInfoModal(unit)} className="p-2 text-[#FFD700] hover:bg-[#FFD700]/20 rounded-lg transition-colors flex items-center justify-center" title="Ver Info">
                              <span className="material-symbols-outlined text-[20px]">info</span>
                            </button>
                            <button onClick={() => openDeleteModal('unidad', unit.idUnidad)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors flex items-center justify-center" title="Eliminar">
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'ordenes' && (
                  <div className="space-y-4">
                    {userUnits.length === 0 ? (
                      <p className="text-outline text-center py-8">No hay unidades para consultar órdenes.</p>
                    ) : (
                      <>
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-outline mb-2">Seleccionar Unidad</label>
                          <div className="relative">
                            <div 
                              onClick={() => setIsUnitDropdownOpen(!isUnitDropdownOpen)}
                              className="w-full bg-[#1a1a1a] border border-outline/20 rounded-lg px-4 py-3 text-white outline-none hover:border-[#FFD700]/50 transition-colors cursor-pointer flex justify-between items-center"
                            >
                              {selectedUnit ? (
                                <div className="flex items-center gap-2">
                                  <span>{userUnits.find(u => u.idUnidad === selectedUnit)?.nombre || 'Sin Nombre'}</span>
                                  <span className="bg-white/5 border border-outline/10 px-2 py-0.5 rounded-md text-[#FFD700] text-xs font-mono">{selectedUnit}</span>
                                </div>
                              ) : (
                                <span className="text-outline/50">Selecciona una unidad...</span>
                              )}
                              <span className={`material-symbols-outlined transition-transform ${isUnitDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                            </div>
                            
                            {isUnitDropdownOpen && (
                              <div className="absolute top-full left-0 w-full mt-2 bg-[#1a1a1a] border border-[#FFD700]/30 rounded-lg overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.8)] z-50">
                                {userUnits.map(unit => (
                                  <div 
                                    key={unit.idUnidad}
                                    onClick={() => {
                                      setSelectedUnit(unit.idUnidad);
                                      setIsUnitDropdownOpen(false);
                                    }}
                                    className="px-4 py-3 hover:bg-[#FFD700]/10 cursor-pointer flex items-center justify-between border-b border-outline/10 last:border-0"
                                  >
                                    <span className="text-white">{unit.nombre || 'Sin Nombre'}</span>
                                    <span className="bg-white/5 border border-outline/10 px-2 py-0.5 rounded-md text-[#FFD700] text-xs font-mono">{unit.idUnidad}</span>
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
                                {unitOrders.map(order => (
                                  <div key={order.idOrden} className="bg-white/5 border border-outline/10 p-4 rounded-xl flex items-center justify-between group hover:border-[#FFD700]/30 transition-all">
                                    <div>
                                      <h4 className="text-white font-medium text-sm">Comando: <span className="text-[#FFD700]">{order.orden}</span></h4>
                                      <p className="text-xs text-outline mt-1">ID: #{order.idOrden} · Estado: {order.estado}</p>
                                    </div>
                                    <button onClick={() => openDeleteModal('orden', order.idOrden)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center" title="Eliminar Orden">
                                      <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                  </div>
                                ))}
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

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div ref={deleteBgRef} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] opacity-0" onClick={closeDeleteModal}>
          <div ref={deletePanelRef} onClick={e => e.stopPropagation()} className="bg-[#121212] border border-red-500/30 rounded-2xl p-6 w-full max-w-md shadow-[0_0_40px_rgba(239,68,68,0.15)] opacity-0">
            <h2 className="text-2xl font-display font-bold text-white mb-2">Confirmar Eliminación</h2>
            <p className="text-outline mb-6 text-sm">
              ¿Estás completamente seguro de que deseas forzar la eliminación de este(a) <strong>{deleteModal.type}</strong> con ID: <span className="text-[#FFD700]">{deleteModal.id}</span>? 
              Esta acción destruirá los vínculos en la base de datos permanentemente.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={closeDeleteModal} className="px-5 py-2 rounded-lg font-medium text-white hover:bg-white/10 transition-colors">
                Cancelar
              </button>
              <button onClick={confirmDelete} className="px-5 py-2 rounded-lg font-medium bg-red-600 hover:bg-red-500 text-white transition-colors">
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {infoModal.isOpen && infoModal.unit && (
        <div ref={infoBgRef} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] opacity-0" onClick={closeInfoModal}>
          <div ref={infoPanelRef} onClick={e => e.stopPropagation()} className="bg-[#121212] border border-[#FFD700]/30 rounded-2xl p-6 w-full max-w-md shadow-[0_0_40px_rgba(255,215,0,0.15)] opacity-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#FFD700]">memory</span> 
                {infoModal.unit.nombre || 'Sin Nombre'}
              </h2>
              <button onClick={closeInfoModal} className="text-outline hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-4 text-sm bg-[#1a1a1a] p-4 rounded-xl border border-outline/10">
              <div className="flex justify-between border-b border-outline/10 pb-2">
                <span className="text-outline">ID de Unidad</span>
                <span className="text-white font-mono">{infoModal.unit.idUnidad}</span>
              </div>
              <div className="flex justify-between border-b border-outline/10 pb-2">
                <span className="text-outline">Estado</span>
                <span className="text-[#FFD700] font-medium uppercase tracking-wider">{infoModal.unit.estado}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Rol del Propietario</span>
                <span className="text-white">{infoModal.unit.rol}</span>
              </div>
              <p className="text-xs text-center text-outline/50 mt-4 italic">El código de vinculación está encriptado por motivos de seguridad.</p>
            </div>
            
            <button onClick={closeInfoModal} className="w-full mt-6 px-4 py-2 bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20 border border-[#FFD700]/30 rounded-lg font-medium transition-colors">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
