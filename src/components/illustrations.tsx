import type { ReactNode } from "react";
import { Figure } from "./figure";

/**
 * Pictures of real things, for the intuition paragraph before a definition or rule: a railway track,
 * a carpenter's board. They are drawn as objects rather than as points and lines, so a reader sees
 * the everyday thing first and the plain diagram after it. The materials keep fixed colours (wood
 * is brown in either theme), and the words use the page's colour with a halo, as the plane figures
 * do.
 */

export const WOOD = "#d4a373";
export const WOOD_DARK = "#8b5e34";
export const STEEL = "#6b7280";
export const STEEL_LIGHT = "#d1d5db";
export const BLUE = "#3b82f6";
export const PURPLE = "#a855f7";
export const PENCIL = "#1f2937";

export function Words({
  x,
  y,
  children,
  anchor = "middle",
  color = "currentColor",
  size = 15,
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
      fill={color}
      stroke="var(--color-fd-card)"
      strokeWidth={4}
      strokeLinejoin="round"
      paintOrder="stroke"
    >
      {children}
    </text>
  );
}

/** a line's name, such as L₁, with the letter in italics */
export const LineName = ({ sub }: { sub?: string }) => (
  <>
    <tspan fontStyle="italic">L</tspan>
    {sub && (
      <tspan fontSize="0.75em" dy="0.3em">
        {sub}
      </tspan>
    )}
  </>
);

/** a measuring line with an arrow head at each end, from (x, y1) down to (x, y2) */
export function Measure({
  x,
  y1,
  y2,
  color,
}: {
  x: number;
  y1: number;
  y2: number;
  color: string;
}) {
  const head = 11;
  const half = 7;
  const shape = (
    <>
      <line x1={x} y1={y1 + head} x2={x} y2={y2 - head} />
      <polygon
        points={`${x},${y1} ${x - half},${y1 + head} ${x + half},${y1 + head}`}
      />
      <polygon
        points={`${x},${y2} ${x - half},${y2 - head} ${x + half},${y2 - head}`}
      />
    </>
  );
  return (
    <g strokeLinejoin="round">
      {/* drawn twice: first wide in the card's colour, as a halo that lifts it off the wood */}
      <g
        stroke="var(--color-fd-card)"
        strokeWidth={8}
        fill="var(--color-fd-card)"
      >
        {shape}
      </g>
      <g stroke={color} strokeWidth={3.5} fill={color}>
        {shape}
      </g>
    </g>
  );
}

export function Svg({
  width,
  height,
  label,
  children,
}: {
  width: number;
  height: number;
  label: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="mx-auto block h-auto w-full text-fd-foreground"
      style={{ maxWidth: width }}
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  );
}

/** A railway track seen from above: two rails held the same distance apart by the sleepers. */
export function RailwayTrack({ caption }: { caption?: string }) {
  const width = 540;
  const top = 64;
  const bottom = 156;
  const sleepers = Array.from({ length: 11 }, (_, i) => 22 + i * 48);
  // two sleepers to measure, far apart along the track
  const measured = [sleepers[1]! + 9, sleepers[8]! + 9];
  // stones in the ballast, scattered the same way on every render
  const stones = Array.from({ length: 70 }, (_, i) => ({
    x: (i * 97) % width,
    y: 30 + ((i * 53) % 160),
    r: 1.5 + (i % 3),
  }));

  return (
    <Figure caption={caption}>
      <Svg
        width={width}
        height={240}
        label="A railway track seen from above. Wooden sleepers lie across two steel rails, and the gap between the rails is measured at two sleepers far apart: it is the same at both."
      >
        {/* the bed of stones the track is laid on */}
        <rect
          x={0}
          y={24}
          width={width}
          height={172}
          rx={6}
          fill={STEEL}
          fillOpacity={0.18}
        />
        {stones.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill={STEEL}
            fillOpacity={0.35}
          />
        ))}
        {/* the sleepers, laid square across the track */}
        {sleepers.map((x) => (
          <g key={x}>
            <rect
              x={x}
              y={34}
              width={18}
              height={152}
              rx={2}
              fill={WOOD}
              stroke={WOOD_DARK}
              strokeWidth={1.5}
            />
            <line
              x1={x + 6}
              y1={40}
              x2={x + 6}
              y2={180}
              stroke={WOOD_DARK}
              strokeOpacity={0.4}
            />
          </g>
        ))}
        {/* the two rails, steel with a bright running surface on top */}
        {[top, bottom].map((y) => (
          <g key={y}>
            <rect
              x={0}
              y={y - 6}
              width={width}
              height={12}
              fill={STEEL}
              rx={2}
            />
            <rect x={0} y={y - 2} width={width} height={4} fill={STEEL_LIGHT} />
          </g>
        ))}
        {measured.map((x) => (
          <Measure key={x} x={x} y1={top + 9} y2={bottom - 9} color={BLUE} />
        ))}
        {/* short leader lines from each name to the thing it names */}
        <g stroke="currentColor" strokeWidth={1.25} strokeOpacity={0.7}>
          <line x1={20} y1={18} x2={20} y2={top - 7} />
          <line x1={sleepers[5]! + 9} y1={18} x2={sleepers[5]! + 9} y2={34} />
        </g>
        <Words x={20} y={13}>
          rail
        </Words>
        <Words x={sleepers[5]! + 9} y={13}>
          sleeper
        </Words>
        <Words x={width / 2} y={222} color={BLUE}>
          the gap between the rails is the same at every sleeper
        </Words>
      </Svg>
    </Figure>
  );
}

/**
 * A carpenter's board: one line already drawn square to the bottom edge, and a set square resting
 * on that edge, drawing a second.
 */
