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
        loader: () => TopItems.loader("top_tracks"),
      },
      {
        path: "/artists",
        element: <TopItems topItemType="ARTIST" />,
        loader: () => TopItems.loader("top_artists"),
      },
      {
        path: "top_items/:id",
        element: <ItemDetail />,
        loader: ItemDetail.loader,
      },
    ],
  },
];
