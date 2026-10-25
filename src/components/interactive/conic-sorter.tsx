"use client";

/**
 * ConicSorter: sliders for A, B and C draw the graph of Ax² + Bxy + Cy² = 4 on a grid, and the
 * readout sorts it by the sign of B² − 4AC. It also gives the turn θ that removes the xy term and
 * the tidy equation A′u² + C′v² = 4 that turning back by θ leaves. The curve is traced by marching
 * squares: the sign of Ax² + Bxy + Cy² − 4 is found at the corners of small squares, and wherever it
 * changes along an edge the curve crosses that edge.
 */

import { useId, useState } from "react";
import { Grid, gridScale } from "./grid";
import { COLORS, Interactive, Slider, format, useSmooth } from "./kit";

type Range = [number, number];

const VIEW: Range = [-5, 5];
const CELLS = 120;
const RIGHT = 4;

// a number inside a product, in brackets when negative: 4 · 2 · (−1.5)
const term = (n: number) => (n < 0 ? `(${format(n)})` : format(n));

// "2.5x² − 3xy + 2.5y²" with no 1s and no 0 terms, in the letters given
function quadratic(a: number, b: number, c: number, [p, q]: [string, string]) {
  const parts: string[] = [];
  for (const [k, name] of [
    [a, `${p}²`],
    [b, `${p}${q}`],
    [c, `${q}²`],
  ] as const) {
    if (Math.abs(k) < 1e-9) continue;
    const size = Math.abs(Math.abs(k) - 1) < 1e-9 ? "" : format(Math.abs(k));
    if (parts.length === 0) parts.push(`${k < 0 ? "−" : ""}${size}${name}`);
    else parts.push(`${k < 0 ? "−" : "+"} ${size}${name}`);
  }
  return parts.length ? parts.join(" ") : "0";
}

/** the turn θ in [0, π/2) that removes the xy term: 0 when B = 0, else 2θ in (0, π) with tan 2θ = B/(A − C) */
function turnAngle(a: number, b: number, c: number) {
  if (b === 0) return 0;
  const double = Math.atan2(b, a - c) + (b < 0 ? Math.PI : 0);
  return double / 2;
}

/** the coefficients of u² and v² after the substitution x = u cos θ − v sin θ, y = u sin θ + v cos θ */
function turned(a: number, b: number, c: number, t: number) {
  const co = Math.cos(t);
  const si = Math.sin(t);
  return {
    a: a * co * co + b * si * co + c * si * si,
    c: a * si * si - b * si * co + c * co * co,
  };
}

/** the curve f(x, y) = 0 inside the view, as one svg path of short segments */
function contour(f: (x: number, y: number) => number) {
  const [lo, hi] = VIEW;
  const { px, py } = gridScale(VIEW, VIEW);
  const step = (hi - lo) / CELLS;
  const values: number[][] = [];
  for (let i = 0; i <= CELLS; i++) {
    const row: number[] = [];
    for (let j = 0; j <= CELLS; j++) row.push(f(lo + i * step, lo + j * step));
    values.push(row);
  }
  const parts: string[] = [];
  const at = (x: number, y: number) =>
    `${px(x).toFixed(1)},${py(y).toFixed(1)}`;
  for (let i = 0; i < CELLS; i++)
    for (let j = 0; j < CELLS; j++) {
      const x0 = lo + i * step;
      const y0 = lo + j * step;
      // corners anticlockwise from the bottom left
      const v = [
        values[i]![j]!,
        values[i + 1]![j]!,
        values[i + 1]![j + 1]!,
        values[i]![j + 1]!,
      ];
      const corner: [number, number][] = [
        [x0, y0],
        [x0 + step, y0],
        [x0 + step, y0 + step],
        [x0, y0 + step],
      ];
      const inside = v.map((w) => w > 0);
      // where the curve crosses each edge (bottom, right, top, left), if it does
      const cross: (string | null)[] = [0, 1, 2, 3].map((e) => {
        const n = (e + 1) % 4;
        if (inside[e] === inside[n]) return null;
        const s = v[e]! / (v[e]! - v[n]!);
        const [ax, ay] = corner[e]!;
        const [bx, by] = corner[n]!;
        return at(ax + s * (bx - ax), ay + s * (by - ay));
      });
      const hits = cross.filter((p): p is string => p !== null);
      if (hits.length === 2) parts.push(`M${hits[0]}L${hits[1]}`);
      else if (hits.length === 4) {
        // a saddle: the value at the centre decides which corners the curve keeps together
        const centre = f(x0 + step / 2, y0 + step / 2) > 0;
        if (centre === inside[0])
          parts.push(`M${cross[0]}L${cross[1]}M${cross[2]}L${cross[3]}`);
        else parts.push(`M${cross[3]}L${cross[0]}M${cross[1]}L${cross[2]}`);
      }
    }
  return parts.join("");
}

type Verdict = { family: string; color: string; drawn: boolean };

