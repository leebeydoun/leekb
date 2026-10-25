"use client";

/**
 * The region under y = x² from 0 to 1, cut into n strips of equal width. In each strip a blue
 * rectangle fits under the curve (as tall as the curve at the strip's left edge) and an orange one
 * reaches over it (as tall as the curve at the right edge). A slider for n shows the two totals
 * closing in on each other, a gap of exactly 1/n, with 1/3 always between them.
 */

import { useState } from "react";
import { COLORS, Interactive, Slider, format } from "./kit";

const UNIT = 360;
const LEFT = 40;
const TOP = 24;
const BOTTOM = 30;
const RIGHT = 30;
const WIDTH = LEFT + UNIT + RIGHT;
const HEIGHT = TOP + UNIT + BOTTOM;

const px = (x: number) => LEFT + x * UNIT;
const py = (y: number) => TOP + (1 - y) * UNIT;

const TICKS = [0.25, 0.5, 0.75, 1];

// the curve, as a polyline
const CURVE = Array.from({ length: 201 }, (_, i) => {
  const x = i / 200;
  return `${px(x).toFixed(1)},${py(x * x).toFixed(1)}`;
}).join(" ");

/** 1² + 2² + ⋯ + m², by the formula for the sum of the first m squares */
const squares = (m: number) => (m * (m + 1) * (2 * m + 1)) / 6;

export function RectangleSqueeze({
  start = 10,
  caption = "Move n. The orange showing above the blue rectangles is the gap between the two totals, which is exactly 1/n.",
}: {
  start?: number;
  caption?: string;
}) {
  const [n, setN] = useState(start);
  const inner = squares(n - 1) / n ** 3;
  const outer = squares(n) / n ** 3;
  const strips = Array.from({ length: n }, (_, i) => i);

  const readout = (
    <>
      n = {n}: inner{" "}
      <span style={{ color: COLORS.blue }}>{format(inner, 3)}</span>, outer{" "}
      <span style={{ color: COLORS.orange }}>{format(outer, 3)}</span>, gap{" "}
      {format(1 / n, 3)}, and 1/3 = 0.333 between them
    </>
  );

  return (
    <Interactive
      caption={caption}
      readout={readout}
      controls={
        <Slider
          label="number of strips n"
          value={n}
          onChange={setN}
          min={1}
          max={50}
          show={(v) => String(v)}
        />
      }
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-md text-fd-foreground"
        role="img"
        aria-label={`The curve y = x² from x = 0 to 1, cut into ${n} strips of width 1/${n}. Orange rectangles reach up to the curve at the right edge of each strip and cover the region under it; blue rectangles reach up to the curve at the left edge and fit under it. The blue total is ${format(inner, 3)} and the orange total is ${format(outer, 3)}.`}
      >
        {/* a light grid every quarter */}
        <g className="text-fd-border" stroke="currentColor" strokeWidth={1}>
          {TICKS.map((t) => (
            <g key={t}>
              <line x1={px(t)} x2={px(t)} y1={py(0)} y2={py(1)} />
              <line x1={px(0)} x2={px(1)} y1={py(t)} y2={py(t)} />
            </g>
          ))}
        </g>

        {/* the outer rectangles first, so the inner ones sit in front of them */}
        {strips.map((i) => {
          const h = ((i + 1) / n) ** 2;
          return (
            <rect
              key={`o${i}`}
              x={px(i / n)}
              y={py(h)}
              width={UNIT / n}
              height={py(0) - py(h)}
              fill={COLORS.orange}
              fillOpacity={0.3}
              stroke={COLORS.orange}
              strokeWidth={n > 30 ? 0.75 : 1.25}
            />
          );
        })}
        {strips.map((i) => {
          const h = (i / n) ** 2;
          if (h === 0) return null;
          return (
            <rect
              key={`i${i}`}
              x={px(i / n)}
              y={py(h)}
              width={UNIT / n}
              height={py(0) - py(h)}
              fill={COLORS.blue}
              fillOpacity={0.55}
              stroke={COLORS.blue}
              strokeWidth={n > 30 ? 0.75 : 1.25}
            />
          );
        })}

        <polyline
          points={CURVE}
          fill="none"
          stroke={COLORS.purple}
          strokeWidth={3}
          strokeLinejoin="round"
        />

        {/* axes */}
        <g stroke="currentColor" strokeWidth={1.5}>
          <line x1={px(0)} x2={px(1) + 12} y1={py(0)} y2={py(0)} />
          <line x1={px(0)} x2={px(0)} y1={py(0)} y2={py(1) - 12} />
        </g>
        <g fontSize={11} className="fill-fd-muted-foreground">
          {TICKS.map((t) => (
            <g key={t}>
              <text x={px(t)} y={py(0) + 16} textAnchor="middle">
                {t}
              </text>
              <text x={px(0) - 6} y={py(t) + 4} textAnchor="end">
                {t}
              </text>
            </g>
          ))}
        </g>
        <text
          x={px(1) + 16}
          y={py(0) + 4}
          fontSize={14}
          fontStyle="italic"
          fill="currentColor"
        >
          x
        </text>
        <text
          x={px(0) - 4}
          y={py(1) - 14}
          fontSize={14}
          fontStyle="italic"
          fill="currentColor"
          textAnchor="end"
        >
          y
        </text>
        <text
          x={px(0.62)}
          y={py(0.62 * 0.62) - 14}
          fontSize={14}
          fill={COLORS.purple}
          stroke="var(--color-fd-card)"
          strokeWidth={4}
          paintOrder="stroke"
          textAnchor="end"
        >
          y = x²
        </text>
      </svg>
    </Interactive>
  );
}
