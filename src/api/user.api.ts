import { client } from "@/lib/axiosClient";

export const getUsers = async () => {
  return client.get("/users");
};