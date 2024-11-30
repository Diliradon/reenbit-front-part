import { Route, Routes, BrowserRouter } from 'react-router-dom'

import { App } from "./App";
import { ROUTES } from "./config-global";
import { NotFoundPage } from './pages/NotFoundPage';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<App />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
