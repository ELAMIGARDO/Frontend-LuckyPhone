import { luckyphoneApi } from '../api/luckyphoneApi';
import type { InventoryItem } from '../interfaces/luckyPhoneTypes';

const LOCAL_STORAGE_PRODUCTS_KEY = 'luckyphone_admin_products';

export const calculateRealStock = (item: any): number => {
  if (item.itemsCelulares && Array.isArray(item.itemsCelulares) && item.itemsCelulares.length > 0) {
    return item.itemsCelulares.filter((u: any) => u.estadoDispositivo === 'Disponible').length;
  }
  return typeof item.stock === 'number' ? item.stock : 0;
};

export const adaptProductoToInventoryItem = (item: any): InventoryItem => {
  const firstItem = item.itemsCelulares && item.itemsCelulares[0];
  const imei1Val = item.imei1 || (firstItem ? firstItem.imei1 : '');
  const imei2Val = item.imei2 || (firstItem ? firstItem.imei2 : '');
  const snVal = item.numeroSerial || (firstItem ? firstItem.numeroSerial : '');
  const batVal = item.bateria || (firstItem ? firstItem.bateria : '100%');

  const stockNeto = calculateRealStock(item);

  return {
    id: String(item.id),
    modelo: item.modelo || item.nombre || 'Producto',
    marca: item.marca || 'Apple',
    almacenamiento: item.almacenamiento || '256GB',
    ram: item.ram || '8GB',
    color: item.color || 'Estándar',
    precio: typeof item.precio === 'number' ? item.precio : parseFloat(item.precio || '0'),
    stock: stockNeto,
    imei: imei1Val,
    imei1: imei1Val,
    imei2: imei2Val,
    numeroSerie: snVal,
    numeroSerial: snVal,
    categoriaNombre: item.categoriaNombre || (item.categoria ? item.categoria.nombre : 'Celulares'),
    categoriaId: item.categoriaId || (item.categoria ? item.categoria.id : 1),
    estado: item.estado || 'Nuevo / Sellado',
    bateria: batVal,
    imagenUrl: item.imagenUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80',
    descripcion: item.descripcion || '',
    activo: item.activo !== undefined ? item.activo : true,
    itemsCelulares: item.itemsCelulares || []
  };
};

export const fetchInventoryList = async (): Promise<InventoryItem[]> => {
  try {
    const { data } = await luckyphoneApi.get<any[]>('/productos/lista-completa').catch(async () => {
      return await luckyphoneApi.get<any[]>('/v1/products/lista-completa');
    });

    if (Array.isArray(data)) {
      const adapted = data.map(adaptProductoToInventoryItem);
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(adapted));
      return adapted;
    }
    return [];
  } catch (error) {
    console.warn("No se pudo conectar al backend. Cargando inventario desde almacenamiento local...", error);
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY) || '[]');
    return Array.isArray(local) ? local.map(adaptProductoToInventoryItem) : [];
  }
};

export const updatePhysicalItemStatus = async (itemId: number, estado: 'Disponible' | 'Reservado' | 'Vendido') => {
  const { data } = await luckyphoneApi.put(`/items-celulares/${itemId}/estado`, null, {
    params: { estado }
  });
  return data;
};

export const deleteProductService = async (id: number) => {
  const { data } = await luckyphoneApi.delete(`/productos/${id}`);
  return data;
};

export const toggleProductVisibilityService = async (id: number) => {
  const { data } = await luckyphoneApi.patch(`/productos/${id}/estado`);
  return data;
};
