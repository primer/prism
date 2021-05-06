import { scaleLinear } from "d3-scale";
import React from "react";
import { DraggableCore } from "react-draggable";
import produce from "immer";
import { guard } from "color2k";

function round(num: number, step: number) {
  return Math.round(num * (1 / step)) / (1 / step);
}

type CurveEditorProps = {
  values: number[];
  min: number;
  max: number;
  step?: number;
  width?: number;
  height?: number;
  onChange?: (values: number[], shiftKey: boolean) => void;
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
  width = 500,
  height = 300,
  step = 0.1,
  disabled = false,
  label = "",
  style = {},
}: CurveEditorProps) {
  const nodeRadius = 12;
  const columnWidth = width / values.length;

  const xScale = React.useCallback(
    scaleLinear()
      .domain([0, values.length - 1])
      .range([columnWidth / 2, width - columnWidth / 2]),
    [values.length, width, columnWidth]
  );

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
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      fill="none"
      style={style}
      pointerEvents={disabled ? "none" : "all"}
    >
      <DraggableCore
        disabled={disabled}
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
        <g>
          <polyline
            stroke="black"
            opacity={disabled ? 0 : 0.1}
            strokeWidth={nodeRadius * 2}
            points={points.map(({ x, y }) => `${x},${y}`).join(" ")}
            strokeLinejoin="round"
            strokeLinecap="round"
            cursor={disabled ? "default" : "ns-resize"}
          />
          <polyline
            stroke={disabled ? "gray" : "black"}
            strokeWidth={1}
            points={points.map(({ x, y }) => `${x},${y}`).join(" ")}
            strokeLinejoin="round"
            pointerEvents="none"
          />
        </g>
      </DraggableCore>

      {points.map(({ x, y }, index) => (
        <DraggableCore
          key={index}
          disabled={disabled}
          onDrag={(event, data) => {
            onChange?.(
              produce(values, draft => {
                const value = guard(min, max, yScale.invert(y + data.deltaY));
                draft[index] = round(value, step);
              }),
              event.shiftKey
            );
          }}
        >
          <g>
            <circle
              cx={x}
              cy={y}
              r={nodeRadius}
              fill="black"
              opacity={disabled ? 0 : 0.1}
              cursor={disabled ? "default" : "ns-resize"}
            />
            <circle
              cx={x}
              cy={y}
              r={disabled ? 2 : 4}
              fill={disabled ? "gray" : "white"}
              stroke={disabled ? "none" : "black"}
              strokeWidth={1}
              pointerEvents="none"
            />
            {index === 0 ? (
              <text
                x={x - nodeRadius - 8}
                y={y}
                fill={disabled ? "gray" : "black"}
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
          </g>
        </DraggableCore>
      ))}
    </svg>
  );
}
