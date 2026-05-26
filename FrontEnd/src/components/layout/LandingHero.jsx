import React from 'react';

const LandingHero = () => {
  return (
    <section className="hero-gradient min-h-[85vh] flex items-center px-6 md:px-margin-desktop relative z-10 pt-24 md:pt-0" id="inicio">
      {/* Technical Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#FFE100 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="max-w-container-max mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-gutter relative z-10">
        <div className="md:col-span-8 space-y-8">
          {/* Se agregó 'text-left' al final de la lista de clases del h1 */}
          <h1 className="font-display text-5xl sm:text-7xl lg:text-[100px] leading-[1.1] md:leading-[0.9] font-black text-white tracking-tighter uppercase text-left">
            Bob Do Something
          </h1>
          <p className="font-body-lg text-base md:text-body-lg text-[#e4e2e1]/80 max-w-xl border-l-2 border-pop-yellow pl-4 md:pl-6 text-left">
            Centralización táctica y gestión de flotas robóticas autónomas. Automatizamos la rutina operativa para liberar el potencial estratégico humano.
          </p>
          <div className="flex gap-6 pt-4"></div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;