function sort(a: number, c: number, d: number): Verdict {
  if (Math.abs(a) < 1e-9 && Math.abs(c) < 1e-9)
    return {
      family:
        "with A, B and C all 0 the equation says 0 = 4, so there is nothing to draw",
      color: "currentColor",
      drawn: false,
    };
  if (d < -1e-9) {
    if (a > 0)
      return {
        family:
          Math.abs(a - c) < 1e-9
            ? "negative, so an ellipse, here a circle"
            : "negative, so an ellipse",
        color: COLORS.blue,
        drawn: true,
      };
    return {
      family:
        "negative, the ellipse family, but the left side is never positive, so nothing to draw",
      color: "currentColor",
      drawn: false,
    };
  }
  if (d > 1e-9)
    return {
      family: "positive, so a hyperbola",
      color: COLORS.orange,
      drawn: true,
    };
  if (a + c > 0)
    return {
      family:
        "zero, the parabola family; with no x or y term it is two parallel lines",
      color: COLORS.purple,
      drawn: true,
    };
  return {
    family:
      "zero, the parabola family, but the left side is never positive, so nothing to draw",
    color: "currentColor",
    drawn: false,
  };
}

/** Ax² + Bxy + Cy² = 4 drawn from three sliders, and sorted by B² − 4AC. */
export function ConicSorter({
  a: startA = 2.5,
  b: startB = -3,
  c: startC = 2.5,
  caption,
}: {
  a?: number;
  b?: number;
  c?: number;
  caption?: string;
}) {
  const [a, setA] = useState(startA);
  const [b, setB] = useState(startB);
  const [c, setC] = useState(startC);
  const sa = useSmooth(a);
  const sb = useSmooth(b);
  const sc = useSmooth(c);
  const clip = useId();
  const { px, py } = gridScale(VIEW, VIEW);

  const d = b * b - 4 * a * c;
  const t = turnAngle(a, b, c);
  const tidy = turned(a, b, c, t);
  const verdict = sort(tidy.a, tidy.c, d);

  // the drawing follows the smoothed numbers, so the curve glides as a slider moves
  const path = contour((x, y) => sa * x * x + sb * x * y + sc * y * y - RIGHT);
  const ts = turnAngle(sa, sb, sc);
  const axes = [
    [Math.cos(ts), Math.sin(ts)],
    [-Math.sin(ts), Math.cos(ts)],
  ] as const;

  const exact = (n: number) => Math.abs(Number(n.toFixed(2)) - n) < 1e-9;
  const degrees = (t * 180) / Math.PI;
  const turnLine =
    b === 0
      ? "There is no xy term, so no turn is needed: θ = 0."
      : `Turning back by θ ${exact(degrees) ? "=" : "≈"} ${format(degrees, 1)}° (${format(t)} radians) gives ${quadratic(
          tidy.a,
          0,
          tidy.c,
          ["u", "v"],
        )} ${exact(tidy.a) && exact(tidy.c) ? "=" : "≈"} 4.`;

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>{quadratic(a, b, c, ["x", "y"])} = 4</div>
          <div className="mt-1">
            B² − 4AC = {term(b)}² − 4 · {term(a)} · {term(c)} = {format(d)}:{" "}
            <span style={{ color: verdict.drawn ? verdict.color : undefined }}>
              {verdict.family}
            </span>
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {turnLine}
          </div>
        </>
      }
      controls={
        <>
          <Slider
            label={<i>A</i>}
            value={a}
            onChange={setA}
            min={-3}
            max={3}
            step={0.5}
          />
          <Slider
            label={<i>B</i>}
            value={b}
            onChange={setB}
            min={-3}
            max={3}
            step={0.5}
          />
          <Slider
            label={<i>C</i>}
            value={c}
            onChange={setC}
            min={-3}
            max={3}
            step={0.5}
          />
        </>
      }
    >
      <Grid
        x={VIEW}
        y={VIEW}
        label={`Graph of ${quadratic(a, b, c, ["x", "y"])} = 4. B² − 4AC = ${format(d)}: ${verdict.family}.`}
      >
        <clipPath id={clip}>
          <rect
            x={px(VIEW[0])}
            y={py(VIEW[1])}
            width={px(VIEW[1]) - px(VIEW[0])}
            height={py(VIEW[0]) - py(VIEW[1])}
          />
        </clipPath>
        <g clipPath={`url(#${clip})`}>
          {sb !== 0 &&
            axes.map(([ux, uy], i) => (
              <line
                key={i}
                x1={px(-8 * ux)}
                y1={py(-8 * uy)}
                x2={px(8 * ux)}
                y2={py(8 * uy)}
                stroke={COLORS.green}
                strokeWidth={1.5}
                strokeDasharray="5 5"
                strokeOpacity={0.8}
              />
            ))}
          <path
            d={path}
            fill="none"
            stroke={verdict.drawn ? verdict.color : COLORS.blue}
            strokeWidth={2.75}
            strokeLinecap="round"
          />
        </g>
      </Grid>
    </Interactive>
  );
}
