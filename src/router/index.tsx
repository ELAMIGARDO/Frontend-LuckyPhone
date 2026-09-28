import { createBrowserRouter } from "react-router-dom";
import { RootLayouts } from "../layouts/RootLayouts";
import { AdminLayout } from "../layouts/AdminLayout";
import { HomePage, CellPhonesPage, AboutPage } from "../pages";
import { ProductDetailPages } from "../pages/ProductDetailPage"; 
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ProfilePage } from "../pages/ProfilePage";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { ProtectedRoute } from "./ProtectedRoute";

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
                path: "celulares/:id",
                element: <ProductDetailPages /> 
            },
            {
                path: "nosotros",
                element: <AboutPage />
            },
            {
                path: "login",
                element: <LoginPage />
            },
            {
                path: "register",
                element: <RegisterPage />
            },
            {
                path: "perfil",
                element: <ProfilePage />
            }
        ]
    },
    {
        path: "/admin",
        element: <ProtectedRoute allowedRoles={['ROLE_ADMIN']} />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        element: <AdminDashboardPage />
                    }
                ]
            }
        ]
    }
]);

