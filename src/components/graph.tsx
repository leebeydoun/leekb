import { Figure } from "./figure";

/** the line ax + by = c, with the equation as written for the key */
type Line = { a: number; b: number; c: number; label: string };

type Point = { x: number; y: number; label: string };

type GraphProps = {
  lines: Line[];
  /** points to mark with a dot and their coordinates, e.g. where two lines cross */
  points?: Point[];
  /** smallest and largest x shown, -5 to 5 unless given */
  x?: [number, number];
  y?: [number, number];
  caption?: string;
};

const SIZE = 400;
const PAD = 24;
// a different colour for each line, in order; mid-tones that read on light and dark backgrounds
const COLORS = ["#3b82f6", "#f97316", "#22c55e", "#a855f7"];

// proper minus sign instead of a hyphen
function format(n: number) {
  return n < 0 ? `−${Math.abs(n)}` : String(n);
}

// the two points where a line leaves the box, or nothing if it misses the box entirely
function clip({ a, b, c }: Line, [x0, x1]: number[], [y0, y1]: number[]) {
  const hits: [number, number][] = [];
  const near = (v: number, lo: number, hi: number) =>
    v >= lo - 1e-9 && v <= hi + 1e-9;
  if (b !== 0)
    for (const x of [x0!, x1!]) {
      const y = (c - a * x) / b;
      if (near(y, y0!, y1!)) hits.push([x, y]);
    }
  if (a !== 0)
    for (const y of [y0!, y1!]) {
      const x = (c - b * y) / a;
      if (near(x, x0!, x1!)) hits.push([x, y]);
    }
  if (hits.length < 2) return undefined;
  // a line through a corner hits two edges at the same point, so take the two furthest apart
  hits.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  return [hits[0]!, hits[hits.length - 1]!] as const;
}

// two equations draw the same line when one is a multiple of the other
function sameLine(p: Line, q: Line) {
  const close = (u: number, v: number) => Math.abs(u - v) < 1e-9;
  return (
    close(p.a * q.b, p.b * q.a) &&
    close(p.a * q.c, p.c * q.a) &&
    close(p.b * q.c, p.c * q.b)
  );
}

/** Straight lines drawn on a grid, for picturing equations in x and y. */
export function Graph({
  lines,
  points = [],
  x: xRange = [-5, 5],
  y: yRange = [-5, 5],
  caption,
}: GraphProps) {
  const [x0, x1] = xRange;
  const [y0, y1] = yRange;
  // one scale for both axes, so slopes look right
  const unit = SIZE / Math.max(x1 - x0, y1 - y0);
  const width = (x1 - x0) * unit + PAD * 2;
  const height = (y1 - y0) * unit + PAD * 2;
  const px = (x: number) => PAD + (x - x0) * unit;
  const py = (y: number) => PAD + (y1 - y) * unit;
  const range = (lo: number, hi: number) =>
    Array.from(
      { length: Math.floor(hi) - Math.ceil(lo) + 1 },
      (_, i) => Math.ceil(lo) + i,
    );
  const xs = range(x0, x1);
  const ys = range(y0, y1);
  // an axis sits at 0 if 0 is in view, otherwise along the edge
  const axisX = x0 <= 0 && 0 <= x1 ? 0 : x0;
  const axisY = y0 <= 0 && 0 <= y1 ? 0 : y0;
  // a line repeating an earlier one is dashed, so both colours show
  const dashed = lines.map((line, i) =>
    lines.slice(0, i).some((earlier) => sameLine(earlier, line)),
  );

  return (
    <Figure caption={caption}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto block h-auto w-full max-w-md text-fd-foreground"
        role="img"
        aria-label={`Graph of ${lines.map((line) => line.label).join(" and ")}`}
      >
        {/* light grid, one square per unit */}
        <g className="text-fd-border" stroke="currentColor" strokeWidth={1}>
          {xs.map((x) => (
            <line
              key={`gx${x}`}
              x1={px(x)}
              x2={px(x)}
              y1={py(y0)}
              y2={py(y1)}
            />
          ))}
          {ys.map((y) => (
            <line
              key={`gy${y}`}
              x1={px(x0)}
              x2={px(x1)}
              y1={py(y)}
              y2={py(y)}
            />
          ))}
        </g>

        {/* axes, with arrowheads at the positive ends */}
        <g stroke="currentColor" strokeWidth={1.5}>
          <line x1={px(x0)} x2={px(x1) + 10} y1={py(axisY)} y2={py(axisY)} />
          <line x1={px(axisX)} x2={px(axisX)} y1={py(y0)} y2={py(y1) - 10} />
        </g>
        <polygon
          fill="currentColor"
          points={`${px(x1) + 14},${py(axisY)} ${px(x1) + 6},${py(axisY) - 4} ${px(x1) + 6},${py(axisY) + 4}`}
        />
        <polygon
          fill="currentColor"
          points={`${px(axisX)},${py(y1) - 14} ${px(axisX) - 4},${py(y1) - 6} ${px(axisX) + 4},${py(y1) - 6}`}
        />
        <text
          x={px(x1) + 4}
          y={py(axisY) - 10}
          fontSize={14}
          fontStyle="italic"
          fill="currentColor"
        >
          x
        </text>
        <text
          x={px(axisX) + 10}
          y={py(y1) - 4}
          fontSize={14}
          fontStyle="italic"
          fill="currentColor"
        >
          y
        </text>

        {/* numbers along the axes, skipping 0 where the axes cross */}
        <g fontSize={11} className="fill-fd-muted-foreground">
          {xs
            .filter((x) => x !== axisX)
            .map((x) => (
              <text
                key={`tx${x}`}
                x={px(x)}
                y={py(axisY) + 15}
                textAnchor="middle"
              >
                {format(x)}
              </text>
            ))}
          {ys
            .filter((y) => y !== axisY)
            .map((y) => (
              <text
                key={`ty${y}`}
                x={px(axisX) - 6}
                y={py(y) + 4}
                textAnchor="end"
              >
                {format(y)}
              </text>
            ))}
        </g>

        {lines.map((line, i) => {
          const ends = clip(line, xRange, yRange);
          if (!ends) return null;
          const [[ax, ay], [bx, by]] = ends;
          return (
            <line
              key={line.label}
              x1={px(ax)}
              y1={py(ay)}
              x2={px(bx)}
              y2={py(by)}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2.5}
              strokeLinecap={dashed[i] ? "butt" : "round"}
              strokeDasharray={dashed[i] ? "10 8" : undefined}
            />
          );
        })}

        {points.map((point) => (
          <g key={point.label}>
            <circle
              cx={px(point.x)}
              cy={py(point.y)}
              r={4.5}
              fill="currentColor"
            />
            {/* a halo in the card colour keeps the label readable over grid and lines */}
            <text
              x={px(point.x) + 9}
              y={py(point.y) - 9}
              fontSize={13}
              fill="currentColor"
              stroke="var(--color-fd-card)"
              strokeWidth={4}
              paintOrder="stroke"
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>

      {/* a key matching each colour to its equation */}
      <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm">
        {lines.map((line, i) => (
          <li key={line.label} className="flex items-center gap-2">
            <span
              className="inline-block w-5 border-t-3"
              style={{
                borderColor: COLORS[i % COLORS.length],
                borderStyle: dashed[i] ? "dashed" : "solid",
              }}
            />
            {line.label.replace(/-/g, "−")}
          </li>
        ))}
      </ul>
    </Figure>
  );
}
