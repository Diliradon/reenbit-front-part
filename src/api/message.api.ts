import { client } from "@/lib/axiosClient";

export interface Conversation {
  conversationWith: {
    userId: string;
    firstName: string;
    email: string;
  };
  lastMessage: {
    _id: string;
    content: string;
    createdAt: string;
    isRead: boolean;
    sender: string;
    recipient: string;
  };
  unreadCount: number;
}

export interface ConversationsResponse {
  message: string;
  data: Conversation[];
  count: number;
}

export const getConversations = () => {
  console.log('📞 Making conversations request...');
  return client.get<ConversationsResponse>(`/messages/conversations`).catch(error => {
    console.error('❌ Conversations request failed:', error);
    throw error;
  });
};
