import React from 'react';
import { FaShieldAlt, FaCalendarCheck } from 'react-icons/fa';
import type { ProformaData } from './ProformaDocument';

interface ProformaPreviewA4Props {
  data: ProformaData;
  precioFinal: number;
  montoDescuento: number;
  fechaEmision: string;
  fechaFinGarantia: string | null;
}

export const ProformaPreviewA4: React.FC<ProformaPreviewA4Props> = ({
  data,
  precioFinal,
  montoDescuento,
  fechaEmision,
  fechaFinGarantia
}) => {
  const isCelular = data.categoria === 'Celulares';

  const [companyInfo] = React.useState(() => {
    try {
      const saved = localStorage.getItem('luckyphone_empresa_config');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      nombre: 'LUCKYPHONE',
      ruc: '20609876543',
      direccion: 'Av. Tecnología 1024, Tienda 15 - Lima, Perú',
      telefono: '+51 912 345 678',
      terminosGarantia: ''
    };
  });

  return (
    <div className="lg:col-span-7 flex flex-col items-center w-full">
      {/* 🌟 1. ÁREA DE IMPRESIÓN AISLADA (id="proforma-a4-printable") */}
      <div
        id="proforma-a4-printable"
        className="w-full bg-white p-6 sm:p-8 shadow-xl rounded-2xl border border-slate-200 text-slate-800 text-xs flex flex-col justify-between print:shadow-none print:border-none print:p-0 print:m-0 font-sans"
      >
        <div>
          {/* 🌟 4. ENCABEZADO EDITORIAL DE ALTO NIVEL DINÁMICO */}
          <div className="flex justify-between items-start pb-4 mb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-sm">
                  📱
                </div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  {companyInfo.nombre.toUpperCase().includes('LUCKY') ? (
                    <>LUCKY<span className="text-purple-600">PHONE</span></>
                  ) : (
                    companyInfo.nombre
                  )}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">RUC: {companyInfo.ruc} • Venta de Celulares </p>
              <p className="text-[11px] text-slate-500 font-medium">{companyInfo.direccion} • Tel: {companyInfo.telefono}</p>
            </div>
            <div className="text-right">
              <div className="inline-block bg-purple-50 text-purple-700 px-3.5 py-1.5 rounded-xl border border-purple-200 font-mono font-black text-xs">
                {data.codigoProforma}
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 font-semibold">
                Emisión: {fechaEmision}
              </p>
            </div>
          </div>

          {/* 🌟 2. BLOQUE DE CLIENTE SIMÉTRICO Y ORDENADO (Grid grid-cols-2 bg-gray-50) */}
          <div className="my-5 bg-gray-50 border border-gray-100 rounded-lg p-4 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Cliente
              </span>
              <p className="text-sm font-bold text-gray-800">
                {data.clienteNombre || 'Cliente General'}
              </p>

              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block pt-2">
                Dirección
              </span>
              <p className="text-xs font-medium text-gray-700">
                {data.clienteDireccion || 'Dirección no especificada'}
              </p>
            </div>

            <div className="space-y-1 text-right">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                DNI / RUC
              </span>
              <p className="text-sm font-bold font-mono text-gray-800">
                {data.clienteDni || 'N/A'}
              </p>

              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block pt-2">
                Teléfono
              </span>
              <p className="text-xs font-medium text-gray-700">
                {data.clienteTelefono || 'Sin teléfono'}
              </p>
            </div>
          </div>

          {/* 🌟 3. TABLA DE ÍTEMS CON TOTAL UNIFICADO EN EL PIE (tfoot) */}
          <table className="w-full text-left border-collapse my-6">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px] uppercase font-black tracking-wider">
                <th className="py-2.5 px-3.5 rounded-l-lg">Ítem / Descripción</th>
                <th className="py-2.5 px-3.5">IMEI / Serie</th>
                <th className="py-2.5 px-3.5 text-right rounded-r-lg">Total (S/)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              <tr>
                <td className="py-3.5 px-3.5 font-bold text-slate-900">
                  <div className="text-sm">{data.productoModelo || 'Producto General'}</div>
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-bold">
                    {data.categoria}
                  </span>
                </td>
                <td className="py-3.5 px-3.5 font-mono">
                  {isCelular ? (
                    <div className="space-y-0.5 text-xs">
                      {data.imei1 && (
                        <p className="text-purple-800 font-bold">
                          <span className="text-slate-400 font-normal">IMEI 1:</span> {data.imei1}
                        </p>
                      )}
                      {data.imei2 && (
                        <p className="text-purple-700 font-semibold">
                          <span className="text-slate-400 font-normal">IMEI 2:</span> {data.imei2}
                        </p>
                      )}
                      {data.numeroSerie && (
                        <p className="text-slate-700 font-medium">
                          <span className="text-slate-400 font-normal">S/N:</span> {data.numeroSerie}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-700 font-medium">
                      <span className="text-slate-400 font-normal">S/N:</span> {data.numeroSerie || 'N/A'}
                    </div>
                  )}
                </td>
                <td className="py-3.5 px-3.5 text-right font-mono font-black text-slate-900 text-sm">
                  S/ {data.precioBase ? data.precioBase.toFixed(2) : '0.00'}
                </td>
              </tr>
            </tbody>

            {/* TOTAL INTEGRADO DIRECTAMENTE EN LA MISMA TABLA */}
            <tfoot>
              {montoDescuento > 0 && (
                <tr className="border-t border-slate-200 text-rose-600 font-bold">
                  <td colSpan={2} className="py-2 px-3.5 text-right text-xs">
                    Descuento ({data.descuentoTipo === 'porcentaje' ? `${data.descuentoValor}%` : 'Monto'}):
                  </td>
                  <td className="py-2 px-3.5 text-right font-mono text-xs">
                    -S/ {montoDescuento.toFixed(2)}
                  </td>
                </tr>
              )}
              <tr className="bg-purple-50/50 border-t-2 border-purple-200">
                <td colSpan={2} className="py-3 px-3.5 text-right font-extrabold text-slate-900 text-sm">
                  TOTAL A PAGAR:
                </td>
                <td className="py-3 px-3.5 text-right font-mono text-lg font-bold text-purple-700">
                  S/ {precioFinal.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* 🌟 4. CERTIFICADO DE GARANTÍA EDITORIAL (p-4 rounded-xl) */}
          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2 my-5">
            <div className="flex justify-between items-center text-purple-900 font-black text-xs">
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-purple-600 text-sm" />
                <span className="text-sm font-extrabold">Certificado de Garantía Lucky Phone ({data.duracionGarantia})</span>
              </div>
              {fechaFinGarantia && (
                <div className="flex items-center gap-1.5 text-xs bg-purple-100 text-purple-900 px-2.5 py-1 rounded-lg font-mono font-bold border border-purple-200">
                  <FaCalendarCheck className="text-purple-600" />
                  <span>Válida hasta: {fechaFinGarantia}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              {companyInfo.terminosGarantia && companyInfo.terminosGarantia.trim()
                ? companyInfo.terminosGarantia
                : (isCelular
                  ? `Cubre defectos de fabricación de hardware por un periodo de ${data.duracionGarantia}. Es requisito indispensable presentar este documento con IMEI/Serie coincidente.`
                  : `Cubre defectos de fabricación por un periodo de ${data.duracionGarantia}. Es requisito indispensable presentar este documento junto con la caja original del producto para verificar el Número de Serie coincidente.`
                )
              }
            </p>
          </div>
        </div>

        {/* SELLO Y FIRMA DEL EMISOR */}
        <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500 mt-6">
          <div>
            <p className="font-extrabold text-slate-800 text-sm">Emisor: {data.emisorNombre}</p>
            <p className="text-slate-500 font-medium">Asesor Técnico Lucky Phone</p>
          </div>
          <div className="text-right">
            <div className="w-32 border-b border-slate-400 mb-1"></div>
            <p className="font-bold text-slate-700">Firma / Sello de Conformidad</p>
          </div>
        </div>
      </div>
    </div>
  );
};
