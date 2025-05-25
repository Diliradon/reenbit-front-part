import { useQuery } from "react-query";
import { getConversations } from "@/api/message.api";

export const useGetConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });
};