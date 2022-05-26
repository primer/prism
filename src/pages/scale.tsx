import { DashIcon, PlusIcon } from "@primer/octicons-react";
import { Box, ButtonGroup } from "@primer/react";
import { Link, navigate, RouteComponentProps } from "@reach/router";
import React from "react";
import { Button, IconButton } from "../components/button";
import { Color } from "../components/color";
import { CurveEditor } from "../components/curve-editor";
import { Input } from "../components/input";
import { Select } from "../components/select";
import { Separator } from "../components/separator";
import { VStack, ZStack } from "../components/stack";
import { routePrefix } from "../constants";
import { useGlobalState } from "../global-state";
import { Curve } from "../types";
import { colorToHex, getColor, getRange } from "../utils";

export function Scale({
  paletteId = "",
  scaleId = "",
  index = "",
  children,
}: React.PropsWithChildren<
  RouteComponentProps<{ paletteId: string; scaleId: string; index: string }>
>) {
  const [state, send] = useGlobalState();
  const palette = state.context.palettes[paletteId];
  const scale = palette.scales[scaleId];
  // TODO: allow resizing
  const [visibleCurves, setVisibleCurves] = React.useState({
    hue: true,
    saturation: true,
    lightness: true,
  });

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
        display: "flex",
        height: "100%",
      }}
    >
      <div
        style={{
          flexGrow: 1,
          display: "grid",
          gridTemplateRows: "auto 1fr",
          gap: 16,
          padding: 16,
          height: "100%",
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <ButtonGroup>
            {Object.entries(visibleCurves).map(([type, isVisible]) => {
              return (
                <Button
                  onClick={() =>
                    setVisibleCurves({ ...visibleCurves, [type]: !isVisible })
                  }
                  style={{
                    background: isVisible
                      ? "var(--color-background-secondary)"
                      : "var(--color-background)",
                  }}
                >
                  {type[0].toUpperCase()}
                </Button>
              );
            })}
          </ButtonGroup>
          <ButtonGroup>
            <IconButton
              icon={DashIcon}
              aria-label="Remove color from end of scale"
              onClick={() => send({ type: "POP_COLOR", paletteId, scaleId })}
            />
            <IconButton
              icon={PlusIcon}
              aria-label="Add color to end of scale"
              onClick={() => send({ type: "CREATE_COLOR", paletteId, scaleId })}
            />
          </ButtonGroup>
        </Box>
        <ZStack style={{ overflow: "auto" }}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "100%",
              overflow: "hidden",
              borderRadius: 2,
            }}
          >
            {scale.colors.map((_, index) => (
              <Link
                to={`${routePrefix}/${paletteId}/scale/${scaleId}/${index}`}
                replace={true}
                getProps={({ isCurrent }) => {
                  const color = getColor(palette.curves, scale, index);
                  return {
                    style: {
                      width: "100%",
                      height: "100%",
                      backgroundColor: colorToHex(color),
                      boxShadow: isCurrent
                        ? `inset 0 3px 0 var(--color-background)`
                        : "none",
                    },
                  };
                }}
              />
            ))}
          </Box>
          {(
            Object.entries(scale.curves) as [
              Curve["type"],
              string | undefined
            ][]
          )
            .filter(([type]) => visibleCurves[type])
            .map(([type, curveId]) => {
              if (!curveId) return null;

              return (
                <CurveEditor
                  values={palette.curves[curveId].values}
                  {...getRange(type)}
                  disabled
                  label={`${type[0].toUpperCase()}`}
                />
              );
            })}
          {(["hue", "saturation", "lightness"] as const)
            .filter(type => visibleCurves[type])
            .map(type => {
              return (
                <CurveEditor
                  values={scale.colors.map(
                    (color, index) =>
                      getColor(palette.curves, scale, index)[type]
                  )}
                  {...getRange(type)}
                  label={`${type[0].toUpperCase()}`}
                  onChange={(values, shiftKey, index) => {
                    if (shiftKey && scale.curves[type]) {
                      send({
                        type: "CHANGE_CURVE_VALUES",
                        paletteId,
                        curveId: scale.curves[type] ?? "",
                        values: values.map(
                          (value, index) => value - scale.colors[index][type]
                        ),
                      });
                    } else {
                      send({
                        type: "CHANGE_SCALE_COLORS",
                        paletteId,
                        scaleId,
                        colors: scale.colors.map((color, index) => ({
                          ...color,
                          [type]:
                            values[index] -
                            (palette.curves[scale.curves[type] ?? ""]?.values[
                              index
                            ] ?? 0),
                        })),
                      });
                    }
                  }}
                />
              );
            })}
        </ZStack>
        {index ? (
          <div style={{ flexShrink: 0, display: "flex", height: 32 }}>
            {Object.values(palette.scales)
              .filter(scale => scale.colors.length > parseInt(index))
              .map(scale => (
                <Link
                  to={`${routePrefix}/${paletteId}/scale/${scale.id}/${index}`}
                  replace={true}
                  getProps={({ isCurrent }) => {
                    const color = getColor(
                      palette.curves,
                      scale,
                      parseInt(index)
                    );
                    return {
                      style: {
                        width: "100%",
                        height: "100%",
                        backgroundColor: colorToHex(color),
                        boxShadow: isCurrent
                          ? `inset 0 3px 0 var(--color-background)`
                          : "none",
                      },
                    };
                  }}
                />
              ))}
          </div>
        ) : null}
      </div>
      <VStack
        style={{
          borderLeft: "1px solid var(--color-border, gainsboro)",
          width: 300,
          flexShrink: 0,
          overflow: "auto",
        }}
      >
        <VStack spacing={16} style={{ padding: 16 }}>
          <VStack spacing={4}>
            <label htmlFor="name" style={{ fontSize: 14 }}>
              Name
            </label>
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
          </VStack>
          <Button
            onClick={() => {
              send({ type: "DELETE_SCALE", paletteId, scaleId });
              navigate(`/${paletteId}`);
            }}
          >
            Delete scale
          </Button>
        </VStack>
        <Separator />
        <VStack spacing={16} style={{ padding: 16 }}>
          <span>Linked curves</span>
          <VStack spacing={4}>
            <label htmlFor="lightness-curve" style={{ fontSize: 14 }}>
              Hue curve
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 8,
              }}
            >
              <Select
                key={`${scale.name}-hue-curve`}
                id="hue-curve"
                value={scale.curves.hue}
                onChange={event =>
                  send({
                    type: "CHANGE_SCALE_CURVE",
                    paletteId,
                    scaleId,
                    curveType: "hue",
                    curveId: event.target.value,
                  })
                }
              >
                <option value="">None</option>
                {Object.values(palette.curves)
                  .filter(curve => curve.type === "hue")
                  .map(curve => (
                    <option key={curve.id} value={curve.id}>
                      {curve.name}
                    </option>
                  ))}
              </Select>
              <IconButton
                icon={PlusIcon}
                onClick={() =>
                  send({
                    type: "CREATE_CURVE_FROM_SCALE",
                    paletteId,
                    scaleId,
                    curveType: "hue",
                  })
                }
              />
            </div>
          </VStack>
          <VStack spacing={4}>
            <label htmlFor="saturation-curve" style={{ fontSize: 14 }}>
              Saturation curve
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 8,
              }}
            >
              <Select
                key={`${scale.name}-saturation-curve`}
                id="saturation-curve"
                value={scale.curves.saturation}
                onChange={event =>
                  send({
                    type: "CHANGE_SCALE_CURVE",
                    paletteId,
                    scaleId,
                    curveType: "saturation",
                    curveId: event.target.value,
                  })
                }
              >
                <option value="">None</option>
                {Object.values(palette.curves)
                  .filter(curve => curve.type === "saturation")
                  .map(curve => (
                    <option key={curve.id} value={curve.id}>
                      {curve.name}
                    </option>
                  ))}
              </Select>
              <IconButton
                icon={PlusIcon}
                onClick={() =>
                  send({
                    type: "CREATE_CURVE_FROM_SCALE",
                    paletteId,
                    scaleId,
                    curveType: "saturation",
                  })
                }
              />
            </div>
          </VStack>
          <VStack spacing={4}>
            <label htmlFor="lightness-curve" style={{ fontSize: 14 }}>
              Lightness curve
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 8,
              }}
            >
              <Select
                key={`${scale.name}-lightness-curve`}
                id="lightness-curve"
                value={scale.curves.lightness}
                onChange={event =>
                  send({
                    type: "CHANGE_SCALE_CURVE",
                    paletteId,
                    scaleId,
                    curveType: "lightness",
                    curveId: event.target.value,
                  })
                }
              >
                <option value="">None</option>
                {Object.values(palette.curves)
                  .filter(curve => curve.type === "lightness")
                  .map(curve => (
                    <option key={curve.id} value={curve.id}>
                      {curve.name}
                    </option>
                  ))}
              </Select>

              <IconButton
                icon={PlusIcon}
                onClick={() =>
                  send({
                    type: "CREATE_CURVE_FROM_SCALE",
                    paletteId,
                    scaleId,
                    curveType: "lightness",
                  })
                }
              />
            </div>
          </VStack>
        </VStack>
        {index ? (
          <>
            <Separator />
            <Color paletteId={paletteId} scaleId={scaleId} index={index} />
          </>
        ) : null}
      </VStack>
    </div>
  );
}
