"use client";

/**
 * A disc of radius 1 with a grid laid over it, stretched away from an upright line L through its
 * centre. One slider sets the stretch a. Every grid square becomes a rectangle a times as wide,
 * the squares inside the disc become rectangles inside the stretched shape, and the readout shows
 * the inner count and the area both multiplied by a.
 */

import { useState } from "react";
import { COLORS, Interactive, Slider, format, useSmooth } from "./kit";
import { planeScale } from "./moving-shape";

const C = 0.25; // the side of a grid square
const STEPS = Math.round(1 / C);
const { width, height, unit, px } = planeScale(-2.6, 2.6, -1.15, 1.15, 70);

// the grid squares lying wholly inside the disc of radius 1, by their bottom-left corners
const INNER: { x: number; y: number }[] = [];
for (let i = -STEPS; i < STEPS; i++)
  for (let j = -STEPS; j < STEPS; j++) {
    const far = Math.max(
      Math.hypot(i * C, j * C),
      Math.hypot((i + 1) * C, j * C),
      Math.hypot(i * C, (j + 1) * C),
      Math.hypot((i + 1) * C, (j + 1) * C),
    );
    if (far <= 1) INNER.push({ x: i * C, y: j * C });
  }

export function StretchDisc() {
  const [a, setA] = useState(2);
  const shown = useSmooth(a);

  const inner = INNER.length * C * C;
  const o = px({ x: 0, y: 0 });
  const lines = Array.from(
    { length: 2 * STEPS + 1 },
    (_, k) => (k - STEPS) * C,
  );

  return (
    <Interactive
      readout={
        <>
          <div>
            inner count {format(inner, 4)} → {format(inner * a, 4)}, area π ≈
            3.14 → π × {format(a)} ≈ {format(Math.PI * a)}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {a === 1
              ? "A stretch by 1 moves nothing."
              : `Each ${C} by ${C} square becomes a rectangle ${C} tall and ${format(C * a, 4)} wide, so every count, and the area between them, is multiplied by ${format(a)}.`}
          </div>
        </>
      }
      controls={
        <Slider
          label={
            <>
              stretch <i>a</i>
            </>
          }
          value={a}
          onChange={setA}
          min={0.25}
          max={2.5}
          step={0.25}
        />
      }
      caption="Stretch the disc away from the upright line L. The grid squares inside it become rectangles inside the stretched shape, all with a times the area."
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto block h-auto w-full max-w-lg text-fd-foreground"
        role="img"
        aria-label={`A disc of radius 1 stretched by ${format(a)} away from an upright line through its centre, into an ellipse of area about ${format(Math.PI * a)}.`}
      >
        {/* the grid squares inside the disc, carried along by the stretch */}
        {INNER.map(({ x, y }, i) => {
          const corner = px({ x: x * shown, y: y + C });
          return (
            <rect
              key={i}
              x={corner.x}
              y={corner.y}
              width={C * shown * unit}
              height={C * unit}
              fill={COLORS.blue}
              fillOpacity={0.25}
            />
          );
        })}
        {/* the stretched grid lines */}
        <g stroke="currentColor" strokeOpacity={0.18} strokeWidth={1}>
          {lines.map((t) => {
            const top = px({ x: t * shown, y: 1 });
            const bottom = px({ x: t * shown, y: -1 });
            const left = px({ x: -shown, y: t });
            const right = px({ x: shown, y: t });
            return (
              <g key={t}>
                <line x1={top.x} y1={top.y} x2={bottom.x} y2={bottom.y} />
                <line x1={left.x} y1={left.y} x2={right.x} y2={right.y} />
              </g>
            );
          })}
        </g>
        {/* the disc before the stretch, faint, and the stretched shape */}
        <circle
          cx={o.x}
          cy={o.y}
          r={unit}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />
        <ellipse
          cx={o.x}
          cy={o.y}
          rx={shown * unit}
          ry={unit}
          fill="none"
          stroke={COLORS.blue}
          strokeWidth={2.5}
        />
        {/* the line L, which stays put */}
        <line
          x1={o.x}
          y1={px({ x: 0, y: 1.15 }).y}
          x2={o.x}
          y2={px({ x: 0, y: -1.15 }).y}
          stroke={COLORS.purple}
          strokeWidth={2}
        />
        <text
          x={o.x + 8}
          y={px({ x: 0, y: 1.02 }).y}
          fontSize={16}
          fontStyle="italic"
          fill={COLORS.purple}
          stroke="var(--color-fd-card)"
          strokeWidth={4}
          paintOrder="stroke"
        >
          L
        </text>
      </svg>
    </Interactive>
  );
}
