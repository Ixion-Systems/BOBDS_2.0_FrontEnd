// Dependencias y Manejo de Animaciones Base
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLoading } from '../context/LoadingContext';

// Importación de Componentes de Layout
import Navbar from '../components/layout/Navbar';
import LandingHero from '../features/landing/LandingHero';
import LandingSections from '../features/landing/LandingSections';

// Importación de Estilos Globales
import '../styles/theme.css';

gsap.registerPlugin(ScrollTrigger);

// Componente Principal de Enrutamiento de Inicio
const LandingPage = () => {
  // Referencias de Elementos DOM para Control de Flujo
  const container = useRef();
  const { isPageReady } = useLoading();

  useGSAP(() => {
    const sections = gsap.utils.toArray('section');

    if (!isPageReady) {
      gsap.set(sections, { opacity: 0 });
      return;
    }

    // Seleccionamos todas las secciones semánticas para aplicar el reveal en scroll
    
    sections.forEach((sec) => {
      gsap.fromTo(sec, 
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }, { scope: container, dependencies: [isPageReady] });

  // Renderizado del Contenedor de Secciones
  return (
    <div ref={container} className="w-full relative overflow-x-hidden">
      <Navbar />
      
      <main className="w-full pt-[64px] relative">
        {/* Unified Background Layer */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          {/* Hero - Large Square (Right) */}
          <div className="hidden lg:flex tech-figure-container right-[-10%] top-[2%] w-[800px] h-[800px] opacity-60">
            <div className="absolute inset-0 border-[30px] border-pop-yellow/5 rounded-sm rotating-shape" style={{ animationDuration: '40s' }}></div>
            <div className="absolute inset-[60px] border border-white/10 rounded-sm rotating-shape" style={{ animationDuration: '80s', animationDirection: 'reverse' }}></div>
            <div className="absolute inset-[120px] border border-pop-yellow/20 rounded-sm border-dashed rotating-shape"></div>
            <svg className="absolute inset-0 w-full h-full opacity-10 rotating-shape" style={{ animationDuration: '120s' }} viewBox="0 0 100 100">
              <rect fill="none" height="50" stroke="currentColor" strokeDasharray="2 2" strokeWidth="0.2" width="50" x="25" y="25"></rect>
            </svg>
          </div>
          {/* Purpose - Hexagon (Left) */}
          <div className="hidden lg:flex tech-figure-container left-[-5%] top-[20%] w-[600px] h-[600px] opacity-50">
            <div className="absolute inset-0 border-[20px] border-pop-yellow/5 rounded-full rotating-shape" style={{ animationDuration: '45s' }}></div>
            <div className="absolute inset-10 border border-white/10 rounded-full rotating-shape" style={{ animationDuration: '90s', animationDirection: 'reverse' }}></div>
            <div className="absolute inset-20 border border-pop-yellow/20 rounded-full border-dashed rotating-shape" style={{ animationDuration: '70s' }}></div>
            <svg className="absolute inset-0 w-full h-full opacity-10 rotating-shape" style={{ animationDuration: '130s' }} viewBox="0 0 100 100">
              <polygon fill="none" points="50,15 80,32 80,68 50,85 20,68 20,32" stroke="currentColor" strokeDasharray="4 4" strokeWidth="0.2"></polygon>
            </svg>
          </div>
          {/* Scope - Triangle (Right) */}
          <div className="hidden lg:flex tech-figure-container right-[-5%] top-[40%] w-[550px] h-[550px] opacity-40">
            <div className="absolute inset-0 border-[20px] border-pop-yellow/5 rounded-full rotating-shape" style={{ animationDuration: '50s', animationDirection: 'reverse' }}></div>
            <div className="absolute inset-10 border border-white/10 rounded-full rotating-shape" style={{ animationDuration: '100s' }}></div>
            <div className="absolute inset-20 border border-pop-yellow/20 rounded-full border-dashed rotating-shape" style={{ animationDuration: '80s', animationDirection: 'reverse' }}></div>
            <svg className="absolute inset-0 w-full h-full opacity-10 rotating-shape" style={{ animationDuration: '140s' }} viewBox="0 0 100 100">
              <polygon fill="none" points="50,20 80,80 20,80" stroke="currentColor" strokeDasharray="2 2" strokeWidth="0.2"></polygon>
            </svg>
          </div>
          {/* Functions - Pentagon (Left) */}
          <div className="hidden lg:flex tech-figure-container left-[-5%] top-[60%] w-[450px] h-[450px] opacity-40">
            <div className="absolute inset-0 border-[20px] border-pop-yellow/5 rounded-full rotating-shape" style={{ animationDuration: '55s' }}></div>
            <div className="absolute inset-10 border border-white/10 rounded-full rotating-shape" style={{ animationDuration: '110s', animationDirection: 'reverse' }}></div>
            <div className="absolute inset-20 border border-pop-yellow/20 rounded-full border-dashed rotating-shape"></div>
            <svg className="absolute inset-0 w-full h-full opacity-10 rotating-shape" style={{ animationDuration: '150s' }} viewBox="0 0 100 100">
              <polygon fill="none" points="50,15 85,40 70,80 30,80 15,40" stroke="currentColor" strokeDasharray="10 2" strokeWidth="0.2"></polygon>
            </svg>
          </div>
          {/* FAQ - Circle (Right) */}
          <div className="hidden lg:flex tech-figure-container right-[-5%] top-[80%] w-[400px] h-[400px] opacity-30">
            <div className="absolute inset-0 border-[20px] border-pop-yellow/5 rounded-full rotating-shape" style={{ animationDuration: '35s' }}></div>
            <div className="absolute inset-10 border border-white/10 rounded-full rotating-shape" style={{ animationDuration: '75s', animationDirection: 'reverse' }}></div>
            <div className="absolute inset-20 border border-pop-yellow/20 rounded-full border-dashed rotating-shape"></div>
            <svg className="absolute inset-0 w-full h-full opacity-10 rotating-shape" style={{ animationDuration: '110s' }} viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="35" stroke="currentColor" strokeDasharray="1 1" strokeWidth="0.2"></circle>
            </svg>
          </div>
        </div>

        <LandingHero />
        <LandingSections />
      </main>
    </div>
  );
};

export default LandingPage;
