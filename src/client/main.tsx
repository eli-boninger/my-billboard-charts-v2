import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import TopItems from "./pages/top-items/TopItems";
import { Login } from "./pages/login/Login";
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material/styles";

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
        element: <TopItems topItemType="TRACK" />,
        loader: () => TopItems.loader("top_tracks"),
      },
      {
        path: "/artists",
        element: <TopItems topItemType="ARTIST" />,
        loader: () => TopItems.loader("top_artists"),
      },
    ],
  },
]);

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

const theme = createTheme({
  palette: {
    primary: {
      light: "#77a0a9",
      main: "#6F7D8C",
      dark: "#6C596E",
    },
    secondary: {
      light: "#F3e0ec",
      main: "#4b2e39",
      dark: "#32021f",
    },
    error: {
      main: "#fe654f",
    },
    warning: {
      main: "#ffc100",
    },
    info: {
      main: "#37ff8b",
    },
    success: {
      main: "#0b6e4f",
    },
  },
  components: {
    MuiPopover: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiPopper: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiDialog: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiModal: {
      defaultProps: {
        container: rootElement,
      },
    },
  },
  typography: {
    fontFamily: ["Nunito", "Arial", "sans-serif"].join(","),
  },
});

root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);
