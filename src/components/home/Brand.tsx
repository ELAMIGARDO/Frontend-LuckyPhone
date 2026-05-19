import { motion } from "framer-motion";

const brand = [
    {
        image: './img/brand/Apple-Logo.webp',
        alt: 'Apple'
    },
    {
        image: './img/brand/Samsung_Logo.webp',
        alt: 'Samsung'
    },
];

export const Brand = () => {
  return (
    <div className="flex flex-col items-center gap-3 pt-16 pb-12 px-5 overflow-hidden">
      <h2 className="font-bold text-2xl text-slate-800">
          Marcas que disponemos
      </h2>
      <p className="w-full md:w-2/3 text-center text-sm md:text-base text-slate-500">
        Descubre las mejores marcas en tecnología y electrónica y últimos modelos del mercado.
      </p>
      
      {/* Contenedor del carrusel (Fija el límite visual de arrastre) */}
      <div className="w-full max-w-md mt-8 overflow-hidden cursor-grab active:cursor-grabbing">
          <motion.div 
            className="flex gap-6 justify-center"
            drag={"x"} // Permite arrastrar solo de izquierda a derecha
            dragConstraints={{ left: -50, right: 50 }} // Evita que se desplacen fuera de la pantalla
            whileTap={{ scale: 0.98 }} // Efecto visual al presionar
          >
              {brand.map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="p-4 bg-gray-50 rounded-xl border border-slate-100 flex items-center justify-center h-24 w-1/2 min-w-35 hover:shadow-sm transition-shadow duration-300 select-none"
                    initial={{ opacity: 0, y: 20 }} // Animación de entrada al cargar la página
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                      <img 
                        src={item.image} 
                        alt={item.alt}   
                        className="max-h-12 object-contain pointer-events-none" // Evita que el navegador intente arrastrar la imagen suelta
                      />
                  </motion.div>
              ))}
          </motion.div>
      </div>
    </div>
  );
};