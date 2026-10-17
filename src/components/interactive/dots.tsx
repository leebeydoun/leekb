"use client";

/**
 * n dots put into rows of d, with the dots left over in a different colour. With none left over,
 * d divides n; otherwise n = q·d + r with r dots left. With d = 2 the rows are pairs, so it shows
 * even and odd.
 */

import { useState } from "react";
import { COLORS, Interactive, Slider } from "./kit";

type RowsOfDotsProps = {
  /** how many dots, 23 unless given */
  n?: number;
  /** how many dots in a row, 5 unless given */
  d?: number;
  /** the most dots on the slider, 40 unless given */
  maxN?: number;
  /** the longest row on the slider, 10 unless given */
  maxD?: number;
  caption?: string;
};

const WIDTH = 440;
const HEIGHT = 260;

export function RowsOfDots({
  n: startN = 23,
  d: startD = 5,
  maxN = 40,
  maxD = 10,
  caption,
}: RowsOfDotsProps) {
  const [n, setN] = useState(startN);
  const [d, setD] = useState(startD);
  const q = Math.floor(n / d);
  const r = n - q * d;
  const rows = Math.ceil(n / d);

  // one spacing for the whole grid, small enough to fit the tallest or widest arrangement
  const gap = Math.min(34, (WIDTH - 20) / d, (HEIGHT - 20) / Math.max(rows, 1));
  const left = (WIDTH - gap * d) / 2;
  const top = (HEIGHT - gap * rows) / 2;
  const radius = Math.min(11, gap * 0.32);

  const rowWord = q === 1 ? "row" : "rows";
  const parity =
    d === 2 ? (r === 0 ? `, so ${n} is even` : `, so ${n} is odd`) : "";
  const readout =
    r === 0
      ? `${n} = ${q} · ${d}: ${q} ${rowWord} of ${d}, so ${d} divides ${n}${parity}`
      : q === 0
        ? `${n} = 0 · ${d} + ${r}: no full row, ${r} left over`
        : `${n} = ${q} · ${d} + ${r}: ${q} ${rowWord} of ${d}, ${r} left over${parity}`;

  return (
    <Interactive
      readout={readout}
      controls={
        <>
          <Slider label="dots" value={n} onChange={setN} min={1} max={maxN} />
          <Slider
            label="in a row"
            value={d}
            onChange={setD}
            min={2}
            max={maxD}
          />
        </>
      }
      caption={caption}
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-lg text-fd-foreground"
        aria-label={`${n} dots in rows of ${d}: ${q} full ${rowWord} and ${r} left over`}
      >
        {/* a faint band behind each full row */}
        {Array.from({ length: q }, (_, row) => (
          <rect
            key={row}
            x={left + 2}
            y={top + row * gap + 2}
            width={gap * d - 4}
            height={gap - 4}
            rx={(gap - 4) / 2}
            fill={COLORS.blue}
            fillOpacity={0.1}
          />
        ))}
        {/* the empty places that would finish the last row */}
        {r > 0 &&
          Array.from({ length: d - r }, (_, i) => (
            <circle
              key={`gap-${i}`}
              cx={left + (r + i + 0.5) * gap}
              cy={top + (q + 0.5) * gap}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.35}
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
          ))}
        {Array.from({ length: n }, (_, i) => {
          const row = Math.floor(i / d);
          const col = i % d;
          const extra = row === q;
          return (
            <circle
              key={i}
              cx={left + (col + 0.5) * gap}
              cy={top + (row + 0.5) * gap}
              r={radius}
              fill={extra ? COLORS.orange : COLORS.blue}
            />
          );
        })}
      </svg>
    </Interactive>
  );
}
