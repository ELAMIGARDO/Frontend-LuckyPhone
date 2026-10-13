import React, { useState } from 'react';
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaBatteryFull,
  FaImage,
  FaChevronDown,
  FaChevronUp,
  FaBarcode,
  FaFingerprint,
  FaHashtag,
  FaBox,
  FaMobileAlt,
  FaPlug,
  FaHeadphones,
  FaShieldAlt,
  FaFileExcel,
  FaFilePdf,
  FaCalendarAlt,
  FaShoppingCart,
  FaUndoAlt,
  FaSpinner
} from 'react-icons/fa';
import { PackageOpen, Plus, Archive, CheckCircle2 } from 'lucide-react';
import type { InventoryItem } from '../../interfaces/luckyPhoneTypes';
import { useInventoryContext } from '../../context/InventoryContext';
import {
  descargarReporteExcelService,
  descargarReportePdfService
} from '../../services/backendService';
import { exportarInventarioExcel, exportarInventarioPDF } from '../../utils/inventoryExportUtils';

interface InventoryTableProps {
  items: InventoryItem[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onOpenCreateModal: () => void;
  onOpenEditModal: (item: InventoryItem) => void;
  onDeleteDevice: (id: string) => void;
  onToggleVisibility: (item: InventoryItem) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  searchTerm,
  setSearchTerm,
  onOpenCreateModal,
  onOpenEditModal,
  onDeleteDevice,
  onToggleVisibility
}) => {
  const { counts, marcarItemVendidoOptimista, marcarItemDisponibleOptimista } = useInventoryContext();

  const [stockTab, setStockTab] = useState<'disponibles' | 'agotados'>('disponibles');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [selectedPeriodo, setSelectedPeriodo] = useState<string>('todos');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [isExportingExcel, setIsExportingExcel] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [actionLoadingUnitId, setActionLoadingUnitId] = useState<number | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categoryTabs = [
    { id: 'TODOS', label: 'Todos', Icon: FaBox },
    { id: 'Celulares', label: 'Celulares', Icon: FaMobileAlt },
    { id: 'Cargadores', label: 'Cargadores', Icon: FaPlug },
    { id: 'Audífonos', label: 'Audífonos', Icon: FaHeadphones },
    { id: 'Accesorios', label: 'Accesorios', Icon: FaShieldAlt },
  ];

  const periodOptions = [
    { id: 'todos', label: 'Histórico Total' },
    { id: 'dias', label: 'Últimos 7 Días' },
    { id: 'semanas', label: 'Últimas 4 Semanas' },
    { id: 'meses', label: 'Últimos 6 Meses' },
    { id: 'anios', label: 'Último Año' },
  ];

  // 1. Filtrar por Sub-Pestaña de Stock (Disponibles vs Agotados)
  const itemsByStockTab = items.filter(item => {
    if (stockTab === 'disponibles') {
      return (item.stock || 0) > 0;
    } else {
      return (item.stock || 0) === 0;
    }
  });

  // 2. Conteo dinámico por categoría dentro de la pestaña activa
  const getCategoryCount = (catId: string) => {
    if (catId === 'TODOS') return itemsByStockTab.length;
    return itemsByStockTab.filter(item => {
      const itemCat = item.categoriaNombre || 'Celulares';
      return itemCat.toLowerCase().includes(catId.toLowerCase());
    }).length;
  };

  // 3. Filtrar por categoría seleccionada
  const filteredItems = itemsByStockTab.filter(item => {
    if (selectedCategory === 'TODOS') return true;
    const itemCat = item.categoriaNombre || 'Celulares';
    return itemCat.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  // Manejo de exportación Excel (Apache POI backend con fallback)
  const handleExportExcel = async () => {
    setIsExportingExcel(true);
    try {
      await descargarReporteExcelService(selectedCategory, selectedPeriodo);
    } catch (error) {
      console.warn("Fallo exportación backend Excel POI, generando desde datos en memoria...", error);
      exportarInventarioExcel(items, selectedCategory);
    } finally {
      setIsExportingExcel(false);
    }
  };

  // Manejo de exportación PDF (OpenPDF formato A4 contable con fallback)
  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      await descargarReportePdfService(selectedCategory, selectedPeriodo);
    } catch (error) {
      console.warn("Fallo exportación backend PDF A4, abriendo visor de impresión...", error);
      exportarInventarioPDF(items, selectedCategory);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Venta física de unidad con actualización optimista (0ms)
  const handleMarcarVendido = async (productoId: string, itemId?: number) => {
    if (!itemId) return;
    setActionLoadingUnitId(itemId);
    try {
      await marcarItemVendidoOptimista(productoId, itemId);
    } finally {
      setActionLoadingUnitId(null);
    }
  };

  // Retorno físico de unidad a stock con actualización optimista (0ms)
  const handleRetornarStock = async (productoId: string, itemId?: number) => {
    if (!itemId) return;
    setActionLoadingUnitId(itemId);
    try {
      await marcarItemDisponibleOptimista(productoId, itemId);
    } finally {
      setActionLoadingUnitId(null);
    }
  };

  if (items.length === 0 && !searchTerm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[440px] bg-white rounded-3xl border border-dashed border-slate-200 p-8 sm:p-12 text-center shadow-xs">
        <div className="p-5 bg-purple-50 rounded-3xl text-purple-600 mb-5 animate-pulse border border-purple-100 shadow-inner">
          <PackageOpen size={48} className="stroke-[1.6]" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">
          ¡Tu inventario está listo para empezar!
        </h3>
        <p className="text-slate-500 max-w-md mb-6 text-xs sm:text-sm font-medium leading-relaxed">
          Actualmente no cuentas con equipos registrados bajo el nuevo modelo relacional de IMEIs y hardware físico.
        </p>
        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-purple-500/25 transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={18} />
          + Registrar Primer Celular
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden w-full transition-all">
      {/* ======================================================== */}
      {/* 1. SUB-PESTAÑAS PRINCIPALES: EN STOCK vs AGOTADOS / HISTORIAL */}
      {/* ======================================================== */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-4 pt-3">
        <div className="flex items-center gap-2">
          {/* Sub-Pestaña En Stock */}
          <button
            type="button"
            onClick={() => setStockTab('disponibles')}
            className={`flex items-center gap-2.5 px-4 py-2.5 font-extrabold text-xs rounded-t-xl border-t border-x transition-all cursor-pointer ${
              stockTab === 'disponibles'
                ? 'bg-white text-purple-700 border-slate-200 border-b-white -mb-px shadow-2xs'
                : 'bg-transparent text-slate-500 hover:text-slate-800 border-transparent'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>En Stock</span>
            <span
              className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded-full transition-all ${
                stockTab === 'disponibles'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {counts.disponibles}
            </span>
          </button>

          {/* Sub-Pestaña Agotados / Historial */}
          <button
            type="button"
            onClick={() => setStockTab('agotados')}
            className={`flex items-center gap-2.5 px-4 py-2.5 font-extrabold text-xs rounded-t-xl border-t border-x transition-all cursor-pointer ${
              stockTab === 'agotados'
                ? 'bg-white text-rose-700 border-slate-200 border-b-white -mb-px shadow-2xs'
                : 'bg-transparent text-slate-500 hover:text-slate-800 border-transparent'
            }`}
          >
            <Archive className="w-4 h-4 text-rose-500" />
            <span>Agotados / Historial</span>
            <span
              className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded-full transition-all ${
                stockTab === 'agotados'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {counts.agotados}
            </span>
          </button>
        </div>

        {/* Resumen dinámico del estado del almacén */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 pb-2">
          <span>Unidades vendidas:</span>
          <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
            {counts.itemsVendidos} u.
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. ENCABEZADO DE CONTROL: BUSCADOR, PERIODOS Y EXPORTACIONES */}
      {/* ======================================================== */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col xl:flex-row items-center justify-between gap-4 bg-white">
        {/* Buscador Rápido */}
        <div className="relative w-full xl:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Buscar por Modelo, IMEI 1/2, N° Serie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
          />
        </div>

        {/* Filtro de Periodo Contable + Botones de Acción */}
        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto justify-end">
          {/* Selector de Rango de Fecha / Periodo */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <FaCalendarAlt className="text-purple-600 text-xs" />
            <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">Periodo:</span>
            <select
              value={selectedPeriodo}
              onChange={(e) => setSelectedPeriodo(e.target.value)}
              className="bg-transparent font-bold text-slate-800 text-xs outline-none cursor-pointer"
              title="Filtro de periodo contable para reportes y rotación"
            >
              {periodOptions.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Botón Exportar Excel (Apache POI con Rotación) */}
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={isExportingExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-60"
            title="Descargar análisis de rotación e inventario en formato Excel (.xlsx)"
          >
            {isExportingExcel ? (
              <FaSpinner className="animate-spin text-emerald-600 text-xs" />
            ) : (
              <FaFileExcel className="text-emerald-600 text-sm" />
            )}
            <span>Exportar Excel</span>
          </button>

          {/* Botón Exportar PDF (OpenPDF formato A4 contable) */}
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-60"
            title="Descargar reporte contable estricto A4 con índice correlativo incremental"
          >
            {isExportingPdf ? (
              <FaSpinner className="animate-spin text-rose-600 text-xs" />
            ) : (
              <FaFilePdf className="text-rose-600 text-sm" />
            )}
            <span>Exportar PDF</span>
          </button>

          {/* Botón Agregar Producto */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer ml-auto xl:ml-0"
          >
            <FaPlus className="text-xs" /> Agregar Producto
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. BARRA DE FILTRADO POR CATEGORÍA */}
      {/* ======================================================== */}
      <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-200/80 flex items-center gap-3 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider mr-1 hidden sm:inline select-none">
          Categoría:
        </span>
        {categoryTabs.map((tab) => {
          const count = getCategoryCount(tab.id);
          const isSelected = selectedCategory === tab.id;
          const TabIcon = tab.Icon;

          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap border ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-md shadow-purple-500/20'
                  : 'bg-slate-100/80 hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 border-slate-200/70'
              }`}
            >
              <TabIcon
                className={`w-3.5 h-3.5 transition-colors ${
                  isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 text-xs font-mono font-bold rounded-full transition-all ${
                  isSelected
                    ? 'bg-white/20 text-white backdrop-blur-xs'
                    : 'bg-slate-200/80 text-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 4. TABLA PRINCIPAL DE PRODUCTOS */}
      {/* ======================================================== */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead className="bg-slate-900 text-slate-200 font-extrabold uppercase text-[11px] tracking-wider select-none">
            <tr>
              <th className="py-3 px-3 text-center w-10"></th>
              <th className="py-3 px-3 text-center w-14">Imagen</th>
              <th className="py-3 px-4">Modelo / Categoría</th>
              <th className="py-3 px-4">Capacidad / Estado</th>
              <th className="py-3 px-4 text-right">Precio (S/)</th>
              <th className="py-3 px-3 text-center w-24">Stock</th>
              <th className="py-3 px-4 text-center w-28">Visibilidad</th>
              <th className="py-3 px-4 text-center w-28">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-14 text-slate-400 font-medium">
                  <div className="flex flex-col items-center gap-2">
                    <FaBox className="text-3xl text-slate-300" />
                    <p className="text-sm font-semibold text-slate-600">
                      {stockTab === 'agotados'
                        ? `No hay productos agotados en la categoría "${selectedCategory}".`
                        : `No se encontraron productos disponibles en la categoría "${selectedCategory}".`}
                    </p>
                    <p className="text-xs text-slate-400">
                      {stockTab === 'agotados'
                        ? 'Cuando un equipo venda su última unidad física, aparecerá automáticamente aquí para preservar su historial.'
                        : 'Puedes registrar nuevos equipos haciendo clic en "+ Agregar Producto".'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const isExpanded = !!expandedRows[item.id];
                const isInactive = item.activo === false;
                const isAgotado = (item.stock || 0) === 0;

                return (
                  <React.Fragment key={item.id}>
                    {/* Fila Principal del Producto Padre */}
                    <tr
                      className={`group transition-colors ${
                        isAgotado
                          ? 'bg-rose-50/20 hover:bg-rose-50/40'
                          : isInactive
                          ? 'bg-slate-50/80 opacity-70'
                          : 'hover:bg-slate-50/90'
                      }`}
                    >
                      {/* Botón para Expandir Detalle */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => toggleRow(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-all cursor-pointer"
                          title={isExpanded ? 'Ocultar detalles técnicos' : 'Ver IMEI, N° Serie y detalles de unidades'}
                        >
                          {isExpanded ? (
                            <FaChevronUp className="text-purple-600 text-xs" />
                          ) : (
                            <FaChevronDown className="text-xs group-hover:scale-110" />
                          )}
                        </button>
                      </td>

                      {/* Miniatura de Imagen */}
                      <td className="py-3 px-3 text-center">
                        {item.imagenUrl ? (
                          <img
                            src={item.imagenUrl}
                            alt={item.modelo}
                            className={`w-10 h-10 object-contain rounded-lg border border-slate-200 bg-white p-1 mx-auto shadow-2xs ${
                              isAgotado ? 'grayscale-50 opacity-75' : ''
                            }`}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                            <FaImage className="text-sm" />
                          </div>
                        )}
                      </td>

                      {/* Modelo y Marca / Categoría */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-slate-900 text-sm line-clamp-1">
                            {item.modelo}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/60">
                              {item.categoriaNombre || 'Celulares'}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {item.color}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Capacidad y Estado */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-slate-700">
                            {item.almacenamiento} • RAM {item.ram || '8GB'}
                          </span>
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                item.estado === 'Nuevo / Sellado'
                                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                                  : item.estado === 'Open Box'
                                  ? 'text-cyan-800 bg-cyan-50 border-cyan-200'
                                  : 'text-amber-800 bg-amber-50 border-amber-200'
                              }`}
                            >
                              <FaCheckCircle className="text-[9px]" /> {item.estado}
                            </span>
                            {item.bateria && item.estado !== 'Nuevo / Sellado' && item.estado !== 'N/A (No aplica)' && (
                              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                <FaBatteryFull className="text-emerald-600 text-[10px]" /> {item.bateria}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Precio */}
                      <td className="py-3 px-4 text-right font-mono font-black text-slate-900 text-sm">
                        S/ {(item.precio || 0).toFixed(2)}
                      </td>

                      {/* Stock Calculado */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block font-extrabold px-2.5 py-1 rounded-lg border text-xs ${
                            isAgotado
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-slate-100 text-slate-800 border-slate-200'
                          }`}
                        >
                          {isAgotado ? '0 u. (Agotado)' : `${item.stock} u.`}
                        </span>
                      </td>

                      {/* Visibilidad Pública */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onToggleVisibility(item)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer border ${
                            item.activo !== false
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                          }`}
                          title={item.activo !== false ? 'Visible en tienda (Click para ocultar)' : 'Oculto en tienda (Click para activar)'}
                        >
                          {item.activo !== false ? (
                            <><FaEye className="text-emerald-600 text-xs" /> Publicado</>
                          ) : (
                            <><FaEyeSlash className="text-slate-500 text-xs" /> Oculto</>
                          )}
                        </button>
                      </td>

                      {/* Acciones Editar / Eliminar */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onOpenEditModal(item)}
                            className="text-purple-600 hover:text-purple-800 p-2 hover:bg-purple-50 rounded-xl transition-all cursor-pointer"
                            title="Editar Producto Padre"
                          >
                            <FaEdit className="text-sm" />
                          </button>
                          <button
                            onClick={() => onDeleteDevice(item.id)}
                            className="text-rose-600 hover:text-rose-800 p-2 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                            title="Eliminar Producto Padre"
                          >
                            <FaTrashAlt className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Fila Expandible con Detalle de Unidades Físicas (IMEIs) */}
                    {isExpanded && (
                      <tr className="bg-purple-50/40 border-b border-purple-100">
                        <td colSpan={8} className="p-4 pl-12 space-y-3">
                          {item.itemsCelulares && item.itemsCelulares.length > 0 ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-extrabold uppercase text-purple-900 tracking-wider">
                                  Unidades Físicas Registradas ({item.itemsCelulares.length})
                                </span>
                                <span className="text-[11px] text-purple-700 font-semibold">
                                  Acciones directas sincronizan el stock en 0ms
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {item.itemsCelulares.map((unit, uIdx) => {
                                  const isSold = unit.estadoDispositivo === 'Vendido';
                                  const isLoadingUnit = actionLoadingUnitId === unit.id;

                                  return (
                                    <div
                                      key={unit.id || uIdx}
                                      className={`p-3 rounded-xl border transition-all space-y-2 ${
                                        isSold
                                          ? 'bg-slate-50 border-slate-200 opacity-80'
                                          : 'bg-white border-purple-100 shadow-2xs'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="font-bold text-slate-800">
                                          Unidad #{uIdx + 1}
                                        </span>
                                        <span
                                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                            isSold
                                              ? 'bg-rose-100 text-rose-700'
                                              : unit.estadoDispositivo === 'Reservado'
                                              ? 'bg-amber-100 text-amber-700'
                                              : 'bg-emerald-100 text-emerald-700'
                                          }`}
                                        >
                                          {unit.estadoDispositivo || 'Disponible'}
                                        </span>
                                      </div>

                                      <div className="text-[11px] font-mono text-slate-700 space-y-0.5">
                                        <p><strong className="text-slate-400 font-sans">IMEI 1:</strong> {unit.imei1}</p>
                                        {unit.imei2 && <p><strong className="text-slate-400 font-sans">IMEI 2:</strong> {unit.imei2}</p>}
                                        {unit.numeroSerial && <p><strong className="text-slate-400 font-sans">SN:</strong> {unit.numeroSerial}</p>}
                                        {unit.bateria && <p><strong className="text-slate-400 font-sans">Batería:</strong> {unit.bateria}</p>}
                                        {unit.fechaVenta && (
                                          <p className="text-[10px] text-slate-500 font-sans">
                                            <strong>Vendido:</strong> {new Date(unit.fechaVenta).toLocaleDateString('es-PE')}
                                          </p>
                                        )}
                                      </div>

                                      {/* Botones de acción rápida por unidad con Actualización Optimista */}
                                      <div className="pt-1.5 border-t border-slate-100 flex items-center justify-end">
                                        {isSold ? (
                                          <button
                                            type="button"
                                            disabled={isLoadingUnit}
                                            onClick={() => handleRetornarStock(item.id, unit.id)}
                                            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                                            title="Retornar esta unidad vendida a Stock Disponible"
                                          >
                                            {isLoadingUnit ? (
                                              <FaSpinner className="animate-spin text-xs" />
                                            ) : (
                                              <FaUndoAlt className="text-xs" />
                                            )}
                                            <span>Reingresar a Stock</span>
                                          </button>
                                        ) : (
                                          <button
                                            type="button"
                                            disabled={isLoadingUnit}
                                            onClick={() => handleMarcarVendido(item.id, unit.id)}
                                            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                                            title="Registrar venta de esta unidad física en la caja de la tienda"
                                          >
                                            {isLoadingUnit ? (
                                              <FaSpinner className="animate-spin text-xs" />
                                            ) : (
                                              <FaShoppingCart className="text-xs" />
                                            )}
                                            <span>Vender Unidad</span>
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-purple-100 shadow-2xs">
                              {/* IMEI 1 */}
                              <div className="flex items-start gap-2.5">
                                <div className="p-2 rounded-lg bg-purple-100 text-purple-700 mt-0.5">
                                  <FaBarcode className="text-xs" />
                                </div>
                                <div>
                                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                                    IMEI Principal (1)
                                  </span>
                                  <p className="font-mono text-xs font-bold text-slate-900 mt-0.5">
                                    {item.imei || item.imei1 || 'N/A (No aplica)'}
                                  </p>
                                </div>
                              </div>

                              {/* IMEI 2 */}
                              <div className="flex items-start gap-2.5">
                                <div className="p-2 rounded-lg bg-blue-100 text-blue-700 mt-0.5">
                                  <FaFingerprint className="text-xs" />
                                </div>
                                <div>
                                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                                    IMEI Secundario (2)
                                  </span>
                                  <p className="font-mono text-xs font-bold text-slate-900 mt-0.5">
                                    {item.imei2 || 'N/A (No aplica)'}
                                  </p>
                                </div>
                              </div>

                              {/* Número de Serie */}
                              <div className="flex items-start gap-2.5">
                                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 mt-0.5">
                                  <FaHashtag className="text-xs" />
                                </div>
                                <div>
                                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                                    N° de Serie (SN)
                                  </span>
                                  <p className="font-mono text-xs font-bold text-slate-900 mt-0.5">
                                    {item.numeroSerie || item.numeroSerial || 'N/A (No aplica)'}
                                  </p>
                                </div>
                              </div>

                              {/* Descripción */}
                              <div className="flex items-start gap-2.5 sm:col-span-2 md:col-span-1">
                                <div>
                                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                                    Descripción / Notas
                                  </span>
                                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                                    {item.descripcion || 'Sin descripción adicional.'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};