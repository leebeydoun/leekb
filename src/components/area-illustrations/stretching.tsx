import type { ReactNode } from "react";
import { Figure } from "../figure";
import { BLUE, ORANGE, Svg, WOOD, WOOD_DARK, Words } from "../illustrations";

/**
 * A picture for the Stretching one way guide: a round plate seen from straight above, and the same
 * plate seen at a slant across the table. The width across is the same in both, but the depth is
 * squashed, so the circle becomes an ellipse.
 */

const PLATE = "#f8fafc";
const PLATE_RIM = "#94a3b8";
const GLAZE = "#bfdbfe";

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
    <div style={{ flex: "1 1 200px", maxWidth: 260 }}>
      <Svg width={240} height={250} label={label}>
        {children}
        <Words x={120} y={240}>
          {title}
        </Words>
      </Svg>
    </div>
  );
}

/** a plate drawn as an ellipse with half-widths rx and ry: a rim, a glazed ring and the well */
function Plate({
  cx,
  cy,
  rx,
  ry,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}) {
  return (
    <g>
      <ellipse
        cx={cx + 3}
        cy={cy + 5}
        rx={rx}
        ry={ry}
        fill="#000"
        fillOpacity={0.15}
      />
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill={PLATE}
        stroke={PLATE_RIM}
        strokeWidth={2}
      />
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx * 0.86}
        ry={ry * 0.86}
        fill="none"
        stroke={GLAZE}
        strokeWidth={5}
      />
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx * 0.6}
        ry={ry * 0.6}
        fill="none"
        stroke={PLATE_RIM}
        strokeOpacity={0.6}
        strokeWidth={1.5}
      />
    </g>
  );
}

/** the double-headed arrow for a width or a depth, from (x1, y1) to (x2, y2) */
function Arrow({
  x1,
  y1,
  x2,
  y2,
  color,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}) {
  const length = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / length;
  const uy = (y2 - y1) / length;
  const head = (x: number, y: number, s: number) =>
    `${x},${y} ${x + s * (10 * ux - 6 * uy)},${y + s * (10 * uy + 6 * ux)} ${x + s * (10 * ux + 6 * uy)},${y + s * (10 * uy - 6 * ux)}`;
  const shape = (
    <>
      <line
        x1={x1 + 9 * ux}
        y1={y1 + 9 * uy}
        x2={x2 - 9 * ux}
        y2={y2 - 9 * uy}
      />
      <polygon points={head(x1, y1, 1)} />
      <polygon points={head(x2, y2, -1)} />
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

export function SlantedPlate({ caption }: { caption?: string }) {
  const cx = 120;
  const cy = 108;
  const r = 78;
  const squash = 0.4;
  const table = (
    <rect
      x={8}
      y={14}
      width={224}
      height={196}
      rx={8}
      fill={WOOD}
      stroke={WOOD_DARK}
      strokeWidth={2}
    />
  );
  return (
    <Figure caption={caption}>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-6">
        <Panel
          label="A round plate on a table seen from straight above. Its width and its depth are equal."
          title="From straight above"
        >
          {table}
          <Plate cx={cx} cy={cy} rx={r} ry={r} />
          <Arrow x1={cx - r} y1={cy} x2={cx + r} y2={cy} color={BLUE} />
          <Arrow x1={cx} y1={cy - r} x2={cx} y2={cy + r} color={ORANGE} />
        </Panel>
        <Panel
          label="The same plate seen at a slant across the table. Its width is unchanged, but its depth is squashed, so it looks like an ellipse."
          title="At a slant"
        >
          {table}
          <Plate cx={cx} cy={cy} rx={r} ry={r * squash} />
          <Arrow x1={cx - r} y1={cy} x2={cx + r} y2={cy} color={BLUE} />
          <Arrow
            x1={cx}
            y1={cy - r * squash}
            x2={cx}
            y2={cy + r * squash}
            color={ORANGE}
          />
          <Words x={cx} y={cy + r * squash + 34} color={BLUE}>
            same width
          </Words>
          <Words x={cx} y={cy - r * squash - 18} color={ORANGE}>
            depth squashed
          </Words>
        </Panel>
      </div>
    </Figure>
  );
}
