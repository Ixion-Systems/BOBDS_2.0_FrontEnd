import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import imgProposito from '../../assets/IMG/bobds_proposito.png';
import imgAlcance from '../../assets/IMG/bobds_alcance.png';

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

const Funcionalidades3D = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const mobileFeatures = [
    {
      icon: 'settings_remote',
      title: 'Gestión de Unidades',
      desc: 'Alta, vinculación y monitoreo de activos con telemetría de baja latencia.'
    },
    {
      icon: 'terminal',
      title: 'Envío de Órdenes',
      desc: 'Despacho instantáneo de comandos vía red satelital encriptada.'
    },
    {
      icon: 'security',
      title: 'Autenticación',
      desc: 'Protocolos multifactor y acceso restringido al núcleo de control.'
    },
    {
      icon: 'history_edu',
      title: 'Auditoría',
      desc: 'Historial inmutable de todas las acciones ejecutadas por la flota.'
    }
  ];

  const desktopFeatures = [
    {
      icon: 'vpn_key',
      title: 'Autenticación Segura',
      desc: 'Ingresa a tu centro de mando mediante un sistema de credenciales encriptadas. Garantizamos que la privacidad de tu hogar inteligente y el control de tus dispositivos estén siempre en tus manos.'
    },
    {
      icon: 'add_circle',
      title: 'Registro de Asistentes',
      desc: 'Da de alta nuevos robots en tu hogar en cuestión de segundos. El sistema genera automáticamente contraseñas únicas para cada unidad, asegurando una integración rápida y blindada.'
    },
    {
      icon: 'family_restroom',
      title: 'Vinculación Familiar',
      desc: 'Conéctate a unidades ya existentes usando una clave de acceso única. Ideal para que distintos miembros de la familia puedan interactuar y delegar tareas al mismo robot sin complicaciones.'
    },
    {
      icon: 'view_list',
      title: 'Gestión de Dispositivos',
      desc: 'Visualiza la lista completa de tus unidades activas. Edita sus nombres, ajusta sus configuraciones o desvincúlalos definitivamente del sistema cuando ya no los necesites.'
    },
    {
      icon: 'send',
      title: 'Despacho de Órdenes',
      desc: 'Envía comandos inmediatos a cualquier unidad de tu casa. Nuestro motor interno prioriza la velocidad para que tus rutinas de limpieza o mantenimiento comiencen exactamente cuando lo decidas.'
    },
    {
      icon: 'check_circle',
      title: 'Validación Inteligente',
      desc: 'Antes de despachar una orden, el sistema verifica silenciosamente en segundo plano que el robot exista, esté encendido y listo para actuar, evitando fallos de comunicación en tu red.'
    },
    {
      icon: 'satellite_alt',
      title: 'Telemetría en Vivo',
      desc: 'Monitorea la actividad de tu hogar sin levantarte del sofá. Revisa al instante el nivel de batería, la ubicación exacta en tu mapa y la tarea actual que está ejecutando cada asistente.'
    },
    {
      icon: 'manage_search',
      title: 'Historial de Operaciones',
      desc: 'Mantén un registro transparente de todo lo que sucede. Consulta la lista completa de comandos y órdenes enviadas para auditar qué se hizo, cuándo y qué robot lo ejecutó.'
    },
    {
      icon: 'delete_sweep',
      title: 'Limpieza de Auditoría',
      desc: 'Toma el control de tus registros. El sistema te permite eliminar del historial las órdenes antiguas o canceladas, manteniendo tu entorno visual ordenado y libre de ruido.'
    }
  ];

  return (
    <>
      {/* Vista Móvil (Grid Clásico) */}
      <div className="grid grid-cols-1 md:hidden gap-gutter">
        {mobileFeatures.map((feat, i) => (
          <div key={i} className="glass-card p-8 group relative overflow-hidden">
            <div className="w-12 h-12 flex items-center justify-center bg-pop-yellow/10 text-pop-yellow mb-8 group-hover:bg-pop-yellow group-hover:text-black transition-all relative z-10">
              <span className="material-symbols-outlined">{feat.icon}</span>
            </div>
            <h3 className="font-headline-md text-white mb-4 relative z-10">{feat.title}</h3>
            <p className="font-body-md text-white/60 text-sm relative z-10">{feat.desc}</p>
          </div>
        ))}
      </div>

      {/* Vista Escritorio (Librero 3D de 9 Módulos) */}
      <div 
        className="hidden md:flex flex-row w-full h-[450px] gap-1 lg:gap-2" 
        style={{ perspective: '2000px' }}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {desktopFeatures.map((feat, i) => {
          let flexValue = 1;
          let transformStyle = "rotateY(0deg) scale(1) translateZ(0px)";
          let opacityStyle = 1;
          let zIndex = 1;
          let overlayOpacity = 0;

          if (hoveredIndex !== null) {
            const distance = i - hoveredIndex;
            const absDist = Math.abs(distance);
            
            if (distance === 0) {
              flexValue = 5; 
              transformStyle = "rotateY(0deg) scale(1) translateZ(10px)";
              opacityStyle = 1;
              zIndex = 20;
              overlayOpacity = 0;
            } else if (distance < 0) { 
              flexValue = 0.85; // Ancho constante para asegurar legibilidad
              transformStyle = `rotateY(${35 + absDist * 3}deg) scale(${1 - absDist * 0.03}) translateZ(-${absDist * 5}px)`;
              opacityStyle = 1;
              zIndex = 10 - absDist;
              overlayOpacity = Math.min(0.3, 0.05 + absDist * 0.05);
            } else if (distance > 0) { 
              flexValue = 0.85; // Ancho constante para asegurar legibilidad
              transformStyle = `rotateY(-${35 + absDist * 3}deg) scale(${1 - absDist * 0.03}) translateZ(-${absDist * 5}px)`;
              opacityStyle = 1;
              zIndex = 10 - absDist;
              overlayOpacity = Math.min(0.3, 0.05 + absDist * 0.05);
            }
          }

          const isHovered = hoveredIndex === i;
          const isNeutral = hoveredIndex === null;
          const isSpine = !isHovered; // Si no está hovered (ya sea neutral o vecino), es un lomo.

          return (
            <div 
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              className={`glass-card transition-all duration-[600ms] ease-out cursor-pointer overflow-hidden relative border ${isHovered ? 'border-pop-yellow shadow-[0_0_20px_rgba(255,225,0,0.3)]' : 'border-white/5 shadow-none'}`}
              style={{ 
                flex: flexValue,
                transform: transformStyle,
                opacity: opacityStyle,
                zIndex: zIndex,
                transformStyle: 'preserve-3d',
                minWidth: isSpine ? '50px' : '280px'
              }}
            >
              {/* LOMO DEL LIBRO (Visible solo cuando es inactivo) */}
              <div 
                className={`absolute inset-0 pt-8 pb-6 px-2 flex flex-col items-center justify-start transition-opacity duration-300 ${isSpine ? 'opacity-100 pointer-events-auto delay-200' : 'opacity-0 pointer-events-none'}`}
              >
                <div className="w-12 h-12 bg-transparent text-pop-yellow flex-shrink-0 flex items-center justify-center mb-10">
                  <span className="material-symbols-outlined text-[32px]">{feat.icon}</span>
                </div>
                <h3 
                  className="font-display uppercase tracking-widest text-white/80 text-xs font-black whitespace-nowrap"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  {feat.title}
                </h3>
              </div>

              {/* CONTENIDO ACTIVO (Visible solo cuando está hover) */}
              <div 
                className={`absolute inset-0 p-8 flex flex-col items-start justify-center text-left transition-opacity duration-300 ${isHovered ? 'opacity-100 pointer-events-auto delay-300' : 'opacity-0 pointer-events-none'}`}
              >
                <div className="w-14 h-14 bg-pop-yellow text-black shadow-[0_0_15px_rgba(255,225,0,0.4)] mb-6 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[28px]">{feat.icon}</span>
                </div>
                
                <h3 className="font-display uppercase tracking-widest text-pop-yellow text-xl xl:text-2xl mb-4 text-left whitespace-normal">
                  {feat.title}
                </h3>
                
                <p className="font-body-md text-white/90 text-sm xl:text-[15px] leading-relaxed text-left">
                  {feat.desc}
                </p>

                {/* Tech Animation para complementar el espacio */}
                <div className="w-full mt-auto pt-8">
                  <div className="flex items-end gap-1 h-6 opacity-50">
                    <div className="w-1 bg-pop-yellow animate-pulse" style={{ height: '40%', animationDelay: '0ms' }}></div>
                    <div className="w-1 bg-pop-yellow animate-pulse" style={{ height: '100%', animationDelay: '200ms' }}></div>
                    <div className="w-1 bg-pop-yellow animate-pulse" style={{ height: '70%', animationDelay: '400ms' }}></div>
                    <div className="w-1 bg-pop-yellow animate-pulse" style={{ height: '30%', animationDelay: '100ms' }}></div>
                    <div className="w-1 bg-pop-yellow animate-pulse" style={{ height: '80%', animationDelay: '500ms' }}></div>
                    <div className="w-1 bg-pop-yellow animate-pulse" style={{ height: '50%', animationDelay: '300ms' }}></div>
                    <div className="w-1 bg-pop-yellow animate-pulse" style={{ height: '90%', animationDelay: '600ms' }}></div>
                  </div>
                  <div className="w-full h-px bg-pop-yellow/30 mt-2"></div>
                  <div className="flex justify-between mt-2 font-mono text-[8px] text-pop-yellow/40 tracking-[0.2em] uppercase">
                    <span>SYS_ACTIVE</span>
                    <span>{`MOD_0${i+1}`}</span>
                  </div>
                </div>
              </div>

              {/* Sombra de profundidad en no seleccionados */}
              <div 
                className="absolute inset-0 bg-black transition-opacity duration-500 pointer-events-none z-30"
                style={{ opacity: hoveredIndex === null ? 0 : overlayOpacity }}
              ></div>
            </div>
          );
        })}
      </div>
    </>
  );
};

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
      q: "¿Qué pasa si le envío una tarea a un robot que está apagado?",
      a: "No tienes de qué preocuparte, el sistema no colapsará. B.O.B.D.S. cuenta con una validación inteligente invisible. Antes de despachar cualquier comando, el sistema verifica en milisegundos si tu robot está encendido y conectado a la red. Si el equipo está apagado o inaccesible, la plataforma simplemente cancelará el envío."
    }
  ];

  return (
    <section className="py-16 md:py-32 px-6 md:px-margin-desktop relative z-10" id="faq">
      <div className="max-w-container-max mx-auto relative z-10">
        <div className="text-center md:text-left mb-16 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tighter mb-2">
              <span className="text-pop-yellow">Preguntas</span> FRECUENTES
            </h2>
            <p className="font-mono text-xs text-white/40 tracking-[0.3em] uppercase">
              // Respuestas a tus preguntas mas frecuentes
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

const LandingSections = () => {
  return (
    <>
      {/* Propósito Section */}
      <section className="py-16 md:py-32 px-6 md:px-margin-desktop relative z-10" id="proposito">
        <div className="max-w-container-max mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-left">
              <h2 className="font-display text-headline-lg text-white uppercase tracking-tight">
                Propósito <span className="w-12 h-0.5 bg-pop-yellow"></span>
              </h2>
              <div className="glass-card p-10 border-r-4 border-r-pop-yellow">
                <p className="font-body-md text-lg text-white/90 leading-relaxed text-left">
                  Tu comodidad es el núcleo de nuestro ecosistema. B.O.B.D.S. nació con el propósito de simplificar al máximo la interacción con tu robótica doméstica. Al centralizar el mando y la supervisión de tus unidades en una plataforma sin fricciones, te otorgamos el poder de gestionar tu hogar inteligente en segundos. Menos tiempo configurando, más tiempo libre.
                </p>
              </div>
            </div>
            <div className="relative group aspect-square lg:aspect-video glass-card overflow-hidden flex items-center justify-center p-0">
              <FragmentedReveal 
                src={imgProposito} 
                alt="Propósito Doméstico"
                overlayClassName="bg-[#0c0c0c]/70 mix-blend-multiply" 
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-pop-yellow/10 to-transparent z-30 pointer-events-none"></div>
              <div className="absolute bottom-4 left-4 font-mono text-[10px] text-white/40 z-30 pointer-events-none tracking-widest uppercase shadow-black drop-shadow-md">A-01 HOME_COMFORT</div>
            </div>
          </div>
        </div>
      </section>

      {/* Alcance Section */}
      <section className="py-16 md:py-32 px-6 md:px-margin-desktop relative z-10 flex flex-col-reverse md:block" id="alcance">
        <div className="max-w-container-max mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative group aspect-square lg:aspect-video glass-card overflow-hidden flex items-center justify-center p-0">
              <FragmentedReveal 
                src={imgAlcance} 
                alt="Alcance Doméstico"
                overlayClassName="bg-[#0c0c0c]/80 mix-blend-multiply" 
              />
              <div className="absolute inset-0 bg-gradient-to-bl from-pop-yellow/10 to-transparent z-30 pointer-events-none"></div>
              <div className="absolute bottom-4 left-4 font-mono text-[10px] text-white/40 z-30 pointer-events-none tracking-widest uppercase shadow-black drop-shadow-md">B-02 DOMESTIC_ROBOTICS</div>
            </div>
            <div className="space-y-8 text-left md:text-right mt-12 md:mt-0">
              <h2 className="font-display text-headline-lg text-white uppercase tracking-tight">
                <span className="w-12 h-0.5 bg-pop-yellow"></span> Alcance
              </h2>
              <div className="glass-card p-10 border-l-4 border-l-pop-yellow">
                <p className="font-body-md text-base md:text-lg text-white/90 leading-relaxed text-left md:text-right">
                  B.O.B.D.S. está diseñado para gestionar los asistentes robóticos de tu día a día. Nuestro alcance abarca desde la vinculación segura de tus dispositivos en casa, hasta el envío de comandos en tiempo real y la revisión de historiales de limpieza o mantenimiento. Un centro de mando único para que tus rutinas funcionen en piloto automático.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Funciones Section */}
      <section className="py-16 md:py-32 px-6 md:px-margin-desktop relative z-10" id="funciones">
        <div className="max-w-container-max mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-display text-headline-lg text-white uppercase mb-4">Funcionalidades del Sistema</h2>
            <div className="w-20 h-1 bg-pop-yellow mx-auto"></div>
          </div>
          <Funcionalidades3D />
        </div>
      </section>

      {/* Infinite Carousel Section (Partners) */}
      <section className="py-24 border-y border-white/5 overflow-hidden relative z-10" id="relaciones">
        <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop mb-12 relative z-10">
          <h2 className="font-display text-sm tracking-[0.4em] uppercase text-white/40 text-center">Partners Tecnológicos</h2>
        </div>
        <div className="carousel-track relative z-10">
          {/* Logos repeated for seamless loop (4 sets of 3) */}
          <div className="carousel-item flex items-center justify-center px-6 md:px-16">
            <img alt="Novillion" className="h-12 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqxdK2jO_rLjGVs4et9xeg-7TzB2WftjJfznln0G-29V5PZ097hHSZvv8AkWWMDL22cwayqJH4bbFHITe50INYjuIXvFC1GL5AyRYayDUWstJCLjcBC3eRumHgKhz6G7317pYAoAe_RGFDDr0gQUWzAuqB9EAbt7jrt8lnjNymTEoilmYsStkeZ8Hqh7vm49ruDu94EHnNzKU8fi_gAQB6ZCG_VcXwkug7Agb1rweZZ1sUUsPfYgLpJxodxo6oLNvNXsZzKJ_yvlE" />
          </div>
          <div className="carousel-item flex items-center justify-center px-6 md:px-16">
            <img alt="Synthetix" className="h-12 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeoKcpB3mix0DEEkz21-dUlIhuaDu66EFk8XOirqEWu92ywgEVGiXyeJMtm0B0WeYkjjUr6pjNIcw_jP8VsjwGf10-7_aw7-LG6nUdLJrBur3C3yfDZtHt7CHJz2QETpSZ_trLZgWiIRmae6_84gM5beRx6fhQnkNDlXoYKdkLHcMHPEHTB0gVZLn6AQjcz1sBgnyM9FU4F3hoNQhtEbBlK8Jp9hnbV4sesQ0RsXyXeinH2m0Zza3k1qxkvynIH1edBgyVG2Hio7g" />
          </div>
          <div className="carousel-item flex items-center justify-center px-6 md:px-16">
            <img alt="Lumina Robotics" className="h-12 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLatzKM1gS-WjnQwiad9DBk8rfPJrm1Q8Mo0kxkP6u_pLQ4AjiMoNpb93QT-cQOAvcJjW9IMyj6UxsEMYSFlx_uhGptpuLVKx2wpj7wLXgTGch49XUeYtQouT8Ypmac46AXcPPKqE3reUZbNgwpOErxoSUgpZy76WDvJQ8m2PL9W9TuRlX-_xgTmKEt10P261c4OMAd9Ab4acQbbxHYxWrDtTEjZockw8lJcXDIfVKrYsIr3Xdwz7EAtOJVSk9fD4QHYZitzlYENs" />
          </div>
          <div className="carousel-item flex items-center justify-center px-6 md:px-16">
            <img alt="Novillion" className="h-12 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqxdK2jO_rLjGVs4et9xeg-7TzB2WftjJfznln0G-29V5PZ097hHSZvv8AkWWMDL22cwayqJH4bbFHITe50INYjuIXvFC1GL5AyRYayDUWstJCLjcBC3eRumHgKhz6G7317pYAoAe_RGFDDr0gQUWzAuqB9EAbt7jrt8lnjNymTEoilmYsStkeZ8Hqh7vm49ruDu94EHnNzKU8fi_gAQB6ZCG_VcXwkug7Agb1rweZZ1sUUsPfYgLpJxodxo6oLNvNXsZzKJ_yvlE" />
          </div>
          <div className="carousel-item flex items-center justify-center px-6 md:px-16">
            <img alt="Synthetix" className="h-12 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeoKcpB3mix0DEEkz21-dUlIhuaDu66EFk8XOirqEWu92ywgEVGiXyeJMtm0B0WeYkjjUr6pjNIcw_jP8VsjwGf10-7_aw7-LG6nUdLJrBur3C3yfDZtHt7CHJz2QETpSZ_trLZgWiIRmae6_84gM5beRx6fhQnkNDlXoYKdkLHcMHPEHTB0gVZLn6AQjcz1sBgnyM9FU4F3hoNQhtEbBlK8Jp9hnbV4sesQ0RsXyXeinH2m0Zza3k1qxkvynIH1edBgyVG2Hio7g" />
          </div>
          <div className="carousel-item flex items-center justify-center px-6 md:px-16">
            <img alt="Lumina Robotics" className="h-12 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLatzKM1gS-WjnQwiad9DBk8rfPJrm1Q8Mo0kxkP6u_pLQ4AjiMoNpb93QT-cQOAvcJjW9IMyj6UxsEMYSFlx_uhGptpuLVKx2wpj7wLXgTGch49XUeYtQouT8Ypmac46AXcPPKqE3reUZbNgwpOErxoSUgpZy76WDvJQ8m2PL9W9TuRlX-_xgTmKEt10P261c4OMAd9Ab4acQbbxHYxWrDtTEjZockw8lJcXDIfVKrYsIr3Xdwz7EAtOJVSk9fD4QHYZitzlYENs" />
          </div>
          <div className="carousel-item flex items-center justify-center px-6 md:px-16">
            <img alt="Novillion" className="h-12 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqxdK2jO_rLjGVs4et9xeg-7TzB2WftjJfznln0G-29V5PZ097hHSZvv8AkWWMDL22cwayqJH4bbFHITe50INYjuIXvFC1GL5AyRYayDUWstJCLjcBC3eRumHgKhz6G7317pYAoAe_RGFDDr0gQUWzAuqB9EAbt7jrt8lnjNymTEoilmYsStkeZ8Hqh7vm49ruDu94EHnNzKU8fi_gAQB6ZCG_VcXwkug7Agb1rweZZ1sUUsPfYgLpJxodxo6oLNvNXsZzKJ_yvlE" />
          </div>
          <div className="carousel-item flex items-center justify-center px-6 md:px-16">
            <img alt="Synthetix" className="h-12 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeoKcpB3mix0DEEkz21-dUlIhuaDu66EFk8XOirqEWu92ywgEVGiXyeJMtm0B0WeYkjjUr6pjNIcw_jP8VsjwGf10-7_aw7-LG6nUdLJrBur3C3yfDZtHt7CHJz2QETpSZ_trLZgWiIRmae6_84gM5beRx6fhQnkNDlXoYKdkLHcMHPEHTB0gVZLn6AQjcz1sBgnyM9FU4F3hoNQhtEbBlK8Jp9hnbV4sesQ0RsXyXeinH2m0Zza3k1qxkvynIH1edBgyVG2Hio7g" />
          </div>
          <div className="carousel-item flex items-center justify-center px-6 md:px-16">
            <img alt="Lumina Robotics" className="h-12 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLatzKM1gS-WjnQwiad9DBk8rfPJrm1Q8Mo0kxkP6u_pLQ4AjiMoNpb93QT-cQOAvcJjW9IMyj6UxsEMYSFlx_uhGptpuLVKx2wpj7wLXgTGch49XUeYtQouT8Ypmac46AXcPPKqE3reUZbNgwpOErxoSUgpZy76WDvJQ8m2PL9W9TuRlX-_xgTmKEt10P261c4OMAd9Ab4acQbbxHYxWrDtTEjZockw8lJcXDIfVKrYsIr3Xdwz7EAtOJVSk9fD4QHYZitzlYENs" />
          </div>
          <div className="carousel-item flex items-center justify-center px-6 md:px-16">
            <img alt="Novillion" className="h-12 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqxdK2jO_rLjGVs4et9xeg-7TzB2WftjJfznln0G-29V5PZ097hHSZvv8AkWWMDL22cwayqJH4bbFHITe50INYjuIXvFC1GL5AyRYayDUWstJCLjcBC3eRumHgKhz6G7317pYAoAe_RGFDDr0gQUWzAuqB9EAbt7jrt8lnjNymTEoilmYsStkeZ8Hqh7vm49ruDu94EHnNzKU8fi_gAQB6ZCG_VcXwkug7Agb1rweZZ1sUUsPfYgLpJxodxo6oLNvNXsZzKJ_yvlE" />
          </div>
          <div className="carousel-item flex items-center justify-center px-6 md:px-16">
            <img alt="Synthetix" className="h-12 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeoKcpB3mix0DEEkz21-dUlIhuaDu66EFk8XOirqEWu92ywgEVGiXyeJMtm0B0WeYkjjUr6pjNIcw_jP8VsjwGf10-7_aw7-LG6nUdLJrBur3C3yfDZtHt7CHJz2QETpSZ_trLZgWiIRmae6_84gM5beRx6fhQnkNDlXoYKdkLHcMHPEHTB0gVZLn6AQjcz1sBgnyM9FU4F3hoNQhtEbBlK8Jp9hnbV4sesQ0RsXyXeinH2m0Zza3k1qxkvynIH1edBgyVG2Hio7g" />
          </div>
          <div className="carousel-item flex items-center justify-center px-6 md:px-16">
            <img alt="Lumina Robotics" className="h-12 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLatzKM1gS-WjnQwiad9DBk8rfPJrm1Q8Mo0kxkP6u_pLQ4AjiMoNpb93QT-cQOAvcJjW9IMyj6UxsEMYSFlx_uhGptpuLVKx2wpj7wLXgTGch49XUeYtQouT8Ypmac46AXcPPKqE3reUZbNgwpOErxoSUgpZy76WDvJQ8m2PL9W9TuRlX-_xgTmKEt10P261c4OMAd9Ab4acQbbxHYxWrDtTEjZockw8lJcXDIfVKrYsIr3Xdwz7EAtOJVSk9fD4QHYZitzlYENs" />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />
      {/* Footer */}
      <footer className="bg-black py-16 md:py-20 px-6 md:px-margin-desktop border-t border-white/10 relative z-10">
        <div className="max-w-container-max mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <img alt="B.O.B.D.S." className="h-10 w-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ0VLlbLxMHmRtLsjeG3E-VmxX_aX-oDKWekEHNDbEp4J7Bc4iZXOYqppL9t7ucFM5fR0bnm3yNLFiNgG70HVRHrSqvqSoTclyrLuTgmydWsJYz-KXcFDdEqm1g0Z9NXWUFNXtRY5trqniryykmKNpdbtgbKtv3FDHIkELNBpaSQmqF8zalDXCSugTBDrZXXDx5SHZ5FIlkDFEc860jBfJl9Wzte4OYLsrqcLZy2AZQ4ddrpxgmj1UvPNpcfxvb8Qy1Noa0_YPhfA" />
                <span className="font-display font-bold text-white tracking-widest text-xl uppercase">B.O.B.D.S.</span>
              </div>
              <p className="text-white/40 max-w-sm text-sm uppercase tracking-wider font-mono">
                © 2024 Bob do something
              </p>
            </div>
            <div className="flex flex-wrap gap-12">
              <div className="space-y-4">
                <h4 className="text-pop-yellow font-bold text-xs uppercase tracking-[0.2em]">Legal</h4>
                <ul className="space-y-2 text-white/40 text-xs">
                  <li><a className="hover:text-white transition-colors" href="#">Privacidad</a></li>
                  <li><a className="hover:text-white transition-colors" href="#">Términos</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-pop-yellow font-bold text-xs uppercase tracking-[0.2em]">Soporte</h4>
                <ul className="space-y-2 text-white/40 text-xs">
                  <li><a className="hover:text-white transition-colors" href="#">Documentación</a></li>
                  <li><a className="hover:text-white transition-colors" href="#">Estado de Red</a></li>
                </ul>
              </div>
              <div className="flex gap-4">
                <a className="w-10 h-10 border border-white/20 flex items-center justify-center hover:border-pop-yellow hover:text-pop-yellow transition-all" href="#">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.61-4.041-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
                </a>
                <a className="w-10 h-10 border border-white/20 flex items-center justify-center hover:border-pop-yellow hover:text-pop-yellow transition-all" href="#">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 8v8l7-4-7-4z"></path></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div className="flex items-center gap-2 text-white/20 font-mono text-[10px] tracking-[0.3em] uppercase">
              System Status: <span className="text-green-500">Optimal</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            </div>
            <p className="text-white/20 font-mono text-[10px] uppercase">V2.4.0-CORE-STABLE</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingSections;
