"use client";

/**
 * Expands a 3 by 3 determinant along a row or down a column of your choice. The matrix is drawn
 * with the checkerboard of signs in the corner of each cell. For the term being looked at, the
 * entry is ringed in orange, its row and column are crossed out, and the four entries left (the
 * minor) are blue; on the right the minor is written out with its 2 by 2 determinant, under a list
 * of all three terms and their total. Whichever row or column is chosen, the total is the same.
 */

import { useState } from "react";
import { Choice, COLORS, format, Interactive } from "./kit";

type Grid = number[][];

const MATRICES: Record<string, { label: string; entries: Grid }> = {
  a: {
    label: "A",
    entries: [
      [2, 1, -2],
      [3, -1, -2],
      [1, 0, 2],
    ],
  },
  zeros: {
    label: "Two zeros",
    entries: [
      [3, 5, 2],
      [0, 4, -1],
      [0, 2, 3],
    ],
  },
  triangular: {
    label: "Triangular",
    entries: [
      [2, 5, -3],
      [0, 3, 7],
      [0, 0, -1],
    ],
  },
};

type Line = "r0" | "r1" | "r2" | "c0" | "c1" | "c2";
const LINES: { value: Line; label: string }[] = [
  { value: "r0", label: "Row 1" },
  { value: "r1", label: "Row 2" },
  { value: "r2", label: "Row 3" },
  { value: "c0", label: "Col 1" },
  { value: "c1", label: "Col 2" },
  { value: "c2", label: "Col 3" },
];

type Term = "0" | "1" | "2";

/** the minor left when row i and column j are crossed out, as a 2 by 2 grid */
function minor(m: Grid, i: number, j: number): Grid {
  return m
    .filter((_, r) => r !== i)
    .map((row) => row.filter((_, c) => c !== j));
}

const det2 = (m: Grid) => m[0]![0]! * m[1]![1]! - m[0]![1]! * m[1]![0]!;
const sign = (i: number, j: number) => ((i + j) % 2 === 0 ? 1 : -1);

/** the position (row, column) of term k along the chosen line */
const place = (line: Line, k: number): [number, number] =>
  line[0] === "r" ? [Number(line[1]), k] : [k, Number(line[1])];

// a number in brackets when it is negative, for writing it after a times sign
const bracket = (n: number) => (n < 0 ? `(${format(n)})` : format(n));

const WIDTH = 640;
const HEIGHT = 262;
const CELL = 58;
const LEFT = 52;
const TOP = 40;

