import { useUsers } from "@/hooks/use-users";
import { Avatar } from "../components/Avatar";
import { Message } from "../components/Message";
import avatar from "../images/avatar-1.png";
import { useState } from "react";
import { User } from "@/api/user.api";
import { useGetConversations } from "@/hooks/get-conversations";

const messages = [
  {
    id: 1,
    sender: "Alice",
    text: "Hey Bob, how's it going?",
    type: "autor",
  },
  {
    id: 2,
    sender: "You",
    text: "Hi Alice! I'm good, just finished a great book. How about you?",
    type: "user",
  },
  {
    id: 3,
    sender: "Alice",
    text: "That book sounds interesting! What's it about?",
    type: "autor",
  },
];

export const ChatsPage = () => {
  const { data: users } = useUsers();
  const { data: conversations } = useGetConversations();
  console.log(conversations);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");

  const handleChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    setMessage(value);
  };

  const handleAddMessage = () => {
    console.log("selectedUser", selectedUser);
    console.log("message", message);
    if (!selectedUser || !message) return;

    console.log(message);
  };

  return (
    <section className="chat-section border border-gray-200 rounded-lg max-w-6xl mx-auto">
      <div className="w-1/4 bg-white border-r h-full">
        <h2 className="text-xl font-bold p-4 border-b">Chat Web</h2>
        <div className="flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer">
          <input
            type="search"
            placeholder="Search for a user..."
            className="flex-1 p-2 border rounded-lg"
          />
        </div>
        <ul className="overflow-y-scroll h-full">
          {users?.users.map((user, index) => (
            <li
              key={index}
              className="flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer overflow-x-hidden"
              onClick={() => setSelectedUser(user)}
            >
              <Avatar srcImg={avatar} altImg={user.firstName} />
              <div className="ml-4">
                <p className="font-medium">{user.firstName}</p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col w-3/4 h-full flex-1">
        <div className="flex flex-col gap-4 p-4 bg-white border-b overflow-y-scroll h-full">
          {messages.map((message) => (
            <Message
              key={message.id}
              type={message.type}
              name={message.sender}
              message={message.text}
            />
          ))}
        </div>
        <div className="p-4 bg-gray-100 border-t flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring"
            value={message}
            onChange={handleChangeMessage}
          />
          <button
            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={handleAddMessage}
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
};
