import type { ReactNode } from "react";
import { Figure } from "../figure";
import { BLUE, ORANGE, PURPLE, Svg, Words } from "../illustrations";

/**
 * Pictures for the guide Recognising a curve from its equation. Each one is drawn on a square grid
 * with the same scale across and up, so a curve has its true shape: a family of ellipses shrinking
 * to a point as the last number of the equation grows, the four degenerate cases, and three curves
 * with an xy term drawn with the turned axes u and v that tidy their equations.
 */

const MUTED = "#9ca3af";
const GREEN = "#22c55e";

type Range = readonly [number, number];
type Pt = readonly [number, number];
type Scale = { px: (x: number) => number; py: (y: number) => number };

const PAD = 26;

/** the turn by t about O, from the rotation formula */
const turn = (t: number, [x, y]: Pt): Pt => [
  x * Math.cos(t) - y * Math.sin(t),
  x * Math.sin(t) + y * Math.cos(t),
];

/** the points f(s) for s from s0 to s1, as an svg path */
function trace(
  f: (s: number) => Pt,
  s0: number,
  s1: number,
  { px, py }: Scale,
  steps = 240,
) {
  const parts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const [x, y] = f(s0 + ((s1 - s0) * i) / steps);
    parts.push(`${i === 0 ? "M" : "L"}${px(x).toFixed(1)},${py(y).toFixed(1)}`);
  }
  return parts.join(" ");
}

/** a curve drawn from a path, bold or faint and dashed */
function Curve({
  d,
  color,
  faint = false,
}: {
  d: string;
  color: string;
  faint?: boolean;
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={faint ? 2 : 3}
      strokeOpacity={faint ? 0.6 : 1}
      strokeDasharray={faint ? "6 5" : undefined}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  );
}

/** a dashed straight line through the whole picture, through p in the direction dir */
function Through({
  p,
  dir,
  color,
  s,
  reach = 20,
}: {
  p: Pt;
  dir: Pt;
  color: string;
  s: Scale;
  reach?: number;
}) {
  return (
    <line
      x1={s.px(p[0] - reach * dir[0])}
      y1={s.py(p[1] - reach * dir[1])}
      x2={s.px(p[0] + reach * dir[0])}
      y2={s.py(p[1] + reach * dir[1])}
      stroke={color}
      strokeWidth={1.75}
      strokeDasharray="5 5"
    />
  );
}

/** a dot with a light ring, so it stands out on top of a curve */
function Spot({
  at: [x, y],
  color,
  s,
  r = 5,
}: {
  at: Pt;
  color: string;
  s: Scale;
  r?: number;
}) {
  return (
    <circle
      cx={s.px(x)}
      cy={s.py(y)}
      r={r}
      fill={color}
      stroke="var(--color-fd-card)"
      strokeWidth={2}
    />
  );
}

/**
 * Square grid and axes for x from x0 to x1 and y from y0 to y1, `unit` pixels to 1, with numbers
 * along the axes. Whatever `children` draws is clipped to the grid, and `over` is drawn on top
 * without clipping, for labels.
 */
function Plot({
  id,
  x: [x0, x1],
  y: [y0, y1],
  unit,
  label,
  numbers = true,
  children,
  over,
}: {
  id: string;
  x: Range;
  y: Range;
  unit: number;
  label: string;
  numbers?: boolean;
  children: (s: Scale) => ReactNode;
  over?: (s: Scale) => ReactNode;
}) {
  const width = PAD * 2 + (x1 - x0) * unit;
  const height = PAD * 2 + (y1 - y0) * unit;
  const px = (x: number) => PAD + (x - x0) * unit;
  const py = (y: number) => PAD + (y1 - y) * unit;
  const s = { px, py };
  const range = (lo: number, hi: number) =>
    Array.from(
      { length: Math.floor(hi) - Math.ceil(lo) + 1 },
      (_, i) => Math.ceil(lo) + i,
    );
  const xs = range(x0, x1);
  const ys = range(y0, y1);
  const name = (n: number) => (n < 0 ? `−${-n}` : String(n));

  return (
    <Svg width={width} height={height} label={label}>
      <defs>
        <clipPath id={id}>
          <rect
            x={px(x0)}
            y={py(y1)}
            width={px(x1) - px(x0)}
            height={py(y0) - py(y1)}
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
        <line x1={px(x0)} x2={px(x1) + 8} y1={py(0)} y2={py(0)} />
        <line x1={px(0)} x2={px(0)} y1={py(y0)} y2={py(y1) - 8} />
      </g>
      <polygon
        fill="currentColor"
        points={`${px(x1) + 12},${py(0)} ${px(x1) + 4},${py(0) - 4} ${px(x1) + 4},${py(0) + 4}`}
      />
      <polygon
        fill="currentColor"
        points={`${px(0)},${py(y1) - 12} ${px(0) - 4},${py(y1) - 4} ${px(0) + 4},${py(y1) - 4}`}
      />
      <text
        x={px(x1) + 4}
        y={py(0) - 9}
        fontSize={14}
        fontStyle="italic"
        fill="currentColor"
      >
        x
      </text>
      <text
        x={px(0) + 9}
        y={py(y1) - 6}
        fontSize={14}
        fontStyle="italic"
        fill="currentColor"
      >
        y
      </text>
      {numbers && (
        <g fontSize={11} className="fill-fd-muted-foreground">
          {xs
            .filter((x) => x !== 0)
            .map((x) => (
              <text key={`tx${x}`} x={px(x)} y={py(0) + 15} textAnchor="middle">
                {name(x)}
              </text>
            ))}
          {ys
            .filter((y) => y !== 0)
            .map((y) => (
              <text key={`ty${y}`} x={px(0) - 6} y={py(y) + 4} textAnchor="end">
                {name(y)}
              </text>
            ))}
        </g>
      )}
      <g clipPath={`url(#${id})`}>{children(s)}</g>
      {over?.(s)}
    </Svg>
  );
}

