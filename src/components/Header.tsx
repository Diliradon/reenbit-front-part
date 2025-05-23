import { Link, NavLink, useNavigate } from "react-router-dom";

import { ROUTES } from "../config-global";
import { cn } from "../lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.AUTH.LOGIN);
  };

  return (
    <header className="bg-white border-gray-200 dark:bg-blue-200 rounded-lg shadow m-4 mb-0 fixed top-0 left-0 right-0 z-20">
      <nav className="flex justify-between items-center p-2 md:p-4 lg:p-6">
        <Link
          to="https://reenbit.com"
          className="flex items-center space-x-1"
        >
          <img
            src="/public/reenbit-favicon.jpg"
            className="hidden md:flex h-10 rounded-lg"
            alt="Flowbite Logo"
          />
          <span className="self-center hidden md:flex text-2xl font-semibold whitespace-nowrap dark:text-white">
            REENBIT
          </span>
        </Link>

        <div className="items-center justify-between w-full flex md:w-auto">
          <ul className="flex font-medium flex-row md:mt-0 md:space-x-8 flex-1">
            <li>
              <NavLink
                to={ROUTES.HOME}
                className={({ isActive }) =>
                  cn(
                    isActive && "text-[#409998]",
                    "block px-1.5 py-2 md:py-2 md:px-3 border-gray-100"
                  )
                }
              >
                HOME
              </NavLink>
            </li>
            <li>
              <NavLink
                to={ROUTES.CHATS}
                className={({ isActive }) =>
                  cn(
                    isActive && "text-[#409998] ",
                    "block px-1.5 py-2 md:py-2 md:px-3 border-gray-100 "
                  )
                }
              >
                CHATS
              </NavLink>
            </li>
            <li className="ml-auto">
              <button
                onClick={handleLogout}
                className="px-1.5 py-2 md:py-2 md:px-3 border-gray-100 hover:text-[#409998] text-red-600"
              >
                LOGOUT
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};
