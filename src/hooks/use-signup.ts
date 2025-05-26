import { register, login } from "@/api/auth.api";
import { useMutation } from "react-query";

export const useRegister = () => {
  return useMutation(register);
};

export const useLogin = () => {
  return useMutation(login);
};
