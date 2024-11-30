import { Route, Routes, BrowserRouter } from "react-router-dom";

import { App } from "./App";
import { ROUTES } from "./config-global";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ChatsPage, HomePage, SigninPage, SignupPage } from "./pages";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path={ROUTES.SIGNIN} element={<SigninPage />} />
          <Route path={ROUTES.SIGNUP} element={<SignupPage />} />

          <Route index element={<HomePage />} />
          <Route path={ROUTES.CHATS} element={<ChatsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
