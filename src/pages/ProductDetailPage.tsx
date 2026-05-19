import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import { useCart } from "../context/CartContext"; // Ajusta la ruta a tu context

interface ProductoDTO {
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
  whatsappLink: string; // Tu Spring Boot ya calcula este link individual
}

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [producto, setProducto] = useState<ProductoDTO | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Llamada a tu endpoint individual de Spring Boot: @GetMapping("/{id}")
    axios.get(`http://localhost:8080/api/productos/${id}`)
      .then((response) => {
        setProducto(response.data);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al traer el detalle desde Spring Boot:", error);
        setCargando(false);
      });
  }, [id]);

  if (cargando) {
    return <div className="text-center py-32 font-medium text-gray-500">Cargando la ficha de LuckyPhone...</div>;
  }

  if (!producto) {
    return (
      <div className="text-center py-32 max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Equipo no encontrado</h2>
        <p className="text-gray-600 mb-6">El celular que buscas no existe o fue retirado del catálogo.</p>
        <Link to="/celulares" className="bg-purple-600 text-white px-6 py-2 rounded-xl">Volver al catálogo</Link>
      </div>
    );
  }

  const isAgotado = producto.stock === 0;

  // Función para abrir el WhatsApp individual calculado por tu backend
  const handleConsultarWhatsApp = () => {
    if (producto.whatsappLink) {
      window.open(producto.whatsappLink, "_blank");
    } else {
      alert("Enlace de WhatsApp no disponible para este producto.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      {/* Botón de regreso */}
      <Link to="/celulares" className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 mb-8 transition-colors">
        <FiArrowLeft /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
        
        {/* COLUMNA IZQUIERDA: Imagen del Teléfono */}
        <div className="w-full h-96 lg:h-120 flex items-center justify-center bg-gray-50 rounded-2xl p-6 overflow-hidden relative group">
          <img 
            src={producto.imagenUrl || "https://placeholder.com"} 
            alt={producto.nombre} 
            className="h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
          />
          {isAgotado && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              Agotado
            </span>
          )}
        </div>

        {/* COLUMNA DERECHA: Ficha Técnica Extensa */}
        <div className="flex flex-col h-full">
          <span className="text-xs font-bold uppercase text-purple-600 tracking-widest mb-1">{producto.marca}</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{producto.nombre}</h1>
          
          <div className="text-2xl font-black text-blue-600 mb-6">
            S/ {producto.precio.toFixed(2)}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6 border-b border-gray-100 pb-6">
            {producto.descripcion || "Sin descripción disponible para este modelo."}
          </p>

          {/* Grilla de especificaciones técnicas que jala tu DTO */}
          <div className="grid grid-cols-2 gap-4 mb-8 bg-purple-50/50 p-5 rounded-2xl border border-purple-100/50 text-sm">
            <div>
              <span className="text-gray-500 block text-xs">Capacidad:</span>
              <strong className="text-gray-800">{producto.almacenamiento}</strong>
            </div>
            <div>
              <span className="text-gray-500 block text-xs">Memoria RAM:</span>
              <strong className="text-gray-800">{producto.ram}</strong>
            </div>
            <div>
              <span className="text-gray-500 block text-xs">Condición:</span>
              <strong className="text-gray-800">{producto.estado}</strong>
            </div>
            <div>
              <span className="text-gray-500 block text-xs">Salud de Batería:</span>
              <strong className="text-gray-800">{producto.bateria}</strong>
            </div>
            <div>
              <span className="text-gray-500 block text-xs">Color del Equipo:</span>
              <strong className="text-gray-800">{producto.color}</strong>
            </div>
            <div>
              <span className="text-gray-500 block text-xs">Disponibles:</span>
              <strong className={`font-bold ${isAgotado ? 'text-red-500' : 'text-green-600'}`}>
                {isAgotado ? 'Sin stock' : `${producto.stock} unidades`}
              </strong>
            </div>
          </div>

          {/* ACCIONES DE COMPRA */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            {/* Botón de añadir al carrito */}
            <button
              disabled={isAgotado}
              onClick={() => addToCart(producto)}
              className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-98 border
                ${isAgotado 
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                  : 'bg-white border-purple-600 text-purple-600 hover:bg-purple-50'
                }`}
            >
              <FiShoppingBag /> Añadir a la Bolsa
            </button>
 
          </div>

        </div>

      </div>
    </div>
  );
};