export function CarpenterBoard({ caption }: { caption?: string }) {
  const left = 20;
  const right = 500;
  const top = 34;
  const edge = 214;
  const first = 130;
  const second = 310;
  const square = { width: 140, height: 132 };

  return (
    <Figure caption={caption}>
      <Svg
        width={520}
        height={270}
        label="A wooden board with a pencil line drawn square to its bottom edge. A set square rests on the same edge further along, and a pencil is drawing a second line up its upright side."
      >
        {/* the board, with its grain */}
        <rect
          x={left}
          y={top}
          width={right - left}
          height={edge - top}
          rx={3}
          fill={WOOD}
          stroke={WOOD_DARK}
          strokeWidth={1.5}
        />
        {[60, 92, 128, 170, 196].map((y, i) => (
          <path
            key={y}
            d={`M ${left + 4} ${y} C ${140 + i * 20} ${y - 10}, ${300 - i * 15} ${y + 12}, ${right - 4} ${y - 3}`}
            fill="none"
            stroke={WOOD_DARK}
            strokeOpacity={0.35}
            strokeWidth={1.25}
          />
        ))}
        {/* the straight edge everything is measured from */}
        <line
          x1={left}
          y1={edge}
          x2={right}
          y2={edge}
          stroke={WOOD_DARK}
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* the line already drawn, square to the edge */}
        <line
          x1={first}
          y1={top}
          x2={first}
          y2={edge}
          stroke={PENCIL}
          strokeWidth={2}
        />
        <polyline
          points={`${first},${edge - 14} ${first + 14},${edge - 14} ${first + 14},${edge}`}
          fill="none"
          stroke={PENCIL}
          strokeWidth={1.5}
        />

        {/* the set square, a flat triangle with a right angle, resting on the edge */}
        <polygon
          points={`${second},${edge} ${second + square.width},${edge} ${second},${edge - square.height}`}
          fill={PURPLE}
          fillOpacity={0.4}
          stroke={PURPLE}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <polygon
          points={`${second + 18},${edge - 16} ${second + 80},${edge - 16} ${second + 18},${edge - 74}`}
          fill={WOOD}
          stroke={PURPLE}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <polyline
          points={`${second},${edge - 12} ${second + 12},${edge - 12} ${second + 12},${edge}`}
          fill="none"
          stroke={PENCIL}
          strokeWidth={1.5}
        />

        {/* the second line: drawn up the square's side, still to be finished above it */}
        <line
          x1={second}
          y1={edge}
          x2={second}
          y2={edge - square.height}
          stroke={PENCIL}
          strokeWidth={2}
        />
        <line
          x1={second}
          y1={edge - square.height}
          x2={second}
          y2={top}
          stroke={PENCIL}
          strokeWidth={2}
          strokeDasharray="5 5"
          strokeOpacity={0.6}
        />

        {/* a pencil at the top of the line it is drawing */}
        <g
          transform={`translate(${second} ${edge - square.height - 4}) rotate(-35)`}
        >
          <polygon points="0,0 -6,-14 6,-14" fill="#f2c48d" />
          <polygon points="0,0 -2,-5 2,-5" fill={PENCIL} />
          <rect x={-6} y={-70} width={12} height={56} fill="#facc15" />
          <rect x={-6} y={-80} width={12} height={10} fill="#f472b6" />
        </g>

        <Words x={first} y={top - 10}>
          <LineName sub="1" />
        </Words>
        <Words x={second + 16} y={top - 10}>
          <LineName sub="3" />
        </Words>
        <Words x={second + 78} y={edge - 90} anchor="start">
          set square
        </Words>
        <Words x={(left + right) / 2} y={edge + 26}>
          the straight edge of the board, <LineName sub="2" />
        </Words>
        <Words x={(first + second) / 2} y={edge + 50} color={PURPLE}>
          slide the square along the edge →
        </Words>
      </Svg>
    </Figure>
  );
}

export const ORANGE = "#f97316";

/**
 * A clock at two o'clock. The narrow angle between its hands is shaded, and an arc marks the other
 * angle they make, the wide way round.
 */
export function ClockHands({ caption }: { caption?: string }) {
  const cx = 150;
  const cy = 150;
  const r = 112;
  // a point at a distance from the centre, at a clock angle in degrees (clockwise from 12)
  const at = (distance: number, degrees: number) => {
    const t = (degrees * Math.PI) / 180;
    return { x: cx + distance * Math.sin(t), y: cy - distance * Math.cos(t) };
  };
  const hour = 60;
  const sector = (() => {
    const start = at(64, 0);
    const end = at(64, hour);
    return `M ${cx} ${cy} L ${start.x} ${start.y} A 64 64 0 0 1 ${end.x} ${end.y} Z`;
  })();
  // the other angle, from the hour hand on round to 12, drawn as an arc near the centre
  const wide = (() => {
    const start = at(36, hour + 8);
    const end = at(36, 352);
    return `M ${start.x} ${start.y} A 36 36 0 1 1 ${end.x} ${end.y}`;
  })();
  const tip = at(36, 352);
  const narrowLabel = at(46, 30);
  const wideLabel = at(36, 210);

  return (
    <Figure caption={caption}>
      <Svg
        width={480}
        height={300}
        label="A clock at two o'clock. The narrow angle between the hands is shaded blue, and an orange arc goes the wide way round from one hand to the other."
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="var(--color-fd-card)"
          stroke="currentColor"
          strokeWidth={3}
        />
        {Array.from({ length: 12 }, (_, i) => {
          const outer = at(r - 6, i * 30);
          const inner = at(i % 3 === 0 ? r - 20 : r - 14, i * 30);
          return (
            <line
              key={i}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="currentColor"
              strokeWidth={i % 3 === 0 ? 3 : 1.5}
            />
          );
        })}
        {[12, 3, 6, 9].map((n) => {
          const p = at(r - 36, (n % 12) * 30);
          return (
            <text
              key={n}
              x={p.x}
              y={p.y + 6}
              textAnchor="middle"
              fontSize={17}
              fill="currentColor"
              fillOpacity={0.6}
            >
              {n}
            </text>
          );
        })}
        <path d={sector} fill={BLUE} fillOpacity={0.3} />
        <path d={wide} fill="none" stroke={ORANGE} strokeWidth={2.5} />
        <polygon
          points={`${tip.x + 6},${tip.y} ${tip.x - 3},${tip.y - 5} ${tip.x - 3},${tip.y + 5}`}
          fill={ORANGE}
        />
        {/* the hands: the minute hand on 12 and the hour hand on 2 */}
        {[
          { degrees: 0, length: 92, width: 4 },
          { degrees: hour, length: 66, width: 6 },
        ].map((hand) => {
          const end = at(hand.length, hand.degrees);
          return (
            <line
              key={hand.degrees}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="currentColor"
              strokeWidth={hand.width}
              strokeLinecap="round"
            />
          );
        })}
        <circle cx={cx} cy={cy} r={6} fill="currentColor" />

        {/* names, with leader lines to what they name */}
        <g stroke="currentColor" strokeWidth={1.25} strokeOpacity={0.7}>
          <line x1={narrowLabel.x} y1={narrowLabel.y} x2={300} y2={60} />
          <line x1={wideLabel.x} y1={wideLabel.y} x2={300} y2={236} />
        </g>
        <Words x={306} y={58} anchor="start" color={BLUE}>
          the angle between
        </Words>
        <Words x={306} y={76} anchor="start" color={BLUE}>
          the hands
        </Words>
        <Words x={306} y={236} anchor="start" color={ORANGE}>
          the other angle,
        </Words>
        <Words x={306} y={254} anchor="start" color={ORANGE}>
          the wide way round
        </Words>
      </Svg>
    </Figure>
  );
}

