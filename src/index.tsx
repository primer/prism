import { ThemeProvider } from "@primer/react";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app";
import { GlobalStateProvider } from "./global-state";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider colorMode="auto">
      <GlobalStateProvider>
        <App />
      </GlobalStateProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
