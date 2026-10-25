import { Figure } from "../figure";
import { ORANGE, PURPLE, Svg, WOOD, WOOD_DARK, Words } from "../illustrations";
import { Loops } from "./cycles";

/**
 * Pictures for the guide Swaps and the sign of a permutation. The 15 puzzle with its 14 and 15
 * swapped, the same board shaded like a chessboard with a path of the gap, and permutations
 * drawn as loops (with the `Loops` helper from the Cycles pictures) before and after one swap,
 * which either cuts a loop in two or joins two loops into one.
 */

const TILE_FACE = "#fbfaf7";
const TILE_EDGE = "#78716c";
const MUTED = "#9ca3af";

/**
 * A 15 puzzle in its wooden frame. The tiles read 1 to 13 along the rows, then 15 and 14 in the
 * wrong order (both in orange), with the gap in the bottom right corner.
 */
export function FourteenFifteen({ caption }: { caption?: string }) {
  const cell = 66;
  const x0 = 110;
  const y0 = 24;
  const tiles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 14];
  return (
    <Figure caption={caption}>
      <Svg
        width={500}
        height={320}
        label="A 15 puzzle: a square wooden frame holding fifteen square tiles in four rows of four, with one empty square in the bottom right corner. The tiles read 1 to 4, 5 to 8, 9 to 12 along the first three rows, and the last row reads 13, 15, 14 and then the gap. The 15 and the 14, in orange, are in each other's places."
      >
        <rect
          x={x0 - 16}
          y={y0 - 16}
          width={4 * cell + 32}
          height={4 * cell + 32}
          rx={16}
          fill={WOOD}
          stroke={WOOD_DARK}
          strokeWidth={3}
        />
        <rect
          x={x0}
          y={y0}
          width={4 * cell}
          height={4 * cell}
          rx={4}
          fill={WOOD_DARK}
          fillOpacity={0.55}
        />
        {tiles.map((t, i) => {
          const x = x0 + (i % 4) * cell;
          const y = y0 + Math.floor(i / 4) * cell;
          const odd = t === 14 || t === 15;
          return (
            <g key={t}>
              <rect
                x={x + 3}
                y={y + 3}
                width={cell - 6}
                height={cell - 6}
                rx={8}
                fill={TILE_FACE}
                stroke={odd ? ORANGE : TILE_EDGE}
                strokeWidth={odd ? 3.5 : 2}
              />
              <text
                x={x + cell / 2}
                y={y + cell / 2 + 10}
                textAnchor="middle"
                fontSize={28}
                fontWeight={700}
                fill={odd ? ORANGE : "#1f2937"}
              >
                {t}
              </text>
            </g>
          );
        })}
        <Words
          x={x0 + 4 * cell + 30}
          y={y0 + 3.5 * cell + 6}
          anchor="start"
          size={14}
        >
          gap
        </Words>
      </Svg>
    </Figure>
  );
}

/**
 * The 4 by 4 board shaded like a chessboard, the squares numbered 1 to 16 along the rows, with a
 * path of the gap: from square 16 to 15, 11, 7, 8, 12 and back to 16, six slides, each step
 * landing on the other shade.
 */
