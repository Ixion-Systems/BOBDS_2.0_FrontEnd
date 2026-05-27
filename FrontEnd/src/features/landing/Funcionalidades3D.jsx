import React, { useState } from 'react';

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
      desc: 'Monitorea la actividad de tu hogar sin levantarte del sofá. Revisa al instante el estado de la unidad, los usuarios vinculados y su actividad en tiempo real.'
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

export default Funcionalidades3D;
