import { Link } from "react-router-dom";

export const Logo = () => {
  return <Link to="/" className={`text-2xl font-bold tracking-tighter transition-all`}>
    <p className="hidden lg:block text-blue-600">
        Lucky
        <span className="text-amber-400 ">Phone</span>
    </p>

    <p className="flex text-4xl lg:hidden">
      <span className="skew-x-6  text-blue-600" >L</span>
      <span className="text-amber-400 skew-x-6">P</span>
    </p>
    
    </Link>
}
