import { Figure } from "../figure";
import {
  BLUE,
  ORANGE,
  PURPLE,
  STEEL,
  STEEL_LIGHT,
  Svg,
  Words,
  type Pt,
} from "../illustrations";

/**
 * Pictures for the Combining moves guide: footprints in sand, where each print is the one before it
 * flipped in the line of the walk and slid along it (a glide reflection), and the view into a
 * kaleidoscope, where two mirrors at 60° fill a whole circle with turned and flipped copies.
 */

const SAND = "#ecd9b0";
const SAND_DARK = "#d9bf8c";
const PRINT = "#b98d55";
const PRINT_EDGE = "#8f6a3b";

/**
 * One footprint, walking to the right, with its heel at the left. `side` is 1 for a print below the
 * line of the walk and −1 for one above it, so the big toe always points in towards the line.
 */
function Footprint({ at, side }: { at: Pt; side: 1 | -1 }) {
  const [cx, cy] = at;
  const toes: [number, number, number][] = [
    [27, -6, 4.6],
    [26, 1.5, 3.6],
    [24, 7, 3.2],
    [21, 11.5, 2.8],
    [17, 15, 2.5],
  ];
  return (
    <g fill={PRINT} stroke={PRINT_EDGE} strokeWidth={1}>
      <ellipse cx={cx - 14} cy={cy + 3 * side} rx={10} ry={7.5} />
      <ellipse cx={cx + 7} cy={cy + 2 * side} rx={13} ry={10.5} />
      {toes.map(([x, y, r], i) => (
        <circle key={i} cx={cx + x + 6} cy={cy + y * side} r={r} />
      ))}
    </g>
  );
}

/** Footprints in sand: left and right prints swap sides of the line of the walk at every step. */
export function GlideFootprints({ caption }: { caption?: string }) {
  const width = 600;
  const height = 250;
  const line = 140;
  const step = 112;
  const gap = 30;
  const prints = Array.from({ length: 5 }, (_, i) => ({
    at: [50 + i * step, line + (i % 2 === 0 ? gap : -gap)] as Pt,
    side: (i % 2 === 0 ? 1 : -1) as 1 | -1,
  }));
  // the arrow from the first print to the second: across the line, and along it
  const [ax, ay] = prints[0]!.at;
  const [bx, by] = prints[1]!.at;

  return (
    <Figure caption={caption}>
      <Svg
        width={width}
        height={height}
        label="Footprints in sand on either side of a dashed line. Each print is the one before it flipped across the line and slid along it."
      >
        <rect
          x={0}
          y={52}
          width={width}
          height={height - 52}
          rx={14}
          fill={SAND}
        />
        {/* a few ripples in the sand */}
        <g stroke={SAND_DARK} strokeWidth={2} fill="none" strokeLinecap="round">
          {[90, 205, 320, 460, 545].map((x, i) => (
            <path
              key={x}
              d={`M ${x - 18} ${i % 2 ? 228 : 72} q 9 -5 18 0 q 9 5 18 0`}
            />
          ))}
        </g>

        <line
          x1={0}
          y1={line}
          x2={width}
          y2={line}
          stroke={BLUE}
          strokeWidth={2}
          strokeDasharray="9 6"
        />
        {prints.map(({ at, side }, i) => (
          <Footprint key={i} at={at} side={side} />
        ))}

        {/* one step: flip across the line, then slide along it */}
        <path
          d={`M ${ax + 30} ${ay - 14} C ${ax + 55} ${line}, ${bx - 40} ${line}, ${bx - 26} ${by + 14}`}
          fill="none"
          stroke={PURPLE}
          strokeWidth={2.5}
          strokeDasharray="6 5"
        />
        <polygon
          points={`${bx - 22},${by + 10} ${bx - 34},${by + 16} ${bx - 23},${by + 22}`}
          fill={PURPLE}
        />

        <Words x={16} y={36} anchor="start" color={PURPLE}>
          each step: flip across the line, then slide along it
        </Words>
        <Words x={width - 12} y={line - 8} anchor="end" color={BLUE}>
          line of the walk
        </Words>
      </Svg>
    </Figure>
  );
}

