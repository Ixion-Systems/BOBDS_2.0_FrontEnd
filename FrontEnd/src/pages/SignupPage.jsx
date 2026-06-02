import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLoading } from '../context/LoadingContext';
import { useAlert } from '../context/AlertContext';

const SignupPage = () => {
  const depthElementRef = useRef(null);
  const formRef = useRef(null);
  const titleRef = useRef(null);

  const glowRef = useRef(null);
  const { isPageReady, triggerQuickTransition } = useLoading();
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // Estados del Formulario
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.signup(formData.nombre, formData.password, formData.email);
      // Navegación rápida usando el iris mecánico a la nueva pantalla
      triggerQuickTransition(() => navigate('/verify', { state: { email: formData.email } }));
    } catch (error) {
      showAlert(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickNav = (e, path) => {
    e.preventDefault();
    triggerQuickTransition(() => navigate(path));
  };

  useGSAP(() => {
    if (!isPageReady) {
      gsap.set([formRef.current, titleRef.current, depthElementRef.current, glowRef.current], { opacity: 0 });
      return;
    }

    // Animación del glow trasero
    gsap.fromTo(glowRef.current,
      { y: '-100%', opacity: 0, scale: 0.5 },
      { y: '0%', opacity: 0.15, scale: 1, duration: 4, ease: 'power2.out', delay: 0.2 }
    );

    // Animación del fondo del radar
    gsap.fromTo(depthElementRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 0.6, scale: 1, duration: 4, ease: 'power2.out', delay: 0.2 }
    );

    // Animación del formulario (entra por la derecha, como en Login)
    gsap.fromTo(formRef.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.5 }
    );

    // Animación del título lateral (flota de abajo hacia arriba)
    gsap.fromTo(titleRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: 'power2.out', delay: 0.8 }
    );
  }, { scope: containerRef, dependencies: [isPageReady], revertOnUpdate: true });

  return (
    <div ref={containerRef} className="bg-background text-on-background h-[100dvh] flex items-center relative overflow-hidden selection:bg-pop-yellow selection:text-black justify-between w-full max-w-[1920px] mx-auto" style={{ backgroundColor: '#0c0c0c' }}>
      <div className="stars-container absolute inset-0 pointer-events-none z-0">
        <div className="star w-[2px] h-[2px] top-[15%] left-[10%]" style={{ animationDelay: '0s' }}></div>
        <div className="star w-[1px] h-[1px] top-[25%] left-[45%]" style={{ animationDelay: '1.2s' }}></div>
        <div className="star w-[3px] h-[3px] top-[65%] left-[22%]" style={{ animationDelay: '0.5s' }}></div>
        <div className="star w-[2px] h-[2px] top-[40%] left-[80%]" style={{ animationDelay: '2.1s' }}></div>
        <div className="star w-[1px] h-[1px] top-[85%] left-[33%]" style={{ animationDelay: '1.8s' }}></div>
        <div className="star w-[2px] h-[2px] top-[10%] left-[90%]" style={{ animationDelay: '3s' }}></div>
        <div className="star w-[1px] h-[1px] top-[50%] left-[15%]" style={{ animationDelay: '0.7s' }}></div>
      </div>

      <div ref={depthElementRef} className="radar-container" style={{ top: 'calc(-30% + 500px)', right: 'calc(-45% + 350px)' }}>
        <div className="radar-circle" style={{ animationDelay: '0s' }}><div className="orbit-container spin-1"></div></div>
        <div className="radar-circle" style={{ animationDelay: '-1s' }}><div className="orbit-container spin-2"><div className="orbit-node electron-node"></div></div></div>
        <div className="radar-circle" style={{ animationDelay: '-2s' }}><div className="orbit-container spin-3"><div className="orbit-node planet-node"></div></div></div>
        <div className="radar-circle" style={{ animationDelay: '-3s' }}><div className="orbit-container spin-4"><div className="orbit-node electron-node"></div></div></div>
        <div className="radar-circle" style={{ animationDelay: '-4s' }}></div>
        <div className="radar-circle" style={{ animationDelay: '-5s' }}></div>
        <div className="radar-circle" style={{ animationDelay: '-6s' }}></div>
        <div className="radar-circle" style={{ animationDelay: '-7s' }}></div>
      </div>

      <main className="relative z-10 w-full max-w-md px-6 md:px-0 ml-0 lg:ml-[12%] xl:ml-[15%] flex flex-col justify-center py-12 mx-auto lg:mx-0">
        {/* Animated Depth Glow Behind Form */}
        <div 
          ref={glowRef} 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pop-yellow blur-[120px] rounded-full pointer-events-none z-[-1]"
        ></div>
        
        <div ref={formRef} className="glass-panel p-6 md:p-12 rounded-[24px] md:rounded-[32px] flex flex-col items-center shadow-[0_20px_50px_rgba(255,235,0,0.1)] relative">

          <div className="text-center mb-10 w-full flex flex-col items-center">
            <img alt="B.O.B.D.S. Logo" className="w-[100px] h-[100px] object-contain mb-4 filter drop-shadow-[0_0_15px_rgba(255,225,0,0.3)]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOd3d4Xgx4YN4cZL5HIUWMkMqWKpYwM_fSYIN1qrFyKfEcZlhdlelenejI5BrlX4UTPiSVMlSRM4jZg9aT8doeMtbPGyM_vtXApLRYAQ5kbhZdLzUm--7wfQXI-9yeArBU4cLB2uHTljMMeM1exj4HgitjJWyNmsSTLA-mZb4us9puX0-TJMQ4rnBr6-GADnXk3TqZi8C2i2LFHMFaNIufvqDnkJJL-FYPBMyK4h0BL_GWZl92xIVxdCbp0FopsUJjioGFMuwbCDc" />
            <h1 className="font-headline-md text-headline-md text-on-surface mb-2 tracking-tight">CREAR CUENTA</h1>
            <p className="font-label-sm text-label-sm text-pop-yellow uppercase tracking-widest">Protocolo de IDENTIFICACION</p>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-6"></div>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="space-y-2">
              <label className="block font-label-sm text-label-sm text-on-surface-variant flex items-center gap-2" htmlFor="nombre">
                <span className="material-symbols-outlined text-[14px]">person</span>Nombre de Operador
              </label>
              <div className="relative">
                <input 
                  className="w-full px-5 py-3.5 font-body-md text-body-md text-on-surface rounded-xl bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 focus:border-pop-yellow focus:ring-0 focus:shadow-[0_0_15px_rgba(255,235,0,0.15)] placeholder:text-on-surface-variant/30" 
                  id="nombre" name="nombre" placeholder="ej. John Doe" required type="text" 
                  value={formData.nombre} onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-label-sm text-label-sm text-on-surface-variant flex items-center gap-2" htmlFor="email">
                <span className="material-symbols-outlined text-[14px]">mail</span>Email
              </label>
              <div className="relative">
                <input 
                  className="w-full px-5 py-3.5 font-body-md text-body-md text-on-surface rounded-xl bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 focus:border-pop-yellow focus:ring-0 focus:shadow-[0_0_15px_rgba(255,235,0,0.15)] placeholder:text-on-surface-variant/30" 
                  id="email" name="email" placeholder="operador@bobds.com" required type="email" 
                  value={formData.email} onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-label-sm text-label-sm text-on-surface-variant flex items-center gap-2" htmlFor="password">
                <span className="material-symbols-outlined text-[14px]">key</span>Contraseña
              </label>
              <div className="relative">
                <input 
                  className="w-full px-5 py-3.5 font-body-md text-body-md text-on-surface rounded-xl bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 focus:border-pop-yellow focus:ring-0 focus:shadow-[0_0_15px_rgba(255,235,0,0.15)] placeholder:text-on-surface-variant/30" 
                  id="password" name="password" placeholder="••••••••" required type="password" 
                  value={formData.password} onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="pt-6">
              <button 
                disabled={loading}
                className="w-full bg-pop-yellow text-primary-container font-cta text-cta py-4 px-6 rounded-DEFAULT flex items-center justify-center gap-3 hover:glow-yellow transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit"
              >
                <span>{loading ? 'AUTENTICANDO...' : 'CREAR'}</span>
                {!loading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-300 text-[18px]">arrow_forward</span>}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-white/10 w-full pt-6">
            <a href="/login" onClick={(e) => handleQuickNav(e, '/login')} className="font-label-sm text-label-sm text-pop-yellow hover:text-white transition-colors duration-300 cursor-pointer">
              ¿Ya tienes cuenta? Iniciar Sesión
            </a>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10 w-full flex justify-between items-center font-label-sm text-label-sm text-surface-variant">
            <span>V 1.0.0</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              STATUS: OK
            </span>
          </div>
        </div>
      </main>

      <div ref={titleRef} className="relative z-10 mr-[80px] max-w-2xl select-none hidden lg:block">
        <h2 className="font-display text-[64px] leading-tight font-extrabold tracking-tighter text-white uppercase text-right">
          Configura el futuro.<br /><span className="text-pop-yellow">Hoy.</span>
        </h2>
      </div>

      <div className="pointer-events-none absolute inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-10 mix-blend-overlay"></div>

      {/* Return Button */}
      <button 
        onClick={(e) => handleQuickNav(e, '/login')}
        className="absolute left-4 lg:left-8 top-6 lg:top-8 flex items-center gap-3 text-on-surface-variant hover:text-[#FFD700] transition-all duration-300 font-cta text-sm tracking-[0.2em] uppercase group z-50"
        title="Volver al Login"
      >
        <span className="material-symbols-outlined text-[24px] group-hover:-translate-x-2 transition-transform duration-300">keyboard_backspace</span>
        <span className="opacity-80 group-hover:opacity-100 transition-opacity">Volver</span>
      </button>
    </div>
  );
};

export default SignupPage;
