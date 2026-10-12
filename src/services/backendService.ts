import { luckyphoneApi } from '../api/luckyphoneApi';
import type {
  ProductoResponseDTO,
  ProductoRequestDTO,
  PageResponse,
  CategoriaResponseDTO,
  LoginRequestDTO,
  AuthResponseDTO,
  RegistroRequestDTO,
  ClienteResponseDTO
} from '../interfaces';

const LOCAL_STORAGE_PRODUCTS_KEY = 'luckyphone_admin_products';

export const getProductosPaginadosService = async (page = 0, size = 12): Promise<PageResponse<ProductoResponseDTO>> => {
  try {
    const { data } = await luckyphoneApi.get<PageResponse<ProductoResponseDTO>>(`/productos/lista`, {
      params: { page, size }
    });
    
    const localSaved: ProductoResponseDTO[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY) || '[]');
    const activeLocal = localSaved.filter((p: any) => p.activo !== false);

    if (activeLocal.length > 0) {
      const backendIds = new Set((data.content || []).map(p => String(p.id)));
      const uniqueLocal = activeLocal.filter(p => !backendIds.has(String(p.id)));

      const combined = [...uniqueLocal, ...(data.content || [])];
      return {
        ...data,
        content: combined,
        totalElements: (data.totalElements || 0) + uniqueLocal.length
      };
    }

    return data;
  } catch (error) {
    console.warn("Backend Spring Boot no disponible. Usando datos guardados en localStorage...", error);
    const localSaved: ProductoResponseDTO[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY) || '[]');
    const activeLocal = localSaved.filter((p: any) => p.activo !== false);
    return {
      content: activeLocal,
      totalElements: activeLocal.length,
      totalPages: 1,
      size: size,
      number: page,
      first: page === 0,
      last: true,
      empty: activeLocal.length === 0
    };
  }
};

export const getProductosAdminListaCompletaService = async (): Promise<ProductoResponseDTO[]> => {
  try {
    const { data } = await luckyphoneApi.get<any[]>(`/productos/lista-completa`);
    const mapped: ProductoResponseDTO[] = data.map(p => ({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      stock: p.stock !== undefined ? p.stock : (p.itemsCelulares ? p.itemsCelulares.filter((i: any) => i.estadoDispositivo === 'Disponible').length : 0),
      marca: p.marca,
      modelo: p.modelo,
      almacenamiento: p.almacenamiento,
      ram: p.ram,
      color: p.color,
      estado: p.estado,
      bateria: p.bateria || (p.itemsCelulares && p.itemsCelulares[0] ? p.itemsCelulares[0].bateria : '100%'),
      imagenUrl: p.imagenUrl,
      whatsappLink: p.whatsappLink || `https://wa.me/51912345678?text=Hola,%20deseo%20comprar%20el%20${encodeURIComponent(p.nombre || p.modelo || '')}`,
      activo: p.activo !== undefined ? p.activo : true,
      itemsCelulares: p.itemsCelulares || [],
      categoriaNombre: p.categoria ? p.categoria.nombre : (p.categoriaNombre || 'Celulares'),
      categoriaId: p.categoria ? p.categoria.id : p.categoriaId
    }));

    localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(mapped));
    return mapped;
  } catch (error) {
    console.warn("No se pudo obtener la lista completa del backend. Usando cache local.", error);
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY) || '[]');
  }
};

export const getColoresDisponiblesService = async (): Promise<string[]> => {
  try {
    const { data } = await luckyphoneApi.get<string[]>(`/productos/colores-disponibles`);
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (error) {
    console.warn("No se pudo obtener colores del endpoint dedicado. Extrayendo de productos en memoria.", error);
  }
  // Fallback seguro: extraer de productos en localStorage o memoria
  try {
    const prods = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY) || '[]');
    const unique = Array.from(new Set(prods.map((p: any) => p.color?.trim()).filter(Boolean))) as string[];
    return unique.sort();
  } catch {
    return ['Negro', 'Blanco', 'Titanio Natural', 'Titanio Azul', 'Titanio Negro', 'Plata', 'Oro'];
  }
};