/**
 * The graphs of x² + 4y² − 6x + 8y + c = 0 for c = 5, 9 and 12, and the single point for c = 13.
 * Completing the squares gives (x − 3)² + 4(y + 1)² = 13 − c, so they share the centre (3, −1) and
 * shrink as c grows.
 */
export function ShrinkingEllipse({ caption }: { caption?: string }) {
  const rings = [
    { c: 5, color: BLUE },
    { c: 9, color: ORANGE },
    { c: 12, color: PURPLE },
  ];
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <div className="w-full max-w-md">
          <Plot
            id="ge-shrinking-ellipse"
            x={[-1, 7]}
            y={[-3, 2]}
            unit={52}
            label="Three ellipses centred at (3, −1), one inside the next, and the point (3, −1) itself. The largest, for c = 5, is about 5.7 wide and 2.8 tall; the middle one, for c = 9, is 4 wide and 2 tall; the smallest, for c = 12, is 2 wide and 1 tall. For c = 13 the curve is the single point (3, −1)."
          >
            {(s) => (
              <>
                {rings.map(({ c, color }) => {
                  const a = Math.sqrt(13 - c);
                  const b = a / 2;
                  return (
                    <Curve
                      key={c}
                      d={trace(
                        (t) => [3 + a * Math.cos(t), -1 + b * Math.sin(t)],
                        0,
                        2 * Math.PI,
                        s,
                      )}
                      color={color}
                    />
                  );
                })}
                <Spot at={[3, -1]} color={GREEN} s={s} r={6} />
              </>
            )}
          </Plot>
        </div>
        <ul className="flex flex-col gap-1 text-sm font-medium tabular-nums">
          {rings.map(({ c, color }) => (
            <li key={c} style={{ color }}>
              c = {c}: an ellipse
            </li>
          ))}
          <li style={{ color: GREEN }}>c = 13: one point</li>
          <li className="text-fd-muted-foreground">c = 14: nothing</li>
        </ul>
      </div>
    </Figure>
  );
}

/** one small panel of the degenerate cases, with its equation and what it draws underneath */
function Degenerate({
  id,
  equation,
  name,
  label,
  draw,
}: {
  id: string;
  equation: string;
  name: string;
  label: string;
  draw: (s: Scale) => ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-full max-w-48">
        <Plot id={id} x={[-3, 3]} y={[-3, 3]} unit={24} label={label}>
          {draw}
        </Plot>
      </div>
      <div className="text-sm font-medium">{equation}</div>
      <div className="text-sm text-fd-muted-foreground">{name}</div>
    </div>
  );
}

