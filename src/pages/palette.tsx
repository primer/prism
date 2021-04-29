import { Link, navigate, RouteComponentProps } from "@reach/router";
import React from "react";
import { Button } from "../components/button";
import { ImportScales } from "../components/import-scales";
import { Input } from "../components/input";
import { HStack } from "../components/stack";
import { useGlobalState } from "../global-state";

export function Palette({
  paletteId = "",
}: RouteComponentProps<{ paletteId: string }>) {
  const [state, send] = useGlobalState();
  const palette = state.context.palettes[paletteId];

  if (!palette) {
    return (
      <div>
        <p>Palette not found</p>
        <Link to="/">Go home</Link>
      </div>
    );
  }

  return (
    <div>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 16,
          borderBottom: "1px solid gainsboro",
        }}
      >
        <HStack spacing={16}>
          <Link to="/">Home</Link>
          <Input
            type="text"
            aria-label="Palette name"
            value={palette.name}
            onChange={event =>
              send({
                type: "CHANGE_PALETTE_NAME",
                paletteId,
                name: event.target.value,
              })
            }
          />
        </HStack>
        <HStack spacing={8}>
          <ImportScales
            onImport={(scales, replace) =>
              send({ type: "IMPORT_SCALES", paletteId, scales, replace })
            }
          />
          <Button
            onClick={() => {
              send({ type: "DELETE_PALETTE", paletteId });

              // Navigate to home page after deleting a palette
              navigate("/");
            }}
          >
            Delete palette
          </Button>
        </HStack>
      </header>
      <pre>{JSON.stringify(palette, null, 2)}</pre>
    </div>
  );
}
