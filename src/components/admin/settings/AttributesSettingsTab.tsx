import React, { useState, useEffect } from 'react';
import { FaPalette, FaHdd, FaMicrochip, FaPlus, FaTrashAlt, FaCheck, FaTimes } from 'react-icons/fa';
import type { AtributoConfig } from '../../../interfaces/luckyPhoneTypes';
import { getAtributosConfigService } from '../../../services/backendService';

export const AttributesSettingsTab: React.FC = () => {
  const [almacenamientos, setAlmacenamientos] = useState<AtributoConfig[]>([]);
  const [memoriasRam, setMemoriasRam] = useState<AtributoConfig[]>([]);
  const [colores, setColores] = useState<AtributoConfig[]>([]);

  const [nuevoAlmacenamiento, setNuevoAlmacenamiento] = useState('');
  const [nuevaRam, setNuevaRam] = useState('');
  const [nuevoColorNombre, setNuevoColorNombre] = useState('');
  const [nuevoColorHex, setNuevoColorHex] = useState('#6366F1');

  useEffect(() => {
    getAtributosConfigService().then(data => {
      if (data) {
        setAlmacenamientos(data.almacenamientos || []);
        setMemoriasRam(data.memoriasRam || []);
        setColores(data.colores || []);
      }
    });
  }, []);

  const persistirAtributos = (alms: AtributoConfig[], rams: AtributoConfig[], cols: AtributoConfig[]) => {
    const configData = { almacenamientos: alms, memoriasRam: rams, colores: cols };
    localStorage.setItem('luckyphone_atributos_config', JSON.stringify(configData));
  };

  const handleAgregarAlmacenamiento = () => {
    if (!nuevoAlmacenamiento.trim()) return;
    const nuevo = { id: Date.now(), texto: nuevoAlmacenamiento.trim().toUpperCase(), activo: true };
    const updated = [...almacenamientos, nuevo];
    setAlmacenamientos(updated);
    persistirAtributos(updated, memoriasRam, colores);
    setNuevoAlmacenamiento('');
  };

  const handleToggleAlmacenamiento = (id: number) => {
    const updated = almacenamientos.map(a => a.id === id ? { ...a, activo: !a.activo } : a);
    setAlmacenamientos(updated);
    persistirAtributos(updated, memoriasRam, colores);
  };

  const handleEliminarAlmacenamiento = (id: number) => {
    const updated = almacenamientos.filter(a => a.id !== id);
    setAlmacenamientos(updated);
    persistirAtributos(updated, memoriasRam, colores);
  };

  const handleAgregarRam = () => {
    if (!nuevaRam.trim()) return;
    const nuevo = { id: Date.now(), texto: nuevaRam.trim().toUpperCase(), activo: true };
    const updated = [...memoriasRam, nuevo];
    setMemoriasRam(updated);
    persistirAtributos(almacenamientos, updated, colores);
    setNuevaRam('');
  };

  const handleToggleRam = (id: number) => {
    const updated = memoriasRam.map(r => r.id === id ? { ...r, activo: !r.activo } : r);
    setMemoriasRam(updated);
    persistirAtributos(almacenamientos, updated, colores);
  };

  const handleEliminarRam = (id: number) => {
    const updated = memoriasRam.filter(r => r.id !== id);
    setMemoriasRam(updated);
    persistirAtributos(almacenamientos, updated, colores);
  };

  const handleAgregarColor = () => {
    if (!nuevoColorNombre.trim()) return;
    const nuevo = { id: Date.now(), texto: nuevoColorNombre.trim(), codigoHex: nuevoColorHex, activo: true };
    const updated = [...colores, nuevo];
    setColores(updated);
    persistirAtributos(almacenamientos, memoriasRam, updated);
    setNuevoColorNombre('');
    setNuevoColorHex('#6366F1');
  };

  const handleToggleColor = (id: number) => {
    const updated = colores.map(c => c.id === id ? { ...c, activo: !c.activo } : c);
    setColores(updated);
    persistirAtributos(almacenamientos, memoriasRam, updated);
  };

  const handleEliminarColor = (id: number) => {
    const updated = colores.filter(c => c.id !== id);
    setColores(updated);
    persistirAtributos(almacenamientos, memoriasRam, updated);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* TABLA COLORES */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <FaPalette className="text-purple-600" /> Colores Dinámicos
            </h3>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg">
              {colores.length} colores
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <input
              type="color"
              value={nuevoColorHex}
              onChange={(e) => setNuevoColorHex(e.target.value)}
              className="w-9 h-9 rounded-xl border border-slate-200 p-0.5 cursor-pointer"
              title="Elegir tono hexadecimal"
            />
            <input
              type="text"
              placeholder="Ej: Titanio Desierto"
              value={nuevoColorNombre}
              onChange={(e) => setNuevoColorNombre(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-500"
            />
            <button
              type="button"
              onClick={handleAgregarColor}
              className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <FaPlus />
            </button>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {colores.map(c => (
              <div key={c.id} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-100/60 transition-all text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: c.codigoHex || '#6366F1' }} />
                  <span className={`font-bold ${c.activo ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{c.texto}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleColor(c.id)}
                    className={`p-1.5 rounded-lg text-[10px] font-bold cursor-pointer ${c.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}
                    title={c.activo ? 'Desactivar de selectores' : 'Activar en selectores'}
                  >
                    {c.activo ? <FaCheck /> : <FaTimes />}
                  </button>
                  <button
                    onClick={() => handleEliminarColor(c.id)}
                    className="p-1.5 rounded-lg text-[10px] text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Eliminar opción"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-slate-400 font-medium mt-4 pt-3 border-t border-slate-100">
          Las opciones activas alimentan instantáneamente los selectores del formulario de ingreso.
        </p>
      </div>

      {/* TABLA ALMACENAMIENTO */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <FaHdd className="text-purple-600" /> Almacenamiento
            </h3>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg">
              {almacenamientos.length} opciones
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="Ej: 1TB o 2TB"
              value={nuevoAlmacenamiento}
              onChange={(e) => setNuevoAlmacenamiento(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-500"
            />
            <button
              type="button"
              onClick={handleAgregarAlmacenamiento}
              className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <FaPlus />
            </button>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {almacenamientos.map(a => (
              <div key={a.id} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-100/60 transition-all text-xs">
                <span className={`font-mono font-bold ${a.activo ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{a.texto}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleAlmacenamiento(a.id)}
                    className={`p-1.5 rounded-lg text-[10px] font-bold cursor-pointer ${a.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}
                    title={a.activo ? 'Desactivar de selectores' : 'Activar en selectores'}
                  >
                    {a.activo ? <FaCheck /> : <FaTimes />}
                  </button>
                  <button
                    onClick={() => handleEliminarAlmacenamiento(a.id)}
                    className="p-1.5 rounded-lg text-[10px] text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Eliminar opción"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-slate-400 font-medium mt-4 pt-3 border-t border-slate-100">
          Permite registrar nuevas capacidades sin modificar código en frontend ni backend.
        </p>
      </div>

      {/* TABLA MEMORIA RAM */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <FaMicrochip className="text-purple-600" /> Memoria RAM
            </h3>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg">
              {memoriasRam.length} opciones
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="Ej: 16GB o 24GB"
              value={nuevaRam}
              onChange={(e) => setNuevaRam(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-500"
            />
            <button
              type="button"
              onClick={handleAgregarRam}
              className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <FaPlus />
            </button>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {memoriasRam.map(r => (
              <div key={r.id} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-100/60 transition-all text-xs">
                <span className={`font-mono font-bold ${r.activo ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{r.texto}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleRam(r.id)}
                    className={`p-1.5 rounded-lg text-[10px] font-bold cursor-pointer ${r.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}
                    title={r.activo ? 'Desactivar de selectores' : 'Activar en selectores'}
                  >
                    {r.activo ? <FaCheck /> : <FaTimes />}
                  </button>
                  <button
                    onClick={() => handleEliminarRam(r.id)}
                    className="p-1.5 rounded-lg text-[10px] text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Eliminar opción"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-slate-400 font-medium mt-4 pt-3 border-t border-slate-100">
          Las opciones marcadas con check son las que aparecen activas en el selector de inventario.
        </p>
      </div>
    </div>
  );
};
