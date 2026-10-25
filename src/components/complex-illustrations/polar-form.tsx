import { Figure } from "../figure";
import { ComplexGrid } from "./meeting-i";
import { BLUE, ORANGE, Words } from "../illustrations";
import {
  GREEN,
  MUTED,
  Spot,
  type Pt,
  type Scale,
} from "../function-illustrations/plot";

/**
 * Pictures for the guide Multiplying is turning. A flag multiplied by i, and by i again, turning a
 * quarter turn about 0 each time; and a triangle multiplied by 1 + i, drawn as a turn by π/4 and
 * then a zoom by √2. The point x + yi sits at (x, y), and every grid has one scale across and up.
 */

/** the product of two complex numbers, each given as a pair (real part, imaginary part) */
const times = ([a, b]: Pt, [c, d]: Pt): Pt => [a * c - b * d, a * d + b * c];

/** a filled shape through the given points, in pixels */
function Shape({
  points,
  s,
  color,
  dashed = false,
  fill = true,
}: {
  points: Pt[];
  s: Scale;
  color: string;
  dashed?: boolean;
  fill?: boolean;
}) {
  return (
    <polygon
      points={points.map(([x, y]) => `${s.px(x)},${s.py(y)}`).join(" ")}
      fill={fill ? color : "none"}
      fillOpacity={0.22}
      stroke={color}
      strokeWidth={dashed ? 2 : 2.5}
      strokeDasharray={dashed ? "6 4" : undefined}
      strokeLinejoin="round"
    />
  );
}

/**
 * An arc about 0 of radius `r` (in units) from angle `from` to angle `to` (radians), anticlockwise,
 * with an arrowhead at its end.
 */
