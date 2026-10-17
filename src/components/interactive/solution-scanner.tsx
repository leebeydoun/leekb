"use client";

/**
 * Scans an inequality along the number line: a slider moves x, the readout works out the expression
 * at x and says whether the inequality holds, and the solutions are shaded. The pointer is green on
 * a solution and red off one.
 *
 * Three kinds:
 * - `kind="square" bound={9} sense="<"` for x² < 9 (bound must be positive)
 * - `kind="abs" centre={3} radius={2} sense=">"` for |x − 3| > 2 (radius must be positive)
 * - `kind="product" roots={[2, -3]} sense="<"` for (x − 2)(x + 3) < 0, with a sign table under the
 *   line showing the sign of each factor and of the product
 *
 * `sense` is one of "<", "<=", ">", ">=": the starting choice, which the reader can switch. `from` and `to` set the line's ends, `start` where x
 * begins, and `step` how far the slider moves at a time.
 */

import { useState } from "react";
import {
  Axis,
  Choice,
  COLORS,
  Dot,
  HArrow,
  Interactive,
  Slider,
  format,
  lineScale,
} from "./kit";

type Sense = "<" | "<=" | ">" | ">=";

const SYMBOL: Record<Sense, string> = {
  "<": "<",
  "<=": "≤",
  ">": ">",
  ">=": "≥",
};

const W = 600;
const AXIS_Y = 64;
// room on the left of the sign table for the row names
const TABLE_LABELS = 130;

// x − p, written the natural way: x − 2, x + 3, x
function factor(p: number) {
  if (p === 0) return "x";
  return p > 0 ? `x − ${format(p)}` : `x + ${format(-p)}`;
}

// a value in a product, in brackets when negative: (−1) · 4
const term = (n: number) => (n < 0 ? `(${format(n)})` : format(n));

const sign = (n: number) => (n > 0 ? "+" : n < 0 ? "−" : "0");

