import { Figure } from "../figure";
import { BLUE, ORANGE, PURPLE, Svg, Words } from "../illustrations";
import { GREEN, MUTED, OpenSpot, Plot, Spot, graph } from "./plot";

/**
 * Pictures for the guide Dividing polynomials. A scene of 47 sweets shared among six children with
 * five left over, then two graphs of rational functions on square grids: (x² + 1)/(x − 1) beside
 * the line y = x + 1 it follows far from x = 1, and (x² − 1)/(x − 1), which is the line y = x + 1
 * with one point missing.
 */

const SWEETS = [BLUE, ORANGE, PURPLE, GREEN, "#ef4444", "#eab308", BLUE];

/** seven sweets on a plate: one in the middle and six round it */
function Plate({ cx, cy }: { cx: number; cy: number }) {
  const spots = [
    [0, 0],
    ...Array.from({ length: 6 }, (_, i) => {
      const t = (Math.PI / 3) * i + Math.PI / 6;
      return [18 * Math.cos(t), 18 * Math.sin(t)];
    }),
  ];
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={34}
        fill="var(--color-fd-card)"
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth={2}
      />
      <circle
        cx={cx}
        cy={cy}
        r={27}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.2}
        strokeWidth={1.5}
      />
      {spots.map(([dx, dy], i) => (
        <circle
          key={i}
          cx={cx + dx!}
          cy={cy + dy!}
          r={6.5}
          fill={SWEETS[i]}
          stroke="var(--color-fd-card)"
          strokeWidth={1.5}
        />
      ))}
    </g>
  );
}

/**
 * The opening scene: six plates in a row, each holding seven sweets, and five more sweets left
 * over in a pile at the end, too few to give every child another one.
 */
export function SharingSweets({ caption }: { caption?: string }) {
  const plates = Array.from({ length: 6 }, (_, i) => 52 + i * 82);
  const left = [
    [560, 92],
    [578, 100],
    [569, 116],
    [551, 112],
    [587, 120],
  ];
  return (
    <Figure caption={caption}>
      <Svg
        width={630}
        height={190}
        label="Six plates in a row, one for each child, each holding seven sweets: one in the middle and six around it. At the right end, five more sweets sit in a small pile labelled 5 left over, fewer than the six it would take to give every child one more."
      >
        {plates.map((cx) => (
          <Plate key={cx} cx={cx} cy={100} />
        ))}
        {plates.map((cx, i) => (
          <Words key={`w${cx}`} x={cx} y={160} size={13}>
            {`child ${i + 1}: 7`}
          </Words>
        ))}
        <Words x={315} y={36} size={15}>
          47 sweets, 6 children: 7 each
        </Words>
        {left.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={6.5}
            fill={SWEETS[i]}
            stroke="var(--color-fd-card)"
            strokeWidth={1.5}
          />
        ))}
        <Words x={569} y={160} size={13} color={ORANGE}>
          5 left over
        </Words>
      </Svg>
    </Figure>
  );
}

/**
 * The graph of y = (x² + 1)/(x − 1) in two pieces either side of the dashed line x = 1, with the
 * faint line y = x + 1 that the pieces run alongside far from x = 1. The curve is above the line
 * to the right of x = 1 and below it to the left, since the gap is 2/(x − 1).
 */
export function RationalNearLine({ caption }: { caption?: string }) {
  const f = (x: number) => (x * x + 1) / (x - 1);
  return (
    <Figure caption={caption}>
      <Plot
        id="rational-near-line"
        x={[-4, 6]}
        y={[-5, 9]}
        unit={28}
        curves={[
          { points: graph((x) => x + 1, -4, 6), color: MUTED, faint: true },
          { points: graph(f, -4, 0.8), color: BLUE },
          { points: graph(f, 1.2, 6), color: BLUE },
        ]}
        label="On a square grid, the graph of y = (x² + 1)/(x − 1) in two pieces, one on each side of the dashed vertical line x = 1, where the function is not defined. A faint dashed line y = x + 1 runs through the picture. Far to the right the curve lies a little above the line, and far to the left a little below it; close to x = 1 the curve shoots up on the right and down on the left. The points (5, 6.5) on the curve and (5, 6) on the line are marked, one above the other."
      >
        {({ px, py }) => (
          <>
            <line
              x1={px(1)}
              x2={px(1)}
              y1={py(-5)}
              y2={py(9)}
              stroke={ORANGE}
              strokeWidth={2}
              strokeDasharray="5 4"
            />
            <Words
              x={px(1) + 6}
              y={py(-4.3)}
              anchor="start"
              color={ORANGE}
              size={14}
            >
              x = 1
            </Words>
            <Words
              x={px(-3.8)}
              y={py(0.4)}
              anchor="start"
              color={MUTED}
              size={14}
            >
              y = x + 1
            </Words>
            <Words
              x={px(1.6)}
              y={py(-2.2)}
              anchor="start"
              color={BLUE}
              size={14}
            >
              y = (x² + 1)/(x − 1)
            </Words>
            <line
              x1={px(5)}
              x2={px(5)}
              y1={py(6.5)}
              y2={py(6)}
              stroke={PURPLE}
              strokeWidth={2.5}
            />
            <Spot x={px(5)} y={py(6.5)} color={BLUE} />
            <Spot x={px(5)} y={py(6)} color={MUTED} />
            <Words
              x={px(5) - 10}
              y={py(6.5) - 10}
              anchor="end"
              color={BLUE}
              size={14}
            >
              (5, 6.5)
            </Words>
            <Words x={px(5) + 8} y={py(6) + 18} anchor="start" size={14}>
              (5, 6)
            </Words>
          </>
        )}
      </Plot>
    </Figure>
  );
}

/**
 * The graph of y = (x² − 1)/(x − 1): the line y = x + 1 with an open dot at (1, 2), the one point
 * of the line that is missing because the function is not defined at x = 1.
 */
export function LineWithHole({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <Plot
        id="line-with-hole"
        x={[-3, 4]}
        y={[-2, 5]}
        unit={36}
        curves={[{ points: graph((x) => x + 1, -3, 4), color: BLUE }]}
        label="On a square grid, the graph of y = (x² − 1)/(x − 1). It is the straight line y = x + 1 with one point left out: an open dot at (1, 2), where x − 1 is zero and the function is not defined."
      >
        {({ px, py }) => (
          <>
            <OpenSpot x={px(1)} y={py(2)} color={BLUE} />
            <Words
              x={px(1) + 10}
              y={py(2) + 18}
              anchor="start"
              color={BLUE}
              size={14}
            >
              (1, 2) left out
            </Words>
            <Words x={px(3.9)} y={py(-1.4)} anchor="end" color={BLUE} size={14}>
              y = (x² − 1)/(x − 1)
            </Words>
          </>
        )}
      </Plot>
    </Figure>
  );
}
