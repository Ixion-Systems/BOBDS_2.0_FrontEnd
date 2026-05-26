import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import { useLoading } from '../../context/LoadingContext';
import logoWhite from '../../assets/IMG/Logo.png';
import logoYellow from '../../assets/IMG/Logo_Y.png';

gsap.registerPlugin(TextPlugin);

const PageLoader = () => {
  const { pageLoadConfig, setPageLoadConfig, setIsPageReady } = useLoading();
  
  const containerRef = useRef(null);
  const gradientRef = useRef(null);
  const blackWashRef = useRef(null);
  const yellowLogoRef = useRef(null);
  const whiteLogoRef = useRef(null);
  const linesContainerRef = useRef(null);
  const linesRef = useRef([]);
  const textRef = useRef(null);

  useGSAP(() => {
    if (!pageLoadConfig.isActive) return;

    setIsPageReady(false);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsPageReady(true);
        gsap.set(containerRef.current, { display: 'none' });
        setPageLoadConfig({ isActive: false });
      }
    });

    // Reset initial states
    gsap.set(containerRef.current, { opacity: 1, display: 'flex' });
    // Configurar líneas de velocidad en posiciones aleatorias
    linesRef.current.forEach(line => {
      gsap.set(line, {
        left: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.5 + 0.2 // Más opacas base
      });
    });

    // Reset initial states
    gsap.set(containerRef.current, { opacity: 1, display: 'flex' });
    gsap.set(gradientRef.current, { y: '100%', opacity: 1 });
    gsap.set(blackWashRef.current, { y: '-100%' });
    gsap.set(whiteLogoRef.current, { opacity: 1, scale: 1 });
    gsap.set(yellowLogoRef.current, { opacity: 0, scale: 0.95 });
    gsap.set(linesContainerRef.current, { opacity: 0 });
    gsap.set(textRef.current, { text: "" }); // Limpia el texto

    // Animación continua de las líneas (Updraft)
    const linesTween = gsap.fromTo(linesRef.current, 
      { y: -500 },
      { 
        y: window.innerHeight + 500, 
        duration: 1, 
        ease: 'none', 
        stagger: {
          each: 0.04,
          repeat: -1
        }
      }
    );
    linesTween.timeScale(0.1); // Inician súper lento

    const surgeDuration = 1.2;
    const cooldownDuration = 1.0;

    // --- FASE 1: LA EMBESTIDA (0s a 1.2s) ---
    tl.to(gradientRef.current, { y: '-20%', duration: surgeDuration, ease: 'power2.in' }, 0);
    // Efecto de cámara rápida (shake/glitch simulado con temblor de escala)
    tl.to(whiteLogoRef.current, { opacity: 0, scale: 1.05, duration: surgeDuration, ease: 'power2.inOut' }, 0);
    tl.to(yellowLogoRef.current, { opacity: 1, scale: 1.05, duration: surgeDuration, ease: 'power2.inOut' }, 0);
    
    // Mini temblor (Power-On Flash Shake)
    tl.to(containerRef.current, {
      x: () => Math.random() * 6 - 3,
      y: () => Math.random() * 6 - 3,
      duration: 0.05,
      repeat: 8,
      yoyo: true,
      ease: 'none'
    }, surgeDuration - 0.4);

    tl.to(linesContainerRef.current, { opacity: 1, duration: surgeDuration, ease: 'power2.in' }, 0);
    tl.to(linesTween, { timeScale: 15, duration: surgeDuration, ease: 'power3.in' }, 0);

    // Texto Scramble/Escribir
    tl.to(textRef.current, {
      text: { value: "INITIALIZING SYSTEMS...", delimiter: "" },
      duration: 0.8,
      ease: "none"
    }, 0.2);

    // --- FASE 2: EL FRENADO Y RETORNO AL NEGRO (1.2s a 2.2s) ---
    tl.to(blackWashRef.current, { y: '0%', duration: cooldownDuration, ease: 'power2.out' }, surgeDuration);
    tl.to(gradientRef.current, { opacity: 0, duration: cooldownDuration, ease: 'power2.out' }, surgeDuration);
    tl.to(whiteLogoRef.current, { opacity: 1, scale: 1, duration: cooldownDuration, ease: 'power2.out' }, surgeDuration);
    tl.to(yellowLogoRef.current, { opacity: 0, scale: 1, duration: cooldownDuration, ease: 'power2.out' }, surgeDuration);
    tl.to(linesContainerRef.current, { opacity: 0, duration: cooldownDuration, ease: 'power2.out' }, surgeDuration);
    tl.to(linesTween, { timeScale: 0.1, duration: cooldownDuration, ease: 'power3.out' }, surgeDuration);

    // --- FASE 3: DESVANECIMIENTO FINAL ---
    tl.to(textRef.current, { opacity: 0, duration: 0.2 }, surgeDuration + cooldownDuration);
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut'
    }, surgeDuration + cooldownDuration);

  }, { dependencies: [pageLoadConfig.isActive, setIsPageReady], revertOnUpdate: true });

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#0c0c0c] hidden items-center justify-center overflow-hidden pointer-events-none"
    >
      {/* Updraft Speed Lines */}
      <div 
        ref={linesContainerRef}
        className="absolute inset-0 w-full h-full overflow-hidden mix-blend-screen pointer-events-none z-10"
      >
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            ref={el => linesRef.current[i] = el}
            className="absolute top-0 w-[1.5px] h-[350px] bg-[#FFD700] opacity-80"
          ></div>
        ))}
      </div>

      {/* Background Gradient Animation (Yellow Surge) */}
      <div 
        ref={gradientRef}
        className="absolute inset-0 bg-gradient-to-t from-pop-yellow/60 via-pop-yellow/10 to-transparent w-full h-[200%] blur-[150px] z-0"
      ></div>

      {/* Black Wash Down Gradient */}
      <div 
        ref={blackWashRef}
        className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c] via-[#0c0c0c]/90 to-transparent w-full h-[200%] z-15"
      ></div>

      {/* Central Logo Container */}
      <div className="relative w-48 h-48 flex items-center justify-center z-20">
        {/* White Logo (Base) */}
        <img 
          ref={whiteLogoRef}
          src={logoWhite} 
          alt="Loading..." 
          className="absolute inset-0 w-full h-full object-contain"
        />
        
        {/* Yellow Logo (Overlay) */}
        <img 
          ref={yellowLogoRef}
          src={logoYellow} 
          alt="Loading..." 
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>
      
      {/* Progress Text */}
      <div 
        ref={textRef}
        className="absolute bottom-12 font-mono text-[10px] md:text-xs text-[#FFD700] tracking-[0.3em] uppercase"
      >
        {/* Llenado por TextPlugin */}
      </div>
    </div>
  );
};

export default PageLoader;
