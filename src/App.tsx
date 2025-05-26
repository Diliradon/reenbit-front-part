import { Outlet } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { Header, Footer } from "./components";

export const App = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated && <Header />}
      <main className={isAuthenticated ? "pt-24 pb-20 min-h-screen" : "min-h-screen"}>
        <Outlet />
      </main>
      {isAuthenticated && <Footer />}
    </>
  );
};
