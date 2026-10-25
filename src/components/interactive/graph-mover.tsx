"use client";

/**
 * GraphMover: one of three starting curves (the parabola y = x², the unit circle x² + y² = 1, or
 * both branches of xy = 1), stretched along the axes by a across and b up, and then slid by (h, k).
 * The starting curve stays faint and the moved one is bold. The readout writes the new equation
 * with the numbers in, as the rules for stretching and sliding a graph give it, says in words what
 * happened, and checks one marked point: P on the starting curve lands on P′, which fits the new
 * equation.
 */

import { useId, useState } from "react";
import { Grid, gridScale } from "./grid";
import { COLORS, Choice, Interactive, Slider, format, useSmooth } from "./kit";

type Range = [number, number];
type Pt = [number, number];
type CurveName = "parabola" | "circle" | "hyperbola";

const X: Range = [-6, 6];
const Y: Range = [-6, 6];
// how far past the box the sampled curves go, so they leave it cleanly
const REACH = 7;

// a label with a halo in the card colour, so it stays readable over the grid and the curves
const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

/** the marked point of each starting curve */
const START: Record<CurveName, Pt> = {
  parabola: [1, 1],
  circle: [1, 0],
  hyperbola: [1, 1],
};

const BASE: Record<CurveName, string> = {
  parabola: "y = x²",
  circle: "x² + y² = 1",
  hyperbola: "xy = 1",
};

/** the points of the starting curve stretched by (a, b) and then slid by (h, k), as polylines */
function movedCurve(
  name: CurveName,
  h: number,
  k: number,
  a: number,
  b: number,
): Pt[][] {
  const move = ([x, y]: Pt): Pt => [h + a * x, k + b * y];
  if (name === "circle") {
    const steps = 200;
    return [
      Array.from({ length: steps + 1 }, (_, i) => {
        const t = (2 * Math.PI * i) / steps;
        return move([Math.cos(t), Math.sin(t)]);
      }),
    ];
  }
  if (name === "parabola") {
    // keep the moved point inside the reach: across from h + at, up to k + bt²
    const top = Math.sqrt(Math.max(0, (REACH - k) / b));
    const t0 = Math.max((-REACH - h) / a, -top);
    const t1 = Math.min((REACH - h) / a, top);
    if (t1 <= t0) return [];
    const steps = 300;
    return [
      Array.from({ length: steps + 1 }, (_, i) => {
        const t = t0 + ((t1 - t0) * i) / steps;
        return move([t, t * t]);
      }),
    ];
  }
  // xy = 1 as the points (t, 1/t), one branch for t > 0 and one for t < 0, sampled evenly in
  // the logarithm of t so that both the steep part and the flat part come out smooth
  const near = b / (2 * REACH + Math.abs(k));
  const branch = (sign: 1 | -1) => {
    const far = (REACH - sign * h) / a;
    if (far <= near) return [];
    const steps = 240;
    const l0 = Math.log(near);
    const l1 = Math.log(far);
    return Array.from({ length: steps + 1 }, (_, i) => {
      const t = sign * Math.exp(l0 + ((l1 - l0) * i) / steps);
      return move([t, 1 / t]);
    });
  };
  return [branch(1), branch(-1)].filter((p) => p.length > 0);
}

// "x", "x − 2" or "x + 2"
const shifted = (letter: string, by: number) =>
  by === 0 ? letter : `${letter} ${by > 0 ? "−" : "+"} ${format(Math.abs(by))}`;
// "x²" or "(x − 2)²"
const squared = (part: string) =>
  part.length === 1 ? `${part}²` : `(${part})²`;
// "x" or "(x − 2)", for a product
const bracket = (part: string) => (part.length === 1 ? part : `(${part})`);
// "s" or "s/9"
const over = (s: string, d: number) => (d === 1 ? s : `${s}/${format(d)}`);
// a number, in brackets when negative, for squaring or multiplying
const term = (n: number) => (n < 0 ? `(${format(n)})` : format(n));

/** the new equation, from putting (x − h)/a for x and (y − k)/b for y in the starting one */
function equation(name: CurveName, h: number, k: number, a: number, b: number) {
  const xs = shifted("x", h);
  const ys = shifted("y", k);
  if (name === "circle")
    return `${over(squared(xs), a * a)} + ${over(squared(ys), b * b)} = 1`;
  if (name === "parabola") {
    const left = b === 1 ? ys : over(ys.length === 1 ? ys : `(${ys})`, b);
    return `${left} = ${over(squared(xs), a * a)}`;
  }
  const product =
    xs.length === 1 && ys.length === 1 ? "xy" : `${bracket(xs)}${bracket(ys)}`;
  return `${product} = ${format(a * b)}`;
}

/** the left side of the new equation worked out at the image P′ of the marked point */
function check(name: CurveName, a: number, b: number) {
  // at P′, x − h is a times the first coordinate of P, and y − k is b times the second
  const [u, v] = START[name];
  const dx = a * u;
  const dy = b * v;
  if (name === "circle")
    return `${over(`${term(dx)}²`, a * a)} + ${over(`${term(dy)}²`, b * b)} = 1`;
  if (name === "parabola")
    return `${over(format(dy), b)} = ${over(`${term(dx)}²`, a * a)}, both 1`;
  return `${term(dx)} · ${term(dy)} = ${format(a * b)}`;
}

