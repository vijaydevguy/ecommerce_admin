import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { IoIosAddCircleOutline, IoIosList } from "react-icons/io";
import { BsBoxSeam } from "react-icons/bs";

const NAVIGATIONS = [
  {
    label: "Add Items",
    link: "/add",
    img: <IoIosAddCircleOutline size={22}/>,
  },
  {
    label: "List Items",
    link: "/list",
    img: <IoIosList size={22} />,
  },
  {
    label: "Orders",
    link: "/order",
    img: <BsBoxSeam size={22} />,
  },
];

const Sidebar = () => {
  const location = useLocation();
  // console.log("locaiton", location);
  // const isActive = location.pathname == NAVIGATIONS[0].link;
  // console.log("active",isActive)

  return (
    <div className="w-[18%] min-h-screen border-r-2 border-[0.5px] border-gray-300">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[16px]">
        {NAVIGATIONS.map((n, i) => (
          <NavLink
            key={i}
            to={n.link}
            className={`flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-lg 
              ${location.pathname == n.link ? "bg-[#1e1e1e] text-white" : ""}
              `}
            aria-label="button"
          >
            {typeof n.img === "string" ? (
              <img
                src={n.img}
                alt={n.label}
                className="pointer-events-none w-5 h-5"
              />
            ) : (
              n.img
            )}
            <p className="md:block hidden">{n.label}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
