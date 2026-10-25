import { Figure } from "../figure";
import { Arrow, MUTED, Plot, Spot } from "../function-illustrations/plot";
import { BLUE, ORANGE, PURPLE, Svg, Words } from "../illustrations";

/**
 * Pictures for the guide Matrices: three shop receipts and the grid of numbers left when their words
 * are taken away, the address of one entry by its row and column, and a matrix times a column drawn
 * as steps along the two columns.
 */

const PAPER = "#fbfaf7";
const PAPER_EDGE = "#c9c3b8";
const INK = "#374151";

/** a square bracket in pixels, opening to the right (side 1) or to the left (side −1) */
function Bracket({
  x,
  top,
  bottom,
  side,
}: {
  x: number;
  top: number;
  bottom: number;
  side: 1 | -1;
}) {
  return (
    <path
      d={`M ${x + side * 9} ${top} L ${x} ${top} L ${x} ${bottom} L ${x + side * 9} ${bottom}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    />
  );
}

const RECEIPTS: { items: [string, number][]; total: string }[] = [
  {
    items: [
      ["apples", 4],
      ["bread", 1],
      ["milk", 2],
    ],
    total: "£4.10",
  },
  {
    items: [
      ["apples", 2],
      ["bread", 2],
      ["milk", 1],
    ],
    total: "£3.70",
  },
  {
    items: [
      ["apples", 5],
      ["bread", 1],
      ["milk", 0],
    ],
    total: "£2.60",
  },
];

/** one paper receipt, its top-left corner at (x, y), with a torn zigzag along the bottom */
function Receipt({
  x,
  y,
  items,
  total,
}: {
  x: number;
  y: number;
  items: [string, number][];
  total: string;
}) {
  const w = 160;
  const h = 150;
  const teeth = 10;
  const zig = Array.from({ length: teeth + 1 }, (_, i) => {
    const tx = x + w - (w * i) / teeth;
    const ty = y + h + (i % 2 === 0 ? 0 : 7);
    return `L ${tx} ${ty}`;
  }).join(" ");
  return (
    <g>
      <path
        d={`M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} ${zig} L ${x} ${y} Z`}
        fill={PAPER}
        stroke={PAPER_EDGE}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <text
        x={x + w / 2}
        y={y + 22}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        letterSpacing={2}
        fill={INK}
      >
        CORNER SHOP
      </text>
      {items.map(([name, n], i) => (
        <g key={name} fontSize={14} fill={INK}>
          <text x={x + 14} y={y + 50 + i * 22}>
            {name}
          </text>
          <text
            x={x + w - 14}
            y={y + 50 + i * 22}
            textAnchor="end"
            fontWeight={700}
            fill={i === 0 ? BLUE : i === 1 ? ORANGE : PURPLE}
          >
            × {n}
          </text>
        </g>
      ))}
      <line
        x1={x + 12}
        x2={x + w - 12}
        y1={y + 110}
        y2={y + 110}
        stroke={INK}
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <text x={x + 14} y={y + 133} fontSize={14} fill={INK}>
        total
      </text>
      <text
        x={x + w - 14}
        y={y + 133}
        textAnchor="end"
        fontSize={14}
        fontWeight={700}
        fill={INK}
      >
        {total}
      </text>
    </g>
  );
}

/**
 * Three receipts in a row, each listing apples, bread and milk with a count for each and a total.
 * Below them the same counts sit in a grid with three rows and three columns, coloured by item, and
 * the totals in pence in a column beside it.
 */
export function ShoppingReceipts({ caption }: { caption?: string }) {
  const counts = RECEIPTS.map((r) => r.items.map(([, n]) => n));
  const totals = [410, 370, 260];
  const colX = [262, 322, 382];
  const rowY = [234, 264, 294];
  const colours = [BLUE, ORANGE, PURPLE];
  return (
    <Figure caption={caption}>
      <Svg
        width={560}
        height={318}
        label="Three paper receipts from a corner shop. The first lists 4 apples, 1 bread and 2 milk, total £4.10. The second lists 2 apples, 2 bread and 1 milk, total £3.70. The third lists 5 apples, 1 bread and 0 milk, total £2.60. Below them the counts alone sit in a grid of three rows, one for each receipt, and three columns, one for apples, bread and milk: 4, 1, 2; 2, 2, 1; 5, 1, 0. Beside the grid the totals in pence are written as a column: 410, 370, 260."
      >
        {RECEIPTS.map((r, i) => (
          <Receipt key={i} x={14 + i * 186} y={10} {...r} />
        ))}

        {/* the item names over the columns of the grid */}
        {["apples", "bread", "milk"].map((name, j) => (
          <Words key={name} x={colX[j]!} y={204} color={colours[j]} size={13}>
            {name}
          </Words>
        ))}
        <Words x={470} y={204} size={13}>
          total (p)
        </Words>

        {/* which receipt each row came from */}
        {rowY.map((y, i) => (
          <Words key={i} x={214} y={y + 5} anchor="end" size={13}>
            receipt {i + 1}
          </Words>
        ))}

        {/* the grid of counts */}
        <Bracket x={234} top={216} bottom={306} side={1} />
        <Bracket x={410} top={216} bottom={306} side={-1} />
        {counts.map((row, i) =>
          row.map((n, j) => (
            <text
              key={`${i}${j}`}
              x={colX[j]}
              y={rowY[i]! + 6}
              textAnchor="middle"
              fontSize={18}
              fontWeight={600}
              fill={colours[j]}
            >
              {n}
            </text>
          )),
        )}

        {/* the column of totals */}
        <Bracket x={442} top={216} bottom={306} side={1} />
        <Bracket x={498} top={216} bottom={306} side={-1} />
        {totals.map((t, i) => (
          <text
            key={t}
            x={470}
            y={rowY[i]! + 6}
            textAnchor="middle"
            fontSize={18}
            fontWeight={600}
            fill="currentColor"
          >
            {t}
          </text>
        ))}
      </Svg>
    </Figure>
  );
}

/**
 * The 2 by 3 matrix with rows 3, −1, 0 and 5, 2, 7. Row 2 is shaded blue, column 3 is shaded
 * orange, and where they cross sits the entry a₂₃ = 7.
 */
export function EntryAddress({ caption }: { caption?: string }) {
  const rows = [
    ["3", "−1", "0"],
    ["5", "2", "7"],
  ];
  const left = 150;
  const top = 64;
  const cw = 76;
  const ch = 54;
  const cx = (j: number) => left + cw * j + cw / 2;
  const cy = (i: number) => top + ch * i + ch / 2;
  return (
    <Figure caption={caption}>
      <Svg
        width={460}
        height={250}
        label="The matrix with first row 3, −1, 0 and second row 5, 2, 7. The second row is shaded blue and labelled row 2. The third column is shaded orange and labelled column 3. The entry where they cross, 7, is circled and labelled a₂₃ = 7: row 2 first, then column 3."
      >
        {/* row 2 and column 3 */}
        <rect
          x={left}
          y={top + ch}
          width={cw * 3}
          height={ch}
          rx={8}
          fill={BLUE}
          fillOpacity={0.18}
        />
        <rect
          x={left + cw * 2}
          y={top}
          width={cw}
          height={ch * 2}
          rx={8}
          fill={ORANGE}
          fillOpacity={0.2}
        />
        <Bracket x={left - 6} top={top} bottom={top + ch * 2} side={1} />
        <Bracket
          x={left + cw * 3 + 6}
          top={top}
          bottom={top + ch * 2}
          side={-1}
        />
        {rows.map((row, i) =>
          row.map((entry, j) => (
            <text
              key={`${i}${j}`}
              x={cx(j)}
              y={cy(i) + 8}
              textAnchor="middle"
              fontSize={22}
              fontWeight={600}
              fill="currentColor"
            >
              {entry}
            </text>
          )),
        )}
        <circle
          cx={cx(2)}
          cy={cy(1)}
          r={20}
          fill="none"
          stroke={PURPLE}
          strokeWidth={2.5}
        />

        <Words x={left - 22} y={cy(1) + 5} anchor="end" color={BLUE}>
          row 2
        </Words>
        <Words x={cx(2)} y={top - 14} color={ORANGE}>
          column 3
        </Words>
        <Words x={cx(1)} y={top + ch * 2 + 52} color={PURPLE} size={17}>
          <tspan fontStyle="italic">a</tspan>
          <tspan fontSize="0.72em" dy="0.35em">
            23
          </tspan>
          <tspan dy="-0.35em"> = 7: row 2 first, then column 3</tspan>
        </Words>
      </Svg>
    </Figure>
  );
}

/**
 * The matrix with columns A¹ = (2, 1) and A² = (−1, 1) times the column (2, 1), drawn as steps:
 * two steps of A¹ from O to (4, 2), then one step of A² to (3, 3). The second column from O is drawn
 * faint for comparison.
 */
export function ColumnSteps({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <Plot
        id="column-steps"
        x={[-2, 5]}
        y={[-1, 4]}
        unit={56}
        curves={[]}
        label="On a grid, two blue arrows each equal to A¹ = (2, 1) go from the origin to (2, 1) and then to (4, 2). From there a purple arrow equal to A² = (−1, 1) goes to (3, 3), which is marked as AX. A faint dashed purple arrow from the origin to (−1, 1) shows A² on its own."
      >
        {({ px, py }) => (
          <>
            <Arrow
              x1={px(0)}
              y1={py(0)}
              x2={px(-1)}
              y2={py(1)}
              color={MUTED}
              dashed
            />
            <Arrow x1={px(0)} y1={py(0)} x2={px(2)} y2={py(1)} color={BLUE} />
            <Arrow x1={px(2)} y1={py(1)} x2={px(4)} y2={py(2)} color={BLUE} />
            <Arrow x1={px(4)} y1={py(2)} x2={px(3)} y2={py(3)} color={PURPLE} />
            <Spot x={px(0)} y={py(0)} color={MUTED} />
            <Spot x={px(3)} y={py(3)} color={PURPLE} />
            <Words x={px(1)} y={py(0.5) + 22} color={BLUE}>
              A¹
            </Words>
            <Words x={px(3)} y={py(1.5) + 22} color={BLUE}>
              A¹
            </Words>
            <Words
              x={px(3.5) + 18}
              y={py(2.5) + 4}
              anchor="start"
              color={PURPLE}
            >
              A²
            </Words>
            <Words x={px(-1) - 8} y={py(1) - 10} anchor="end" color={MUTED}>
              A²
            </Words>
            <Words x={px(3)} y={py(3) - 14} color={PURPLE}>
              AX = (3, 3)
            </Words>
          </>
        )}
      </Plot>
    </Figure>
  );
}
