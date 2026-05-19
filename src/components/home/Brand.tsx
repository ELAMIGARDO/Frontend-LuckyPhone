import { motion, type Variants } from "framer-motion";

const brand = [
    {
        image: './img/brand/Apple-Logo.webp',
        alt: 'Apple',
        hoverBorder: 'hover:border-purple-400/60 hover:shadow-purple-600/5'
    },
    {
        image: './img/brand/Samsung_Logo.webp',
        alt: 'Samsung',
        hoverBorder: 'hover:border-blue-400/60 hover:shadow-blue-600/5'
    },
];

export const Brand = () => {
  /* 🛠️ SOLUCIÓN: Tipado explícito de Variants para TypeScript */
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  /* 🛠️ SOLUCIÓN: Tipado explícito de Variants para TypeScript */
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 pt-16 pb-12 px-5 overflow-hidden select-none">
      <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
        Garantía Oficial
      </span>
      <h2 className="font-black text-2xl text-slate-900 md:text-3xl tracking-tight">
        Marcas Disponibles
      </h2>
      <p className="w-full md:w-2/3 text-center text-xs md:text-sm text-slate-500 font-medium leading-relaxed">
        Descubre las marcas líderes en tecnología con soporte técnico y garantía oficial en Lucky Phone.
      </p>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="w-full max-w-lg mt-8 grid grid-cols-2 gap-4 md:gap-6"
      >
          {brand.map((item, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                whileHover={{ y: -5 }} 
                whileTap={{ scale: 0.98 }}
                className={`p-6 bg-white rounded-2xl border border-slate-100 flex items-center justify-center h-28 hover:shadow-2xl transition-all duration-300 group cursor-pointer ${item.hoverBorder}`}
              >
                  <img 
                    src={item.image} 
                    alt={item.alt}   
                    className="max-h-12 w-auto object-contain pointer-events-none filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105" 
                  />
              </motion.div>
          ))}
      </motion.div>
    </div>
  );
};