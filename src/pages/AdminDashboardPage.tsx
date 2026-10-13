import React, { useState } from 'react';
import {
  FaChartLine,
  FaMobileAlt,
  FaShieldAlt,
  FaStar,
  FaSyncAlt,
  FaBars,
  FaFileInvoiceDollar
} from 'react-icons/fa';
import { Sidebar } from '../components/ui/Sidebar';
import { ProformaDocument } from '../components/ui/ProformaDocument';
import { CustomerReviews } from '../components/home/CustomerReviews';
import { InventoryTable } from '../features/inventory/components/InventoryTable';
import { DashboardOverview } from '../features/dashboard/components/DashboardOverview';
import { ReportsPage } from '../features/reports/components/ReportsPage';
import { DeviceFormModal } from '../components/admin/DeviceFormModal';
import type { DeviceFormData } from '../components/admin/DeviceFormModal';
import { WarrantiesTable } from '../components/admin/WarrantiesTable';
import { SettingsPage } from './SettingsPage';
import { FaSlidersH } from 'react-icons/fa';
import { useInventoryContext } from '../context/InventoryContext';
import {
  crearProductoService,
  actualizarProductoService,
  cambiarEstadoProductoService,
  guardarProductoLocalService
} from '../services/backendService';
import type { TabType, InventoryItem } from '../interfaces/luckyPhoneTypes';

