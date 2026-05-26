import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLoading } from '../../context/LoadingContext';
import logoYellow from '../../assets/IMG/Logo_Y.png';
import './OrbitalLoader.css';

const OrbitalLoader = () => {
  const { orbitalLoadConfig, endOrbitalTransition } = useLoading();
  
  const containerRef = useRef(null);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const ring3Ref = useRef(null);
  const ring4Ref = useRef(null);
  const logoRef = useRef(null);
  const flashRef = useRef(null);
  const statusRef = useRef(null);
  const scanlineRef = useRef(null);
  const bracketsRef = useRef(null);

  useGSAP(() => {
    if (!orbitalLoadConfig.isActive) return;

    // Show container
    gsap.set(containerRef.current, { display: 'flex', opacity: 1 });
    
    // Initial states
    gsap.set(logoRef.current, { scale: 0.3, opacity: 0 });
    gsap.set(flashRef.current, { scale: 0, opacity: 0 });
    gsap.set(statusRef.current, { opacity: 0, y: 10 });
    gsap.set(scanlineRef.current, { y: '-100vh', opacity: 0 });
    gsap.set(bracketsRef.current.children, { opacity: 0, scale: 0.5 });

    // Rings initial: scattered rotations, scaled down
    gsap.set(ring1Ref.current, { rotation: 0, scale: 0.5, opacity: 0 });
    gsap.set(ring2Ref.current, { rotation: 120, scale: 0.5, opacity: 0 });
    gsap.set(ring3Ref.current, { rotation: 240, scale: 0.5, opacity: 0 });
    gsap.set(ring4Ref.current, { rotation: 60, scale: 0.5, opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(containerRef.current, { display: 'none' });
        endOrbitalTransition();
      }
    });

    // ====== FASE 1: MATERIALIZACIÓN (0s - 0.8s) ======
    // Los anillos aparecen y empiezan a rotar independientemente
    tl.to(ring1Ref.current, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' }, 0);
    tl.to(ring2Ref.current, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' }, 0.1);
    tl.to(ring3Ref.current, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' }, 0.2);
    tl.to(ring4Ref.current, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' }, 0.3);

    // Logo pulsa al centro
    tl.to(logoRef.current, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, 0.3);
    
    // Status text
    tl.to(statusRef.current, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 0.5);

    // Corner brackets
    tl.to(bracketsRef.current.children, { opacity: 1, scale: 1, stagger: 0.05, duration: 0.3, ease: 'power2.out' }, 0.4);

    // ====== FASE 2: ROTACIÓN LIBRE (0.8s - 2.2s) ======
    // Los anillos giran cada uno a distinta velocidad buscando la alineación
    tl.to(ring1Ref.current, { rotation: '+=420', duration: 1.4, ease: 'power2.inOut' }, 0.8);
    tl.to(ring2Ref.current, { rotation: '+=300', duration: 1.4, ease: 'power2.inOut' }, 0.8);
    tl.to(ring3Ref.current, { rotation: '+=540', duration: 1.4, ease: 'power2.inOut' }, 0.8);
    tl.to(ring4Ref.current, { rotation: '+=660', duration: 1.4, ease: 'power2.inOut' }, 0.8);

    // Logo pulsa suavemente mientras gira
    tl.to(logoRef.current, { scale: 1.05, duration: 0.7, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 0.8);

    // ====== PUNTO MEDIO: CAMBIO DE PÁGINA (2.2s) ======
    tl.add(() => {
      if (orbitalLoadConfig.onMidpoint) {
        orbitalLoadConfig.onMidpoint();
      }
    }, 2.2);

    // Pausa para renderizar la nueva página
    tl.to({}, { duration: 0.15 }, 2.2);

    // ====== FASE 3: ALINEACIÓN Y LOCK (2.35s - 3.0s) ======
    // Todos los anillos convergen a rotación 0 (se "alinean")
    const lockTime = 2.35;
    tl.to(ring1Ref.current, { rotation: 360, duration: 0.4, ease: 'power4.out' }, lockTime);
    tl.to(ring2Ref.current, { rotation: 360, duration: 0.4, ease: 'power4.out' }, lockTime);
    tl.to(ring3Ref.current, { rotation: 360, duration: 0.4, ease: 'power4.out' }, lockTime);
    tl.to(ring4Ref.current, { rotation: 360, duration: 0.4, ease: 'power4.out' }, lockTime);

    // ====== FASE 4: FLASH DE DESBLOQUEO (3.0s - 3.3s) ======
    const flashTime = lockTime + 0.4;
    // Flash dorado desde el centro
    tl.to(flashRef.current, { scale: 1, opacity: 1, duration: 0.15, ease: 'power4.out' }, flashTime);
    
    // Scanline sweep
    tl.to(scanlineRef.current, { y: '100vh', opacity: 0.6, duration: 0.4, ease: 'power2.in' }, flashTime);

    // Logo brilla intenso
    tl.to(logoRef.current, { scale: 1.3, filter: 'brightness(2) drop-shadow(0 0 40px rgba(255,215,0,0.9))', duration: 0.2, ease: 'power2.out' }, flashTime);

    // ====== FASE 5: DISOLUCIÓN (3.3s - 3.8s) ======
    const dissolveTime = flashTime + 0.25;
    // Los anillos se expanden y desaparecen
    tl.to([ring1Ref.current, ring2Ref.current, ring3Ref.current, ring4Ref.current], {
      scale: 2, opacity: 0, duration: 0.5, ease: 'power2.in', stagger: 0.03
    }, dissolveTime);

    // Logo desaparece
    tl.to(logoRef.current, { scale: 2, opacity: 0, duration: 0.4, ease: 'power2.in' }, dissolveTime);

    // Flash se desvanece
    tl.to(flashRef.current, { opacity: 0, duration: 0.4, ease: 'power2.in' }, dissolveTime);

    // Status y brackets desaparecen
    tl.to(statusRef.current, { opacity: 0, y: -10, duration: 0.2, ease: 'power2.in' }, dissolveTime);
    tl.to(bracketsRef.current.children, { opacity: 0, scale: 1.5, stagger: 0.02, duration: 0.3, ease: 'power2.in' }, dissolveTime);

    // Contenedor entero se desvanece
    tl.to(containerRef.current, { opacity: 0, duration: 0.4, ease: 'power2.inOut' }, dissolveTime + 0.2);

  }, { scope: containerRef, dependencies: [orbitalLoadConfig.isActive], revertOnUpdate: true });

  return (
    <div 
      ref={containerRef} 
      className="orbital-loader-container"
      style={{ display: 'none' }}
    >
      {/* Ambient particle dots */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-[2px] h-[2px] rounded-full bg-[#FFD700]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1,
              animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Corner HUD brackets */}
      <div ref={bracketsRef} className="absolute inset-0 pointer-events-none">
        <div className="orbital-bracket orbital-bracket-tl"></div>
        <div className="orbital-bracket orbital-bracket-tr"></div>
        <div className="orbital-bracket orbital-bracket-bl"></div>
        <div className="orbital-bracket orbital-bracket-br"></div>
      </div>

      {/* Orbital Rings */}
      <div ref={ring1Ref} className="orbital-ring orbital-ring-1"></div>
      <div ref={ring2Ref} className="orbital-ring orbital-ring-2"></div>
      <div ref={ring3Ref} className="orbital-ring orbital-ring-3"></div>
      <div ref={ring4Ref} className="orbital-ring orbital-ring-4"></div>

      {/* Central Flash */}
      <div 
        ref={flashRef}
        className="absolute w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(255,215,0,0.05) 40%, transparent 70%)',
          filter: 'blur(20px)'
        }}
      ></div>

      {/* Scanline */}
      <div ref={scanlineRef} className="orbital-scanline"></div>

      {/* Central Logo */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div ref={logoRef} className="relative w-20 h-20">
          <img 
            src={logoYellow} 
            alt="Unlocking" 
            className="absolute inset-0 w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(255,225,0,0.7)]" 
          />
        </div>
      </div>

      {/* Status Text */}
      <div ref={statusRef} className="orbital-status-text">
        Estableciendo Conexión Segura
      </div>
    </div>
  );
};

export default OrbitalLoader;
