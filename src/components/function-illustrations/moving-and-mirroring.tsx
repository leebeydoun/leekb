import { Figure } from "../figure";
import { BLUE, ORANGE, PURPLE, Svg, Words } from "../illustrations";
import { Arrow, GREEN, MUTED, Plot, Spot, graph, type Pt } from "./plot";

/**
 * Pictures for the guides Moving graphs and Symmetric graphs and inverses: a mountain reflected in
 * a lake, the V of y = |x| slid by (2, 1), the graph of √x stretched two ways, an even and an odd
 * graph side by side, and two functions mirrored onto their inverses in the line y = x. Every grid
 * is square.
 */

const SKY = "#bae6fd";
const WATER = "#38bdf8";
const ROCK = "#64748b";
const SNOW = "#f8fafc";
const PINE = "#15803d";

/**
 * The opening scene: a mountain with a snowy top and two pine trees on the far shore of a lake,
 * and its upside-down reflection in the water below the shoreline. A dashed line joins one rock to
 * its partner in the reflection, cut in half by the waterline.
 */
export function LakeReflection({ caption }: { caption?: string }) {
  const shore = 150;
  // the mountain as points above the shoreline, in pixels; its reflection mirrors each height
  const peak: Pt[] = [
    [60, 0],
    [150, 70],
    [200, 50],
    [280, 118],
    [350, 64],
    [420, 92],
    [460, 0],
  ];
  const snow: Pt[] = [
    [252, 94],
    [280, 118],
    [306, 98],
    [292, 102],
    [280, 96],
    [266, 104],
  ];
  const up = (pts: Pt[]) => pts.map(([x, h]) => `${x},${shore - h}`).join(" ");
  const down = (pts: Pt[]) =>
    pts.map(([x, h]) => `${x},${shore + h}`).join(" ");
  const tree = (x: number, h: number, sign: 1 | -1, key: string) => (
    <polygon
      key={key}
      points={`${x - 9},${shore - sign * 2} ${x + 9},${shore - sign * 2} ${x},${shore - sign * h}`}
      fill={PINE}
      fillOpacity={sign === 1 ? 1 : 0.45}
    />
  );
  const rock: Pt = [350, 64];

  return (
    <Figure caption={caption}>
      <Svg
        width={560}
        height={300}
        label="A mountain with a snowy top rises behind a lake, with two pine trees on the shore. In the still water below the waterline is its reflection, upside down and paler: every point of the mountain has a partner in the water the same distance below the waterline as the point is above it. A dashed line joins one rock to its reflection and is cut in half by the waterline."
      >
        <rect
          x={20}
          y={20}
          width={520}
          height={shore - 20}
          rx={8}
          fill={SKY}
          fillOpacity={0.35}
        />
        <rect
          x={20}
          y={shore}
          width={520}
          height={130}
          rx={8}
          fill={WATER}
          fillOpacity={0.25}
        />
        {/* the mountain and its reflection */}
        <polygon points={up(peak)} fill={ROCK} />
        <polygon points={up(snow)} fill={SNOW} />
        <polygon points={down(peak)} fill={ROCK} fillOpacity={0.45} />
        <polygon points={down(snow)} fill={SNOW} fillOpacity={0.6} />
        {tree(110, 34, 1, "t1")}
        {tree(128, 26, 1, "t2")}
        {tree(110, 34, -1, "r1")}
        {tree(128, 26, -1, "r2")}
        {/* the shoreline */}
        <line
          x1={20}
          x2={540}
          y1={shore}
          y2={shore}
          stroke="currentColor"
          strokeWidth={2}
        />
        {/* a rock and its partner */}
        <line
          x1={rock[0]}
          x2={rock[0]}
          y1={shore - rock[1]}
          y2={shore + rock[1]}
          stroke={ORANGE}
          strokeWidth={2}
          strokeDasharray="5 4"
        />
        <circle
          cx={rock[0]}
          cy={shore - rock[1]}
          r={5}
          fill={ORANGE}
          stroke="var(--color-fd-card)"
          strokeWidth={2}
        />
        <circle
          cx={rock[0]}
          cy={shore + rock[1]}
          r={5}
          fill={ORANGE}
          stroke="var(--color-fd-card)"
          strokeWidth={2}
        />
        <Words x={rock[0] + 12} y={shore - rock[1] / 2 + 5} anchor="start">
          same distance
        </Words>
        <Words x={rock[0] + 12} y={shore + rock[1] / 2 + 5} anchor="start">
          same distance
        </Words>
        <Words x={530} y={shore - 8} anchor="end">
          waterline
        </Words>
      </Svg>
    </Figure>
  );
}

