import { client } from "@/lib/axiosClient";

export const signin = (data: { email: string; password: string }) => {
  return client.post("/auth/signin", data);
};

export const signup = (data: {
  firstName: string;
  email: string;
  password: string;
}) => {
  return client.post("/auth/signup", data);
};
