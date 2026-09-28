import { useEffect, useState } from "react";
import { CardProduct } from "../components/products/CardProduct";
import { ContainerFilter } from "../components/products/ContainerFilter";
import { getProductosPaginadosService } from "../services/backendService";
import type { ProductoResponseDTO, PageResponse } from "../interfaces";

export const CellPhonesPage = () => {
  const [celulares, setCelulares] = useState<ProductoResponseDTO[]>([]);
  const [cargando, setCargando] = useState(true);

  // Estados para Filtros de iPhone
  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState<string[]>([]);
  const [precioMaximo, setPrecioMaximo] = useState<number>(10000);

  // Estados para Paginación de Spring Boot
  const [paginaActual, setPaginaActual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalElementos, setTotalElementos] = useState(0);

  const TAMANO_PAGINA = 8; // Mostrar 8 celulares por página

  const cargarPagina = async (page: number) => {
    try {
      setCargando(true);
      const data: PageResponse<ProductoResponseDTO> = await getProductosPaginadosService(page, TAMANO_PAGINA);
      setCelulares(data.content || []);
      setTotalPaginas(data.totalPages || 1);
      setTotalElementos(data.totalElements || 0);
      setPaginaActual(data.number || page);
    } catch (error) {
      console.error("Error al conectar con tu backend en Spring Boot:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPagina(paginaActual);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [paginaActual]);

  const toggleMarca = (marca: string) => {
    setMarcasSeleccionadas((prev) =>
      prev.includes(marca) ? prev.filter((m) => m !== marca) : [...prev, marca]
    );
  };

  const limpiarFiltros = () => {
    setMarcasSeleccionadas([]);
    setPrecioMaximo(10000);
  };

  // Filtrado reactivo en el cliente
  const celularesFiltrados = celulares.filter((celular) => {
    const cumpleModeloOAlmacenamiento =
      marcasSeleccionadas.length === 0 ||
      marcasSeleccionadas.some(
        (filtro) =>
          (celular.nombre || '').toLowerCase().includes(filtro.toLowerCase()) ||
          (celular.modelo || '').toLowerCase().includes(filtro.toLowerCase()) ||
          (celular.almacenamiento || '').toLowerCase().includes(filtro.toLowerCase())
      );
    const cumplePrecio = (celular.precio || 0) <= precioMaximo;
    return cumpleModeloOAlmacenamiento && cumplePrecio;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl lg:text-5xl font-extrabold text-center mb-10 text-slate-900 tracking-tight">
        Catálogo de Celulares
      </h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* Filtros laterales */}
        <ContainerFilter
          marcasSeleccionadas={marcasSeleccionadas}
          onToggleMarca={toggleMarca}
          precioMaximo={precioMaximo}
          onChangePrecioMaximo={setPrecioMaximo}
          onLimpiarFiltros={limpiarFiltros}
        />

        <div className="col-span-2 lg:col-span-2 xl:col-span-4 flex flex-col gap-10">
          {cargando ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500 font-medium">Cargando catálogo de celulares...</p>
            </div>
          ) : celularesFiltrados.length === 0 ? (
            <div className="text-center py-24 font-medium text-slate-400 bg-white rounded-3xl border border-slate-100 flex flex-col items-center justify-center gap-3">
              <span className="text-3xl">🍎</span>
              <p>No se encontraron iPhones con los filtros seleccionados.</p>
              <button
                onClick={limpiarFiltros}
                className="text-xs font-bold text-purple-600 underline hover:text-purple-800"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <>
              {/* Grilla de productos cargada con datos reales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {celularesFiltrados.map((celular) => (
                  <CardProduct key={celular.id} producto={celular} />
                ))}
              </div>

              {/* BARRA DE PAGINACIÓN DINÁMICA DE SPRING BOOT */}
              {totalPaginas > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200 mt-4">
                  <span className="text-xs text-slate-500 font-medium">
                    Mostrando página <strong className="text-slate-800">{paginaActual + 1}</strong> de{' '}
                    <strong className="text-slate-800">{totalPaginas}</strong> ({totalElementos} equipos)
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Botón Anterior */}
                    <button
                      disabled={paginaActual === 0}
                      onClick={() => setPaginaActual((prev) => Math.max(0, prev - 1))}
                      className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      ← Anterior
                    </button>

                    {/* Números de Página */}
                    <div className="flex gap-1.5">
                      {Array.from({ length: totalPaginas }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setPaginaActual(i)}
                          className={`w-8 h-8 text-xs font-black rounded-xl transition-all ${paginaActual === i
                              ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    {/* Botón Siguiente */}
                    <button
                      disabled={paginaActual >= totalPaginas - 1}
                      onClick={() => setPaginaActual((prev) => Math.min(totalPaginas - 1, prev + 1))}
                      className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      Siguiente →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
