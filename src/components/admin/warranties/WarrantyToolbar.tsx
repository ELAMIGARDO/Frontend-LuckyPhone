import React from 'react';
import { FaSearch, FaCheckCircle, FaTimesCircle, FaRecycle } from 'react-icons/fa';

interface WarrantyToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filtroCobertura: string;
  onCoberturaChange: (value: string) => void;
  filtroCategoria: string;
  onCategoriaChange: (value: string) => void;
  activeTab: 'todos' | 'vigentes' | 'caducados' | 'anulados';
  onTabChange: (tab: 'todos' | 'vigentes' | 'caducados' | 'anulados') => void;
  countTotales: number;
  countVigentes: number;
  countCaducados: number;
  countAnulados: number;
}

export const WarrantyToolbar: React.FC<WarrantyToolbarProps> = ({
  searchTerm,
  onSearchChange,
  filtroCobertura,
  onCoberturaChange,
  filtroCategoria,
  onCategoriaChange,
  activeTab,
  onTabChange,
  countTotales,
  countVigentes,
  countCaducados,
  countAnulados
}) => {
  return (
    <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 w-full">
      {/* LADO IZQUIERDO: BUSCADOR + DROPDOWN CATEGORÍAS + DROPDOWN COBERTURA */}
      <div className="flex flex-col sm:flex-row items-center gap-2 flex-1 max-w-3xl">
        {/* BUSCADOR */}
        <div className="relative flex-1 w-full">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por Cliente, DNI/RUC, ID o IMEI/Serie..."
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 shadow-sm transition-all"
          />
        </div>

        {/* DROPDOWN SELECT DE CATEGORÍA DE PRODUCTO */}
        <select
          value={filtroCategoria}
          onChange={(e) => onCategoriaChange(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-white rounded-xl border border-purple-200 text-xs font-bold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 shadow-sm cursor-pointer"
        >
          <option value="todas">Todas las Categorías</option>
          <option value="Celulares">Celulares</option>
          <option value="Cargadores">Cargadores</option>
          <option value="Audífonos">Audífonos</option>
          <option value="Accesorios">Accesorios</option>
        </select>

        {/* DROPDOWN SELECT DE COBERTURA */}
        <select
          value={filtroCobertura}
          onChange={(e) => onCoberturaChange(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 shadow-sm cursor-pointer"
        >
          <option value="todos">Todas las Coberturas</option>
          <option value="0 Meses">0 Meses (Sin Cobertura)</option>
          <option value="3 Meses">3 Meses</option>
          <option value="6 Meses">6 Meses</option>
          <option value="12 Meses">12 Meses</option>
          <option value="24 Meses">24 Meses</option>
        </select>
      </div>

      {/* LADO DERECHO: PESTAÑAS DE ESTADO CON BURBUJAS DE CONTEOS */}
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-200/60 p-1.5 rounded-2xl">
        <button
          onClick={() => onTabChange('todos')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'todos'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
          }`}
        >
          <span>Todos Registros</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'todos' ? 'bg-white/20 text-white' : 'bg-slate-300 text-slate-700'
            }`}
          >
            {countTotales}
          </span>
        </button>

        <button
          onClick={() => onTabChange('vigentes')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'vigentes'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
          }`}
        >
          <FaCheckCircle className="text-[10px]" />
          <span>Vigentes</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'vigentes'
                ? 'bg-white/20 text-white'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {countVigentes}
          </span>
        </button>

        <button
          onClick={() => onTabChange('caducados')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'caducados'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
          }`}
        >
          <FaTimesCircle className="text-[10px]" />
          <span>Caducados</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'caducados' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {countCaducados}
          </span>
        </button>

        <button
          onClick={() => onTabChange('anulados')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'anulados'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-200/80 hover:text-rose-600'
          }`}
        >
          <FaRecycle className="text-[10px]" />
          <span>Anulados</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'anulados' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'
            }`}
          >
            {countAnulados}
          </span>
        </button>
      </div>
    </div>
  );
};
