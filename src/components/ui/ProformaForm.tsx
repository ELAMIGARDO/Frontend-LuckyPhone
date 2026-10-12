import React, { useState, useEffect } from 'react';
import {
  FaPrint,
  FaFileInvoiceDollar,
  FaUser,
  FaTag,
  FaUserCheck,
  FaBarcode,
  FaSearch
} from 'react-icons/fa';
import type { ProformaData } from './ProformaDocument';
import { getProductosAdminListaCompletaService } from '../../services/backendService';

interface CatalogItem {
  nombre: string;
  categoria: string;
  precio: number;
}

interface ProformaFormProps {
  data: ProformaData;
  montoDescuento: number;
  isSaving: boolean;
  onChange: (field: keyof ProformaData, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ProformaForm: React.FC<ProformaFormProps> = ({
  data,
  montoDescuento,
  isSaving,
  onChange,
  onSubmit
}) => {
  const isCelular = data.categoria === 'Celulares';
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [dbProducts, setDbProducts] = useState<CatalogItem[]>([]);

  // 🔄 Cargar productos reales desde la Base de Datos / Backend
  useEffect(() => {
    getProductosAdminListaCompletaService()
      .then((productos) => {
        if (productos && productos.length > 0) {
          const mapped = productos.map(p => ({
            nombre: p.nombre,
            categoria: p.categoriaNombre || 'Celulares',
            precio: p.precio
          }));
          setDbProducts(mapped);
        }
      })
      .catch(() => {
        // En caso de estar offline, el servicio automáticamente rescata de localStorage
      });
  }, []);

  const catalogSuggestions: CatalogItem[] = dbProducts.length > 0 ? dbProducts : [
    { nombre: 'Apple iPhone 15 Pro Max 256GB - Titanium Natural', categoria: 'Celulares', precio: 4899 },
    { nombre: 'Samsung Galaxy S24 Ultra 512GB - Titanium Black', categoria: 'Celulares', precio: 4599 },
    { nombre: 'Cargador Rápido Anker 65W USB-C Dual Port', categoria: 'Cargadores', precio: 189 },
    { nombre: 'Audífonos Inalámbricos Apple AirPods Pro 2da Gen', categoria: 'Audífonos', precio: 899 },
    { nombre: 'Cable USB-C a Lightning Carga Rápida 2m', categoria: 'Accesorios', precio: 79 }
  ];

  const [filterCategory, setFilterCategory] = useState<string>('todas');

  const filteredCatalog = catalogSuggestions.filter(item => {
    const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'todas' || item.categoria.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // 🚀 FUNCIÓN UNIFICADA DE SELECCIÓN DE PRODUCTO (onSelectProducto)
  const handleSelectProduct = (item: CatalogItem) => {
    // 1. Cambiar Categoría Automáticamente (Dispara condicionales de IMEI 1/2 vs Serie)
    onChange('categoria', item.categoria);
    
    // 2. Cargar Nombre del Modelo y Precio Base del Inventario
    onChange('productoModelo', item.nombre);
    onChange('precioBase', item.precio);

    // 3. Limpieza preventiva de identificadores para el nuevo tipo de producto
    if (item.categoria !== 'Celulares') {
      onChange('imei1', '');
      onChange('imei2', '');
    }

    // 4. Cerrar menú desplegable y resetear término de búsqueda
    setSearchTerm('');
    setShowDropdown(false);
  };

  const opcionesGarantia = ['0 Meses', '3 Meses', '6 Meses', '12 Meses', '24 Meses'];

  return (
    <form onSubmit={onSubmit} className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 print:hidden">
      {/* CABECERA PANEL */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-200">
          <FaFileInvoiceDollar className="text-xl" />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-900 text-base">Emisión de Proforma & Garantía</h3>
          <p className="text-xs text-slate-500 font-medium">Completa los datos para generar el documento en tiempo real.</p>
        </div>
      </div>

      {/* FILTRO DE CATEGORÍA + BUSCADOR INTELIGENTE DE PRODUCTOS EN INVENTARIO (CONTENEDOR PADRE RELATIVO) */}
      <div className="relative space-y-2 bg-purple-50/30 p-3 rounded-2xl border border-purple-100">
        <label className="block text-[11px] font-bold text-purple-800 flex items-center gap-1">
          <FaTag className="text-[10px]" /> Filtrar & Buscar Producto del Inventario
        </label>
        
        <div className="flex flex-col sm:flex-row gap-2">
          {/* SELECT DESPLEGABLE DE CATEGORÍA */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full sm:w-2/5 px-3 py-2 bg-white rounded-xl border border-purple-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 shadow-sm cursor-pointer"
          >
            <option value="todas">Todas las Categorías</option>
            <option value="Celulares">Celulares</option>
            <option value="Cargadores">Cargadores</option>
            <option value="Audífonos">Audífonos</option>
            <option value="Accesorios">Accesorios</option>
          </select>

          {/* INPUT BUSCADOR TEXTUAL */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 text-[10px]" />
            <input
              type="text"
              value={searchTerm}
              onFocus={() => setShowDropdown(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              placeholder="Escribe para autocompletar producto..."
              className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-purple-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
            />
          </div>
        </div>

        {/* 🌟 MENÚ DESPLEGABLE FLOTANTE CON SCROLL INTERNO (SIN EMPUJAR EL FORMULARIO INFERIOR) */}
        {showDropdown && (searchTerm || filterCategory !== 'todas') && filteredCatalog.length > 0 && (
          <div className="absolute left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-y-auto max-h-60">
            {filteredCatalog.map((item, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => handleSelectProduct(item)}
                className="w-full text-left px-3.5 py-2.5 hover:bg-purple-50 transition-colors border-b border-slate-100 last:border-none flex justify-between items-center text-xs cursor-pointer"
              >
                <div>
                  <p className="font-bold text-slate-900">{item.nombre}</p>
                  <span className="text-[10px] text-purple-600 font-bold">{item.categoria}</span>
                </div>
                <span className="font-mono font-extrabold text-slate-800">S/ {item.precio}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DATOS DEL EMISOR / ASESOR */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase text-purple-700 tracking-wider flex items-center gap-1.5">
          <FaUserCheck className="text-xs" /> Datos del Emisor
        </h4>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Nombre del Emisor</label>
          <input
            type="text"
            required
            value={data.emisorNombre}
            onChange={(e) => onChange('emisorNombre', e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-purple-50/20"
            placeholder="Ej. Mg. Carlos Eduardo Alva"
          />
        </div>
      </div>

      {/* DATOS DEL CLIENTE */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <h4 className="text-xs font-black uppercase text-purple-700 tracking-wider flex items-center gap-1.5">
          <FaUser className="text-xs" /> Información del Comprador
        </h4>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Nombre Completo del Cliente</label>
          <input
            type="text"
            required
            value={data.clienteNombre}
            onChange={(e) => onChange('clienteNombre', e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">DNI / RUC</label>
            <input
              type="text"
              required
              value={data.clienteDni}
              onChange={(e) => onChange('clienteDni', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Teléfono de Contacto</label>
            <input
              type="text"
              value={data.clienteTelefono}
              onChange={(e) => onChange('clienteTelefono', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Dirección Registrada</label>
          <input
            type="text"
            value={data.clienteDireccion}
            onChange={(e) => onChange('clienteDireccion', e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
          />
        </div>
      </div>

      {/* DATOS DEL PRODUCTO Y GARANTÍA */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <h4 className="text-xs font-black uppercase text-purple-700 tracking-wider flex items-center gap-1.5">
          <FaTag className="text-xs" /> Detalle del Equipo & Garantía
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Categoría del Producto</label>
            <select
              value={data.categoria}
              onChange={(e) => onChange('categoria', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
            >
              <option value="Celulares">Celulares</option>
              <option value="Cargadores">Cargadores</option>
              <option value="Audífonos">Audífonos</option>
              <option value="Accesorios">Accesorios</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Modelo / Nombre</label>
            <input
              type="text"
              required
              value={data.productoModelo}
              onChange={(e) => onChange('productoModelo', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
            />
          </div>
        </div>

        {/* CAMPOS DE IDENTIFICACIÓN CONDICIONALES */}
        <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/80 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 border-b border-slate-200 pb-1">
            <FaBarcode className="text-purple-600" />
            <span>Identificadores ({data.categoria})</span>
          </div>

          {isCelular ? (
            <>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">IMEI 1</label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    value={data.imei1}
                    onChange={(e) => onChange('imei1', e.target.value)}
                    placeholder="IMEI principal"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">IMEI 2 (Opcional)</label>
                  <input
                    type="text"
                    maxLength={15}
                    value={data.imei2}
                    onChange={(e) => onChange('imei2', e.target.value)}
                    placeholder="IMEI secundario"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Número de Serie del Equipo</label>
                <input
                  type="text"
                  maxLength={15}
                  value={data.numeroSerie}
                  onChange={(e) => onChange('numeroSerie', e.target.value)}
                  placeholder="S/N del fabricante (máx. 15 chars)"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Número de Serie (S/N)</label>
              <input
                type="text"
                maxLength={15}
                value={data.numeroSerie}
                onChange={(e) => onChange('numeroSerie', e.target.value)}
                placeholder="S/N del accesorio (máx. 15 chars)"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
              />
            </div>
          )}
        </div>

        {/* PRECIO Y DESCUENTO DUAL */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Precio Base (S/)</label>
            <input
              type="number"
              value={data.precioBase}
              onChange={(e) => onChange('precioBase', Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[11px] font-bold text-slate-700">Descuento</label>
              {data.descuentoTipo === 'porcentaje' && data.descuentoValor > 0 && (
                <span className="text-[10px] font-mono font-bold text-rose-600">
                  (-S/ {montoDescuento.toFixed(2)})
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <select
                value={data.descuentoTipo}
                onChange={(e) => onChange('descuentoTipo', e.target.value as 'soles' | 'porcentaje')}
                className="w-16 px-1.5 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-slate-100 text-slate-700 cursor-pointer"
              >
                <option value="soles">S/</option>
                <option value="porcentaje">%</option>
              </select>
              <input
                type="number"
                value={data.descuentoValor}
                onChange={(e) => onChange('descuentoValor', Number(e.target.value))}
                placeholder={data.descuentoTipo === 'soles' ? 'S/ 0' : '0%'}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 text-rose-600"
              />
            </div>
          </div>
        </div>

        {/* SELECCIÓN RÁPIDA DE GARANTÍA (TABS) */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
            Duración de la Garantía
          </label>
          <div className="grid grid-cols-5 gap-1 bg-slate-100 p-1 rounded-xl">
            {opcionesGarantia.map((opcion) => {
              const active = data.duracionGarantia === opcion;
              return (
                <button
                  type="button"
                  key={opcion}
                  onClick={() => onChange('duracionGarantia', opcion)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {opcion === '0 Meses' ? '0M (N/A)' : opcion}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN RÁPIDA */}
      <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
        <button
          type="submit"
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Guardando en BD...</span>
            </>
          ) : (
            <>
              <FaPrint className="text-sm" /> Guardar e Imprimir Proforma / PDF
            </>
          )}
        </button>
      </div>
    </form>
  );
};
