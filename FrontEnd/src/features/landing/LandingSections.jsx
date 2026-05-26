import React from 'react';
import FragmentedReveal from './FragmentedReveal';
import Funcionalidades3D from './Funcionalidades3D';
import FAQSection from './FAQSection';
import Footer from '../../components/layout/Footer';
import imgProposito from '../../assets/IMG/bobds_proposito.png';
import imgAlcance from '../../assets/IMG/bobds_alcance.png';

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
      <Footer />
    </>
  );
};

export default LandingSections;
