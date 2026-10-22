"use client";

/**
 * The triangle inequality in the plane: P and M stay fixed, and a slider lowers Q from well above
 * the segment PM onto it and a little below. The readout compares d(P, Q) + d(Q, M) with d(P, M):
 * the detour through Q is longer, and the two match exactly when Q lands on the segment.
 */

import { useState } from "react";
import { COLORS, Interactive, Slider, format, useSmooth } from "./kit";

/** pixels per unit */
const UNIT = 50;
const PAD = 34;
/** P and M sit on the x-axis, and Q moves up and down above the point x = QX */
const P = { x: 0, y: 0 };
const M = { x: 6, y: 0 };
const QX = 2.2;
const TOP = 3;
const BOTTOM = -1;

const W = (M.x - P.x) * UNIT + PAD * 2;
const H = (TOP - BOTTOM) * UNIT + PAD * 2;
const px = (x: number) => PAD + (x - P.x) * UNIT;
const py = (y: number) => PAD + (TOP - y) * UNIT;

const distance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

// a label with a halo in the card colour, so it stays readable where it crosses a line
const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

export function SegmentDistances() {
  const [height, setHeight] = useState(2.4);
  const shown = useSmooth(height);
  const Q = { x: QX, y: shown };

  const pq = distance(P, { x: QX, y: height });
  const qm = distance({ x: QX, y: height }, M);
  const pm = distance(P, M);
  const onSegment = Math.abs(height) < 1e-6;

  // where each length is written: beside the middle of its segment, on the side away from PM
  const side = shown >= 0 ? -1 : 1;
  const middle = (
    a: { x: number; y: number },
    b: { x: number; y: number },
  ) => ({
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  });
  const pqMiddle = middle(P, Q);
  const qmMiddle = middle(Q, M);

  return (
    <Interactive
      readout={
        onSegment ? (
          <>
            d(P, Q) + d(Q, M) = {format(pq)} + {format(qm)} = {format(pq + qm)},
            equal to d(P, M) = {format(pm)}, because Q is on the segment
          </>
        ) : (
          <>
            d(P, Q) + d(Q, M) = {format(pq)} + {format(qm)} = {format(pq + qm)},
            longer than d(P, M) = {format(pm)}
          </>
        )
      }
      controls={
        <Slider
          label="Height of Q above the segment"
          value={height}
          onChange={setHeight}
          min={BOTTOM}
          max={TOP - 0.4}
          step={0.2}
        />
      }
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mx-auto block h-auto w-full max-w-md text-fd-foreground"
        role="img"
        aria-label="Points P and M joined by a segment, and a point Q above or on it, joined to both"
      >
        {/* the direct route */}
        <line
          x1={px(P.x)}
          y1={py(P.y)}
          x2={px(M.x)}
          y2={py(M.y)}
          stroke="currentColor"
          strokeWidth={2}
          strokeOpacity={0.45}
          strokeDasharray="6 5"
        />
        {/* the route through Q */}
        <line
          x1={px(P.x)}
          y1={py(P.y)}
          x2={px(Q.x)}
          y2={py(Q.y)}
          stroke={COLORS.blue}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <line
          x1={px(Q.x)}
          y1={py(Q.y)}
          x2={px(M.x)}
          y2={py(M.y)}
          stroke={COLORS.orange}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <g fontSize={14} textAnchor="middle" {...halo}>
          <text
            x={px(pqMiddle.x) - 14}
            y={py(pqMiddle.y) + side * 14 + 4}
            fill={COLORS.blue}
          >
            {format(pq)}
          </text>
          <text
            x={px(qmMiddle.x) + 14}
            y={py(qmMiddle.y) + side * 14 + 4}
            fill={COLORS.orange}
          >
            {format(qm)}
          </text>
        </g>
        {[
          { name: "P", at: P, dx: -14, dy: 18 },
          { name: "M", at: M, dx: 14, dy: 18 },
          { name: "Q", at: Q, dx: 0, dy: shown >= 0 ? -12 : 22 },
        ].map(({ name, at, dx, dy }) => (
          <g key={name}>
            <circle cx={px(at.x)} cy={py(at.y)} r={4} fill="currentColor" />
            <text
              x={px(at.x) + dx}
              y={py(at.y) + dy}
              fontSize={15}
              fontStyle="italic"
              textAnchor="middle"
              fill="currentColor"
              {...halo}
            >
              {name}
            </text>
          </g>
        ))}
      </svg>
    </Interactive>
  );
}
