import { CardProduct } from "../products/CardProduct";
import type { PreparedProduct } from "../../interfaces";

interface Props {
  title: string;
  products: PreparedProduct[];
}

export const ProductGrid = ({ title, products }: Props) => {
  return (
    <div className="my-32">
      <h2 className="text-3xl font-semibold text-center mb-8 md:text-4xl lg:text-5xl">
        {title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-8">
        {products.map((product) => {
          const productoAdaptado = {
            id: Number(product.id),
            nombre: product.name,
            marca: "LuckyPhone", 
            modelo: product.slug,
            descripcion: "Ficha técnica en desarrollo.",
            precio: product.price,
            stock: 10, 
            almacenamiento: "128GB",
            ram: "8GB",
            color: "Estándar",
            estado: "Nuevo",
            bateria: "100%",
            imagenUrl: product.images?.[0] || "", 
            whatsappLink: ""
          };

          return (
            <CardProduct key={product.id} producto={productoAdaptado} />
          );
        })}
      </div>
    </div>
  );
};
