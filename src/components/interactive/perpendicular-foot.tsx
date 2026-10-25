"use client";

/**
 * A fixed line through P = (1, 2) with direction A = (2, 1), and a point X moved with sliders. The
 * diagram drops the perpendicular from X to the line, marks its foot F with a right angle, and
 * the readout gives F, the distance from X to the line, and the dot product (X − F) · A, which is
 * always 0.
 */

import { useState } from "react";
import { clipLine, Grid, gridScale } from "./grid";
import { COLORS, format, Interactive, Slider } from "./kit";

const X_RANGE: [number, number] = [-3, 7];
const Y_RANGE: [number, number] = [-2, 7];

// the line P + tA, which is x − 2y = −3
const P = { x: 1, y: 2 };
const A = { x: 2, y: 1 };
const A_SQUARED = A.x * A.x + A.y * A.y;

// a number inside a product in the readout: negatives go in brackets
const bracket = (n: number) => (n < 0 ? `(${format(n)})` : format(n));

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 5,
  strokeLinejoin: "round" as const,
  paintOrder: "stroke" as const,
};

export function PerpendicularFoot({
  caption = "Move X with the sliders. The foot F is where the dashed perpendicular from X meets the line, and the step from F to X always has dot product 0 with the direction A.",
}: {
  caption?: string;
}) {
  const [x, setX] = useState(2);
  const [y, setY] = useState(5);
  const { px, py } = gridScale(X_RANGE, Y_RANGE);

  // t0 = (X − P) · A / |A|², and F = P + t0 A
  const along = (x - P.x) * A.x + (y - P.y) * A.y;
  const t0 = along / A_SQUARED;
  const F = { x: P.x + t0 * A.x, y: P.y + t0 * A.y };
  const u = x - F.x;
  const v = y - F.y;
  const squared = u * u + v * v;
  const onLine = squared < 1e-9;
  const distance = Math.sqrt(squared);

  // the line x − 2y = −3, drawn across the whole grid
  const ends = clipLine(1, -2, -3, X_RANGE, Y_RANGE);

  // the right-angle mark at F: a small square with one side along A and one along X − F
  const mark = 12;
  const ax = A.x / Math.sqrt(A_SQUARED);
  const ay = A.y / Math.sqrt(A_SQUARED);
  // the unit step from F towards X, in grid units (the screen flips y)
  const nx = onLine ? 0 : u / distance;
  const ny = onLine ? 0 : v / distance;
  const Fs = { x: px(F.x), y: py(F.y) };
  // which way along the line the mark sits: away from P's side if possible, so it stays clear of
  // the label of A
  const side = t0 >= 1 ? -1 : 1;
  const c1 = { x: Fs.x + side * ax * mark, y: Fs.y - side * ay * mark };
  const c2 = {
    x: c1.x + nx * mark,
    y: c1.y - ny * mark,
  };
  const c3 = { x: Fs.x + nx * mark, y: Fs.y - ny * mark };

  // labels: X sits beyond X on the side away from the line, F on the other side of the line
  const Xs = { x: px(x), y: py(y) };
  const xLabel = onLine
    ? { x: Xs.x - 14, y: Xs.y - 14 }
    : { x: Xs.x + nx * 18, y: Xs.y - ny * 18 + 5 };
  const fLabel = onLine
    ? { x: Fs.x + 14, y: Fs.y + 20 }
    : { x: Fs.x - nx * 18, y: Fs.y + ny * 18 + 5 };

  // the arrow for the direction A, drawn from P
  const Ps = { x: px(P.x), y: py(P.y) };
  const Ae = { x: px(P.x + A.x), y: py(P.y + A.y) };

  const root =
    Math.abs(squared - Math.round(squared)) < 1e-9 &&
    Number.isInteger(Math.sqrt(Math.round(squared)))
      ? `√${format(squared)} = ${format(distance)}`
      : `√${format(squared)} ≈ ${format(distance)}`;

  return (
    <Interactive
      caption={caption}
      readout={
        onLine ? (
          <>
            <div>
              X = ({format(x)}, {format(y)}) is on the line, so F = X
            </div>
            <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
              The distance from X to the line is 0.
            </div>
          </>
        ) : (
          <>
            <div>
              t₀ = (X − P) · A / |A|² = {format(along)} / 5 = {format(t0)}, so F
              = ({format(F.x)}, {format(F.y)})
            </div>
            <div className="mt-1">
              (X − F) · A = {bracket(u)} · 2 + {bracket(v)} · 1 = 0
            </div>
            <div className="mt-1">
              distance from X to the line: |X − F| = {root}
            </div>
          </>
        )
      }
      controls={
        <>
          <Slider label="X: x" value={x} onChange={setX} min={-2} max={6} />
          <Slider label="X: y" value={y} onChange={setY} min={-1} max={6} />
        </>
      }
    >
      <Grid
        x={X_RANGE}
        y={Y_RANGE}
        label={
          onLine
            ? `The point X at (${format(x)}, ${format(y)}) lies on the line through (1, 2) with direction (2, 1), so it is its own foot.`
            : `The line through (1, 2) with direction (2, 1), and the point X at (${format(x)}, ${format(y)}). The perpendicular from X meets the line at F = (${format(F.x)}, ${format(F.y)}), a distance of about ${format(distance)}.`
        }
      >
        {ends && (
          <line
            x1={px(ends[0][0])}
            y1={py(ends[0][1])}
            x2={px(ends[1][0])}
            y2={py(ends[1][1])}
            stroke={COLORS.blue}
            strokeWidth={3}
            strokeLinecap="round"
          />
        )}
        {ends && (
          <text
            x={px(ends[1][0]) - 8}
            y={py(ends[1][1]) + 22}
            textAnchor="end"
            fontSize={15}
            fontWeight={700}
            fill={COLORS.blue}
            {...halo}
          >
            L
          </text>
        )}

        {/* the direction A, as an arrow from P */}
        <line
          x1={Ps.x}
          y1={Ps.y}
          x2={Ae.x - ax * 10}
          y2={Ae.y + ay * 10}
          stroke={COLORS.green}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <polygon
          points={`${Ae.x},${Ae.y} ${Ae.x - ax * 12 - ay * 5.5},${Ae.y + ay * 12 - ax * 5.5} ${Ae.x - ax * 12 + ay * 5.5},${Ae.y + ay * 12 + ax * 5.5}`}
          fill={COLORS.green}
        />
        <circle cx={Ps.x} cy={Ps.y} r={4} fill="currentColor" />
        <text
          x={Ps.x + 4}
          y={Ps.y + 22}
          fontSize={14}
          fontWeight={700}
          fill="currentColor"
          {...halo}
        >
          P
        </text>
        <text
          x={(Ps.x + Ae.x) / 2 + 2}
          y={(Ps.y + Ae.y) / 2 + 22}
          fontSize={14}
          fontWeight={700}
          fill={COLORS.green}
          {...halo}
        >
          A
        </text>

        {!onLine && (
          <>
            <line
              x1={Xs.x}
              y1={Xs.y}
              x2={Fs.x}
              y2={Fs.y}
              stroke={COLORS.orange}
              strokeWidth={2.5}
              strokeDasharray="6 4"
            />
            <polyline
              points={`${c1.x},${c1.y} ${c2.x},${c2.y} ${c3.x},${c3.y}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            />
          </>
        )}

        <circle cx={Fs.x} cy={Fs.y} r={5} fill={COLORS.purple} />
        <text
          x={fLabel.x}
          y={fLabel.y}
          textAnchor="middle"
          fontSize={15}
          fontWeight={700}
          fill={COLORS.purple}
          {...halo}
        >
          F
        </text>
        <circle cx={Xs.x} cy={Xs.y} r={6} fill={COLORS.orange} />
        <text
          x={xLabel.x}
          y={xLabel.y}
          textAnchor="middle"
          fontSize={15}
          fontWeight={700}
          fill={COLORS.orange}
          {...halo}
        >
          X
        </text>
      </Grid>
    </Interactive>
  );
}