/** x² + y² = 0, x² + y² = −1, x² − y² = 0 and x² = 4, each on its own small grid */
export function DegenerateCases({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
        <Degenerate
          id="ge-degenerate-point"
          equation="x² + y² = 0"
          name="one point"
          label="The graph of x² + y² = 0: the single point O."
          draw={(s) => <Spot at={[0, 0]} color={BLUE} s={s} r={6} />}
        />
        <Degenerate
          id="ge-degenerate-empty"
          equation="x² + y² = −1"
          name="nothing"
          label="The graph of x² + y² = −1: an empty grid, since no point fits."
          draw={() => null}
        />
        <Degenerate
          id="ge-degenerate-crossing"
          equation="x² − y² = 0"
          name="two crossing lines"
          label="The graph of x² − y² = 0: the lines y = x and y = −x, crossing at O."
          draw={(s) => (
            <>
              <line
                x1={s.px(-4)}
                y1={s.py(-4)}
                x2={s.px(4)}
                y2={s.py(4)}
                stroke={BLUE}
                strokeWidth={3}
              />
              <line
                x1={s.px(-4)}
                y1={s.py(4)}
                x2={s.px(4)}
                y2={s.py(-4)}
                stroke={BLUE}
                strokeWidth={3}
              />
            </>
          )}
        />
        <Degenerate
          id="ge-degenerate-parallel"
          equation="x² = 4"
          name="two parallel lines"
          label="The graph of x² = 4: the vertical lines x = 2 and x = −2."
          draw={(s) => (
            <>
              <line
                x1={s.px(2)}
                y1={s.py(-4)}
                x2={s.px(2)}
                y2={s.py(4)}
                stroke={BLUE}
                strokeWidth={3}
              />
              <line
                x1={s.px(-2)}
                y1={s.py(-4)}
                x2={s.px(-2)}
                y2={s.py(4)}
                stroke={BLUE}
                strokeWidth={3}
              />
            </>
          )}
        />
      </div>
    </Figure>
  );
}

/** the turned axes: the u-axis along angle t and the v-axis a quarter turn further, named at one end */
function TurnedAxes({ t, s, at = 2.6 }: { t: number; s: Scale; at?: number }) {
  const u: Pt = [Math.cos(t), Math.sin(t)];
  const v: Pt = [-Math.sin(t), Math.cos(t)];
  return (
    <>
      <Through p={[0, 0]} dir={u} color={GREEN} s={s} />
      <Through p={[0, 0]} dir={v} color={GREEN} s={s} />
      <g fontStyle="italic" fontWeight={600}>
        <Words
          x={s.px(at * u[0]) + 10}
          y={s.py(at * u[1]) + 4}
          anchor="start"
          color={GREEN}
          size={15}
        >
          u
        </Words>
        <Words
          x={s.px(at * v[0]) - 10}
          y={s.py(at * v[1]) + 4}
          anchor="end"
          color={GREEN}
          size={15}
        >
          v
        </Words>
      </g>
    </>
  );
}

/**
 * The graph of 5x² − 6xy + 5y² = 8 in blue: the ellipse x²/4 + y² = 1, dashed, turned by π/4.
 * The turned axes u and v run along its long and short axes, and the end point (2, 0) of the dashed
 * ellipse lands at (√2, √2).
 */
export function TurnedEllipse({ caption }: { caption?: string }) {
  const t = Math.PI / 4;
  const base = (a: number): Pt => [2 * Math.cos(a), Math.sin(a)];
  const P = turn(t, [2, 0]);
  return (
    <Figure caption={caption}>
      <div className="mx-auto max-w-md">
        <Plot
          id="ge-turned-ellipse"
          x={[-3, 3]}
          y={[-3, 3]}
          unit={62}
          label="The graph of 5x² − 6xy + 5y² = 8, a blue ellipse tilted with its long axis along the line y = x, over the dashed ellipse x²/4 + y² = 1 lying along the x-axis. Green dashed lines mark the u-axis along y = x and the v-axis along y = −x. An arc shows the point (2, 0) turned by π/4 to (√2, √2)."
          over={(s) => (
            <>
              <Words
                x={s.px(P[0]) + 10}
                y={s.py(P[1]) - 8}
                anchor="start"
                color={BLUE}
                size={13}
              >
                (√2, √2)
              </Words>
              <Words
                x={s.px(2) + 6}
                y={s.py(0) - 8}
                anchor="start"
                color={MUTED}
                size={13}
              >
                (2, 0)
              </Words>
              <Words
                x={s.px(2.1 * Math.cos(t / 2)) + 8}
                y={s.py(2.1 * Math.sin(t / 2))}
                anchor="start"
                color={ORANGE}
                size={13}
              >
                π/4
              </Words>
            </>
          )}
        >
          {(s) => (
            <>
              <TurnedAxes t={t} s={s} at={2.85} />
              <Curve d={trace(base, 0, 2 * Math.PI, s)} color={MUTED} faint />
              <Curve
                d={trace((a) => turn(t, base(a)), 0, 2 * Math.PI, s)}
                color={BLUE}
              />
              <path
                d={trace(
                  (a) => [2 * Math.cos(a), 2 * Math.sin(a)],
                  0.08,
                  t - 0.08,
                  s,
                  40,
                )}
                fill="none"
                stroke={ORANGE}
                strokeWidth={2}
                markerEnd="url(#ge-arrow)"
              />
              <defs>
                <marker
                  id="ge-arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M0,0 L10,5 L0,10 z" fill={ORANGE} />
                </marker>
              </defs>
              <Spot at={[2, 0]} color={MUTED} s={s} />
              <Spot at={P} color={BLUE} s={s} />
            </>
          )}
        </Plot>
      </div>
    </Figure>
  );
}

