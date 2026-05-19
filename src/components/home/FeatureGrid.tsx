import { motion, type Variants } from "framer-motion";
import { MdLocalShipping, MdShield, MdAutorenew, MdHeadsetMic } from "react-icons/md";

export const FeatureGrid = () => {
  const features = [
    {
      id: 1,
      icon: <MdLocalShipping size={36} className="text-purple-600" />,
      title: "Envío Gratis",
      description: "En productos seleccionados",
    },
    {
      id: 2,
      icon: <MdShield size={36} className="text-purple-600" />,
      title: "Garantía",
      description: "Brindamos cobertura hasta por 6 meses",
    },
    {
      id: 3,
      icon: <MdAutorenew size={36} className="text-purple-600" />,
      title: "Trade in",
      description: "Tu nuevo iPhone por menos",
    },
    {
      id: 4,
      icon: <MdHeadsetMic size={36} className="text-purple-600" />,
      title: "Soporte 24/7",
      description: "Atención personalizada ante dudas",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 14 },
    },
  };

  return (
    <div className="w-full px-5 lg:px-12 mt-6 mb-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6 w-full"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.01 }}
            className="flex items-center gap-3 p-4 border border-slate-100 rounded-2xl bg-white hover:shadow-[0_10px_30px_rgba(124,58,237,0.08)] hover:border-purple-200/60 transition-all duration-300 w-full select-none group"
          >
            <div className="shrink-0 p-2.5 bg-purple-50 rounded-xl pointer-events-none group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
              <span className="block group-hover:scale-110 group-hover:brightness-200 transition-transform duration-300">
                {feature.icon}
              </span>
            </div>

            <div className="space-y-0.5 pointer-events-none min-w-0">
              <p className="font-bold text-slate-800 text-sm lg:text-base truncate">{feature.title}</p>
              <p className="text-xs text-slate-500 leading-normal font-medium">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};