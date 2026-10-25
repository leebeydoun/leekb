"use client";

/**
 * LongDivision: long division one step at a time, for three divisions of polynomials and one of
 * whole numbers beside them. Each round of the division has three steps, revealed by the "next
 * step" button: choose the next term of the quotient (the top term so far divided by the top term
 * of the divisor), write that term times the divisor underneath, and subtract. The term chosen is
 * orange, the product blue and the difference green, and the readout says what the step did with
 * the numbers. At the end the readout writes f = qg + r and checks it at x = 1.
 */

import { useState } from "react";
import { Button, COLORS, Choice, Interactive, format } from "./kit";

type Cell = { col: number; text: string; faint?: boolean };
type Row = Cell[];

type Round = {
  /** the quotient term (or digit) found in this round, and where it is written on top */
  quotient: Cell;
  /** the column of the top term being matched, in the row above */
  matched: number;
  product: Row;
  /** the first column of the product, where the rule above the difference starts */
  from: number;
  difference: Row;
  say: [string, string, string];
};

type Layout = {
  cols: number;
  divisor: string;
  dividend: Row;
  rounds: Round[];
  /** the sentence for the start, and for the end */
  start: string;
  end: string;
};

// ---- polynomials, as lists of coefficients from the top power down ----

const SUP = ["", "", "²", "³", "⁴", "⁵", "⁶"];
const power = (d: number) => (d === 0 ? "" : d === 1 ? "x" : `x${SUP[d]}`);

/** one term with no sign in front: 2x³, x, 4 */
function bare(c: number, d: number) {
  const a = Math.abs(c);
  if (d === 0) return format(a);
  return `${a === 1 ? "" : format(a)}${power(d)}`;
}

/** a term as it is written first in a row (−6x) or after another term (+ 4x, − 5x) */
const lead = (c: number, d: number) => `${c < 0 ? "−" : ""}${bare(c, d)}`;
const next = (c: number, d: number) => `${c < 0 ? "−" : "+"} ${bare(c, d)}`;

/** a polynomial given by its coefficients, highest power first, at degree `top` */
function write(coefs: number[], top: number) {
  const parts: string[] = [];
  coefs.forEach((c, i) => {
    if (c === 0) return;
    const d = top - i;
    parts.push(parts.length === 0 ? lead(c, d) : next(c, d));
  });
  return parts.length ? parts.join(" ") : "0";
}

/** the coefficients as a map from degree to coefficient, dropping nothing */
type Poly = Map<number, number>;
const toPoly = (coefs: number[]): Poly =>
  new Map(coefs.map((c, i) => [coefs.length - 1 - i, c]));
const degree = (p: Poly) => {
  let d = -1;
  for (const [k, c] of p) if (c !== 0 && k > d) d = k;
  return d;
};
/** the terms from degree `top` down to 0, in order */
const listed = (p: Poly, top: number) =>
  Array.from({ length: top + 1 }, (_, i) => p.get(top - i) ?? 0);
const show = (p: Poly) => {
  const d = degree(p);
  return d < 0 ? "0" : write(listed(p, d), d);
};
const valueAt = (p: Poly, x: number) => {
  let s = 0;
  for (const [k, c] of p) s += c * x ** k;
  return s;
};

/**
 * A row of terms from degree `top` down to `bottom`, each in the column of its power (the column
 * of degree d is n − d, where n is the degree of the dividend). Zero terms are shown faint, as
 * placeholders, and the first term carries no plus sign.
 */
function termRow(p: Poly, top: number, bottom: number, n: number): Row {
  const row: Row = [];
  let first = true;
  for (let d = top; d >= bottom; d--) {
    const c = p.get(d) ?? 0;
    row.push({
      col: n - d,
      text: first ? lead(c, d) : next(c, d),
      faint: c === 0,
    });
    first = false;
  }
  return row;
}

