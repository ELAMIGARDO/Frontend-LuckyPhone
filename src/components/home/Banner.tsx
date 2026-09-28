import { Link } from "react-router-dom";
import SplitText from "../ui/SplitText";
import ColorBends from '../ui/ColorBends';

export const Banner = () => {
  return (
    <div className="relative bg-black text-white overflow-hidden select-none min-h-[70vh] flex items-center justify-center">
      
      {/* Fondo ColorBends con la paleta oficial de LuckyPhone */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
        <ColorBends
          colors={["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#000000"]}
          rotation={90}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          noise={0.12}
          parallax={0.5}
          iterations={1}
          intensity={1.5}
          bandWidth={6}
          transparent
          autoRotate={0}
        />
      </div>

      {/* Overlay oscuro para legibilidad */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.3), rgba(0,0,0,0.7))" }}
      />

      {/* Contenido */}
      <div className="relative z-20 flex flex-col items-center justify-center py-24 px-6 text-center lg:py-44 lg:px-8 max-w-5xl mx-auto">

        {/* Badge */}
        <span className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-purple-300 uppercase tracking-widest opacity-90"
          style={{ background: "rgba(139, 92, 246, 0.15)", border: "1px solid rgba(168, 85, 247, 0.3)" }}
        >
          ✨ Nueva Colección 2026
        </span>

        {/* Título */}
        <div className="mb-6 tracking-tight"
          style={{ textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}
        >
          <SplitText
            text="Bienvenido a Nuestra Tienda"
            className="text-5xl font-extrabold lg:text-7xl text-white block leading-none"
            delay={30}
            duration={0.8}
            ease="back.out(1.5)"
            splitType="words"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0}
            rootMargin="0px"
          />
        </div>

        {/* Subtítulo */}
        <div className="mb-10 max-w-3xl"
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
        >
          <SplitText
            text="Descubre nuestra amplia selección de productos de la más alta calidad con envíos rápidos a todo el país."
            className="text-xl lg:text-3xl text-gray-200 font-light tracking-wide leading-relaxed block"
            delay={15}
            duration={0.8}
            ease="power3.out"
            splitType="words"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0}
            rootMargin="0px"
          />
        </div>

        {/* Botón */}
        <Link
          to="/celulares"
          className="group relative inline-flex items-center justify-center text-white font-bold py-4 px-10 rounded-xl overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 z-20"
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #a855f7 100%)",
            boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)",
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 45px rgba(168, 85, 247, 0.8)"}
          onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 30px rgba(139, 92, 246, 0.5)"}
        >
          <span className="relative z-10 flex items-center gap-2 text-lg tracking-wide">
            Ver Productos
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1.5 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
          	>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </Link>

      </div>
    </div>
  );
};