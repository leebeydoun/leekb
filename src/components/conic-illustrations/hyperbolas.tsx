import type { ReactNode } from "react";
import { Figure } from "../figure";
import { BLUE, PURPLE, Svg, Words } from "../illustrations";

/**
 * Pictures for the guide Hyperbolas. Each curve is sampled into a polyline on a square grid, with
 * the same scale across and up so its shape is the true one. The pictures: the shares of a pizza
 * bill, the two branches of xy = 12, a moved copy of xy = 6, the hyperbola x²/9 − y²/16 = 1 with
 * its box, asymptotes, vertices and foci, the shrinking gap to an asymptote, a check of the two
 * focal distances, and two radio stations fixing a ship on one branch.
 */

const ORANGE = "#f97316";
const GREEN = "#22c55e";
const MUTED = "#9ca3af";

type Range = readonly [number, number];
type Pt = readonly [number, number];
type Scale = { px: (x: number) => number; py: (y: number) => number };

const PAD = 30;

/**
 * A grid for x from x0 to x1 and y from y0 to y1, `unit` pixels per unit both ways. Faint lines
 * every `every` units, numbers every `numbers` units (none if 0), axes with arrowheads, and the
 * curves (lists of points) clipped to the box. `extra` draws on top, in pixel coordinates.
 */
function Plot({
  id,
  x: [x0, x1],
  y: [y0, y1],
  unit,
  every = 1,
  numbers = 1,
  curves,
  label,
  axisNames = ["x", "y"],
  extra,
}: {
  id: string;
  x: Range;
  y: Range;
  unit: number;
  every?: number;
  numbers?: number;
  curves: { points: Pt[]; color: string; faint?: boolean }[];
  label: string;
  axisNames?: [string, string];
  extra?: (s: Scale) => ReactNode;
}) {
  const width = PAD * 2 + (x1 - x0) * unit;
  const height = PAD * 2 + (y1 - y0) * unit;
  const px = (x: number) => PAD + (x - x0) * unit;
  const py = (y: number) => PAD + (y1 - y) * unit;
  const steps = (lo: number, hi: number, by: number) => {
    const out: number[] = [];
    for (let n = Math.ceil(lo / by) * by; n <= hi + 1e-9; n += by) out.push(n);
    return out;
  };
  const xs = steps(x0, x1, every);
  const ys = steps(y0, y1, every);
  const axisX = x0 <= 0 && 0 <= x1 ? 0 : x0;
  const axisY = y0 <= 0 && 0 <= y1 ? 0 : y0;
  const clip = `hyperbola-clip-${id}`;
  const minus = (n: number) => (n < 0 ? `−${-n}` : String(n));

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
        {xs.map((x) => (
          <line key={`v${x}`} x1={px(x)} x2={px(x)} y1={py(y0)} y2={py(y1)} />
        ))}
        {ys.map((y) => (
          <line key={`h${y}`} x1={px(x0)} x2={px(x1)} y1={py(y)} y2={py(y)} />
        ))}
      </g>
      <g stroke="currentColor" strokeWidth={1.5}>
        <line x1={px(x0)} x2={px(x1) + 12} y1={py(axisY)} y2={py(axisY)} />
        <line x1={px(axisX)} x2={px(axisX)} y1={py(y0)} y2={py(y1) - 12} />
      </g>
      <polygon
        fill="currentColor"
        points={`${px(x1) + 16},${py(axisY)} ${px(x1) + 8},${py(axisY) - 4} ${px(x1) + 8},${py(axisY) + 4}`}
      />
      <polygon
        fill="currentColor"
        points={`${px(axisX)},${py(y1) - 16} ${px(axisX) - 4},${py(y1) - 8} ${px(axisX) + 4},${py(y1) - 8}`}
      />
      <Words x={px(x1) + 4} y={py(axisY) - 10} size={14} anchor="end">
        {axisNames[0]}
      </Words>
      <Words x={px(axisX) + 10} y={py(y1) - 8} size={14} anchor="start">
        {axisNames[1]}
      </Words>
      {numbers > 0 && (
        <g fontSize={11} className="fill-fd-muted-foreground">
          {steps(x0, x1, numbers)
            .filter((x) => x !== axisX && x < x1)
            .map((x) => (
              <text
                key={`tx${x}`}
                x={px(x)}
                y={py(axisY) + 15}
                textAnchor="middle"
              >
                {minus(x)}
              </text>
            ))}
          {steps(y0, y1, numbers)
            .filter((y) => y !== axisY && y < y1)
            .map((y) => (
              <text
                key={`ty${y}`}
                x={px(axisX) - 6}
                y={py(y) + 4}
                textAnchor="end"
              >
                {minus(y)}
              </text>
            ))}
        </g>
      )}
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
            strokeOpacity={c.faint ? 0.5 : 1}
            strokeDasharray={c.faint ? "6 5" : undefined}
            strokeLinejoin="round"
          />
        ))}
      </g>
      {extra?.({ px, py })}
    </Svg>
  );
}

