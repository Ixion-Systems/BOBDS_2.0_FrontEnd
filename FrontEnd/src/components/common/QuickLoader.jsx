import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLoading } from '../../context/LoadingContext';
import logoYellow from '../../assets/IMG/Logo_Y.png';

const QuickLoader = () => {
  const { quickLoadConfig, endQuickTransition, setIsPageReady } = useLoading();
  
  const containerRef = useRef(null);
  const topDoorRef = useRef(null);
  const bottomDoorRef = useRef(null);
  const logoRef = useRef(null);
  const lineRef = useRef(null);

  useGSAP(() => {
    if (quickLoadConfig.isActive) {
      // 1. Mostrar contenedor principal y setear valores iniciales
      gsap.set(containerRef.current, { display: 'flex' });
      
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(containerRef.current, { display: 'none' });
          endQuickTransition();
        }
      });

      if (quickLoadConfig.isInitial) {
        // Carga inicial (F5): Empieza ya cerrado para ocultar el renderizado inicial
        gsap.set(topDoorRef.current, { y: '0%' });
        gsap.set(bottomDoorRef.current, { y: '0%' });
        gsap.set(logoRef.current, { scale: 1, opacity: 1 });
        gsap.set(lineRef.current, { scaleX: 1, opacity: 1 });
        
        // Simula la espera de carga y notifica a la página que empiece su animación de entrada
        tl.add(() => { setIsPageReady(true); }, "+=0.3");
        tl.to({}, { duration: 0.4 }); // Pausa mínima
      } else {
        // Transición normal entre pantallas
        // Las compuertas inician fuera de la pantalla
        gsap.set(topDoorRef.current, { y: '-100%' });
        gsap.set(bottomDoorRef.current, { y: '100%' });
        gsap.set(logoRef.current, { scale: 0.2, opacity: 0 });
        gsap.set(lineRef.current, { scaleX: 0, opacity: 0 });

        // Cierre Rápido Mecánico (Las compuertas se entrelazan)
        tl.to([topDoorRef.current, bottomDoorRef.current], { y: '0%', duration: 0.35, ease: 'power3.inOut' }, 0);
        // Línea central luminosa al impacto
        tl.to(lineRef.current, { scaleX: 1, opacity: 1, duration: 0.15, ease: 'power4.out' }, 0.3);
        // Logo aparece escalando
        tl.to(logoRef.current, { scale: 1, opacity: 1, duration: 0.2, ease: 'back.out(2)' }, 0.3);

        // PUNTO MEDIO (Cambio de Página por debajo)
        tl.add(() => {
          if (quickLoadConfig.onMidpoint) quickLoadConfig.onMidpoint();
        });

        // Pequeña pausa para asegurar render del DOM y luego liberar la nueva página
        tl.to({}, { duration: 0.1 });
        tl.add(() => { setIsPageReady(true); });
      }

      // 4. Apertura Rápida (Común para ambos casos)
      tl.to(logoRef.current, {
        scale: 1.5,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in'
      }, "+=0.1");

      tl.to(lineRef.current, {
        scaleX: 0,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in'
      }, "<");

      tl.to([topDoorRef.current, bottomDoorRef.current], {
        y: (i) => i === 0 ? '-100%' : '100%',
        duration: 0.35,
        ease: 'power3.inOut'
      }, "<0.1");
    }
  }, { scope: containerRef, dependencies: [quickLoadConfig.isActive], revertOnUpdate: true });

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[99999] pointer-events-none hidden overflow-hidden"
    >
      {/* Top Door (Flat Bottom Edge) */}
      <div 
        ref={topDoorRef}
        className="absolute top-0 left-0 w-full h-[50vh] bg-[#0c0c0c] flex items-end border-b-2 border-pop-yellow shadow-[0_10px_30px_rgba(255,225,0,0.2)]"
        style={{ 
          willChange: 'transform'
        }}
      ></div>

      {/* Bottom Door (Flat Top Edge) */}
      <div 
        ref={bottomDoorRef}
        className="absolute bottom-0 left-0 w-full h-[50vh] bg-[#0c0c0c] border-t-2 border-pop-yellow shadow-[0_-10px_30px_rgba(255,225,0,0.2)]"
        style={{ 
          willChange: 'transform'
        }}
      ></div>

      {/* Impact Line */}
      <div 
        ref={lineRef}
        className="absolute top-1/2 left-0 w-full h-[2px] bg-white shadow-[0_0_20px_#FFE100] origin-center z-10"
        style={{ transform: 'translateY(-50%)' }}
      ></div>

      {/* Center Logo Container */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div ref={logoRef} className="relative w-28 h-28">
          <img 
            src={logoYellow} 
            alt="Loading" 
            className="absolute inset-0 w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(255,225,0,0.8)]" 
          />
        </div>
      </div>
    </div>
  );
};

export default QuickLoader;
