import type { ReactNode } from "react";
import { Svg } from "../illustrations";

/**
 * Shared pieces for the pictures of the Functions chapter: a grid with axes on which graphs of
 * functions are drawn, a dot, an open dot (for a point a graph leaves out) and an arrow. Each guide
 * keeps its own pictures in a file beside this one and draws them with these.
 *
 * `unit` sets pixels per step of 1 in both directions; pass `unitY` as well when a graph climbs too
 * fast to fit on a square grid (an exponential, say), and say so in the caption.
 */

export const GREEN = "#22c55e";
export const MUTED = "#9ca3af";

export type Range = readonly [number, number];
export type Pt = readonly [number, number];
export type Scale = { px: (x: number) => number; py: (y: number) => number };

export type Curve = {
  points: Pt[];
  color: string;
  /** a light dashed curve, for the one the new curve is compared with */
  faint?: boolean;
};

/** the points (x, f(x)) for x from `from` to `to` */
export function graph(
  f: (x: number) => number,
  from: number,
  to: number,
  n = 240,
) {
  return Array.from({ length: n + 1 }, (_, i) => {
    const x = from + ((to - from) * i) / n;
    return [x, f(x)] as Pt;
  });
}

/** the points (g(y), y) for y from `from` to `to`: a curve lying on its side */
export function sideways(g: (y: number) => number, from: number, to: number) {
  return graph(g, from, to).map(([y, x]) => [x, y] as Pt);
}

// a tick label with a proper minus sign
const name = (n: number) =>
  n < 0 ? `−${Number((-n).toFixed(2))}` : `${Number(n.toFixed(2))}`;

const LEFT = 30;
const RIGHT = 26;
const TOP = 26;
const BOTTOM = 26;

/**
 * A grid for x from x0 to x1 and y from y0 to y1, `unit` pixels to each step of 1 (square unless
 * `unitY` is given). Light lines every `step`, numbers along the axes every `every` (`stepY` and
 * `everyY` for the y-axis), and the curves cut off at the edge.
 */
