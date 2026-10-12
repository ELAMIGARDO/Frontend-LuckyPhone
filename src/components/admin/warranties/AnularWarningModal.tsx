import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import type { Garantia } from './useWarranties';

interface AnularWarningModalProps {
  garantia: Garantia;
  loading: boolean;
  onCancel: () => void;
  onConfirm: (id: string) => void;
}

export const AnularWarningModal: React.FC<AnularWarningModalProps> = ({
  garantia,
  loading,
  onCancel,
  onConfirm
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
        <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
          <FaExclamationTriangle className="text-2xl shrink-0" />
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">
              ⚠️ ¡Advertencia de Seguridad!
            </h4>
            <p className="text-[11px] text-amber-800 font-medium leading-tight">
              Acción irreversible de anulación.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          Estás a punto de <strong className="text-rose-600">ANULAR</strong> la garantía de{' '}
          <strong className="text-slate-900">{garantia.cliente}</strong> (
          <span className="font-mono text-purple-700">{garantia.id}</span>), la cual se encuentra actualmente{' '}
          <strong className="text-emerald-600">VIGENTE</strong> ({garantia.diasRestantes} días restantes). Esta acción ocultará el historial legal del cliente. ¿Estás seguro de que deseas proceder?
        </p>

        <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(garantia.id)}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Anulando...' : 'Sí, Anular Garantía'}
          </button>
        </div>
      </div>
    </div>
  );
};
