"use client";

/**
 * Checks an equation in x by drawing both of its sides as curves over −2π ≤ x ≤ 2π: the left side
 * solid blue, the right side dashed orange, so where the two lie on top of each other both can
 * still be seen. A slider picks one value of x, and the readout gives both sides there and says
 * what the curves suggest. Some of the equations are identities and some only look like them.
 * Where a side is not defined (tan x and sec x where cos x = 0) its curve is broken.
 */

import { useState } from "react";
import { COLORS, format, Interactive, Slider } from "./kit";

type Equation = {
  id: string;
  left: string;
  right: string;
  leftAt: (x: number) => number;
  rightAt: (x: number) => number;
  /** for an identity, where it is proved; for a look-alike, the true formula */
  identity: boolean;
  note: string;
};

const { sin, cos, tan, PI } = Math;
const sec2 = (x: number) => 1 / cos(x) ** 2;

const EQUATIONS: Equation[] = [
  {
    id: "double-sin",
    left: "sin 2x",
    right: "2 sin x cos x",
    leftAt: (x) => sin(2 * x),
    rightAt: (x) => 2 * sin(x) * cos(x),
    identity: true,
    note: "The proof is Double angles, in the Addition formulas guide.",
  },
  {
    id: "double-wrong",
    left: "sin 2x",
    right: "2 sin x",
    leftAt: (x) => sin(2 * x),
    rightAt: (x) => 2 * sin(x),
    identity: false,
    note: "The true formula is sin 2x = 2 sin x cos x.",
  },
  {
    id: "sum-wrong",
    left: "sin(x + π/4)",
    right: "sin x + sin(π/4)",
    leftAt: (x) => sin(x + PI / 4),
    rightAt: (x) => sin(x) + sin(PI / 4),
    identity: false,
    note: "The true formula is sin(x + π/4) = sin x cos(π/4) + cos x sin(π/4).",
  },
  {
    id: "double-cos",
    left: "cos² x − sin² x",
    right: "cos 2x",
    leftAt: (x) => cos(x) ** 2 - sin(x) ** 2,
    rightAt: (x) => cos(2 * x),
    identity: true,
    note: "The proof is Double angles, in the Addition formulas guide.",
  },
  {
    id: "secant",
    left: "1 + tan² x",
    right: "sec² x",
    leftAt: (x) => 1 + tan(x) ** 2,
    rightAt: sec2,
    identity: true,
    note: "The proof is One plus tangent squared, in The tangent guide.",
  },
  {
    id: "supplement",
    left: "sin(π − x)",
    right: "sin x",
    leftAt: (x) => sin(PI - x),
    rightAt: (x) => sin(x),
    identity: true,
    note: "The proof is Angles that add to a straight angle, in Identities you can see.",
  },
  {
    id: "half-turn-wrong",
    left: "cos(x + π)",
    right: "cos x",
    leftAt: (x) => cos(x + PI),
    rightAt: (x) => cos(x),
    identity: false,
    note: "The true formula is cos(x + π) = −cos x.",
  },
  {
    id: "square-sum",
    left: "(sin x + cos x)²",
    right: "1 + sin 2x",
    leftAt: (x) => (sin(x) + cos(x)) ** 2,
    rightAt: (x) => 1 + sin(2 * x),
    identity: true,
    note: "The proof is the first worked example in this guide.",
  },
  {
    id: "square-wrong",
    left: "sin² x",
    right: "sin(x²)",
    leftAt: (x) => sin(x) ** 2,
    rightAt: (x) => sin(x * x),
    identity: false,
    note: "sin² x means (sin x)², the sine squared, not the sine of x².",
  },
];

// the frame of the graph: x from −2π to 2π, y from −2.5 to 2.5
const WIDTH = 640;
const HEIGHT = 300;
const LEFT = 34;
const RIGHT = 14;
const TOP = 14;
const BOTTOM = 30;
const X0 = -2 * PI;
const X1 = 2 * PI;
const Y0 = -2.5;
const Y1 = 2.5;
const px = (x: number) =>
  LEFT + ((x - X0) / (X1 - X0)) * (WIDTH - LEFT - RIGHT);
const py = (y: number) =>
  TOP + ((Y1 - y) / (Y1 - Y0)) * (HEIGHT - TOP - BOTTOM);

const SAMPLES = 1200;

/**
 * whether both sides can be shown at x: tan x and sec x have no value where cos x is 0, and are
 * too large to show when cos x is close to 0
 */
const defined = (equation: Equation, x: number) =>
  equation.id !== "secant" || Math.abs(cos(x)) > 0.02;

/**
 * The svg path of y = f(x) across the frame. The pen lifts wherever the curve runs far off the
 * top or bottom, so the two sides of a gap where the side is not defined are never joined.
 */
