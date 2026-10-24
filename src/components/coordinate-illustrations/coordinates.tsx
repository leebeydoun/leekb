import { Figure } from "../figure";
import { BLUE, ORANGE, Svg, Words } from "../illustrations";

/**
 * Pictures for the Coordinates guide: a patch of walking map covered by a numbered grid, with a
 * tent pitched where the line 4 along the bottom meets the line 3 up the side.
 */

const LAND = "#d9ead3";
const WOOD = "#6aa84f";
const WOOD_DARK = "#38761d";
const WATER = "#6fa8dc";
const PATH = "#a0522d";
const GRID = "#5b6b5b";

const UNIT = 66;
const LEFT = 40;
const TOP = 16;
const COLS = 6;
const ROWS = 4;

// the map position of grid point (i, j): i along the bottom, j up the side
const X = (i: number) => LEFT + i * UNIT;
const Y = (j: number) => TOP + (ROWS - j) * UNIT;

// trees of the wood, in grid units, placed the same way on every render
const TREES: [number, number][] = [
  [0.6, 2.9],
  [1.1, 3.4],
  [1.5, 2.7],
  [0.9, 2.2],
  [1.9, 3.3],
  [2.1, 2.6],
  [1.4, 1.9],
  [0.5, 3.6],
];

/** a tent seen from the side, with its foot at (x, y) in pixels */
function Tent({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <polygon
        points={`${x - 15},${y} ${x},${y - 22} ${x + 15},${y}`}
        fill={ORANGE}
        stroke="#9a3412"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <polygon
        points={`${x - 4},${y} ${x},${y - 9} ${x + 4},${y}`}
        fill="#7c2d12"
      />
    </g>
  );
}

/**
 * A walking map with a numbered grid: 0 to 6 along the bottom and 0 to 4 up the side. The tent
 * sits at 4 along and 3 up, and dashed lines run from it to those two numbers.
 */
export function GridReference({ caption }: { caption?: string }) {
  const width = LEFT + COLS * UNIT + 24;
  const height = TOP + ROWS * UNIT + 34;
  const tent = { x: X(4), y: Y(3) };

  return (
    <Figure caption={caption}>
      <Svg
        width={width}
        height={height}
        label="A walking map with a wood, a river and a footpath, covered by a grid numbered 0 to 6 along the bottom and 0 to 4 up the side. A tent sits where the grid line 4 along meets the grid line 3 up."
      >
        {/* the land */}
        <rect
          x={X(0)}
          y={Y(ROWS)}
          width={COLS * UNIT}
          height={ROWS * UNIT}
          fill={LAND}
        />

        {/* a river winding down the map, and a footpath crossing it */}
        <path
          d={`M ${X(2.6)} ${Y(4)} C ${X(3.4)} ${Y(3.2)}, ${X(2.4)} ${Y(2)}, ${X(3.2)} ${Y(1.2)} S ${X(5.6)} ${Y(0.6)}, ${X(6)} ${Y(0.2)}`}
          fill="none"
          stroke={WATER}
          strokeWidth={9}
          strokeLinecap="round"
        />
        <path
          d={`M ${X(0)} ${Y(0.8)} C ${X(1.5)} ${Y(1)}, ${X(2.5)} ${Y(1.6)}, ${X(3.6)} ${Y(2.4)} S ${X(4.6)} ${Y(3.6)}, ${X(6)} ${Y(3.7)}`}
          fill="none"
          stroke={PATH}
          strokeWidth={2.5}
          strokeDasharray="7 5"
        />

        {/* the wood */}
        {TREES.map(([i, j], n) => (
          <circle
            key={n}
            cx={X(i)}
            cy={Y(j)}
            r={15}
            fill={WOOD}
            stroke={WOOD_DARK}
            strokeWidth={1.5}
          />
        ))}

        {/* the grid lines */}
        <g stroke={GRID} strokeWidth={1} strokeOpacity={0.7}>
          {Array.from({ length: COLS + 1 }, (_, i) => (
            <line key={`c${i}`} x1={X(i)} x2={X(i)} y1={Y(0)} y2={Y(ROWS)} />
          ))}
          {Array.from({ length: ROWS + 1 }, (_, j) => (
            <line key={`r${j}`} x1={X(0)} x2={X(COLS)} y1={Y(j)} y2={Y(j)} />
          ))}
        </g>

        {/* reading the tent's position: down to the bottom edge, across to the side */}
        <g stroke={BLUE} strokeWidth={2.5} strokeDasharray="6 4">
          <line x1={tent.x} y1={tent.y} x2={tent.x} y2={Y(0)} />
          <line x1={tent.x} y1={tent.y} x2={X(0)} y2={tent.y} />
        </g>
        <Tent x={tent.x} y={tent.y} />

        {/* the numbers along the bottom and up the side */}
        {Array.from({ length: COLS + 1 }, (_, i) => (
          <Words
            key={`n${i}`}
            x={X(i)}
            y={Y(0) + 22}
            size={15}
            color={i === 4 ? BLUE : "currentColor"}
          >
            {String(i)}
          </Words>
        ))}
        {Array.from({ length: ROWS + 1 }, (_, j) => (
          <Words
            key={`m${j}`}
            x={X(0) - 12}
            y={Y(j) + 5}
            anchor="end"
            size={15}
            color={j === 3 ? BLUE : "currentColor"}
          >
            {String(j)}
          </Words>
        ))}
      </Svg>
    </Figure>
  );
}
