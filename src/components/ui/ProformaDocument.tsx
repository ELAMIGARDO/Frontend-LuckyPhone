import React, { useState, useEffect } from 'react';
import { ProformaForm } from './ProformaForm';
import { ProformaPreviewA4 } from './ProformaPreviewA4';
import { luckyphoneApi } from '../../api/luckyphoneApi';

export interface ProformaData {
  codigoProforma: string;
  emisorNombre: string;
  clienteNombre: string;
  clienteDni: string;
  clienteTelefono: string;
  clienteDireccion: string;
  categoria: string;
  productoModelo: string;
  imei1: string;
  imei2: string;
  numeroSerie: string;
  precioBase: number;
  descuentoTipo: 'soles' | 'porcentaje';
  descuentoValor: number;
  duracionGarantia: string;
}

export const ProformaDocument: React.FC = () => {
  const [proformaData, setProformaData] = useState<ProformaData>({
    codigoProforma: 'G-101',
    emisorNombre: 'Vendedor LuckyPhone',
    clienteNombre: '',
    clienteDni: '',
    clienteTelefono: '',
    clienteDireccion: '',
    categoria: 'Celulares',
    productoModelo: '',
    imei1: '',
    imei2: '',
    numeroSerie: '',
    precioBase: 0,
    descuentoTipo: 'soles',
    descuentoValor: 0,
    duracionGarantia: '12 Meses',
  });

  const [isSaving, setIsSaving] = useState(false);

  // Cargar autogenerador de código correlativo al montar pantalla
  useEffect(() => {
    luckyphoneApi.get('/garantias/siguiente-codigo')
      .then(res => {
        if (res.data && res.data.codigo) {
          setProformaData(prev => ({ ...prev, codigoProforma: res.data.codigo }));
        }
      })
      .catch(() => {
        // Fallback local si el backend no responde
      });
  }, []);

  const handleChange = (field: keyof ProformaData, value: any) => {
    setProformaData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Cálculo del descuento según modalidad (Soles o Porcentaje)
  const montoDescuento = proformaData.descuentoTipo === 'porcentaje'
    ? (proformaData.precioBase * (proformaData.descuentoValor || 0)) / 100
    : (proformaData.descuentoValor || 0);

  const precioFinal = Math.max(0, proformaData.precioBase - montoDescuento);

  // Automatización de fechas: Emisión (Hoy) y Fin de Garantía
  const hoy = new Date();
  const fechaEmision = hoy.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const mesesGarantia = parseInt(proformaData.duracionGarantia, 10) || 0;
  let fechaFinGarantia: string | null = null;
  if (mesesGarantia > 0) {
    const fechaFin = new Date(hoy);
    fechaFin.setMonth(fechaFin.getMonth() + mesesGarantia);
    fechaFinGarantia = fechaFin.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // FLUJO DE GUARDADO OBLIGATORIO ANTES DE IMPRIMIR PDF
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      id: proformaData.codigoProforma,
      clienteNombre: proformaData.clienteNombre,
      clienteDni: proformaData.clienteDni,
      clienteTelefono: proformaData.clienteTelefono,
      categoria: proformaData.categoria,
      productoModelo: proformaData.productoModelo,
      imei1: proformaData.categoria === 'Celulares' ? proformaData.imei1 : null,
      imei2: proformaData.categoria === 'Celulares' ? proformaData.imei2 : null,
      numeroSerie: proformaData.numeroSerie,
      precioBase: proformaData.precioBase,
      descuentoMonto: montoDescuento,
      precioFinal: precioFinal,
      duracionGarantia: proformaData.duracionGarantia,
      emisorNombre: proformaData.emisorNombre,
      fechaEmision: new Date().toISOString(),
      fechaCaducidad: (() => {
        if (mesesGarantia <= 0) return new Date().toISOString();
        const fechaCad = new Date();
        fechaCad.setMonth(fechaCad.getMonth() + mesesGarantia);
        return fechaCad.toISOString();
      })()
    };

    try {
      // 1. Guardar localmente para sincronización instantánea con Control de Garantías
      const nuevaGarantiaLocal = {
        id: payload.id,
        cliente: payload.clienteNombre,
        dni: payload.clienteDni,
        telefono: payload.clienteTelefono,
        celular: payload.productoModelo,
        categoria: payload.categoria,
        imei1: payload.imei1 || '',
        imei2: payload.imei2 || '',
        numeroSerie: payload.numeroSerie || '',
        activacion: new Date().toLocaleDateString('es-PE'),
        caducidad: new Date(payload.fechaCaducidad).toLocaleDateString('es-PE'),
        duracionGarantia: payload.duracionGarantia,
        diasRestantes: mesesGarantia <= 0 ? 0 : Math.ceil((new Date(payload.fechaCaducidad).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        estado: mesesGarantia <= 0 ? 'Caducado' : 'Vigente',
        alerta: mesesGarantia <= 0,
        eliminadoAt: null,
        precioBase: payload.precioBase
      };

      const localSaved = JSON.parse(localStorage.getItem('luckyphone_garantias_local') || '[]');
      const updatedLocal = [nuevaGarantiaLocal, ...localSaved.filter((g: any) => g.id !== nuevaGarantiaLocal.id)];
      localStorage.setItem('luckyphone_garantias_local', JSON.stringify(updatedLocal));

      // 2. Intentar guardar en servidor MySQL / Backend
      await luckyphoneApi.post('/garantias', payload).catch(() => null);

      // Disparar la impresión PDF
      window.print();
    } catch (err) {
      window.print();
    } finally {
      setIsSaving(false);
    }
  };

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

        {/* VISTA PREVIA A4 (COLUMNA DERECHA) */}
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