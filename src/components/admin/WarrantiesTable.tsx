import React from 'react';
import type { InventoryItem } from '../../interfaces/luckyPhoneTypes';
import { useWarranties } from './warranties/useWarranties';
import { WarrantyToolbar } from './warranties/WarrantyToolbar';
import { WarrantyTableRow } from './warranties/WarrantyTableRow';
import { AnularWarningModal } from './warranties/AnularWarningModal';
import { EditWarrantyModal } from './warranties/EditWarrantyModal';
import { ProformaPreviewA4 } from '../ui/ProformaPreviewA4';

import { ShieldAlert, Plus } from 'lucide-react';
export type { Garantia } from './warranties/useWarranties';

interface WarrantiesTableProps {
  inventory?: InventoryItem[];
  onNavigateProforma?: () => void;
}

export const WarrantiesTable: React.FC<WarrantiesTableProps> = ({ onNavigateProforma }) => {
  const {
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    filtroCobertura,
    setFiltroCobertura,
    filtroCategoria,
    setFiltroCategoria,
    isModalOpen,
    setIsModalOpen,
    selectedGarantia,
    setSelectedGarantia,
    isEditModalOpen,
    setIsEditModalOpen,
    garantiaEditando,
    setGarantiaEditando,
    printGarantia,
    loading,
    countTotales,
    countVigentes,
    countCaducados,
    countAnulados,
    listadoFiltrado,
    handleOpenAnularModal,
    ejecutarAnulacion,
    handleRestaurar,
    handlePagarProforma,
    handleOpenEditModal,
    handleUpdateGarantia,
    handleReimprimirProforma
  } = useWarranties();

  const isAnulados = activeTab === 'anulados';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden w-full transition-all font-sans text-slate-800 space-y-0">
      {/* 🛠️ BARRA DE HERRAMIENTAS UNIFICADA */}
      <WarrantyToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filtroCobertura={filtroCobertura}
        onCoberturaChange={setFiltroCobertura}
        filtroCategoria={filtroCategoria}
        onCategoriaChange={setFiltroCategoria}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        countTotales={countTotales}
        countVigentes={countVigentes}
        countCaducados={countCaducados}
        countAnulados={countAnulados}
      />

      {/* TABLA DE CONTENIDO O EMPTY STATE */}
      {listadoFiltrado.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[380px] p-8 sm:p-12 text-center bg-white border-t border-slate-100">
          <div className="p-4 bg-purple-50 rounded-3xl text-purple-600 mb-4 animate-pulse border border-purple-100 shadow-inner">
            <ShieldAlert size={44} className="stroke-[1.6]" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">
            {isAnulados
              ? 'La papelera de reciclaje está vacía'
              : searchTerm
              ? `Sin resultados para "${searchTerm}"`
              : 'Aún no hay garantías registradas'}
          </h3>
          <p className="text-slate-500 max-w-sm mb-6 text-xs sm:text-sm font-medium leading-relaxed">
            {isAnulados
              ? 'No tienes pólizas anuladas en este momento. Las pólizas anuladas se conservan aquí.'
              : searchTerm
              ? 'Prueba modificando los términos de búsqueda, limpiando los filtros o cambiando de pestaña.'
              : 'Emite tu primera proforma comercial para activar la póliza y protección legal del hardware.'}
          </p>
          {onNavigateProforma && !isAnulados && (
            <button
              onClick={onNavigateProforma}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-purple-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <Plus size={18} />
              + Emitir Nueva Proforma
            </button>
          )}
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead className="bg-slate-900 text-slate-200 font-extrabold uppercase text-[11px] tracking-wider select-none">
              <tr>
                <th className="py-3 px-4">ID Control</th>
                <th className="py-3 px-4">Cliente / DNI</th>
                <th className="py-3 px-4">Producto / Categoría</th>
                <th className="py-3 px-4">IMEI / Serie</th>
                <th className="py-3 px-4">Cobertura</th>
                <th className="py-3 px-4">Activación</th>
                <th className="py-3 px-4">Vencimiento</th>
                <th className="py-3 px-4 text-center">Estado Legal</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold">
              {listadoFiltrado.map((garantia) => (
                <WarrantyTableRow
                  key={garantia.id}
                  garantia={garantia}
                  isAnulados={isAnulados}
                  loading={loading}
                  onAnular={handleOpenAnularModal}
                  onRestaurar={handleRestaurar}
                  onPagar={handlePagarProforma}
                  onEdit={handleOpenEditModal}
                  onReimprimir={handleReimprimirProforma}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🖨️ CONTENEDOR OCULTO DE REIMPRESIÓN PROFORMA A4 */}
      {printGarantia && (
        <div className="hidden print:block">
          <ProformaPreviewA4
            data={{
              codigoProforma: printGarantia.id,
              emisorNombre: 'Asesor LuckyPhone',
              clienteNombre: printGarantia.cliente,
              clienteDni: printGarantia.dni,
              clienteTelefono: printGarantia.telefono || 'Sin teléfono',
              clienteDireccion: printGarantia.direccion || 'Dirección Registrada',
              categoria: printGarantia.categoria,
              productoModelo: printGarantia.celular,
              imei1: printGarantia.imei1 || '',
              imei2: printGarantia.imei2 || '',
              numeroSerie: printGarantia.numeroSerie || '',
              precioBase: printGarantia.precioBase || 0,
              descuentoTipo: 'soles',
              descuentoValor: 0,
              duracionGarantia: printGarantia.duracionGarantia || '12 Meses'
            }}
            precioFinal={printGarantia.precioBase || 0}
            montoDescuento={0}
            fechaEmision={printGarantia.activacion}
            fechaFinGarantia={printGarantia.caducidad}
          />
        </div>
      )}

      {/* ✏️ MODAL DE EDICIÓN DE GARANTÍA */}
      {isEditModalOpen && garantiaEditando && (
        <EditWarrantyModal
          garantia={garantiaEditando}
          loading={loading}
          onClose={() => {
            setIsEditModalOpen(false);
            setGarantiaEditando(null);
          }}
          onSave={handleUpdateGarantia}
        />
      )}

      {/* ⚠️ MODAL DE ADVERTENCIA CRÍTICA DE ANULACIÓN */}
      {isModalOpen && selectedGarantia && (
        <AnularWarningModal
          garantia={selectedGarantia}
          loading={loading}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedGarantia(null);
          }}
          onConfirm={ejecutarAnulacion}
        />
      )}
    </div>
  );
};