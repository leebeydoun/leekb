import { Figure } from "../figure";
import {
  CARDBOARD,
  CARDBOARD_EDGE,
  ORANGE,
  PAPER,
  PAPER_EDGE,
  PENCIL,
  Svg,
  Words,
} from "../illustrations";

/**
 * Real zooms: the shadow a lamp throws of a card held in front of it, and the A-series paper sizes,
 * where each size is the one above cut in half and is the same shape.
 */

const BULB = "#fde047";
const BULB_EDGE = "#ca8a04";
const WALL = "#e7e5e4";
const WALL_EDGE = "#a8a29e";

/** a horizontal measuring line with an arrow head at each end and a word above it */
function Span({
  x1,
  x2,
  y,
  children,
}: {
  x1: number;
  x2: number;
  y: number;
  children: string;
}) {
  return (
    <g>
      <g stroke={PENCIL} strokeWidth={1.5} fill={PENCIL}>
        <line x1={x1 + 8} y1={y} x2={x2 - 8} y2={y} />
        <polygon points={`${x1},${y} ${x1 + 9},${y - 4} ${x1 + 9},${y + 4}`} />
        <polygon points={`${x2},${y} ${x2 - 9},${y - 4} ${x2 - 9},${y + 4}`} />
      </g>
      <Words x={(x1 + x2) / 2} y={y - 8}>
        {children}
      </Words>
    </g>
  );
}

/**
 * A lamp, a card held 1 m from it, and a wall 3 m from it, seen from the side. The rays from the
 * bulb past the top and bottom of the card reach the wall three times as far apart, so the shadow
 * is the card zoomed by 3 about the bulb.
 */
export function LampShadow({ caption }: { caption?: string }) {
  const lamp = { x: 60, y: 140 };
  const metre = 140;
  const card = { x: lamp.x + metre, top: 115, bottom: 165 };
  const wall = lamp.x + 3 * metre;
  // the shadow: each end of the card, three times as far from the bulb
  const shadowTop = lamp.y + 3 * (card.top - lamp.y);
  const shadowBottom = lamp.y + 3 * (card.bottom - lamp.y);
  const floor = 250;
  return (
    <Figure caption={caption}>
      <Svg
        width={560}
        height={310}
        label="Side view of a lamp, a card 1 metre from the lamp, and a wall 3 metres from the lamp. Two rays from the bulb pass the top and bottom of the card and reach the wall, where they mark a shadow three times as tall as the card."
      >
        {/* the floor and the wall */}
        <line
          x1={20}
          y1={floor}
          x2={540}
          y2={floor}
          stroke={WALL_EDGE}
          strokeWidth={2}
        />
        <rect
          x={wall}
          y={16}
          width={22}
          height={floor - 16}
          fill={WALL}
          stroke={WALL_EDGE}
          strokeWidth={1.5}
        />

        {/* the shadow on the wall's face */}
        <rect
          x={wall - 1}
          y={shadowTop}
          width={8}
          height={shadowBottom - shadowTop}
          fill={PENCIL}
          fillOpacity={0.75}
        />

        {/* the rays from the bulb past the card's ends */}
        <g
          stroke={BULB_EDGE}
          strokeWidth={1.75}
          strokeDasharray="6 5"
          strokeOpacity={0.9}
        >
          <line x1={lamp.x} y1={lamp.y} x2={wall} y2={shadowTop} />
          <line x1={lamp.x} y1={lamp.y} x2={wall} y2={shadowBottom} />
        </g>

        {/* the lamp on its stand */}
        <line
          x1={lamp.x}
          y1={lamp.y + 12}
          x2={lamp.x}
          y2={floor}
          stroke={PENCIL}
          strokeWidth={3}
        />
        <rect
          x={lamp.x - 22}
          y={floor - 6}
          width={44}
          height={6}
          rx={2}
          fill={PENCIL}
        />
        <circle
          cx={lamp.x}
          cy={lamp.y}
          r={11}
          fill={BULB}
          stroke={BULB_EDGE}
          strokeWidth={2}
        />

        {/* the card */}
        <rect
          x={card.x - 3}
          y={card.top}
          width={6}
          height={card.bottom - card.top}
          fill={CARDBOARD}
          stroke={CARDBOARD_EDGE}
          strokeWidth={1.5}
        />

        <Words x={card.x} y={card.top - 14}>
          card, 20 cm
        </Words>
        <Words x={wall - 12} y={shadowTop + 4} anchor="end">
          shadow, 60 cm
        </Words>
        <Words x={lamp.x} y={lamp.y - 22}>
          bulb
        </Words>

        <Span x1={lamp.x} x2={card.x} y={floor + 24}>
          1 m
        </Span>
        <Span x1={lamp.x} x2={wall} y={floor + 52}>
          3 m
        </Span>
      </Svg>
    </Figure>
  );
}

