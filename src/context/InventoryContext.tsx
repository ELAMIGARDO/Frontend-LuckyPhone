import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { InventoryItem } from '../interfaces/luckyPhoneTypes';
import {
  getProductosAdminListaCompletaService,
  getMetricsCountsService,
  actualizarEstadoItemCelularService,
  anularGarantiaService,
  eliminarProductoService,
  type MetricsCounts
} from '../services/backendService';

const LOCAL_STORAGE_PRODUCTS_KEY = 'luckyphone_admin_products';

interface InventoryContextType {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  counts: MetricsCounts;
  loading: boolean;
  refreshInventory: () => Promise<void>;
  refreshCounts: () => Promise<void>;
  marcarItemVendidoOptimista: (productoId: string, itemId: number) => Promise<void>;
  marcarItemDisponibleOptimista: (productoId: string, itemId: number) => Promise<void>;
  anularGarantiaOptimista: (garantiaId: string) => Promise<void>;
  restaurarGarantiaOptimista: (garantiaId: string) => Promise<void>;
  eliminarProductoOptimista: (productoId: string) => Promise<void>;
  actualizarProductoEnEstado: (updated: InventoryItem) => void;
  agregarProductoEnEstado: (newItem: InventoryItem) => void;
}

const initialCounts: MetricsCounts = {
  disponibles: 0,
  agotados: 0,
  anulados: 0,
  vigentes: 0,
  caducados: 0,
  totales: 0,
  totalProductos: 0,
  itemsVendidos: 0,
  itemsDisponibles: 0
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.map((it: any) => {
            const realStock = (it.itemsCelulares && Array.isArray(it.itemsCelulares) && it.itemsCelulares.length > 0)
              ? it.itemsCelulares.filter((u: any) => u.estadoDispositivo === 'Disponible').length
              : (typeof it.stock === 'number' ? it.stock : 0);
            return { ...it, stock: realStock };
          });
        }
      }
    } catch (e) {
      console.error("Error al inicializar inventario desde localStorage:", e);
    }
    return [];
  });

  const [counts, setCounts] = useState<MetricsCounts>(() => {
    try {
      const stored = localStorage.getItem('luckyphone_metrics_counts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.disponibles === 'number') return parsed;
      }
    } catch {}
    return initialCounts;
  });

  const [loading, setLoading] = useState<boolean>(false);

  const refreshCounts = useCallback(async () => {
    try {
      const data = await getMetricsCountsService();
      if (data) {
        setCounts(data);
        localStorage.setItem('luckyphone_metrics_counts', JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error al sincronizar conteos de métricas:", error);
    }
  }, []);

  const refreshInventory = useCallback(async () => {
    setLoading(true);
    try {
      const [productosBD, countsData] = await Promise.all([
        getProductosAdminListaCompletaService(),
        getMetricsCountsService()
      ]);

      if (productosBD && Array.isArray(productosBD)) {
        const adaptados: InventoryItem[] = productosBD.map((item: any) => {
          const firstItem = item.itemsCelulares && item.itemsCelulares[0];
          const imei1Val = item.imei1 || (firstItem ? firstItem.imei1 : '');
          const imei2Val = item.imei2 || (firstItem ? firstItem.imei2 : '');
          const snVal = item.numeroSerial || (firstItem ? firstItem.numeroSerial : '');
          const batVal = item.bateria || (firstItem ? firstItem.bateria : '100%');

          const stockCalculado = (item.itemsCelulares && Array.isArray(item.itemsCelulares) && item.itemsCelulares.length > 0)
            ? item.itemsCelulares.filter((u: any) => u.estadoDispositivo === 'Disponible').length
            : (typeof item.stock === 'number' ? item.stock : 0);

          return {
            id: String(item.id),
            modelo: item.modelo || item.nombre || 'Producto',
            marca: item.marca || 'Apple',
            almacenamiento: item.almacenamiento || '256GB',
            ram: item.ram || '8GB',
            color: item.color || 'Estándar',
            precio: item.precio || 0,
            stock: stockCalculado,
            imei: imei1Val,
            imei1: imei1Val,
            imei2: imei2Val,
            numeroSerie: snVal,
            numeroSerial: snVal,
            categoriaNombre: item.categoriaNombre || (item.categoria ? item.categoria.nombre : 'Celulares'),
            estado: item.estado || 'Nuevo / Sellado',
            bateria: batVal,
            imagenUrl: item.imagenUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80',
            descripcion: item.descripcion || '',
            activo: item.activo !== undefined ? item.activo : true,
            itemsCelulares: item.itemsCelulares || []
          };
        });

        setInventory(adaptados);
        localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(adaptados));
      }

      if (countsData) {
        setCounts(countsData);
        localStorage.setItem('luckyphone_metrics_counts', JSON.stringify(countsData));
      }
    } catch (error) {
      console.error("Error al refrescar inventario:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshInventory();
  }, [refreshInventory]);

  // ==========================================
  // ACTUALIZACIONES OPTIMISTAS (0ms DE LATENCIA)
  // ==========================================

  const marcarItemVendidoOptimista = async (productoId: string, itemId: number) => {
    // 1. Mutar el estado local de inventario inmediatamente
    let nuevoStockPadre = 0;
    let eraMayorACero = false;

    setInventory(prev => {
      const updated = prev.map(prod => {
        if (prod.id !== productoId) return prod;

        const subItems = prod.itemsCelulares || [];
        eraMayorACero = prod.stock > 0;

        const updatedSubItems = subItems.map(it => {
          if (it.id === itemId) {
            return {
              ...it,
              estadoDispositivo: 'Vendido' as const,
              fechaVenta: new Date().toISOString()
            };
          }
          return it;
        });

        const dispCount = updatedSubItems.filter(i => i.estadoDispositivo === 'Disponible').length;
        nuevoStockPadre = dispCount;

        return {
          ...prod,
          stock: dispCount,
          itemsCelulares: updatedSubItems
        };
      });

      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(updated));
      return updated;
    });

    // 2. Actualizar conteos globales inmediatamente
    setCounts(prev => {
      const nuevo = {
        ...prev,
        itemsVendidos: prev.itemsVendidos + 1,
        itemsDisponibles: Math.max(0, prev.itemsDisponibles - 1),
        disponibles: (eraMayorACero && nuevoStockPadre === 0) ? Math.max(0, prev.disponibles - 1) : prev.disponibles,
        agotados: (eraMayorACero && nuevoStockPadre === 0) ? prev.agotados + 1 : prev.agotados
      };
      localStorage.setItem('luckyphone_metrics_counts', JSON.stringify(nuevo));
      return nuevo;
    });

    // 3. Ejecutar petición HTTP hacia Spring Boot en segundo plano
    try {
      await actualizarEstadoItemCelularService(itemId, 'Vendido');
    } catch (error) {
      console.error("Error en background al marcar item como vendido:", error);
      // Rollback silencioso si falla
      refreshInventory();
    }
  };

  const marcarItemDisponibleOptimista = async (productoId: string, itemId: number) => {
    let nuevoStockPadre = 0;
    let eraCero = false;

    setInventory(prev => {
      const updated = prev.map(prod => {
        if (prod.id !== productoId) return prod;

        const subItems = prod.itemsCelulares || [];
        eraCero = prod.stock === 0;

        const updatedSubItems = subItems.map(it => {
          if (it.id === itemId) {
            return {
              ...it,
              estadoDispositivo: 'Disponible' as const,
              fechaVenta: undefined
            };
          }
          return it;
        });

        const dispCount = updatedSubItems.filter(i => i.estadoDispositivo === 'Disponible').length;
        nuevoStockPadre = dispCount;

        return {
          ...prod,
          stock: dispCount,
          itemsCelulares: updatedSubItems
        };
      });

      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(updated));
      return updated;
    });

    setCounts(prev => {
      const nuevo = {
        ...prev,
        itemsVendidos: Math.max(0, prev.itemsVendidos - 1),
        itemsDisponibles: prev.itemsDisponibles + 1,
        disponibles: (eraCero && nuevoStockPadre > 0) ? prev.disponibles + 1 : prev.disponibles,
        agotados: (eraCero && nuevoStockPadre > 0) ? Math.max(0, prev.agotados - 1) : prev.agotados
      };
      localStorage.setItem('luckyphone_metrics_counts', JSON.stringify(nuevo));
      return nuevo;
    });

    try {
      await actualizarEstadoItemCelularService(itemId, 'Disponible');
    } catch (error) {
      console.error("Error en background al marcar item como disponible:", error);
      refreshInventory();
    }
  };

  const anularGarantiaOptimista = async (garantiaId: string) => {
    setCounts(prev => {
      const nuevo = {
        ...prev,
        anulados: prev.anulados + 1,
        vigentes: Math.max(0, prev.vigentes - 1),
        totales: Math.max(0, prev.totales - 1)
      };
      localStorage.setItem('luckyphone_metrics_counts', JSON.stringify(nuevo));
      return nuevo;
    });

    try {
      await anularGarantiaService(garantiaId);
    } catch (error) {
      console.error("Error en background al anular garantia:", error);
      refreshCounts();
    }
  };

  const restaurarGarantiaOptimista = async (_garantiaId: string) => {
    setCounts(prev => {
      const nuevo = {
        ...prev,
        anulados: Math.max(0, prev.anulados - 1),
        vigentes: prev.vigentes + 1,
        totales: prev.totales + 1
      };
      localStorage.setItem('luckyphone_metrics_counts', JSON.stringify(nuevo));
      return nuevo;
    });

    try {
      // Si existe endpoint de restauración en backend
      await refreshCounts();
    } catch (error) {
      console.error("Error al restaurar garantia:", error);
    }
  };

  const eliminarProductoOptimista = async (productoId: string) => {
    let stockPrevio = 0;
    setInventory(prev => {
      const target = prev.find(p => p.id === productoId);
      if (target) stockPrevio = target.stock;
      const updated = prev.filter(p => p.id !== productoId);
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(updated));
      return updated;
    });

    setCounts(prev => {
      const nuevo = {
        ...prev,
        totalProductos: Math.max(0, prev.totalProductos - 1),
        disponibles: stockPrevio > 0 ? Math.max(0, prev.disponibles - 1) : prev.disponibles,
        agotados: stockPrevio === 0 ? Math.max(0, prev.agotados - 1) : prev.agotados
      };
      localStorage.setItem('luckyphone_metrics_counts', JSON.stringify(nuevo));
      return nuevo;
    });

    try {
      const numId = Number(productoId);
      if (!isNaN(numId)) {
        await eliminarProductoService(numId);
      }
    } catch (error) {
      console.error("Error al eliminar producto en backend:", error);
    }
  };

  const actualizarProductoEnEstado = (updated: InventoryItem) => {
    setInventory(prev => {
      const list = prev.map(p => p.id === updated.id ? updated : p);
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(list));
      return list;
    });
    refreshCounts();
  };

  const agregarProductoEnEstado = (newItem: InventoryItem) => {
    setInventory(prev => {
      const list = [newItem, ...prev];
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(list));
      return list;
    });
    refreshCounts();
  };

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        setInventory,
        counts,
        loading,
        refreshInventory,
        refreshCounts,
        marcarItemVendidoOptimista,
        marcarItemDisponibleOptimista,
        anularGarantiaOptimista,
        restaurarGarantiaOptimista,
        eliminarProductoOptimista,
        actualizarProductoEnEstado,
        agregarProductoEnEstado
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventoryContext = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventoryContext debe ser utilizado dentro de un InventoryProvider');
  }
  return context;
};