/** the points (t, c/t) for t from `from` to `to` (both the same sign), spaced evenly in log t */
function productBranch(c: number, from: number, to: number): Pt[] {
  const sign = from < 0 ? -1 : 1;
  const a = Math.log(Math.abs(from));
  const b = Math.log(Math.abs(to));
  return Array.from({ length: 161 }, (_, i) => {
    const t = sign * Math.exp(a + ((b - a) * i) / 160);
    return [t, c / t] as const;
  });
}

/** one branch of x²/a² − y²/b² = 1 (side +1 right, −1 left), out to |y| = b sinh(reach) */
function standardBranch(a: number, b: number, side: 1 | -1, reach = 3): Pt[] {
  return Array.from({ length: 161 }, (_, i) => {
    const t = -reach + (2 * reach * i) / 160;
    return [side * a * Math.cosh(t), b * Math.sinh(t)] as const;
  });
}

/** a dot with a card-coloured ring */
function Dot({ x, y, color }: { x: number; y: number; color: string }) {
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

/** a dashed straight line between two points given in pixels */
function Dashed({ from, to, color }: { from: Pt; to: Pt; color: string }) {
  return (
    <line
      x1={from[0]}
      y1={from[1]}
      x2={to[0]}
      y2={to[1]}
      stroke={color}
      strokeWidth={2}
      strokeDasharray="6 5"
    />
  );
}

/**
 * The opening scene: a £12 pizza bill shared by 1, 2, 3, 4, 6 or 12 people. Each dot is (people,
 * pounds each), and the curve through them is the graph of xy = 12 for positive x.
 */
export function PizzaShares({ caption }: { caption?: string }) {
  const shares: Pt[] = [
    [1, 12],
    [2, 6],
    [3, 4],
    [4, 3],
    [6, 2],
    [12, 1],
  ];
  return (
    <Figure caption={caption}>
      <Plot
        id="pizza"
        x={[0, 13]}
        y={[0, 13]}
        unit={26}
        numbers={2}
        axisNames={["people", "£ each"]}
        curves={[{ points: productBranch(12, 0.9, 14), color: BLUE }]}
        label="Dots at (1, 12), (2, 6), (3, 4), (4, 3), (6, 2) and (12, 1): the number of people sharing a £12 bill against what each pays. A curve through them falls steeply, then levels out, getting ever closer to both axes without touching them."
        extra={({ px, py }) => (
          <>
            {shares.map(([x, y]) => (
              <g key={x}>
                <Dot x={px(x)} y={py(y)} color={ORANGE} />
                <Words
                  x={x === 12 ? px(x) : px(x) + 9}
                  y={py(y) - 12}
                  anchor={x === 12 ? "middle" : "start"}
                  size={13}
                  color={ORANGE}
                >
                  ({x}, {y})
                </Words>
              </g>
            ))}
          </>
        )}
      />
    </Figure>
  );
}

/**
 * Both branches of xy = 12. The point (3, 4) goes to (−3, −4) under the half turn about O, and to
 * (4, 3) under the flip in the dashed line y = x.
 */
export function ProductBranches({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <Plot
        id="branches"
        x={[-13, 13]}
        y={[-13, 13]}
        unit={16}
        every={2}
        numbers={4}
        curves={[
          { points: productBranch(12, 0.85, 15), color: BLUE },
          { points: productBranch(12, -0.85, -15), color: BLUE },
        ]}
        label="The graph of xy = 12: one branch in the top right quarter and one in the bottom left, each hugging both axes. The dashed line y = x crosses both branches. The point (3, 4) is marked, with its image (−3, −4) under the half turn about O and its image (4, 3) under the flip in y = x."
        extra={({ px, py }) => (
          <>
            <Dashed
              from={[px(-13), py(-13)]}
              to={[px(13), py(13)]}
              color={MUTED}
            />
            <line
              x1={px(3)}
              y1={py(4)}
              x2={px(-3)}
              y2={py(-4)}
              stroke={PURPLE}
              strokeWidth={1.5}
              strokeOpacity={0.7}
            />
            <Dot x={px(0)} y={py(0)} color="currentColor" />
            <Dot x={px(3)} y={py(4)} color={ORANGE} />
            <Dot x={px(-3)} y={py(-4)} color={PURPLE} />
            <Dot x={px(4)} y={py(3)} color={GREEN} />
            <Words x={px(3) - 8} y={py(4) - 8} anchor="end" size={13}>
              (3, 4)
            </Words>
            <Words x={px(-3) + 8} y={py(-4) + 18} anchor="start" size={13}>
              (−3, −4)
            </Words>
            <Words x={px(4) + 8} y={py(3) + 16} anchor="start" size={13}>
              (4, 3)
            </Words>
            <Words x={px(11)} y={py(12.2)} anchor="end" size={13} color={MUTED}>
              y = x
            </Words>
            <Words x={px(12.5)} y={py(2.2)} anchor="end" size={14} color={BLUE}>
              xy = 12
            </Words>
          </>
        )}
      />
    </Figure>
  );
}

/**
 * (x + 2)(y − 3) = 6, the graph of xy = 6 slid by (−2, 3). Its two dashed guide lines, x = −2 and
 * y = 3, cross at the centre (−2, 3), and the points (1, 5) and (−5, 1) are marked.
 */
export function MovedProduct({ caption }: { caption?: string }) {
  const h = -2;
  const k = 3;
  const slid = (pts: Pt[]) => pts.map(([x, y]) => [x + h, y + k] as const);
  return (
    <Figure caption={caption}>
      <Plot
        id="moved"
        x={[-10, 6]}
        y={[-5, 11]}
        unit={24}
        numbers={2}
        curves={[
          {
            points: productBranch(6, 0.5, 13),
            color: "currentColor",
            faint: true,
          },
          {
            points: productBranch(6, -0.5, -13),
            color: "currentColor",
            faint: true,
          },
          { points: slid(productBranch(6, 0.5, 13)), color: BLUE },
          { points: slid(productBranch(6, -0.5, -13)), color: BLUE },
        ]}
        label="The graph of xy = 6, drawn faint and dashed, and its copy slid 2 to the left and 3 up, drawn solid: the graph of (x + 2)(y − 3) = 6. The copy hugs the dashed lines x = −2 and y = 3, which cross at its centre (−2, 3). The points (1, 5) and (−5, 1) on the copy are marked."
        extra={({ px, py }) => (
          <>
            <Dashed
              from={[px(h), py(-5)]}
              to={[px(h), py(11)]}
              color={ORANGE}
            />
            <Dashed
              from={[px(-10), py(k)]}
              to={[px(6), py(k)]}
              color={ORANGE}
            />
            <Dot x={px(h)} y={py(k)} color={ORANGE} />
            <Words
              x={px(h) - 8}
              y={py(k) - 9}
              anchor="end"
              size={13}
              color={ORANGE}
            >
              (−2, 3)
            </Words>
            <Dot x={px(1)} y={py(5)} color={BLUE} />
            <Words x={px(1) + 8} y={py(5) - 8} anchor="start" size={13}>
              (1, 5)
            </Words>
            <Dot x={px(-5)} y={py(1)} color={BLUE} />
            <Words x={px(-5) - 8} y={py(1) + 18} anchor="end" size={13}>
              (−5, 1)
            </Words>
            <Words
              x={px(h) - 6}
              y={py(10.2)}
              anchor="end"
              size={13}
              color={ORANGE}
            >
              x = −2
            </Words>
            <Words
              x={px(5.7)}
              y={py(k) + 18}
              anchor="end"
              size={13}
              color={ORANGE}
            >
              y = 3
            </Words>
          </>
        )}
      />
    </Figure>
  );
}

const A = 3;
const B = 4;
const C = 5;

/** axes for the hyperbola x²/9 − y²/16 = 1, with both branches and, if asked, the box and asymptotes */
function StandardPlot({
  id,
  label,
  guides = true,
  extra,
}: {
  id: string;
  label: string;
  guides?: boolean;
  extra?: (s: Scale) => ReactNode;
}) {
  return (
    <Plot
      id={id}
      x={[-9, 9]}
      y={[-8, 8]}
      unit={24}
      numbers={2}
      curves={[
        { points: standardBranch(A, B, 1), color: BLUE },
        { points: standardBranch(A, B, -1), color: BLUE },
      ]}
      label={label}
      extra={(s) => {
        const { px, py } = s;
        return (
          <>
            {guides && (
              <>
                <Dashed
                  from={[px(-6), py(-8)]}
                  to={[px(6), py(8)]}
                  color={MUTED}
                />
                <Dashed
                  from={[px(-6), py(8)]}
                  to={[px(6), py(-8)]}
                  color={MUTED}
                />
                <rect
                  x={px(-A)}
                  y={py(B)}
                  width={px(A) - px(-A)}
                  height={py(-B) - py(B)}
                  fill="none"
                  stroke={PURPLE}
                  strokeWidth={1.5}
                  strokeDasharray="3 4"
                />
              </>
            )}
            {extra?.(s)}
          </>
        );
      }}
    />
  );
}

/**
 * x²/9 − y²/16 = 1: the two branches, the box from (−3, −4) to (3, 4) whose corners lie on the
 * asymptotes y = ±(4/3)x, the vertices (±3, 0) and the foci (±5, 0).
 */
export function StandardHyperbola({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <StandardPlot
        id="standard"
        label="The graph of x²/9 − y²/16 = 1: a branch opening to the right from the vertex (3, 0) and a branch opening to the left from (−3, 0). A dashed box reaches from (−3, −4) to (3, 4), and the two dashed lines through its corners and the origin, y = (4/3)x and y = −(4/3)x, are the lines the branches approach. The foci (5, 0) and (−5, 0) sit inside the branches."
        extra={({ px, py }) => (
          <>
            <Dot x={px(A)} y={py(0)} color={BLUE} />
            <Dot x={px(-A)} y={py(0)} color={BLUE} />
            <Dot x={px(C)} y={py(0)} color={ORANGE} />
            <Dot x={px(-C)} y={py(0)} color={ORANGE} />
            <Words x={px(A) - 7} y={py(0) - 9} anchor="end" size={13}>
              3
            </Words>
            <Words x={px(-A) + 7} y={py(0) - 9} anchor="start" size={13}>
              −3
            </Words>
            <Words
              x={px(C) + 4}
              y={py(0) - 10}
              anchor="start"
              size={13}
              color={ORANGE}
            >
              F₂
            </Words>
            <Words
              x={px(-C) - 4}
              y={py(0) - 10}
              anchor="end"
              size={13}
              color={ORANGE}
            >
              F₁
            </Words>
            <Words
              x={px(A) + 6}
              y={py(B) - 6}
              anchor="start"
              size={13}
              color={PURPLE}
            >
              (3, 4)
            </Words>
            <Words x={px(5.8)} y={py(7.4)} anchor="end" size={13} color={MUTED}>
              y = 4x/3
            </Words>
            <Words
              x={px(-5.8)}
              y={py(7.4)}
              anchor="start"
              size={13}
              color={MUTED}
            >
              y = −4x/3
            </Words>
          </>
        )}
      />
    </Figure>
  );
}

/**
 * The upper half of the right branch of x²/9 − y²/16 = 1 and the line y = 4x/3 above it, with the
 * vertical gap between them marked at x = 4, 8 and 12.
 */
export function AsymptoteGap({ caption }: { caption?: string }) {
  const gaps = [4, 8, 12];
  const curveY = (x: number) => (B / A) * Math.sqrt(x * x - A * A);
  return (
    <Figure caption={caption}>
      <Plot
        id="gap"
        x={[0, 13]}
        y={[0, 17]}
        unit={22}
        numbers={2}
        curves={[{ points: standardBranch(A, B, 1, 2.3), color: BLUE }]}
        label="The upper right part of the hyperbola x²/9 − y²/16 = 1, starting at (3, 0), and the line y = 4x/3 above it. Short vertical segments mark the gap between the line and the curve at x = 4, 8 and 12; the gap shrinks from about 1.81 to 0.78 to 0.51."
        extra={({ px, py }) => (
          <>
            <Dashed
              from={[px(0), py(0)]}
              to={[px(12.75), py(17)]}
              color={MUTED}
            />
            {gaps.map((x) => {
              const top = (B / A) * x;
              const bottom = curveY(x);
              const gap = top - bottom;
              return (
                <g key={x}>
                  <line
                    x1={px(x)}
                    x2={px(x)}
                    y1={py(top)}
                    y2={py(bottom)}
                    stroke={ORANGE}
                    strokeWidth={3}
                  />
                  <Words
                    x={px(x) + 8}
                    y={py((top + bottom) / 2) + 5}
                    anchor="start"
                    size={13}
                    color={ORANGE}
                  >
                    {gap.toFixed(2)}
                  </Words>
                </g>
              );
            })}
            <Words
              x={px(9.4)}
              y={py(15.6)}
              anchor="end"
              size={13}
              color={MUTED}
            >
              y = 4x/3
            </Words>
          </>
        )}
      />
    </Figure>
  );
}

/**
 * x²/9 − y²/16 = 1 with the point P = (5, 16/3) joined to both foci: PF₁ = 34/3 and PF₂ = 16/3,
 * which differ by 6 = 2a.
 */
export function FocalDistances({ caption }: { caption?: string }) {
  const P: Pt = [5, 16 / 3];
  return (
    <Figure caption={caption}>
      <StandardPlot
        id="foci"
        guides={false}
        label="The graph of x²/9 − y²/16 = 1 with the foci F₁ = (−5, 0) and F₂ = (5, 0). The point P = (5, 16/3) on the right branch is joined to F₁ by a segment of length 34/3 and to F₂, straight below it, by a segment of length 16/3."
        extra={({ px, py }) => (
          <>
            <line
              x1={px(-C)}
              y1={py(0)}
              x2={px(P[0])}
              y2={py(P[1])}
              stroke={ORANGE}
              strokeWidth={2.5}
            />
            <line
              x1={px(C)}
              y1={py(0)}
              x2={px(P[0])}
              y2={py(P[1])}
              stroke={PURPLE}
              strokeWidth={2.5}
            />
            <Dot x={px(-C)} y={py(0)} color={ORANGE} />
            <Dot x={px(C)} y={py(0)} color={PURPLE} />
            <Dot x={px(P[0])} y={py(P[1])} color="currentColor" />
            <Words
              x={px(-C) - 6}
              y={py(0) - 9}
              anchor="end"
              size={13}
              color={ORANGE}
            >
              F₁
            </Words>
            <Words
              x={px(C) + 6}
              y={py(0) - 9}
              anchor="start"
              size={13}
              color={PURPLE}
            >
              F₂
            </Words>
            <Words x={px(P[0]) + 8} y={py(P[1]) - 8} anchor="start" size={13}>
              P = (5, 16/3)
            </Words>
            <Words
              x={px(-0.6)}
              y={py(3.6)}
              anchor="end"
              size={13}
              color={ORANGE}
            >
              34/3
            </Words>
            <Words
              x={px(C) + 8}
              y={py(2.4)}
              anchor="start"
              size={13}
              color={PURPLE}
            >
              16/3
            </Words>
          </>
        )}
      />
    </Figure>
  );
}

/**
 * Two radio stations 100 km apart, A at (−50, 0) and B at (50, 0). A ship whose distances differ
 * by 60 km lies on the branch of x²/900 − y²/1600 = 1 nearer B; the ship drawn is at (34, 64/3).
 */
export function RadioStations({ caption }: { caption?: string }) {
  const ship: Pt = [34, 64 / 3];
  return (
    <Figure caption={caption}>
      <Plot
        id="radio"
        x={[-60, 80]}
        y={[-50, 60]}
        unit={3}
        every={10}
        numbers={0}
        axisNames={["east", "north"]}
        curves={[{ points: standardBranch(30, 40, 1, 1.4), color: BLUE }]}
        label="Two radio stations, A at 50 km west of the origin and B at 50 km east. The branch of a hyperbola curves round B, crossing the line between the stations 30 km east of the origin. A ship on the branch, at 34 km east and about 21 km north, is joined to both stations: about 87 km to A and about 27 km to B."
        extra={({ px, py }) => (
          <>
            <line
              x1={px(-50)}
              y1={py(0)}
              x2={px(ship[0])}
              y2={py(ship[1])}
              stroke={ORANGE}
              strokeWidth={2}
            />
            <line
              x1={px(50)}
              y1={py(0)}
              x2={px(ship[0])}
              y2={py(ship[1])}
              stroke={PURPLE}
              strokeWidth={2}
            />
            <rect
              x={px(-50) - 6}
              y={py(0) - 6}
              width={12}
              height={12}
              fill={ORANGE}
            />
            <rect
              x={px(50) - 6}
              y={py(0) - 6}
              width={12}
              height={12}
              fill={PURPLE}
            />
            <Words x={px(-50)} y={py(0) + 24} size={14} color={ORANGE}>
              A
            </Words>
            <Words x={px(50)} y={py(0) + 24} size={14} color={PURPLE}>
              B
            </Words>
            <Dot x={px(ship[0])} y={py(ship[1])} color="currentColor" />
            <Words
              x={px(ship[0]) - 8}
              y={py(ship[1]) - 10}
              anchor="end"
              size={14}
            >
              ship
            </Words>
            <Words
              x={px(-12)}
              y={py(16)}
              anchor="middle"
              size={13}
              color={ORANGE}
            >
              86.7 km
            </Words>
            <Words
              x={px(49)}
              y={py(14)}
              anchor="start"
              size={13}
              color={PURPLE}
            >
              26.7 km
            </Words>
          </>
        )}
      />
    </Figure>
  );
}
