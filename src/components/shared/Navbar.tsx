import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { NavbarLinks } from "../../constants/links";
import { HiOutlineSearch, HiX } from "react-icons/hi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { FaBarsStaggered } from "react-icons/fa6";
import { Logo } from "../shared/Logo";
import { useCart } from "../../context/CartContext";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, setIsOpen } = useCart();
  

  return (
    <header className="relative bg-white text-black border-b border-slate-200 z-50">
      <div className="p-4 flex justify-between px-5 lg:px-12 items-center">
        <Logo />

        <nav className="space-x-5 hidden md:flex items-center">
          {NavbarLinks.map((link) => (
            <NavLink
              key={link.id}
              to={link.href}
              className={({ isActive }) =>
                `${isActive ? "text-purple-600 underline" : ""} transition-all font-medium hover:text-purple-600 hover:underline`
              }
            >
              {link.title}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <button className="hover:text-purple-600 active:scale-95 transition-transform duration-200">
            <HiOutlineSearch size={25} />
          </button>

          <Link
            to="/account"
            className="border-2 border-slate-700 w-9 h-9 rounded-full grid place-items-center text-lg font-bold hover:bg-slate-900 hover:text-white hover:border-purple-600 active:scale-95 transition-all duration-200"
          >
            A
          </Link>

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
