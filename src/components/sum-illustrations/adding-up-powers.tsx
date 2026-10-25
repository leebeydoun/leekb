import { Figure } from "../figure";
import { BLUE, ORANGE, PURPLE, Svg, Words } from "../illustrations";

/**
 * Pictures for the guide Adding up powers: a pyramid of oranges with its layers seen from above,
 * two staircases of squares filling a rectangle, and a square of side 1 + 2 + 3 + 4 cut into
 * L-shaped bands of 1, 8, 27 and 64 squares.
 */

const PEEL = "#fb923c";
const PEEL_EDGE = "#c2410c";
const GREEN = "#22c55e";

function Orange({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <circle
      cx={x}
      cy={y}
      r={r}
      fill={PEEL}
      stroke={PEEL_EDGE}
      strokeWidth={1.5}
    />
  );
}

/** A square pyramid of oranges four layers high, seen from the front and layer by layer from above. */
export function OrangePyramid({ caption }: { caption?: string }) {
  const r = 17;
  const base = 222;
  const front: { x: number; y: number }[] = [];
  // layer k (1 at the top) shows k oranges along its front edge
  for (let k = 1; k <= 4; k++)
    for (let j = 0; j < k; j++)
      front.push({
        x: 120 + (j - (k - 1) / 2) * 2 * r,
        y: base - r - (4 - k) * 30,
      });
  const cell = 20;
  const lefts = [270, 320, 390, 480];
  const bottom = 196;
  return (
    <Figure caption={caption}>
      {/* the two views side by side on a wide screen, one above the other on a phone */}
      <div className="grid items-end gap-6 sm:grid-cols-[2fr_3fr]">
        <Svg
          width={240}
          height={230}
          label="A pyramid of oranges on a shelf, seen from the front, with 1, 2, 3 and 4 oranges showing in its four layers."
        >
          <g transform="translate(0, -36)">
            <Words x={120} y={78}>
              from the front
            </Words>
            <line
              x1={40}
              x2={200}
              y1={base}
              y2={base}
              stroke="currentColor"
              strokeWidth={2.5}
            />
            {front.map((p, i) => (
              <Orange key={i} x={p.x} y={p.y} r={r} />
            ))}
          </g>
        </Svg>
        <Svg
          width={390}
          height={230}
          label="The same four layers seen from above, square arrays of 1, 4, 9 and 16 oranges, with the sum 1 + 4 + 9 + 16 = 30 written beneath them."
        >
          <g transform="translate(-250, -36)">
            <Words x={445} y={78}>
              each layer from above
            </Words>
            {[1, 2, 3, 4].map((k, i) => (
              <g key={k}>
                {Array.from({ length: k * k }, (_, m) => (
                  <Orange
                    key={m}
                    x={lefts[i]! + cell / 2 + (m % k) * cell}
                    y={bottom - cell / 2 - Math.floor(m / k) * cell}
                    r={cell / 2 - 1}
                  />
                ))}
                <Words x={lefts[i]! + (k * cell) / 2} y={228}>
                  {String(k * k)}
                </Words>
                {i < 3 && (
                  <Words x={(lefts[i]! + k * cell + lefts[i + 1]!) / 2} y={228}>
                    +
                  </Words>
                )}
              </g>
            ))}
            <Words x={600} y={228}>
              = 30
            </Words>
          </g>
        </Svg>
      </div>
    </Figure>
  );
}

