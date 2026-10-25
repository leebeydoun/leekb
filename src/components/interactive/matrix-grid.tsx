"use client";

/**
 * MatrixGrid: a 2 × 2 matrix A, set entry by entry with four sliders laid out like the matrix, moves
 * the plane by X ↦ AX. The square grid is drawn faint, and its image (the lines through whole-number
 * steps of the two columns) is drawn over it in blue. The unit square and a small "F" inside it go to
 * a parallelogram and a slanted F, with arrows for the two columns A¹ and A², the images of (1, 0)
 * and (0, 1). With `showArea`, the parallelogram is shaded and the readout gives its signed area
 * ad − bc, saying when the picture is flipped (a negative determinant) or squashed flat (zero).
 */

import { useId, useState } from "react";
import { Grid, gridScale } from "./grid";
import { Button, COLORS, Interactive, Slider, format, useSmooth } from "./kit";
import { FLAG, polygonPoints, type Vec } from "./moving-shape";

const X: [number, number] = [-4, 4];
const Y: [number, number] = [-4, 4];
// how many image grid lines to draw on each side of the origin, and how far each one runs
const LINES = 8;
const REACH = 16;

// the F, shrunk to sit inside the unit square
const F: Vec[] = FLAG.map((p) => ({
  x: 0.14 + 0.8 * p.x,
  y: 0.02 + 0.8 * p.y,
}));
const SQUARE: Vec[] = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
];

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

type Entries = { a: number; b: number; c: number; d: number };

const PRESETS: { label: string; m: Entries }[] = [
  { label: "stretch", m: { a: 2, b: 0, c: 0, d: 1 } },
  { label: "shear", m: { a: 1, b: 1, c: 0, d: 1 } },
  { label: "quarter turn", m: { a: 0, b: -1, c: 1, d: 0 } },
  { label: "flip", m: { a: 1, b: 0, c: 0, d: -1 } },
  { label: "flatten", m: { a: 1, b: 2, c: 0.5, d: 1 } },
];

/** a number in brackets when it is negative, for writing it inside a product */
const term = (n: number) => (n < 0 ? `(${format(n)})` : format(n));

/** a 2 × 2 matrix of numbers between two tall brackets */
function MatrixView({ m }: { m: Entries }) {
  return (
    <span className="mx-1 inline-flex items-stretch align-middle">
      <span className="w-1.5 rounded-l-sm border-y-2 border-l-2 border-current" />
      <span className="grid grid-cols-2 gap-x-3 px-1.5 py-0.5 text-end">
        {[m.a, m.b, m.c, m.d].map((n, i) => (
          <span key={i} className="min-w-[3ch]">
            {format(n)}
          </span>
        ))}
      </span>
      <span className="w-1.5 rounded-r-sm border-y-2 border-r-2 border-current" />
    </span>
  );
}

/** an arrow in pixels from (x1, y1) to (x2, y2), or nothing when it has no length */
function ColumnArrow({
  from,
  to,
  color,
}: {
  from: Vec;
  to: Vec;
  color: string;
}) {
  const len = Math.hypot(to.x - from.x, to.y - from.y);
  if (len < 6) return null;
  const ux = (to.x - from.x) / len;
  const uy = (to.y - from.y) / len;
  const bx = to.x - ux * 12;
  const by = to.y - uy * 12;
  return (
    <g>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x - ux * 9}
        y2={to.y - uy * 9}
        stroke={color}
        strokeWidth={3}
      />
      <polygon
        points={`${to.x},${to.y} ${bx - uy * 6},${by + ux * 6} ${bx + uy * 6},${by - ux * 6}`}
        fill={color}
      />
    </g>
  );
}