export function SolutionScanner({
  kind = "square",
  sense: startSense = "<",
  bound = 9,
  centre = 3,
  radius = 2,
  roots = [2, -3],
  from,
  to,
  start,
  step = 0.5,
}: {
  kind?: "square" | "abs" | "product";
  sense?: Sense;
  /** for kind="square": the number x² is compared with */
  bound?: number;
  /** for kind="abs": the a in |x − a| */
  centre?: number;
  /** for kind="abs": the number |x − a| is compared with */
  radius?: number;
  /** for kind="product": p and q in (x − p)(x − q), which is compared with 0 */
  roots?: [number, number];
  from?: number;
  to?: number;
  start?: number;
  step?: number;
}) {
  // the expression, what it is compared with, and the two points where it equals that
  let value: (x: number) => number;
  let rhs: number;
  let expr: string;
  let ends: [number, number];
  if (kind === "abs") {
    value = (x) => Math.abs(x - centre);
    rhs = radius;
    expr = `|${factor(centre)}|`;
    ends = [centre - radius, centre + radius];
  } else if (kind === "product") {
    const [p, q] = roots;
    value = (x) => (x - p) * (x - q);
    rhs = 0;
    expr = roots.map((r) => (r === 0 ? "x" : `(${factor(r)})`)).join("");
    ends = [Math.min(p, q), Math.max(p, q)];
  } else {
    value = (x) => x * x;
    rhs = bound;
    expr = "x²";
    ends = [-Math.sqrt(bound), Math.sqrt(bound)];
  }

  // a line with some room either side of the solutions, at least 8 wide
  let lo = from ?? Math.floor(ends[0]) - 2;
  let hi = to ?? Math.ceil(ends[1]) + 2;
  if (from === undefined && to === undefined && hi - lo < 8) {
    const extra = (8 - (hi - lo)) / 2;
    lo -= Math.ceil(extra);
    hi += Math.floor(extra);
  }
  const every = hi - lo > 14 ? 2 : 1;

  // by default x starts three quarters of the way between the ends, on a step
  const [x, setX] = useState(
    start ?? Math.round((ends[0] + 0.75 * (ends[1] - ends[0])) / step) * step,
  );
  const [sense, setSense] = useState<Sense>(startSense);
  const v = value(x);
  const equal = Math.abs(v - rhs) < 1e-9;
  const less = v < rhs && !equal;
  const holds =
    sense === "<"
      ? less
      : sense === "<="
        ? less || equal
        : sense === ">"
          ? !less && !equal
          : !less;

  const inside = sense === "<" || sense === "<=";
  const closed = sense === "<=" || sense === ">=";
  const pointer = holds ? COLORS.green : COLORS.red;

  const table = kind === "product";
  const left = table ? TABLE_LABELS : 0;
  const width = W + left;
  const { x: px } = lineScale(lo, hi, W);
  const at = (n: number) => left + px(n);
  const height = table ? 210 : 170;

  // the shaded stretches, in screen x; an open end runs to the end of the drawn line
  const lineStart = left + 6;
  const lineEnd = left + W - 6;
  const shaded: [number, number][] = inside
    ? [[at(ends[0]), at(ends[1])]]
    : [
        [lineStart, at(ends[0])],
        [at(ends[1]), lineEnd],
      ];

  // what the expression is at x, step by step
  let working = "";
  if (kind === "product")
    working = `${term(x - roots[0])} · ${term(x - roots[1])} = `;
  if (kind === "abs") working = `|${format(x - centre)}| = `;

  const readout = (
    <>
      x = {format(x)}: {expr} = {working}
      {format(v)}, and {format(v)} {SYMBOL[sense]} {format(rhs)}{" "}
      <span style={{ color: pointer }}>
        {holds
          ? `holds, so ${format(x)} is a solution`
          : `is false, so ${format(x)} is not a solution`}
      </span>
    </>
  );

  return (
    <Interactive
      readout={readout}
      controls={
        <>
          <Slider
            label="x"
            value={x}
            onChange={setX}
            min={lo}
            max={hi}
            step={step}
          />
          <Choice
            label={`${expr} … ${format(rhs)}`}
            value={sense}
            onChange={setSense}
            options={(["<", "<=", ">", ">="] as const).map((s) => ({
              value: s,
              label: SYMBOL[s],
            }))}
          />
        </>
      }
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto block h-auto w-full max-w-2xl text-fd-foreground"
        role="img"
        aria-label={`Number line for ${expr} ${SYMBOL[sense]} ${format(rhs)} with the solutions shaded, and x at ${format(x)}, ${holds ? "a solution" : "not a solution"}`}
      >
        {shaded.map(([x1, x2]) =>
          x2 - x1 > 0.5 ? (
            <line
              key={x1}
              x1={x1}
              x2={x2}
              y1={AXIS_Y}
              y2={AXIS_Y}
              stroke={COLORS.green}
              strokeOpacity={0.45}
              strokeWidth={10}
              strokeLinecap="butt"
            />
          ) : null,
        )}
        <g transform={`translate(${left}, 0)`}>
          <Axis from={lo} to={hi} y={AXIS_Y} width={W} every={every} />
        </g>
        {ends.map((e, i) => (
          <Dot
            key={i}
            cx={at(e)}
            cy={AXIS_Y}
            color={COLORS.green}
            hollow={!closed}
          />
        ))}

        {/* the distance from the centre, which is what the inequality is really about */}
        {kind !== "product" && (
          <Distance
            from={at(kind === "abs" ? centre : 0)}
            to={at(x)}
            centre={kind === "abs" ? centre : 0}
            x={x}
          />
        )}

        {table && (
          <SignTable
            roots={roots}
            x={x}
            at={at}
            lo={lo}
            hi={hi}
            expr={expr}
            holds={(n) => {
              const w = value(n);
              return sense === "<" || sense === "<=" ? w < 0 : w > 0;
            }}
            top={AXIS_Y + 50}
            pointer={pointer}
          />
        )}

        {/* the pointer at x */}
        <line
          x1={at(x)}
          x2={at(x)}
          y1={AXIS_Y - 10}
          y2={AXIS_Y}
          stroke={pointer}
          strokeWidth={2}
        />
        <polygon
          points={`${at(x)},${AXIS_Y - 4} ${at(x) - 7},${AXIS_Y - 16} ${at(x) + 7},${AXIS_Y - 16}`}
          fill={pointer}
        />
        <text
          x={at(x)}
          y={AXIS_Y - 24}
          textAnchor="middle"
          fontSize={14}
          fontWeight={600}
          fill={pointer}
        >
          x
        </text>
      </svg>
    </Interactive>
  );
}

