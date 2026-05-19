import { createBrowserRouter } from "react-router-dom";
import { RootLayouts } from "../layouts/RootLayouts";
import { HomePage,CellPhonesPage,AboutPage } from "../pages";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayouts />,
        children:[
            {
                index: true, 
                element: <HomePage/>,
            },
            {
                path: "celulares",
                element: <CellPhonesPage/>
            },
            {
                path: "nosotros",
                element: <AboutPage/>
            },
        ]
    }
  ])

