import React from 'react';
import { FaUser, FaTag, FaUserCheck, FaBarcode, FaPrint, FaFileInvoiceDollar } from 'react-icons/fa';
import type { ProformaData } from '../hooks/useProforma';
import { ProductAutocomplete } from './ProductAutocomplete';
import type { CatalogItem } from './ProductAutocomplete';

interface ProformaFormProps {
  data: ProformaData;
  montoDescuento: number;
  isSaving: boolean;
  onChange: (field: keyof ProformaData, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ProformaForm: React.FC<ProformaFormProps> = ({
  data,
  montoDescuento,
  isSaving,
  onChange,
  onSubmit,
}) => {
  const isCelular = data.categoria === 'Celulares';
  const opcionesGarantia = ['0 Meses', '3 Meses', '6 Meses', '12 Meses', '24 Meses'];

  const handleSelectProduct = (item: CatalogItem) => {
    onChange('categoria', item.categoria);
    onChange('productoModelo', item.nombre);
    onChange('precioBase', item.precio);

    if (item.categoria === 'Celulares') {
      if (item.imei1) onChange('imei1', item.imei1);
      if (item.imei2) onChange('imei2', item.imei2);
      if (item.numeroSerie) onChange('numeroSerie', item.numeroSerie);
    } else {
      onChange('imei1', '');
      onChange('imei2', '');
      if (item.numeroSerie) onChange('numeroSerie', item.numeroSerie);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 print:hidden"
    >
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-200">
          <FaFileInvoiceDollar className="text-xl" />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-900 text-base">Emisión de Proforma & Garantía</h3>
          <p className="text-xs text-slate-500 font-medium">
            Completa los datos para generar el documento en tiempo real.
          </p>
        </div>
      </div>

      <ProductAutocomplete onSelect={handleSelectProduct} />

      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase text-purple-700 tracking-wider flex items-center gap-1.5">
          <FaUserCheck className="text-xs" /> Datos del Emisor
        </h4>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Nombre del Emisor</label>
          <input
            type="text"
            required
            value={data.emisorNombre}
            onChange={(e) => onChange('emisorNombre', e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-purple-50/20"
            placeholder="Ej. Mg. Carlos Eduardo Alva"
          />
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-100">
        <h4 className="text-xs font-black uppercase text-purple-700 tracking-wider flex items-center gap-1.5">
          <FaUser className="text-xs" /> Información del Comprador
        </h4>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Nombre Completo del Cliente
          </label>
          <input
            type="text"
            required
            value={data.clienteNombre}
            onChange={(e) => onChange('clienteNombre', e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              DNI / RUC{' '}
              <span className="text-[10px] text-purple-600 font-normal font-sans">
                (8 o 11 dígitos)
              </span>
            </label>
            <input
              type="text"
              required
              maxLength={11}
              placeholder="Ej: 74839201 o 20601234567"
              value={data.clienteDni}
              onChange={(e) => {
                const numericVal = e.target.value.replace(/\D/g, '').substring(0, 11);
                onChange('clienteDni', numericVal);
              }}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 font-mono bg-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Teléfono de Contacto{' '}
              <span className="text-[10px] text-slate-400 font-normal">(Máx 15 car.)</span>
            </label>
            <input
              type="text"
              maxLength={15}
              placeholder="+51 912345678"
              value={data.clienteTelefono}
              onChange={(e) => onChange('clienteTelefono', e.target.value.substring(0, 15))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Dirección Registrada{' '}
            <span className="text-[10px] text-slate-400 font-normal">(Máx 60 caracteres)</span>
          </label>
          <input
            type="text"
            maxLength={60}
            placeholder="Av. Las Camelias 450, San Isidro, Lima"
            value={data.clienteDireccion}
            onChange={(e) => onChange('clienteDireccion', e.target.value.substring(0, 60))}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
          />
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-100">
        <h4 className="text-xs font-black uppercase text-purple-700 tracking-wider flex items-center gap-1.5">
          <FaTag className="text-xs" /> Detalle del Equipo & Garantía
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Categoría del Producto
            </label>
            <select
              value={data.categoria}
              onChange={(e) => onChange('categoria', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
            >
              <option value="Celulares">Celulares</option>
              <option value="Cargadores">Cargadores</option>
              <option value="Audífonos">Audífonos</option>
              <option value="Accesorios">Accesorios</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Modelo / Nombre</label>
            <input
              type="text"
              required
              value={data.productoModelo}
              onChange={(e) => onChange('productoModelo', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
            />
          </div>
        </div>

        <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/80 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 border-b border-slate-200 pb-1">
            <FaBarcode className="text-purple-600" />
            <span>Identificadores ({data.categoria})</span>
          </div>

          {isCelular ? (
            <>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">IMEI 1</label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    value={data.imei1}
                    onChange={(e) => onChange('imei1', e.target.value)}
                    placeholder="IMEI principal"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    IMEI 2 (Opcional)
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    value={data.imei2}
                    onChange={(e) => onChange('imei2', e.target.value)}
                    placeholder="IMEI secundario"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                  Número de Serie del Equipo
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={data.numeroSerie}
                  onChange={(e) => onChange('numeroSerie', e.target.value)}
                  placeholder="S/N del fabricante (máx. 15 chars)"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">
                Número de Serie (S/N)
              </label>
              <input
                type="text"
                maxLength={15}
                value={data.numeroSerie}
                onChange={(e) => onChange('numeroSerie', e.target.value)}
                placeholder="S/N del accesorio (máx. 15 chars)"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Precio Base (S/)</label>
            <input
              type="number"
              value={data.precioBase}
              onChange={(e) => onChange('precioBase', Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[11px] font-bold text-slate-700">Descuento</label>
              {data.descuentoTipo === 'porcentaje' && data.descuentoValor > 0 && (
                <span className="text-[10px] font-mono font-bold text-rose-600">
                  (-S/ {montoDescuento.toFixed(2)})
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <select
                value={data.descuentoTipo}
                onChange={(e) =>
                  onChange('descuentoTipo', e.target.value as 'soles' | 'porcentaje')
                }
                className="w-16 px-1.5 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-slate-100 text-slate-700 cursor-pointer"
              >
                <option value="soles">S/</option>
                <option value="porcentaje">%</option>
              </select>
              <input
                type="number"
                value={data.descuentoValor}
                onChange={(e) => onChange('descuentoValor', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="block text-[11px] font-bold text-slate-700">
              Cobertura de Garantía{' '}
              <span className="text-purple-600 font-extrabold font-mono">
                ({parseInt(data.duracionGarantia, 10) || 0} Meses)
              </span>
            </label>
            <span className="text-[10px] text-slate-400 font-medium">Por defecto: 0 (Manual)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-28">
              <input
                type="number"
                min={0}
                max={60}
                value={parseInt(data.duracionGarantia, 10) || 0}
                onChange={(e) => {
                  const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                  onChange('duracionGarantia', `${val} Meses`);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-black font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
                placeholder="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 pointer-events-none">
                Meses
              </span>
            </div>
            <div className="flex-1 grid grid-cols-5 gap-1">
              {opcionesGarantia.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onChange('duracionGarantia', opt)}
                  className={`py-2 px-1 text-[10px] font-bold rounded-xl border transition-all cursor-pointer text-center ${
                    data.duracionGarantia === opt
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
      >
        <FaPrint />
        <span>
          {isSaving ? 'Guardando en Base de Datos...' : 'Guardar y Generar PDF / Imprimir'}
        </span>
      </button>
    </form>
  );
};
