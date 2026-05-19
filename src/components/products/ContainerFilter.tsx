import { Separator } from "../shared/Separator";

const availableBrands = [
  "Apple",
  "Samsung",
  "Accesorios",
];

export const ContainerFilter = () => {
  return (
    <div className="p-5 border border-slate-200 rounded-lg h-fit col-span-2 lg:col-span-1">
      
      <h3 className="font-semibold text-xl mb-4">
        Filtros
      </h3>

      {/* separador */}
      <Separator />

      <div className="flex flex-col gap-3">

        <h3 className="text-lg font-medium text-black">
          Marcas
        </h3>

        <div className="flex flex-col gap-2">

          {availableBrands.map((brand) => (
            <label
              key={brand}
              className="inline-flex items-center"
            >
              <input
                type="checkbox"
                className="text-black border-black focus:ring-black accent-black"
              />

              <span className="ml-2 cursor-pointer text-sm text-black">
                {brand}
              </span>
            </label>
          ))}

        </div>
      </div>

    </div>
  );
};