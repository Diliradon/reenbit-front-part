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

// Interface for individual messages in a conversation
export interface ConversationMessage {
  messageId: string;
  sender: {
    userId: string;
    firstName: string;
    email: string;
  };
  recipient: {
    userId: string;
    firstName: string;
    email: string;
  };
  content: string;
  messageType: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

// Interface for conversation messages response
export interface ConversationMessagesResponse {
  message: string;
  data: ConversationMessage[];
  pagination: {
    page: number;
    limit: number;
    count: number;
  };
}

export const getConversations = () => {
  console.log('📞 Making conversations request...');
  return client.get<ConversationsResponse>(`/messages/conversations`).catch(error => {
    console.error('❌ Conversations request failed:', error);
    throw error;
  });
};

export const getConversation = (userId: string) => {
  console.log('📞 Making conversation messages request for user:', userId);
  return client.get<ConversationMessagesResponse>(`/messages/conversation/${userId}`).catch(error => {
    console.error('❌ Conversation messages request failed:', error);
    throw error;
  });
};
