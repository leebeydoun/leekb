/**
 * Shared pieces for the diagrams that move a shape around the plane: an "F"-shaped flag that looks
 * different after a slide, a turn or a flip, a scale from units to pixels with y pointing up, and a
 * labelled dot.
 */

export type Vec = { x: number; y: number };

/**
 * The corners of an "F", with its bottom-left corner at (0, 0), 0.9 wide and 1.2 tall. It has no
 * symmetry, so every move of it can be told apart from every other.
 */
export const FLAG: Vec[] = [
  { x: 0, y: 0 },
  { x: 0.3, y: 0 },
  { x: 0.3, y: 0.45 },
  { x: 0.7, y: 0.45 },
  { x: 0.7, y: 0.7 },
  { x: 0.3, y: 0.7 },
  { x: 0.3, y: 0.9 },
  { x: 0.9, y: 0.9 },
  { x: 0.9, y: 1.2 },
  { x: 0, y: 1.2 },
];

/** from units to pixels for the box from (x0, y0) to (x1, y1), with y pointing up */
export function planeScale(
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  unit = 56,
  pad = 24,
) {
  return {
    width: (x1 - x0) * unit + pad * 2,
    height: (y1 - y0) * unit + pad * 2,
    unit,
    px: (p: Vec): Vec => ({
      x: pad + (p.x - x0) * unit,
      y: pad + (y1 - p.y) * unit,
    }),
  };
}

export const shift = (p: Vec, by: Vec): Vec => ({
  x: p.x + by.x,
  y: p.y + by.y,
});

/** p turned anticlockwise by `degrees` about `centre` */
export function turn(p: Vec, centre: Vec, degrees: number): Vec {
  const a = (degrees * Math.PI) / 180;
  const dx = p.x - centre.x;
  const dy = p.y - centre.y;
  return {
    x: centre.x + dx * Math.cos(a) - dy * Math.sin(a),
    y: centre.y + dx * Math.sin(a) + dy * Math.cos(a),
  };
}

export const distance = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);

/** the points of a polygon in the form an svg `points` attribute takes */
export const polygonPoints = (corners: Vec[], px: (p: Vec) => Vec) =>
  corners
    .map(px)
    .map(({ x, y }) => `${x},${y}`)
    .join(" ");

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

/** a dot with an italic name beside it, offset by (dx, dy) pixels */
export function Dot({
  at,
  name,
  color = "currentColor",
  dx = 0,
  dy = -14,
  r = 4.5,
}: {
  at: Vec;
  name?: string;
  color?: string;
  dx?: number;
  dy?: number;
  r?: number;
}) {
  return (
    <g>
      <circle cx={at.x} cy={at.y} r={r} fill={color} />
      {name && (
        <text
          x={at.x + dx}
          y={at.y + dy + 5}
          textAnchor="middle"
          fontSize={16}
          fontStyle="italic"
          fill={color}
          {...halo}
        >
          {name}
        </text>
      )}
    </g>
  );
}

/** the flag drawn as a polygon: faint for where it started, solid for where it is now */
export function Flag({
  corners,
  px,
  color,
  faint = false,
}: {
  corners: Vec[];
  px: (p: Vec) => Vec;
  color: string;
  faint?: boolean;
}) {
  return (
    <polygon
      points={polygonPoints(corners, px)}
      fill={color}
      fillOpacity={faint ? 0.08 : 0.3}
      stroke={color}
      strokeOpacity={faint ? 0.45 : 1}
      strokeWidth={2}
      strokeDasharray={faint ? "5 4" : undefined}
      strokeLinejoin="round"
    />
  );
}
