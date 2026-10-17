"use client";

/**
 * Rectangles that all have the same area (16 unless given), with a slider for the width. Beside
 * each one, its average side (w + h)/2 against its geometric mean √(wh), which never changes: the
 * average is always at least as big, and only catches up when the rectangle is a square. For the
 * AM–GM inequality.
 */

import { useState } from "react";
import { COLORS, Interactive, Slider } from "./kit";

type RectangleFenceProps = {
  /** the area every rectangle has, 16 unless given */
  area?: number;
  /** the narrowest width on the slider, 2 unless given */
  min?: number;
  /** the widest width on the slider, 8 unless given */
  max?: number;
  /** the width to start with, the narrowest unless given */
  width?: number;
  caption?: string;
};

// the rectangle sits in a square box on the left, the two means are bars on the right
const BOX = 240;
const LEFT = 44;
const TOP = 20;
const BARS_X = 330;
const BAR = 36;

// a number with at most two decimals, with a proper minus sign
function show(n: number) {
  const rounded = Number(n.toFixed(2));
  return (rounded < 0 ? "−" : "") + String(Math.abs(rounded));
}

export function RectangleFence({
  area = 16,
  min = 2,
  max = 8,
  width: start = min,
  caption,
}: RectangleFenceProps) {
  const [w, setW] = useState(start);
  const h = area / w;
  const average = (w + h) / 2;
  const geometric = Math.sqrt(area);
  const square = Math.abs(w - h) < 1e-9;

  // one scale for every rectangle on the slider, so they can be compared
  const longest = Math.max(max, area / min);
  const unit = BOX / longest;
  const bottom = TOP + BOX;
  // the bars run from 0 to the largest average on the slider
  const top = Math.max((min + area / min) / 2, (max + area / max) / 2);
  const bar = (v: number) => (v / top) * (BOX - 20);

  return (
    <Interactive
      readout={
        <>
          <div>
            average ({show(w)} + {show(h)})/2 = {show(average)}{" "}
            {square ? "=" : ">"} √({show(w)} · {show(h)}) = {show(geometric)}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {square
              ? `A ${show(w)} by ${show(h)} square: the two means are equal, and the fence, ${show(2 * (w + h))}, is as short as it can be.`
              : `A ${show(w)} by ${show(h)} rectangle: not a square, so the average is bigger, and the fence, ${show(2 * (w + h))}, is longer than ${show(4 * geometric)}.`}
          </div>
        </>
      }
      controls={
        <Slider
          label="width"
          value={w}
          onChange={setW}
          min={min}
          max={max}
          step={0.1}
        />
      }
      caption={caption}
    >
      <svg
        viewBox="0 0 440 300"
        className="mx-auto block h-auto w-full max-w-lg text-fd-foreground"
        aria-label={`A ${show(w)} by ${show(h)} rectangle of area ${show(area)}, with average side ${show(average)} and geometric mean ${show(geometric)}`}
      >
        {/* the square of the same area, dashed, for comparison */}
        <rect
          x={LEFT}
          y={bottom - geometric * unit}
          width={geometric * unit}
          height={geometric * unit}
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />
        <rect
          x={LEFT}
          y={bottom - h * unit}
          width={w * unit}
          height={h * unit}
          fill={COLORS.blue}
          fillOpacity={0.2}
          stroke={COLORS.blue}
          strokeWidth={2.5}
        />
        {/* side lengths */}
        <text
          x={LEFT + (w * unit) / 2}
          y={bottom + 20}
          textAnchor="middle"
          fontSize={14}
          className="fill-fd-muted-foreground"
        >
          {show(w)}
        </text>
        <text
          x={LEFT - 8}
          y={bottom - (h * unit) / 2 + 5}
          textAnchor="end"
          fontSize={14}
          className="fill-fd-muted-foreground"
        >
          {show(h)}
        </text>

        {/* the two means as bars */}
        {[
          { label: "average", value: average, color: COLORS.blue, x: BARS_X },
          {
            label: "√(wh)",
            value: geometric,
            color: COLORS.orange,
            x: BARS_X + BAR + 22,
          },
        ].map((b) => (
          <g key={b.label}>
            <rect
              x={b.x}
              y={bottom - bar(b.value)}
              width={BAR}
              height={bar(b.value)}
              rx={4}
              fill={b.color}
              fillOpacity={0.7}
            />
            <text
              x={b.x + BAR / 2}
              y={bottom - bar(b.value) - 8}
              textAnchor="middle"
              fontSize={14}
              fontWeight={600}
              fill={b.color}
            >
              {show(b.value)}
            </text>
            <text
              x={b.x + BAR / 2}
              y={bottom + 20}
              textAnchor="middle"
              fontSize={13}
              className="fill-fd-muted-foreground"
            >
              {b.label}
            </text>
          </g>
        ))}
        <line
          x1={BARS_X - 8}
          x2={BARS_X + 2 * BAR + 30}
          y1={bottom}
          y2={bottom}
          stroke="currentColor"
          strokeWidth={1.5}
        />
      </svg>
    </Interactive>
  );
}
