import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { createPortal } from 'react-dom';

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

const getRoleIcon = (role) => {
  switch(role) {
    case 'Invitado': return 'person';
    case 'Operador': return 'engineering';
    case 'Administrador': return 'manage_accounts';
    case 'Co-Propietario': return 'shield_person';
    case 'Propietario': return 'workspace_premium';
    default: return 'person';
  }
};

const roleWeights = {
  'Propietario': 5,
  'Co-Propietario': 4,
  'Administrador': 3,
  'Operador': 2,
  'Invitado': 1
};

const roleDescriptions = {
  'Invitado': 'Puede realizar el envío de órdenes a la unidad y la visualización de su historial de actividades.',
  'Operador': 'Tiene todo lo del Invitado, más la potestad de ver la información interna detallada de la unidad y modificar sus datos base (nombre, descripción, parámetros).',
  'Administrador': 'Tiene todo lo del Operador, sumando el poder crítico y destructivo de eliminar la unidad por completo del sistema.',
  'Co-Propietario': 'Reúne todos los niveles anteriores y asume la responsabilidad más crítica: la generación de códigos de vinculación para terceros.'
};

/* Modal View Info */
const ViewUserModal = ({ isOpen, onClose, user }) => {
  const bgRef = useRef(null);
  const lineRef = useRef(null);
  const dataRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  useGSAP(() => {
    if (isOpen && !isClosing && lineRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(bgRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' });
      tl.fromTo(lineRef.current, { scaleX: 0, scaleY: 0.01, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.2, ease: 'power3.out' });
      tl.to(lineRef.current, { scaleY: 1, duration: 0.3, ease: 'power4.inOut' });
      tl.fromTo(dataRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, "-=0.15");
    }
  }, [isOpen, isClosing]);

  const handleClose = () => {
    setIsClosing(true);
    const tl = gsap.timeline({ onComplete: () => { setIsClosing(false); onClose(); } });
    tl.to(dataRef.current, { opacity: 0, y: 20, duration: 0.2, ease: 'power2.in' });
    tl.to(lineRef.current, { scaleY: 0.01, duration: 0.25, ease: 'power4.inOut' });
    tl.to(lineRef.current, { scaleX: 0, opacity: 0, duration: 0.2, ease: 'power3.in' });
    tl.to(bgRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, "-=0.1");
  };

  if (!isOpen && !isClosing) return null;

  return createPortal(
    <div ref={bgRef} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm opacity-0 p-4">
      <div ref={lineRef} className="glass-panel w-full max-w-lg bg-[#131313]/95 border border-white/10 rounded-2xl overflow-hidden origin-center opacity-0">
        <div ref={dataRef} className="flex flex-col p-8 opacity-0">
          <div className="flex items-center gap-4 mb-6">
            <span className="material-symbols-outlined text-white/50 text-4xl">info</span>
            <h2 className="font-display text-2xl text-white uppercase tracking-widest">Información de Usuario</h2>
          </div>
          {user && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-widest text-on-surface-variant opacity-60">Nombre</span>
                <span className="font-body-lg text-white">{user.name}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-widest text-on-surface-variant opacity-60">Email</span>
                <span className="font-body-lg text-white">{user.email}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-widest text-on-surface-variant opacity-60">Fecha de Vinculación</span>
                <span className="font-body-lg text-white">
                  {user.vinculadoEnMs ? new Date(user.vinculadoEnMs).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div className="flex flex-col mt-2">
                <span className="text-[11px] uppercase tracking-widest text-on-surface-variant opacity-60 mb-1">Permiso Actual</span>
                <span className={`inline-block self-start font-headline-md text-xs uppercase tracking-widest px-3 py-1 rounded-full border ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 mt-8">
            <button onClick={handleClose} className="font-cta uppercase tracking-widest px-6 py-2.5 text-[11px] rounded-full border bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all">Cerrar</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

/* Modal Manage Role */
const ManageRoleModal = ({ isOpen, onClose, user, onConfirm }) => {
  const bgRef = useRef(null);
  const lineRef = useRef(null);
  const dataRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && user) {
      setIsClosing(false);
      setSelectedRole(user.role === 'Propietario' ? 'Invitado' : user.role);
    }
  }, [isOpen, user]);

  useGSAP(() => {
    if (isOpen && !isClosing && lineRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(bgRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' });
      tl.fromTo(lineRef.current, { scaleX: 0, scaleY: 0.01, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.2, ease: 'power3.out' });
      tl.to(lineRef.current, { scaleY: 1, duration: 0.3, ease: 'power4.inOut' });
      tl.fromTo(dataRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, "-=0.15");
    }
  }, [isOpen, isClosing]);

  const handleClose = () => {
    setIsClosing(true);
    const tl = gsap.timeline({ onComplete: () => { setIsClosing(false); onClose(); } });
    tl.to(dataRef.current, { opacity: 0, y: 20, duration: 0.2, ease: 'power2.in' });
    tl.to(lineRef.current, { scaleY: 0.01, duration: 0.25, ease: 'power4.inOut' });
    tl.to(lineRef.current, { scaleX: 0, opacity: 0, duration: 0.2, ease: 'power3.in' });
    tl.to(bgRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, "-=0.1");
  };

  if (!isOpen && !isClosing) return null;

  return createPortal(
    <div ref={bgRef} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm opacity-0 p-4">
      <div ref={lineRef} className="glass-panel w-full max-w-lg bg-[#131313]/95 border border-[#FFD700]/30 rounded-2xl shadow-[0_0_50px_rgba(255,215,0,0.15)] overflow-hidden origin-center opacity-0">
        <div ref={dataRef} className="flex flex-col p-8 opacity-0">
          <div className="flex items-center gap-4 mb-6">
            <span className="material-symbols-outlined text-[#FFD700] text-4xl drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]">admin_panel_settings</span>
            <h2 className="font-display text-2xl text-white uppercase tracking-widest">Administrar Permiso</h2>
          </div>
          {user && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-widest text-on-surface-variant opacity-60">Usuario</span>
                <span className="font-body-lg text-white">{user.name} ({user.email})</span>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest opacity-80">Nuevo Permiso</label>
                <div className="relative group" ref={dropdownRef}>
                  <div 
                    onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                    className={`w-full bg-[#000000]/50 border ${roleDropdownOpen ? 'border-[#FFD700] ring-1 ring-[#FFD700]/20' : 'border-white/20 hover:border-[#FFD700]/50'} text-white font-body-md rounded-xl px-4 py-3 transition-all cursor-pointer flex items-center justify-between select-none`}
                  >
                    <span>{selectedRole}</span>
                  </div>
                  <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 ${roleDropdownOpen ? 'text-[#FFD700]' : 'text-white/50 group-hover:text-[#FFD700]'} transition-colors`}>
                    <span className={`material-symbols-outlined transition-transform duration-300 ${roleDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                  </div>
                  {roleDropdownOpen && (
                    <div className="absolute z-[100] mt-2 w-full bg-[#0a0a0a] border border-[#FFD700]/30 rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.9)] overflow-hidden max-h-40 overflow-y-auto custom-scrollbar flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-2 space-y-1">
                        {['Invitado', 'Operador', 'Administrador', 'Co-Propietario'].map(r => (
                          <div 
                            key={r}
                            onClick={() => { setSelectedRole(r); setRoleDropdownOpen(false); }}
                            className={`cursor-pointer px-4 py-2 rounded-lg font-display text-sm transition-all flex items-center gap-3 ${selectedRole === r ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'text-on-surface hover:bg-white/10'}`}
                          >
                            {r}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-[#FFD700]/10 border border-[#FFD700]/20 p-4 rounded-xl">
                <span className="block text-[#FFD700] font-headline-sm text-xs uppercase tracking-widest mb-2">Alcance del Permiso</span>
                <p className="text-sm text-white/80 leading-relaxed font-body-md">
                  {roleDescriptions[selectedRole]}
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 mt-8">
            <button onClick={handleClose} className="font-cta uppercase tracking-widest px-6 py-2.5 text-[11px] rounded-full border bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all">Cancelar</button>
            <button onClick={() => { onConfirm(selectedRole); handleClose(); }} className="font-cta uppercase tracking-widest px-6 py-2.5 text-[11px] rounded-full border bg-[#FFD700]/10 border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700] hover:text-black transition-all">Guardar</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

/* Modal Unlink Confirm */
const UnlinkUserModal = ({ isOpen, onClose, user, onConfirm }) => {
  const bgRef = useRef(null);
  const lineRef = useRef(null);
  const dataRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  useGSAP(() => {
    if (isOpen && !isClosing && lineRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(bgRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' });
      tl.fromTo(lineRef.current, { scaleX: 0, scaleY: 0.01, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.2, ease: 'power3.out' });
      tl.to(lineRef.current, { scaleY: 1, duration: 0.3, ease: 'power4.inOut' });
      tl.fromTo(dataRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, "-=0.15");
    }
  }, [isOpen, isClosing]);

  const handleClose = () => {
    setIsClosing(true);
    const tl = gsap.timeline({ onComplete: () => { setIsClosing(false); onClose(); } });
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
          <span className="material-symbols-outlined text-orange-500 text-6xl drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]">person_remove</span>
          <h2 className="font-display text-2xl text-white uppercase tracking-widest">¿Desvincular Usuario?</h2>
          {user && (
            <p className="font-body-md text-on-surface-variant opacity-80">
              Estás a punto de desvincular a <strong className="text-white">{user.name} ({user.email})</strong> de esta unidad. Esta acción revocará todos sus permisos inmediatamente y no podrá acceder a menos que vuelva a vincularse.
            </p>
          )}
          <div className="flex gap-4 w-full mt-4">
            <button 
              onClick={handleClose} 
              className="flex-1 py-3 px-4 rounded-xl border border-outline/20 text-on-surface hover:bg-surface-variant transition-all font-cta"
            >
              Cancelar
            </button>
            <button 
              onClick={() => { onConfirm(); handleClose(); }} 
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

const PermissionsPage = () => {
  const { user } = useAuth();
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [unitUsers, setUnitUsers] = useState([]);
  
  const [viewUser, setViewUser] = useState(null);
  const [manageUser, setManageUser] = useState(null);
  const [unlinkUser, setUnlinkUser] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [myRole, setMyRole] = useState(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef(null);
  const [sortOrder, setSortOrder] = useState('highest');

  const containerRef = useRef(null);
  const headerRef = useRef(null);

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

  useGSAP(() => {
    gsap.fromTo(headerRef.current, 
      { y: -30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
  }, { scope: containerRef });

  useGSAP(() => {
    if (!isLoading && unitUsers.length > 0) {
      gsap.fromTo('.user-card', 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, { scope: containerRef, dependencies: [unitUsers, isLoading, sortOrder] });

  const getSelectedUnitLabel = () => {
    if (units.length === 0) return "No posee unidades";
    if (!selectedUnit) return "Selecciona una unidad...";
    return (
      <span className="flex items-center gap-2">
        {selectedUnit.nombre} 
        <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#FFD700]/20 text-[#FFD700]">
          ID: {selectedUnit.idUnidad}
        </span>
      </span>
    );
  };

  // Fetch my units
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await fetch(`/api/units/user?email=${encodeURIComponent(user?.email)}`);
        if (response.ok) {
          const data = await response.json();
          const ownedUnits = data.filter(u => u.rol === 'Propietario');
          setUnits(ownedUnits);
          if (ownedUnits.length > 0) {
            setSelectedUnit(ownedUnits[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    };
    if (user?.email) {
      fetchUnits();
    }
  }, [user]);

  // Fetch users for selected unit
  const fetchUnitUsers = async (unitId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/units/${unitId}/users`);
      if (response.ok) {
        const data = await response.json();
        setUnitUsers(data);
        const me = data.find(u => u.email === user?.email);
        setMyRole(me ? me.role : null);
      }
    } catch (error) {
      console.error("Error fetching unit users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedUnit) {
      fetchUnitUsers(selectedUnit.idUnidad);
    } else {
      setUnitUsers([]);
      setMyRole(null);
    }
  }, [selectedUnit]);

  useEffect(() => {
    const eventSource = new EventSource('/api/stream', { withCredentials: true });

    eventSource.addEventListener('unit_update', (event) => {
      const updatedUnitId = event.data;
      if (selectedUnit && selectedUnit.idUnidad === updatedUnitId) {
        fetchUnitUsers(selectedUnit.idUnidad);
      }
    });

    eventSource.onerror = (error) => {
      console.error('SSE Error in PermissionsPage:', error);
    };

    return () => {
      eventSource.close();
    };
  }, [selectedUnit]);

  const handleRoleChange = async (newRole) => {
    if (!manageUser || !selectedUnit) return;
    try {
      const response = await fetch(`/api/units/${selectedUnit.idUnidad}/users/${manageUser.email}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (response.ok) {
        fetchUnitUsers(selectedUnit.idUnidad);
      } else {
        const text = await response.text();
        alert(text);
      }
    } catch (error) {
      console.error("Error changing role:", error);
    }
  };

  const handleUnlink = async () => {
    if (!unlinkUser || !selectedUnit) return;
    try {
      const response = await fetch(`/api/units/${selectedUnit.idUnidad}/users/${unlinkUser.email}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchUnitUsers(selectedUnit.idUnidad);
      } else {
        const text = await response.text();
        alert(text);
      }
    } catch (error) {
      console.error("Error unlinking user:", error);
    }
  };

  const sortedUsers = useMemo(() => {
    return [...unitUsers].sort((a, b) => {
      if (sortOrder === 'highest') {
        return roleWeights[b.role] - roleWeights[a.role];
      } else {
        return roleWeights[a.role] - roleWeights[b.role];
      }
    });
  }, [unitUsers, sortOrder]);

  return (
    <main ref={containerRef} className="flex-1 h-[100dvh] overflow-hidden relative z-10 p-8 lg:p-12 pt-16 ml-[90px] w-[calc(100%-90px)] flex flex-col">
      <div className="max-w-6xl mx-auto flex flex-col h-full w-full">
        <header ref={headerRef} className="flex flex-col opacity-0 mb-10 w-full pr-4 relative z-50">
          <div className="flex justify-end items-end w-full">
            <div className="text-right flex-1">
              <h2 className="font-display text-[56px] font-bold text-on-surface tracking-tighter opacity-90 uppercase leading-none">
                Usuarios Vinculados
              </h2>
              <div className="h-1.5 w-48 bg-[#FFD700] ml-auto mt-4 rounded-full shadow-[0_0_15px_#FFD700]"></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-16 mb-8 w-full pr-4 gap-4 flex-wrap">
            <div className="flex items-center gap-6 w-full max-w-lg">
              <span className="font-display text-xl text-on-surface font-bold uppercase tracking-widest shrink-0">Unidad:</span>
              <div className="relative flex-1 group" ref={dropdownRef}>
                <div 
                  onClick={() => { if (!isLoading && units.length > 0) setDropdownOpen(!dropdownOpen); }}
                  className={`w-full bg-[#000000]/50 border ${dropdownOpen ? 'border-[#FFD700] ring-1 ring-[#FFD700]/20' : 'border-white/20 hover:border-[#FFD700]/50'} text-on-surface font-display text-sm lg:text-body-md rounded-xl py-4 pl-5 pr-12 transition-all cursor-pointer flex items-center justify-between select-none ${isLoading || units.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <span className={!selectedUnit ? 'text-surface-container-highest' : 'text-on-surface'}>
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
                              setSelectedUnit(u);
                              setDropdownOpen(false);
                            }}
                            className={`cursor-pointer px-4 py-3 rounded-lg font-display text-sm transition-all flex items-center gap-3 ${
                              selectedUnit?.idUnidad === u.idUnidad 
                                ? 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30' 
                                : 'text-on-surface hover:bg-white/10 border border-transparent'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full transition-all ${selectedUnit?.idUnidad === u.idUnidad ? 'bg-[#FFD700] shadow-[0_0_8px_#FFD700]' : 'bg-white/20'}`}></div>
                            <span className="flex items-center gap-2">
                              {u.nombre} 
                              <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${selectedUnit?.idUnidad === u.idUnidad ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'bg-white/10 text-on-surface-variant'}`}>
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

            <div className="relative w-64 group z-[60]" ref={sortDropdownRef}>
              <div 
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className={`w-full bg-[#000000]/50 border ${sortDropdownOpen ? 'border-[#FFD700] ring-1 ring-[#FFD700]/20' : 'border-white/20 hover:border-[#FFD700]/50'} text-on-surface font-display text-sm rounded-xl py-3 pl-4 pr-10 transition-all cursor-pointer flex items-center justify-between select-none shadow-[0_0_15px_rgba(255,255,255,0.05)]`}
              >
                <span className="flex items-center gap-2 text-xs">
                  <span className="material-symbols-outlined text-lg text-[#FFD700]">sort</span>
                  {sortOrder === 'highest' ? 'Mayor a Menor Nivel' : 'Menor a Mayor Nivel'}
                </span>
                <span className={`material-symbols-outlined absolute right-3 transition-transform duration-300 ${sortDropdownOpen ? 'rotate-180 text-[#FFD700]' : 'text-white/50 group-hover:text-[#FFD700]'}`}>expand_more</span>
              </div>
              
              {sortDropdownOpen && (
                <div className="absolute right-0 z-[100] mt-2 w-full bg-[#0a0a0a] border border-[#FFD700]/30 rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2 space-y-1">
                    <div 
                      onClick={() => { setSortOrder('highest'); setSortDropdownOpen(false); }}
                      className={`cursor-pointer px-4 py-2 rounded-lg font-display text-xs transition-all flex items-center gap-3 ${
                        sortOrder === 'highest' ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'text-on-surface hover:bg-white/10'
                      }`}
                    >
                      Mayor a Menor Nivel
                    </div>
                    <div 
                      onClick={() => { setSortOrder('lowest'); setSortDropdownOpen(false); }}
                      className={`cursor-pointer px-4 py-2 rounded-lg font-display text-xs transition-all flex items-center gap-3 ${
                        sortOrder === 'lowest' ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'text-on-surface hover:bg-white/10'
                      }`}
                    >
                      Menor a Mayor Nivel
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto space-y-4 pb-12 pr-4 custom-scrollbar">
          {!selectedUnit ? (
            <div className="text-center py-10 text-on-surface-variant font-cta tracking-widest uppercase bg-white/5 rounded-xl border border-white/10">
              Selecciona una unidad para ver sus usuarios vinculados.
            </div>
          ) : isLoading ? (
            <div className="text-center py-10 text-on-surface-variant font-cta tracking-widest uppercase">
              Cargando usuarios...
            </div>
          ) : sortedUsers.length === 0 ? (
            <div className="text-center py-10 text-on-surface-variant font-cta tracking-widest uppercase bg-white/5 rounded-xl border border-white/10">
              No hay usuarios vinculados a esta unidad.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {sortedUsers.map((u, i) => {
                const isDeleteDisabled = user.role === 'Propietario' || myRole !== 'Propietario';
                const canManage = myRole === 'Propietario' && u.email !== user?.email && u.role !== 'Propietario';

                return (
                <div key={i} className="user-card glass-panel w-full bg-[#131313]/60 border border-[rgba(255,215,0,0.1)] border-l-4 border-l-outline/30 rounded-xl p-4 px-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-[0_0_30px_rgba(255,215,0,0.08)] transition-all duration-300 group opacity-80 hover:opacity-100">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_220px_340px] items-center gap-4 w-full">
                    
                    {/* Usuario Info */}
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center border ${getRoleColor(u.role)}`}>
                        <span className="material-symbols-outlined text-2xl drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                          {getRoleIcon(u.role)}
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h3 className="font-display text-xl group-hover:translate-x-2 transition-transform duration-300 font-bold text-white mb-1 group-hover:text-[#FFD700] truncate">{u.name}</h3>
                        <span className="font-body-md text-on-surface-variant text-sm group-hover:translate-x-2 transition-transform duration-300 truncate">{u.email}</span>
                      </div>
                    </div>
                    
                    {/* Permiso */}
                    <div className="flex items-center gap-3">
                      <span className="font-body-md text-on-surface-variant text-[11px] uppercase tracking-widest opacity-60">Permiso:</span>
                      <span className={`font-headline-md text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${getRoleColor(u.role)}`}>
                        {u.role}
                      </span>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 justify-self-end items-center">
                      {canManage && (
                        <>
                          <button 
                            onClick={() => setUnlinkUser(u)}
                            className="font-cta uppercase tracking-widest w-8 h-8 p-0 flex shrink-0 items-center justify-center rounded-full border transition-all bg-transparent border-orange-500/30 text-orange-400 hover:bg-orange-500 hover:text-white"
                            title="Desvincular Usuario"
                          >
                            <span className="material-symbols-outlined text-[16px] leading-none block">link_off</span>
                          </button>
                          <button 
                            onClick={() => setManageUser(u)}
                            className="font-cta uppercase tracking-widest px-6 py-2.5 text-[11px] rounded-full border bg-[#FFD700]/10 border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700] hover:text-black transition-all whitespace-nowrap"
                          >
                            Administrar
                          </button>
                        </>
                      )}

                      <button 
                        onClick={() => setViewUser(u)}
                        className="bg-black/50 border border-white/10 font-cta uppercase tracking-widest text-on-surface hover:bg-[#FFD700] hover:text-black hover:border-[#FFD700] transition-all px-6 py-2.5 text-[11px] rounded-full whitespace-nowrap"
                      >
                        Ver Info
                      </button>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>
      </div>

      <ViewUserModal isOpen={!!viewUser} onClose={() => setViewUser(null)} user={viewUser} />
      <ManageRoleModal isOpen={!!manageUser} onClose={() => setManageUser(null)} user={manageUser} onConfirm={handleRoleChange} />
      <UnlinkUserModal isOpen={!!unlinkUser} onClose={() => setUnlinkUser(null)} user={unlinkUser} onConfirm={handleUnlink} />
    </main>
  );
};

export default PermissionsPage;
