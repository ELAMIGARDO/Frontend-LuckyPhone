import { useEffect, useState } from "react";
import axios from "axios";
import { CardProduct } from "../components/products/CardProduct";
import { ContainerFilter } from "../components/products/ContainerFilter";

// Definimos la interfaz que mapea tu ProductoResponseDTO de Spring Boot
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
  whatsappLink: string;
}

export const CellPhonesPage = () => {
  // 1. Estados para la lista real del Backend y el estado de carga
  const [celulares, setCelulares] = useState<ProductoDTO[]>([]);
  const [cargando, setCargando] = useState(true);

  // 2. useEffect para consumir tu endpoint de Spring Boot al cargar la página
  useEffect(() => {
    axios.get("http://localhost:8080/api/productos/lista?page=0&size=12")
      .then((response) => {
        // CORREGIDO: Extraemos la lista desde la propiedad '.content' de tu Page de Java
        if (response.data && response.data.content) {
          setCelulares(response.data.content);
        } else {
          setCelulares([]);
        }
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al conectar con tu backend en Spring Boot:", error);
        setCargando(false);
      });
  }, []);

  return (
    <>
      <h1 className="text-5xl font-semibold text-center mb-12">
        Celulares
      </h1>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        
        {/* Filtros laterales */}
        <ContainerFilter/>

        <div className="col-span-2 lg:col-span-2 xl:col-span-4 flex flex-col gap-12">
          
          {/* Manejo de estados visuales de carga o base de datos vacía */}
          {cargando ? (
            <div className="text-center py-20 font-medium text-gray-500">
              Conectando con el catálogo de LuckyPhone...
            </div>
          ) : celulares.length === 0 ? (
            <div className="text-center py-20 font-medium text-gray-500">
              No hay celulares registrados en tu base de datos local.
            </div>
          ) : (
            /* Grilla de productos cargada con datos reales */
            <div className="grid grid-cols-2 gap-3 gap-y-10 xl:grid-cols-4">
              {celulares.map((celular) => (
                // CORREGIDO: Enviamos el objeto DTO completo a la propiedad "producto"
                <CardProduct key={celular.id} producto={celular} />
              ))}
            </div>
          )}

        </div>

      </div>
    </>
  );
};
