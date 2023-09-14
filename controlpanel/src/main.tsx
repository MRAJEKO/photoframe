import React from "react";
import ReactDOM from "react-dom/client";
import Panel from "./Panel.tsx";
import "./index.scss";
import "./assets/fonts/fonts.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Panel />
  </React.StrictMode>
);
