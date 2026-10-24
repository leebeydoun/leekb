"use client";

/**
 * A point P placed by its two coordinates. Sliders set x and y; dashed perpendiculars carry P to
 * the two axes, where its coordinates are read off, and the quadrant P lies in is shaded. A button
 * swaps the two numbers, to show that (a, b) and (b, a) are different points.
 */

import { useState } from "react";
import { Grid, gridScale } from "./grid";
import { Button, COLORS, format, Interactive, Slider, useSmooth } from "./kit";

type CoordinatePlotterProps = {
  /** the coordinates P starts at */
  x?: number;
  y?: number;
  caption?: string;
};

const RANGE: [number, number] = [-5, 5];

const NAMES = ["first", "second", "third", "fourth"];

/** where a point sits: a quadrant number from 1 to 4, or 0 for a point on an axis */
function quadrantOf(x: number, y: number) {
  if (x === 0 || y === 0) return 0;
  if (y > 0) return x > 0 ? 1 : 2;
  return x < 0 ? 3 : 4;
}

/** the sentence saying where P is */
function whereIs(x: number, y: number) {
  if (x === 0 && y === 0)
    return "P is the origin O, on both axes, so it is in no quadrant.";
  if (y === 0) return "P lies on the x-axis, so it is in no quadrant.";
  if (x === 0) return "P lies on the y-axis, so it is in no quadrant.";
  return `P is in the ${NAMES[quadrantOf(x, y) - 1]} quadrant.`;
}

/** the two moves from O to P, in words */
function route(x: number, y: number) {
  const across =
    x > 0 ? `${format(x)} right` : x < 0 ? `${format(-x)} left` : "0 across";
  const up = y > 0 ? `${format(y)} up` : y < 0 ? `${format(-y)} down` : "0 up";
  return `From O: ${across}, then ${up}.`;
}

export function CoordinatePlotter({
  x: x0 = 3,
  y: y0 = 2,
  caption,
}: CoordinatePlotterProps) {
  const [x, setX] = useState(x0);
  const [y, setY] = useState(y0);
  const sx = useSmooth(x);
  const sy = useSmooth(y);
  const { px, py } = gridScale(RANGE, RANGE);

  const q = quadrantOf(x, y);
  // the shaded quadrant, as the corner of the picture it reaches out to
  const corner =
    q === 0
      ? undefined
      : { x: q === 1 || q === 4 ? 5 : -5, y: q <= 2 ? 5 : -5 };

  const halo = {
    stroke: "var(--color-fd-card)",
    strokeWidth: 5,
    strokeLinejoin: "round" as const,
    paintOrder: "stroke" as const,
  };

  const p = { x: px(sx), y: py(sy) };

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>
            P = ({format(x)}, {format(y)})
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {route(x, y)} {whereIs(x, y)}
          </div>
        </>
      }
      controls={
        <>
          <Slider
            label={
              <>
                <i>x</i>-coordinate
              </>
            }
            value={x}
            onChange={setX}
            min={RANGE[0]}
            max={RANGE[1]}
            step={0.5}
          />
          <Slider
            label={
              <>
                <i>y</i>-coordinate
              </>
            }
            value={y}
            onChange={setY}
            min={RANGE[0]}
            max={RANGE[1]}
            step={0.5}
          />
          <Button
            onClick={() => {
              setX(y);
              setY(x);
            }}
          >
            Swap the two numbers
          </Button>
        </>
      }
    >
      <Grid
        x={RANGE}
        y={RANGE}
        label={`The point P at (${format(x)}, ${format(y)}), with dashed perpendiculars to the two axes. ${whereIs(x, y)}`}
      >
        {/* the quadrant P is in, lightly shaded */}
        {corner && (
          <rect
            x={Math.min(px(0), px(corner.x))}
            y={Math.min(py(0), py(corner.y))}
            width={Math.abs(px(corner.x) - px(0))}
            height={Math.abs(py(corner.y) - py(0))}
            fill={COLORS.blue}
            fillOpacity={0.08}
          />
        )}

        {/* the perpendiculars from P to the x-axis (orange) and to the y-axis (green) */}
        <line
          x1={p.x}
          y1={p.y}
          x2={p.x}
          y2={py(0)}
          stroke={COLORS.orange}
          strokeWidth={2}
          strokeDasharray="5 4"
        />
        <line
          x1={p.x}
          y1={p.y}
          x2={px(0)}
          y2={p.y}
          stroke={COLORS.green}
          strokeWidth={2}
          strokeDasharray="5 4"
        />

        {/* the feet, with the coordinates written over the axis numbers */}
        <circle cx={p.x} cy={py(0)} r={4} fill={COLORS.orange} />
        <circle cx={px(0)} cy={p.y} r={4} fill={COLORS.green} />
        <text
          x={p.x}
          y={py(0) + 16}
          textAnchor="middle"
          fontSize={13}
          fontWeight={700}
          fill={COLORS.orange}
          {...halo}
        >
          {format(x)}
        </text>
        <text
          x={px(0) - 7}
          y={p.y + 4}
          textAnchor="end"
          fontSize={13}
          fontWeight={700}
          fill={COLORS.green}
          {...halo}
        >
          {format(y)}
        </text>

        <circle cx={px(0)} cy={py(0)} r={3.5} fill="currentColor" />

        {/* the point itself, named on the side away from the axes */}
        <circle cx={p.x} cy={p.y} r={6} fill={COLORS.blue} />
        <text
          x={p.x + (x < 0 ? -10 : 10)}
          y={p.y + (y < 0 ? 18 : -9)}
          textAnchor={x < 0 ? "end" : "start"}
          fontSize={15}
          fontWeight={700}
          fill={COLORS.blue}
          {...halo}
        >
          P
        </text>
      </Grid>
    </Interactive>
  );
}
