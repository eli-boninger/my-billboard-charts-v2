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
        path: "/top_tracks",
        element: <TopItems topItemType="TRACK" />,
      },
      {
        path: "/top_artists",
        element: <TopItems topItemType="ARTIST" />,
      },
      {
        path: "top_tracks/:id",
        element: <ItemDetail />,
      },
      {
        path: "top_artists/:id",
        element: <ItemDetail />,
      },
    ],
  },
];
