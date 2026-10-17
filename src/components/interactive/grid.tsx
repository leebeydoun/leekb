"use client";

/**
 * The square grid with x and y axes used by the interactive line diagrams, drawn in the same style
 * as the static graph: a light grid, axes with arrowheads, and small numbers along the axes.
 */

import type { ReactNode } from "react";
import { format } from "./kit";

const SIZE = 400;
const PAD = 24;

/** the layout of a grid showing x from x0 to x1 and y from y0 to y1, one scale for both axes */
export function gridScale(
  [x0, x1]: [number, number],
  [y0, y1]: [number, number],
) {
  const unit = SIZE / Math.max(x1 - x0, y1 - y0);
  return {
    unit,
    width: (x1 - x0) * unit + PAD * 2,
    height: (y1 - y0) * unit + PAD * 2,
    px: (x: number) => PAD + (x - x0) * unit,
    py: (y: number) => PAD + (y1 - y) * unit,
  };
}

/** the two points where ax + by = c leaves the box, or nothing if it misses the box entirely */
export function clipLine(
  a: number,
  b: number,
  c: number,
  [x0, x1]: [number, number],
  [y0, y1]: [number, number],
) {
  const hits: [number, number][] = [];
  const near = (v: number, lo: number, hi: number) =>
    v >= lo - 1e-9 && v <= hi + 1e-9;
  if (b !== 0)
    for (const x of [x0, x1]) {
      const y = (c - a * x) / b;
      if (near(y, y0, y1)) hits.push([x, y]);
    }
  if (a !== 0)
    for (const y of [y0, y1]) {
      const x = (c - b * y) / a;
      if (near(x, x0, x1)) hits.push([x, y]);
    }
  if (hits.length < 2) return undefined;
  // a line through a corner hits two edges at the same point, so take the two furthest apart
  hits.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  return [hits[0]!, hits[hits.length - 1]!] as const;
}

/** an svg with the grid and axes drawn, and whatever is passed as children on top */
export function Grid({
  x: [x0, x1],
  y: [y0, y1],
  label,
  children,
}: {
  x: [number, number];
  y: [number, number];
  label: string;
  children: ReactNode;
}) {
  const { width, height, px, py } = gridScale([x0, x1], [y0, y1]);
  const range = (lo: number, hi: number) =>
    Array.from(
      { length: Math.floor(hi) - Math.ceil(lo) + 1 },
      (_, i) => Math.ceil(lo) + i,
    );
  const xs = range(x0, x1);
  const ys = range(y0, y1);
  // an axis sits at 0 if 0 is in view, otherwise along the edge
  const axisX = x0 <= 0 && 0 <= x1 ? 0 : x0;
  const axisY = y0 <= 0 && 0 <= y1 ? 0 : y0;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="mx-auto block h-auto w-full max-w-md text-fd-foreground"
      role="img"
      aria-label={label}
    >
      {/* light grid, one square per unit */}
      <g className="text-fd-border" stroke="currentColor" strokeWidth={1}>
        {xs.map((x) => (
          <line key={`gx${x}`} x1={px(x)} x2={px(x)} y1={py(y0)} y2={py(y1)} />
        ))}
        {ys.map((y) => (
          <line key={`gy${y}`} x1={px(x0)} x2={px(x1)} y1={py(y)} y2={py(y)} />
        ))}
      </g>

      {/* axes, with arrowheads at the positive ends */}
      <g stroke="currentColor" strokeWidth={1.5}>
        <line x1={px(x0)} x2={px(x1) + 10} y1={py(axisY)} y2={py(axisY)} />
        <line x1={px(axisX)} x2={px(axisX)} y1={py(y0)} y2={py(y1) - 10} />
      </g>
      <polygon
        fill="currentColor"
        points={`${px(x1) + 14},${py(axisY)} ${px(x1) + 6},${py(axisY) - 4} ${px(x1) + 6},${py(axisY) + 4}`}
      />
      <polygon
        fill="currentColor"
        points={`${px(axisX)},${py(y1) - 14} ${px(axisX) - 4},${py(y1) - 6} ${px(axisX) + 4},${py(y1) - 6}`}
      />
      <text
        x={px(x1) + 4}
        y={py(axisY) - 10}
        fontSize={14}
        fontStyle="italic"
        fill="currentColor"
      >
        x
      </text>
      <text
        x={px(axisX) + 10}
        y={py(y1) - 4}
        fontSize={14}
        fontStyle="italic"
        fill="currentColor"
      >
        y
      </text>

      {/* numbers along the axes, skipping 0 where the axes cross */}
      <g fontSize={11} className="fill-fd-muted-foreground">
        {xs
          .filter((x) => x !== axisX)
          .map((x) => (
            <text
              key={`tx${x}`}
              x={px(x)}
              y={py(axisY) + 15}
              textAnchor="middle"
            >
              {format(x)}
            </text>
          ))}
        {ys
          .filter((y) => y !== axisY)
          .map((y) => (
            <text
              key={`ty${y}`}
              x={px(axisX) - 6}
              y={py(y) + 4}
              textAnchor="end"
            >
              {format(y)}
            </text>
          ))}
      </g>

      {children}
    </svg>
  );
}
