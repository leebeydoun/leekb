import type { ReactNode } from "react";
import { Figure } from "../figure";
import { Arrow, MUTED, Plot, Spot } from "../function-illustrations/plot";
import {
  BLUE,
  ORANGE,
  PAPER,
  PAPER_EDGE,
  PENCIL,
  PURPLE,
  Svg,
  Words,
  type Pt,
} from "../illustrations";

/**
 * Pictures for the guide Cramer's rule: three bakery receipts whose prices are missing, the
 * parallelogram on two columns beside the parallelogram with the right-hand side in place of the
 * first column, and the columns of a matrix with determinant 0 lying in one plane, with one target
 * in that plane and one above it.
 */

type Item = { count: number; name: string };

/** what each receipt lists: the numbers of croissants, muffins and cookies, and the total */
const RECEIPTS: { items: Item[]; total: number }[] = [
  {
    items: [
      { count: 2, name: "croissants" },
      { count: 1, name: "muffin" },
      { count: 1, name: "cookie" },
    ],
    total: 8,
  },
  {
    items: [
      { count: 3, name: "croissants" },
      { count: 2, name: "muffins" },
      { count: 4, name: "cookies" },
    ],
    total: 16,
  },
  {
    items: [
      { count: 4, name: "croissants" },
      { count: 0, name: "muffins" },
      { count: 3, name: "cookies" },
    ],
    total: 11,
  },
];

/**
 * Three paper receipts from one bakery. Each lists how many croissants, muffins and cookies were
 * bought and the total paid, but the price beside each item has been smudged away.
 */
export function BakeryReceipts({ caption }: { caption?: string }) {
  const width = 576;
  const height = 250;
  const slip = 164;
  const gap = 24;
  const top = 18;
  const bottom = 226;
  // the torn bottom edge of a slip starting at x, as a zigzag
  const torn = (x: number) =>
    Array.from({ length: 13 }, (_, i) => {
      const px = x + (slip * (12 - i)) / 12;
      const py = bottom + (i % 2 === 0 ? 0 : -7);
      return `${px.toFixed(1)},${py}`;
    }).join(" ");

  return (
    <Figure caption={caption}>
      <Svg
        width={width}
        height={height}
        label="Three receipts from the same bakery, side by side. The first lists 2 croissants, 1 muffin and 1 cookie, with a total of £8. The second lists 3 croissants, 2 muffins and 4 cookies, with a total of £16. The third lists 4 croissants, 0 muffins and 3 cookies, with a total of £11. On every receipt the price beside each item is smudged, shown as a grey blot with a question mark."
      >
        {RECEIPTS.map(({ items, total }, r) => {
          const x = 24 + r * (slip + gap);
          return (
            <g key={r}>
              <polygon
                points={`${x},${top} ${x + slip},${top} ${torn(x)}`}
                fill={PAPER}
                stroke={PAPER_EDGE}
                strokeWidth={2}
                strokeLinejoin="round"
              />
              <text
                x={x + slip / 2}
                y={top + 30}
                textAnchor="middle"
                fontSize={15}
                fontWeight={700}
                letterSpacing={2}
                fill={PENCIL}
              >
                BAKERY
              </text>
              <line
                x1={x + 14}
                x2={x + slip - 14}
                y1={top + 44}
                y2={top + 44}
                stroke={PAPER_EDGE}
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
              {items.map(({ count, name }, i) => {
                const y = top + 72 + i * 30;
                return (
                  <g key={name}>
                    <text x={x + 14} y={y} fontSize={14} fill={PENCIL}>
                      {count} {name}
                    </text>
                    {/* the smudged price */}
                    <ellipse
                      cx={x + slip - 30}
                      cy={y - 5}
                      rx={17}
                      ry={9}
                      fill={MUTED}
                      fillOpacity={0.45}
                    />
                    <text
                      x={x + slip - 30}
                      y={y}
                      textAnchor="middle"
                      fontSize={13}
                      fontWeight={700}
                      fill={PENCIL}
                    >
                      ?
                    </text>
                  </g>
                );
              })}
              <line
                x1={x + 14}
                x2={x + slip - 14}
                y1={top + 150}
                y2={top + 150}
                stroke={PAPER_EDGE}
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
              <text
                x={x + 14}
                y={top + 176}
                fontSize={15}
                fontWeight={700}
                fill={PENCIL}
              >
                Total
              </text>
              <text
                x={x + slip - 14}
                y={top + 176}
                textAnchor="end"
                fontSize={15}
                fontWeight={700}
                fill={PENCIL}
              >
                £{total}
              </text>
            </g>
          );
        })}
      </Svg>
    </Figure>
  );
}

