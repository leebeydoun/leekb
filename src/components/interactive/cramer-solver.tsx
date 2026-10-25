"use client";

/**
 * CramerSolver: three equations in x, y and z with small whole-number coefficients, each one a box
 * to edit, and buttons for a few prepared systems. Under the equations sit four determinants: det A,
 * and det A with each column in turn replaced by the right-hand sides (the replaced column in
 * orange). The readout divides to get the solution and puts it back into each equation. When
 * det A = 0 it says Cramer's rule doesn't apply, and says whether elimination finds no solution or
 * infinitely many.
 */

import { useState } from "react";
import { Button, COLORS, Interactive, format } from "./kit";

type System = { A: number[][]; B: number[] };

const PRESETS: { name: string; system: System }[] = [
  {
    name: "Receipts",
    system: {
      A: [
        [2, 1, 1],
        [3, 2, 4],
        [4, 0, 3],
      ],
      B: [8, 16, 11],
    },
  },
  {
    name: "A fraction",
    system: {
      A: [
        [1, 0, 2],
        [3, 2, -1],
        [2, 2, -1],
      ],
      B: [3, -1, -2],
    },
  },
  {
    name: "No solution",
    system: {
      A: [
        [1, 2, 1],
        [2, 1, 3],
        [3, 3, 4],
      ],
      B: [4, 6, 9],
    },
  },
  {
    name: "Infinitely many",
    system: {
      A: [
        [1, 2, 1],
        [2, 1, 3],
        [3, 3, 4],
      ],
      B: [4, 6, 10],
    },
  },
];

const LETTERS = ["x", "y", "z"];

function det(M: number[][]) {
  const [[a, b, c], [d, e, f], [g, h, i]] = M as [
    [number, number, number],
    [number, number, number],
    [number, number, number],
  ];
  return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
}

/** A with column j replaced by B */
const replace = (A: number[][], B: number[], j: number) =>
  A.map((row, r) => row.map((v, c) => (c === j ? B[r]! : v)));

function gcd(p: number, q: number): number {
  return q === 0 ? Math.abs(p) : gcd(q, p % q);
}

/** top / bottom in lowest terms, with a proper minus sign */
function fraction(top: number, bottom: number) {
  const g = gcd(top, bottom) || 1;
  let n = top / g;
  let m = bottom / g;
  if (m < 0) {
    n = -n;
    m = -m;
  }
  return m === 1 ? format(n) : `${n < 0 ? "−" : ""}${Math.abs(n)}/${m}`;
}

/** a value in brackets when it starts with a minus sign, for writing a product */
const paren = (text: string) => (text.startsWith("−") ? `(${text})` : text);

/** how many independent rows the rows have, by elimination with a small tolerance */
function rank(rows: number[][]) {
  const M = rows.map((r) => [...r]);
  let found = 0;
  const width = M[0]!.length;
  for (let c = 0; c < width && found < M.length; c++) {
    const pivot = M.findIndex((r, i) => i >= found && Math.abs(r[c]!) > 1e-9);
    if (pivot < 0) continue;
    [M[found], M[pivot]] = [M[pivot]!, M[found]!];
    for (let i = 0; i < M.length; i++) {
      if (i === found) continue;
      const k = M[i]![c]! / M[found]![c]!;
      M[i] = M[i]!.map((v, j) => v - k * M[found]![j]!);
    }
    found++;
  }
  return found;
}

/** a 3 by 3 determinant drawn between bars, with one column picked out */
function Bars({
  M,
  highlight,
  name,
  value,
}: {
  M: number[][];
  highlight?: number;
  name: string;
  value: number;
}) {
  return (
    <div className="flex w-[9.5rem] flex-col items-center gap-1">
      <div className="text-sm text-fd-muted-foreground">{name}</div>
      <div className="grid grid-cols-3 border-x-2 border-fd-foreground px-1 tabular-nums">
        {M.map((row, r) =>
          row.map((v, c) => (
            <span
              key={`${r}${c}`}
              className="w-9 py-0.5 text-center"
              style={
                c === highlight
                  ? {
                      color: COLORS.orange,
                      fontWeight: 700,
                      backgroundColor: `${COLORS.orange}1f`,
                    }
                  : undefined
              }
            >
              {format(v)}
            </span>
          )),
        )}
      </div>
      <div className="text-sm font-medium tabular-nums">= {format(value)}</div>
    </div>
  );
}

