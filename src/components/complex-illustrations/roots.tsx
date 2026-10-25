import type { ReactNode } from "react";
import { Figure } from "../figure";
import { BLUE, ORANGE, PURPLE, Svg, Words } from "../illustrations";
import { MUTED, Spot } from "../function-illustrations/plot";

/**
 * Pictures for the guide Roots of complex numbers: a pizza cut into six equal slices, the two
 * square roots of −8i with the angle halved, the roots of unity for n = 3, 4 and 6 at the corners
 * of regular polygons, and the three cube roots of 8i. The complex plane is drawn with the grid
 * below, which labels its axes Re and Im and writes the numbers up the imaginary axis as multiples
 * of i. Every grid uses one scale across and up, so angles and lengths are true.
 */

type Range = readonly [number, number];
export type Scale = { px: (x: number) => number; py: (y: number) => number };

const CRUST = "#d6a35c";
const CRUST_EDGE = "#a16207";
const CHEESE = "#fde68a";
const PEPPERONI = "#b91c1c";

// a number with a proper minus sign, and a multiple of i for the imaginary axis
const real = (n: number) => (n < 0 ? `−${-n}` : `${n}`);
const imag = (n: number) => (n === 1 ? "i" : n === -1 ? "−i" : `${real(n)}i`);

const LEFT = 34;
const RIGHT = 30;
const TOP = 28;
const BOTTOM = 26;

/**
 * The complex plane for real parts x0 to x1 and imaginary parts y0 to y1, `unit` pixels to each
 * step of 1 both ways. Light lines at every whole number, numbers along the axes every `every`.
 */
export function ComplexPlot({
  x: [x0, x1],
  y: [y0, y1],
  unit,
  every = 1,
  label,
  children,
}: {
  x: Range;
  y: Range;
  unit: number;
  every?: number;
  label: string;
  children?: (s: Scale) => ReactNode;
}) {
  const width = LEFT + (x1 - x0) * unit + RIGHT;
  const height = TOP + (y1 - y0) * unit + BOTTOM;
  const px = (x: number) => LEFT + (x - x0) * unit;
  const py = (y: number) => TOP + (y1 - y) * unit;
  const whole = (lo: number, hi: number, gap = 1) => {
    const out: number[] = [];
    for (let k = Math.ceil(lo / gap - 1e-9); k * gap <= hi + 1e-9; k++)
      out.push(k * gap);
    return out;
  };

  return (
    <Svg width={width} height={height} label={label}>
      <g className="text-fd-border" stroke="currentColor" strokeWidth={1}>
        {whole(x0, x1).map((x) => (
          <line key={`v${x}`} x1={px(x)} x2={px(x)} y1={py(y0)} y2={py(y1)} />
        ))}
        {whole(y0, y1).map((y) => (
          <line key={`h${y}`} x1={px(x0)} x2={px(x1)} y1={py(y)} y2={py(y)} />
        ))}
      </g>
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
      <text x={px(x1) + 4} y={py(0) - 9} fontSize={13} fill="currentColor">
        Re
      </text>
      <text x={px(0) + 9} y={py(y1) - 8} fontSize={13} fill="currentColor">
        Im
      </text>
      <g
        fontSize={11}
        className="fill-fd-muted-foreground"
        stroke="var(--color-fd-card)"
        strokeWidth={3}
        paintOrder="stroke"
      >
        {whole(x0, x1, every)
          .filter((x) => x !== 0)
          .map((x) => (
            <text key={`tx${x}`} x={px(x)} y={py(0) + 15} textAnchor="middle">
              {real(x)}
            </text>
          ))}
        {whole(y0, y1, every)
          .filter((y) => y !== 0)
          .map((y) => (
            <text key={`ty${y}`} x={px(0) - 6} y={py(y) + 4} textAnchor="end">
              {imag(y)}
            </text>
          ))}
      </g>
      {children?.({ px, py })}
    </Svg>
  );
}

/**
 * An arc about the pixel point (cx, cy) of radius r, from angle a0 to angle a1 (radians,
 * anticlockwise on the page as in the plane), with an arrowhead at the end.
 */
