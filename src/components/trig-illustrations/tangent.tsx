import { Figure } from "../figure";
import { Svg, Words } from "../illustrations";

/**
 * The graph of y = tan x for x from −3π/2 to 3π/2, cut off at heights ±4. Each piece climbs from far
 * below to far above between two dashed vertical lines x = π/2 + nπ, where the tangent is not
 * defined. The three points at height 1, a distance π apart, show the graph repeating every half
 * turn.
 */

const GREEN = "#22c55e";
const PURPLE = "#a855f7";

const WIDTH = 560;
const HEIGHT = 380;
const PAD = 34;
const X0 = -1.5 * Math.PI;
const X1 = 1.5 * Math.PI;
const YMAX = 4;

const px = (x: number) => PAD + ((x - X0) / (X1 - X0)) * (WIDTH - 2 * PAD);
const py = (y: number) => PAD + ((YMAX - y) / (2 * YMAX)) * (HEIGHT - 2 * PAD);

/** one piece of the graph, between the dashed lines at centre − π/2 and centre + π/2 */
function branch(centre: number) {
  // stop where the curve leaves the picture: tan x = ±YMAX at x = centre ± atan(YMAX)
  const reach = Math.atan(YMAX);
  const steps = 80;
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = centre - reach + (2 * reach * i) / steps;
    points.push(`${px(x).toFixed(1)},${py(Math.tan(x)).toFixed(1)}`);
  }
  return points.join(" ");
}

// each number sits below the x-axis, to the side of its mark where the curve is far away
const HALF_PI_LABELS: [number, string, number][] = [
  [-3, "−3π/2", 22],
  [-2, "−π", 16],
  [-1, "−π/2", 20],
  [1, "π/2", 20],
  [2, "π", 14],
  [3, "3π/2", -22],
];

export function TangentGraph({ caption }: { caption?: string }) {
  const centres = [-Math.PI, 0, Math.PI];
  const asymptotes = [-1.5, -0.5, 0.5, 1.5].map((k) => k * Math.PI);
  const ones = [-0.75, 0.25, 1.25].map((k) => k * Math.PI);

  return (
    <Figure caption={caption}>
      <Svg
        width={WIDTH}
        height={HEIGHT}
        label="The graph of y = tan x from −3π/2 to 3π/2. Between each pair of dashed vertical lines at odd multiples of π/2 the curve climbs from far below to far above, crossing the x-axis at a multiple of π. The same piece repeats every π."
      >
        {/* light lines at each whole height */}
        <g className="text-fd-border" stroke="currentColor" strokeWidth={1}>
          {[-3, -2, -1, 1, 2, 3].map((y) => (
            <line key={y} x1={px(X0)} x2={px(X1)} y1={py(y)} y2={py(y)} />
          ))}
        </g>

        {/* the axes */}
        <g stroke="currentColor" strokeWidth={1.5}>
          <line x1={px(X0) - 10} x2={px(X1) + 10} y1={py(0)} y2={py(0)} />
          <line x1={px(0)} x2={px(0)} y1={py(-YMAX) + 6} y2={py(YMAX) - 10} />
        </g>
        <polygon
          fill="currentColor"
          points={`${px(X1) + 16},${py(0)} ${px(X1) + 8},${py(0) - 4} ${px(X1) + 8},${py(0) + 4}`}
        />
        <polygon
          fill="currentColor"
          points={`${px(0)},${py(YMAX) - 16} ${px(0) - 4},${py(YMAX) - 8} ${px(0) + 4},${py(YMAX) - 8}`}
        />
        <Words x={px(0) + 12} y={py(YMAX) - 6} anchor="start" size={14}>
          y
        </Words>

        {/* the lines where the tangent is not defined */}
        <g
          className="text-fd-muted-foreground"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeDasharray="6 5"
        >
          {asymptotes.map((x) => (
            <line key={x} x1={px(x)} x2={px(x)} y1={py(YMAX)} y2={py(-YMAX)} />
          ))}
        </g>

        {/* the three pieces of the graph */}
        {centres.map((centre) => (
          <polyline
            key={centre}
            points={branch(centre)}
            fill="none"
            stroke={GREEN}
            strokeWidth={3}
            strokeLinejoin="round"
          />
        ))}

        {/* the points at height 1, a half turn apart */}
        {ones.map((x) => (
          <circle
            key={x}
            cx={px(x)}
            cy={py(1)}
            r={5}
            fill={PURPLE}
            stroke="var(--color-fd-card)"
            strokeWidth={2}
          />
        ))}

        {/* numbers along the axes */}
        <g className="text-fd-muted-foreground">
          {HALF_PI_LABELS.map(([k, text, shift]) => (
            <Words
              key={k}
              x={px((k * Math.PI) / 2) + shift}
              y={py(0) + 18}
              size={12}
              color="currentColor"
            >
              {text}
            </Words>
          ))}
          {[-3, -2, -1, 1, 2, 3].map((y) => (
            <Words
              key={y}
              x={px(0) - 8}
              y={py(y) + 4}
              anchor="end"
              size={12}
              color="currentColor"
            >
              {y < 0 ? `−${-y}` : String(y)}
            </Words>
          ))}
        </g>
        <Words x={px(X1) + 4} y={py(0) - 10} anchor="end" size={14}>
          x
        </Words>
      </Svg>
    </Figure>
  );
}
