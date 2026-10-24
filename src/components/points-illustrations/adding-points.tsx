import { Figure } from "../figure";
import { ORANGE, PURPLE, Svg, Words } from "../illustrations";

/**
 * Pictures for the Adding points guide: a boat crossing a river, seen from above. The river flows
 * up the page. In one second the rowing carries the boat 3 m across and the current carries it 1 m
 * along, so the boat ends up at (3, 1) from where it started, whichever step is taken first.
 */

const WATER = "#bfdbfe";
const WATER_LINE = "#93c5fd";
const BANK = "#8cc46f";
const BANK_DARK = "#4d7c3a";
const HULL = "#b45309";
const HULL_LIGHT = "#f59e0b";
const CURRENT = "#1d4ed8";

const UNIT = 80;
const START_X = 120;
const START_Y = 300;

// the pixel position of the point (a, b): a metres across the river and b metres downstream
const X = (a: number) => START_X + a * UNIT;
const Y = (b: number) => START_Y - b * UNIT;

/** an arrow from (x1, y1) to (x2, y2) with its head at the second end, lifted off the water */
function Step({
  x1,
  y1,
  x2,
  y2,
  color,
  dashed = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  dashed?: boolean;
}) {
  const length = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / length;
  const uy = (y2 - y1) / length;
  const head = 16;
  const half = 8;
  const bx = x2 - ux * head;
  const by = y2 - uy * head;
  const tip = `${x2},${y2} ${bx - uy * half},${by + ux * half} ${bx + uy * half},${by - ux * half}`;
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <line
        x1={x1}
        y1={y1}
        x2={bx}
        y2={by}
        stroke="var(--color-fd-card)"
        strokeWidth={dashed ? 0 : 9}
      />
      <polygon
        points={tip}
        fill="var(--color-fd-card)"
        stroke="var(--color-fd-card)"
        strokeWidth={dashed ? 0 : 5}
      />
      <line
        x1={x1}
        y1={y1}
        x2={bx}
        y2={by}
        stroke={color}
        strokeWidth={dashed ? 2.5 : 4.5}
        strokeDasharray={dashed ? "8 7" : undefined}
        strokeOpacity={dashed ? 0.8 : 1}
      />
      <polygon points={tip} fill={color} fillOpacity={dashed ? 0.8 : 1} />
    </g>
  );
}

/** a rowing boat seen from above, pointing across the river (to the right) */
function Boat({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {/* oars */}
      <line
        x1={x - 4}
        y1={y - 26}
        x2={x + 6}
        y2={y + 26}
        stroke={HULL}
        strokeWidth={3}
      />
      <path
        d={`M ${x - 30} ${y - 11} L ${x + 18} ${y - 11} Q ${x + 36} ${y} ${x + 18} ${y + 11} L ${x - 30} ${y + 11} Z`}
        fill={HULL_LIGHT}
        stroke={HULL}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <rect x={x - 8} y={y - 10} width={7} height={20} fill={HULL} rx={1.5} />
    </g>
  );
}

/**
 * The river from above, flowing up the page, with the start on the near bank at the bottom left.
 * The rowing step goes 3 to the right (orange), the current's step 1 up (blue), and their sum is
 * the step to (3, 1) (purple). The other order, current first, is drawn dashed.
 */
export function RiverCrossing({ caption }: { caption?: string }) {
  const width = 600;
  const height = 380;
  const bankLeft = 82;
  const bankRight = 520;
  // little arrows on the water showing which way it flows
  const flow: [number, number][] = [
    [200, 110],
    [330, 80],
    [460, 160],
    [250, 150],
    [460, 330],
  ];

  return (
    <Figure caption={caption}>
      <Svg
        width={width}
        height={height}
        label="A river seen from above, flowing up the page. A boat starts at the near bank. In one second its rowing moves it 3 metres across the river, and the current moves it 1 metre along the river. The two steps together take it to the point (3, 1). Taking the current's step first and the rowing second ends at the same place."
      >
        {/* the two banks and the water between them */}
        <rect
          x={0}
          y={0}
          width={bankLeft}
          height={height}
          fill={BANK}
          fillOpacity={0.6}
        />
        <rect
          x={bankRight}
          y={0}
          width={width - bankRight}
          height={height}
          fill={BANK}
          fillOpacity={0.6}
        />
        <rect
          x={bankLeft}
          y={0}
          width={bankRight - bankLeft}
          height={height}
          fill={WATER}
        />
        <line
          x1={bankLeft}
          y1={0}
          x2={bankLeft}
          y2={height}
          stroke={BANK_DARK}
          strokeWidth={2}
        />
        <line
          x1={bankRight}
          y1={0}
          x2={bankRight}
          y2={height}
          stroke={BANK_DARK}
          strokeWidth={2}
        />

        {/* the flow of the water */}
        {flow.map(([x, y]) => (
          <g
            key={`${x},${y}`}
            stroke={WATER_LINE}
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
          >
            <line x1={x} y1={y + 18} x2={x} y2={y - 18} />
            <path
              d={`M ${x - 7} ${y - 10} L ${x} ${y - 18} L ${x + 7} ${y - 10}`}
            />
          </g>
        ))}

        {/* the other order: current first, then rowing */}
        <Step x1={X(0)} y1={Y(0)} x2={X(0)} y2={Y(1)} color={CURRENT} dashed />
        <Step x1={X(0)} y1={Y(1)} x2={X(3)} y2={Y(1)} color={ORANGE} dashed />

        {/* rowing first, then the current */}
        <Step x1={X(0)} y1={Y(0)} x2={X(3)} y2={Y(0)} color={ORANGE} />
        <Step x1={X(3)} y1={Y(0)} x2={X(3)} y2={Y(1)} color={CURRENT} />

        {/* the two steps together */}
        <Step x1={X(0)} y1={Y(0)} x2={X(3)} y2={Y(1)} color={PURPLE} />

        <Boat x={X(3) + 2} y={Y(1) - 46} />

        <circle cx={X(0)} cy={Y(0)} r={6} fill="currentColor" />
        <Words x={X(0) - 10} y={Y(0) + 26} anchor="start">
          start
        </Words>

        <Words x={X(1.5)} y={Y(0) + 28} color={ORANGE}>
          rowing: 3 m across
        </Words>
        <Words x={X(3) + 14} y={Y(0.5) + 5} anchor="start" color={CURRENT}>
          current: 1 m
        </Words>
        <Words x={X(0.95)} y={Y(0.5) - 16} size={14} color={PURPLE}>
          together: (3, 1)
        </Words>
        <Words x={X(0) + 12} y={Y(1) - 14} anchor="start" size={13}>
          the other order
        </Words>
        <Words
          x={bankLeft + 108}
          y={28}
          anchor="middle"
          size={13}
          color={CURRENT}
        >
          the river flows this way
        </Words>
      </Svg>
    </Figure>
  );
}
