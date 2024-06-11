import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { TopItems } from "./pages/top-items/TopItems";
import { Login } from "./pages/login/Login";
import SignUp from "./pages/login/SignUp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/tracks",
        element: <TopItems topItemType="track" />,
      },
      {
        path: "/artists",
        element: <TopItems topItemType="artist" />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
