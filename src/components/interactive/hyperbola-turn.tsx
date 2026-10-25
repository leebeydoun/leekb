"use client";

/**
 * The graph of xy = 2 turned about the origin by an angle φ from 0 to π/2. The starting curve stays
 * faint, the turned curve and its turned guide lines (the axes, turned) are drawn bold, and the
 * readout gives the turned curve's equation from the rule for turning a graph: xy = 2 at 0,
 * y² − x² = 4 at π/4, xy = −2 at π/2, and in between −sin 2φ x² + 2cos 2φ xy + sin 2φ y² = 4.
 */

import { useId, useState } from "react";
import { Grid, clipLine, gridScale } from "./grid";
import { Button, COLORS, Interactive, Slider, format, useSmooth } from "./kit";

type Range = [number, number];
const X: Range = [-6, 6];
const Y: Range = [-6, 6];
const C = 2;
const STEP = Math.PI / 72; // 2.5°

// the points (t, c/t) of one branch, spaced evenly in log t, far enough out to leave the box
function branch(sign: 1 | -1) {
  const lo = Math.log(0.15);
  const hi = Math.log(12);
  return Array.from({ length: 241 }, (_, i) => {
    const t = sign * Math.exp(lo + ((hi - lo) * i) / 240);
    return [t, C / t] as const;
  });
}
const BRANCHES = [branch(1), branch(-1)];

const turn = (phi: number, [x, y]: readonly [number, number]) =>
  [
    x * Math.cos(phi) - y * Math.sin(phi),
    x * Math.sin(phi) + y * Math.cos(phi),
  ] as const;

// a coefficient and its letters, joined to the terms before it with the right sign
function terms(parts: [number, string][]) {
  const out: string[] = [];
  for (const [k, letters] of parts) {
    if (Math.abs(k) < 0.005) continue;
    const size =
      Math.abs(Number(k.toFixed(2))) === 1 ? "" : format(Math.abs(k));
    if (out.length === 0) out.push(`${k < 0 ? "−" : ""}${size}${letters}`);
    else out.push(`${k < 0 ? "−" : "+"} ${size}${letters}`);
  }
  return out.join(" ");
}

// the angle as a multiple of π where it is a tidy one, and in degrees
function angleName(phi: number) {
  const degrees = Math.round(((phi * 180) / Math.PI) * 10) / 10;
  const named: Record<number, string> = {
    0: "0",
    30: "π/6",
    45: "π/4",
    60: "π/3",
    90: "π/2",
  };
  const name = named[degrees] ?? format(phi);
  return `${name} (${format(degrees, 1)}°)`;
}

export function HyperbolaTurn() {
  const [steps, setSteps] = useState(0);
  const phi = steps * STEP;
  const shown = useSmooth(phi);
  const clip = useId();
  const { px, py } = gridScale(X, Y);

  const degrees = Math.round(((phi * 180) / Math.PI) * 10) / 10;
  const s2 = Math.sin(2 * phi);
  const c2 = Math.cos(2 * phi);

  let equation: string;
  let note: string;
  if (degrees === 0) {
    equation = "xy = 2";
    note = "The starting curve, hugging the axes.";
  } else if (degrees === 45) {
    equation = "y² − x² = 4";
    note =
      "An eighth of a turn: the xy term is gone, and the curve hugs the diagonals y = x and y = −x.";
  } else if (degrees === 90) {
    equation = "xy = −2";
    note =
      "A quarter turn: the branches have moved into the other two quarters of the plane.";
  } else {
    equation = `${terms([
      [-s2, "x²"],
      [2 * c2, "xy"],
      [s2, "y²"],
    ])} = 4`;
    note = `Put the point turned back by ${format(degrees, 1)}° into xy = 2, then double both sides.`;
  }

  const path = (pts: readonly (readonly [number, number])[]) =>
    pts
      .map((p) => {
        const [x, y] = turn(shown, p);
        return `${px(x).toFixed(1)},${py(y).toFixed(1)}`;
      })
      .join(" ");
  const plain = (pts: readonly (readonly [number, number])[]) =>
    pts.map(([x, y]) => `${px(x).toFixed(1)},${py(y).toFixed(1)}`).join(" ");

  // the turned axes: the lines through O in the directions φ and φ + π/2
  const guides = [shown, shown + Math.PI / 2]
    .map((a) => clipLine(-Math.sin(a), Math.cos(a), 0, X, Y))
    .filter((g) => g !== undefined);

  // the vertex (√2, √2) of the top right branch, turned
  const [vx, vy] = turn(shown, [Math.SQRT2, Math.SQRT2]);

  return (
    <Interactive
      readout={
        <>
          <div>
            Turned by {angleName(phi)}: {equation}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {note}
          </div>
        </>
      }
      controls={
        <>
          <Slider
            label={
              <>
                turn <i>φ</i>
              </>
            }
            value={steps}
            onChange={setSteps}
            min={0}
            max={36}
            step={1}
            show={(v) => `${format((v * 180) / 72, 1)}°`}
          />
          <div className="flex gap-2">
            <Button onClick={() => setSteps(0)}>0</Button>
            <Button onClick={() => setSteps(18)}>π/4</Button>
            <Button onClick={() => setSteps(36)}>π/2</Button>
          </div>
        </>
      }
    >
      <Grid
        x={X}
        y={Y}
        label={`The graph of xy = 2, drawn faint, and its image after a turn about the origin by ${format(degrees, 1)} degrees, whose equation is ${equation}.`}
      >
        <clipPath id={clip}>
          <rect
            x={px(X[0])}
            y={py(Y[1])}
            width={px(X[1]) - px(X[0])}
            height={py(Y[0]) - py(Y[1])}
          />
        </clipPath>
        <g clipPath={`url(#${clip})`}>
          {BRANCHES.map((b, i) => (
            <polyline
              key={`faint${i}`}
              points={plain(b)}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.35}
              strokeWidth={1.75}
              strokeDasharray="6 5"
            />
          ))}
          {guides.map(([p, q], i) => (
            <line
              key={`guide${i}`}
              x1={px(p[0])}
              y1={py(p[1])}
              x2={px(q[0])}
              y2={py(q[1])}
              stroke={COLORS.orange}
              strokeOpacity={0.8}
              strokeWidth={1.75}
              strokeDasharray="5 4"
            />
          ))}
          {BRANCHES.map((b, i) => (
            <polyline
              key={`bold${i}`}
              points={path(b)}
              fill="none"
              stroke={COLORS.blue}
              strokeWidth={2.75}
              strokeLinejoin="round"
            />
          ))}
        </g>
        <circle
          cx={px(vx)}
          cy={py(vy)}
          r={5}
          fill={COLORS.purple}
          stroke="var(--color-fd-card)"
          strokeWidth={2}
        />
      </Grid>
    </Interactive>
  );
}
