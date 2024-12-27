import { Route, Routes, BrowserRouter } from "react-router-dom";

import { App } from "./App";
import { ROUTES } from "./config-global";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ChatsPage, HomePage, Signin, Signup } from "./pages";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path={ROUTES.AUTH.SIGNIN} element={<Signin />} />
          <Route path={ROUTES.AUTH.SIGNUP} element={<Signup />} />

          <Route index element={<HomePage />} />
          <Route path={ROUTES.CHATS} element={<ChatsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
