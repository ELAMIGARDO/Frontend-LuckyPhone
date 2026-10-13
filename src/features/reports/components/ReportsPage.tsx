import React from 'react';
import {
  FaFileExcel,
  FaFilePdf,
  FaCalendarAlt,
  FaFilter,
  FaReceipt,
  FaBarcode,
  FaCoins,
  FaSpinner,
  FaHistory
} from 'react-icons/fa';
import { useReportActions } from '../hooks/useReportActions';

export const ReportsPage: React.FC = () => {
  const {
    periodo,
    setPeriodo,
    categoria,
    setCategoria,
    isExportingExcel,
    isExportingPdf,
    handleExportExcel,
    handleExportPdf,
    salesHistory
  } = useReportActions();

  const periodOptions = [
    { id: 'todos', label: 'Histórico Total' },
    { id: 'dias', label: 'Últimos 7 Días' },
    { id: 'semanas', label: 'Últimas 4 Semanas' },
    { id: 'meses', label: 'Últimos 6 Meses' },
    { id: 'anios', label: 'Último Año' },
  ];

  const categoryOptions = [
    'TODOS',
    'Celulares',
    'Cargadores',
    'Audífonos',
    'Accesorios'
  ];

  const totalIngresos = salesHistory.reduce((acc, it) => acc + (it.precio || 0), 0);

  return (
    <div className="w-full space-y-6 animate-fadeIn font-sans pb-12">
      {/* ======================================================== */}
      {/* 1. HEADER DE REPORTERÍA Y AUDITORÍA CONTABLE */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
            <span className="p-2 bg-purple-50 text-purple-700 rounded-xl border border-purple-100">
              <FaReceipt className="text-lg" />
            </span>
            Centro de Reportería & Auditoría Contable
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Módulo independiente para auditoría externa de caja física, rotación de hardware y exportación formal en formatos A4 y Excel.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={isExportingExcel}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-60"
            title="Descargar análisis de rotación e inventario en formato Excel (.xlsx)"
          >
            {isExportingExcel ? (
              <FaSpinner className="animate-spin text-emerald-600 text-sm" />
            ) : (
              <FaFileExcel className="text-emerald-600 text-sm" />
            )}
            <span>Exportar Excel (Rotación)</span>
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-60"
            title="Descargar reporte contable estricto A4 indexado por correlativo continuo"
          >
            {isExportingPdf ? (
              <FaSpinner className="animate-spin text-rose-600 text-sm" />
            ) : (
              <FaFilePdf className="text-rose-600 text-sm" />
            )}
            <span>Exportar PDF (A4 Contable)</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. BARRA DE FILTROS POR PERIODO Y CATEGORÍA */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Selector de Periodo */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
            <FaCalendarAlt className="text-purple-600 text-xs" />
            <span className="font-bold text-slate-500">Periodo:</span>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="bg-transparent font-bold text-slate-800 text-xs outline-none cursor-pointer"
            >
              {periodOptions.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Selector de Categoría */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
            <FaFilter className="text-purple-600 text-xs" />
            <span className="font-bold text-slate-500">Categoría:</span>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="bg-transparent font-bold text-slate-800 text-xs outline-none cursor-pointer"
            >
              {categoryOptions.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Resumen rápido de auditoría */}
        <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
          <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <FaBarcode className="text-purple-600" />
            Unidades Vendidas: <strong className="text-slate-900 font-mono">{salesHistory.length}</strong>
          </span>
          <span className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-emerald-800">
            <FaCoins className="text-emerald-600" />
            Recaudación Bruta: <strong className="font-mono">S/ {totalIngresos.toFixed(2)}</strong>
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. TABLA DE HISTORIAL DE VENTAS Y AUDITORÍA DE IMEIS */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <FaHistory className="text-purple-600 text-sm" />
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">
              Desglose Secuencial de Unidades Físicas Vendidas ({salesHistory.length} registros)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Índice correlativo continuo para balance contable
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-900 text-slate-200 font-extrabold uppercase text-[10px] tracking-wider select-none">
              <tr>
                <th className="py-3 px-3 text-center w-12">#</th>
                <th className="py-3 px-4">Modelo / Marca</th>
                <th className="py-3 px-4">Capacidad / Color</th>
                <th className="py-3 px-4">IMEI 1</th>
                <th className="py-3 px-4">N° Serie (SN)</th>
                <th className="py-3 px-3 text-center">Batería</th>
                <th className="py-3 px-4 text-center">Fecha de Venta</th>
                <th className="py-3 px-4 text-right">Precio Venta (S/)</th>
                <th className="py-3 px-3 text-center">Estado</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {salesHistory.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-slate-400 font-medium">
                    <div className="flex flex-col items-center gap-2">
                      <FaReceipt className="text-3xl text-slate-300" />
                      <p className="text-sm font-semibold text-slate-600">
                        No se encontraron registros de ventas en la categoría "{categoria}" para el periodo seleccionado.
                      </p>
                      <p className="text-xs text-slate-400">
                        Las unidades físicas vendidas en caja aparecerán automáticamente en esta auditoría.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                salesHistory.map((item) => (
                  <tr key={`${item.productoId}-${item.itemId || item.correlativo}`} className="hover:bg-slate-50/80 transition-colors">
                    {/* Correlativo Continuo Incremental (#1, #2, #3...) */}
                    <td className="py-3 px-3 text-center font-bold font-mono text-purple-700 bg-purple-50/30">
                      #{item.correlativo}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-extrabold text-slate-900 block">{item.modelo}</span>
                      <span className="text-[10px] text-slate-400 font-medium uppercase">{item.marca} • {item.categoria}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-700 block">{item.almacenamiento} • {item.ram}</span>
                      <span className="text-[11px] text-slate-500">{item.color}</span>
                    </td>

                    <td className="py-3 px-4 font-mono text-xs font-bold text-slate-800">
                      {item.imei1 || '-'}
                    </td>

                    <td className="py-3 px-4 font-mono text-xs text-slate-600">
                      {item.numeroSerial || '-'}
                    </td>

                    <td className="py-3 px-3 text-center font-semibold text-slate-700">
                      {item.bateria || '100%'}
                    </td>

                    <td className="py-3 px-4 text-center font-medium text-slate-600">
                      {item.fechaVenta ? new Date(item.fechaVenta).toLocaleDateString('es-PE') : 'Reciente'}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-black text-slate-900 text-sm">
                      S/ {(item.precio || 0).toFixed(2)}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className="inline-block bg-rose-100 text-rose-700 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                        Vendido
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
