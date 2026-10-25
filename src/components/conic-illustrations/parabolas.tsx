import type { ReactNode } from "react";
import { Figure } from "../figure";
import { BLUE, ORANGE, PURPLE, Svg, Words } from "../illustrations";

/**
 * Pictures for the guide Parabolas. A fountain whose jets all trace the same kind of arc, then
 * parabolas on square grids: a quadratic graph as y = 3x² slid into place, y = x² and y = 4x² drawn
 * at different zooms, a parabola on its side, a tangent beside a vertical line, and the path of a
 * thrown ball. Every grid uses one scale across and up, so each curve has its true shape.
 */

const GREEN = "#22c55e";
const MUTED = "#9ca3af";
const WATER = "#38bdf8";

type Range = readonly [number, number];
type Pt = readonly [number, number];
type Scale = { px: (x: number) => number; py: (y: number) => number };

type Curve = {
  points: Pt[];
  color: string;
  /** a light dashed curve, for the one the new curve is compared with */
  faint?: boolean;
};

/** the points (x, f(x)) for x from `from` to `to` */
function graph(f: (x: number) => number, from: number, to: number, n = 240) {
  return Array.from({ length: n + 1 }, (_, i) => {
    const x = from + ((to - from) * i) / n;
    return [x, f(x)] as Pt;
  });
}