const getCategoriaIdByName = (nombre?: string): number => {
  if (!nombre) return 1;
  if (nombre.includes('Cargador')) return 2;
  if (nombre.includes('Audífon') || nombre.includes('Audifono')) return 3;
  if (nombre.includes('Accesorio') || nombre.includes('Otro')) return 4;
  return 1;
};

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('inventory');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  const {
    inventory,
    refreshInventory,
    actualizarProductoEnEstado
  } = useInventoryContext();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<DeviceFormData>({
    modelo: '',
    marca: 'Apple',
    almacenamiento: '256GB',
    ram: '8GB',
    color: '',
    precio: '',
    stock: '1',
    imei: '',
    imei2: '',
    numeroSerie: '',
    estado: 'Nuevo / Sellado',
    bateria: '100%',
    imagenUrl: '',
    descripcion: '',
    activo: true,
    categoriaNombre: 'Celulares'
  });

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      modelo: '',
      marca: 'Apple',
      almacenamiento: '256GB',
      ram: '8GB',
      color: '',
      precio: '',
      stock: '1',
      imei: '',
      imei2: '',
      numeroSerie: '',
      estado: 'Nuevo / Sellado',
      bateria: '100%',
      imagenUrl: '',
      descripcion: '',
      activo: true,
      categoriaNombre: 'Celulares'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: InventoryItem) => {
    setEditingId(item.id);
    const existingItems = (item.itemsCelulares && item.itemsCelulares.length > 0)
      ? item.itemsCelulares
      : (item.imei || item.imei1 ? [{
        imei1: item.imei || item.imei1 || '',
        imei2: item.imei2 || '',
        numeroSerial: item.numeroSerie || item.numeroSerial || '',
        bateria: item.bateria || '100%',
        estadoDispositivo: 'Disponible' as const
      }] : []);

    setFormData({
      modelo: item.modelo,
      marca: item.marca || 'Apple',
      almacenamiento: item.almacenamiento || 'N/A',
      ram: item.ram || 'N/A',
      color: item.color || 'Estándar',
      precio: item.precio.toString(),
      stock: item.stock.toString(),
      imei: item.imei || item.imei1 || '',
      imei2: item.imei2 || '',
      numeroSerie: item.numeroSerie || item.numeroSerial || '',
      categoriaNombre: item.categoriaNombre || 'Celulares',
      estado: item.estado || 'Nuevo / Sellado',
      bateria: item.bateria || '100%',
      imagenUrl: item.imagenUrl || '',
      descripcion: item.descripcion || '',
      activo: item.activo !== undefined ? item.activo : true,
      itemsCelulares: existingItems
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen pesa más de 5MB. Por favor elige una imagen más liviana.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imagenUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleVisibility = async (item: InventoryItem) => {
    const updatedStatus = item.activo === false ? true : false;
    const updatedItem = { ...item, activo: updatedStatus };

    actualizarProductoEnEstado(updatedItem);

    guardarProductoLocalService({
      id: item.id,
      nombre: `${item.marca || 'Apple'} ${item.modelo}`,
      modelo: item.modelo,
      marca: item.marca,
      almacenamiento: item.almacenamiento,
      ram: item.ram,
      color: item.color,
      precio: item.precio,
      stock: item.stock,
      imei: item.imei,
      imei2: item.imei2,
      numeroSerie: item.numeroSerie,
      estado: item.estado,
      bateria: item.bateria,
      imagenUrl: item.imagenUrl,
      descripcion: item.descripcion,
      categoriaNombre: item.categoriaNombre,
      activo: updatedStatus
    });

    const numId = Number(item.id);
    if (!isNaN(numId)) {
      try {
        await cambiarEstadoProductoService(numId);
        await refreshInventory();
      } catch (error) {
        console.warn("No se pudo actualizar estado en Spring Boot:", error);
      }
    }
  };

  const handleSaveDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.modelo || !formData.precio) {
      alert('Por favor completa los campos básicos obligatorios (Modelo y Precio).');
      return;
    }

    const isCelular = !formData.categoriaNombre || formData.categoriaNombre === 'Celulares';

    if (isCelular) {
      if (!formData.numeroSerie || formData.numeroSerie.trim().length === 0) {
        alert('⚠️ ATENCIÓN: El NÚMERO DE SERIE (SN) es obligatorio para la categoría de Celulares.');
        return;
      }

      if (!formData.imei || formData.imei.trim().length === 0) {
        alert('⚠️ ATENCIÓN: El CÓDIGO IMEI 1 es obligatorio para la categoría de Celulares.');
        return;
      }

      if (formData.imei.length > 15) {
        alert('El Código IMEI 1 debe tener como máximo 15 dígitos.');
        return;
      }

      if (formData.imei2 && formData.imei2.length > 15) {
        alert('El Código IMEI 2 debe tener como máximo 15 dígitos.');
        return;
      }
    }

    const isNuevo = formData.estado === 'Nuevo / Sellado';
    const finalId = editingId || Date.now().toString();
    const finalImageUrl = formData.imagenUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80';
    const targetCategoriaId = getCategoriaIdByName(formData.categoriaNombre);

    const itemsPayload = isCelular ? (
      (formData.itemsCelulares && formData.itemsCelulares.length > 0)
        ? formData.itemsCelulares.map(item => ({
          id: item.id,
          imei1: item.imei1,
          imei2: item.imei2,
          numeroSerial: item.numeroSerial,
          bateria: item.bateria || formData.bateria || '100%',
          estadoDispositivo: item.estadoDispositivo || 'Disponible'
        }))
        : [{
          imei1: formData.imei,
          imei2: formData.imei2,
          numeroSerial: formData.numeroSerie,
          bateria: formData.bateria || '100%',
          estadoDispositivo: 'Disponible' as const
        }]
    ) : undefined;

    const calculatedStock = isCelular && itemsPayload
      ? itemsPayload.filter(i => i.estadoDispositivo === 'Disponible').length
      : (parseInt(formData.stock) || 1);

    const cleanNombre = formData.modelo.toLowerCase().startsWith(formData.marca.toLowerCase())
      ? formData.modelo
      : `${formData.marca} ${formData.modelo}`.trim();

    const productDataToSync = {
      id: finalId,
      nombre: cleanNombre,
      descripcion: formData.descripcion || `${cleanNombre} ${formData.almacenamiento}`,
      precio: parseFloat(formData.precio),
      stock: calculatedStock,
      marca: formData.marca,
      modelo: formData.modelo,
      almacenamiento: formData.almacenamiento,
      ram: formData.ram,
      color: formData.color,
      estado: formData.estado,
      bateria: isNuevo ? '100%' : formData.bateria,
      categoriaId: targetCategoriaId,
      categoriaNombre: formData.categoriaNombre || 'Celulares',
      imagenUrl: finalImageUrl,
      numeroSerie: isCelular ? formData.numeroSerie : undefined,
      numeroSerial: isCelular ? formData.numeroSerie : undefined,
      imei: isCelular ? formData.imei : undefined,
      imei1: isCelular ? formData.imei : undefined,
      itemsCelulares: itemsPayload,
      activo: formData.activo
    };

    const numId = Number(editingId);

    try {
      if (editingId && !isNaN(numId)) {
        await actualizarProductoService(numId, productDataToSync);
      } else {
        await crearProductoService(productDataToSync);
      }
      await refreshInventory();
    } catch (error: any) {
      console.error("Error al guardar producto en Spring Boot:", error);
      alert("Atención: Hubo un problema guardando el producto en la base de datos: " + (error?.response?.data?.message || error?.message || 'Error del servidor'));
      guardarProductoLocalService(productDataToSync);
      await refreshInventory();
    }

    setIsModalOpen(false);
  };

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
                {activeTab === 'metrics' && <><FaChartLine className="text-purple-600" /> Dashboard Ejecutivo & KPIs</>}
                {activeTab === 'inventory' && <><FaMobileAlt className="text-purple-600" /> Gestor de Inventario ({inventory.length} Equipos)</>}
                {activeTab === 'reports' && <><FaFileInvoiceDollar className="text-purple-600" /> Centro de Reportería & Auditoría Contable</>}
                {activeTab === 'proforma' && <><FaFileInvoiceDollar className="text-purple-600" /> Emisión de Proforma y Garantía</>}
                {activeTab === 'warranties' && <><FaShieldAlt className="text-purple-600" /> Control de Garantías de Hardware</>}
                {activeTab === 'reviews' && <><FaStar className="text-amber-500" /> Reseñas de Clientes</>}
                {activeTab === 'settings' && <><FaSlidersH className="text-purple-600" /> Ajustes y Configuración Dinámica</>}
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
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl transition-colors"
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