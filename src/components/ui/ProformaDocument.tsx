import React from 'react';
import { ProformaForm } from './ProformaForm';
import { ProformaPreviewA4 } from './ProformaPreviewA4';
import { useProforma } from './useProforma';

export type { ProformaData } from './useProforma';

export const ProformaDocument: React.FC = () => {
  const {
    proformaData,
    handleChange,
    montoDescuento,
    precioFinal,
    fechaEmision,
    fechaFinGarantia,
    isSaving,
    handleSubmit
  } = useProforma();

  return (
    <div className="w-full font-sans text-slate-800">
      {/* GRID PRINCIPAL DE 2 COLUMNAS (12 COLUMNAS TAILWIND) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PANEL DE FORMULARIO (COLUMNA IZQUIERDA) */}
        <ProformaForm
          data={proformaData}
          montoDescuento={montoDescuento}
          isSaving={isSaving}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        {/* VISTA PREVIA A4 AISLADA PARA IMPRESIÓN (COLUMNA DERECHA) */}
        <ProformaPreviewA4
          data={proformaData}
          precioFinal={precioFinal}
          montoDescuento={montoDescuento}
          fechaEmision={fechaEmision}
          fechaFinGarantia={fechaFinGarantia}
        />
      </div>
    </div>
  );
};