export function AngleArc({
  cx,
  cy,
  r,
  a0,
  a1,
  color,
}: {
  cx: number;
  cy: number;
  r: number;
  a0: number;
  a1: number;
  color: string;
}) {
  const at = (a: number) => [cx + r * Math.cos(a), cy - r * Math.sin(a)];
  const [sx, sy] = at(a0);
  // stop the line a little short, so the arrowhead covers its end
  const [ex, ey] = at(a1 - 7 / r);
  const [hx, hy] = at(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  // the head points along the circle, anticlockwise
  const tx = -Math.sin(a1);
  const ty = -Math.cos(a1);
  const bx = hx! - tx * 9;
  const by = hy! - ty * 9;
  return (
    <g>
      <path
        d={`M ${sx} ${sy} A ${r} ${r} 0 ${large} 0 ${ex} ${ey}`}
        fill="none"
        stroke={color}
        strokeWidth={2}
      />
      <polygon
        points={`${hx},${hy} ${bx - ty * 4.5},${by + tx * 4.5} ${bx + ty * 4.5},${by - tx * 4.5}`}
        fill={color}
      />
    </g>
  );
}

/**
 * The opening scene: a round pizza seen from above, cut from the centre into six equal slices. A
 * dot marks the end of each cut on the crust, a dashed hexagon joins the dots, and an arrow outside
 * the crust shows the pizza turning by one slice.
 */
export function PizzaSlices({ caption }: { caption?: string }) {
  const cx = 180;
  const cy = 160;
  const R = 112;
  const at = (deg: number, r: number) => {
    const a = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy - r * Math.sin(a)] as const;
  };
  const ends = [0, 1, 2, 3, 4, 5].map((k) => at(60 * k, R));
  const toppings: [number, number, number][] = [];
  for (let k = 0; k < 6; k++)
    toppings.push(
      [60 * k + 30, 52, 11],
      [60 * k + 15, 84, 8],
      [60 * k + 45, 84, 8],
    );
  const arc = 136;
  const [lx, ly] = at(32, arc + 16);

  return (
    <Figure caption={caption}>
      <Svg
        width={420}
        height={320}
        label="A round pizza seen from above, cut through the centre into six equal slices, with slices of pepperoni on each. The six cuts end at six points spaced evenly round the crust, and a dashed hexagon joins them. An arrow outside the crust, labelled one slice, shows the pizza turning anticlockwise by a sixth of a full turn, which moves each cut onto the next."
      >
        <circle
          cx={cx}
          cy={cy}
          r={R}
          fill={CRUST}
          stroke={CRUST_EDGE}
          strokeWidth={2.5}
        />
        <circle cx={cx} cy={cy} r={R - 14} fill={CHEESE} />
        {toppings.map(([deg, r, size], i) => {
          const [x, y] = at(deg, r);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={size}
              fill={PEPPERONI}
              fillOpacity={0.85}
            />
          );
        })}
        {ends.map(([x, y], k) => (
          <line
            key={k}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke={CRUST_EDGE}
            strokeWidth={2.5}
          />
        ))}
        <polygon
          points={ends.map(([x, y]) => `${x},${y}`).join(" ")}
          fill="none"
          stroke={BLUE}
          strokeWidth={2}
          strokeDasharray="6 4"
        />
        {ends.map(([x, y], k) => (
          <Spot key={k} x={x} y={y} color={BLUE} />
        ))}
        <AngleArc
          cx={cx}
          cy={cy}
          r={arc}
          a0={(4 * Math.PI) / 180}
          a1={Math.PI / 3}
          color={PURPLE}
        />
        <Words x={lx + 4} y={ly} anchor="start" color={PURPLE}>
          one slice
        </Words>
      </Svg>
    </Figure>
  );
}

/**
 * The two square roots of z = −8i. The point z has length 8 and angle 3π/2; its root w = −2 + 2i
 * has length √8 and half the angle, 3π/4, and the other root −w = 2 − 2i sits opposite it.
 */
export function SquareRootsHalved({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <ComplexPlot
        x={[-5, 4]}
        y={[-9, 3]}
        unit={30}
        every={2}
        label="The complex plane with the point z = −8i, eight steps down the imaginary axis, and its two square roots, w = −2 + 2i up and to the left, and −w = 2 − 2i down and to the right, on opposite sides of 0. An arc of three quarters of a turn marks the angle 3π/2 of z, and a shorter arc marks the angle 3π/4 of w, half as much."
      >
        {({ px, py }) => (
          <>
            <line
              x1={px(0)}
              y1={py(0)}
              x2={px(0)}
              y2={py(-8)}
              stroke={PURPLE}
              strokeWidth={2.5}
            />
            <line
              x1={px(-2)}
              y1={py(2)}
              x2={px(2)}
              y2={py(-2)}
              stroke={BLUE}
              strokeWidth={2.5}
            />
            <AngleArc
              cx={px(0)}
              cy={py(0)}
              r={26}
              a0={0}
              a1={(3 * Math.PI) / 2}
              color={PURPLE}
            />
            <AngleArc
              cx={px(0)}
              cy={py(0)}
              r={48}
              a0={0}
              a1={(3 * Math.PI) / 4}
              color={BLUE}
            />
            <Words x={px(0) + 28} y={py(0) - 50} anchor="start" color={BLUE}>
              3π/4
            </Words>
            <Words x={px(0) - 30} y={py(0) + 40} anchor="end" color={PURPLE}>
              3π/2
            </Words>
            <Spot x={px(0)} y={py(-8)} color={PURPLE} />
            <Spot x={px(-2)} y={py(2)} color={BLUE} />
            <Spot x={px(2)} y={py(-2)} color={ORANGE} />
            <Words x={px(0) + 10} y={py(-8) + 5} anchor="start" color={PURPLE}>
              z = −8i
            </Words>
            <Words x={px(-2) - 9} y={py(2) + 5} anchor="end" color={BLUE}>
              w = −2 + 2i
            </Words>
            <Words x={px(2) + 2} y={py(-2) + 22} anchor="middle" color={ORANGE}>
              −w = 2 − 2i
            </Words>
          </>
        )}
      </ComplexPlot>
    </Figure>
  );
}

