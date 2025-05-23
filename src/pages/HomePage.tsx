import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <main className="h-screen p-0 gap-3">
      <h1>Welcome to the Reenbit</h1>

      <p>Reenbit is a platform for creating and sharing AI-powered chatbots.</p>

      <Link
        to="https://reenbit.com/"
        className="bg-[#409998] text-white px-4 py-2 rounded-md"
      >
        Reenbit
      </Link>
    </main>
  );
};