/** a parallelogram with corners given in grid coordinates, shaded and outlined */
function Shape({
  corners,
  color,
  px,
  py,
  faint = false,
}: {
  corners: Pt[];
  color: string;
  px: (x: number) => number;
  py: (y: number) => number;
  faint?: boolean;
}) {
  return (
    <polygon
      points={corners.map(([x, y]) => `${px(x)},${py(y)}`).join(" ")}
      fill={faint ? "none" : color}
      fillOpacity={faint ? undefined : 0.18}
      stroke={color}
      strokeWidth={faint ? 2 : 2.5}
      strokeDasharray={faint ? "6 5" : undefined}
      strokeLinejoin="round"
    />
  );
}

/**
 * Two panels on the same grid. On the left, the parallelogram on A¹ = (2, 1) and A² = (0, 2), of
 * area 4. On the right, the parallelogram on B = 2A¹ + A² = (4, 4) and A², of area 8, with the
 * parallelogram on 2A¹ and A² dashed: sliding along A² turns one into the other.
 */
export function ReplacedColumn({ caption }: { caption?: string }) {
  const grid = { x: [0, 5] as const, y: [0, 6.5] as const, unit: 34 };
  const panel = (id: string, label: string, body: (s: Scale) => ReactNode) => (
    <div className="w-full max-w-[250px]">
      <Plot id={id} {...grid} curves={[]} label={label}>
        {body}
      </Plot>
    </div>
  );

  return (
    <Figure caption={caption} className="flex flex-wrap justify-center gap-6">
      {panel(
        "replaced-column-1",
        "On a grid, the parallelogram with corners O, A¹ = (2, 1), (2, 3) and A² = (0, 2), shaded blue. It is 2 wide and its vertical sides are 2 long, so its area is 4.",
        ({ px, py }) => (
          <>
            <Shape
              corners={[
                [0, 0],
                [2, 1],
                [2, 3],
                [0, 2],
              ]}
              color={BLUE}
              px={px}
              py={py}
            />
            <Arrow x1={px(0)} y1={py(0)} x2={px(2)} y2={py(1)} color={BLUE} />
            <Arrow x1={px(0)} y1={py(0)} x2={px(0)} y2={py(2)} color={PURPLE} />
            <Words x={px(2) + 8} y={py(1) + 6} anchor="start" color={BLUE}>
              A¹ = (2, 1)
            </Words>
            <Words x={px(0) + 8} y={py(2) - 8} anchor="start" color={PURPLE}>
              A²
            </Words>
            <Words x={px(1)} y={py(1.6)} size={14}>
              area 4
            </Words>
          </>
        ),
      )}
      {panel(
        "replaced-column-2",
        "On the same grid, the parallelogram with corners O, B = (4, 4), (4, 6) and A² = (0, 2), shaded orange, and dashed over it the parallelogram with corners O, 2A¹ = (4, 2), (4, 4) and A². Both are 4 wide with vertical sides 2 long, so both have area 8, twice the area of the parallelogram on A¹ and A².",
        ({ px, py }) => (
          <>
            <Shape
              corners={[
                [0, 0],
                [4, 4],
                [4, 6],
                [0, 2],
              ]}
              color={ORANGE}
              px={px}
              py={py}
            />
            <Shape
              corners={[
                [0, 0],
                [4, 2],
                [4, 4],
                [0, 2],
              ]}
              color={MUTED}
              px={px}
              py={py}
              faint
            />
            <Arrow x1={px(0)} y1={py(0)} x2={px(4)} y2={py(4)} color={ORANGE} />
            <Arrow x1={px(0)} y1={py(0)} x2={px(0)} y2={py(2)} color={PURPLE} />
            <Spot x={px(4)} y={py(2)} color={MUTED} />
            <Words x={px(4) + 8} y={py(4) + 5} anchor="start" color={ORANGE}>
              B
            </Words>
            <Words x={px(4) + 8} y={py(2) + 5} anchor="start" color={MUTED}>
              2A¹
            </Words>
            <Words x={px(0) + 8} y={py(2) + 18} anchor="start" color={PURPLE}>
              A²
            </Words>
            <Words x={px(3.2)} y={py(4.3)} size={14}>
              area 8
            </Words>
          </>
        ),
      )}
    </Figure>
  );
}

