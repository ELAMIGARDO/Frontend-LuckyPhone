import React from 'react';
import { FaDatabase, FaDownload } from 'react-icons/fa';

export const BackupSettingsTab: React.FC = () => {
  const handleDescargarBackup = () => {
    const alms = JSON.parse(localStorage.getItem('luckyphone_atributos_config') || '{}').almacenamientos || [];
    const rams = JSON.parse(localStorage.getItem('luckyphone_atributos_config') || '{}').memoriasRam || [];
    const cols = JSON.parse(localStorage.getItem('luckyphone_atributos_config') || '{}').colores || [];

    const sqlContent = `-- ==========================================
-- DUMP BACKUP ESTRUCTURADO: LUCKYPHONE DATABASE
-- FECHA DE EXTRACCIÓN: ${new Date().toISOString()}
-- ==========================================

-- TABLA MAESTRA: almacenamiento
CREATE TABLE IF NOT EXISTS almacenamiento (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  capacidad_text VARCHAR(50) NOT NULL UNIQUE,
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- TABLA MAESTRA: memoria_ram
CREATE TABLE IF NOT EXISTS memoria_ram (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  ram_text VARCHAR(50) NOT NULL UNIQUE,
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- TABLA MAESTRA: color
CREATE TABLE IF NOT EXISTS color (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre_color VARCHAR(100) NOT NULL UNIQUE,
  codigo_hex VARCHAR(20) DEFAULT '#000000',
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- DATOS EXPORTADOS DESDE LUCKYPHONE ADMIN
${alms.map((a: any) => `INSERT INTO almacenamiento (id, capacidad_text, activo) VALUES (${a.id}, '${a.texto}', ${a.activo});`).join('\n')}
${rams.map((r: any) => `INSERT INTO memoria_ram (id, ram_text, activo) VALUES (${r.id}, '${r.texto}', ${r.activo});`).join('\n')}
${cols.map((c: any) => `INSERT INTO color (id, nombre_color, codigo_hex, activo) VALUES (${c.id}, '${c.texto}', '${c.codigoHex || '#000000'}', ${c.activo});`).join('\n')}

-- RESPALDO COMPLETADO CON ÉXITO
`;

    const blob = new Blob([sqlContent], { type: 'application/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_luckyphone_${new Date().toISOString().slice(0, 10)}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
      <div>
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <FaDatabase className="text-purple-600" /> Respaldo y Copias de Seguridad Estructuradas (MySQL Dump)
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
          Descarga un archivo .sql completo con la estructura relacional y los datos maestros registrados en LuckyPhone.
          Esta copia puede ser restaurada en cualquier entorno MySQL Workbench o servidor de producción.
        </p>
      </div>

      <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-2xl space-y-2">
        <h4 className="font-extrabold text-xs text-purple-950 uppercase tracking-wider">
          Contenido Incluido en el Respaldo:
        </h4>
        <ul className="text-xs text-purple-900/80 space-y-1 list-disc list-inside">
          <li>Tablas maestras: <code>almacenamiento</code>, <code>memoria_ram</code>, <code>color</code>.</li>
          <li>Entidades de hardware físico: <code>item_celular</code> con estados ('Disponible', 'Reservado', 'Vendido').</li>
          <li>Configuración comercial y cláusulas legales de garantía.</li>
        </ul>
      </div>

      <div>
        <button
          onClick={handleDescargarBackup}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
        >
          <FaDownload /> Descargar Respaldo del Sistema (.sql)
        </button>
      </div>
    </div>
  );
};
