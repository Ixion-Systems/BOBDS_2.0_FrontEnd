import React, { createContext, useContext, useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState({ show: false, message: '', type: 'info' });
  const modalRef = useRef(null);

  const showAlert = (message, type = 'info') => {
    // type can be 'info', 'success', 'error'
    // Remove emojis from old messages if they exist (e.g. "❌ Error: ...")
    const cleanMessage = message.replace(/^[❌✅]\s*/, '');
    setAlertConfig({ show: true, message: cleanMessage, type });
  };

  const closeAlert = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        y: 20,
        scale: 0.95,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => setAlertConfig({ show: false, message: '', type: 'info' })
      });
    } else {
      setAlertConfig({ show: false, message: '', type: 'info' });
    }
  };

  useGSAP(() => {
    if (alertConfig.show && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { opacity: 0, y: -50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
  }, { dependencies: [alertConfig.show], revertOnUpdate: true });

  const getIcon = () => {
    switch (alertConfig.type) {
      case 'error': return 'error';
      case 'success': return 'check_circle';
      default: return 'info';
    }
  };

  const getColorClass = () => {
    switch (alertConfig.type) {
      case 'error': return 'text-red-500 border-red-500/30 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
      case 'success': return 'text-green-500 border-green-500/30 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]';
      default: return 'text-pop-yellow border-pop-yellow/30 bg-pop-yellow/10 shadow-[0_0_15px_rgba(255,225,0,0.2)]';
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alertConfig.show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto bg-black/60 backdrop-blur-sm" onClick={closeAlert}>
          <div 
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className={`glass-panel p-6 rounded-2xl flex flex-col items-center max-w-sm w-full mx-4 border ${getColorClass()} relative overflow-hidden`}
          >
            <span className="material-symbols-outlined text-[48px] mb-4 opacity-90">{getIcon()}</span>
            <p className="text-center font-body-md text-white mb-6 whitespace-pre-wrap">{alertConfig.message}</p>
            <button 
              onClick={closeAlert}
              className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white font-label-sm uppercase tracking-widest border border-white/20"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};
