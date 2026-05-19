import { motion } from "framer-motion";

export const AboutPage = () => {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Título */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black">
          Nuestra Empresa
        </h1>

        <p className="text-slate-600 mt-3 text-base md:text-lg max-w-3xl mx-auto">
          Conoce más sobre LuckyPhone, una tienda creada para los amantes de la
          tecnología y los dispositivos Apple.
        </p>
      </div>

      {/* Imagen */}
      <motion.div
        className="overflow-hidden rounded-2xl shadow-lg"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <img
          src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2070&auto=format&fit=crop"
          alt="Tienda LuckyPhone"
          className="h-125 w-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </motion.div>

      {/* Contenido */}
      <div className="flex flex-col gap-6 leading-8 text-slate-700 text-[15px] md:text-base">
        
        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          LuckyPhone es una tienda especializada en la venta de celulares
          iPhone y accesorios tecnológicos de alta calidad. Fundada en el año
          2024, nace con el objetivo de ofrecer a sus clientes equipos
          originales, atención personalizada y las últimas novedades de Apple a
          precios competitivos.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          Nuestra tienda se enfoca en brindar una experiencia de compra moderna,
          segura y confiable, ofreciendo diferentes modelos de iPhone,
          accesorios y asesoría personalizada para ayudar a cada cliente a
          encontrar el dispositivo ideal según sus necesidades.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          En LuckyPhone podrás encontrar los mejores modelos de iPhone,
          accesorios tecnológicos y las últimas novedades de Apple. Trabajamos
          constantemente para ofrecer productos de calidad y una atención rápida
          y eficiente.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="bg-black text-white rounded-2xl p-8 text-center mt-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            No esperes más y compra tu celular en LuckyPhone
          </h2>

          <p className="text-slate-300 mb-5">
            Contáctanos para recibir más información sobre nuestros productos y
            promociones disponibles.
          </p>

          <a
            href="https://wa.me/51912341232"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-black font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-transform"
          >
            Contactar por WhatsApp
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
};