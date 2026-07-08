import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

const AlertModal = ({ config, onClose }) => {
  const bgRef = useRef(null);
  const lineRef = useRef(null);
  const dataRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (config.show) setIsClosing(false);
  }, [config.show]);

  useGSAP(() => {
    if (config.show && !isClosing && lineRef.current) {
      // Leer preferencia local en caso de que useAuth no esté disponible dentro de este scope por circularidad o lo leemos directamente
      const userStr = localStorage.getItem('user');
      let animationsEnabled = true;
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          if (userObj.AnimacionesActivadas === false) animationsEnabled = false;
        } catch(e){}
      }

      if (!animationsEnabled && config.type === 'success') {
        gsap.set(bgRef.current, { opacity: 1 });
        gsap.set(lineRef.current, { scaleX: 1, scaleY: 1, opacity: 1 });
        gsap.set(dataRef.current, { opacity: 1, y: 0 });
        return;
      }

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
  }, [config.show, isClosing]);

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

  const getIcon = () => {
    switch (config.type) {
      case 'error': return 'error';
      case 'success': return 'check_circle';
      default: return 'info';
    }
  };

  const getColorClass = () => {
    switch (config.type) {
      case 'error': return 'text-red-500 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
      case 'success': return 'text-green-500 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]';
      default: return 'text-pop-yellow border-pop-yellow/30 shadow-[0_0_15px_rgba(255,225,0,0.2)]';
    }
  };

  if (!config.show && !isClosing) return null;

  return (
    <div ref={bgRef} className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto bg-black/60 backdrop-blur-sm opacity-0" onClick={handleClose}>
      <div 
        ref={lineRef}
        onClick={(e) => e.stopPropagation()}
        className={`glass-panel w-full max-w-sm mx-4 bg-[#131313]/95 border ${getColorClass()} rounded-2xl overflow-hidden origin-center opacity-0`}
      >
        <div ref={dataRef} className="flex flex-col items-center p-6 opacity-0">
          <span className={`material-symbols-outlined text-[48px] mb-4 opacity-90 ${getColorClass().split(' ')[0]}`}>{getIcon()}</span>
          <p className="text-center font-body-md text-white mb-6 whitespace-pre-wrap">{config.message}</p>
          <button 
            onClick={handleClose}
            className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white font-label-sm uppercase tracking-widest border border-white/20"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export const AlertProvider = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState({ show: false, message: '', type: 'info' });

  const showAlert = (message, type = 'info') => {
    const cleanMessage = message.replace(/^[❌✅]\s*/, '');
    setAlertConfig({ show: true, message: cleanMessage, type });
  };

  const closeAlert = () => {
    setAlertConfig({ show: false, message: '', type: 'info' });
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AlertModal config={alertConfig} onClose={closeAlert} />
    </AlertContext.Provider>
  );
};
