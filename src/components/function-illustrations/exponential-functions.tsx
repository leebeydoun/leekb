import { Figure } from "../figure";
import {
  BLUE,
  ORANGE,
  PAPER,
  PAPER_EDGE,
  PURPLE,
  Svg,
  Words,
} from "../illustrations";
import { Arrow, GREEN, Plot, Spot, graph } from "./plot";

/**
 * Pictures for the guide Exponential functions. A sheet of paper folded again and again, its stack
 * of layers doubling each time; then graphs, most of them on grids that are squashed upwards
 * because exponentials climb fast (each caption says so): the dots of 2^x at whole numbers,
 * halves and quarters; 2^x beside its mirror image (½)^x; the bases 2, 3 and 10 together; and a
 * colony of bacteria doubling every 20 minutes.
 */

/**
 * The opening scene: five stacks of paper side by side, for 0 to 4 folds. Each fold puts the sheet
 * on top of itself, so the stacks have 1, 2, 4, 8 and 16 layers.
 */
export function PaperFolds({ caption }: { caption?: string }) {
  const layer = 6;
  const base = 168;
  const stacks = [0, 1, 2, 3, 4].map((folds) => ({
    folds,
    layers: 2 ** folds,
    x: 30 + folds * 112,
    // each fold halves the sheet's width
    width: 92 / 2 ** (folds / 2),
  }));
  return (
    <Figure caption={caption}>
      <Svg
        width={580}
        height={226}
        label="Five stacks of paper on a table, side by side, for 0, 1, 2, 3 and 4 folds. The stacks hold 1, 2, 4, 8 and 16 layers, so each one is twice as tall as the one before it, and narrower, since every fold halves the sheet."
      >
        <line
          x1={10}
          x2={570}
          y1={base}
          y2={base}
          stroke="currentColor"
          strokeOpacity={0.5}
          strokeWidth={2}
        />
        {stacks.map(({ folds, layers, x, width }) => {
          const left = x + (92 - width) / 2;
          return (
            <g key={folds}>
              {Array.from({ length: layers }, (_, i) => (
                <rect
                  key={i}
                  x={left}
                  y={base - (i + 1) * layer}
                  width={width}
                  height={layer}
                  fill={PAPER}
                  stroke={PAPER_EDGE}
                  strokeWidth={1}
                />
              ))}
              <Words
                x={x + 46}
                y={base - layers * layer - 10}
                size={14}
                color={BLUE}
              >
                {`${layers} ${layers === 1 ? "layer" : "layers"}`}
              </Words>
              <Words x={x + 46} y={base + 24} size={14}>
                {`${folds} ${folds === 1 ? "fold" : "folds"}`}
              </Words>
            </g>
          );
        })}
      </Svg>
    </Figure>
  );
}

/**
 * The values of 2^x at the whole numbers from −3 to 3 (large blue dots), at the halves between
 * them (orange) and at the quarters (purple), with no curve drawn: the dots line up along one
 * smooth rising curve by themselves. The grid is squashed upwards: one step up is half as long as
 * one step across.
 */
export function PowersOfTwoDots({ caption }: { caption?: string }) {
  const xs = Array.from({ length: 25 }, (_, i) => -3 + i / 4);
  const colour = (x: number) =>
    Number.isInteger(x) ? BLUE : Number.isInteger(2 * x) ? ORANGE : PURPLE;
  return (
    <Figure caption={caption}>
      <Plot
        id="powers-of-two-dots"
        x={[-3, 3]}
        y={[0, 8]}
        unit={60}
        unitY={30}
        curves={[]}
        label="A grid from x = −3 to 3 across and 0 to 8 up, with one step up drawn half as long as one step across. Dots mark the points (x, 2ˣ): blue at the whole numbers, from (−3, 1/8) through (0, 1) to (3, 8); orange at the halves, such as (1/2, 1.41) and (3/2, 2.83); purple at the quarters. No curve is drawn, but the dots line up along one smooth curve that rises more and more steeply to the right and flattens towards the x-axis on the left."
      >
        {({ px, py }) => (
          <>
            {xs.map((x) => (
              <Spot key={x} x={px(x)} y={py(2 ** x)} color={colour(x)} />
            ))}
            <Words
              x={px(3) - 10}
              y={py(8) + 4}
              anchor="end"
              color={BLUE}
              size={14}
            >
              (3, 8)
            </Words>
            <Words
              x={px(1.5) - 10}
              y={py(2 ** 1.5) - 8}
              anchor="end"
              color={ORANGE}
              size={14}
            >
              (1.5, 2.83)
            </Words>
          </>
        )}
      </Plot>
    </Figure>
  );
}

