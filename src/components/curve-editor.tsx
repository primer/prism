import { Box } from "@primer/react";
import { guard } from "color2k";
import { scaleLinear } from "d3-scale";
import produce from "immer";
import React from "react";
import { DraggableCore } from "react-draggable";
import useMeasure from "react-use-measure";

function round(num: number, step: number) {
  return Math.round(num * (1 / step)) / (1 / step);
}

type CurveEditorProps = {
  values: number[];
  min: number;
  max: number;
  step?: number;
  onChange?: (values: number[], shiftKey: boolean, index?: number) => void;
  disabled?: boolean;
  label?: string;
  style?: React.SVGAttributes<SVGSVGElement>["style"];
};

// TODO: arrow key support
// TODO: snap to guides
// TODO: focus status
// TODO: label
export function CurveEditor({
  values,
  min,
  max,
  onChange,
  step = 0.1,
  disabled = false,
  label = "",
  style = {},
}: CurveEditorProps) {
  const [ref, { width, height }] = useMeasure();
  const nodeRadius = 20;
  const columnWidth = width / values.length;
  const [dragging, setDragging] = React.useState<number | "line" | false>(
    false
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const xScale = React.useCallback(
    scaleLinear()
      .domain([0, values.length - 1])
      .range([columnWidth / 2, width - columnWidth / 2]),
    [values.length, width, columnWidth]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const yScale = React.useCallback(
    scaleLinear()
      .domain([min, max])
      .range([height - nodeRadius, nodeRadius]),
    [min, max, height, nodeRadius]
  );

  const points = React.useMemo(
    () =>
      values.map((value, index) => ({ x: xScale(index), y: yScale(value) })),
    [values, xScale, yScale]
  );

  return (
    <svg
      ref={ref}
      width="100%"
      height="100%"
      fill="none"
      style={style}
      pointerEvents="none"
      opacity={disabled ? 0.5 : 1}
    >
      <DraggableCore
        disabled={disabled}
        onStart={() => setDragging("line")}
        onStop={() => setDragging(false)}
        onDrag={(event, data) => {
          const delta =
            yScale.invert(points[0].y + data.deltaY) -
            yScale.invert(points[0].y);

          const clampedDelta = values.reduce((acc, value) => {
            if (value + acc < min) {
              return min - value;
            }

            if (value + acc > max) {
              return max - value;
            }

            return acc;
          }, delta);

          onChange?.(
            values.map(value => round(value + clampedDelta, step)),
            event.shiftKey
          );
        }}
      >
        <Box
          as="g"
          pointerEvents={
            disabled || (dragging !== false && dragging !== "line")
              ? "none"
              : "all"
          }
          sx={{
            "& .target": {
              opacity: dragging === "line" ? 1 : 0,
            },
            "&:hover .target": {
              opacity: 1,
            },
          }}
        >
          <polyline
            className="target"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth={nodeRadius * 2}
            points={points.map(({ x, y }) => `${x},${y}`).join(" ")}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {!disabled ? (
            <polyline
              stroke="white"
              strokeWidth={4}
              points={points.map(({ x, y }) => `${x},${y}`).join(" ")}
              strokeLinejoin="round"
              opacity={0.5}
            />
          ) : (
            <polyline
              stroke="white"
              strokeWidth={2}
              points={points.map(({ x, y }) => `${x},${y}`).join(" ")}
              strokeLinejoin="round"
            />
          )}
        </Box>
      </DraggableCore>

      {points.map(({ x, y }, index) => (
        <DraggableCore
          key={index}
          disabled={disabled}
          onStart={() => setDragging(index)}
          onStop={() => setDragging(false)}
          onDrag={(event, data) => {
            onChange?.(
              produce(values, draft => {
                const value = guard(min, max, yScale.invert(y + data.deltaY));
                draft[index] = round(value, step);
              }),
              event.shiftKey,
              index
            );
          }}
        >
          <Box
            as="g"
            pointerEvents={
              disabled || (dragging !== false && dragging !== index)
                ? "none"
                : "all"
            }
            sx={{
              "& .target": {
                opacity: dragging === index ? 1 : 0,
              },
              "&:hover .target": {
                opacity: 1,
              },
            }}
          >
            <circle
              className="target"
              cx={x}
              cy={y}
              r={nodeRadius}
              fill="rgba(0,0,0,0.1)"
              style={{ transformOrigin: `${x}px ${y}px` }}
            />
            {!disabled ? (
              <>
                <circle
                  className="border"
                  cx={x}
                  cy={y}
                  r={8.5}
                  fill="none"
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="1"
                />
                <circle className="handle" cx={x} cy={y} r={8} fill={"white"} />
              </>
            ) : (
              <circle
                className="node-handle"
                cx={x}
                cy={y}
                r={4}
                fill="white"
              />
            )}

            {index === 0 ? (
              <text
                x={x - nodeRadius - 8}
                y={y}
                fill="black"
                style={{
                  textTransform: "uppercase",
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 14,
                  lineHeight: 1,
                }}
                textAnchor="end"
                alignmentBaseline="middle"
              >
                {label}
              </text>
            ) : null}
          </Box>
        </DraggableCore>
      ))}
    </svg>
  );
}