/** what happened, in words: the stretch first, then the slide */
function sentence(h: number, k: number, a: number, b: number) {
  const stretch =
    a === 1 && b === 1
      ? "Not stretched"
      : `Made ${a === 1 ? "the same width" : `${format(a)} times as wide`} and ${
          b === 1 ? "the same height" : `${format(b)} times as tall`
        }`;
  const steps = [
    h !== 0 ? `${h > 0 ? "right" : "left"} ${format(Math.abs(h))}` : "",
    k !== 0 ? `${k > 0 ? "up" : "down"} ${format(Math.abs(k))}` : "",
  ].filter(Boolean);
  const slide = steps.length ? `slid ${steps.join(" and ")}` : "not slid";
  return `${stretch}, then ${slide}.`;
}

export function GraphMover({
  curve: initialCurve = "circle",
  h: initialH = 2,
  k: initialK = -1,
  a: initialA = 1,
  b: initialB = 1,
}: {
  /** the starting curve shown first */
  curve?: CurveName;
  /** the slide (h, k) and the stretch (a, b) at the start */
  h?: number;
  k?: number;
  a?: number;
  b?: number;
}) {
  const id = useId();
  const [curve, setCurve] = useState<CurveName>(initialCurve);
  const [h, setH] = useState(initialH);
  const [k, setK] = useState(initialK);
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);
  const sh = useSmooth(h);
  const sk = useSmooth(k);
  const sa = useSmooth(a);
  const sb = useSmooth(b);
  const { px, py } = gridScale(X, Y);

  const toPath = (points: Pt[]) =>
    points.map(([x, y]) => `${px(x).toFixed(1)},${py(y).toFixed(1)}`).join(" ");
  const base = movedCurve(curve, 0, 0, 1, 1);
  const moved = movedCurve(curve, sh, sk, sa, sb);

  const [u, v] = START[curve];
  const image: Pt = [h + a * u, k + b * v];
  const shownImage: Pt = [sh + sa * u, sk + sb * v];
  const eq = equation(curve, h, k, a, b);
  const point = (p: Pt) => `(${format(p[0])}, ${format(p[1])})`;

  return (
    <Interactive
      readout={
        <>
          <div>{eq}</div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {sentence(h, k, a, b)} P = {point(START[curve])} on {BASE[curve]}{" "}
            lands on P′ = {point(image)}, and putting x = {format(image[0])}, y
            = {format(image[1])} in the new equation gives {check(curve, a, b)}.
          </div>
        </>
      }
      controls={
        <>
          <Choice
            label="starting curve"
            value={curve}
            onChange={setCurve}
            options={[
              { value: "parabola", label: "y = x²" },
              { value: "circle", label: "x² + y² = 1" },
              { value: "hyperbola", label: "xy = 1" },
            ]}
          />
          <Slider
            label={
              <>
                stretch across <i>a</i>
              </>
            }
            value={a}
            onChange={setA}
            min={0.5}
            max={3}
            step={0.5}
          />
          <Slider
            label={
              <>
                stretch up <i>b</i>
              </>
            }
            value={b}
            onChange={setB}
            min={0.5}
            max={3}
            step={0.5}
          />
          <Slider
            label={
              <>
                slide across <i>h</i>
              </>
            }
            value={h}
            onChange={setH}
            min={-3}
            max={3}
            step={0.5}
          />
          <Slider
            label={
              <>
                slide up <i>k</i>
              </>
            }
            value={k}
            onChange={setK}
            min={-3}
            max={3}
            step={0.5}
          />
        </>
      }
      caption="The faint dashed curve is the starting curve. The bold curve is that curve stretched along the axes and then slid, and its equation is in the readout."
    >
      <Grid
        x={X}
        y={Y}
        label={`The graph of ${BASE[curve]}, drawn faint, and the graph of ${eq}, drawn bold: the first ${sentence(h, k, a, b).toLowerCase()}`}
      >
        <clipPath id={id}>
          <rect
            x={px(X[0])}
            y={py(Y[1])}
            width={px(X[1]) - px(X[0])}
            height={py(Y[0]) - py(Y[1])}
          />
        </clipPath>
        <g clipPath={`url(#${id})`} fill="none" strokeLinejoin="round">
          {base.map((p, i) => (
            <polyline
              key={`b${i}`}
              points={toPath(p)}
              stroke="currentColor"
              strokeOpacity={0.4}
              strokeWidth={1.75}
              strokeDasharray="6 5"
            />
          ))}
          {moved.map((p, i) => (
            <polyline
              key={`m${i}`}
              points={toPath(p)}
              stroke={COLORS.blue}
              strokeWidth={2.75}
            />
          ))}
          <line
            x1={px(u)}
            y1={py(v)}
            x2={px(shownImage[0])}
            y2={py(shownImage[1])}
            stroke={COLORS.orange}
            strokeOpacity={0.6}
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
        </g>
        <circle
          cx={px(u)}
          cy={py(v)}
          r={5}
          fill="var(--color-fd-card)"
          stroke={COLORS.orange}
          strokeWidth={2.5}
        />
        <circle
          cx={px(shownImage[0])}
          cy={py(shownImage[1])}
          r={6}
          fill={COLORS.orange}
          stroke="var(--color-fd-card)"
          strokeWidth={2}
        />
        <text
          x={px(u) - 10}
          y={py(v) - 10}
          textAnchor="end"
          fontSize={14}
          fontWeight={600}
          fill={COLORS.orange}
          {...halo}
        >
          P
        </text>
        <text
          x={px(shownImage[0]) + 10}
          y={py(shownImage[1]) - 10}
          fontSize={14}
          fontWeight={600}
          fill={COLORS.orange}
          {...halo}
        >
          P′
        </text>
      </Grid>
    </Interactive>
  );
}
