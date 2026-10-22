"use client";

/**
 * The shortest route via a river bank. You walk from the house P to a point X on the bank, then on
 * to the garden gate Q. One slider moves X along the bank. The reflection P' of the house in the
 * bank is drawn faintly across the water: the walk from P to X is as long as the dashed line from
 * P' to X, so the whole route is shortest when X lies on the straight line from P' to Q.
 */

import { useState } from "react";
import { COLORS, Interactive, Slider, format, useSmooth } from "./kit";

const UNIT = 52;
const PAD = 26;
const X0 = -0.3;
const X1 = 8.3;
const Y0 = -3;
const Y1 = 3.2;
const WIDTH = (X1 - X0) * UNIT + PAD * 2;
const HEIGHT = (Y1 - Y0) * UNIT + PAD * 2;

type Vec = { x: number; y: number };

const px = (p: Vec): Vec => ({
  x: PAD + (p.x - X0) * UNIT,
  y: PAD + (Y1 - p.y) * UNIT,
});

const distance = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);

/** the bank is the line y = 0, with the water below it */
const P: Vec = { x: 1, y: 2.5 };
const Q: Vec = { x: 6, y: 1.5 };
const MIRRORED: Vec = { x: P.x, y: -P.y };
/** where the straight line from P' to Q crosses the bank */
const BEST =
  MIRRORED.x + ((Q.x - MIRRORED.x) * -MIRRORED.y) / (Q.y - MIRRORED.y);
const SHORTEST = distance(MIRRORED, Q);

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

export function RiverRoute() {
  const [stop, setStop] = useState(2);
  const shown = useSmooth(stop);
  const X: Vec = { x: shown, y: 0 };
  const total = distance(P, { x: stop, y: 0 }) + distance({ x: stop, y: 0 }, Q);
  const best = Math.abs(stop - BEST) < 1e-9;

  const dot = (p: Vec, name: string, color: string, dy = -14, opacity = 1) => (
    <g opacity={opacity}>
      <circle cx={px(p).x} cy={px(p).y} r={5} fill={color} />
      <text
        x={px(p).x}
        y={px(p).y + dy + 5}
        textAnchor="middle"
        fontSize={16}
        fontStyle="italic"
        fill={color}
        {...halo}
      >
        {name}
      </text>
    </g>
  );
  const segment = (
    a: Vec,
    b: Vec,
    color: string,
    dashed = false,
    opacity = 1,
  ) => (
    <line
      x1={px(a).x}
      y1={px(a).y}
      x2={px(b).x}
      y2={px(b).y}
      stroke={color}
      strokeOpacity={opacity}
      strokeWidth={dashed ? 2 : 3}
      strokeDasharray={dashed ? "7 5" : undefined}
      strokeLinecap="round"
    />
  );

  return (
    <Interactive
      readout={
        <>
          <div>
            d(P, X) + d(X, Q) = {format(distance(P, { x: stop, y: 0 }))} +{" "}
            {format(distance({ x: stop, y: 0 }, Q))} = {format(total)}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {best
              ? `X is on the straight line from P′ to Q, so this is the shortest route: ${format(SHORTEST)}.`
              : `The shortest route is ${format(SHORTEST)}, the straight distance from P′ to Q. This one is ${format(total - SHORTEST)} longer.`}
          </div>
        </>
      }
      controls={
        <Slider
          label={
            <>
              where you reach the bank, <i>X</i>
            </>
          }
          value={stop}
          onChange={setStop}
          min={0}
          max={8}
          step={0.125}
        />
      }
      caption="Move X along the bank. The walk from P to X is as long as the dashed line from the mirror image P′ to X, so the route is shortest when P′, X and Q line up."
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-xl text-fd-foreground"
        role="img"
        aria-label={`A route from P to the river bank at X and on to Q, of total length ${format(total)}`}
      >
        {/* the river, below the bank */}
        <rect
          x={px({ x: X0, y: 0 }).x - PAD}
          y={px({ x: 0, y: 0 }).y}
          width={WIDTH}
          height={HEIGHT - px({ x: 0, y: 0 }).y}
          fill={COLORS.blue}
          fillOpacity={0.12}
        />
        <line
          x1={0}
          y1={px({ x: 0, y: 0 }).y}
          x2={WIDTH}
          y2={px({ x: 0, y: 0 }).y}
          stroke={COLORS.blue}
          strokeWidth={2.5}
        />
        <text
          x={WIDTH - PAD}
          y={px({ x: 0, y: 0 }).y + 22}
          textAnchor="end"
          fontSize={14}
          fill={COLORS.blue}
          {...halo}
        >
          river
        </text>

        {/* the straight line from P' to Q, and the mirror copy of the first leg */}
        {segment(MIRRORED, Q, "currentColor", true, 0.3)}
        {segment(MIRRORED, X, COLORS.purple, true, 0.8)}
        {segment(P, MIRRORED, "currentColor", true, 0.18)}

        {/* the route itself */}
        {segment(P, X, COLORS.orange)}
        {segment(X, Q, COLORS.orange)}

        {dot(P, "P", "currentColor")}
        {dot(Q, "Q", "currentColor")}
        {dot(MIRRORED, "P′", COLORS.purple, 22, 0.75)}
        {dot(X, "X", COLORS.orange, 22)}
      </svg>
    </Interactive>
  );
}
