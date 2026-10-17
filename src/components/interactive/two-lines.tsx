"use client";

/**
 * Two equations ax + by = u and cx + dy = v drawn as lines on a grid, with sliders for the
 * coefficients. The readout works out the determinant ad − bc and says which case the lines are
 * in: crossing once (the point is marked), parallel with no solution, or the same line.
 */

import { useState } from "react";
import { clipLine, Grid, gridScale } from "./grid";
import { COLORS, format, Interactive, Slider } from "./kit";

type Name = "a" | "b" | "u" | "c" | "d" | "v";

type TwoLinesProps = {
  /** the first equation ax + by = u */
  a?: number;
  b?: number;
  u?: number;
  /** the second equation cx + dy = v */
  c?: number;
  d?: number;
  v?: number;
  /** which numbers get a slider; the second equation's by default */
  sliders?: Name[];
  /** slider range and step; the step keeps parallel and equal lines easy to reach */
  min?: number;
  max?: number;
  step?: number;
  /** smallest and largest x and y shown */
  x?: [number, number];
  y?: [number, number];
  caption?: string;
};

const close = (p: number, q: number) => Math.abs(p - q) < 1e-9;

// a number in brackets if it is negative, for writing products like 1 · (−2)
const paren = (n: number) => (n < 0 ? `(${format(n)})` : format(n));

function gcd(p: number, q: number): number {
  return q === 0 ? Math.abs(p) : gcd(q, p % q);
}

// top / bottom written exactly as a fraction when the coefficients are on quarter steps,
// otherwise as a decimal
function fraction(top: number, bottom: number) {
  const t = top * 4;
  const s = bottom * 4;
  if (!close(t, Math.round(t)) || !close(s, Math.round(s)))
    return format(top / bottom);
  let n = Math.round(t);
  let m = Math.round(s);
  const g = gcd(n, m);
  n /= g;
  m /= g;
  if (m < 0) {
    n = -n;
    m = -m;
  }
  return m === 1 ? format(n) : `${n < 0 ? "−" : ""}${Math.abs(n)}/${m}`;
}

// the left side px + qy written the usual way: no 1s, no 0 terms, minus signs joined in
function equation(p: number, q: number, r: number) {
  const terms: string[] = [];
  for (const [k, letter] of [
    [p, "x"],
    [q, "y"],
  ] as const) {
    if (k === 0) continue;
    const size = Math.abs(k) === 1 ? "" : format(Math.abs(k));
    if (terms.length === 0) terms.push(`${k < 0 ? "−" : ""}${size}${letter}`);
    else terms.push(`${k < 0 ? "−" : "+"} ${size}${letter}`);
  }
  return `${terms.length ? terms.join(" ") : "0"} = ${format(r)}`;
}