function TurnArrow({
  r,
  from,
  to,
  s,
  color,
}: {
  r: number;
  from: number;
  to: number;
  s: Scale;
  color: string;
}) {
  const at = (t: number) => ({
    x: s.px(r * Math.cos(t)),
    y: s.py(r * Math.sin(t)),
  });
  const start = at(from);
  const end = at(to);
  const radius = s.px(r) - s.px(0);
  // the arrowhead points along the circle, anticlockwise, at the end of the arc
  const ux = -Math.sin(to);
  const uy = -Math.cos(to);
  const bx = end.x - ux * 11;
  const by = end.y - uy * 11;
  return (
    <g>
      <path
        d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 0 0 ${end.x - ux * 6} ${end.y - uy * 6}`}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeDasharray="5 4"
      />
      <polygon
        points={`${end.x},${end.y} ${bx - uy * 5},${by + ux * 5} ${bx + uy * 5},${by - ux * 5}`}
        fill={color}
      />
    </g>
  );
}

// the flag: a pole from 1 up to 1 + 3i, and a triangle with its tip at z = 3 + 2i
const POLE: Pt[] = [
  [1, 0],
  [1, 3],
];
const FLAG: Pt[] = [
  [1, 3],
  [3, 2],
  [1, 1],
];

export function QuarterTurns({ caption }: { caption?: string }) {
  const turns = [
    { by: [1, 0] as Pt, color: BLUE },
    { by: [0, 1] as Pt, color: ORANGE },
    { by: [-1, 0] as Pt, color: GREEN },
  ];
  const angle = Math.atan2(2, 3);
  const r = Math.hypot(3, 2);
  return (
    <Figure caption={caption}>
      <ComplexGrid
        x={[-4, 4]}
        y={[-4, 4]}
        unit={40}
        label="A flag on a grid, with its pole from 1 up to 1 + 3i and the tip of the flag at z = 3 + 2i. A copy turned a quarter turn anticlockwise about 0 has its tip at iz = −2 + 3i, and a copy turned a half turn has its tip at −z = −3 − 2i. Dashed arcs about 0, each marked times i, lead from one tip to the next."
      >
        {(s) => (
          <>
            {turns.map(({ by, color }, k) => {
              const pole = POLE.map((p) => times(by, p));
              return (
                <g key={k}>
                  <line
                    x1={s.px(pole[0]![0])}
                    y1={s.py(pole[0]![1])}
                    x2={s.px(pole[1]![0])}
                    y2={s.py(pole[1]![1])}
                    stroke={color}
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                  <Shape
                    points={FLAG.map((p) => times(by, p))}
                    s={s}
                    color={color}
                  />
                </g>
              );
            })}
            <TurnArrow
              r={r}
              from={angle + 0.08}
              to={angle + Math.PI / 2 - 0.08}
              s={s}
              color={MUTED}
            />
            <TurnArrow
              r={r}
              from={angle + Math.PI / 2 + 0.08}
              to={angle + Math.PI - 0.08}
              s={s}
              color={MUTED}
            />
            <Words x={s.px(0.85)} y={s.py(3.75)} anchor="start" size={14}>
              × i
            </Words>
            <Words x={s.px(-3.3)} y={s.py(0.35)} anchor="start" size={14}>
              × i
            </Words>
            {turns.map(({ by, color }, k) => {
              const [x, y] = times(by, [3, 2]);
              return <Spot key={k} x={s.px(x)} y={s.py(y)} color={color} />;
            })}
            <Words x={s.px(3.5)} y={s.py(0.5)} anchor="end" color={BLUE}>
              z = 3 + 2i
            </Words>
            <Words x={s.px(-2)} y={s.py(3.72)} color={ORANGE}>
              iz = −2 + 3i
            </Words>
            <Words x={s.px(-2.3)} y={s.py(-3.45)} color={GREEN}>
              −z = −3 − 2i
            </Words>
          </>
        )}
      </ComplexGrid>
    </Figure>
  );
}

const TRIANGLE: Pt[] = [
  [2, 0],
  [3, 1],
  [1, 2],
];

export function TurnThenZoom({ caption }: { caption?: string }) {
  const half = Math.SQRT1_2;
  const turned = TRIANGLE.map((p) => times([half, half], p));
  const zoomed = TRIANGLE.map((p) => times([1, 1], p));
  return (
    <Figure caption={caption}>
      <ComplexGrid
        x={[-2, 4]}
        y={[-1, 5]}
        unit={52}
        label="A blue triangle with corners 2, 3 + i and 1 + 2i. A dashed copy of it is turned by π/4 about 0, keeping its size. An orange copy, the dashed one zoomed by √2 about 0, has corners 2 + 2i, 2 + 4i and −1 + 3i."
      >
        {(s) => (
          <>
            <Shape points={TRIANGLE} s={s} color={BLUE} />
            <Shape points={turned} s={s} color={MUTED} dashed fill={false} />
            <Shape points={zoomed} s={s} color={ORANGE} />
            {[
              ...TRIANGLE.map((p) => ({ p, c: BLUE })),
              ...zoomed.map((p) => ({ p, c: ORANGE })),
            ].map(({ p: [x, y], c }, k) => (
              <Spot key={k} x={s.px(x)} y={s.py(y)} color={c} />
            ))}
            <Words x={s.px(1.6)} y={s.py(0.15)} anchor="end" color={BLUE}>
              2
            </Words>
            <Words x={s.px(3.15)} y={s.py(0.85)} anchor="start" color={BLUE}>
              3 + i
            </Words>
            <Words x={s.px(0.85)} y={s.py(1.15)} anchor="end" color={BLUE}>
              1 + 2i
            </Words>
            <Words x={s.px(2.15)} y={s.py(2.15)} anchor="start" color={ORANGE}>
              2 + 2i
            </Words>
            <Words x={s.px(2.15)} y={s.py(4.1)} anchor="start" color={ORANGE}>
              2 + 4i
            </Words>
            <Words x={s.px(-1)} y={s.py(3.3)} color={ORANGE}>
              −1 + 3i
            </Words>
          </>
        )}
      </ComplexGrid>
    </Figure>
  );
}
