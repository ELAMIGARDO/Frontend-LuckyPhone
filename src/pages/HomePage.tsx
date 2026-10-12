import { useEffect, useState } from "react";
import { Brand } from "../components/home/Brand";
import { FeatureGrid } from "../components/home/FeatureGrid";
import { CardProduct } from "../components/products/CardProduct";
import { CustomerReviews } from "../components/home/CustomerReviews";
import { getProductosPaginadosService } from "../services/backendService";
import type { ProductoResponseDTO } from "../interfaces";

export const HomePage = () => {
  const [productos, setProductos] = useState<ProductoResponseDTO[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getProductosPaginadosService(0, 8)
      .then((data) => {
        setProductos(data.content || []);
      })
      .catch((err) => {
        console.error("Error cargando productos destacados:", err);
      })
      .finally(() => setCargando(false));
  }, []);

  return (
    <div>
      <FeatureGrid />

      <div className="my-16">
        <h2 className="text-3xl font-extrabold text-center mb-10 md:text-4xl text-slate-900 tracking-tight">
          Catálogo de Equipos Destacados
        </h2>

        {cargando ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-10 h-10 border-4 border-[#0077FF] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : productos.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-medium text-sm">
            No hay productos registrados en la tienda aún.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productos.map((prod) => (
              <CardProduct key={prod.id} producto={prod} />
            ))}
          </div>
        )}
      </div>

      {/* Sección de Reseñas de Clientes (Frontend Público) */}
      <CustomerReviews />

      <Brand />
    </div>
  );
};
