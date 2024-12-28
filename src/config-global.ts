export const ROUTES = {
  HOME: "/",
  AUTH: {
    ROOT: "/auth",
    SIGNIN: "/signin",
    SIGNUP: "/signup",
    FORGOT_PASSWORD: "/forgot-password",
    ACTIVATE: "/auth/activate/:token",
  },
  CHATS: "/chats",
};

export const API_URL = import.meta.env.VITE_BASE_URL;
