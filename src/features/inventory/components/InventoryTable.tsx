import React, { useState } from 'react';
import {
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Archive,
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ShoppingCart,
  Loader2,
  Layers,
  Zap,
  Headphones,
  Shield,
  Battery,
  Barcode,
  Hash,
  Image as ImageIcon
} from 'lucide-react';
import type { InventoryItem } from '../../../interfaces/luckyPhoneTypes';
import { useInventory, type InventoryProductItem } from '../hooks/useInventory';

interface InventoryTableProps {
  onOpenCreateModal: () => void;
  onOpenEditModal: (item: InventoryItem) => void;
  onToggleVisibility: (item: InventoryItem) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  onOpenCreateModal,
  onOpenEditModal,
  onToggleVisibility
}) => {
  const {
    filteredItems,
    counts,
    stockTab,
    setStockTab,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    getCategoryCount,
    marcarItemVendido,
    marcarItemDisponible,
    eliminarProducto
  } = useInventory();

  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [actionLoadingUnitId, setActionLoadingUnitId] = useState<number | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categoryTabs = [
    { id: 'TODOS', label: 'Todos', Icon: Layers },
    { id: 'Celulares', label: 'Celulares', Icon: Smartphone },
    { id: 'Cargadores', label: 'Cargadores', Icon: Zap },
    { id: 'Audífonos', label: 'Audífonos', Icon: Headphones },
    { id: 'Accesorios', label: 'Accesorios', Icon: Shield }
  ];

  const handleMarcarVendido = async (productoId: string, itemId?: number) => {
    if (!itemId) return;
    setActionLoadingUnitId(itemId);
    try {
      await marcarItemVendido(productoId, itemId);
    } finally {
      setActionLoadingUnitId(null);
    }
  };

  const handleRetornarStock = async (productoId: string, itemId?: number) => {
    if (!itemId) return;
    setActionLoadingUnitId(itemId);
    try {
      await marcarItemDisponible(productoId, itemId);
    } finally {
      setActionLoadingUnitId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Confirmas que deseas eliminar este producto del inventario?')) {
      await eliminarProducto(id);
    }
  };

  const renderBadgeEstadoProducto = (estado: string) => {
    if (estado === 'Nuevo / Sellado') {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md px-2 py-0.5 text-[11px] font-medium">
          <CheckCircle className="w-3 h-3 text-emerald-600" />
          {estado}
        </span>
      );
    }
    if (estado === 'Open Box') {
      return (
        <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-md px-2 py-0.5 text-[11px] font-medium">
          <CheckCircle className="w-3 h-3 text-sky-600" />
          {estado}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md px-2 py-0.5 text-[11px] font-medium">
        <AlertTriangle className="w-3 h-3 text-amber-600" />
        {estado}
      </span>
    );
  };

  const renderBadgeStock = (item: InventoryProductItem) => {
    if (item.stockDisponibleReal === 0) {
      return (
        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 rounded-md px-2 py-0.5 text-xs font-medium font-mono">
          <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
          0 u. (Sin stock)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md px-2 py-0.5 text-xs font-medium font-mono">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        {item.stockDisponibleReal} u.
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden w-full">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 pt-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStockTab('disponibles')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-md border-t border-x transition-colors cursor-pointer ${
              stockTab === 'disponibles'
                ? 'bg-white text-slate-900 border-slate-200 border-b-white -mb-px'
                : 'bg-transparent text-slate-500 hover:text-slate-800 border-transparent'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>En Stock</span>
            <span
              className={`px-1.5 py-0.2 text-[11px] font-mono font-bold rounded-md ${
                stockTab === 'disponibles'
                  ? 'bg-slate-100 text-slate-900'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {counts.disponibles}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStockTab('agotados')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-md border-t border-x transition-colors cursor-pointer ${
              stockTab === 'agotados'
                ? 'bg-white text-red-700 border-slate-200 border-b-white -mb-px'
                : 'bg-transparent text-slate-500 hover:text-slate-800 border-transparent'
            }`}
          >
            <Archive className="w-4 h-4 text-red-600" />
            <span>Agotados / Historial</span>
            <span
              className={`px-1.5 py-0.2 text-[11px] font-mono font-bold rounded-md ${
                stockTab === 'agotados'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {counts.agotados}
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-600 pb-2">
          <span>Unidades vendidas:</span>
          <span className="font-mono font-semibold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
            {counts.itemsVendidos} u.
          </span>
        </div>
      </div>

      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por Modelo, Marca, IMEI, Serie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Producto</span>
          </button>
        </div>
      </div>

      <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
          Categoría:
        </span>
        {categoryTabs.map((tab) => {
          const count = getCategoryCount(tab.id);
          const isSelected = selectedCategory === tab.id;
          const IconComp = tab.Icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:border-slate-300'
              }`}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 text-[11px] font-mono rounded-md ${
                  isSelected ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead className="bg-slate-100 text-slate-700 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3 text-center w-10"></th>
              <th className="py-2.5 px-3 text-center w-14">Imagen</th>
              <th className="py-2.5 px-4">Modelo / Categoría</th>
              <th className="py-2.5 px-4">Capacidad / Estado</th>
              <th className="py-2.5 px-4 text-right">Precio (S/)</th>
              <th className="py-2.5 px-3 text-center w-36">Stock</th>
              <th className="py-2.5 px-4 text-center w-28">Visibilidad</th>
              <th className="py-2.5 px-4 text-center w-24">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-500 font-medium">
                  <div className="flex flex-col items-center gap-2">
                    <Smartphone className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-700">
                      {stockTab === 'agotados'
                        ? `No hay productos agotados en la categoría "${selectedCategory}".`
                        : `No se encontraron productos en stock para "${selectedCategory}".`}
                    </p>
                    <p className="text-xs text-slate-400">
                      {stockTab === 'agotados'
                        ? 'Las unidades vendidas pasarán automáticamente a esta vista al llegar a 0 de stock disponible.'
                        : 'Puedes registrar nuevos equipos con el botón superior.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const isExpanded = Boolean(expandedRows[item.id]);
                const isInactive = item.activo === false;
                const isAgotado = item.stockDisponibleReal === 0;

                return (
                  <React.Fragment key={item.id}>
                    <tr
                      className={`group transition-colors ${
                        isAgotado
                          ? 'bg-red-50/20 hover:bg-red-50/40'
                          : isInactive
                          ? 'bg-slate-50 opacity-70'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleRow(item.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                          title={isExpanded ? 'Ocultar unidades' : 'Ver unidades registradas'}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-700" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-3 text-center">
                        {item.imagenUrl ? (
                          <img
                            src={item.imagenUrl}
                            alt={item.modelo}
                            className={`w-10 h-10 object-contain rounded-md border border-slate-200 bg-white p-1 mx-auto ${
                              isAgotado ? 'opacity-60' : ''
                            }`}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-md border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 text-sm line-clamp-1">
                            {item.modelo}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-md px-1.5 py-0.5">
                              {item.categoriaNombre || 'Celulares'}
                            </span>
                            <span className="text-slate-500 text-[11px]">{item.color}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-slate-800">
                            {item.almacenamiento} • RAM {item.ram || '8GB'}
                          </span>
                          <div className="flex items-center gap-2">
                            {renderBadgeEstadoProducto(item.estado)}
                            {item.bateria &&
                              item.estado !== 'Nuevo / Sellado' &&
                              item.estado !== 'N/A (No aplica)' && (
                                <span className="text-[11px] text-slate-500 font-medium inline-flex items-center gap-1">
                                  <Battery className="w-3.5 h-3.5 text-slate-400" />
                                  {item.bateria}
                                </span>
                              )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 text-sm">
                        S/ {(item.precio || 0).toFixed(2)}
                      </td>

                      <td className="py-3 px-3 text-center">{renderBadgeStock(item)}</td>

                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => onToggleVisibility(item)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                            item.activo !== false
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                          title={item.activo !== false ? 'Ocultar en catálogo' : 'Publicar en catálogo'}
                        >
                          {item.activo !== false ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Publicado</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Oculto</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => onOpenEditModal(item)}
                            className="text-slate-600 hover:text-slate-900 p-1.5 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Editar datos del producto"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-slate-50/70 border-b border-slate-200">
                        <td colSpan={8} className="p-4 pl-12 space-y-3">
                          {item.itemsCelulares && item.itemsCelulares.length > 0 ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-700">
                                  Unidades Físicas Registradas ({item.itemsCelulares.length})
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  El stock se recalcula y sincroniza automáticamente
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {item.itemsCelulares.map((unit, uIdx) => {
                                  const isSold =
                                    (unit.estadoDispositivo ?? '').toUpperCase() === 'VENDIDO';
                                  const isReserved =
                                    (unit.estadoDispositivo ?? '').toUpperCase() === 'RESERVADO';
                                  const isLoadingUnit = actionLoadingUnitId === unit.id;

                                  return (
                                    <div
                                      key={unit.id ?? uIdx}
                                      className={`p-3 rounded-md border transition-colors space-y-2 ${
                                        isSold
                                          ? 'bg-slate-50 border-slate-200 text-slate-600'
                                          : 'bg-white border-slate-200 shadow-2xs'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="font-semibold text-slate-800">
                                          Unidad #{uIdx + 1}
                                        </span>
                                        <span
                                          className={`text-[11px] px-2 py-0.5 rounded-md font-medium border ${
                                            isSold
                                              ? 'bg-red-50 text-red-700 border-red-200'
                                              : isReserved
                                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                          }`}
                                        >
                                          {unit.estadoDispositivo || 'Disponible'}
                                        </span>
                                      </div>

                                      <div className="text-[11px] font-mono text-slate-700 space-y-0.5">
                                        <p>
                                          <strong className="text-slate-400 font-sans">IMEI 1:</strong>{' '}
                                          {unit.imei1}
                                        </p>
                                        {unit.imei2 && (
                                          <p>
                                            <strong className="text-slate-400 font-sans">IMEI 2:</strong>{' '}
                                            {unit.imei2}
                                          </p>
                                        )}
                                        {unit.numeroSerial && (
                                          <p>
                                            <strong className="text-slate-400 font-sans">SN:</strong>{' '}
                                            {unit.numeroSerial}
                                          </p>
                                        )}
                                        {unit.bateria && (
                                          <p>
                                            <strong className="text-slate-400 font-sans">Batería:</strong>{' '}
                                            {unit.bateria}
                                          </p>
                                        )}
                                        {unit.fechaVenta && (
                                          <p className="text-[10px] text-slate-500 font-sans">
                                            <strong>Vendido:</strong>{' '}
                                            {new Date(unit.fechaVenta).toLocaleDateString('es-PE')}
                                          </p>
                                        )}
                                      </div>

                                      <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                                        {isSold ? (
                                          <button
                                            type="button"
                                            disabled={isLoadingUnit}
                                            onClick={() => handleRetornarStock(item.id, unit.id)}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                                            title="Reingresar esta unidad vendida a Stock Disponible"
                                          >
                                            {isLoadingUnit ? (
                                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                              <RotateCcw className="w-3.5 h-3.5" />
                                            )}
                                            <span>Reingresar a Stock</span>
                                          </button>
                                        ) : (
                                          <button
                                            type="button"
                                            disabled={isLoadingUnit}
                                            onClick={() => handleMarcarVendido(item.id, unit.id)}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                                            title="Registrar venta de esta unidad física"
                                          >
                                            {isLoadingUnit ? (
                                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                              <ShoppingCart className="w-3.5 h-3.5" />
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white p-3.5 rounded-md border border-slate-200">
                              <div className="flex items-start gap-2">
                                <Barcode className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                <div>
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    IMEI Principal
                                  </span>
                                  <p className="font-mono text-xs font-semibold text-slate-800 mt-0.5">
                                    {item.imei || item.imei1 || 'N/A'}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <Barcode className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                <div>
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    IMEI Secundario
                                  </span>
                                  <p className="font-mono text-xs font-semibold text-slate-800 mt-0.5">
                                    {item.imei2 || 'N/A'}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <Hash className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                <div>
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    N° de Serie
                                  </span>
                                  <p className="font-mono text-xs font-semibold text-slate-800 mt-0.5">
                                    {item.numeroSerie || item.numeroSerial || 'N/A'}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2 sm:col-span-2 md:col-span-1">
                                <div>
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Descripción
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
