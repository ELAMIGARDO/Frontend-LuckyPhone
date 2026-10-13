import { luckyphoneApi } from '../api/luckyphoneApi';

export interface DashboardMetrics {
  stockNetoReal: number;
  unidadesVendidas: number;
  unidadesDisponibles: number;
  ingresosEstimados: number;
  productosDisponibles: number;
  productosAgotados: number;
  totalProductos: number;
  garantiasVigentes: number;
  garantiasAnuladas: number;
  tasaRotacion: number;
}

export interface MetricsCounts {
  disponibles: number;
  agotados: number;
  anulados: number;
  vigentes: number;
  caducados: number;
  totales: number;
  totalProductos: number;
  itemsVendidos: number;
  itemsDisponibles: number;
}

export const fetchDashboardMetrics = async (): Promise<DashboardMetrics> => {
  try {
    const { data } = await luckyphoneApi.get<DashboardMetrics>('/v1/dashboard/metrics');
    return data;
  } catch (error) {
    console.warn("Fallo endpoint /v1/dashboard/metrics, calculando fallback local...", error);
    const localProducts: any[] = JSON.parse(localStorage.getItem('luckyphone_admin_products') || '[]');
    const localGarantias: any[] = JSON.parse(localStorage.getItem('luckyphone_garantias_local') || '[]');

    let stockNeto = 0;
    let unidadesVendidas = 0;
    let unidadesDisponibles = 0;
    let ingresos = 0;

    localProducts.forEach(p => {
      const units = p.itemsCelulares || [];
      if (units.length > 0) {
        units.forEach((u: any) => {
          if (u.estadoDispositivo === 'Vendido') {
            unidadesVendidas++;
            ingresos += (p.precio || 0);
          } else {
            unidadesDisponibles++;
            stockNeto++;
          }
        });
      } else {
        const s = p.stock || 0;
        stockNeto += s;
        if (s > 0) unidadesDisponibles += s;
      }
    });

    const disponibles = localProducts.filter(p => {
      const s = (p.itemsCelulares && p.itemsCelulares.length > 0)
        ? p.itemsCelulares.filter((u: any) => u.estadoDispositivo === 'Disponible').length
        : (p.stock || 0);
      return s > 0 && p.activo !== false;
    }).length;

    const agotados = localProducts.filter(p => {
      const s = (p.itemsCelulares && p.itemsCelulares.length > 0)
        ? p.itemsCelulares.filter((u: any) => u.estadoDispositivo === 'Disponible').length
        : (p.stock || 0);
      return s === 0;
    }).length;

    const vigentes = localGarantias.filter(g => !g.eliminadoAt && (g.diasRestantes || 0) > 0).length;
    const anuladas = localGarantias.filter(g => !!g.eliminadoAt).length;

    const tasaRotacion = (unidadesVendidas + unidadesDisponibles) > 0
      ? (unidadesVendidas / (unidadesVendidas + unidadesDisponibles)) * 100
      : 0;

    return {
      stockNetoReal: stockNeto,
      unidadesVendidas,
      unidadesDisponibles,
      ingresosEstimados: ingresos,
      productosDisponibles: disponibles,
      productosAgotados: agotados,
      totalProductos: localProducts.length,
      garantiasVigentes: vigentes,
      garantiasAnuladas: anuladas,
      tasaRotacion: Math.round(tasaRotacion * 10) / 10
    };
  }
};

export const fetchMetricsCounts = async (): Promise<MetricsCounts> => {
  try {
    const { data } = await luckyphoneApi.get<MetricsCounts>('/v1/dashboard/counts');
    return data;
  } catch {
    const { data } = await luckyphoneApi.get<MetricsCounts>('/admin/metrics/counts').catch(() => null) || { data: null };
    if (data) return data;

    const localProducts: any[] = JSON.parse(localStorage.getItem('luckyphone_admin_products') || '[]');
    const localGarantias: any[] = JSON.parse(localStorage.getItem('luckyphone_garantias_local') || '[]');

    const disponibles = localProducts.filter(p => {
      const s = (p.itemsCelulares && p.itemsCelulares.length > 0)
        ? p.itemsCelulares.filter((u: any) => u.estadoDispositivo === 'Disponible').length
        : (p.stock || 0);
      return s > 0;
    }).length;

    const agotados = localProducts.filter(p => {
      const s = (p.itemsCelulares && p.itemsCelulares.length > 0)
        ? p.itemsCelulares.filter((u: any) => u.estadoDispositivo === 'Disponible').length
        : (p.stock || 0);
      return s === 0;
    }).length;

    const anulados = localGarantias.filter(g => !!g.eliminadoAt).length;
    const vigentes = localGarantias.filter(g => !g.eliminadoAt && (g.diasRestantes || 0) > 0).length;
    const caducados = localGarantias.filter(g => !g.eliminadoAt && (g.diasRestantes || 0) <= 0).length;
    const totales = localGarantias.filter(g => !g.eliminadoAt).length;

    return {
      disponibles,
      agotados,
      anulados,
      vigentes,
      caducados,
      totales,
      totalProductos: localProducts.length,
      itemsVendidos: 0,
      itemsDisponibles: disponibles
    };
  }
};
