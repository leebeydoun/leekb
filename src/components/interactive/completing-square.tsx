"use client";

/**
 * Completing the square as a picture: x² is a square of side x, and bx is cut into two strips of
 * b/2 by x, laid along two sides of the square. Together they make an L, a square of side x + b/2
 * with one corner missing, and the missing corner is (b/2)². One slider moves b.
 */

import { useState } from "react";
import { COLORS, Interactive, Slider, useSmooth } from "./kit";

// the side of the x by x square, and how many pixels a unit of b/2 takes
const X = 150;
const UNIT = 18;
const MOST = 10;
const LEFT = 56;
const TOP = 40;
const WIDTH = LEFT + X + (MOST / 2) * UNIT + 56;
const HEIGHT = TOP + X + (MOST / 2) * UNIT + 40;

// b/2, (b/2)² and (b/2)·x written as whole numbers or as fractions over 2 and 4
const half = (b: number) => (b % 2 === 0 ? `${b / 2}` : `${b}/2`);
const corner = (b: number) => (b % 2 === 0 ? `${(b * b) / 4}` : `${b * b}/4`);
const strip = (b: number) =>
  b % 2 === 0 ? `${b / 2}x` : `${b === 1 ? "" : b}x/2`;
// bx with no 1 written in front: x, 2x, 3x
const times = (b: number) => (b === 1 ? "x" : `${b}x`);

export function CompletingSquare({
  b: initialB = 6,
  max = MOST,
}: {
  /** the number in x² + bx at the start */
  b?: number;
  /** the slider runs from 1 to max, at most 10 */
  max?: number;
}) {
  const [b, setB] = useState(initialB);
  const shown = useSmooth(b);
  const h = (shown / 2) * UNIT;
  const right = LEFT + X;
  const bottom = TOP + X;
  // labels go inside a strip or the corner only when there is room for them
  const roomy = h >= 34;

  const label = {
    textAnchor: "middle" as const,
    fontSize: 14,
    fontWeight: 600,
  };

  return (
    <Interactive
      readout={
        <>
          <div>
            x² + {times(b)} = (x + {half(b)})² − {corner(b)}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            The two strips of {half(b)} by x wrap round the square. Only the
            corner, {half(b)} by {half(b)}, is missing from a square of side x +{" "}
            {half(b)}, so x² + {times(b)} is that square take away {corner(b)}.
          </div>
        </>
      }
      controls={
        <Slider
          label="b in x² + bx"
          value={b}
          onChange={setB}
          min={1}
          max={Math.min(max, MOST)}
        />
      }
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-sm text-fd-foreground"
        role="img"
        aria-label={`A square of side x with two strips of ${half(b)} by x along two sides, missing a ${half(b)} by ${half(b)} corner of area ${corner(b)}`}
      >
        {/* the square x² */}
        <rect
          x={LEFT}
          y={TOP}
          width={X}
          height={X}
          fill={COLORS.blue}
          fillOpacity={0.25}
          stroke={COLORS.blue}
          strokeWidth={2}
        />
        <text
          x={LEFT + X / 2}
          y={TOP + X / 2 + 5}
          fill={COLORS.blue}
          {...label}
        >
          x²
        </text>

        {/* the two strips, b/2 by x each */}
        <rect
          x={right}
          y={TOP}
          width={h}
          height={X}
          fill={COLORS.orange}
          fillOpacity={0.25}
          stroke={COLORS.orange}
          strokeWidth={2}
        />
        <rect
          x={LEFT}
          y={bottom}
          width={X}
          height={h}
          fill={COLORS.orange}
          fillOpacity={0.25}
          stroke={COLORS.orange}
          strokeWidth={2}
        />
        {roomy && (
          <>
            <text
              x={right + h / 2}
              y={TOP + X / 2 + 5}
              fill={COLORS.orange}
              {...label}
            >
              {strip(b)}
            </text>
            <text
              x={LEFT + X / 2}
              y={bottom + h / 2 + 5}
              fill={COLORS.orange}
              {...label}
            >
              {strip(b)}
            </text>
          </>
        )}

        {/* the missing corner */}
        <rect
          x={right}
          y={bottom}
          width={h}
          height={h}
          fill={COLORS.green}
          fillOpacity={0.12}
          stroke={COLORS.green}
          strokeWidth={2}
          strokeDasharray="5 4"
        />
        <text
          x={roomy ? right + h / 2 : right + h + 8}
          y={roomy ? bottom + h / 2 + 5 : bottom + h + 16}
          fill={COLORS.green}
          {...label}
          textAnchor={roomy ? "middle" : "start"}
        >
          {corner(b)}
        </text>

        {/* side lengths along the top and the left */}
        <text
          x={LEFT + X / 2}
          y={TOP - 12}
          className="fill-fd-muted-foreground"
          {...label}
          fontWeight={400}
        >
          x
        </text>
        <text
          x={right + h / 2}
          y={TOP - 12}
          className="fill-fd-muted-foreground"
          {...label}
          fontWeight={400}
        >
          {half(b)}
        </text>
        <text
          x={LEFT - 12}
          y={TOP + X / 2 + 5}
          className="fill-fd-muted-foreground"
          {...label}
          textAnchor="end"
          fontWeight={400}
        >
          x
        </text>
        <text
          x={LEFT - 12}
          y={bottom + h / 2 + 5}
          className="fill-fd-muted-foreground"
          {...label}
          textAnchor="end"
          fontWeight={400}
        >
          {half(b)}
        </text>
      </svg>
    </Interactive>
  );
}
