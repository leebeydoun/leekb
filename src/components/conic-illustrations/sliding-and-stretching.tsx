import type { ReactNode } from "react";
import { Figure } from "../figure";
import { BLUE, ORANGE, PURPLE, Svg, Words } from "../illustrations";

/**
 * Pictures for the guides Moving graphs and Turning graphs. Each one draws a starting curve faint and
 * dashed and its moved copy bold, on squared axes with the same scale across and up, and marks a
 * point or two with the place it moves to: the parabola y = x² slid 3 to the right, the unit circle
 * stretched into an ellipse in two steps, the parabola flipped in the line y = x, and the parabola
 * turned a quarter turn.
 */

type Range = readonly [number, number];
type Scale = { px: (x: number) => number; py: (y: number) => number };
type Pt = readonly [number, number];

type Curve = {
  /** the curve's points, in order, in units */
  points: Pt[];
  color: string;
  /** a light dashed curve, for the starting curve the moved one is compared with */
  faint?: boolean;
};

const PAD = 30;

/** the points (f(t), g(t)) for t from t0 to t1 */
function sample(
  f: (t: number) => Pt,
  t0: number,
  t1: number,
  steps = 240,
): Pt[] {
  return Array.from({ length: steps + 1 }, (_, i) =>
    f(t0 + ((t1 - t0) * i) / steps),
  );
}

/**
 * Squared axes for x from x0 to x1 and y from y0 to y1, one scale for both, with faint lines at
 * whole numbers and small numbers along the axes. Curves are cut off at the edge of the box.
 */
function Plot({
  x: [x0, x1],
  y: [y0, y1],
  unit,
  curves,
  label,
  extra,
  id,
}: {
  x: Range;
  y: Range;
  unit: number;
  curves: Curve[];
  label: string;
  extra?: (s: Scale) => ReactNode;
  /** a name for the clipping box, different for each figure on a page */
  id: string;
}) {
  const width = PAD * 2 + (x1 - x0) * unit;
  const height = PAD * 2 + (y1 - y0) * unit;
  const px = (x: number) => PAD + (x - x0) * unit;
  const py = (y: number) => PAD + (y1 - y) * unit;
  const whole = (lo: number, hi: number) =>
    Array.from(
      { length: Math.floor(hi) - Math.ceil(lo) + 1 },
      (_, i) => Math.ceil(lo) + i,
    );
  const xs = whole(x0, x1);
  const ys = whole(y0, y1);
  const minus = (n: number) => (n < 0 ? `−${-n}` : String(n));

  return (
    <Svg width={width} height={height} label={label}>
      <defs>
        <clipPath id={id}>
          <rect
            x={px(x0)}
            y={py(y1)}
            width={(x1 - x0) * unit}
            height={(y1 - y0) * unit}
          />
        </clipPath>
      </defs>
      <g className="text-fd-border" stroke="currentColor" strokeWidth={1}>
        {xs.map((x) => (
          <line key={`v${x}`} x1={px(x)} x2={px(x)} y1={py(y0)} y2={py(y1)} />
        ))}
        {ys.map((y) => (
          <line key={`h${y}`} x1={px(x0)} x2={px(x1)} y1={py(y)} y2={py(y)} />
        ))}
      </g>

      {/* the axes, with arrowheads at the positive ends */}
      <g stroke="currentColor" strokeWidth={1.5}>
        <line x1={px(x0)} x2={px(x1) + 12} y1={py(0)} y2={py(0)} />
        <line x1={px(0)} x2={px(0)} y1={py(y0)} y2={py(y1) - 12} />
      </g>
      <polygon
        fill="currentColor"
        points={`${px(x1) + 16},${py(0)} ${px(x1) + 8},${py(0) - 4} ${px(x1) + 8},${py(0) + 4}`}
      />
      <polygon
        fill="currentColor"
        points={`${px(0)},${py(y1) - 16} ${px(0) - 4},${py(y1) - 8} ${px(0) + 4},${py(y1) - 8}`}
      />
      <text
        x={px(x1) + 8}
        y={py(0) - 9}
        fontSize={14}
        fontStyle="italic"
        fill="currentColor"
      >
        x
      </text>
      <text
        x={px(0) + 9}
        y={py(y1) - 8}
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
              {minus(x)}
            </text>
          ))}
        {ys
          .filter((y) => y !== 0)
          .map((y) => (
            <text key={`ty${y}`} x={px(0) - 6} y={py(y) + 4} textAnchor="end">
              {minus(y)}
            </text>
          ))}
      </g>

      <g clipPath={`url(#${id})`}>
        {curves.map((c, i) => (
          <polyline
            key={i}
            points={c.points
              .map(([x, y]) => `${px(x).toFixed(1)},${py(y).toFixed(1)}`)
              .join(" ")}
            fill="none"
            stroke={c.color}
            strokeWidth={c.faint ? 2 : 3}
            strokeOpacity={c.faint ? 0.55 : 1}
            strokeDasharray={c.faint ? "6 5" : undefined}
            strokeLinejoin="round"
          />
        ))}
      </g>

      {extra?.({ px, py })}
    </Svg>
  );
}

