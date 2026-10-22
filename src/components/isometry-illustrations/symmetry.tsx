import type { ReactNode } from "react";
import { Figure } from "../figure";
import {
  BLUE,
  ORANGE,
  PENCIL,
  PURPLE,
  Svg,
  Words,
  type Pt,
} from "../illustrations";

/**
 * Pictures for the Symmetry guide: a mattress in its four positions, a snowflake with its mirror
 * lines, and a fan beside a hubcap, which share their turns but not their mirrors.
 */

const FABRIC = "#e0e7ff";
const FABRIC_EDGE = "#6366f1";
const TAG = "#f43f5e";
const ICE = "#7dd3fc";
const ICE_DARK = "#0284c7";
const METAL = "#cbd5e1";
const METAL_DARK = "#64748b";

/**
 * A mattress seen from above, with a tag sewn in one corner. Each of the four pictures shows
 * where the tag ends up after one of the four moves; the dashed line is the mirror line of a flip.
 */
export function MattressPositions({ caption }: { caption?: string }) {
  const w = 150;
  const h = 96;
  // each position: where the tag goes (as signs of x and y from the centre), and a mirror line
  const positions: {
    title: string;
    tag: Pt;
    mirror?: "long" | "short";
    turn?: boolean;
  }[] = [
    { title: "as it was", tag: [-1, 1] },
    { title: "half turn", tag: [1, -1], turn: true },
    { title: "flip over the long way", tag: [-1, -1], mirror: "long" },
    { title: "flip over the short way", tag: [1, 1], mirror: "short" },
  ];

  const panel = (p: (typeof positions)[number], i: number) => {
    const cx = 105;
    const cy = 78;
    const tx = cx + p.tag[0] * (w / 2 - 18);
    const ty = cy - p.tag[1] * (h / 2 - 14);
    return (
      <div key={i} style={{ flex: "1 1 180px", maxWidth: 230 }}>
        <Svg
          width={210}
          height={170}
          label={`The mattress after a ${p.title}, with the tag in a different corner`}
        >
          <rect
            x={cx - w / 2 + 3}
            y={cy - h / 2 + 4}
            width={w}
            height={h}
            rx={12}
            fill="#000"
            fillOpacity={0.12}
          />
          <rect
            x={cx - w / 2}
            y={cy - h / 2}
            width={w}
            height={h}
            rx={12}
            fill={FABRIC}
            stroke={FABRIC_EDGE}
            strokeWidth={2}
          />
          {/* quilting, so it reads as a mattress */}
          <g stroke={FABRIC_EDGE} strokeOpacity={0.35} strokeWidth={1}>
            {[-1, 0, 1].map((k) => (
              <line
                key={k}
                x1={cx + k * 38}
                y1={cy - h / 2 + 8}
                x2={cx + k * 38}
                y2={cy + h / 2 - 8}
              />
            ))}
          </g>
          {p.mirror && (
            <line
              x1={p.mirror === "long" ? cx - w / 2 - 12 : cx}
              y1={p.mirror === "long" ? cy : cy - h / 2 - 12}
              x2={p.mirror === "long" ? cx + w / 2 + 12 : cx}
              y2={p.mirror === "long" ? cy : cy + h / 2 + 12}
              stroke={PURPLE}
              strokeWidth={2}
              strokeDasharray="6 5"
            />
          )}
          {p.turn && (
            <path
              d={`M ${cx + 16} ${cy} A 16 16 0 1 1 ${cx} ${cy - 16}`}
              fill="none"
              stroke={PURPLE}
              strokeWidth={2}
            />
          )}
          <rect
            x={tx - 9}
            y={ty - 6}
            width={18}
            height={12}
            rx={2}
            fill={TAG}
          />
          <Words x={cx} y={160}>
            {p.title}
          </Words>
        </Svg>
      </div>
    );
  };

  return (
    <Figure caption={caption}>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-4">
        {positions.map(panel)}
      </div>
    </Figure>
  );
}

/** one arm of a snowflake, pointing straight up from the centre, with side branches */
function arm(cx: number, cy: number, length: number): string {
  const up = (r: number) => `${cx},${cy - r}`;
  const branch = (r: number, b: number) =>
    `M ${cx} ${cy - r} L ${cx - b * 0.75} ${cy - r - b} M ${cx} ${cy - r} L ${cx + b * 0.75} ${cy - r - b}`;
  return `M ${cx} ${cy} L ${up(length)} ${branch(length * 0.45, length * 0.28)} ${branch(length * 0.72, length * 0.18)}`;
}

/**
 * A snowflake with its six arms, and dashed mirror lines: three through the arms and three between
 * them. Turning it by 60° about its centre also puts it back on itself.
 */
