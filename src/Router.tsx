import { Route, Routes, BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import { App } from "./App";
import { ROUTES } from "./config-global";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ChatsPage, HomePage, Signin, Signup } from "./pages";
import { Activate } from "./pages/auth/Activate";

const queryClient = new QueryClient()

export const Router = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            <Route path={ROUTES.AUTH.SIGNIN} element={<Signin />} />
            <Route path={ROUTES.AUTH.SIGNUP} element={<Signup />} />
            <Route path={ROUTES.AUTH.ACTIVATE} element={<Activate />} />

            <Route index element={<HomePage />} />
            <Route path={ROUTES.CHATS} element={<ChatsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
