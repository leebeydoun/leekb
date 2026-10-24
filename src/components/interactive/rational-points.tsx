"use client";

/**
 * Lines through the point (−1, 0) of the unit circle. A slider steps through fractions t between 0
 * and 1; the line through (−1, 0) with slope t meets the circle at one more point, whose
 * coordinates are fractions too. The readout writes both over their common denominator c and checks
 * that the tops a and b make a Pythagorean triple: a² + b² = c².
 */

import { useState } from "react";
import { clipLine, Grid, gridScale } from "./grid";
import { COLORS, Interactive, Slider } from "./kit";

// the slopes on offer, in increasing order, each as top and bottom of a fraction
const SLOPES: [number, number][] = [
  [1, 5],
  [1, 4],
  [1, 3],
  [2, 5],
  [3, 7],
  [1, 2],
  [3, 5],
  [2, 3],
  [5, 7],
  [3, 4],
  [4, 5],
];

// wider on the right than the left, so the second point's coordinates fit beside the circle
const X: [number, number] = [-1.5, 2];
const Y: [number, number] = [-1.25, 1.5];

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/**
 * The second point for t = m/n is ((n² − m²)/(n² + m²), 2mn/(n² + m²)). Cancelling what the three
 * numbers have in common gives the point's coordinates in lowest form, a/c and b/c.
 */
function triple(m: number, n: number) {
  const a = n * n - m * m;
  const b = 2 * m * n;
  const c = n * n + m * m;
  const g = gcd(gcd(a, b), c);
  return { a: a / g, b: b / g, c: c / g };
}

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

export function RationalPoints({ caption }: { caption?: string }) {
  const [index, setIndex] = useState(5);
  const [m, n] = SLOPES[index]!;
  const t = m / n;
  const { a, b, c } = triple(m, n);
  const { px, py } = gridScale(X, Y);

  // the line y = t(x + 1), which is tx − y = −t
  const ends = clipLine(t, -1, -t, X, Y);
  const start = { x: px(-1), y: py(0) };
  const point = { x: px(a / c), y: py(b / c) };
  const foot = { x: px(a / c), y: py(0) };
  // the coordinates sit just outside the circle on the right, below the line, which climbs away
  const name = { x: Math.max(point.x + 12, px(1) + 8), y: point.y + 22 };

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>
            The line with slope {m}/{n} meets the circle again at ({a}/{c}, {b}/
            {c})
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            Over the common denominator {c}: {a}² + {b}² = {a * a} + {b * b} ={" "}
            {c * c} = {c}², so {a}, {b}, {c} is a Pythagorean triple.
          </div>
        </>
      }
      controls={
        <Slider
          label={
            <>
              slope <i>t</i>
            </>
          }
          value={index}
          onChange={setIndex}
          min={0}
          max={SLOPES.length - 1}
          show={(i) => `${SLOPES[i]![0]}/${SLOPES[i]![1]}`}
        />
      }
    >
      <Grid
        x={X}
        y={Y}
        label={`The unit circle and the line through (−1, 0) with slope ${m}/${n}, which meets the circle again at (${a}/${c}, ${b}/${c}).`}
      >
        {/* the unit circle, centred at the origin */}
        <circle
          cx={px(0)}
          cy={py(0)}
          r={px(1) - px(0)}
          fill="none"
          stroke={COLORS.blue}
          strokeWidth={2.5}
        />

        {/* the right triangle under the point: legs a/c and b/c, hypotenuse the radius 1 */}
        <polygon
          points={`${px(0)},${py(0)} ${foot.x},${foot.y} ${point.x},${point.y}`}
          fill={COLORS.green}
          fillOpacity={0.15}
          stroke={COLORS.green}
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {ends && (
          <line
            x1={px(ends[0][0])}
            y1={py(ends[0][1])}
            x2={px(ends[1][0])}
            y2={py(ends[1][1])}
            stroke={COLORS.orange}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        )}

        <circle cx={start.x} cy={start.y} r={5} fill="currentColor" />
        <text
          x={start.x - 8}
          y={start.y - 12}
          textAnchor="end"
          fontSize={15}
          fill="currentColor"
          {...halo}
        >
          (−1, 0)
        </text>

        <circle cx={point.x} cy={point.y} r={6} fill={COLORS.purple} />
        <text
          x={name.x}
          y={name.y}
          textAnchor="start"
          fontSize={15}
          fontWeight={600}
          fill={COLORS.purple}
          {...halo}
        >
          ({a}/{c}, {b}/{c})
        </text>
      </Grid>
    </Interactive>
  );
}