export const CARD = "#fcd34d";
export const CARD_EDGE = "#b45309";
export const CARD_TWO = "#6ee7b7";
export const CARD_TWO_EDGE = "#047857";

export type Pt = readonly [number, number];

/** a triangle cut from card, with a small shadow so it reads as an object lying on the page */
export function CardTriangle({
  corners,
  fill,
  edge,
  opacity = 1,
}: {
  corners: readonly [Pt, Pt, Pt];
  fill: string;
  edge: string;
  opacity?: number;
}) {
  const points = (dx: number, dy: number) =>
    corners.map(([x, y]) => `${x + dx},${y + dy}`).join(" ");
  return (
    <g opacity={opacity}>
      <polygon points={points(3, 4)} fill="#000" fillOpacity={0.12} />
      <polygon
        points={points(0, 0)}
        fill={fill}
        stroke={edge}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </g>
  );
}

/** the small square that marks a right angle at `at`, with its arms along `u` and `v` */
export function Corner({ at, u, v }: { at: Pt; u: Pt; v: Pt }) {
  const s = 12;
  const p = (a: number, b: number) =>
    `${at[0] + u[0] * a + v[0] * b},${at[1] + u[1] * a + v[1] * b}`;
  return (
    <polyline
      points={`${p(s, 0)} ${p(s, s)} ${p(0, s)}`}
      fill="none"
      stroke={PENCIL}
      strokeWidth={1.5}
    />
  );
}

/**
 * Two right triangles cut from card, each with legs of 3 cm and 4 cm. The second is turned over and
 * laid on the first, and it fits exactly.
 */
export function CardTriangles({ caption }: { caption?: string }) {
  // 30 pixels to a centimetre
  const cm = 30;
  const base = 196;
  // the first card: the right angle at the bottom left, the 4 cm leg along the bottom
  const first = (x: number): [Pt, Pt, Pt] => [
    [x, base],
    [x + 4 * cm, base],
    [x, base - 3 * cm],
  ];
  // the second card, turned over: the right angle at the top right, the 4 cm leg running down
  const sx = 340;
  const sy = 58;
  const second: [Pt, Pt, Pt] = [
    [sx, sy],
    [sx, sy + 4 * cm],
    [sx - 3 * cm, sy],
  ];
  const left = 40;
  const right = 440;

  return (
    <Figure caption={caption}>
      <Svg
        width={600}
        height={284}
        label="Two right triangles cut from card, each with legs of 3 cm and 4 cm. The second is turned over and laid on top of the first, where it covers it exactly."
      >
        {/* the first card */}
        <CardTriangle corners={first(left)} fill={CARD} edge={CARD_EDGE} />
        <Corner at={[left, base]} u={[1, 0]} v={[0, -1]} />
        <Words x={left + 2 * cm} y={base + 22}>
          4 cm
        </Words>
        <Words x={left - 8} y={base - 1.5 * cm + 5} anchor="end">
          3 cm
        </Words>

        {/* the second card, the other way up */}
        <CardTriangle corners={second} fill={CARD_TWO} edge={CARD_TWO_EDGE} />
        <Corner at={[sx, sy]} u={[-1, 0]} v={[0, 1]} />
        <Words x={sx - 1.5 * cm} y={sy - 10}>
          3 cm
        </Words>
        <Words x={sx + 8} y={sy + 2 * cm + 5} anchor="start">
          4 cm
        </Words>

        {/* picked up, turned over and laid on the first card's twin */}
        <path
          d={`M ${sx + 14} ${sy + 18} C ${sx + 60} ${sy - 12}, ${right - 10} ${sy}, ${right + 40} ${base - 3 * cm - 6}`}
          fill="none"
          stroke={PURPLE}
          strokeWidth={2.5}
          strokeDasharray="6 5"
        />
        <polygon
          points={`${right + 40},${base - 3 * cm - 2} ${right + 30},${base - 3 * cm - 16} ${right + 46},${base - 3 * cm - 14}`}
          fill={PURPLE}
        />
        <Words x={(sx + right) / 2 + 30} y={34} color={PURPLE}>
          turn it over and lay it on top
        </Words>

        {/* the result: the second card covers the first exactly */}
        <CardTriangle corners={first(right)} fill={CARD} edge={CARD_EDGE} />
        <polygon
          points={first(right)
            .map(([x, y]) => `${x},${y}`)
            .join(" ")}
          fill={CARD_TWO}
          fillOpacity={0.75}
          stroke={CARD_TWO_EDGE}
          strokeWidth={2}
          strokeDasharray="7 4"
          strokeLinejoin="round"
        />
        <Corner at={[right, base]} u={[1, 0]} v={[0, -1]} />

        <Words x={left + 2 * cm} y={base + 52}>
          first card
        </Words>
        <Words x={sx - 1.5 * cm} y={base + 52}>
          second card
        </Words>
        <Words x={right + 2 * cm} y={base + 52}>
          a perfect fit: none of
        </Words>
        <Words x={right + 2 * cm} y={base + 70}>
          the first card shows
        </Words>
      </Svg>
    </Figure>
  );
}

