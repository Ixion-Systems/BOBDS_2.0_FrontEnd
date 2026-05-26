import React, { useState } from 'react';

const FAQSection = () => {
  const [activeFaq, setActiveFaq] = useState(0);
  const faqs = [
    {
      q: "¿El control de los robots es en tiempo real?",
      a: "Sí, el sistema está diseñado para enviar datos a tus robots de forma rápida y con muy baja latencia. Nuestra prioridad es que la conexión sea veloz y que la información de tus unidades se actualice de forma constante, para que siempre tengas el control exacto de lo que está pasando."
    },
    {
      q: "¿Cómo vinculo un robot existente a mi cuenta?",
      a: "Es muy simple. Solo necesitas ingresar una contraseña única de la unidad, que normalmente posee la persona que creó o configuró el robot inicialmente. Una vez que ingresas esa clave, el sistema valida la información y vincula el robot directamente a tu perfil personal."
    },
    {
      q: "¿Puedo ver un registro de las órdenes que ya hizo mi robot?",
      a: "¡Absolutamente! La plataforma te permite visualizar un historial completo de todas las órdenes que le has enviado a tus unidades. Desde ahí puedes revisar qué tareas se mandaron, consultar el estado actual de cada robot, e incluso eliminar órdenes del registro si prefieres mantener todo más limpio."
    },
    {
      q: "¿Pueden otros miembros de mi familia controlar los mismos robots?",
      a: "¡Claro que sí! B.O.B.D.S. está pensado para el hogar compartido. Cualquier miembro de tu familia puede crearse su propia cuenta y vincular los mismos asistentes robóticos de la casa simplemente ingresando la contraseña única del dispositivo. Así, todos pueden delegar tareas y revisar el estado desde sus propios teléfonos o paneles."
    },
    {
      q: "¿Qué pasa si le envío una tarea a un robot que está apagado o sin batería?",
      a: "No tienes de qué preocuparte, el sistema no colapsará. B.O.B.D.S. cuenta con una validación inteligente invisible. Antes de despachar cualquier comando, el sistema verifica en milisegundos si tu robot está encendido y conectado a la red. Si el equipo está apagado o inaccesible, la plataforma simplemente cancelará el envío y te avisará para que no haya errores ni tareas perdidas."
    }
  ];

  return (
    <section className="py-16 md:py-32 px-6 md:px-margin-desktop relative z-10" id="faq">
      <div className="max-w-container-max mx-auto relative z-10">
        <div className="text-center md:text-left mb-16 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tighter mb-2">
              <span className="text-pop-yellow">PREGUNTAS</span> FRECUENTES
            </h2>
            <p className="font-mono text-xs text-white/40 tracking-[0.3em] uppercase">
              // Respuestas a sus Preguntas Más Frecuentes
            </p>
          </div>
          <div className="hidden md:flex flex-col gap-2 opacity-50">
             <div className="w-16 h-px bg-white/40"></div>
             <div className="w-8 h-px bg-pop-yellow"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Panel Izquierdo: Lista de Preguntas */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            {faqs.map((faq, index) => {
              const isActive = activeFaq === index;
              return (
                <button
                  key={index}
                  onClick={() => setActiveFaq(index)}
                  className={`w-full text-left p-6 transition-all duration-500 border-l-2 flex items-center gap-6 group ${
                    isActive 
                      ? 'border-pop-yellow bg-white/5 backdrop-blur-md shadow-[10px_0_30px_-10px_rgba(255,225,0,0.15)]' 
                      : 'border-white/10 hover:border-white/30 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className={`font-display text-2xl transition-colors duration-500 ${isActive ? 'text-pop-yellow' : 'text-white/20 group-hover:text-white/40'}`}>
                    0{index + 1}
                  </div>
                  <div className={`font-headline-md text-sm md:text-base uppercase tracking-wider transition-colors duration-500 leading-snug ${isActive ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>
                    {faq.q}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Panel Derecho: Respuestas Glassmorphism (Hojas Apiladas) */}
          <div className="lg:col-span-7 relative">
            <div className="glass-card h-[500px] lg:h-full min-h-[500px] w-full relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl">
              
              {/* Número Gigante de Fondo (Fijo y con transición fluida) */}
              <div className="absolute -right-4 -bottom-12 font-display text-[250px] leading-none text-white/[0.03] pointer-events-none select-none transition-all duration-700 ease-out">
                0{activeFaq + 1}
              </div>

              {/* Hojas Apiladas (Contenido Absoluto) */}
              {faqs.map((faq, index) => {
                const isActive = activeFaq === index;
                return (
                  <div 
                    key={index} 
                    className={`absolute inset-0 px-8 md:px-12 pt-8 md:pt-12 pb-24 md:pb-32 flex flex-col justify-center items-start text-left transition-all duration-700 ease-in-out ${
                      isActive ? 'opacity-100 translate-y-0 pointer-events-auto delay-150' : 'opacity-0 translate-y-8 pointer-events-none'
                    }`}
                  >
                    <div className="w-12 h-1 bg-pop-yellow mb-8 shadow-[0_0_10px_rgba(255,225,0,0.5)] flex-shrink-0"></div>
                    
                    <h3 className="font-display text-2xl md:text-3xl text-white uppercase tracking-widest mb-6 leading-tight text-left">
                      {faq.q}
                    </h3>
                    
                    <p className="font-body-lg text-white/70 leading-relaxed text-base md:text-lg overflow-y-auto pr-2 custom-scrollbar text-left">
                      {faq.a}
                    </p>
                  </div>
                );
              })}

              {/* Detalles Tecnológicos (Fijos en la base) */}
              <div className="absolute bottom-0 left-0 w-full px-8 md:px-12 pb-8 md:pb-12 pointer-events-none">
                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                  <div className="font-mono text-[10px] text-pop-yellow/80 tracking-[0.2em] uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pop-yellow shadow-[0_0_5px_#FFE100] animate-pulse"></span>
                    DATA_RETRIEVED
                  </div>
                  <div className="font-mono text-[10px] text-white/30 tracking-[0.2em] transition-all duration-300">
                    SEC_0{activeFaq + 1}
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
