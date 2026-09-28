import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registroService } from '../services/backendService';
import { getTerminosService, getPrivacidadService } from '../services/backendService';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    email: '',
    direccion: '',
    password: '',
    aceptoTerminos: false,
  });

  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [exitoMsg, setExitoMsg] = useState<string | null>(null);

  // Estados para modal de términos/privacidad
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleOpenPolitica = async (tipo: 'terminos' | 'privacidad') => {
    try {
      if (tipo === 'terminos') {
        setModalTitle('Términos y Condiciones');
        const text = await getTerminosService();
        setModalContent(text || 'Términos y condiciones oficiales de LuckyPhone.');
      } else {
        setModalTitle('Política de Privacidad');
        const text = await getPrivacidadService();
        setModalContent(text || 'Política de Privacidad de Datos Personales de LuckyPhone.');
      }
    } catch {
      setModalContent('No se pudo cargar el documento en este momento.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setExitoMsg(null);

    // Validación estricta del checkbox legal
    if (!formData.aceptoTerminos) {
      setErrorMsg('Debes aceptar los Términos y Condiciones y la Política de Privacidad para registrarte.');
      return;
    }

    if (formData.dni.length !== 8 || !/^\d+$/.test(formData.dni)) {
      setErrorMsg('El DNI debe contener exactamente 8 dígitos numéricos.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('La contraseña debe tener un mínimo de 6 caracteres.');
      return;
    }

    try {
      setCargando(true);
      await registroService({
        nombre: formData.nombre,
        apellido: formData.apellido,
        dni: formData.dni,
        telefono: formData.telefono,
        email: formData.email,
        direccion: formData.direccion,
        password: formData.password,
        aceptoTerminos: formData.aceptoTerminos,
        rol: 'ROLE_USER',
      });

      setExitoMsg('¡Cuenta creada exitosamente! Redirigiendo al inicio de sesión...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message || err.response?.data || 'Error al registrar la cuenta. Verifique los datos ingresados.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
      <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-2">Crear Cuenta en LuckyPhone</h2>
      <p className="text-sm text-slate-500 text-center mb-8">Regístrate para realizar compras de celulares y seguimiento de pedidos</p>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-2xl flex items-center gap-2">
          <span>⚠️</span> {errorMsg}
        </div>
      )}

      {exitoMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-2xl flex items-center gap-2">
          <span>✅</span> {exitoMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre *</label>
            <input
              type="text"
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Juan"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Apellido *</label>
            <input
              type="text"
              name="apellido"
              required
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Pérez"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">DNI (8 dígitos) *</label>
            <input
              type="text"
              name="dni"
              maxLength={8}
              required
              value={formData.dni}
              onChange={handleChange}
              placeholder="76543210"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Teléfono / WhatsApp *</label>
            <input
              type="tel"
              name="telefono"
              required
              value={formData.telefono}
              onChange={handleChange}
              placeholder="987654321"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Correo Electrónico *</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dirección de Envío (Opcional)</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Av. Principal 123, Lima"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contraseña (Mínimo 6 caracteres) *</label>
          <input
            type="password"
            name="password"
            minLength={6}
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
          />
        </div>

        {/* CASILLA OBLIGATORIA DE TÉRMINOS Y CONDICIONES */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              name="aceptoTerminos"
              checked={formData.aceptoTerminos}
              onChange={handleChange}
              className="mt-1 w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
            />
            <span className="text-xs text-slate-600 leading-normal">
              Acepto los{' '}
              <button
                type="button"
                onClick={() => handleOpenPolitica('terminos')}
                className="text-purple-600 font-bold underline hover:text-purple-800"
              >
                Términos y Condiciones
              </button>{' '}
              y la{' '}
              <button
                type="button"
                onClick={() => handleOpenPolitica('privacidad')}
                className="text-purple-600 font-bold underline hover:text-purple-800"
              >
                Política de Privacidad
              </button>{' '}
              de LuckyPhone.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="w-full py-4 mt-6 bg-slate-900 text-white font-extrabold rounded-2xl shadow-lg hover:bg-purple-700 active:scale-98 transition-all duration-200 disabled:opacity-50"
        >
          {cargando ? 'Procesando Registro...' : 'Registrarme'}
        </button>
      </form>

      {/* Modal para ver políticas */}
      {modalTitle && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 max-h-[80vh] flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 mb-4">{modalTitle}</h3>
            <div className="overflow-y-auto flex-1 text-sm text-slate-600 space-y-3 pr-2">
              {modalContent || 'Cargando...'}
            </div>
            <button
              onClick={() => {
                setModalTitle(null);
                setModalContent(null);
              }}
              className="mt-6 w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
