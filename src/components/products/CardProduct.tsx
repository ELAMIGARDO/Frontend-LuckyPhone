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
  const isUltimaUnidad = stockReal === 1;

  return (
    <div className={`flex flex-col relative gap-6 transition-opacity duration-300 ${isAgotado ? 'opacity-75' : ''}`}>
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
          {isAgotado ? 'Sin Stock' : 'Añadir'}
        </button>
      </Link>

      <div className="flex flex-col gap-1 items-center">
        {/* Marca y Condición Badge */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          <span className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">
            {producto?.marca || "Celular"}
          </span>
          {producto?.estado && (
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border shadow-2xs ${
              producto.estado.toLowerCase().includes('nuevo')
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : producto.estado.toLowerCase().includes('open')
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : producto.estado.toLowerCase().includes('semi') || producto.estado.toLowerCase().includes('usado')
                ? 'bg-slate-100 text-slate-700 border-slate-300'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {producto.estado}
            </span>
          )}
        </div>

        {/* Nombre / Modelo limpio sin duplicar marca */}
        <p className="text-[15px] font-bold text-slate-900 text-center line-clamp-1">
          {producto?.modelo || producto?.nombre || "Cargando..."}
        </p>
        
        {/* Especificaciones técnicas rápidas */}
        <p className="text-xs text-gray-500 font-medium">
          {producto?.almacenamiento || "128GB"} / {producto?.ram || "8GB"} RAM
        </p>
        
        {/* Precio Formateado en Soles */}
        <p className="text-[16px] font-black text-indigo-600 mt-1">
          S/ {(producto?.precio || 0).toFixed(2)}
        </p>

        {/* Alerta de Última Unidad (FOMO Stock Alert) */}
        {isUltimaUnidad && (
          <span className="text-amber-600 font-medium text-xs animate-pulse text-center">
            ⚠️ ¡Última unidad disponible en tienda!
          </span>
        )}

        {/* Color del equipo */}
        <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md mt-0.5 font-medium">
          Color: {producto?.color || "Estándar"}
        </span>
      </div>

      {/* Etiqueta de Agotado en la esquina superior */}
      {isAgotado && (
        <div className="absolute top-2 left-2 bg-rose-600 text-white text-xs px-2.5 py-1 rounded-lg font-bold shadow-sm">
          Agotado / Sin Stock
        </div>
      )}
    </div>
  );
};