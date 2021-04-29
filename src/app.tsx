import { Router } from "@reach/router";
import React from "react";
import { GlobalStateProvider } from "./global-state";
import { Index } from "./pages";
import { Palette } from "./pages/palette";

export function App() {
  return (
    <GlobalStateProvider>
      <Router>
        <Index path="/" />
        <Palette path="/:paletteId" />
      </Router>
    </GlobalStateProvider>
  );
}
