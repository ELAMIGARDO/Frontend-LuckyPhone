export const Newsletter = () => {
  return (
    <div className="relative bg-slate-900 text-white py-24 overflow-hidden select-none">
      {/* Imagen de fondo con mejor contraste */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay h-full"
        style={{ backgroundImage: "url(/img/background-newsletter.webp)" }}
      />
        
      {/* CONTENIDO NEWSLETTER */}
      <div className="container z-10 mx-auto relative px-4 flex justify-center md:justify-start lg:px-12">
        <div className="w-full text-slate-900 bg-white/95 backdrop-blur-md p-8 md:p-12 space-y-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 md:w-[55%] lg:w-[40%]">
            
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest bg-purple-100 text-purple-700 px-3 py-1 rounded-full inline-block">
                🚀 Club VIP
              </span>
              <p className="text-xl font-black tracking-tight text-slate-900 md:text-2xl">
                Recibe los mejores precios en iPhones
              </p>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                ¡No te pierdas de nada! Sé el primero en enterarte de ofertas exclusivas y lanzamientos semanales.
              </p>
            </div>

            {/* FORMULARIO CORREGIDO CON BOTÓN INTEGRADO */}
            <form 
              onSubmit={(e) => e.preventDefault()} 
              className="flex flex-col gap-3"
            >
              <input 
                type="email" 
                required
                className="border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none rounded-xl py-3.5 px-5 w-full text-xs font-semibold transition-all duration-300 placeholder:text-slate-400 bg-slate-50" 
                placeholder="Ingresa tu correo electrónico" 
              />
              
              <button 
                type="submit"
                className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl uppercase tracking-wider py-3.5 text-xs transition-all duration-300 hover:scale-[1.02] active:scale-98 shadow-md shadow-purple-600/20"
              >
                Suscribirme
              </button>
            </form>
        </div>
      </div>
    </div>
  );
};  