export function TwoLines({
  a: a0 = 1,
  b: b0 = 1,
  u: u0 = 5,
  c: c0 = 1,
  d: d0 = -1,
  v: v0 = 1,
  sliders = ["c", "d", "v"],
  min = -10,
  max = 10,
  step = 0.5,
  x: xRange = [-5, 5],
  y: yRange = [-5, 5],
  caption = "The first equation is ax + by = u, the second cx + dy = v. Move the sliders to change them.",
}: TwoLinesProps) {
  const starts = { a: a0, b: b0, u: u0, c: c0, d: d0, v: v0 };
  const [values, setValues] = useState(starts);
  const { a, b, u, c, d, v } = values;
  const { px, py } = gridScale(xRange, yRange);

  const det = a * d - b * c;
  const first = clipLine(a, b, u, xRange, yRange);
  const second = clipLine(c, d, v, xRange, yRange);
  const flat1 = a === 0 && b === 0;
  const flat2 = c === 0 && d === 0;
  // the second equation is a multiple of the first, so both draw the same line
  const same =
    !flat1 &&
    !flat2 &&
    close(a * d, b * c) &&
    close(a * v, u * c) &&
    close(b * v, u * d);

  // the crossing point, by the formula from the determinant test
  const point =
    det !== 0 ? { x: (d * u - b * v) / det, y: (a * v - c * u) / det } : null;
  const inView =
    point &&
    point.x >= xRange[0] &&
    point.x <= xRange[1] &&
    point.y >= yRange[0] &&
    point.y <= yRange[1];
  const pointText = point
    ? `(${fraction(d * u - b * v, det)}, ${fraction(a * v - c * u, det)})`
    : "";

  let verdict: string;
  if (point)
    verdict = `one crossing point, at ${pointText}${inView ? "" : ", off the picture"}`;
  else if ((flat1 && u !== 0) || (flat2 && v !== 0))
    verdict = `equation ${flat1 && u !== 0 ? 1 : 2} says ${format(0)} = ${format(flat1 && u !== 0 ? u : v)}, so no solution`;
  else if (flat1 || flat2)
    verdict = `equation ${flat1 ? 1 : 2} says 0 = 0, true everywhere, so infinitely many solutions`;
  else if (same) verdict = "the same line, so infinitely many solutions";
  else verdict = "parallel lines that never meet, so no solution";

  const lines = [
    { ends: first, color: COLORS.blue, dashed: false },
    { ends: second, color: COLORS.orange, dashed: same },
  ];

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>
            ad − bc = {paren(a)} · {paren(d)} − {paren(b)} · {paren(c)} ={" "}
            {format(det)}
          </div>
          <div className="mt-1 font-normal text-fd-muted-foreground">
            {det === 0 ? "zero: " : "not zero: "}
            {verdict}
          </div>
        </>
      }
      controls={sliders.map((name) => (
        <Slider
          key={name}
          label={<i>{name}</i>}
          value={values[name]}
          onChange={(value) => setValues((old) => ({ ...old, [name]: value }))}
          min={Math.min(min, starts[name])}
          max={Math.max(max, starts[name])}
          step={step}
        />
      ))}
    >
      <Grid
        x={xRange}
        y={yRange}
        label={`Graph of ${equation(a, b, u)} and ${equation(c, d, v)}`}
      >
        {lines.map(({ ends, color, dashed }, i) => {
          if (!ends) return null;
          const [[ax, ay], [bx, by]] = ends;
          return (
            <line
              key={i}
              x1={px(ax)}
              y1={py(ay)}
              x2={px(bx)}
              y2={py(by)}
              stroke={color}
              strokeWidth={2.5}
              strokeLinecap={dashed ? "butt" : "round"}
              strokeDasharray={dashed ? "10 8" : undefined}
            />
          );
        })}

        {point && inView && (
          <g>
            <circle
              cx={px(point.x)}
              cy={py(point.y)}
              r={4.5}
              fill="currentColor"
            />
            {/* a halo in the card colour keeps the label readable over grid and lines; near the
                right edge the label goes to the left of the point */}
            <text
              x={px(point.x) + (point.x > xRange[1] - 3 ? -9 : 9)}
              y={py(point.y) + (point.y > yRange[1] - 1 ? 18 : -9)}
              textAnchor={point.x > xRange[1] - 3 ? "end" : "start"}
              fontSize={13}
              fontWeight={600}
              fill="currentColor"
              stroke="var(--color-fd-card)"
              strokeWidth={4}
              paintOrder="stroke"
            >
              {pointText}
            </text>
          </g>
        )}
      </Grid>

      {/* a key matching each colour to its equation */}
      <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm tabular-nums">
        {lines.map(({ color, dashed }, i) => (
          <li key={i} className="flex items-center gap-2">
            <span
              className="inline-block w-5 border-t-3"
              style={{
                borderColor: color,
                borderStyle: dashed ? "dashed" : "solid",
              }}
            />
            {i === 0 ? equation(a, b, u) : equation(c, d, v)}
          </li>
        ))}
      </ul>
    </Interactive>
  );
}