export function GapColours({ caption }: { caption?: string }) {
  const cell = 64;
  const x0 = 40;
  const y0 = 20;
  const centre = (square: number) => ({
    x: x0 + ((square - 1) % 4) * cell + cell / 2,
    y: y0 + Math.floor((square - 1) / 4) * cell + cell / 2,
  });
  const path = [16, 15, 11, 7, 8, 12, 16];
  const shaded = (square: number) =>
    (((square - 1) % 4) + Math.floor((square - 1) / 4)) % 2 === 0;
  return (
    <Figure caption={caption}>
      <Svg
        width={460}
        height={300}
        label="The sixteen squares of the 15 puzzle, numbered 1 to 16 along the rows from the top left, and shaded like a chessboard so that square 16 in the bottom right corner is shaded. A purple path shows the gap moving from square 16 to 15, then 11, 7, 8, 12 and back to 16: six slides. The squares on the path alternate shaded, unshaded, shaded, and so on, and the step numbers 1 to 6 are written beside it."
      >
        {Array.from({ length: 16 }, (_, i) => i + 1).map((square) => {
          const x = x0 + ((square - 1) % 4) * cell;
          const y = y0 + Math.floor((square - 1) / 4) * cell;
          return (
            <g key={square}>
              <rect
                x={x}
                y={y}
                width={cell}
                height={cell}
                fill="currentColor"
                fillOpacity={shaded(square) ? 0.18 : 0.03}
                stroke="currentColor"
                strokeOpacity={0.3}
              />
              <text x={x + 8} y={y + 18} fontSize={13} fill={MUTED}>
                {square}
              </text>
            </g>
          );
        })}
        <polyline
          points={path.map((s) => `${centre(s).x},${centre(s).y}`).join(" ")}
          fill="none"
          stroke={PURPLE}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        {path.slice(1).map((s, i) => {
          // the step number sits in the square the gap lands on, below the path, on the outside
          const b = centre(s);
          const side = b.x < centre(16).x ? -16 : 16;
          return (
            <Words key={i} x={b.x + side} y={b.y + 22} color={PURPLE} size={14}>
              {i + 1}
            </Words>
          );
        })}
        <circle
          cx={centre(16).x}
          cy={centre(16).y}
          r={9}
          fill={PURPLE}
          stroke="var(--color-fd-card)"
          strokeWidth={2}
        />
        <Words
          x={x0 + 4 * cell + 16}
          y={y0 + 3.5 * cell + 5}
          anchor="start"
          size={14}
        >
          gap starts
        </Words>
        <Words
          x={x0 + 4 * cell + 16}
          y={y0 + 3.5 * cell + 23}
          anchor="start"
          size={14}
        >
          and ends here
        </Words>
      </Svg>
    </Figure>
  );
}

/**
 * σ = [1, 4, 2, 6][3, 5] and, under it, [4, 6]σ = [1, 6][2, 4][3, 5]: one loop cut in two. The two
 * pictures are stacked, not side by side, because the three rings of the second are wider than the
 * first and would be drawn much smaller in a half-width column.
 */
export function LoopCut({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption} className="grid gap-4">
      <Loops
        title="σ"
        cycles={[
          [1, 4, 2, 6],
          [3, 5],
        ]}
        label="The permutation sigma as loops: a blue ring carrying 1 to 4, 4 to 2, 2 to 6 and 6 back to 1, and an orange ring carrying 3 to 5 and back. Two orbits."
      />
      <Loops
        title="[4, 6]σ"
        cycles={[
          [1, 6],
          [2, 4],
          [3, 5],
        ]}
        label="After the swap of 4 and 6: the blue ring has been cut into two rings, one carrying 1 to 6 and back, the other carrying 2 to 4 and back, while the ring [3, 5] is unchanged. Three orbits."
      />
    </Figure>
  );
}

/** σ = [1, 4, 2, 6][3, 5] and [2, 3]σ = [1, 4, 3, 5, 2, 6]: two loops joined into one. */
export function LoopsJoin({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption} className="grid gap-4 sm:grid-cols-2">
      <Loops
        title="σ"
        cycles={[
          [1, 4, 2, 6],
          [3, 5],
        ]}
        label="The permutation sigma as loops: a blue ring carrying 1 to 4, 4 to 2, 2 to 6 and 6 back to 1, and an orange ring carrying 3 to 5 and back. Two orbits."
      />
      <Loops
        title="[2, 3]σ"
        cycles={[[1, 4, 3, 5, 2, 6]]}
        label="After the swap of 2 and 3: one ring of six carrying 1 to 4, 4 to 3, 3 to 5, 5 to 2, 2 to 6 and 6 back to 1. The two rings have been joined into one orbit."
      />
    </Figure>
  );
}