/**
 * The V of y = |x| (faint) and its slide by (2, 1), the V of y = |x − 2| + 1. Arrows take the corner
 * O to (2, 1) and the point (3, 3) to (5, 4).
 */
export function SlidV({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <Plot
        id="slid-v"
        x={[-3, 6]}
        y={[-1, 6]}
        unit={40}
        curves={[
          { points: graph(Math.abs, -3, 6), color: MUTED, faint: true },
          { points: graph((x) => Math.abs(x - 2) + 1, -3, 6), color: BLUE },
        ]}
        label="On a grid, the dashed V-shaped graph of y = |x| with its corner at the origin, and the bold graph of y = |x − 2| + 1, the same V slid 2 to the right and 1 up, with its corner at (2, 1). An arrow goes from the origin to (2, 1), and a second arrow from the point (3, 3) to the point (5, 4)."
      >
        {({ px, py }) => (
          <>
            <Arrow x1={px(0)} y1={py(0)} x2={px(2)} y2={py(1)} color={PURPLE} />
            <Arrow
              x1={px(3)}
              y1={py(3)}
              x2={px(5)}
              y2={py(4)}
              color={PURPLE}
              dashed
            />
            <Spot x={px(0)} y={py(0)} color={MUTED} />
            <Spot x={px(3)} y={py(3)} color={MUTED} />
            <Spot x={px(2)} y={py(1)} color={BLUE} />
            <Spot x={px(5)} y={py(4)} color={BLUE} />
            <Words x={px(3) - 8} y={py(3) - 10} anchor="end" size={14}>
              (3, 3)
            </Words>
            <Words x={px(5) + 10} y={py(4) + 20} anchor="start" size={14}>
              (5, 4)
            </Words>
            <Words
              x={px(2) + 10}
              y={py(1) + 20}
              anchor="start"
              color={BLUE}
              size={14}
            >
              (2, 1)
            </Words>
            <Words
              x={px(-2.8)}
              y={py(3.6)}
              anchor="start"
              color={MUTED}
              size={14}
            >
              y = |x|
            </Words>
            <Words x={px(5.9)} y={py(5.5)} anchor="end" color={BLUE} size={14}>
              y = |x − 2| + 1
            </Words>
          </>
        )}
      </Plot>
    </Figure>
  );
}

/**
 * The graph of y = √x (faint) with the point (4, 2), the graph of y = 2√x through (4, 4), and the
 * graph of y = √(x/2) through (8, 2).
 */
export function StretchedRoot({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <Plot
        id="stretched-root"
        x={[0, 9]}
        y={[0, 6]}
        unit={46}
        curves={[
          { points: graph(Math.sqrt, 0, 9, 400), color: MUTED, faint: true },
          { points: graph((x) => 2 * Math.sqrt(x), 0, 9, 400), color: BLUE },
          {
            points: graph((x) => Math.sqrt(x / 2), 0, 9, 400),
            color: ORANGE,
          },
        ]}
        label="On a grid, the dashed graph of y = √x, starting at the origin and passing through (4, 2). The bold graph of y = 2√x is twice as tall at every point and passes through (4, 4). The bold graph of y = √(x/2) is twice as wide and passes through (8, 2). Arrows go from (4, 2) up to (4, 4) and across to (8, 2)."
      >
        {({ px, py }) => (
          <>
            <Arrow
              x1={px(4)}
              y1={py(2)}
              x2={px(4)}
              y2={py(4)}
              color={BLUE}
              dashed
            />
            <Arrow
              x1={px(4)}
              y1={py(2)}
              x2={px(8)}
              y2={py(2)}
              color={ORANGE}
              dashed
            />
            <Spot x={px(4)} y={py(2)} color={MUTED} />
            <Spot x={px(4)} y={py(4)} color={BLUE} />
            <Spot x={px(8)} y={py(2)} color={ORANGE} />
            <Words x={px(4) - 10} y={py(2) - 8} anchor="end" size={14}>
              (4, 2)
            </Words>
            <Words
              x={px(4) - 10}
              y={py(4) - 8}
              anchor="end"
              color={BLUE}
              size={14}
            >
              (4, 4)
            </Words>
            <Words
              x={px(8)}
              y={py(2) - 12}
              anchor="middle"
              color={ORANGE}
              size={14}
            >
              (8, 2)
            </Words>
            <Words x={px(6.4)} y={py(5.5)} anchor="end" color={BLUE} size={14}>
              y = 2√x
            </Words>
            <Words x={px(8.9)} y={py(3.2)} anchor="end" color={MUTED} size={14}>
              y = √x
            </Words>
            <Words
              x={px(8.9)}
              y={py(1.2)}
              anchor="end"
              color={ORANGE}
              size={14}
            >
              y = √(x/2)
            </Words>
          </>
        )}
      </Plot>
    </Figure>
  );
}

