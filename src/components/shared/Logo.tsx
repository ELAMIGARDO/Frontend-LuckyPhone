import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link 
      to="/" 
      className="inline-block transition-all duration-300 hover:brightness-110 active:scale-95 select-none"
    >
      {/* Desktop */}
      <p className="hidden lg:block text-2xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-blue-600">
        LuckyPhone
      </p>

      {/* Móvil - spans agrupados en un solo elemento */}
      <p className="lg:hidden text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-blue-600 -skew-x-12">
        LP
      </p>
    </Link>
  );
};