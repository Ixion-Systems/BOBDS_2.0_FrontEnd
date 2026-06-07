import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';

const LinkUnitPage = () => {
  const containerRef = useRef(null);
  const infoCardRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showAlert } = useAlert();

  const [code, setCode] = useState('');
  const [unitInfo, setUnitInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // Auto-formato del código: AA-XXXX-11
  const handleCodeChange = (e) => {
    let raw = e.target.value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    if (raw.length > 8) raw = raw.substring(0, 8);
    
    let formatted = raw;
    if (raw.length > 2) {
      formatted = raw.substring(0, 2) + '-' + raw.substring(2);
    }
    if (raw.length > 6) {
      formatted = formatted.substring(0, 7) + '-' + raw.substring(6);
    }
    
    setCode(formatted);

    // Buscar si llega a 10 caracteres
    if (formatted.length === 10) {
      fetchUnitInfo(formatted);
    } else {
      setUnitInfo(null);
      setErrorMsg('');
    }
  };

  const fetchUnitInfo = async (codigo) => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await fetch(`/api/units/code-info/${codigo}`);
      if (!res.ok) {
        const errorText = await res.text();
        setErrorMsg(errorText || "Unidad no encontrada");
        setUnitInfo(null);
      } else {
        const data = await res.json();
        setUnitInfo(data);
        setErrorMsg('');
      }
    } catch (err) {
      setErrorMsg("Error de conexión al buscar unidad.");
      setUnitInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLink = async () => {
    if (loading) return;
    if (!unitInfo) return;

    try {
      setLoading(true);
      const res = await fetch('/api/units/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, code })
      });
      
      const responseText = await res.text();
      if (!res.ok) {
        showAlert('Error', responseText, 'error');
        setLoading(false);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      showAlert('Error', 'Error de conexión', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      const tl = gsap.timeline({ 
        onComplete: () => {
          gsap.killTweensOf('.fullscreen-speed-lines > div');
          gsap.killTweensOf('.speed-bg-pulse');
          navigate('/dashboard/units');
        } 
      });
      
      gsap.fromTo('.fullscreen-speed-lines > div', 
        { scaleY: 0.1 }, 
        { scaleY: "random(0.5, 1.5)", duration: "random(0.2, 0.4)", repeat: -1, yoyo: true, ease: 'sine.inOut' } 
      );
      
      gsap.fromTo('.speed-bg-pulse', 
        { opacity: 0.3 }, 
        { opacity: 1, duration: 0.25, repeat: -1, yoyo: true, ease: 'sine.inOut' } 
      );
      
      tl.to('.success-circle', { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' })
        .to('.success-check', { opacity: 1, duration: 0.3 })
        .to('.success-circle', { borderColor: '#34d399', boxShadow: '0 0 30px rgba(52,211,153,0.6)', duration: 0.3 })
        .to('.success-check', { color: '#34d399', textShadow: '0 0 10px rgba(52,211,153,0.8)', duration: 0.3 }, "<")
        .to('.success-circle', { y: 20, scale: 0.9, duration: 0.4, ease: 'power2.inOut' })
        .to('.speed-bg-wrapper', { opacity: 1, duration: 0.5 })
        .to('.fullscreen-speed-lines', { opacity: 1, duration: 0.5 }, "<")
        .to('.success-circle', { y: -1500, duration: 0.8, ease: 'power4.in' }, "-=0.2");
    }
  }, [success, navigate]);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo(containerRef.current, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
  }, { scope: containerRef });

  useGSAP(() => {
    if (unitInfo && infoCardRef.current) {
      gsap.fromTo(infoCardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [unitInfo]);

  return (
    <main ref={containerRef} className="flex-1 h-[100dvh] overflow-hidden relative z-10 p-2 lg:p-4 ml-[90px] w-[calc(100%-90px)] flex flex-col">
      <div className="w-full mx-auto flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center py-2 relative">
        
        <header className="w-full px-0 lg:px-2 mb-6 lg:mb-10 flex items-center justify-between relative mt-auto">
          <div className="flex-1 flex justify-start">
            <button 
              onClick={() => navigate('/dashboard/units')}
              className="flex items-center gap-2 lg:gap-3 text-on-surface-variant hover:text-[#FFD700] transition-all duration-300 font-cta text-xs lg:text-sm tracking-[0.2em] uppercase group whitespace-nowrap z-[60]"
            >
              <span className="material-symbols-outlined text-[20px] lg:text-[24px] group-hover:-translate-x-2 transition-transform duration-300">keyboard_backspace</span>
              <span className="opacity-80 group-hover:opacity-100 transition-opacity hidden sm:inline">Volver</span>
            </button>
          </div>
          
          <div className="flex flex-col items-center gap-2 lg:gap-4 shrink-0">
            <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-on-surface tracking-[0.1em] lg:tracking-[0.2em] uppercase text-glow text-center m-0">
              VINCULAR UNIDAD
            </h1>
            <div className="h-1 lg:h-1.5 w-24 lg:w-32 bg-[#FFD700] rounded-full shadow-[0_0_15px_rgba(255,215,0,0.5)] mt-2"></div>
          </div>
          <div className="flex-1 hidden sm:block"></div>
        </header>

        <div className={`w-full max-w-2xl mb-auto glass-panel rounded-2xl lg:rounded-[2rem] p-4 md:p-6 lg:p-8 flex flex-col gap-6 lg:gap-8 bg-[#131313]/85 backdrop-blur-md border border-[rgba(255,215,0,0.1)] shadow-[0_12px_40px_0_rgba(0,0,0,0.8)] relative overflow-hidden transition-opacity duration-500 ${success ? 'opacity-0' : 'opacity-100'}`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-50"></div>
          
          <div className="flex flex-col items-center gap-6">
            <label className="font-label-sm text-sm lg:text-base text-on-surface uppercase tracking-wider text-center block">Ingresa el código de vinculación</label>
            <input 
              className="w-full max-w-sm bg-black/60 border border-[#FFD700]/30 rounded-2xl text-white px-6 py-4 font-mono text-3xl text-center tracking-[0.2em] placeholder:text-white/10 glow-focus transition-all outline-none hover:border-[#FFD700]/60 focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/30 shadow-[0_0_20px_rgba(255,215,0,0.05)] uppercase" 
              placeholder="AA-XXXX-11"
              type="text"
              value={code}
              onChange={handleCodeChange}
            />
            {loading && !unitInfo && (
              <span className="font-cta text-[#FFD700] tracking-widest uppercase text-xs animate-pulse">Buscando unidad...</span>
            )}
            {errorMsg && (
              <div className="text-red-500 font-cta tracking-widest uppercase text-xs bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                {errorMsg}
              </div>
            )}
          </div>

          {unitInfo && (
            <div ref={infoCardRef} className="mt-4 pt-6 border-t border-white/10 flex flex-col gap-8 opacity-0">
              <div className="bg-black/30 rounded-xl p-6 border border-white/5 flex flex-col gap-6">
                <h3 className="font-display text-xl text-[#FFD700] uppercase tracking-widest mb-2 border-b border-white/10 pb-4 text-center">Detalles de la Unidad</h3>
                
                <div className="flex flex-col gap-6 px-2 lg:px-6 w-full">
                  <div className="flex justify-between items-start w-full">
                    <div className="flex-1 text-left">
                      <span className="block font-body-md text-on-surface-variant text-[10px] uppercase tracking-widest opacity-60 mb-1">Propietario</span>
                      <span className="font-body-md text-white truncate block">{unitInfo.propietario}</span>
                    </div>
                    <div className="flex-1 text-center">
                      <span className="block font-body-md text-on-surface-variant text-[10px] uppercase tracking-widest opacity-60 mb-1">Nombre</span>
                      <span className="font-body-md text-white truncate block">{unitInfo.nombre}</span>
                    </div>
                    <div className="flex-1 flex flex-col items-end text-right">
                      <span className="block font-body-md text-on-surface-variant text-[10px] uppercase tracking-widest opacity-60 mb-1">ID Unidad</span>
                      <span className="font-mono text-sm text-[#4a90e2] bg-[#4a90e2]/10 px-3 py-1 rounded inline-block">{unitInfo.idUnidad}</span>
                    </div>
                  </div>
                  <div className="text-left w-full">
                    <span className="block font-body-md text-on-surface-variant text-[10px] uppercase tracking-widest opacity-60 mb-1">Descripción</span>
                    <p className="font-body-md text-on-surface opacity-90 break-all">{unitInfo.descripcion || 'Sin descripción'}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button 
                  onClick={handleLink}
                  disabled={loading}
                  className="bg-[#FFD700] text-black font-cta text-sm px-16 py-4 rounded-xl hover:bg-[#FFEA00] shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_0_35px_rgba(255,215,0,0.6)] transition-all duration-300 flex items-center justify-center uppercase tracking-widest disabled:opacity-50"
                >
                  <span className="material-symbols-outlined mr-3 text-[22px]">link</span>
                  {loading ? 'Vinculando...' : 'Vincular'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {createPortal(
        <div 
          className={`overlay-container fixed inset-0 z-[9999] flex items-center justify-center bg-black pointer-events-none ${success ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="speed-bg-wrapper opacity-0 pointer-events-none">
            <div className="speed-bg-pulse absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#FFD700]/30 to-transparent"></div>
          </div>
          
          <div className="fullscreen-speed-lines absolute inset-x-0 bottom-0 h-[45%] opacity-0 pointer-events-none">
            {Array.from({ length: 60 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute w-[2px] bg-white rounded-t-full opacity-30 origin-bottom"
                style={{
                  left: `${(i * 100) / 60}%`,
                  bottom: 0,
                  height: `${Math.random() * 40 + 10}%`
                }}
              ></div>
            ))}
          </div>

          <div className="success-circle w-24 h-24 rounded-full border-4 border-white flex items-center justify-center opacity-0 scale-50 shadow-[0_0_30px_rgba(255,255,255,0.4)] relative z-10">
            <span className="material-symbols-outlined text-[48px] text-white success-check opacity-0 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10" style={{ textShadow: '0 0 10px rgba(255,255,255,0.8)' }}>check</span>
          </div>
        </div>,
        document.body
      )}
    </main>
  );
};

export default LinkUnitPage;
