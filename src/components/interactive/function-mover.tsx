"use client";

/**
 * FunctionMover: the graph of one of five starting functions (x², |x|, √x, x³ or sin x), stretched
 * by a away from the x-axis, flipped in either axis if asked, and then slid by (h, k). The starting
 * graph stays faint and the moved one is bold. The readout writes the new rule with the numbers in,
 * says in words what happened, and checks one marked point. For √x and x³, which are one to one,
 * the moved graph can also be mirrored in the line y = x, and the readout gives the rule of the
 * inverse; for the other three that switch is greyed out, with the reason.
 */

import { useId, useState, type ReactNode } from "react";
import { Grid, gridScale } from "./grid";
import { COLORS, Choice, Interactive, Slider, format, useSmooth } from "./kit";

type Range = [number, number];
type Pt = [number, number];
type BaseName = "square" | "abs" | "root" | "cube" | "sine";

const X: Range = [-6, 6];
const Y: Range = [-6, 6];

// a label with a halo in the card colour, so it stays readable over the grid and the curves
const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

type Base = {
  name: string;
  f: (u: number) => number;
  /** the inputs drawn, spaced so that the steep parts come out smooth */
  inputs: number[];
  /** the marked point is (p, f(p)) */
  p: number;
  /** the rule with the inside written in, e.g. |x − 1| */
  rule: (inside: string) => string;
  /** for a one-to-one function, its inverse written with the inside, e.g. ∛(x − 1) */
  inverse?: (inside: string) => string;
  /** for a function that is not one to one, two inputs with the same value */
  twice?: string;
};

const even = (from: number, to: number, n: number) =>
  Array.from({ length: n + 1 }, (_, i) => from + ((to - from) * i) / n);

// "x" stays bare; anything longer goes in brackets
const wrap = (s: string) => (s === "x" ? s : `(${s})`);

const BASES: Record<BaseName, Base> = {
  square: {
    name: "x²",
    f: (u) => u * u,
    inputs: even(-5, 5, 300),
    p: 1,
    rule: (s) => `${wrap(s)}²`,
    twice: "it is 1 at both 1 and −1",
  },
  abs: {
    name: "|x|",
    f: Math.abs,
    inputs: even(-20, 20, 400),
    p: 1,
    rule: (s) => `|${s}|`,
    twice: "it is 1 at both 1 and −1",
  },
  root: {
    name: "√x",
    f: Math.sqrt,
    // squares of evenly spaced numbers, so the steep start near 0 gets plenty of points
    inputs: even(0, Math.sqrt(40), 300).map((t) => t * t),
    p: 1,
    rule: (s) => `√${wrap(s)}`,
    inverse: (s) => `${wrap(s)}²`,
  },
  cube: {
    name: "x³",
    f: (u) => u ** 3,
    inputs: even(-4, 4, 400),
    p: 1,
    rule: (s) => `${wrap(s)}³`,
    inverse: (s) => `∛${wrap(s)}`,
  },
  sine: {
    name: "sin x",
    f: Math.sin,
    inputs: even(-15, 15, 600),
    p: Math.PI / 2,
    rule: (s) => (s === "x" ? "sin x" : `sin(${s})`),
    twice: "it is 0 at both 0 and π",
  },
};

// "x", "x − 2" or "x + 2"
const shifted = (by: number) =>
  by === 0 ? "x" : `x ${by > 0 ? "−" : "+"} ${format(Math.abs(by))}`;
// " + 3", " − 3" or nothing
const plus = (n: number) =>
  n === 0 ? "" : ` ${n > 0 ? "+" : "−"} ${format(Math.abs(n))}`;