function polynomialLayout(fc: number[], gc: number[]): Layout {
  const n = fc.length - 1;
  const m = gc.length - 1;
  const g = toPoly(gc);
  const gText = write(gc, m);
  const gTop = bare(gc[0]!, m);
  const rounds: Round[] = [];
  let current = toPoly(fc);
  const quotient: Poly = new Map();

  while (degree(current) >= m) {
    const d = degree(current);
    const t = current.get(d)! / gc[0]!;
    const e = d - m;
    quotient.set(e, t);
    const product: Poly = new Map();
    for (const [k, c] of g) product.set(k + e, t * c);
    const after: Poly = new Map();
    for (let k = 0; k <= n; k++) {
      const v = (current.get(k) ?? 0) - (product.get(k) ?? 0);
      after.set(k, k === d ? 0 : v);
    }
    const da = degree(after);
    const term = lead(t, e);
    const topText = lead(current.get(d)!, d);
    const productText = show(product);
    const tail =
      da < 0
        ? " Nothing is left: the remainder is 0."
        : da < m
          ? ` Degree ${da} is less than ${m}, the degree of ${gText}, so we stop: the remainder is ${show(after)}.`
          : ` Degree ${da} is not yet less than ${m}, so we go on.`;
    rounds.push({
      quotient: { col: n - e, text: rounds.length === 0 ? term : next(t, e) },
      matched: n - d,
      product: termRow(product, d, e, n),
      from: n - d,
      difference: da < 0 ? [{ col: n, text: "0" }] : termRow(after, da, 0, n),
      say: [
        `Divide the top term ${topText} by ${gTop}, the top term of ${gText}: that gives ${term}. Write ${term} on top, above the ${e === 0 ? "column of plain numbers" : `${power(e)} column`}.`,
        `${term} times (${gText}) is ${productText}. Write it underneath, lined up by powers: its top term matches ${topText}.`,
        `Subtract: ${show(current)} minus (${productText}) is ${show(after)}. The ${topText} terms cancel, so the degree drops below ${d}.${tail}`,
      ],
    });
    current = after;
  }

  const q = show(quotient);
  const r = show(current);
  const f1 = valueAt(toPoly(fc), 1);
  const g1 = valueAt(g, 1);
  const q1 = valueAt(quotient, 1);
  const r1 = valueAt(current, 1);
  const rWritten = r.includes(" ") || r.startsWith("−") ? `(${r})` : r;
  return {
    cols: n + 1,
    divisor: gText,
    dividend: termRow(toPoly(fc), n, 0, n),
    rounds,
    start: `Dividing ${write(fc, n)} by ${gText}. Missing powers are written as faint 0 terms, so every power has its own column. Press next step.`,
    end: `So ${write(fc, n)} = (${q})(${gText}) + ${rWritten}${
      degree(current) < 0 ? `, and ${gText} divides it exactly` : ""
    }. Check at x = 1: the left side is ${format(f1)}, and the right side is ${term1(q1)} · ${term1(g1)} + ${term1(r1)} = ${format(q1 * g1 + r1)}.`,
  };
}

// a number in brackets when it is negative, for a product or sum
const term1 = (v: number) => (v < 0 ? `(${format(v)})` : format(v));

// ---- whole numbers ----

function numberLayout(f: number, g: number): Layout {
  const digits = String(f).length;
  const rounds: Round[] = [];
  let current = f;
  const placed = (v: number, zeros = 0): Row =>
    String(v)
      .split("")
      .map((ch, i, all) => ({
        col: digits - all.length + i,
        text: ch,
        faint: i >= all.length - zeros,
      }));
  const placeNames = ["units", "tens", "hundreds", "thousands"];
  const times = [
    "no",
    "once",
    "twice",
    "three times",
    "four times",
    "five times",
  ];
  const often = (k: number) => times[k] ?? `${k} times`;
  let quotient = 0;

  while (current >= g) {
    // the largest power of ten whose multiple of g still fits
    let j = 0;
    while (g * 10 ** (j + 1) <= current) j++;
    const part = Math.floor(current / 10 ** j);
    const digit = Math.floor(part / g);
    const amount = digit * 10 ** j;
    const product = amount * g;
    const after = current - product;
    quotient += amount;
    const productDigits = String(product).length;
    rounds.push({
      quotient: { col: digits - 1 - j, text: String(digit) },
      matched: digits - String(current).length,
      product: placed(product, j),
      from: digits - productDigits,
      difference: placed(after),
      say: [
        `${g} goes into ${part} ${often(digit)}, so ${format(amount)} lots of ${g} fit into ${current}. Write ${digit} in the ${placeNames[j]} place on top.`,
        `${format(amount)} × ${g} = ${product}. Write it underneath, lined up by place value.`,
        `Subtract: ${current} − ${product} = ${after}.${
          after < g
            ? ` That is less than ${g}, so we stop: the remainder is ${after}.`
            : ` That is still at least ${g}, so we go on.`
        }`,
      ],
    });
    current = after;
  }

  return {
    cols: digits,
    divisor: String(g),
    dividend: placed(f),
    rounds,
    start: `Dividing ${f} by ${g}, the way you learnt at school, but writing each subtraction in full. Press next step.`,
    end: `So ${f} = ${quotient} × ${g} + ${current}, with 0 ≤ ${current} < ${g}. Check: ${quotient} × ${g} = ${quotient * g}, and ${quotient * g} + ${current} = ${f}.`,
  };
}

const PRESETS = {
  cubic: polynomialLayout([2, 1, -5, 4], [1, -1, 2]),
  quartic: polynomialLayout([1, 0, 0, -3, 1], [1, -2]),
  exact: polynomialLayout([1, 2, -5, -6], [1, 3]),
  number: numberLayout(452, 13),
};
type Preset = keyof typeof PRESETS;

const FAINT = "text-fd-muted-foreground/60";

