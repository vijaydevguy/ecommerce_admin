import React from "react";
import { assets } from "../assets/assets";

const Navbar = ({ setToken }) => {
  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
      <img
        className="w-[max(10%,80px)] pointer-events-none"
        src={assets.logo}
        alt="logo"
      />
      <button
        className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 sm:px-7  rounded-full text-xs sm:text-sm cursor-pointer"
        onClick={() => setToken("")}
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
