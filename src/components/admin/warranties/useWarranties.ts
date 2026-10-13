import { useState, useEffect } from 'react';
import { luckyphoneApi } from '../../../api/luckyphoneApi';
import { useInventoryContext } from '../../../context/InventoryContext';

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
  estadoPago?: 'PENDIENTE' | 'PAGADO' | 'ANULADO';
  alerta: boolean;
  eliminadoAt: string | null;
}

export const useWarranties = () => {
  const { counts, anularGarantiaOptimista, restaurarGarantiaOptimista } = useInventoryContext();

  const [garantias, setGarantias] = useState<Garantia[]>(() => {
    const localSaved = localStorage.getItem('luckyphone_garantias_local');
    if (localSaved) {
      try {
        const parsed = JSON.parse(localSaved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'todos' | 'vigentes' | 'caducados' | 'anulados'>('todos');
  const [filtroCobertura, setFiltroCobertura] = useState<string>('todos');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedGarantia, setSelectedGarantia] = useState<Garantia | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const isAnulados = activeTab === 'anulados';

    // Consultar directamente al servidor de backend
    luckyphoneApi.get(`/garantias?anulados=${isAnulados}&filtro=${activeTab}&query=${encodeURIComponent(searchTerm)}`)
      .then(res => {
        const rawList = res.data && Array.isArray(res.data.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
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
            estadoPago: g.estadoPago || 'PENDIENTE',
            alerta: dias <= 0,
            eliminadoAt: g.eliminadoAt || null,
            precioBase: g.precioBase || g.precioFinal || 0
          };
        });

        setGarantias(mappedList);
        localStorage.setItem('luckyphone_garantias_local', JSON.stringify(mappedList));
      })
      .catch(() => {
        // En caso de que el backend esté apagado, leer del almacenamiento local
        const localSaved = localStorage.getItem('luckyphone_garantias_local');
        if (localSaved) {
          try {
            setGarantias(JSON.parse(localSaved));
          } catch (e) {}
        }
      });
  }, [activeTab, searchTerm]);

  // Sincronización robusta: utilizar los conteos globales que persisten a través de los tabs
  const countTotales = counts.totales || garantias.filter(g => !g.eliminadoAt).length;
  const countVigentes = counts.vigentes || garantias.filter(g => !g.eliminadoAt && g.diasRestantes > 0).length;
  const countCaducados = counts.caducados || garantias.filter(g => !g.eliminadoAt && g.diasRestantes <= 0).length;
  const countAnulados = counts.anulados || garantias.filter(g => !!g.eliminadoAt).length;

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
    // 1. Mutación optimista inmediata del estado local y conteos
    anularGarantiaOptimista(id);
    setGarantias(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, eliminadoAt: new Date().toISOString(), estadoPago: 'ANULADO' as const } : item
      );
      localStorage.setItem('luckyphone_garantias_local', JSON.stringify(updated));
      return updated;
    });

    setLoading(true);
    try {
      await luckyphoneApi.delete(`/garantias/${id}`).catch(() => null);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setSelectedGarantia(null);
    }
  };

  const handleRestaurar = async (id: string) => {
    restaurarGarantiaOptimista(id);
    setGarantias(prev => {
      const updated = prev.map(item => (item.id === id ? { ...item, eliminadoAt: null, estadoPago: 'PENDIENTE' as const } : item));
      localStorage.setItem('luckyphone_garantias_local', JSON.stringify(updated));
      return updated;
    });

    setLoading(true);
    try {
      await luckyphoneApi.post(`/garantias/${id}/restaurar`).catch(() => null);
    } finally {
      setLoading(false);
    }
  };

  const handlePagarProforma = async (id: string) => {
    setLoading(true);
    try {
      const response = await luckyphoneApi.post(`/garantias/${id}/pagar`).catch(() => null);
      if (!response || response.status === 200 || response.status === 201) {
        setGarantias(prev => {
          const hoyStr = new Date().toLocaleDateString('es-PE');
          const updated = prev.map(item =>
            item.id === id ? { ...item, estadoPago: 'PAGADO' as const, activacion: hoyStr } : item
          );
          localStorage.setItem('luckyphone_garantias_local', JSON.stringify(updated));
          return updated;
        });
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
    handlePagarProforma,
    handleOpenEditModal,
    handleUpdateGarantia,
    handleReimprimirProforma
  };
};
