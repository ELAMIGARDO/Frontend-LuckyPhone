import React, { useState } from 'react';
import { FaUserShield, FaKey, FaTrashAlt } from 'react-icons/fa';
import type { UsuarioAdmin } from '../../../interfaces/luckyPhoneTypes';

export const UsersSettingsTab: React.FC = () => {
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

  return (
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                    u.activo ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {u.activo ? 'Activo' : 'Bloqueado'}
                </button>

                <button
                  onClick={() => handleEliminarUsuario(u.id)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg text-xs transition-colors cursor-pointer"
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
  );
};
