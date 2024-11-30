import { Link, NavLink } from "react-router-dom";

import { ROUTES } from "../config-global";
import { cn } from "../lib/utils";

export const Header = () => {
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
          <ul className="flex font-medium flex-row md:mt-0 md:space-x-8">
            <li>
              <NavLink
                to={ROUTES.HOME}
                className={({ isActive }) =>
                  cn(
                    isActive && "text-blue-700",
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
                    isActive && "text-blue-700 ",
                    "block px-1.5 py-2 md:py-2 md:px-3 border-gray-100 "
                  )
                }
              >
                CHATS
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="flex items-center md:order-2 space-x-1 md:space-x-2 rtl:space-x-reverse">
          <NavLink
            to={ROUTES.SIGNIN}
            className={cn(
              "text-gray-800 bg-gray-700 dark:text-white hover:bg-gray-50 focus:ring-4 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 dark:hover:bg-gray-700"
            )}
          >
            SIGNIN
          </NavLink>
          <NavLink
            to={ROUTES.SIGNUP}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 "
          >
            SIGNUP
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
