import { useState, useMemo } from 'react';
import { useInventoryContext } from '../../../context/InventoryContext';

export type StockTabType = 'disponibles' | 'agotados';

export const useInventory = () => {
  const {
    inventory,
    counts,
    loading,
    refreshInventory,
    marcarItemVendidoOptimista,
    marcarItemDisponibleOptimista,
    eliminarProductoOptimista,
    actualizarProductoEnEstado,
    agregarProductoEnEstado
  } = useInventoryContext();

  const [stockTab, setStockTab] = useState<StockTabType>('disponibles');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 1. Filtrado canónico por Sub-Pestaña de Stock
  // 'disponibles': Equipos con stock neto > 0
  // 'agotados': Equipos con stock neto === 0 (todos sus IMEIs vendidos o sin existencias)
  const itemsByStockTab = useMemo(() => {
    return inventory.filter(item => {
      const realStock = (item.itemsCelulares && Array.isArray(item.itemsCelulares) && item.itemsCelulares.length > 0)
        ? item.itemsCelulares.filter(u => u.estadoDispositivo === 'Disponible').length
        : (item.stock || 0);

      if (stockTab === 'disponibles') {
        return realStock > 0;
      } else {
        return realStock === 0;
      }
    });
  }, [inventory, stockTab]);

  // 2. Filtrado por Categoría Comercial
  const itemsByCategory = useMemo(() => {
    if (selectedCategory === 'TODOS') return itemsByStockTab;
    return itemsByStockTab.filter(item => {
      const itemCat = item.categoriaNombre || 'Celulares';
      return itemCat.toLowerCase().includes(selectedCategory.toLowerCase());
    });
  }, [itemsByStockTab, selectedCategory]);

  // 3. Filtrado por Término de Búsqueda (Modelo, IMEI 1/2, Número de Serie)
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return itemsByCategory;
    const term = searchTerm.toLowerCase();

    return itemsByCategory.filter(item => {
      const matchModelo = item.modelo.toLowerCase().includes(term);
      const matchMarca = (item.marca || '').toLowerCase().includes(term);
      const matchColor = item.color.toLowerCase().includes(term);
      const matchEstado = item.estado.toLowerCase().includes(term);
      const matchImei1 = (item.imei1 || item.imei || '').toLowerCase().includes(term);
      const matchImei2 = (item.imei2 || '').toLowerCase().includes(term);
      const matchSn = (item.numeroSerial || item.numeroSerie || '').toLowerCase().includes(term);

      const matchSubItems = (item.itemsCelulares || []).some(sub =>
        (sub.imei1 || '').toLowerCase().includes(term) ||
        (sub.imei2 || '').toLowerCase().includes(term) ||
        (sub.numeroSerial || '').toLowerCase().includes(term)
      );

      return matchModelo || matchMarca || matchColor || matchEstado || matchImei1 || matchImei2 || matchSn || matchSubItems;
    });
  }, [itemsByCategory, searchTerm]);

  const getCategoryCount = (catId: string) => {
    if (catId === 'TODOS') return itemsByStockTab.length;
    return itemsByStockTab.filter(item => {
      const itemCat = item.categoriaNombre || 'Celulares';
      return itemCat.toLowerCase().includes(catId.toLowerCase());
    }).length;
  };

  return {
    inventory,
    filteredItems,
    counts,
    loading,
    stockTab,
    setStockTab,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    getCategoryCount,
    refreshInventory,
    marcarItemVendido: marcarItemVendidoOptimista,
    marcarItemDisponible: marcarItemDisponibleOptimista,
    eliminarProducto: eliminarProductoOptimista,
    actualizarProducto: actualizarProductoEnEstado,
    agregarProducto: agregarProductoEnEstado
  };
};
