import React from "react";
import "@fontsource/inter/400.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Customers from "./pages/Customers";
import Selected from "./pages/Selected";
import { Provider } from "react-redux";
import { store } from "./store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "customers", element: <Customers /> },
      { path: "selected", element: <Selected /> },
    ],
  },
]);

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
