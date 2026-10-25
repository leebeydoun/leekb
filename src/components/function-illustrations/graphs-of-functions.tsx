import type { ReactNode } from "react";
import { Figure } from "../figure";
import { BLUE, ORANGE, PURPLE, Svg, Words } from "../illustrations";
import { GREEN, MUTED, OpenSpot, Plot, Spot, graph } from "./plot";

/**
 * Pictures for the guide Graphs of functions. A weather app's temperature line read at 3 pm; the
 * graph of x² − 2x on [−1, 3] with its domain and range as shadows on the axes; a circle failing the
 * vertical line test beside its top half passing it; the graph of (x + 2)(x − 3) sketched from its
 * values and signs; then a gallery: |x|, 1/x and 1/x², the floor staircase, and x² and x³ rising and
 * falling.
 */

/** A phone's weather forecast: the temperature through one day, read off at 3 pm. */
export function WeatherForecast({ caption }: { caption?: string }) {
  const x0 = 70;
  const x1 = 520;
  const y0 = 236;
  // degrees from 5 to 20 up the side
  const px = (t: number) => x0 + ((x1 - x0) * t) / 24;
  const py = (d: number) => y0 - ((d - 4) * 170) / 16;
  const temp = (t: number) => 12 + 6 * Math.sin((Math.PI * (t - 9)) / 12);
  const line = graph(temp, 0, 24)
    .map(([t, d]) => `${px(t).toFixed(1)},${py(d).toFixed(1)}`)
    .join(" ");
  const hours: [number, string][] = [
    [0, "midnight"],
    [6, "6 am"],
    [12, "noon"],
    [18, "6 pm"],
    [24, "midnight"],
  ];

  return (
    <Figure caption={caption}>
      <Svg
        width={560}
        height={300}
        label="A weather app's forecast for one day. A temperature line starts at about 8 degrees at midnight, dips to 6 degrees at 3 am, climbs through the morning to a peak of 18 degrees at 3 pm, and falls back to about 8 degrees by the next midnight. A dashed line goes up from 3 pm on the time axis to the temperature line, and a second dashed line goes across from there to 18 degrees on the scale."
      >
        <rect
          x={20}
          y={10}
          width={520}
          height={280}
          rx={18}
          fill={BLUE}
          fillOpacity={0.05}
          stroke="currentColor"
          strokeWidth={2}
        />
        <Words x={44} y={40} anchor="start" size={16}>
          Today
        </Words>
        {/* the scale and its light lines */}
        {[5, 10, 15, 20].map((d) => (
          <g key={d}>
            <line
              x1={x0}
              x2={x1}
              y1={py(d)}
              y2={py(d)}
              stroke={MUTED}
              strokeOpacity={0.35}
            />
            <Words x={x0 - 10} y={py(d) + 5} anchor="end" size={13}>
              {`${d}°`}
            </Words>
          </g>
        ))}
        <line
          x1={x0}
          x2={x1}
          y1={y0}
          y2={y0}
          stroke="currentColor"
          strokeWidth={1.5}
        />
        {hours.map(([t, name], i) => (
          <Words
            key={i}
            x={px(t)}
            y={y0 + 22}
            size={13}
            anchor={i === 0 ? "start" : i === 4 ? "end" : "middle"}
          >
            {name}
          </Words>
        ))}
        <polyline
          points={line}
          fill="none"
          stroke={ORANGE}
          strokeWidth={3.5}
          strokeLinejoin="round"
        />
        {/* reading off 3 pm: up from the time, then across to the scale */}
        <line
          x1={px(15)}
          x2={px(15)}
          y1={y0}
          y2={py(18)}
          stroke={PURPLE}
          strokeWidth={2}
          strokeDasharray="5 4"
        />
        <line
          x1={px(15)}
          x2={x0}
          y1={py(18)}
          y2={py(18)}
          stroke={PURPLE}
          strokeWidth={2}
          strokeDasharray="5 4"
        />
        <Spot x={px(15)} y={py(18)} color={PURPLE} />
        <Words x={px(15)} y={y0 + 40} color={PURPLE} size={14}>
          3 pm
        </Words>
        <Words x={px(15) + 12} y={py(18) - 12} anchor="start" color={PURPLE}>
          18°
        </Words>
      </Svg>
    </Figure>
  );
}

