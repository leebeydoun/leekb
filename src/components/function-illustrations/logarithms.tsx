import { Figure } from "../figure";
import { BLUE, ORANGE, PURPLE, Svg, Words } from "../illustrations";
import { GREEN, MUTED, Plot, Spot, graph } from "./plot";

/**
 * Pictures for the guide Logarithms. A rumour that doubles every day, drawn as people; the graph of
 * y = 2ˣ meeting horizontal lines at two heights, to show that every positive number is a power of
 * 2; and the graphs of y = 2ˣ and y = log₂ x as mirror images in the line y = x.
 */

/**
 * The opening scene: the people who know a rumour on days 0 to 5, one dot each. Every day each
 * person who knows it tells one more, so each day's block is the day before's (blue) with as many
 * new people again (orange) on top.
 */
export function RumourDoubling({ caption }: { caption?: string }) {
  const gap = 13;
  const base = 196;
  const days = [0, 1, 2, 3, 4, 5];
  const centre = (d: number) => 50 + d * 78;

  return (
    <Figure caption={caption}>
      <Svg
        width={600}
        height={250}
        label="Six blocks of dots, one for each of days 0 to 5, with 1, 2, 4, 8, 16 and 32 dots. In each block the lower half of the dots are blue, the people who already knew the rumour the day before, and the upper half are orange, the people they told that day. To the right, after a row of dots for the days in between, a label reads: day 10, 1024 people."
      >
        {days.map((d) => {
          const cols = 2 ** Math.floor(d / 2);
          const rows = 2 ** Math.ceil(d / 2);
          const x0 = centre(d) - ((cols - 1) * gap) / 2;
          return (
            <g key={d}>
              {Array.from({ length: rows }, (_, row) =>
                Array.from({ length: cols }, (_, col) => (
                  <circle
                    key={`${row}-${col}`}
                    cx={x0 + col * gap}
                    cy={base - row * gap}
                    r={5}
                    fill={d > 0 && row >= rows / 2 ? ORANGE : BLUE}
                  />
                )),
              )}
              <Words x={centre(d)} y={base - rows * gap - 6} size={14}>
                {String(2 ** d)}
              </Words>
              <Words x={centre(d)} y={base + 30} size={14}>
                {`day ${d}`}
              </Words>
            </g>
          );
        })}
        {/* the days in between, and day 10 */}
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={482 + i * 12}
            cy={base - 40}
            r={2.5}
            fill={MUTED}
          />
        ))}
        <Words x={552} y={base - 48} size={15} color={ORANGE}>
          1024
        </Words>
        <Words x={552} y={base - 28} size={14}>
          people
        </Words>
        <Words x={552} y={base + 30} size={14}>
          day 10
        </Words>
      </Svg>
    </Figure>
  );
}

/**
 * The graph of y = 2ˣ with two horizontal lines, at heights 3 and 1/2. Each line meets the curve
 * once, and a dashed line drops from the meeting point to the x-axis: at x ≈ 1.58 for height 3 and
 * at x = −1 for height 1/2. Each step up is drawn half as long as each step across.
 */
