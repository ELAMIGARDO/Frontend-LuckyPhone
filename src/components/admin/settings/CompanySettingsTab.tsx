import React, { useState } from 'react';
import { FaStore, FaSave } from 'react-icons/fa';
import type { CompanyData } from '../../../interfaces/luckyPhoneTypes';

export const CompanySettingsTab: React.FC = () => {
  const [empresa, setEmpresa] = useState<CompanyData>(() => {
    const saved = localStorage.getItem('luckyphone_empresa_config');
    if (saved) return JSON.parse(saved);
    return {
      nombre: 'LuckyPhone S.A.C.',
      ruc: '20609876543',
      direccion: 'Av. Tecnología 1024, Tienda 15 - Lima, Perú',
      telefono: '+51 912 345 678',
      email: 'contacto@luckyphone.pe',
      web: 'https://luckyphone.pe',
      cuentasBancarias: 'BCP Soles: 191-99887766-0-12 | BBVA Soles: 0011-0123-0200345678',
      terminosGarantia: 'La presente garantía cubre defectos de fabricación por el tiempo estipulado. No cubre daños por humedad, golpes físicos, manipulación por terceros no autorizados o alteraciones de software/IMEI.'
    };
  });

  const [guardadoExitosoEmpresa, setGuardadoExitosoEmpresa] = useState(false);

  const handleGuardarEmpresa = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('luckyphone_empresa_config', JSON.stringify(empresa));
    setGuardadoExitosoEmpresa(true);
    setTimeout(() => setGuardadoExitosoEmpresa(false), 3000);
  };

  return (
    <form onSubmit={handleGuardarEmpresa} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <FaStore className="text-purple-600" /> Datos Comerciales y Póliza Legal (Proforma A4)
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Esta información se inyecta automáticamente en las cabeceras y términos de la proforma impresa.
          </p>
        </div>
        {guardadoExitosoEmpresa && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
            ✓ Guardado exitosamente
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Razón Social / Nombre Comercial</label>
          <input
            type="text"
            required
            value={empresa.nombre}
            onChange={(e) => setEmpresa({ ...empresa, nombre: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">RUC (Registro Único)</label>
          <input
            type="text"
            required
            maxLength={11}
            value={empresa.ruc}
            onChange={(e) => setEmpresa({ ...empresa, ruc: e.target.value.replace(/\D/g, '') })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold font-mono focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Dirección de la Tienda Principal</label>
          <input
            type="text"
            required
            maxLength={80}
            value={empresa.direccion}
            onChange={(e) => setEmpresa({ ...empresa, direccion: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono / WhatsApp de Atención</label>
          <input
            type="text"
            required
            value={empresa.telefono}
            onChange={(e) => setEmpresa({ ...empresa, telefono: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Cuentas Bancarias para Depósitos / Transferencias</label>
        <input
          type="text"
          value={empresa.cuentasBancarias || ''}
          onChange={(e) => setEmpresa({ ...empresa, cuentasBancarias: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500"
          placeholder="Ej: BCP: 191-xxxx | Interbank: 200-xxxx"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Cláusula Legal & Términos de la Garantía de Hardware (Póliza Impresa A4)
        </label>
        <textarea
          rows={4}
          value={empresa.terminosGarantia || ''}
          onChange={(e) => setEmpresa({ ...empresa, terminosGarantia: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-purple-500 leading-relaxed"
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
        >
          <FaSave /> Guardar Cambios de la Empresa
        </button>
      </div>
    </form>
  );
};
