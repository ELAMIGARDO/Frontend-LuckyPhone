import { Separator } from "../shared/Separator";

const MODELOS_IPHONE = [
  "iPhone 15 Pro Max",
  "iPhone 15 Pro",
  "iPhone 15",
  "iPhone 14 Pro Max",
  "iPhone 14",
  "iPhone 13",
  "iPhone 12 / SE",
];

const ALMACENAMIENTOS = [
  "128GB",
  "256GB",
  "512GB",
  "1TB",
];

interface ContainerFilterProps {
  marcasSeleccionadas?: string[];
  onToggleMarca?: (marca: string) => void;
  precioMaximo?: number;
  onChangePrecioMaximo?: (precio: number) => void;
  onLimpiarFiltros?: () => void;
}

export const ContainerFilter = ({
  marcasSeleccionadas = [],
  onToggleMarca = () => {},
  precioMaximo = 10000,
  onChangePrecioMaximo = () => {},
  onLimpiarFiltros = () => {},
}: ContainerFilterProps) => {
  return (
    <div className="p-5 border border-slate-200 rounded-3xl bg-white shadow-sm h-fit col-span-2 lg:col-span-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <span>🔍</span> Filtrar iPhones
        </h3>
        {(marcasSeleccionadas.length > 0 || precioMaximo < 10000) && (
          <button
            onClick={onLimpiarFiltros}
            className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      <Separator />

      {/* Especialidad: Modelos de iPhone */}
      <div className="flex flex-col gap-3 my-4">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <span>🍎</span> Modelos Destacados
        </h4>

        <div className="flex flex-col gap-2">
          {MODELOS_IPHONE.map((modelo) => {
            const isChecked = marcasSeleccionadas.includes(modelo);
            return (
              <label
                key={modelo}
                className="inline-flex items-center cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleMarca(modelo)}
                  className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 accent-purple-600 cursor-pointer"
                />
                <span className={`ml-2 text-xs transition-colors ${isChecked ? 'font-bold text-purple-700' : 'text-slate-600 group-hover:text-slate-900'}`}>
                  {modelo}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Capacidad de Almacenamiento */}
      <div className="flex flex-col gap-3 my-4">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <span>💾</span> Almacenamiento
        </h4>

        <div className="grid grid-cols-2 gap-2">
          {ALMACENAMIENTOS.map((cap) => {
            const isChecked = marcasSeleccionadas.includes(cap);
            return (
              <button
                key={cap}
                onClick={() => onToggleMarca(cap)}
                className={`py-1.5 px-3 text-xs font-bold rounded-xl border transition-all ${
                  isChecked
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cap}
              </button>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Presupuesto */}
      <div className="flex flex-col gap-3 mt-4">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Presupuesto Máximo
          </h4>
          <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
            S/ {precioMaximo.toLocaleString()}
          </span>
        </div>

        <input
          type="range"
          min={1000}
          max={9000}
          step={200}
          value={precioMaximo}
          onChange={(e) => onChangePrecioMaximo(Number(e.target.value))}
          className="w-full accent-purple-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
          <span>S/ 1,000</span>
          <span>S/ 9,000</span>
        </div>
      </div>
    </div>
  );
};