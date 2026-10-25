"use client";

/**
 * PolynomialRoots: the cubic f(x) = a(x − r₁)(x − r₂)(x − r₃), drawn on a grid from −5 to 5
 * across and cut off above and below. The three roots sit on the x-axis as dots you can drag (or
 * set with the sliders), to the nearest half, and a slider sets the leading coefficient a, from −2
 * to 2 but never 0. The readout gives the factored form and the multiplied-out form with the
 * numbers in, and says how many different roots there are.
 */

import { useId, useRef, useState, type PointerEvent } from "react";
import { Grid, gridScale } from "./grid";
import { COLORS, Interactive, Slider, format } from "./kit";

type Range = [number, number];

const X: Range = [-5, 5];
const Y: Range = [-6, 6];
const LEADING = [-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2];
const ROOT_COLORS = [COLORS.orange, COLORS.green, COLORS.purple];

/** "x", "x − 2" or "x + 2", for the root r */
const factorOf = (r: number) =>
  r === 0 ? "x" : `x ${r > 0 ? "−" : "+"} ${format(Math.abs(r))}`;

/** the factored form, with a repeated root written as a power */
function factored(a: number, roots: number[]) {
  const counts = new Map<number, number>();
  for (const r of [...roots].sort((p, q) => p - q))
    counts.set(r, (counts.get(r) ?? 0) + 1);
  const parts = [...counts].map(([r, n]) => {
    const f = factorOf(r);
    const base = r === 0 && n === 1 ? f : `(${f})`;
    return n === 1 ? base : `${base}${n === 2 ? "²" : "³"}`;
  });
  const lead = a === 1 ? "" : a === -1 ? "−" : format(a);
  return `${lead}${parts.join("")}`;
}

/** the multiplied-out form a x³ + b x² + c x + d, leaving out zero terms */
function expanded(a: number, [p, q, r]: number[]) {
  const coefficients = [
    a,
    -a * (p! + q! + r!),
    a * (p! * q! + p! * r! + q! * r!),
    -a * p! * q! * r!,
  ];
  const powers = ["x³", "x²", "x", ""];
  let out = "";
  coefficients.forEach((raw, i) => {
    const c = Number(raw.toFixed(4));
    if (c === 0) return;
    const size = Math.abs(c);
    const number = size === 1 && powers[i] ? "" : format(size, 4);
    const term = `${number}${powers[i]}`;
    if (out === "") out = c < 0 ? `−${term}` : term;
    else out += ` ${c < 0 ? "−" : "+"} ${term}`;
  });
  return out;
}

/** how many different roots, in words */
function count(roots: number[]) {
  const different = [...new Set(roots)].sort((p, q) => p - q);
  const list = different.map((r) => {
    const n = roots.filter((s) => s === r).length;
    return `${format(r)}${n === 2 ? " (twice)" : n === 3 ? " (three times)" : ""}`;
  });
  const words = [
    "",
    "One different root",
    "Two different roots",
    "Three different roots",
  ];
  const joined =
    list.length === 1
      ? list[0]
      : `${list.slice(0, -1).join(", ")} and ${list[list.length - 1]}`;
  return `${words[different.length]}: ${joined}.`;
}

