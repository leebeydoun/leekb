"use client";

/**
 * Parabolas on a grid, one idea each. ParabolaCrossings moves y = ax² + bx + c up and down with
 * a slider for c, and counts where it crosses the x-axis against the sign of b² − 4ac.
 * ParabolaVertex slides y = (x − s)² + k sideways with a slider for s, leaving the starting curve
 * faint, to show that the vertex is the point (s, k).
 */

import { useId, useState } from "react";
import { Grid, gridScale } from "./grid";
import { COLORS, Dot, Interactive, Slider, format, useSmooth } from "./kit";

type Range = [number, number];

// a number inside a product or a sum, in brackets when negative: 4 · 1 · (−3)
const term = (n: number) => (n < 0 ? `(${format(n)})` : format(n));

// "x = 3" when two decimal places are exact, otherwise "x ≈ 3.45"
function at(n: number) {
  const exact = Math.abs(Number(n.toFixed(2)) - n) < 1e-9;
  return `x ${exact ? "=" : "≈"} ${format(n)}`;
}

// ax² + bx + c written the usual way: no 1s, no 0 terms, minus signs joined in
function polynomial(a: number, b: number, c: number) {
  const terms: string[] = [];
  for (const [k, power] of [
    [a, "x²"],
    [b, "x"],
    [c, ""],
  ] as const) {
    if (k === 0) continue;
    const size = Math.abs(k) === 1 && power ? "" : format(Math.abs(k));
    if (terms.length === 0) terms.push(`${k < 0 ? "−" : ""}${size}${power}`);
    else terms.push(`${k < 0 ? "−" : "+"} ${size}${power}`);
  }
  return terms.length ? terms.join(" ") : "0";
}

/** the curve y = f(x) across the grid, cut off at the edge of the box */
function Curve({
  f,
  x: xRange,
  y: yRange,
  color,
  faint = false,
}: {
  f: (x: number) => number;
  x: Range;
  y: Range;
  color: string;
  faint?: boolean;
}) {
  const id = useId();
  const { px, py } = gridScale(xRange, yRange);
  const [x0, x1] = xRange;
  const [y0, y1] = yRange;
  // enough points for the curve to look smooth, kept from shooting far off the picture
  const span = y1 - y0;
  const points: string[] = [];
  const steps = 200;
  for (let i = 0; i <= steps; i++) {
    const x = x0 + ((x1 - x0) * i) / steps;
    const y = Math.max(y0 - span, Math.min(y1 + span, f(x)));
    points.push(`${px(x).toFixed(1)},${py(y).toFixed(1)}`);
  }
  return (
    <g>
      <clipPath id={id}>
        <rect
          x={px(x0)}
          y={py(y1)}
          width={px(x1) - px(x0)}
          height={py(y0) - py(y1)}
        />
      </clipPath>
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={faint ? 1.75 : 2.5}
        strokeOpacity={faint ? 0.35 : 1}
        strokeDasharray={faint ? "6 5" : undefined}
        strokeLinejoin="round"
        clipPath={`url(#${id})`}
      />
    </g>
  );
}

// a label with a halo in the card colour, so it stays readable over the grid and the curve
const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

