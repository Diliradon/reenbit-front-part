export const ROUTES = {
  HOME: "/",
  AUTH: {
    ROOT: "/auth",
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    ACTIVATE: "/auth/activate/:token",
  },
  CHATS: "/chats",
  CHAT_AI: "/chat-ai",
};

export const API_URL = import.meta.env.VITE_BASE_URL;

export const SOCKET_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
