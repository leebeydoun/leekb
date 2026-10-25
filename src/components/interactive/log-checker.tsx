"use client";

/**
 * LogChecker: tests a law of logarithms, or a tempting look-alike, with numbers. Sliders choose x
 * and y (and r for the power law), and buttons choose base 2 or base 10. The readout puts the
 * numbers into both sides, works each side out, and says whether they are equal. The picture draws
 * both sides as curves as x runs from 0 to 16, with y and r held where the sliders put them: the
 * left side solid blue and the right side dashed orange, so where they lie on top of each other
 * both can still be seen. One place where the curves part is enough to show an equation is not a
 * law.
 */

import { useId, useState } from "react";
import { COLORS, Choice, Interactive, Slider, format } from "./kit";

type Base = "2" | "10";

type Law = {
  id: string;
  /** both sides as written, with the base filled in by `name` */
  left: (L: string) => string;
  right: (L: string) => string;
  leftAt: (log: Log, x: number, y: number, r: number) => number;
  rightAt: (log: Log, x: number, y: number, r: number) => number;
  /** both sides with the numbers put in and worked out, as text */
  leftWork: (L: string, log: Log, x: number, y: number, r: number) => string;
  rightWork: (L: string, log: Log, x: number, y: number, r: number) => string;
  law: boolean;
  usesY: boolean;
  usesR: boolean;
  note: string;
};

type Log = (t: number) => number;

const f = (n: number) => format(n, 2);
/** an intermediate number such as x/y or xʳ, with three significant figures when it is small */
const g = (n: number) =>
  n > 0 && n < 0.1 ? Number(n.toPrecision(3)).toString() : f(n);

const LAWS: Law[] = [
  {
    id: "product",
    left: (L) => `${L}(xy)`,
    right: (L) => `${L} x + ${L} y`,
    leftAt: (log, x, y) => log(x * y),
    rightAt: (log, x, y) => log(x) + log(y),
    leftWork: (L, log, x, y) =>
      `${L}(${f(x)} · ${f(y)}) = ${L} ${g(x * y)} = ${f(log(x * y))}`,
    rightWork: (L, log, x, y) =>
      `${L} ${f(x)} + ${L} ${f(y)} = ${f(log(x))} + ${f(log(y))} = ${f(log(x) + log(y))}`,
    law: true,
    usesY: true,
    usesR: false,
    note: "This is the product law, from Laws of logarithms.",
  },
  {
    id: "quotient",
    left: (L) => `${L}(x/y)`,
    right: (L) => `${L} x − ${L} y`,
    leftAt: (log, x, y) => log(x / y),
    rightAt: (log, x, y) => log(x) - log(y),
    leftWork: (L, log, x, y) =>
      `${L}(${f(x)}/${f(y)}) = ${L} ${g(x / y)} = ${f(log(x / y))}`,
    rightWork: (L, log, x, y) =>
      `${L} ${f(x)} − ${L} ${f(y)} = ${f(log(x))} − ${f(log(y))} = ${f(log(x) - log(y))}`,
    law: true,
    usesY: true,
    usesR: false,
    note: "This is the quotient law, from Laws of logarithms.",
  },
  {
    id: "power",
    left: (L) => `${L}(xʳ)`,
    right: (L) => `r · ${L} x`,
    leftAt: (log, x, _y, r) => log(x ** r),
    rightAt: (log, x, _y, r) => r * log(x),
    leftWork: (L, log, x, _y, r) =>
      `${L}(${f(x)}^${f(r)}) = ${L} ${g(x ** r)} = ${f(log(x ** r))}`,
    rightWork: (L, log, x, _y, r) =>
      `${f(r)} · ${L} ${f(x)} = ${f(r)} · ${f(log(x))} = ${f(r * log(x))}`,
    law: true,
    usesY: false,
    usesR: true,
    note: "This is the power law, from Laws of logarithms.",
  },
  {
    id: "sum-wrong",
    left: (L) => `${L}(x + y)`,
    right: (L) => `${L} x + ${L} y`,
    leftAt: (log, x, y) => log(x + y),
    rightAt: (log, x, y) => log(x) + log(y),
    leftWork: (L, log, x, y) =>
      `${L}(${f(x)} + ${f(y)}) = ${L} ${g(x + y)} = ${f(log(x + y))}`,
    rightWork: (L, log, x, y) =>
      `${L} ${f(x)} + ${L} ${f(y)} = ${f(log(x))} + ${f(log(y))} = ${f(log(x) + log(y))}`,
    law: false,
    usesY: true,
    usesR: false,
    note: "Adding the logarithms gives the logarithm of the product xy, not of the sum.",
  },
  {
    id: "square-wrong",
    left: (L) => `${L}(x²)`,
    right: (L) => `(${L} x)²`,
    leftAt: (log, x) => log(x * x),
    rightAt: (log, x) => log(x) ** 2,
    leftWork: (L, log, x) =>
      `${L}(${f(x)}²) = ${L} ${g(x * x)} = ${f(log(x * x))}`,
    rightWork: (L, log, x) =>
      `(${L} ${f(x)})² = ${f(log(x))}² = ${f(log(x) ** 2)}`,
    law: false,
    usesY: false,
    usesR: false,
    note: "The power law gives log(x²) = 2 log x: the square is on x, not on the logarithm.",
  },
  {
    id: "quotient-wrong",
    left: (L) => `${L}(x/y)`,
    right: (L) => `${L} x / ${L} y`,
    leftAt: (log, x, y) => log(x / y),
    rightAt: (log, x, y) => log(x) / log(y),
    leftWork: (L, log, x, y) =>
      `${L}(${f(x)}/${f(y)}) = ${L} ${g(x / y)} = ${f(log(x / y))}`,
    rightWork: (L, log, x, y) =>
      `${L} ${f(x)} / ${L} ${f(y)} = ${f(log(x))} / ${f(log(y))} = ${f(log(x) / log(y))}`,
    law: false,
    usesY: true,
    usesR: false,
    note: "The quotient law subtracts the logarithms: log(x/y) = log x − log y.",
  },
];

