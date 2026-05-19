import type { Product, Color, VariantProduct } from "../interfaces";

//funcion para formatear el precio a dolares
export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits:2,
    }).format(price);
}




export const preparedProducts = (products: Product[]) => {
    return products.map(product => {
        //agrupar las variantes por color
        const colors = product.variants.reduce((acc : Color[], variante: VariantProduct) => {
            const existingColor = acc.find(item => item.color === variante.color);
            if (existingColor) {
                existingColor.price = Math.min(existingColor.price ?? 0, variante.price);
            } else {
                acc.push({ 
                    color: variante.color, 
                    price: variante.price,
                    name: variante.color_name,
                });
            }
            return acc;
        }, []);

        //obtener el precio mínimo entre las variantes de color
        const price = Math.min(...colors.map(item => item.price ?? 0));

        //devolver el producto formateado con la información de colores y precio mínimo
        return {
            ...product,
            price,
            colors: colors.map(({name, color}) => ({name, color})),
            variants: product.variants,
        }
    });
};