import App from "./App";
import NavBar from "./components/NavBar";
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
        element: (
          <>
            <NavBar />
            <TopItems topItemType="TRACK" />
          </>
        ),
      },
      {
        path: "/top_artists",
        element: (
          <>
            <NavBar />
            <TopItems topItemType="TRACK" />
          </>
        ),
      },
      {
        path: "top_tracks/:id",
        element: (
          <>
            <NavBar />
            <ItemDetail />
          </>
        ),
      },
      {
        path: "top_artists/:id",
        element: (
          <>
            <NavBar />
            <ItemDetail />
          </>
        ),
      },
    ],
  },
];
