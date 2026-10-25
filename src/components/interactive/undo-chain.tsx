"use client";

/**
 * UndoChain: a point X = (1, 1) of the plane and three moves done one after another: S, the slide
 * by (2, 1); G, the quarter turn anticlockwise about O; and D, the stretch across by 2,
 * (x, y) ↦ (2x, y). After the three moves come three undo steps, either in the reverse order
 * (D⁻¹, then G⁻¹, then S⁻¹), which brings the point home, or in the same order (S⁻¹, then G⁻¹,
 * then D⁻¹), which leaves it somewhere else. Each press of the button does one step, the picture
 * draws the path so far, and the readout lists the coordinates after each step.
 */

import { useState } from "react";
import { Grid, gridScale } from "./grid";
import { Button, COLORS, Choice, Interactive, format } from "./kit";

type Pt = [number, number];
type Order = "reverse" | "same";
type Move = { name: string; f: (p: Pt) => Pt };

const X_RANGE: [number, number] = [-7, 4];
const Y_RANGE: [number, number] = [-2, 7];
const START: Pt = [1, 1];

const S: Move = { name: "S", f: ([x, y]) => [x + 2, y + 1] };
const G: Move = { name: "G", f: ([x, y]) => [-y, x] };
const D: Move = { name: "D", f: ([x, y]) => [2 * x, y] };
const S_BACK: Move = { name: "S⁻¹", f: ([x, y]) => [x - 2, y - 1] };
const G_BACK: Move = { name: "G⁻¹", f: ([x, y]) => [y, -x] };
const D_BACK: Move = { name: "D⁻¹", f: ([x, y]) => [x / 2, y] };

const FORWARD = [S, G, D];
const UNDO: Record<Order, Move[]> = {
  reverse: [D_BACK, G_BACK, S_BACK],
  same: [S_BACK, G_BACK, D_BACK],
};

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

const point = ([x, y]: Pt) => `(${format(x)}, ${format(y)})`;

export function UndoChain({
  order: startOrder = "reverse",
  steps: startSteps = 0,
  caption = "Press the button to do the moves S, then G, then D, one at a time, and then to undo them. Switch the undo order to see which one brings the point home.",
}: {
  /** the undo order at the start */
  order?: Order;
  /** how many of the six steps are done at the start */
  steps?: number;
  caption?: string;
}) {
  const [order, setOrder] = useState<Order>(startOrder);
  const [steps, setSteps] = useState(startSteps);

  const moves = [...FORWARD, ...UNDO[order]];
  const path: Pt[] = [START];
  for (const m of moves.slice(0, steps)) path.push(m.f(path[path.length - 1]!));

  const { px, py } = gridScale(X_RANGE, Y_RANGE);
  const undoColor = order === "reverse" ? COLORS.green : COLORS.red;

  const chain = (from: number, to: number) => (
    <>
      {from === 0 ? <>X = {point(START)}</> : point(path[from]!)}
      {moves.slice(from, Math.min(to, steps)).map((m, i) => (
        <span key={i}>
          {" "}
          → {m.name} → {point(path[from + i + 1]!)}
        </span>
      ))}
    </>
  );

  const end = path[path.length - 1]!;
  const home = Math.abs(end[0] - START[0]) + Math.abs(end[1] - START[1]) < 1e-9;
  const verdict =
    steps < 6
      ? steps < 3
        ? "Doing the moves."
        : steps === 3
          ? "All three moves done. Now undo them, one step at a time."
          : "Undoing them."
      : home
        ? "Back at X: undoing in the reverse order works."
        : `Not back at X but at ${point(end)}: undoing in the same order fails.`;

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>{chain(0, 3)}</div>
          <div className="mt-1">{steps > 3 ? chain(3, 6) : "\u00a0"}</div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {verdict}
          </div>
        </>
      }
      controls={
        <>
          <Choice
            label="undo"
            value={order}
            onChange={(o) => {
              setOrder(o);
              setSteps((k) => Math.min(k, 3));
            }}
            options={[
              { value: "reverse", label: "in reverse order" },
              { value: "same", label: "in the same order" },
            ]}
          />
          <Button
            primary
            onClick={() => setSteps((k) => k + 1)}
            disabled={steps >= 6}
          >
            {steps < 6 ? `Do ${moves[steps]!.name}` : "Done"}
          </Button>
          <Button onClick={() => setSteps(0)}>Start again</Button>
        </>
      }
    >
      <Grid
        x={X_RANGE}
        y={Y_RANGE}
        label={`The point X = (1, 1) and the path it takes through ${steps} steps, ending at ${point(end)}.`}
      >
        {path.slice(1).map((q, i) => {
          const p = path[i]!;
          const x1 = px(p[0]);
          const y1 = py(p[1]);
          const x2 = px(q[0]);
          const y2 = py(q[1]);
          const len = Math.hypot(x2 - x1, y2 - y1);
          const ux = (x2 - x1) / len;
          const uy = (y2 - y1) / len;
          const color = i < 3 ? COLORS.blue : undoColor;
          // undo arrows run a little to one side, so they stay visible when they retrace a move
          const shift = i < 3 ? 0 : 5;
          const sx = -uy * shift;
          const sy = ux * shift;
          const bx = x2 - ux * 13 + sx;
          const by = y2 - uy * 13 + sy;
          return (
            <g key={i}>
              <line
                x1={x1 + ux * 8 + sx}
                y1={y1 + uy * 8 + sy}
                x2={x2 - ux * 10 + sx}
                y2={y2 - uy * 10 + sy}
                stroke={color}
                strokeWidth={2.5}
                strokeDasharray={i < 3 ? undefined : "6 4"}
              />
              <polygon
                points={`${x2 - ux * 6 + sx},${y2 - uy * 6 + sy} ${bx - uy * 5},${by + ux * 5} ${bx + uy * 5},${by - ux * 5}`}
                fill={color}
              />
              <text
                x={(x1 + x2) / 2 + sx - uy * 12}
                y={(y1 + y2) / 2 + sy + ux * 12 + 4}
                textAnchor="middle"
                fontSize={14}
                fontWeight={600}
                fill={color}
                {...halo}
              >
                {moves[i]!.name}
              </text>
            </g>
          );
        })}
        <circle
          cx={px(START[0])}
          cy={py(START[1])}
          r={11}
          fill="none"
          stroke={COLORS.purple}
          strokeWidth={2}
        />
        <text
          x={px(START[0]) + 14}
          y={py(START[1]) + 20}
          fontSize={14}
          fontWeight={700}
          fill={COLORS.purple}
          {...halo}
        >
          X
        </text>
        {path.map((p, i) => (
          <circle
            key={i}
            cx={px(p[0])}
            cy={py(p[1])}
            r={i === path.length - 1 ? 7 : 5}
            fill={i === path.length - 1 ? COLORS.orange : "currentColor"}
            stroke="var(--color-fd-card)"
            strokeWidth={2}
          />
        ))}
      </Grid>
    </Interactive>
  );
}
