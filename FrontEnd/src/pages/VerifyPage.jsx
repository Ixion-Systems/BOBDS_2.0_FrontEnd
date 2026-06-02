import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLoading } from '../context/LoadingContext';
import { useAlert } from '../context/AlertContext';

const VerifyPage = () => {
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const glowRef = useRef(null);
  const depthElementRef = useRef(null);
  
  const { isPageReady, triggerQuickTransition } = useLoading();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const { showAlert } = useAlert();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      triggerQuickTransition(() => navigate('/signup'));
    }
  }, [email, navigate, triggerQuickTransition]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  useGSAP(() => {
    if (!isPageReady) {
      gsap.set([formRef.current, depthElementRef.current, glowRef.current], { opacity: 0 });
      return;
    }

    gsap.fromTo(glowRef.current,
      { y: '-100%', opacity: 0, scale: 0.5 },
      { y: '0%', opacity: 0.15, scale: 1, duration: 4, ease: 'power2.out', delay: 0.2 }
    );

    gsap.fromTo(depthElementRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 0.6, scale: 1, duration: 4, ease: 'power2.out', delay: 0.2 }
    );

    gsap.fromTo(formRef.current,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.5 }
    );
  }, { scope: containerRef, dependencies: [isPageReady], revertOnUpdate: true });

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasteData) {
      const newCode = [...code];
      for (let i = 0; i < pasteData.length; i++) {
        newCode[i] = pasteData[i];
      }
      setCode(newCode);
      if (pasteData.length < 6) {
        inputRefs.current[pasteData.length]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) return;
    
    setLoading(true);
    try {
      await authService.verify(email, fullCode);
      showAlert('Cuenta verificada exitosamente. Ahora puedes iniciar sesión.', 'success');
      triggerQuickTransition(() => navigate('/login'));
    } catch (error) {
      showAlert(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;
    try {
      await authService.resend(email);
      showAlert('Se ha enviado un nuevo código a tu correo.', 'success');
      setTimeLeft(30);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      showAlert('Error al reenviar: ' + error.message, 'error');
    }
  };

  const isComplete = code.every(digit => digit !== '');

  return (
    <div ref={containerRef} className="bg-background text-on-background h-[100dvh] flex items-center justify-center relative overflow-hidden selection:bg-pop-yellow selection:text-black w-full" style={{ backgroundColor: '#0c0c0c' }}>
      <div className="stars-container absolute inset-0 pointer-events-none z-0">
        <div className="star w-[2px] h-[2px] top-[15%] left-[10%]"></div>
        <div className="star w-[1px] h-[1px] top-[25%] left-[45%]"></div>
        <div className="star w-[3px] h-[3px] top-[65%] left-[22%]"></div>
        <div className="star w-[2px] h-[2px] top-[40%] left-[80%]"></div>
      </div>

      <div ref={depthElementRef} className="radar-container absolute inset-0 m-auto flex items-center justify-center pointer-events-none z-0 opacity-20">
         <div className="w-[800px] h-[800px] border border-white/5 rounded-full absolute"></div>
         <div className="w-[600px] h-[600px] border border-white/10 rounded-full absolute"></div>
         <div className="w-[400px] h-[400px] border border-white/20 rounded-full absolute"></div>
      </div>

      <div ref={glowRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pop-yellow blur-[150px] rounded-full pointer-events-none z-[-1]"></div>

      <main className="relative z-10 w-full max-w-lg px-6 flex flex-col justify-center">
        <div ref={formRef} className="glass-panel p-8 md:p-12 rounded-[24px] flex flex-col items-center shadow-[0_20px_50px_rgba(255,235,0,0.1)] relative border border-white/10 bg-surface/40 backdrop-blur-xl">
          
          <img alt="B.O.B.D.S. Logo" className="w-[80px] h-[80px] object-contain mb-6 filter drop-shadow-[0_0_15px_rgba(255,225,0,0.3)]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOd3d4Xgx4YN4cZL5HIUWMkMqWKpYwM_fSYIN1qrFyKfEcZlhdlelenejI5BrlX4UTPiSVMlSRM4jZg9aT8doeMtbPGyM_vtXApLRYAQ5kbhZdLzUm--7wfQXI-9yeArBU4cLB2uHTljMMeM1exj4HgitjJWyNmsSTLA-mZb4us9puX0-TJMQ4rnBr6-GADnXk3TqZi8C2i2LFHMFaNIufvqDnkJJL-FYPBMyK4h0BL_GWZl92xIVxdCbp0FopsUJjioGFMuwbCDc" />
          
          <h1 className="font-headline-sm text-2xl md:text-3xl text-on-surface mb-2 tracking-tight text-center uppercase">VALIDACION VIA EMAIL</h1>
          <p className="font-label-sm text-label-sm text-pop-yellow uppercase tracking-widest text-center mb-6">Protocolo de Validacion</p>
          
          <p className="font-body-md text-on-surface-variant text-center mb-8">
            Revisá tu casilla y extraé el PIN de seguridad <br/>que enviamos a <strong className="text-white">{email}</strong>
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-6">
            <div className="flex justify-center gap-2 md:gap-4 w-full max-w-full" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-center font-headline-md text-xl sm:text-2xl md:text-3xl text-pop-yellow bg-white/5 border border-white/20 rounded-xl focus:border-pop-yellow focus:ring-0 focus:shadow-[0_0_15px_rgba(255,235,0,0.2)] transition-all duration-300 placeholder:text-transparent caret-transparent flex-shrink"
                />
              ))}
            </div>

            <button 
              disabled={loading || !isComplete}
              className="w-full mt-4 bg-pop-yellow text-primary-container font-cta text-cta py-4 rounded-DEFAULT flex items-center justify-center gap-3 hover:glow-yellow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
            >
              {loading ? 'VERIFICANDO...' : 'CONFIRMAR CÓDIGO'}
            </button>
          </form>

          <div className="mt-8 text-center w-full">
            {timeLeft > 0 ? (
              <p className="font-body-sm text-surface-variant">
                Podrás reenviar el código en <span className="text-pop-yellow font-bold">{timeLeft}s</span>
              </p>
            ) : (
              <button 
                onClick={handleResend}
                className="font-label-sm text-label-sm text-pop-yellow hover:text-white transition-colors duration-300 cursor-pointer uppercase tracking-wider"
              >
                Reenviar código
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default VerifyPage;
