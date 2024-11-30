import { Outlet } from "react-router-dom";

import { Header, Footer } from "./components";

export const App = () => {
  return (
    <main>
      <Header />
      <Outlet />
      <Footer />
    </main>
  );
};
