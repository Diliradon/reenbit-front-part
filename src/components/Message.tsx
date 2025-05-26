import { cn } from "../lib/utils";
import { useState } from "react";

interface Props {
  type: "autor" | "user";
  name: string;
  message: string;
  messageId?: string;
  onDelete?: (messageId: string) => void;
}

export const Message: React.FC<Props> = ({
  type,
  name,
  message,
  messageId,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = () => {
    if (messageId && onDelete) {
      onDelete(messageId);
    }
  };

  return (
    <div
      className={cn(
        "max-w-md relative group w-fit",
        type === "autor" && "text-right text-gray-900 ml-auto"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p className="text-sm text-gray-500">{name}</p>
      <div className="relative">
        <p
          className={cn(
            "p-2 rounded-lg inline-block bg-blue-100",
            type === "autor" && "bg-green-100 ml-auto"
          )}
        >
          {message}
        </p>

        {/* Delete button - only show for user's own messages */}
        {messageId && onDelete && isHovered && (
          <button
            onClick={handleDelete}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition-all duration-200 shadow-md"
            title="Delete message"
          >
            <svg
              fill="#000000"
              height="8px"
              width="8px"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 460.775 460.775"
              xmlSpace="preserve"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path>{" "}
              </g>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
