"use client";

/**
 * A fixed circle and a family of parallel lines, all with direction A = (4, −3). A slider moves
 * the line by choosing the point P = (0, b) it passes through. Putting P + tA into the circle's
 * equation gives a quadratic in t, and the readout shows that quadratic, the sign of its
 * discriminant and what the sign means: two meeting points, one (a tangent), or none.
 */

import { useState } from "react";
import { clipLine, Grid, gridScale } from "./grid";
import { COLORS, format, Interactive, Slider, useSmooth } from "./kit";

const X: [number, number] = [-5, 7];
const Y: [number, number] = [-7, 5];

// the circle with centre C = (1, −1) and radius 5, and the direction of every line
const C = { x: 1, y: -1 };
const R = 5;
const A = { x: 4, y: -3 };
const LENGTH_SQUARED = A.x * A.x + A.y * A.y;

/** the quadratic |A|²t² + 2kt + m = 0 for the line through (0, b), and its discriminant */
function quadratic(b: number) {
  const k = A.x * (0 - C.x) + A.y * (b - C.y);
  const m = (0 - C.x) ** 2 + (b - C.y) ** 2 - R * R;
  const discriminant = 4 * k * k - 4 * LENGTH_SQUARED * m;
  return { k, m, discriminant };
}

/** the values of t where the line through (0, b) meets the circle, smallest first */
function meetings(b: number) {
  const { k, discriminant } = quadratic(b);
  if (Math.abs(discriminant) < 1e-9) return [-k / LENGTH_SQUARED];
  if (discriminant < 0) return [];
  const root = Math.sqrt(discriminant);
  return [
    (-2 * k - root) / (2 * LENGTH_SQUARED),
    (-2 * k + root) / (2 * LENGTH_SQUARED),
  ];
}

// one term of the quadratic, e.g. " − 26t" or " + 15", or nothing when it is 0
function term(coefficient: number, letter = "") {
  if (Math.abs(coefficient) < 1e-9) return "";
  const sign = coefficient < 0 ? "−" : "+";
  return ` ${sign} ${format(Math.abs(coefficient), 4)}${letter}`;
}

const at = (b: number, t: number) => ({ x: A.x * t, y: b + A.y * t });

// "=" when the number is shown exactly, "≈" when it has been rounded
const equals = (n: number) =>
  Math.abs(n - Number(n.toFixed(2))) < 1e-9 ? "=" : "≈";

export function LineCircle({
  b: start = 2,
  caption = "Slide the line across the circle. While it cuts the circle the discriminant is positive, at the two tangent positions it is 0, and once the line is clear of the circle it is negative.",
}: {
  /** the line starts through the point (0, b) */
  b?: number;
  caption?: string;
}) {
  const [b, setB] = useState(start);
  const shown = useSmooth(b);
  const { px, py, unit } = gridScale(X, Y);

  const { k, m, discriminant } = quadratic(b);
  const ts = meetings(b);
  const drawn = meetings(shown).map((t) => at(shown, t));
  // the line through (0, b) with direction (4, −3) has the equation 3x + 4y = 4b
  const ends = clipLine(3, 4, 4 * shown, X, Y);
  const pInView = shown >= Y[0] && shown <= Y[1];

  const equation = `${format(LENGTH_SQUARED)}t²${term(2 * k, "t")}${term(m)} = 0`;
  const sign =
    Math.abs(discriminant) < 1e-9 ? "= 0" : discriminant > 0 ? "> 0" : "< 0";

  let verdict: string;
  if (ts.length === 2) {
    const [p, q] = ts.map((t) => at(b, t));
    verdict = `Two meeting points: t ${equals(ts[0]!)} ${format(ts[0]!)} gives (${format(p!.x)}, ${format(p!.y)}) and t ${equals(ts[1]!)} ${format(ts[1]!)} gives (${format(q!.x)}, ${format(q!.y)})`;
  } else if (ts.length === 1) {
    const p = at(b, ts[0]!);
    verdict = `Touches at one point: t = ${format(ts[0]!)} gives (${format(p.x)}, ${format(p.y)}), so the line is tangent there`;
  } else {
    verdict =
      "Misses: no value of t works, so the line and the circle never meet";
  }

  const halo = {
    stroke: "var(--color-fd-card)",
    strokeWidth: 4,
    paintOrder: "stroke" as const,
  };

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>
            {equation}, discriminant {format(discriminant, 4)} {sign}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {verdict}
          </div>
        </>
      }
      controls={
        <Slider
          label={
            <>
              line through P = (0, <i>b</i>)
            </>
          }
          value={b}
          onChange={setB}
          min={-9}
          max={8}
          step={0.25}
        />
      }
    >
      <Grid
        x={X}
        y={Y}
        label={`The circle with centre (1, −1) and radius 5, and the line through (0, ${format(b)}) with direction (4, −3). ${verdict}.`}
      >
        <circle
          cx={px(C.x)}
          cy={py(C.y)}
          r={R * unit}
          fill={COLORS.blue}
          fillOpacity={0.06}
          stroke={COLORS.blue}
          strokeWidth={2.5}
        />
        <circle cx={px(C.x)} cy={py(C.y)} r={4} fill={COLORS.blue} />
        <text
          x={px(C.x) + 8}
          y={py(C.y) + 18}
          fontSize={14}
          fontWeight={700}
          fill={COLORS.blue}
          {...halo}
        >
          C
        </text>

        {ends && (
          <line
            x1={px(ends[0][0])}
            y1={py(ends[0][1])}
            x2={px(ends[1][0])}
            y2={py(ends[1][1])}
            stroke={COLORS.orange}
            strokeWidth={2.5}
          />
        )}

        {pInView && (
          <>
            <circle cx={px(0)} cy={py(shown)} r={4} fill={COLORS.orange} />
            <text
              x={px(0) + 8}
              y={py(shown) - 8}
              fontSize={14}
              fontWeight={700}
              fill={COLORS.orange}
              {...halo}
            >
              P
            </text>
          </>
        )}

        {drawn.map((p, i) => (
          <circle
            key={i}
            cx={px(p.x)}
            cy={py(p.y)}
            r={6}
            fill={COLORS.green}
            stroke="var(--color-fd-card)"
            strokeWidth={2}
          />
        ))}
      </Grid>
    </Interactive>
  );
}