export const CARDBOARD = "#e9c99a";
export const CARDBOARD_EDGE = "#b7804a";
export const PENCIL_YELLOW = "#facc15";
export const PENCIL_STRIPE = "#eab308";
export const ERASER = "#f472b6";
export const FERRULE = "#cbd5e1";

type Pt3 = readonly [number, number, number];

/**
 * A see-through box 6 long, 3 deep and 2 high, for finding the diagonal through it with two right
 * triangles. `pencil` shows the longest pencil that fits, from a bottom corner to the opposite top
 * corner. `floor` shades the first triangle, on the floor, and `upright` the second, which stands on
 * the floor's diagonal; both also draw their triangle flat beside the box, as it looks face on.
 */
export function BoxDiagonal({
  step,
  caption,
}: {
  step: "pencil" | "floor" | "upright";
  caption?: string;
}) {
  // a slanted view: length runs right, height runs up, and depth runs back up and to the right
  const unit = 44;
  const depth: Pt = [0.7 * Math.cos(0.7), 0.7 * Math.sin(0.7)];
  const ox = 30;
  const oy = 172;
  const at = ([x, y, z]: Pt3): Pt => [
    ox + unit * (x + depth[0] * y),
    oy - unit * (z + depth[1] * y),
  ];
  const xy = (p: Pt3) => at(p).join(",");
  const line = (p: Pt3, q: Pt3) => {
    const [x1, y1] = at(p);
    const [x2, y2] = at(q);
    return { x1, y1, x2, y2 };
  };
  const toward = (p: Pt3, q: Pt3): Pt => {
    const [x1, y1] = at(p);
    const [x2, y2] = at(q);
    const length = Math.hypot(x2 - x1, y2 - y1);
    return [(x2 - x1) / length, (y2 - y1) / length];
  };
  const middle = (p: Pt3, q: Pt3, dx: number, dy: number): Pt => {
    const [x1, y1] = at(p);
    const [x2, y2] = at(q);
    return [(x1 + x2) / 2 + dx, (y1 + y2) / 2 + dy];
  };

  // the corners named in the text: A at the front bottom left, B along the length from it, C
  // across the floor from A, and G straight above C
  const A: Pt3 = [0, 0, 0];
  const B: Pt3 = [6, 0, 0];
  const C: Pt3 = [6, 3, 0];
  const G: Pt3 = [6, 3, 2];
  const hidden: Pt3 = [0, 3, 0];
  const faces: Pt3[][] = [
    [A, B, [6, 0, 2], [0, 0, 2]],
    [[0, 0, 2], [6, 0, 2], G, [0, 3, 2]],
    [B, C, G, [6, 0, 2]],
  ];

  const italic = (letter: string) => <tspan fontStyle="italic">{letter}</tspan>;
  const label = (
    [x, y]: Pt,
    text: ReactNode,
    anchor?: "start" | "end",
    color?: string,
  ) => (
    <Words size={18} x={x} y={y} anchor={anchor} color={color}>
      {text}
    </Words>
  );

  // the pencil, from A to G, drawn lying along the x axis and then turned into place: an eraser
  // and its metal band at A, the painted body, and the sharpened wood and lead at G
  const pencil = () => {
    const [x1, y1] = at(A);
    const [x2, y2] = at(G);
    const length = Math.hypot(x2 - x1, y2 - y1);
    const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    const half = 6;
    const cone = 24;
    const outline = {
      stroke: PENCIL,
      strokeWidth: 1.25,
      strokeLinejoin: "round" as const,
    };
    return (
      <g transform={`translate(${x1} ${y1}) rotate(${angle})`}>
        <rect
          x={2}
          y={-half}
          width={12}
          height={half * 2}
          rx={3}
          fill={ERASER}
          {...outline}
        />
        <rect
          x={12}
          y={-half}
          width={10}
          height={half * 2}
          fill={FERRULE}
          {...outline}
        />
        <rect
          x={22}
          y={-half}
          width={length - cone - 22}
          height={half * 2}
          fill={PENCIL_YELLOW}
          {...outline}
        />
        {/* a darker stripe along one side, so the body reads as round rather than flat */}
        <rect
          x={22.6}
          y={half / 3}
          width={length - cone - 23.2}
          height={half / 2}
          fill={PENCIL_STRIPE}
        />
        <polygon
          points={`${length - cone},${-half} ${length},0 ${length - cone},${half}`}
          fill={WOOD}
          {...outline}
        />
        <polygon
          points={`${length - 8},-2 ${length},0 ${length - 8},2`}
          fill={PENCIL}
        />
      </g>
    );
  };

  // a measuring line beside the edge from p to q, pushed out by `push` (in pixels, x and y), with a
  // short tick at each end and the length written beyond its middle
  const dimension = (p: Pt3, q: Pt3, push: Pt, text: string) => {
    const [x1, y1] = at(p);
    const [x2, y2] = at(q);
    const n = Math.hypot(push[0], push[1]);
    const [nx, ny] = [push[0] / n, push[1] / n];
    const tick = (x: number, y: number) => (
      <line
        x1={x + push[0] - nx * 5}
        y1={y + push[1] - ny * 5}
        x2={x + push[0] + nx * 5}
        y2={y + push[1] + ny * 5}
      />
    );
    return (
      <g>
        <g stroke="currentColor" strokeWidth={1.25} opacity={0.6}>
          <line
            x1={x1 + push[0]}
            y1={y1 + push[1]}
            x2={x2 + push[0]}
            y2={y2 + push[1]}
          />
          {tick(x1, y1)}
          {tick(x2, y2)}
        </g>
        <Words
          size={18}
          x={(x1 + x2) / 2 + push[0] + nx * 16}
          y={(y1 + y2) / 2 + push[1] + ny * 16 + 5}
        >
          {text}
        </Words>
      </g>
    );
  };

  return (
    <Figure caption={caption}>
      {/* the box and the flat triangle side by side, or one above the other on a narrow screen */}
      <div className="flex flex-wrap items-end justify-center gap-x-6 gap-y-2">
        <div style={{ flex: "1 1 260px", maxWidth: 400 }}>
          <Svg
            width={400}
            height={216}
            label={
              step === "pencil"
                ? "A box 6 long, 3 wide and 2 high, with a pencil running inside it from a bottom front corner to the opposite top back corner."
                : step === "floor"
                  ? "The box with a right triangle shaded on its floor. Its legs are the length 6 and the width 3, and its hypotenuse is the floor diagonal f."
                  : "The box with a right triangle standing upright inside it. Its legs are the floor diagonal f and the upright edge 2 at the far corner, and its hypotenuse is the diagonal D through the box."
            }
          >
            {/* the box, see-through: light faces first, then the edges hidden behind them dashed */}
            {faces.map((face, i) => (
              <polygon
                key={i}
                points={face.map(xy).join(" ")}
                fill={CARDBOARD}
                fillOpacity={[0.14, 0.24, 0.32][i]}
              />
            ))}
            <g stroke={CARDBOARD_EDGE} strokeWidth={1.5} strokeDasharray="5 4">
              <line {...line(hidden, A)} />
              <line {...line(hidden, C)} />
              <line {...line(hidden, [0, 3, 2])} />
            </g>

            {step === "floor" && (
              <>
                <polygon
                  points={[A, B, C].map(xy).join(" ")}
                  fill={CARD}
                  fillOpacity={0.9}
                  stroke={CARD_EDGE}
                  strokeWidth={2}
                  strokeLinejoin="round"
                />
                <Corner at={at(B)} u={toward(B, A)} v={toward(B, C)} />
              </>
            )}
            {step === "upright" && (
              <>
                <polygon
                  points={[A, C, G].map(xy).join(" ")}
                  fill={CARD_TWO}
                  fillOpacity={0.85}
                  stroke={CARD_TWO_EDGE}
                  strokeWidth={2}
                  strokeLinejoin="round"
                />
                <line {...line(A, C)} stroke={CARD_EDGE} strokeWidth={3} />
                <line {...line(A, G)} stroke={PURPLE} strokeWidth={3} />
                <Corner at={at(C)} u={toward(C, A)} v={toward(C, G)} />
              </>
            )}

            <g
              stroke={CARDBOARD_EDGE}
              strokeWidth={2.5}
              strokeLinejoin="round"
              fill="none"
            >
              {faces.map((face, i) => (
                <polygon key={i} points={face.map(xy).join(" ")} />
              ))}
            </g>
            {step === "pencil" && pencil()}

            {dimension(A, B, [0, 16], "6")}
            {dimension(B, C, [10, 12], "3")}
            {dimension(C, G, [16, 0], "2")}
            {step === "floor" &&
              label(middle(A, C, -4, -12), italic("f"), "end", CARD_EDGE)}
            {step === "upright" && (
              <>
                {label(middle(A, C, 14, 22), italic("f"), "start", CARD_EDGE)}
                {label(middle(A, G, -10, -14), italic("D"), "end", PURPLE)}
              </>
            )}
          </Svg>
        </div>
        {/* the triangle laid flat beside the box, so its right angle shows square-on */}
        {step === "floor" && (
          <FlatTriangle
            legs={[6, 3]}
            names={["6", "3", italic("f")]}
            fill={CARD}
            edge={CARD_EDGE}
            title="seen from above"
          />
        )}
        {step === "upright" && (
          <FlatTriangle
            legs={[Math.sqrt(45), 2]}
            names={[italic("f"), "2", italic("D")]}
            fill={CARD_TWO}
            edge={CARD_TWO_EDGE}
            hypotenuse={PURPLE}
            title="seen face on"
          />
        )}
      </div>
    </Figure>
  );
}

