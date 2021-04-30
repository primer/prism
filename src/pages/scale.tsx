import { RouteComponentProps } from "@reach/router";
import React from "react";
import { Input } from "../components/input";
import { VStack } from "../components/stack";
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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 300px",
        height: "100%",
      }}
    >
      <div style={{ padding: 16 }}>
        <pre style={{ margin: 0 }}>{JSON.stringify(scale, null, 2)}</pre>
      </div>
      <VStack style={{ padding: 16, borderLeft: "1px solid gainsboro" }}>
        <Input
          type="text"
          value={scale.name}
          onChange={event =>
            send({
              type: "CHANGE_SCALE_NAME",
              paletteId,
              scaleId,
              name: event.target.value,
            })
          }
        />
      </VStack>
    </div>
  );
}
