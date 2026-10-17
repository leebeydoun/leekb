"use client";

/**
 * A square whose side grows from 0, with its area shown on a gauge beside it. The area grows
 * without jumping, so it passes through the target area (2 unless given), and the side where it
 * does is √2 = 1.41421…, which is not a fraction.
 */

import { useEffect, useState } from "react";
import { Button, COLORS, Interactive, Slider, useAnimation } from "./kit";

type GrowingSquareProps = {
  /** the area to look out for, 2 unless given */
  target?: number;
  /** the largest side on the slider, 2 unless given */
  max?: number;
  /** the side to start with */
  side?: number;
  caption?: string;
};

// the picture: the square in a box on the left, the area gauge on the right
const BOX = 220;
const LEFT = 40;
const TOP = 20;
const GAUGE_X = 330;

// a number with a fixed number of decimals, with a proper minus sign
const fixed = (n: number, places: number) =>
  (n < 0 ? "−" : "") + Math.abs(n).toFixed(places);

export function GrowingSquare({
  target = 2,
  max = 2,
  side: start = 1,
  caption,
}: GrowingSquareProps) {
  const [side, setSide] = useState(start);
  const grow = useAnimation(5000);

  // while growing, the side follows the animation from 0 to the largest side
  useEffect(() => {
    if (grow.progress > 0) setSide(Number((grow.progress * max).toFixed(3)));
  }, [grow.progress, max]);

  const area = side * side;
  const root = Math.sqrt(target);
  const unit = BOX / max;
  const bottom = TOP + BOX;
  // the gauge runs from area 0 to the largest area, max²
  const gauge = (a: number) => bottom - (a / (max * max)) * BOX;

  const near = Math.abs(area - target) < 0.02;
  const exact = Math.abs(area - target) < 1e-9;
  const where = exact
    ? `exactly ${target}`
    : area < target
      ? `less than ${target}`
      : `more than ${target}`;

  const ticks: number[] = [];
  for (let n = 0; n <= max; n++) ticks.push(n);

  return (
    <Interactive
      readout={
        <>
          <div>
            side {fixed(side, 3)}, area {fixed(area, 4)}, {where}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {!near
              ? `Move the side to get the area as close to ${target} as you can.`
              : Number.isInteger(root)
                ? `The area is exactly ${target} when the side is ${root}.`
                : `The area is exactly ${target} only when the side is √${target} = ${root.toFixed(5)}…, which is not a fraction.`}
          </div>
        </>
      }
      controls={
        <>
          <Slider
            label="side"
            value={side}
            onChange={(v) => {
              grow.reset();
              setSide(v);
            }}
            min={0}
            max={max}
            step={0.001}
            show={(v) => fixed(v, 3)}
          />
          <Button
            primary
            onClick={() => {
              grow.reset();
              grow.play();
            }}
            disabled={grow.playing}
          >
            Grow from 0
          </Button>
        </>
      }
      caption={caption}
    >
      <svg
        viewBox="0 0 420 280"
        className="mx-auto block h-auto w-full max-w-md text-fd-foreground"
        aria-label={`A square of side ${fixed(side, 3)} and area ${fixed(area, 4)}, beside a gauge marking area ${target}`}
      >
        {/* the square of area exactly the target, dashed, for comparison */}
        <rect
          x={LEFT}
          y={bottom - root * unit}
          width={root * unit}
          height={root * unit}
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />
        {/* the growing square */}
        <rect
          x={LEFT}
          y={bottom - side * unit}
          width={side * unit}
          height={side * unit}
          fill={COLORS.blue}
          fillOpacity={0.25}
          stroke={COLORS.blue}
          strokeWidth={2}
        />
        {/* side axis along the bottom */}
        <line
          x1={LEFT}
          x2={LEFT + BOX}
          y1={bottom}
          y2={bottom}
          stroke="currentColor"
          strokeWidth={1.5}
        />
        {ticks.map((n) => (
          <g key={n}>
            <line
              x1={LEFT + n * unit}
              x2={LEFT + n * unit}
              y1={bottom - 5}
              y2={bottom + 5}
              stroke="currentColor"
              strokeWidth={1.5}
            />
            <text
              x={LEFT + n * unit}
              y={bottom + 22}
              textAnchor="middle"
              fontSize={14}
              className="fill-fd-muted-foreground"
            >
              {n}
            </text>
          </g>
        ))}
        {!Number.isInteger(root) && root < max && (
          <text
            x={LEFT + root * unit}
            y={bottom + 22}
            textAnchor="middle"
            fontSize={14}
            fontWeight={600}
            fill={COLORS.orange}
          >
            √{target}
          </text>
        )}
        {side > 0.15 && (
          <text
            x={LEFT + (side * unit) / 2}
            y={bottom - (side * unit) / 2 + 5}
            textAnchor="middle"
            fontSize={14}
            fontWeight={600}
            fill={COLORS.blue}
          >
            {side > 0.6 ? `area ${fixed(area, 3)}` : fixed(area, 2)}
          </text>
        )}

        {/* the area gauge */}
        <rect
          x={GAUGE_X}
          y={TOP}
          width={24}
          height={BOX}
          rx={4}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.4}
        />
        <rect
          x={GAUGE_X}
          y={gauge(area)}
          width={24}
          height={bottom - gauge(area)}
          rx={4}
          fill={COLORS.blue}
          fillOpacity={0.6}
        />
        <line
          x1={GAUGE_X - 8}
          x2={GAUGE_X + 32}
          y1={gauge(target)}
          y2={gauge(target)}
          stroke={COLORS.orange}
          strokeWidth={2.5}
        />
        <text
          x={GAUGE_X + 38}
          y={gauge(target) + 5}
          fontSize={14}
          fontWeight={600}
          fill={COLORS.orange}
        >
          {target}
        </text>
        <text
          x={GAUGE_X + 12}
          y={bottom + 22}
          textAnchor="middle"
          fontSize={14}
          className="fill-fd-muted-foreground"
        >
          area
        </text>
      </svg>
    </Interactive>
  );
}