export function MatrixGrid({
  a: initialA = 2,
  b: initialB = -1,
  c: initialC = 1,
  d: initialD = 1,
  showArea = false,
  caption,
}: {
  /** the matrix shown first, with first column (a, c) and second column (b, d) */
  a?: number;
  b?: number;
  c?: number;
  d?: number;
  /** shade the image of the unit square and give its signed area */
  showArea?: boolean;
  caption?: string;
}) {
  const id = useId();
  const [m, setM] = useState<Entries>({
    a: initialA,
    b: initialB,
    c: initialC,
    d: initialD,
  });
  const set = (key: keyof Entries) => (value: number) =>
    setM((old) => ({ ...old, [key]: value }));

  // the picture glides to each new matrix
  const sa = useSmooth(m.a);
  const sb = useSmooth(m.b);
  const sc = useSmooth(m.c);
  const sd = useSmooth(m.d);
  const move = (p: Vec): Vec => ({
    x: sa * p.x + sb * p.y,
    y: sc * p.x + sd * p.y,
  });

  const { px: sx, py: sy } = gridScale(X, Y);
  const px = (p: Vec): Vec => ({ x: sx(p.x), y: sy(p.y) });
  const o = px({ x: 0, y: 0 });

  const det = m.a * m.d - m.b * m.c;
  const col1 = `(${format(m.a)}, ${format(m.c)})`;
  const col2 = `(${format(m.b)}, ${format(m.d)})`;

  // the image of the line x = k is the points kA¹ + tA², and of y = k the points tA¹ + kA²
  const imageLines: [Vec, Vec][] = [];
  for (let k = -LINES; k <= LINES; k++) {
    imageLines.push([move({ x: k, y: -REACH }), move({ x: k, y: REACH })]);
    imageLines.push([move({ x: -REACH, y: k }), move({ x: REACH, y: k })]);
  }

  const A1 = move({ x: 1, y: 0 });
  const A2 = move({ x: 0, y: 1 });
  // each column's name sits a little beyond its arrowhead
  const nameAt = (p: Vec) => {
    const l = Math.hypot(p.x, p.y);
    const q = px(p);
    if (l < 0.05) return { x: q.x + 14, y: q.y - 14 };
    return { x: q.x + (16 * p.x) / l, y: q.y - (16 * p.y) / l + 5 };
  };
  const n1 = nameAt(A1);
  const n2 = nameAt(A2);

  const flat = Math.abs(det) < 1e-9;
  const working = `ad − bc = ${term(m.a)} · ${term(m.d)} − ${term(m.b)} · ${term(m.c)} = ${format(det)}`;
  const areaSentence = flat
    ? "The square is squashed onto a line, so the area is 0."
    : det < 0
      ? `The F comes out flipped, so the sign is negative: the area is ${format(-det)}.`
      : `The F is not flipped, so the sign is positive: the area is ${format(det)}.`;

  const matrixText = `the matrix with rows (${format(m.a)}, ${format(m.b)}) and (${format(m.c)}, ${format(m.d)})`;

  return (
    <Interactive
      caption={
        caption ??
        (showArea
          ? "Set the four entries, or pick a preset. The faint dashed square goes to the shaded parallelogram on the two columns, and its signed area is the determinant ad − bc."
          : "Set the four entries, or pick a preset. The faint square grid goes to the blue grid, and the dashed F in the unit square goes to the solid F, with the columns A¹ and A² as the images of (1, 0) and (0, 1).")
      }
      readout={
        <>
          <div>
            A =
            <MatrixView m={m} />
          </div>
          <div className="mt-1">
            E¹ = (1, 0) goes to A¹ = {col1}, and E² = (0, 1) goes to A² = {col2}
            .
          </div>
          {showArea ? (
            <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
              Signed area of the shaded parallelogram: {working}. {areaSentence}
            </div>
          ) : (
            <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
              Each point (x, y) goes to xA¹ + yA²: x steps of the first column,
              then y steps of the second.
            </div>
          )}
        </>
      }
      controls={
        <>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <Slider
              label={<i>a</i>}
              value={m.a}
              onChange={set("a")}
              min={-2}
              max={2}
              step={0.5}
            />
            <Slider
              label={<i>b</i>}
              value={m.b}
              onChange={set("b")}
              min={-2}
              max={2}
              step={0.5}
            />
            <Slider
              label={<i>c</i>}
              value={m.c}
              onChange={set("c")}
              min={-2}
              max={2}
              step={0.5}
            />
            <Slider
              label={<i>d</i>}
              value={m.d}
              onChange={set("d")}
              min={-2}
              max={2}
              step={0.5}
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {PRESETS.map((preset) => (
              <Button
                key={preset.label}
                primary={
                  preset.m.a === m.a &&
                  preset.m.b === m.b &&
                  preset.m.c === m.c &&
                  preset.m.d === m.d
                }
                onClick={() => setM(preset.m)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </>
      }
    >
      <Grid
        x={X}
        y={Y}
        label={`The plane moved by ${matrixText}. The unit square goes to the parallelogram with corners O, A¹ = ${col1}, A¹ + A² and A² = ${col2}, and the F inside the square goes to a slanted F inside the parallelogram.${showArea ? ` Its signed area is ${format(det)}.` : ""}`}
      >
        <clipPath id={id}>
          <rect
            x={sx(X[0])}
            y={sy(Y[1])}
            width={sx(X[1]) - sx(X[0])}
            height={sy(Y[0]) - sy(Y[1])}
          />
        </clipPath>
        <g clipPath={`url(#${id})`}>
          {/* the image of the square grid */}
          <g stroke={COLORS.blue} strokeOpacity={0.35} strokeWidth={1.25}>
            {imageLines.map(([p, q], i) => {
              const P = px(p);
              const Q = px(q);
              return <line key={i} x1={P.x} y1={P.y} x2={Q.x} y2={Q.y} />;
            })}
          </g>

          {/* the unit square and the F where they start */}
          <polygon
            points={polygonPoints(SQUARE, px)}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.55}
            strokeWidth={1.75}
            strokeDasharray="5 4"
          />
          <polygon
            points={polygonPoints(F, px)}
            fill="currentColor"
            fillOpacity={0.06}
            stroke="currentColor"
            strokeOpacity={0.5}
            strokeWidth={1.5}
            strokeDasharray="4 3"
            strokeLinejoin="round"
          />

          {/* where they go */}
          <polygon
            points={polygonPoints(SQUARE.map(move), px)}
            fill={COLORS.orange}
            fillOpacity={showArea ? 0.25 : 0}
            stroke={COLORS.orange}
            strokeWidth={2.25}
            strokeLinejoin="round"
          />
          <polygon
            points={polygonPoints(F.map(move), px)}
            fill={COLORS.blue}
            fillOpacity={0.35}
            stroke={COLORS.blue}
            strokeWidth={2}
            strokeLinejoin="round"
          />

          {/* the two columns */}
          <ColumnArrow from={o} to={px(A1)} color={COLORS.blue} />
          <ColumnArrow from={o} to={px(A2)} color={COLORS.purple} />
        </g>
        <circle cx={o.x} cy={o.y} r={4} fill="currentColor" />
        <text
          x={n1.x}
          y={n1.y}
          textAnchor="middle"
          fontSize={16}
          fontStyle="italic"
          fill={COLORS.blue}
          {...halo}
        >
          A¹
        </text>
        <text
          x={n2.x}
          y={n2.y + (Math.hypot(A1.x - A2.x, A1.y - A2.y) < 0.3 ? 18 : 0)}
          textAnchor="middle"
          fontSize={16}
          fontStyle="italic"
          fill={COLORS.purple}
          {...halo}
        >
          A²
        </text>
      </Grid>
    </Interactive>
  );
}
