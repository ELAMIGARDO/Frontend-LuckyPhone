import React, { useState, useEffect } from 'react';
import {
  FaTimes,
  FaSave,
  FaEdit,
  FaUser,
  FaIdCard,
  FaPhone,
  FaMapMarkerAlt,
  FaTag,
  FaMobileAlt,
  FaBarcode,
  FaDollarSign
} from 'react-icons/fa';
import type { Garantia } from './useWarranties';

interface EditWarrantyModalProps {
  garantia: Garantia;
  loading: boolean;
  onClose: () => void;
  onSave: (updated: Garantia) => void;
}

export const EditWarrantyModal: React.FC<EditWarrantyModalProps> = ({
  garantia,
  loading,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Garantia>({ ...garantia });

  useEffect(() => {
    setFormData({ ...garantia });
  }, [garantia]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const isCelular = formData.categoria === 'Celulares';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 my-8">
        {/* CABECERA */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-600 rounded-xl text-white">
              <FaEdit className="text-xl" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Editar Póliza de Garantía</h3>
              <p className="text-slate-400 text-xs font-mono">Código Documento: {garantia.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* FORMULARIO COMPLETO AL NIVEL DE EMITIR PROFORMA */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-semibold text-slate-700">
          
          {/* SECCIÓN 1: DATOS DEL CLIENTE */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <h4 className="text-[11px] font-black uppercase text-purple-700 tracking-wider flex items-center gap-1.5">
              <FaUser /> Datos del Cliente
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-bold text-slate-800">Nombre Completo / Razón Social *</label>
                <input
                  type="text"
                  required
                  value={formData.cliente}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
                />
              </div>
              <div>
                <label className="block mb-1 font-bold text-slate-800 flex items-center gap-1">
                  <FaIdCard className="text-purple-600" /> DNI / RUC *
                </label>
                <input
                  type="text"
                  required
                  value={formData.dni}
                  onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-bold text-slate-800 flex items-center gap-1">
                  <FaPhone className="text-purple-600" /> Teléfono / WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.telefono || ''}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="+51 900 000 000"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
                />
              </div>
              <div>
                <label className="block mb-1 font-bold text-slate-800 flex items-center gap-1">
                  <FaMapMarkerAlt className="text-purple-600" /> Dirección
                </label>
                <input
                  type="text"
                  value={formData.direccion || ''}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  placeholder="Av. Ejemplo 123..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: PRODUCTO Y CATEGORÍA */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <h4 className="text-[11px] font-black uppercase text-purple-700 tracking-wider flex items-center gap-1.5">
              <FaTag /> Especificaciones del Producto
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block mb-1 font-bold text-slate-800">Categoría *</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white cursor-pointer font-bold"
                >
                  <option value="Celulares">Celulares</option>
                  <option value="Cargadores">Cargadores</option>
                  <option value="Audífonos">Audífonos</option>
                  <option value="Accesorios">Accesorios</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1 font-bold text-slate-800 flex items-center gap-1">
                  <FaMobileAlt className="text-purple-600" /> Modelo / Producto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.celular}
                  onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
                />
              </div>
            </div>

            {/* IDENTIFICADORES HARDWARE (IMEI 1, IMEI 2, SERIE) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block mb-1 font-bold text-slate-800 flex items-center gap-1">
                  <FaBarcode className="text-purple-600" /> IMEI 1 {isCelular && '*'}
                </label>
                <input
                  type="text"
                  required={isCelular}
                  value={formData.imei1 || ''}
                  onChange={(e) => setFormData({ ...formData, imei1: e.target.value })}
                  placeholder={isCelular ? 'Obligatorio...' : 'Opcional...'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white font-mono"
                />
              </div>

              <div>
                <label className="block mb-1 font-bold text-slate-800 flex items-center gap-1">
                  <FaBarcode className="text-purple-600" /> IMEI 2 (Dual SIM)
                </label>
                <input
                  type="text"
                  value={formData.imei2 || ''}
                  onChange={(e) => setFormData({ ...formData, imei2: e.target.value })}
                  placeholder="Opcional..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white font-mono"
                />
              </div>

              <div>
                <label className="block mb-1 font-bold text-slate-800 flex items-center gap-1">
                  <FaBarcode className="text-purple-600" /> N° de Serie
                </label>
                <input
                  type="text"
                  value={formData.numeroSerie || ''}
                  onChange={(e) => setFormData({ ...formData, numeroSerie: e.target.value })}
                  placeholder="Ej: F2LQX980P0DX"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: IMPORTE Y TIEMPO DE COBERTURA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div>
              <label className="block mb-1 font-bold text-slate-800 flex items-center gap-1">
                <FaDollarSign className="text-purple-600" /> Precio / Valor Base (S/)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.precioBase || 0}
                onChange={(e) => setFormData({ ...formData, precioBase: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white font-mono font-bold"
              />
            </div>

            <div>
              <label className="block mb-1 font-bold text-slate-800">Periodo de Cobertura de Garantía</label>
              <select
                value={formData.duracionGarantia || '12 Meses'}
                onChange={(e) => setFormData({ ...formData, duracionGarantia: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white cursor-pointer font-bold"
              >
                <option value="0 Meses">0 Meses (Sin Cobertura)</option>
                <option value="3 Meses">3 Meses</option>
                <option value="6 Meses">6 Meses</option>
                <option value="12 Meses">12 Meses</option>
                <option value="24 Meses">24 Meses</option>
              </select>
            </div>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <FaSave /> Guardar y Sincronizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
