import React from 'react';

const Footer = () => {
  return (
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
  );
};

export default Footer;
