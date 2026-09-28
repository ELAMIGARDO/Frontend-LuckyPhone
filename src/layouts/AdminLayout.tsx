import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  // Obtener información del usuario logueado
  let userEmail = 'Administrador';
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const u = JSON.parse(userStr);
      if (u.email) userEmail = u.email;
    }
  } catch {}

  const handleCerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Barra Superior del Panel Admin (Estilo Claro LuckyPhone) */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl text-white font-black grid place-items-center text-xl shadow-md"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #a855f7 100%)' }}
          >
            🛡️
          </div>
          <div>
            <h1 className="font-black text-lg text-slate-900 tracking-tight leading-none">LuckyPhone Admin</h1>
            <span className="text-[11px] text-purple-600 font-extrabold uppercase tracking-widest">Panel de Control</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            👤 <strong className="text-slate-800">{userEmail}</strong>
          </span>

          <Link
            to="/"
            target="_blank"
            className="text-xs font-bold text-slate-700 hover:text-purple-600 bg-slate-100 hover:bg-purple-50 px-3.5 py-2 rounded-xl transition-all border border-slate-200 flex items-center gap-1.5"
            title="Abrir tienda pública en nueva pestaña"
          >
            <span>🌐</span> Ver Tienda
          </Link>

          <button
            onClick={handleCerrarSesion}
            className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl transition-all border border-red-100 flex items-center gap-1.5"
            title="Cerrar Sesión de Administrador"
          >
            <span>🚪</span> Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Contenido Exclusivo de Administración */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        <Outlet />
      </main>

      {/* Pie de página del Dashboard */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400 font-medium">
        LuckyPhone Ecommerce System &copy; 2026 - Área Restringida Administrativa
      </footer>
    </div>
  );
};