/** a right triangle drawn flat, its right angle at the bottom right, for beside the box */
function FlatTriangle({
  legs: [across, up],
  names: [acrossName, upName, hypotenuseName],
  fill,
  edge,
  hypotenuse = edge,
  title,
}: {
  legs: readonly [number, number];
  names: readonly [ReactNode, ReactNode, ReactNode];
  fill: string;
  edge: string;
  hypotenuse?: string;
  title: string;
}) {
  const unit = 28;
  const right = 210;
  const base = 130;
  const left = right - across * unit;
  const top = base - up * unit;
  return (
    <div style={{ flex: "1 1 160px", maxWidth: 250 }}>
      <Svg width={250} height={160} label={`The same triangle, ${title}.`}>
        <polygon
          points={`${left},${base} ${right},${base} ${right},${top}`}
          fill={fill}
          fillOpacity={0.9}
          stroke={edge}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <line
          x1={left}
          y1={base}
          x2={right}
          y2={top}
          stroke={hypotenuse}
          strokeWidth={3}
        />
        <Corner at={[right, base]} u={[-1, 0]} v={[0, -1]} />
        <Words size={18} x={(left + right) / 2} y={base + 24}>
          {acrossName}
        </Words>
        <Words size={18} x={right + 10} y={(base + top) / 2 + 5} anchor="start">
          {upName}
        </Words>
        <Words
          size={18}
          x={(left + right) / 2 - 8}
          y={(base + top) / 2 - 10}
          anchor="end"
          color={hypotenuse}
        >
          {hypotenuseName}
        </Words>
        <Words
          size={18}
          x={(left + right) / 2}
          y={top - 30}
          color="var(--color-fd-muted-foreground)"
        >
          {title}
        </Words>
      </Svg>
    </div>
  );
}

export const PAPER = "#fbfaf7";
export const PAPER_BACK = "#ece6d8";
export const PAPER_EDGE = "#c9c3b8";
export const CREASE = "#a8a29e";

/** a name written on the paper itself: dark ink, since the sheet is light in either theme */
export function Ink({
  x,
  y,
  children,
}: {
  x: number;
  y: number;
  children: ReactNode;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize={17}
      fontStyle="italic"
      fill={PENCIL}
    >
      {children}
    </text>
  );
}

