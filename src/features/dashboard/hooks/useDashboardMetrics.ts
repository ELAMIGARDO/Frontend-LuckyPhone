import { useState, useEffect, useCallback } from 'react';
import { fetchDashboardMetrics, type DashboardMetrics } from '../../../services/dashboardService';
import { useInventoryContext } from '../../../context/InventoryContext';

const initialMetrics: DashboardMetrics = {
  stockNetoReal: 0,
  unidadesVendidas: 0,
  unidadesDisponibles: 0,
  ingresosEstimados: 0,
  productosDisponibles: 0,
  productosAgotados: 0,
  totalProductos: 0,
  garantiasVigentes: 0,
  garantiasAnuladas: 0,
  tasaRotacion: 0
};

export const useDashboardMetrics = () => {
  const { inventory } = useInventoryContext();
  const [metrics, setMetrics] = useState<DashboardMetrics>(initialMetrics);
  const [loading, setLoading] = useState<boolean>(true);

  const loadMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchDashboardMetrics();
      setMetrics(data);
    } catch (error) {
      console.error("Error al cargar métricas del dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics, inventory]);

  return {
    metrics,
    loading,
    refreshMetrics: loadMetrics
  };
};
