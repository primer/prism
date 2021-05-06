import { inspect } from "@xstate/inspect";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app";
import "./index.css";
import { GlobalStateProvider } from "./global-state";

if (process.env.NODE_ENV === "development") {
  inspect({ iframe: false });
}

ReactDOM.render(
  <React.StrictMode>
    <GlobalStateProvider>
      <App />
    </GlobalStateProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