export function LongDivision({
  preset: initial = "cubic",
}: {
  preset?: Preset;
}) {
  const [preset, setPreset] = useState<Preset>(initial);
  const [stage, setStage] = useState(0);
  const layout = PRESETS[preset];
  const { cols, rounds } = layout;
  const last = rounds.length * 3;
  const done = stage > last;
  // the round and the step within it (0 choose, 1 multiply, 2 subtract) of the latest stage
  const round = stage === 0 ? -1 : Math.floor((Math.min(stage, last) - 1) / 3);
  const step = stage === 0 ? -1 : (Math.min(stage, last) - 1) % 3;
  const shown = (i: number, s: number) => stage >= i * 3 + s + 1;

  const choose = (value: Preset) => {
    setPreset(value);
    setStage(0);
  };

  const readout =
    stage === 0 ? layout.start : done ? layout.end : rounds[round]!.say[step]!;

  // the grid: a column for the divisor and the minus signs, then one column per power or digit
  const template = `auto repeat(${cols}, minmax(${preset === "number" ? "1.4em" : "3.4em"}, auto))`;
  const quotientCells = rounds.flatMap((r, i) =>
    shown(i, 0) ? [{ ...r.quotient, i }] : [],
  );

  const cellsOf = (
    row: Row,
    color: string | undefined,
    highlight: number | undefined,
    ruleFrom?: number,
  ) =>
    Array.from({ length: cols }, (_, col) => {
      const cell = row.find((c) => c.col === col);
      const rule = ruleFrom !== undefined && col >= ruleFrom;
      return (
        <div
          key={col}
          className={`px-1 py-0.5 text-right whitespace-nowrap ${
            rule ? "border-t-2 border-fd-foreground/60" : ""
          } ${cell?.faint ? FAINT : ""}`}
          style={{
            color: cell?.faint ? undefined : color,
            fontWeight: highlight === col ? 700 : undefined,
            background: highlight === col ? `${COLORS.orange}22` : undefined,
            borderRadius: highlight === col ? 6 : undefined,
          }}
        >
          {cell?.text ?? ""}
        </div>
      );
    });

  return (
    <Interactive
      readout={<div className="mx-auto max-w-xl text-base">{readout}</div>}
      controls={
        <>
          <Choice
            label="division"
            value={preset}
            onChange={choose}
            options={[
              { value: "cubic", label: "÷ x² − x + 2" },
              { value: "quartic", label: "÷ x − 2" },
              { value: "exact", label: "÷ x + 3" },
              { value: "number", label: "452 ÷ 13" },
            ]}
          />
          <Button primary onClick={() => setStage(stage + 1)} disabled={done}>
            Next step
          </Button>
          <Button onClick={() => setStage(0)} disabled={stage === 0}>
            Start again
          </Button>
        </>
      }
      caption="Each round has three steps: choose the next term on top (orange), write it times the divisor underneath (blue), and subtract (green). The rounds stop when what is left has a smaller degree than the divisor, or is smaller than the divisor for whole numbers."
    >
      <div className="overflow-x-auto">
        <div
          className="mx-auto grid w-max font-mono text-[15px] leading-7 tabular-nums sm:text-base"
          style={{ gridTemplateColumns: template }}
          role="img"
          aria-label={`Long division of ${layout.dividend.map((c) => c.text).join(" ")} by ${layout.divisor}, ${
            stage === 0
              ? "before the first step"
              : `after ${Math.min(stage, last)} of ${last} steps`
          }.`}
        >
          {/* the quotient, written on top */}
          <div />
          {Array.from({ length: cols }, (_, col) => {
            const cell = quotientCells.find((c) => c.col === col);
            const fresh = cell && cell.i === round && !done;
            return (
              <div
                key={col}
                className="px-1 py-0.5 text-right whitespace-nowrap"
                style={{
                  color: COLORS.orange,
                  fontWeight: fresh ? 700 : 600,
                }}
              >
                {cell?.text ?? ""}
              </div>
            );
          })}

          {/* the divisor, the bracket and the dividend under its roof */}
          <div className="pr-1 text-right whitespace-nowrap">
            {layout.divisor} )
          </div>
          {cellsOf(
            layout.dividend,
            undefined,
            round === 0 && step === 0 && !done ? rounds[0]!.matched : undefined,
            0,
          )}

          {/* each round: the product to take away, then what is left */}
          {rounds.map((r, i) => {
            const productShown = shown(i, 1);
            const differenceShown = shown(i, 2);
            const matchNext =
              round === i + 1 && step === 0 && !done
                ? rounds[i + 1]!.matched
                : undefined;
            return [
              <div
                key={`pm${i}`}
                className={`pr-1 text-right ${productShown ? "" : "invisible"}`}
                style={{ color: COLORS.blue }}
              >
                −
              </div>,
              <div
                key={`p${i}`}
                className={`contents ${productShown ? "" : "[&>div]:invisible"}`}
              >
                {cellsOf(r.product, COLORS.blue, undefined)}
              </div>,
              <div key={`dm${i}`} />,
              <div
                key={`d${i}`}
                className={`contents ${differenceShown ? "" : "[&>div]:invisible"}`}
              >
                {cellsOf(r.difference, COLORS.green, matchNext, r.from)}
              </div>,
            ];
          })}
        </div>
      </div>
    </Interactive>
  );
}
