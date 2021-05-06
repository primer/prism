import { inspect } from "@xstate/inspect";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app";
import "./index.css";

if (process.env.NODE_ENV === "development") {
  inspect({ iframe: false });
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
