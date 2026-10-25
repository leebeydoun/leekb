"use client";

/**
 * The segment from P to Q as the points P + t(Q − P). A slider moves t from −0.5 to 1.5, and the
 * point X = P + t(Q − P) moves with it: along the solid segment PQ while 0 ≤ t ≤ 1, and on along
 * the faint dashed line through P and Q past either end. The readout says how far along X is and
 * compares d(P, X) and d(X, Q) with d(P, Q). Two buttons choose between two pairs P, Q.
 */

import { useState } from "react";
import { clipLine, Grid, gridScale } from "./grid";
import { Choice, COLORS, format, Interactive, Slider } from "./kit";

type Pair = [number, number];

const X_RANGE: [number, number] = [-2, 8];
const Y_RANGE: [number, number] = [-1, 8];

// both pairs are 5 apart, so d(P, X) = 5|t| is a tidy number
const PRESETS = {
  up: { p: [1, 1] as Pair, q: [5, 4] as Pair, label: "(1, 1) to (5, 4)" },
  down: {
    p: [2, 6] as Pair,
    q: [6, 3] as Pair,
    label: "(2, 6) to (6, 3)",
  },
};
type Preset = keyof typeof PRESETS;

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 5,
  strokeLinejoin: "round" as const,
  paintOrder: "stroke" as const,
};

const pair = ([x, y]: Pair) => `(${format(x)}, ${format(y)})`;

/** how far along the segment t is, in words */
function along(t: number) {
  const words: Record<string, string> = {
    "0": "at P itself",
    "0.25": "a quarter of the way from P to Q",
    "0.5": "halfway from P to Q",
    "0.75": "three quarters of the way from P to Q",
    "1": "at Q itself",
  };
  return words[String(t)] ?? `${format(t)} of the way from P to Q`;
}

export function SegmentSlider({
  caption = "Move t. Between 0 and 1 the point X stays on the segment PQ. Below 0 or above 1 the same formula carries X on along the line, past P or past Q.",
}: {
  caption?: string;
}) {
  const [preset, setPreset] = useState<Preset>("up");
  const [t, setT] = useState(0.25);
  const { px, py } = gridScale(X_RANGE, Y_RANGE);

  const { p: P, q: Q } = PRESETS[preset];
  const step: Pair = [Q[0] - P[0], Q[1] - P[1]];
  const X: Pair = [P[0] + t * step[0], P[1] + t * step[1]];
  const length = Math.hypot(step[0], step[1]);
  const toP = Math.abs(t) * length;
  const toQ = Math.abs(1 - t) * length;
  const inside = t >= 0 && t <= 1;

  // the whole line through P and Q, as a·x + b·y = c, cut to the edges of the grid
  const a = step[1];
  const b = -step[0];
  const ends = clipLine(a, b, a * P[0] + b * P[1], X_RANGE, Y_RANGE);

  const at = ([x, y]: Pair) => ({ x: px(x), y: py(y) });
  const sP = at(P);
  const sQ = at(Q);
  const sX = at(X);

  // names sit to one side of the line, square on to it, so they never lie on the line itself
  const normal = { x: step[1] / length, y: step[0] / length };
  function name(point: { x: number; y: number }, text: string, side: 1 | -1) {
    return {
      x: point.x + side * normal.x * 18,
      y: point.y + side * normal.y * 18 + 5,
      text,
    };
  }
  const labels = [
    { ...name(sP, "P", 1), color: COLORS.blue },
    { ...name(sQ, "Q", 1), color: COLORS.blue },
    { ...name(sX, "X", -1), color: COLORS.orange },
  ];

  const tText = `t = ${format(t)}`;
  const readout = (
    <>
      <div>
        {inside
          ? `${tText}: ${along(t)}`
          : `${tText}: outside the segment, on the line past ${t < 0 ? "P" : "Q"}`}
      </div>
      <div className="mt-1">
        X = P + t(Q − P) = {pair(P)} + {t < 0 ? `(${format(t)})` : format(t)} ·{" "}
        {pair(step)} = {pair(X)}
      </div>
      <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
        {inside
          ? `d(P, X) = ${format(t)} d(P, Q) = ${format(toP)} and d(X, Q) = ${format(1 - t)} d(P, Q) = ${format(toQ)}, which add up to d(P, Q) = ${format(length)}.`
          : `d(P, X) = ${format(toP)} and d(X, Q) = ${format(toQ)}, which add up to more than d(P, Q) = ${format(length)}.`}
      </div>
    </>
  );

  return (
    <Interactive
      caption={caption}
      readout={readout}
      controls={
        <>
          <Slider
            label="t"
            value={t}
            onChange={setT}
            min={-0.5}
            max={1.5}
            step={0.05}
          />
          <Choice
            label="P to Q"
            value={preset}
            onChange={setPreset}
            options={[
              { value: "up", label: PRESETS.up.label },
              { value: "down", label: PRESETS.down.label },
            ]}
          />
        </>
      }
    >
      <Grid
        x={X_RANGE}
        y={Y_RANGE}
        label={`The segment from P ${pair(P)} to Q ${pair(Q)}, with X at ${pair(X)} for t = ${format(t)}, ${inside ? "on the segment" : "on the line outside the segment"}.`}
      >
        {/* the rest of the line through P and Q, faint and dashed */}
        {ends && (
          <line
            x1={px(ends[0][0])}
            y1={py(ends[0][1])}
            x2={px(ends[1][0])}
            y2={py(ends[1][1])}
            stroke="currentColor"
            strokeOpacity={0.45}
            strokeWidth={1.5}
            strokeDasharray="6 5"
          />
        )}
        {/* the segment PQ itself */}
        <line
          x1={sP.x}
          y1={sP.y}
          x2={sQ.x}
          y2={sQ.y}
          stroke={COLORS.blue}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <circle cx={sP.x} cy={sP.y} r={5.5} fill={COLORS.blue} />
        <circle cx={sQ.x} cy={sQ.y} r={5.5} fill={COLORS.blue} />
        <circle
          cx={sX.x}
          cy={sX.y}
          r={7}
          fill={inside ? COLORS.orange : "var(--color-fd-card)"}
          stroke={COLORS.orange}
          strokeWidth={3}
        />
        {labels.map((label) => (
          <text
            key={label.text}
            x={label.x}
            y={label.y}
            textAnchor="middle"
            fontSize={15}
            fontWeight={700}
            fill={label.color}
            {...halo}
          >
            {label.text}
          </text>
        ))}
      </Grid>
    </Interactive>
  );
}
