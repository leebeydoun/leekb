import type { ReactNode } from "react";
import { Figure } from "../figure";
import { BLUE, ORANGE, PURPLE, Svg, Words } from "../illustrations";
import { MUTED, Plot, Spot, graph } from "../function-illustrations/plot";

/**
 * Pictures for the guide Meeting i. The graph of y = x², which never goes below the x-axis; the
 * product (1 + 2i)(3 − i) = 5 + 5i drawn as three points; multiplying by i as a quarter turn, from
 * 1 to i to −1; and the powers of i going round the four points 1, i, −1 and −i.
 *
 * The shared grid for the complex plane lives here too, and the guide The complex plane uses it.
 */

export type Range = readonly [number, number];
export type Scale = { px: (x: number) => number; py: (y: number) => number };

// a tick label with a proper minus sign: 2, −3, and i, 2i, −i up the imaginary axis
const real = (n: number) => (n < 0 ? `−${-n}` : `${n}`);
const imaginary = (n: number) =>
  n === 1 ? "i" : n === -1 ? "−i" : `${real(n)}i`;

const LEFT = 34;
const RIGHT = 26;
const TOP = 26;
const BOTTOM = 26;

/**
 * The complex plane as a square grid, for a + bi with a from x0 to x1 and b from y0 to y1, `unit`
 * pixels to each step of 1. The horizontal axis is the real axis and the vertical axis the
 * imaginary axis, with their numbers written as 2 and 2i. Pass `ticks={false}` to leave the
 * numbers off, when the points carry their own names.
 */
export function ComplexGrid({
  x: [x0, x1],
  y: [y0, y1],
  unit,
  label,
  ticks = true,
  children,
}: {
  x: Range;
  y: Range;
  unit: number;
  label: string;
  ticks?: boolean;
  children?: (s: Scale) => ReactNode;
}) {
  const width = LEFT + (x1 - x0) * unit + RIGHT;
  const height = TOP + (y1 - y0) * unit + BOTTOM;
  const px = (x: number) => LEFT + (x - x0) * unit;
  const py = (y: number) => TOP + (y1 - y) * unit;
  const whole = (lo: number, hi: number) => {
    const out: number[] = [];
    for (let k = Math.ceil(lo - 1e-9); k <= hi + 1e-9; k++) out.push(k);
    return out;
  };
  const xs = whole(x0, x1);
  const ys = whole(y0, y1);

  return (
    <Svg width={width} height={height} label={label}>
      <g className="text-fd-border" stroke="currentColor" strokeWidth={1}>
        {xs.map((x) => (
          <line key={`v${x}`} x1={px(x)} x2={px(x)} y1={py(y0)} y2={py(y1)} />
        ))}
        {ys.map((y) => (
          <line key={`h${y}`} x1={px(x0)} x2={px(x1)} y1={py(y)} y2={py(y)} />
        ))}
      </g>

      {/* the real and imaginary axes, with arrowheads at the positive ends */}
      <g stroke="currentColor" strokeWidth={1.5}>
        <line x1={px(x0)} x2={px(x1) + 10} y1={py(0)} y2={py(0)} />
        <line x1={px(0)} x2={px(0)} y1={py(y0)} y2={py(y1) - 10} />
      </g>
      <polygon
        fill="currentColor"
        points={`${px(x1) + 14},${py(0)} ${px(x1) + 6},${py(0) - 4} ${px(x1) + 6},${py(0) + 4}`}
      />
      <polygon
        fill="currentColor"
        points={`${px(0)},${py(y1) - 14} ${px(0) - 4},${py(y1) - 6} ${px(0) + 4},${py(y1) - 6}`}
      />

      {ticks && (
        <g
          fontSize={11}
          className="fill-fd-muted-foreground"
          stroke="var(--color-fd-card)"
          strokeWidth={3}
          paintOrder="stroke"
        >
          {xs
            .filter((x) => x !== 0)
            .map((x) => (
              <text key={`tx${x}`} x={px(x)} y={py(0) + 15} textAnchor="middle">
                {real(x)}
              </text>
            ))}
          {ys
            .filter((y) => y !== 0)
            .map((y) => (
              <text key={`ty${y}`} x={px(0) - 6} y={py(y) + 4} textAnchor="end">
                {imaginary(y)}
              </text>
            ))}
        </g>
      )}

      {children?.({ px, py })}
    </Svg>
  );
}

/**
 * An arc about the pixel point (cx, cy) of radius r, from angle `from` to angle `to` (radians,
 * anticlockwise as in the plane), with an arrowhead at the end when `head` is set.
 */