export const guardarProductoLocalService = (prod: any) => {
  try {
    const prev = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY) || '[]');
    const existingIndex = prev.findIndex((p: any) => String(p.id) === String(prod.id) || (p.modelo && p.modelo === prod.modelo));
    
    const newProd: ProductoResponseDTO & { imei?: string; imei2?: string; numeroSerie?: string; activo?: boolean } = {
      id: prod.id || Date.now(),
      nombre: prod.nombre || `${prod.marca || ''} ${prod.modelo || ''}`,
      descripcion: prod.descripcion || '',
      precio: prod.precio,
      stock: prod.stock,
      marca: prod.marca,
      modelo: prod.modelo,
      almacenamiento: prod.almacenamiento,
      ram: prod.ram,
      color: prod.color,
      estado: prod.estado,
      bateria: prod.bateria || '100%',
      imagenUrl: prod.imagenUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80',
      whatsappLink: `https://wa.me/51912345678?text=Hola,%20deseo%20comprar%20el%20${encodeURIComponent(prod.nombre || prod.modelo)}`,
      imei: prod.imei,
      imei2: prod.imei2,
      numeroSerie: prod.numeroSerie,
      activo: prod.activo !== undefined ? prod.activo : true
    };

    let updated = [];
    if (existingIndex >= 0) {
      updated = [...prev];
      updated[existingIndex] = newProd;
    } else {
      updated = [newProd, ...prev];
    }
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(updated));
    return newProd;
  } catch (e) {
    console.error("Error guardando producto en localStorage", e);
  }
};

export const eliminarProductoLocalService = (id: string | number) => {
  try {
    const prev = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY) || '[]');
    const updated = prev.filter((p: any) => String(p.id) !== String(id));
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Error eliminando producto de localStorage", e);
  }
};

export const buscarProductosService = async (nombre: string): Promise<ProductoResponseDTO[]> => {
  const { data } = await luckyphoneApi.get<ProductoResponseDTO[]>(`/productos/buscar`, {
    params: { nombre }
  });
  return data;
};

export const getProductoByIdService = async (id: number | string): Promise<ProductoResponseDTO> => {
  const { data } = await luckyphoneApi.get<ProductoResponseDTO>(`/productos/${id}`);
  return data;
};

export const getCategoriasService = async (): Promise<CategoriaResponseDTO[]> => {
  const { data } = await luckyphoneApi.get<CategoriaResponseDTO[]>(`/categorias`);
  return data;
};

export const getTerminosService = async (): Promise<string> => {
  const { data } = await luckyphoneApi.get<string>(`/politicas/terminos`);
  return data;
};

export const getPrivacidadService = async (): Promise<string> => {
  const { data } = await luckyphoneApi.get<string>(`/politicas/privacidad`);
  return data;
};

export const loginService = async (dto: LoginRequestDTO): Promise<AuthResponseDTO> => {
  const { data } = await luckyphoneApi.post<AuthResponseDTO>(`/auth/login`, dto);
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ email: data.email, rol: data.rol }));
  }
  return data;
};

export const registroService = async (dto: RegistroRequestDTO): Promise<ClienteResponseDTO> => {
  const { data } = await luckyphoneApi.post<ClienteResponseDTO>(`/auth/registro`, dto);
  return data;
};

export const logoutService = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const crearProductoService = async (dto: ProductoRequestDTO): Promise<ProductoResponseDTO | null> => {
  const { data } = await luckyphoneApi.post<ProductoResponseDTO>(`/productos`, dto);
  return data;
};

export const actualizarProductoService = async (id: number, dto: ProductoRequestDTO): Promise<ProductoResponseDTO> => {
  const { data } = await luckyphoneApi.put<ProductoResponseDTO>(`/productos/${id}`, dto);
  return data;
};

export const eliminarProductoService = async (id: number): Promise<void> => {
  await luckyphoneApi.delete(`/productos/${id}`);
};

export const cambiarEstadoProductoService = async (id: number): Promise<ProductoResponseDTO> => {
  const { data } = await luckyphoneApi.patch<ProductoResponseDTO>(`/productos/${id}/estado`);
  return data;
};

// ==========================================
// SERVICIOS PARA ITEMS CELULARES (HARDWARE)
// ==========================================

export const getItemsCelularesDisponiblesService = async (productoId?: number) => {
  const { data } = await luckyphoneApi.get(`/items-celulares/disponibles`, {
    params: productoId ? { productoId } : {}
  });
  return data;
};

export const agregarItemCelularService = async (item: {
  productoId: number;
  imei1: string;
  imei2?: string;
  numeroSerial?: string;
  bateria?: string;
}) => {
  const { data } = await luckyphoneApi.post(`/items-celulares`, item);
  return data;
};

export const eliminarItemCelularService = async (id: number) => {
  await luckyphoneApi.delete(`/items-celulares/${id}`);
};

// ==========================================
// SERVICIOS PARA PROFORMAS / GARANTIAS & PAGOS
// ==========================================

export const registrarPagoGarantiaService = async (id: string) => {
  const { data } = await luckyphoneApi.post(`/garantias/${id}/pagar`);
  return data;
};

export const anularGarantiaService = async (id: string) => {
  const { data } = await luckyphoneApi.delete(`/garantias/${id}`);
  return data;
};

export const emitirGarantiaService = async (garantiaData: any) => {
  const { data } = await luckyphoneApi.post(`/garantias`, garantiaData);
  return data;
};