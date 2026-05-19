import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { useState } from "react";
import { formatPrice } from "../../helpers";

interface Props {
  img: string;
  name: string;
  price: number;
  slug: string;
  colors: { name: string; color: string }[];
  variants: any[];
}

export const CardProduct = ({
  img,
  name,
  price,
  slug,
  colors,
  variants,
}: Props) => {
  const [activeColor, setActiveColor] = useState<{
    name: string;
    color: string;
  }>(colors[0]);

  // Identificar la variante activa según el color seleccionado
  const selectedVariant = variants.find(
    (variant) => variant.color === activeColor.color
  );

  const stock = selectedVariant?.stock || 0;

  return (
    <div className="flex flex-col relative gap-6">
      <Link to={`/celulares/${slug}`} className="flex relative group overflow-hidden">
        <div className="flex h-87.5 w-full items-center justify-center py-2 lg:h-62.5">
          <img
            src={img}
            alt={name}
            className="object-contain h-full w-full"
          />
        </div>
        <button className="bg-white border border-slate-300 absolute w-full bottom-0 py-3 rounded-3xl
          flex items-center justify-center gap-1 text-sm font-medium hover:bg-stone-100 
          translate-y-full transition-all duration-300 group-hover:translate-y-0">
          <FiPlus />
          Añadir
        </button>
      </Link>

      <div className="flex flex-col gap-1 items-center">
        <p className="text-[15px] font-medium">{name}</p>
        <p className="text-[15px] font-medium">{formatPrice(price)}</p>

        <div className="flex gap-3">
          {colors.map((color) => (
            <span
              key={color.color}
              className="grid place-items-center w-5 h-5 rounded-full cursor-pointer"
              onClick={() => setActiveColor(color)}
            >
              <span
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: color.color }}
              />
            </span>
          ))}
        </div>
      </div>

      <div className="absolute top-2 left-2">
        {stock === 0 && <span>Agotado</span>}
      </div>
    </div>
  );
};