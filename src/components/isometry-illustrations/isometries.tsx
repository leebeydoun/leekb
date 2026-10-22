import type { ReactNode } from "react";
import { Figure } from "../figure";
import {
  Ink,
  PAPER,
  PAPER_EDGE,
  PENCIL,
  PURPLE,
  STEEL,
  STEEL_LIGHT,
  Svg,
  WOOD,
  WOOD_DARK,
  Words,
  type Pt,
} from "../illustrations";

/**
 * Pictures for "What an isometry keeps": a door that swings on two hinges, and a sheet of tracing
 * paper held by drawing pins, first two and then three.
 */

/** A door in its frame, seen from the front, with its two hinges on the left edge. */
export function HingedDoor({ caption }: { caption?: string }) {
  const hinges: Pt[] = [
    [118, 74],
    [118, 238],
  ];
  return (
    <Figure caption={caption}>
      <Svg
        width={420}
        height={320}
        label="A door in its frame with two hinges on its left edge. A dashed line runs through both hinges, and an arrow shows the door swinging open about that line."
      >
        {/* the frame and the door */}
        <rect x={98} y={30} width={170} height={262} fill={WOOD_DARK} rx={4} />
        <rect
          x={114}
          y={42}
          width={142}
          height={250}
          fill={WOOD}
          stroke={WOOD_DARK}
          strokeWidth={2}
        />
        <rect
          x={132}
          y={62}
          width={106}
          height={88}
          fill="none"
          stroke={WOOD_DARK}
          strokeWidth={1.5}
          opacity={0.7}
        />
        <rect
          x={132}
          y={170}
          width={106}
          height={100}
          fill="none"
          stroke={WOOD_DARK}
          strokeWidth={1.5}
          opacity={0.7}
        />
        <circle cx={240} cy={168} r={7} fill={STEEL} />

        {/* the hinges */}
        {hinges.map(([x, y]) => (
          <g key={y}>
            <rect
              x={x - 6}
              y={y - 16}
              width={12}
              height={32}
              rx={2}
              fill={STEEL_LIGHT}
              stroke={STEEL}
              strokeWidth={1.5}
            />
            <line
              x1={x}
              y1={y - 16}
              x2={x}
              y2={y + 16}
              stroke={STEEL}
              strokeWidth={1.5}
            />
          </g>
        ))}

        {/* the line through the hinges, which never moves */}
        <line
          x1={118}
          y1={14}
          x2={118}
          y2={306}
          stroke={PURPLE}
          strokeWidth={2.5}
          strokeDasharray="8 6"
        />

        {/* the swing */}
        <path
          d="M 262 228 C 320 236, 352 196, 352 150"
          fill="none"
          stroke={PURPLE}
          strokeWidth={2.5}
        />
        <polygon points="352,138 344,154 360,154" fill={PURPLE} />

        <Words x={92} y={74} anchor="end">
          hinge
        </Words>
        <Words x={92} y={238} anchor="end">
          hinge
        </Words>
        <Words x={280} y={62} anchor="start">
          it swings,
        </Words>
        <Words x={280} y={80} anchor="start">
          but the hinge line
        </Words>
        <Words x={280} y={98} anchor="start">
          stays put
        </Words>
      </Svg>
    </Figure>
  );
}

/** a small flag drawn on the sheet: a pole with a pennant, so a flip shows as facing the other way */
const FLAG: [Pt, Pt, Pt, Pt] = [
  [0, 0],
  [0, -46],
  [30, -36],
  [0, -26],
];

function flag(at: Pt, map: (p: Pt) => Pt, color: string, faint = false) {
  const place = ([x, y]: Pt) => map([at[0] + x, at[1] + y]);
  const [pole, top, tip, back] = [
    place(FLAG[0]),
    place(FLAG[1]),
    place(FLAG[2]),
    place(FLAG[3]),
  ];
  return (
    <g opacity={faint ? 0.45 : 1}>
      <line
        x1={pole[0]}
        y1={pole[1]}
        x2={top[0]}
        y2={top[1]}
        stroke={PENCIL}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray={faint ? "4 3" : undefined}
      />
      <polygon
        points={[top, tip, back].map((p) => p.join(",")).join(" ")}
        fill={color}
        fillOpacity={faint ? 0.35 : 0.85}
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeDasharray={faint ? "4 3" : undefined}
      />
    </g>
  );
}

