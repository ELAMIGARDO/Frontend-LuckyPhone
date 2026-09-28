import { useCart } from "../../context/CartContext";
import { FiX, FiTrash2 } from "react-icons/fi";

interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  imagenUrl: string;
  stock?: number;
  whatsappLink?: string; // Propiedad calculada que viene de tu ProductoResponseDTO
  color?: string;
  quantity: number;
}

export const CartSidebar = () => {
  const { cart, isOpen, setIsOpen, cartTotal, removeFromCart, clearCart } =
    useCart();

  if (!isOpen) return null;

  const handleEnviarWhatsApp = () => {
    if (!cart || cart.length === 0) return;

    // 1. Extraemos el objeto del primer elemento añadido a la bolsa
    const primerItem = cart[0] as CartItem;
    
    // 2. Extraemos la base limpia (Ej: "https://wa.me") provista por el back-end
    const baseWhatsappUrl = primerItem.whatsappLink?.split("?")[0] ?? "https://wa.me";

    // 3. Obtenemos datos de la sesión activa del cliente si inició sesión
    let infoCliente = "";
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userObj = JSON.parse(userStr);
        if (userObj.email) {
          infoCliente = ` (Cliente: ${userObj.email})`;
        }
      }
    } catch (_) {}

    // 4. Estructuramos el mensaje consolidado para la tienda
    let mensaje = `🛒 *¡Hola LuckyPhone! Quiero concretar la compra de los siguientes equipos de mi carrito${infoCliente}:* \n\n`;

    cart.forEach((item: CartItem) => {
      mensaje += `📱 *${item.nombre}*\n`;
      mensaje += `   Cantidad: ${item.quantity} und. | Color: ${item.color ?? "-"}\n`;
      mensaje += `   Subtotal: S/ ${(item.precio * item.quantity).toFixed(2)}\n\n`;
    });

    mensaje += `💰 *TOTAL A PAGAR: S/ ${cartTotal.toFixed(2)}*\n\n`;
    mensaje += "¿Tienen la disponibilidad de stock para coordinar la entrega?";

    // 5. Adjuntamos el texto del carrito codificado a la URL base de tu servidor
    const urlFinal = `${baseWhatsappUrl}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlFinal, "_blank");

    // Limpieza del estado de la interfaz
    clearCart();
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Fondo oscuro con desenfoque */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Panel lateral del carrito */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-10 animate-slide-in">
        {/* Encabezado */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Tu Bolsa de Compras</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Lista de productos en el carrito */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {(!cart || cart.length === 0) ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-sm">Tu bolsa está vacía.</p>
            </div>
          ) : (
            cart.map((item: CartItem) => (
              <div
                key={item.id}
                className="flex gap-4 border-b border-gray-50 pb-4 items-center"
              >
                <img
                  src={item.imagenUrl}
                  alt={item.nombre}
                  className="w-16 h-16 object-contain bg-gray-50 p-1 rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-gray-800 line-clamp-1">
                    {item.nombre}
                  </h4>
                  <p className="text-xs text-gray-400 mb-1">
                    Color: {item.color ?? "-"} | Cantidad: {item.quantity}
                  </p>
                  <span className="text-sm font-bold text-purple-600">
                    S/ {(item.precio * item.quantity).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Sección inferior con el Total y Botón de envío */}
        {cart && cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 text-sm font-medium">Total estimado:</span>
              <span className="text-2xl font-black text-blue-600">S/ {cartTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={handleEnviarWhatsApp}
              className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-100 transition-colors"
            >
              💬 Confirmar Pedido por WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
