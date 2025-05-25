import { Message } from "../components/Message";
import { useState, useEffect, useRef } from "react";
import { User } from "@/api/user.api";
import { useSocket } from "@/hooks/useSocket";
import { Message as SocketMessage } from "@/services/socketService";
import { getConversation, ConversationMessage, deleteMessage } from "@/api/message.api";
import { useUsersExceptMe } from "@/hooks/use-users-except-me";
import { useMe } from "@/hooks/use-me";
import { useUserUnreadCounts } from "@/hooks/use-user-unread-counts";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

export const ChatsPage = () => {
  const { data: users } = useUsersExceptMe();
  const { data: me } = useMe();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<SocketMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use the unread counts hook
  const {
    getUnreadCount,
    incrementUnreadCount,
    resetUnreadCount,
  } = useUserUnreadCounts(users?.users || []);

  const {
    isConnected,
    onlineUsers,
    typingUsers,
    sendMessage,
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping,
    markMessagesRead,
    setMessageHandlers,
  } = useSocket();

  // Handle message deletion
  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      
      // Remove the message from local state
      setMessages(prev => prev.filter(msg => msg.messageId !== messageId));
      
      console.log("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message. Please try again.");
    }
  };

  // Set up message handlers
  useEffect(() => {
    setMessageHandlers({
      onNewMessage: (newMessage: SocketMessage) => {
        setMessages((prev) => [...prev, newMessage]);

        // Increment unread count if message is from another user and not in current conversation
        if (
          newMessage.sender._id !== me?.user.userId &&
          (!selectedUser || newMessage.sender._id !== selectedUser.userId)
        ) {
          incrementUnreadCount(newMessage.sender._id);
        }

        // Auto-scroll to bottom
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      },
      onMessageSent: (data) => {
        console.log("Message sent with ID:", data.messageId);

      },
      onMessageError: (error) => {
        alert("Failed to send message: " + error.error);
      },
      onMessageNotification: (data) => {
        // Show notification for messages outside current conversation
        if (
          selectedUser &&
          data.conversationWith.userId !== selectedUser.userId
        ) {
          // Could show a toast notification here
          console.log("New message from:", data.conversationWith.firstName);
          incrementUnreadCount(data.conversationWith.userId);
        }
      },
    });
  }, [setMessageHandlers, selectedUser, me?.user.userId, incrementUnreadCount]);

  // Handle user selection and conversation joining
  const handleSelectUser = (user: User) => {
    // Leave previous conversation if any
    if (selectedUser) {
      leaveConversation(selectedUser.userId);
    }

    setSelectedUser(user);
    setMessages([]); // Clear current messages

    // Join new conversation
    joinConversation(user.userId);

    // Mark messages as read when opening conversation and reset unread count
    markMessagesRead(user.userId);
    resetUnreadCount(user.userId);

    // This would typically load previous messages from the backend
    loadConversationHistory(user.userId);
  };

  // Load conversation history (placeholder - you'll need to implement the API call)
  const loadConversationHistory = async (userId: string) => {
    try {
      console.log("Loading conversation history for user:", userId);
      const response = await getConversation(userId);

      // Convert API messages to SocketMessage format for consistency
      const apiMessages: SocketMessage[] = response.data.map(
        (msg: ConversationMessage) => ({
          messageId: msg.messageId,
          sender: msg.sender,
          recipient: msg.recipient,
          content: msg.content,
          messageType: msg.messageType as "text" | "image" | "file",
          isRead: msg.isRead,
          readAt: msg.readAt,
          createdAt: msg.createdAt,
        })
      );

      setMessages(apiMessages);
      console.log(
        "Loaded",
        apiMessages.length,
        "messages from conversation history"
      );
    } catch (error) {
      console.error("Error loading conversation history:", error);
      // Don't show error to user for now, just log it
    }
  };

  const handleChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Handle typing indicators
    if (selectedUser && value.trim()) {
      if (!isTyping) {
        setIsTyping(true);
        startTyping(selectedUser.userId);
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        if (selectedUser) {
          stopTyping(selectedUser.userId);
        }
      }, 3000);
    } else if (isTyping) {
      setIsTyping(false);
      if (selectedUser) {
        stopTyping(selectedUser.userId);
      }
    }
  };

  const handleSendMessage = () => {
    if (!selectedUser || !message.trim() || !isConnected) {
      console.log("Cannot send message:", {
        selectedUser,
        message: message.trim(),
        isConnected,
      });
      return;
    }

    // Send message via socket
    sendMessage(selectedUser.userId, message.trim());

    // Clear input and stop typing indicator
    setMessage("");
    if (isTyping) {
      setIsTyping(false);
      stopTyping(selectedUser.userId);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Check if a user is online
  const isUserOnline = (userId: string) => {
    return onlineUsers.includes(userId);
  };

  // Check if user is typing in current conversation
  const isUserTypingInConversation = () => {
    if (!selectedUser) return false;
    return typingUsers.has(selectedUser.userId);
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (selectedUser) {
        leaveConversation(selectedUser.userId);
      }
    };
  }, []);

  return (
    <section className="chat-section border border-gray-200 rounded-lg max-w-6xl h-5/6 mx-auto">
      <div className="w-1/4 bg-white border-r h-full overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">{me?.user.firstName}</h2>
          <div className="text-sm text-gray-500 mt-1">
            {isConnected ? (
              <span className="text-green-600">🟢 Connected</span>
            ) : (
              <span className="text-red-600">🔴 Disconnected</span>
            )}
          </div>
        </div>

        <div className="flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer overflow-x-hidden">
          <Input
            type="search"
            placeholder="Search for a user..."
            className="flex-1 p-2 border rounded-lg"
          />
        </div>

        <ul className="overflow-y-auto h-full">
          {users?.users.map((user) => {
            const unreadCount = getUnreadCount(user.userId);
            
            return (
              <li
                key={user.userId}
                className={cn(
                  "flex items-center p-4 border-b hover:bg-green-50 cursor-pointer overflow-x-hidden",
                  selectedUser?.userId === user.userId &&
                    "bg-green-100 border-green-200"
                )}
                onClick={() => handleSelectUser(user)}
              >
                <div className="relative">
                  {isUserOnline(user.userId) && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{user.firstName}</p>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  {isUserOnline(user.userId) && (
                    <p className="text-xs text-green-600">Online</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col w-3/4 h-full flex-1">
        {selectedUser ? (
          <>
            {/* Chat header */}
            <div className="p-4 bg-white border-b">
              <div className="flex items-center">
                <div className="ml-3">
                  <h3 className="font-medium">{selectedUser.firstName}</h3>
                  <p className="text-sm text-gray-500">
                    {isUserOnline(selectedUser.userId) ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex flex-col gap-4 p-4 bg-white overflow-y-scroll h-full flex-1">
              {messages.map((msg) => (
                <Message
                  key={msg.messageId}
                  type={
                    msg.sender.email !== me?.user.email ? "user" : "autor"
                  }
                  name={msg.sender.firstName}
                  message={msg.content}
                  messageId={msg.messageId}
                  onDelete={handleDeleteMessage}
                />
              ))}

              {/* Typing indicator */}
              {isUserTypingInConversation() && (
                <div className="flex items-center space-x-2 text-gray-500 text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span>{selectedUser.firstName} is typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="p-4 bg-gray-100 border-t flex items-center">
              <Input
                type="text"
                placeholder={
                  isConnected ? "Type a message..." : "Connecting..."
                }
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring"
                value={message}
                onChange={handleChangeMessage}
                onKeyPress={handleKeyPress}
                disabled={!isConnected}
              />
              <Button
                className={`ml-4 px-4 py-2 rounded-lg text-white ${
                  isConnected && message.trim()
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                onClick={handleSendMessage}
                disabled={!isConnected || !message.trim()}
              >
                Send
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Welcome to Chat Web</h3>
              <p>Select a user to start chatting</p>
              {!isConnected && (
                <p className="text-red-500 mt-2">
                  Connecting to chat server...
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
