import { motion, type Variants } from "framer-motion";
import { MdLocalShipping, MdShield, MdAutorenew, MdHeadsetMic } from "react-icons/md";

export const FeatureGrid = () => {
  const features = [
    {
      id: 1,
      icon: <MdLocalShipping size={40} className="text-blue-600" />,
      title: "Envío Gratis",
      description: "En productos seleccionados",
    },
    {
      id: 2,
      icon: <MdShield size={40} className="text-blue-600" />,
      title: "Garantía",
      description: "Brindamos cobertura hasta por 6 meses",
    },
    {
      id: 3,
      icon: <MdAutorenew size={40} className="text-blue-600" />,
      title: "Trade in",
      description: "Tu nuevo iPhone por menos",
    },
    {
      id: 4,
      icon: <MdHeadsetMic size={40} className="text-blue-600" />,
      title: "Soporte 24/7",
      description: "Atención personalizada ante dudas",
    },
  ];

  // Contenedor padre con sintaxis limpia y sin caracteres extraños
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15 
      } 
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    }
  };

  return (
    <div className="w-full overflow-hidden px-5 lg:px-12 mt-6 mb-16">
      <motion.div 
        variants={containerVariants}
        initial="hidden"       
        whileInView="visible"  
        viewport={{ once: true, amount: 0.2 }}
        drag="x"               
        dragConstraints={{ left: -500, right: 0 }} 
        dragElastic={0.2}      
        className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 cursor-grab active:cursor-grabbing md:cursor-default w-full"
      >
        {features.map((feature) => (
          <motion.div 
            key={feature.id} 
            variants={cardVariants}
            whileHover={{ y: -5, scale: 1.02 }} 
            className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl bg-gray-50/50 hover:shadow-md transition-shadow duration-300 min-w-70 w-full md:min-w-0 select-none"
          >
            <div className="shrink-0 p-2 bg-blue-50 rounded-lg pointer-events-none">
              {feature.icon}
            </div>
            
            <div className="space-y-1 pointer-events-none">
              <p className="font-semibold text-slate-800">{feature.title}</p>
              <p className="text-sm text-slate-500 leading-tight">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};