import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/shared/Navbar";
import { Footer } from "../components/shared/Footer";
import { Banner } from "../components/home/Banner";
import { Newsletter } from "../components/home/Newsletter";

export const RootLayouts = () => {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {pathname === "/" && <Banner />}

      <main className="container mx-auto my-8 flex-1">
        <Outlet />
      </main>

      {pathname === "/" && <Newsletter />}

      <Footer />
    </div>
  );
};
