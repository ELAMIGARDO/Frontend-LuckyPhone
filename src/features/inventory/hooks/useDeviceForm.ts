import { useState } from 'react';
import type { InventoryItem } from '../../../interfaces/luckyPhoneTypes';
import type { DeviceFormData } from '../../../components/admin/DeviceFormModal';
import { useInventoryContext } from '../../../context/InventoryContext';
import {
  crearProductoService,
  actualizarProductoService,
  cambiarEstadoProductoService,
  guardarProductoLocalService
} from '../../../services/backendService';

export const getCategoriaIdByName = (nombre?: string): number => {
  if (!nombre) return 1;
  if (nombre.includes('Cargador')) return 2;
  if (nombre.includes('Audífon') || nombre.includes('Audifono')) return 3;
  if (nombre.includes('Accesorio') || nombre.includes('Otro')) return 4;
  return 1;
};

const initialFormData: DeviceFormData = {
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
  categoriaNombre: 'Celulares',
  itemsCelulares: []
};

export const useDeviceForm = () => {
  const { refreshInventory, actualizarProductoEnEstado } = useInventoryContext();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<DeviceFormData>(initialFormData);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: InventoryItem) => {
    setEditingId(item.id);
    const existingItems =
      item.itemsCelulares && item.itemsCelulares.length > 0
        ? item.itemsCelulares
        : item.imei || item.imei1
        ? [
            {
              imei1: item.imei || item.imei1 || '',
              imei2: item.imei2 || '',
              numeroSerial: item.numeroSerie || item.numeroSerial || '',
              bateria: item.bateria || '100%',
              estadoDispositivo: 'Disponible' as const
            }
          ]
        : [];

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
        setFormData((prev) => ({ ...prev, imagenUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleVisibility = async (item: InventoryItem) => {
    const updatedStatus = item.activo === false;
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
        console.warn('No se pudo actualizar estado en Spring Boot:', error);
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
    const finalImageUrl =
      formData.imagenUrl ||
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80';
    const targetCategoriaId = getCategoriaIdByName(formData.categoriaNombre);

    const itemsPayload = isCelular
      ? formData.itemsCelulares && formData.itemsCelulares.length > 0
        ? formData.itemsCelulares.map((item) => ({
            id: item.id,
            imei1: item.imei1,
            imei2: item.imei2,
            numeroSerial: item.numeroSerial,
            bateria: item.bateria || formData.bateria || '100%',
            estadoDispositivo: item.estadoDispositivo || 'Disponible'
          }))
        : [
            {
              imei1: formData.imei,
              imei2: formData.imei2,
              numeroSerial: formData.numeroSerie,
              bateria: formData.bateria || '100%',
              estadoDispositivo: 'Disponible' as const
            }
          ]
      : undefined;

    const calculatedStock =
      isCelular && itemsPayload
        ? itemsPayload.filter((i) => i.estadoDispositivo === 'Disponible').length
        : parseInt(formData.stock) || 1;

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
      console.error('Error al guardar producto en Spring Boot:', error);
      alert(
        'Atención: Hubo un problema guardando el producto en la base de datos: ' +
          (error?.response?.data?.message || error?.message || 'Error del servidor')
      );
      guardarProductoLocalService(productDataToSync);
      await refreshInventory();
    }

    setIsModalOpen(false);
  };

  return {
    isModalOpen,
    setIsModalOpen,
    editingId,
    formData,
    setFormData,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    handleFileUpload,
    handleToggleVisibility,
    handleSaveDevice
  };
};
