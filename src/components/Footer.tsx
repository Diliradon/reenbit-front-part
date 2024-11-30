import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-white rounded-lg shadow m-4 mt-0 dark:bg-gray-800 fixed bottom-0 left-0 right-0">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024{" "}
          <a
            href="https://reenbit.com/success-stories"
            className="hover:underline"
          >
            Reenbit™{" "}
          </a>
          Vladislav Zakharov | Developer
        </span>

        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <Link
              to="https://www.linkedin.com/in/vladyslav-zakharov-869214260/"
              className="hover:underline me-4 md:me-6"
              target="_blank"
            >
              Linkedin
            </Link>
          </li>
          <li>
            <Link
              to="https://github.com/Diliradon"
              className="hover:underline me-4 md:me-6"
            >
              Github
            </Link>
          </li>
          <li>
            <a
              href="mailto:vladyslav.zakharov.dev@gmail.com"
              className="hover:underline"
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};
