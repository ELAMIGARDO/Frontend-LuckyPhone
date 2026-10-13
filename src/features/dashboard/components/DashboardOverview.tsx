import React from 'react';
import {
  FaBoxes,
  FaShoppingCart,
  FaCoins,
  FaExclamationTriangle,
  FaShieldAlt,
  FaSyncAlt,
  FaArrowRight,
  FaChartLine,
  FaMobileAlt,
  FaReceipt
} from 'react-icons/fa';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';

interface DashboardOverviewProps {
  onNavigateInventory?: () => void;
  onNavigateReports?: () => void;
  onNavigateProforma?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigateInventory,
  onNavigateReports,
  onNavigateProforma
}) => {
  const { metrics, loading, refreshMetrics } = useDashboardMetrics();

  return (
    <div className="w-full space-y-6 animate-fadeIn font-sans pb-12">
      {/* ======================================================== */}
      {/* 1. ENCABEZADO DEL DASHBOARD */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
            <span className="p-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100">
              <FaChartLine className="text-lg" />
            </span>
            Dashboard Ejecutivo & Salud del Negocio
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Métricas consolidadas de caja física, rotación de hardware y balance neto del almacén en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshMetrics}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            title="Recalcular KPIs"
          >
            <FaSyncAlt className={`text-xs ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar Métricas</span>
          </button>

          {onNavigateReports && (
            <button
              onClick={onNavigateReports}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <FaReceipt className="text-xs" />
              <span>Ver Reportes A4 / Excel</span>
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. TARJETAS DE KPIS PRINCIPALES */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: STOCK REAL NETO */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
              Stock Real Neto
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono">
              {metrics.stockNetoReal} <span className="text-sm font-sans font-bold text-slate-500">unidades</span>
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              ✓ Hardware Físico en vitrina
            </p>
          </div>
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <FaBoxes className="text-xl" />
          </div>
        </div>

        {/* KPI 2: UNIDADES FÍSICAS VENDIDAS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
              Unidades Vendidas
            </span>
            <h3 className="text-2xl font-black text-indigo-700 mt-1 font-mono">
              {metrics.unidadesVendidas} <span className="text-sm font-sans font-bold text-slate-500">equipos</span>
            </h3>
            <p className="text-[11px] text-indigo-600 font-semibold mt-1">
              {metrics.tasaRotacion}% tasa de rotación
            </p>
          </div>
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
            <FaShoppingCart className="text-xl" />
          </div>
        </div>

        {/* KPI 3: INGRESOS ESTIMADOS DE CAJA */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
              Facturación Estimada
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono">
              S/ {metrics.ingresosEstimados.toFixed(2)}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              En base a IMEI vendidos
            </p>
          </div>
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
            <FaCoins className="text-xl" />
          </div>
        </div>

        {/* KPI 4: MODELOS AGOTADOS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
              Equipos Agotados
            </span>
            <h3 className="text-2xl font-black text-rose-600 mt-1 font-mono">
              {metrics.productosAgotados} <span className="text-sm font-sans font-bold text-slate-500">modelos</span>
            </h3>
            <p className="text-[11px] text-rose-600 font-semibold mt-1">
              Historial preservado
            </p>
          </div>
          <div className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100">
            <FaExclamationTriangle className="text-xl" />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. PANELES DE ESTADO Y GARANTÍAS */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Panel Izquierdo: Balance de Stock y Catálogo */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <FaMobileAlt className="text-purple-600" />
              Estado del Inventario
            </h3>
            <span className="text-xs font-mono font-bold text-slate-500">
              Total: {metrics.totalProductos} modelos
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Modelos Activos con Stock:</span>
                <span className="text-emerald-700 font-mono">{metrics.productosDisponibles}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${metrics.totalProductos > 0 ? (metrics.productosDisponibles / metrics.totalProductos) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Modelos Agotados (Stock 0):</span>
                <span className="text-rose-700 font-mono">{metrics.productosAgotados}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${metrics.totalProductos > 0 ? (metrics.productosAgotados / metrics.totalProductos) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          </div>

          {onNavigateInventory && (
            <button
              onClick={onNavigateInventory}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 transition-all cursor-pointer"
            >
              <span>Gestionar Inventario y Unidades</span>
              <FaArrowRight className="text-xs text-purple-600" />
            </button>
          )}
        </div>

        {/* Panel Central: Trazabilidad de Garantías */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <FaShieldAlt className="text-purple-600" />
              Auditoría de Garantías
            </h3>
            <span className="text-xs font-mono font-bold text-purple-700">
              Vigentes: {metrics.garantiasVigentes}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <span className="font-bold text-emerald-900">Garantías Vigentes en Cobertura:</span>
              <span className="font-mono font-black text-emerald-700 text-sm">{metrics.garantiasVigentes}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-700">Registros Anulados / Devoluciones:</span>
              <span className="font-mono font-black text-slate-600 text-sm">{metrics.garantiasAnuladas}</span>
            </div>
          </div>

          {onNavigateProforma && (
            <button
              onClick={onNavigateProforma}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 transition-all cursor-pointer"
            >
              <span>Emitir Nueva Proforma o Garantía</span>
              <FaArrowRight className="text-xs text-purple-600" />
            </button>
          )}
        </div>

        {/* Panel Derecho: Atajos y Reportería Contable */}
        <div className="bg-gradient-to-br from-slate-900 to-purple-950 text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase text-purple-300 tracking-wider">
              Auditoría & Balances
            </span>
            <h4 className="text-base font-extrabold leading-snug">
              Exportación Formal A4 y Rotación para Contabilidad
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Descarga los reportes desglosados con correlativo secuencial continuo (#1, #2, #3...) o la hoja de cálculo con fórmulas de auditoría.
            </p>
          </div>

          {onNavigateReports && (
            <button
              onClick={onNavigateReports}
              className="mt-6 flex items-center justify-center gap-2 py-3 px-4 bg-white text-slate-900 hover:bg-purple-50 rounded-xl text-xs font-extrabold transition-all shadow-md cursor-pointer active:scale-95"
            >
              <FaReceipt className="text-purple-600" />
              <span>Abrir Centro de Reportería</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