/**
 * Folding a sheet of paper so that P lands on Q, in three steps: the sheet with P and Q marked, the
 * sheet folded, and the sheet opened out again with its crease. The crease crosses PQ square on at
 * its middle O, and a point X on it is as far from P as from Q.
 */
export function PaperFold({ caption }: { caption?: string }) {
  const sheet: Pt[] = [
    [24, 22],
    [206, 22],
    [206, 178],
    [24, 178],
  ];
  // P near a corner, so the flap folded over is small and stays on the sheet
  const P: Pt = [184, 42];
  const Q: Pt = [96, 118];
  const O: Pt = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2];
  const length = Math.hypot(Q[0] - P[0], Q[1] - P[1]);
  // u runs from P to Q, and n along the crease, square to it
  const u: Pt = [(Q[0] - P[0]) / length, (Q[1] - P[1]) / length];
  const n: Pt = [-u[1], u[0]];
  // how far a point lies on Q's side of the crease (negative on P's side)
  const side = (p: Pt) => (p[0] - O[0]) * u[0] + (p[1] - O[1]) * u[1];
  // the point reached by folding p over the crease
  const fold = (p: Pt): Pt => {
    const s = side(p);
    return [p[0] - 2 * s * u[0], p[1] - 2 * s * u[1]];
  };
  // the part of the sheet on one side of the crease: +1 for Q's side, -1 for P's
  const half = (sign: number): Pt[] => {
    const out: Pt[] = [];
    sheet.forEach((p, i) => {
      const q = sheet[(i + 1) % sheet.length]!;
      const sp = side(p) * sign;
      const sq = side(q) * sign;
      if (sp >= 0) out.push(p);
      if (sp * sq < 0) {
        const t = sp / (sp - sq);
        out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]);
      }
    });
    return out;
  };
  const points = (ps: Pt[], dx = 0, dy = 0) =>
    ps.map(([x, y]) => `${x + dx},${y + dy}`).join(" ");
  // where the crease meets the edges of the sheet: the two corners shared by both halves
  const crease = half(1).filter((p) => Math.abs(side(p)) < 1e-6) as [Pt, Pt];
  const X: Pt = [O[0] - n[0] * 62, O[1] - n[1] * 62];
  // the arrow in the first step, curving from P over to Q, with its head along the curve's end
  const start: Pt = [P[0] - 10, P[1] - 8];
  const bend: Pt = [96, 34];
  const end: Pt = [Q[0] - 3, Q[1] - 12];
  const heading = Math.atan2(end[1] - bend[1], end[0] - bend[0]);
  const head = (back: number, turn: number) =>
    `${end[0] - Math.cos(heading + turn) * back},${end[1] - Math.sin(heading + turn) * back}`;

  const paper = (ps: Pt[], fill = PAPER) => (
    <>
      <polygon points={points(ps, 3, 4)} fill="#000" fillOpacity={0.14} />
      <polygon
        points={points(ps)}
        fill={fill}
        stroke={PAPER_EDGE}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </>
  );
  const dot = ([x, y]: Pt, color = PENCIL) => (
    <circle cx={x} cy={y} r={4} fill={color} />
  );
  // a short mark across the middle of a segment; marks that match say the lengths are the same
  const ticks = (a: Pt, b: Pt, count: number, color: string) => {
    const [mx, my] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const [dx, dy] = [(b[0] - a[0]) / l, (b[1] - a[1]) / l];
    return Array.from({ length: count }, (_, i) => {
      const k = (i - (count - 1) / 2) * 5;
      const [cx, cy] = [mx + dx * k, my + dy * k];
      return (
        <line
          key={i}
          x1={cx - dy * 6}
          y1={cy + dx * 6}
          x2={cx + dy * 6}
          y2={cy - dx * 6}
          stroke={color}
          strokeWidth={2}
        />
      );
    });
  };

  const panel = (label: string, title: string, children: ReactNode) => (
    <div style={{ flex: "1 1 150px", maxWidth: 240 }}>
      <Svg width={230} height={226} label={label}>
        {children}
        <Words x={115} y={214}>
          {title}
        </Words>
      </Svg>
    </div>
  );

  return (
    <Figure caption={caption}>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-6">
        {panel(
          "A sheet of paper with two points P and Q marked on it, and an arrow from P to Q.",
          "1. Mark P and Q",
          <>
            {paper(sheet)}
            <path
              d={`M ${start[0]} ${start[1]} Q ${bend[0]} ${bend[1]} ${head(10, 0)}`}
              fill="none"
              stroke={PURPLE}
              strokeWidth={2.5}
              strokeDasharray="6 5"
            />
            <polygon
              points={`${end[0]},${end[1]} ${head(14, 0.45)} ${head(14, -0.45)}`}
              fill={PURPLE}
            />
            {dot(P)}
            {dot(Q)}
            <Ink x={P[0] + 14} y={P[1] - 6}>
              P
            </Ink>
            <Ink x={Q[0] - 14} y={Q[1] + 6}>
              Q
            </Ink>
          </>,
        )}
        {panel(
          "The sheet folded so that the corner holding P lies over the rest, with P exactly on top of Q.",
          "2. Fold P onto Q",
          <>
            {paper(half(1))}
            {/* the corner holding P, folded over: its back shows, and P sits on Q */}
            {paper(half(-1).map(fold), PAPER_BACK)}
            {dot(Q, PURPLE)}
            <Ink x={Q[0]} y={Q[1] + 26}>
              P on Q
            </Ink>
          </>,
        )}
        {panel(
          "The sheet opened out. The crease crosses the segment PQ at its midpoint O, square on, and a point X on the crease is joined to P and to Q by segments of the same length.",
          "3. Open it out",
          <>
            {paper(sheet)}
            <line
              x1={crease[0][0]}
              y1={crease[0][1]}
              x2={crease[1][0]}
              y2={crease[1][1]}
              stroke={CREASE}
              strokeWidth={2}
              strokeDasharray="7 4"
            />
            <line
              x1={P[0]}
              y1={P[1]}
              x2={Q[0]}
              y2={Q[1]}
              stroke={PENCIL}
              strokeWidth={2}
            />
            {ticks(P, O, 1, PENCIL)}
            {ticks(O, Q, 1, PENCIL)}
            <g stroke={BLUE} strokeWidth={2} strokeDasharray="5 4">
              <line x1={X[0]} y1={X[1]} x2={P[0]} y2={P[1]} />
              <line x1={X[0]} y1={X[1]} x2={Q[0]} y2={Q[1]} />
            </g>
            {ticks(X, P, 2, BLUE)}
            {ticks(X, Q, 2, BLUE)}
            <Corner at={O} u={u} v={n} />
            {dot(P)}
            {dot(Q)}
            {dot(O)}
            {dot(X, BLUE)}
            <Ink x={P[0] + 14} y={P[1] - 6}>
              P
            </Ink>
            <Ink x={Q[0] - 14} y={Q[1] + 6}>
              Q
            </Ink>
            <Ink x={O[0] + 2} y={O[1] - 14}>
              O
            </Ink>
            <Ink x={X[0] + 14} y={X[1] + 6}>
              X
            </Ink>
          </>,
        )}
      </div>
    </Figure>
  );
}