/** an editable whole number from −9 to 9 */
function Entry({
  value,
  onChange,
  label,
  right = false,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  right?: boolean;
}) {
  return (
    <input
      type="number"
      min={-9}
      max={9}
      step={1}
      value={value}
      aria-label={label}
      onChange={(e) => {
        const v = Math.round(Number(e.target.value));
        if (Number.isFinite(v)) onChange(Math.max(-9, Math.min(9, v)));
      }}
      className="w-12 rounded-md border bg-transparent px-1 py-0.5 text-center tabular-nums"
      style={right ? { color: COLORS.orange, fontWeight: 700 } : undefined}
    />
  );
}

export function CramerSolver({
  caption = "Change any number in the equations, or pick a system. Each numerator is det A with one column replaced by the right-hand sides, shown in orange.",
}: {
  caption?: string;
}) {
  const [{ A, B }, setSystem] = useState<System>(PRESETS[0]!.system);
  const D = det(A);
  const nums = [0, 1, 2].map((j) => det(replace(A, B, j)));

  const setA = (r: number, c: number, v: number) =>
    setSystem((old) => ({
      ...old,
      A: old.A.map((row, i) => row.map((x, j) => (i === r && j === c ? v : x))),
    }));
  const setB = (r: number, v: number) =>
    setSystem((old) => ({
      ...old,
      B: old.B.map((x, i) => (i === r ? v : x)),
    }));

  let readout;
  if (D !== 0) {
    const values = nums.map((n) => fraction(n, D));
    // each equation with the solution put in: the coefficients times the values, added up
    const checks = A.map((row, r) => {
      const sum = row.reduce((s, a, j) => s + a * nums[j]!, 0);
      const terms = row
        .map((a, j) => `${paren(format(a))} · ${paren(values[j]!)}`)
        .join(" + ");
      return `${terms} = ${fraction(sum, D)}${sum === B[r]! * D ? " ✓" : ""}`;
    });
    readout = (
      <>
        <div>
          {LETTERS.map((letter, j) => (
            <span key={letter} className="mx-2 inline-block">
              <i>{letter}</i> = {format(nums[j]!)}/{paren(format(D))} ={" "}
              {values[j]}
            </span>
          ))}
        </div>
        <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
          Check: {checks.join(",  ")}
        </div>
      </>
    );
  } else {
    const consistent = rank(A) === rank(A.map((row, r) => [...row, B[r]!]));
    readout = (
      <>
        <div>det A = 0: Cramer&apos;s rule doesn&apos;t apply.</div>
        <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
          {consistent
            ? "Elimination shows this system has infinitely many solutions."
            : "Elimination shows this system has no solution."}
        </div>
      </>
    );
  }

  return (
    <Interactive
      caption={caption}
      readout={readout}
      controls={PRESETS.map(({ name, system }) => (
        <Button key={name} onClick={() => setSystem(system)}>
          {name}
        </Button>
      ))}
    >
      <div className="flex flex-col items-center gap-2 text-base">
        {A.map((row, r) => (
          <div key={r} className="flex items-center gap-1.5">
            {row.map((a, c) => (
              <span key={c} className="flex items-center gap-1.5">
                {c > 0 && <span>+</span>}
                <Entry
                  value={a}
                  onChange={(v) => setA(r, c, v)}
                  label={`coefficient of ${LETTERS[c]} in equation ${r + 1}`}
                />
                <i>{LETTERS[c]}</i>
              </span>
            ))}
            <span className="mx-1">=</span>
            <Entry
              value={B[r]!}
              onChange={(v) => setB(r, v)}
              label={`right-hand side of equation ${r + 1}`}
              right
            />
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-4">
        <Bars M={A} name="det A" value={D} />
        {[0, 1, 2].map((j) => (
          <Bars
            key={j}
            M={replace(A, B, j)}
            highlight={j}
            name={`numerator for ${LETTERS[j]}`}
            value={nums[j]!}
          />
        ))}
      </div>
    </Interactive>
  );
}
