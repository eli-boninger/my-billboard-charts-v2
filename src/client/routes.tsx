import App from "./App";
import ItemDetail from "./pages/itemDetail/ItemDetail";
import { Login } from "./pages/login/Login";
import TopItems from "./pages/topItems/TopItems";

export default [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/top_items",
        element: <TopItems topItemType="TRACK" />,
      },
      {
        path: "/artists",
        element: <TopItems topItemType="ARTIST" />,
      },
      {
        path: "top_items/:id",
        element: <ItemDetail />,
      },
    ],
  },
];
