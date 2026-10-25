import type { ReactNode } from "react";
import { Figure } from "../figure";
import {
  Arrow,
  GREEN,
  MUTED,
  Plot,
  Spot,
  type Scale,
} from "../function-illustrations/plot";
import { BLUE, ORANGE, PURPLE, Svg, Words } from "../illustrations";

/**
 * Pictures for the guide Determinants of order 2: a photo printed slanted and printed stretched,
 * the parallelogram on (3, 1) and (1, 2) inside a 4 by 3 rectangle with the pieces around it, the
 * same parallelogram before and after a turn that lays its first side along the x-axis, the two
 * orders of the columns turning opposite ways, and a slide of one side that keeps the area.
 */

const SKY = "#bae6fd";
const SUN = "#facc15";
const HILL = "#4ade80";
const HILL_DARK = "#15803d";

type P = readonly [number, number];

/** points in the svg `points` form, from units through a scale */
const pts = (corners: P[], { px, py }: Scale) =>
  corners.map(([x, y]) => `${px(x).toFixed(1)},${py(y).toFixed(1)}`).join(" ");

/** a filled polygon given in units */
function Shape({
  corners,
  s,
  color,
  opacity = 0.25,
  dashed = false,
  stroke = true,
}: {
  corners: P[];
  s: Scale;
  color: string;
  opacity?: number;
  dashed?: boolean;
  stroke?: boolean;
}) {
  return (
    <polygon
      points={pts(corners, s)}
      fill={color}
      fillOpacity={opacity}
      stroke={stroke ? color : "none"}
      strokeWidth={2.25}
      strokeDasharray={dashed ? "6 4" : undefined}
      strokeLinejoin="round"
    />
  );
}

