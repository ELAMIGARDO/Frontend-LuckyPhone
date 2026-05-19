import { Brand } from "../components/home/Brand";
import { FeatureGrid } from "../components/home/FeatureGrid";
import { ProductGrid } from "../components/home/ProductGrid";
import {popularCelulares, recentCelulares } from "../data/initialData";
import { preparedProducts } from "../helpers";

const preparedRecentProducts = preparedProducts(recentCelulares);
const preparedPopularProducts = preparedProducts(popularCelulares);
console.log(preparedRecentProducts)


export const HomePage = () => {
  return (
    <div>
      <FeatureGrid />
      <ProductGrid
        title="Nuevos Productos"
        products={preparedRecentProducts}
      />
      <ProductGrid
        title="Productos Destacados"
        products={preparedPopularProducts}
      />

      <Brand />
    </div>
  );
};
