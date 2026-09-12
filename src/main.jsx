import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import { SideHustle } from "./SideHustle.jsx";
import "./styles.css";

const isSideHustle = window.location.pathname.startsWith("/sidehustle");

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isSideHustle ? <SideHustle /> : <App />}
  </React.StrictMode>,
);
