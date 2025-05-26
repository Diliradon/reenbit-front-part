import { client } from "@/lib/axiosClient";

export interface AuthResponse {
  token: string;
  user: {
    userId: string;
    email: string;
    firstName: string;
  };
  message: string;
}

export const login = (data: { email: string; password: string }) => {
  return client.post<AuthResponse>("/auth/login", data);
};

export const register = (data: {
  firstName: string;
  email: string;
  password: string;
}) => {
  return client.post<AuthResponse>("/auth/register", data);
};
