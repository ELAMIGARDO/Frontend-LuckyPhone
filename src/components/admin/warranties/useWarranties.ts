import { useState, useEffect } from 'react';
import { luckyphoneApi } from '../../../api/luckyphoneApi';

export interface Garantia {
  id: string;
  cliente: string;
  dni: string;
  telefono?: string;
  direccion?: string;
  celular: string;
  categoria: string;
  imei1?: string;
  imei2?: string;
  numeroSerie?: string;
  precioBase?: number;
  activacion: string;
  caducidad: string;
  duracionGarantia?: string;
  diasRestantes: number;
  estado: 'Vigente' | 'Caducado';
  alerta: boolean;
  eliminadoAt: string | null;
}

const initialGarantiasDemo: Garantia[] = [
  {
    id: 'G-101',
    cliente: 'Juan Pérez Gómez',
    dni: '74839201',
    celular: 'Apple iPhone 15 Pro Max 256GB',
    categoria: 'Celulares',
    imei1: '358921094857102',
    imei2: '358921094857103',
    numeroSerie: 'F2LQX980P0DX',
    activacion: '07/10/2026',
    caducidad: '07/10/2027',
    duracionGarantia: '12 Meses',
    diasRestantes: 363,
    estado: 'Vigente',
    alerta: false,
    eliminadoAt: null
  },
  {
    id: 'G-102',
    cliente: 'María López Silva',
    dni: '71928304',
    celular: 'Samsung Galaxy S24 Ultra',
    categoria: 'Celulares',
    imei1: '359102948571029',
    numeroSerie: 'R5CW901X88K',
    activacion: '15/09/2026',
    caducidad: '15/03/2027',
    duracionGarantia: '6 Meses',
    diasRestantes: 157,
    estado: 'Vigente',
    alerta: false,
    eliminadoAt: null
  },
  {
    id: 'G-103',
    cliente: 'Carlos Mendoza',
    dni: '45892019',
    celular: 'Cargador Anker 65W Fast Charge',
    categoria: 'Cargadores',
    numeroSerie: 'ANK-90182746',
    activacion: '01/01/2025',
    caducidad: '01/04/2025',
    duracionGarantia: '3 Meses',
    diasRestantes: -281,
    estado: 'Caducado',
    alerta: true,
    eliminadoAt: null
  },
  {
    id: 'G-104',
    cliente: 'Ana Patricia Torres',
    dni: '10293847',
    celular: 'Audífonos AirPods Pro 2da Gen',
    categoria: 'Audífonos',
    numeroSerie: 'GX9012837461',
    activacion: '10/05/2026',
    caducidad: '10/05/2028',
    duracionGarantia: '24 Meses',
    diasRestantes: 578,
    estado: 'Vigente',
    alerta: false,
    eliminadoAt: '2026-10-08T14:30:00'
  }
];

