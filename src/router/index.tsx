import { createBrowserRouter } from "react-router-dom";
import { RootLayouts } from "../layouts/RootLayouts";
import { HomePage, CellPhonesPage, AboutPage } from "../pages";
// Importa tu página de detalle (créala o usa una temporal por ahora)
import { ProductDetailPages } from "../pages/ProductDetailPage"; 

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayouts />,
        children: [
            {
                index: true, 
                element: <HomePage />,
            },
            {
                path: "celulares",
                element: <CellPhonesPage />
            },
            {
                // 🔥 NUEVA RUTA: Captura el ID del celular (ej: /celulares/1)
                path: "celulares/:id",
                element: <ProductDetailPages /> 
            },
            {
                path: "nosotros",
                element: <AboutPage />
            },
        ]
    }
]);
