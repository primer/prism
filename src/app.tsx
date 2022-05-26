import { BaseStyles, themeGet } from "@primer/react";
import { Router } from "@reach/router";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { createGlobalStyle } from "styled-components";
import { routePrefix } from "./constants";
import { useGlobalState } from "./global-state";
import { Index } from "./pages";
import { Curve } from "./pages/curve";
import { NotFound } from "./pages/not-found";
import { Palette } from "./pages/palette";
import { Scale } from "./pages/scale";

const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${themeGet("colors.canvas.default")};
  }
`;

export function App() {
  const [, send] = useGlobalState();

  useHotkeys("command+z, ctrl+z", () => send("UNDO"));
  useHotkeys("command+shift+z, ctrl+shift+z", () => send("REDO"));

  return (
    <BaseStyles>
      <GlobalStyles />
      <Router>
        <Index path={`${routePrefix}/`} />
        <Palette path={`${routePrefix}/local/:paletteId`}>
          <Scale path="scale/:scaleId"></Scale>
          <Scale path="scale/:scaleId/:index"></Scale>
          <Curve path="curve/:curveId"></Curve>
        </Palette>
        <NotFound default />
      </Router>
    </BaseStyles>
  );
}
