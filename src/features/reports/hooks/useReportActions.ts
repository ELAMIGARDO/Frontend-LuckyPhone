import { useState, useMemo } from 'react';
import { downloadExcelReport, downloadPdfReport } from '../../../services/reportService';
import { useInventoryContext } from '../../../context/InventoryContext';

export interface SoldUnitRecord {
  correlativo: number;
  productoId: string;
  modelo: string;
  marca: string;
  color: string;
  almacenamiento: string;
  ram: string;
  estado: string;
  precio: number;
  categoria: string;
  itemId?: number;
  imei1: string;
  imei2?: string;
  numeroSerial?: string;
  bateria?: string;
  fechaVenta?: string;
}

export const useReportActions = () => {
  const { inventory } = useInventoryContext();

  const [periodo, setPeriodo] = useState<string>('todos');
  const [categoria, setCategoria] = useState<string>('TODOS');
  const [isExportingExcel, setIsExportingExcel] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  // Desglosar todo el historial de unidades físicas vendidas con correlativo continuo (#1, #2, #3...)
  const salesHistory = useMemo<SoldUnitRecord[]>(() => {
    const list: SoldUnitRecord[] = [];
    let contador = 1;

    inventory.forEach(p => {
      const units = p.itemsCelulares || [];
      units.forEach(u => {
        if (u.estadoDispositivo === 'Vendido') {
          list.push({
            correlativo: contador++,
            productoId: p.id,
            modelo: p.modelo,
            marca: p.marca || 'Apple',
            color: p.color,
            almacenamiento: p.almacenamiento,
            ram: p.ram || '8GB',
            estado: p.estado,
            precio: p.precio,
            categoria: p.categoriaNombre || 'Celulares',
            itemId: u.id,
            imei1: u.imei1,
            imei2: u.imei2,
            numeroSerial: u.numeroSerial,
            bateria: u.bateria,
            fechaVenta: u.fechaVenta
          });
        }
      });
    });

    // Filtrar por categoría
    if (categoria === 'TODOS') return list;
    return list.filter(item => item.categoria.toLowerCase().includes(categoria.toLowerCase()));
  }, [inventory, categoria]);

  const handleExportExcel = async () => {
    setIsExportingExcel(true);
    try {
      await downloadExcelReport(categoria, periodo, inventory);
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      await downloadPdfReport(categoria, periodo, inventory);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return {
    periodo,
    setPeriodo,
    categoria,
    setCategoria,
    isExportingExcel,
    isExportingPdf,
    handleExportExcel,
    handleExportPdf,
    salesHistory
  };
};