/**
 * The A-series paper sizes: an A3 sheet cut in half across makes two A4 sheets, and one of those
 * cut in half makes two A5 sheets. Each is the same shape as the one before, turned on its side.
 */
export function PaperSizes({ caption }: { caption?: string }) {
  // millimetres to pixels
  const k = 0.62;
  const left = 70;
  const top = 26;
  const w = 297 * k;
  const h = 420 * k;
  const sheet = {
    fill: PAPER,
    stroke: PAPER_EDGE,
    strokeWidth: 2,
  };
  return (
    <Figure caption={caption}>
      <Svg
        width={420}
        height={330}
        label="An A3 sheet, 297 by 420 millimetres, divided by a line across its middle into two A4 sheets, 297 by 210. The lower A4 sheet is divided again into two A5 sheets, 148.5 by 210."
      >
        <rect
          x={left + 4}
          y={top + 5}
          width={w}
          height={h}
          fill="#000"
          fillOpacity={0.1}
        />
        <rect x={left} y={top} width={w} height={h} {...sheet} />
        {/* the cut that makes two A4 sheets, and the cut that makes two A5 sheets */}
        <line
          x1={left}
          y1={top + h / 2}
          x2={left + w}
          y2={top + h / 2}
          stroke={ORANGE}
          strokeWidth={2.5}
          strokeDasharray="7 5"
        />
        <line
          x1={left + w / 2}
          y1={top + h / 2}
          x2={left + w / 2}
          y2={top + h}
          stroke={ORANGE}
          strokeWidth={2.5}
          strokeDasharray="7 5"
        />
        <Words x={left + w / 2} y={top + h / 4 + 6} size={20}>
          A4
        </Words>
        <Words x={left + w / 4} y={top + (3 * h) / 4 + 6} size={18}>
          A5
        </Words>
        <Words x={left + (3 * w) / 4} y={top + (3 * h) / 4 + 6} size={18}>
          A5
        </Words>
        <Words x={left + w / 2} y={top + h + 22}>
          297 mm
        </Words>
        <Words x={left - 10} y={top + h / 2 + 5} anchor="end">
          420 mm
        </Words>
        <Words x={left + w + 10} y={top + h / 4 + 5} anchor="start">
          210 mm
        </Words>
        <Words x={left + w + 10} y={top + h / 4 + 25} anchor="start">
          (half of 420)
        </Words>
        <Words x={left + w + 10} y={top + 18} anchor="start" size={17}>
          A3
        </Words>
      </Svg>
    </Figure>
  );
}

const ROAD = "#a8a29e";
const CHORD = "#2563eb";

/** the centre line of the road: a gentle wave across the picture */
const road = (x: number) =>
  120 - 42 * Math.sin((x - 30) / 78) - 16 * Math.sin((x - 30) / 31);

/**
 * A winding road with five straight segments whose ends sit on it. The segments cut the corners, so
 * their total is a little less than the road's length, and shorter segments would hug it closer.
 */
export function WindingRoad({ caption }: { caption?: string }) {
  const steps = Array.from({ length: 101 }, (_, i) => 30 + i * 5);
  const path = steps
    .map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${road(x).toFixed(1)}`)
    .join(" ");
  const ends = [30, 130, 230, 330, 430, 530].map((x) => ({ x, y: road(x) }));
  return (
    <Figure caption={caption}>
      <Svg
        width={560}
        height={230}
        label="A winding grey road with five straight blue segments joining points on it. The segments cut across the bends, close to the road but a little shorter."
      >
        {/* the road: a wide grey band with a dashed centre line */}
        <path
          d={path}
          fill="none"
          stroke={ROAD}
          strokeWidth={18}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.45}
        />
        <path
          d={path}
          fill="none"
          stroke={ROAD}
          strokeWidth={1.5}
          strokeDasharray="6 6"
        />
        <polyline
          points={ends.map(({ x, y }) => `${x},${y.toFixed(1)}`).join(" ")}
          fill="none"
          stroke={CHORD}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        {ends.map(({ x, y }) => (
          <circle
            key={x}
            cx={x}
            cy={y}
            r={5}
            fill={CHORD}
            stroke="#fff"
            strokeWidth={1.5}
          />
        ))}
        <Words x={280} y={214} color={PENCIL}>
          the road (grey) and five straight segments (blue)
        </Words>
      </Svg>
    </Figure>
  );
}