/** a drawing pin seen from above */
function Pin({ at }: { at: Pt }) {
  return (
    <g>
      <circle
        cx={at[0] + 1.5}
        cy={at[1] + 2}
        r={8}
        fill="#000"
        fillOpacity={0.18}
      />
      <circle
        cx={at[0]}
        cy={at[1]}
        r={8}
        fill="#ef4444"
        stroke="#991b1b"
        strokeWidth={1.5}
      />
      <circle
        cx={at[0] - 2.5}
        cy={at[1] - 2.5}
        r={2.5}
        fill="#fff"
        fillOpacity={0.7}
      />
    </g>
  );
}

function Sheet({ children }: { children: ReactNode }) {
  return (
    <>
      <rect
        x={23}
        y={24}
        width={214}
        height={176}
        fill="#000"
        fillOpacity={0.14}
        rx={2}
      />
      <rect
        x={20}
        y={20}
        width={214}
        height={176}
        fill={PAPER}
        stroke={PAPER_EDGE}
        strokeWidth={1.5}
        rx={2}
      />
      {children}
    </>
  );
}

/**
 * Tracing paper held by drawing pins. With two pins, the line through them stays put, but the
 * sheet can still be lifted and flipped over that line. With three pins not on one line, nothing
 * can move at all.
 */
export function PinnedSheet({ caption }: { caption?: string }) {
  // the line through the two pins, and the flip in it
  const A: Pt = [70, 60];
  const B: Pt = [190, 160];
  const length = Math.hypot(B[0] - A[0], B[1] - A[1]);
  const u: Pt = [(B[0] - A[0]) / length, (B[1] - A[1]) / length];
  const flip = ([x, y]: Pt): Pt => {
    const along = (x - A[0]) * u[0] + (y - A[1]) * u[1];
    const foot: Pt = [A[0] + u[0] * along, A[1] + u[1] * along];
    return [2 * foot[0] - x, 2 * foot[1] - y];
  };
  const same = (p: Pt) => p;
  const flagAt: Pt = [150, 96];

  const panel = (label: string, title: string, children: ReactNode) => (
    <div style={{ flex: "1 1 220px", maxWidth: 300 }}>
      <Svg width={260} height={250} label={label}>
        <Sheet>{children}</Sheet>
        <Words x={130} y={234}>
          {title}
        </Words>
      </Svg>
    </div>
  );

  return (
    <Figure caption={caption}>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-6">
        {panel(
          "Tracing paper held by two drawing pins, with a flag drawn on it. A dashed line runs through the pins, and a faint copy of the flag on the other side of the line shows where the flag goes if the sheet is flipped over that line.",
          "Two pins: it can still flip",
          <>
            <line
              x1={A[0] - u[0] * 60}
              y1={A[1] - u[1] * 60}
              x2={B[0] + u[0] * 40}
              y2={B[1] + u[1] * 40}
              stroke={PURPLE}
              strokeWidth={2}
              strokeDasharray="7 5"
            />
            {flag(flagAt, flip, "#3b82f6", true)}
            {flag(flagAt, same, "#3b82f6")}
            <path
              d="M 168 74 C 150 40, 100 60, 106 104"
              fill="none"
              stroke={PURPLE}
              strokeWidth={2}
            />
            <polygon points="106,114 99,100 113,100" fill={PURPLE} />
            <Pin at={A} />
            <Pin at={B} />
            <Ink x={70} y={88}>
              A
            </Ink>
            <Ink x={176} y={186}>
              B
            </Ink>
          </>,
        )}
        {panel(
          "Tracing paper held by three drawing pins that are not on one line, with a flag drawn on it. The sheet cannot slide, turn or flip.",
          "Three pins: nothing moves",
          <>
            {flag(flagAt, same, "#3b82f6")}
            <Pin at={A} />
            <Pin at={B} />
            <Pin at={[196, 50]} />
            <Ink x={70} y={88}>
              A
            </Ink>
            <Ink x={176} y={186}>
              B
            </Ink>
            <Ink x={196} y={78}>
              C
            </Ink>
          </>,
        )}
      </div>
    </Figure>
  );
}
