import React from 'react';
import type { InventoryItem } from '../../interfaces/luckyPhoneTypes';
import {
  FaDollarSign,
  FaMobileAlt,
  FaFileInvoiceDollar,
  FaShieldAlt,
  FaArrowUp,
  FaCheckCircle,
  FaBarcode,
  FaFileAlt
} from 'react-icons/fa';

interface MetricsOverviewProps {
  inventory: InventoryItem[];
  onNavigateProforma: () => void;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  inventory,
  onNavigateProforma
}) => {
  const totalStock = inventory.reduce((acc, curr) => acc + (curr.stock || 0), 0);

  return (
    <div className="space-y-8 font-sans">
      {/* 📊 TARJETAS DE MÉTRICAS EJECUTIVAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* TARJETA 1: VENTAS MENSUALES */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-purple-600 group-hover:scale-110 transition-transform">
            <FaDollarSign className="text-6xl" />
          </div>
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Ventas del Mes</p>
          <h3 className="text-3xl font-black text-slate-900 mt-2 font-mono">S/ 148,920.00</h3>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit border border-emerald-200/60">
            <FaArrowUp className="text-[10px]" />
            <span>+14.2% vs mes anterior</span>
          </div>
        </div>

        {/* TARJETA 2: INVENTARIO EN STOCK */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-blue-600 group-hover:scale-110 transition-transform">
            <FaMobileAlt className="text-6xl" />
          </div>
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Equipos en Stock</p>
          <h3 className="text-3xl font-black text-slate-900 mt-2">{totalStock > 0 ? totalStock : 24} Unidades</h3>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg w-fit border border-purple-200/60">
            <FaCheckCircle className="text-[10px]" />
            <span>{inventory.length > 0 ? inventory.length : 12} Modelos Disponibles</span>
          </div>
        </div>

        {/* TARJETA 3: PROFORMAS EMITIDAS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-600 group-hover:scale-110 transition-transform">
            <FaFileInvoiceDollar className="text-6xl" />
          </div>
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Proformas Emitidas</p>
          <h3 className="text-3xl font-black text-slate-900 mt-2 font-mono">892 Proformas</h3>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg w-fit border border-indigo-200/60">
            <FaBarcode className="text-[10px]" />
            <span>100% con IMEI y Serie Impreso</span>
          </div>
        </div>

        {/* TARJETA 4: GARANTÍAS VIGENTES */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-600 group-hover:scale-110 transition-transform">
            <FaShieldAlt className="text-6xl" />
          </div>
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Garantías Activas</p>
          <h3 className="text-3xl font-black text-slate-900 mt-2">100% Cobertura</h3>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit border border-emerald-200/60">
            <FaCheckCircle className="text-[10px]" />
            <span>0 Reclamos Pendientes</span>
          </div>
        </div>
      </div>

      {/* 🚀 BANNER EJECUTIVO DE EMISIÓN DE PROFORMAS */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-900 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 border border-purple-800/40 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-extrabold text-xs border border-purple-500/30">
            <FaFileAlt /> MÓDULO COMERCIAL INTEGRADO
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Emisión de Proforma & Garantías A4</h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Genera documentos A4 de nivel corporativo con cálculo automático de IGV, discriminación de IMEI 1/2 Dual SIM, número de serie de accesorios y periodo de cobertura de garantía totalmente parametrizado.
          </p>
        </div>
        
        <button
          onClick={onNavigateProforma}
          className="relative z-10 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold px-7 py-3.5 rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer whitespace-nowrap text-xs sm:text-sm flex items-center gap-2"
        >
          <FaFileInvoiceDollar className="text-base" /> Emitir Nueva Proforma
        </button>
      </div>
    </div>
  );
};