/** Two staircases of 1, 2, 3 and 4 squares, one turned over, filling a 4 by 5 rectangle. */
export function StaircaseRectangle({ caption }: { caption?: string }) {
  const n = 4;
  const u = 40;
  const x0 = 120;
  const y0 = 24;
  const cells: { x: number; y: number; color: string }[] = [];
  for (let j = 1; j <= n; j++)
    for (let h = 0; h <= n; h++)
      cells.push({
        x: x0 + (j - 1) * u,
        y: y0 + (n - h) * u,
        color: h < j ? BLUE : ORANGE,
      });
  return (
    <Figure caption={caption}>
      <Svg
        width={600}
        height={268}
        label="A rectangle 4 squares wide and 5 squares tall. In its columns, blue staircase steps of 1, 2, 3 and 4 squares rise from the bottom, and orange steps of 4, 3, 2 and 1 squares hang from the top, the same staircase turned upside down. The rectangle has 20 squares, so each staircase has 10."
      >
        {cells.map((c, i) => (
          <rect
            key={i}
            x={c.x}
            y={c.y}
            width={u}
            height={u}
            fill={c.color}
            fillOpacity={0.55}
            stroke="var(--color-fd-card)"
            strokeWidth={2}
          />
        ))}
        <rect
          x={x0}
          y={y0}
          width={n * u}
          height={(n + 1) * u}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        />
        {[1, 2, 3, 4].map((j) => (
          <Words
            key={j}
            x={x0 + (j - 0.5) * u}
            y={y0 + (n + 1) * u + 22}
            color={BLUE}
          >
            {String(j)}
          </Words>
        ))}
        <Words x={x0 - 14} y={y0 + ((n + 1) * u) / 2 + 5} anchor="end">
          5 tall
        </Words>
        <Words x={330} y={92} anchor="start" color={BLUE}>
          blue: 1 + 2 + 3 + 4
        </Words>
        <Words x={330} y={122} anchor="start" color={ORANGE}>
          orange: the same, turned over
        </Words>
        <Words x={330} y={152} anchor="start">
          together: 4 × 5 = 20 squares
        </Words>
      </Svg>
    </Figure>
  );
}

/** A 10 by 10 square cut into L-shaped bands of 1, 8, 27 and 64 unit squares. */
export function CubesSquare({ caption }: { caption?: string }) {
  const u = 24;
  const x0 = 40;
  const y0 = 46;
  // the band for k is the square of side 1 + ⋯ + k with the square of side 1 + ⋯ + (k − 1) removed
  const sides = [0, 1, 3, 6, 10];
  const colors = [ORANGE, BLUE, GREEN, PURPLE];
  const labels: [string, number][] = [
    ["1", 0.5],
    ["8", 2],
    ["27", 4.5],
    ["64", 8],
  ];
  return (
    <Figure caption={caption}>
      <Svg
        width={600}
        height={310}
        label="A square 10 units on each side, drawn on a grid of unit squares, with its corner at the top left. It is cut into four L-shaped bands around that corner: a single square, then a band of width 2 holding 8 squares, a band of width 3 holding 27, and a band of width 4 holding 64. Along the top the side is marked in pieces of 1, 2, 3 and 4, which add to 10. Beside it: 1 + 8 + 27 + 64 = 100 = 10²."
      >
        {/* largest first, each on a plain backing so the colours don't mix */}
        {[4, 3, 2, 1].map((k) => (
          <g key={k}>
            <rect
              x={x0}
              y={y0}
              width={sides[k]! * u}
              height={sides[k]! * u}
              fill="var(--color-fd-card)"
            />
            <rect
              x={x0}
              y={y0}
              width={sides[k]! * u}
              height={sides[k]! * u}
              fill={colors[k - 1]}
              fillOpacity={0.45}
            />
          </g>
        ))}
        {/* the unit grid */}
        <g stroke="var(--color-fd-card)" strokeWidth={1}>
          {Array.from({ length: 11 }, (_, i) => (
            <g key={i}>
              <line x1={x0 + i * u} x2={x0 + i * u} y1={y0} y2={y0 + 10 * u} />
              <line x1={x0} x2={x0 + 10 * u} y1={y0 + i * u} y2={y0 + i * u} />
            </g>
          ))}
        </g>
        {/* the edges of the bands */}
        {[1, 2, 3, 4].map((k) => (
          <rect
            key={k}
            x={x0}
            y={y0}
            width={sides[k]! * u}
            height={sides[k]! * u}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          />
        ))}
        {labels.map(([text, at]) => (
          <Words key={text} x={x0 + at * u} y={y0 + at * u + 6} size={16}>
            {text}
          </Words>
        ))}
        {/* the pieces of the top side */}
        {[1, 2, 3, 4].map((k) => (
          <Words
            key={k}
            x={x0 + ((sides[k - 1]! + sides[k]!) / 2) * u}
            y={y0 - 12}
            size={14}
            color={colors[k - 1]}
          >
            {String(k)}
          </Words>
        ))}
        <Words x={320} y={130} anchor="start">
          side: 1 + 2 + 3 + 4 = 10
        </Words>
        <Words x={320} y={170} anchor="start">
          bands: 1 + 8 + 27 + 64 = 100
        </Words>
        <Words x={320} y={210} anchor="start">
          and 100 = 10²
        </Words>
      </Svg>
    </Figure>
  );
}
