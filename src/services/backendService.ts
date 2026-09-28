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

// ==========================================
// 🌐 SERVICIOS PÚBLICOS DE PRODUCTOS Y POLÍTICAS
// ==========================================

export const getProductosPaginadosService = async (page = 0, size = 12): Promise<PageResponse<ProductoResponseDTO>> => {
  const { data } = await luckyphoneApi.get<PageResponse<ProductoResponseDTO>>(`/productos/lista`, {
    params: { page, size }
  });
  return data;
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

// ==========================================
// 🔐 SERVICIOS DE AUTENTICACIÓN
// ==========================================

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

// ==========================================
// 🔐 SERVICIOS ADMINISTRATIVOS (ROLE_ADMIN)
// ==========================================

export const crearProductoService = async (dto: ProductoRequestDTO): Promise<ProductoResponseDTO> => {
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
