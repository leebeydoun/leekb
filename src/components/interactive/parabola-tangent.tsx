"use client";

/**
 * The parabola y = x² and the line y = 2x + k, with a slider for k. All the lines have slope 2, so
 * they are parallel, and moving k slides the line up and down. Where the line meets the parabola,
 * x² = 2x + k, that is x² − 2x − k = 0, whose discriminant is 4 + 4k. The picture marks the meeting
 * points, and the readout counts them with the discriminant: two when k > −1, one when k = −1
 * (the tangent at (1, 1)), and none when k < −1.
 */

import { useState } from "react";
import { clipLine, Grid, gridScale } from "./grid";
import { Button, COLORS, format, Interactive, Slider, useSmooth } from "./kit";

const X: [number, number] = [-2, 4];
const Y: [number, number] = [-3, 7];

// a number inside a sum, in brackets when negative: 4 + 4 · (−0.5)
const term = (n: number) => (n < 0 ? `(${format(n)})` : format(n));

// "+ 1.5" or "− 1.5", or nothing for 0
const plus = (n: number) =>
  n === 0 ? "" : ` ${n < 0 ? "−" : "+"} ${format(Math.abs(n))}`;

// a point (x, x²) written with "=" when two decimal places are exact and "≈" otherwise
function point(x: number) {
  const exact = Math.abs(Number(x.toFixed(2)) - x) < 1e-9;
  return `${exact ? "" : "≈ "}(${format(x)}, ${format(x * x)})`;
}

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

export function ParabolaTangent({
  k: start = 0.5,
  caption = "Slide the line y = 2x + k up and down. Every position has slope 2, but only one of them meets the parabola exactly once.",
}: {
  /** the number k at the start */
  k?: number;
  caption?: string;
}) {
  const [k, setK] = useState(start);
  const shown = useSmooth(k);
  const { px, py } = gridScale(X, Y);

  // the curve y = x², cut off where it leaves the top of the picture
  const top = Math.sqrt(Y[1]);
  const curve = Array.from({ length: 161 }, (_, i) => {
    const x = -Math.min(-X[0], top) + ((Math.min(-X[0], top) + top) * i) / 160;
    return `${px(x).toFixed(1)},${py(x * x).toFixed(1)}`;
  }).join(" ");

  // the line as drawn, gliding on its way to the new k: 2x − y = −k
  const ends = clipLine(2, -1, -shown, X, Y);
  const dShown = 4 + 4 * shown;
  const drawn =
    dShown > 1e-9
      ? [1 - Math.sqrt(1 + shown), 1 + Math.sqrt(1 + shown)]
      : Math.abs(dShown) <= 1e-9
        ? [1]
        : [];

  // the readout uses the slider's value itself
  const d = 4 + 4 * k;
  const touching = Math.abs(d) < 1e-9;
  const roots =
    d > 1e-9
      ? [1 - Math.sqrt(1 + k), 1 + Math.sqrt(1 + k)]
      : touching
        ? [1]
        : [];
  const working = `4 + 4 · ${term(k)} = ${format(d)}`;
  const verdict =
    roots.length === 2
      ? `Positive, so the line crosses the parabola twice, at ${point(roots[0]!)} and ${point(roots[1]!)}.`
      : touching
        ? "Zero, so the line touches the parabola once, at (1, 1): it is the tangent there."
        : "Negative, so the line misses the parabola, passing below it.";
  const lineColor = touching ? COLORS.green : COLORS.purple;

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>
            y = 2x{plus(k)}: discriminant {working}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            x² = 2x{plus(k)} means x² − 2x{plus(-k)} = 0. {verdict}
          </div>
        </>
      }
      controls={
        <>
          <Slider
            label={
              <>
                number <i>k</i>
              </>
            }
            value={k}
            onChange={setK}
            min={-3}
            max={1.5}
            step={0.25}
          />
          <Button onClick={() => setK(-1)}>k = −1</Button>
        </>
      }
    >
      <Grid
        x={X}
        y={Y}
        label={`The parabola y = x² and the line y = 2x${plus(k)}, meeting ${roots.length === 0 ? "nowhere" : roots.length === 1 ? "once, at (1, 1)" : "twice"}.`}
      >
        <polyline
          points={curve}
          fill="none"
          stroke={COLORS.blue}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <text
          x={px(-1.9)}
          y={py(5.2)}
          fontSize={14}
          fontWeight={600}
          fill={COLORS.blue}
          {...halo}
        >
          y = x²
        </text>
        {ends && (
          <line
            x1={px(ends[0][0])}
            y1={py(ends[0][1])}
            x2={px(ends[1][0])}
            y2={py(ends[1][1])}
            stroke={lineColor}
            strokeWidth={2.5}
          />
        )}
        {drawn.map((x, i) => (
          <circle
            key={i}
            cx={px(x)}
            cy={py(x * x)}
            r={6}
            fill={COLORS.orange}
            stroke="var(--color-fd-card)"
            strokeWidth={2}
          />
        ))}
        {touching && (
          <text
            x={px(1) + 12}
            y={py(1) + 20}
            fontSize={13}
            fontWeight={600}
            fill={COLORS.green}
            {...halo}
          >
            tangent at (1, 1)
          </text>
        )}
      </Grid>
    </Interactive>
  );
}
