"use client";

/**
 * A positive number and its reciprocal. The top line shows x, the bottom line 1/x, joined by a
 * line. As x grows its reciprocal shrinks, so their product stays 1, and they meet at 1. With a
 * second number y > x the joining lines cross, showing that reciprocals swap the order.
 */

import { useState } from "react";
import {
  Axis,
  COLORS,
  Dot,
  Interactive,
  Slider,
  format,
  lineScale,
} from "./kit";

const WIDTH = 600;
const TOP_Y = 44;
const BOTTOM_Y = 150;
const FROM = 0;
const TO = 4;
const SMALLEST = 0.25;
// the smallest gap kept between x and y, so their dots don't sit on top of each other
const GAP = 0.25;

// 1/x written exactly when two decimal places are enough, and with ≈ when they aren't
function reciprocal(n: number) {
  const r = 1 / n;
  const exact = Math.abs(Number(r.toFixed(2)) - r) < 1e-9;
  return `${exact ? "=" : "≈"} ${format(r)}`;
}

export function ReciprocalSlider({
  x: initialX = 2,
  y: initialY = 3,
  pair = false,
}: {
  x?: number;
  y?: number;
  /** also show a second number y > x, to see the reciprocals swap order */
  pair?: boolean;
}) {
  const [x, setX] = useState(initialX);
  const [y, setY] = useState(initialY);
  const { x: at } = lineScale(FROM, TO, WIDTH);

  // keep x below y when both are shown
  function changeX(v: number) {
    const next = pair ? Math.min(v, TO - GAP) : v;
    setX(next);
    if (pair && y < next + GAP) setY(next + GAP);
  }
  function changeY(v: number) {
    const next = Math.max(v, SMALLEST + GAP);
    setY(next);
    if (x > next - GAP) setX(next - GAP);
  }

  const points = [
    { n: x, name: "x", color: COLORS.blue },
    ...(pair ? [{ n: y, name: "y", color: COLORS.orange }] : []),
  ];

  // the labels under 1/x and 1/y, pushed apart when the two are close (1/x is the bigger one)
  const gap = at(1 / x) - at(1 / y);
  const nudge = pair && gap < 40 ? (40 - gap) / 2 : 0;

  const readout = pair ? (
    <>
      <div>
        {format(x)} &lt; {format(y)}, but 1/{format(x)} {reciprocal(x)} is
        bigger than 1/{format(y)} {reciprocal(y)}: the order swaps
      </div>
      <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
        Each product is still 1: x × 1/x = 1 and y × 1/y = 1.
      </div>
    </>
  ) : (
    <>
      x = {format(x)} and 1/x {reciprocal(x)}, and x × 1/x = 1
    </>
  );

  return (
    <Interactive
      readout={readout}
      controls={
        <>
          <Slider
            label="x"
            value={x}
            onChange={changeX}
            min={SMALLEST}
            max={TO}
            step={0.05}
          />
          {pair && (
            <Slider
              label="y"
              value={y}
              onChange={changeY}
              min={SMALLEST}
              max={TO}
              step={0.05}
            />
          )}
        </>
      }
    >
      <svg
        viewBox={`0 0 ${WIDTH} 204`}
        className="mx-auto block h-auto w-full max-w-2xl text-fd-foreground"
        role="img"
        aria-label={`Two number lines: ${points.map((p) => `${p.name} = ${format(p.n)} and 1/${p.name} ${reciprocal(p.n)}`).join("; ")}`}
      >
        <Axis from={FROM} to={TO} y={TOP_Y} width={WIDTH} />
        <Axis from={FROM} to={TO} y={BOTTOM_Y} width={WIDTH} />

        {points.map((p) => (
          <line
            key={p.name}
            x1={at(p.n)}
            y1={TOP_Y}
            x2={at(1 / p.n)}
            y2={BOTTOM_Y}
            stroke={p.color}
            strokeWidth={1.5}
            opacity={0.6}
          />
        ))}
        {points.map((p) => (
          <g key={p.name}>
            <Dot cx={at(p.n)} cy={TOP_Y} color={p.color} label={p.name} />
            <Dot cx={at(1 / p.n)} cy={BOTTOM_Y} color={p.color} />
            <text
              x={at(1 / p.n) + (p.name === "x" ? 1 : -1) * nudge}
              y={BOTTOM_Y + 44}
              textAnchor="middle"
              fontSize={14}
              fontWeight={600}
              fill={p.color}
            >
              1/{p.name}
            </text>
          </g>
        ))}
      </svg>
    </Interactive>
  );
}
