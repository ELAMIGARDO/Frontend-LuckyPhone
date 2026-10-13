import React, { useState } from 'react';
import {
  FaChartLine,
  FaMobileAlt,
  FaShieldAlt,
  FaStar,
  FaSyncAlt,
  FaBars,
  FaFileInvoiceDollar,
  FaSlidersH
} from 'react-icons/fa';
import { Sidebar } from '../components/ui/Sidebar';
import { ProformaDocument } from '../components/ui/ProformaDocument';
import { CustomerReviews } from '../components/home/CustomerReviews';
import { InventoryTable } from '../features/inventory/components/InventoryTable';
import { DashboardOverview } from '../features/dashboard/components/DashboardOverview';
import { ReportsPage } from '../features/reports/components/ReportsPage';
import { DeviceFormModal } from '../components/admin/DeviceFormModal';
import { WarrantiesTable } from '../components/admin/WarrantiesTable';
import { SettingsPage } from './SettingsPage';
import { useInventoryContext } from '../context/InventoryContext';
import { useDeviceForm } from '../features/inventory/hooks/useDeviceForm';
import type { TabType } from '../interfaces/luckyPhoneTypes';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('inventory');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  const { inventory, refreshInventory } = useInventoryContext();

  const {
    isModalOpen,
    setIsModalOpen,
    editingId,
    formData,
    setFormData,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleFileUpload,
    handleToggleVisibility,
    handleSaveDevice
  } = useDeviceForm();

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
      />

      <div className="flex-1 md:ml-72 flex flex-col min-h-screen min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs print:hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpenMobile(!isOpenMobile)}
              className="md:hidden text-slate-600 hover:text-slate-900 p-2 rounded-lg bg-slate-100"
            >
              <FaBars className="text-xl" />
            </button>
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 capitalize">
                {activeTab === 'metrics' && (
                  <>
                    <FaChartLine className="text-purple-600" /> Dashboard Ejecutivo & KPIs
                  </>
                )}
                {activeTab === 'inventory' && (
                  <>
                    <FaMobileAlt className="text-purple-600" /> Gestor de Inventario ({inventory.length} Equipos)
                  </>
                )}
                {activeTab === 'reports' && (
                  <>
                    <FaFileInvoiceDollar className="text-purple-600" /> Centro de Reportería & Auditoría Contable
                  </>
                )}
                {activeTab === 'proforma' && (
                  <>
                    <FaFileInvoiceDollar className="text-purple-600" /> Emisión de Proforma y Garantía
                  </>
                )}
                {activeTab === 'warranties' && (
                  <>
                    <FaShieldAlt className="text-purple-600" /> Control de Garantías de Hardware
                  </>
                )}
                {activeTab === 'reviews' && (
                  <>
                    <FaStar className="text-amber-500" /> Reseñas de Clientes
                  </>
                )}
                {activeTab === 'settings' && (
                  <>
                    <FaSlidersH className="text-purple-600" /> Ajustes y Configuración Dinámica
                  </>
                )}
              </h2>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Panel Administrativo Lucky Phone S.A.C.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-700">Servidor en Línea</span>
            </div>
            <button
              onClick={() => refreshInventory()}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl transition-colors cursor-pointer"
              title="Sincronizar inventario y métricas"
            >
              <FaSyncAlt className="text-sm" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-[1650px] mx-auto print:p-0">
          {activeTab === 'metrics' && (
            <DashboardOverview
              onNavigateInventory={() => setActiveTab('inventory')}
              onNavigateReports={() => setActiveTab('reports')}
              onNavigateProforma={() => setActiveTab('proforma')}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryTable
              onOpenCreateModal={handleOpenCreateModal}
              onOpenEditModal={handleOpenEditModal}
              onToggleVisibility={handleToggleVisibility}
            />
          )}

          {activeTab === 'reports' && <ReportsPage />}

          {activeTab === 'proforma' && <ProformaDocument />}

          {activeTab === 'warranties' && (
            <WarrantiesTable
              inventory={inventory}
              onNavigateProforma={() => setActiveTab('proforma')}
            />
          )}

          {activeTab === 'reviews' && <CustomerReviews />}

          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      <DeviceFormModal
        isOpen={isModalOpen}
        editingId={editingId}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDevice}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};