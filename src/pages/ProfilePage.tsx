import React, { useEffect, useState } from 'react';

export const ProfilePage: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    direccion: '',
  });

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const u = JSON.parse(userStr);
        setFormData({
          nombre: u.nombre || '',
          apellido: u.apellido || '',
          dni: u.dni || '',
          telefono: u.telefono || '',
          direccion: u.direccion || '',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    try {
      setGuardando(true);
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const u = JSON.parse(userStr);
        const usuarioActualizado = { ...u, ...formData };
        localStorage.setItem('user', JSON.stringify(usuarioActualizado));
      }

      setMensaje({ tipo: 'exito', texto: '¡Perfil actualizado exitosamente!' });
    } catch (err: any) {
      setMensaje({
        tipo: 'error',
        texto: err.response?.data?.message || 'Error al actualizar el perfil.',
      });
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return <div className="py-20 text-center text-sm font-medium text-slate-500">Cargando perfil...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
        <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 font-extrabold grid place-items-center text-2xl border border-purple-200">
          👤
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Mi Perfil</h2>
          <p className="text-xs text-slate-500 font-medium">Actualiza tu información personal y datos de contacto</p>
        </div>
      </div>

      {mensaje && (
        <div
          className={`mb-6 p-4 rounded-2xl text-sm font-semibold flex items-center gap-2 ${
            mensaje.tipo === 'exito'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          <span>{mensaje.tipo === 'exito' ? '✅' : '⚠️'}</span> {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Apellido</label>
            <input
              type="text"
              name="apellido"
              required
              value={formData.apellido}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">DNI (8 dígitos)</label>
            <input
              type="text"
              name="dni"
              maxLength={8}
              value={formData.dni}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Teléfono / WhatsApp</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dirección Predeterminada de Envío</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Av. Principal 123, Lima"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="w-full py-4 mt-6 bg-slate-900 hover:bg-purple-700 text-white font-black rounded-2xl shadow-lg active:scale-98 transition-all duration-200 disabled:opacity-50"
        >
          {guardando ? 'Guardando Cambios...' : '💾 Guardar Datos de Perfil'}
        </button>
      </form>
    </div>
  );
};
