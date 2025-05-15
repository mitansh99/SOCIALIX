import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const MobileNav = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(location.pathname.split("/")[1]);
    const {currentUser} = useAuth();

    if(!currentUser){
        return
    }
  const routes = {
    home: "/home",
    mobieSearch: "/mobieSearch",
    friends: "/friends",
  };

  const handleBtn = (value) => {
    if (active !== value) {
      setActive(value);
      navigate(routes[value]);
    }
  };
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 md:hidden z-10">
      {/* Home Button */}
      <button
        className="flex flex-col items-center justify-center"
        onClick={() => handleBtn("home")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 ${
            active === "home" ? "text-blue-500" : "text-black"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span
          className={`text-xs mt-1 ${
            active === "home" ? "text-blue-500" : "text-black"
          }`}
        >
          Home
        </span>
      </button>

      {/* Search Button */}
      <button
        className="flex flex-col items-center justify-center"
        onClick={() => handleBtn("mobieSearch")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 ${
            active === "mobieSearch" ? "text-blue-500" : "text-black"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span
          className={`text-xs mt-1 ${
            active === "mobieSearch" ? "text-blue-500" : "text-black"
          }`}
        >
          Search
        </span>
      </button>

      {/* Friends Button */}
      <button
        className="flex flex-col items-center justify-center"
        onClick={() => handleBtn("friends")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-6 w-6 ${
            active === "friends" ? "text-blue-500" : "text-black"
          }`}
        >
          <circle cx="8" cy="7" r="3" />
          <path d="M4 15c0-1.105 1.791-2 4-2s4 .895 4 2v2H4v-2z" />

          <circle cx="16" cy="7" r="3" />
          <path d="M12 15c0-1.105 1.791-2 4-2s4 .895 4 2v2h-8v-2z" />

          <path d="M11 7h2" />
        </svg>

        <span
          className={`text-xs mt-1 ${
            active === "friends" ? "text-blue-500" : "text-black"
          }`}
        >
          Friends
        </span>
      </button>
    </div>
  );
};

export default MobileNav;
