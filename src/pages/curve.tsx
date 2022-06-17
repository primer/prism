import { Link, navigate, RouteComponentProps } from "@reach/router";
import React from "react";
import { Button } from "../components/button";
import { CurveEditor } from "../components/curve-editor";
import { Input } from "../components/input";
import { Separator } from "../components/separator";
import { SidebarPanel } from "../components/sidebar-panel";
import { VStack, ZStack } from "../components/stack";
import { routePrefix } from "../constants";
import { useGlobalState } from "../global-state";
import { Color } from "../types";
import { colorToHex, getColor } from "../utils";

const ranges = {
  hue: { min: 0, max: 360 },
  saturation: { min: 0, max: 100 },
  lightness: { min: 0, max: 100 },
};

export function Curve({
  paletteId = "",
  curveId = "",
}: RouteComponentProps<{ paletteId: string; curveId: string }>) {
  const [state, send] = useGlobalState();
  const palette = state.context.palettes[paletteId];
  const curve = palette.curves[curveId];
  const scales = React.useMemo(
    () =>
      Object.values(palette.scales).filter(scale =>
        Object.values(scale.curves).includes(curveId)
      ),
    [palette, curveId]
  );

  if (!curve) {
    return (
      <div style={{ padding: 16 }}>
        <p style={{ marginTop: 0 }}>Curve not found</p>
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
      <ZStack style={{ padding: 16 }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          {curve.values.map((value, index) => {
            let color: Color;

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
              <label
                key={index}
                htmlFor={index.toString()}
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: colorToHex(color),
                }}
              />
            );
          })}
        </div>
        <CurveEditor
          values={curve.values}
          {...ranges[curve.type]}
          onChange={values =>
            send({ type: "CHANGE_CURVE_VALUES", paletteId, curveId, values })
          }
          label={curve.type[0].toUpperCase()}
        />
      </ZStack>
      <VStack
        style={{
          borderLeft: "1px solid var(--color-border, gainsboro)",
          width: 300,
          flexShrink: 0,
          overflow: "auto",
          paddingBottom: 16,
        }}
      >
        <SidebarPanel
          title={`${
            // Capitalize first letter of curve type
            curve.type[0].toLocaleUpperCase() + curve.type.slice(1)
          } curve`}
        >
          <VStack spacing={16}>
            <VStack spacing={4}>
              <label htmlFor="name" style={{ fontSize: 14 }}>
                Name
              </label>
              <Input
                type="text"
                id="name"
                aria-label="Curve name"
                value={curve.name}
                onChange={event =>
                  send({
                    type: "CHANGE_CURVE_NAME",
                    paletteId,
                    curveId,
                    name: event.target.value,
                  })
                }
              />
            </VStack>

            <Button
              onClick={() => {
                send({ type: "DELETE_CURVE", paletteId, curveId });
                navigate(`${routePrefix}/local/${paletteId}`);
              }}
            >
              Delete curve
            </Button>
          </VStack>
        </SidebarPanel>
        <Separator />
        <SidebarPanel title="Values">
          <VStack spacing={16}>
            {curve.values.map((value, index) => {
              return (
                <div
                  key={index}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "24px 1fr",
                    alignItems: "center",
                  }}
                >
                  <label htmlFor={index.toString()}>{index}</label>
                  <Input
                    type="number"
                    id={index.toString()}
                    value={value}
                    onChange={event =>
                      send({
                        type: "CHANGE_CURVE_VALUE",
                        paletteId,
                        curveId,
                        index,
                        value: event.target.valueAsNumber || 0,
                      })
                    }
                    {...ranges[curve.type]}
                  />
                </div>
              );
            })}
          </VStack>
        </SidebarPanel>
        {/* <VStack spacing={16} style={{ padding: 16 }}>
          <Input
            type="text"
            aria-label="Curve name"
            value={curve.name}
            onChange={event =>
              send({
                type: "CHANGE_CURVE_NAME",
                paletteId,
                curveId,
                name: event.target.value,
              })
            }
          />
          <Button
            onClick={() => {
              send({ type: "DELETE_CURVE", paletteId, curveId });
              navigate(`${routePrefix}/local/${paletteId}`);
            }}
          >
            Delete curve
          </Button>
          {curve.values.map((value, index) => {
            return (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "24px 1fr",
                  alignItems: "center",
                }}
              >
                <label htmlFor={index.toString()}>{index}</label>
                <Input
                  type="number"
                  id={index.toString()}
                  value={value}
                  onChange={event =>
                    send({
                      type: "CHANGE_CURVE_VALUE",
                      paletteId,
                      curveId,
                      index,
                      value: event.target.valueAsNumber || 0,
                    })
                  }
                  {...ranges[curve.type]}
                />
              </div>
            );
          })}
        </VStack> */}
        <Separator />
        <SidebarPanel title="Linked to">
          <VStack spacing={8}>
            {scales.map(scale => (
              <Link
                key={scale.id}
                to={`${routePrefix}/local/${paletteId}/scale/${scale.id}`}
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
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    {scale.colors.map((_, index) => {
                      const color = getColor(palette.curves, scale, index);
                      return (
                        <div
                          key={index}
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
        </SidebarPanel>
      </VStack>
    </div>
  );
}
