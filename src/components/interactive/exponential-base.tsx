"use client";

/**
 * ExponentialBase: the graph of y = aˣ for a base a chosen with a slider from 0.2 to 4, which snaps
 * to ½, 1, 2 and 3. The grid runs from −3 to 3 across and 0 to 10 up, with one step up drawn half
 * as long as one step across so that the steep part fits. The points (0, 1) and (1, a) are marked,
 * with dots at x = 2 and 3 as well, and the readout says what each step of 1 to the right does to
 * the height, with the numbers a¹, a² and a³.
 */

import { useId, useState } from "react";
import { COLORS, Interactive, Slider, format, useSmooth } from "./kit";

const X0 = -3;
const X1 = 3;
const Y0 = 0;
const Y1 = 10;
const UNIT = 64;
const UNIT_Y = 32;
const LEFT = 30;
const RIGHT = 26;
const TOP = 26;
const BOTTOM = 26;
const WIDTH = LEFT + (X1 - X0) * UNIT + RIGHT;
const HEIGHT = TOP + (Y1 - Y0) * UNIT_Y + BOTTOM;
const px = (x: number) => LEFT + (x - X0) * UNIT;
const py = (y: number) => TOP + (Y1 - y) * UNIT_Y;

const SNAPS = [0.5, 1, 2, 3];
const snap = (a: number) => SNAPS.find((s) => Math.abs(a - s) < 0.08) ?? a;

// a label with a halo in the card colour, so it stays readable over the grid and the curve
const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

/** what a step of 1 to the right does to the height, in words */
function step(a: number) {
  if (a === 2) return "doubles the height";
  if (a === 3) return "triples the height";
  if (a === 0.5) return "halves the height";
  if (a > 1) return `multiplies the height by ${format(a)}, so it grows`;
  return `multiplies the height by ${format(a)}, so it shrinks`;
}

function sentence(a: number) {
  if (a === 1)
    return "a = 1: every power of 1 is 1, so the graph is the flat line y = 1.";
  const places = a < 1 ? 3 : 2;
  const powers = [1, 2, 3]
    .map(
      (n) =>
        `${format(a)}${["", "¹", "²", "³"][n]} = ${format(a ** n, places)}`,
    )
    .join(", ");
  return `a = ${format(a)}: each step of 1 to the right ${step(a)}: ${powers}.`;
}

