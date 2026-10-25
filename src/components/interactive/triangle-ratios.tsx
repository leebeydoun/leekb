"use client";

/**
 * A right triangle with an angle θ at its left corner and its right angle at the bottom right. One
 * slider sets θ (5° to 85°), the other the length of the hypotenuse (1 to 4). Each side is labelled
 * with its length. Part of the unit circle round the corner is drawn too: it crosses the
 * hypotenuse at (cos θ, sin θ), and the dashed drop from there cuts off the same triangle with
 * hypotenuse 1. The readout divides opposite and adjacent by the hypotenuse and shows that the
 * two ratios are sin θ and cos θ, whatever the size.
 */

import { useState } from "react";
import { COLORS, format, Interactive, Slider } from "./kit";

// the drawing: one unit of length is UNIT pixels, with the angle's corner at (LEFT, BASE)
const UNIT = 84;
const LEFT = 96;
const TOP = 30;
const BASE = TOP + 4 * UNIT;
const WIDTH = LEFT + 4 * UNIT + 150;
const HEIGHT = BASE + 46;

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 5,
  strokeLinejoin: "round" as const,
  paintOrder: "stroke" as const,
};

export function TriangleRatios({
  caption = "Change the angle and the size. The arc is part of the unit circle round the corner: it crosses the hypotenuse at (cos θ, sin θ), and the dashed drop from there cuts off the same triangle with hypotenuse 1.",
}: {
  caption?: string;
}) {
  const [degrees, setDegrees] = useState(30);
  const [hyp, setHyp] = useState(3);

  const theta = (degrees * Math.PI) / 180;
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  const adj = hyp * cos;
  const opp = hyp * sin;

  // screen positions (y grows downwards)
  const A = { x: LEFT, y: BASE };
  const B = { x: LEFT + adj * UNIT, y: BASE };
  const C = { x: LEFT + adj * UNIT, y: BASE - opp * UNIT };
  // where the unit circle crosses the hypotenuse, and the foot of its drop
  const P = { x: LEFT + cos * UNIT, y: BASE - sin * UNIT };

  // the arc of the unit circle from the base up to the top of the frame's quarter
  const arc = `M ${LEFT + UNIT} ${BASE} A ${UNIT} ${UNIT} 0 0 0 ${LEFT} ${BASE - UNIT}`;

  // the small arc marking θ at the corner
  const r = 30;
  const mark = `M ${LEFT + r} ${BASE} A ${r} ${r} 0 0 0 ${LEFT + r * cos} ${BASE - r * sin}`;
  // half way round the arc, but never so low that it sits on the base
  const half = Math.max(theta / 2, 0.22);
  const thetaLabel = {
    x: LEFT + (r + 13) * Math.cos(half),
    y: BASE - (r + 13) * Math.sin(half) + 5,
  };

  // the right-angle mark at B, inside the triangle
  const s = Math.min(12, (adj * UNIT) / 2, (opp * UNIT) / 2);
  const square = `${B.x - s},${B.y} ${B.x - s},${B.y - s} ${B.x},${B.y - s}`;

  // the hypotenuse label sits outside the triangle. Its bottom right corner is a little above and
  // to the left of the middle of the side, and since the side climbs to the right, the whole label
  // then stays clear of it at every angle
  const hypLabel = {
    x: (A.x + C.x) / 2 - sin * 12,
    y: (A.y + C.y) / 2 - cos * 12 - 4,
  };

  const radians = format(theta);

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>
            θ = {degrees}° ≈ {radians} radians
          </div>
          <div className="mt-1">
            <span style={{ color: COLORS.orange }}>opposite</span> ÷ hypotenuse
            = {format(opp)} ÷ {format(hyp)} = {format(sin)} = sin θ
          </div>
          <div className="mt-1">
            <span style={{ color: COLORS.blue }}>adjacent</span> ÷ hypotenuse ={" "}
            {format(adj)} ÷ {format(hyp)} = {format(cos)} = cos θ
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            Change the size: the ratios stay the same.
          </div>
        </>
      }
      controls={
        <>
          <Slider
            label="angle θ"
            value={degrees}
            onChange={setDegrees}
            min={5}
            max={85}
            show={(v) => `${v}°`}
          />
          <Slider
            label="hypotenuse"
            value={hyp}
            onChange={setHyp}
            min={1}
            max={4}
            step={0.1}
          />
        </>
      }
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-lg text-fd-foreground"
        role="img"
        aria-label={`A right triangle with an angle of ${degrees} degrees and hypotenuse ${format(hyp)}. The opposite side is ${format(opp)} and the adjacent side is ${format(adj)}.`}
      >
        {/* the unit circle round the corner, and the drop from where it meets the hypotenuse */}
        <path
          d={arc}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.3}
          strokeWidth={1.5}
        />
        <line
          x1={P.x}
          y1={P.y}
          x2={P.x}
          y2={BASE}
          stroke="currentColor"
          strokeOpacity={0.55}
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />

        {/* the three sides */}
        <line
          x1={A.x}
          y1={A.y}
          x2={B.x}
          y2={B.y}
          stroke={COLORS.blue}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <line
          x1={B.x}
          y1={B.y}
          x2={C.x}
          y2={C.y}
          stroke={COLORS.orange}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <line
          x1={A.x}
          y1={A.y}
          x2={C.x}
          y2={C.y}
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <polyline
          points={square}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        />
        <path d={mark} fill="none" stroke="currentColor" strokeWidth={1.5} />
        <circle cx={P.x} cy={P.y} r={4.5} fill="currentColor" />

        {/* labels */}
        <text
          x={thetaLabel.x}
          y={thetaLabel.y}
          textAnchor="middle"
          fontSize={14}
          fontWeight={700}
          fill="currentColor"
          {...halo}
        >
          θ
        </text>
        <text
          x={hypLabel.x}
          y={hypLabel.y}
          textAnchor="end"
          fontSize={14}
          fontWeight={700}
          fill="currentColor"
          {...halo}
        >
          <tspan x={hypLabel.x} dy={-16}>
            hypotenuse
          </tspan>
          <tspan x={hypLabel.x} dy={16}>
            {format(hyp)}
          </tspan>
        </text>
        <text
          x={C.x + 12}
          y={(B.y + C.y) / 2 + 5}
          fontSize={14}
          fontWeight={700}
          fill={COLORS.orange}
          {...halo}
        >
          opposite {format(opp)}
        </text>
        <text
          x={(A.x + B.x) / 2}
          y={BASE + 26}
          textAnchor="middle"
          fontSize={14}
          fontWeight={700}
          fill={COLORS.blue}
          {...halo}
        >
          adjacent {format(adj)}
        </text>
      </svg>
    </Interactive>
  );
}