export function Plot({
  id,
  x: [x0, x1],
  y: [y0, y1],
  unit,
  unitY = unit,
  step = 1,
  every = 1,
  stepY = step,
  everyY = every,
  curves,
  label,
  children,
}: {
  id: string;
  x: Range;
  y: Range;
  unit: number;
  /** pixels per step of 1 upwards, when it differs from across */
  unitY?: number;
  step?: number;
  every?: number;
  /** grid lines and numbers up the y-axis, when they differ from across */
  stepY?: number;
  everyY?: number;
  curves: Curve[];
  label: string;
  children?: (s: Scale) => ReactNode;
}) {
  const width = LEFT + (x1 - x0) * unit + RIGHT;
  const height = TOP + (y1 - y0) * unitY + BOTTOM;
  const px = (x: number) => LEFT + (x - x0) * unit;
  const py = (y: number) => TOP + (y1 - y) * unitY;
  const marks = (lo: number, hi: number, gap: number) => {
    const out: number[] = [];
    for (let k = Math.ceil(lo / gap - 1e-9); k * gap <= hi + 1e-9; k++)
      out.push(Number((k * gap).toFixed(6)));
    return out;
  };
  const axisX = x0 <= 0 && 0 <= x1 ? 0 : x0;
  const axisY = y0 <= 0 && 0 <= y1 ? 0 : y0;
  const clip = `${id}-clip`;

  return (
    <Svg width={width} height={height} label={label}>
      <defs>
        <clipPath id={clip}>
          <rect
            x={px(x0)}
            y={py(y1)}
            width={(x1 - x0) * unit}
            height={(y1 - y0) * unitY}
          />
        </clipPath>
      </defs>
      <g className="text-fd-border" stroke="currentColor" strokeWidth={1}>
        {marks(x0, x1, step).map((x) => (
          <line key={`v${x}`} x1={px(x)} x2={px(x)} y1={py(y0)} y2={py(y1)} />
        ))}
        {marks(y0, y1, stepY).map((y) => (
          <line key={`h${y}`} x1={px(x0)} x2={px(x1)} y1={py(y)} y2={py(y)} />
        ))}
      </g>

      {/* the axes, with arrowheads at the positive ends */}
      <g stroke="currentColor" strokeWidth={1.5}>
        <line x1={px(x0)} x2={px(x1) + 10} y1={py(axisY)} y2={py(axisY)} />
        <line x1={px(axisX)} x2={px(axisX)} y1={py(y0)} y2={py(y1) - 10} />
      </g>
      <polygon
        fill="currentColor"
        points={`${px(x1) + 14},${py(axisY)} ${px(x1) + 6},${py(axisY) - 4} ${px(x1) + 6},${py(axisY) + 4}`}
      />
      <polygon
        fill="currentColor"
        points={`${px(axisX)},${py(y1) - 14} ${px(axisX) - 4},${py(y1) - 6} ${px(axisX) + 4},${py(y1) - 6}`}
      />
      <text
        x={px(x1) + 6}
        y={py(axisY) - 9}
        fontSize={14}
        fontStyle="italic"
        fill="currentColor"
      >
        x
      </text>
      <text
        x={px(axisX) + 9}
        y={py(y1) - 6}
        fontSize={14}
        fontStyle="italic"
        fill="currentColor"
      >
        y
      </text>

      <g clipPath={`url(#${clip})`}>
        {curves.map((c, i) => (
          <polyline
            key={i}
            points={c.points
              .map(([x, y]) => `${px(x).toFixed(1)},${py(y).toFixed(1)}`)
              .join(" ")}
            fill="none"
            stroke={c.color}
            strokeWidth={c.faint ? 2 : 3}
            strokeOpacity={c.faint ? 0.7 : 1}
            strokeDasharray={c.faint ? "6 5" : undefined}
            strokeLinejoin="round"
          />
        ))}
      </g>

      {/* the numbers go over the curves, with a halo in the card colour so a curve passing
          behind them doesn't hide them */}
      <g
        fontSize={11}
        className="fill-fd-muted-foreground"
        stroke="var(--color-fd-card)"
        strokeWidth={3}
        paintOrder="stroke"
      >
        {marks(x0, x1, every)
          .filter((x) => x !== axisX)
          .map((x) => (
            <text
              key={`tx${x}`}
              x={px(x)}
              y={py(axisY) + 15}
              textAnchor="middle"
            >
              {name(x)}
            </text>
          ))}
        {marks(y0, y1, everyY)
          .filter((y) => y !== axisY)
          .map((y) => (
            <text
              key={`ty${y}`}
              x={px(axisX) - 6}
              y={py(y) + 4}
              textAnchor="end"
            >
              {name(y)}
            </text>
          ))}
      </g>

      {children?.({ px, py })}
    </Svg>
  );
}

/** a dot in the card's colour ring, at a point given in pixels */
export function Spot({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <circle
      cx={x}
      cy={y}
      r={5}
      fill={color}
      stroke="var(--color-fd-card)"
      strokeWidth={2}
    />
  );
}

/** an arrow in pixels from (x1, y1) to (x2, y2), its head at the second point */
export function Arrow({
  x1,
  y1,
  x2,
  y2,
  color,
  dashed = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  dashed?: boolean;
}) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const bx = x2 - ux * 11;
  const by = y2 - uy * 11;
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2 - ux * 8}
        y2={y2 - uy * 8}
        stroke={color}
        strokeWidth={2.5}
        strokeDasharray={dashed ? "6 4" : undefined}
      />
      <polygon
        points={`${x2},${y2} ${bx - uy * 5},${by + ux * 5} ${bx + uy * 5},${by - ux * 5}`}
        fill={color}
      />
    </g>
  );
}

/** a hollow dot at a point given in pixels: the graph comes up to it but leaves it out */
export function OpenSpot({
  x,
  y,
  color,
}: {
  x: number;
  y: number;
  color: string;
}) {
  return (
    <circle
      cx={x}
      cy={y}
      r={5}
      fill="var(--color-fd-card)"
      stroke={color}
      strokeWidth={2.5}
    />
  );
}
