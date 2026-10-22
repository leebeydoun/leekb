"use client";

/**
 * Distances from a moving point, one idea each. BisectorDistances slides M along a line above two
 * fixed points P and Q, and compares d(P, M) with d(Q, M): they are equal exactly when M is on the
 * perpendicular bisector of PQ. ShortestDistance slides M along a line below a fixed point P, and
 * shows that d(P, M) is smallest at the foot of the perpendicular from P.
 */

import { useState } from "react";
import { COLORS, Interactive, Slider, format, useSmooth } from "./kit";

/** pixels per unit */
const UNIT = 56;
const PAD = 32;

type Vec = { x: number; y: number };

// a label with a halo in the card colour, so it stays readable over the lines
const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

/** from units to pixels for a box from (x0, y0) to (x1, y1), with y pointing up */
function scale(x0: number, x1: number, y0: number, y1: number) {
  return {
    width: (x1 - x0) * UNIT + PAD * 2,
    height: (y1 - y0) * UNIT + PAD * 2,
    px: (p: Vec) => ({
      x: PAD + (p.x - x0) * UNIT,
      y: PAD + (y1 - p.y) * UNIT,
    }),
  };
}

const distance = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);

/** a point drawn as a dot with an italic name beside it */
function Point({
  at,
  name,
  color = "currentColor",
  dx = 0,
  dy = -14,
}: {
  at: Vec;
  name: string;
  color?: string;
  dx?: number;
  dy?: number;
}) {
  return (
    <g>
      <circle cx={at.x} cy={at.y} r={4.5} fill={color} />
      <text
        x={at.x + dx}
        y={at.y + dy + 5}
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
}

/** a dashed segment with its length written beside its middle */
function Measured({
  from,
  to,
  color,
  length,
  side = 1,
}: {
  from: Vec;
  to: Vec;
  color: string;
  length: number;
  /** 1 puts the label on the left going from `from` to `to`, −1 on the right */
  side?: 1 | -1;
}) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const size = Math.hypot(dx, dy) || 1;
  const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  const label = {
    x: mid.x + (side * dy * 18) / size,
    y: mid.y - (side * dx * 18) / size,
  };
  return (
    <g>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={color}
        strokeWidth={2.5}
        strokeDasharray="7 5"
        strokeLinecap="round"
      />
      <text
        x={label.x}
        y={label.y + 5}
        textAnchor="middle"
        fontSize={14}
        fontWeight={600}
        fill={color}
        {...halo}
      >
        {format(length)}
      </text>
    </g>
  );
}