export const GRASS = "#8cc46f";
export const GRASS_DARK = "#4d7c3a";
export const SHIRT = "#2563eb";
export const HAIR = "#5b3a29";

/** a word written over the grass: dark, with a pale halo, the same in either theme */
export function FieldWords({
  x,
  y,
  anchor = "middle",
  children,
}: {
  x: number;
  y: number;
  anchor?: "start" | "middle" | "end";
  children: ReactNode;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={15}
      fill={PENCIL}
      stroke="#eef8e6"
      strokeWidth={4}
      strokeLinejoin="round"
      paintOrder="stroke"
    >
      {children}
    </text>
  );
}

/**
 * A field seen from above, with a long straight fence and a person standing in it. The straight path
 * to the fence meets it square on and is the shortest; the slanted paths end further along and are
 * longer, each the hypotenuse of a right triangle whose leg is the straight path.
 */
export function FenceWalk({ caption }: { caption?: string }) {
  const width = 560;
  const height = 300;
  const fence = 76;
  const you: Pt = [190, 238];
  const foot: Pt = [you[0], fence + 5];
  const ends: Pt[] = [
    [330, fence + 5],
    [450, fence + 5],
  ];
  const posts = Array.from({ length: 11 }, (_, i) => 30 + i * 50);
  // tufts of grass at fixed places, so the field reads as grass rather than a green box
  const tufts: Pt[] = [
    [60, 130],
    [120, 210],
    [90, 270],
    [270, 250],
    [380, 200],
    [500, 250],
    [470, 130],
    [300, 140],
    [520, 180],
    [60, 40],
    [250, 36],
    [420, 30],
  ];

  return (
    <Figure caption={caption}>
      <Svg
        width={width}
        height={height}
        label="A field seen from above with a straight fence along the top. A person stands in the field. The straight path from the person meets the fence square on and is marked shortest. Two slanted paths reach the fence further along and are marked longer."
      >
        <rect x={0} y={0} width={width} height={height} rx={14} fill={GRASS} />
        <g
          stroke={GRASS_DARK}
          strokeWidth={1.5}
          strokeLinecap="round"
          fill="none"
          opacity={0.7}
        >
          {tufts.map(([x, y], i) => (
            <path
              key={i}
              d={`M ${x - 5} ${y - 6} L ${x} ${y} L ${x + 2} ${y - 8} M ${x} ${y} L ${x + 6} ${y - 5}`}
            />
          ))}
        </g>

        {/* the fence: a rail with posts along it */}
        <rect
          x={0}
          y={fence - 3}
          width={width}
          height={6}
          fill={WOOD}
          stroke={WOOD_DARK}
          strokeWidth={1.5}
        />
        {posts.map((x) => (
          <rect
            key={x}
            x={x - 6}
            y={fence - 6}
            width={12}
            height={12}
            rx={2}
            fill={WOOD_DARK}
          />
        ))}

        {/* the right triangle behind the first slanted path, lightly shaded */}
        <polygon
          points={`${you.join(",")} ${foot.join(",")} ${ends[0]!.join(",")}`}
          fill="#fff"
          fillOpacity={0.25}
        />

        {/* the slanted paths, then the straight one on top */}
        <g
          stroke={ORANGE}
          strokeWidth={3.5}
          strokeDasharray="9 6"
          strokeLinecap="round"
        >
          {ends.map(([x, y]) => (
            <line key={x} x1={you[0]} y1={you[1]} x2={x} y2={y} />
          ))}
        </g>
        <line
          x1={you[0]}
          y1={you[1]}
          x2={foot[0]}
          y2={foot[1]}
          stroke={SHIRT}
          strokeWidth={4.5}
          strokeLinecap="round"
        />
        <Corner at={foot} u={[1, 0]} v={[0, 1]} />

        {/* the walker from above: shoulders and the top of a head */}
        <ellipse
          cx={you[0]}
          cy={you[1] + 2}
          rx={17}
          ry={9}
          fill={SHIRT}
          stroke={PENCIL}
          strokeWidth={1.5}
        />
        <circle
          cx={you[0]}
          cy={you[1]}
          r={8}
          fill={HAIR}
          stroke={PENCIL}
          strokeWidth={1.5}
        />

        <FieldWords x={you[0] + 26} y={you[1] + 24} anchor="start">
          you
        </FieldWords>
        <FieldWords x={foot[0] - 12} y={(foot[1] + you[1]) / 2} anchor="end">
          shortest
        </FieldWords>
        <FieldWords x={ends[0]![0] + 6} y={fence + 32} anchor="start">
          longer
        </FieldWords>
        <FieldWords x={ends[1]![0] + 6} y={fence + 32} anchor="start">
          longer still
        </FieldWords>
        <FieldWords x={width - 16} y={fence - 16} anchor="end">
          fence
        </FieldWords>
      </Svg>
    </Figure>
  );
}

/**
 * A paper triangle with its three corners marked, then the three corners torn off and laid side by
 * side with their points together: they fill a straight line exactly.
 */
