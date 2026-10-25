"use client";

/**
 * Three sums as pictures, for any n from 1 to 12. "1 + ⋯ + n" stacks a staircase of 1 to n blue
 * squares and the same staircase turned over in orange, filling an n by n + 1 rectangle. "odd
 * numbers" wraps L-shaped layers of 1, 3, 5, … squares round a corner, filling an n by n square.
 * "squares" shows a pyramid of oranges from the front, with the number in each layer and the
 * running total beside it. The readout gives the sum and the formula, with numbers.
 */

import { useState } from "react";
import { Choice, COLORS, Interactive, Slider } from "./kit";

type Kind = "integers" | "odd" | "squares";

const WIDTH = 640;
const HEIGHT = 320;
const PEEL = "#fb923c";
const PEEL_EDGE = "#c2410c";

/** a sum written out: every term when there are few, otherwise the first three and the last */
function written(terms: number[]) {
  if (terms.length <= 4) return terms.join(" + ");
  return `${terms.slice(0, 3).join(" + ")} + ⋯ + ${terms[terms.length - 1]}`;
}

const upTo = (n: number, f: (k: number) => number) =>
  Array.from({ length: n }, (_, i) => f(i + 1));

function Staircases({ n }: { n: number }) {
  const u = Math.min(26, 280 / (n + 1), 400 / n);
  const x0 = (WIDTH - n * u) / 2;
  const y0 = (HEIGHT - (n + 1) * u) / 2 - 6;
  const cells = [];
  for (let j = 1; j <= n; j++)
    for (let h = 0; h <= n; h++)
      cells.push(
        <rect
          key={`${j}-${h}`}
          x={x0 + (j - 1) * u}
          y={y0 + (n - h) * u}
          width={u}
          height={u}
          fill={h < j ? COLORS.blue : COLORS.orange}
          fillOpacity={0.55}
          stroke="var(--color-fd-card)"
          strokeWidth={1.5}
        />,
      );
  return (
    <g>
      {cells}
      <text
        x={WIDTH / 2}
        y={y0 + (n + 1) * u + 20}
        textAnchor="middle"
        fontSize={14}
        fill="currentColor"
      >
        {n} across
      </text>
      <text
        x={x0 + n * u + 12}
        y={y0 + ((n + 1) * u) / 2 + 5}
        fontSize={14}
        fill="currentColor"
      >
        {n + 1} up
      </text>
    </g>
  );
}

function OddLayers({ n }: { n: number }) {
  const u = Math.min(26, 280 / n);
  const x0 = (WIDTH - n * u) / 2;
  const y0 = (HEIGHT - n * u) / 2 - 6;
  const cells = [];
  // the cell i across and j up from the bottom left corner is in layer max(i, j) + 1
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      cells.push(
        <rect
          key={`${i}-${j}`}
          x={x0 + i * u}
          y={y0 + (n - 1 - j) * u}
          width={u}
          height={u}
          fill={Math.max(i, j) % 2 === 0 ? COLORS.blue : COLORS.orange}
          fillOpacity={0.55}
          stroke="var(--color-fd-card)"
          strokeWidth={1.5}
        />,
      );
  return (
    <g>
      {cells}
      <text
        x={WIDTH / 2}
        y={y0 + n * u + 20}
        textAnchor="middle"
        fontSize={14}
        fill="currentColor"
      >
        {n} by {n}
      </text>
    </g>
  );
}

function Pyramid({ n }: { n: number }) {
  const row = Math.min(30, 270 / n);
  const r = Math.min(row / 2 - 1, 120 / n);
  const cx = 200;
  const y0 = (HEIGHT - n * row) / 2 + 8;
  const oranges = [];
  for (let k = 1; k <= n; k++)
    for (let j = 0; j < k; j++)
      oranges.push(
        <circle
          key={`${k}-${j}`}
          cx={cx + (j - (k - 1) / 2) * 2 * r}
          cy={y0 + (k - 0.5) * row}
          r={r}
          fill={PEEL}
          stroke={PEEL_EDGE}
          strokeWidth={1}
        />,
      );
  const size = Math.min(14, row - 2);
  let total = 0;
  return (
    <g>
      {oranges}
      <text
        x={430}
        y={y0 - 8}
        textAnchor="end"
        fontSize={13}
        className="fill-fd-muted-foreground"
      >
        in layer
      </text>
      <text
        x={590}
        y={y0 - 8}
        textAnchor="end"
        fontSize={13}
        className="fill-fd-muted-foreground"
      >
        running total
      </text>
      {upTo(n, (k) => k).map((k) => {
        total += k * k;
        return (
          <g key={k} fontSize={size} fill="currentColor">
            <text x={430} y={y0 + (k - 0.5) * row + size / 3} textAnchor="end">
              {k * k}
            </text>
            <text x={590} y={y0 + (k - 0.5) * row + size / 3} textAnchor="end">
              {total}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export function SumPictures({
  start = "integers",
  caption = "Move n and switch between the three sums. The rectangle and the square hold exactly the squares being added, so their size is the sum. The pyramid is seen from the front, with the oranges in each layer and the running total listed beside it.",
}: {
  /** the sum shown first */
  start?: Kind;
  caption?: string;
}) {
  const [kind, setKind] = useState<Kind>(start);
  const [n, setN] = useState(7);

  let readout: string;
  if (kind === "integers") {
    const sum = (n * (n + 1)) / 2;
    readout =
      n === 1
        ? "1 = 1 · 2 / 2: one square, and its copy makes a 1 by 2 rectangle."
        : `${written(upTo(n, (k) => k))} = ${sum}. Two staircases fill a ${n} by ${n + 1} rectangle of ${n * (n + 1)} squares, and half of that is ${n} · ${n + 1} / 2 = ${sum}.`;
  } else if (kind === "odd") {
    readout =
      n === 1
        ? "1 = 1²: a single square."
        : `${written(upTo(n, (k) => 2 * k - 1))} = ${n * n}. The ${n} L-shaped layers fill a ${n} by ${n} square, so the sum is ${n}² = ${n * n}.`;
  } else {
    const sum = (n * (n + 1) * (2 * n + 1)) / 6;
    readout = `A pyramid ${n} layer${n === 1 ? "" : "s"} high holds ${written(upTo(n, (k) => k * k))} = ${sum} oranges, and ${n} · ${n + 1} · ${2 * n + 1} / 6 = ${sum}.`;
  }

  return (
    <Interactive
      caption={caption}
      readout={readout}
      controls={
        <>
          <Choice
            label="sum"
            value={kind}
            onChange={setKind}
            options={[
              { value: "integers", label: "1 + ⋯ + n" },
              { value: "odd", label: "odd numbers" },
              { value: "squares", label: "squares" },
            ]}
          />
          <Slider label={<i>n</i>} value={n} onChange={setN} min={1} max={12} />
        </>
      }
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-2xl text-fd-foreground"
        role="img"
        aria-label={readout}
      >
        {kind === "integers" && <Staircases n={n} />}
        {kind === "odd" && <OddLayers n={n} />}
        {kind === "squares" && <Pyramid n={n} />}
      </svg>
    </Interactive>
  );
}
