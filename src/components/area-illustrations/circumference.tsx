import { Figure } from "../figure";
import {
  BLUE,
  ORANGE,
  PENCIL,
  STEEL,
  STEEL_LIGHT,
  Svg,
  Words,
} from "../illustrations";

/**
 * Pictures for the Around the circle guide: a wheel rolled through one turn, which lays its
 * circumference flat on the road, and a pizza cut into slices and laid side by side, which makes
 * a shape close to a rectangle half the circumference long and one radius tall.
 */

const TYRE = "#374151";
const ROAD = "#9ca3af";
const CHEESE = "#fcd34d";
const CHEESE_LIGHT = "#fde68a";
const CRUST = "#b45309";

/** a horizontal double-headed arrow from x1 to x2 at height y, with a halo */
function Span({
  x1,
  x2,
  y,
  color,
}: {
  x1: number;
  x2: number;
  y: number;
  color: string;
}) {
  const head = 10;
  const half = 6;
  const shape = (
    <>
      <line x1={x1 + head} y1={y} x2={x2 - head} y2={y} />
      <polygon
        points={`${x1},${y} ${x1 + head},${y - half} ${x1 + head},${y + half}`}
      />
      <polygon
        points={`${x2},${y} ${x2 - head},${y - half} ${x2 - head},${y + half}`}
      />
    </>
  );
  return (
    <g strokeLinejoin="round">
      <g
        stroke="var(--color-fd-card)"
        strokeWidth={7}
        fill="var(--color-fd-card)"
      >
        {shape}
      </g>
      <g stroke={color} strokeWidth={2.5} fill={color}>
        {shape}
      </g>
    </g>
  );
}

/** a wheel with spokes, centred at (cx, cy), with a red mark on its tyre at the given angle */
function Wheel({
  cx,
  cy,
  r,
  mark,
  faint = false,
}: {
  cx: number;
  cy: number;
  r: number;
  mark: number;
  faint?: boolean;
}) {
  const spokes = Array.from({ length: 12 }, (_, i) => (i * Math.PI) / 6);
  const m = (mark * Math.PI) / 180;
  return (
    <g opacity={faint ? 0.45 : 1}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={TYRE} strokeWidth={8} />
      <g stroke={STEEL} strokeWidth={1.2}>
        {spokes.map((a) => (
          <line
            key={a}
            x1={cx}
            y1={cy}
            x2={cx + (r - 4) * Math.cos(a)}
            y2={cy + (r - 4) * Math.sin(a)}
          />
        ))}
      </g>
      <circle cx={cx} cy={cy} r={6} fill={STEEL_LIGHT} stroke={STEEL} />
      <circle
        cx={cx + r * Math.cos(m)}
        cy={cy + r * Math.sin(m)}
        r={6}
        fill="#dc2626"
        stroke={PENCIL}
        strokeWidth={1.5}
      />
    </g>
  );
}

/** A wheel rolled through one full turn, from one touch of its red mark on the road to the next. */
export function WheelTrack({ caption }: { caption?: string }) {
  const r = 40;
  const road = 150;
  const start = 60;
  const end = start + 2 * Math.PI * r;
  return (
    <Figure caption={caption}>
      <Svg
        width={380}
        height={214}
        label="A wheel at the start and end of one full turn along a road. The red mark on the tyre touches the road at both ends. The distance between is the circumference, a little more than three times the width of the wheel, shown by three wheel-widths marked below."
      >
        <line
          x1={20}
          y1={road}
          x2={360}
          y2={road}
          stroke={ROAD}
          strokeWidth={4}
        />
        {/* the stretch of road one turn covers */}
        <line
          x1={start}
          y1={road}
          x2={end}
          y2={road}
          stroke={ORANGE}
          strokeWidth={5}
        />
        <Wheel cx={start} cy={road - r - 4} r={r} mark={90} faint />
        <Wheel cx={end} cy={road - r - 4} r={r} mark={90} />
        <Span x1={start} x2={end} y={road - 2 * r - 26} color={ORANGE} />
        <Words x={(start + end) / 2} y={road - 2 * r - 36} color={ORANGE}>
          one turn: the circumference, 2πr
        </Words>
        {/* three wheel-widths, for comparison */}
        {[0, 1, 2].map((k) => (
          <rect
            key={k}
            x={start + k * 2 * r}
            y={road + 14}
            width={2 * r}
            height={12}
            fill={k % 2 ? "none" : BLUE}
            fillOpacity={0.35}
            stroke={BLUE}
            strokeWidth={1.5}
          />
        ))}
        <Words x={start} y={road + 48} anchor="start" color={BLUE}>
          three wheel-widths fall a little short
        </Words>
      </Svg>
    </Figure>
  );
}

