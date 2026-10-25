"use client";

/**
 * The 15 puzzle: fifteen numbered tiles and a gap on a 4 by 4 board whose squares are shaded like
 * a chessboard. Tapping a tile next to the gap slides it into the gap. Three counters update
 * after every move: the number of slides, the shade of the square the gap is on, and the sign of
 * the arrangement as a permutation of the 16 squares (the gap counted as a 16th tile). A cheat
 * button swaps the tiles 14 and 15 by hand, which flips the sign without moving the gap, and the
 * readout says whether the sign and the gap's shade still agree as they do after every slide.
 */

import { useState } from "react";
import { Button, COLORS, Interactive } from "./kit";

const SIZE = 4;
const CELLS = SIZE * SIZE;
const GAP = CELLS; // the gap is counted as tile 16
const SOLVED = Array.from({ length: CELLS }, (_, i) => i + 1);

const row = (square: number) => Math.floor(square / SIZE);
const col = (square: number) => square % SIZE;
/** squares with an even row + column are shaded, like the gap's home corner */
const shaded = (square: number) => (row(square) + col(square)) % 2 === 0;
const neighbours = (a: number, b: number) =>
  Math.abs(row(a) - row(b)) + Math.abs(col(a) - col(b)) === 1;

/**
 * The sign of the arrangement: board[s] is the tile on square s, so the board is a permutation of
 * 1 to 16, and its sign is −1 to the power (16 − number of orbits).
 */
function sign(board: number[]) {
  const seen = new Array(CELLS).fill(false);
  let orbits = 0;
  for (let s = 0; s < CELLS; s++) {
    if (seen[s]) continue;
    orbits++;
    for (let t = s; !seen[t]; t = board[t]! - 1) seen[t] = true;
  }
  return (CELLS - orbits) % 2 === 0 ? 1 : -1;
}

function slide(board: number[], square: number) {
  const gap = board.indexOf(GAP);
  if (!neighbours(gap, square)) return null;
  const next = [...board];
  next[gap] = board[square]!;
  next[square] = GAP;
  return next;
}

const CELL = 84;
const PAD = 12;
const BOARD = SIZE * CELL + 2 * PAD;

export function SlidingPuzzle({
  caption = "Tap a tile next to the gap to slide it. After every slide, the sign is +1 exactly when the gap sits on a shaded square, like its home corner. The cheat swaps two tiles by hand and breaks that rule.",
}: {
  caption?: string;
}) {
  const [board, setBoard] = useState(SOLVED);
  const [slides, setSlides] = useState(0);

  const gap = board.indexOf(GAP);
  const s = sign(board);
  const homeShade = shaded(gap);
  const agree = (s === 1) === homeShade;

  const tap = (square: number) => {
    const next = slide(board, square);
    if (!next) return;
    setBoard(next);
    setSlides((n) => n + 1);
  };

  const mix = () => {
    let b = board;
    let n = 0;
    let last = -1;
    while (n < 100) {
      const g = b.indexOf(GAP);
      const options = SOLVED.map((_, i) => i).filter(
        (i) => neighbours(g, i) && i !== last,
      );
      const pick = options[Math.floor(Math.random() * options.length)]!;
      b = slide(b, pick)!;
      last = g;
      n++;
    }
    setBoard(b);
    setSlides((k) => k + n);
  };

  const cheat = () => {
    const next = [...board];
    const a = next.indexOf(14);
    const b = next.indexOf(15);
    next[a] = 15;
    next[b] = 14;
    setBoard(next);
  };

  const reset = () => {
    setBoard(SOLVED);
    setSlides(0);
  };

  const verdict = agree
    ? "The sign and the gap's square agree, as they do after any run of slides: each slide flips the sign and moves the gap to the other shade."
    : "The sign and the gap's square disagree. Slides can never break their agreement, so no run of slides from the solved board reaches this one.";

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1">
            <span>slides: {slides}</span>
            <span>
              gap on: {homeShade ? "a shaded square" : "an unshaded square"}
            </span>
            <span style={{ color: s === 1 ? COLORS.blue : COLORS.orange }}>
              sign: {s === 1 ? "+1 (even)" : "−1 (odd)"}
            </span>
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {verdict}
          </div>
        </>
      }
      controls={
        <>
          <Button onClick={mix}>mix with 100 slides</Button>
          <Button onClick={cheat}>swap 14 and 15 by hand</Button>
          <Button primary onClick={reset}>
            reset
          </Button>
        </>
      }
    >
      <svg
        viewBox={`0 0 ${BOARD} ${BOARD}`}
        className="mx-auto block h-auto w-full text-fd-foreground"
        style={{ maxWidth: 400 }}
        role="img"
        aria-label={`A 15 puzzle. Reading the rows from the top, the tiles are ${board
          .map((t) => (t === GAP ? "gap" : String(t)))
          .join(
            ", ",
          )}. ${slides} slides so far; the sign is ${s === 1 ? "+1" : "−1"}.`}
      >
        <rect
          x={2}
          y={2}
          width={BOARD - 4}
          height={BOARD - 4}
          rx={14}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
        />
        {/* the squares, shaded like a chessboard */}
        {SOLVED.map((_, square) => (
          <rect
            key={`sq-${square}`}
            x={PAD + col(square) * CELL}
            y={PAD + row(square) * CELL}
            width={CELL}
            height={CELL}
            fill="currentColor"
            fillOpacity={shaded(square) ? 0.16 : 0.03}
          />
        ))}
        {/* the tiles; one next to the gap can be tapped */}
        {board.map((tile, square) => {
          if (tile === GAP) return null;
          const movable = neighbours(gap, square);
          const swapped = tile === 14 || tile === 15;
          return (
            <g
              key={tile}
              role="button"
              tabIndex={movable ? 0 : -1}
              aria-label={`tile ${tile}${movable ? ", slide into the gap" : ""}`}
              onClick={() => tap(square)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  tap(square);
                }
              }}
              className={movable ? "cursor-pointer" : undefined}
            >
              <rect
                x={PAD + col(square) * CELL + 5}
                y={PAD + row(square) * CELL + 5}
                width={CELL - 10}
                height={CELL - 10}
                rx={10}
                fill="var(--color-fd-card)"
                stroke={swapped ? COLORS.orange : "currentColor"}
                strokeWidth={movable ? 3.5 : 2}
              />
              <text
                x={PAD + col(square) * CELL + CELL / 2}
                y={PAD + row(square) * CELL + CELL / 2 + 10}
                textAnchor="middle"
                fontSize={28}
                fontWeight={700}
                fill={swapped ? COLORS.orange : "currentColor"}
              >
                {tile}
              </text>
            </g>
          );
        })}
      </svg>
    </Interactive>
  );
}
