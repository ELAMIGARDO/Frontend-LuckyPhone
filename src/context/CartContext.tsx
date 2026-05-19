import { createContext, useContext, useState, type ReactNode } from "react";

// 1. Molde exacto de lo que viene de tu Spring Boot
export interface ProductoDTO {
  id: number;
  nombre: string;
  precio: number;
  imagenUrl: string;
  stock: number;
  whatsappLink: string;
  color: string; // 👈 Clave para que no falle CartSidebar
  marca: string;
  modelo: string;
  almacenamiento: string;
  ram: string;
  estado: string;
  bateria: string;
}

// 2. Añadimos la propiedad de cantidad para el carrito
export interface CartItem extends ProductoDTO {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[]; // 👈 Aquí le avisamos a React que la lista contiene CartItems válidos
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addToCart: (producto: ProductoDTO) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (producto: ProductoDTO) => {
    setCart((prevCart) => {
      const itemExists = prevCart.find((item) => item.id === producto.id);
      if (itemExists) {
        if (itemExists.quantity >= producto.stock) {
          alert(`Lo sentimos, solo quedan ${producto.stock} unidades en stock.`);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === producto.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...producto, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.precio * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, isOpen, setIsOpen, addToCart, removeFromCart, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe ser usado dentro de un CartProvider");
  return context;
};