type Scale = { px: (x: number) => number; py: (y: number) => number };
type Pt3 = readonly [number, number, number];

/**
 * A slanted view of space: x runs right, z runs up, and y runs back, drawn up and to the right, as
 * in the pictures of points in space.
 */
function view(unit: number, origin: Pt) {
  const back: Pt = [0.7 * Math.cos(0.7), 0.7 * Math.sin(0.7)];
  return ([x, y, z]: Pt3): Pt => [
    origin[0] + unit * (x + back[0] * y),
    origin[1] - unit * (z + back[1] * y),
  ];
}

/**
 * A flat sheet through O stands for a plane. Three arrows from O, the columns A¹, A² and A³, all lie
 * in it. One target point B sits on the sheet; another, B′, sits above it, with a dashed line
 * dropped to the sheet.
 */
export function FlatColumns({ caption }: { caption?: string }) {
  const at = view(52, [150, 232]);
  const sheet: Pt3[] = [
    [-1.6, -0.8, 0],
    [5.2, -0.8, 0],
    [5.2, 4.2, 0],
    [-1.6, 4.2, 0],
  ];
  const columns: { tip: Pt3; name: string; shift: Pt }[] = [
    { tip: [3.2, 0.2, 0], name: "A¹", shift: [8, 16] },
    { tip: [0.6, 3, 0], name: "A²", shift: [-12, -8] },
    { tip: [2.6, 1.8, 0], name: "A³", shift: [6, -10] },
  ];
  const onSheet: Pt3 = [-0.4, 3.2, 0];
  const above: Pt3 = [4.6, 0.4, 2.3];
  const below: Pt3 = [4.6, 0.4, 0];
  const O = at([0, 0, 0]);

  return (
    <Figure caption={caption}>
      <Svg
        width={560}
        height={280}
        label="A flat sheet drawn in perspective stands for a plane through the origin O. Three arrows from O, labelled A¹, A² and A³, all lie in the sheet. A green point B lies on the sheet, marked as reachable. A red point B′ floats above the sheet, with a dashed line dropping from it to the sheet, marked as out of reach."
      >
        <polygon
          points={sheet.map((p) => at(p).join(",")).join(" ")}
          fill={BLUE}
          fillOpacity={0.1}
          stroke={BLUE}
          strokeOpacity={0.6}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {columns.map(({ tip, name, shift }) => {
          const [x, y] = at(tip);
          return (
            <g key={name}>
              <Arrow x1={O[0]} y1={O[1]} x2={x} y2={y} color={PURPLE} />
              <Words
                x={x + shift[0]}
                y={y + shift[1]}
                anchor={shift[0] < 0 ? "end" : "start"}
                color={PURPLE}
              >
                {name}
              </Words>
            </g>
          );
        })}
        <Spot x={O[0]} y={O[1]} color="currentColor" />
        <Words x={O[0] - 10} y={O[1] + 6} anchor="end">
          O
        </Words>

        {/* a target in the plane, and one above it */}
        <Spot x={at(onSheet)[0]} y={at(onSheet)[1]} color="#22c55e" />
        <Words
          x={at(onSheet)[0] - 10}
          y={at(onSheet)[1] + 18}
          anchor="end"
          color="#22c55e"
        >
          B in the plane
        </Words>
        <line
          x1={at(above)[0]}
          y1={at(above)[1]}
          x2={at(below)[0]}
          y2={at(below)[1]}
          stroke="#ef4444"
          strokeWidth={2}
          strokeDasharray="5 4"
        />
        <circle
          cx={at(below)[0]}
          cy={at(below)[1]}
          r={3}
          fill="#ef4444"
          fillOpacity={0.6}
        />
        <Spot x={at(above)[0]} y={at(above)[1]} color="#ef4444" />
        <Words
          x={at(above)[0] + 12}
          y={at(above)[1] - 8}
          anchor="start"
          color="#ef4444"
        >
          B′ off the plane
        </Words>
      </Svg>
    </Figure>
  );
}