/**
 * The graphs of y = 2^x and y = (½)^x together, mirror images of each other in the y-axis. Both
 * pass through (0, 1); the points (1, 2) and (−1, 2) show the mirroring. Squashed upwards, as in
 * the dots picture.
 */
export function DoubleAndHalve({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <Plot
        id="double-and-halve"
        x={[-3, 3]}
        y={[0, 8]}
        unit={60}
        unitY={30}
        curves={[
          { points: graph((x) => 2 ** x, -3, 3), color: BLUE },
          { points: graph((x) => 0.5 ** x, -3, 3), color: ORANGE },
        ]}
        label="A grid from x = −3 to 3 across and 0 to 8 up, with one step up drawn half as long as one step across. The blue graph of y = 2ˣ rises from left to right, and the orange graph of y = (1/2)ˣ falls from left to right. They cross at (0, 1) and are mirror images of each other in the y-axis: the point (1, 2) on the blue graph faces the point (−1, 2) on the orange one, joined by a dashed line."
      >
        {({ px, py }) => (
          <>
            <line
              x1={px(-1)}
              x2={px(1)}
              y1={py(2)}
              y2={py(2)}
              stroke={PURPLE}
              strokeWidth={2}
              strokeDasharray="5 4"
            />
            <Spot x={px(1)} y={py(2)} color={BLUE} />
            <Spot x={px(-1)} y={py(2)} color={ORANGE} />
            <Spot x={px(0)} y={py(1)} color={PURPLE} />
            <Words
              x={px(1) + 10}
              y={py(2) + 18}
              anchor="start"
              color={BLUE}
              size={14}
            >
              (1, 2)
            </Words>
            <Words
              x={px(-1) - 10}
              y={py(2) + 18}
              anchor="end"
              color={ORANGE}
              size={14}
            >
              (−1, 2)
            </Words>
            <Words x={px(2.6)} y={py(7.3)} anchor="end" color={BLUE} size={15}>
              y = 2ˣ
            </Words>
            <Words
              x={px(-2.6)}
              y={py(7.3)}
              anchor="start"
              color={ORANGE}
              size={15}
            >
              y = (½)ˣ
            </Words>
          </>
        )}
      </Plot>
    </Figure>
  );
}

/**
 * The graphs of 2^x, 3^x and 10^x for x from −2 to 2. All three pass through (0, 1). To the right
 * of the y-axis the larger base is higher, and to the left it is lower. Squashed upwards: one step
 * up is a third as long as one step across.
 */
