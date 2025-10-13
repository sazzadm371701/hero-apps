import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Apps from "../pages/Apps";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import Installations from "../pages/Installations";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    hydrateFallbackElement: <p>Loading...</p>,
    children: [
      {
        index: true,
        element: <Home />,
        loader: () => fetch("/data.json"),
      },
      {
        path: "/apps",
        element: <Apps />,
      },
      {
        path: "/installations",
        element: <Installations />,
      },
    ],
  },
]);

export default router;