export function TornCorners({ caption }: { caption?: string }) {
  const corners: { at: Pt; name: string; color: string }[] = [
    { at: [22, 178], name: "A", color: ORANGE },
    { at: [268, 178], name: "B", color: BLUE },
    { at: [120, 30], name: "C", color: "#22c55e" },
  ];
  const tear = 46;
  const arc = 24;

  const unit = ([x, y]: Pt): Pt => {
    const l = Math.hypot(x, y);
    return [x / l, y / l];
  };
  // each corner: its point, the directions of its two sides in increasing angle, and its size
  const pieces = corners.map((c, i) => {
    const u = corners[(i + 1) % 3]!.at;
    const w = corners[(i + 2) % 3]!.at;
    let a1 = Math.atan2(u[1] - c.at[1], u[0] - c.at[0]);
    let a2 = Math.atan2(w[1] - c.at[1], w[0] - c.at[0]);
    let size = (((a2 - a1) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    if (size > Math.PI) {
      [a1, a2] = [a2, a1];
      size = 2 * Math.PI - size;
    }
    return { ...c, from: a1, size };
  });

  /**
   * a corner as a torn piece of paper, drawn larger than in the first picture: its point at `at`,
   * its first side pointing at angle `from`, and a ragged edge across where it was torn
   */
  const piece = (at: Pt, from: number, size: number, color: string) => {
    const reach = 84;
    const wedge = 40;
    const ray = (angle: number, r: number): Pt => [
      at[0] + Math.cos(angle) * r,
      at[1] + Math.sin(angle) * r,
    ];
    const [tx, ty] = ray(from, reach);
    const [ux, uy] = ray(from + size, reach);
    // the tear: points along the straight cut, pushed in and out a little in turn
    const length = Math.hypot(ux - tx, uy - ty);
    const steps = Math.max(2, Math.round(length / 16));
    const ragged: Pt[] = [];
    for (let k = 0; k <= steps; k++) {
      const t = k / steps;
      const wobble = k === 0 || k === steps ? 0 : k % 2 ? 1.75 : -1.75;
      ragged.push([
        tx + (ux - tx) * t - ((uy - ty) / length) * wobble,
        ty + (uy - ty) * t + ((ux - tx) / length) * wobble,
      ]);
    }
    const shape = [at, ...ragged];
    const points = (dx: number, dy: number) =>
      shape.map(([x, y]) => `${x + dx},${y + dy}`).join(" ");
    const [sx, sy] = ray(from, wedge);
    const [ex, ey] = ray(from + size, wedge);
    return (
      <g>
        <polygon points={points(2, 3)} fill="#000" fillOpacity={0.14} />
        <polygon
          points={points(0, 0)}
          fill={PAPER}
          stroke={PAPER_EDGE}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <path
          d={`M ${at[0]} ${at[1]} L ${sx} ${sy} A ${wedge} ${wedge} 0 0 1 ${ex} ${ey} Z`}
          fill={color}
          fillOpacity={0.85}
        />
      </g>
    );
  };

  const panel = (label: string, title: string, children: ReactNode) => (
    <div style={{ flex: "1 1 200px", maxWidth: 300 }}>
      <Svg width={290} height={238} label={label}>
        {children}
        <Words x={145} y={228}>
          {title}
        </Words>
      </Svg>
    </div>
  );

  // where the three points meet in the second picture, on a straight edge
  const meet: Pt = [145, 170];
  let start = Math.PI;

  return (
    <Figure caption={caption}>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-6">
        {panel(
          "A paper triangle ABC with its three corners coloured orange, blue and green, and a dashed line across each corner where it will be torn off.",
          "1. Mark the corners and tear them off",
          <>
            <polygon
              points={corners.map(({ at }) => at.join(",")).join(" ")}
              transform="translate(2 3)"
              fill="#000"
              fillOpacity={0.14}
            />
            <polygon
              points={corners.map(({ at }) => at.join(",")).join(" ")}
              fill={PAPER}
              stroke={PAPER_EDGE}
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
            {pieces.map((p) => {
              const ray = (angle: number, r: number): Pt => [
                p.at[0] + Math.cos(angle) * r,
                p.at[1] + Math.sin(angle) * r,
              ];
              const [sx, sy] = ray(p.from, arc);
              const [ex, ey] = ray(p.from + p.size, arc);
              const [tx, ty] = ray(p.from, tear);
              const [ux, uy] = ray(p.from + p.size, tear);
              const [nx, ny] = unit([
                p.at[0] -
                  (corners[0]!.at[0] + corners[1]!.at[0] + corners[2]!.at[0]) /
                    3,
                p.at[1] -
                  (corners[0]!.at[1] + corners[1]!.at[1] + corners[2]!.at[1]) /
                    3,
              ]);
              return (
                <g key={p.name}>
                  <path
                    d={`M ${p.at[0]} ${p.at[1]} L ${sx} ${sy} A ${arc} ${arc} 0 0 1 ${ex} ${ey} Z`}
                    fill={p.color}
                    fillOpacity={0.85}
                  />
                  <line
                    x1={tx}
                    y1={ty}
                    x2={ux}
                    y2={uy}
                    stroke={PENCIL}
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                  />
                  <Words x={p.at[0] + nx * 16} y={p.at[1] + ny * 16 + 5}>
                    <tspan fontStyle="italic">{p.name}</tspan>
                  </Words>
                </g>
              );
            })}
          </>,
        )}
        {panel(
          "The three torn corners laid side by side with their points together on a straight edge. The orange, blue and green angles fill the straight line exactly.",
          "2. Lay them side by side",
          <>
            <line
              x1={20}
              y1={meet[1]}
              x2={270}
              y2={meet[1]}
              stroke="currentColor"
              strokeWidth={2}
            />
            {pieces.map((p) => {
              const placed = piece(meet, start, p.size, p.color);
              start += p.size;
              return <g key={p.name}>{placed}</g>;
            })}
            <Words x={meet[0]} y={meet[1] + 24}>
              a straight line
            </Words>
          </>,
        )}
      </div>
    </Figure>
  );
}
