import { Message } from "../components/Message";
import { ConversationItem } from "../components/ConversationItem";
import { useState, useEffect, useRef } from "react";
import { User } from "@/api/user.api";
import { useSocket } from "@/hooks/useSocket";
import { Message as SocketMessage } from "@/services/socketService";
import {
  getConversation,
  ConversationMessage,
  deleteMessage,
} from "@/api/message.api";
import { useUsersExceptMe } from "@/hooks/use-users-except-me";
import { useMe } from "@/hooks/use-me";
import { useUserUnreadCounts } from "@/hooks/use-user-unread-counts";
import { useGetConversations } from "@/hooks/use-conversations";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export const ChatsPage = () => {
  const { data: users } = useUsersExceptMe();
  const { data: me } = useMe();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<SocketMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get conversations with search
  const { data: conversations } = useGetConversations(debouncedSearchQuery);

  // Debounce search query
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Use the unread counts hook
  const { getUnreadCount, incrementUnreadCount, resetUnreadCount } =
    useUserUnreadCounts(users?.users || []);

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
      setMessages((prev) => prev.filter((msg) => msg.messageId !== messageId));

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className="chat-section border border-gray-200 rounded-lg max-w-6xl h-5/6 mx-auto">
      <div className="w-1/4 bg-white border-r h-full flex flex-col overflow-visible">
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

        <div className="flex flex-col gap-4 items-center p-4 border-b hover:bg-gray-50 cursor-pointer">
          <Input
            type="search"
            placeholder={
              searchQuery
                ? "Searching conversations..."
                : "Search conversations by name..."
            }
            className="flex-1 p-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="relative w-full" ref={dropdownRef}>
            <Button
              className="w-full flex items-center justify-between"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Start new conversation
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isDropdownOpen && "rotate-180"
                )}
              />
            </Button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 z-[9999] bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto mt-1">
                {users?.users.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <p className="text-sm">No users available</p>
                  </div>
                ) : (
                  <ul>
                    {users?.users.map((user) => {
                      const unreadCount = getUnreadCount(user.userId);
                      const isSelected = selectedUser?.userId === user.userId;

                      return (
                        <ConversationItem
                          key={user.userId}
                          user={{
                            _id: user.userId,
                            firstName: user.firstName,
                            email: user.email,
                          }}
                          unreadCount={unreadCount}
                          isSelected={isSelected}
                          isOnline={isUserOnline(user.userId)}
                          showAvatar={true}
                          onClick={() => {
                            handleSelectUser({
                              userId: user.userId,
                              firstName: user.firstName,
                              email: user.email,
                              activationToken: null,
                              createdAt: "",
                            } as User);
                            setIsDropdownOpen(false);
                          }}
                        />
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        <ul className="overflow-y-auto flex-1">
          {conversations?.data.map((conversation) => {
            const unreadCount = getUnreadCount(conversation.user._id);

            return (
              <ConversationItem
                key={conversation.user._id}
                user={conversation.user}
                lastMessage={conversation.lastMessage}
                unreadCount={unreadCount}
                isSelected={selectedUser?.userId === conversation.user._id}
                isOnline={isUserOnline(conversation.user._id)}
                onClick={() =>
                  handleSelectUser({
                    userId: conversation.user._id,
                    firstName: conversation.user.firstName,
                    email: conversation.user.email,
                    activationToken: null,
                    createdAt: "",
                  } as User)
                }
              />
            );
          })}

          {conversations?.data.length === 0 && (
            <li className="flex items-center justify-center p-8 text-gray-500">
              <div className="text-center">
                <p className="text-sm">
                  {searchQuery
                    ? `No conversations found for "${searchQuery}"`
                    : "No conversations yet"}
                </p>
                {searchQuery && (
                  <p className="text-xs mt-1">Try a different search term</p>
                )}
              </div>
            </li>
          )}
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
                  type={msg.sender.email !== me?.user.email ? "user" : "autor"}
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
