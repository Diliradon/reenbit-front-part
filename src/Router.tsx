import { Route, Routes, BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import { App } from "./App";
import { ROUTES } from "./config-global";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ChatsPage, HomePage, Register, Login, ChatAIPage } from "./pages";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const AppRoutes = () => {

  return (
    <Routes>
      <Route element={<App />}>
        {/* Public routes - only accessible when not authenticated */}
        <Route 
          path={ROUTES.AUTH.LOGIN} 
          element={<Login />} 
        />
        <Route 
          path={ROUTES.AUTH.REGISTER} 
          element={<Register />} 
        />
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
        <Route 
          path={ROUTES.CHAT_AI} 
          element={
            <ProtectedRoute>
              <ChatAIPage />
            </ProtectedRoute>
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
