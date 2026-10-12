import React from 'react';
import { FaStar, FaShieldAlt, FaFileContract, FaQuoteLeft, FaCheckCircle } from 'react-icons/fa';
import type { ReviewItem } from '../../interfaces/luckyPhoneTypes';

const defaultReviews: ReviewItem[] = [
  {
    id: '1',
    clienteNombre: 'Carlos Mendoza',
    modeloCelular: 'iPhone 15 Pro Max 256GB',
    calificacion: 5,
    fecha: '12 Sep 2026',
    comentario: 'Excelente atención en Lucky Phone. Me entregaron mi proforma impresa con todos los datos detallados e IMEI verificado. La garantía física de 12 meses firmada por el asesor me dio 100% de confianza.',
    verificado: true,
  },
  {
    id: '2',
    clienteNombre: 'Valeria Ríos',
    modeloCelular: 'Samsung Galaxy S24 Ultra',
    calificacion: 5,
    fecha: '28 Ago 2026',
    comentario: 'Tenía dudas sobre comprar un celular de gama alta, pero en Lucky Phone la proforma física especificaba la fecha exacta de vigencia de la garantía de fábrica. El equipo sellado y en perfecto estado.',
    verificado: true,
  },
  {
    id: '3',
    clienteNombre: 'Diego Alarcón',
    modeloCelular: 'Xiaomi 14 Ultra 512GB',
    calificacion: 5,
    fecha: '05 Oct 2026',
    comentario: 'Súper transparentes con el IMEI coincidente en la proforma impresa y la hoja de garantía oficial de Lucky Phone S.A.C. Da mucha tranquilidad comprar en una tienda formal y seria.',
    verificado: true,
  },
  {
    id: '4',
    clienteNombre: 'Mariana Sotomayor',
    modeloCelular: 'Google Pixel 8 Pro',
    calificacion: 5,
    fecha: '19 Sep 2026',
    comentario: 'Buscaba seguridad y respaldo legal en mi compra. El certificado de garantía física con fecha de activación y caducidad exacta sellado me demostró la solidez de Lucky Phone.',
    verificado: true,
  },
  {
    id: '5',
    clienteNombre: 'Renzo Cavaliere',
    modeloCelular: 'iPhone 14 128GB Midnight',
    calificacion: 5,
    fecha: '01 Oct 2026',
    comentario: 'La proforma detalló cada costo sin cargos ocultos. El documento formal firmado físicamente por la tienda respalda la garantía total de hardware.',
    verificado: true,
  },
  {
    id: '6',
    clienteNombre: 'Camila Fernández',
    modeloCelular: 'Honor Magic 6 Pro',
    calificacion: 5,
    fecha: '03 Oct 2026',
    comentario: 'Servicio técnico e impresiones impecables. Me llevé mi celular registrado con IMEI en la proforma oficial y sello impreso. Recomendado 100% por seguridad.',
    verificado: true,
  }
];

interface CustomerReviewsProps {
  reviews?: ReviewItem[];
  title?: string;
  subtitle?: string;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({ 
  reviews = defaultReviews,
  title = "Opiniones de Nuestros Compradores",
  subtitle = "La tranquilidad de comprar con garantía física legal e IMEI verificado en Proforma Impresa"
}) => {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200/80 font-sans">
      <div className="w-full max-w-[1650px] mx-auto">
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 font-extrabold text-xs mb-3 border border-purple-200">
            <FaShieldAlt className="text-purple-600" /> COMPRAS 100% GARANTIZADAS Y SEGURAS
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-2 text-sm text-slate-600 font-medium">
            {subtitle}
          </p>
        </div>

        {/* Grilla de Reseñas Refactorizada */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 border border-slate-200/80 flex flex-col justify-between transition-all duration-200 ease-in-out relative group overflow-hidden"
            >
              {/* Barra superior con gradiente */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
              
              <div>
                {/* Cabecera del Testimonio */}
                <div className="flex items-start justify-between mb-3 pt-1">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-purple-600 transition-colors">
                      {review.clienteNombre}
                    </h3>
                    <p className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md inline-block mt-1 border border-purple-200">
                      📱 {review.modeloCelular}
                    </p>
                  </div>
                  {review.verificado && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200" title="Compra verificada">
                      <FaCheckCircle /> Verificado
                    </span>
                  )}
                </div>

                {/* Calificación por Estrellas */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={`text-sm ${i < review.calificacion ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
                    />
                  ))}
                  <span className="ml-1.5 text-xs font-bold text-slate-500">{review.calificacion}.0 / 5.0</span>
                </div>

                {/* Comentario en Sans-Serif Itálica */}
                <div className="relative text-slate-600 text-sm leading-relaxed mb-6 italic font-sans">
                  <FaQuoteLeft className="text-purple-600/10 text-3xl absolute -top-2 -left-2 -z-0" />
                  <p className="relative z-10 font-normal pl-1">
                    "{review.comentario}"
                  </p>
                </div>
              </div>

              {/* Pie de Tarjeta */}
              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <FaFileContract className="text-purple-600" />
                  <span className="font-bold text-slate-700">Proforma & Garantía Física</span>
                </div>
                <span className="text-slate-400 text-[11px] font-mono">{review.fecha}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};