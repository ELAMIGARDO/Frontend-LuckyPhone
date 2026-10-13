import React from 'react';
import {
  LayoutDashboard,
  Smartphone,
  FileSpreadsheet,
  ShieldCheck,
  BarChart3,
  Star,
  Settings,
  Store,
  LogOut
} from 'lucide-react';
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
    {
      id: 'metrics' as TabType,
      label: 'Dashboard Ejecutivo',
      icon: LayoutDashboard
    },
    {
      id: 'inventory' as TabType,
      label: 'Inventario de Celulares',
      icon: Smartphone,
      badge: counts.disponibles
    },
    {
      id: 'proforma' as TabType,
      label: 'Emitir Proforma',
      icon: FileSpreadsheet
    },
    {
      id: 'warranties' as TabType,
      label: 'Control de Garantías',
      icon: ShieldCheck,
      badge: counts.vigentes
    },
    {
      id: 'reports' as TabType,
      label: 'Reportes & Auditoría',
      icon: BarChart3
    },
    {
      id: 'reviews' as TabType,
      label: 'Reseñas de Clientes',
      icon: Star
    },
    {
      id: 'settings' as TabType,
      label: 'Ajustes del Sistema',
      icon: Settings
    }
  ];

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-zinc-950 text-zinc-100 flex flex-col justify-between 
        transition-transform duration-200 ease-out md:translate-x-0 print:hidden 
        border-r border-zinc-800/80 shadow-xl
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      <div>
        <div className="p-5 flex items-center gap-3 border-b border-zinc-850 bg-zinc-950/80 backdrop-blur-md">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-purple-400 font-bold shadow-2xs">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1">
              LUCKY<span className="text-purple-400">PHONE</span>
            </h1>
            <p className="text-[10px] text-zinc-500 font-medium tracking-wider uppercase">
              Admin Console
            </p>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  if (setIsOpenMobile) setIsOpenMobile(false);
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium 
                  transition-all duration-150 text-left group cursor-pointer border
                  ${
                    isActive
                      ? 'bg-zinc-900 text-white border-zinc-800 shadow-2xs font-semibold'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 border-transparent'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-purple-400'
                        : 'text-zinc-500 group-hover:text-zinc-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`
                      px-2 py-0.5 text-[11px] font-mono font-medium rounded-md border transition-colors
                      ${
                        isActive
                          ? 'bg-purple-950/60 text-purple-300 border-purple-800/60'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                      }
                    `}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 m-3 rounded-lg bg-zinc-900/70 border border-zinc-800/80">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-md bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-300 font-semibold text-xs">
            AP
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-zinc-200 truncate">Asesor Lucky Phone</p>
            <p className="text-[11px] text-zinc-500 font-mono truncate">admin@luckyphone.pe</p>
          </div>
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-zinc-900 hover:bg-zinc-800 hover:text-red-300 text-zinc-400 text-xs font-medium transition-colors border border-zinc-800 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
