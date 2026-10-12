import React from 'react';
import type { InventoryItem } from '../../interfaces/luckyPhoneTypes';
import { useWarranties } from './warranties/useWarranties';
import { WarrantyToolbar } from './warranties/WarrantyToolbar';
import { WarrantyTableRow } from './warranties/WarrantyTableRow';
import { AnularWarningModal } from './warranties/AnularWarningModal';
import { EditWarrantyModal } from './warranties/EditWarrantyModal';
import { ProformaPreviewA4 } from '../ui/ProformaPreviewA4';

export type { Garantia } from './warranties/useWarranties';

interface WarrantiesTableProps {
  inventory?: InventoryItem[];
}

export const WarrantiesTable: React.FC<WarrantiesTableProps> = () => {
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

      {/* TABLA DE CONTENIDO */}
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
            {listadoFiltrado.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-slate-400 font-medium">
                  {isAnulados
                    ? 'No hay registros en la papelera de reciclaje.'
                    : 'No se encontraron garantías que coincidan con los filtros seleccionados.'}
                </td>
              </tr>
            ) : (
              listadoFiltrado.map((garantia) => (
                <WarrantyTableRow
                  key={garantia.id}
                  garantia={garantia}
                  isAnulados={isAnulados}
                  loading={loading}
                  onAnular={handleOpenAnularModal}
                  onRestaurar={handleRestaurar}
                  onEdit={handleOpenEditModal}
                  onReimprimir={handleReimprimirProforma}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

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