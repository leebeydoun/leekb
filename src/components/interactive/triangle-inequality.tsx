"use client";

/**
 * The triangle inequality on a number line: an arrow for a from 0, then an arrow for b from where a
 * ends, landing on a + b. Under it, two bars compare |a + b| with |a| + |b|. They match when a and
 * b have the same sign, and |a + b| is shorter when the signs are opposite and part of each cancels.
 */

import { useState } from "react";
import {
  Axis,
  COLORS,
  Dot,
  HArrow,
  Interactive,
  Slider,
  format,
  lineScale,
} from "./kit";

const W = 600;
const AXIS_Y = 112;
// the bars start after a column for their labels
const BAR_X = 130;
const BAR_H = 18;

// a number inside a sum, in brackets when negative: 3 + (−5)
const term = (n: number) => (n < 0 ? `(${format(n)})` : format(n));

export function TriangleInequality({
  a: startA = 3,
  b: startB = -5,
  max = 5,
  step = 1,
}: {
  /** starting value of a */
  a?: number;
  /** starting value of b */
  b?: number;
  /** the sliders run from −max to max */
  max?: number;
  step?: number;
}) {
  const [a, setA] = useState(startA);
  const [b, setB] = useState(startB);
  const sum = a + b;
  const size = Math.abs(sum);
  const total = Math.abs(a) + Math.abs(b);

  // the line has room for a + b at either extreme
  const { x, unit } = lineScale(-2 * max, 2 * max, W);
  const every = max > 4 ? 2 : 1;

  const sumY = 190;
  const totalY = 226;
  const valueX = BAR_X + total * unit + 10;

  let verdict: string;
  if (a * b > 0) verdict = "same signs, so the sizes add up";
  else if (a * b === 0) verdict = "one of them is 0, so nothing cancels";
  else
    verdict = `opposite signs, so ${format(Math.min(Math.abs(a), Math.abs(b)))} of each cancels`;

  const readout = (
    <>
      |{format(a)} + {term(b)}| = {format(size)} {size === total ? "=" : "<"}{" "}
      {format(total)} = |{format(a)}| + |{format(b)}|: {verdict}
    </>
  );

  return (
    <Interactive
      readout={readout}
      controls={
        <>
          <Slider
            label="a"
            value={a}
            onChange={setA}
            min={-max}
            max={max}
            step={step}
          />
          <Slider
            label="b"
            value={b}
            onChange={setB}
            min={-max}
            max={max}
            step={step}
          />
        </>
      }
    >
      <svg
        viewBox={`0 0 ${W} 250`}
        className="mx-auto block h-auto w-full max-w-2xl text-fd-foreground"
        role="img"
        aria-label={`An arrow for a = ${format(a)} from 0 and an arrow for b = ${format(b)} from its end, landing on ${format(sum)}; bars compare |a + b| = ${format(size)} with |a| + |b| = ${format(total)}`}
      >
        <Axis from={-2 * max} to={2 * max} y={AXIS_Y} width={W} every={every} />

        {/* where a ends and b starts, and where b ends */}
        <line
          x1={x(a)}
          x2={x(a)}
          y1={48}
          y2={AXIS_Y}
          stroke="currentColor"
          strokeOpacity={0.3}
          strokeDasharray="3 4"
        />
        <line
          x1={x(sum)}
          x2={x(sum)}
          y1={48}
          y2={AXIS_Y}
          stroke={COLORS.purple}
          strokeOpacity={0.6}
          strokeDasharray="3 4"
        />
        <HArrow
          x1={x(0)}
          x2={x(a)}
          y={82}
          color={COLORS.blue}
          label={`a = ${format(a)}`}
        />
        <HArrow
          x1={x(a)}
          x2={x(sum)}
          y={48}
          color={COLORS.orange}
          label={`b = ${format(b)}`}
        />
        <Dot
          cx={x(sum)}
          cy={AXIS_Y}
          color={COLORS.purple}
          label="a + b"
          below
        />

        {/* the bars, drawn to the same scale as the line */}
        <text
          x={BAR_X - 12}
          y={sumY + 14}
          textAnchor="end"
          fontSize={15}
          fill="currentColor"
        >
          |a + b|
        </text>
        <text
          x={BAR_X - 12}
          y={totalY + 14}
          textAnchor="end"
          fontSize={15}
          fill="currentColor"
        >
          |a| + |b|
        </text>
        <rect
          x={BAR_X}
          y={sumY}
          width={size * unit}
          height={BAR_H}
          rx={3}
          fill={COLORS.purple}
        />
        {total > size && (
          // the part lost to cancelling
          <rect
            x={BAR_X + size * unit + 1}
            y={sumY + 1}
            width={(total - size) * unit - 2}
            height={BAR_H - 2}
            rx={3}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.45}
            strokeDasharray="4 3"
          />
        )}
        <rect
          x={BAR_X}
          y={totalY}
          width={Math.abs(a) * unit}
          height={BAR_H}
          rx={3}
          fill={COLORS.blue}
        />
        <rect
          x={BAR_X + Math.abs(a) * unit}
          y={totalY}
          width={Math.abs(b) * unit}
          height={BAR_H}
          rx={3}
          fill={COLORS.orange}
        />
        <text
          x={valueX}
          y={sumY + 14}
          fontSize={15}
          fontWeight={600}
          fill={COLORS.purple}
        >
          {format(size)}
        </text>
        <text
          x={valueX}
          y={totalY + 14}
          fontSize={15}
          fontWeight={600}
          fill="currentColor"
        >
          {format(total)}
        </text>
      </svg>
    </Interactive>
  );
}
