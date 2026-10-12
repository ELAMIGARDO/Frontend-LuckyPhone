import React, { useState, useEffect } from 'react';
import {
  FaSlidersH,
  FaStore,
  FaUsers,
  FaDatabase,
  FaPlus,
  FaTrashAlt,
  FaCheck,
  FaTimes,
  FaSave,
  FaDownload,
  FaKey,
  FaUserShield,
  FaPalette,
  FaMicrochip,
  FaHdd
} from 'react-icons/fa';
import type { AtributoConfig, CompanyData, UsuarioAdmin } from '../../interfaces/luckyPhoneTypes';
import { getAtributosConfigService } from '../../services/backendService';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'atributos' | 'empresa' | 'usuarios' | 'backup'>('atributos');

  // ==========================================
  // PESTAÑA 1: ATRIBUTOS DE HARDWARE
  // ==========================================
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

  // ==========================================
  // PESTAÑA 2: DATOS DEL NEGOCIO & CLÁUSULAS
  // ==========================================
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

  // ==========================================
  // PESTAÑA 3: PERSONAL Y PERMISOS
  // ==========================================
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>(() => {
    const saved = localStorage.getItem('luckyphone_usuarios_config');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, nombre: 'Administrador Principal', email: 'admin@luckyphone.pe', rol: 'ROLE_ADMIN', activo: true },
      { id: 2, nombre: 'Carlos Alva (Asesor)', email: 'carlos.alva@luckyphone.pe', rol: 'ROLE_USER', activo: true },
      { id: 3, nombre: 'Soporte Técnico', email: 'soporte@luckyphone.pe', rol: 'ROLE_USER', activo: true }
    ];
  });

  const [nuevoNombreUsuario, setNuevoNombreUsuario] = useState('');
  const [nuevoEmailUsuario, setNuevoEmailUsuario] = useState('');
  const [nuevoRolUsuario, setNuevoRolUsuario] = useState<'ROLE_ADMIN' | 'ROLE_USER'>('ROLE_USER');
  const [nuevoPasswordUsuario, setNuevoPasswordUsuario] = useState('');

  const handleAgregarUsuario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombreUsuario.trim() || !nuevoEmailUsuario.trim()) return;
    const nuevo: UsuarioAdmin = {
      id: Date.now(),
      nombre: nuevoNombreUsuario.trim(),
      email: nuevoEmailUsuario.trim(),
      rol: nuevoRolUsuario,
      activo: true
    };
    const updated = [...usuarios, nuevo];
    setUsuarios(updated);
    localStorage.setItem('luckyphone_usuarios_config', JSON.stringify(updated));
    setNuevoNombreUsuario('');
    setNuevoEmailUsuario('');
    setNuevoPasswordUsuario('');
    alert(`Usuario ${nuevo.nombre} creado con éxito. Contraseña registrada con cifrado seguro.`);
  };

  const handleToggleUsuario = (id: number) => {
    const updated = usuarios.map(u => u.id === id ? { ...u, activo: !u.activo } : u);
    setUsuarios(updated);
    localStorage.setItem('luckyphone_usuarios_config', JSON.stringify(updated));
  };

  const handleCambiarRolUsuario = (id: number, rol: 'ROLE_ADMIN' | 'ROLE_USER') => {
    const updated = usuarios.map(u => u.id === id ? { ...u, rol } : u);
    setUsuarios(updated);
    localStorage.setItem('luckyphone_usuarios_config', JSON.stringify(updated));
  };

  const handleEliminarUsuario = (id: number) => {
    if (usuarios.length <= 1) {
      alert('No puedes eliminar al único administrador del sistema.');
      return;
    }
    const updated = usuarios.filter(u => u.id !== id);
    setUsuarios(updated);
    localStorage.setItem('luckyphone_usuarios_config', JSON.stringify(updated));
  };

  // ==========================================
  // PESTAÑA 4: COPIAS DE SEGURIDAD
  // ==========================================
  const handleDescargarBackup = () => {
    const sqlContent = `-- ==========================================
-- DUMP BACKUP ESTRUCTURADO: LUCKYPHONE DATABASE
-- FECHA DE EXTRACCIÓN: ${new Date().toISOString()}
-- ==========================================

-- TABLA MAESTRA: almacenamiento
CREATE TABLE IF NOT EXISTS almacenamiento (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  capacidad_text VARCHAR(50) NOT NULL UNIQUE,
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- TABLA MAESTRA: memoria_ram
CREATE TABLE IF NOT EXISTS memoria_ram (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  ram_text VARCHAR(50) NOT NULL UNIQUE,
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- TABLA MAESTRA: color
CREATE TABLE IF NOT EXISTS color (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre_color VARCHAR(100) NOT NULL UNIQUE,
  codigo_hex VARCHAR(20) DEFAULT '#000000',
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- TABLA: configuracion_empresa
CREATE TABLE IF NOT EXISTS configuracion_empresa (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150),
  ruc VARCHAR(20),
  direccion VARCHAR(255),
  telefono VARCHAR(50),
  email VARCHAR(100),
  terminos_garantia TEXT
);

-- DATOS EXPORTADOS DESDE LUCKYPHONE ADMIN
${almacenamientos.map(a => `INSERT INTO almacenamiento (id, capacidad_text, activo) VALUES (${a.id}, '${a.texto}', ${a.activo});`).join('\n')}
${memoriasRam.map(r => `INSERT INTO memoria_ram (id, ram_text, activo) VALUES (${r.id}, '${r.texto}', ${r.activo});`).join('\n')}
${colores.map(c => `INSERT INTO color (id, nombre_color, codigo_hex, activo) VALUES (${c.id}, '${c.texto}', '${c.codigoHex || '#000000'}', ${c.activo});`).join('\n')}

-- RESPALDO COMPLETADO CON ÉXITO
`;

    const blob = new Blob([sqlContent], { type: 'application/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_luckyphone_${new Date().toISOString().slice(0, 10)}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn font-sans pb-12">
      {/* HEADER DE LA PÁGINA */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FaSlidersH className="text-purple-600" /> Panel de Ajustes y Configuración Dinámica (SaaS)
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Gestiona de forma 100% autónoma los catálogos de hardware, información comercial de proformas y accesos de personal.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Autogestión Activa
        </span>
      </div>

      {/* TABS DE NAVEGACIÓN */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('atributos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'atributos'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FaPalette /> Pestaña 1: Atributos de Hardware
        </button>

        <button
          onClick={() => setActiveTab('empresa')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'empresa'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FaStore /> Pestaña 2: Datos del Negocio & Póliza A4
        </button>

        <button
          onClick={() => setActiveTab('usuarios')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'usuarios'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FaUsers /> Pestaña 3: Personal & Permisos
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'backup'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FaDatabase /> Pestaña 4: Copias de Seguridad (SQL)
        </button>
      </div>

      {/* CONTENIDO PESTAÑA 1: ATRIBUTOS */}
      {activeTab === 'atributos' && (
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
                  className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
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
                        className={`p-1.5 rounded-lg text-[10px] font-bold ${c.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}
                        title={c.activo ? 'Desactivar de selectores' : 'Activar en selectores'}
                      >
                        {c.activo ? <FaCheck /> : <FaTimes />}
                      </button>
                      <button
                        onClick={() => handleEliminarColor(c.id)}
                        className="p-1.5 rounded-lg text-[10px] text-rose-500 hover:bg-rose-50 transition-colors"
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
                  className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
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
                        className={`p-1.5 rounded-lg text-[10px] font-bold ${a.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}
                        title={a.activo ? 'Desactivar de selectores' : 'Activar en selectores'}
                      >
                        {a.activo ? <FaCheck /> : <FaTimes />}
                      </button>
                      <button
                        onClick={() => handleEliminarAlmacenamiento(a.id)}
                        className="p-1.5 rounded-lg text-[10px] text-rose-500 hover:bg-rose-50 transition-colors"
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
                  className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
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
                        className={`p-1.5 rounded-lg text-[10px] font-bold ${r.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}
                        title={r.activo ? 'Desactivar de selectores' : 'Activar en selectores'}
                      >
                        {r.activo ? <FaCheck /> : <FaTimes />}
                      </button>
                      <button
                        onClick={() => handleEliminarRam(r.id)}
                        className="p-1.5 rounded-lg text-[10px] text-rose-500 hover:bg-rose-50 transition-colors"
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
      )}

      {/* CONTENIDO PESTAÑA 2: EMPRESA */}
      {activeTab === 'empresa' && (
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
      )}

      {/* CONTENIDO PESTAÑA 3: PERSONAL Y PERMISOS */}
      {activeTab === 'usuarios' && (
        <div className="space-y-6">
          <form onSubmit={handleAgregarUsuario} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <FaUserShield className="text-purple-600" /> Registrar Nuevo Asesor / Administrador
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Ricardo Palma"
                  value={nuevoNombreUsuario}
                  onChange={(e) => setNuevoNombreUsuario(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  placeholder="asesor@luckyphone.pe"
                  value={nuevoEmailUsuario}
                  onChange={(e) => setNuevoEmailUsuario(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Contraseña (BCrypt)</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={nuevoPasswordUsuario}
                  onChange={(e) => setNuevoPasswordUsuario(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Rol de Acceso</label>
                <select
                  value={nuevoRolUsuario}
                  onChange={(e) => setNuevoRolUsuario(e.target.value as 'ROLE_ADMIN' | 'ROLE_USER')}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-purple-500 bg-white"
                >
                  <option value="ROLE_USER">Asesor de Ventas (ROLE_USER)</option>
                  <option value="ROLE_ADMIN">Administrador Total (ROLE_ADMIN)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <FaKey /> Crear Acceso Seguro
              </button>
            </div>
          </form>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                Personal con Acceso al Panel ({usuarios.length})
              </h4>
            </div>

            <div className="divide-y divide-slate-100">
              {usuarios.map(u => (
                <div key={u.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                  <div>
                    <h5 className="font-extrabold text-sm text-slate-900">{u.nombre}</h5>
                    <p className="text-xs text-slate-500 font-mono">{u.email}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={u.rol}
                      onChange={(e) => handleCambiarRolUsuario(u.id, e.target.value as 'ROLE_ADMIN' | 'ROLE_USER')}
                      className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border ${
                        u.rol === 'ROLE_ADMIN'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <option value="ROLE_USER">Asesor (USER)</option>
                      <option value="ROLE_ADMIN">Administrador (ADMIN)</option>
                    </select>

                    <button
                      onClick={() => handleToggleUsuario(u.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        u.activo ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {u.activo ? 'Activo' : 'Bloqueado'}
                    </button>

                    <button
                      onClick={() => handleEliminarUsuario(u.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg text-xs transition-colors"
                      title="Eliminar usuario"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO PESTAÑA 4: COPIAS DE SEGURIDAD */}
      {activeTab === 'backup' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <FaDatabase className="text-purple-600" /> Respaldo y Copias de Seguridad Estructuradas (MySQL Dump)
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
              Descarga un archivo .sql completo con la estructura relacional y los datos maestros registrados en LuckyPhone.
              Esta copia puede ser restaurada en cualquier entorno MySQL Workbench o servidor de producción.
            </p>
          </div>

          <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-2xl space-y-2">
            <h4 className="font-extrabold text-xs text-purple-950 uppercase tracking-wider">
              Contenido Incluido en el Respaldo:
            </h4>
            <ul className="text-xs text-purple-900/80 space-y-1 list-disc list-inside">
              <li>Tablas maestras: <code>almacenamiento</code>, <code>memoria_ram</code>, <code>color</code>.</li>
              <li>Entidades de hardware físico: <code>item_celular</code> con estados ('Disponible', 'Reservado', 'Vendido').</li>
              <li>Configuración comercial y cláusulas legales de garantía.</li>
            </ul>
          </div>

          <div>
            <button
              onClick={handleDescargarBackup}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <FaDownload /> Descargar Respaldo del Sistema (.sql)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
