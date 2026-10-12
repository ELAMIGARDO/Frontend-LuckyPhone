import React from 'react';
import {
  FaSlidersH,
  FaStore,
  FaUsers,
  FaDatabase
} from 'react-icons/fa';
import { AttributesSettingsTab } from '../components/admin/settings/AttributesSettingsTab';
import { CompanySettingsTab } from '../components/admin/settings/CompanySettingsTab';
import { UsersSettingsTab } from '../components/admin/settings/UsersSettingsTab';
import { BackupSettingsTab } from '../components/admin/settings/BackupSettingsTab';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'atributos' | 'empresa' | 'usuarios' | 'backup'>('atributos');

  return (
    <div className="w-full space-y-6 animate-fadeIn font-sans pb-12">
      {/* HEADER DE LA PÁGINA */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FaSlidersH className="text-purple-600" /> Panel de Ajustes y Configuración Dinámica (SaaS)
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Gestiona de forma 100% autónoma los catálogos de hardware, información comercial de proformas y accesos de personal.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Autogestión Activa
        </span>
      </div>

      {/* TABS DE NAVEGACIÓN */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('atributos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'atributos'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FaSlidersH /> Pestaña 1: Atributos de Hardware
        </button>

        <button
          onClick={() => setActiveTab('empresa')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'empresa'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FaStore /> Pestaña 2: Datos del Negocio & Póliza A4
        </button>

        <button
          onClick={() => setActiveTab('usuarios')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'usuarios'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FaUsers /> Pestaña 3: Personal & Permisos
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'backup'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FaDatabase /> Pestaña 4: Copias de Seguridad (SQL)
        </button>
      </div>

      {/* CONTENIDO MODULAR POR PESTAÑAS */}
      {activeTab === 'atributos' && <AttributesSettingsTab />}
      {activeTab === 'empresa' && <CompanySettingsTab />}
      {activeTab === 'usuarios' && <UsersSettingsTab />}
      {activeTab === 'backup' && <BackupSettingsTab />}
    </div>
  );
};
