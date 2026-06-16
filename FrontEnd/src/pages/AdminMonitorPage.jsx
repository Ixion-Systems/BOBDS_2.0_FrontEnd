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

  useGSAP(() => {
    if (selectedLog && !isClosingLog) {
      gsap.fromTo(modalBgRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' });
      gsap.fromTo(modalPanelRef.current, 
        { scale: 0.9, opacity: 0, y: 20 }, 
        { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }
      );
    }
  }, [selectedLog, isClosingLog]);

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

  useEffect(() => {
    fetchLogs();
    fetchUsers();
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

  const handleDeleteEntity = async (tipoEntidad, entidadId) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente esta ${tipoEntidad}?`)) return;
    
    try {
      let endpoint = '';
      if (tipoEntidad.toLowerCase() === 'unidad') endpoint = `/api/admin/units/${entidadId}?adminEmail=${user.email}`;
      else if (tipoEntidad.toLowerCase() === 'orden') endpoint = `/api/admin/orders/${entidadId}?adminEmail=${user.email}`;
      else if (tipoEntidad.toLowerCase() === 'usuario') endpoint = `/api/admin/users/${entidadId}?adminEmail=${user.email}`;

      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        showAlert('Entidad eliminada correctamente.', 'success');
        setEntityData(null);
        setSelectedLog(null);
        fetchLogs(); // refresh logs to see the deletion log
      } else {
        const err = await res.json();
        showAlert(err.error || 'Error al eliminar', 'error');
      }
    } catch (e) {
      showAlert('Error de red.', 'error');
    }
  };

  return (
    <div className="w-full h-[calc(100vh-6rem)] max-w-7xl mx-auto px-4 py-8 flex flex-col">
      <div className="mb-8 shrink-0">
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">Monitoreo de <span className="text-[#FFD700]">Logs</span></h1>
        <p className="text-outline mt-2 font-body text-lg">Revisa el historial de acciones y audita el sistema.</p>
      </div>

      <div className="bg-[#121212] rounded-2xl border border-outline/10 p-6 shadow-lg flex flex-col md:flex-row gap-6 mb-6 shrink-0">
        <div className="flex-1">
          <label className="block text-sm font-medium text-outline mb-2">Usuario</label>
          <select 
            value={selectedUser} 
            onChange={e => setSelectedUser(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-outline/20 rounded-lg px-4 py-2 text-white outline-none focus:border-[#FFD700] transition-colors"
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
            className="w-full bg-[#1a1a1a] border border-outline/20 rounded-lg px-4 py-2 text-white outline-none focus:border-[#FFD700] transition-colors"
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
            className="w-full bg-[#1a1a1a] border border-outline/20 rounded-lg px-4 py-2 text-white outline-none focus:border-[#FFD700] transition-colors"
          >
            <option value="DESC">Más recientes primero</option>
            <option value="ASC">Más antiguos primero</option>
          </select>
        </div>
      </div>

      <div className="bg-[#121212] rounded-2xl border border-outline/10 overflow-hidden shadow-lg flex flex-col flex-1 min-h-0">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-outline/10 bg-[#1a1a1a] text-[#FFD700] font-semibold text-sm uppercase tracking-wider shrink-0">
          <div className="col-span-3">Fecha y Hora</div>
          <div className="col-span-3">Usuario</div>
          <div className="col-span-6">Descripción</div>
        </div>
        <div className="divide-y divide-outline/5 overflow-y-auto flex-1 custom-scrollbar">
          {getFilteredLogs().map(log => (
            <div 
              key={log.idLog} 
              onClick={() => handleLogClick(log)}
              className="grid grid-cols-12 gap-4 p-4 hover:bg-[#FFD700]/10 hover:border-[#FFD700]/50 border-l-4 border-transparent cursor-pointer transition-colors group"
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
          <div ref={modalPanelRef} onClick={e => e.stopPropagation()} className="bg-[#121212] border border-[#FFD700]/20 rounded-2xl p-6 w-full max-w-2xl shadow-[0_0_40px_rgba(255,215,0,0.15)] opacity-0">
            <div className="flex justify-between items-start mb-6 border-b border-outline/10 pb-4">
              <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2"><span className="material-symbols-outlined text-[#FFD700]">assignment</span> Detalle del Log #{selectedLog.idLog}</h2>
              <button onClick={closeLogModal} className="text-outline hover:text-[#FFD700] transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
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
              {selectedLog.gravedad !== 4 && selectedLog.tipoEntidad && selectedLog.entidadId && (
                <button 
                  onClick={() => fetchEntityDetails(selectedLog.tipoEntidad, selectedLog.entidadId)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium"
                >
                  {loadingEntity ? 'Cargando...' : 'Inspeccionar Entidad'}
                </button>
              )}
              <button 
                onClick={() => setSelectedLog(null)}
                className="px-6 py-2 bg-[#2a2a2a] hover:bg-[#333] text-white rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>

            {/* Sub-Modal Detalles de Entidad */}
            {entityData && (
              <div className="mt-6 border-t border-outline/10 pt-6 animate-fade-in">
                <h3 className="text-xl font-display font-bold text-white mb-4">Estado Actual: {selectedLog.tipoEntidad}</h3>
                <div className="bg-[#1a1a1a] p-4 rounded-xl border border-outline/10 font-mono text-sm text-green-400 overflow-x-auto">
                  <pre>{JSON.stringify(entityData, null, 2)}</pre>
                </div>
                <div className="flex justify-end mt-4">
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
    </div>
  );
};

export default AdminMonitorPage;
