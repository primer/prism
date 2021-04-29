import { Router } from "@reach/router";
import React from "react";
import { GlobalStateProvider } from "./global-state";
import { Index } from "./pages";
import { NotFound } from "./pages/not-found";
import { Palette } from "./pages/palette";

export function App() {
  return (
    <GlobalStateProvider>
      <Router>
        <Index path="/" />
        <Palette path="/:paletteId" />
        <NotFound default />
      </Router>
    </GlobalStateProvider>
  );
}
