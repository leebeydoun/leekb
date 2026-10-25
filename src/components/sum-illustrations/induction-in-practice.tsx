import { Figure } from "../figure";
import { BLUE, ORANGE, Svg, Words } from "../illustrations";

/**
 * Pictures for the guide Induction in practice: a ladder whose top is lost in fog, the factor tree
 * of 360, the eight ways to paint three doors in two colours, and the two boxes of crayons that show
 * where a false induction proof breaks.
 */

const WOOD = "#b7804a";
const PRIME = "#22c55e";

/** A ladder rising into fog: you can reach the bottom rung, and each rung leads to the next. */
export function FoggyLadder({ caption }: { caption?: string }) {
  const left = 230;
  const right = 320;
  const ground = 282;
  const rungs = Array.from({ length: 8 }, (_, i) => 258 - 34 * i);
  return (
    <Figure caption={caption}>
      <Svg
        width={600}
        height={300}
        label="A ladder standing on the ground, its upper rungs fading into fog so the top can't be seen. The bottom rung is marked as the base case: you can reach rung 1. Curved arrows on the right lead from each rung to the one above it, marked: from any rung, you reach the next."
      >
        <defs>
          <linearGradient id="foggy-ladder-fog" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--color-fd-card)" }} />
            <stop
              offset="0.45"
              style={{ stopColor: "var(--color-fd-card)", stopOpacity: 0.85 }}
            />
            <stop
              offset="1"
              style={{ stopColor: "var(--color-fd-card)", stopOpacity: 0 }}
            />
          </linearGradient>
        </defs>
        <line
          x1={120}
          x2={480}
          y1={ground}
          y2={ground}
          stroke="currentColor"
          strokeWidth={2.5}
        />
        {/* the rails and rungs */}
        {[left, right].map((x) => (
          <line
            key={x}
            x1={x}
            x2={x}
            y1={ground}
            y2={0}
            stroke={WOOD}
            strokeWidth={8}
            strokeLinecap="round"
          />
        ))}
        {rungs.map((y, i) => (
          <line
            key={y}
            x1={left}
            x2={right}
            y1={y}
            y2={y}
            stroke={i === 0 ? BLUE : WOOD}
            strokeWidth={6}
            strokeLinecap="round"
          />
        ))}
        {/* each rung leads to the next */}
        {rungs.slice(0, 5).map((y, i) => (
          <g key={y}>
            <path
              d={`M ${right + 16} ${y - 2} C ${right + 44} ${y - 8}, ${right + 44} ${y - 26}, ${right + 20} ${y - 32}`}
              fill="none"
              stroke={ORANGE}
              strokeWidth={2.5}
            />
            <polygon
              points={`${right + 14},${y - 33} ${right + 24},${y - 38} ${right + 23},${y - 27}`}
              fill={ORANGE}
            />
            <Words x={left - 14} y={y + 5} anchor="end" size={14}>
              {String(i + 1)}
            </Words>
          </g>
        ))}
        {/* the fog over the top of the ladder */}
        <rect
          x={0}
          y={0}
          width={600}
          height={130}
          fill="url(#foggy-ladder-fog)"
        />
        <Words x={190} y={250} anchor="end" color={BLUE}>
          the base case:
        </Words>
        <Words x={190} y={270} anchor="end" color={BLUE}>
          you reach rung 1
        </Words>
        <Words x={380} y={196} anchor="start" color={ORANGE}>
          the step: from any rung,
        </Words>
        <Words x={380} y={216} anchor="start" color={ORANGE}>
          you reach the next
        </Words>
      </Svg>
    </Figure>
  );
}

type Node = { n: number; x: number; y: number; prime: boolean };

/** 360 split into two factors, and each factor split again until only primes are left. */
export function FactorTree({ caption }: { caption?: string }) {
  const nodes: Node[] = [
    { n: 360, x: 260, y: 34, prime: false },
    { n: 8, x: 150, y: 104, prime: false },
    { n: 45, x: 370, y: 104, prime: false },
    { n: 2, x: 100, y: 174, prime: true },
    { n: 4, x: 200, y: 174, prime: false },
    { n: 5, x: 320, y: 174, prime: true },
    { n: 9, x: 420, y: 174, prime: false },
    { n: 2, x: 170, y: 244, prime: true },
    { n: 2, x: 230, y: 244, prime: true },
    { n: 3, x: 390, y: 244, prime: true },
    { n: 3, x: 450, y: 244, prime: true },
  ];
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 5],
    [2, 6],
    [4, 7],
    [4, 8],
    [6, 9],
    [6, 10],
  ];
  return (
    <Figure caption={caption}>
      <Svg
        width={520}
        height={276}
        label="A factor tree. 360 splits into 8 and 45. 8 splits into 2 and 4, and 4 into 2 and 2. 45 splits into 5 and 9, and 9 into 3 and 3. The primes 2, 2, 2, 3, 3 and 5 sit in green circles at the ends of the branches."
      >
        {edges.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={nodes[a]!.x}
            y1={nodes[a]!.y + 14}
            x2={nodes[b]!.x}
            y2={nodes[b]!.y - 18}
            stroke="currentColor"
            strokeOpacity={0.5}
            strokeWidth={2}
          />
        ))}
        {nodes.map((node, i) => (
          <g key={i}>
            {node.prime && (
              <circle
                cx={node.x}
                cy={node.y - 5}
                r={17}
                fill={PRIME}
                fillOpacity={0.18}
                stroke={PRIME}
                strokeWidth={2.5}
              />
            )}
            <Words x={node.x} y={node.y} size={18}>
              {String(node.n)}
            </Words>
          </g>
        ))}
      </Svg>
    </Figure>
  );
}