const SUB = "₀₁₂₃₄₅₆₇₈₉";

/** one panel of RootPolygons: the n-th roots of unity on the unit circle, joined in order */
function UnityPanel({ n }: { n: number }) {
  const roots = Array.from({ length: n }, (_, k) => {
    const a = (2 * Math.PI * k) / n;
    return [Math.cos(a), Math.sin(a), a] as const;
  });
  return (
    <div className="w-full max-w-[250px]">
      <ComplexPlot
        x={[-1.5, 1.5]}
        y={[-1.5, 1.5]}
        unit={62}
        every={2}
        label={`The unit circle in the complex plane with the ${n} numbers whose ${n}th power is 1 marked on it, equally spaced, one of them at 1, and joined in order to make a regular polygon with ${n} corners.`}
      >
        {({ px, py }) => (
          <>
            <circle
              cx={px(0)}
              cy={py(0)}
              r={62}
              fill="none"
              stroke={MUTED}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
            <polygon
              points={roots.map(([x, y]) => `${px(x)},${py(y)}`).join(" ")}
              fill={BLUE}
              fillOpacity={0.08}
              stroke={BLUE}
              strokeWidth={2.5}
            />
            {roots.map(([x, y, a], k) => (
              <g key={k}>
                <Spot x={px(x)} y={py(y)} color={k === 0 ? ORANGE : BLUE} />
                <Words
                  x={px(1.32 * Math.cos(a))}
                  y={py(1.32 * Math.sin(a)) + 5}
                  color={k === 0 ? ORANGE : BLUE}
                  size={16}
                >
                  ω{SUB[k]}
                </Words>
              </g>
            ))}
          </>
        )}
      </ComplexPlot>
      <p className="mt-1 text-center text-sm font-medium">n = {n}</p>
    </div>
  );
}

/** The roots of unity for n = 3, 4 and 6, side by side, each the corners of a regular polygon. */
export function RootPolygons({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption} className="flex flex-wrap justify-center gap-4">
      <UnityPanel n={3} />
      <UnityPanel n={4} />
      <UnityPanel n={6} />
    </Figure>
  );
}

/**
 * The cube roots of z = 8i. The point z is 8 up the imaginary axis; its three cube roots √3 + i,
 * −√3 + i and −2i lie on the circle of radius 2 at the angles π/6, 5π/6 and 3π/2, the corners of
 * an equilateral triangle.
 */
export function CubeRootsEightI({ caption }: { caption?: string }) {
  const s3 = Math.sqrt(3);
  const roots: [number, number, string][] = [
    [s3, 1, "√3 + i"],
    [-s3, 1, "−√3 + i"],
    [0, -2, "−2i"],
  ];
  return (
    <Figure caption={caption}>
      <ComplexPlot
        x={[-4, 4]}
        y={[-3, 9]}
        unit={23}
        every={4}
        label="The complex plane with the point z = 8i, eight steps up the imaginary axis, and its three cube roots on a dashed circle of radius 2 about 0: √3 + i up and to the right, −√3 + i up and to the left, and −2i straight down. They are joined into an equilateral triangle. A short arc marks the angle π/6 of √3 + i, a third of the angle π/2 of z."
      >
        {({ px, py }) => (
          <>
            <circle
              cx={px(0)}
              cy={py(0)}
              r={2 * 23}
              fill="none"
              stroke={MUTED}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
            <polygon
              points={roots.map(([x, y]) => `${px(x)},${py(y)}`).join(" ")}
              fill={BLUE}
              fillOpacity={0.08}
              stroke={BLUE}
              strokeWidth={2.5}
            />
            <line
              x1={px(0)}
              y1={py(0)}
              x2={px(0)}
              y2={py(8)}
              stroke={PURPLE}
              strokeWidth={2.5}
            />
            <AngleArc
              cx={px(0)}
              cy={py(0)}
              r={60}
              a0={0}
              a1={Math.PI / 6}
              color={ORANGE}
            />
            <Words x={px(0) + 66} y={py(0) - 12} anchor="start" color={ORANGE}>
              π/6
            </Words>
            <Spot x={px(0)} y={py(8)} color={PURPLE} />
            <Words x={px(0) + 10} y={py(8) + 5} anchor="start" color={PURPLE}>
              z = 8i
            </Words>
            {roots.map(([x, y, name], k) => (
              <g key={k}>
                <Spot x={px(x)} y={py(y)} color={BLUE} />
                <Words
                  x={k === 0 ? px(x) + 8 : k === 1 ? px(x) - 8 : px(x) + 10}
                  y={k === 2 ? py(y) + 18 : py(y) - 10}
                  anchor={k === 1 ? "end" : "start"}
                  color={BLUE}
                >
                  {name}
                </Words>
              </g>
            ))}
          </>
        )}
      </ComplexPlot>
    </Figure>
  );
}
