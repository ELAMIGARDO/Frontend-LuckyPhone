import type { InventoryItem } from '../../interfaces/luckyPhoneTypes';

export const exportarInventarioExcel = (items: InventoryItem[], categoriaSeleccionada: string = 'TODOS') => {
  const filtered = categoriaSeleccionada === 'TODOS' 
    ? items 
    : items.filter(i => i.categoriaNombre?.toLowerCase().includes(categoriaSeleccionada.toLowerCase()));

  const rows: string[][] = [];

  if (categoriaSeleccionada === 'Celulares' || categoriaSeleccionada === 'TODOS') {
    // Encabezados detallados para Celulares con IMEI / Unidades físicas
    rows.push([
      'ID Producto',
      'Categoría',
      'Marca',
      'Modelo',
      'Condición (Estado)',
      'Color',
      'Almacenamiento',
      'RAM',
      'IMEI 1',
      'IMEI 2',
      'Número de Serie',
      'Salud Batería',
      'Estado Unidad / Venta',
      'Precio Base (S/)'
    ]);

    filtered.forEach(p => {
      const itemsList = p.itemsCelulares && p.itemsCelulares.length > 0 
        ? p.itemsCelulares 
        : [{
            imei1: p.imei || p.imei1 || '',
            imei2: p.imei2 || '',
            numeroSerial: p.numeroSerie || p.numeroSerial || '',
            bateria: p.bateria || '100%',
            estadoDispositivo: 'Disponible' as const
          }];

      itemsList.forEach(item => {
        rows.push([
          String(p.id),
          p.categoriaNombre || 'Celulares',
          p.marca || 'Apple',
          p.modelo,
          p.estado || 'Nuevo / Sellado',
          p.color,
          p.almacenamiento,
          p.ram || 'N/A',
          item.imei1 || '',
          item.imei2 || '',
          item.numeroSerial || '',
          item.bateria || '100%',
          item.estadoDispositivo || 'Disponible',
          p.precio.toFixed(2)
        ]);
      });
    });
  } else {
    // Encabezados para Accesorios / Cargadores / Otros
    rows.push([
      'ID Producto',
      'Categoría',
      'Nombre / Modelo',
      'Marca',
      'Color',
      'Stock Disponible',
      'Precio (S/)'
    ]);

    filtered.forEach(p => {
      rows.push([
        String(p.id),
        p.categoriaNombre || 'Accesorio',
        p.modelo,
        p.marca || 'Genérica',
        p.color,
        String(p.stock),
        p.precio.toFixed(2)
      ]);
    });
  }

  // Generar CSV descargable con BOM UTF-8 para compatibilidad absoluta con Microsoft Excel
  const csvContent = '\uFEFF' + rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Inventario_LuckyPhone_${categoriaSeleccionada}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportarInventarioPDF = (items: InventoryItem[], categoriaSeleccionada: string = 'TODOS') => {
  const filtered = categoriaSeleccionada === 'TODOS' 
    ? items 
    : items.filter(i => i.categoriaNombre?.toLowerCase().includes(categoriaSeleccionada.toLowerCase()));

  const fechaHora = new Date().toLocaleString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor permite las ventanas emergentes en tu navegador para generar el PDF.');
    return;
  }

  let tableRowsHtml = '';

  if (categoriaSeleccionada === 'Celulares' || categoriaSeleccionada === 'TODOS') {
    let correlativo = 1;
    filtered.forEach((p) => {
      const itemsList = p.itemsCelulares && p.itemsCelulares.length > 0 
        ? p.itemsCelulares 
        : [{
            imei1: p.imei || p.imei1 || '',
            imei2: p.imei2 || '',
            numeroSerial: p.numeroSerie || p.numeroSerial || '',
            bateria: p.bateria || '100%',
            estadoDispositivo: 'Disponible'
          }];

      itemsList.forEach((it) => {
        tableRowsHtml += `
          <tr>
            <td style="font-weight: 700; color: #4338ca;">#${correlativo++}</td>
            <td style="font-weight: 600;">${p.modelo}</td>
            <td><span class="badge ${p.estado?.includes('Nuevo') ? 'badge-new' : 'badge-used'}">${p.estado}</span></td>
            <td>${p.color}</td>
            <td>${p.almacenamiento} / ${p.ram || 'N/A'}</td>
            <td style="font-family: monospace; font-size: 11px;">${it.imei1 || '-'}</td>
            <td style="font-family: monospace; font-size: 11px;">${it.numeroSerial || '-'}</td>
            <td>${it.bateria || '100%'}</td>
            <td><span class="status-tag">${it.estadoDispositivo || 'Disponible'}</span></td>
            <td style="text-align: right; font-weight: 700; color: #047857;">S/ ${p.precio.toFixed(2)}</td>
          </tr>
        `;
      });
    });
  } else {
    filtered.forEach(p => {
      tableRowsHtml += `
        <tr>
          <td style="font-weight: 700; color: #4338ca;">#${p.id}</td>
          <td style="font-weight: 600;">${p.modelo}</td>
          <td>${p.categoriaNombre}</td>
          <td>${p.marca || 'Apple'}</td>
          <td>${p.color}</td>
          <td style="text-align: center; font-weight: bold;">${p.stock}</td>
          <td style="text-align: right; font-weight: 700; color: #047857;">S/ ${p.precio.toFixed(2)}</td>
        </tr>
      `;
    });
  }

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Reporte de Inventario - LuckyPhone</title>
      <style>
        @page { size: A4 landscape; margin: 12mm; }
        body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; margin: 0; padding: 20px; font-size: 11px; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #6366f1; padding-bottom: 12px; margin-bottom: 16px; }
        .logo-title { display: flex; align-items: center; gap: 10px; }
        .logo-box { width: 32px; height: 32px; background: #6366f1; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; }
        .title { font-size: 18px; font-weight: 900; color: #0f172a; margin: 0; }
        .subtitle { font-size: 11px; color: #64748b; margin: 2px 0 0 0; }
        .meta-info { text-align: right; font-size: 10px; color: #475569; }
        .category-badge { display: inline-block; padding: 3px 8px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: 700; color: #334155; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background: #f8fafc; color: #334155; font-weight: 800; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; padding: 8px 6px; text-align: left; }
        td { padding: 6px; border-bottom: 1px solid #f1f5f9; font-size: 10.5px; }
        tr:nth-child(even) { background-color: #fafbfc; }
        .badge { padding: 2px 6px; border-radius: 4px; font-size: 9.5px; font-weight: 700; }
        .badge-new { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
        .badge-used { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
        .status-tag { padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; background: #e0e7ff; color: #4338ca; }
        .footer { margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 8px; display: flex; justify-content: space-between; font-size: 9.5px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-title">
          <div class="logo-box">📱</div>
          <div>
            <h1 class="title">LUCKYPHONE - REPORTE DE INVENTARIO</h1>
            <p class="subtitle">Control y Auditoría de Stock en Almacén</p>
          </div>
        </div>
        <div class="meta-info">
          <div><strong>Fecha / Hora:</strong> ${fechaHora}</div>
          <div style="margin-top: 4px;"><strong>Filtro:</strong> <span class="category-badge">${categoriaSeleccionada.toUpperCase()}</span></div>
          <div style="margin-top: 2px;">Total Registros: <strong>${filtered.length}</strong></div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Modelo / Equipo</th>
            <th>Condición</th>
            <th>Color</th>
            <th>Capacidad / RAM</th>
            <th>IMEI 1</th>
            <th>N° Serie</th>
            <th>Salud</th>
            <th>Estado</th>
            <th style="text-align: right;">Precio Base</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>

      <div class="footer">
        <span>Reporte de Inventario Automatizado - LuckyPhone Admin</span>
        <span>Página 1 de 1</span>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};
