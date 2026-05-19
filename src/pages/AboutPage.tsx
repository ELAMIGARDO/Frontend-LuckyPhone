import { motion } from "framer-motion";

export const AboutPage = () => {
  // 🛠️ CORREGIDO: "as const" evita que TypeScript rechace el string "easeOut"
  const textFadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  } as const;

  return (
    <motion.div
      className="space-y-12 max-w-5xl mx-auto px-4 md:px-0 select-none"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
      }}
    >
      {/* Título */}
      <div className="text-center">
        <span className="text-[10px] uppercase font-bold tracking-widest bg-purple-50 text-purple-600 px-3 py-1 rounded-full">
          Nuestra Historia
        </span>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mt-2">
          Nuestra Empresa
        </h1>
        <p className="text-slate-500 mt-4 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
          Conoce más sobre LuckyPhone, una tienda creada para los amantes de la
          tecnología y los dispositivos Apple.
        </p>
      </div>

      {/* Imagen */}

      <div className="w-full block overflow-hidden rounded-3xl shadow-xl shadow-slate-100/50 border border-slate-100">
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full h-full"
        >
          <img
            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2070&auto=format&fit=crop"
            alt="Tienda LuckyPhone"
            loading="lazy"
            className="h-75 sm:h-100 md:h-120 w-full object-cover hover:scale-103 transition-transform duration-700 ease-out"
          />
        </motion.div>
      </div>

      {/* Párrafos */}
      <div className="grid gap-4 leading-relaxed text-slate-600 text-sm md:text-base font-medium max-w-4xl mx-auto">
        <motion.p
          variants={textFadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          LuckyPhone es una tienda especializada en la venta de celulares iPhone
          y accesorios tecnológicos de alta calidad. Fundada en el año 2024,
          nace con el objetivo de ofrecer a sus clientes equipos originales,
          atención personalizada y las últimas novedades de Apple a precios
          competitivos.
        </motion.p>

        <motion.p
          variants={textFadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          Nuestra tienda se enfoca en brindar una experiencia de compra moderna,
          segura y confiable, ofreciendo diferentes modelos de iPhone,
          accesorios y asesoría personalizada para ayudar a cada cliente a
          encontrar el dispositivo ideal según sus necesidades.
        </motion.p>

        <motion.p
          variants={textFadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          En LuckyPhone podrás encontrar los mejores modelos de iPhone,
          accesorios tecnológicos y las últimas novedades de Apple. Trabajamos
          constantemente para ofrecer productos de calidad y una atención rápida
          y eficiente.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-center mt-6 bg-slate-950 border border-slate-900 shadow-2xl shadow-purple-950/10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

          <h2 className="text-2xl md:text-3xl font-black mb-4 text-white tracking-tight relative z-10">
            No esperes más y compra tu celular en LuckyPhone
          </h2>

          <p className="text-slate-400 mb-6 text-xs md:text-sm max-w-xl mx-auto font-medium relative z-10">
            Contáctanos para recibir más información sobre nuestros productos
            and promociones disponibles.
          </p>

          {/* 🛠️ CORREGIDO: Estructura del botón de WhatsApp restaurada dentro del bloque */}
          <a
            href="https://wa.me/51912341232"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 bg-linear-to-r from-purple-600 to-blue-600 text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-600/25 relative z-10 text-sm tracking-wide"
          >
            Contactar por WhatsApp
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
};
