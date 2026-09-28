import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart, type CartItem } from "../context/CartContext";
import { getProductoByIdService } from "../services/backendService";
import type { ProductoResponseDTO } from "../interfaces";

export const ProductDetailPages = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [producto, setProducto] = useState<ProductoResponseDTO | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Petición al endpoint /api/productos/{id} usando Axios centralizado
  useEffect(() => {
    if (!id) return;
    setCargando(true);

    getProductoByIdService(id)
      .then((data) => {
        setProducto(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al conectar con la API:", err);
        setError(err.response?.data?.message || err.message || "No se pudo encontrar el equipo solicitado");
        setCargando(false);
      });
  }, [id]);

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 font-medium">
          Cargando ficha técnica...
        </p>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="text-center py-20 max-w-md mx-auto px-6">
        <p className="text-red-500 font-medium mb-4">
          ⚠️ Error: {error || "El producto no existe."}
        </p>
        <button
          onClick={() => navigate(-1)} // Regresa a la página anterior de forma segura
          className="px-6 py-2 bg-slate-900 text-white text-sm rounded-xl font-bold"
        >
          Volver atrás
        </button>
      </div>
    );
  }

  const isAgotado = (producto.stock ?? 0) <= 0;

  // Acción 1: Sumar a la bolsa de compras de React
  const handleAñadirAlCarrito = () => {
    // Transformamos el producto inyectando el 100% de las propiedades obligatorias
    const itemParaCarrito: CartItem = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagenUrl: producto.imagenUrl,
      whatsappLink: producto.whatsappLink,
      color: producto.color || "Estándar",
      stock: producto.stock ?? 1,
      marca: producto.marca || "Genérico",
      modelo: producto.modelo || "Estándar",
      almacenamiento: producto.almacenamiento || "128GB",
      ram: producto.ram || "6GB",
      estado: producto.estado || "Nuevo",
      bateria: producto.bateria || "100%",
      quantity: 1, // Atributo específico del carrito de compras
    };

    addToCart(itemParaCarrito);
  };

  // Acción 2: Chatear por este celular en específico usando el link autogenerado
  const handleConsultarWhatsApp = () => {
    if (producto.whatsappLink) {
      window.open(producto.whatsappLink, "_blank");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center min-h-[calc(100vh-100px)]">
      {/* Contenedor de Imagen */}
      <div className="flex justify-center items-center bg-gray-50 rounded-3xl p-6 h-96 lg:h-112.5 relative shadow-sm border border-gray-100">
        <img
          src={producto.imagenUrl || "https://placeholder.com"}
          alt={producto.nombre}
          className="h-full object-contain mix-blend-multiply"
        />
        {isAgotado && (
          <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-black tracking-wide shadow-sm">
            AGOTADO
          </span>
        )}
      </div>

      {/* Bloque de Información Técnica */}
      <div className="flex flex-col h-full justify-center gap-6">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md">
            {producto.marca}
          </span>
          <h1 className="text-3xl font-black text-gray-900 mt-3">
            {producto.nombre}
          </h1>

          <div className="flex flex-wrap gap-2 my-4 text-xs font-semibold text-gray-600">
            <span className="bg-gray-100 px-3 py-1.5 rounded-xl">
              💾 {producto.almacenamiento}
            </span>
            <span className="bg-gray-100 px-3 py-1.5 rounded-xl">
              ⚡ {producto.ram} RAM
            </span>
            <span className="bg-gray-100 px-3 py-1.5 rounded-xl">
              🔋 Salud Batería: {producto.bateria}
            </span>
            <span className="bg-gray-100 px-3 py-1.5 rounded-xl">
              ✨ Estado: {producto.estado}
            </span>
          </div>

          <p className="text-gray-500 text-sm leading-relaxed mt-2">
            {producto.descripcion}
          </p>
        </div>

        {/* Visualización de Precios */}
        <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-400 block font-medium">
              Precio final estimado
            </span>
            <span className="text-3xl font-black text-slate-900">
              S/ {producto.precio.toFixed(2)}
            </span>
          </div>
          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-md font-medium">
            Color: {producto.color || "Por defecto"}
          </span>
        </div>

        {/* Botonera de Compra */}
        <div className="flex flex-col gap-3 mt-4">
          <button
            disabled={isAgotado}
            onClick={handleAñadirAlCarrito}
            className={`w-full py-4 rounded-xl font-bold transition-all text-center text-sm shadow-md
              ${
                isAgotado
                  ? "bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed shadow-none"
                  : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-100"
              }`}
          >
            {isAgotado
              ? "Sin Stock Disponible"
              : "🛒 Añadir a mi Bolsa de Compras"}
          </button>

          <button
            onClick={handleConsultarWhatsApp}
            className="w-full py-4 rounded-xl border-2 border-green-600 text-green-600 text-sm font-bold hover:bg-green-50/50 transition-colors flex items-center justify-center gap-2"
          >
            💬 Consultar stock inmediato por WhatsApp
          </button>

        </div>
      </div>
    </div>
  );
};
