import { FaGooglePlay } from "react-icons/fa";
import { GrAppleAppStore } from "react-icons/gr";
import heroImg from "../assets/hero.png";

const Home = () => {
  return (
    <div className="py-10 mx-auto">
      {/* Hero section */}
      <div>
        {/* Top */}
        <div className="flex flex-col flex-auto items-center text-center">
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-3">
            We Build <br />{" "}
            <span className="bg-gradient-to-r from-[#632EE3] to-[#9F62F2] bg-clip-text text-transparent">
              Productive
            </span>
             Apps
          </h1>
          <p className="text-[#627382] text-xl">
            At HERO.IO, we craft innovative apps designed to make everyday life
            simpler, smarter, and more exciting. <br /> Our goal is to turn your
            ideas into digital experiences that truly make an impact.
          </p>
          <div className="flex flex-wrap justify-center gap-5 text-xl">
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              className="flex items-center gap-2 bg-gray-300 opacity-50 text-black shadow px-6 py-3 rounded-md mt-5 hover:opacity-100 hover:shadow-xl transition cursor-pointer"
            >
              <FaGooglePlay />
              <span>Google Play</span>
            </a>
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              className="flex items-center gap-2 bg-gray-300 opacity-50 text-black shadow px-6 py-3 rounded-md mt-5 hover:opacity-100 hover:shadow-xl transition cursor-pointer"
            >
              <GrAppleAppStore />
              <span>App Store</span>
            </a>
          </div>
        </div>
        {/* Middle */}
        <div className="flex justify-center">
          <img src={heroImg} alt="hero" className="w-8/12 h-auto mt-10" />
        </div>
        {/* Bottom */}
        <div className="bg-gradient-to-l from-[#632EE3] to-[#9F62F2] px-28 py-15">
          <h2 className="text-4xl font-semibold text-white text-center mb-10">
            Trusted by Millions, Built for You
          </h2>
          <div className="flex items-center justify-center gap-36">
            <div className="flex flex-col gap-2 text-center text-white">
              <h3 className="text-gray-300 text-sm">Total Downloads</h3>
              <p className="text-6xl font-bold">29.6M</p>
              <h4 className="text-gray-300 text-sm">
                21% more than last month
              </h4>
            </div>
            <div className="flex flex-col gap-2 text-center text-white">
              <h3 className="text-gray-300  text-sm">Total Reviews</h3>
              <p className="text-6xl font-bold">906K</p>
              <h4 className="text-gray-300 text-sm">
                46% more than last month
              </h4>
            </div>
            <div className="flex flex-col gap-2 text-center text-white">
              <h3 className="text-gray-300 text-sm">Active Apps</h3>
              <p className="text-6xl font-bold">132+</p>
              <h4 className="text-gray-300 text-sm">31 more will Launch</h4>
            </div>
          </div>
        </div>
      </div>
      {/* App cards section */}
      <div></div>
    </div>
  );
};

export default Home;