/**
 * The graph of f(x) = x² − 2x on [−1, 3], with its domain as an orange band on the x-axis and its
 * range as a green band on the y-axis, and f(2.5) = 1.25 read off with dashed lines.
 */
export function GraphShadows({ caption }: { caption?: string }) {
  const f = (x: number) => x * x - 2 * x;
  return (
    <Figure caption={caption}>
      <Plot
        id="graph-shadows"
        x={[-2, 4]}
        y={[-2, 4]}
        unit={46}
        curves={[{ points: graph(f, -1, 3), color: BLUE }]}
        label="On a square grid, the graph of f(x) = x² − 2x for x from −1 to 3: a U-shaped curve from (−1, 3) down to its lowest point (1, −1) and up to (3, 3). An orange band on the x-axis from −1 to 3 marks the domain, and a green band on the y-axis from −1 to 3 marks the range. Dashed purple lines go up from 2.5 on the x-axis to the curve and across to 1.25 on the y-axis."
      >
        {({ px, py }) => (
          <>
            <line
              x1={px(-1)}
              x2={px(3)}
              y1={py(0)}
              y2={py(0)}
              stroke={ORANGE}
              strokeWidth={7}
              strokeOpacity={0.55}
              strokeLinecap="round"
            />
            <line
              x1={px(0)}
              x2={px(0)}
              y1={py(-1)}
              y2={py(3)}
              stroke={GREEN}
              strokeWidth={7}
              strokeOpacity={0.55}
              strokeLinecap="round"
            />
            {/* the reading at x = 2.5 */}
            <line
              x1={px(2.5)}
              x2={px(2.5)}
              y1={py(0)}
              y2={py(1.25)}
              stroke={PURPLE}
              strokeWidth={2}
              strokeDasharray="5 4"
            />
            <line
              x1={px(2.5)}
              x2={px(0)}
              y1={py(1.25)}
              y2={py(1.25)}
              stroke={PURPLE}
              strokeWidth={2}
              strokeDasharray="5 4"
            />
            <Spot x={px(2.5)} y={py(1.25)} color={PURPLE} />
            <Words
              x={px(2.5) + 10}
              y={py(1.25) + 18}
              anchor="start"
              color={PURPLE}
              size={14}
            >
              (2.5, 1.25)
            </Words>
            <Spot x={px(-1)} y={py(3)} color={BLUE} />
            <Spot x={px(3)} y={py(3)} color={BLUE} />
            <Spot x={px(1)} y={py(-1)} color={BLUE} />
            <Words x={px(1)} y={py(-1.55)} color={ORANGE} size={14}>
              domain [−1, 3]
            </Words>
            <Words
              x={px(0.2)}
              y={py(3.55)}
              anchor="start"
              color={GREEN}
              size={14}
            >
              range [−1, 3]
            </Words>
          </>
        )}
      </Plot>
    </Figure>
  );
}

/**
 * Left: the circle x² + y² = 9 and the line x = 2 meeting it twice, at (2, ±√5). Right: the top
 * half of the circle, the graph of √(9 − x²), which the same line meets once.
 */