/**
 * The path of a pizza slice: a sector of radius r and angle `angle` (in radians), with its point
 * at (x, y), pointing up (crust below) or down (crust above).
 */
function slice(x: number, y: number, r: number, angle: number, up: boolean) {
  const a = angle / 2;
  const s = up ? 1 : -1;
  const lx = x - r * Math.sin(a);
  const rx = x + r * Math.sin(a);
  const edge = y + s * r * Math.cos(a);
  // the crust bulges away from the point
  return `M ${x} ${y} L ${lx} ${edge} A ${r} ${r} 0 0 ${up ? 0 : 1} ${rx} ${edge} Z`;
}

function Pizza({
  cx,
  cy,
  r,
  n,
}: {
  cx: number;
  cy: number;
  r: number;
  n: number;
}) {
  const cuts = Array.from({ length: n }, (_, i) => (2 * Math.PI * i) / n);
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={CHEESE}
        stroke={CRUST}
        strokeWidth={4}
      />
      <g stroke={CRUST} strokeWidth={1.5}>
        {cuts.map((a) => (
          <line
            key={a}
            x1={cx}
            y1={cy}
            x2={cx + r * Math.cos(a)}
            y2={cy + r * Math.sin(a)}
          />
        ))}
      </g>
    </g>
  );
}

/** the slices of an n-slice pizza laid in a row, points up and down in turn, starting at x */
function Row({
  x,
  top,
  r,
  n,
}: {
  x: number;
  top: number;
  r: number;
  n: number;
}) {
  const angle = (2 * Math.PI) / n;
  const step = r * Math.sin(angle / 2);
  const low = top + r * Math.cos(angle / 2);
  return (
    <g strokeLinejoin="round">
      {Array.from({ length: n }, (_, i) => {
        const up = i % 2 === 0;
        return (
          <path
            key={i}
            d={slice(x + step * (i + 1), up ? top : low, r, angle, up)}
            fill={up ? CHEESE : CHEESE_LIGHT}
            stroke={CRUST}
            strokeWidth={2}
          />
        );
      })}
    </g>
  );
}

/**
 * A pizza cut into 8 slices and then 16, each laid out in a row with the points alternating. The
 * row of 16 is closer to a rectangle, about half the circumference long and one radius tall.
 */
export function PizzaRearranged({ caption }: { caption?: string }) {
  const r = 50;
  const rows = [
    { n: 8, y: 30 },
    { n: 16, y: 160 },
  ];
  const rowX = 160;
  return (
    <Figure caption={caption}>
      <Svg
        width={400}
        height={300}
        label="A pizza cut into 8 slices, and the same slices laid side by side with points alternately up and down, making a wavy shape. Below, the same with 16 slices, which is much closer to a rectangle about half the circumference long and one radius tall."
      >
        {rows.map(({ n, y }) => (
          <g key={n}>
            <Pizza cx={70} cy={y + r} r={r} n={n} />
            <Words x={70} y={y + 2 * r + 22}>
              {`${n} slices`}
            </Words>
            <Row x={rowX} top={y + 4} r={r} n={n} />
          </g>
        ))}
        {/* the measurements of the nearly rectangular row */}
        <Span
          x1={rowX + r * Math.sin(Math.PI / 16)}
          x2={rowX + r * Math.sin(Math.PI / 16) * 16}
          y={160 + r + 32}
          color={BLUE}
        />
        <Words x={rowX + 85} y={160 + r + 58} color={BLUE}>
          about half the circumference, πr
        </Words>
        <line
          x1={rowX + r * Math.sin(Math.PI / 16) * 17 + 14}
          y1={164}
          x2={rowX + r * Math.sin(Math.PI / 16) * 17 + 14}
          y2={164 + r * Math.cos(Math.PI / 16)}
          stroke={ORANGE}
          strokeWidth={3}
        />
        <Words
          x={rowX + r * Math.sin(Math.PI / 16) * 17 + 24}
          y={164 + r / 2 + 5}
          anchor="start"
          color={ORANGE}
        >
          r
        </Words>
      </Svg>
    </Figure>
  );
}