/** a switch that is on or off, and can be greyed out */
function Toggle({
  on,
  onChange,
  disabled = false,
  children,
}: {
  on: boolean;
  onChange: (on: boolean) => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on && !disabled}
      disabled={disabled}
      onClick={() => onChange(!on)}
      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40 ${
        on && !disabled
          ? "bg-fd-primary text-fd-primary-foreground"
          : "hover:bg-fd-accent hover:text-fd-accent-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export function FunctionMover({
  base: initialBase = "abs",
  h: initialH = 1,
  k: initialK = 3,
  a: initialA = 2,
}: {
  /** the starting function shown first */
  base?: BaseName;
  /** the slide (h, k) and the stretch a at the start */
  h?: number;
  k?: number;
  a?: number;
}) {
  const id = useId();
  const [baseName, setBaseName] = useState<BaseName>(initialBase);
  const [h, setH] = useState(initialH);
  const [k, setK] = useState(initialK);
  const [a, setA] = useState(initialA);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [mirrorOn, setMirror] = useState(false);
  const sh = useSmooth(h);
  const sk = useSmooth(k);
  const sa = useSmooth(a);
  const { px, py } = gridScale(X, Y);

  const base = BASES[baseName];
  const canMirror = base.inverse !== undefined;
  const mirror = mirrorOn && canMirror;
  // the flips as signs: s outside the function, t inside
  const s = flipX ? -1 : 1;
  const t = flipY ? -1 : 1;

  /** where the point (u, f(u)) of the starting graph goes */
  const move = (u: number, hh: number, kk: number, aa: number): Pt => [
    hh + t * u,
    kk + s * aa * base.f(u),
  ];
  const toPath = (points: Pt[]) =>
    points.map(([x, y]) => `${px(x).toFixed(1)},${py(y).toFixed(1)}`).join(" ");
  const startCurve = base.inputs.map((u) => [u, base.f(u)] as Pt);
  const movedCurve = base.inputs.map((u) => move(u, sh, sk, sa));
  const mirroredCurve = movedCurve.map(([x, y]) => [y, x] as Pt);

  // the rule: y = k + s·a·f(t(x − h)), written with the numbers in
  const inside = flipY ? (h === 0 ? "−x" : `−(${shifted(h)})`) : shifted(h);
  const outside = `${flipX ? "−" : ""}${a === 1 ? "" : `${format(a)}·`}`;
  const rule = `y = ${outside}${base.rule(inside)}${plus(k)}`;

  // the inverse: x = k + s·a·f(t(y − h)) solved for y gives y = h + t·f⁻¹((x − k)/(s·a))
  const m = s * a;
  const top = shifted(k);
  const scaled =
    m === 1
      ? top
      : m === -1
        ? top === "x"
          ? "−x"
          : `−(${top})`
        : `${m < 0 ? "−" : ""}${top === "x" ? "x" : `(${top})`}/${format(Math.abs(m))}`;
  const undone = base.inverse ? base.inverse(scaled) : "";
  // the square undoes √ only on the side where the inside is at least 0
  const domain =
    baseName === "root" ? `, for x ${m > 0 ? "≥" : "≤"} ${format(k)}` : "";
  const inverseRule = `y = ${t === -1 ? "−" : ""}${undone}${plus(h)}${domain}`;

  // the marked point and where it lands
  const P: Pt = [base.p, base.f(base.p)];
  const P1 = move(base.p, h, k, a);
  const shownP1 = move(base.p, sh, sk, sa);
  const point = (q: Pt) => `(${format(q[0])}, ${format(q[1])})`;

  const steps = [
    a !== 1 ? `stretched by ${format(a)} away from the x-axis` : "",
    flipX ? "flipped in the x-axis" : "",
    flipY ? "flipped in the y-axis" : "",
  ].filter(Boolean);
  const slide = [
    h !== 0 ? `${format(Math.abs(h))} ${h > 0 ? "right" : "left"}` : "",
    k !== 0 ? `${format(Math.abs(k))} ${k > 0 ? "up" : "down"}` : "",
  ].filter(Boolean);
  const words = `The graph of y = ${base.name}${
    steps.length ? `, ${steps.join(", ")},` : ""
  } ${slide.length ? `then slid ${slide.join(" and ")}` : "not slid"}.`;

  return (
    <Interactive
      readout={
        <>
          <div>{rule}</div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {words} P = {point(P)} lands on P′ = {point(P1)}, and the new rule
            gives y = {format(P1[1])} at x = {format(P1[0])}.
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {canMirror
              ? mirror
                ? `Mirrored in y = x it becomes the inverse, ${inverseRule}, and P′ lands on ${point([P1[1], P1[0]])}.`
                : `${base.name} is one to one, so the moved graph can be mirrored in y = x.`
              : `${base.name} is not one to one, since ${base.twice}, so there is no inverse to mirror.`}
          </div>
        </>
      }
      controls={
        <>
          <Choice
            label="starting function"
            value={baseName}
            onChange={setBaseName}
            options={(Object.keys(BASES) as BaseName[]).map((key) => ({
              value: key,
              label: BASES[key].name,
            }))}
          />
          <Slider
            label={
              <>
                stretch up <i>a</i>
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
          <div className="flex flex-wrap justify-center gap-2">
            <Toggle on={flipX} onChange={setFlipX}>
              flip in the x-axis
            </Toggle>
            <Toggle on={flipY} onChange={setFlipY}>
              flip in the y-axis
            </Toggle>
            <Toggle on={mirrorOn} onChange={setMirror} disabled={!canMirror}>
              mirror in y = x
            </Toggle>
          </div>
        </>
      }
      caption="The faint dashed curve is the starting graph. The bold blue curve is that graph stretched, flipped and then slid, and its rule is in the readout. The purple curve is its mirror image in y = x, when that is switched on."
    >
      <Grid
        x={X}
        y={Y}
        label={`The graph of y = ${base.name}, drawn faint, and the graph of ${rule}, drawn bold. ${words}${
          mirror
            ? ` Its mirror image in the line y = x, the graph of ${inverseRule}, is drawn too.`
            : ""
        }`}
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
          {mirror && (
            <line
              x1={px(X[0])}
              y1={py(Y[0])}
              x2={px(X[1])}
              y2={py(Y[1])}
              stroke={COLORS.purple}
              strokeOpacity={0.6}
              strokeWidth={1.5}
              strokeDasharray="6 5"
            />
          )}
          <polyline
            points={toPath(startCurve)}
            stroke="currentColor"
            strokeOpacity={0.4}
            strokeWidth={1.75}
            strokeDasharray="6 5"
          />
          <polyline
            points={toPath(movedCurve)}
            stroke={COLORS.blue}
            strokeWidth={2.75}
          />
          {mirror && (
            <polyline
              points={toPath(mirroredCurve)}
              stroke={COLORS.purple}
              strokeWidth={2.75}
            />
          )}
          <line
            x1={px(P[0])}
            y1={py(P[1])}
            x2={px(shownP1[0])}
            y2={py(shownP1[1])}
            stroke={COLORS.orange}
            strokeOpacity={0.6}
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
          <circle
            cx={px(P[0])}
            cy={py(P[1])}
            r={5}
            fill="var(--color-fd-card)"
            stroke={COLORS.orange}
            strokeWidth={2.5}
          />
          <circle
            cx={px(shownP1[0])}
            cy={py(shownP1[1])}
            r={6}
            fill={COLORS.orange}
            stroke="var(--color-fd-card)"
            strokeWidth={2}
          />
          {mirror && (
            <circle
              cx={px(shownP1[1])}
              cy={py(shownP1[0])}
              r={6}
              fill={COLORS.purple}
              stroke="var(--color-fd-card)"
              strokeWidth={2}
            />
          )}
          <text
            x={px(P[0]) - 10}
            y={py(P[1]) - 10}
            textAnchor="end"
            fontSize={14}
            fontWeight={600}
            fill={COLORS.orange}
            {...halo}
          >
            P
          </text>
          <text
            x={px(shownP1[0]) + 10}
            y={py(shownP1[1]) - 10}
            fontSize={14}
            fontWeight={600}
            fill={COLORS.orange}
            {...halo}
          >
            P′
          </text>
        </g>
      </Grid>
    </Interactive>
  );
}