export function Arc({
  cx,
  cy,
  r,
  from,
  to,
  color,
  head = true,
  width = 2.5,
}: {
  cx: number;
  cy: number;
  r: number;
  from: number;
  to: number;
  color: string;
  head?: boolean;
  width?: number;
}) {
  const at = (t: number) => [cx + r * Math.cos(t), cy - r * Math.sin(t)];
  const forward = to >= from;
  // leave room for the arrowhead at the end
  const stop = head ? to - (forward ? 1 : -1) * (9 / r) : to;
  const [x1, y1] = at(from);
  const [x2, y2] = at(stop);
  const large = Math.abs(stop - from) > Math.PI ? 1 : 0;
  const sweep = forward ? 0 : 1;
  // the direction of travel at the end, on screen
  const [ex, ey] = at(to);
  const dx = forward ? -Math.sin(to) : Math.sin(to);
  const dy = forward ? -Math.cos(to) : Math.cos(to);
  const bx = ex! - dx * 10;
  const by = ey! - dy * 10;
  return (
    <g>
      <path
        d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} ${sweep} ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={width}
      />
      {head && (
        <polygon
          points={`${ex},${ey} ${bx - dy * 5},${by + dx * 5} ${bx + dy * 5},${by - dx * 5}`}
          fill={color}
        />
      )}
    </g>
  );
}

/**
 * The graph of y = x² for x from −2.3 to 2.3, never below the x-axis, and a dashed line at height
 * −1 that it never meets.
 */
export function SquaresNeverNegative({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <Plot
        id="squares-never-negative"
        x={[-3, 3]}
        y={[-2, 5]}
        unit={40}
        curves={[{ points: graph((x) => x * x, -2.3, 2.3), color: BLUE }]}
        label="The graph of y = x squared on a square grid, for x from −2.3 to 2.3. It is a U shape whose lowest point is the origin, so it never goes below the x-axis. A dashed orange horizontal line at height −1 runs across the whole grid below the curve, and the curve never meets it."
      >
        {({ px, py }) => (
          <>
            <line
              x1={px(-3)}
              x2={px(3)}
              y1={py(-1)}
              y2={py(-1)}
              stroke={ORANGE}
              strokeWidth={2.5}
              strokeDasharray="7 5"
            />
            <Words
              x={px(2.9)}
              y={py(-1) + 20}
              anchor="end"
              size={13}
              color={ORANGE}
            >
              height −1
            </Words>
            <Words x={px(2.1)} y={py(3)} anchor="start" size={14} color={BLUE}>
              y = x²
            </Words>
            {[-2, -1, 1, 2].map((x) => (
              <Spot key={x} x={px(x)} y={py(x * x)} color={BLUE} />
            ))}
          </>
        )}
      </Plot>
    </Figure>
  );
}

/**
 * The points 1 + 2i, 3 − i and their product 5 + 5i, each joined to 0. Arcs at 0 mark the angle of
 * each point from the positive real axis: about 63°, about −18°, and 45°.
 */
export function MultiplyPreview({ caption }: { caption?: string }) {
  const angle = (a: number, b: number) => Math.atan2(b, a);
  return (
    <Figure caption={caption}>
      <ComplexGrid
        x={[-1, 6]}
        y={[-2, 6]}
        unit={40}
        label="The complex plane with three points joined to 0 by segments: 1 + 2i in blue, 3 − i in orange, and their product 5 + 5i in purple. Arcs at 0 mark the angle of each point from the positive real axis: the blue point is about 63 degrees above it, the orange point about 18 degrees below it, and the purple point 45 degrees above it. The purple segment is the longest."
      >
        {({ px, py }) => {
          const o = { x: px(0), y: py(0) };
          // each point, its colour and name, the radius of its angle arc, and where the arc's
          // label goes (an angle in degrees and a distance from 0, in pixels)
          const pts: [
            number,
            number,
            string,
            string,
            number,
            string,
            number,
            number,
          ][] = [
            [1, 2, BLUE, "1 + 2i", 40, "63°", 78, 56],
            [3, -1, ORANGE, "3 − i", 64, "−18°", -40, 64],
            [5, 5, PURPLE, "5 + 5i", 96, "45°", 22, 116],
          ];
          return (
            <>
              {pts.map(([a, b, color, , r]) => (
                <g key={color}>
                  <line
                    x1={o.x}
                    y1={o.y}
                    x2={px(a)}
                    y2={py(b)}
                    stroke={color}
                    strokeWidth={3}
                  />
                  <Arc
                    cx={o.x}
                    cy={o.y}
                    r={r}
                    from={0}
                    to={angle(a, b)}
                    color={color}
                    head={false}
                    width={2}
                  />
                </g>
              ))}
              {pts.map(([, , color, , , text, deg, d]) => (
                <Words
                  key={text}
                  x={o.x + d * Math.cos((deg * Math.PI) / 180)}
                  y={o.y - d * Math.sin((deg * Math.PI) / 180) + 4}
                  size={12}
                  color={color}
                >
                  {text}
                </Words>
              ))}
              {pts.map(([a, b, color, name]) => (
                <g key={name}>
                  <Spot x={px(a)} y={py(b)} color={color} />
                  <Words
                    x={px(a) + 9}
                    y={b < 0 ? py(b) + 20 : py(b) - 9}
                    anchor="start"
                    size={14}
                    color={color}
                  >
                    {name}
                  </Words>
                </g>
              ))}
              <Spot x={o.x} y={o.y} color="currentColor" />
            </>
          );
        }}
      </ComplexGrid>
    </Figure>
  );
}

