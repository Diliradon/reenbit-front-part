import { Link, NavLink } from "react-router-dom";

import { ROUTES } from "../config-global";
import { cn } from "../lib/utils";

export const Header = () => {
  return (
    <nav className="bg-white border-gray-200 dark:bg-blue-200 fixed top-0 left-0 right-0 z-20">
      <div className="flex flex-wrap items-center justify-between max-w-screen-xl mx-auto p-4">
        <Link
          to="https://reenbit.com"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="/public/reenbit-favicon.jpg"
            className="h-10 rounded-lg"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            REENBIT
          </span>
        </Link>
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

        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
          <ul className="flex flex-col mt-4 font-medium md:flex-row md:mt-0 md:space-x-8 rtl:space-x-reverse">
            <li>
              <NavLink
                to={ROUTES.HOME}
                className={({ isActive }) =>
                  cn(
                    isActive && "text-blue-700",
                    "block py-2 px-3 border-gray-100"
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
                    "block py-2 px-3 border-gray-100 "
                  )
                }
              >
                CHATS
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