export function Det3Expander() {
  const [which, setWhich] = useState("a");
  const [line, setLine] = useState<Line>("r0");
  const [term, setTerm] = useState<Term>("0");
  const m = MATRICES[which]!.entries;
  const k = Number(term);
  const [ci, cj] = place(line, k);

  const terms = [0, 1, 2].map((t) => {
    const [i, j] = place(line, t);
    const small = minor(m, i, j);
    const s = sign(i, j);
    return { i, j, s, entry: m[i]![j]!, small, d: det2(small) };
  });
  const values = terms.map(({ s, entry, d }) => s * entry * d);
  const total = values.reduce((a, b) => a + b, 0);
  const current = terms[k]!;

  const name = LINES.find((l) => l.value === line)!
    .label.replace("Col", "column")
    .replace("Row", "row");
  const sum = values
    .map((v, t) =>
      t === 0 ? format(v) : v < 0 ? ` − ${format(-v)}` : ` + ${format(v)}`,
    )
    .join("");
  const readout = `Expanding along ${name}: ${sum} = ${format(total)}. Every choice of row or column gives ${format(total)}.`;

  const cellX = (j: number) => LEFT + j * CELL + CELL / 2;
  const cellY = (i: number) => TOP + i * CELL + CELL / 2;
  const onLine = (i: number, j: number) =>
    line[0] === "r" ? i === Number(line[1]) : j === Number(line[1]);
  const crossed = (i: number, j: number) => i === ci || j === cj;

  // the right-hand panel
  const PX = 280;
  const mx = PX + 150;
  const my = 62;
  const step = 28;
  const LIST = 160;

  return (
    <Interactive
      readout={readout}
      controls={
        <>
          <Choice
            label="Matrix"
            value={which}
            onChange={setWhich}
            options={Object.entries(MATRICES).map(([value, { label }]) => ({
              value,
              label,
            }))}
          />
          <Choice
            label="Expand along"
            value={line}
            onChange={setLine}
            options={LINES}
          />
          <Choice
            label="Term"
            value={term}
            onChange={setTerm}
            options={[
              { value: "0", label: "1" },
              { value: "1", label: "2" },
              { value: "2", label: "3" },
            ]}
          />
        </>
      }
      caption="Pick a row or a column, then step through its three terms. Each term is the checkerboard sign, times the ringed entry, times the determinant of the blue minor left when that entry's row and column are crossed out."
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-2xl text-fd-foreground"
        role="img"
        aria-label={`A 3 by 3 matrix expanded along ${name}. Term ${k + 1} is the sign ${current.s > 0 ? "plus" : "minus"}, times the entry ${format(current.entry)}, times the determinant ${format(current.d)} of its minor. ${readout}`}
      >
        {/* the chosen row or column, shaded */}
        {[0, 1, 2].map((t) => {
          const [i, j] = place(line, t);
          return (
            <rect
              key={t}
              x={LEFT + j * CELL + 3}
              y={TOP + i * CELL + 3}
              width={CELL - 6}
              height={CELL - 6}
              rx={8}
              fill={COLORS.purple}
              fillOpacity={0.14}
            />
          );
        })}

        {/* brackets */}
        <g
          stroke="currentColor"
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        >
          <path
            d={`M ${LEFT - 2} ${TOP} q -12 ${(3 * CELL) / 2} 0 ${3 * CELL}`}
          />
          <path
            d={`M ${LEFT + 3 * CELL + 2} ${TOP} q 12 ${(3 * CELL) / 2} 0 ${3 * CELL}`}
          />
        </g>

        {/* the crossed-out row and column */}
        <g stroke={COLORS.orange} strokeWidth={2} strokeOpacity={0.55}>
          <line
            x1={LEFT + 4}
            x2={LEFT + 3 * CELL - 4}
            y1={cellY(ci)}
            y2={cellY(ci)}
          />
          <line
            x1={cellX(cj)}
            x2={cellX(cj)}
            y1={TOP + 4}
            y2={TOP + 3 * CELL - 4}
          />
        </g>
        <circle
          cx={cellX(cj)}
          cy={cellY(ci)}
          r={20}
          fill="var(--color-fd-card)"
          stroke={COLORS.orange}
          strokeWidth={3}
        />

        {m.map((row, i) =>
          row.map((entry, j) => {
            const here = i === ci && j === cj;
            const color = here
              ? COLORS.orange
              : crossed(i, j)
                ? "currentColor"
                : COLORS.blue;
            return (
              <g key={`${i}${j}`}>
                <text
                  x={cellX(j)}
                  y={cellY(i) + 7}
                  textAnchor="middle"
                  fontSize={21}
                  fontWeight={crossed(i, j) && !here ? 400 : 700}
                  fill={color}
                  opacity={crossed(i, j) && !here ? 0.4 : 1}
                >
                  {format(entry)}
                </text>
                <text
                  x={LEFT + j * CELL + CELL - 9}
                  y={TOP + i * CELL + 15}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight={onLine(i, j) ? 700 : 400}
                  fill="currentColor"
                  opacity={onLine(i, j) ? 0.9 : 0.4}
                >
                  {sign(i, j) > 0 ? "+" : "−"}
                </text>
              </g>
            );
          }),
        )}

        {/* the current term written out: sign, entry and minor */}
        <text
          x={PX}
          y={my + 6}
          fontSize={20}
          fill="currentColor"
          textAnchor="start"
        >
          <tspan fontWeight={700}>{current.s > 0 ? "+" : "−"}</tspan>
          <tspan dx={8} fill={COLORS.orange} fontWeight={700}>
            {bracket(current.entry)}
          </tspan>
          <tspan dx={6}>×</tspan>
        </text>
        <g stroke={COLORS.blue} strokeWidth={2}>
          <line x1={mx - 46} x2={mx - 46} y1={my - 30} y2={my + 34} />
          <line x1={mx + 46} x2={mx + 46} y1={my - 30} y2={my + 34} />
        </g>
        {current.small.map((row, r) =>
          row.map((entry, c) => (
            <text
              key={`${r}${c}`}
              x={mx - 22 + c * 44}
              y={my - 6 + r * 30}
              textAnchor="middle"
              fontSize={19}
              fontWeight={700}
              fill={COLORS.blue}
            >
              {format(entry)}
            </text>
          )),
        )}
        <text x={mx + 58} y={my + 6} fontSize={20} fill="currentColor">
          = {format(values[k]!)}
        </text>
        <text x={PX} y={my + 64} fontSize={17} fill={COLORS.blue}>
          minor: {bracket(current.small[0]![0]!)} ·{" "}
          {bracket(current.small[1]![1]!)} − {bracket(current.small[0]![1]!)} ·{" "}
          {bracket(current.small[1]![0]!)} = {format(current.d)}
        </text>

        {/* all three terms, and their total */}
        {terms.map((t, n) => (
          <text
            key={n}
            x={PX}
            y={LIST + n * step}
            fontSize={17}
            fill="currentColor"
            fontWeight={n === k ? 700 : 400}
            opacity={n === k ? 1 : 0.6}
          >
            Term {n + 1}: {t.s > 0 ? "+" : "−"} {bracket(t.entry)} ×{" "}
            {bracket(t.d)} = {format(values[n]!)}
          </text>
        ))}
        <line
          x1={PX}
          x2={WIDTH - 20}
          y1={LIST + 2 * step + 12}
          y2={LIST + 2 * step + 12}
          stroke="currentColor"
          strokeOpacity={0.3}
        />
        <text
          x={PX}
          y={LIST + 3 * step + 4}
          fontSize={18}
          fontWeight={700}
          fill="currentColor"
        >
          Total: {format(total)}
        </text>
      </svg>
    </Interactive>
  );
}
