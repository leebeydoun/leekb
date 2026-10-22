"use client";

/**
 * Why three side lengths fix a triangle. Two sticks of lengths 4 and 3 are joined by a hinge at Q,
 * and one slider opens the hinge. The gap between the free ends, the third side, is different for
 * every opening, so once a third stick of fixed length closes the gap, the hinge can't move.
 */

import { useState } from "react";
import { COLORS, Interactive, Slider, format, useSmooth } from "./kit";

const UNIT = 56;
const PAD = 30;
const X0 = -3.4;
const X1 = 4.6;
const Y0 = -0.7;
const Y1 = 3.4;
const WIDTH = (X1 - X0) * UNIT + PAD * 2;
const HEIGHT = (Y1 - Y0) * UNIT + PAD * 2;

/** the two sticks joined at the hinge */
const A = 4;
const B = 3;

type Vec = { x: number; y: number };

const px = (p: Vec): Vec => ({
  x: PAD + (p.x - X0) * UNIT,
  y: PAD + (Y1 - p.y) * UNIT,
});

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

/** the length of the third side when the hinge is open at `degrees` */
const thirdSide = (degrees: number) => {
  const t = (degrees * Math.PI) / 180;
  return Math.hypot(A - B * Math.cos(t), B * Math.sin(t));
};

function Label({
  at,
  children,
  color = "currentColor",
  italic = false,
}: {
  at: Vec;
  children: string;
  color?: string;
  italic?: boolean;
}) {
  return (
    <text
      x={at.x}
      y={at.y + 5}
      textAnchor="middle"
      fontSize={16}
      fontStyle={italic ? "italic" : undefined}
      fontWeight={italic ? undefined : 600}
      fill={color}
      {...halo}
    >
      {children}
    </text>
  );
}

export function TriangleFromSides() {
  const [opening, setOpening] = useState(60);
  const shown = useSmooth(opening);
  const t = (shown * Math.PI) / 180;

  const Q: Vec = { x: 0, y: 0 };
  const P: Vec = { x: A, y: 0 };
  const M: Vec = { x: B * Math.cos(t), y: B * Math.sin(t) };
  const gap = thirdSide(opening);
  const q = px(Q);
  const p = px(P);
  const m = px(M);

  // where the free end of the 3-stick can be: a circle of radius 3 about the hinge
  const reach = B * UNIT;

  // each length is written just off the middle of its side, away from the triangle
  const centre = { x: (q.x + p.x + m.x) / 3, y: (q.y + p.y + m.y) / 3 };
  const beside = (a: Vec, b: Vec, push = 18): Vec => {
    const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    const size = Math.hypot(mid.x - centre.x, mid.y - centre.y) || 1;
    return {
      x: mid.x + ((mid.x - centre.x) / size) * push,
      y: mid.y + ((mid.y - centre.y) / size) * push,
    };
  };

  return (
    <Interactive
      readout={
        <>
          <div>
            Hinge open at {format(opening, 0)}°: the third side is {format(gap)}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {opening === 90
              ? "At a right angle the gap is exactly 5, the 3, 4, 5 right triangle. Every other opening gives a different gap."
              : "Each opening gives a different gap. So a third stick of fixed length allows exactly one opening, and the frame can't move."}
          </div>
        </>
      }
      controls={
        <Slider
          label="Open the hinge"
          value={opening}
          onChange={setOpening}
          min={20}
          max={160}
          step={5}
          show={(v) => `${v}°`}
        />
      }
      caption="Two sticks of lengths 4 and 3 joined by a hinge make a different triangle at every opening. Fixing the third side fixes the triangle."
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-lg text-fd-foreground"
        role="img"
        aria-label={`Two sticks of lengths 4 and 3 hinged at Q, open at ${format(opening, 0)} degrees, with a gap of ${format(gap)} between their free ends`}
      >
        {/* every place the free end of the shorter stick can reach */}
        <path
          d={`M ${q.x + reach} ${q.y} A ${reach} ${reach} 0 0 0 ${q.x - reach} ${q.y}`}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.25}
          strokeWidth={1.5}
          strokeDasharray="4 5"
        />

        <polygon
          points={`${q.x},${q.y} ${p.x},${p.y} ${m.x},${m.y}`}
          fill={COLORS.purple}
          fillOpacity={0.08}
        />

        {/* the third side: the gap the third stick has to fill */}
        <line
          x1={p.x}
          y1={p.y}
          x2={m.x}
          y2={m.y}
          stroke={COLORS.purple}
          strokeWidth={3}
          strokeDasharray="8 6"
          strokeLinecap="round"
        />

        {/* the two fixed sticks */}
        <line
          x1={q.x}
          y1={q.y}
          x2={p.x}
          y2={p.y}
          stroke={COLORS.blue}
          strokeWidth={6}
          strokeLinecap="round"
        />
        <line
          x1={q.x}
          y1={q.y}
          x2={m.x}
          y2={m.y}
          stroke={COLORS.orange}
          strokeWidth={6}
          strokeLinecap="round"
        />

        {/* the hinge */}
        <circle
          cx={q.x}
          cy={q.y}
          r={7}
          fill="var(--color-fd-card)"
          stroke="currentColor"
          strokeWidth={2.5}
        />
        <circle cx={p.x} cy={p.y} r={4.5} fill="currentColor" />
        <circle cx={m.x} cy={m.y} r={4.5} fill="currentColor" />

        <Label at={beside(q, p)} color={COLORS.blue}>
          4
        </Label>
        <Label at={beside(q, m)} color={COLORS.orange}>
          3
        </Label>
        <Label at={beside(p, m, 22)} color={COLORS.purple}>
          {format(gap)}
        </Label>
        <Label at={{ x: q.x - 4, y: q.y + 24 }} italic>
          Q
        </Label>
        <Label at={{ x: p.x + 14, y: p.y + 20 }} italic>
          P
        </Label>
        <Label
          at={{
            x: m.x + (m.x - q.x) * (16 / reach),
            y: m.y + (m.y - q.y) * (16 / reach) - 2,
          }}
          italic
        >
          M
        </Label>
      </svg>
    </Interactive>
  );
}
