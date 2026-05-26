import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoading } from '../../context/LoadingContext';

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('inicio');
  const { triggerQuickTransition } = useLoading();
  const navigate = useNavigate();

  const handleLoginClick = (e) => {
    e.preventDefault();
    triggerQuickTransition(() => navigate('/login'));
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['inicio', 'proposito', 'alcance', 'funciones', 'relaciones', 'faq'];
      // Offset compensatorio de scroll para la navbar
      const scrollPosition = window.scrollY + 250;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Ejecutamos una vez al montar para chequear si el usr refrescó la página a medio scroll
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getLinkClass = (section) => {
    // Se aumenta el tamaño a text-base (16px) o text-lg para mayor legibilidad
    const baseClass = "font-cta text-base tracking-wider transition-all duration-300";
    return activeSection === section 
      ? `${baseClass} text-pop-yellow drop-shadow-md` 
      : `${baseClass} text-on-surface hover:text-pop-yellow`;
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0c0c0c]/80 border-b border-white/10 backdrop-blur-xl">
      <div className="flex justify-between items-center w-full px-6 md:px-margin-desktop py-4 md:py-8 mx-auto max-w-[1920px]">
        <div className="flex items-center gap-4 md:gap-16">
          <img
            alt="B.O.B. DO SOMETHING."
            className="h-10 md:h-12 w-auto object-contain cursor-pointer transform scale-[1.2] md:scale-[1.6] origin-left ml-2"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ0VLlbLxMHmRtLsjeG3E-VmxX_aX-oDKWekEHNDbEp4J7Bc4iZXOYqppL9t7ucFM5fR0bnm3yNLFiNgG70HVRHrSqvqSoTclyrLuTgmydWsJYz-KXcFDdEqm1g0Z9NXWUFNXtRY5trqniryykmKNpdbtgbKtv3FDHIkELNBpaSQmqF8zalDXCSugTBDrZXXDx5SHZ5FIlkDFEc860jBfJl9Wzte4OYLsrqcLZy2AZQ4ddrpxgmj1UvPNpcfxvb8Qy1Noa0_YPhfA"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
          <div className="hidden md:flex items-center gap-12">
            <a className={getLinkClass('inicio')} href="#inicio">Inicio</a>
            <a className={getLinkClass('proposito')} href="#proposito">Proposito</a>
            <a className={getLinkClass('alcance')} href="#alcance">Alcance</a>
            <a className={getLinkClass('funciones')} href="#funciones">Funciones</a>
            <a className={getLinkClass('relaciones')} href="#relaciones">Relaciones</a>
            <a className={getLinkClass('faq')} href="#faq">FAQ</a>
          </div>
        </div>
        <a 
          href="/login"
          onClick={handleLoginClick}
          className="flex-1 max-w-[140px] md:max-w-none md:flex-none bg-pop-yellow text-[#0C0C0C] font-headline-md text-[11px] md:text-base px-3 py-2.5 md:px-6 md:py-2 rounded-none uppercase font-bold glow-button transition-transform active:scale-95 flex items-center justify-center text-center leading-tight whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer">
          INICIAR SESION
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
