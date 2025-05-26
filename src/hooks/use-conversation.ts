import { useQuery } from "react-query";

import { getConversation } from "@/api/message.api";

export const useGetConversation = (userId: string) => {
  return useQuery({
    queryKey: ['conversation', userId],
    queryFn: () => getConversation(userId),
  });
};