// the frame of the graph: x from 0 to 16, and a height range that suits the base
const WIDTH = 640;
const HEIGHT = 300;
const LEFT = 34;
const RIGHT = 14;
const TOP = 14;
const BOTTOM = 30;
const X0 = 0;
const X1 = 16;
const FRAME: Record<
  Base,
  { y0: number; y1: number; step: number; every: number }
> = {
  "2": { y0: -5, y1: 10, step: 1, every: 5 },
  "10": { y0: -1.5, y1: 3, step: 0.5, every: 1 },
};

const SAMPLES = 800;

export function LogChecker({
  start = "sum-wrong",
  caption = "Pick an equation and move x and y. The two sides are drawn as x runs from 0 to 16, the left solid and the right dashed. A law keeps the curves together everywhere; one place where they part shows the equation is not a law.",
}: {
  /** the id of the equation shown first */
  start?: string;
  caption?: string;
}) {
  const [id, setId] = useState(start);
  const [base, setBase] = useState<Base>("2");
  const [x, setX] = useState(8);
  const [y, setY] = useState(4);
  const [r, setR] = useState(3);
  const clip = useId();
  const law = LAWS.find((l) => l.id === id) ?? LAWS[0]!;

  const b = Number(base);
  const log: Log = (t) => Math.log(t) / Math.log(b);
  const L = base === "2" ? "log₂" : "log₁₀";
  const { y0, y1, step, every } = FRAME[base];

  const px = (t: number) =>
    LEFT + ((t - X0) / (X1 - X0)) * (WIDTH - LEFT - RIGHT);
  const py = (v: number) =>
    TOP + ((y1 - v) / (y1 - y0)) * (HEIGHT - TOP - BOTTOM);

  // the right side of the look-alike for a quotient has no value when log y = 0, that is y = 1
  const ok = !(law.id === "quotient-wrong" && Math.abs(log(y)) < 1e-9);
  const left = law.leftAt(log, x, y, r);
  const right = law.rightAt(log, x, y, r);
  const equal = ok && Math.abs(left - right) < 0.005;

  let verdict: string;
  if (!ok) {
    verdict = `With y = 1, ${L} y = 0, and dividing by 0 gives the right side no value. Move y to compare the sides.`;
  } else if (law.law) {
    verdict = `Equal. The curves lie on top of each other for every x. ${law.note}`;
  } else if (equal) {
    verdict = `Equal here, but the curves part elsewhere, so this is not a law. ${law.note}`;
  } else {
    verdict = `Not equal: ${f(left)} vs ${f(right)}. ${law.note}`;
  }

  /** the svg path of one side as x runs across the frame, lifting the pen far off the top or bottom */
  const curve = (
    side: (log: Log, x: number, y: number, r: number) => number,
  ) => {
    let path = "";
    let down = false;
    for (let i = 1; i <= SAMPLES; i++) {
      const t = X0 + ((X1 - X0) * i) / SAMPLES;
      const v = side(log, t, y, r);
      if (!Number.isFinite(v) || v > y1 + 4 || v < y0 - 4) {
        down = false;
        continue;
      }
      path += `${down ? "L" : "M"}${px(t).toFixed(1)},${py(v).toFixed(1)}`;
      down = true;
    }
    return path;
  };

  const heights: number[] = [];
  for (let v = Math.ceil(y0 / step) * step; v <= y1 + 1e-9; v += step)
    heights.push(Number(v.toFixed(6)));
  const across = [2, 4, 6, 8, 10, 12, 14, 16];
  const inFrame = (v: number) => ok && Number.isFinite(v) && v >= y0 && v <= y1;

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>
            <span style={{ color: COLORS.blue }}>{law.left(L)}</span> ={" "}
            <span style={{ color: COLORS.orange }}>{law.right(L)}</span>
          </div>
          <div className="mt-1 text-sm">
            <span style={{ color: COLORS.blue }}>
              {law.leftWork(L, log, x, y, r)}
            </span>
          </div>
          <div className="text-sm">
            <span style={{ color: COLORS.orange }}>
              {ok
                ? law.rightWork(L, log, x, y, r)
                : `${L} ${f(x)} / ${L} 1 has no value`}
            </span>
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {verdict}
          </div>
        </>
      }
      controls={
        <>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-fd-muted-foreground">equation</span>
            <select
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="rounded-lg border bg-fd-card px-3 py-1.5 font-medium"
            >
              {LAWS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.left("log")} = {l.right("log")}
                  {l.law ? "" : " (look-alike)"}
                </option>
              ))}
            </select>
          </label>
          <Choice
            label="base"
            value={base}
            onChange={setBase}
            options={[
              { value: "2", label: "2" },
              { value: "10", label: "10" },
            ]}
          />
          <Slider
            label={<i>x</i>}
            value={x}
            onChange={setX}
            min={0.25}
            max={16}
            step={0.25}
          />
          {law.usesY && (
            <Slider
              label={<i>y</i>}
              value={y}
              onChange={setY}
              min={0.25}
              max={16}
              step={0.25}
            />
          )}
          {law.usesR && (
            <Slider
              label={<i>r</i>}
              value={r}
              onChange={setR}
              min={-2}
              max={3}
              step={0.5}
            />
          )}
        </>
      }
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-2xl text-fd-foreground"
        role="img"
        aria-label={`The graphs of y = ${law.left(L)} (solid) and y = ${law.right(L)} (dashed) for x from 0 to 16. ${verdict}`}
      >
        <defs>
          <clipPath id={clip}>
            <rect
              x={LEFT}
              y={TOP}
              width={WIDTH - LEFT - RIGHT}
              height={HEIGHT - TOP - BOTTOM}
            />
          </clipPath>
        </defs>

        {/* light lines at each even x and each step of height */}
        <g className="text-fd-border" stroke="currentColor" strokeWidth={1}>
          {across.map((t) => (
            <line key={t} x1={px(t)} x2={px(t)} y1={py(y0)} y2={py(y1)} />
          ))}
          {heights.map((v) => (
            <line key={v} x1={px(X0)} x2={px(X1)} y1={py(v)} y2={py(v)} />
          ))}
        </g>

        {/* axes */}
        <g stroke="currentColor" strokeWidth={1.5}>
          <line x1={px(X0)} x2={px(X1)} y1={py(0)} y2={py(0)} />
          <line x1={px(0)} x2={px(0)} y1={py(y0)} y2={py(y1)} />
        </g>
        <g fontSize={12} className="fill-fd-muted-foreground">
          {across.map((t) => (
            <text key={t} x={px(t)} y={py(y0) + 18} textAnchor="middle">
              {t}
            </text>
          ))}
          {heights
            .filter(
              (v) =>
                v !== 0 && Math.abs(v / every - Math.round(v / every)) < 1e-9,
            )
            .map((v) => (
              <text key={v} x={px(X0) - 6} y={py(v) + 4} textAnchor="end">
                {format(v)}
              </text>
            ))}
        </g>

        <g clipPath={`url(#${clip})`} fill="none">
          <path
            d={curve(law.leftAt)}
            stroke={COLORS.blue}
            strokeWidth={4}
            strokeLinejoin="round"
          />
          {ok && (
            <path
              d={curve(law.rightAt)}
              stroke={COLORS.orange}
              strokeWidth={2.5}
              strokeDasharray="7 6"
              strokeLinejoin="round"
            />
          )}
        </g>

        {/* the chosen x, and the value of each side there */}
        <line
          x1={px(x)}
          x2={px(x)}
          y1={py(y0)}
          y2={py(y1)}
          stroke="currentColor"
          strokeOpacity={0.5}
          strokeDasharray="3 4"
        />
        {inFrame(left) && (
          <circle
            cx={px(x)}
            cy={py(left)}
            r={7}
            fill={COLORS.blue}
            stroke="var(--color-fd-card)"
            strokeWidth={2}
          />
        )}
        {inFrame(right) && (
          <circle
            cx={px(x)}
            cy={py(right)}
            r={4.5}
            fill={COLORS.orange}
            stroke="var(--color-fd-card)"
            strokeWidth={1.5}
          />
        )}
      </svg>
    </Interactive>
  );
}
