import { useEffect, useState, useCallback } from 'react';
import { socketService, Message, TypingEvent, UserStatusEvent } from '@/services/socketService';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/api/user.api';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isConnected) {
      // Connect to socket when user is authenticated
      socketService.connect()
        .then(() => {
          setIsConnected(true);
          // Request online users after connecting
          socketService.getOnlineUsers();
        })
        .catch((error) => {
          console.error('Failed to connect to socket:', error);
        });

      // Set up online users handler
      socketService.onOnlineUsers = (userIds: string[]) => {
        setOnlineUsers(userIds);
      };

      // Set up user status handlers
      socketService.onUserOnline = (data: UserStatusEvent) => {
        setOnlineUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
      };

      socketService.onUserOffline = (data: UserStatusEvent) => {
        setOnlineUsers(prev => prev.filter(id => id !== data.userId));
      };

      // Set up typing handlers
      socketService.onUserTyping = (data: TypingEvent) => {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          if (data.isTyping) {
            newSet.add(data.userId);
          } else {
            newSet.delete(data.userId);
          }
          return newSet;
        });
      };
    }

    // Cleanup on unmount or when user logs out
    return () => {
      if (!isAuthenticated && isConnected) {
        socketService.disconnect();
        setIsConnected(false);
        setOnlineUsers([]);
        setTypingUsers(new Set());
      }
    };
  }, [isAuthenticated, isConnected]);

  // Send message function
  const sendMessage = useCallback((recipientId: string, content: string, messageType: 'text' | 'image' | 'file' = 'text') => {
    if (!isConnected) {
      console.error('Socket not connected');
      return;
    }
    socketService.sendMessage(recipientId, content, messageType);
  }, [isConnected]);

  // Join conversation function
  const joinConversation = useCallback((otherUserId: string) => {
    if (!isConnected) {
      console.error('Socket not connected');
      return;
    }
    socketService.joinConversation(otherUserId);
  }, [isConnected]);

  // Leave conversation function
  const leaveConversation = useCallback((otherUserId: string) => {
    if (!isConnected) {
      console.error('Socket not connected');
      return;
    }
    socketService.leaveConversation(otherUserId);
  }, [isConnected]);

  // Typing functions
  const startTyping = useCallback((otherUserId: string) => {
    if (!isConnected) return;
    socketService.startTyping(otherUserId);
  }, [isConnected]);

  const stopTyping = useCallback((otherUserId: string) => {
    if (!isConnected) return;
    socketService.stopTyping(otherUserId);
  }, [isConnected]);

  // Mark messages as read
  const markMessagesRead = useCallback((otherUserId: string) => {
    if (!isConnected) return;
    socketService.markMessagesRead(otherUserId);
  }, [isConnected]);

  // Set message handlers
  const setMessageHandlers = useCallback((handlers: {
    onNewMessage?: (message: Message) => void;
    onMessageSent?: (data: { messageId: string }) => void;
    onMessageError?: (error: { error: string }) => void;
    onMessageNotification?: (data: { message: Message; conversationWith: User }) => void;
    onMessagesRead?: (data: { readBy: string; userInfo: User }) => void;
  }) => {
    if (handlers.onNewMessage) socketService.onNewMessage = handlers.onNewMessage;
    if (handlers.onMessageSent) socketService.onMessageSent = handlers.onMessageSent;
    if (handlers.onMessageError) socketService.onMessageError = handlers.onMessageError;
    if (handlers.onMessageNotification) socketService.onMessageNotification = handlers.onMessageNotification;
    if (handlers.onMessagesRead) socketService.onMessagesRead = handlers.onMessagesRead;
  }, []);

  return {
    isConnected,
    onlineUsers,
    typingUsers,
    sendMessage,
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping,
    markMessagesRead,
    setMessageHandlers
  };
}; 