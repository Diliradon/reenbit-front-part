import { io, Socket } from 'socket.io-client';
import { getSessionToken } from '@/lib/utils';
import { SOCKET_URL } from '@/config-global';
import { User } from '@/api/user.api';

export interface Message {
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
  messageType: 'text' | 'image' | 'file';
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface TypingEvent {
  userId: string;
  userInfo: {
    userId: string;
    firstName: string;
    email: string;
  };
  isTyping: boolean;
}

export interface UserStatusEvent {
  userId: string;
  userInfo: {
    userId: string;
    firstName: string;
    email: string;
  };
}

class SocketService {
  private socket: Socket | null = null;
  private serverUrl: string = SOCKET_URL;

  // Event handlers that can be set by components
  public onNewMessage: ((message: Message) => void) | null = null;
  public onMessageSent: ((data: { messageId: string }) => void) | null = null;
  public onMessageError: ((error: { error: string }) => void) | null = null;
  public onUserTyping: ((data: TypingEvent) => void) | null = null;
  public onUserOnline: ((data: UserStatusEvent) => void) | null = null;
  public onUserOffline: ((data: UserStatusEvent) => void) | null = null;
  public onOnlineUsers: ((userIds: string[]) => void) | null = null;
  public onMessagesRead: ((data: { readBy: string; userInfo: User }) => void) | null = null;
  public onMessageNotification: ((data: { message: Message; conversationWith: User }) => void) | null = null;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = getSessionToken();
      
      if (!token) {
        reject(new Error('No authentication token found'));
        return;
      }

      this.socket = io(this.serverUrl, {
        auth: {
          token: token
        }
      });

      this.setupEventListeners();

      this.socket.on('connect', () => {
        console.log('✅ Connected to chat server');
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error.message);
        reject(error);
      });
    });
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from chat server');
    });

    // Message events
    this.socket.on('new_message', (message: Message) => {
      console.log('📨 New message received:', message);
      this.onNewMessage?.(message);
    });

    this.socket.on('message_sent', (data: { messageId: string }) => {
      console.log('✅ Message sent successfully:', data.messageId);
      this.onMessageSent?.(data);
    });

    this.socket.on('message_error', (error: { error: string }) => {
      console.error('❌ Message error:', error.error);
      this.onMessageError?.(error);
    });

    this.socket.on('message_notification', (data: { message: Message; conversationWith: User }) => {
      console.log('🔔 Message notification:', data);
      this.onMessageNotification?.(data);
    });

    // Typing events
    this.socket.on('user_typing', (data: TypingEvent) => {
      console.log('⌨️ Typing indicator:', data);
      this.onUserTyping?.(data);
    });

    // Read receipts
    this.socket.on('messages_read', (data: { readBy: string; userInfo: User }) => {
      console.log('👁️ Messages read by:', data.userInfo.firstName);
      this.onMessagesRead?.(data);
    });

    // Online status events
    this.socket.on('user_online', (data: UserStatusEvent) => {
      console.log('🟢 User came online:', data.userInfo.firstName);
      this.onUserOnline?.(data);
    });

    this.socket.on('user_offline', (data: UserStatusEvent) => {
      console.log('🔴 User went offline:', data.userInfo.firstName);
      this.onUserOffline?.(data);
    });

    this.socket.on('online_users', (userIds: string[]) => {
      console.log('👥 Online users:', userIds);
      this.onOnlineUsers?.(userIds);
    });
  }

  // Join a conversation room
  joinConversation(otherUserId: string) {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }
    
    console.log('🚪 Joining conversation with user:', otherUserId);
    this.socket.emit('join_conversation', { otherUserId });
  }

  // Leave a conversation room
  leaveConversation(otherUserId: string) {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }
    
    console.log('🚪 Leaving conversation with user:', otherUserId);
    this.socket.emit('leave_conversation', { otherUserId });
  }

  // Send a message
  sendMessage(recipientId: string, content: string, messageType: 'text' | 'image' | 'file' = 'text') {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }

    console.log('📤 Sending message to:', recipientId, 'Content:', content);
    this.socket.emit('send_message', {
      recipientId,
      content,
      messageType
    });
  }

  // Typing indicators
  startTyping(otherUserId: string) {
    if (!this.socket) return;
    
    this.socket.emit('typing_start', { otherUserId });
  }

  stopTyping(otherUserId: string) {
    if (!this.socket) return;
    
    this.socket.emit('typing_stop', { otherUserId });
  }

  // Mark messages as read
  markMessagesRead(otherUserId: string) {
    if (!this.socket) return;
    
    this.socket.emit('mark_messages_read', { otherUserId });
  }

  // Get online users
  getOnlineUsers() {
    if (!this.socket) return;
    
    this.socket.emit('get_online_users');
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Check if connected
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

// Create and export a singleton instance
export const socketService = new SocketService(); 