/**
 * The graph of x² + √3xy = 3: the hyperbola u²/2 − v²/6 = 1 turned by π/6. Its asymptotes, dashed,
 * are the y-axis and the line x + √3y = 0, and its vertices are ±(√6/2, √2/2).
 */
export function TurnedHyperbola({ caption }: { caption?: string }) {
  const t = Math.PI / 6;
  const a = Math.sqrt(2);
  const b = Math.sqrt(6);
  const V = turn(t, [a, 0]);
  return (
    <Figure caption={caption}>
      <div className="mx-auto max-w-md">
        <Plot
          id="ge-turned-hyperbola"
          x={[-4, 4]}
          y={[-4, 4]}
          unit={48}
          label="The graph of x² + √3xy = 3, a blue hyperbola with one branch in the upper right and one in the lower left. Green dashed lines mark the u-axis at angle π/6 and the v-axis at angle 2π/3. Orange dashed lines mark its asymptotes, the y-axis and the line x + √3y = 0. Its vertices are at about (1.22, 0.71), marked V, and (−1.22, −0.71)."
          over={(s) => (
            <>
              <Words
                x={s.px(V[0]) - 10}
                y={s.py(V[1]) + 5}
                anchor="end"
                color={BLUE}
                size={14}
              >
                V
              </Words>
              <Words
                x={s.px(-3.9)}
                y={s.py(3.9 / Math.sqrt(3)) - 8}
                anchor="start"
                color={ORANGE}
                size={13}
              >
                x + √3y = 0
              </Words>
            </>
          )}
        >
          {(s) => (
            <>
              <TurnedAxes t={t} s={s} at={3.3} />
              <Through p={[0, 0]} dir={[0, 1]} color={ORANGE} s={s} />
              <Through
                p={[0, 0]}
                dir={[Math.sqrt(3) / 2, -1 / 2]}
                color={ORANGE}
                s={s}
              />
              {[1, -1].map((side) => (
                <Curve
                  key={side}
                  d={trace(
                    (r) => turn(t, [side * a * Math.cosh(r), b * Math.sinh(r)]),
                    -2.2,
                    2.2,
                    s,
                  )}
                  color={BLUE}
                />
              ))}
              <Spot at={V} color={BLUE} s={s} />
              <Spot at={[-V[0], -V[1]]} color={BLUE} s={s} />
            </>
          )}
        </Plot>
      </div>
    </Figure>
  );
}

/**
 * The graph of x² + 2xy + y² + x − y = 0: the parabola v = √2u² turned by π/4, opening up and to
 * the left along the v-axis, with its vertex at O and the point (√2/2 − 1, √2/2 + 1) marked.
 */
export function TurnedParabola({ caption }: { caption?: string }) {
  const t = Math.PI / 4;
  const P = turn(t, [1, Math.SQRT2]);
  return (
    <Figure caption={caption}>
      <div className="mx-auto max-w-md">
        <Plot
          id="ge-turned-parabola"
          x={[-3, 3]}
          y={[-2, 3]}
          unit={62}
          label="The graph of x² + 2xy + y² + x − y = 0, a blue parabola with its vertex at O, opening up and to the left along the green v-axis, which is the line y = −x. The point P = (√2/2 − 1, √2/2 + 1), about (−0.29, 1.71), is marked on it."
          over={(s) => (
            <Words
              x={s.px(P[0]) - 10}
              y={s.py(P[1]) + 5}
              anchor="end"
              color={BLUE}
              size={14}
            >
              P
            </Words>
          )}
        >
          {(s) => (
            <>
              <TurnedAxes t={t} s={s} at={2.3} />
              <Curve
                d={trace((r) => turn(t, [r, Math.SQRT2 * r * r]), -1.6, 1.6, s)}
                color={BLUE}
              />
              <Spot at={[0, 0]} color={BLUE} s={s} />
              <Spot at={P} color={BLUE} s={s} />
            </>
          )}
        </Plot>
      </div>
    </Figure>
  );
}
