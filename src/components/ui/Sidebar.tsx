import React from 'react';
import { 
  FaChartPie, 
  FaMobileAlt, 
  FaFileInvoiceDollar, 
  FaShieldAlt, 
  FaStar, 
  FaSignOutAlt,
  FaStore,
  FaCog
} from 'react-icons/fa';
import type { TabType } from '../../interfaces/luckyPhoneTypes';
import { useInventoryContext } from '../../context/InventoryContext';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isOpenMobile?: boolean;
  setIsOpenMobile?: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile 
}) => {
  const { counts } = useInventoryContext();

  const menuItems = [
    { id: 'metrics' as TabType, label: 'Métricas', icon: FaChartPie },
    { id: 'inventory' as TabType, label: 'Inventario de Celulares', icon: FaMobileAlt, badge: counts.disponibles, badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { id: 'proforma' as TabType, label: 'Emitir Proforma', icon: FaFileInvoiceDollar },
    { id: 'warranties' as TabType, label: 'Control de Garantías', icon: FaShieldAlt, badge: counts.vigentes, badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { id: 'reviews' as TabType, label: 'Reseñas de Clientes', icon: FaStar },
    { id: 'settings' as TabType, label: 'Ajustes del Sistema', icon: FaCog },
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 w-72 bg-slate-950 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 print:hidden shadow-2xl border-r border-slate-800
      ${isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      {/* Header Logo */}
      <div>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/80 bg-slate-900">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-purple-600/30 text-xl">
            <FaStore />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-wider text-white flex items-center gap-1">
              LUCKY<span className="text-purple-400">PHONE</span>
            </h1>
            <p className="text-[10px] text-purple-300/80 font-bold tracking-widest uppercase">ADMIN DASHBOARD</p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-4 space-y-1.5 mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (setIsOpenMobile) setIsOpenMobile(false);
                }}
                className={`
                  w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 text-left group relative overflow-hidden
                  ${isActive 
                    ? 'bg-purple-600/20 text-purple-400 border-l-4 border-purple-500 shadow-md shadow-purple-950/40' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'}
                `}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`text-lg transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-purple-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border shadow-2xs ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer User Info */}
      <div className="p-4 m-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-purple-600/20 flex items-center justify-center border border-purple-500/40 text-purple-300 font-bold text-sm">
            AP
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-200 truncate">Asesor Lucky Phone</p>
            <p className="text-[10px] text-purple-300/80 font-mono">admin@luckyphone.pe</p>
          </div>
        </div>
        <button className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 text-xs font-bold transition-colors border border-slate-700 hover:border-rose-700/40">
          <FaSignOutAlt /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};
