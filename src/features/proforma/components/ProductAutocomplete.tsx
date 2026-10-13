import React, { useState, useEffect } from 'react';
import { FaSearch, FaTag } from 'react-icons/fa';
import { getProductosAdminListaCompletaService } from '../../../services/backendService';

export interface CatalogItem {
  nombre: string;
  categoria: string;
  precio: number;
  imei1?: string;
  imei2?: string;
  numeroSerie?: string;
  bateria?: string;
}

interface ProductAutocompleteProps {
  onSelect: (item: CatalogItem) => void;
}

export const ProductAutocomplete: React.FC<ProductAutocompleteProps> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('todas');
  const [dbProducts, setDbProducts] = useState<CatalogItem[]>([]);

  useEffect(() => {
    getProductosAdminListaCompletaService()
      .then((productos) => {
        if (productos && productos.length > 0) {
          const mapped: CatalogItem[] = [];
          productos.forEach((p) => {
            const cat = p.categoriaNombre || 'Celulares';
            if (cat === 'Celulares' && p.itemsCelulares && p.itemsCelulares.length > 0) {
              const disponibles = p.itemsCelulares.filter(
                (i) => i.estadoDispositivo === 'Disponible'
              );
              if (disponibles.length > 0) {
                disponibles.forEach((item) => {
                  mapped.push({
                    nombre: `${p.nombre} (IMEI: ${item.imei1}${
                      item.bateria ? ` • Batería ${item.bateria}` : ''
                    })`,
                    categoria: 'Celulares',
                    precio: p.precio,
                    imei1: item.imei1,
                    imei2: item.imei2 || '',
                    numeroSerie: item.numeroSerial || '',
                    bateria: item.bateria,
                  });
                });
              } else {
                mapped.push({
                  nombre: p.nombre,
                  categoria: cat,
                  precio: p.precio,
                });
              }
            } else {
              mapped.push({
                nombre: p.nombre,
                categoria: cat,
                precio: p.precio,
                numeroSerie: p.numeroSerial,
              });
            }
          });
          setDbProducts(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const catalogSuggestions: CatalogItem[] =
    dbProducts.length > 0
      ? dbProducts
      : [
          {
            nombre:
              'Apple iPhone 15 Pro Max 256GB - Titanium Natural (IMEI: 358921094857102 • 100%)',
            categoria: 'Celulares',
            precio: 4899,
            imei1: '358921094857102',
            imei2: '358921094857103',
            numeroSerie: 'F2LQX980P0DX',
          },
          {
            nombre:
              'Samsung Galaxy S24 Ultra 512GB - Titanium Black (IMEI: 359102948571029 • 100%)',
            categoria: 'Celulares',
            precio: 4599,
            imei1: '359102948571029',
            numeroSerie: 'R5CW901X88K',
          },
          {
            nombre: 'Cargador Rápido Anker 65W USB-C Dual Port',
            categoria: 'Cargadores',
            precio: 189,
            numeroSerie: 'ANK-90182746',
          },
          {
            nombre: 'Audífonos Inalámbricos Apple AirPods Pro 2da Gen',
            categoria: 'Audífonos',
            precio: 899,
            numeroSerie: 'GX9012837461',
          },
          {
            nombre: 'Cable USB-C a Lightning Carga Rápida 2m',
            categoria: 'Accesorios',
            precio: 79,
          },
        ];

  const filteredCatalog = catalogSuggestions.filter((item) => {
    const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === 'todas' ||
      item.categoria.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleItemClick = (item: CatalogItem) => {
    onSelect(item);
    setSearchTerm('');
    setShowDropdown(false);
  };

  return (
    <div className="relative space-y-2 bg-purple-50/30 p-3 rounded-2xl border border-purple-100">
      <label className="text-[11px] font-bold text-purple-800 flex items-center gap-1">
        <FaTag className="text-[10px]" /> Filtrar & Buscar Producto del Inventario
      </label>

      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full sm:w-2/5 px-3 py-2 bg-white rounded-xl border border-purple-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 shadow-sm cursor-pointer"
        >
          <option value="todas">Todas las Categorías</option>
          <option value="Celulares">Celulares</option>
          <option value="Cargadores">Cargadores</option>
          <option value="Audífonos">Audífonos</option>
          <option value="Accesorios">Accesorios</option>
        </select>

        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 text-[10px]" />
          <input
            type="text"
            value={searchTerm}
            onFocus={() => setShowDropdown(true)}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            placeholder="Escribe para autocompletar producto..."
            className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-purple-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
          />
        </div>
      </div>

      {showDropdown && (searchTerm || filterCategory !== 'todas') && (
        <div className="absolute left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden max-h-64">
          {filteredCatalog.length > 0 ? (
            <div className="overflow-y-auto max-h-60">
              {filteredCatalog.map((item, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleItemClick(item)}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-purple-50 transition-colors border-b border-slate-100 last:border-none flex justify-between items-center text-xs cursor-pointer"
                >
                  <div>
                    <p className="font-bold text-slate-900">{item.nombre}</p>
                    <span className="text-[10px] text-purple-600 font-bold">{item.categoria}</span>
                  </div>
                  <span className="font-mono font-extrabold text-slate-800">S/ {item.precio}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-xs font-bold text-slate-700">No se encontraron productos disponibles</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Verifica que el producto esté registrado y tenga unidades con IMEI en estado "Disponible".
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
