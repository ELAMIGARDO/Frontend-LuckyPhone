import React from 'react';
import { FaPlus, FaTrashAlt, FaBarcode } from 'react-icons/fa';
import type { DeviceFormData } from './DeviceFormModal';

interface Props {
  formData: DeviceFormData;
  setFormData: React.Dispatch<React.SetStateAction<DeviceFormData>>;
  isCelularCategory: boolean;
}

export const DeviceItemCelularList: React.FC<Props> = ({
  formData,
  setFormData,
  isCelularCategory
}) => {
  if (!isCelularCategory) return null;

  const currentItems = formData.itemsCelulares || [];
  const isNuevo = formData.estado === 'Nuevo / Sellado';

  const handleAddUnit = () => {
    setFormData({
      ...formData,
      itemsCelulares: [
        ...currentItems,
        {
          imei1: '',
          imei2: '',
          numeroSerial: '',
          bateria: isNuevo ? '100%' : (formData.bateria || '90%'),
          estadoDispositivo: 'Disponible'
        }
      ]
    });
  };

  const handleRemoveUnit = (index: number) => {
    const updated = currentItems.filter((_, i) => i !== index);
    setFormData({ ...formData, itemsCelulares: updated });
  };

  return (
    <div className="pt-2 border-t border-slate-200 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Unidades Físicas / IMEIs del Celular
          </h4>
          <p className="text-[11px] text-slate-500">
            Puedes registrar 1 o múltiples unidades físicas (IMEI 1, IMEI 2, Serie y Batería) para este modelo.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddUnit}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs self-start"
        >
          <FaPlus className="text-[10px]" /> Agregar Otra Unidad (IMEI)
        </button>
      </div>

      {currentItems.length > 0 ? (
        <div className="space-y-3">
          {currentItems.map((item, index) => (
            <div
              key={index}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl relative space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-purple-900 bg-purple-100/70 px-2.5 py-0.5 rounded-lg flex items-center gap-1.5">
                  <span>📱 Unidad #{index + 1}</span>
                  <span
                    className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                      item.estadoDispositivo === 'Vendido'
                        ? 'bg-rose-100 text-rose-700'
                        : item.estadoDispositivo === 'Reservado'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {item.estadoDispositivo || 'Disponible'}
                  </span>
                </span>

                {currentItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveUnit(index)}
                    className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Eliminar esta unidad"
                  >
                    <FaTrashAlt className="text-xs" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1 text-[11px]">
                    IMEI 1 (Principal) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    placeholder="358921094857102"
                    value={item.imei1 || ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').substring(0, 15);
                      const updated = [...currentItems];
                      updated[index] = { ...updated[index], imei1: val };
                      const mainImei = index === 0 ? val : formData.imei;
                      setFormData({ ...formData, itemsCelulares: updated, imei: mainImei });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 font-mono font-bold text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1 text-[11px]">
                    IMEI 2 (eSIM / Opcional)
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="358921094857103"
                    value={item.imei2 || ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').substring(0, 15);
                      const updated = [...currentItems];
                      updated[index] = { ...updated[index], imei2: val };
                      const mainImei2 = index === 0 ? val : formData.imei2;
                      setFormData({ ...formData, itemsCelulares: updated, imei2: mainImei2 });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 font-mono font-bold text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1 text-[11px]">
                    N° de Serie (SN)
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="F2LXK990PM"
                    value={item.numeroSerial || ''}
                    onChange={(e) => {
                      const val = e.target.value.substring(0, 15);
                      const updated = [...currentItems];
                      updated[index] = { ...updated[index], numeroSerial: val };
                      const mainSN = index === 0 ? val : formData.numeroSerie;
                      setFormData({ ...formData, itemsCelulares: updated, numeroSerie: mainSN });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 font-mono font-bold text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1 text-[11px]">
                    Batería (%) {isNuevo && <span className="text-emerald-600 font-sans">(100% Sellado)</span>}
                  </label>
                  <input
                    type="text"
                    disabled={isNuevo}
                    placeholder="100% o 92%"
                    value={isNuevo ? '100%' : (item.bateria || '100%')}
                    onChange={(e) => {
                      const val = e.target.value;
                      const updated = [...currentItems];
                      updated[index] = { ...updated[index], bateria: val };
                      setFormData({ ...formData, itemsCelulares: updated });
                    }}
                    className={`w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 font-bold text-xs ${
                      isNuevo ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div>
            <label className="block text-slate-900 font-bold mb-1">
              Número de Serie (SN) * <span className="text-[10px] text-purple-700 font-mono font-bold">(Máx 15 caract.)</span>
            </label>
            <div className="relative">
              <FaBarcode className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                required={isCelularCategory}
                maxLength={15}
                placeholder="Ej: F2LXK990PM"
                value={formData.numeroSerie}
                onChange={(e) => setFormData({ ...formData, numeroSerie: e.target.value.substring(0, 15) })}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 font-mono font-bold text-sm bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-900 font-bold mb-1">
              Código IMEI 1 (Físico / SIM 1) * <span className="text-[10px] text-purple-700 font-mono font-bold">(Máx 15 dígitos)</span>
            </label>
            <input
              type="text"
              required={isCelularCategory}
              maxLength={15}
              placeholder="358921094857102"
              value={formData.imei}
              onChange={(e) => setFormData({ ...formData, imei: e.target.value.replace(/\D/g, '') })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 font-mono font-bold text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-slate-900 font-bold mb-1">
              Código IMEI 2 (eSIM / SIM 2) <span className="text-[10px] text-slate-400 font-mono">(Máx 15 dígitos)</span>
            </label>
            <input
              type="text"
              maxLength={15}
              placeholder="358921094857103"
              value={formData.imei2}
              onChange={(e) => setFormData({ ...formData, imei2: e.target.value.replace(/\D/g, '') })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 font-mono font-bold text-sm bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};
