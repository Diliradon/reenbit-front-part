import { useQuery } from "react-query";
import { getUsersExceptMe } from "@/api/user.api";

export const useUsersExceptMe = () => {
  return useQuery({
    queryKey: ["users-except-me"],
    queryFn: getUsersExceptMe,
  });
};