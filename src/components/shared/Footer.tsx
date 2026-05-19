import { BiChevronRight } from "react-icons/bi";
import { Link } from "react-router-dom";
import { socialLinks } from "../../constants/links";

export const Footer = () => {
  return (
    <footer
      className="py-16 bg-gray-950 px-12 flex justify-between gap-10 text-slate-200 text-sm flex-wrap mt-10 md:flex-nowrap"
    >
      <Link
        to="/"
        className="text-2xl font-bold tracking-tighter transition-all text-white flex-1"
      >
        LuckyPhone
      </Link>

      <div className="flex flex-col gap-4 flex-1">
        <p className="font-semibold uppercase tracking-tighter">
          suscribete
        </p>
        {/* 🛠️ CORREGIDO: Se eliminó la palabra "p" suelta de className */}
        <div className="text-xs font-medium">
          Suscríbete para recibir las últimas promociones y ofertas.
        </div>
        {/* 🛠️ CORREGIDO: "border-gray-800" (tenías boder) e "items-center" (tenías item) */}
        <div className="border border- flex items-center gap-2 px-3 py-2 rounded-full">
          <input 
            type="email" 
            placeholder="Ingresa tu correo electrónico" 
            className="pl-2 bg-gray-950 text-slate-200 w-full focus:outline-none"
          />
          <button className="text-slate-200">
            <BiChevronRight size={20}/>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <p className="font-semibold uppercase tracking-tighter">
          Politicas
        </p>
        {/* 🛠️ CORREGIDO: Separado en "flex-col gap-2" (tenías flex-col-gap-2) */}
        <nav className="flex flex-col gap-2 text-xs font-medium">
          <Link to="/celulares">Productos</Link>
          {/* 🛠️ SOLUCIÓN AL CSS CONFLICT: Se quitó "text-white" para dejar solo un color */}
          <Link to="#" className="text-slate-300">Politica de Privacidad</Link>
          <Link to="#" className="text-slate-300">Terminos de uso</Link>
        </nav>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <p className="font-semibold uppercase tracking-tighter">Siguenos</p>
        <p className="text-xs leading-6">No te pierdas lo que tiene LuckyPhone para ti</p>

        <div className="flex">
            { 
                socialLinks.map((link) => (
                    <a key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-300 boder border-gray-800 w-full h-full py-3.5 flex items-center justify-center 
                    transition-all hover:bg-white hover:text-gray-950"
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