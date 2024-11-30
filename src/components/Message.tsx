import { cn } from "../lib/utils";

interface Props {
  type: string;
  name: string;
  message: string;
}

export const Message: React.FC<Props> = ({ type, name, message }) => {
  return (
    <div
      className={cn(
        "max-w-md",
        type === "autor" && "text-right text-blue-900 ml-auto"
      )}
    >
      <p className="text-sm text-gray-500">{name}</p>
      <p
        className={cn(
          "p-2 rounded-lg inline-block bg-blue-100",
          type === "autor" && "bg-pink-100 ml-auto"
        )}
      >
        {message}
      </p>
    </div>
  );
};
