import type { ReactNode } from "react";
import { Figure } from "../figure";
import {
  GRASS,
  GRASS_DARK,
  PENCIL,
  Svg,
  WOOD,
  WOOD_DARK,
  Words,
} from "../illustrations";

/**
 * Pictures for The area of a disc guide: a goat tied to a stake, first on a 5 metre rope and then
 * on a 10 metre one. The goat can reach a disc of grass, and doubling the rope gives it four times
 * as much.
 */

const WOOL = "#f8fafc";
const WOOL_EDGE = "#64748b";
const ROPE = "#a16207";

/** a goat seen from above, standing at (x, y) and facing right */
function Goat({ x, y }: { x: number; y: number }) {
  return (
    <g strokeLinejoin="round">
      {/* legs */}
      <g stroke={PENCIL} strokeWidth={2.5} strokeLinecap="round">
        <line x1={x - 9} y1={y + 6} x2={x - 11} y2={y + 15} />
        <line x1={x + 7} y1={y + 6} x2={x + 9} y2={y + 15} />
      </g>
      <ellipse
        cx={x}
        cy={y}
        rx={15}
        ry={9}
        fill={WOOL}
        stroke={WOOL_EDGE}
        strokeWidth={1.5}
      />
      {/* head and horns */}
      <ellipse
        cx={x + 17}
        cy={y - 7}
        rx={6}
        ry={5}
        fill={WOOL}
        stroke={WOOL_EDGE}
        strokeWidth={1.5}
      />
      <path
        d={`M ${x + 15} ${y - 11} q -3 -7 -8 -6 M ${x + 19} ${y - 11} q 0 -8 -4 -9`}
        fill="none"
        stroke={WOOL_EDGE}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </g>
  );
}

function Panel({
  rope,
  title,
  label,
}: {
  rope: number;
  title: ReactNode;
  label: string;
}) {
  // 10 pixels to the metre
  const reach = rope * 10;
  const stake = { x: 130, y: 118 };
  // the goat stands at the end of the rope, up and to the right of the stake
  const end = {
    x: stake.x + reach * Math.cos(-0.6),
    y: stake.y + reach * Math.sin(-0.6),
  };
  return (
    <div style={{ flex: "1 1 220px", maxWidth: 270 }}>
      <Svg width={260} height={262} label={label}>
        <circle
          cx={stake.x}
          cy={stake.y}
          r={reach}
          fill={GRASS}
          fillOpacity={0.55}
          stroke={GRASS_DARK}
          strokeWidth={2}
          strokeDasharray="6 4"
        />
        <line
          x1={stake.x}
          y1={stake.y}
          x2={end.x - 8}
          y2={end.y + 4}
          stroke={ROPE}
          strokeWidth={2.5}
        />
        <circle
          cx={stake.x}
          cy={stake.y}
          r={5}
          fill={WOOD}
          stroke={WOOD_DARK}
          strokeWidth={2}
        />
        <Goat x={end.x} y={end.y} />
        <Words x={130} y={240}>
          {title}
        </Words>
      </Svg>
    </div>
  );
}

export function GoatTether({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-6">
        <Panel
          rope={5}
          title="5 metre rope"
          label="A goat tied to a stake with a 5 metre rope. It can graze a disc of radius 5 metres."
        />
        <Panel
          rope={10}
          title="10 metre rope: 4 times the grass"
          label="The same goat on a 10 metre rope. The disc it can graze has twice the radius and four times the area."
        />
      </div>
    </Figure>
  );
}
