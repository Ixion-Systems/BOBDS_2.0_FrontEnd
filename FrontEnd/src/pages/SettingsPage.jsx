import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import { useAlert } from '../context/AlertContext';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const SettingsPage = () => {
  const { user, setUser, isAdminMode, setIsAdminMode } = useAuth();
  const { triggerOrbitalTransition } = useLoading();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // User preferences state
  const [animationsEnabled, setAnimationsEnabled] = useState(user?.AnimacionesActivadas ?? true);

  // Modals state
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);

  // Form states
  const [newUsername, setNewUsername] = useState('');
  const [passwords, setPasswords] = useState({ current: '', newPass: '', repeat: '' });
  
  const bgRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch(`/api/admin/check?t=${new Date().getTime()}`);
        if (response.ok) {
          const data = await response.json();
          if (data.isAdmin) setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [user]);

  useGSAP(() => {
    if (bgRef.current && panelRef.current && !modalClosing && (isUsernameModalOpen || isPasswordModalOpen)) {
      gsap.fromTo(bgRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' });
      gsap.fromTo(panelRef.current, { scale: 0.9, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' });
    }
  }, [isUsernameModalOpen, isPasswordModalOpen, modalClosing]);

  const closeModal = () => {
    setModalClosing(true);
    const tl = gsap.timeline({ onComplete: () => {
      setIsUsernameModalOpen(false);
      setIsPasswordModalOpen(false);
      setModalClosing(false);
      setNewUsername('');
      setPasswords({ current: '', newPass: '', repeat: '' });
    }});
    tl.to(panelRef.current, { scale: 0.9, opacity: 0, y: 10, duration: 0.2, ease: 'power2.in' });
    tl.to(bgRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, "-=0.1");
  };

  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
    if (!isAdminMode) {
      triggerOrbitalTransition(() => navigate('/dashboard/admin'));
    } else {
      triggerOrbitalTransition(() => navigate('/dashboard'));
    }
  };

  const handleToggleAnimations = async () => {
    const newValue = !animationsEnabled;
    setAnimationsEnabled(newValue);
    
    // Update frontend state optimistically
    const updatedUser = { ...user, AnimacionesActivadas: newValue };
    setUser(updatedUser);
    
    // Actualizamos localStorage si el usuario está guardado allí para persistencia entre reloads
    const savedLocal = localStorage.getItem('user');
    if (savedLocal) localStorage.setItem('user', JSON.stringify(updatedUser));
    const savedSession = sessionStorage.getItem('user');
    if (savedSession) sessionStorage.setItem('user', JSON.stringify(updatedUser));

    try {
      const res = await fetch('/api/user/preferences/animations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ animationsEnabled: newValue })
      });
      if (!res.ok) {
        // Rollback on error
        setAnimationsEnabled(!newValue);
        setUser({ ...user, AnimacionesActivadas: !newValue });
        showAlert('Error al guardar la preferencia', 'error');
      }
    } catch (e) {
      showAlert('Error de red al guardar preferencias', 'error');
    }
  };

  const handleUsernameUpdate = async () => {
    if (!newUsername.match(/^[a-zA-Z0-9]{3,30}$/)) {
      return showAlert('El nombre debe tener de 3 a 30 caracteres alfanuméricos', 'error');
    }
    
    try {
      const res = await fetch('/api/user/username', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newUsername })
      });
      if (res.ok) {
        showAlert('Nombre de usuario actualizado', 'success');
        const updatedUser = { ...user, username: newUsername, NombreUsuario: newUsername };
        setUser(updatedUser);
        
        const savedLocal = localStorage.getItem('user');
        if (savedLocal) localStorage.setItem('user', JSON.stringify(updatedUser));
        const savedSession = sessionStorage.getItem('user');
        if (savedSession) sessionStorage.setItem('user', JSON.stringify(updatedUser));
        
        closeModal();
      } else {
        const err = await res.json();
        showAlert(err.error || 'Error al actualizar', 'error');
      }
    } catch (e) {
      showAlert('Error de red', 'error');
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwords.newPass !== passwords.repeat) {
      return showAlert('Las nuevas contraseñas no coinciden', 'error');
    }
    if (!passwords.newPass.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9]{8,12}$/)) {
      return showAlert('La contraseña debe tener de 8 a 12 caracteres, incluir mayúsculas, minúsculas y números.', 'error');
    }

    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPass })
      });
      if (res.ok) {
        showAlert('Contraseña actualizada correctamente', 'success');
        closeModal();
      } else {
        const err = await res.json();
        showAlert(err.error || 'Contraseña actual incorrecta', 'error');
      }
    } catch (e) {
      showAlert('Error de red', 'error');
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="w-full max-w-4xl mx-auto px-4 py-8 flex-1 overflow-y-auto custom-scrollbar">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">Ajustes</h1>
        <p className="text-outline mt-2 font-body text-lg">Configuración de tu cuenta y preferencias del sistema.</p>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* SECCION: PERFIL */}
        <div className="bg-[#121212]/[0.85] backdrop-blur-md rounded-2xl border border-outline/10 p-6 flex flex-col gap-6 shadow-lg">
          <div>
            <h2 className="text-2xl font-display font-semibold text-white mb-2">Perfil</h2>
            <p className="text-outline">Sesión iniciada como: <span className="text-[#FFD700]">{user?.email}</span></p>
          </div>
          
          <div className="border-t border-outline/10 pt-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-[#1a1a1a]/[0.85] p-4 rounded-xl border border-outline/10 flex flex-col justify-between">
              <div>
                <h3 className="text-white font-medium mb-1">Nombre de Usuario</h3>
                <p className="text-outline text-sm mb-4">{user?.NombreUsuario || user?.username || 'Usuario'}</p>
              </div>
              <button onClick={() => setIsUsernameModalOpen(true)} className="w-full bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg transition-colors border border-outline/20 font-medium">
                Cambiar Nombre
              </button>
            </div>

            <div className="flex-1 bg-[#1a1a1a]/[0.85] p-4 rounded-xl border border-outline/10 flex flex-col justify-between">
              <div>
                <h3 className="text-white font-medium mb-1">Contraseña</h3>
                <p className="text-outline text-sm mb-4">Actualiza tu contraseña por motivos de seguridad.</p>
              </div>
              <button onClick={() => setIsPasswordModalOpen(true)} className="w-full bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg transition-colors border border-outline/20 font-medium">
                Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>

        {/* SECCION: PREFERENCIAS */}
        <div className="bg-[#121212]/[0.85] backdrop-blur-md rounded-2xl border border-outline/10 p-6 shadow-lg">
          <h2 className="text-2xl font-display font-semibold text-white mb-4">Preferencias del Sistema</h2>
          
          <div className="flex items-center justify-between p-4 bg-[#1a1a1a]/[0.85] border border-outline/10 rounded-xl">
            <div>
              <h3 className="text-white font-medium text-lg">Animaciones de Éxito</h3>
              <p className="text-outline text-sm">Activa o desactiva las animaciones largas (papelera, tick) al completar una acción.</p>
            </div>
            
            <button 
              onClick={handleToggleAnimations}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${animationsEnabled ? 'bg-[#FFD700]' : 'bg-gray-600'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${animationsEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* SECCION: ADMIN */}
        {loading ? (
          <p className="text-outline pl-2">Cargando permisos...</p>
        ) : (
          isAdmin && (
            <div className="bg-[#121212]/[0.85] backdrop-blur-md rounded-2xl border border-[#FFD700]/30 p-6 shadow-[0_0_20px_rgba(255,215,0,0.1)]">
              <h2 className="text-2xl font-display font-semibold text-white mb-4">Opciones de Administrador</h2>
              <div className="bg-[#1a1a1a]/[0.85] p-4 rounded-xl border border-[#FFD700]/20 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-white font-medium text-lg">Panel de Administración</h3>
                  <p className="text-outline text-sm">Accede a las herramientas de monitoreo y control de usuarios.</p>
                </div>
                <button
                  onClick={toggleAdminMode}
                  className="bg-[#FFD700] text-black font-semibold py-2 px-6 rounded-lg hover:bg-[#e6c200] transition-colors shadow-[0_0_15px_rgba(255,215,0,0.3)] font-cta whitespace-nowrap w-full md:w-auto"
                >
                  {isAdminMode ? 'Salir del Panel Admin' : 'Panel Admin'}
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* MODAL USUARIO */}
      {isUsernameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div ref={bgRef} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div ref={panelRef} className="relative bg-[#1a1a1a] border border-outline/20 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-2xl font-display font-bold text-white mb-4">Cambiar Nombre de Usuario</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-outline mb-2">Nuevo Nombre</label>
              <input 
                type="text" 
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                placeholder="Ej. JuanPerez123"
                className="w-full bg-[#121212] border border-outline/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FFD700] transition-colors"
              />
              <p className="text-xs text-outline/60 mt-2">Debe contener entre 3 y 30 caracteres alfanuméricos.</p>
            </div>
            <div className="flex gap-4">
              <button onClick={closeModal} className="flex-1 py-3 text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors font-medium">Cancelar</button>
              <button onClick={handleUsernameUpdate} className="flex-1 py-3 text-black bg-[#FFD700] hover:bg-[#e6c200] rounded-lg transition-colors font-bold shadow-[0_0_15px_rgba(255,215,0,0.3)]">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONTRASEÑA */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div ref={bgRef} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div ref={panelRef} className="relative bg-[#1a1a1a] border border-outline/20 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-2xl font-display font-bold text-white mb-4">Cambiar Contraseña</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-outline mb-1">Contraseña Actual</label>
                <input 
                  type="password" 
                  value={passwords.current}
                  onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                  className="w-full bg-[#121212] border border-outline/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-outline mb-1">Nueva Contraseña</label>
                <input 
                  type="password" 
                  value={passwords.newPass}
                  onChange={e => setPasswords({ ...passwords, newPass: e.target.value })}
                  className="w-full bg-[#121212] border border-outline/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-outline mb-1">Repetir Nueva Contraseña</label>
                <input 
                  type="password" 
                  value={passwords.repeat}
                  onChange={e => setPasswords({ ...passwords, repeat: e.target.value })}
                  className="w-full bg-[#121212] border border-outline/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700] transition-colors"
                />
              </div>
              <p className="text-xs text-outline/60 mt-1">La contraseña debe tener de 8 a 12 caracteres, incluyendo mayúsculas, minúsculas y números.</p>
            </div>
            <div className="flex gap-4">
              <button onClick={closeModal} className="flex-1 py-3 text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors font-medium">Cancelar</button>
              <button onClick={handlePasswordUpdate} className="flex-1 py-3 text-black bg-[#FFD700] hover:bg-[#e6c200] rounded-lg transition-colors font-bold shadow-[0_0_15px_rgba(255,215,0,0.3)]">Actualizar</button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default SettingsPage;
