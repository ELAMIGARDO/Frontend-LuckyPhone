export type TabType = 'metrics' | 'inventory' | 'proforma' | 'warranties' | 'reviews' | 'settings';

export interface AtributoConfig {
  id: number;
  texto: string;
  activo: boolean;
  codigoHex?: string;
}

export interface ConfigAtributosResponse {
  almacenamientos: AtributoConfig[];
  memoriasRam: AtributoConfig[];
  colores: AtributoConfig[];
}

export interface UsuarioAdmin {
  id: number;
  nombre: string;
  email: string;
  rol: 'ROLE_ADMIN' | 'ROLE_USER';
  activo: boolean;
}

export interface CustomerData {
  nombreCompleto: string;
  documento: string;
  telefono: string;
  email?: string;
  direccion?: string;
}

export interface CompanyData {
  nombre: string;
  ruc: string;
  direccion: string;
  telefono: string;
  email: string;
  web: string;
  cuentasBancarias?: string;
  terminosGarantia?: string;
}

export interface ProformaItem {
  id: string;
  modelo: string;
  imei: string;
  cantidad: number;
  precioUnitario: number;
  precioTotal: number;
}

export interface WarrantyData {
  fechaActivacion: string;
  fechaCaducidad: string;
  terminos: string;
}

export interface ProformaData {
  codigoProforma: string;
  fechaEmision: string;
  cliente: CustomerData;
  empresa: CompanyData;
  productos: ProformaItem[];
  garantia: WarrantyData;
  subtotal: number;
  igv: number;
  total: number;
  asesorNombre: string;
}

export interface ReviewItem {
  id: string;
  clienteNombre: string;
  clienteAvatar?: string;
  modeloCelular: string;
  calificacion: number; // 1 to 5
  fecha: string;
  comentario: string;
  verificado: boolean;
}

export interface InventoryItem {
  id: string;
  modelo: string;
  marca?: string;
  almacenamiento: string;
  ram?: string;
  color: string;
  precio: number;
  stock: number;
  imei?: string;
  imei1?: string;
  imei2?: string;
  numeroSerie?: string;
  numeroSerial?: string;
  categoriaNombre?: string;
  categoriaId?: number;
  estado: 'Nuevo / Sellado' | 'Open Box' | 'Seminuevo / Usado' | 'Reacondicionado' | string;
  bateria?: string;
  descripcion?: string;
  imagenUrl?: string;
  activo?: boolean;
  itemsCelulares?: Array<{
    id?: number;
    imei1: string;
    imei2?: string;
    numeroSerial?: string;
    bateria?: string;
    estadoDispositivo?: 'Disponible' | 'Reservado' | 'Vendido';
    fechaVenta?: string;
  }>;
}





