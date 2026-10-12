import React from 'react';
import { FaPrint, FaTrashAlt, FaUndo, FaEdit } from 'react-icons/fa';
import type { Garantia } from './useWarranties';

interface WarrantyTableRowProps {
  garantia: Garantia;
  isAnulados: boolean;
  loading: boolean;
  onAnular: (item: Garantia) => void;
  onRestaurar: (id: string) => void;
  onEdit: (item: Garantia) => void;
  onReimprimir: (item: Garantia) => void;
}

export const WarrantyTableRow: React.FC<WarrantyTableRowProps> = ({
  garantia: w,
  isAnulados,
  loading,
  onAnular,
  onRestaurar,
  onEdit,
  onReimprimir
}) => {
  return (
    <tr
      className={`hover:bg-slate-50/90 transition-colors ${
        w.alerta && !isAnulados ? 'bg-rose-50/40' : ''
      }`}
    >
      <td className="py-3.5 px-4 font-mono font-black text-slate-900">{w.id}</td>
      <td className="py-3.5 px-4">
        <div className="font-bold text-slate-900">{w.cliente}</div>
        <span className="font-mono text-[10px] text-slate-500">DNI: {w.dni}</span>
      </td>
      <td className="py-3.5 px-4">
        <div className="font-bold text-slate-800">{w.celular}</div>
        <span className="inline-block text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-bold">
          {w.categoria}
        </span>
      </td>
      <td className="py-3.5 px-4 font-mono text-xs">
        {w.categoria === 'Celulares' ? (
          <div className="space-y-0.5 text-[10px]">
            {w.imei1 && (
              <p className="text-purple-700 font-bold">
                <span className="text-slate-400">IMEI 1:</span> {w.imei1}
              </p>
            )}
            {w.numeroSerie && (
              <p className="text-slate-600 font-medium">
                <span className="text-slate-400">S/N:</span> {w.numeroSerie}
              </p>
            )}
          </div>
        ) : (
          <div className="text-[10px] text-slate-700 font-medium">
            <span className="text-slate-400">S/N:</span> {w.numeroSerie || 'N/A'}
          </div>
        )}
      </td>

      {/* COBERTURA (MESES) */}
      <td className="py-3.5 px-4">
        <span className="inline-block px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded font-mono font-extrabold text-[11px]">
          {w.duracionGarantia || '12 Meses'}
        </span>
      </td>

      <td className="py-3.5 px-4 font-mono text-slate-600">{w.activacion}</td>
      <td className="py-3.5 px-4 font-mono font-bold text-rose-600">{w.caducidad}</td>

      {/* ESTADO LEGAL Y PAGO */}
      <td className="py-3.5 px-4 text-center">
        {isAnulados ? (
          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold border text-rose-700 bg-rose-50 border-rose-200">
            Anulado
          </span>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <span
              className={`inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${
                w.diasRestantes > 0
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : 'text-rose-700 bg-rose-50 border-rose-200 animate-pulse'
              }`}
            >
              {w.diasRestantes > 0 ? `Vigente (${w.diasRestantes}d)` : `Caducado`}
            </span>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold ${
                w.estadoPago === 'PAGADO'
                  ? 'bg-emerald-600 text-white'
                  : w.estadoPago === 'ANULADO'
                  ? 'bg-slate-400 text-white'
                  : 'bg-amber-500 text-white animate-bounce'
              }`}
            >
              {w.estadoPago || 'PENDIENTE'}
            </span>
          </div>
        )}
      </td>

      {/* ACCIONES DINÁMICAS */}
      <td className="py-3.5 px-4 text-center">
        {isAnulados ? (
          <button
            onClick={() => onRestaurar(w.id)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            title="Restaurar Garantía"
          >
            <FaUndo className="text-xs" /> Restaurar
          </button>
        ) : (
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {w.estadoPago !== 'PAGADO' && (
              <button
                onClick={() => onEdit(w)} // Will trigger payment action if called or dedicated
                className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm"
                title="Cobrar Proforma"
              >
                💵 Cobrar
              </button>
            )}
            <button
              onClick={() => onEdit(w)}
              className="inline-flex items-center gap-1 text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm"
              title="Editar Datos de la Garantía"
            >
              <FaEdit className="text-xs" /> Editar
            </button>
            <button
              onClick={() => onReimprimir(w)}
              className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm"
              title="Reimprimir Póliza / Proforma A4"
            >
              <FaPrint className="text-xs text-purple-600" /> Reimprimir
            </button>
            <button
              onClick={() => onAnular(w)}
              className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm"
              title="Anular o Eliminar Garantía"
            >
              <FaTrashAlt className="text-xs" /> Eliminar
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};
