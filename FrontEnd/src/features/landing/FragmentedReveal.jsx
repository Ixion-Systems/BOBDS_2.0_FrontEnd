import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FragmentedReveal = ({ src, alt, overlayClassName }) => {
  const containerRef = useRef(null);
  const barsRef = useRef([]);

  useGSAP(() => {
    // Revelado caótico/desordenado de las barras
    gsap.to(barsRef.current, {
      scaleY: 0,
      opacity: 0,
      duration: 1.5,
      stagger: {
        amount: 1,
        from: "random" // Esto hace que se animen "en desorden"
      },
      ease: "power4.inOut",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        once: true
      }
    });

    // Efecto de enfoque cinemático de la imagen
    gsap.fromTo(containerRef.current.querySelector('img'),
      { scale: 1.2, filter: 'blur(20px)' },
      { 
        scale: 1, 
        filter: 'blur(0px)', 
        duration: 2.5, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true
        }
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden bg-[#0c0c0c]">
      <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
      {/* Overlay negro opaco solicitado por el usuario */}
      <div className={`absolute inset-0 z-10 ${overlayClassName}`}></div>
      {/* Barras fragmentadas de "Desorden" (mismo color que el fondo de la landing) */}
      <div className="absolute inset-0 z-20 flex">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            ref={el => barsRef.current[i] = el}
            className="flex-1 h-full bg-[#0c0c0c] origin-bottom border-r border-white/5"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default FragmentedReveal;
