import { signup } from "@/api/auth.api";
import { useMutation } from "react-query";

export const useSignup = () => {
  return useMutation(signup);
};
