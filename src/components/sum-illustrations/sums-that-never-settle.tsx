import { Figure } from "../figure";
import { GREEN, MUTED, Plot } from "../function-illustrations/plot";
import { BLUE, ORANGE, PURPLE, Svg, Words } from "../illustrations";

/**
 * Pictures for the guide Sums that never settle: four books stacked out over a table edge, and the
 * terms of the harmonic series as bars, grouped in blocks that each add up to at least a half.
 */

const TABLE = "#d4a373";
const TABLE_DARK = "#8b5e34";

/**
 * The opening scene: four books stacked at the edge of a table, each as far out as balance allows.
 * Counting from the top, each book sticks out 1/2, 1/4, 1/6 and 1/8 of a book length past the one
 * below it (the bottom one past the table edge), so the top book ends 25/24 of a length past the edge.
 */
export function BookStack({ caption }: { caption?: string }) {
  const edge = 190;
  const top = 230;
  const book = 160;
  const thick = 28;
  const ruler = 86;
  const colours = [BLUE, ORANGE, PURPLE, GREEN];
  // how far the right end of each book (top first) is past the table edge, in book lengths
  const past = [1, 2, 3, 4].map((k) => {
    let s = 0;
    for (let j = k; j <= 4; j++) s += 1 / (2 * j);
    return s;
  });
  const right = past.map((p) => edge + p * book);
  const marks = [edge, ...[...right].reverse()];
  const steps = ["⅛", "⅙", "¼", "½"];

  return (
    <Figure caption={caption}>
      <Svg
        width={420}
        height={320}
        label="Four books stacked at the right-hand edge of a table, each one pushed out further than the one below it. A scale above the stack marks how far each book's end is past the one below: one eighth of a book length for the bottom book past the table edge, then one sixth, one quarter and one half for the top book. An arrow under the stack shows the top book's end is 25/24 of a book length past the table edge, so the whole top book is beyond the edge."
      >
        {/* dashed lines from the ends up to the scale, drawn first so the books cover them */}
        <g stroke={MUTED} strokeWidth={1.5} strokeDasharray="4 4">
          {marks.map((x, i) => (
            <line key={i} x1={x} x2={x} y1={ruler} y2={top} />
          ))}
        </g>
        {/* the table */}
        <rect
          x={10}
          y={top}
          width={edge - 10}
          height={14}
          fill={TABLE}
          stroke={TABLE_DARK}
          strokeWidth={2}
        />
        <rect
          x={edge - 30}
          y={top + 14}
          width={14}
          height={70}
          fill={TABLE}
          stroke={TABLE_DARK}
          strokeWidth={2}
        />
        {/* the books, the top one first in the list */}
        {right.map((r, i) => {
          const y = top - thick * (4 - i);
          return (
            <g key={i}>
              <rect
                x={r - book}
                y={y}
                width={book}
                height={thick - 2}
                rx={3}
                fill={colours[i]}
                fillOpacity={0.85}
                stroke="currentColor"
                strokeWidth={1.5}
              />
              <line
                x1={r - book + 12}
                x2={r - 12}
                y1={y + (thick - 2) / 2}
                y2={y + (thick - 2) / 2}
                stroke="var(--color-fd-card)"
                strokeWidth={2}
                strokeOpacity={0.7}
              />
            </g>
          );
        })}
        {/* the scale above the stack */}
        <line
          x1={edge}
          x2={right[0]}
          y1={ruler}
          y2={ruler}
          stroke="currentColor"
          strokeWidth={1.5}
        />
        {marks.map((x, i) => (
          <line
            key={i}
            x1={x}
            x2={x}
            y1={ruler - 6}
            y2={ruler + 6}
            stroke="currentColor"
            strokeWidth={1.5}
          />
        ))}
        {steps.map((t, i) => (
          <Words
            key={t}
            x={(marks[i]! + marks[i + 1]!) / 2}
            y={ruler - 12}
            size={15}
          >
            {t}
          </Words>
        ))}
        <Words x={edge - 8} y={ruler + 5} anchor="end" size={13}>
          table edge
        </Words>
        {/* the total overhang */}
        <g stroke={ORANGE} fill={ORANGE} strokeWidth={2.5}>
          <line x1={edge + 8} x2={right[0]! - 8} y1={top + 26} y2={top + 26} />
          <polygon
            points={`${edge},${top + 26} ${edge + 10},${top + 21} ${edge + 10},${top + 31}`}
            strokeWidth={0}
          />
          <polygon
            points={`${right[0]},${top + 26} ${right[0]! - 10},${top + 21} ${right[0]! - 10},${top + 31}`}
            strokeWidth={0}
          />
        </g>
        <Words x={(edge + right[0]!) / 2} y={top + 50} color={ORANGE} size={14}>
          25⁄24 book lengths
        </Words>
      </Svg>
    </Figure>
  );
}

/**
 * The terms 1, 1/2, …, 1/16 of the harmonic series as bars, in blocks 1, 2, 3–4, 5–8 and 9–16. In
 * the last three blocks a dashed line marks the smallest term: every bar in the block reaches it,
 * and the block has as many bars as that term's denominator over two, so it adds up to at least 1/2.
 */
export function HarmonicBlocks({ caption }: { caption?: string }) {
  const blocks: [number, number][] = [
    [1, 1],
    [2, 2],
    [3, 4],
    [5, 8],
    [9, 16],
  ];
  // where each "at least ½" label sits: its left end and its height
  const labels: Record<number, [number, number]> = {
    2: [2.6, 0.4],
    3: [4.6, 0.27],
    4: [10.2, 0.18],
  };

  return (
    <Figure caption={caption}>
      <Plot
        id="harmonic-blocks"
        x={[0, 17]}
        y={[0, 1.1]}
        unit={28}
        unitY={168}
        stepY={0.25}
        everyY={0.5}
        curves={[]}
        label="Bars for the terms 1, 1/2, 1/3 and so on up to 1/16, standing on the numbers 1 to 16, coloured in blocks: 1, then 2, then 3 to 4, then 5 to 8, then 9 to 16. Over each of the last three blocks a dashed line marks the height of the block's smallest bar, 1/4, 1/8 and 1/16, and a label says the block adds up to at least one half."
      >
        {({ px, py }) => (
          <>
            {blocks.map(([a, b], i) => (
              <g key={i}>
                {Array.from({ length: b - a + 1 }, (_, j) => a + j).map((k) => (
                  <rect
                    key={k}
                    x={px(k - 0.38)}
                    y={py(1 / k)}
                    width={px(0.76) - px(0)}
                    height={py(0) - py(1 / k)}
                    fill={i % 2 ? ORANGE : BLUE}
                    fillOpacity={0.8}
                  />
                ))}
                {i >= 2 && (
                  <line
                    x1={px(a - 0.5)}
                    x2={px(b + 0.5)}
                    y1={py(1 / b)}
                    y2={py(1 / b)}
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeDasharray="5 4"
                  />
                )}
                {labels[i] && (
                  <Words
                    x={px(labels[i]![0])}
                    y={py(labels[i]![1])}
                    anchor="start"
                    color={i % 2 ? ORANGE : BLUE}
                    size={12}
                  >
                    at least ½
                  </Words>
                )}
              </g>
            ))}
          </>
        )}
      </Plot>
    </Figure>
  );
}
