// Función para formatear el precio a moneda local (Soles / Dólares)
export const formatPrice = (price: number, currency: string = "PEN") => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};