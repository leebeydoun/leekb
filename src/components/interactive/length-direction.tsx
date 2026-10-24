"use client";

/**
 * A point A on a grid with the unit circle drawn round the origin. The arrow from O to A shows the
 * step A, and a second arrow shows its direction U = (1/|A|)A, which always ends on the unit
 * circle. The readout gives |A| and U, so you can see that A = |A| U splits a step into how far
 * and which way.
 */

import { useState } from "react";
import { Grid, gridScale } from "./grid";
import { COLORS, format, Interactive, Slider } from "./kit";

const RANGE: [number, number] = [-5, 5];

type Vec = { x: number; y: number };

/** an arrow from one screen point to another, with a filled head at the far end */
function Arrow({
  from,
  to,
  color,
  width = 3,
}: {
  from: Vec;
  to: Vec;
  color: string;
  width?: number;
}) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const size = Math.hypot(dx, dy);
  if (size < 1e-6) return null;
  const ux = dx / size;
  const uy = dy / size;
  // the head is at most half the arrow, so a short arrow still shows its shaft
  const head = Math.min(12, size / 2);
  const base = { x: to.x - ux * head, y: to.y - uy * head };
  const side = { x: -uy * head * 0.45, y: ux * head * 0.45 };
  return (
    <g>
      <line
        x1={from.x}
        y1={from.y}
        x2={base.x}
        y2={base.y}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
      <polygon
        points={`${to.x},${to.y} ${base.x + side.x},${base.y + side.y} ${base.x - side.x},${base.y - side.y}`}
        fill={color}
      />
    </g>
  );
}

/** √n, written as a whole number when n is a perfect square, otherwise with a decimal */
function root(n: number) {
  const r = Math.sqrt(n);
  if (Number.isInteger(r)) return `√${format(n)} = ${format(r)}`;
  return `√${format(n)} ≈ ${format(r)}`;
}

// a number that is squared in the readout: negatives go in brackets
const bracket = (n: number) => (n < 0 ? `(${format(n)})` : format(n));

export function LengthDirection({
  a: [startX, startY] = [-3, -4],
  caption = "Move A with the sliders. The orange arrow U always ends on the unit circle: it keeps the way A points and forgets how far.",
}: {
  /** where A starts, as [a1, a2] */
  a?: [number, number];
  caption?: string;
}) {
  const [a1, setA1] = useState(startX);
  const [a2, setA2] = useState(startY);
  const { px, py, unit } = gridScale(RANGE, RANGE);

  const squared = a1 * a1 + a2 * a2;
  const length = Math.sqrt(squared);
  const isOrigin = squared === 0;
  const u1 = isOrigin ? 0 : a1 / length;
  const u2 = isOrigin ? 0 : a2 / length;

  const O = { x: px(0), y: py(0) };
  const A = { x: px(a1), y: py(a2) };
  const U = { x: px(u1), y: py(u2) };

  const halo = {
    stroke: "var(--color-fd-card)",
    strokeWidth: 5,
    strokeLinejoin: "round" as const,
    paintOrder: "stroke" as const,
  };

  // labels sit beyond the tip of each arrow, on the side away from O
  const away = (x: number, y: number) => ({
    dx: x === 0 ? 10 : Math.sign(x) * 10,
    dy: y === 0 ? -10 : y > 0 ? -10 : 20,
    anchor: (x < 0 ? "end" : "start") as "end" | "start",
  });
  const labelA = away(a1, a2);
  // U's label sits to one side of the arrows, which both run along the same line through U
  const labelU = {
    x: U.x + u2 * 16,
    y: U.y + u1 * 16 + 5,
  };

  return (
    <Interactive
      caption={caption}
      readout={
        isOrigin ? (
          <>
            <div>A = (0, 0) and |A| = 0</div>
            <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
              A is the origin. It is a step of length 0, so it doesn&apos;t
              point any way at all, and it has no direction.
            </div>
          </>
        ) : (
          <>
            <div>
              |A| = √({bracket(a1)}² + {bracket(a2)}²) = {root(squared)}
            </div>
            <div className="mt-1">
              U = (1 / |A|) A ≈ ({format(u1)}, {format(u2)})
            </div>
            <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
              A is {format(length)} copies of the unit step U: |A| says how far,
              and U says which way.
            </div>
          </>
        )
      }
      controls={
        <>
          <Slider label="A: a₁" value={a1} onChange={setA1} min={-4} max={4} />
          <Slider label="A: a₂" value={a2} onChange={setA2} min={-4} max={4} />
        </>
      }
    >
      <Grid
        x={RANGE}
        y={RANGE}
        label={
          isOrigin
            ? "A is at the origin, with length 0 and no direction."
            : `A at (${format(a1)}, ${format(a2)}), with length ${format(length)}. Its direction U is about (${format(u1)}, ${format(u2)}), on the unit circle.`
        }
      >
        {/* the unit circle */}
        <circle
          cx={O.x}
          cy={O.y}
          r={unit}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.55}
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />

        {!isOrigin && (
          <>
            <Arrow from={O} to={A} color={COLORS.blue} />
            <Arrow from={O} to={U} color={COLORS.orange} width={3.5} />
            <text
              x={A.x + labelA.dx}
              y={A.y + labelA.dy}
              textAnchor={labelA.anchor}
              fontSize={15}
              fontWeight={700}
              fill={COLORS.blue}
              {...halo}
            >
              A
            </text>
            <text
              x={labelU.x}
              y={labelU.y}
              textAnchor="middle"
              fontSize={14}
              fontWeight={700}
              fill={COLORS.orange}
              {...halo}
            >
              U
            </text>
          </>
        )}
        <circle cx={O.x} cy={O.y} r={4} fill="currentColor" />
        {isOrigin && (
          <text
            x={O.x + 10}
            y={O.y - 10}
            fontSize={15}
            fontWeight={700}
            fill={COLORS.blue}
            {...halo}
          >
            A = O
          </text>
        )}
      </Grid>
    </Interactive>
  );
}
