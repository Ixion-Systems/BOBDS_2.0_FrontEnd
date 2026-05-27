import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const RegisterUnitPage = () => {
  const containerRef = useRef(null);
  const codeCardRef = useRef(null);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const connectionCode = "2B-AJ21-KL";

  const handleCopy = () => {
    navigator.clipboard.writeText(connectionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useGSAP(() => {
    const tl = gsap.timeline();
    
    // Animación de entrada de la página
    tl.fromTo(containerRef.current, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );

    // Animación de pulso suave (Glow) para la tarjeta del código de vinculación
    gsap.to(codeCardRef.current, {
      boxShadow: '0 0 25px rgba(255,215,0,0.3)',
      borderColor: 'rgba(255,215,0,0.6)',
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="flex-1 h-[100dvh] overflow-hidden relative z-10 p-2 lg:p-4 ml-[90px] w-[calc(100%-90px)] flex flex-col">
      <div className="w-full mx-auto flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center py-2 relative">
        
        <header className="w-full px-0 lg:px-2 mb-6 lg:mb-10 flex items-center justify-between relative mt-auto">
          <div className="flex-1 flex justify-start">
            <button 
              onClick={() => navigate('/dashboard/units')}
              className="flex items-center gap-2 lg:gap-3 text-on-surface-variant hover:text-[#FFD700] transition-all duration-300 font-cta text-xs lg:text-sm tracking-[0.2em] uppercase group whitespace-nowrap z-[60]"
              title="Volver al Listado"
            >
              <span className="material-symbols-outlined text-[20px] lg:text-[24px] group-hover:-translate-x-2 transition-transform duration-300">keyboard_backspace</span>
              <span className="opacity-80 group-hover:opacity-100 transition-opacity hidden sm:inline">Volver</span>
            </button>
          </div>
          
          <div className="flex flex-col items-center gap-2 lg:gap-4 shrink-0">
            <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-on-surface tracking-[0.1em] lg:tracking-[0.2em] uppercase text-glow text-center m-0">
              REGISTRAR NUEVA UNIDAD
            </h1>
            <div className="h-1 lg:h-1.5 w-24 lg:w-32 bg-[#FFD700] rounded-full shadow-[0_0_15px_rgba(255,215,0,0.5)] mt-2"></div>
          </div>

          <div className="flex-1 hidden sm:block"></div>
        </header>

        <div className="w-full max-w-4xl mb-auto glass-panel rounded-2xl lg:rounded-[2rem] p-4 md:p-6 lg:p-8 flex flex-col gap-4 lg:gap-6 bg-[#131313]/85 backdrop-blur-md border border-[rgba(255,215,0,0.1)] shadow-[0_12px_40px_0_rgba(0,0,0,0.8)]">
          <div className="flex flex-col gap-6 lg:gap-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
              <div className="flex flex-col gap-6 lg:gap-8">
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-xs lg:text-sm text-on-surface uppercase tracking-wider text-left">Nombre</label>
                  <input 
                    className="w-full bg-[#000000]/50 border border-white/20 rounded-xl text-on-surface px-4 py-3 lg:px-5 lg:py-4 font-display text-sm lg:text-body-md glow-focus transition-all outline-none placeholder:text-surface-container-highest hover:border-[#FFD700]/50 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/20" 
                    placeholder="Ejemplo: Robot 1" 
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-xs lg:text-sm text-on-surface uppercase tracking-wider text-left">ID Unidad</label>
                  <input 
                    className="w-full bg-[#000000]/50 border border-white/20 rounded-xl text-on-surface px-4 py-3 lg:px-5 lg:py-4 font-display text-sm lg:text-body-md glow-focus transition-all outline-none placeholder:text-surface-container-highest hover:border-[#FFD700]/50 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/20" 
                    placeholder="Ejemplo: 1100" 
                    type="text"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 h-full">
                <label className="font-label-sm text-xs lg:text-sm text-on-surface uppercase tracking-wider text-left">Descripción</label>
                <textarea 
                  className="w-full h-full min-h-[80px] lg:min-h-[120px] bg-[#000000]/50 border border-white/20 rounded-xl text-on-surface px-4 py-3 lg:px-5 lg:py-4 font-display text-sm lg:text-body-md glow-focus transition-all outline-none placeholder:text-surface-container-highest resize-none hover:border-[#FFD700]/50 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/20" 
                  placeholder="Ejemplo: Robot aspiradora de piso"
                ></textarea>
              </div>
            </div>
            
            <div className="w-full pt-6 lg:pt-8 border-t border-white/10 flex flex-col gap-6 lg:gap-8">
              <div 
                ref={codeCardRef}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 lg:gap-8 bg-black/40 p-4 lg:p-6 rounded-2xl border border-[rgba(255,215,0,0.3)] shadow-[0_0_10px_rgba(255,215,0,0.1)] transition-all"
              >
                <div className="flex flex-col gap-1 text-center sm:text-left">
                  <label className="font-label-sm text-xs lg:text-sm text-[#FFD700] uppercase tracking-wider font-bold">Código de Vinculación</label>
                  <p className="font-body-md text-[10px] lg:text-xs text-on-surface-variant opacity-80">
                    La contraseña se usará para compartir la unidad con otro/s usuarios
                  </p>
                </div>
                <div className="flex items-center gap-2 lg:gap-4 w-full sm:w-auto">
                  <div className="flex-1 sm:flex-none bg-[#000000]/80 border border-white/10 rounded-xl px-4 lg:px-8 py-2 lg:py-3 font-display text-lg lg:text-xl text-white tracking-[0.1em] lg:tracking-[0.2em] text-center shadow-inner min-w-[150px] lg:min-w-[200px] select-all">
                    {connectionCode}
                  </div>
                  <button 
                    onClick={handleCopy}
                    className={`p-2 lg:p-3 rounded-xl border transition-all duration-300 flex items-center justify-center ${copied ? 'bg-[#FFD700] border-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]' : 'bg-surface-container-high text-on-surface hover:text-black border-white/10 hover:border-[#FFD700] hover:bg-[#FFD700]'}`} 
                    title={copied ? "Copiado" : "Copiar código"}
                  >
                    <span className="material-symbols-outlined text-[18px] lg:text-[20px]">
                      {copied ? 'check' : 'content_copy'}
                    </span>
                  </button>
                </div>
              </div>
              
              <div className="flex justify-center mt-2 lg:mt-0">
                <button className="bg-[#FFD700] text-black font-cta text-xs lg:text-sm px-10 lg:px-16 py-4 lg:py-5 rounded-xl hover:bg-[#FFEA00] shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_0_35px_rgba(255,215,0,0.6)] transition-all duration-300 flex items-center justify-center uppercase tracking-widest active:scale-95">
                  <span className="material-symbols-outlined mr-2 lg:mr-3 text-[18px] lg:text-[22px]">memory</span>
                  Registrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RegisterUnitPage;
