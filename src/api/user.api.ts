import { client } from "@/lib/axiosClient";

export interface User {
  userId: string;
  firstName: string;
  email: string;
  activationToken: string | null;
  createdAt: string;
}

export interface UserResponse {
  message: string;
  count: number;
  users: User[];
}

export interface MeResponse {
  message: string;
  user: User;
}

export const getUsers = async (): Promise<UserResponse> => {
  return client.get<UserResponse>("/users");
};

export const getUserById = async (userId: string): Promise<User> => {
  return client.get<User>(`/users/${userId}`);
};

export const getUsersExceptMe = async (): Promise<UserResponse> => {
  return client.get<UserResponse>("/users/others");
};

export const getMe = async (): Promise<MeResponse> => {
  return client.get<MeResponse>("/users/me");
};