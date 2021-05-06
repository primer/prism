import { Router } from "@reach/router";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useGlobalState } from "./global-state";
import { Index } from "./pages";
import { Color } from "./pages/color";
import { Curve } from "./pages/curve";
import { NotFound } from "./pages/not-found";
import { Palette } from "./pages/palette";
import { Scale } from "./pages/scale";

export function App() {
  const [state, send] = useGlobalState();

  useHotkeys("command+z, ctrl+z", () => send("UNDO"));
  useHotkeys("command+shift+z, ctrl+shift+z", () => send("REDO"));

  return (
    <Router>
      <Index path="/" />
      <Palette path="/:paletteId">
        <Scale path="scale/:scaleId">
          <Color path=":index" />
        </Scale>
        <Curve path="curve/:curveId"></Curve>
      </Palette>
      <NotFound default />
    </Router>
  );
}
