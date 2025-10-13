import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { GoHome } from "react-icons/go";
import { GrAppleAppStore } from "react-icons/gr";
import { MdInstallMobile } from "react-icons/md";
import { NavLink } from "react-router-dom";
import "./NavBar.css";
import logo from "/logo.png";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`navbar px-6 lg:px-28 shadow-sm sticky top-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
    >
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="lg:hidden mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content bg-base-100 space-y-3 rounded-box z-1 mt-3 p-2 shadow"
          >
            <li className="flex items-center gap-2 ">
              <GoHome />
              <NavLink to={"/"}>
                <span className="hover:border-b-2 hover:border-amber-500 pb-2 cursor-pointer">
                  Home
                </span>
              </NavLink>
            </li>
            <li className="flex items-center gap-2 ">
              <GrAppleAppStore />
              <NavLink to={"/apps"}>
                <span className="hover:border-b-2 hover:border-amber-500 pb-1 cursor-pointer">
                  Apps
                </span>
              </NavLink>
            </li>
            <li className="flex items-center gap-2 ">
              <MdInstallMobile />
              <NavLink to={"/installations"}>
                <span className="hover:border-b-2 hover:border-amber-500 pb-1 cursor-pointer">
                  Installation
                </span>
              </NavLink>
            </li>
          </ul>
        </div>

        <NavLink to={"/"}>
          <div className="flex items-center">
            <img src={logo} className="w-6 lg:w-10" alt="logo" />
            <span className="text-md lg:text-xl text-[#1629A1] font-bold ml-1 lg:ml-2">
              HERO.IO
            </span>
          </div>
        </NavLink>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu-horizontal flex space-x-8">
          <li className="flex items-center gap-1">
            <GoHome />
            <NavLink to={"/"}>
              <span className="hover:border-b-2 hover:border-amber-500 pb-1 cursor-pointer">
                Home
              </span>
            </NavLink>
          </li>
          <li className="flex items-center gap-1">
            <GrAppleAppStore />
            <NavLink to={"/apps"}>
              <span className="hover:border-b-2 hover:border-amber-500 pb-1 cursor-pointer">
                Apps
              </span>
            </NavLink>
          </li>
          <li className="flex items-center gap-1">
            <MdInstallMobile />
            <NavLink to={"/installations"}>
              <span className="hover:border-b-2 hover:border-amber-500 pb-1 cursor-pointer">
                Installation
              </span>
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <a
          href="https://github.com/sazzadm371701"
          target="_blank"
          className="flex gap-1 items-center bg-linear-to-r from-blue-900 to-blue-800 text-white px-2 py-1 lg:px-3 lg:py-2 hover:shadow-md rounded-sm"
        >
          <FaGithub />
          Contribute
        </a>
      </div>
    </div>
  );
};

export default NavBar;
