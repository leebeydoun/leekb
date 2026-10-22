import type { ReactNode } from "react";
import { Figure } from "../figure";
import {
  BLUE,
  CARDBOARD,
  CARDBOARD_EDGE,
  ORANGE,
  PAPER,
  PAPER_EDGE,
  PENCIL,
  STEEL,
  STEEL_LIGHT,
  Svg,
  Words,
} from "../illustrations";

/**
 * Real things that slide and turn: boxes carried along a conveyor belt, which all move the same
 * distance the same way, and a playing card, which looks the same after a half turn about its
 * middle.
 */

/** an arrow from (x1, y) to (x2, y), with its head at x2 */
function Across({
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
  return (
    <g>
      <line x1={x1} y1={y} x2={x2 - 10} y2={y} stroke={color} strokeWidth={3} />
      <polygon
        points={`${x2},${y} ${x2 - 12},${y - 6} ${x2 - 12},${y + 6}`}
        fill={color}
      />
    </g>
  );
}

/** Three boxes on a conveyor belt, each carried the same distance to the right. */
export function ConveyorBelt({ caption }: { caption?: string }) {
  const belt = { left: 30, right: 530, top: 150, bottom: 172 };
  const step = 90;
  // each box: where it started, its size, and how it sits on the belt
  const boxes = [
    { x: 40, w: 56, h: 44 },
    { x: 196, w: 42, h: 62 },
    { x: 340, w: 64, h: 34 },
  ];
  const rollers = Array.from({ length: 9 }, (_, i) => belt.left + 11 + i * 62);

  return (
    <Figure caption={caption}>
      <Svg
        width={560}
        height={230}
        label="Three boxes of different sizes on a conveyor belt. Each box is drawn faintly where it started and solid where it is now, with an arrow between. All three arrows are the same length and point the same way."
      >
        {/* the belt and its rollers */}
        <rect
          x={belt.left}
          y={belt.top}
          width={belt.right - belt.left}
          height={belt.bottom - belt.top}
          rx={11}
          fill={STEEL}
        />
        {rollers.map((x) => (
          <circle
            key={x}
            cx={x}
            cy={(belt.top + belt.bottom) / 2}
            r={7}
            fill={STEEL_LIGHT}
            stroke={PENCIL}
            strokeWidth={1}
          />
        ))}
        <rect
          x={belt.left + 20}
          y={belt.bottom}
          width={10}
          height={36}
          fill={STEEL}
        />
        <rect
          x={belt.right - 30}
          y={belt.bottom}
          width={10}
          height={36}
          fill={STEEL}
        />

        {boxes.map(({ x, w, h }, i) => (
          <g key={i}>
            {/* where the box started */}
            <rect
              x={x}
              y={belt.top - h}
              width={w}
              height={h}
              fill={CARDBOARD}
              fillOpacity={0.25}
              stroke={CARDBOARD_EDGE}
              strokeOpacity={0.6}
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
            {/* where it is now */}
            <rect
              x={x + step}
              y={belt.top - h}
              width={w}
              height={h}
              fill={CARDBOARD}
              stroke={CARDBOARD_EDGE}
              strokeWidth={2}
            />
            <line
              x1={x + step + 6}
              y1={belt.top - h + 8}
              x2={x + step + w - 6}
              y2={belt.top - h + 8}
              stroke={CARDBOARD_EDGE}
              strokeWidth={1.5}
            />
            <Across
              x1={x + w / 2}
              x2={x + step + w / 2}
              // all at one height, so the three arrows can be compared at a glance
              y={belt.top - 80}
              color={BLUE}
            />
          </g>
        ))}
        <Words x={280} y={216}>
          every box moves the same distance, the same way
        </Words>
      </Svg>
    </Figure>
  );
}

const RED = "#dc2626";

/** a playing card's face: the corner marks and a lopsided design, drawn about (0, 0) */
function CardFace() {
  const corner = (
    <g>
      <text x={-58} y={-68} fontSize={20} fontWeight={700} fill={RED}>
        K
      </text>
      <path
        d="M -50 -52 c -6 -8 -14 -2 -7 6 l 7 7 l 7 -7 c 7 -8 -1 -14 -7 -6 Z"
        fill={RED}
      />
    </g>
  );
  // half of the design: a little crown leaning to one side, and a sash, so it has no mirror line
  const half = (
    <g>
      <path
        d="M -26 -10 L -30 -42 L -16 -28 L -4 -50 L 6 -28 L 22 -40 L 16 -10 Z"
        fill="#fde68a"
        stroke={PENCIL}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        d="M -36 -6 L 30 -6 L 18 4 L -40 4 Z"
        fill={BLUE}
        fillOpacity={0.7}
      />
      {corner}
    </g>
  );
  return (
    <g>
      <rect
        x={-70}
        y={-96}
        width={140}
        height={192}
        rx={12}
        fill={PAPER}
        stroke={PAPER_EDGE}
        strokeWidth={2}
      />
      {half}
      <g transform="rotate(180)">{half}</g>
    </g>
  );
}

function Panel({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div style={{ flex: "1 1 170px", maxWidth: 240 }}>
      <Svg width={220} height={260} label={label}>
        {children}
        <Words x={110} y={250}>
          {title}
        </Words>
      </Svg>
    </div>
  );
}

/**
 * A king from a pack of cards, before and after a half turn about its centre. The card looks the
 * same, but a marked point has gone straight through the centre to the other side.
 */
export function HalfTurnCard({ caption }: { caption?: string }) {
  const centre = { x: 110, y: 118 };
  const mark = { x: 34, y: -60 };
  const dot = (x: number, y: number, name: string, dx: number) => (
    <g>
      <circle
        cx={x}
        cy={y}
        r={5}
        fill={ORANGE}
        stroke={PENCIL}
        strokeWidth={1.5}
      />
      <Words
        x={x + dx}
        y={y + 5}
        anchor={dx < 0 ? "end" : "start"}
        color={ORANGE}
      >
        <tspan fontStyle="italic">{name}</tspan>
      </Words>
    </g>
  );
  return (
    <Figure caption={caption}>
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-6">
        <Panel
          label="A king playing card with a point P marked near its top right, and its centre O."
          title="Before"
        >
          <g transform={`translate(${centre.x} ${centre.y})`}>
            <CardFace />
          </g>
          <circle cx={centre.x} cy={centre.y} r={4} fill={PENCIL} />
          <Words x={centre.x + 10} y={centre.y + 20} anchor="start">
            <tspan fontStyle="italic">O</tspan>
          </Words>
          {dot(centre.x + mark.x, centre.y + mark.y, "P", 10)}
        </Panel>
        <Panel
          label="The same card after a half turn about its centre O. It looks exactly the same, but the marked point P has moved straight through O to the opposite side, as far from O as before."
          title="After a half turn about O"
        >
          <g transform={`translate(${centre.x} ${centre.y}) rotate(180)`}>
            <CardFace />
          </g>
          <line
            x1={centre.x + mark.x}
            y1={centre.y + mark.y}
            x2={centre.x - mark.x}
            y2={centre.y - mark.y}
            stroke={ORANGE}
            strokeWidth={2}
            strokeDasharray="5 4"
          />
          <circle cx={centre.x} cy={centre.y} r={4} fill={PENCIL} />
          <Words x={centre.x + 10} y={centre.y + 20} anchor="start">
            <tspan fontStyle="italic">O</tspan>
          </Words>
          <circle
            cx={centre.x + mark.x}
            cy={centre.y + mark.y}
            r={5}
            fill="none"
            stroke={ORANGE}
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />
          {dot(centre.x - mark.x, centre.y - mark.y, "P′", -10)}
        </Panel>
      </div>
    </Figure>
  );
}