export function ThreeBases({ caption }: { caption?: string }) {
  const bases = [
    { a: 2, color: BLUE },
    { a: 3, color: ORANGE },
    { a: 10, color: PURPLE },
  ];
  return (
    <Figure caption={caption}>
      <Plot
        id="three-bases"
        x={[-2, 2]}
        y={[0, 10]}
        unit={90}
        unitY={30}
        curves={bases.map(({ a, color }) => ({
          points: graph((x) => a ** x, -2, 2),
          color,
        }))}
        label="A grid from x = −2 to 2 across and 0 to 10 up, with one step up drawn a third as long as one step across. The graphs of y = 2ˣ in blue, y = 3ˣ in orange and y = 10ˣ in purple all pass through (0, 1). To the right of the y-axis the purple graph is highest and the blue lowest: at x = 1 they reach 10, 3 and 2. To the left of the y-axis the order flips: the purple graph is lowest, closest to the x-axis."
      >
        {({ px, py }) => (
          <>
            {bases.map(({ a, color }) => (
              <Spot key={a} x={px(1)} y={py(a)} color={color} />
            ))}
            <Spot x={px(0)} y={py(1)} color={GREEN} />
            <Words
              x={px(1) + 10}
              y={py(10) + 14}
              anchor="start"
              color={PURPLE}
              size={14}
            >
              (1, 10)
            </Words>
            <Words
              x={px(0) - 10}
              y={py(1) - 16}
              anchor="end"
              color={GREEN}
              size={14}
            >
              (0, 1)
            </Words>
            <Words
              x={px(-1.95)}
              y={py(9.2)}
              anchor="start"
              color={PURPLE}
              size={14}
            >
              y = 10ˣ
            </Words>
            <Words
              x={px(-1.95)}
              y={py(8.2)}
              anchor="start"
              color={ORANGE}
              size={14}
            >
              y = 3ˣ
            </Words>
            <Words
              x={px(-1.95)}
              y={py(7.2)}
              anchor="start"
              color={BLUE}
              size={14}
            >
              y = 2ˣ
            </Words>
          </>
        )}
      </Plot>
    </Figure>
  );
}

/**
 * A colony of bacteria, 500 at the start and doubling every 20 minutes: the graph of
 * 500 · 2^(t/20) for t from 0 to 60 minutes, with dots every 20 minutes at 500, 1000, 2000 and
 * 4000, and an arrow "× 2" over each step. The grid has its own scale on each axis.
 */
export function BacteriaDoubling({ caption }: { caption?: string }) {
  // the number of bacteria, and the same in thousands for the height on the grid
  const count = (t: number) => 500 * 2 ** (t / 20);
  const f = (t: number) => count(t) / 1000;
  const dots = [0, 20, 40, 60];
  return (
    <Figure caption={caption}>
      <Plot
        id="bacteria-doubling"
        x={[0, 64]}
        y={[0, 4.4]}
        unit={7}
        unitY={60}
        step={10}
        every={20}
        stepY={0.5}
        everyY={1}
        curves={[{ points: graph(f, 0, 64), color: BLUE }]}
        label="A graph with time in minutes across, from 0 to 60, and the number of bacteria up, in thousands, from 0 to 4. The curve of 500 · 2 to the power t/20 bacteria rises more and more steeply. Dots every 20 minutes mark 500, 1000, 2000 and 4000 bacteria, and an arrow labelled × 2 joins each dot to the next."
      >
        {({ px, py }) => (
          <>
            {dots.slice(0, -1).map((t) => (
              <g key={`a${t}`}>
                <Arrow
                  x1={px(t) + 4}
                  y1={py(f(t)) - 10}
                  x2={px(t + 20) - 6}
                  y2={py(f(t + 20)) - 12}
                  color={ORANGE}
                  dashed
                />
                <Words
                  x={px(t + 10) - 8}
                  y={py((f(t) + f(t + 20)) / 2) - 18}
                  anchor="end"
                  color={ORANGE}
                  size={14}
                >
                  × 2
                </Words>
              </g>
            ))}
            {dots.map((t) => (
              <Spot key={t} x={px(t)} y={py(f(t))} color={BLUE} />
            ))}
            {/* the time axis is t, not x: cover the grid's x and name it */}
            <rect
              x={px(64) + 3}
              y={py(0) - 24}
              width={16}
              height={18}
              fill="var(--color-fd-card)"
            />
            <text
              x={px(64) + 6}
              y={py(0) - 9}
              fontSize={14}
              fontStyle="italic"
              fill="currentColor"
            >
              t
            </text>
            {dots.map((t) => (
              <Words
                key={`w${t}`}
                x={px(t) + 10}
                y={py(f(t)) + 18}
                anchor="start"
                color={BLUE}
                size={13}
              >
                {String(count(t))}
              </Words>
            ))}
          </>
        )}
      </Plot>
    </Figure>
  );
}
