import { NavLink } from "react-router-dom";
import logo from "/logo.png";

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="w-full px-4 sm:px-6 lg:px-28 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-6">
          {/* Brand Section - Full width on mobile, then adjusts */}
          <aside className="lg:col-span-2">
            <div className="max-w-[300px]">
              <NavLink to={"/"}>
                <div className="flex gap-2 items-center md:justify-start">
                  <img
                    src={logo}
                    width="40px"
                    alt="logo"
                    className="w-8 h-8 sm:w-10 sm:h-10"
                  />
                  <p className="text-lg sm:text-xl text-[#1629A1] font-bold">
                    HERO.IO
                  </p>
                </div>
              </NavLink>
              <div className="mt-3 sm:mt-4">
                <p className="text-xs sm:text-sm text-white leading-relaxed text-left">
                  Your gateway to epic mobile battles. Download HERO.IO to join
                  competitive PvP combat, master unique heroes, and access
                  strategy guides to dominate the arena.
                </p>
              </div>
            </div>
          </aside>

          {/* Services */}
          <nav className="text-left">
            <h6 className="footer-title text-sm sm:text-base mb-3 sm:mb-4">
              Services
            </h6>
            <div className="flex flex-col space-y-2 sm:space-y-3">
              <a className="link link-hover text-xs sm:text-sm">Branding</a>
              <a className="link link-hover text-xs sm:text-sm">Design</a>
              <a className="link link-hover text-xs sm:text-sm">Marketing</a>
              <a className="link link-hover text-xs sm:text-sm">
                Advertisement
              </a>
            </div>
          </nav>

          {/* Company */}
          <nav className="text-left">
            <h6 className="footer-title text-sm sm:text-base mb-3 sm:mb-4">
              Company
            </h6>
            <div className="flex flex-col space-y-2 sm:space-y-3">
              <a className="link link-hover text-xs sm:text-sm">About us</a>
              <a className="link link-hover text-xs sm:text-sm">Contact</a>
              <a className="link link-hover text-xs sm:text-sm">Jobs</a>
              <a className="link link-hover text-xs sm:text-sm">Press kit</a>
            </div>
          </nav>

          {/* Legal */}
          <nav className="text-left">
            <h6 className="footer-title text-sm sm:text-base mb-3 sm:mb-4">
              Legal
            </h6>
            <div className="flex flex-col space-y-2 sm:space-y-3">
              <a className="link link-hover text-xs sm:text-sm">Terms of use</a>
              <a className="link link-hover text-xs sm:text-sm">
                Privacy policy
              </a>
              <a className="link link-hover text-xs sm:text-sm">
                Cookie policy
              </a>
            </div>
          </nav>
        </div>

        {/* Bottom Border/Additional Info */}
        <div className="border-t w-full border-gray-800 mt-8 sm:mt-10 pt-6 sm:pt-8 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} HERO.IO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
