import type { ReactNode } from "react";
import { Figure } from "../figure";
import {
  BLUE,
  ORANGE,
  PENCIL,
  PURPLE,
  Svg,
  WOOD_DARK,
  Words,
} from "../illustrations";
import { Arrow, GREEN, MUTED, Spot } from "../function-illustrations/plot";
import { ComplexGrid } from "./meeting-i";

/**
 * Pictures for the guide The complex plane. A treasure map whose two clues add up to one walk;
 * then complex numbers as points: a few numbers on the plane, a sum as a parallelogram, a
 * difference as the step from one point to another, the conjugate as a flip in the real axis, and
 * the absolute value as a distance from 0, with the circle of numbers whose absolute value is 5.
 */

const PARCHMENT = "#f1e2c0";
const PARCHMENT_EDGE = "#b7804a";
const PARCHMENT_LINE = "#dcc59a";
const LEAF = "#4d7c3a";
const LEAF_LIGHT = "#8cc46f";
const RED = "#dc2626";

/** writing on the map, in ink that stays dark in either theme, with a halo of parchment */
function Ink({
  x,
  y,
  children,
  anchor = "middle",
  color = PENCIL,
  size = 14,
}: {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: "start" | "middle" | "end";
  color?: string;
  size?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      fontWeight={600}
      fill={color}
      stroke={PARCHMENT}
      strokeWidth={4}
      strokeLinejoin="round"
      paintOrder="stroke"
    >
      {children}
    </text>
  );
}

/**
 * The opening scene: a treasure map with a grid, 40 pixels to a pace. From the oak, the first clue
 * walks 4 paces east and 1 north (blue), the second walks 1 west and 3 north (orange), and a dashed
 * line goes straight from the oak to the treasure, 3 east and 4 north, 5 paces away.
 */
export function TreasureMap({ caption }: { caption?: string }) {
  const pace = 40;
  const oak = { x: 140, y: 262 };
  const at = (e: number, n: number) => ({
    x: oak.x + e * pace,
    y: oak.y - n * pace,
  });
  const first = at(4, 1);
  const treasure = at(3, 4);
  const columns = Array.from({ length: 12 }, (_, i) => 60 + i * pace);
  const rows = Array.from({ length: 7 }, (_, i) => 62 + i * pace);

  return (
    <Figure caption={caption}>
      <Svg
        width={560}
        height={340}
        label="A treasure map on parchment with a square grid. An oak tree stands near the bottom left. A blue arrow goes from the foot of the oak 4 squares east and 1 square north. From there an orange arrow goes 1 square west and 3 squares north, to a red cross marking the treasure. A dashed purple line runs straight from the oak to the treasure, labelled 5 paces. A small compass in the top right corner shows north up and east to the right."
      >
        <rect
          x={20}
          y={22}
          width={520}
          height={296}
          rx={10}
          fill={PARCHMENT}
          stroke={PARCHMENT_EDGE}
          strokeWidth={2.5}
        />
        <g stroke={PARCHMENT_LINE} strokeWidth={1}>
          {columns.map((x) => (
            <line key={`c${x}`} x1={x} x2={x} y1={30} y2={310} />
          ))}
          {rows.map((y) => (
            <line key={`r${y}`} x1={28} x2={532} y1={y} y2={y} />
          ))}
        </g>

        {/* the oak, its foot at the grid point the clues start from */}
        <rect
          x={oak.x - 6}
          y={oak.y - 30}
          width={12}
          height={30}
          fill={WOOD_DARK}
        />
        <circle cx={oak.x - 15} cy={oak.y - 38} r={15} fill={LEAF_LIGHT} />
        <circle cx={oak.x + 15} cy={oak.y - 38} r={15} fill={LEAF_LIGHT} />
        <circle cx={oak.x} cy={oak.y - 52} r={20} fill={LEAF} />
        <Ink x={oak.x - 26} y={oak.y + 5} anchor="end">
          oak
        </Ink>

        {/* the straight line, then the two clues on top */}
        <line
          x1={oak.x}
          y1={oak.y}
          x2={treasure.x}
          y2={treasure.y}
          stroke={PURPLE}
          strokeWidth={2.5}
          strokeDasharray="7 5"
        />
        <Arrow x1={oak.x} y1={oak.y} x2={first.x} y2={first.y} color={BLUE} />
        <Arrow
          x1={first.x}
          y1={first.y}
          x2={treasure.x}
          y2={treasure.y}
          color={ORANGE}
        />
        <circle cx={oak.x} cy={oak.y} r={5} fill={PENCIL} />

        {/* the treasure */}
        <g stroke={RED} strokeWidth={4} strokeLinecap="round">
          <line
            x1={treasure.x - 10}
            y1={treasure.y - 10}
            x2={treasure.x + 10}
            y2={treasure.y + 10}
          />
          <line
            x1={treasure.x - 10}
            y1={treasure.y + 10}
            x2={treasure.x + 10}
            y2={treasure.y - 10}
          />
        </g>
        <Ink x={treasure.x + 16} y={treasure.y - 12} anchor="start" color={RED}>
          treasure
        </Ink>

        <Ink x={232} y={268} color={BLUE}>
          4 east, 1 north
        </Ink>
        <Ink x={first.x + 6} y={168} anchor="start" color={ORANGE}>
          1 west, 3 north
        </Ink>
        <Ink x={186} y={170} anchor="end" color={PURPLE}>
          5 paces
        </Ink>

        {/* a compass */}
        <g stroke={PENCIL} strokeWidth={2}>
          <line x1={470} y1={110} x2={470} y2={66} />
          <line x1={470} y1={110} x2={514} y2={110} />
        </g>
        <polygon points="470,58 465,70 475,70" fill={PENCIL} />
        <polygon points="522,110 510,105 510,115" fill={PENCIL} />
        <Ink x={470} y={52}>
          N
        </Ink>
        <Ink x={516} y={132}>
          E
        </Ink>
      </Svg>
    </Figure>
  );
}