/** an arrow below the line from the centre to x, labelled with the distance */
function Distance({
  from,
  to,
  centre,
  x,
}: {
  from: number;
  to: number;
  centre: number;
  x: number;
}) {
  const y = 128;
  const name = centre === 0 ? "|x|" : `|${factor(centre)}|`;
  return (
    <g>
      {[from, to].map((p, i) => (
        <line
          key={i}
          x1={p}
          x2={p}
          y1={AXIS_Y + 34}
          y2={y + 6}
          stroke={COLORS.blue}
          strokeOpacity={0.5}
          strokeDasharray={i ? "3 3" : undefined}
        />
      ))}
      <HArrow x1={from} x2={to} y={y} color={COLORS.blue} />
      <text
        x={(from + to) / 2}
        y={y + 26}
        textAnchor="middle"
        fontSize={14}
        fontWeight={600}
        fill={COLORS.blue}
      >
        distance {name} = {format(Math.abs(x - centre))}
      </text>
    </g>
  );
}

/** a sign table lined up under the number line: one row per factor, then the product */
function SignTable({
  roots,
  x,
  at,
  lo,
  hi,
  expr,
  holds,
  top,
  pointer,
}: {
  roots: [number, number];
  x: number;
  at: (n: number) => number;
  lo: number;
  hi: number;
  expr: string;
  holds: (n: number) => boolean;
  top: number;
  /** the colour of the line at x */
  pointer: string;
}) {
  const sorted = [...roots].sort((p, q) => p - q);
  // the pieces of the line between the roots
  const pieces: [number, number][] = [];
  let edge = lo;
  for (const end of [...sorted, hi]) {
    if (end > edge) pieces.push([edge, end]);
    edge = Math.max(edge, end);
  }
  const product = (n: number) => sorted.reduce((acc, r) => acc * (n - r), 1);
  const rows = [
    ...sorted.map((r) => ({
      name: factor(r),
      roots: [r],
      value: (n: number) => n - r,
    })),
    { name: expr, roots: sorted, value: product },
  ];
  const rowY = (i: number) => top + i * 30;

  return (
    <g fontSize={15}>
      {/* the piece x is in */}
      {pieces.map(([s, e]) =>
        x > s && x < e ? (
          <rect
            key={s}
            x={at(s)}
            y={top - 18}
            width={at(e) - at(s)}
            height={rows.length * 30 + 4}
            fill="currentColor"
            fillOpacity={0.06}
          />
        ) : null,
      )}
      {sorted.map((r, i) => (
        <line
          key={i}
          x1={at(r)}
          x2={at(r)}
          y1={top - 18}
          y2={rowY(rows.length - 1) + 10}
          stroke="currentColor"
          strokeOpacity={0.3}
          strokeDasharray="3 4"
        />
      ))}
      {/* the line at x, broken where it crosses a row so the signs stay readable */}
      {rows.map((_, i) => (
        <line
          key={i}
          x1={at(x)}
          x2={at(x)}
          y1={i === 0 ? top - 18 : rowY(i - 1) + 9}
          y2={rowY(i) - 9}
          stroke={pointer}
          strokeWidth={2}
          strokeOpacity={0.7}
        />
      ))}
      {rows.map((row, i) => {
        const last = i === rows.length - 1;
        return (
          <g key={i}>
            <text
              x={TABLE_LABELS - 14}
              y={rowY(i) + 5}
              textAnchor="end"
              fill="currentColor"
              fontWeight={last ? 600 : 400}
            >
              {row.name}
            </text>
            {pieces.map(([s, e]) => {
              const mid = (s + e) / 2;
              const n = row.value(mid);
              const good = last && holds(mid);
              return (
                <text
                  key={s}
                  x={(at(s) + at(e)) / 2}
                  y={rowY(i) + 6}
                  textAnchor="middle"
                  fontSize={20}
                  fontWeight={700}
                  fill={good ? COLORS.green : "currentColor"}
                  className={
                    good
                      ? undefined
                      : last
                        ? undefined
                        : "fill-fd-muted-foreground"
                  }
                >
                  {sign(n)}
                </text>
              );
            })}
            {row.roots.map((r, j) => (
              <text
                key={j}
                x={at(r)}
                y={rowY(i) + 5}
                textAnchor="middle"
                fontSize={13}
                className="fill-fd-muted-foreground"
                stroke="var(--color-fd-card)"
                strokeWidth={4}
                paintOrder="stroke"
              >
                0
              </text>
            ))}
          </g>
        );
      })}
    </g>
  );
}
