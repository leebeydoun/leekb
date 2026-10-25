"use client";

/**
 * GeometricBars: the terms 1, c, c², … of a geometric series drawn as bars laid end to end, each one
 * starting where the last ended and drawn one row lower, so the running total can be read off the
 * line underneath. A positive term points right (blue) and a negative term points back (orange). A
 * dashed green line marks the limit 1/(1 − c), and the readout gives the sum of the first n terms
 * and its gap to the limit. Sliders pick c from −0.9 to 0.9 and n from 1 to 30.
 */

import { useState } from "react";
import { COLORS, Interactive, Slider, format } from "./kit";

const WIDTH = 640;
const HEIGHT = 300;
const LEFT = 30;
const RIGHT = 30;
const TOP = 16;
const MOST = 30;
const ROW = 7;
const AXIS = TOP + MOST * ROW + 20;

/** a tick spacing and an end for the line, so that the limit and every sum fit */
function lineFor(c: number) {
  const reach = Math.max(1, 1 / (1 - c)) * 1.06;
  const gap = reach <= 1.5 ? 0.25 : reach <= 3 ? 0.5 : reach <= 6 ? 1 : 2;
  return { end: Math.ceil(reach / gap) * gap, gap };
}

/** a gap to the limit, to three decimal places when it is that big, and to two figures below */
function showGap(g: number) {
  if (g === 0) return "0";
  if (g >= 0.0005) return g.toFixed(3);
  if (g >= 1e-6) return String(Number(g.toPrecision(2)));
  return "less than 0.000001";
}

export function GeometricBars({
  caption = "Each bar is the one above it multiplied by c, and it starts where the one above it ended, so the right end of the lowest bar is the sum so far. The sums settle towards the dashed line at 1/(1 − c), and the gap shrinks by a factor of c at each step.",
}: {
  caption?: string;
}) {
  const [c, setC] = useState(0.5);
  const [n, setN] = useState(10);
  const { end, gap } = lineFor(c);
  const px = (x: number) => LEFT + (x / end) * (WIDTH - LEFT - RIGHT);

  const limit = 1 / (1 - c);
  const bars: { from: number; to: number }[] = [];
  let sum = 0;
  for (let k = 0; k < n; k++) {
    const term = c ** k;
    bars.push({ from: sum, to: sum + term });
    sum += term;
  }
  const left = Math.abs(sum - limit);
  const ticks = Array.from(
    { length: Math.round(end / gap) + 1 },
    (_, i) => i * gap,
  );
  const terms =
    n === 1 ? "the first term is" : `the first ${n} terms add up to`;

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>
            c = {format(c)}: {terms}{" "}
            <span style={{ color: COLORS.blue }}>{sum.toFixed(3)}</span>; the
            limit is{" "}
            <span style={{ color: COLORS.green }}>{format(limit, 3)}</span>, and
            the gap is {showGap(left)}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {c === 0
              ? "Every term after the first is 0, so every sum is 1, which is the limit itself."
              : c > 0
                ? `Every term is positive, so the sums climb towards the limit from below, and each step multiplies the gap by ${format(c)}.`
                : `The terms change sign, so the sums land on alternate sides of the limit, and each step multiplies the gap by ${format(-c)}.`}
          </div>
        </>
      }
      controls={
        <>
          <Slider
            label="the multiplier c"
            value={c}
            onChange={(v) => setC(Math.round(v * 100) / 100)}
            min={-0.9}
            max={0.9}
            step={0.05}
          />
          <Slider
            label="number of terms n"
            value={n}
            onChange={setN}
            min={1}
            max={MOST}
          />
        </>
      }
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-2xl text-fd-foreground"
        role="img"
        aria-label={`The first ${n} terms of the geometric series with c = ${format(c)}, drawn as bars laid end to end, one row each, starting at 0. The last bar ends at ${sum.toFixed(3)}, and a dashed line marks the limit ${format(limit, 3)}.`}
      >
        {/* light lines at each tick, so the bars can be read against the line */}
        <g className="text-fd-border" stroke="currentColor" strokeWidth={1}>
          {ticks.map((t) => (
            <line key={t} x1={px(t)} x2={px(t)} y1={TOP - 6} y2={AXIS} />
          ))}
        </g>

        {/* the limit */}
        <line
          x1={px(limit)}
          x2={px(limit)}
          y1={TOP - 8}
          y2={AXIS}
          stroke={COLORS.green}
          strokeWidth={2}
          strokeDasharray="7 5"
        />

        {/* the bars, one row each */}
        {bars.map(({ from, to }, k) => (
          <rect
            key={k}
            x={px(Math.min(from, to))}
            y={TOP + k * ROW}
            width={Math.max(1, Math.abs(px(to) - px(from)))}
            height={ROW - 2}
            rx={1}
            fill={to >= from ? COLORS.blue : COLORS.orange}
          />
        ))}
        {/* the sum so far, dropped onto the line */}
        <line
          x1={px(sum)}
          x2={px(sum)}
          y1={TOP + (n - 1) * ROW + ROW - 2}
          y2={AXIS}
          stroke={COLORS.blue}
          strokeWidth={1.5}
          strokeDasharray="3 3"
        />

        {/* the line the sums are read from */}
        <line
          x1={px(0)}
          x2={px(end)}
          y1={AXIS}
          y2={AXIS}
          stroke="currentColor"
          strokeWidth={1.5}
        />
        <g fontSize={12} className="fill-fd-muted-foreground">
          {ticks.map((t) => (
            <text key={t} x={px(t)} y={AXIS + 18} textAnchor="middle">
              {format(t)}
            </text>
          ))}
        </g>
        <circle
          cx={px(sum)}
          cy={AXIS}
          r={6}
          fill={COLORS.blue}
          stroke="var(--color-fd-card)"
          strokeWidth={2}
        />
        <text
          x={px(limit)}
          y={AXIS + 40}
          textAnchor="middle"
          fontSize={13}
          fontWeight={600}
          fill={COLORS.green}
        >
          1/(1 − c) = {format(limit, 3)}
        </text>
      </svg>
    </Interactive>
  );
}
