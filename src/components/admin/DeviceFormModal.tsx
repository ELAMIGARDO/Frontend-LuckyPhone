import React from 'react';
import {
  FaMobileAlt,
  FaTimes,
  FaBatteryFull,
  FaBarcode,
  FaUpload,
  FaEye,
  FaEyeSlash,
  FaPlus,
  FaTrashAlt
} from 'react-icons/fa';

import { getAtributosConfigService } from '../../services/backendService';
import type { AtributoConfig } from '../../interfaces/luckyPhoneTypes';

export interface DeviceFormData {
  modelo: string;
  marca: string;
  almacenamiento: string;
  ram: string;
  color: string;
  precio: string;
  stock: string;
  imei: string;
  imei2: string;
  numeroSerie: string;
  estado: string;
  bateria: string;
  imagenUrl: string;
  descripcion: string;
  activo: boolean;
  categoriaNombre?: string;
  itemsCelulares?: Array<{
    id?: number;
    imei1: string;
    imei2?: string;
    numeroSerial?: string;
    bateria?: string;
    estadoDispositivo?: 'Disponible' | 'Reservado' | 'Vendido';
  }>;
}

interface DeviceFormModalProps {
  isOpen: boolean;
  editingId: string | null;
  formData: DeviceFormData;
  setFormData: React.Dispatch<React.SetStateAction<DeviceFormData>>;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DeviceFormModal: React.FC<DeviceFormModalProps> = ({
  isOpen,
  editingId,
  formData,
  setFormData,
  onClose,
  onSave,
  onFileUpload
}) => {
  const [almacenamientos, setAlmacenamientos] = React.useState<AtributoConfig[]>([]);
  const [memoriasRam, setMemoriasRam] = React.useState<AtributoConfig[]>([]);
  const [colores, setColores] = React.useState<AtributoConfig[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      getAtributosConfigService().then(data => {
        if (data) {
          setAlmacenamientos((data.almacenamientos || []).filter((a: AtributoConfig) => a.activo));
          setMemoriasRam((data.memoriasRam || []).filter((r: AtributoConfig) => r.activo));
          setColores((data.colores || []).filter((c: AtributoConfig) => c.activo));
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isCelularCategory = !formData.categoriaNombre || formData.categoriaNombre === 'Celulares';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl lg:max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FaMobileAlt size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">
                {editingId ? 'Editar Producto Registrado' : 'Registrar Nuevo Producto en Inventario'}
              </h3>
              <p className="text-xs text-slate-400">Ingresa las especificaciones completas para actualizar la tienda y garantía.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Form Completo */}
        <form onSubmit={onSave} className="p-6 overflow-y-auto space-y-5 text-xs font-semibold flex-1">

          {/* FILA 1: CATEGORÍA, MODELO/NOMBRE & VISIBILIDAD */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-900 font-bold mb-1">Categoría del Producto *</label>
              <select
                value={formData.categoriaNombre || 'Celulares'}
                onChange={(e) => {
                  const cat = e.target.value;
                  setFormData({
                    ...formData,
                    categoriaNombre: cat,
                    imei: cat === 'Celulares' ? formData.imei : '',
                    imei2: cat === 'Celulares' ? formData.imei2 : '',
                    numeroSerie: cat === 'Celulares' ? formData.numeroSerie : ''
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-purple-300 focus:outline-none focus:border-purple-600 text-xs font-bold bg-purple-50/50 text-purple-950"
              >
                <option value="Celulares">📱 Celulares Smartphones</option>
                <option value="Cargadores">🔌 Cargadores y Cables</option>
                <option value="Audífonos">🎧 Audífonos y Auriculares</option>
                <option value="Accesorios">🛡️ Fundas y Accesorios</option>
                <option value="Otros">📦 Otros Productos</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Modelo / Nombre *</label>
              <input
                type="text"
                required
                placeholder={isCelularCategory ? "Ej: iPhone 18 Pro Max" : "Ej: Cargador Magsafe 20W"}
                value={formData.modelo}
                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 text-sm font-bold bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Marca / Fabricante</label>
              <select
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 text-sm font-medium bg-white"
              >
                <option value="Apple">Apple iPhone</option>
                <option value="Samsung">Samsung</option>
                <option value="Xiaomi">Xiaomi</option>
                <option value="Google">Google Pixel</option>
                <option value="Honor">Honor</option>
                <option value="Motorola">Motorola</option>
                <option value="Otra">Otra Marca</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-900 font-bold mb-1">Visibilidad en Tienda Pública *</label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, activo: !formData.activo })}
                className={`w-full py-2.5 px-4 rounded-xl font-extrabold flex items-center justify-center gap-2 border transition-all cursor-pointer ${formData.activo
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                  }`}
              >
                {formData.activo ? (
                  <>
                    <FaEye className="text-emerald-600 text-base" />
                    <span>✓ Producto Visible</span>
                  </>
                ) : (
                  <>
                    <FaEyeSlash className="text-amber-600 text-base" />
                    <span>🚫 Oculto al Cliente</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* CONDICIÓN / ESTADO Y BATERÍA */}
          <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-purple-950 font-bold mb-1">Condición del Producto *</label>
                <select
                  value={formData.estado}
                  onChange={(e) => {
                    const newEstado = e.target.value;
                    const isNowNuevo = newEstado === 'Nuevo / Sellado';
                    const updatedItems = (formData.itemsCelulares || []).map(i => ({
                      ...i,
                      bateria: isNowNuevo ? '100%' : (i.bateria || '90%')
                    }));

                    setFormData({
                      ...formData,
                      estado: newEstado,
                      bateria: isNowNuevo ? '100%' : (formData.bateria === '100%' ? '95%' : formData.bateria),
                      itemsCelulares: updatedItems
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 focus:outline-none focus:border-purple-600 text-xs font-bold bg-white"
                >
                  <option value="Nuevo / Sellado">✨ Nuevo / Sellado</option>
                  <option value="Open Box">📦 Open Box (Caja Abierta / Exposición)</option>
                  <option value="Seminuevo / Usado">📱 Seminuevo / Usado</option>
                  <option value="Reacondicionado">🛠️ Reacondicionado Grado A</option>
                  <option value="N/A (No aplica)">🚫 N/A (No aplica)</option>
                </select>
              </div>

              {isCelularCategory && formData.estado !== 'Nuevo / Sellado' && formData.estado !== 'N/A (No aplica)' ? (
                <div>
                  <label className="block text-purple-950 font-bold mb-1 flex items-center gap-1">
                    <FaBatteryFull className="text-emerald-600 text-sm" /> Salud de Batería (%) *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 98% o 92%"
                    value={formData.bateria}
                    onChange={(e) => setFormData({ ...formData, bateria: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 focus:outline-none focus:border-purple-600 text-xs font-bold bg-white"
                  />
                </div>
              ) : (
                <div className="flex items-center text-emerald-700 bg-emerald-100/70 p-2.5 rounded-xl border border-emerald-200">
                  <span className="text-xs font-bold">✓ Producto estándar de fábrica (Garantía Lucky Phone activa).</span>
                </div>
              )}
            </div>
          </div>

          {/* ESPECIFICACIONES TÉCNICAS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 mb-1">Almacenamiento / Capacidad *</label>
              <select
                value={formData.almacenamiento}
                onChange={(e) => setFormData({ ...formData, almacenamiento: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 text-sm font-medium bg-white"
              >
                {almacenamientos.length > 0 ? (
                  almacenamientos.map((alm) => (
                    <option key={alm.id} value={alm.texto}>
                      {alm.texto}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                    <option value="1TB">1TB</option>
                    <option value="N/A">N/A</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Memoria RAM *</label>
              <select
                value={formData.ram}
                onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 text-sm font-medium bg-white"
              >
                {memoriasRam.length > 0 ? (
                  memoriasRam.map((ramItem) => (
                    <option key={ramItem.id} value={ramItem.texto}>
                      {ramItem.texto}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="6GB">6GB</option>
                    <option value="8GB">8GB</option>
                    <option value="12GB">12GB</option>
                    <option value="16GB">16GB</option>
                    <option value="N/A">N/A</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Color del Equipo *</label>
              <select
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 text-sm font-medium bg-white"
              >
                <option value="">-- Seleccionar Color --</option>
                {colores.map((col) => (
                  <option key={col.id} value={col.texto}>
                    {col.texto}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SECCIÓN DE IDENTIFICADORES Y UNIDADES FÍSICAS */}
          {isCelularCategory ? (
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
                  onClick={() => {
                    const currentItems = formData.itemsCelulares || [];
                    setFormData({
                      ...formData,
                      itemsCelulares: [
                        ...currentItems,
                        {
                          imei1: '',
                          imei2: '',
                          numeroSerial: '',
                          bateria: formData.bateria || '100%',
                          estadoDispositivo: 'Disponible'
                        }
                      ]
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs self-start"
                >
                  <FaPlus className="text-[10px]" /> Agregar Otra Unidad (IMEI)
                </button>
              </div>

              {/* Si hay múltiples unidades o ya se cargaron unidades desde la BD */}
              {(formData.itemsCelulares && formData.itemsCelulares.length > 0) ? (
                <div className="space-y-3">
                  {formData.itemsCelulares.map((item, index) => (
                    <div
                      key={index}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl relative space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold text-purple-900 bg-purple-100/70 px-2.5 py-0.5 rounded-lg flex items-center gap-1.5">
                          <span>📱 Unidad #{index + 1}</span>
                          <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${item.estadoDispositivo === 'Vendido'
                              ? 'bg-rose-100 text-rose-700'
                              : item.estadoDispositivo === 'Reservado'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}>
                            {item.estadoDispositivo || 'Disponible'}
                          </span>
                        </span>

                        {formData.itemsCelulares && formData.itemsCelulares.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (formData.itemsCelulares || []).filter((_, i) => i !== index);
                              setFormData({ ...formData, itemsCelulares: updated });
                            }}
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
                              const updated = [...(formData.itemsCelulares || [])];
                              updated[index] = { ...updated[index], imei1: val };
                              // Sincronizar el primer IMEI con el campo global para compatibilidad
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
                              const updated = [...(formData.itemsCelulares || [])];
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
                              const updated = [...(formData.itemsCelulares || [])];
                              updated[index] = { ...updated[index], numeroSerial: val };
                              const mainSN = index === 0 ? val : formData.numeroSerie;
                              setFormData({ ...formData, itemsCelulares: updated, numeroSerie: mainSN });
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 font-mono font-bold text-xs bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-800 font-bold mb-1 text-[11px]">
                            Batería (%) {formData.estado === 'Nuevo / Sellado' && <span className="text-emerald-600 font-sans">(100% Sellado)</span>}
                          </label>
                          <input
                            type="text"
                            disabled={formData.estado === 'Nuevo / Sellado'}
                            placeholder="100% o 92%"
                            value={formData.estado === 'Nuevo / Sellado' ? '100%' : (item.bateria || '100%')}
                            onChange={(e) => {
                              const val = e.target.value;
                              const updated = [...(formData.itemsCelulares || [])];
                              updated[index] = { ...updated[index], bateria: val };
                              setFormData({ ...formData, itemsCelulares: updated });
                            }}
                            className={`w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 font-bold text-xs ${formData.estado === 'Nuevo / Sellado' ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'
                              }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Formulario simple para cuando sólo se registra 1 unidad inicial */
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
          ) : (
            <div className="bg-slate-100 border border-slate-200 p-4 rounded-2xl text-slate-600 text-xs">
              <p className="font-bold flex items-center gap-2 text-slate-800">
                <span>📦</span> Categoría "{formData.categoriaNombre}": Sin Registro de IMEI Obligatorio
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Los cargadores, audífonos y accesorios generales no llevan código IMEI obligatorio.
              </p>
            </div>
          )}

          {/* PRECIO Y STOCK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-1 font-bold">Precio Total (S/) *</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="5899.00"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 text-sm font-bold bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-bold">
                {isCelularCategory ? 'Stock Calculado (Unidades Disponibles)' : 'Stock Físico (Unidades) *'}
              </label>
              <input
                type="number"
                min="0"
                disabled={isCelularCategory && !!editingId}
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 text-sm font-bold ${isCelularCategory && !!editingId ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'
                  }`}
              />
              {isCelularCategory && (
                <p className="text-[10px] text-purple-700 font-semibold mt-1">
                  💡 Para celulares, el stock se calcula según las unidades con IMEI en estado "Disponible".
                </p>
              )}
            </div>
          </div>

          {/* SUBIR IMAGEN */}
          <div className="space-y-2">
            <label className="block text-slate-700 mb-1 font-bold">Imagen del Producto</label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-center justify-center gap-2 p-3 bg-slate-100 hover:bg-purple-50 border-2 border-dashed border-slate-300 hover:border-purple-300 rounded-xl cursor-pointer text-slate-700 font-bold transition-all">
                <FaUpload className="text-purple-600 text-base" />
                <span>Subir desde mi computador</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileUpload}
                  className="hidden"
                />
              </label>

              <input
                type="url"
                placeholder="O pega URL (https://...)"
                value={formData.imagenUrl.startsWith('data:') ? '' : formData.imagenUrl}
                onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 text-xs font-medium bg-white"
              />
            </div>
          </div>

          {/* VISTA PREVIA */}
          {formData.imagenUrl && (
            <div className="flex items-center gap-4 p-3 bg-purple-50/70 rounded-xl border border-purple-200">
              <img
                src={formData.imagenUrl}
                alt="Vista Previa"
                className="w-16 h-16 object-contain rounded-lg border border-purple-200 bg-white p-1 shadow-xs"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error+Imagen';
                }}
              />
              <div>
                <p className="text-xs font-bold text-slate-800">✓ Vista previa de la foto seleccionada</p>
                <p className="text-[10px] text-slate-500">Esta imagen aparecerá inmediatamente en el catálogo principal.</p>
              </div>
            </div>
          )}

          {/* DESCRIPCIÓN */}
          <div>
            <label className="block text-slate-700 mb-1">Descripción / Detalles Adicionales</label>
            <textarea
              rows={2}
              placeholder="Detalles sobre accesorios, estado estético o condiciones de venta."
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 text-sm font-medium bg-white"
            ></textarea>
          </div>

          {/* FOOTER DEL MODAL */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white z-10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-extrabold shadow-md transition-all cursor-pointer active:scale-95"
            >
              {editingId ? 'Actualizar Dispositivo' : 'Guardar Dispositivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};