export function CircleHalves({ caption }: { caption?: string }) {
  const r5 = Math.sqrt(5);
  const top = graph((x) => Math.sqrt(Math.max(0, 9 - x * x)), -3, 3, 360);
  const bottom = graph((x) => -Math.sqrt(Math.max(0, 9 - x * x)), -3, 3, 360);
  const panel = (
    id: string,
    whole: boolean,
    label: string,
    children: (s: {
      px: (x: number) => number;
      py: (y: number) => number;
    }) => ReactNode,
  ) => (
    <div className="w-full max-w-[300px]">
      <Plot
        id={id}
        x={[-4, 4]}
        y={[-4, 4]}
        unit={30}
        curves={
          whole
            ? [
                { points: top, color: BLUE },
                { points: bottom, color: BLUE },
              ]
            : [
                { points: bottom, color: MUTED, faint: true },
                { points: top, color: BLUE },
              ]
        }
        label={label}
      >
        {({ px, py }) => (
          <>
            <line
              x1={px(2)}
              x2={px(2)}
              y1={py(-4)}
              y2={py(4)}
              stroke={PURPLE}
              strokeWidth={2}
              strokeDasharray="5 4"
            />
            <Words x={px(2) + 6} y={py(3.6)} anchor="start" color={PURPLE}>
              x = 2
            </Words>
            {children({ px, py })}
          </>
        )}
      </Plot>
    </div>
  );

  return (
    <Figure caption={caption} className="flex flex-wrap justify-center gap-6">
      {panel(
        "circle-whole",
        true,
        "On a square grid, the circle x² + y² = 9 with centre the origin and radius 3, and the dashed vertical line x = 2, which meets the circle at two points, (2, √5) above the axis and (2, −√5) below it.",
        ({ px, py }) => (
          <>
            <Spot x={px(2)} y={py(r5)} color={ORANGE} />
            <Spot x={px(2)} y={py(-r5)} color={ORANGE} />
            <Words
              x={px(2) + 9}
              y={py(r5) - 8}
              anchor="start"
              color={ORANGE}
              size={14}
            >
              (2, √5)
            </Words>
            <Words
              x={px(2) + 9}
              y={py(-r5) + 18}
              anchor="start"
              color={ORANGE}
              size={14}
            >
              (2, −√5)
            </Words>
          </>
        ),
      )}
      {panel(
        "circle-top",
        false,
        "The same grid with only the top half of the circle drawn bold, the graph of y = √(9 − x²); the bottom half is faint and dashed. The line x = 2 meets the top half at the one point (2, √5).",
        ({ px, py }) => (
          <>
            <Spot x={px(2)} y={py(r5)} color={GREEN} />
            <Words
              x={px(2) + 9}
              y={py(r5) - 8}
              anchor="start"
              color={GREEN}
              size={14}
            >
              (2, √5)
            </Words>
            <Words
              x={px(-1.2)}
              y={py(3.45)}
              anchor="end"
              color={BLUE}
              size={14}
            >
              y = √(9 − x²)
            </Words>
          </>
        ),
      )}
    </Figure>
  );
}

/**
 * The graph of f(x) = (x + 2)(x − 3) through its values at −3, −2, …, 4, with the x-axis banded green
 * where f(x) is positive and orange where it is negative. The y-axis is squashed to half the scale.
 */
export function SignSketch({ caption }: { caption?: string }) {
  const f = (x: number) => (x + 2) * (x - 3);
  const dots = [-3, -2, -1, 0, 1, 2, 3, 4];
  return (
    <Figure caption={caption}>
      <Plot
        id="sign-sketch"
        x={[-4, 5]}
        y={[-7, 7]}
        unit={40}
        unitY={20}
        everyY={2}
        stepY={1}
        curves={[{ points: graph(f, -3.6, 4.6), color: BLUE }]}
        label="The graph of f(x) = (x + 2)(x − 3), with each step of 1 up drawn half as long as each step across. Dots mark the values at the whole numbers from −3 to 4: 6, 0, −4, −6, −6, −4, 0 and 6. The curve crosses the x-axis at −2 and 3. The x-axis is banded green to the left of −2 and to the right of 3, where the curve is above the axis and f(x) is positive, and orange between −2 and 3, where the curve is below it and f(x) is negative."
      >
        {({ px, py }) => (
          <>
            {[
              [-4, -2, GREEN],
              [-2, 3, ORANGE],
              [3, 5, GREEN],
            ].map(([a, b, c]) => (
              <line
                key={String(a)}
                x1={px(a as number)}
                x2={px(b as number)}
                y1={py(0)}
                y2={py(0)}
                stroke={c as string}
                strokeWidth={7}
                strokeOpacity={0.55}
              />
            ))}
            {dots.map((x) => (
              <Spot key={x} x={px(x)} y={py(f(x))} color={BLUE} />
            ))}
            <Words x={px(-3.4)} y={py(2)} color={GREEN} size={22}>
              +
            </Words>
            <Words x={px(4.4)} y={py(2)} color={GREEN} size={22}>
              +
            </Words>
            <Words x={px(0.5)} y={py(-2.5)} color={ORANGE} size={22}>
              −
            </Words>
            <Words x={px(0.3)} y={py(5)} anchor="start" color={BLUE} size={14}>
              y = (x + 2)(x − 3)
            </Words>
          </>
        )}
      </Plot>
    </Figure>
  );
}

