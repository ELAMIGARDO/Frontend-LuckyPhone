import React from 'react';
import { ProformaForm } from './ProformaForm';
import { ProformaPreviewA4 } from './ProformaPreviewA4';
import { useProforma } from '../hooks/useProforma';

export type { ProformaData } from '../hooks/useProforma';

export const ProformaDocument: React.FC = () => {
  const {
    proformaData,
    handleChange,
    montoDescuento,
    precioFinal,
    fechaEmision,
    fechaFinGarantia,
    isSaving,
    handleSubmit,
  } = useProforma();

  return (
    <div className="w-full font-sans text-slate-800">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <ProformaForm
          data={proformaData}
          montoDescuento={montoDescuento}
          isSaving={isSaving}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

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
