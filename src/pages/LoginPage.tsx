import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginService } from '../services/backendService';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      setCargando(true);
      const data = await loginService({ email, password });
      
      if (data.rol === 'ROLE_ADMIN') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message || err.response?.data || 'Credenciales incorrectas. Verifique su email y contraseña.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
      <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-2">Iniciar Sesión</h2>
      <p className="text-sm text-slate-500 text-center mb-8">Ingresa a tu cuenta de LuckyPhone</p>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-2xl flex items-center gap-2">
          <span>⚠️</span> {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Correo Electrónico</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@ejemplo.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="w-full py-4 mt-6 bg-slate-900 text-white font-extrabold rounded-2xl shadow-lg hover:bg-purple-700 active:scale-98 transition-all duration-200 disabled:opacity-50"
        >
          {cargando ? 'Iniciando Sesión...' : 'Ingresar'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
        ¿No tienes una cuenta aún?{' '}
        <Link to="/register" className="text-purple-600 font-bold hover:underline">
          Regístrate aquí
        </Link>
      </div>
    </div>
  );
};
