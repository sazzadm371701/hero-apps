const LoeadingSpiner = ({
  size = "md",
  color = "indigo",
  variant = "spinner",
}) => {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-20 w-20",
  };

  const svgSizeClass = sizes[size] || sizes.md;

  const colorMap = {
    indigo: { text: "text-indigo-600", bg: "bg-indigo-600" },
    green: { text: "text-green-600", bg: "bg-green-600" },
    yellow: { text: "text-yellow-600", bg: "bg-yellow-600" },
    gray: { text: "text-gray-600", bg: "bg-gray-600" },
  };

  const col = colorMap[color] || colorMap.indigo;

  if (variant === "bar") {
    return (
      <div className="w-full h-1 bg-transparent" aria-hidden>
        <div className={`${col.bg} h-1 w-1/4`} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[40vh] flex items-center justify-center">
      <div role="status" className="flex flex-col items-center">
        <svg
          className={`animate-spin -ml-1 mr-3 ${svgSizeClass} ${col.text}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span className="mt-2 text-sm text-gray-600">Loading...</span>
      </div>
    </div>
  );
};

export default LoeadingSpiner;
