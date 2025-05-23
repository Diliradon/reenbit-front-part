export const ROUTES = {
  HOME: "/home",
  AUTH: {
    ROOT: "/auth",
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    ACTIVATE: "/auth/activate/:token",
  },
  CHATS: "/chats",
};

export const API_URL = import.meta.env.VITE_BASE_URL;
