import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { NavbarLinks } from "../../constants/links";
import { HiOutlineSearch, HiX } from "react-icons/hi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { FaBarsStaggered } from "react-icons/fa6";
import { Logo } from "../shared/Logo";
import { useCart } from "../../context/CartContext";
import { buscarProductosService } from "../../services/backendService";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState<any[]>([]);
  const [buscando, setBuscando] = useState(false);

  const { cartCount, setIsOpen } = useCart();

  // Búsqueda en tiempo real al hacer clic en la lupa o escribir
  const handleBuscar = async (texto: string) => {
    setBusqueda(texto);
    if (texto.trim().length === 0) {
      setResultados([]);
      return;
    }
    try {
      setBuscando(true);
      const data = await buscarProductosService(texto);
      setResultados(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setBuscando(false);
    }
  };

  return (
    <header className="relative bg-white text-black border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between relative">
        {/* Logo alineado a la izquierda */}
        <div className="flex-shrink-0">
          <Logo />
        </div>

        {/* Navegación perfectamente centrada en la pantalla */}
        <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
          {NavbarLinks.map((link) => (
            <NavLink
              key={link.id}
              to={link.href}
              className={({ isActive }) =>
                `text-sm font-extrabold tracking-wide transition-colors py-1 relative ${
                  isActive
                    ? "text-purple-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-600 after:rounded-full"
                    : "text-slate-700 hover:text-purple-600"
                }`
              }
            >
              {link.title}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Opciones dinámicas según sesión */}
          {(() => {
            try {
              const uStr = localStorage.getItem('user');
              if (uStr) {
                const u = JSON.parse(uStr);
                return (
                  <div className="flex items-center gap-2">
                    {u.rol === 'ROLE_ADMIN' ? (
                      <Link
                        to="/admin"
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-black px-3.5 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                        title="Panel de Administración"
                      >
                        <span>🛡️</span> Admin Panel
                      </Link>
                    ) : (
                      <Link
                        to="/perfil"
                        className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-purple-50 hover:text-purple-600 px-3 py-1.5 rounded-full border border-slate-200 transition-all flex items-center gap-1"
                        title="Editar Mi Perfil"
                      >
                        <span>✏️</span> {u.nombre || u.email.split('@')[0]}
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                      }}
                      className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl border border-red-100 transition-all flex items-center gap-1 active:scale-95"
                      title={`Cerrar Sesión (${u.email})`}
                    >
                      <span>🚪</span> Salir
                    </button>
                  </div>
                );
              }
            } catch (_) {}
            return (
              <Link
                to="/login"
                className="border-2 border-slate-700 w-9 h-9 rounded-full grid place-items-center text-xs font-extrabold hover:bg-purple-600 hover:text-white hover:border-purple-600 active:scale-95 transition-all duration-200"
                title="Iniciar Sesión / Registro"
              >
                👤
              </Link>
            );
          })()}

          {/* Lupa con Buscador Flotante Interactivo */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hover:text-purple-600 active:scale-95 transition-transform duration-200 p-1"
              title="Buscar Celular"
            >
              <HiOutlineSearch size={25} />
            </button>

            {searchOpen && (
              <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-fadeIn">
                <div className="relative">
                  <input
                    type="text"
                    autoFocus
                    value={busqueda}
                    onChange={(e) => handleBuscar(e.target.value)}
                    placeholder="Buscar marca o celular (ej: iPhone, Galaxy)..."
                    className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 font-medium"
                  />
                  {busqueda && (
                    <button
                      onClick={() => handleBuscar('')}
                      className="absolute right-3 top-2.5 text-slate-400 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Resultados de la búsqueda */}
                <div className="mt-3 max-h-60 overflow-y-auto space-y-2">
                  {buscando ? (
                    <div className="text-center py-4 text-xs text-slate-400">Buscando...</div>
                  ) : resultados.length > 0 ? (
                    resultados.map((prod) => (
                      <Link
                        key={prod.id}
                        to={`/celulares/${prod.id}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        <img
                          src={prod.imagenUrl || 'https://via.placeholder.com/40'}
                          alt={prod.nombre}
                          className="w-10 h-10 object-contain bg-slate-50 p-1 rounded-lg border border-slate-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{prod.nombre}</p>
                          <p className="text-[10px] text-purple-600 font-extrabold">S/ {prod.precio.toFixed(2)}</p>
                        </div>
                      </Link>
                    ))
                  ) : busqueda.trim().length > 0 ? (
                    <div className="text-center py-4 text-xs text-slate-400">No se encontraron celulares con "{busqueda}"</div>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          <button onClick={() => setIsOpen(true)}
           className="group relative hover:text-purple-600 active:scale-95 transition-transform duration-200">
            {/* 🟣 Burbuja dinámica: Solo se renderiza si hay productos en el carrito */}
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 grid place-items-center bg-purple-600 text-white text-[10px] font-bold rounded-full shadow-md animate-pulse group-hover:scale-110 transition-transform duration-200">
                {cartCount}
              </span>
            )}
            <HiOutlineShoppingBag
              size={25}
              className="group-hover:animate-bounce"
            />
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden hover:text-purple-600 active:scale-95 transition-all duration-200 p-1 rounded-sm"
          >
            {menuOpen ? <HiX size={25} /> : <FaBarsStaggered size={25} />}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-slate-950/70 transition-opacity duration-300 md:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      <div
        className={`absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl transition-all duration-300 ease-in-out md:hidden ${
          menuOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-2 invisible pointer-events-none"
        }`}
      >
        <nav className="flex flex-col p-4 gap-1">
          {NavbarLinks.map((link) => (
            <NavLink
              key={link.id}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block font-bold text-base py-3 px-4 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-purple-50 text-purple-600"
                    : "text-slate-700 hover:bg-slate-50 hover:text-purple-600"
                }`
              }
            >
              {link.title}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};
