import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import { App } from "./App";
import { ROUTES } from "./config-global";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ChatsPage, HomePage, Register, Login } from "./pages";
import { Activate } from "./pages/auth/Activate";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route element={<App />}>
        {/* Public routes - only accessible when not authenticated */}
        <Route 
          path={ROUTES.AUTH.LOGIN} 
          element={isAuthenticated ? <Navigate to={ROUTES.HOME} replace /> : <Login />} 
        />
        <Route 
          path={ROUTES.AUTH.REGISTER} 
          element={isAuthenticated ? <Navigate to={ROUTES.HOME} replace /> : <Register />} 
        />
        <Route 
          path={ROUTES.AUTH.ACTIVATE} 
          element={isAuthenticated ? <Navigate to={ROUTES.HOME} replace /> : <Activate />} 
        />

        {/* Protected routes - only accessible when authenticated */}
        <Route 
          path={ROUTES.HOME} 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path={ROUTES.CHATS} 
          element={
            <ProtectedRoute>
              <ChatsPage />
            </ProtectedRoute>
          } 
        />

        {/* Redirect unauthenticated users to login */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Navigate to={ROUTES.HOME} replace /> : 
              <Navigate to={ROUTES.AUTH.LOGIN} replace />
          } 
        />

        {/* Not found page */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export const Router = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