/** a small door in the given paint, with its top left corner at (x, y) */
function Door({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={26}
        height={42}
        rx={2}
        fill={color}
        fillOpacity={0.75}
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <circle cx={x + 20} cy={y + 23} r={2.2} fill="currentColor" />
    </g>
  );
}

/** The eight ways to paint three doors blue or orange, sorted by the colour of the third door. */
export function PaintedDoors({ caption }: { caption?: string }) {
  const firstTwo = [
    [BLUE, BLUE],
    [BLUE, ORANGE],
    [ORANGE, BLUE],
    [ORANGE, ORANGE],
  ];
  const panels = [
    { x: 90, third: BLUE, title: "door 3 blue" },
    { x: 330, third: ORANGE, title: "door 3 orange" },
  ];
  return (
    <Figure caption={caption}>
      <Svg
        width={520}
        height={316}
        label="Two columns of four rows. Each row is three doors, numbered 1, 2 and 3, each painted blue or orange. In the left column door 3 is blue, in the right column door 3 is orange, and in each column doors 1 and 2 run through blue blue, blue orange, orange blue and orange orange. That makes 4 rows in each column and 8 in all."
      >
        {panels.map((panel) => (
          <g key={panel.title}>
            <Words x={panel.x + 53} y={22} color={panel.third}>
              {panel.title}
            </Words>
            {[1, 2, 3].map((d) => (
              <Words key={d} x={panel.x + 13 + 40 * (d - 1)} y={46} size={13}>
                {String(d)}
              </Words>
            ))}
            {firstTwo.map((pair, row) => (
              <g key={row}>
                {[...pair, panel.third].map((color, d) => (
                  <Door
                    key={d}
                    x={panel.x + 40 * d}
                    y={60 + 62 * row}
                    color={color}
                  />
                ))}
              </g>
            ))}
          </g>
        ))}
      </Svg>
    </Figure>
  );
}

/** a crayon standing upright, with its centre at x and a letter on its body */
function Crayon({
  x,
  color,
  letter,
}: {
  x: number;
  color: string;
  letter?: string;
}) {
  return (
    <g>
      <polygon
        points={`${x - 11},${72} ${x},${50} ${x + 11},${72}`}
        fill={color}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <rect
        x={x - 11}
        y={72}
        width={22}
        height={92}
        rx={2}
        fill={color}
        stroke="currentColor"
        strokeWidth={1.5}
      />
      {letter && (
        <text
          x={x}
          y={124}
          textAnchor="middle"
          fontSize={15}
          fontWeight={700}
          fill="#ffffff"
        >
          {letter}
        </text>
      )}
    </g>
  );
}

/** a bracket from x1 to x2 at height y, opening up (below the crayons) or down (above them) */
function Bracket({
  x1,
  x2,
  y,
  up,
  label,
}: {
  x1: number;
  x2: number;
  y: number;
  up: boolean;
  label: string;
}) {
  const tip = up ? -8 : 8;
  return (
    <g>
      <path
        d={`M ${x1} ${y + tip} L ${x1} ${y} L ${x2} ${y} L ${x2} ${y + tip}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      />
      <Words x={(x1 + x2) / 2} y={up ? y + 20 : y - 8} size={13}>
        {label}
      </Words>
    </g>
  );
}

/** A box of four crayons, where the two groups of three overlap, and a box of two, where they don't. */
export function CrayonBoxes({ caption }: { caption?: string }) {
  const four = [70, 120, 170, 220];
  return (
    <Figure caption={caption}>
      {/* two boxes side by side on a wide screen, one above the other on a phone */}
      <div className="grid items-end gap-6 sm:grid-cols-2">
        <Svg
          width={290}
          height={248}
          label="Four blue crayons, the first marked A and the last marked B. A bracket above covers all but B, a bracket below covers all but A, and the two middle crayons are in both groups."
        >
          {four.map((x, i) => (
            <Crayon
              key={x}
              x={x}
              color={BLUE}
              letter={i === 0 ? "A" : i === 3 ? "B" : undefined}
            />
          ))}
          <Bracket x1={56} x2={184} y={38} up={false} label="leave out B" />
          <Bracket x1={106} x2={234} y={180} up label="leave out A" />
          <Words x={145} y={238} size={14}>
            4 crayons: two in both groups
          </Words>
        </Svg>
        <Svg
          width={290}
          height={248}
          label="Two crayons, A blue and B orange. The bracket leaving out B covers only A, the bracket leaving out A covers only B, and no crayon is in both."
        >
          <g transform="translate(-305, 0)">
            <Crayon x={410} color={BLUE} letter="A" />
            <Crayon x={490} color={ORANGE} letter="B" />
            <Bracket x1={394} x2={426} y={38} up={false} label="leave out B" />
            <Bracket x1={474} x2={506} y={180} up label="leave out A" />
            <Words x={450} y={238} size={14}>
              2 crayons: none in both
            </Words>
          </g>
        </Svg>
      </div>
    </Figure>
  );
}