export function ExponentialBase({ base = 2 }: { base?: number }) {
  const id = useId();
  const [a, setA] = useState(base);
  const shown = useSmooth(a);
  const points = Array.from({ length: 301 }, (_, i) => {
    const x = X0 + ((X1 - X0) * i) / 300;
    // stop the curve a little above the top, where it is cut off anyway
    const y = Math.min(shown ** x, Y1 + 2);
    return `${px(x).toFixed(1)},${py(y).toFixed(1)}`;
  }).join(" ");

  const xs = Array.from({ length: X1 - X0 + 1 }, (_, i) => X0 + i);
  const ys = Array.from({ length: Y1 - Y0 + 1 }, (_, i) => Y0 + i);
  const dots = [0, 1, 2, 3].filter((n) => shown ** n <= Y1);

  return (
    <Interactive
      readout={
        <>
          <div>{sentence(a)}</div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {a > 1
              ? "The graph rises from left to right, and flattens towards the x-axis on the left without reaching it."
              : a < 1
                ? "The graph falls from left to right, and flattens towards the x-axis on the right without reaching it."
                : "This is the one base whose graph neither rises nor falls."}{" "}
            Every base gives a graph through (0, 1), since a⁰ = 1.
          </div>
        </>
      }
      controls={
        <Slider
          label={
            <>
              base <i>a</i>
            </>
          }
          value={a}
          onChange={(v) => setA(snap(v))}
          min={0.2}
          max={4}
          step={0.05}
        />
      }
      caption="The graph of y = aˣ for the base on the slider, with the points (0, 1) and (1, a) marked. The grid is squashed upwards: one step up is drawn half as long as one step across, so that heights up to 10 fit."
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-lg text-fd-foreground"
        role="img"
        aria-label={`The graph of y = ${format(a)}ˣ for x from −3 to 3, through (0, 1) and (1, ${format(a)}). ${sentence(a)}`}
      >
        <clipPath id={id}>
          <rect
            x={px(X0)}
            y={py(Y1)}
            width={px(X1) - px(X0)}
            height={py(Y0) - py(Y1)}
          />
        </clipPath>
        <g className="text-fd-border" stroke="currentColor" strokeWidth={1}>
          {xs.map((x) => (
            <line
              key={`gx${x}`}
              x1={px(x)}
              x2={px(x)}
              y1={py(Y0)}
              y2={py(Y1)}
            />
          ))}
          {ys.map((y) => (
            <line
              key={`gy${y}`}
              x1={px(X0)}
              x2={px(X1)}
              y1={py(y)}
              y2={py(y)}
            />
          ))}
        </g>
        <g stroke="currentColor" strokeWidth={1.5}>
          <line x1={px(X0)} x2={px(X1) + 10} y1={py(0)} y2={py(0)} />
          <line x1={px(0)} x2={px(0)} y1={py(Y0)} y2={py(Y1) - 10} />
        </g>
        <polygon
          fill="currentColor"
          points={`${px(X1) + 14},${py(0)} ${px(X1) + 6},${py(0) - 4} ${px(X1) + 6},${py(0) + 4}`}
        />
        <polygon
          fill="currentColor"
          points={`${px(0)},${py(Y1) - 14} ${px(0) - 4},${py(Y1) - 6} ${px(0) + 4},${py(Y1) - 6}`}
        />
        <text
          x={px(X1) + 6}
          y={py(0) - 9}
          fontSize={14}
          fontStyle="italic"
          fill="currentColor"
        >
          x
        </text>
        <text
          x={px(0) + 9}
          y={py(Y1) - 6}
          fontSize={14}
          fontStyle="italic"
          fill="currentColor"
        >
          y
        </text>
        <g fontSize={11} className="fill-fd-muted-foreground">
          {xs
            .filter((x) => x !== 0)
            .map((x) => (
              <text key={`tx${x}`} x={px(x)} y={py(0) + 15} textAnchor="middle">
                {format(x)}
              </text>
            ))}
          {ys
            .filter((y) => y !== 0 && y % 2 === 0)
            .map((y) => (
              <text key={`ty${y}`} x={px(0) - 6} y={py(y) + 4} textAnchor="end">
                {format(y)}
              </text>
            ))}
        </g>

        <g clipPath={`url(#${id})`}>
          <polyline
            points={points}
            fill="none"
            stroke={COLORS.blue}
            strokeWidth={3}
            strokeLinejoin="round"
          />
        </g>

        {/* the heights at x = 0, 1, 2, 3, as dashed lines up from the axis */}
        {dots.map((n) => (
          <line
            key={`h${n}`}
            x1={px(n)}
            x2={px(n)}
            y1={py(0)}
            y2={py(shown ** n)}
            stroke={COLORS.orange}
            strokeOpacity={0.6}
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
        ))}
        {dots.map((n) => (
          <circle
            key={`d${n}`}
            cx={px(n)}
            cy={py(shown ** n)}
            r={n <= 1 ? 6 : 4.5}
            fill={n <= 1 ? COLORS.orange : COLORS.blue}
            stroke="var(--color-fd-card)"
            strokeWidth={2}
          />
        ))}
        {/* on the side of the y-axis where the curve is below height 1 */}
        <text
          x={px(0) + (a < 1 ? 10 : -10)}
          y={py(1) - 10}
          textAnchor={a < 1 ? "start" : "end"}
          fontSize={14}
          fontWeight={600}
          fill={COLORS.orange}
          {...halo}
        >
          (0, 1)
        </text>
        {shown <= Y1 && (
          <text
            x={px(1) + 10}
            y={py(shown) + (shown > 1 ? 18 : -22)}
            fontSize={14}
            fontWeight={600}
            fill={COLORS.orange}
            {...halo}
          >
            (1, {format(a)})
          </text>
        )}
      </svg>
    </Interactive>
  );
}
