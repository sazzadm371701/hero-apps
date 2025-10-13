import { IoIosStarHalf } from "react-icons/io";
import { MdOutlineFileDownload } from "react-icons/md";

const formatNumber = (n) => {
  if (n == null) return "";
  const num = Number(n);
  if (Number.isNaN(num)) return n;
  if (num >= 1_000_000) {
    let v = (num / 1_000_000).toFixed(1);
    if (v.endsWith(".0")) v = v.slice(0, -2);
    return `${v}M`;
  }
  if (num >= 1_000) {
    let v = (num / 1_000).toFixed(1);
    if (v.endsWith(".0")) v = v.slice(0, -2);
    return `${v}K`;
  }
  return String(num);
};

const AppCards = ({ app }) => {
  if (!app) return null;
  // console.log(app);
  return (
    <div className="border rounded-md p-4 shadow hover:shadow-md transition">
      <img
        src={app.image}
        alt={app.title}
        className="w-full h-48 object-cover rounded"
      />
      <h3 className="text-xl font-semibold mt-3 text-center">{app.title}</h3>
      <div className="flex justify-between items-center pt-3">
        <div className="flex gap-1 items-center justify-center bg-gray-200 px-3 py-1 rounded-md text-green-600">
          <MdOutlineFileDownload />
          <h4 className="text-sm">{formatNumber(app.downloads)}</h4>
        </div>
        <div className="flex gap-1 bg-gray-200 px-3 py-1 rounded-md text-yellow-600">
          <IoIosStarHalf />
          <h4 className="text-sm font-medium items-center justify-center">
            {app.ratingAvg}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default AppCards;
