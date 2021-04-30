import { RouteComponentProps } from "@reach/router";
import React from "react";
import { useGlobalState } from "../global-state";

export function Scale({
  paletteId = "",
  scaleId = "",
}: RouteComponentProps<{ paletteId: string; scaleId: string }>) {
  const [state, send] = useGlobalState();
  const palette = state.context.palettes[paletteId];
  const scale = palette.scales[scaleId];

  if (!scale) {
    return (
      <div style={{ padding: 16 }}>
        <p>Scale not found</p>
      </div>
    );
  }

  return (
    <div>
      <pre>{JSON.stringify(scale, null, 2)}</pre>
    </div>
  );
}