/**
 * Two panels: the even function y = 4 − x² with the mirror pair (1, 3) and (−1, 3), and the odd
 * function y = x³ − 3x with the pair (2, 2) and (−2, −2) on a dashed line through O.
 */
export function EvenOddGraphs({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption} className="flex flex-wrap justify-center gap-6">
      <div className="w-full max-w-[300px]">
        <Plot
          id="even-graph"
          x={[-3, 3]}
          y={[-3, 5]}
          unit={40}
          curves={[{ points: graph((x) => 4 - x * x, -3, 3), color: BLUE }]}
          label="The graph of y = 4 − x², a cap with its top at (0, 4), crossing the x-axis at −2 and 2. The points (1, 3) and (−1, 3) are marked and joined by a dashed horizontal line that the y-axis cuts in half."
        >
          {({ px, py }) => (
            <>
              <line
                x1={px(-1)}
                x2={px(1)}
                y1={py(3)}
                y2={py(3)}
                stroke={ORANGE}
                strokeWidth={2}
                strokeDasharray="5 4"
              />
              <Spot x={px(1)} y={py(3)} color={ORANGE} />
              <Spot x={px(-1)} y={py(3)} color={ORANGE} />
              <Words
                x={px(1) + 10}
                y={py(3) - 10}
                anchor="start"
                color={ORANGE}
                size={14}
              >
                (1, 3)
              </Words>
              <Words
                x={px(-1) - 10}
                y={py(3) - 10}
                anchor="end"
                color={ORANGE}
                size={14}
              >
                (−1, 3)
              </Words>
              <Words
                x={px(1.3)}
                y={py(4.4)}
                anchor="start"
                color={BLUE}
                size={14}
              >
                y = 4 − x²
              </Words>
            </>
          )}
        </Plot>
      </div>
      <div className="w-full max-w-[300px]">
        <Plot
          id="odd-graph"
          x={[-3, 3]}
          y={[-4, 4]}
          unit={40}
          curves={[
            { points: graph((x) => x ** 3 - 3 * x, -3, 3), color: GREEN },
          ]}
          label="The graph of y = x³ − 3x, which rises to (−1, 2), falls through the origin to (1, −2) and rises again. The points (2, 2) and (−2, −2) are marked and joined by a dashed line through the origin, which is halfway between them."
        >
          {({ px, py }) => (
            <>
              <line
                x1={px(-2)}
                x2={px(2)}
                y1={py(-2)}
                y2={py(2)}
                stroke={ORANGE}
                strokeWidth={2}
                strokeDasharray="5 4"
              />
              <Spot x={px(2)} y={py(2)} color={ORANGE} />
              <Spot x={px(-2)} y={py(-2)} color={ORANGE} />
              <Spot x={px(0)} y={py(0)} color={MUTED} />
              <Words
                x={px(2) + 10}
                y={py(2) + 18}
                anchor="start"
                color={ORANGE}
                size={14}
              >
                (2, 2)
              </Words>
              <Words
                x={px(-2) - 10}
                y={py(-2) - 8}
                anchor="end"
                color={ORANGE}
                size={14}
              >
                (−2, −2)
              </Words>
              <Words
                x={px(2.9)}
                y={py(-3.4)}
                anchor="end"
                color={GREEN}
                size={14}
              >
                y = x³ − 3x
              </Words>
            </>
          )}
        </Plot>
      </div>
    </Figure>
  );
}

