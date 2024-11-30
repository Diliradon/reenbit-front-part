import { Avatar } from "../components/Avatar";
import { Message } from "../components/Message";
import avatar from "../images/avatar-1.png";

const users = [
  { name: "Alice", message: "Hoorayy!!", avatar: avatar },
  {
    name: "Martin",
    message: "That pizza!",
    avatar: avatar,
  },
  {
    name: "Charlie",
    message: "Do you like pizza?",
    avatar: avatar,
  },
  {
    name: "David",
    message: "I just finished!",
    avatar: avatar,
  },
];

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
  return (
    <section className="chat-section border border-gray-200 rounded-lg">
      <div className="w-1/4 bg-white border-r h-full">
        <h2 className="text-xl font-bold p-4 border-b">Chat Web</h2>
        <div className="flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer">
          <input
            type="search"
            placeholder="Search for a user..."
            className="flex-1 p-2 border rounded-lg"
          />
        </div>
        <ul>
          {users.map((user, index) => (
            <li
              key={index}
              className="flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer"
            >
              <Avatar srcImg={user.avatar} altImg={user.name} />
              <div className="ml-4">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500 truncate">{user.message}</p>
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
          />
          <button className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Send
          </button>
        </div>
      </div>
    </section>
  );
};
