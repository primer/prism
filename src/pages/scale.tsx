import { navigate, RouteComponentProps } from "@reach/router";
import React from "react";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { HStack, VStack } from "../components/stack";
import { useGlobalState } from "../global-state";
import { colorToHex } from "../utils";

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
      <div
        style={{
          display: "grid",
          gridTemplateRows: "auto 1fr",
          gap: 16,
          padding: 16,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div></div>
          <HStack spacing={8}>
            <Button
              aria-label="Remove color from end of scale"
              onClick={() => send({ type: "POP_COLOR", paletteId, scaleId })}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2.25 7.5C2.25 7.22386 2.47386 7 2.75 7H12.25C12.5261 7 12.75 7.22386 12.75 7.5C12.75 7.77614 12.5261 8 12.25 8H2.75C2.47386 8 2.25 7.77614 2.25 7.5Z"
                  fill="currentColor"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </Button>
            <Button
              aria-label="Add color to end of scale"
              onClick={() => send({ type: "CREATE_COLOR", paletteId, scaleId })}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
                  fill="currentColor"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </Button>
          </HStack>
        </div>
        <div
          style={{
            display: "flex",
          }}
        >
          {scale.colors.map(color => (
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: colorToHex(color),
              }}
            />
          ))}
        </div>
      </div>
      <VStack
        spacing={16}
        style={{
          padding: 16,
          borderLeft: "1px solid var(--color-border, gainsboro)",
        }}
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