/**
 * Two panels with the dashed mirror line y = x: y = 2x + 1 and its inverse y = (x − 1)/2, with
 * (1, 3) and (3, 1); and y = x² for x ≥ 0 and its inverse y = √x, with (2, 4) and (4, 2).
 */
export function InverseMirror({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption} className="flex flex-wrap justify-center gap-6">
      <div className="w-full max-w-[300px]">
        <Plot
          id="inverse-line"
          x={[-3, 4]}
          y={[-3, 4]}
          unit={36}
          curves={[
            { points: graph((x) => 2 * x + 1, -3, 4), color: BLUE },
            { points: graph((x) => (x - 1) / 2, -3, 4), color: ORANGE },
          ]}
          label="On a square grid, the line y = 2x + 1 and the line y = (x − 1)/2, mirror images of each other in the dashed line y = x. The point (1, 3) on the first and the point (3, 1) on the second are marked, joined by a dotted segment that the line y = x cuts in half at a right angle."
        >
          {({ px, py }) => (
            <>
              <line
                x1={px(-3)}
                y1={py(-3)}
                x2={px(4)}
                y2={py(4)}
                stroke={PURPLE}
                strokeWidth={2}
                strokeDasharray="5 4"
              />
              <line
                x1={px(1)}
                y1={py(3)}
                x2={px(3)}
                y2={py(1)}
                stroke={MUTED}
                strokeWidth={1.5}
                strokeDasharray="2 4"
              />
              <Spot x={px(1)} y={py(3)} color={BLUE} />
              <Spot x={px(3)} y={py(1)} color={ORANGE} />
              <Words
                x={px(1) - 10}
                y={py(3) - 6}
                anchor="end"
                color={BLUE}
                size={14}
              >
                (1, 3)
              </Words>
              <Words
                x={px(3) + 6}
                y={py(1) + 22}
                anchor="middle"
                color={ORANGE}
                size={14}
              >
                (3, 1)
              </Words>
              <Words
                x={px(2)}
                y={py(3.6)}
                anchor="start"
                color={PURPLE}
                size={14}
              >
                y = x
              </Words>
            </>
          )}
        </Plot>
      </div>
      <div className="w-full max-w-[300px]">
        <Plot
          id="inverse-square"
          x={[0, 5]}
          y={[0, 5]}
          unit={50}
          curves={[
            { points: graph((x) => x * x, 0, 2.3), color: BLUE },
            { points: graph(Math.sqrt, 0, 5, 400), color: ORANGE },
          ]}
          label="On a square grid, the graph of y = x² for x from 0 upwards and the graph of y = √x, mirror images of each other in the dashed line y = x. The point (2, 4) on the first and the point (4, 2) on the second are marked, joined by a dotted segment that the line y = x cuts in half."
        >
          {({ px, py }) => (
            <>
              <line
                x1={px(0)}
                y1={py(0)}
                x2={px(5)}
                y2={py(5)}
                stroke={PURPLE}
                strokeWidth={2}
                strokeDasharray="5 4"
              />
              <line
                x1={px(2)}
                y1={py(4)}
                x2={px(4)}
                y2={py(2)}
                stroke={MUTED}
                strokeWidth={1.5}
                strokeDasharray="2 4"
              />
              <Spot x={px(2)} y={py(4)} color={BLUE} />
              <Spot x={px(4)} y={py(2)} color={ORANGE} />
              <Words
                x={px(2) - 10}
                y={py(4) + 4}
                anchor="end"
                color={BLUE}
                size={14}
              >
                (2, 4)
              </Words>
              <Words
                x={px(4)}
                y={py(2) + 22}
                anchor="middle"
                color={ORANGE}
                size={14}
              >
                (4, 2)
              </Words>
              <Words
                x={px(2.3)}
                y={py(4.6)}
                anchor="start"
                color={BLUE}
                size={14}
              >
                y = x²
              </Words>
              <Words
                x={px(2.6)}
                y={py(1.2)}
                anchor="start"
                color={ORANGE}
                size={14}
              >
                y = √x
              </Words>
              <Words
                x={px(4.6)}
                y={py(4.9)}
                anchor="end"
                color={PURPLE}
                size={14}
              >
                y = x
              </Words>
            </>
          )}
        </Plot>
      </div>
    </Figure>
  );
}
