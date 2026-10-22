"use client";

/**
 * One triangle and four moves: a slide, a turn, a flip and a zoom. Each button shows where the
 * triangle lands, with the original drawn faintly, and the readout compares the side lengths before
 * and after. The first three keep every length; the zoom doubles them.
 */

import { useState } from "react";
import { COLORS, Choice, Interactive, format } from "./kit";

const UNIT = 34;
const PAD = 22;
const X0 = 0;
const X1 = 13;
const Y0 = -0.5;
const Y1 = 8;
const WIDTH = (X1 - X0) * UNIT + PAD * 2;
const HEIGHT = (Y1 - Y0) * UNIT + PAD * 2;

type Vec = { x: number; y: number };
type Move = "slide" | "turn" | "flip" | "zoom";

const px = (p: Vec): Vec => ({
  x: PAD + (p.x - X0) * UNIT,
  y: PAD + (Y1 - p.y) * UNIT,
});

const distance = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);

const P: Vec = { x: 1, y: 1 };
const Q: Vec = { x: 5, y: 1 };
const M: Vec = { x: 1, y: 4 };

// where each move sends a point
const MOVES: Record<Move, (p: Vec) => Vec> = {
  // the arrow from (0, 0) to (6, 2)
  slide: (p) => ({ x: p.x + 6, y: p.y + 2 }),
  // a quarter turn clockwise about Q
  turn: (p) => ({ x: Q.x + (p.y - Q.y), y: Q.y - (p.x - Q.x) }),
  // the mirror is the upright line x = 6
  flip: (p) => ({ x: 12 - p.x, y: p.y }),
  // twice as far from P
  zoom: (p) => ({ x: P.x + 2 * (p.x - P.x), y: P.y + 2 * (p.y - P.y) }),
};

const SENTENCES: Record<Move, string> = {
  slide: "A slide moves every point by the same arrow. Every length is kept.",
  turn: "A quarter turn about Q. Every length is kept.",
  flip: "A flip in the dashed mirror line. Every length is kept, though the triangle now faces the other way.",
  zoom: "A zoom by 2 about P. Every length is doubled, so a zoom is not an isometry.",
};

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

export function RigidOrNot() {
  const [move, setMove] = useState<Move>("slide");
  const F = MOVES[move];
  const [P2, Q2, M2] = [F(P), F(Q), F(M)];

  const sides = (a: Vec, b: Vec, c: Vec) =>
    [distance(a, b), distance(b, c), distance(c, a)].map((n) => format(n));
  const before = sides(P, Q, M);
  const after = sides(P2, Q2, M2);

  const triangle = (a: Vec, b: Vec, c: Vec, color: string, faint: boolean) => (
    <polygon
      points={[a, b, c].map((p) => `${px(p).x},${px(p).y}`).join(" ")}
      fill={color}
      fillOpacity={faint ? 0.06 : 0.18}
      stroke={color}
      strokeOpacity={faint ? 0.45 : 1}
      strokeWidth={faint ? 1.5 : 2.5}
      strokeDasharray={faint ? "5 4" : undefined}
      strokeLinejoin="round"
    />
  );

  const name = (
    at: Vec,
    text: string,
    color: string,
    dx: number,
    dy: number,
  ) => {
    const p = px(at);
    return (
      <text
        x={p.x + dx}
        y={p.y + dy}
        textAnchor="middle"
        fontSize={15}
        fontStyle="italic"
        fill={color}
        {...halo}
      >
        {text}
      </text>
    );
  };

  const arrowFrom = px({ x: 2, y: 5.5 });
  const arrowTo = px({ x: 8, y: 7.5 });
  // the arrow's head, pointing along the arrow
  const length = distance(arrowFrom, arrowTo);
  const [ux, uy] = [
    (arrowTo.x - arrowFrom.x) / length,
    (arrowTo.y - arrowFrom.y) / length,
  ];
  const arrowHead = [
    [arrowTo.x, arrowTo.y],
    [arrowTo.x - ux * 14 - uy * 6, arrowTo.y - uy * 14 + ux * 6],
    [arrowTo.x - ux * 14 + uy * 6, arrowTo.y - uy * 14 - ux * 6],
  ]
    .map((p) => p.join(","))
    .join(" ");

  return (
    <Interactive
      readout={
        <>
          <div>
            Sides {before.join(", ")} become {after.join(", ")}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {SENTENCES[move]}
          </div>
        </>
      }
      controls={
        <Choice
          label="Move the triangle by"
          value={move}
          onChange={setMove}
          options={[
            { value: "slide", label: "A slide" },
            { value: "turn", label: "A turn" },
            { value: "flip", label: "A flip" },
            { value: "zoom", label: "A zoom" },
          ]}
        />
      }
      caption="Slides, turns and flips keep every distance; a zoom does not."
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-lg text-fd-foreground"
        role="img"
        aria-label={`A triangle with sides ${before.join(", ")} and its image after ${move === "zoom" ? "a zoom" : `a ${move}`}, with sides ${after.join(", ")}.`}
      >
        {/* what the move is: its arrow, its centre or its mirror */}
        {move === "slide" && (
          <g stroke={COLORS.purple} strokeWidth={2} fill={COLORS.purple}>
            <line
              x1={arrowFrom.x}
              y1={arrowFrom.y}
              x2={arrowTo.x - ux * 12}
              y2={arrowTo.y - uy * 12}
            />
            <polygon points={arrowHead} />
          </g>
        )}
        {move === "flip" && (
          <line
            x1={px({ x: 6, y: Y0 }).x}
            y1={px({ x: 6, y: Y0 }).y}
            x2={px({ x: 6, y: Y1 }).x}
            y2={px({ x: 6, y: Y1 }).y}
            stroke={COLORS.purple}
            strokeWidth={2}
            strokeDasharray="7 5"
          />
        )}

        {triangle(P, Q, M, "currentColor", true)}
        {triangle(
          P2,
          Q2,
          M2,
          move === "zoom" ? COLORS.red : COLORS.blue,
          false,
        )}

        {name(P, "P", "currentColor", -12, 16)}
        {name(Q, "Q", "currentColor", move === "turn" ? -12 : 12, 16)}
        {name(M, "M", "currentColor", -12, -6)}
        {name(
          P2,
          "P′",
          move === "zoom" ? COLORS.red : COLORS.blue,
          move === "flip" ? 14 : -14,
          16,
        )}
        {move !== "turn" &&
          name(
            Q2,
            "Q′",
            move === "zoom" ? COLORS.red : COLORS.blue,
            move === "flip" ? -14 : 14,
            16,
          )}
        {name(
          M2,
          "M′",
          move === "zoom" ? COLORS.red : COLORS.blue,
          move === "flip" ? 14 : -14,
          -6,
        )}

        {/* the centre of the turn or the zoom, which stays put */}
        {(move === "turn" || move === "zoom") && (
          <circle
            cx={px(move === "turn" ? Q : P).x}
            cy={px(move === "turn" ? Q : P).y}
            r={5}
            fill={COLORS.purple}
          />
        )}
      </svg>
    </Interactive>
  );
}