/** M slides along a line above P and Q: d(P, M) = d(Q, M) exactly on the perpendicular bisector. */
export function BisectorDistances() {
  const [m, setM] = useState(1.5);
  const shown = useSmooth(m);
  const { width, height, px } = scale(-4, 4, -0.6, 3.6);

  const P = { x: -2, y: 0 };
  const Q = { x: 2, y: 0 };
  const M = { x: shown, y: 2.5 };
  const toP = distance(P, { x: m, y: 2.5 });
  const toQ = distance(Q, { x: m, y: 2.5 });
  const equal = Math.abs(m) < 1e-9;

  return (
    <Interactive
      readout={
        <>
          <div>
            d(P, M) = {format(toP)} and d(Q, M) = {format(toQ)}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {equal
              ? "M is on the perpendicular bisector, and the two distances are equal."
              : `M is ${format(Math.abs(m))} to the ${m < 0 ? "left" : "right"} of the perpendicular bisector, so it is closer to ${m < 0 ? "P" : "Q"}.`}
          </div>
        </>
      }
      controls={
        <Slider
          label={
            <>
              position of <i>M</i>
            </>
          }
          value={m}
          onChange={setM}
          min={-3}
          max={3}
          step={0.5}
        />
      }
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto block h-auto w-full max-w-lg text-fd-foreground"
        role="img"
        aria-label={`Points P and Q with their perpendicular bisector, and a point M at distances ${format(toP)} from P and ${format(toQ)} from Q`}
      >
        {/* the segment PQ, and its perpendicular bisector through the midpoint */}
        <line
          x1={px(P).x}
          y1={px(P).y}
          x2={px(Q).x}
          y2={px(Q).y}
          stroke="currentColor"
          strokeWidth={1.75}
        />
        <line
          x1={px({ x: 0, y: -0.6 }).x}
          y1={px({ x: 0, y: -0.6 }).y}
          x2={px({ x: 0, y: 3.6 }).x}
          y2={px({ x: 0, y: 3.6 }).y}
          stroke={COLORS.purple}
          strokeWidth={2}
          strokeOpacity={0.7}
        />
        {/* the line M slides along, drawn faintly */}
        <line
          x1={px({ x: -4, y: 2.5 }).x}
          y1={px({ x: -4, y: 2.5 }).y}
          x2={px({ x: 4, y: 2.5 }).x}
          y2={px({ x: 4, y: 2.5 }).y}
          stroke="currentColor"
          strokeOpacity={0.25}
          strokeWidth={1.5}
        />
        <Measured from={px(P)} to={px(M)} color={COLORS.blue} length={toP} />
        <Measured
          from={px(Q)}
          to={px(M)}
          color={COLORS.orange}
          length={toQ}
          side={-1}
        />
        <Point at={px(P)} name="P" dy={20} />
        <Point at={px(Q)} name="Q" dy={20} />
        <Point at={px(M)} name="M" />
      </svg>
    </Interactive>
  );
}

/** M slides along a line below P: d(P, M) is smallest at the foot of the perpendicular. */
export function ShortestDistance() {
  const [m, setM] = useState(-1.5);
  const shown = useSmooth(m);
  const { width, height, px } = scale(-3.5, 4.5, -0.8, 3.2);

  const P = { x: 1, y: 2.4 };
  const F = { x: 1, y: 0 };
  const M = { x: shown, y: 0 };
  const length = distance(P, { x: m, y: 0 });
  const atFoot = Math.abs(m - F.x) < 1e-9;
  const foot = px(F);
  const size = 10;

  return (
    <Interactive
      readout={
        <>
          <div>d(P, M) = {format(length)}</div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {atFoot
              ? "M is the foot of the perpendicular from P. No other point of the line is this close."
              : `M is ${format(Math.abs(m - F.x))} from the foot of the perpendicular, where the distance would be ${format(distance(P, F))}.`}
          </div>
        </>
      }
      controls={
        <Slider
          label={
            <>
              position of <i>M</i>
            </>
          }
          value={m}
          onChange={setM}
          min={-3}
          max={4}
          step={0.5}
        />
      }
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto block h-auto w-full max-w-lg text-fd-foreground"
        role="img"
        aria-label={`A point P above a line, and a point M on the line at distance ${format(length)} from P`}
      >
        <line
          x1={px({ x: -3.5, y: 0 }).x}
          y1={foot.y}
          x2={px({ x: 4.5, y: 0 }).x}
          y2={foot.y}
          stroke="currentColor"
          strokeWidth={1.75}
        />
        {/* the perpendicular from P, with its right-angle mark at the foot */}
        <line
          x1={px(P).x}
          y1={px(P).y}
          x2={foot.x}
          y2={foot.y}
          stroke={COLORS.purple}
          strokeWidth={2}
          strokeOpacity={0.7}
        />
        <polyline
          points={`${foot.x + size},${foot.y} ${foot.x + size},${foot.y - size} ${foot.x},${foot.y - size}`}
          fill="none"
          stroke={COLORS.purple}
          strokeWidth={1.5}
        />
        <Measured
          from={px(P)}
          to={px(M)}
          color={COLORS.blue}
          length={length}
          side={m < F.x ? 1 : -1}
        />
        <Point at={px(P)} name="P" />
        <Point at={foot} name="F" color={COLORS.purple} dx={-16} dy={-12} />
        <Point at={px(M)} name="M" dy={20} />
      </svg>
    </Interactive>
  );
}
