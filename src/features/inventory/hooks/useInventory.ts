import { useState, useMemo } from 'react';
import { useInventoryContext } from '../../../context/InventoryContext';
import type { InventoryItem } from '../../../interfaces/luckyPhoneTypes';
import {
  isPhysicalUnitAvailable,
  isPhysicalUnitSold,
  type PhysicalUnitDTO
} from '../../../services/inventoryService';

export type StockTabType = 'disponibles' | 'agotados';

export interface InventoryProductItem extends InventoryItem {
  stockDisponibleReal: number;
}

export const computeStockDisponibleReal = (
  product: Pick<InventoryItem, 'stock' | 'itemsCelulares'>
): number => {
  const units = product.itemsCelulares as PhysicalUnitDTO[] | undefined;
  if (Array.isArray(units) && units.length > 0) {
    return units.filter(isPhysicalUnitAvailable).length;
  }
  return typeof product.stock === 'number' && !isNaN(product.stock)
    ? Math.max(0, product.stock)
    : 0;
};

export const useInventory = () => {
  const {
    inventory,
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

  const inventoryWithRealStock = useMemo<InventoryProductItem[]>(() => {
    return inventory.map((product) => {
      const stockDisponibleReal = computeStockDisponibleReal(product);
      return {
        ...product,
        stock: stockDisponibleReal,
        stockDisponibleReal
      };
    });
  }, [inventory]);

  const computedCounts = useMemo(() => {
    let disponibles = 0;
    let agotados = 0;
    let itemsVendidos = 0;
    let itemsDisponibles = 0;

    for (const item of inventoryWithRealStock) {
      if (item.stockDisponibleReal > 0) {
        disponibles++;
      } else {
        agotados++;
      }

      if (Array.isArray(item.itemsCelulares)) {
        for (const unit of item.itemsCelulares) {
          if (isPhysicalUnitAvailable(unit as PhysicalUnitDTO)) {
            itemsDisponibles++;
          } else if (isPhysicalUnitSold(unit as PhysicalUnitDTO)) {
            itemsVendidos++;
          }
        }
      }
    }

    return {
      disponibles,
      agotados,
      itemsVendidos,
      itemsDisponibles,
      totalProductos: inventoryWithRealStock.length
    };
  }, [inventoryWithRealStock]);

  const itemsByStockTab = useMemo(() => {
    return inventoryWithRealStock.filter((item) => {
      if (stockTab === 'disponibles') {
        return item.stockDisponibleReal > 0;
      }
      return item.stockDisponibleReal === 0;
    });
  }, [inventoryWithRealStock, stockTab]);

  const itemsByCategory = useMemo(() => {
    if (selectedCategory === 'TODOS') return itemsByStockTab;
    return itemsByStockTab.filter((item) => {
      const itemCat = item.categoriaNombre || 'Celulares';
      return itemCat.toLowerCase().includes(selectedCategory.toLowerCase());
    });
  }, [itemsByStockTab, selectedCategory]);

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return itemsByCategory;
    const term = searchTerm.toLowerCase();

    return itemsByCategory.filter((item) => {
      const matchModelo = item.modelo.toLowerCase().includes(term);
      const matchMarca = (item.marca || '').toLowerCase().includes(term);
      const matchColor = item.color.toLowerCase().includes(term);
      const matchEstado = item.estado.toLowerCase().includes(term);
      const matchImei1 = (item.imei1 || item.imei || '').toLowerCase().includes(term);
      const matchImei2 = (item.imei2 || '').toLowerCase().includes(term);
      const matchSn = (item.numeroSerial || item.numeroSerie || '').toLowerCase().includes(term);

      const matchSubItems = (item.itemsCelulares || []).some((sub) =>
        (sub.imei1 || '').toLowerCase().includes(term) ||
        (sub.imei2 || '').toLowerCase().includes(term) ||
        (sub.numeroSerial || '').toLowerCase().includes(term)
      );

      return (
        matchModelo ||
        matchMarca ||
        matchColor ||
        matchEstado ||
        matchImei1 ||
        matchImei2 ||
        matchSn ||
        matchSubItems
      );
    });
  }, [itemsByCategory, searchTerm]);

  const getCategoryCount = (catId: string): number => {
    if (catId === 'TODOS') return itemsByStockTab.length;
    return itemsByStockTab.filter((item) => {
      const itemCat = item.categoriaNombre || 'Celulares';
      return itemCat.toLowerCase().includes(catId.toLowerCase());
    }).length;
  };

  return {
    inventory: inventoryWithRealStock,
    filteredItems,
    counts: computedCounts,
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