export function PolynomialRoots({
  roots: initialRoots = [-2, 1, 3],
  a: initialA = 1,
}: {
  /** the three roots at the start */
  roots?: [number, number, number];
  /** the leading coefficient at the start, one of −2, −1.5, …, 2 but not 0 */
  a?: number;
}) {
  const [roots, setRoots] = useState<number[]>(initialRoots);
  const [lead, setLead] = useState(Math.max(0, LEADING.indexOf(initialA)));
  const [held, setHeld] = useState<number | null>(null);
  const id = useId();
  const box = useRef<SVGRectElement>(null);
  const { px, py } = gridScale(X, Y);
  const a = LEADING[lead]!;

  const f = (x: number) =>
    a * (x - roots[0]!) * (x - roots[1]!) * (x - roots[2]!);
  const n = 400;
  const curve = Array.from({ length: n + 1 }, (_, i) => {
    const x = X[0] + ((X[1] - X[0]) * i) / n;
    // keep the drawn points just outside the frame, so the clip cuts them cleanly
    const y = Math.max(Y[0] - 2, Math.min(Y[1] + 2, f(x)));
    return `${px(x).toFixed(1)},${py(y).toFixed(1)}`;
  }).join(" ");

  const setRoot = (i: number, r: number) =>
    setRoots((old) => old.map((s, j) => (j === i ? r : s)));

  // the pointer's x, to the nearest half, inside the frame
  function pointerX(e: PointerEvent<SVGRectElement>) {
    const svg = box.current?.ownerSVGElement;
    const ctm = svg?.getScreenCTM();
    if (!ctm) return undefined;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    const x = X[0] + ((p.x - px(X[0])) / (px(X[1]) - px(X[0]))) * (X[1] - X[0]);
    return Math.max(X[0], Math.min(X[1], Math.round(x * 2) / 2));
  }

  // pressing picks up the nearest root, and moving drags it
  function down(e: PointerEvent<SVGRectElement>) {
    const x = pointerX(e);
    if (x === undefined) return;
    let nearest = 0;
    roots.forEach((r, i) => {
      if (Math.abs(r - x) < Math.abs(roots[nearest]! - x)) nearest = i;
    });
    box.current!.setPointerCapture(e.pointerId);
    setHeld(nearest);
    setRoot(nearest, x);
  }
  function move(e: PointerEvent<SVGRectElement>) {
    if (held === null || e.buttons === 0) return;
    const x = pointerX(e);
    if (x !== undefined) setRoot(held, x);
  }

  const form = factored(a, roots);
  const full = expanded(a, roots);
  const ends =
    a > 0
      ? `a = ${format(a)} is positive, so the graph ends high on the right and low on the left.`
      : `a = ${format(a)} is negative, so the graph ends low on the right and high on the left.`;

  return (
    <Interactive
      readout={
        <>
          <div>f(x) = {form}</div>
          <div>= {full}</div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {count(roots)} {ends}
          </div>
        </>
      }
      controls={
        <>
          <Slider
            label={
              <>
                leading coefficient <i>a</i>
              </>
            }
            value={lead}
            onChange={setLead}
            min={0}
            max={LEADING.length - 1}
            show={(i) => format(LEADING[i]!)}
          />
          {roots.map((r, i) => (
            <Slider
              key={i}
              label={
                <>
                  root <i>r</i>
                  <sub>{i + 1}</sub>
                </>
              }
              value={r}
              onChange={(v) => setRoot(i, v)}
              min={X[0]}
              max={X[1]}
              step={0.5}
            />
          ))}
        </>
      }
      caption="Drag the coloured dots along the x-axis to move the roots. The graph meets the x-axis exactly at the roots, and nowhere else."
    >
      <Grid
        x={X}
        y={Y}
        label={`The graph of the cubic f(x) = ${form}, which multiplies out to ${full}. ${count(roots)}`}
      >
        <clipPath id={id}>
          <rect
            x={px(X[0])}
            y={py(Y[1])}
            width={px(X[1]) - px(X[0])}
            height={py(Y[0]) - py(Y[1])}
          />
        </clipPath>
        <polyline
          points={curve}
          fill="none"
          stroke={COLORS.blue}
          strokeWidth={2.75}
          strokeLinejoin="round"
          clipPath={`url(#${id})`}
        />
        {roots.map((r, i) => {
          // roots on top of each other are lifted apart a little so each dot can be seen
          const same = roots.slice(0, i).filter((s) => s === r).length;
          return (
            <g key={i}>
              <circle
                cx={px(r)}
                cy={py(0) - same * 14}
                r={held === i ? 9 : 7}
                fill={ROOT_COLORS[i]}
                stroke="var(--color-fd-card)"
                strokeWidth={2}
              />
            </g>
          );
        })}
        <rect
          ref={box}
          x={px(X[0])}
          y={py(Y[1])}
          width={px(X[1]) - px(X[0])}
          height={py(Y[0]) - py(Y[1])}
          fill="transparent"
          style={{ touchAction: "none", cursor: "ew-resize" }}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={() => setHeld(null)}
          onPointerCancel={() => setHeld(null)}
        />
      </Grid>
    </Interactive>
  );
}
