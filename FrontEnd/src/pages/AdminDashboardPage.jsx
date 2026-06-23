import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const AdminDashboardPage = () => {
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);
  const mainRef = useRef(null);

  useGSAP(() => {
    if (mainRef.current) {
      gsap.fromTo(mainRef.current.children, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, []);

  useEffect(() => {
    // Scroll al final cuando haya un nuevo log
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  useEffect(() => {
    // Abrir conexión SSE
    const eventSource = new EventSource('/api/stream', { withCredentials: true });

    eventSource.addEventListener('admin_log', (event) => {
      setLogs((prev) => [...prev, event.data]);
    });

    eventSource.onerror = (error) => {
      console.error('Error SSE (Consola Admin):', error);
      // No cerramos para intentar reconectar automáticamente
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div ref={mainRef} className="w-full h-[calc(100vh-2rem)] max-w-6xl mx-auto px-4 py-8 flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">Consola de Control</h1>
        <p className="text-outline mt-2 font-body text-lg">Monitoreo en tiempo real de los eventos del sistema.</p>
      </div>

      <div className="flex-1 bg-[#0a0a0a] rounded-2xl border border-outline/20 p-4 font-mono text-sm overflow-hidden flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.8)] relative">
        <div className="flex items-center gap-2 pb-4 mb-2 border-b border-outline/10 text-outline">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-2">bobds-admin-terminal ~</span>
          <span className="ml-auto text-green-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Escuchando eventos SSE...
          </span>
        </div>

        <div className="flex-1 overflow-y-auto break-words flex flex-col gap-1 pr-2 pb-8">
          {logs.length === 0 ? (
            <div className="text-outline/50 italic mt-4">Esperando nuevos registros...</div>
          ) : (
            logs.map((log, idx) => {
              // El log viene en formato: fechaHora > email > descripcion
              const parts = log.split(' > ');
              if (parts.length === 3) {
                return (
                  <div key={idx} className="hover:bg-white/5 px-2 py-1 rounded transition-colors group flex gap-2">
                    <span className="text-blue-400 flex-shrink-0">[{parts[0]}]</span>
                    <span className="text-[#FFD700] flex-shrink-0">{parts[1]}</span>
                    <span className="text-green-500 font-bold flex-shrink-0">{'>'}</span>
                    <span className="text-white group-hover:text-green-300 transition-colors">{parts[2]}</span>
                  </div>
                );
              }
              // Fallback
              return (
                <div key={idx} className="hover:bg-white/5 px-2 py-1 rounded transition-colors">
                  <span className="text-green-500 font-bold mr-2">{'>'}</span>
                  <span className="text-white">{log}</span>
                </div>
              );
            })
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