export function EveryHeight({ caption }: { caption?: string }) {
  const meet: [number, number, string][] = [
    [Math.log2(3), 3, "x ≈ 1.58"],
    [-1, 0.5, "x = −1"],
  ];
  return (
    <Figure caption={caption}>
      <Plot
        id="every-height"
        x={[-3.5, 3.5]}
        y={[0, 9]}
        unit={48}
        unitY={24}
        curves={[{ points: graph((x) => 2 ** x, -3.5, 3.2), color: BLUE }]}
        label="The graph of y = 2 to the power x on a grid whose steps up are half as long as its steps across, for x from −3.5 to 3.5. It rises from just above the x-axis on the left, through (0, 1), to height 9 on the right. A dashed horizontal line at height 3 meets the curve once, and a dashed vertical line drops from there to the x-axis at x ≈ 1.58. A second dashed horizontal line at height 1/2 meets the curve once, above x = −1."
      >
        {({ px, py }) => (
          <>
            {meet.map(([x, y, text]) => (
              <g key={text}>
                <line
                  x1={px(0)}
                  x2={px(x)}
                  y1={py(y)}
                  y2={py(y)}
                  stroke={ORANGE}
                  strokeWidth={2}
                  strokeDasharray="5 4"
                />
                <line
                  x1={px(x)}
                  x2={px(x)}
                  y1={py(y)}
                  y2={py(0)}
                  stroke={ORANGE}
                  strokeWidth={2}
                  strokeDasharray="5 4"
                />
                <Spot x={px(x)} y={py(y)} color={ORANGE} />
              </g>
            ))}
            <Words
              x={px(Math.log2(3)) + 8}
              y={py(0.6)}
              anchor="start"
              size={13}
              color={ORANGE}
            >
              x ≈ 1.58
            </Words>
            <Words
              x={px(0) + 8}
              y={py(3) - 7}
              anchor="start"
              size={13}
              color={ORANGE}
            >
              height 3
            </Words>
            <Words x={px(-1.1)} y={py(2)} anchor="end" size={13} color={ORANGE}>
              height 1/2
            </Words>
            <Words
              x={px(-1.1)}
              y={py(1.35)}
              anchor="end"
              size={13}
              color={ORANGE}
            >
              at x = −1
            </Words>
            <Words x={px(2.2)} y={py(7.6)} anchor="end" size={14} color={BLUE}>
              y = 2ˣ
            </Words>
          </>
        )}
      </Plot>
    </Figure>
  );
}

/**
 * The graphs of y = 2ˣ (blue) and y = log₂ x (green) on one square grid, with the mirror line
 * y = x dashed. Five points of the first, from (−1, 1/2) to (3, 8), are joined by faint lines to
 * their mirror images on the second, from (1/2, −1) to (8, 3).
 */
export function LogMirror({ caption }: { caption?: string }) {
  const pts: [number, number][] = [
    [-1, 0.5],
    [0, 1],
    [1, 2],
    [2, 4],
    [3, 8],
  ];
  return (
    <Figure caption={caption}>
      <Plot
        id="log-mirror"
        x={[-3, 8.5]}
        y={[-3, 8.5]}
        unit={32}
        curves={[
          { points: graph((x) => 2 ** x, -3, 3.1), color: BLUE },
          { points: graph((x) => Math.log2(x), 0.11, 8.5, 400), color: GREEN },
        ]}
        label="A square grid with x and y from −3 to 8.5. The blue graph of y = 2 to the power x rises steeply through (−1, 1/2), (0, 1), (1, 2), (2, 4) and (3, 8). The green graph of y = log base 2 of x rises slowly through (1/2, −1), (1, 0), (2, 1), (4, 2) and (8, 3), and plunges down near the y-axis. The dashed line y = x lies between them, and faint lines join each blue point to its green mirror image across it."
      >
        {({ px, py }) => (
          <>
            <line
              x1={px(-3)}
              y1={py(-3)}
              x2={px(8.5)}
              y2={py(8.5)}
              stroke={PURPLE}
              strokeWidth={2}
              strokeDasharray="6 5"
            />
            {pts.map(([a, b]) => (
              <line
                key={a}
                x1={px(a)}
                y1={py(b)}
                x2={px(b)}
                y2={py(a)}
                stroke={MUTED}
                strokeWidth={1.5}
                strokeDasharray="3 4"
              />
            ))}
            {pts.map(([a, b]) => (
              <g key={a}>
                <Spot x={px(a)} y={py(b)} color={BLUE} />
                <Spot x={px(b)} y={py(a)} color={GREEN} />
              </g>
            ))}
            <Words x={px(3) + 8} y={py(8) + 5} anchor="start" size={14}>
              (3, 8)
            </Words>
            <Words x={px(8)} y={py(3) + 22} anchor="middle" size={14}>
              (8, 3)
            </Words>
            <Words x={px(1.7)} y={py(5.6)} anchor="end" size={14} color={BLUE}>
              y = 2ˣ
            </Words>
            <Words
              x={px(5.6)}
              y={py(1.6)}
              anchor="middle"
              size={14}
              color={GREEN}
            >
              y = log₂ x
            </Words>
            <Words
              x={px(7.4)}
              y={py(7.8)}
              anchor="end"
              size={14}
              color={PURPLE}
            >
              y = x
            </Words>
          </>
        )}
      </Plot>
    </Figure>
  );
}
