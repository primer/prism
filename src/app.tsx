import React from "react";
import { GlobalStateProvider } from "./global-state";
import { Index } from "./pages/index";

export function App() {
  return (
    <GlobalStateProvider>
      <Index />
    </GlobalStateProvider>
  );
}