function curve(f: (x: number) => number) {
  let path = "";
  let down = false;
  for (let i = 0; i <= SAMPLES; i++) {
    const x = X0 + ((X1 - X0) * i) / SAMPLES;
    const y = f(x);
    if (!Number.isFinite(y) || Math.abs(y) > 20) {
      down = false;
      continue;
    }
    path += `${down ? "L" : "M"}${px(x).toFixed(1)},${py(y).toFixed(1)}`;
    down = true;
  }
  return path;
}

const TICKS = [
  [-2, "−2π"],
  [-1.5, "−3π/2"],
  [-1, "−π"],
  [-0.5, "−π/2"],
  [0.5, "π/2"],
  [1, "π"],
  [1.5, "3π/2"],
  [2, "2π"],
] as const;

export function IdentityChecker({
  start = "double-wrong",
  caption = "Pick an equation and move x. Where the dashed curve lies exactly on the solid one everywhere, the equation behaves like an identity; one place where they part is enough to show it is not one.",
}: {
  /** the id of the equation shown first */
  start?: string;
  caption?: string;
}) {
  const [id, setId] = useState(start);
  const [x, setX] = useState(1);
  const equation = EQUATIONS.find((e) => e.id === id) ?? EQUATIONS[0]!;

  const ok = defined(equation, x);
  const left = equation.leftAt(x);
  const right = equation.rightAt(x);
  const agree = ok && Math.abs(left - right) < 0.005;

  let verdict: string;
  if (!ok) {
    verdict = `At x = ${format(x)}, cos x is close to 0, so both sides are too large to show. Where cos x = 0 neither side is defined, and the identity says nothing there.`;
  } else if (equation.identity) {
    verdict = `At x = ${format(x)}: left ${format(left)}, right ${format(right)}. The curves lie on top of each other everywhere we look: evidence that this is an identity, not a proof. ${equation.note}`;
  } else if (agree) {
    verdict = `At x = ${format(x)}: left ${format(left)}, right ${format(right)}. The two sides agree here, but the curves part elsewhere, so this is not an identity. ${equation.note}`;
  } else {
    verdict = `At x = ${format(x)}: left ${format(left)}, right ${format(right)}. Different, so this is not an identity. ${equation.note}`;
  }

  const inFrame = (y: number) => ok && y >= Y0 && y <= Y1;

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>
            <span style={{ color: COLORS.blue }}>{equation.left}</span> ={" "}
            <span style={{ color: COLORS.orange }}>{equation.right}</span>
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
              {EQUATIONS.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.left} = {e.right}
                </option>
              ))}
            </select>
          </label>
          <Slider
            label={<i>x</i>}
            value={x}
            onChange={setX}
            min={-6.28}
            max={6.28}
            step={0.01}
          />
        </>
      }
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-2xl text-fd-foreground"
        role="img"
        aria-label={`The graphs of y = ${equation.left} (solid) and y = ${equation.right} (dashed) for x from −2π to 2π. ${verdict}`}
      >
        <defs>
          <clipPath id="identity-checker-frame">
            <rect
              x={LEFT}
              y={TOP}
              width={WIDTH - LEFT - RIGHT}
              height={HEIGHT - TOP - BOTTOM}
            />
          </clipPath>
        </defs>

        {/* light lines at each half turn and each whole number of height */}
        <g className="text-fd-border" stroke="currentColor" strokeWidth={1}>
          {TICKS.map(([k]) => (
            <line
              key={k}
              x1={px(k * PI)}
              x2={px(k * PI)}
              y1={py(Y0)}
              y2={py(Y1)}
            />
          ))}
          {[-2, -1, 1, 2].map((y) => (
            <line key={y} x1={px(X0)} x2={px(X1)} y1={py(y)} y2={py(y)} />
          ))}
        </g>

        {/* axes */}
        <g stroke="currentColor" strokeWidth={1.5}>
          <line x1={px(X0)} x2={px(X1)} y1={py(0)} y2={py(0)} />
          <line x1={px(0)} x2={px(0)} y1={py(Y0)} y2={py(Y1)} />
        </g>
        <g fontSize={12} className="fill-fd-muted-foreground">
          {TICKS.map(([k, text]) => (
            <text key={k} x={px(k * PI)} y={py(Y0) + 18} textAnchor="middle">
              {text}
            </text>
          ))}
          {[-2, -1, 1, 2].map((y) => (
            <text key={y} x={px(X0) - 6} y={py(y) + 4} textAnchor="end">
              {format(y)}
            </text>
          ))}
        </g>

        <g clipPath="url(#identity-checker-frame)" fill="none">
          <path
            d={curve(equation.leftAt)}
            stroke={COLORS.blue}
            strokeWidth={4}
            strokeLinejoin="round"
          />
          <path
            d={curve(equation.rightAt)}
            stroke={COLORS.orange}
            strokeWidth={2.5}
            strokeDasharray="7 6"
            strokeLinejoin="round"
          />
        </g>

        {/* the chosen x, and the value of each side there */}
        <line
          x1={px(x)}
          x2={px(x)}
          y1={py(Y0)}
          y2={py(Y1)}
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
