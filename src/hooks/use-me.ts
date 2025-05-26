import { useQuery } from "react-query";
import { getMe } from "@/api/user.api";

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });
};