import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-bold mb-2">Page not found</h1>
        <p className="text-gray-600 mb-4">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="flex gap-2 justify-center mb-4">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate("/apps")}
            className="px-4 py-2 bg-amber-500 text-white rounded-md"
          >
            Browse Apps
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
