import { BiChevronRight } from "react-icons/bi";
import { Link } from "react-router-dom";
import { socialLinks } from "../../constants/links";

export const Footer = () => {
  return (
    <footer className="py-16 bg-black px-6 flex justify-between gap-10 text-slate-300 text-sm flex-wrap mt-10 md:flex-nowrap border-t border-slate-900 lg:px-12">
      
      {/* LOGO CON EFECTO DE COLOR */}
      <div className="flex-1 min-w-50">
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tighter transition-all text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-blue-500 hover:brightness-110 duration-300"
        >
          LuckyPhone
        </Link>
        <p className="text-xs text-slate-500 mt-2 font-medium">
          © {new Date().getFullYear()} LuckyPhone. Todos los derechos reservados.
        </p>
      </div>

      {/* SUSCRIPCIÓN OPTIMIZADA */}
      <div className="flex flex-col gap-4 flex-1 min-w-60">
        <p className="font-semibold uppercase tracking-wider text-xs text-white">
          Suscríbete
        </p>
        <div className="text-xs font-medium text-slate-400">
          Suscríbete para recibir las últimas promociones y ofertas en iPhones.
        </div>
        {/* CORREGIDO: Borde arreglado y focus con color de la marca */}
        <div className="border border-slate-800 focus-within:border-purple-500 bg-gray-950 flex items-center gap-2 px-3 py-2 rounded-full transition-colors duration-300">
          <input 
            type="email" 
            placeholder="Ingresa tu correo electrónico" 
            className="pl-2 bg-transparent text-slate-200 w-full focus:outline-none text-xs"
          />
          <button className="text-white bg-purple-600 hover:bg-purple-700 p-1.5 rounded-full transition-colors duration-200 active:scale-95">
            <BiChevronRight size={16}/>
          </button>
        </div>
      </div>

      {/* POLÍTICAS Y ENLACES */}
      <div className="flex flex-col gap-4 flex-1 min-w-35">
        <p className="font-semibold uppercase tracking-wider text-xs text-white">
          Políticas
        </p>
        <nav className="flex flex-col gap-2 text-xs font-medium">
          <Link to="/celulares" className="text-slate-400 hover:text-purple-400 transition-colors duration-200">Productos</Link>
          <Link to="#" className="text-slate-400 hover:text-purple-400 transition-colors duration-200">Política de Privacidad</Link>
          <Link to="#" className="text-slate-400 hover:text-purple-400 transition-colors duration-200">Términos de uso</Link>
        </nav>
      </div>

      {/* REDES SOCIALES COMPLETA Y REPARADA */}
      <div className="flex flex-col gap-4 flex-1 min-w-50">
        <p className="font-semibold uppercase tracking-wider text-xs text-white">Síguenos</p>
        <p className="text-xs leading-relaxed text-slate-400">No te pierdas lo que tiene LuckyPhone para ti</p>

        {/* CORREGIDO: Redes sociales en grilla limpia con bordes fijos */}
        <div className="flex gap-2">
            { 
                socialLinks.map((link) => (
                    <a key={link.id}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 border border-slate-800 w-10 h-10 rounded-full flex items-center justify-center 
                      transition-all duration-300 hover:bg-purple-600 hover:text-white hover:border-purple-500 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] active:scale-95 text-lg"
                    >
                        {link.icon}
                    </a>
                ))
            }
        </div>
      </div>
    </footer>
  );
};