/** a dot in the given colour, ringed in the card colour so it stands out from the curve */
function Spot({ at: [x, y], color }: { at: Pt; color: string }) {
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

/** an arrow in pixels from one point to another, stopping short of the dot at its end */
function Arrow({
  from: [x1, y1],
  to: [x2, y2],
  color,
}: {
  from: Pt;
  to: Pt;
  color: string;
}) {
  const length = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / length;
  const uy = (y2 - y1) / length;
  // the tip sits just outside the dot at the end; the shaft stops where the head begins
  const tx = x2 - ux * 7;
  const ty = y2 - uy * 7;
  const bx = tx - ux * 10;
  const by = ty - uy * 10;
  return (
    <g>
      <line
        x1={x1 + ux * 7}
        y1={y1 + uy * 7}
        x2={bx}
        y2={by}
        stroke={color}
        strokeWidth={2}
        strokeDasharray="5 4"
      />
      <polygon
        points={`${tx},${ty} ${bx - uy * 5},${by + ux * 5} ${bx + uy * 5},${by - ux * 5}`}
        fill={color}
      />
    </g>
  );
}

const parabola = sample((t) => [t, t * t], -2.6, 2.6);

/**
 * The parabola y = x² faint, and its copy y = (x − 3)² bold, three units to the right. Three points
 * of the first, at x = 0, 1 and 2, each have an arrow 3 to the right to the matching point of the
 * second.
 */
export function SlideRight({ caption }: { caption?: string }) {
  const moved = parabola.map(([x, y]) => [x + 3, y] as Pt);
  const marked: Pt[] = [
    [0, 0],
    [1, 1],
    [2, 4],
  ];
  return (
    <Figure caption={caption}>
      <Plot
        id="slide-right"
        x={[-3, 6]}
        y={[-1, 5.5]}
        unit={44}
        curves={[
          { points: parabola, color: BLUE, faint: true },
          { points: moved, color: BLUE },
        ]}
        label="The parabola y = x², drawn faint, and the parabola y = (x − 3)², drawn bold, 3 units to its right. Arrows carry the points (0, 0), (1, 1) and (2, 4) of the first 3 to the right, to (3, 0), (4, 1) and (5, 4) on the second."
        extra={({ px, py }) => (
          <>
            {marked.map(([x, y]) => (
              <g key={x}>
                <Arrow
                  from={[px(x), py(y)]}
                  to={[px(x + 3), py(y)]}
                  color={ORANGE}
                />
                <Spot at={[px(x), py(y)]} color={ORANGE} />
                <Spot at={[px(x + 3), py(y)]} color={ORANGE} />
              </g>
            ))}
            <Words x={px(-1)} y={py(4.55)} color={BLUE} size={14}>
              y = x²
            </Words>
            <Words x={px(3.6)} y={py(4.55)} color={BLUE} size={14}>
              y = (x − 3)²
            </Words>
          </>
        )}
      />
    </Figure>
  );
}

const circle = sample((t) => [Math.cos(t), Math.sin(t)], 0, 2 * Math.PI);

/**
 * The unit circle faint, the curve after stretching by 3 away from the y-axis dashed in purple, and
 * the ellipse after stretching that by 2 away from the x-axis bold. The point (0.6, 0.8) moves
 * across to (1.8, 0.8) and then up to (1.8, 1.6).
 */
export function StretchCircle({ caption }: { caption?: string }) {
  const wide = circle.map(([x, y]) => [3 * x, y] as Pt);
  const ellipse = circle.map(([x, y]) => [3 * x, 2 * y] as Pt);
  const p: Pt = [0.6, 0.8];
  const q: Pt = [1.8, 0.8];
  const r: Pt = [1.8, 1.6];
  return (
    <Figure caption={caption}>
      <Plot
        id="stretch-circle"
        x={[-3.6, 3.6]}
        y={[-2.5, 2.6]}
        unit={58}
        curves={[
          { points: circle, color: BLUE, faint: true },
          { points: wide, color: PURPLE, faint: true },
          { points: ellipse, color: BLUE },
        ]}
        label="The unit circle, drawn faint. Stretching it by 3 away from the y-axis gives a dashed purple oval reaching 3 across and 1 up. Stretching that by 2 away from the x-axis gives the bold ellipse x²/9 + y²/4 = 1, reaching 3 across and 2 up. The point (0.6, 0.8) of the circle moves across to (1.8, 0.8) and then up to (1.8, 1.6)."
        extra={({ px, py }) => (
          <>
            <Arrow
              from={[px(p[0]), py(p[1])]}
              to={[px(q[0]), py(q[1])]}
              color={ORANGE}
            />
            <Arrow
              from={[px(q[0]), py(q[1])]}
              to={[px(r[0]), py(r[1])]}
              color={ORANGE}
            />
            <Spot at={[px(p[0]), py(p[1])]} color={ORANGE} />
            <Spot at={[px(q[0]), py(q[1])]} color={PURPLE} />
            <Spot at={[px(r[0]), py(r[1])]} color={ORANGE} />
            <Words
              x={px(r[0]) + 10}
              y={py(r[1]) - 10}
              anchor="start"
              color={ORANGE}
              size={13}
            >
              (1.8, 1.6)
            </Words>
            <Words
              x={px(2.2)}
              y={py(2.25)}
              anchor="start"
              color={BLUE}
              size={14}
            >
              x²/9 + y²/4 = 1
            </Words>
            <Words
              x={px(-0.75)}
              y={py(-1.55)}
              anchor="middle"
              color={BLUE}
              size={14}
            >
              x² + y² = 1
            </Words>
          </>
        )}
      />
    </Figure>
  );
}

/**
 * The parabola y = x² faint and its mirror image x = y² bold, in the line y = x drawn in purple.
 * The point (2, 4) and its image (4, 2) are joined by a dashed segment, which the mirror crosses
 * square on at its midpoint.
 */
export function FlipParabola({ caption }: { caption?: string }) {
  const flipped = parabola.map(([x, y]) => [y, x] as Pt);
  return (
    <Figure caption={caption}>
      <Plot
        id="flip-parabola"
        x={[-2.5, 5]}
        y={[-2.5, 5]}
        unit={52}
        curves={[
          { points: parabola, color: BLUE, faint: true },
          { points: flipped, color: BLUE },
          {
            points: [
              [-2.5, -2.5],
              [5, 5],
            ],
            color: PURPLE,
          },
        ]}
        label="The parabola y = x², drawn faint, opening upwards, and its mirror image in the purple line y = x, the bold parabola x = y², opening to the right. The point (2, 4) of the first and the point (4, 2) of the second are joined by a dashed segment crossing the mirror at (3, 3)."
        extra={({ px, py }) => (
          <>
            <Arrow from={[px(2), py(4)]} to={[px(4), py(2)]} color={ORANGE} />
            <Spot at={[px(2), py(4)]} color={ORANGE} />
            <Spot at={[px(4), py(2)]} color={ORANGE} />
            <Words
              x={px(2) - 10}
              y={py(4) + 4}
              anchor="end"
              color={ORANGE}
              size={13}
            >
              (2, 4)
            </Words>
            <Words
              x={px(4)}
              y={py(2) + 22}
              anchor="middle"
              color={ORANGE}
              size={13}
            >
              (4, 2)
            </Words>
            <Words
              x={px(-1.4)}
              y={py(-0.9)}
              anchor="end"
              color={PURPLE}
              size={14}
            >
              y = x
            </Words>
            <Words
              x={px(-0.9)}
              y={py(4.4)}
              anchor="middle"
              color={BLUE}
              size={14}
            >
              y = x²
            </Words>
            <Words x={px(4.7)} y={py(-1.6)} anchor="end" color={BLUE} size={14}>
              x = y²
            </Words>
          </>
        )}
      />
    </Figure>
  );
}

/**
 * The parabola y = x² faint and its quarter turn about the origin, x = −y², bold. The point (1, 1)
 * swings anticlockwise round an arc about O to (−1, 1), and (2, 4) lands on (−4, 2).
 */
export function TurnParabola({ caption }: { caption?: string }) {
  const turned = parabola.map(([x, y]) => [-y, x] as Pt);
  return (
    <Figure caption={caption}>
      <Plot
        id="turn-parabola"
        x={[-5, 3]}
        y={[-3, 5]}
        unit={48}
        curves={[
          { points: parabola, color: BLUE, faint: true },
          { points: turned, color: BLUE },
        ]}
        label="The parabola y = x², drawn faint, opening upwards, and the bold parabola x = −y², opening to the left, which is the first one turned a quarter turn anticlockwise about the origin. An arc shows the point (1, 1) turning to (−1, 1), and the point (2, 4) lands on (−4, 2)."
        extra={({ px, py }) => {
          const r = Math.SQRT2;
          // the arc from (1, 1) to (−1, 1), anticlockwise on the page
          const steps = 24;
          const arc = Array.from({ length: steps + 1 }, (_, i) => {
            const a = Math.PI / 4 + ((Math.PI / 2) * i) / steps;
            return `${px(r * Math.cos(a)).toFixed(1)},${py(r * Math.sin(a)).toFixed(1)}`;
          }).join(" ");
          const tip: Pt = [px(-1), py(1)];
          return (
            <>
              <polyline
                points={arc}
                fill="none"
                stroke={ORANGE}
                strokeWidth={2}
                strokeDasharray="5 4"
              />
              <polygon
                points={`${tip[0] + 2},${tip[1] - 5} ${tip[0] + 12},${tip[1] - 12} ${tip[0] + 13},${tip[1]}`}
                fill={ORANGE}
              />
              <Spot at={[px(1), py(1)]} color={ORANGE} />
              <Spot at={tip} color={ORANGE} />
              <Spot at={[px(2), py(4)]} color={PURPLE} />
              <Spot at={[px(-4), py(2)]} color={PURPLE} />
              <Words
                x={px(1) + 10}
                y={py(1) + 5}
                anchor="start"
                color={ORANGE}
                size={13}
              >
                (1, 1)
              </Words>
              <Words
                x={px(-1) - 2}
                y={py(1) + 22}
                anchor="end"
                color={ORANGE}
                size={13}
              >
                (−1, 1)
              </Words>
              <Words
                x={px(2) + 10}
                y={py(4) + 5}
                anchor="start"
                color={PURPLE}
                size={13}
              >
                (2, 4)
              </Words>
              <Words
                x={px(-4)}
                y={py(2) - 12}
                anchor="middle"
                color={PURPLE}
                size={13}
              >
                (−4, 2)
              </Words>
              <Words
                x={px(-3.4)}
                y={py(-2.6)}
                anchor="middle"
                color={BLUE}
                size={14}
              >
                x = −y²
              </Words>
              <Words
                x={px(2.5)}
                y={py(2.4)}
                anchor="middle"
                color={BLUE}
                size={14}
              >
                y = x²
              </Words>
            </>
          );
        }}
      />
    </Figure>
  );
}
