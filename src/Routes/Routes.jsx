import { createBrowserRouter } from "react-router-dom";
import Apps from "../Apps";
import MainLayout from "../Layout/MainLayout";
import AppDetails from "../pages/AppDetails";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import Installations from "../pages/Installations";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
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
        path: "/apps/:id",
        element: <AppDetails />,
      },
      {
        path: "/installations",
        element: <Installations />,
      },
    ],
  },
]);

export default router;
