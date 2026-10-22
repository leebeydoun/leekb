"use client";

/**
 * A slide of the plane along a fixed direction. One slider sets how far; the flag moves without
 * turning, and the paths of two corners are drawn as arrows, which always have the same length and
 * point the same way.
 */

import { useState } from "react";
import { COLORS, Interactive, Slider, format, useSmooth } from "./kit";
import { Dot, FLAG, Flag, planeScale, shift, type Vec } from "./moving-shape";

// the direction of the slide: 4 across for every 3 up, so a slide of 5 moves by (4, 3)
const DIRECTION: Vec = { x: 0.8, y: 0.6 };
const START = FLAG.map((p) => shift(p, { x: 0.3, y: 0.3 }));
const A = START[0]!;
const B = START[8]!;

/** an arrow from `from` to `to` in pixels, with its head at `to` */
function Arrow({ from, to, color }: { from: Vec; to: Vec; color: string }) {
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  if (length < 1) return null;
  const ux = (to.x - from.x) / length;
  const uy = (to.y - from.y) / length;
  const head = 11;
  const half = 6;
  const base = { x: to.x - ux * head, y: to.y - uy * head };
  return (
    <g>
      <line
        x1={from.x}
        y1={from.y}
        x2={base.x}
        y2={base.y}
        stroke={color}
        strokeWidth={2.5}
        strokeDasharray="6 4"
      />
      {length > head && (
        <polygon
          points={`${to.x},${to.y} ${base.x - uy * half},${base.y + ux * half} ${base.x + uy * half},${base.y - ux * half}`}
          fill={color}
        />
      )}
    </g>
  );
}

export function TranslationSlide() {
  const [far, setFar] = useState(2.5);
  const shown = useSmooth(far);
  const { width, height, px } = planeScale(-0.3, 5.7, -0.3, 4.8, 52);
  const by = { x: DIRECTION.x * shown, y: DIRECTION.y * shown };

  return (
    <Interactive
      readout={
        <>
          <div>
            A moves {format(far)}, and B moves {format(far)}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {far === 0
              ? "A slide by nothing leaves every point where it was."
              : `Every point moves ${format(far)} in the same direction, so the two arrows are the same length and point the same way. The flag doesn't turn.`}
          </div>
        </>
      }
      controls={
        <Slider
          label="how far to slide"
          value={far}
          onChange={setFar}
          min={0}
          max={5}
          step={0.5}
        />
      }
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto block h-auto w-full max-w-md text-fd-foreground"
        role="img"
        aria-label={`A flag slid a distance ${format(far)} up and to the right. The corners A and B each move the same distance in the same direction.`}
      >
        <Flag corners={START} px={px} color={COLORS.blue} faint />
        <Flag
          corners={START.map((p) => shift(p, by))}
          px={px}
          color={COLORS.blue}
        />
        <Arrow from={px(A)} to={px(shift(A, by))} color={COLORS.orange} />
        <Arrow from={px(B)} to={px(shift(B, by))} color={COLORS.green} />
        <Dot at={px(A)} name="A" dx={-12} dy={12} color={COLORS.orange} />
        <Dot at={px(B)} name="B" dx={-12} dy={-8} color={COLORS.green} />
      </svg>
    </Interactive>
  );
}
