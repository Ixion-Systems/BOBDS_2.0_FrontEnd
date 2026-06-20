import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';

const AdminMonitorPage = () => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Filtros
  const [selectedUser, setSelectedUser] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL'); // ALL, LECTURA, ESCRITURA
  const [sortOrder, setSortOrder] = useState('DESC'); // DESC, ASC
  
  // Modal State
  const [selectedLog, setSelectedLog] = useState(null);
  const [entityData, setEntityData] = useState(null);
  const [loadingEntity, setLoadingEntity] = useState(false);
  
  const modalBgRef = useRef(null);
  const modalPanelRef = useRef(null);
  const [isClosingLog, setIsClosingLog] = useState(false);

  // Custom Confirm Modal State
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { tipoEntidad, entidadId }
  const confirmBgRef = useRef(null);
  const confirmPanelRef = useRef(null);
  const [isClosingConfirm, setIsClosingConfirm] = useState(false);

  const mainRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(mainRef.current.children, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
    );
  }, []);

  useGSAP(() => {
    if (getFilteredLogs().length > 0) {
      gsap.fromTo('.log-item', 
        { opacity: 0, x: -20 }, 
        { opacity: 1, x: 0, stagger: 0.05, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [logs, filterType, selectedUser, sortOrder]);

  useGSAP(() => {
    if (selectedLog && !isClosingLog) {
      gsap.fromTo(modalBgRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' });
      gsap.fromTo(modalPanelRef.current, 
        { scale: 0.9, opacity: 0, y: 20 }, 
        { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }
      );
    }
  }, [selectedLog, isClosingLog]);

  useGSAP(() => {
    if (deleteConfirm && !isClosingConfirm) {
      gsap.fromTo(confirmBgRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' });
      gsap.fromTo(confirmPanelRef.current, 
        { scale: 0.9, opacity: 0, y: 20 }, 
        { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: 'back.out(1.5)' }
      );
    }
  }, [deleteConfirm, isClosingConfirm]);

  const closeLogModal = () => {
    setIsClosingLog(true);
    const tl = gsap.timeline({ onComplete: () => {
      setSelectedLog(null);
      setIsClosingLog(false);
      setEntityData(null);
    }});
    tl.to(modalPanelRef.current, { scale: 0.9, opacity: 0, y: 10, duration: 0.2, ease: 'power2.in' });
    tl.to(modalBgRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, "-=0.1");
  };

  const closeConfirmModal = () => {
    setIsClosingConfirm(true);
    const tl = gsap.timeline({ onComplete: () => {
      setDeleteConfirm(null);
      setIsClosingConfirm(false);
    }});
    tl.to(confirmPanelRef.current, { scale: 0.9, opacity: 0, y: 10, duration: 0.2, ease: 'power2.in' });
    tl.to(confirmBgRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, "-=0.1");
  };

  useEffect(() => {
    fetchLogs();
    fetchUsers();

    const eventSource = new EventSource('/api/stream', { withCredentials: true });
    
    eventSource.addEventListener('admin_log', (event) => {
      fetchLogs();
    });

    eventSource.onerror = (error) => {
      console.error('SSE Error in AdminMonitorPage:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/logs');
      if (res.ok) setLogs(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) setUsers(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const getFilteredLogs = () => {
    let filtered = logs;
    
    if (selectedUser !== 'ALL') {
      filtered = filtered.filter(l => l.emailUsuario === selectedUser);
    }
    
    if (filterType === 'LECTURA') {
      filtered = filtered.filter(l => l.gravedad === 4);
    } else if (filterType === 'ESCRITURA') {
      filtered = filtered.filter(l => l.gravedad !== 4);
    }
    
    filtered.sort((a, b) => {
      // Comparación simple de strings de fecha (suponiendo formato ISO o YYYY-MM-DD HH:mm:ss)
      if (sortOrder === 'DESC') return b.fechaHora.localeCompare(a.fechaHora);
      return a.fechaHora.localeCompare(b.fechaHora);
    });
    
    return filtered;
  };

  const handleLogClick = (log) => {
    setSelectedLog(log);
    setEntityData(null); // reset
  };

  const fetchEntityDetails = async (tipoEntidad, entidadId) => {
    if (!tipoEntidad || !entidadId) return;
    setLoadingEntity(true);
    try {
      let endpoint = '';
      if (tipoEntidad.toLowerCase() === 'unidad') endpoint = `/api/admin/units/${entidadId}`;
      else if (tipoEntidad.toLowerCase() === 'orden') endpoint = `/api/admin/orders/${entidadId}`;
      else if (tipoEntidad.toLowerCase() === 'usuario') endpoint = `/api/admin/users/${entidadId}`;
      
      if (endpoint) {
        const res = await fetch(endpoint);
        if (res.ok) {
          setEntityData(await res.json());
        } else {
          showAlert('La entidad ya no existe o no se pudo cargar.', 'error');
        }
      }
    } catch (e) {
      showAlert('Error de red al cargar la entidad', 'error');
    } finally {
      setLoadingEntity(false);
    }
  };

  const handleDeleteEntity = (tipoEntidad, entidadId) => {
    setDeleteConfirm({ tipoEntidad, entidadId });
  };

  const executeDelete = async () => {
    if (!deleteConfirm) return;
    const { tipoEntidad, entidadId } = deleteConfirm;
    
    try {
      let endpoint = '';
      if (tipoEntidad.toLowerCase() === 'unidad') endpoint = `/api/admin/units/${entidadId}?adminEmail=${user.email}`;
      else if (tipoEntidad.toLowerCase() === 'orden') endpoint = `/api/admin/orders/${entidadId}?adminEmail=${user.email}`;
      else if (tipoEntidad.toLowerCase() === 'usuario') endpoint = `/api/admin/users/${entidadId}?adminEmail=${user.email}`;

      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        showAlert('Entidad eliminada correctamente.', 'success');
        closeConfirmModal();
        setEntityData(null);
        setSelectedLog(null);
        fetchLogs(); // refresh logs to see the deletion log
      } else {
        const err = await res.json();
        showAlert(err.error || 'Error al eliminar', 'error');
        closeConfirmModal();
      }
    } catch (e) {
      showAlert('Error de red.', 'error');
      closeConfirmModal();
    }
  };

  return (
    <div ref={mainRef} className="w-full h-[calc(100vh-6rem)] max-w-7xl mx-auto px-4 py-8 flex flex-col">
      <div className="mb-8 shrink-0">
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">Monitoreo de <span className="text-[#FFD700]">Logs</span></h1>
        <p className="text-outline mt-2 font-body text-lg">Revisa el historial de acciones y audita el sistema.</p>
      </div>

      <div className="bg-[#121212]/[0.85] backdrop-blur-md rounded-2xl border border-outline/10 p-6 shadow-lg flex flex-col md:flex-row gap-6 mb-6 shrink-0">
        <div className="flex-1">
          <label className="block text-sm font-medium text-outline mb-2">Usuario</label>
          <select 
            value={selectedUser} 
            onChange={e => setSelectedUser(e.target.value)}
            className="w-full bg-[#1a1a1a]/[0.85] backdrop-blur-md border border-outline/20 rounded-lg px-4 py-2 text-white outline-none focus:border-[#FFD700] transition-colors"
          >
            <option value="ALL">Todos los usuarios</option>
            <option value="SYSTEM">Sistema (Automático)</option>
            {users.map(u => (
              <option key={u.Email} value={u.Email}>{u.NombreUsuario} ({u.Email})</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-outline mb-2">Tipo de Acción</label>
          <select 
            value={filterType} 
            onChange={e => setFilterType(e.target.value)}
            className="w-full bg-[#1a1a1a]/[0.85] backdrop-blur-md border border-outline/20 rounded-lg px-4 py-2 text-white outline-none focus:border-[#FFD700] transition-colors"
          >
            <option value="ALL">Todas</option>
            <option value="LECTURA">Lectura</option>
            <option value="ESCRITURA">Escritura (Modificaciones)</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-outline mb-2">Orden</label>
          <select 
            value={sortOrder} 
            onChange={e => setSortOrder(e.target.value)}
            className="w-full bg-[#1a1a1a]/[0.85] backdrop-blur-md border border-outline/20 rounded-lg px-4 py-2 text-white outline-none focus:border-[#FFD700] transition-colors"
          >
            <option value="DESC">Más recientes primero</option>
            <option value="ASC">Más antiguos primero</option>
          </select>
        </div>
      </div>

      <div className="bg-[#121212]/[0.85] backdrop-blur-md rounded-2xl border border-outline/10 overflow-hidden shadow-lg flex flex-col flex-1 min-h-0">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-outline/10 bg-[#1a1a1a]/[0.85] backdrop-blur-md text-[#FFD700] font-semibold text-sm uppercase tracking-wider shrink-0">
          <div className="col-span-3">Fecha y Hora</div>
          <div className="col-span-3">Usuario</div>
          <div className="col-span-6">Descripción</div>
        </div>
        <div className="divide-y divide-outline/5 overflow-y-auto flex-1 custom-scrollbar">
          {getFilteredLogs().map(log => (
            <div 
              key={log.idLog} 
              onClick={() => handleLogClick(log)}
              className="log-item grid grid-cols-12 gap-4 p-4 hover:bg-[#FFD700]/10 hover:border-[#FFD700]/50 border-l-4 border-transparent cursor-pointer transition-colors group"
            >
              <div className="col-span-3 text-sm text-outline group-hover:text-white transition-colors">{log.fechaHora}</div>
              <div className="col-span-3 text-sm text-outline truncate group-hover:text-white transition-colors">{log.emailUsuario}</div>
              <div className="col-span-6 text-sm text-white truncate">{log.descripcion}</div>
            </div>
          ))}
          {getFilteredLogs().length === 0 && (
            <div className="p-8 text-center text-outline">No hay logs que coincidan con los filtros.</div>
          )}
        </div>
      </div>

      {/* Modal Detalles de Log */}
      {selectedLog && (
        <div ref={modalBgRef} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] opacity-0" onClick={closeLogModal}>
          <div ref={modalPanelRef} onClick={e => e.stopPropagation()} className="bg-[#121212]/[0.85] backdrop-blur-md border border-[#FFD700]/20 rounded-2xl p-6 w-full max-w-2xl shadow-[0_0_40px_rgba(255,215,0,0.15)] opacity-0">
            <div className="flex justify-between items-start mb-6 border-b border-outline/10 pb-4">
              <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#FFD700]">assignment</span> 
                {entityData ? `Estado Actual: ${selectedLog.tipoEntidad}` : `Detalle del Log #${selectedLog.idLog}`}
              </h2>
              <div className="flex gap-2">
                {entityData && (
                  <button onClick={() => setEntityData(null)} className="text-outline hover:text-white transition-colors" title="Volver al Log">
                    <span className="material-symbols-outlined">arrow_back</span>
                  </button>
                )}
                <button onClick={closeLogModal} className="text-outline hover:text-[#FFD700] transition-colors" title="Cerrar">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>
            
            {!entityData ? (
              <div key="log-view" className="animate-fade-in">
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-outline text-sm">Fecha y Hora:</div>
                    <div className="col-span-2 text-white">{selectedLog.fechaHora}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-outline text-sm">Usuario:</div>
                    <div className="col-span-2 text-white">{selectedLog.emailUsuario}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-outline text-sm">Gravedad:</div>
                    <div className="col-span-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${selectedLog.gravedad === 4 ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                        {selectedLog.gravedad === 4 ? 'LECTURA' : 'ESCRITURA'} (Nivel {selectedLog.gravedad})
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-outline text-sm">Descripción:</div>
                    <div className="col-span-2 text-white">{selectedLog.descripcion}</div>
                  </div>
                  {selectedLog.tipoEntidad && (
                    <div className="grid grid-cols-3 gap-4 border-t border-outline/10 pt-4 mt-4">
                      <div className="text-outline text-sm">Tipo Entidad:</div>
                      <div className="col-span-2 text-[#FFD700] font-bold">{selectedLog.tipoEntidad}</div>
                      <div className="text-outline text-sm">ID Entidad:</div>
                      <div className="col-span-2 text-white font-mono">{selectedLog.entidadId}</div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  {selectedLog.gravedad !== 4 && selectedLog.tipoEntidad && selectedLog.entidadId && !selectedLog.descripcion.toLowerCase().includes('eliminad') && (
                    <button 
                      onClick={() => fetchEntityDetails(selectedLog.tipoEntidad, selectedLog.entidadId)}
                      className="px-6 py-2 bg-[#FFD700] hover:bg-[#F2C800] text-black rounded-lg transition-colors font-bold shadow-lg shadow-[#FFD700]/20"
                    >
                      {loadingEntity ? 'Cargando...' : 'Inspeccionar Entidad'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div key="entity-view" className="animate-fade-in flex flex-col h-[400px]">
                <div className="bg-[#1a1a1a]/[0.85] backdrop-blur-md rounded-xl border border-outline/10 p-4 flex-1 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-2 gap-6">
                    {Object.entries(entityData).filter(([key]) => !['CodGeneradoEnMs', 'CodVinculacion', 'CodUsado', 'TokenVerificacion', 'TokenGeneradoEnMs', 'IntentosVerificacion', 'Contraseña', 'ContraseAa', 'ContraseAAa'].includes(key)).map(([key, val]) => (
                      <div key={key} className="flex flex-col border-b border-white/5 pb-2">
                        <span className="text-outline text-xs uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="text-white text-sm">
                          {(() => {
                            if (typeof val === 'boolean') return val ? 'Sí' : 'No';
                            if (typeof val === 'object') return JSON.stringify(val);
                            if (key.toLowerCase().includes('ms')) return new Date(Number(val)).toLocaleString();
                            if (key.toLowerCase() === 'estado') {
                              const isActivo = val === 'Activo' || val === 'Online' || val === 'FINALIZADA';
                              return (
                                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${isActivo ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-red-500/20 border-red-500/30 text-red-400'}`}>
                                  {val}
                                </span>
                              );
                            }
                            if (key.toLowerCase() === 'rol' || key.toLowerCase() === 'permiso') {
                              let rc = 'bg-gray-500/10 border-gray-500/20 text-gray-400';
                              if (val === 'Invitado') rc = 'bg-white/5 border-white/10 text-white/80';
                              if (val === 'Operador') rc = 'bg-blue-500/10 border-blue-500/20 text-blue-400';
                              if (val === 'Administrador') rc = 'bg-purple-500/10 border-purple-500/20 text-purple-400';
                              if (val === 'Co-Propietario') rc = 'bg-orange-500/10 border-orange-500/20 text-orange-400';
                              if (val === 'Propietario') rc = 'bg-[#FFD700]/10 border-[#FFD700]/20 text-[#FFD700]';
                              return <span className={`px-2 py-0.5 rounded text-xs font-bold border ${rc}`}>{val}</span>;
                            }
                            return val;
                          })()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end mt-6 shrink-0">
                  <button 
                    onClick={() => handleDeleteEntity(selectedLog.tipoEntidad, selectedLog.entidadId)}
                    className="px-6 py-2 bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white border border-red-600 rounded-lg transition-all font-medium flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">delete_forever</span>
                    Forzar Eliminación (Revertir)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Revertir / Confirmar Eliminación */}
      {deleteConfirm && (
        <div ref={confirmBgRef} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[110] opacity-0" onClick={closeConfirmModal}>
          <div ref={confirmPanelRef} onClick={e => e.stopPropagation()} className="bg-[#121212]/[0.85] backdrop-blur-md border border-red-500/30 rounded-2xl p-8 w-full max-w-md shadow-[0_0_40px_rgba(239,68,68,0.15)] opacity-0">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl text-red-500">warning</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">¿Forzar Eliminación?</h2>
              <p className="text-outline text-sm mb-8">
                Estás a punto de eliminar la {deleteConfirm.tipoEntidad.toLowerCase()} con ID <span className="font-mono text-white bg-white/10 px-2 py-0.5 rounded">{deleteConfirm.entidadId}</span>. Esta acción revertirá su creación y destruirá todos los datos en cascada permanentemente. No se puede deshacer.
              </p>
              
              <div className="flex gap-4 w-full">
                <button 
                  onClick={closeConfirmModal}
                  className="flex-1 py-3 bg-[#1a1a1a]/[0.85] backdrop-blur-md hover:bg-[#2a2a2a] text-white rounded-xl transition-colors font-medium border border-outline/10"
                >
                  Cancelar
                </button>
                <button 
                  onClick={executeDelete}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors font-bold shadow-lg shadow-red-500/20"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMonitorPage;
