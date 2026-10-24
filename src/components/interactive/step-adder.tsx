"use client";

/**
 * Adding two points as two steps. Sliders choose A and B; the picture takes the step A from O and
 * then the step B (solid), and also B first and then A (dashed), so the two routes close up into a
 * parallelogram with the sum at the far corner. A second setting shows A − B instead: the step that
 * takes B to A, drawn both from O and from B.
 */

import { useState } from "react";
import { Grid, gridScale } from "./grid";
import { Choice, COLORS, format, Interactive, Slider } from "./kit";

type StepAdderProps = {
  /** where A and B start, as [x, y] */
  a?: [number, number];
  b?: [number, number];
  caption?: string;
};

type Mode = "sum" | "difference";
type Pair = [number, number];

const RANGE: [number, number] = [-8, 8];

const pair = ([x, y]: Pair) => `(${format(x)}, ${format(y)})`;

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 5,
  strokeLinejoin: "round" as const,
  paintOrder: "stroke" as const,
};

/** an arrow between two points of the grid, drawn in screen units, with its head at `to` */
function Arrow({
  from,
  to,
  color,
  dashed = false,
  width = 3,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
  dashed?: boolean;
  width?: number;
}) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  if (length < 1) return null;
  const ux = dx / length;
  const uy = dy / length;
  const head = Math.min(12, length * 0.45);
  const half = head * 0.5;
  // the shaft stops where the head begins, so a dashed shaft doesn't poke through the tip
  const bx = to.x - ux * head;
  const by = to.y - uy * head;
  return (
    <g>
      <line
        x1={from.x}
        y1={from.y}
        x2={bx}
        y2={by}
        stroke={color}
        strokeWidth={width}
        strokeDasharray={dashed ? "7 5" : undefined}
        strokeLinecap="round"
      />
      <polygon
        points={`${to.x},${to.y} ${bx - uy * half},${by + ux * half} ${bx + uy * half},${by - ux * half}`}
        fill={color}
      />
    </g>
  );
}

export function StepAdder({
  a: [a1_0, a2_0] = [3, 1],
  b: [b1_0, b2_0] = [1, 2],
  caption,
}: StepAdderProps) {
  const [a1, setA1] = useState(a1_0);
  const [a2, setA2] = useState(a2_0);
  const [b1, setB1] = useState(b1_0);
  const [b2, setB2] = useState(b2_0);
  const [mode, setMode] = useState<Mode>("sum");
  const { px, py } = gridScale(RANGE, RANGE);

  const A: Pair = [a1, a2];
  const B: Pair = [b1, b2];
  const sum: Pair = [a1 + b1, a2 + b2];
  const diff: Pair = [a1 - b1, a2 - b2];
  const at = ([x, y]: Pair) => ({ x: px(x), y: py(y) });
  const O = at([0, 0]);

  // a point's name goes on the side away from the middle of the picture, so names rarely meet
  function mark(p: Pair, name: string, color: string) {
    const c = at(p);
    const right = p[0] >= 0;
    const up = p[1] >= 0;
    return (
      <g key={name}>
        <circle cx={c.x} cy={c.y} r={5.5} fill={color} />
        <text
          x={c.x + (right ? 9 : -9)}
          y={c.y + (up ? -9 : 19)}
          textAnchor={right ? "start" : "end"}
          fontSize={14}
          fontWeight={700}
          fill={color}
          {...halo}
        >
          {name}
        </text>
      </g>
    );
  }

  const readout =
    mode === "sum" ? (
      <>
        <div>
          A + B = {pair(A)} + {pair(B)} = {pair(sum)}
        </div>
        <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
          A then B: O → {pair(A)} → {pair(sum)}. B then A: O → {pair(B)} →{" "}
          {pair(sum)}. Both routes end at the same corner.
        </div>
      </>
    ) : (
      <>
        <div>
          A − B = {pair(A)} − {pair(B)} = {pair(diff)}
        </div>
        <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
          The step A − B taken from B lands on A: {pair(B)} + {pair(diff)} ={" "}
          {pair(A)}.
        </div>
      </>
    );

  return (
    <Interactive
      caption={caption}
      readout={readout}
      controls={
        <>
          <Slider label="A: a₁" value={a1} onChange={setA1} min={-4} max={4} />
          <Slider label="A: a₂" value={a2} onChange={setA2} min={-4} max={4} />
          <Slider label="B: b₁" value={b1} onChange={setB1} min={-4} max={4} />
          <Slider label="B: b₂" value={b2} onChange={setB2} min={-4} max={4} />
          <Choice
            label="show"
            value={mode}
            onChange={setMode}
            options={[
              { value: "sum", label: "A + B" },
              { value: "difference", label: "A − B" },
            ]}
          />
        </>
      }
    >
      <Grid
        x={RANGE}
        y={RANGE}
        label={
          mode === "sum"
            ? `A at ${pair(A)} and B at ${pair(B)}. Taking the step A and then the step B, or B and then A, ends at A + B = ${pair(sum)}.`
            : `A at ${pair(A)} and B at ${pair(B)}. The step from B to A is A − B = ${pair(diff)}.`
        }
      >
        {mode === "sum" ? (
          <>
            {/* the parallelogram, lightly filled */}
            <polygon
              points={[[0, 0], A, sum, B]
                .map((p) => {
                  const c = at(p as Pair);
                  return `${c.x},${c.y}`;
                })
                .join(" ")}
              fill={COLORS.purple}
              fillOpacity={0.07}
            />
            {/* B then A, dashed */}
            <Arrow from={O} to={at(B)} color={COLORS.orange} dashed />
            <Arrow from={at(B)} to={at(sum)} color={COLORS.blue} dashed />
            {/* A then B, solid */}
            <Arrow from={O} to={at(A)} color={COLORS.blue} />
            <Arrow from={at(A)} to={at(sum)} color={COLORS.orange} />
            {/* the sum in one step */}
            <Arrow from={O} to={at(sum)} color={COLORS.purple} width={2} />
            {mark(B, "B", COLORS.orange)}
            {mark(A, "A", COLORS.blue)}
            {mark(sum, "A + B", COLORS.purple)}
          </>
        ) : (
          <>
            {/* the step A − B, from O and again from B */}
            <Arrow from={O} to={at(B)} color={COLORS.orange} />
            <Arrow from={at(B)} to={at(A)} color={COLORS.green} dashed />
            <Arrow from={O} to={at(diff)} color={COLORS.green} />
            <Arrow from={O} to={at(A)} color={COLORS.blue} />
            {mark(B, "B", COLORS.orange)}
            {mark(A, "A", COLORS.blue)}
            {mark(diff, "A − B", COLORS.green)}
          </>
        )}
        <circle cx={O.x} cy={O.y} r={4} fill="currentColor" />
        <text
          x={O.x - 8}
          y={O.y + 17}
          textAnchor="end"
          fontSize={14}
          fontWeight={700}
          fill="currentColor"
          {...halo}
        >
          O
        </text>
      </Grid>
    </Interactive>
  );
}