export function Snowflake({ caption }: { caption?: string }) {
  const cx = 150;
  const cy = 140;
  const length = 100;
  const mirrors = Array.from({ length: 6 }, (_, k) => (k * 30 * Math.PI) / 180);
  return (
    <Figure caption={caption}>
      <Svg
        width={300}
        height={280}
        label="A six-armed snowflake with six dashed mirror lines through its centre, three along the arms and three between them"
      >
        <g
          stroke={PURPLE}
          strokeWidth={1.5}
          strokeDasharray="6 5"
          opacity={0.8}
        >
          {mirrors.map((a, k) => (
            <line
              key={k}
              x1={cx + Math.sin(a) * (length + 22)}
              y1={cy - Math.cos(a) * (length + 22)}
              x2={cx - Math.sin(a) * (length + 22)}
              y2={cy + Math.cos(a) * (length + 22)}
            />
          ))}
        </g>
        <g fill="none" strokeLinecap="round">
          {Array.from({ length: 6 }, (_, k) => (
            <g key={k} transform={`rotate(${k * 60} ${cx} ${cy})`}>
              <path d={arm(cx, cy, length)} stroke={ICE_DARK} strokeWidth={9} />
              <path d={arm(cx, cy, length)} stroke={ICE} strokeWidth={5} />
            </g>
          ))}
        </g>
        <circle
          cx={cx}
          cy={cy}
          r={9}
          fill={ICE}
          stroke={ICE_DARK}
          strokeWidth={2}
        />
      </Svg>
    </Figure>
  );
}

/**
 * A fan with curved blades beside a hubcap with straight spokes. Both look the same after a turn by
 * a third of a full turn, but only the hubcap has mirror lines: a mirror would make the fan's blades
 * curve the other way.
 */
export function FanAndHubcap({ caption }: { caption?: string }) {
  const panel = (label: string, title: string, children: ReactNode) => (
    <div style={{ flex: "1 1 200px", maxWidth: 260 }}>
      <Svg width={240} height={250} label={label}>
        {children}
        <Words x={120} y={240}>
          {title}
        </Words>
      </Svg>
    </div>
  );
  const cx = 120;
  const cy = 112;

  // a blade that sweeps round as it goes out, so its mirror image would sweep the other way
  const blade = `M ${cx} ${cy} C ${cx + 20} ${cy - 30}, ${cx + 70} ${cy - 50}, ${cx + 82} ${cy - 18} C ${cx + 86} ${cy - 2}, ${cx + 50} ${cy + 10}, ${cx} ${cy} Z`;

  return (
    <Figure caption={caption}>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-4">
        {panel(
          "A fan with three curved blades. It has turn symmetry but no mirror lines.",
          "fan: turns only",
          <>
            {[0, 120, 240].map((a) => (
              <path
                key={a}
                d={blade}
                transform={`rotate(${a} ${cx} ${cy})`}
                fill={BLUE}
                fillOpacity={0.75}
                stroke={BLUE}
                strokeWidth={2}
                strokeLinejoin="round"
              />
            ))}
            <circle cx={cx} cy={cy} r={14} fill={PENCIL} />
            <path
              d={`M ${cx + 100} ${cy - 20} A 100 100 0 0 0 ${cx + 60} ${cy - 82}`}
              fill="none"
              stroke={ORANGE}
              strokeWidth={2.5}
            />
            <polygon
              points={`${cx + 60},${cy - 82} ${cx + 74},${cy - 80} ${cx + 66},${cy - 70}`}
              fill={ORANGE}
            />
          </>,
        )}
        {panel(
          "A hubcap with three straight spokes and three dashed mirror lines through its centre.",
          "hubcap: turns and mirrors",
          <>
            <circle
              cx={cx}
              cy={cy}
              r={92}
              fill={METAL}
              stroke={METAL_DARK}
              strokeWidth={3}
            />
            <circle
              cx={cx}
              cy={cy}
              r={72}
              fill="none"
              stroke={METAL_DARK}
              strokeWidth={1.5}
            />
            {[0, 120, 240].map((a) => (
              <rect
                key={a}
                x={cx - 9}
                y={cy - 72}
                width={18}
                height={72}
                rx={4}
                transform={`rotate(${a} ${cx} ${cy})`}
                fill={METAL_DARK}
              />
            ))}
            <circle cx={cx} cy={cy} r={18} fill={METAL_DARK} />
            <g stroke={PURPLE} strokeWidth={1.5} strokeDasharray="6 5">
              {[0, 120, 240].map((a) => (
                <line
                  key={a}
                  x1={cx}
                  y1={cy - 104}
                  x2={cx}
                  y2={cy + 104}
                  transform={`rotate(${a} ${cx} ${cy})`}
                />
              ))}
            </g>
          </>,
        )}
      </div>
    </Figure>
  );
}
