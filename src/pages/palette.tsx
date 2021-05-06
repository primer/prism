import { Link, navigate, RouteComponentProps } from "@reach/router";
import { mix, readableColor } from "color2k";
import React from "react";
import styled from "styled-components";
import { Button } from "../components/button";
import { ExportScales } from "../components/export-scales";
import { ImportScales } from "../components/import-scales";
import { Input } from "../components/input";
import { Separator } from "../components/separator";
import { HStack, VStack } from "../components/stack";
import { useGlobalState } from "../global-state";
import { colorToHex, getColor } from "../utils";

const Wrapper = styled.div<{ backgroundColor: string }>`
  --color-text: ${props => readableColor(props.backgroundColor)};
  --color-background: ${props => props.backgroundColor};
  --color-background-secondary: ${props =>
    mix(readableColor(props.backgroundColor), props.backgroundColor, 0.9)};
  --color-border: ${props =>
    mix(readableColor(props.backgroundColor), props.backgroundColor, 0.75)};

  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas: "header header" "sidebar main";
  color: var(--color-text);
  background-color: var(--color-background);
  height: 100vh;
`;

export function Palette({
  paletteId = "",
  children,
}: React.PropsWithChildren<RouteComponentProps<{ paletteId: string }>>) {
  const [state, send] = useGlobalState();
  const palette = state.context.palettes[paletteId];

  if (!palette) {
    return (
      <div style={{ padding: 16 }}>
        <p style={{ marginTop: 0 }}>Palette not found</p>
        <Link to="/">Go home</Link>
      </div>
    );
  }

  return (
    <Wrapper backgroundColor={palette.backgroundColor}>
      <header
        style={{
          gridArea: "header",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 16,
          borderBottom: "1px solid var(--color-border, gainsboro)",
        }}
      >
        <HStack spacing={16}>
          <Link to="/" style={{ color: "inherit" }}>
            Home
          </Link>
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
          <input
            type="color"
            value={palette.backgroundColor}
            style={{
              appearance: "none",
              border: "1px solid var(--color-border, darkgray)",
              backgroundColor: "var(--color-background-secondary, gainsboro)",
              padding: "0px 2px",
              margin: 0,
              borderRadius: 3,
              height: 32,
            }}
            onChange={event =>
              send({
                type: "CHANGE_PALETTE_BACKGROUND_COLOR",
                paletteId,
                backgroundColor: event.target.value,
              })
            }
          />
          <ImportScales
            onImport={(scales, replace) =>
              send({ type: "IMPORT_SCALES", paletteId, scales, replace })
            }
          />
          <ExportScales palette={palette} />
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
      <div
        style={{
          gridArea: "sidebar",
          overflow: "auto",
          borderRight: "1px solid var(--color-border, gainsboro)",
        }}
      >
        <VStack spacing={8} style={{ padding: 16 }}>
          <span>Scales</span>
          <VStack spacing={8}>
            {Object.values(palette.scales).map(scale => (
              <Link
                key={scale.id}
                to={`scale/${scale.id}`}
                style={{
                  color: "inherit",
                  fontSize: 14,
                  textDecoration: "none",
                }}
              >
                <VStack spacing={4}>
                  <span>{scale.name}</span>
                  <div
                    style={{
                      display: "flex",
                      height: 24,
                    }}
                  >
                    {scale.colors.map((_, index) => {
                      const color = getColor(palette.curves, scale, index);
                      console.log(color);
                      return (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: colorToHex(color),
                          }}
                        />
                      );
                    })}
                  </div>
                </VStack>
              </Link>
            ))}
          </VStack>
          <Button
            style={{ marginTop: 16 }}
            onClick={() => send({ type: "CREATE_SCALE", paletteId })}
          >
            Add scale
          </Button>
        </VStack>
        <Separator />
        <VStack spacing={8} style={{ padding: 16 }}>
          <span>Curves</span>
          <VStack spacing={8}>
            {Object.values(palette.curves).map(curve => (
              <Link
                key={curve.id}
                to={`curve/${curve.id}`}
                style={{
                  color: "inherit",
                  fontSize: 14,
                  textDecoration: "none",
                }}
              >
                <VStack spacing={4}>
                  <span>{curve.name}</span>
                  <div
                    style={{
                      display: "flex",
                      height: 24,
                    }}
                  >
                    {curve.values.map(value => {
                      let color;

                      switch (curve.type) {
                        case "hue":
                          color = {
                            hue: value,
                            saturation: 100,
                            lightness: 50,
                          };
                          break;

                        case "saturation":
                          color = {
                            hue: 0,
                            saturation: 0,
                            lightness: 100 - value,
                          };
                          break;

                        case "lightness":
                          color = { hue: 0, saturation: 0, lightness: value };
                          break;
                      }

                      return (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: colorToHex(color),
                          }}
                        />
                      );
                    })}
                  </div>
                </VStack>
              </Link>
            ))}
          </VStack>
        </VStack>
      </div>
      <main
        style={{
          gridArea: "main",
          overflow: "auto",
          display: "grid",
        }}
      >
        {children}
      </main>
    </Wrapper>
  );
}