/** y = ax² + bx + c moved up and down by c: how many times it crosses the x-axis. */
export function ParabolaCrossings({
  a = 1,
  b = -2,
  c: initialC = -3,
  min = -5,
  max = 4,
  step = 0.5,
  x: xRange = [-4, 6],
  y: yRange = [-7, 5],
}: {
  a?: number;
  b?: number;
  /** the number c at the start */
  c?: number;
  /** the slider runs from min to max in steps of step */
  min?: number;
  max?: number;
  step?: number;
  /** smallest and largest x and y shown */
  x?: Range;
  y?: Range;
}) {
  const [c, setC] = useState(initialC);
  const shown = useSmooth(c);
  const { px, py } = gridScale(xRange, yRange);

  const d = b * b - 4 * a * c;
  const roots =
    d > 1e-9
      ? [(-b - Math.sqrt(d)) / (2 * a), (-b + Math.sqrt(d)) / (2 * a)].sort(
          (p, q) => p - q,
        )
      : Math.abs(d) <= 1e-9
        ? [-b / (2 * a)]
        : [];
  // the crossings of the curve as drawn, which glides on its way to the new c
  const dShown = b * b - 4 * a * shown;
  const drawn =
    dShown >= 0
      ? [(-b - Math.sqrt(dShown)) / (2 * a), (-b + Math.sqrt(dShown)) / (2 * a)]
      : [];

  const working = `${term(b)}² − 4 · ${term(a)} · ${term(c)} = ${format(d)}`;
  const verdict =
    roots.length === 2
      ? `positive, so it crosses twice, at ${at(roots[0]!)} and ${at(roots[1]!)}`
      : roots.length === 1
        ? `zero, so it just touches the x-axis, at x = ${format(roots[0]!)}`
        : "negative, so it never reaches the x-axis";

  return (
    <Interactive
      readout={
        <>
          <div>b² − 4ac = {working}</div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            y = {polynomial(a, b, c)}: {verdict}.
          </div>
        </>
      }
      controls={
        <Slider
          label={
            <>
              number <i>c</i>
            </>
          }
          value={c}
          onChange={setC}
          min={min}
          max={max}
          step={step}
        />
      }
    >
      <Grid
        x={xRange}
        y={yRange}
        label={`Graph of y = ${polynomial(a, b, c)}, crossing the x-axis ${roots.length} times`}
      >
        <Curve
          f={(x) => a * x * x + b * x + shown}
          x={xRange}
          y={yRange}
          color={COLORS.blue}
        />
        {drawn.map((r, i) =>
          r >= xRange[0] && r <= xRange[1] ? (
            <Dot key={i} cx={px(r)} cy={py(0)} color={COLORS.orange} />
          ) : null,
        )}
      </Grid>
    </Interactive>
  );
}

/** y = (x − s)² + k slid sideways by s: the vertex is the point (s, k). */
export function ParabolaVertex({
  s: initialS = 2,
  k = -2,
  min = -3,
  max = 3,
  step = 0.5,
  x: xRange = [-5, 5],
  y: yRange = [-3, 7],
}: {
  /** the number s at the start */
  s?: number;
  /** the fixed number k */
  k?: number;
  /** the slider runs from min to max in steps of step */
  min?: number;
  max?: number;
  step?: number;
  /** smallest and largest x and y shown */
  x?: Range;
  y?: Range;
}) {
  const [s, setS] = useState(initialS);
  const shown = useSmooth(s);
  const { px, py } = gridScale(xRange, yRange);

  const inside =
    s === 0 ? "x²" : `(x ${s > 0 ? "−" : "+"} ${format(Math.abs(s))})²`;
  const tail = k === 0 ? "" : ` ${k < 0 ? "−" : "+"} ${format(Math.abs(k))}`;
  const start = `y = x²${tail}`;
  const moved =
    s === 0
      ? "This is the starting curve, with its lowest point on the y-axis."
      : `This is ${start} moved ${format(Math.abs(s))} to the ${s > 0 ? "right" : "left"}.`;

  // the vertex label goes below the point, where the curve rising either side can't cover it
  const vx = px(shown);
  const vy = py(k);

  return (
    <Interactive
      readout={
        <>
          <div>
            y = {inside}
            {tail}: lowest point ({format(s)}, {format(k)})
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {moved} The square is never negative, so y is smallest, {format(k)},
            when x = {format(s)}.
          </div>
        </>
      }
      controls={
        <Slider
          label={
            <>
              shift <i>s</i>
            </>
          }
          value={s}
          onChange={setS}
          min={min}
          max={max}
          step={step}
        />
      }
    >
      <Grid
        x={xRange}
        y={yRange}
        label={`Graph of y = ${inside}${tail}, with its vertex at (${format(s)}, ${format(k)})`}
      >
        <Curve
          f={(x) => x * x + k}
          x={xRange}
          y={yRange}
          color="currentColor"
          faint
        />
        <Curve
          f={(x) => (x - shown) ** 2 + k}
          x={xRange}
          y={yRange}
          color={COLORS.blue}
        />
        {/* the axis of symmetry through the vertex */}
        <line
          x1={vx}
          x2={vx}
          y1={py(yRange[1])}
          y2={py(yRange[0])}
          stroke={COLORS.orange}
          strokeOpacity={0.5}
          strokeDasharray="4 4"
          strokeWidth={1.5}
        />
        <Dot cx={vx} cy={vy} color={COLORS.orange} />
        <text
          x={vx}
          y={vy + 22}
          textAnchor="middle"
          fontSize={13}
          fontWeight={600}
          fill={COLORS.orange}
          {...halo}
        >
          ({format(s)}, {format(k)})
        </text>
      </Grid>
    </Interactive>
  );
}
