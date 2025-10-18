import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { GoHome } from "react-icons/go";
import { GrAppleAppStore } from "react-icons/gr";
import { MdOutlineInstallMobile } from "react-icons/md";
import { NavLink } from "react-router-dom";
import "./NavBar.css";
import logo from "/logo.png";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // no search in navbar

  return (
    <nav
      className={`navbar h-16 px-6 lg:px-28 sticky top-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
    >
      <div className="navbar-start flex items-center h-full">
        <NavLink to="/" className="flex items-center h-full">
          <img src={logo} alt="logo" className="w-6 lg:w-10" />
          <span className="text-md lg:text-xl text-[#1629A1] font-bold ml-2">
            HERO.IO
          </span>
        </NavLink>
      </div>

      <div className="navbar-center hidden lg:flex flex-1 justify-center items-center h-full">
        <ul className="menu-horizontal flex space-x-8 h-full items-center">
          <li className="h-full">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link h-full inline-flex items-center gap-2 ${
                  isActive ? "active" : ""
                }`
              }
            >
              <GoHome className="h-5 w-5 flex-shrink-0" />
              <span>Home</span>
            </NavLink>
          </li>

          <li className="h-full">
            <NavLink
              to="/apps"
              className={({ isActive }) =>
                `nav-link h-full inline-flex items-center gap-2 ${
                  isActive ? "active" : ""
                }`
              }
            >
              <GrAppleAppStore className="h-5 w-5 flex-shrink-0" />
              <span>Apps</span>
            </NavLink>
          </li>

          <li className="h-full">
            <NavLink
              to="/installations"
              className={({ isActive }) =>
                `nav-link h-full inline-flex items-center gap-2 ${
                  isActive ? "active" : ""
                }`
              }
            >
              <MdOutlineInstallMobile className="h-5 w-5 flex-shrink-0" />
              <span>Installation</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="navbar-end flex items-center h-full">
        <a
          href="https://github.com/sazzadm371701"
          target="_blank"
          rel="noreferrer"
          className="flex gap-1 items-center bg-linear-to-r from-blue-900 to-blue-800 text-white px-2 py-1 lg:px-3 lg:py-2 hover:shadow-md rounded-sm"
        >
          <FaGithub className="h-4 w-4" />
          <span>Contribute</span>
        </a>
      </div>
    </nav>
  );
};

export default NavBar;