/**
 * The points 1, i and −1 on the unit circle. A blue quarter-turn arrow goes from 1 to i, marked
 * "× i", and an orange one from i to −1, marked "× i" again.
 */
export function TimesITurns({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <ComplexGrid
        x={[-2, 2]}
        y={[-0.75, 1.75]}
        unit={80}
        ticks={false}
        label="The complex plane with a faint circle of radius 1 about 0. Three points sit on it: 1 on the positive real axis, i one step up the imaginary axis, and −1 on the negative real axis. A blue arrow curves a quarter turn anticlockwise from 1 to i, labelled times i. An orange arrow curves a further quarter turn from i to −1, also labelled times i. So multiplying 1 by i twice turns it half way round, to −1."
      >
        {({ px, py }) => {
          const o = { x: px(0), y: py(0) };
          const r = 80;
          return (
            <>
              <circle
                cx={o.x}
                cy={o.y}
                r={r}
                fill="none"
                stroke={MUTED}
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
              <Arc
                cx={o.x}
                cy={o.y}
                r={r}
                from={0.08}
                to={Math.PI / 2 - 0.08}
                color={BLUE}
              />
              <Arc
                cx={o.x}
                cy={o.y}
                r={r}
                from={Math.PI / 2 + 0.08}
                to={Math.PI - 0.08}
                color={ORANGE}
              />
              <Words
                x={px(0.82)}
                y={py(0.82)}
                anchor="start"
                size={14}
                color={BLUE}
              >
                × i
              </Words>
              <Words
                x={px(-0.82)}
                y={py(0.82)}
                anchor="end"
                size={14}
                color={ORANGE}
              >
                × i
              </Words>
              <Spot x={px(1)} y={py(0)} color={BLUE} />
              <Spot x={px(0)} y={py(1)} color={PURPLE} />
              <Spot x={px(-1)} y={py(0)} color={ORANGE} />
              <Words
                x={px(1) + 6}
                y={py(0) + 22}
                anchor="start"
                size={15}
                color={BLUE}
              >
                1
              </Words>
              <Words
                x={px(0) + 10}
                y={py(1) - 10}
                anchor="start"
                size={15}
                color={PURPLE}
              >
                i = 1 · i
              </Words>
              <Words
                x={px(-1) - 6}
                y={py(0) + 22}
                anchor="end"
                size={15}
                color={ORANGE}
              >
                −1 = i · i
              </Words>
            </>
          );
        }}
      </ComplexGrid>
    </Figure>
  );
}

/**
 * The four points 1, i, −1 and −i on the unit circle, each labelled with the powers of i that land
 * on it, and four quarter-turn arrows going round anticlockwise.
 */
export function PowersOfI({ caption }: { caption?: string }) {
  const turns = [0, 1, 2, 3].map((k) => (k * Math.PI) / 2);
  return (
    <Figure caption={caption}>
      <ComplexGrid
        x={[-2.75, 2.75]}
        y={[-1.6, 1.6]}
        unit={80}
        ticks={false}
        label="The complex plane with a circle of radius 1 about 0 and four points on it, joined by four quarter-turn arrows going anticlockwise. The point i is labelled i to the 1, i to the 5 and i to the 9. The point −1 is labelled i squared and i to the 6. The point −i is labelled i cubed and i to the 7. The point 1 is labelled i to the 0, i to the 4 and i to the 8."
      >
        {({ px, py }) => {
          const o = { x: px(0), y: py(0) };
          return (
            <>
              {turns.map((t) => (
                <Arc
                  key={t}
                  cx={o.x}
                  cy={o.y}
                  r={80}
                  from={t + 0.1}
                  to={t + Math.PI / 2 - 0.1}
                  color={PURPLE}
                  width={2}
                />
              ))}
              <Spot x={px(1)} y={py(0)} color={BLUE} />
              <Spot x={px(0)} y={py(1)} color={BLUE} />
              <Spot x={px(-1)} y={py(0)} color={BLUE} />
              <Spot x={px(0)} y={py(-1)} color={BLUE} />
              <Words
                x={px(1) + 8}
                y={py(0) - 12}
                anchor="start"
                size={14}
                color={BLUE}
              >
                1 = i⁰ = i⁴ = i⁸
              </Words>
              <Words x={px(0)} y={py(1) - 14} size={14} color={BLUE}>
                i = i¹ = i⁵ = i⁹
              </Words>
              <Words
                x={px(-1) - 8}
                y={py(0) - 12}
                anchor="end"
                size={14}
                color={BLUE}
              >
                −1 = i² = i⁶
              </Words>
              <Words x={px(0)} y={py(-1) + 24} size={14} color={BLUE}>
                −i = i³ = i⁷
              </Words>
              <Words
                x={px(0.8)}
                y={py(0.8)}
                anchor="start"
                size={13}
                color={PURPLE}
              >
                × i
              </Words>
            </>
          );
        }}
      </ComplexGrid>
    </Figure>
  );
}