/**
 * A few complex numbers as points: 3 + 2i, −2 + i and −3 − 2i, the real number 2 on the real
 * axis and the number −2i on the imaginary axis.
 */
export function PointsInPlane({ caption }: { caption?: string }) {
  const pts: [number, number, string, string, "start" | "end", number][] = [
    [3, 2, BLUE, "3 + 2i", "start", -10],
    [-2, 1, ORANGE, "−2 + i", "end", -10],
    [-3, -2, PURPLE, "−3 − 2i", "start", 20],
    [2, 0, GREEN, "", "start", 0],
    [0, -2, GREEN, "", "start", 0],
  ];
  return (
    <Figure caption={caption}>
      <ComplexGrid
        x={[-4, 4]}
        y={[-3, 3]}
        unit={44}
        label="The complex plane: a square grid whose horizontal axis, the real axis, is numbered −4 to 4, and whose vertical axis, the imaginary axis, is numbered −3i to 3i. Five points are marked: 3 + 2i, three across and two up; −2 + i, two to the left and one up; −3 − 2i, three to the left and two down; the real number 2 on the real axis; and −2i on the imaginary axis, two below 0."
      >
        {({ px, py }) => (
          <>
            <Words x={px(4) - 2} y={py(0) - 9} anchor="end" size={13}>
              real axis
            </Words>
            <Words x={px(0) + 8} y={py(3) + 16} anchor="start" size={13}>
              imaginary axis
            </Words>
            {pts.map(([a, b, color, name, anchor, dy]) => (
              <g key={`${a},${b}`}>
                <Spot x={px(a)} y={py(b)} color={color} />
                <Words
                  x={px(a) + (anchor === "start" ? 9 : -9)}
                  y={py(b) + dy}
                  anchor={anchor}
                  size={14}
                  color={color}
                >
                  {name}
                </Words>
              </g>
            ))}
          </>
        )}
      </ComplexGrid>
    </Figure>
  );
}

/**
 * The sum (4 + i) + (−1 + 3i) = 3 + 4i as a parallelogram: z then w (solid), or w then z (dashed),
 * both ending at z + w, with the diagonal from 0 to z + w.
 */
