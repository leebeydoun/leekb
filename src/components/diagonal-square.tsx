import { Figure } from "./figure";

const UNIT = 120;
const PAD = 28;
const SIZE = UNIT * 2;
const SHADE = "#3b82f6";

/**
 * A 2 by 2 square split into four unit squares, with the tilted square made by their diagonals
 * shaded: it is four half squares, so its area is 2 and its side d has d² = 2.
 */
export function DiagonalSquare() {
  const p = (n: number) => PAD + n;
  // corners of the tilted square, at the middles of the big square's sides
  const tilted = [
    [UNIT, 0],
    [SIZE, UNIT],
    [UNIT, SIZE],
    [0, UNIT],
  ]
    .map(([x, y]) => `${p(x!)},${p(y!)}`)
    .join(" ");
  // the middle of each half square inside the tilted square, and of each corner left outside it
  const halves = [
    [80, 80],
    [160, 80],
    [80, 160],
    [160, 160],
  ];

  return (
    <Figure>
      <svg
        viewBox={`0 0 ${SIZE + PAD * 2} ${SIZE + PAD * 2}`}
        className="mx-auto block h-auto w-full max-w-64 text-fd-foreground"
        role="img"
        aria-label="A 2 by 2 square split into four 1 by 1 squares, with a tilted square of side d drawn through their diagonals, made of four halves of a small square"
      >
        <polygon points={tilted} fill={SHADE} fillOpacity={0.2} />
        {/* the big square and the lines splitting it into four */}
        <g stroke="currentColor" strokeWidth={1.5} fill="none">
          <rect x={p(0)} y={p(0)} width={SIZE} height={SIZE} />
          <line x1={p(UNIT)} x2={p(UNIT)} y1={p(0)} y2={p(SIZE)} />
          <line x1={p(0)} x2={p(SIZE)} y1={p(UNIT)} y2={p(UNIT)} />
        </g>
        <polygon
          points={tilted}
          fill="none"
          stroke={SHADE}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <g fontSize={15} fill="currentColor" textAnchor="middle">
          {halves.map(([x, y]) => (
            <text key={`${x},${y}`} x={p(x!)} y={p(y!) + 5}>
              ½
            </text>
          ))}
          <text x={p(48)} y={p(48) + 5} fontStyle="italic">
            d
          </text>
        </g>
        {/* side lengths of the small squares along the bottom and the left */}
        <g
          fontSize={13}
          className="fill-fd-muted-foreground"
          textAnchor="middle"
        >
          <text x={p(UNIT / 2)} y={p(SIZE) + 19}>
            1
          </text>
          <text x={p(UNIT * 1.5)} y={p(SIZE) + 19}>
            1
          </text>
          <text x={p(0) - 12} y={p(UNIT / 2) + 4}>
            1
          </text>
          <text x={p(0) - 12} y={p(UNIT * 1.5) + 4}>
            1
          </text>
        </g>
      </svg>
    </Figure>
  );
}