/** the points (g(y), y) for y from `from` to `to`: a curve lying on its side */
function sideways(g: (y: number) => number, from: number, to: number) {
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
 * A square grid for x from x0 to x1 and y from y0 to y1, `unit` pixels to each step of 1. Light
 * lines every `step`, numbers along the axes every `every`, and the curves cut off at the edge.
 */
function Plot({
  id,
  x: [x0, x1],
  y: [y0, y1],
  unit,
  step = 1,
  every = 1,
  curves,
  label,
  children,
}: {
  id: string;
  x: Range;
  y: Range;
  unit: number;
  step?: number;
  every?: number;
  curves: Curve[];
  label: string;
  children?: (s: Scale) => ReactNode;
}) {
  const width = LEFT + (x1 - x0) * unit + RIGHT;
  const height = TOP + (y1 - y0) * unit + BOTTOM;
  const px = (x: number) => LEFT + (x - x0) * unit;
  const py = (y: number) => TOP + (y1 - y) * unit;
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
            height={(y1 - y0) * unit}
          />
        </clipPath>
      </defs>
      <g className="text-fd-border" stroke="currentColor" strokeWidth={1}>
        {marks(x0, x1, step).map((x) => (
          <line key={`v${x}`} x1={px(x)} x2={px(x)} y1={py(y0)} y2={py(y1)} />
        ))}
        {marks(y0, y1, step).map((y) => (
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

      <g fontSize={11} className="fill-fd-muted-foreground">
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
        {marks(y0, y1, every)
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

      {children?.({ px, py })}
    </Svg>
  );
}

/** a dot in the card's colour ring, at a point given in pixels */
function Spot({ x, y, color }: { x: number; y: number; color: string }) {
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
function Arrow({
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

/**
 * The opening scene: a fountain in a round basin, with jets leaving one nozzle at different speeds
 * and angles. Each jet rises, turns over at its top and falls, and a dashed line through the top of
 * one jet shows that its falling half mirrors its rising half.
 */
export function FountainJets({ caption }: { caption?: string }) {
  const cx = 280;
  const base = 232;
  // each jet as (half the distance to where it lands, its height), in pixels, to both sides
  const jets: [number, number, number][] = [
    [28, 196, 0.9],
    [56, 172, 0.8],
    [86, 138, 0.7],
    [114, 96, 0.6],
  ];
  const path = (w: number, h: number, side: number) =>
    Array.from({ length: 81 }, (_, i) => {
      const t = (2 * i) / 80;
      const x = cx + side * w * t;
      const y = base - 10 - h * (1 - (t - 1) ** 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
  // the top of the jet marked with the mirror line
  const [mw, mh] = jets[3]!;
  const top = { x: cx + mw, y: base - 10 - mh };

  return (
    <Figure caption={caption}>
      <Svg
        width={560}
        height={290}
        label="A fountain in a round basin. Jets of water leave one nozzle in the middle and arc out to both sides: the steep jets rise high and land close, the flatter jets rise less and land further out. A dashed vertical line through the top of one jet shows that the jet falls on one side of its top the same way it rose on the other."
      >
        {/* the basin and its water */}
        <rect
          x={40}
          y={base}
          width={480}
          height={38}
          rx={10}
          fill={WATER}
          fillOpacity={0.18}
          stroke="currentColor"
          strokeWidth={2.5}
        />
        <line
          x1={52}
          x2={508}
          y1={base + 10}
          y2={base + 10}
          stroke={WATER}
          strokeWidth={2}
          strokeOpacity={0.6}
        />
        {/* the jets, to both sides */}
        {jets.map(([w, h, o], i) => (
          <g key={i}>
            {[-1, 1].map((side) => (
              <polyline
                key={side}
                points={path(w, h, side)}
                fill="none"
                stroke={WATER}
                strokeOpacity={o}
                strokeWidth={4}
                strokeLinecap="round"
              />
            ))}
          </g>
        ))}
        {/* the nozzle */}
        <rect
          x={cx - 9}
          y={base - 16}
          width={18}
          height={18}
          rx={3}
          fill="var(--color-fd-card)"
          stroke="currentColor"
          strokeWidth={2.5}
        />
        {/* the mirror line through the top of one jet */}
        <line
          x1={top.x}
          x2={top.x}
          y1={top.y - 18}
          y2={base - 2}
          stroke={PURPLE}
          strokeWidth={2}
          strokeDasharray="5 4"
        />
        <Spot x={top.x} y={top.y} color={PURPLE} />
        <Words x={top.x + 10} y={top.y - 36} anchor="start" color={PURPLE}>
          top of the arc
        </Words>
      </Svg>
    </Figure>
  );
}

/**
 * The graph of y = 3x² (faint) slid by (−2, −5) onto the graph of y = 3x² + 12x + 7. An arrow takes
 * O to the vertex V = (−2, −5), and a second arrow takes the point (1, 3) to (−1, −2). The axis of
 * the moved curve is the dashed line x = −2.
 */
export function SlidParabola({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <Plot
        id="slid-parabola"
        x={[-5, 3.5]}
        y={[-6, 5]}
        unit={32}
        curves={[
          {
            points: graph((x) => 3 * x * x, -1.4, 1.4),
            color: MUTED,
            faint: true,
          },
          {
            points: graph((x) => 3 * (x + 2) ** 2 - 5, -3.9, -0.1),
            color: BLUE,
          },
        ]}
        label="On a grid, the faint graph of y = 3x² with its vertex at the origin, and the graph of y = 3x² + 12x + 7, the same curve slid 2 to the left and 5 down, with its vertex at V = (−2, −5). An arrow goes from the origin to V, and a second arrow from the point (1, 3) to the point (−1, −2). The dashed vertical line x = −2 is the axis of the moved curve."
      >
        {({ px, py }) => (
          <>
            <line
              x1={px(-2)}
              x2={px(-2)}
              y1={py(-6)}
              y2={py(5)}
              stroke={ORANGE}
              strokeWidth={2}
              strokeDasharray="5 4"
            />
            <Words
              x={px(-2) - 6}
              y={py(4.4)}
              anchor="end"
              color={ORANGE}
              size={14}
            >
              x = −2
            </Words>
            <Arrow
              x1={px(0)}
              y1={py(0)}
              x2={px(-2)}
              y2={py(-5)}
              color={PURPLE}
            />
            <Arrow
              x1={px(1)}
              y1={py(3)}
              x2={px(-1)}
              y2={py(-2)}
              color={PURPLE}
              dashed
            />
            <Spot x={px(0)} y={py(0)} color={MUTED} />
            <Spot x={px(1)} y={py(3)} color={MUTED} />
            <Spot x={px(-1)} y={py(-2)} color={BLUE} />
            <Spot x={px(-2)} y={py(-5)} color={BLUE} />
            <Words x={px(1) + 9} y={py(3) + 5} anchor="start" size={14}>
              (1, 3)
            </Words>
            <Words x={px(-1) + 9} y={py(-2) + 16} anchor="start" size={14}>
              (−1, −2)
            </Words>
            <Words
              x={px(-2) - 9}
              y={py(-5) + 18}
              anchor="end"
              color={BLUE}
              size={14}
            >
              V = (−2, −5)
            </Words>
            <Words
              x={px(1.6)}
              y={py(1.2)}
              anchor="start"
              color={MUTED}
              size={14}
            >
              y = 3x²
            </Words>
            <Words
              x={px(-1.2)}
              y={py(-5.5)}
              anchor="start"
              color={BLUE}
              size={14}
            >
              y = 3x² + 12x + 7
            </Words>
          </>
        )}
      </Plot>
    </Figure>
  );
}

/**
 * Two panels at the same size: y = x² for x from −2 to 2, and y = 4x² for x from −1/2 to 1/2. The
 * curves are identical; only the numbers on the axes differ, by a factor of 4.
 */
export function SameShape({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption} className="flex flex-wrap justify-center gap-6">
      <div className="w-full max-w-[280px]">
        <Plot
          id="same-shape-1"
          x={[-2, 2]}
          y={[0, 4]}
          unit={52}
          curves={[{ points: graph((x) => x * x, -2, 2), color: BLUE }]}
          label="The graph of y = x² for x from −2 to 2, on a grid numbered in steps of 1 up to 4. The point (1, 1) is marked."
        >
          {({ px, py }) => (
            <>
              <Spot x={px(1)} y={py(1)} color={ORANGE} />
              <Words
                x={px(1) + 8}
                y={py(1) + 18}
                anchor="start"
                color={ORANGE}
                size={14}
              >
                (1, 1)
              </Words>
              <Words
                x={px(-1.9)}
                y={py(3.4)}
                anchor="start"
                color={BLUE}
                size={15}
              >
                y = x²
              </Words>
            </>
          )}
        </Plot>
      </div>
      <div className="w-full max-w-[280px]">
        <Plot
          id="same-shape-4"
          x={[-0.5, 0.5]}
          y={[0, 1]}
          unit={208}
          step={0.25}
          every={0.25}
          curves={[{ points: graph((x) => 4 * x * x, -0.5, 0.5), color: BLUE }]}
          label="The graph of y = 4x² for x from −1/2 to 1/2, on a grid numbered in steps of 1/4 up to 1. The point (1/4, 1/4) is marked. The curve looks exactly like the graph of y = x² in the other panel."
        >
          {({ px, py }) => (
            <>
              <Spot x={px(0.25)} y={py(0.25)} color={ORANGE} />
              <Words
                x={px(0.25) + 8}
                y={py(0.25) + 18}
                anchor="start"
                color={ORANGE}
                size={14}
              >
                (0.25, 0.25)
              </Words>
              <Words
                x={px(-0.475)}
                y={py(0.85)}
                anchor="start"
                color={BLUE}
                size={15}
              >
                y = 4x²
              </Words>
            </>
          )}
        </Plot>
      </div>
    </Figure>
  );
}

/**
 * The graph of y = x² − 4x + 1 (faint) and its mirror image in the line y = x, the parabola
 * x = y² − 4y + 1 lying on its side, with vertex (−3, 2), axis y = 2, and the points (1, 0) and
 * (1, 4) at the same distance either side of the axis.
 */
export function SidewaysParabola({ caption }: { caption?: string }) {
  const f = (t: number) => t * t - 4 * t + 1;
  return (
    <Figure caption={caption}>
      <Plot
        id="sideways-parabola"
        x={[-4, 5]}
        y={[-4, 5]}
        unit={34}
        curves={[
          { points: graph(f, -0.8, 4.8), color: MUTED, faint: true },
          { points: sideways(f, -0.8, 4.8), color: BLUE },
        ]}
        label="On a grid, the faint graph of y = x² − 4x + 1, opening upwards with vertex (2, −3), and its mirror image in the dashed line y = x: the parabola x = y² − 4y + 1, opening to the right with vertex (−3, 2). The horizontal dashed line y = 2 is its axis, and the points (1, 0) and (1, 4) on it are mirror images in that axis."
      >
        {({ px, py }) => (
          <>
            <line
              x1={px(-4)}
              y1={py(-4)}
              x2={px(5)}
              y2={py(5)}
              stroke={PURPLE}
              strokeWidth={2}
              strokeDasharray="5 4"
            />
            <line
              x1={px(-4)}
              x2={px(5)}
              y1={py(2)}
              y2={py(2)}
              stroke={ORANGE}
              strokeWidth={2}
              strokeDasharray="5 4"
            />
            <Words
              x={px(3.6)}
              y={py(2) - 8}
              anchor="end"
              color={ORANGE}
              size={14}
            >
              y = 2
            </Words>
            <Words
              x={px(-2.6)}
              y={py(-3.3)}
              anchor="start"
              color={PURPLE}
              size={14}
            >
              y = x
            </Words>
            <Spot x={px(-3)} y={py(2)} color={BLUE} />
            <Spot x={px(1)} y={py(0)} color={BLUE} />
            <Spot x={px(1)} y={py(4)} color={BLUE} />
            <Spot x={px(2)} y={py(-3)} color={MUTED} />
            <Words
              x={px(-3) - 6}
              y={py(2) + 22}
              anchor="end"
              color={BLUE}
              size={14}
            >
              (−3, 2)
            </Words>
            <Words
              x={px(1) + 8}
              y={py(0) - 8}
              anchor="start"
              color={BLUE}
              size={14}
            >
              (1, 0)
            </Words>
            <Words
              x={px(1) + 8}
              y={py(4) + 20}
              anchor="start"
              color={BLUE}
              size={14}
            >
              (1, 4)
            </Words>
            <Words
              x={px(2) + 9}
              y={py(-3) + 5}
              anchor="start"
              color={MUTED}
              size={14}
            >
              (2, −3)
            </Words>
          </>
        )}
      </Plot>
    </Figure>
  );
}

/**
 * The graph of y = x² with the inside (above the curve) lightly shaded. The tangent y = 2x − 1 meets
 * it at (1, 1) and stays outside; the vertical line x = 1 meets it at the same point and passes
 * from outside to inside.
 */
export function TangentOrVertical({ caption }: { caption?: string }) {
  const x0 = -2;
  const x1 = 3;
  const y1 = 5;
  const inside = graph((x) => Math.min(x * x, y1), x0, x1).concat([
    [x1, y1],
    [x0, y1],
  ] as Pt[]);
  return (
    <Figure caption={caption}>
      <Plot
        id="tangent-or-vertical"
        x={[x0, x1]}
        y={[-2, y1]}
        unit={44}
        curves={[
          { points: graph((x) => x * x, x0, x1), color: BLUE },
          { points: graph((x) => 2 * x - 1, x0, x1), color: GREEN },
          {
            points: [
              [1, -2],
              [1, y1],
            ],
            color: PURPLE,
          },
        ]}
        label="On a grid, the graph of y = x² with the region above it shaded and marked inside, and the region below it marked outside. The green line y = 2x − 1 touches the curve at (1, 1) and lies below it everywhere else. The purple vertical line x = 1 meets the curve at the same point (1, 1), but runs from outside below the point to inside above it."
      >
        {({ px, py }) => (
          <>
            <polygon
              points={inside
                .map(([x, y]) => `${px(x).toFixed(1)},${py(y).toFixed(1)}`)
                .join(" ")}
              fill={BLUE}
              fillOpacity={0.1}
            />
            <Spot x={px(1)} y={py(1)} color={ORANGE} />
            <Words
              x={px(1) + 10}
              y={py(1) + 20}
              anchor="start"
              color={ORANGE}
              size={14}
            >
              (1, 1)
            </Words>
            <Words
              x={px(-1)}
              y={py(3.2)}
              anchor="middle"
              color={BLUE}
              size={14}
            >
              inside
            </Words>
            <Words x={px(2.3)} y={py(1.6)} anchor="middle" size={14}>
              outside
            </Words>
            <Words
              x={px(-0.45)}
              y={py(-1.5)}
              anchor="end"
              color={GREEN}
              size={14}
            >
              y = 2x − 1
            </Words>
            <Words
              x={px(1) + 8}
              y={py(-1.6)}
              anchor="start"
              color={PURPLE}
              size={14}
            >
              x = 1
            </Words>
          </>
        )}
      </Plot>
    </Figure>
  );
}

/**
 * The path y = x − x²/20 of a ball thrown at 10 m/s across and 10 m/s up, from (0, 0) to (20, 0),
 * with a dot every 0.2 seconds and its highest point (10, 5) marked.
 */
export function BallPath({ caption }: { caption?: string }) {
  const dots = Array.from({ length: 11 }, (_, i) => {
    const t = i / 5;
    return [10 * t, 10 * t - 5 * t * t] as Pt;
  });
  return (
    <Figure caption={caption}>
      <Plot
        id="ball-path"
        x={[0, 21]}
        y={[0, 6]}
        unit={24}
        every={2}
        curves={[
          { points: graph((x) => x - (x * x) / 20, 0, 20), color: BLUE },
        ]}
        label="The path of a thrown ball on a grid in metres, from (0, 0) up to its highest point (10, 5) and down to (20, 0). Dots mark where the ball is every 0.2 seconds: they are evenly spaced across, 2 metres apart, but bunch up in height near the top."
      >
        {({ px, py }) => (
          <>
            <line
              x1={px(10)}
              x2={px(10)}
              y1={py(0)}
              y2={py(5)}
              stroke={ORANGE}
              strokeWidth={2}
              strokeDasharray="5 4"
            />
            {dots.map(([x, y], i) => (
              <Spot
                key={i}
                x={px(x)}
                y={py(y)}
                color={i === 5 ? ORANGE : BLUE}
              />
            ))}
            <Words
              x={px(10)}
              y={py(5) - 12}
              anchor="middle"
              color={ORANGE}
              size={14}
            >
              highest point (10, 5)
            </Words>
          </>
        )}
      </Plot>
    </Figure>
  );
}