/** an arc about O of radius r units from angle t0 to angle t1, with an arrowhead at t1 */
function TurnArc({
  r,
  t0,
  t1,
  s,
  color,
}: {
  r: number;
  t0: number;
  t1: number;
  s: Scale;
  color: string;
}) {
  const n = 40;
  const at = (t: number) => ({
    x: s.px(r * Math.cos(t)),
    y: s.py(r * Math.sin(t)),
  });
  const line = Array.from({ length: n + 1 }, (_, i) =>
    at(t0 + ((t1 - t0) * i) / n),
  );
  const end = line[n]!;
  const before = line[n - 5]!;
  const h = Math.atan2(end.y - before.y, end.x - before.x);
  const head = [0, 0.45, -0.45].map((da, i) => {
    const back = i === 0 ? 0 : 10;
    return `${end.x - back * Math.cos(h + da)},${end.y - back * Math.sin(h + da)}`;
  });
  return (
    <g>
      <polyline
        points={line.map((q) => `${q.x},${q.y}`).join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
      />
      <polygon points={head.join(" ")} fill={color} />
    </g>
  );
}

/** two pictures side by side, each taking half the width on a wide screen */
function Pair({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center">
      <div className="w-full min-w-0 sm:w-1/2">{left}</div>
      <div className="w-full min-w-0 sm:w-1/2">{right}</div>
    </div>
  );
}

/**
 * A small landscape photo (sky, sun, a green hill) printed three ways: as it is, slanted so that each
 * row slides further right the higher it is, and stretched to twice the width.
 */
export function PhotoPrints({ caption }: { caption?: string }) {
  const W = 110;
  const H = 85;
  const bottom = 128;
  const panels: { x0: number; wide: number; slant: number; name: string }[] = [
    { x0: 24, wide: 1, slant: 0, name: "the photo" },
    { x0: 170, wide: 1, slant: 0.45, name: "slanted: same ink" },
    { x0: 354, wide: 2, slant: 0, name: "twice as wide: twice the ink" },
  ];
  // the photo in its own units: u across and v up, both from 0 to 1
  const hill: P[] = [
    [0, 0],
    ...Array.from(
      { length: 21 },
      (_, i) => [i / 20, 0.18 + 0.32 * Math.sin((Math.PI * i) / 20) ** 2] as P,
    ),
    [1, 0],
  ];
  const sun: P[] = Array.from({ length: 28 }, (_, i) => {
    const t = (2 * Math.PI * i) / 28;
    return [0.72 + 0.1 * Math.cos(t), 0.74 + 0.13 * Math.sin(t)] as P;
  });
  const frame: P[] = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  return (
    <Figure caption={caption}>
      <Svg
        width={600}
        height={190}
        label="Three prints of the same small landscape photo, with a sun in a blue sky over a green hill. The first is the photo as it is. The second is slanted: each row of the picture is slid further right the higher up it is, so the rectangle becomes a parallelogram of the same width and height, and it uses the same amount of ink. The third is stretched to twice the width and the same height, and it uses twice the ink."
      >
        {panels.map(({ x0, wide, slant, name }) => {
          const map = (corners: P[]) =>
            corners
              .map(
                ([u, v]) =>
                  `${(x0 + W * wide * u + slant * H * v).toFixed(1)},${(bottom - H * v).toFixed(1)}`,
              )
              .join(" ");
          const middle = x0 + (W * wide + slant * H) / 2;
          return (
            <g key={name}>
              <polygon points={map(frame)} fill={SKY} />
              <polygon points={map(sun)} fill={SUN} />
              <polygon points={map(hill)} fill={HILL} stroke={HILL_DARK} />
              <polygon
                points={map(frame)}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinejoin="round"
              />
              <Words x={middle} y={bottom + 30} size={14}>
                {name}
              </Words>
            </g>
          );
        })}
      </Svg>
    </Figure>
  );
}

/**
 * The parallelogram on A¹ = (3, 1) and A² = (1, 2), with corners O, (3, 1), (4, 3) and (1, 2), inside
 * the rectangle from (0, 0) to (4, 3). The six pieces of the rectangle outside it are shaded and
 * labelled with their areas: four triangles (3/2, 1, 3/2, 1) and two unit squares.
 */
export function BoxAndSubtract({ caption }: { caption?: string }) {
  const pieces: { corners: P[]; label: string; at: P }[] = [
    {
      corners: [
        [0, 0],
        [3, 0],
        [3, 1],
      ],
      label: "3/2",
      at: [2, 0.36],
    },
    {
      corners: [
        [3, 0],
        [4, 0],
        [4, 1],
        [3, 1],
      ],
      label: "1",
      at: [3.5, 0.5],
    },
    {
      corners: [
        [3, 1],
        [4, 1],
        [4, 3],
      ],
      label: "1",
      at: [3.67, 1.67],
    },
    {
      corners: [
        [1, 2],
        [4, 3],
        [1, 3],
      ],
      label: "3/2",
      at: [2, 2.64],
    },
    {
      corners: [
        [0, 2],
        [1, 2],
        [1, 3],
        [0, 3],
      ],
      label: "1",
      at: [0.5, 2.5],
    },
    {
      corners: [
        [0, 0],
        [1, 2],
        [0, 2],
      ],
      label: "1",
      at: [0.33, 1.33],
    },
  ];
  return (
    <Figure caption={caption}>
      <Plot
        id="box-and-subtract"
        x={[0, 4.5]}
        y={[0, 3.5]}
        unit={72}
        curves={[]}
        label="On a grid, the parallelogram with corners O, A¹ = (3, 1), A¹ + A² = (4, 3) and A² = (1, 2), shaded orange and marked with area 5, sits inside the rectangle from (0, 0) to (4, 3). The rest of the rectangle is cut into six grey pieces, labelled with their areas: a triangle of area 3/2 along the bottom, a unit square in the bottom-right corner, a triangle of area 1 on the right, a triangle of area 3/2 along the top, a unit square in the top-left corner and a triangle of area 1 on the left."
      >
        {(s) => (
          <>
            {pieces.map((p, i) => (
              <Shape
                key={i}
                corners={p.corners}
                s={s}
                color={MUTED}
                opacity={0.22}
              />
            ))}
            <Shape
              corners={[
                [0, 0],
                [3, 1],
                [4, 3],
                [1, 2],
              ]}
              s={s}
              color={ORANGE}
              opacity={0.3}
            />
            {pieces.map((p, i) => (
              <Words key={i} x={s.px(p.at[0])} y={s.py(p.at[1]) + 5} size={14}>
                {p.label}
              </Words>
            ))}
            <Words x={s.px(2)} y={s.py(1.5) + 6} color={ORANGE} size={18}>
              5
            </Words>
            <Spot x={s.px(3)} y={s.py(1)} color={BLUE} />
            <Spot x={s.px(1)} y={s.py(2)} color={PURPLE} />
            <Words
              x={s.px(3) + 10}
              y={s.py(1) + 20}
              anchor="start"
              color={BLUE}
              size={14}
            >
              A¹
            </Words>
            <Words
              x={s.px(1) - 10}
              y={s.py(2) - 8}
              anchor="end"
              color={PURPLE}
              size={14}
            >
              A²
            </Words>
          </>
        )}
      </Plot>
    </Figure>
  );
}

/**
 * Left: the parallelogram on A¹ = (3, 1) and A² = (1, 2). Right: the same parallelogram after the
 * turn about O that lays A¹ along the positive x-axis, at (r, 0) with r = √10. The diagonal from
 * (r, 0) to the turned A² cuts it into two triangles, each with base r and height q = det A ÷ r.
 */
export function TurnedParallelogram({ caption }: { caption?: string }) {
  const r = Math.sqrt(10);
  const q = 5 / r;
  const p = 5 / r;
  return (
    <Figure caption={caption}>
      <Pair
        left={
          <Plot
            id="turned-before"
            x={[-0.5, 4.5]}
            y={[-0.5, 3.5]}
            unit={44}
            curves={[]}
            label="Before the turn: the parallelogram with corners O, A¹ = (3, 1), A¹ + A² = (4, 3) and A² = (1, 2), shaded orange."
          >
            {(s) => (
              <>
                <Shape
                  corners={[
                    [0, 0],
                    [3, 1],
                    [4, 3],
                    [1, 2],
                  ]}
                  s={s}
                  color={ORANGE}
                />
                <Arrow
                  x1={s.px(0)}
                  y1={s.py(0)}
                  x2={s.px(3)}
                  y2={s.py(1)}
                  color={BLUE}
                />
                <Arrow
                  x1={s.px(0)}
                  y1={s.py(0)}
                  x2={s.px(1)}
                  y2={s.py(2)}
                  color={PURPLE}
                />
                <Words
                  x={s.px(3) + 8}
                  y={s.py(1) + 18}
                  anchor="start"
                  color={BLUE}
                  size={14}
                >
                  A¹
                </Words>
                <Words
                  x={s.px(1) - 8}
                  y={s.py(2) - 6}
                  anchor="end"
                  color={PURPLE}
                  size={14}
                >
                  A²
                </Words>
              </>
            )}
          </Plot>
        }
        right={
          <Plot
            id="turned-after"
            x={[-0.5, 5.5]}
            y={[-0.5, 3.5]}
            unit={44}
            curves={[]}
            label="After the turn: the same parallelogram with its first side along the x-axis, from O to (r, 0) where r = √10 ≈ 3.16. The turned A² is at about (1.58, 1.58). A dashed diagonal from (r, 0) to the turned A² cuts the parallelogram into two triangles, each with base r. A dashed green line drops from the turned A² to the x-axis and is labelled q, the height of both triangles."
          >
            {(s) => (
              <>
                <Shape
                  corners={[
                    [0, 0],
                    [r, 0],
                    [p, q],
                  ]}
                  s={s}
                  color={ORANGE}
                  stroke={false}
                />
                <Shape
                  corners={[
                    [r, 0],
                    [r + p, q],
                    [p, q],
                  ]}
                  s={s}
                  color={ORANGE}
                  opacity={0.4}
                  stroke={false}
                />
                <polygon
                  points={pts(
                    [
                      [0, 0],
                      [r, 0],
                      [r + p, q],
                      [p, q],
                    ],
                    s,
                  )}
                  fill="none"
                  stroke={ORANGE}
                  strokeWidth={2.25}
                  strokeLinejoin="round"
                />
                <line
                  x1={s.px(r)}
                  y1={s.py(0)}
                  x2={s.px(p)}
                  y2={s.py(q)}
                  stroke="currentColor"
                  strokeWidth={1.75}
                  strokeDasharray="5 4"
                />
                <line
                  x1={s.px(p)}
                  y1={s.py(q)}
                  x2={s.px(p)}
                  y2={s.py(0)}
                  stroke={GREEN}
                  strokeWidth={2.5}
                  strokeDasharray="5 4"
                />
                <Arrow
                  x1={s.px(0)}
                  y1={s.py(0)}
                  x2={s.px(r)}
                  y2={s.py(0)}
                  color={BLUE}
                />
                <Arrow
                  x1={s.px(0)}
                  y1={s.py(0)}
                  x2={s.px(p)}
                  y2={s.py(q)}
                  color={PURPLE}
                />
                <Words
                  x={s.px(r / 2) + 14}
                  y={s.py(0) + 34}
                  color={BLUE}
                  size={14}
                >
                  (r, 0)
                </Words>
                <Words
                  x={s.px(p) - 8}
                  y={s.py(q) - 8}
                  anchor="end"
                  color={PURPLE}
                  size={14}
                >
                  (p, q)
                </Words>
                <Words
                  x={s.px(p) + 7}
                  y={s.py(q / 2) + 5}
                  anchor="start"
                  color={GREEN}
                  size={14}
                >
                  q
                </Words>
              </>
            )}
          </Plot>
        }
      />
    </Figure>
  );
}

/**
 * Left: A¹ = (3, 1) and A² = (1, 2), with an arc turning anticlockwise from A¹ to A², and the
 * determinant 5. Right: the columns the other way round, A¹ = (1, 2) and A² = (3, 1), with an arc
 * turning clockwise, and the determinant −5.
 */
export function TwoOrientations({ caption }: { caption?: string }) {
  const panel = (
    id: string,
    first: P,
    second: P,
    det: string,
    words: string,
  ) => (
    <Plot
      id={id}
      x={[-0.5, 4.5]}
      y={[-0.5, 3.5]}
      unit={44}
      curves={[]}
      label={`The parallelogram on A¹ = (${first.join(", ")}) and A² = (${second.join(", ")}). An arc near O turns ${words} from A¹ to A². The determinant is ${det}.`}
    >
      {(s) => (
        <>
          <Shape
            corners={[
              [0, 0],
              first,
              [first[0] + second[0], first[1] + second[1]],
              second,
            ]}
            s={s}
            color={ORANGE}
            opacity={0.2}
          />
          <Arrow
            x1={s.px(0)}
            y1={s.py(0)}
            x2={s.px(first[0])}
            y2={s.py(first[1])}
            color={BLUE}
          />
          <Arrow
            x1={s.px(0)}
            y1={s.py(0)}
            x2={s.px(second[0])}
            y2={s.py(second[1])}
            color={PURPLE}
          />
          <TurnArc
            r={1.1}
            t0={Math.atan2(first[1], first[0])}
            t1={Math.atan2(second[1], second[0])}
            s={s}
            color={GREEN}
          />
          <Words
            x={s.px(first[0]) + 8}
            y={s.py(first[1]) + (first[1] < second[1] ? 18 : -6)}
            anchor="start"
            color={BLUE}
            size={14}
          >
            A¹
          </Words>
          <Words
            x={s.px(second[0]) + 8}
            y={s.py(second[1]) + (second[1] < first[1] ? 18 : -6)}
            anchor="start"
            color={PURPLE}
            size={14}
          >
            A²
          </Words>
          <Words x={s.px(2.6)} y={s.py(3.1)} size={15}>
            {`det = ${det}`}
          </Words>
        </>
      )}
    </Plot>
  );
  return (
    <Figure caption={caption}>
      <Pair
        left={panel("orient-plus", [3, 1], [1, 2], "5", "anticlockwise")}
        right={panel("orient-minus", [1, 2], [3, 1], "−5", "clockwise")}
      />
    </Figure>
  );
}

/**
 * The parallelogram on A¹ = (3, 1) and A² = (1, 2) (blue, faint) and the parallelogram on A¹ and
 * A² + A¹ = (4, 3) (orange). Both stand on the side from O to A¹; the far side slides along the
 * dashed line through A² parallel to A¹, so the height and the area stay the same.
 */
export function ShearKeepsArea({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <Plot
        id="shear-keeps-area"
        x={[-0.5, 7.5]}
        y={[-0.5, 4.5]}
        unit={46}
        curves={[]}
        label="Two parallelograms on the same side from O to A¹ = (3, 1). The first, faint blue, has its other corners at (4, 3) and A² = (1, 2). The second, orange, has its other corners at (7, 4) and A² + A¹ = (4, 3). A dashed line through A² in the direction of A¹ carries the far side of both, so they have the same height above the side OA¹, and both have area 5."
      >
        {(s) => (
          <>
            <line
              x1={s.px(1 - 1.5)}
              y1={s.py(2 - 0.5)}
              x2={s.px(1 + 6.5 * 1)}
              y2={s.py(2 + 6.5 / 3)}
              stroke="currentColor"
              strokeOpacity={0.5}
              strokeWidth={1.75}
              strokeDasharray="6 5"
            />
            <Shape
              corners={[
                [0, 0],
                [3, 1],
                [4, 3],
                [1, 2],
              ]}
              s={s}
              color={BLUE}
              opacity={0.15}
              dashed
            />
            <Shape
              corners={[
                [0, 0],
                [3, 1],
                [7, 4],
                [4, 3],
              ]}
              s={s}
              color={ORANGE}
              opacity={0.25}
            />
            <Spot x={s.px(3)} y={s.py(1)} color={BLUE} />
            <Spot x={s.px(1)} y={s.py(2)} color={PURPLE} />
            <Spot x={s.px(4)} y={s.py(3)} color={ORANGE} />
            <Words
              x={s.px(3) + 10}
              y={s.py(1) + 18}
              anchor="start"
              color={BLUE}
              size={14}
            >
              A¹
            </Words>
            <Words
              x={s.px(1) - 10}
              y={s.py(2) + 4}
              anchor="end"
              color={PURPLE}
              size={14}
            >
              A²
            </Words>
            <Words
              x={s.px(4) - 6}
              y={s.py(3) - 12}
              anchor="end"
              color={ORANGE}
              size={14}
            >
              A² + A¹
            </Words>
          </>
        )}
      </Plot>
    </Figure>
  );
}
