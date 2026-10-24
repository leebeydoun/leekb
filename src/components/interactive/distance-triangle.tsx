"use client";

/**
 * Two points P and Q on a grid, and the right triangle that measures the distance between them:
 * across from P to the corner R, then up or down from R to Q. The readout works through the
 * distance formula step by step, and says what happens when the points are level and the
 * triangle flattens.
 */

import { useState } from "react";
import { Grid, gridScale } from "./grid";
import { COLORS, format, Interactive, Slider } from "./kit";

type DistanceTriangleProps = {
  /** where P and Q start, as [x, y] */
  p?: [number, number];
  q?: [number, number];
  caption?: string;
};

const RANGE: [number, number] = [-5, 5];

// a number written so that it can be subtracted or squared safely: negatives go in brackets
const bracket = (n: number) => (n < 0 ? `(${format(n)})` : format(n));

/** √n, written as a whole number when n is a perfect square, otherwise with a decimal */
function root(n: number) {
  const r = Math.sqrt(n);
  if (Number.isInteger(r)) return `√${format(n)} = ${format(r)}`;
  return `√${format(n)} ≈ ${format(r)}`;
}

export function DistanceTriangle({
  p: [x1_0, y1_0] = [-2, -1],
  q: [x2_0, y2_0] = [2, 2],
  caption,
}: DistanceTriangleProps) {
  const [x1, setX1] = useState(x1_0);
  const [y1, setY1] = useState(y1_0);
  const [x2, setX2] = useState(x2_0);
  const [y2, setY2] = useState(y2_0);
  const { px, py } = gridScale(RANGE, RANGE);

  const dx = x2 - x1;
  const dy = y2 - y1;
  const sum = dx * dx + dy * dy;

  const P = { x: px(x1), y: py(y1) };
  const Q = { x: px(x2), y: py(y2) };
  const R = { x: px(x2), y: py(y1) };

  const halo = {
    stroke: "var(--color-fd-card)",
    strokeWidth: 5,
    strokeLinejoin: "round" as const,
    paintOrder: "stroke" as const,
  };

  // what the readout adds under the working
  let note: string;
  if (dx === 0 && dy === 0)
    note = "P and Q are the same point, so the distance is 0.";
  else if (dy === 0)
    note = `P and Q are level, so there is no triangle: the distance is |x₂ − x₁| = ${format(Math.abs(dx))}.`;
  else if (dx === 0)
    note = `Q is straight ${dy > 0 ? "above" : "below"} P, so there is no triangle: the distance is |y₂ − y₁| = ${format(Math.abs(dy))}.`;
  else
    note = `The legs PR and RQ have lengths ${format(Math.abs(dx))} and ${format(Math.abs(dy))}, and PQ is the hypotenuse.`;

  // the square mark at R, on the inside of the triangle
  const mark = 11;
  const sx = dx > 0 ? -1 : 1; // from R back towards P, across
  const sy = dy > 0 ? -1 : 1; // from R towards Q, in screen units (y grows downwards)

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>
            x₂ − x₁ = {format(x2)} − {bracket(x1)} = {format(dx)} and y₂ − y₁ ={" "}
            {format(y2)} − {bracket(y1)} = {format(dy)}
          </div>
          <div className="mt-1">
            d(P, Q) = √({bracket(dx)}² + {bracket(dy)}²) = √(
            {format(dx * dx)} + {format(dy * dy)}) = {root(sum)}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {note}
          </div>
        </>
      }
      controls={
        <>
          <Slider label="P: x₁" value={x1} onChange={setX1} min={-5} max={5} />
          <Slider label="P: y₁" value={y1} onChange={setY1} min={-5} max={5} />
          <Slider label="Q: x₂" value={x2} onChange={setX2} min={-5} max={5} />
          <Slider label="Q: y₂" value={y2} onChange={setY2} min={-5} max={5} />
        </>
      }
    >
      <Grid
        x={RANGE}
        y={RANGE}
        label={`P at (${format(x1)}, ${format(y1)}) and Q at (${format(x2)}, ${format(y2)}), with the corner R at (${format(x2)}, ${format(y1)}). The distance from P to Q is ${root(sum)}.`}
      >
        {/* the triangle, lightly filled */}
        {dx !== 0 && dy !== 0 && (
          <polygon
            points={`${P.x},${P.y} ${R.x},${R.y} ${Q.x},${Q.y}`}
            fill={COLORS.blue}
            fillOpacity={0.08}
          />
        )}

        {/* the legs: across (orange) and up or down (green) */}
        {dx !== 0 && (
          <line
            x1={P.x}
            y1={P.y}
            x2={R.x}
            y2={R.y}
            stroke={COLORS.orange}
            strokeWidth={3}
            strokeDasharray={dy === 0 ? undefined : "6 4"}
          />
        )}
        {dy !== 0 && (
          <line
            x1={R.x}
            y1={R.y}
            x2={Q.x}
            y2={Q.y}
            stroke={COLORS.green}
            strokeWidth={3}
            strokeDasharray={dx === 0 ? undefined : "6 4"}
          />
        )}

        {/* the square corner at R */}
        {dx !== 0 && dy !== 0 && (
          <path
            d={`M ${R.x + sx * mark} ${R.y} L ${R.x + sx * mark} ${R.y + sy * mark} L ${R.x} ${R.y + sy * mark}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          />
        )}

        {/* the distance itself */}
        {dx !== 0 && dy !== 0 && (
          <line
            x1={P.x}
            y1={P.y}
            x2={Q.x}
            y2={Q.y}
            stroke={COLORS.blue}
            strokeWidth={3}
            strokeLinecap="round"
          />
        )}

        {/* leg lengths, outside the triangle */}
        {dx !== 0 && (
          <text
            x={(P.x + R.x) / 2}
            y={R.y + (dy > 0 ? 20 : -10)}
            textAnchor="middle"
            fontSize={13}
            fontWeight={700}
            fill={COLORS.orange}
            {...halo}
          >
            {format(Math.abs(dx))}
          </text>
        )}
        {dy !== 0 && (
          <text
            x={R.x + (dx > 0 ? 10 : -10)}
            y={(R.y + Q.y) / 2 + 4}
            textAnchor={dx > 0 ? "start" : "end"}
            fontSize={13}
            fontWeight={700}
            fill={COLORS.green}
            {...halo}
          >
            {format(Math.abs(dy))}
          </text>
        )}

        {/* the corner R, then the two points on top */}
        {dx !== 0 && dy !== 0 && (
          <>
            <circle cx={R.x} cy={R.y} r={4.5} fill="currentColor" />
            <text
              x={R.x + (dx > 0 ? 9 : -9)}
              y={R.y + (dy > 0 ? 17 : -8)}
              textAnchor={dx > 0 ? "start" : "end"}
              fontSize={14}
              fontWeight={700}
              fill="currentColor"
              {...halo}
            >
              R
            </text>
          </>
        )}
        {[
          // with the points level or equal, P's name goes on the left so the two names stay apart
          { at: P, name: "P", away: { x: -dx || -1, y: -dy } },
          { at: Q, name: "Q", away: { x: dx, y: dy } },
        ].map(({ at, name, away }) => (
          <g key={name}>
            <circle cx={at.x} cy={at.y} r={6} fill={COLORS.blue} />
            <text
              x={at.x + (away.x < 0 ? -10 : 10)}
              y={at.y + (away.y < 0 ? 18 : -9)}
              textAnchor={away.x < 0 ? "end" : "start"}
              fontSize={15}
              fontWeight={700}
              fill={COLORS.blue}
              {...halo}
            >
              {name}
            </text>
          </g>
        ))}
      </Grid>
    </Interactive>
  );
}