/** The V-shaped graph of y = |x|, with the points (−3, 3) and (2, 2) marked. */
export function AbsoluteValueGraph({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <Plot
        id="abs-graph"
        x={[-4, 4]}
        y={[-1, 4]}
        unit={40}
        curves={[{ points: graph(Math.abs, -4, 4, 2), color: BLUE }]}
        label="On a square grid, the graph of y = |x|: a V shape with its corner at the origin. To the right it is the line y = x, through (2, 2), and to the left it is the line y = −x, through (−3, 3)."
      >
        {({ px, py }) => (
          <>
            <Spot x={px(-3)} y={py(3)} color={BLUE} />
            <Spot x={px(2)} y={py(2)} color={BLUE} />
            <Spot x={px(0)} y={py(0)} color={BLUE} />
            <Words x={px(-3) - 10} y={py(3) + 18} anchor="end" size={14}>
              (−3, 3)
            </Words>
            <Words x={px(2) + 10} y={py(2) + 18} anchor="start" size={14}>
              (2, 2)
            </Words>
            <Words
              x={px(2.6)}
              y={py(3.55)}
              anchor="middle"
              color={BLUE}
              size={14}
            >
              y = |x|
            </Words>
          </>
        )}
      </Plot>
    </Figure>
  );
}

/**
 * Two panels on the same scale: the two branches of y = 1/x, and the two branches of y = 1/x², each
 * with a few of its points marked. Neither graph meets either axis.
 */
export function ReciprocalGraphs({ caption }: { caption?: string }) {
  const inv = (x: number) => 1 / x;
  const inv2 = (x: number) => 1 / (x * x);
  return (
    <Figure caption={caption} className="flex flex-wrap justify-center gap-6">
      <div className="w-full max-w-[300px]">
        <Plot
          id="reciprocal-1"
          x={[-4, 4]}
          y={[-4, 4]}
          unit={30}
          curves={[
            { points: graph(inv, 0.22, 4), color: BLUE },
            { points: graph(inv, -4, -0.22), color: BLUE },
          ]}
          label="On a square grid, the graph of y = 1/x in two pieces. One piece is in the top right quarter, through (1/2, 2), (1, 1) and (2, 1/2), running up beside the y-axis and out beside the x-axis. The other is its copy in the bottom left quarter, through (−1, −1). Neither piece meets either axis."
        >
          {({ px, py }) => (
            <>
              {[
                [0.5, 2],
                [1, 1],
                [2, 0.5],
                [-1, -1],
              ].map(([x, y]) => (
                <Spot key={x} x={px(x!)} y={py(y!)} color={BLUE} />
              ))}
              <Words
                x={px(1.4)}
                y={py(2.6)}
                anchor="start"
                color={BLUE}
                size={14}
              >
                y = 1/x
              </Words>
            </>
          )}
        </Plot>
      </div>
      <div className="w-full max-w-[300px]">
        <Plot
          id="reciprocal-2"
          x={[-4, 4]}
          y={[-1, 4]}
          unit={30}
          curves={[
            { points: graph(inv2, 0.47, 4), color: PURPLE },
            { points: graph(inv2, -4, -0.47), color: PURPLE },
          ]}
          label="On the same scale, the graph of y = 1/x² in two pieces, one on each side of the y-axis, mirror images of each other. Both lie above the x-axis, through (1, 1), (2, 1/4), (−1, 1) and (−2, 1/4), running up beside the y-axis and out beside the x-axis without meeting either."
        >
          {({ px, py }) => (
            <>
              {[
                [1, 1],
                [2, 0.25],
                [-1, 1],
                [-2, 0.25],
              ].map(([x, y]) => (
                <Spot key={x} x={px(x!)} y={py(y!)} color={PURPLE} />
              ))}
              <Words
                x={px(1.3)}
                y={py(2.6)}
                anchor="start"
                color={PURPLE}
                size={14}
              >
                y = 1/x²
              </Words>
            </>
          )}
        </Plot>
      </div>
    </Figure>
  );
}

