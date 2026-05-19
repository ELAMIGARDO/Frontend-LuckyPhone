import { Outlet, useLocation, ScrollRestoration } from "react-router-dom";
import { Navbar } from "../components/shared/Navbar";
import { Footer } from "../components/shared/Footer";
import { Banner } from "../components/home/Banner";
import { Newsletter } from "../components/home/Newsletter";
import { useEffect, useState } from "react";
import { HiArrowUp } from "react-icons/hi";
// 🔥 NUEVO: Importamos la barra lateral del carrito
import { CartSidebar } from "../components/cart/CartSidebar"; 

export const RootLayouts = () => {
  const { pathname } = useLocation();
  const [showButton, setShowButton] = useState(false);

  // Controla cuándo aparece el botón flotante (al bajar más de 400 píxeles)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Función para subir suavemente con el botón
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Restaura el scroll automáticamente al cambiar de página */}
      <ScrollRestoration />

      <Navbar />

      {/* 🛒 NUEVO: Inyectamos la barra lateral aquí para que aparezca al hacer clic en la bolsa */}
      <CartSidebar /> 

      {pathname === "/" && <Banner />}

      <main className="container mx-auto my-8 flex-1 px-4">
        <Outlet />
      </main>

      {pathname === "/" && <Newsletter />}

      <Footer />

      {/* Botón Flotante para subir manualmente con colores de Lucky Phone */}
      {showButton && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-purple-600 text-white shadow-2xl border border-purple-500 hover:bg-purple-700 active:scale-95 transition-all duration-300 md:bottom-8 md:right-8"
          aria-label="Subir al inicio"
        >
          <HiArrowUp size={24} />
        </button>
      )}
    </div>
  );
};
