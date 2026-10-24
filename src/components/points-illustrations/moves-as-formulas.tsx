import { Figure } from "../figure";
import { ORANGE, PURPLE, Svg, Words } from "../illustrations";

/**
 * Pictures for the Moves as formulas guide: a game character drawn in three frames on a screen's
 * tile grid. Between frames the game adds the same step, 3 tiles across and 1 up, to every pixel,
 * so the character moves without turning or changing size.
 */

const TILE = 48;
const LEFT = 20;
const TOP = 16;
const COLS = 9;
const ROWS = 5;

// the pixel position of the tile point (i, j): i tiles across and j tiles up from the bottom left
const X = (i: number) => LEFT + i * TILE;
const Y = (j: number) => TOP + (ROWS - j) * TILE;

// the character, one letter per pixel from the top row down: it faces right, so a turn or a flip
// would show
const SPRITE = [
  "..HHH.",
  ".HHHHH",
  ".SSES.",
  ".SSSS.",
  "BBBBB.",
  "SBBBBS",
  ".B..B.",
  ".D..D.",
];
const PIXEL = 8;
const PAINT: Record<string, string> = {
  H: "#dc2626",
  S: "#fcd9b6",
  E: "#1f2937",
  B: "#2563eb",
  D: "#78350f",
};

// the bottom-left corner of the character in each frame, in tiles: each is (3, 1) on from the last
const FRAMES: [number, number][] = [
  [0.5, 0.5],
  [3.5, 1.5],
  [6.5, 2.5],
];
const WIDE = (SPRITE[0]!.length * PIXEL) / TILE; // the character's width in tiles

/** the character with its bottom-left corner at tile point (i, j) */
function Character({
  i,
  j,
  opacity,
}: {
  i: number;
  j: number;
  opacity: number;
}) {
  const x = X(i);
  const y = Y(j) - SPRITE.length * PIXEL;
  return (
    <g opacity={opacity}>
      {SPRITE.flatMap((row, r) =>
        [...row].map((c, k) =>
          c === "." ? null : (
            <rect
              key={`${r}-${k}`}
              x={x + k * PIXEL}
              y={y + r * PIXEL}
              width={PIXEL}
              height={PIXEL}
              fill={PAINT[c]}
            />
          ),
        ),
      )}
    </g>
  );
}

/** an arrow from (x1, y1) to (x2, y2) in pixels, with its head at the second point */
function Arrow({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  const length = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / length;
  const uy = (y2 - y1) / length;
  const head = 12;
  const half = 6;
  const bx = x2 - ux * head;
  const by = y2 - uy * head;
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={bx}
        y2={by}
        stroke={ORANGE}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <polygon
        points={`${x2},${y2} ${bx - uy * half},${by + ux * half} ${bx + uy * half},${by - ux * half}`}
        fill={ORANGE}
      />
    </g>
  );
}

/**
 * Three frames of a game, drawn on one screen: the character starts at the bottom left, and each
 * frame it has moved 3 tiles across and 1 up. Orange arrows join the same corner of the character
 * in each frame, and each is labelled with the step "+ (3, 1)".
 */
export function SpriteFrames({ caption }: { caption?: string }) {
  const width = LEFT + COLS * TILE + 20;
  const height = TOP + ROWS * TILE + 16;

  return (
    <Figure caption={caption}>
      <Svg
        width={width}
        height={height}
        label="A game screen with a tile grid. A small character facing right appears three times, in frames 1, 2 and 3. Each frame it is 3 tiles further across and 1 tile higher, and arrows labelled plus (3, 1) join the same corner of the character from one frame to the next."
      >
        {/* the screen and its tile grid */}
        <rect
          x={X(0)}
          y={Y(ROWS)}
          width={COLS * TILE}
          height={ROWS * TILE}
          rx={8}
          fill="currentColor"
          fillOpacity={0.04}
          stroke="currentColor"
          strokeOpacity={0.5}
          strokeWidth={2}
        />
        <g stroke="currentColor" strokeOpacity={0.15} strokeWidth={1}>
          {Array.from({ length: COLS - 1 }, (_, i) => (
            <line
              key={`c${i}`}
              x1={X(i + 1)}
              x2={X(i + 1)}
              y1={Y(0)}
              y2={Y(ROWS)}
            />
          ))}
          {Array.from({ length: ROWS - 1 }, (_, j) => (
            <line
              key={`r${j}`}
              x1={X(0)}
              x2={X(COLS)}
              y1={Y(j + 1)}
              y2={Y(j + 1)}
            />
          ))}
        </g>

        {/* the character in each frame, fainter for the earlier frames */}
        {FRAMES.map(([i, j], n) => (
          <Character key={n} i={i} j={j} opacity={[0.35, 0.6, 1][n]!} />
        ))}

        {/* the same step between frames, from one bottom-right corner to the next */}
        {FRAMES.slice(1).map(([i, j], n) => {
          const [i0, j0] = FRAMES[n]!;
          return (
            <g key={n}>
              <Arrow x1={X(i0 + WIDE)} y1={Y(j0)} x2={X(i + WIDE)} y2={Y(j)} />
              <Words
                x={X((i0 + i) / 2 + WIDE + 0.2)}
                y={Y((j0 + j) / 2 - 0.45)}
                color={ORANGE}
                size={15}
              >
                + (3, 1)
              </Words>
            </g>
          );
        })}
        {FRAMES.map(([i, j], n) => (
          <circle key={n} cx={X(i + WIDE)} cy={Y(j)} r={4} fill={PURPLE} />
        ))}

        {/* the frame numbers, above each character */}
        {FRAMES.map(([i, j], n) => (
          <Words key={n} x={X(i + WIDE / 2)} y={Y(j + 1.55)} size={14}>
            {`frame ${n + 1}`}
          </Words>
        ))}
      </Svg>
    </Figure>
  );
}
