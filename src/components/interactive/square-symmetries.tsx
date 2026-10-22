"use client";

/**
 * The eight symmetries of a square, found by hand. The square carries a flag in one corner, so
 * every position looks different. "Turn a quarter" turns it anticlockwise about its centre and
 * "Flip" flips it in the upright mirror line; the readout names the single move that takes the
 * start to the current position, and counts how many of the eight positions have been found.
 */

import { useState } from "react";
import { Button, COLORS, Interactive } from "./kit";

const UNIT = 70;
const PAD = 40;
const HALF = 1.5;
const SIZE = (HALF * 2 + 1) * UNIT + PAD * 2;

type Vec = { x: number; y: number };
// a position: first flip in the upright mirror (or not), then turn by `turns` quarter turns
type Position = { turns: number; flipped: boolean };

const px = (p: Vec): Vec => ({
  x: SIZE / 2 + p.x * UNIT,
  y: SIZE / 2 - p.y * UNIT,
});

/** where the start point p ends up in the position `at` */
function place(p: Vec, at: Position): Vec {
  const x = at.flipped ? -p.x : p.x;
  const angle = (at.turns * Math.PI) / 2;
  const c = Math.round(Math.cos(angle));
  const s = Math.round(Math.sin(angle));
  return { x: x * c - p.y * s, y: x * s + p.y * c };
}

// the flag on its pole near the bottom left corner, and the coloured corner
const POLE: Vec[] = [
  { x: -0.9, y: -1 },
  { x: -0.9, y: 0.4 },
];
const FLAG: Vec[] = [
  { x: -0.9, y: 0.4 },
  { x: -0.1, y: 0.15 },
  { x: -0.9, y: -0.1 },
];
const CORNER: Vec[] = [
  { x: -HALF, y: -HALF },
  { x: -HALF + 0.55, y: -HALF },
  { x: -HALF, y: -HALF + 0.55 },
];

const key = (at: Position) => `${at.turns}${at.flipped ? "f" : ""}`;

/** the single move that takes the start position to `at`, in words */
function describe(at: Position) {
  if (!at.flipped)
    return at.turns === 0
      ? "The start position: the identity, nothing has moved."
      : `A turn by ${at.turns * 90}° anticlockwise about the centre.`;
  // a flip in the upright line, then a turn by 90k degrees, is one flip in a line turned 45k degrees
  const mirror = [
    "the upright mirror line",
    "the falling diagonal",
    "the level mirror line",
    "the rising diagonal",
  ][at.turns]!;
  return `A flip in ${mirror}.`;
}

// the mirror line for a flipped position, as two far points through the centre
function mirrorLine(at: Position): [Vec, Vec] {
  const angle = Math.PI / 2 + (at.turns * Math.PI) / 4;
  const r = HALF + 0.45;
  return [
    { x: Math.cos(angle) * r, y: Math.sin(angle) * r },
    { x: -Math.cos(angle) * r, y: -Math.sin(angle) * r },
  ];
}

export function SquareSymmetries() {
  const start: Position = { turns: 0, flipped: false };
  const [at, setAt] = useState<Position>(start);
  const [found, setFound] = useState<Set<string>>(() => new Set([key(start)]));

  const go = (next: Position) => {
    setAt(next);
    setFound((seen) => new Set(seen).add(key(next)));
  };
  const turn = () => go({ turns: (at.turns + 1) % 4, flipped: at.flipped });
  // flipping in the upright line after a turn by k quarters is the same as first flipping, then
  // turning by -k quarters
  const flip = () => go({ turns: (4 - at.turns) % 4, flipped: !at.flipped });

  const points = (shape: Vec[], where: Position) =>
    shape
      .map((p) => px(place(p, where)))
      .map(({ x, y }) => `${x},${y}`)
      .join(" ");
  const corners = [
    { x: -HALF, y: -HALF },
    { x: HALF, y: -HALF },
    { x: HALF, y: HALF },
    { x: -HALF, y: HALF },
  ]
    .map(px)
    .map(({ x, y }) => `${x},${y}`)
    .join(" ");
  const [m1, m2] = mirrorLine(at).map(px) as [Vec, Vec];

  return (
    <Interactive
      readout={
        <>
          <div>{describe(at)}</div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            You have found {found.size} of the 8 positions.
            {found.size === 8 && " That is all of them: 4 turns and 4 flips."}
          </div>
        </>
      }
      controls={
        <>
          <Button primary onClick={turn}>
            Turn a quarter
          </Button>
          <Button primary onClick={flip}>
            Flip
          </Button>
          <Button
            onClick={() => {
              setAt(start);
              setFound(new Set([key(start)]));
            }}
          >
            Start again
          </Button>
        </>
      }
      caption="Turn and flip the square. Each different position of the flag is a different symmetry of the square."
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="mx-auto block h-auto w-full max-w-xs text-fd-foreground"
        role="img"
        aria-label={`A square with a flag in one corner. ${describe(at)}`}
      >
        <polygon
          points={corners}
          fill="currentColor"
          fillOpacity={0.05}
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        {/* the start position of the flag, drawn faintly */}
        <g opacity={0.18}>
          <polyline
            points={points(POLE, start)}
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
          />
          <polygon points={points(FLAG, start)} fill="currentColor" />
        </g>
        {at.flipped && (
          <line
            x1={m1.x}
            y1={m1.y}
            x2={m2.x}
            y2={m2.y}
            stroke={COLORS.purple}
            strokeWidth={2}
            strokeDasharray="7 5"
          />
        )}
        <polygon points={points(CORNER, at)} fill={COLORS.orange} />
        <polyline
          points={points(POLE, at)}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <polygon
          points={points(FLAG, at)}
          fill={COLORS.blue}
          stroke={COLORS.blue}
          strokeLinejoin="round"
        />
      </svg>
    </Interactive>
  );
}