/** a point turned about the origin by `degrees` */
function turn([x, y]: Pt, degrees: number): Pt {
  const a = (degrees * Math.PI) / 180;
  return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
}

/** a point flipped in the line through the origin at `degrees` */
function flip([x, y]: Pt, degrees: number): Pt {
  const a = (2 * degrees * Math.PI) / 180;
  return [x * Math.cos(a) + y * Math.sin(a), x * Math.sin(a) - y * Math.cos(a)];
}

/**
 * Looking into a kaleidoscope: two mirrors meet at 60°, with a few beads between them. The beads
 * are seen six times: turned by 0°, 120° and 240°, and flipped in each of the three mirror lines.
 */
export function Kaleidoscope({ caption }: { caption?: string }) {
  const size = 340;
  const c = size / 2;
  const reach = 150;
  // from units with y up and the origin at the centre, to pixels
  const px = ([x, y]: Pt): Pt => [c + x, c - y];
  const shape: Pt[] = [
    [70, 14],
    [118, 38],
    [92, 52],
    [80, 32],
  ];
  const bead: Pt = [52, 50];
  const copies: { map: (p: Pt) => Pt; real: boolean }[] = [
    { map: (p) => p, real: true },
    { map: (p) => turn(p, 120), real: false },
    { map: (p) => turn(p, 240), real: false },
    { map: (p) => flip(p, 0), real: false },
    { map: (p) => flip(p, 60), real: false },
    { map: (p) => flip(p, 120), real: false },
  ];
  const ray = (degrees: number): Pt => turn([reach, 0], degrees);

  return (
    <Figure caption={caption}>
      <Svg
        width={size}
        height={size}
        label="A view into a kaleidoscope. Two mirrors meet at the centre at 60 degrees. An orange shape and a green bead between them appear six times around the circle, turned and flipped."
      >
        <circle
          cx={c}
          cy={c}
          r={reach + 8}
          fill="#0f172a"
          fillOpacity={0.06}
          stroke={STEEL}
          strokeWidth={3}
        />
        {/* the mirror lines you seem to see, faintly */}
        <g stroke={STEEL} strokeWidth={1.5} strokeDasharray="5 5" opacity={0.6}>
          {[0, 60, 120].map((d) => {
            const [x1, y1] = px(ray(d));
            const [x2, y2] = px(ray(d + 180));
            return <line key={d} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>
        {/* the wedge between the two real mirrors */}
        <path
          d={`M ${c} ${c} L ${px(ray(0)).join(" ")} A ${reach} ${reach} 0 0 0 ${px(ray(60)).join(" ")} Z`}
          fill={ORANGE}
          fillOpacity={0.08}
        />

        {copies.map(({ map, real }, i) => (
          <g key={i} opacity={real ? 1 : 0.55}>
            <polygon
              points={shape.map((p) => px(map(p)).join(",")).join(" ")}
              fill={ORANGE}
              fillOpacity={0.75}
              stroke={ORANGE}
              strokeWidth={2}
              strokeLinejoin="round"
            />
            <circle
              cx={px(map(bead))[0]}
              cy={px(map(bead))[1]}
              r={8}
              fill="#22c55e"
            />
          </g>
        ))}

        {/* the two real mirrors, drawn as silvered strips */}
        {[0, 60].map((d) => {
          const [x2, y2] = px(ray(d));
          return (
            <g key={d} strokeLinecap="round">
              <line
                x1={c}
                y1={c}
                x2={x2}
                y2={y2}
                stroke={STEEL}
                strokeWidth={8}
              />
              <line
                x1={c}
                y1={c}
                x2={x2}
                y2={y2}
                stroke={STEEL_LIGHT}
                strokeWidth={4}
              />
            </g>
          );
        })}
        {/* the angle between the mirrors */}
        <path
          d={`M ${c + 28} ${c} A 28 28 0 0 0 ${c + 14} ${c - 28 * Math.sin(Math.PI / 3)}`}
          fill="none"
          stroke={BLUE}
          strokeWidth={2}
        />
        <Words x={c + 40} y={c - 14} anchor="start" color={BLUE}>
          60°
        </Words>
      </Svg>
    </Figure>
  );
}
