"use client";

/**
 * Doing two moves in a different order. A flag is turned by 90° about O and flipped in the line L
 * through O. "Turn, then flip" and "flip, then turn" leave the flag in two different places, so the
 * order of a composite matters. The original flag stays faint, the halfway position is dashed, and
 * the result is solid.
 */

import { useState } from "react";
import { COLORS, Choice, Interactive } from "./kit";

const UNIT = 46;
const PAD = 20;
const SIZE = 3.6;
const WIDTH = 2 * SIZE * UNIT + PAD * 2;

type Vec = { x: number; y: number };

const px = (p: Vec): Vec => ({
  x: PAD + (p.x + SIZE) * UNIT,
  y: PAD + (SIZE - p.y) * UNIT,
});

// a quarter turn anticlockwise about O, and the flip in the horizontal line L through O
const turn = (p: Vec): Vec => ({ x: -p.y, y: p.x });
const flip = (p: Vec): Vec => ({ x: p.x, y: -p.y });

// a flag on a pole, lopsided so that a flip is easy to see
const POLE: Vec[] = [
  { x: 1.2, y: 0.6 },
  { x: 1.2, y: 2.8 },
];
const CLOTH: Vec[] = [
  { x: 1.2, y: 2.8 },
  { x: 2.6, y: 2.35 },
  { x: 1.2, y: 1.9 },
];

const ORDERS = {
  "turn-flip": {
    label: "Turn, then flip",
    first: turn,
    second: flip,
    readout:
      "First turn by 90°, then flip in L: the flag ends up below L and to the left of O, hanging down.",
  },
  "flip-turn": {
    label: "Flip, then turn",
    first: flip,
    second: turn,
    readout:
      "First flip in L, then turn by 90°: the flag ends up above L and to the right of O, pointing up.",
  },
} as const;

type Order = keyof typeof ORDERS;

function Flag({
  map,
  color,
  opacity,
  dashed = false,
}: {
  map: (p: Vec) => Vec;
  color: string;
  opacity: number;
  dashed?: boolean;
}) {
  const pole = POLE.map((p) => px(map(p)));
  const cloth = CLOTH.map((p) => px(map(p)));
  return (
    <g opacity={opacity}>
      <polygon
        points={cloth.map((p) => `${p.x},${p.y}`).join(" ")}
        fill={color}
        fillOpacity={dashed ? 0.12 : 0.55}
        stroke={color}
        strokeWidth={2}
        strokeDasharray={dashed ? "6 4" : undefined}
        strokeLinejoin="round"
      />
      <line
        x1={pole[0]!.x}
        y1={pole[0]!.y}
        x2={pole[1]!.x}
        y2={pole[1]!.y}
        stroke={color}
        strokeWidth={3}
        strokeDasharray={dashed ? "6 4" : undefined}
        strokeLinecap="round"
      />
    </g>
  );
}

export function OrderMatters() {
  const [order, setOrder] = useState<Order>("turn-flip");
  const { first, second, readout } = ORDERS[order];
  const o = px({ x: 0, y: 0 });
  const left = px({ x: -SIZE, y: 0 });
  const right = px({ x: SIZE, y: 0 });

  return (
    <Interactive
      readout={readout}
      controls={
        <Choice
          label="Order"
          value={order}
          onChange={setOrder}
          options={(Object.keys(ORDERS) as Order[]).map((key) => ({
            value: key,
            label: ORDERS[key].label,
          }))}
        />
      }
      caption="The same two moves, a quarter turn about O and a flip in L, done in the two possible orders. The faint flag is where it starts, and the dashed one is where it is halfway."
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${WIDTH}`}
        className="mx-auto block h-auto w-full max-w-sm text-fd-foreground"
        role="img"
        aria-label={`A flag moved by a quarter turn about O and a flip in the line L. ${readout}`}
      >
        {/* the mirror L */}
        <line
          x1={left.x}
          y1={left.y}
          x2={right.x}
          y2={right.y}
          stroke={COLORS.blue}
          strokeWidth={2}
          strokeDasharray="8 5"
        />
        <text
          x={right.x - 6}
          y={right.y - 8}
          textAnchor="end"
          fontSize={17}
          fontStyle="italic"
          fill={COLORS.blue}
        >
          L
        </text>

        <Flag map={(p) => p} color="currentColor" opacity={0.3} />
        <Flag map={first} color={COLORS.orange} opacity={0.9} dashed />
        <Flag map={(p) => second(first(p))} color={COLORS.orange} opacity={1} />

        <circle cx={o.x} cy={o.y} r={4.5} fill="currentColor" />
        <text
          x={o.x - 10}
          y={o.y + 20}
          textAnchor="middle"
          fontSize={17}
          fontStyle="italic"
          fill="currentColor"
        >
          O
        </text>
      </svg>
    </Interactive>
  );
}
