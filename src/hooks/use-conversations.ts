import { useQuery } from "react-query";
import { getConversations } from "@/api/message.api";

export const useGetConversations = (searchQuery?: string) => {
  return useQuery({
    queryKey: ["conversations", searchQuery],
    queryFn: () => getConversations(searchQuery),
    keepPreviousData: true, // Keep previous data while loading new search results
  });
};