export function SumParallelogram({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <ComplexGrid
        x={[-3, 5]}
        y={[-1, 5]}
        unit={44}
        label="The complex plane with the points z = 4 + i in blue, w = −1 + 3i in orange and z + w = 3 + 4i in purple. A blue arrow goes from 0 to z, and an orange arrow goes on from z to z + w. An orange arrow also goes from 0 to w, and a dashed blue arrow goes on from w to z + w. The four arrows are the sides of a parallelogram, and a purple diagonal runs from 0 to z + w."
      >
        {({ px, py }) => {
          const o = { x: px(0), y: py(0) };
          const z = { x: px(4), y: py(1) };
          const w = { x: px(-1), y: py(3) };
          const s = { x: px(3), y: py(4) };
          return (
            <>
              <line
                x1={o.x}
                y1={o.y}
                x2={s.x}
                y2={s.y}
                stroke={PURPLE}
                strokeWidth={3}
              />
              <Arrow x1={o.x} y1={o.y} x2={z.x} y2={z.y} color={BLUE} />
              <Arrow
                x1={z.x}
                y1={z.y}
                x2={s.x}
                y2={s.y}
                color={ORANGE}
                dashed
              />
              <Arrow x1={o.x} y1={o.y} x2={w.x} y2={w.y} color={ORANGE} />
              <Arrow x1={w.x} y1={w.y} x2={s.x} y2={s.y} color={BLUE} dashed />
              <Spot x={z.x} y={z.y} color={BLUE} />
              <Spot x={w.x} y={w.y} color={ORANGE} />
              <Spot x={s.x} y={s.y} color={PURPLE} />
              <Words
                x={z.x + 8}
                y={z.y + 22}
                anchor="start"
                size={14}
                color={BLUE}
              >
                z = 4 + i
              </Words>
              <Words
                x={w.x - 10}
                y={w.y + 5}
                anchor="end"
                size={14}
                color={ORANGE}
              >
                w = −1 + 3i
              </Words>
              <Words
                x={s.x + 10}
                y={s.y - 8}
                anchor="start"
                size={14}
                color={PURPLE}
              >
                z + w = 3 + 4i
              </Words>
            </>
          );
        }}
      </ComplexGrid>
    </Figure>
  );
}

/**
 * The difference z − w for z = 4 + i and w = 1 + 3i: an arrow from w to z, and the same step from
 * 0, ending at z − w = 3 − 2i.
 */
export function DifferenceStep({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <ComplexGrid
        x={[-1, 5]}
        y={[-3, 4]}
        unit={44}
        label="The complex plane with the points z = 4 + i in blue and w = 1 + 3i in orange. A purple arrow goes from w to z: 3 across to the right and 2 down. A dashed purple arrow, parallel to it and the same length, goes from 0 to the point z − w = 3 − 2i."
      >
        {({ px, py }) => {
          const o = { x: px(0), y: py(0) };
          const z = { x: px(4), y: py(1) };
          const w = { x: px(1), y: py(3) };
          const d = { x: px(3), y: py(-2) };
          return (
            <>
              <Arrow x1={w.x} y1={w.y} x2={z.x} y2={z.y} color={PURPLE} />
              <Arrow
                x1={o.x}
                y1={o.y}
                x2={d.x}
                y2={d.y}
                color={PURPLE}
                dashed
              />
              <Spot x={z.x} y={z.y} color={BLUE} />
              <Spot x={w.x} y={w.y} color={ORANGE} />
              <Spot x={d.x} y={d.y} color={PURPLE} />
              <Words
                x={z.x + 8}
                y={z.y + 22}
                anchor="start"
                size={14}
                color={BLUE}
              >
                z = 4 + i
              </Words>
              <Words
                x={w.x + 8}
                y={w.y - 12}
                anchor="start"
                size={14}
                color={ORANGE}
              >
                w = 1 + 3i
              </Words>
              <Words
                x={d.x + 10}
                y={d.y + 20}
                anchor="start"
                size={14}
                color={PURPLE}
              >
                z − w = 3 − 2i
              </Words>
            </>
          );
        }}
      </ComplexGrid>
    </Figure>
  );
}

/**
 * The conjugate as a flip in the real axis (purple): z = 3 + 2i and z̄ = 3 − 2i, w = −2 + 3i and
 * w̄ = −2 − 3i, each pair joined by a dashed line crossing the axis at right angles, and the real
 * number 1 on the axis, which is its own conjugate.
 */
