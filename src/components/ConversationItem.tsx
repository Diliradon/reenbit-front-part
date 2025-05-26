import { cn } from "@/lib/utils";
import { User } from "@/api/user.api";

interface ConversationItemProps {
  user: {
    _id: string;
    firstName: string;
    email: string;
  };
  lastMessage?: {
    content: string;
  } | null;
  unreadCount: number;
  isSelected: boolean;
  isOnline: boolean;
  onClick: () => void;
  showAvatar?: boolean;
}

export const ConversationItem = ({
  user,
  lastMessage,
  unreadCount,
  isSelected,
  isOnline,
  onClick,
  showAvatar = false,
}: ConversationItemProps) => {
  return (
    <li
      className={cn(
        "flex items-center p-4 border-b hover:bg-green-50 cursor-pointer overflow-x-hidden",
        isSelected && "bg-green-100 border-green-200"
      )}
      onClick={onClick}
    >
      <div className="relative">
        {showAvatar && (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {user.firstName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {isOnline && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>
      <div className={cn("flex-1", showAvatar ? "ml-3" : "ml-4")}>
        <div className="flex items-center justify-between">
          <p className="font-medium">{user.firstName}</p>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
              {unreadCount}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">
          {lastMessage?.content || "No messages yet"}
        </p>
        {showAvatar && (
          <p className="text-xs text-gray-500">{user.email}</p>
        )}
        {isOnline && <p className="text-xs text-green-600">Online</p>}
      </div>
    </li>
  );
}; 