"use client";

/**
 * Two half turns, one after the other. Sliders set the two centres Q and M. The flag is turned half
 * a turn about Q (drawn faded), then half a turn about M, and lands the right way up again, slid by
 * 2(M − Q). One corner's path is drawn through both centres, with an arrow for the single slide.
 */

import { useState } from "react";
import { Grid, gridScale } from "./grid";
import { COLORS, Interactive, Slider, format, useSmooth } from "./kit";
import { FLAG, type Vec } from "./moving-shape";

const RANGE: [number, number] = [-9, 9];
// the flag, a little bigger than usual, with its marked bottom-left corner P at (−0.5, −0.7)
const START: Vec[] = FLAG.map((p) => ({
  x: -0.5 + 1.2 * p.x,
  y: -0.7 + 1.2 * p.y,
}));

const halfTurn = (p: Vec, centre: Vec): Vec => ({
  x: 2 * centre.x - p.x,
  y: 2 * centre.y - p.y,
});

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

export function HalfTurnPair() {
  const [q1, setQ1] = useState(-1);
  const [q2, setQ2] = useState(0);
  const [m1, setM1] = useState(1);
  const [m2, setM2] = useState(1);
  // the picture glides to each new pair of centres; the readout uses the slider values
  const shownQ1 = useSmooth(q1);
  const shownQ2 = useSmooth(q2);
  const shownM1 = useSmooth(m1);
  const shownM2 = useSmooth(m2);
  const Q = { x: shownQ1, y: shownQ2 };
  const M = { x: shownM1, y: shownM2 };
  const { px, py } = gridScale(RANGE, RANGE);
  const at = (p: Vec): Vec => ({ x: px(p.x), y: py(p.y) });
  const points = (corners: Vec[]) =>
    corners
      .map(at)
      .map(({ x, y }) => `${x},${y}`)
      .join(" ");

  const middle = START.map((p) => halfTurn(p, Q));
  const end = middle.map((p) => halfTurn(p, M));
  const p0 = at(START[0]!);
  const p1 = at(middle[0]!);
  const p2 = at(end[0]!);
  const q = at(Q);
  const m = at(M);

  const step = { x: 2 * (m1 - q1), y: 2 * (m2 - q2) };
  const same = m1 === q1 && m2 === q2;

  // the arrow for the slide, from P to where it ends up, with its head at the end
  const length = Math.hypot(p2.x - p0.x, p2.y - p0.y);
  const ux = length ? (p2.x - p0.x) / length : 0;
  const uy = length ? (p2.y - p0.y) / length : 0;
  const base = { x: p2.x - ux * 11, y: p2.y - uy * 11 };

  const slider = (
    name: string,
    value: number,
    set: (value: number) => void,
  ) => (
    <Slider
      label={<i>{name}</i>}
      value={value}
      onChange={set}
      min={-2}
      max={2}
    />
  );

  return (
    <Interactive
      readout={
        <>
          <div>
            Slide by 2(M − Q) = 2 × ({format(m1 - q1)}, {format(m2 - q2)}) = (
            {format(step.x)}, {format(step.y)})
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {same
              ? "M = Q, so the second half turn undoes the first, and the flag ends where it started."
              : `Q = (${format(q1)}, ${format(q2)}) and M = (${format(m1)}, ${format(m2)}). The turn about Q leaves the flag upside down, and the turn about M puts it the right way up again, (${format(step.x)}, ${format(step.y)}) from where it started.`}
          </div>
        </>
      }
      controls={
        <>
          {slider("q₁", q1, setQ1)}
          {slider("q₂", q2, setQ2)}
          {slider("m₁", m1, setM1)}
          {slider("m₂", m2, setM2)}
        </>
      }
      caption="The faded orange flag is the half turn about Q. Turning that about M gives the blue flag, the start slid by 2(M − Q). The dotted path of the corner P passes through Q and then M."
    >
      <Grid
        x={RANGE}
        y={RANGE}
        label={`A flag turned half a turn about Q = (${format(q1)}, ${format(q2)}) and then about M = (${format(m1)}, ${format(m2)}). It ends up slid by (${format(step.x)}, ${format(step.y)}).`}
      >
        {/* the start, faint, and its half turn about Q, faded orange */}
        <polygon
          points={points(START)}
          fill={COLORS.blue}
          fillOpacity={0.08}
          stroke={COLORS.blue}
          strokeOpacity={0.5}
          strokeWidth={2}
          strokeDasharray="5 4"
          strokeLinejoin="round"
        />
        <polygon
          points={points(middle)}
          fill={COLORS.orange}
          fillOpacity={0.12}
          stroke={COLORS.orange}
          strokeOpacity={0.6}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <polygon
          points={points(end)}
          fill={COLORS.blue}
          fillOpacity={0.3}
          stroke={COLORS.blue}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {/* the marked corner's path: through Q to its half turn, then through M */}
        <polyline
          points={`${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y}`}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.45}
          strokeWidth={1.5}
          strokeDasharray="2 4"
        />
        {/* the single slide that does the same as both half turns */}
        {length > 12 && (
          <g>
            <line
              x1={p0.x}
              y1={p0.y}
              x2={base.x}
              y2={base.y}
              stroke={COLORS.green}
              strokeWidth={2.5}
            />
            <polygon
              points={`${p2.x},${p2.y} ${base.x - uy * 6},${base.y + ux * 6} ${base.x + uy * 6},${base.y - ux * 6}`}
              fill={COLORS.green}
            />
          </g>
        )}
        <circle cx={p0.x} cy={p0.y} r={4} fill={COLORS.blue} />
        <text
          x={p0.x - 12}
          y={p0.y + 16}
          textAnchor="middle"
          fontSize={14}
          fontStyle="italic"
          fill={COLORS.blue}
          {...halo}
        >
          P
        </text>
        {[
          { at: q, name: "Q", color: COLORS.purple },
          { at: m, name: "M", color: COLORS.red },
        ].map(({ at: c, name, color }) => (
          <g key={name}>
            <circle cx={c.x} cy={c.y} r={5} fill={color} />
            <text
              x={c.x + 13}
              y={c.y - 8}
              textAnchor="middle"
              fontSize={15}
              fontWeight={600}
              fontStyle="italic"
              fill={color}
              {...halo}
            >
              {name}
            </text>
          </g>
        ))}
      </Grid>
    </Interactive>
  );
}
