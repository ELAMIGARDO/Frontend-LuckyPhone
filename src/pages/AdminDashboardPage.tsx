import React, { useEffect, useState } from 'react';
import {
  getProductosPaginadosService,
  crearProductoService,
  actualizarProductoService,
  eliminarProductoService,
  getCategoriasService
} from '../services/backendService';
import type { ProductoResponseDTO, CategoriaResponseDTO, ProductoRequestDTO } from '../interfaces';

const MARCAS_DISPONIBLES = ['Apple', 'Samsung', 'Xiaomi', 'Motorola', 'Honor', 'Realme', 'Oppo', 'Huawei', 'ZTE', 'Otra'];
const ALMACENAMIENTOS_DISPONIBLES = ['64GB', '128GB', '256GB', '512GB', '1TB'];
const RAM_DISPONIBLES = ['4GB', '6GB', '8GB', '12GB', '16GB'];
const ESTADOS_DISPONIBLES = ['Nuevo', 'Seminuevo / Open Box', 'Reacondicionado A+'];

export const AdminDashboardPage: React.FC = () => {
  const [productos, setProductos] = useState<ProductoResponseDTO[]>([]);
  const [categorias, setCategorias] = useState<CategoriaResponseDTO[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para controlar edición
  const [idEditando, setIdEditando] = useState<number | null>(null);
  
  // Estado para modal ver detalle
  const [productoVer, setProductoVer] = useState<ProductoResponseDTO | null>(null);

  // Formulario nuevo / editar producto
  const [productoForm, setProductoForm] = useState<ProductoRequestDTO>({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 10,
    marca: 'Apple',
    modelo: '',
    almacenamiento: '128GB',
    ram: '8GB',
    color: 'Negro',
    estado: 'Nuevo',
    bateria: '100%',
    categoriaId: 1,
    imagenUrl: '',
  });

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const dataProductos = await getProductosPaginadosService(0, 100);
      setProductos(dataProductos.content || []);
      const dataCats = await getCategoriasService();
      setCategorias(dataCats || []);
      if (dataCats && dataCats.length > 0 && !idEditando) {
        setProductoForm((prev) => ({ ...prev, categoriaId: dataCats[0].id }));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar productos del servidor');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const resetFormulario = () => {
    setIdEditando(null);
    setProductoForm({
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 10,
      marca: 'Apple',
      modelo: '',
      almacenamiento: '128GB',
      ram: '8GB',
      color: 'Negro',
      estado: 'Nuevo',
      bateria: '100%',
      categoriaId: categorias[0]?.id || 1,
      imagenUrl: '',
    });
  };

  const handleSeleccionarEditar = (prod: ProductoResponseDTO) => {
    setIdEditando(prod.id);
    setProductoForm({
      nombre: prod.nombre || '',
      descripcion: prod.descripcion || '',
      precio: prod.precio || 0,
      stock: prod.stock || 0,
      marca: prod.marca || 'Apple',
      modelo: prod.modelo || '',
      almacenamiento: prod.almacenamiento || '128GB',
      ram: prod.ram || '8GB',
      color: prod.color || 'Negro',
      estado: prod.estado || 'Nuevo',
      bateria: prod.bateria || '100%',
      categoriaId: categorias[0]?.id || 1,
      imagenUrl: prod.imagenUrl || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productoForm.nombre.trim()) {
      alert('Por favor ingrese el nombre del celular.');
      return;
    }
    if (productoForm.precio <= 0) {
      alert('Por favor ingrese un precio mayor a 0.');
      return;
    }

    try {
      setGuardando(true);
      if (idEditando) {
        await actualizarProductoService(idEditando, productoForm);
        alert('✅ ¡Celular actualizado exitosamente!');
      } else {
        await crearProductoService(productoForm);
        alert('✅ ¡Celular registrado exitosamente!');
      }
      resetFormulario();
      cargarDatos();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al procesar la solicitud en el servidor');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (confirm('¿Está seguro de eliminar este producto del inventario?')) {
      try {
        await eliminarProductoService(id);
        cargarDatos();
      } catch (err: any) {
        alert('Error al eliminar producto');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Panel de Administración LuckyPhone</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Gestión Centralizada de Inventario y Equipos Móviles</p>
        </div>
        <span className="inline-flex items-center gap-2 self-start md:self-auto bg-purple-100 text-purple-700 text-xs px-4 py-2 rounded-full font-bold uppercase tracking-wider border border-purple-200 shadow-sm">
          <span>🛡️</span> Acceso: ROLE_ADMIN
        </span>
      </div>

      {/* Formulario Crear / Editar Producto */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-100 mb-10">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 grid place-items-center font-bold text-xl">
              {idEditando ? '✏️' : '📱'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {idEditando ? `Editando Celular #${idEditando}` : 'Registrar Nuevo Celular'}
              </h3>
              <p className="text-xs text-slate-500">Configura las especificaciones técnicas del equipo</p>
            </div>
          </div>
          {idEditando && (
            <button
              type="button"
              onClick={resetFormulario}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl transition-colors"
            >
              ❌ Cancelar Edición
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Nombre */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Nombre del Equipo *
            </label>
            <input
              type="text"
              required
              value={productoForm.nombre}
              onChange={(e) => setProductoForm({ ...productoForm, nombre: e.target.value })}
              placeholder="Ej: iPhone 15 Pro Max / Galaxy S24 Ultra"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-medium"
            />
          </div>

          {/* Marca (Select) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Marca *
            </label>
            <select
              value={productoForm.marca}
              onChange={(e) => setProductoForm({ ...productoForm, marca: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-bold bg-white"
            >
              {MARCAS_DISPONIBLES.map((marca) => (
                <option key={marca} value={marca}>
                  {marca}
                </option>
              ))}
            </select>
          </div>

          {/* Almacenamiento (Select) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Almacenamiento *
            </label>
            <select
              value={productoForm.almacenamiento}
              onChange={(e) => setProductoForm({ ...productoForm, almacenamiento: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-bold bg-white"
            >
              {ALMACENAMIENTOS_DISPONIBLES.map((alm) => (
                <option key={alm} value={alm}>
                  💾 {alm}
                </option>
              ))}
            </select>
          </div>

          {/* RAM (Select) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Memoria RAM *
            </label>
            <select
              value={productoForm.ram}
              onChange={(e) => setProductoForm({ ...productoForm, ram: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-bold bg-white"
            >
              {RAM_DISPONIBLES.map((ram) => (
                <option key={ram} value={ram}>
                  ⚡ {ram}
                </option>
              ))}
            </select>
          </div>

          {/* Precio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Precio (S/) *
            </label>
            <input
              type="number"
              required
              min={0}
              step={0.01}
              value={productoForm.precio}
              onChange={(e) => setProductoForm({ ...productoForm, precio: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-extrabold text-slate-900"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Stock Disponible *
            </label>
            <input
              type="number"
              required
              min={0}
              value={productoForm.stock}
              onChange={(e) => setProductoForm({ ...productoForm, stock: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-bold"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Estado del Equipo *
            </label>
            <select
              value={productoForm.estado}
              onChange={(e) => setProductoForm({ ...productoForm, estado: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-medium bg-white"
            >
              {ESTADOS_DISPONIBLES.map((est) => (
                <option key={est} value={est}>
                  ✨ {est}
                </option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Color
            </label>
            <input
              type="text"
              value={productoForm.color}
              onChange={(e) => setProductoForm({ ...productoForm, color: e.target.value })}
              placeholder="Titanio Negro / Plata"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-medium"
            />
          </div>

          {/* Batería */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Salud Batería
            </label>
            <input
              type="text"
              value={productoForm.bateria}
              onChange={(e) => setProductoForm({ ...productoForm, bateria: e.target.value })}
              placeholder="100% / 5000 mAh"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-medium"
            />
          </div>

          {/* Subida Profesional de Imagen (Drag & Drop + URL) */}
          <div className="sm:col-span-2 lg:col-span-4 bg-slate-50/80 p-4 rounded-2xl border border-dashed border-slate-300">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                🖼️ Imagen del Celular (Vista Previa & Carga)
              </label>
              <span className="text-[11px] text-purple-600 font-semibold bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                Formatos: JPG, PNG, WEBP (Max 5MB)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Dropzone / Upload area */}
              <div className="md:col-span-2 relative">
                <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-purple-200 hover:border-purple-500 bg-white rounded-xl cursor-pointer group transition-all">
                  <div className="flex flex-col items-center justify-center text-center">
                    <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">📤</span>
                    <p className="text-xs font-bold text-slate-700 group-hover:text-purple-600">
                      Haz clic para seleccionar o arrastra una imagen aquí
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Procesamiento local instantáneo y optimización de visualización
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) {
                        alert('⚠️ La imagen no debe superar los 5MB.');
                        return;
                      }
                      // Previsualización instantánea local
                      const preview = URL.createObjectURL(file);
                      setProductoForm((prev) => ({ ...prev, imagenUrl: preview }));
                    }}
                  />
                </label>
                
                {/* Opción alternativa: URL Web Directa */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">o pega una URL Web:</span>
                  <input
                    type="text"
                    value={productoForm.imagenUrl}
                    onChange={(e) => setProductoForm({ ...productoForm, imagenUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-purple-500 bg-white"
                  />
                </div>
              </div>

              {/* Vista Previa de Imagen */}
              <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm h-full min-h-[120px]">
                {productoForm.imagenUrl ? (
                  <div className="relative group w-full h-28 flex items-center justify-center overflow-hidden rounded-lg bg-slate-900/5">
                    <img
                      src={productoForm.imagenUrl}
                      alt="Vista previa"
                      className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setProductoForm((prev) => ({ ...prev, imagenUrl: '' }))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs shadow hover:bg-red-600 transition-colors"
                      title="Quitar imagen"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-slate-300 py-4">
                    <span className="text-2xl block mb-1">🖼️</span>
                    <span className="text-[11px] font-medium text-slate-400">Sin vista previa</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="sm:col-span-2 lg:col-span-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Descripción Comercial
            </label>
            <textarea
              rows={2}
              value={productoForm.descripcion}
              onChange={(e) => setProductoForm({ ...productoForm, descripcion: e.target.value })}
              placeholder="Detalles sobre garantía, accesorios o estado estético..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all font-medium"
            />
          </div>

          {/* Botones Guardar / Cancelar */}
          <div className="sm:col-span-2 lg:col-span-4 pt-2 flex gap-3">
            <button
              type="submit"
              disabled={guardando}
              className="px-8 py-4 bg-slate-900 hover:bg-purple-700 text-white font-black text-sm rounded-2xl shadow-xl active:scale-98 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {guardando
                ? 'Procesando...'
                : idEditando
                ? '💾 Actualizar Cambios'
                : '💾 Guardar Celular en Inventario'}
            </button>
            {idEditando && (
              <button
                type="button"
                onClick={resetFormulario}
                className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition-all"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabla Inventario */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">📦 Inventario Registrado</h3>
            <p className="text-xs text-slate-500 font-medium">Total de equipos en catálogo: {productos.length}</p>
          </div>
          <button
            onClick={cargarDatos}
            className="text-xs font-bold text-purple-600 hover:text-purple-800 bg-purple-50 px-3.5 py-2 rounded-xl border border-purple-100 transition-colors"
          >
            🔄 Actualizar Lista
          </button>
        </div>

        {cargando ? (
          <div className="p-12 text-center text-sm text-slate-500 font-medium">Cargando inventario de Spring Boot...</div>
        ) : error ? (
          <div className="p-12 text-center text-sm text-red-500 font-semibold">{error}</div>
        ) : productos.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">No hay productos registrados en la base de datos aún.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-100/70 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Imagen</th>
                  <th className="px-6 py-4">Equipo</th>
                  <th className="px-6 py-4">Marca</th>
                  <th className="px-6 py-4">Especificaciones</th>
                  <th className="px-6 py-4">Precio</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productos.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <img
                        src={prod.imagenUrl || 'https://via.placeholder.com/80'}
                        alt={prod.nombre}
                        className="w-12 h-12 object-contain rounded-xl bg-slate-50 p-1 border border-slate-100"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-slate-900 block">{prod.nombre}</span>
                      <span className="text-xs text-slate-400">ID: #{prod.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-700 text-xs font-extrabold px-2.5 py-1 rounded-md">
                        {prod.marca}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium space-y-0.5">
                      <div>💾 {prod.almacenamiento} | ⚡ {prod.ram}</div>
                      <div className="text-slate-400">Color: {prod.color || 'N/A'} | {prod.estado}</div>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900 text-base">
                      S/ {prod.precio.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                          prod.stock > 0 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-red-100 text-red-700 border border-red-200'
                        }`}
                      >
                        {prod.stock > 0 ? `${prod.stock} unids.` : 'AGOTADO'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Ver Detalle / Ficha del producto */}
                        <button
                          onClick={() => setProductoVer(prod)}
                          className="text-slate-700 hover:text-slate-900 font-bold text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors border border-slate-200 flex items-center gap-1"
                          title="Ver Detalle Técnico"
                        >
                          👁️ Ver
                        </button>
                        {/* Editar */}
                        <button
                          onClick={() => handleSeleccionarEditar(prod)}
                          className="text-purple-700 hover:text-purple-900 font-bold text-xs bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl transition-colors border border-purple-200 flex items-center gap-1"
                          title="Editar Producto"
                        >
                          ✏️ Editar
                        </button>
                        {/* Eliminar */}
                        <button
                          onClick={() => handleEliminar(prod.id)}
                          className="text-red-600 hover:text-red-800 font-bold text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-colors border border-red-100 flex items-center gap-1"
                          title="Eliminar del inventario"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Ver Detalle Técnico del Producto */}
      {productoVer && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative animate-fadeIn">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-purple-600 uppercase bg-purple-50 px-2.5 py-1 rounded-md">
                  {productoVer.marca}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">{productoVer.nombre}</h3>
              </div>
              <button
                onClick={() => setProductoVer(null)}
                className="text-slate-400 hover:text-slate-600 p-1 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex justify-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <img
                src={productoVer.imagenUrl || 'https://via.placeholder.com/150'}
                alt={productoVer.nombre}
                className="h-44 object-contain"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Precio</span>
                <span className="text-base font-black text-slate-900">S/ {productoVer.precio.toFixed(2)}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Stock</span>
                <span className="text-sm font-bold text-emerald-600">{productoVer.stock} unidades</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Almacenamiento</span>
                <span className="text-sm font-bold text-slate-800">💾 {productoVer.almacenamiento}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Memoria RAM</span>
                <span className="text-sm font-bold text-slate-800">⚡ {productoVer.ram}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Estado</span>
                <span className="text-sm font-bold text-slate-800">✨ {productoVer.estado}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Salud Batería</span>
                <span className="text-sm font-bold text-slate-800">🔋 {productoVer.bateria || 'N/A'}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Descripción</span>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                {productoVer.descripcion || 'Sin descripción ingresada.'}
              </p>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  setProductoVer(null);
                  handleSeleccionarEditar(productoVer);
                }}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
              >
                ✏️ Editar este equipo
              </button>
              <button
                onClick={() => setProductoVer(null)}
                className="py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
