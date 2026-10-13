export type EstadoDispositivo = 'Disponible' | 'Reservado' | 'Vendido';

export interface ItemCelularDTO {
  id?: number;
  productoId?: number;
  imei1: string;
  imei2?: string;
  numeroSerial?: string;
  bateria?: string;
  estadoDispositivo?: EstadoDispositivo;
  fechaVenta?: string;
  creadoAt?: string;
  actualizadoAt?: string;
}

// 1. DTO de respuesta para el catálogo de productos (Backend Spring Boot)
export interface ProductoResponseDTO {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  marca: string;
  modelo: string;
  almacenamiento: string;
  ram: string;
  color: string;
  estado: string;
  imagenUrl: string;
  whatsappLink: string; // URL autogenerada por el backend con mensaje comercial listo
  categoriaNombre?: string;
  categoriaId?: number;
  itemsCelulares?: ItemCelularDTO[];
  bateria: string;
  imei1?: string;
  imei2?: string;
  numeroSerial?: string;
}

// 2. DTO de solicitud para crear/actualizar un producto (Admin)
export interface ProductoRequestDTO {
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  marca?: string;
  modelo?: string;
  almacenamiento?: string;
  ram?: string;
  color?: string;
  estado?: string;
  categoriaId: number;
  imagenUrl?: string;
  itemsCelulares?: ItemCelularDTO[];
}

// 3. Estructura de Paginación devuelta por Spring Boot
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 4. DTOs de Autenticación
export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface RegistroRequestDTO {
  nombre: string;
  apellido: string;
  dni: string; // Exactamente 8 dígitos
  telefono: string;
  email: string;
  direccion?: string;
  password: string; // Mínimo 6 caracteres
  rol?: string; // 'ROLE_USER' o 'ROLE_ADMIN'
  aceptoTerminos: boolean; // OBLIGATORIO: Debe ser true
}

export interface AuthResponseDTO {
  token: string;
  tipoToken: string; // "Bearer"
  email: string;
  rol: string; // 'ROLE_USER' o 'ROLE_ADMIN'
}

export interface ClienteResponseDTO {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email: string;
  direccion?: string;
  rol: string;
}

export interface CategoriaResponseDTO {
  id: number;
  nombre: string;
  descripcion?: string;
}
