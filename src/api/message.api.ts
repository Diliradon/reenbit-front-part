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
    _id: string;
    firstName: string;
    email: string;
  };
  recipient: {
    _id: string;
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

// Delete a message
export const deleteMessage = (messageId: string) => {
  console.log('📞 Making delete message request for message:', messageId);
  return client.delete(`/messages/${messageId}`).catch(error => {
    console.error('❌ Delete message request failed:', error);
    throw error;
  });
};

// Get unread messages count
export interface UnreadCountResponse {
  message: string;
  unreadCount: number;
}

export const getUnreadCount = () => {
  console.log('📞 Making unread count request...');
  return client.get<UnreadCountResponse>(`/messages/unread-count`).catch(error => {
    console.error('❌ Unread count request failed:', error);
    throw error;
  });
};

// Get unread count for specific user conversation
export interface UserUnreadCountResponse {
  message: string;
  unreadCount: number;
}

export const getUserUnreadCount = (userId: string) => {
  console.log('📞 Making user unread count request for user:', userId);
  return client.get<UserUnreadCountResponse>(`/messages/conversation/${userId}/unread-count`).catch(error => {
    console.error('❌ User unread count request failed:', error);
    throw error;
  });
};
