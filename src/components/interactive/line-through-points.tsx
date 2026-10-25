"use client";

/**
 * Two points P and Q with whole-number coordinates, chosen with sliders, and the line through
 * them. The readout writes the same line two ways: as the points P + t(Q − P), and as an equation
 * ax + by = c with the smallest whole numbers that work, so you can watch the two descriptions
 * change together.
 */

import { useState } from "react";
import { clipLine, Grid, gridScale } from "./grid";
import { COLORS, format, Interactive, Slider } from "./kit";

const RANGE: [number, number] = [-6, 6];

type Pair = [number, number];

const pair = ([x, y]: Pair) => `(${format(x)}, ${format(y)})`;

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 5,
  strokeLinejoin: "round" as const,
  paintOrder: "stroke" as const,
};

function gcd(m: number, n: number): number {
  m = Math.abs(m);
  n = Math.abs(n);
  while (n) [m, n] = [n, m % n];
  return m;
}

/**
 * The equation a2 x − a1 y = a2 p1 − a1 p2 of the line through P with direction A, divided by the
 * largest whole number that goes into both coefficients, and with the first non-zero coefficient
 * made positive.
 */
function equation([p1, p2]: Pair, [a1, a2]: Pair) {
  let a = a2;
  let b = -a1;
  let c = a2 * p1 - a1 * p2;
  const g = gcd(a, b);
  a /= g;
  b /= g;
  c /= g;
  if (a < 0 || (a === 0 && b < 0)) {
    a = -a;
    b = -b;
    c = -c;
  }
  // 0 + 0 would print as "−0"
  return { a: a + 0, b: b + 0, c: c + 0 };
}

/** ax + by = c written as a person would: no 1x, no 0y, and a minus sign in place of + −  */
function written(a: number, b: number, c: number) {
  const term = (k: number, name: string) =>
    Math.abs(k) === 1 ? name : `${format(Math.abs(k))}${name}`;
  let left = "";
  if (a !== 0) left = `${a < 0 ? "−" : ""}${term(a, "x")}`;
  if (b !== 0) {
    if (left) left += b < 0 ? ` − ${term(b, "y")}` : ` + ${term(b, "y")}`;
    else left = `${b < 0 ? "−" : ""}${term(b, "y")}`;
  }
  return `${left} = ${format(c)}`;
}

/** a fraction in lowest terms, with the sign on top */
function fraction(top: number, bottom: number) {
  const g = gcd(top, bottom);
  let n = top / g;
  let d = bottom / g;
  if (d < 0) {
    n = -n;
    d = -d;
  }
  return d === 1 ? format(n) : `${format(n)}/${format(d)}`;
}

export function LineThroughPoints({
  p: [p1_0, p2_0] = [-3, -1],
  q: [q1_0, q2_0] = [3, 3],
  caption = "Move P and Q with the sliders. Both lines of the readout describe the blue line: the first lists its points, the second tests them.",
}: {
  /** where P and Q start, as [x, y] */
  p?: Pair;
  q?: Pair;
  caption?: string;
}) {
  const [p1, setP1] = useState(p1_0);
  const [p2, setP2] = useState(p2_0);
  const [q1, setQ1] = useState(q1_0);
  const [q2, setQ2] = useState(q2_0);
  const { px, py } = gridScale(RANGE, RANGE);

  const P: Pair = [p1, p2];
  const Q: Pair = [q1, q2];
  const step: Pair = [q1 - p1, q2 - p2];
  const same = step[0] === 0 && step[1] === 0;
  const { a, b, c } = equation(P, step);
  const ends = same ? undefined : clipLine(a, b, c, RANGE, RANGE);

  const at = ([x, y]: Pair) => ({ x: px(x), y: py(y) });

  // a point's name goes on the side away from the other point, so the two names never meet
  function mark(point: Pair, other: Pair, name: string, color: string) {
    const s = at(point);
    const right =
      point[0] > other[0] || (point[0] === other[0] && point[0] >= 0);
    const up = point[1] > other[1] || (point[1] === other[1] && point[1] >= 0);
    return (
      <g key={name}>
        <circle cx={s.x} cy={s.y} r={6} fill={color} />
        <text
          x={s.x + (right ? 10 : -10)}
          y={s.y + (up ? -10 : 21)}
          textAnchor={right ? "start" : "end"}
          fontSize={15}
          fontWeight={700}
          fill={color}
          {...halo}
        >
          {name}
        </text>
      </g>
    );
  }

  let note: string;
  if (step[0] === 0)
    note = `Q − P points straight up or down, so this is the vertical line x = ${format(p1)}. It has no slope.`;
  else if (step[1] === 0)
    note = `Q − P points straight across, so this is the horizontal line y = ${format(p2)}, with slope 0.`;
  else
    note = `Each step of 1 to the right goes up by the slope ${format(step[1])}/${format(step[0])} = ${fraction(step[1], step[0])}.`;

  const readout = same ? (
    <>
      <div>P = Q = {pair(P)}</div>
      <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
        No line: pick two different points.
      </div>
    </>
  ) : (
    <>
      <div>
        P + t(Q − P) = {pair(P)} + t{pair(step)}
      </div>
      <div className="mt-1">{written(a, b, c)}</div>
      <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
        {note}
      </div>
    </>
  );

  return (
    <Interactive
      caption={caption}
      readout={readout}
      controls={
        <>
          <Slider label="P: p₁" value={p1} onChange={setP1} min={-5} max={5} />
          <Slider label="P: p₂" value={p2} onChange={setP2} min={-5} max={5} />
          <Slider label="Q: q₁" value={q1} onChange={setQ1} min={-5} max={5} />
          <Slider label="Q: q₂" value={q2} onChange={setQ2} min={-5} max={5} />
        </>
      }
    >
      <Grid
        x={RANGE}
        y={RANGE}
        label={
          same
            ? `P and Q are both at ${pair(P)}, so no line is drawn.`
            : `The line through P = ${pair(P)} and Q = ${pair(Q)}, with equation ${written(a, b, c)}.`
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
        {same ? (
          mark(P, [P[0] - 1, P[1] - 1], "P = Q", COLORS.orange)
        ) : (
          <>
            {mark(P, Q, "P", COLORS.orange)}
            {mark(Q, P, "Q", COLORS.green)}
          </>
        )}
      </Grid>
    </Interactive>
  );
}
