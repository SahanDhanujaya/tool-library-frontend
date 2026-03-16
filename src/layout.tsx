import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

const Layout = () => {
  const location = useLocation();
  return (
    <div>
      {location.pathname === "/" && (
        <header>
          <Navbar />
        </header>
      )}

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
