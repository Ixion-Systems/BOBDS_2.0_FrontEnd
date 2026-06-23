import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLoading } from '../context/LoadingContext';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';

const LoginPage = () => {
  const depthElementRef = useRef(null);
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const { isPageReady, triggerQuickTransition, triggerOrbitalTransition } = useLoading();
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showAlert } = useAlert();

  const [step, setStep] = useState('login'); // 'login' | 'forgot_email' | 'forgot_code' | 'forgot_password'
  const [formData, setFormData] = useState({ email: '', password: '', keepSession: false });
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const codeInputsRef = useRef([]);

  const handleCodeChange = (index, value) => {
    const numValue = value.replace(/\D/g, '');
    if (!numValue && value !== '') {
      let newCode = resetCode.split('');
      newCode[index] = '';
      setResetCode(newCode.join(''));
      return;
    }
    let newCode = (resetCode || '').split('');
    newCode[index] = numValue.slice(-1);
    setResetCode(newCode.join(''));
    if (numValue && index < 5 && codeInputsRef.current[index + 1]) {
      codeInputsRef.current[index + 1].focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !resetCode[index] && index > 0 && codeInputsRef.current[index - 1]) {
      codeInputsRef.current[index - 1].focus();
    }
  };

  const handleCodePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      setResetCode(pastedData);
      const focusIndex = Math.min(pastedData.length, 5);
      if (codeInputsRef.current[focusIndex]) {
        codeInputsRef.current[focusIndex].focus();
      }
    }
  };

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.login(formData.email, formData.password, formData.keepSession);
      login({ email: formData.email }, formData.keepSession);
      triggerOrbitalTransition(() => navigate('/dashboard'));
    } catch (error) {
      showAlert(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(resetEmail);
      triggerQuickTransition(() => {
        setStep('forgot_code');
        setTimer(30);
      });
    } catch (error) {
      showAlert(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotCodeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.verifyResetCode(resetEmail, resetCode);
      triggerQuickTransition(() => {
        setStep('forgot_password');
      });
    } catch (error) {
      showAlert(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (timer > 0) return;
    setLoading(true);
    try {
      await authService.forgotPassword(resetEmail);
      setTimer(30);
      showAlert('Nuevo código enviado', 'success');
    } catch (error) {
      showAlert(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showAlert('Las contraseñas no coinciden', 'error');
      return;
    }
    
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{3,12}$/;
    if (!passwordRegex.test(newPassword)) {
      showAlert('La contraseña debe tener entre 3 y 12 caracteres e incluir mayúsculas, minúsculas y números', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.resetPassword(resetEmail, resetCode, newPassword);
      showAlert(result, 'success');
      triggerQuickTransition(() => {
        setStep('login');
        setResetEmail('');
        setResetCode('');
        setNewPassword('');
        setConfirmPassword('');
      });
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

  const changeStepWithTransition = (newStep) => {
    triggerQuickTransition(() => setStep(newStep));
  };

  useGSAP(() => {
    if (!isPageReady) {
      const elementsToHide = [formRef.current, depthElementRef.current];
      if (titleRef.current) elementsToHide.push(titleRef.current);
      gsap.set(elementsToHide, { opacity: 0 });
      return;
    }

    gsap.fromTo(depthElementRef.current,
      { y: '-100%', opacity: 0, scale: 0.5 },
      { y: '0%', opacity: 0.15, scale: 1, duration: 4, ease: 'power2.out', delay: 0.2 }
    );

    gsap.fromTo(formRef.current,
      { x: step === 'login' ? 100 : 0, y: step === 'login' ? 0 : 100, opacity: 0 },
      { x: 0, y: 0, opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.5 }
    );

    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: 'power2.out', delay: 0.8 }
      );
    }
  }, { scope: containerRef, dependencies: [isPageReady, step], revertOnUpdate: true });

  const renderFormContent = () => {
    switch (step) {
      case 'forgot_email':
        return (
          <form onSubmit={handleForgotEmailSubmit} className="w-full space-y-6 animate-fade-in">
            <div className="text-center mb-10 w-full">
              <h1 className="font-headline-md text-headline-md text-on-surface mb-2 tracking-tight uppercase">Recuperar Acceso</h1>
              <p className="font-label-sm text-label-sm text-pop-yellow uppercase tracking-widest">
                Ingresa tu correo registrado
              </p>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-6"></div>
            </div>
            <div className="space-y-2">
              <label className="block font-label-sm text-label-sm text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px]">mail</span>
                Email
              </label>
              <div className="relative">
                <input 
                  className="w-full px-5 py-3.5 font-body-md text-body-md text-on-surface rounded-xl bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 focus:border-pop-yellow focus:ring-0 focus:shadow-[0_0_15px_rgba(255,225,0,0.15)] placeholder:text-on-surface-variant/30" 
                  placeholder="user@bobds.net" required type="email" 
                  value={resetEmail} onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="pt-6 flex flex-col items-center gap-4">
              <button 
                disabled={loading}
                className="w-full bg-pop-yellow text-primary-container font-cta text-cta py-4 px-6 rounded-DEFAULT flex items-center justify-center gap-3 hover:glow-yellow transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit"
              >
                <span>{loading ? 'PROCESANDO...' : 'ENVIAR CÓDIGO'}</span>
                {!loading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-300 text-[18px]">arrow_forward</span>}
              </button>
              <button type="button" onClick={() => changeStepWithTransition('login')} className="font-label-sm text-label-sm text-on-surface-variant hover:text-pop-yellow transition-colors duration-300 text-center cursor-pointer">
                Volver al inicio de sesión
              </button>
            </div>
          </form>
        );

      case 'forgot_code':
        return (
          <form onSubmit={handleForgotCodeSubmit} className="w-full space-y-6 animate-fade-in">
            <div className="text-center mb-10 w-full">
              <h1 className="font-headline-md text-headline-md text-on-surface mb-2 tracking-tight uppercase">Verificar Código</h1>
              <p className="font-label-sm text-label-sm text-pop-yellow uppercase tracking-widest">
                Ingresa el código de 6 dígitos enviado a tu correo
              </p>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-6"></div>
            </div>
            <div className="space-y-2">
              <label className="block font-label-sm text-label-sm text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px]">pin</span>
                Código de Verificación
              </label>
              <div className="flex gap-2 sm:gap-3 w-full justify-between" onPaste={handleCodePaste}>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    ref={(el) => codeInputsRef.current[index] = el}
                    className="w-0 flex-1 h-12 lg:h-16 font-body-md text-[20px] lg:text-[24px] text-center text-on-surface rounded-lg lg:rounded-xl bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 focus:border-pop-yellow focus:ring-1 focus:shadow-[0_0_15px_rgba(255,225,0,0.15)] placeholder:text-on-surface-variant/30 px-0"
                    placeholder="0"
                    type="text"
                    maxLength="1"
                    value={resetCode[index] || ''}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(index, e)}
                    required
                  />
                ))}
              </div>
            </div>
            <div className="pt-6 flex flex-col items-center gap-4">
              <button 
                disabled={loading || resetCode.length !== 6}
                className="w-full bg-pop-yellow text-primary-container font-cta text-cta py-4 px-6 rounded-DEFAULT flex items-center justify-center gap-3 hover:glow-yellow transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit"
              >
                <span>{loading ? 'VERIFICANDO...' : 'VERIFICAR CÓDIGO'}</span>
                {!loading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-300 text-[18px]">arrow_forward</span>}
              </button>
              <button 
                type="button" 
                onClick={handleResendCode}
                disabled={timer > 0 || loading}
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-pop-yellow transition-colors duration-300 text-center cursor-pointer disabled:opacity-50"
              >
                {timer > 0 ? `Reenviar código en ${timer}s` : 'Reenviar código ahora'}
              </button>
              <button type="button" onClick={() => changeStepWithTransition('login')} className="font-label-sm text-label-sm text-on-surface-variant hover:text-pop-yellow transition-colors duration-300 text-center cursor-pointer">
                Volver al inicio de sesión
              </button>
            </div>
          </form>
        );

      case 'forgot_password':
        return (
          <form onSubmit={handleResetPasswordSubmit} className="w-full space-y-6 animate-fade-in">
            <div className="text-center mb-10 w-full">
              <h1 className="font-headline-md text-headline-md text-on-surface mb-2 tracking-tight uppercase">Nueva Contraseña</h1>
              <p className="font-label-sm text-label-sm text-pop-yellow uppercase tracking-widest">
                Define tus nuevas credenciales
              </p>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-6"></div>
            </div>
            <div className="space-y-2">
              <label className="block font-label-sm text-label-sm text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px]">key</span>
                Nueva Contraseña
              </label>
              <div className="relative">
                <input 
                  className="w-full px-5 py-3.5 font-body-md text-body-md text-on-surface rounded-xl bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 focus:border-pop-yellow focus:ring-0 focus:shadow-[0_0_15px_rgba(255,225,0,0.15)] placeholder:text-on-surface-variant/30" 
                  placeholder="••••••••" required type="password" 
                  value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <p className="text-[10px] text-on-surface-variant/60 font-body-sm mt-1.5 px-1">
                Entre 3 y 12 caracteres, al menos 1 mayúscula, 1 minúscula y 1 número.
              </p>
            </div>
            <div className="space-y-2">
              <label className="block font-label-sm text-label-sm text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px]">key</span>
                Repetir Nueva Contraseña
              </label>
              <div className="relative">
                <input 
                  className="w-full px-5 py-3.5 font-body-md text-body-md text-on-surface rounded-xl bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 focus:border-pop-yellow focus:ring-0 focus:shadow-[0_0_15px_rgba(255,225,0,0.15)] placeholder:text-on-surface-variant/30" 
                  placeholder="••••••••" required type="password" 
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="text-red-500 font-label-sm text-center">Las contraseñas no coinciden.</p>
            )}
            <div className="pt-6 flex flex-col items-center gap-4">
              <button 
                disabled={loading || !newPassword || newPassword !== confirmPassword}
                className="w-full bg-pop-yellow text-primary-container font-cta text-cta py-4 px-6 rounded-DEFAULT flex items-center justify-center gap-3 hover:glow-yellow transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit"
              >
                <span>{loading ? 'GUARDANDO...' : 'CAMBIAR CONTRASEÑA'}</span>
                {!loading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-300 text-[18px]">arrow_forward</span>}
              </button>
            </div>
          </form>
        );

      case 'login':
      default:
        return (
          <>
            <div className="text-center mb-10 w-full">
              <h1 className="font-headline-md text-headline-md text-on-surface mb-2 tracking-tight">INICIAR SESION</h1>
              <p className="font-label-sm text-label-sm text-pop-yellow uppercase tracking-widest">
                Protocolo de IDENTIFICACION
              </p>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-6"></div>
            </div>
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <div className="space-y-2">
                <label className="block font-label-sm text-label-sm text-on-surface-variant flex items-center gap-2" htmlFor="email">
                  <span className="material-symbols-outlined text-[14px]">person</span>
                  Email
                </label>
                <div className="relative">
                  <input 
                    className="w-full px-5 py-3.5 font-body-md text-body-md text-on-surface rounded-xl bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 focus:border-pop-yellow focus:ring-0 focus:shadow-[0_0_15px_rgba(255,225,0,0.15)] placeholder:text-on-surface-variant/30" 
                    id="email" name="email" placeholder="user@bobds.net" required type="email" 
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
                    className="w-full px-5 py-3.5 font-body-md text-body-md text-on-surface rounded-xl bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 focus:border-pop-yellow focus:ring-0 focus:shadow-[0_0_15px_rgba(255,225,0,0.15)] placeholder:text-on-surface-variant/30" 
                    id="password" name="password" placeholder="••••••••" required type="password" 
                    value={formData.password} onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  <input 
                    className="h-4 w-4 rounded-sm border-white/20 bg-transparent text-pop-yellow focus:ring-pop-yellow focus:ring-offset-background cursor-pointer" 
                    id="keepSession" name="keepSession" type="checkbox" 
                    checked={formData.keepSession} onChange={handleInputChange}
                  />
                  <label className="ml-2 block font-label-sm text-label-sm text-on-surface-variant cursor-pointer" htmlFor="keepSession">
                    MANTENER SESIÓN
                  </label>
                </div>
                <button type="button" onClick={() => changeStepWithTransition('forgot_email')} className="font-label-sm text-label-sm text-pop-yellow hover:text-white transition-colors duration-300 cursor-pointer">
                  ¿Olvido su Contraseña?
                </button>
              </div>
              <div className="pt-6 flex flex-col items-center gap-4">
                <button 
                  disabled={loading}
                  className="w-full bg-pop-yellow text-primary-container font-cta text-cta py-4 px-6 rounded-DEFAULT flex items-center justify-center gap-3 hover:glow-yellow transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed" 
                  type="submit"
                >
                  <span>{loading ? 'AUTENTICANDO...' : 'INGRESAR'}</span>
                  {!loading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-300 text-[18px]">arrow_forward</span>}
                </button>
                <a href="/signup" onClick={(e) => handleQuickNav(e, '/signup')} className="font-label-sm text-label-sm text-on-surface-variant hover:text-pop-yellow transition-colors duration-300 text-center cursor-pointer">
                  ¿No tienes una cuenta? <span className="text-white">Crea una gratis aquí</span>
                </a>
              </div>
            </form>
          </>
        );
    }
  };

  return (
    <div ref={containerRef} className={`bg-background text-on-background h-[100dvh] flex items-center relative overflow-hidden selection:bg-pop-yellow selection:text-black w-full max-w-[1920px] mx-auto ${step === 'login' ? 'justify-between' : 'justify-center'}`} style={{ backgroundColor: '#0c0c0c' }}>
      <div className="stars-container absolute inset-0 pointer-events-none z-0">
        <div className="star w-[2px] h-[2px] top-[15%] left-[10%]" style={{ animationDelay: '0s' }}></div>
        <div className="star w-[1px] h-[1px] top-[25%] left-[45%]" style={{ animationDelay: '1.2s' }}></div>
        <div className="star w-[3px] h-[3px] top-[65%] left-[22%]" style={{ animationDelay: '0.5s' }}></div>
        <div className="star w-[2px] h-[2px] top-[40%] left-[80%]" style={{ animationDelay: '2.1s' }}></div>
        <div className="star w-[1px] h-[1px] top-[85%] left-[33%]" style={{ animationDelay: '1.8s' }}></div>
        <div className="star w-[2px] h-[2px] top-[10%] left-[90%]" style={{ animationDelay: '3s' }}></div>
        <div className="star w-[1px] h-[1px] top-[50%] left-[15%]" style={{ animationDelay: '0.7s' }}></div>
      </div>
      
      {/* Ambient Background Element */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-20 overflow-hidden">
        <div className="relative w-full h-full">
          <svg className="absolute left-[-5%] top-[40%] -translate-y-1/2 w-[1200px] h-[1200px] ondular-shape opacity-40" fill="none" stroke="#FFE100" strokeWidth="0.5" viewBox="0 0 100 100">
            <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"></polygon>
            <polygon opacity="0.5" points="50,15 85,32.5 85,67.5 50,85 15,67.5 15,32.5" strokeWidth="0.2"></polygon>
            <line strokeDasharray="1 2" x1="50" x2="50" y1="5" y2="95"></line>
            <line strokeDasharray="1 2" x1="5" x2="95" y1="27.5" y2="72.5"></line>
            <line strokeDasharray="1 2" x1="5" x2="95" y1="72.5" y2="27.5"></line>
          </svg>
          <svg className="absolute left-[20%] top-[65%] w-[500px] h-[500px] floating-shape opacity-60" fill="none" stroke="#FFE100" strokeWidth="0.8" style={{ animationDuration: '20s' }} viewBox="0 0 100 100">
            <polygon points="50,10 90,30 90,70 50,90 10,70 10,30"></polygon>
            <circle cx="50" cy="50" fill="#FFE100" opacity="0.3" r="5"></circle>
          </svg>
          <svg className="absolute right-[10%] top-[10%] w-[300px] h-[300px] floating-shape opacity-30" fill="none" stroke="#FFE100" strokeWidth="0.4" style={{ animationDuration: '25s', animationDirection: 'reverse' }} viewBox="0 0 100 100">
            <polygon points="50,20 75,35 75,65 50,80 25,65 25,35"></polygon>
          </svg>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-glow-blur z-0 pointer-events-none"></div>

      {/* Login Title Container - Solo se muestra en el step 'login' */}
      {step === 'login' && (
        <div ref={titleRef} className="relative z-10 ml-[80px] max-w-2xl select-none hidden lg:block">
          <h2 className="font-display text-[64px] leading-tight font-extrabold tracking-tighter text-white">
            CONECTA.<br/><span className="text-pop-yellow">COORDINA.</span> CONTROLA.
          </h2>
        </div>
      )}

      <main className={`relative z-10 w-full max-w-md px-6 md:px-0 flex flex-col justify-center py-12 ${step === 'login' ? 'mr-0 lg:mr-[10%] mx-auto lg:mx-0' : 'mx-auto'}`}>
        
        {/* Animated Depth Element Behind Form */}
        <div 
          ref={depthElementRef} 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pop-yellow blur-[120px] rounded-full pointer-events-none z-[-1]"
        ></div>

        <div ref={formRef} className="glass-panel p-6 md:p-12 rounded-[24px] md:rounded-[32px] flex flex-col items-center shadow-[0_20px_50px_rgba(255,225,0,0.1)] relative">
          {/* Logo Section */}
          <div className="mb-8 w-32 h-32 relative">
            <img alt="B.O.B.D.S. Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,225,0,0.3)] cursor-pointer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAt7ss0DKLT4CtXuu7tBGOozdK_38SoW308-XwvLawyNQNLkGoO-2BEe2elsLQstoBMHPp8QwSgr6-4TemH2B_pTFvVODMuBCjYdR5aH_YiqhInOAMWUv5HJt-axjMS8_sK_Sn_nKk8IE-HUWidE6SUTJ9Z61ErgdIV5DyaCDJPsj-YJx4cWXvovbZ3VIQZkqeYZK4VdhAIctxx-2CjG4f5FJ0P7V4VwFqscu_aqLcpzqXhI6Iv7JSWN99mnXkKRLpxLwu--J0hWRk" />
          </div>
          
          {renderFormContent()}
          
          {/* Terminal-style Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 w-full flex justify-between items-center font-label-sm text-label-sm text-surface-variant">
            <span className="">V 1.0.0</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              STATUS: OK
            </span>
          </div>
        </div>
      </main>

      <div className="pointer-events-none absolute inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-10 mix-blend-overlay"></div>
      
      {/* Return Home Button */}
      <button 
        onClick={(e) => handleQuickNav(e, '/')}
        className="absolute left-8 lg:left-16 top-12 flex items-center gap-3 text-on-surface-variant hover:text-[#FFD700] transition-all duration-300 font-cta text-sm tracking-[0.2em] uppercase group z-50"
        title="Volver"
      >
        <span className="material-symbols-outlined text-[24px] group-hover:-translate-x-2 transition-transform duration-300">keyboard_backspace</span>
        <span className="opacity-80 group-hover:opacity-100 transition-opacity">Volver</span>
      </button>
    </div>
  );
};

export default LoginPage;
