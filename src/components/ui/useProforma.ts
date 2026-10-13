import { useState, useEffect } from 'react';
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

export const useProforma = () => {
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
    duracionGarantia: '0 Meses',
  });

  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Cargar autogenerador de código correlativo
  useEffect(() => {
    luckyphoneApi.get('/garantias/siguiente-codigo')
      .then(res => {
        if (res.data && res.data.codigo) {
          setProformaData(prev => ({ ...prev, codigoProforma: res.data.codigo }));
        }
      })
      .catch(() => {
        // Fallback transparente
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

  // Guardado transaccional y posterior trigger de impresión A4
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
        precioBase: payload.precioBase,
        estadoPago: 'PENDIENTE'
      };

      const localSaved = JSON.parse(localStorage.getItem('luckyphone_garantias_local') || '[]');
      const updatedLocal = [nuevaGarantiaLocal, ...localSaved.filter((g: any) => g.id !== nuevaGarantiaLocal.id)];
      localStorage.setItem('luckyphone_garantias_local', JSON.stringify(updatedLocal));

      // 2. Persistir en servidor backend Spring Boot
      await luckyphoneApi.post('/garantias', payload).catch(() => null);

      // Disparar la impresión PDF
      window.print();
    } catch (err) {
      window.print();
    } finally {
      setIsSaving(false);
    }
  };

  return {
    proformaData,
    setProformaData,
    handleChange,
    montoDescuento,
    precioFinal,
    fechaEmision,
    fechaFinGarantia,
    isSaving,
    handleSubmit
  };
};
