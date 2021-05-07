import { Link, navigate, RouteComponentProps } from "@reach/router";
import React from "react";
import { Button } from "../components/button";
import { CurveEditor } from "../components/curve-editor";
import { Input } from "../components/input";
import { PlusIcon } from "../components/plus-icon";
import { Select } from "../components/select";
import { Separator } from "../components/separator";
import { HStack, VStack, ZStack } from "../components/stack";
import { useGlobalState } from "../global-state";
import { Curve } from "../types";
import { colorToHex, getColor, getRange } from "../utils";
import useMeasure from "react-use-measure";

export function Scale({
  paletteId = "",
  scaleId = "",
  children,
}: React.PropsWithChildren<
  RouteComponentProps<{ paletteId: string; scaleId: string }>
>) {
  const [state, send] = useGlobalState();
  const palette = state.context.palettes[paletteId];
  const scale = palette.scales[scaleId];
  // TODO: allow resizing
  const [ref, { width, height }] = useMeasure();

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
              <PlusIcon />
            </Button>
          </HStack>
        </div>
        <ZStack>
          <div
            ref={ref}
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
            }}
          >
            {scale.colors.map((_, index) => (
              <Link
                to={index.toString()}
                replace={true}
                getProps={({ isCurrent }) => {
                  const color = getColor(palette.curves, scale, index);
                  return {
                    style: {
                      width: "100%",
                      height: "100%",
                      backgroundColor: colorToHex(color),
                      boxShadow: isCurrent
                        ? `0 -1px 0 var(--color-background), 0 -3px 0 var(--color-text)`
                        : "none",
                    },
                  };
                }}
              />
            ))}
          </div>
          {(Object.entries(scale.curves) as [
            Curve["type"],
            string | undefined
          ][]).map(([type, curveId]) => {
            if (!curveId) return null;

            return (
              <CurveEditor
                values={palette.curves[curveId].values}
                {...getRange(type)}
                width={width}
                height={height}
                disabled
                label={`${type[0].toUpperCase()}`}
              />
            );
          })}
          {(["hue", "saturation", "lightness"] as const).map(type => {
            return (
              <CurveEditor
                values={scale.colors.map(
                  (color, index) => getColor(palette.curves, scale, index)[type]
                )}
                {...getRange(type)}
                width={width}
                height={height}
                label={`${type[0].toUpperCase()}`}
                onChange={(values, shiftKey, index) => {
                  if (index) {
                    navigate(index.toString());
                  }

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
      </div>
      <VStack
        style={{
          borderLeft: "1px solid var(--color-border, gainsboro)",
        }}
      >
        <VStack spacing={16} style={{ padding: 16 }}>
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
              <Button
                onClick={() =>
                  send({
                    type: "CREATE_CURVE_FROM_SCALE",
                    paletteId,
                    scaleId,
                    curveType: "hue",
                  })
                }
              >
                <PlusIcon />
              </Button>
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
              <Button
                onClick={() =>
                  send({
                    type: "CREATE_CURVE_FROM_SCALE",
                    paletteId,
                    scaleId,
                    curveType: "saturation",
                  })
                }
              >
                <PlusIcon />
              </Button>
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

              <Button
                onClick={() =>
                  send({
                    type: "CREATE_CURVE_FROM_SCALE",
                    paletteId,
                    scaleId,
                    curveType: "lightness",
                  })
                }
              >
                <PlusIcon />
              </Button>
            </div>
          </VStack>
        </VStack>
        <Separator />
        <div>{children}</div>
      </VStack>
    </div>
  );
}
