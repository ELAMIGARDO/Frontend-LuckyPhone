import { luckyphoneApi } from '../api/luckyphoneApi';
import type { InventoryItem } from '../interfaces/luckyPhoneTypes';
import { exportarInventarioExcel, exportarInventarioPDF } from '../utils/inventoryExportUtils';

export const downloadExcelReport = async (categoria: string = 'TODOS', periodo: string = 'todos', fallbackItems?: InventoryItem[]) => {
  try {
    const response = await luckyphoneApi.get('/v1/reports/export/excel', {
      params: { categoria, periodo },
      responseType: 'blob'
    }).catch(async () => {
      return await luckyphoneApi.get('/reportes/excel', {
        params: { categoria, periodo },
        responseType: 'blob'
      });
    });

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `luckyphone_rotacion_${new Date().toISOString().slice(0, 10)}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.warn("Fallo endpoint backend Excel POI, usando exportación de contingencia...", error);
    if (fallbackItems && fallbackItems.length > 0) {
      exportarInventarioExcel(fallbackItems, categoria);
    } else {
      const local: any[] = JSON.parse(localStorage.getItem('luckyphone_admin_products') || '[]');
      exportarInventarioExcel(local, categoria);
    }
  }
};

export const downloadPdfReport = async (categoria: string = 'TODOS', periodo: string = 'todos', fallbackItems?: InventoryItem[]) => {
  try {
    const response = await luckyphoneApi.get('/v1/reports/export/pdf', {
      params: { categoria, periodo },
      responseType: 'blob'
    }).catch(async () => {
      return await luckyphoneApi.get('/reportes/pdf', {
        params: { categoria, periodo },
        responseType: 'blob'
      });
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `luckyphone_auditoria_contable_${new Date().toISOString().slice(0, 10)}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.warn("Fallo endpoint backend PDF A4, abriendo visor de impresión de contingencia...", error);
    if (fallbackItems && fallbackItems.length > 0) {
      exportarInventarioPDF(fallbackItems, categoria);
    } else {
      const local: any[] = JSON.parse(localStorage.getItem('luckyphone_admin_products') || '[]');
      exportarInventarioPDF(local, categoria);
    }
  }
};