export const useWarranties = () => {
  const [garantias, setGarantias] = useState<Garantia[]>(initialGarantiasDemo);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'todos' | 'vigentes' | 'caducados' | 'anulados'>('todos');
  const [filtroCobertura, setFiltroCobertura] = useState<string>('todos');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedGarantia, setSelectedGarantia] = useState<Garantia | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const isAnulados = activeTab === 'anulados';
    
    // 1. Cargar ediciones locales de localStorage primero (si existen)
    const localSaved = localStorage.getItem('luckyphone_garantias_local');
    if (localSaved) {
      try {
        const parsed = JSON.parse(localSaved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGarantias(parsed);
        }
      } catch (e) {}
    }

    // 2. Intentar actualizar desde el servidor de backend
    luckyphoneApi.get(`/garantias?anulados=${isAnulados}&filtro=${activeTab}&query=${encodeURIComponent(searchTerm)}`)
      .then(res => {
        const rawList = res.data && Array.isArray(res.data.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        if (rawList.length > 0) {
          const hoy = new Date();
          const mappedList: Garantia[] = rawList.map((g: any) => {
            let dias = g.diasRestantes;
            if (g.fechaCaducidad) {
              const cad = new Date(g.fechaCaducidad);
              if (!isNaN(cad.getTime())) {
                const diff = cad.getTime() - hoy.getTime();
                dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
              }
            }

            return {
              id: g.id || g.idGarantia || 'G-100',
              cliente: g.clienteNombre || g.cliente || 'Cliente General',
              dni: g.clienteDni || g.dni || '00000000',
              celular: g.productoModelo || g.celular || 'Producto',
              categoria: g.categoria || 'Celulares',
              imei1: g.imei1 || '',
              imei2: g.imei2 || '',
              numeroSerie: g.numeroSerie || '',
              activacion: g.fechaEmision ? new Date(g.fechaEmision).toLocaleDateString('es-PE') : g.activacion || '01/01/2026',
              caducidad: g.fechaCaducidad ? new Date(g.fechaCaducidad).toLocaleDateString('es-PE') : g.caducidad || '01/01/2026',
              duracionGarantia: g.duracionGarantia || '12 Meses',
              diasRestantes: typeof dias === 'number' ? dias : 30,
              estado: dias > 0 ? 'Vigente' : 'Caducado',
              alerta: dias <= 0,
              eliminadoAt: g.eliminadoAt || null,
              precioBase: g.precioBase || g.precioFinal || 0
            };
          });

          // Mezclar manteniendo cambios guardados en sesión local
          if (!localSaved) {
            setGarantias(mappedList);
          }
        }
      })
      .catch(() => {
        // Fallback transparente
      });
  }, [activeTab, searchTerm]);

  const countTotales = garantias.filter(g => !g.eliminadoAt).length;
  const countVigentes = garantias.filter(g => !g.eliminadoAt && g.diasRestantes > 0).length;
  const countCaducados = garantias.filter(g => !g.eliminadoAt && g.diasRestantes <= 0).length;
  const countAnulados = garantias.filter(g => g.eliminadoAt).length;

  const listadoFiltrado = garantias.filter(g => {
    if (activeTab === 'anulados') {
      if (!g.eliminadoAt) return false;
    } else {
      if (g.eliminadoAt) return false;
      if (activeTab === 'vigentes' && g.diasRestantes <= 0) return false;
      if (activeTab === 'caducados' && g.diasRestantes > 0) return false;
    }

    if (filtroCategoria !== 'todas') {
      if (g.categoria && g.categoria.toLowerCase() !== filtroCategoria.toLowerCase()) {
        return false;
      }
    }

    if (filtroCobertura !== 'todos') {
      const mesBuscado = filtroCobertura.replace(/\D/g, ''); // extrae "0", "3", "6", "12", "24"
      const garantiaMeses = (g.duracionGarantia || '').replace(/\D/g, '');
      
      if (mesBuscado !== '' && garantiaMeses !== '') {
        if (mesBuscado !== garantiaMeses) return false;
      } else if (g.duracionGarantia && !g.duracionGarantia.toLowerCase().includes(filtroCobertura.toLowerCase())) {
        return false;
      }
    }

    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase().trim();
      const matchesClient = g.cliente.toLowerCase().includes(q);
      const matchesDni = g.dni.toLowerCase().includes(q);
      const matchesId = g.id.toLowerCase().includes(q);
      const matchesImei1 = g.imei1?.toLowerCase().includes(q) || false;
      const matchesSerie = g.numeroSerie?.toLowerCase().includes(q) || false;
      const matchesCelular = g.celular.toLowerCase().includes(q);

      return matchesClient || matchesDni || matchesId || matchesImei1 || matchesSerie || matchesCelular;
    }

    return true;
  });

  const handleOpenAnularModal = (garantiaItem: Garantia) => {
    setSelectedGarantia(garantiaItem);
    if (garantiaItem.diasRestantes > 0) {
      setIsModalOpen(true);
    } else {
      ejecutarAnulacion(garantiaItem.id);
    }
  };

  const ejecutarAnulacion = async (id: string) => {
    setLoading(true);
    try {
      const response = await luckyphoneApi.delete(`/garantias/${id}`).catch(() => null);

      if (!response || response.status === 200 || response.status === 204) {
        setGarantias(prev =>
          prev.map(item =>
            item.id === id ? { ...item, eliminadoAt: new Date().toISOString() } : item
          )
        );
      }
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setSelectedGarantia(null);
    }
  };

  const handleRestaurar = async (id: string) => {
    setLoading(true);
    try {
      const response = await luckyphoneApi.post(`/garantias/${id}/restaurar`).catch(() => null);

      if (!response || response.status === 200 || response.status === 201) {
        setGarantias(prev =>
          prev.map(item => (item.id === id ? { ...item, eliminadoAt: null } : item))
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [garantiaEditando, setGarantiaEditando] = useState<Garantia | null>(null);

  const handleOpenEditModal = (item: Garantia) => {
    setGarantiaEditando(item);
    setIsEditModalOpen(true);
  };

  const handleUpdateGarantia = async (updated: Garantia) => {
    setLoading(true);
    try {
      // 🧮 RECÁLCULO AUTOMÁTICO DE CADUCIDAD Y DÍAS RESTANTES
      const meses = parseInt(updated.duracionGarantia?.replace(/\D/g, '') || '12', 10);
      
      // Parsear fecha de activación DD/MM/YYYY o ISO
      let fechaBase = new Date();
      if (updated.activacion && updated.activacion.includes('/')) {
        const parts = updated.activacion.split('/');
        if (parts.length === 3) {
          fechaBase = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        }
      }

      const fechaCaducidadObj = new Date(fechaBase);
      fechaCaducidadObj.setMonth(fechaCaducidadObj.getMonth() + meses);

      const day = String(fechaCaducidadObj.getDate()).padStart(2, '0');
      const month = String(fechaCaducidadObj.getMonth() + 1).padStart(2, '0');
      const year = fechaCaducidadObj.getFullYear();
      const nuevaCaducidadStr = `${day}/${month}/${year}`;

      const hoy = new Date();
      const diffTime = fechaCaducidadObj.getTime() - hoy.getTime();
      const nuevosDiasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const nuevoEstado: 'Vigente' | 'Caducado' = nuevosDiasRestantes > 0 ? 'Vigente' : 'Caducado';

      const garantiaActualizada: Garantia = {
        ...updated,
        caducidad: nuevaCaducidadStr,
        diasRestantes: nuevosDiasRestantes,
        estado: nuevoEstado,
        alerta: nuevosDiasRestantes <= 0
      };

      // Actualización local inmediata en interfaz y en almacenamiento persistente (localStorage)
      setGarantias(prev => {
        const updatedList = prev.map(item => (item.id === garantiaActualizada.id ? garantiaActualizada : item));
        localStorage.setItem('luckyphone_garantias_local', JSON.stringify(updatedList));
        return updatedList;
      });

      // Intentar sincronizar con el servidor backend si hay sesión activa
      const token = localStorage.getItem('token');
      if (token) {
        await luckyphoneApi.put(`/garantias/${garantiaActualizada.id}`, garantiaActualizada).catch(() => null);
      }
    } finally {
      setLoading(false);
      setIsEditModalOpen(false);
      setGarantiaEditando(null);
    }
  };

  const [printGarantia, setPrintGarantia] = useState<Garantia | null>(null);

  const handleReimprimirProforma = (item: Garantia) => {
    setPrintGarantia(item);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return {
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
    setPrintGarantia,
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
  };
};
