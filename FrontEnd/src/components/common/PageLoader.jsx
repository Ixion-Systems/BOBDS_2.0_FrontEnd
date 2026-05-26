import React, { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLoading } from '../../context/LoadingContext';
import logoWhite from '../../assets/IMG/Logo.png';
import logoYellow from '../../assets/IMG/Logo_Y.png';

const PageLoader = () => {
  const { pathname } = useLocation();
  const { setIsPageReady } = useLoading();
  
  const containerRef = useRef(null);
  const gradientRef = useRef(null);
  const blackWashRef = useRef(null);
  const yellowLogoRef = useRef(null);
  const whiteLogoRef = useRef(null);
  const linesContainerRef = useRef(null);
  const linesRef = useRef([]);

  useGSAP(() => {
    setIsPageReady(false);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsPageReady(true);
        gsap.set(containerRef.current, { display: 'none' });
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
    tl.to(whiteLogoRef.current, { opacity: 0, scale: 1.05, duration: surgeDuration, ease: 'power2.inOut' }, 0);
    tl.to(yellowLogoRef.current, { opacity: 1, scale: 1.05, duration: surgeDuration, ease: 'power2.inOut' }, 0);
    tl.to(linesContainerRef.current, { opacity: 1, duration: surgeDuration, ease: 'power2.in' }, 0);
    tl.to(linesTween, { timeScale: 12, duration: surgeDuration, ease: 'power3.in' }, 0);

    // --- FASE 2: EL FRENADO Y RETORNO AL NEGRO (1.2s a 2.2s) ---
    tl.to(blackWashRef.current, { y: '0%', duration: cooldownDuration, ease: 'power2.out' }, surgeDuration);
    tl.to(gradientRef.current, { opacity: 0, duration: cooldownDuration, ease: 'power2.out' }, surgeDuration);
    tl.to(whiteLogoRef.current, { opacity: 1, scale: 1, duration: cooldownDuration, ease: 'power2.out' }, surgeDuration);
    tl.to(yellowLogoRef.current, { opacity: 0, scale: 1, duration: cooldownDuration, ease: 'power2.out' }, surgeDuration);
    tl.to(linesContainerRef.current, { opacity: 0, duration: cooldownDuration, ease: 'power2.out' }, surgeDuration);
    tl.to(linesTween, { timeScale: 0.1, duration: cooldownDuration, ease: 'power3.out' }, surgeDuration);

    // --- FASE 3: DESVANECIMIENTO FINAL ---
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut'
    }, surgeDuration + cooldownDuration);

  }, { dependencies: [pathname, setIsPageReady], revertOnUpdate: true });

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#0c0c0c] flex items-center justify-center overflow-hidden pointer-events-none"
    >
      {/* Updraft Speed Lines */}
      <div 
        ref={linesContainerRef}
        className="absolute inset-0 w-full h-full overflow-hidden mix-blend-screen pointer-events-none z-10"
      >
        {[...Array(25)].map((_, i) => (
          <div 
            key={i}
            ref={el => linesRef.current[i] = el}
            className="absolute top-0 w-[2px] h-[300px] bg-white blur-[1px]"
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
      <div className="absolute bottom-12 font-mono text-[10px] text-pop-yellow tracking-[0.3em] uppercase animate-pulse">
        Inicializando Sistemas...
      </div>
    </div>
  );
};

export default PageLoader;
