import { luckyphoneApi } from '../api/luckyphoneApi';
import type { InventoryItem } from '../interfaces/luckyPhoneTypes';

const LOCAL_STORAGE_PRODUCTS_KEY = 'luckyphone_admin_products';

export interface PhysicalUnitDTO {
  id?: number;
  imei1: string;
  imei2?: string;
  numeroSerial?: string;
  bateria?: string;
  estadoDispositivo?: 'Disponible' | 'Reservado' | 'Vendido' | string;
  estado?: string;
  status?: string;
  fechaVenta?: string | null;
}

export interface ProductBackendResponse {
  id: number | string;
  modelo?: string;
  nombre?: string;
  marca?: string;
  almacenamiento?: string;
  ram?: string;
  color?: string;
  precio?: number | string;
  stock?: number;
  imei?: string;
  imei1?: string;
  imei2?: string;
  numeroSerie?: string;
  numeroSerial?: string;
  categoria?: { id: number; nombre: string } | string;
  categoriaNombre?: string;
  categoriaId?: number;
  estado?: string;
  bateria?: string;
  imagenUrl?: string;
  descripcion?: string;
  activo?: boolean;
  itemsCelulares?: PhysicalUnitDTO[];
}

export const isPhysicalUnitAvailable = (unit?: PhysicalUnitDTO | null): boolean => {
  if (!unit) return false;
  const rawStatus = unit.estadoDispositivo ?? unit.estado ?? unit.status;
  if (typeof rawStatus !== 'string') return false;
  return rawStatus.trim().toUpperCase() === 'DISPONIBLE';
};

export const isPhysicalUnitSold = (unit?: PhysicalUnitDTO | null): boolean => {
  if (!unit) return false;
  const rawStatus = unit.estadoDispositivo ?? unit.estado ?? unit.status;
  if (typeof rawStatus !== 'string') return false;
  return rawStatus.trim().toUpperCase() === 'VENDIDO';
};

export const calculateRealStock = (
  item: { itemsCelulares?: PhysicalUnitDTO[]; stock?: number }
): number => {
  if (item.itemsCelulares && Array.isArray(item.itemsCelulares) && item.itemsCelulares.length > 0) {
    return item.itemsCelulares.filter(isPhysicalUnitAvailable).length;
  }
  return typeof item.stock === 'number' && !isNaN(item.stock) ? Math.max(0, item.stock) : 0;
};

export const adaptProductoToInventoryItem = (item: ProductBackendResponse): InventoryItem => {
  const units = item.itemsCelulares ?? [];
  const firstItem = units.length > 0 ? units[0] : undefined;

  const imei1Val = item.imei1 || (firstItem ? firstItem.imei1 : '') || item.imei || '';
  const imei2Val = item.imei2 || (firstItem ? (firstItem.imei2 ?? '') : '') || '';
  const snVal = item.numeroSerial || item.numeroSerie || (firstItem ? (firstItem.numeroSerial ?? '') : '') || '';
  const batVal = item.bateria || (firstItem ? (firstItem.bateria ?? '100%') : '100%');

  const stockNeto = calculateRealStock(item);

  const resolvedCategoriaNombre =
    typeof item.categoria === 'object' && item.categoria !== null
      ? item.categoria.nombre
      : typeof item.categoria === 'string'
      ? item.categoria
      : item.categoriaNombre || 'Celulares';

  const resolvedCategoriaId =
    typeof item.categoria === 'object' && item.categoria !== null
      ? item.categoria.id
      : item.categoriaId || 1;

  return {
    id: String(item.id),
    modelo: item.modelo || item.nombre || 'Producto',
    marca: item.marca || 'Apple',
    almacenamiento: item.almacenamiento || '256GB',
    ram: item.ram || '8GB',
    color: item.color || 'Estándar',
    precio: typeof item.precio === 'number' ? item.precio : parseFloat(String(item.precio || '0')),
    stock: stockNeto,
    imei: imei1Val,
    imei1: imei1Val,
    imei2: imei2Val,
    numeroSerie: snVal,
    numeroSerial: snVal,
    categoriaNombre: resolvedCategoriaNombre,
    categoriaId: resolvedCategoriaId,
    estado: item.estado || 'Nuevo / Sellado',
    bateria: batVal,
    imagenUrl: item.imagenUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80',
    descripcion: item.descripcion || '',
    activo: item.activo !== undefined ? item.activo : true,
    itemsCelulares: units.map((u) => ({
      id: u.id,
      imei1: u.imei1,
      imei2: u.imei2,
      numeroSerial: u.numeroSerial,
      bateria: u.bateria,
      estadoDispositivo: (u.estadoDispositivo ?? u.estado ?? u.status ?? 'Disponible') as
        | 'Disponible'
        | 'Reservado'
        | 'Vendido',
      fechaVenta: u.fechaVenta ?? undefined,
    })),
  };
};

export const fetchInventoryList = async (): Promise<InventoryItem[]> => {
  try {
    const { data } = await luckyphoneApi.get<ProductBackendResponse[]>('/productos/lista-completa').catch(async () => {
      return await luckyphoneApi.get<ProductBackendResponse[]>('/v1/products/lista-completa');
    });

    if (Array.isArray(data)) {
      const adapted = data.map(adaptProductoToInventoryItem);
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(adapted));
      return adapted;
    }
    return [];
  } catch (error) {
    console.warn('Error al conectar con backend. Leyendo inventario desde almacenamiento local.', error);
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY) || '[]');
    return Array.isArray(local) ? local.map(adaptProductoToInventoryItem) : [];
  }
};

export const updatePhysicalItemStatus = async (
  itemId: number,
  estado: 'Disponible' | 'Reservado' | 'Vendido'
) => {
  const { data } = await luckyphoneApi.put(`/items-celulares/${itemId}/estado`, null, {
    params: { estado },
  });
  return data;
};

export const deleteProductService = async (id: number | string) => {
  const { data } = await luckyphoneApi.delete(`/productos/${id}`);
  return data;
};

export const toggleProductVisibilityService = async (id: number | string) => {
  const { data } = await luckyphoneApi.patch(`/productos/${id}/estado`);
  return data;
};