export function ConjugateFlip({ caption }: { caption?: string }) {
  const pairs: [number, number, string, string][] = [
    [3, 2, "z = 3 + 2i", "z̄ = 3 − 2i"],
    [-2, 3, "w = −2 + 3i", "w̄ = −2 − 3i"],
  ];
  return (
    <Figure caption={caption}>
      <ComplexGrid
        x={[-4, 5]}
        y={[-3.75, 3.75]}
        unit={40}
        label="The complex plane with the real axis drawn in purple as a mirror. The point z = 3 + 2i in blue has its conjugate 3 − 2i in orange directly below it, as far below the real axis as z is above it, joined by a dashed line. The point w = −2 + 3i in blue has its conjugate −2 − 3i in orange directly below it in the same way. The real number 1, on the axis, is green: it is its own conjugate."
      >
        {({ px, py }) => (
          <>
            <line
              x1={px(-4)}
              x2={px(5)}
              y1={py(0)}
              y2={py(0)}
              stroke={PURPLE}
              strokeWidth={3}
            />
            {pairs.map(([a, b, top, bottom]) => (
              <g key={top}>
                <line
                  x1={px(a)}
                  x2={px(a)}
                  y1={py(b)}
                  y2={py(-b)}
                  stroke={MUTED}
                  strokeWidth={2}
                  strokeDasharray="5 4"
                />
                <Spot x={px(a)} y={py(b)} color={BLUE} />
                <Spot x={px(a)} y={py(-b)} color={ORANGE} />
                <Words
                  x={px(a) + (a < 0 ? -9 : 9)}
                  y={py(b) - 8}
                  anchor={a < 0 ? "end" : "start"}
                  size={14}
                  color={BLUE}
                >
                  {top}
                </Words>
                <Words
                  x={px(a) + (a < 0 ? -9 : 9)}
                  y={py(-b) + 20}
                  anchor={a < 0 ? "end" : "start"}
                  size={14}
                  color={ORANGE}
                >
                  {bottom}
                </Words>
              </g>
            ))}
            <Spot x={px(1)} y={py(0)} color={GREEN} />
            <Words
              x={px(1) + 4}
              y={py(0) - 10}
              anchor="start"
              size={14}
              color={GREEN}
            >
              1
            </Words>
          </>
        )}
      </ComplexGrid>
    </Figure>
  );
}

/**
 * The absolute value as a distance: z = 3 + 4i with the right triangle under it, legs 3 (across)
 * and 4 (up) and hypotenuse 5, and the circle of radius 5 about 0, through 5, −4 + 3i, −5i and
 * 4 − 3i, which all have absolute value 5.
 */
export function AbsoluteCircle({ caption }: { caption?: string }) {
  const others: [number, number, string, "start" | "end", number][] = [
    [5, 0, "5", "start", -10],
    [-4, 3, "−4 + 3i", "end", -10],
    [0, -5, "−5i", "start", 18],
    [4, -3, "4 − 3i", "start", 20],
  ];
  return (
    <Figure caption={caption}>
      <ComplexGrid
        x={[-6, 6]}
        y={[-6, 6]}
        unit={28}
        label="The complex plane with a circle of radius 5 about 0. The point 3 + 4i is on the circle, in blue, with a right triangle under it: an orange leg of length 3 along the real axis from 0 to 3, a green leg of length 4 straight up from 3 to 3 + 4i, and a blue hypotenuse of length 5 from 0 to 3 + 4i. Four more points on the circle are marked: 5, −4 + 3i, −5i and 4 − 3i."
      >
        {({ px, py }) => (
          <>
            <circle
              cx={px(0)}
              cy={py(0)}
              r={5 * 28}
              fill="none"
              stroke={MUTED}
              strokeWidth={2}
            />
            <polygon
              points={`${px(0)},${py(0)} ${px(3)},${py(0)} ${px(3)},${py(4)}`}
              fill={BLUE}
              fillOpacity={0.08}
            />
            <line
              x1={px(0)}
              y1={py(0)}
              x2={px(3)}
              y2={py(0)}
              stroke={ORANGE}
              strokeWidth={3}
            />
            <line
              x1={px(3)}
              y1={py(0)}
              x2={px(3)}
              y2={py(4)}
              stroke={GREEN}
              strokeWidth={3}
            />
            <line
              x1={px(0)}
              y1={py(0)}
              x2={px(3)}
              y2={py(4)}
              stroke={BLUE}
              strokeWidth={3}
            />
            <Words x={px(1.5)} y={py(0) - 8} size={13} color={ORANGE}>
              3
            </Words>
            <Words
              x={px(3) + 8}
              y={py(2) + 4}
              anchor="start"
              size={13}
              color={GREEN}
            >
              4
            </Words>
            <Words
              x={px(1.5) - 10}
              y={py(2) - 4}
              anchor="end"
              size={13}
              color={BLUE}
            >
              5
            </Words>
            <Spot x={px(3)} y={py(4)} color={BLUE} />
            <Words
              x={px(3) + 9}
              y={py(4) - 9}
              anchor="start"
              size={14}
              color={BLUE}
            >
              3 + 4i
            </Words>
            {others.map(([a, b, name, anchor, dy]) => (
              <g key={`${a},${b}`}>
                <Spot x={px(a)} y={py(b)} color={PURPLE} />
                <Words
                  x={px(a) + (anchor === "start" ? 8 : -8)}
                  y={py(b) + dy}
                  anchor={anchor}
                  size={14}
                  color={PURPLE}
                >
                  {name}
                </Words>
              </g>
            ))}
          </>
        )}
      </ComplexGrid>
    </Figure>
  );
}