/**
 * The graph of the floor function from −3 to 4: a staircase of flat steps, each with a filled dot
 * at its left end (which is on the graph) and a hollow dot at its right end (which is not).
 */
export function FloorStaircase({ caption }: { caption?: string }) {
  const steps = [-3, -2, -1, 0, 1, 2, 3];
  return (
    <Figure caption={caption}>
      <Plot
        id="floor-staircase"
        x={[-3, 4]}
        y={[-3, 3]}
        unit={44}
        curves={steps.map((n) => ({
          points: [
            [n, n],
            [n + 1, n],
          ],
          color: BLUE,
        }))}
        label="On a square grid, the graph of y = ⌊x⌋ for x from −3 to 4: seven flat steps, one at each height from −3 to 3. The step at height n runs from x = n to x = n + 1, with a filled dot at its left end (n, n) and a hollow dot at its right end (n + 1, n). So above x = 1 the graph is at height 1, not 0."
      >
        {({ px, py }) => (
          <>
            {steps.map((n) => (
              <g key={n}>
                <OpenSpot x={px(n + 1)} y={py(n)} color={BLUE} />
                <Spot x={px(n)} y={py(n)} color={BLUE} />
              </g>
            ))}
            <Words
              x={px(-2.2)}
              y={py(2.2)}
              anchor="start"
              color={BLUE}
              size={14}
            >
              y = ⌊x⌋
            </Words>
          </>
        )}
      </Plot>
    </Figure>
  );
}

/**
 * Left: y = x², falling (orange) for x ≤ 0 and rising (blue) for x ≥ 0. Right: y = x³, rising all
 * the way.
 */
export function RisingFalling({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption} className="flex flex-wrap justify-center gap-6">
      <div className="w-full max-w-[280px]">
        <Plot
          id="rising-square"
          x={[-2.5, 2.5]}
          y={[-1, 4]}
          unit={44}
          curves={[
            { points: graph((x) => x * x, -2.1, 0), color: ORANGE },
            { points: graph((x) => x * x, 0, 2.1), color: BLUE },
          ]}
          label="On a square grid, the graph of y = x². Its left half, for x up to 0, is orange and falls from left to right down to the origin. Its right half, for x from 0, is blue and rises from left to right."
        >
          {({ px, py }) => (
            <>
              <Words
                x={px(-0.9)}
                y={py(0.3)}
                anchor="end"
                color={ORANGE}
                size={14}
              >
                falling
              </Words>
              <Words
                x={px(0.9)}
                y={py(0.3)}
                anchor="start"
                color={BLUE}
                size={14}
              >
                rising
              </Words>
            </>
          )}
        </Plot>
      </div>
      <div className="w-full max-w-[280px]">
        <Plot
          id="rising-cube"
          x={[-2.5, 2.5]}
          y={[-2.5, 2.5]}
          unit={44}
          curves={[{ points: graph((x) => x ** 3, -1.4, 1.4), color: BLUE }]}
          label="On a square grid, the graph of y = x³, rising from left to right the whole way: up from the bottom left through (−1, −1), flattening as it passes through the origin, and on through (1, 1) to the top right."
        >
          {({ px, py }) => (
            <>
              <Spot x={px(-1)} y={py(-1)} color={BLUE} />
              <Spot x={px(1)} y={py(1)} color={BLUE} />
              <Words
                x={px(0.4)}
                y={py(-1.5)}
                anchor="start"
                color={BLUE}
                size={14}
              >
                y = x³
              </Words>
            </>
          )}
        </Plot>
      </div>
    </Figure>
  );
}
