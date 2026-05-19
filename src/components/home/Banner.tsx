import { Link } from "react-router-dom";
import LiquidEther from "../ui/LiquidEther"; 
import SplitText from "../ui/SplitText"; 

export const Banner = () => {
  return (
    <div className="relative bg-black text-white overflow-hidden select-none">
      
      {/* Fondo Líquido */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <LiquidEther
          colors={[ '#155dfc', '#fbbf24', '#000000' ]}
          mouseForce={20}
          cursorSize={100}
          isViscous
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      {/* 1. INCREMENTADO EL OVERLAY: Mayor contraste contra el fondo fluido */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-5"></div>

      {/* Contenido del banner */}
      <div className="relative z-10 flex flex-col items-center justify-center py-20 px-4 text-center lg:py-40 lg:px-8 max-w-4xl mx-auto">
        
        {/* 2. TÍTULO: Animación por palabras (words) en lugar de letras para evitar parpadeo */}
        <div className="mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] tracking-tight">
          <SplitText
            text="Bienvenido a Nuestra Tienda"
            className="text-4xl font-bold lg:text-6xl text-white"
            delay={80}
            duration={1}
            ease="back.out(1.2)"
            splitType="words" 
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
          />
        </div>

        {/* 3. SUBTÍTULO: Animación directa o por palabras con retraso */}
        <div className="mb-8 max-w-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          <SplitText
            text="Descubre nuestra amplia selección de productos de la más alta calidad."
            className="text-lg lg:text-2xl text-gray-200 font-medium"
            delay={40}
            duration={0.8}
            ease="power2.out"
            splitType="words"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
          />
        </div>

        <Link
          to="/celulares"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-xl
        transition duration-300 ease-in-out transform hover:scale-105 z-20 relative"
        >
          Ver Productos
        </Link>
      </div>
    </div>
  );
};