import React from "react";
import { GlobalStateProvider } from "./global-state";

export function App() {
  return (
    <GlobalStateProvider>
      <div>Hello world</div>
    </GlobalStateProvider>
  );
}
