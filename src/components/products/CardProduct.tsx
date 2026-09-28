import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

interface Props {
  producto: {
    id: number;
    nombre: string;
    marca: string;
    modelo: string;
    descripcion: string;
    precio: number;
    stock: number;
    almacenamiento: string;
    ram: string;
    color: string;
    estado: string;
    bateria: string;
    imagenUrl: string;
    whatsappLink: string;
  };
}

export const CardProduct = ({ producto }: Props) => {
  // CORREGIDO: Evitamos usar la variable 'variants'. 
  // Si por alguna razón 'producto' o 'producto.stock' viene vacío, se asigna 0 de forma segura.
  const stockReal = producto?.stock ?? 0;
  const isAgotado = stockReal === 0;

  return (
    <div className="flex flex-col relative gap-6">
      {/* Redirección al detalle usando el ID numérico o string del producto */}
      <Link to={`/celulares/${producto?.id}`} className="flex relative group overflow-hidden bg-gray-50 rounded-2xl">
        <div className="flex h-87.5 w-full items-center justify-center py-4 lg:h-62.5">
          <img
            src={producto?.imagenUrl || "https://placeholder.com"}
            alt={producto?.nombre || "Celular"}
            className="object-contain h-full w-full p-2"
          />
        </div>
        
        {/* Botón de añadir, deshabilitado si no hay stock */}
        <button 
          disabled={isAgotado}
          className={`absolute w-full bottom-0 py-3 rounded-3xl flex items-center justify-center gap-1 text-sm font-medium border transition-all duration-300 translate-y-full group-hover:translate-y-0
            ${isAgotado 
              ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed' 
              : 'bg-white border-slate-300 hover:bg-stone-100 text-black'
            }`}
        >
          <FiPlus />
          Añadir
        </button>
      </Link>

      <div className="flex flex-col gap-1 items-center">
        {/* Marca y Nombre */}
        <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
          {producto?.marca || "Celular"}
        </span>
        <p className="text-[15px] font-medium text-center line-clamp-1">
          {producto?.nombre || "Cargando nombre..."}
        </p>
        
        {/* Especificaciones técnicas rápidas */}
        <p className="text-xs text-gray-500">
          {producto?.almacenamiento || "128GB"} / {producto?.ram || "8GB"} RAM
        </p>
        
        {/* Precio Formateado en Soles */}
        <p className="text-[16px] font-bold text-blue-600 mt-1">
          S/ {(producto?.precio || 0).toFixed(2)}
        </p>

        {/* Color del equipo */}
        <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md mt-1 font-medium">
          Color: {producto?.color || "Estándar"}
        </span>
      </div>

      {/* Etiqueta de Agotado en la esquina superior */}
      {isAgotado && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md font-bold shadow-sm">
          Agotado
        </div>
      )}
    </div>
  );
};