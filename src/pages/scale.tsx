import { navigate, RouteComponentProps } from "@reach/router";
import React from "react";
import { Button } from "../components/button";
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
        <p style={{ marginTop: 0 }}>Scale not found</p>
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
      <VStack
        spacing={16}
        style={{ padding: 16, borderLeft: "1px solid gainsboro" }}
      >
        <VStack spacing={8}>
          <Input
            type="text"
            aria-label="Scale name"
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
          <Button
            variant="danger"
            onClick={() => {
              send({ type: "DELETE_SCALE", paletteId, scaleId });
              navigate(`/${paletteId}`);
            }}
          >
            Delete scale
          </Button>
        </VStack>
      </VStack>
    </div>
  );
}
