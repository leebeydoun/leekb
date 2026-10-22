"use client";

/**
 * The rearrangement picture behind the Pythagoras theorem. A square of side a + b holds four copies
 * of a right triangle with legs a and b. In the first layout they sit in the corners and leave a
 * tilted square of side c uncovered; one slider slides them, without turning, into the second
 * layout, which leaves a square of side a and a square of side b uncovered. The big square and the
 * triangles never change, so the uncovered area is the same both times: a² + b² = c².
 */

import { useState } from "react";
import { COLORS, Interactive, Slider } from "./kit";

const A = 3;
const B = 4;
const C = 5;
const SIDE = A + B;
const UNIT = 40;
const PAD = 30;
const SIZE = SIDE * UNIT;

type Point = [number, number];

/**
 * The four triangles in the first layout, with how far each slides to reach the second layout.
 * Coordinates are in units with y up. One triangle stays put; the other three slide into the two
 * rectangles beside the squares a² and b².
 */
const TRIANGLES: { corners: Point[]; shift: Point }[] = [
  {
    corners: [
      [0, 0],
      [A, 0],
      [0, B],
    ],
    shift: [0, A],
  },
  {
    corners: [
      [SIDE, 0],
      [SIDE, A],
      [A, 0],
    ],
    shift: [0, 0],
  },
  {
    corners: [
      [SIDE, SIDE],
      [B, SIDE],
      [SIDE, A],
    ],
    shift: [-B, 0],
  },
  {
    corners: [
      [0, SIDE],
      [0, B],
      [B, SIDE],
    ],
    shift: [A, -B],
  },
];

// from units to pixels, with y turned to point down
const px = ([x, y]: Point): Point => [PAD + x * UNIT, PAD + (SIDE - y) * UNIT];

export function PythagorasSquares() {
  const [percent, setPercent] = useState(0);
  const t = percent / 100;

  // how strongly each layout's labels show: fully at its own end of the slider, fading as it moves
  const first = Math.max(0, 1 - t * 4);
  const second = Math.max(0, t * 4 - 3);

  const label = (at: Point, text: string, opacity: number) => {
    const [x, y] = px(at);
    return (
      <text
        x={x}
        y={y + 6}
        textAnchor="middle"
        fontSize={18}
        fontStyle="italic"
        fill="currentColor"
        opacity={opacity}
      >
        {text}
      </text>
    );
  };

  const sentences = [
    `Uncovered: one square of side c, with area c² = ${C * C}`,
    `Moving the triangles: once they fit together again, they leave ${SIDE * SIDE} − 4 × ${(A * B) / 2} = ${C * C} uncovered`,
    `Uncovered: squares of sides a and b, with area a² + b² = ${A * A} + ${B * B} = ${A * A + B * B}`,
  ];
  const showing = t === 0 ? 0 : t === 1 ? 2 : 1;
  const readout = sentences[showing]!;
  // All three sentences sit in one grid cell, with only the current one visible, so the readout
  // is always as tall as the longest. Otherwise the text re-wraps at each end of the slider and
  // the slider jumps up and down under the pointer.
  const steadyReadout = (
    <span className="grid">
      {sentences.map((sentence, i) => (
        <span
          key={i}
          className="[grid-area:1/1]"
          style={{ visibility: i === showing ? "visible" : "hidden" }}
          aria-hidden={i !== showing}
        >
          {sentence}
        </span>
      ))}
    </span>
  );

  return (
    <Interactive
      readout={steadyReadout}
      caption={`The same four triangles, with legs a = ${A} and b = ${B}, in a square of side a + b. Both layouts leave the same area uncovered, so a² + b² = c².`}
      controls={
        <Slider
          label="Rearrange the triangles"
          value={percent}
          onChange={setPercent}
          min={0}
          max={100}
          step={1}
          // a percentage at every position, so the value keeps its width as the slider moves
          show={(v) => `${v}%`}
        />
      }
    >
      <svg
        viewBox={`0 0 ${SIZE + PAD * 2} ${SIZE + PAD * 2}`}
        className="mx-auto block h-auto w-full max-w-80 text-fd-foreground"
        role="img"
        aria-label={`A square of side a + b holding four right triangles. ${readout}.`}
      >
        {/* the uncovered part shows through as blue, under the triangles */}
        <rect
          x={PAD}
          y={PAD}
          width={SIZE}
          height={SIZE}
          fill={COLORS.blue}
          fillOpacity={0.22}
        />
        {TRIANGLES.map(({ corners, shift }, i) => {
          const points = corners
            .map(([x, y]) => px([x + shift[0] * t, y + shift[1] * t]).join(","))
            .join(" ");
          return (
            <g key={i}>
              {/* the card colour first, so the blue underneath is hidden */}
              <polygon points={points} fill="var(--color-fd-card)" />
              <polygon
                points={points}
                fill={COLORS.orange}
                fillOpacity={0.35}
                stroke={COLORS.orange}
                strokeWidth={2}
                strokeLinejoin="round"
              />
            </g>
          );
        })}
        <rect
          x={PAD}
          y={PAD}
          width={SIZE}
          height={SIZE}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        />
        {label([SIDE / 2, SIDE / 2], "c²", first)}
        {label([A / 2, A / 2], "a²", second)}
        {label([A + B / 2, A + B / 2], "b²", second)}
        {/* the sides of the big square: a then b along the bottom and up the right, in both layouts */}
        <g
          fontSize={15}
          fontStyle="italic"
          className="fill-fd-muted-foreground"
          textAnchor="middle"
        >
          <text x={px([A / 2, 0])[0]} y={PAD + SIZE + 20}>
            a
          </text>
          <text x={px([A + B / 2, 0])[0]} y={PAD + SIZE + 20}>
            b
          </text>
          <text x={PAD + SIZE + 14} y={px([0, A / 2])[1] + 5}>
            a
          </text>
          <text x={PAD + SIZE + 14} y={px([0, A + B / 2])[1] + 5}>
            b
          </text>
        </g>
      </svg>
    </Interactive>
  );
}
