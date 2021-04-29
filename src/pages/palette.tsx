import { Link, navigate, RouteComponentProps } from "@reach/router";
import React from "react";
import { Button } from "../components/button";
import { ImportScales } from "../components/import-scales";
import { Input } from "../components/input";
import { HStack, VStack } from "../components/stack";
import { useGlobalState } from "../global-state";

export function Palette({
  paletteId = "",
}: RouteComponentProps<{ paletteId: string }>) {
  const [state, send] = useGlobalState();
  const palette = state.context.palettes[paletteId];

  if (!palette) {
    return (
      <div style={{ padding: 16 }}>
        <p>Palette not found</p>
        <Link to="/">Go home</Link>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        gridTemplateRows: "auto 1fr",
        gridTemplateAreas: '"header header" "sidebar main"',
        height: "100vh",
      }}
    >
      <header
        style={{
          gridArea: "header",
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
      <div style={{ gridArea: "sidebar", overflow: "auto", padding: 16 }}>
        <span>Scales</span>
        <VStack>
          {Object.values(palette.scales).map(scale => (
            <Link key={scale.id} to={`scale/${scale.id}`}>
              <span style={{ fontSize: 14 }}>{scale.name}</span>
            </Link>
          ))}
        </VStack>
      </div>
      <main style={{ gridArea: "main", overflow: "auto" }}></main>
    </div>
  );
}
