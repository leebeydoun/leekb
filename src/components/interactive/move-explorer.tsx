"use client";

/**
 * Six moves of the plane, each given by a formula in coordinates: a slide, a half turn, a zoom, two
 * flips and a quarter turn. A button picks the move; the flag glides from where it was to its image,
 * and the readout gives the formula and where the flag's marked corner P = (3, 1) ends up.
 */

import { useState, type ReactNode } from "react";
import { Grid, gridScale } from "./grid";
import { Button, COLORS, Interactive, format, useAnimation } from "./kit";
import { Dot, FLAG, Flag, turn, type Vec } from "./moving-shape";

const X_RANGE: [number, number] = [-3, 8];
const Y_RANGE: [number, number] = [-3, 6];

// the flag, enlarged a little, with its bottom-left corner P at (3, 1)
const P: Vec = { x: 3, y: 1 };
const START = FLAG.map((c) => ({ x: P.x + 1.25 * c.x, y: P.y + 1.25 * c.y }));

const lerp = (a: Vec, b: Vec, t: number): Vec => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

type MoveName =
  "slide" | "half" | "zoom" | "flipX" | "flipDiagonal" | "quarter";

type Move = {
  button: string;
  /** the formula, as the readout shows it */
  formula: ReactNode;
  /** where the move sends a point */
  map: (p: Vec) => Vec;
  /** where a point is part way through the move, for t from 0 to 1 */
  along: (p: Vec, t: number) => Vec;
  /** the sentence under the formula */
  note: string;
};

const Q_HALF: Vec = { x: 1, y: 1 };
const Q_ZOOM: Vec = { x: 1, y: 0 };
const O: Vec = { x: 0, y: 0 };

const MOVES: Record<MoveName, Move> = {
  slide: {
    button: "slide by (2, 1)",
    formula: (
      <>
        <i>T</i>
        <sub>A</sub>(<i>P</i>) = <i>P</i> + (2, 1)
      </>
    ),
    map: (p) => ({ x: p.x + 2, y: p.y + 1 }),
    along: (p, t) => ({ x: p.x + 2 * t, y: p.y + t }),
    note: "Every point takes the same step (2, 1), a distance √5 ≈ 2.24. Distances stay the same, and no point stays put.",
  },
  half: {
    button: "half turn about (1, 1)",
    formula: (
      <>
        <i>H</i>
        <sub>Q</sub>(<i>P</i>) = 2(1, 1) − <i>P</i>
      </>
    ),
    map: (p) => ({ x: 2 - p.x, y: 2 - p.y }),
    along: (p, t) => turn(p, Q_HALF, 180 * t),
    note: "Each point goes straight through Q = (1, 1) to the same distance on the other side. Distances stay the same, and only Q stays put.",
  },
  zoom: {
    button: "zoom by 2 about (1, 0)",
    formula: (
      <>
        <i>Z</i>
        <sub>2,Q</sub>(<i>P</i>) = (1, 0) + 2(<i>P</i> − (1, 0))
      </>
    ),
    map: (p) => ({ x: 1 + 2 * (p.x - 1), y: 2 * p.y }),
    along: (p, t) => {
      const r = 1 + t;
      return { x: 1 + r * (p.x - 1), y: r * p.y };
    },
    note: "The step from Q = (1, 0) to each point is doubled. Every distance doubles, and only Q stays put.",
  },
  flipX: {
    button: "flip in the x-axis",
    formula: (
      <>
        <i>R</i>
        <sub>1</sub>(<i>x</i>, <i>y</i>) = (<i>x</i>, −<i>y</i>)
      </>
    ),
    map: (p) => ({ x: p.x, y: -p.y }),
    along: (p, t) => ({ x: p.x, y: p.y * (1 - 2 * t) }),
    note: "The second coordinate changes sign, so the flag faces the other way. Distances stay the same, and the points of the x-axis stay put.",
  },
  flipDiagonal: {
    button: "flip in y = x",
    formula: (
      <>
        <i>S</i>(<i>x</i>, <i>y</i>) = (<i>y</i>, <i>x</i>)
      </>
    ),
    map: (p) => ({ x: p.y, y: p.x }),
    along: (p, t) => lerp(p, { x: p.y, y: p.x }, t),
    note: "The two coordinates swap, so the flag faces the other way. Distances stay the same, and the points of the line y = x stay put.",
  },
  quarter: {
    button: "quarter turn",
    formula: (
      <>
        <i>G</i>
        <sub>90</sub>(<i>x</i>, <i>y</i>) = (−<i>y</i>, <i>x</i>)
      </>
    ),
    map: (p) => ({ x: -p.y, y: p.x }),
    along: (p, t) => turn(p, O, 90 * t),
    note: "Each point turns a right angle about O = (0, 0) and keeps its distance from O. Distances stay the same, and only O stays put.",
  },
};

const ORDER: MoveName[] = [
  "slide",
  "half",
  "zoom",
  "flipX",
  "flipDiagonal",
  "quarter",
];

const pair = (p: Vec) => `(${format(p.x)}, ${format(p.y)})`;

export function MoveExplorer({ caption }: { caption?: string }) {
  const [name, setName] = useState<MoveName>("half");
  const { progress, play } = useAnimation(1400);
  // before any button is pressed, the flag's image is shown already in place
  const [started, setStarted] = useState(false);
  const t = started ? progress : 1;
  const move = MOVES[name];
  const { px: sx, py: sy } = gridScale(X_RANGE, Y_RANGE);
  const px = (p: Vec): Vec => ({ x: sx(p.x), y: sy(p.y) });

  const image = move.map(P);
  const moving = START.map((c) => move.along(c, t));
  const corner = move.along(P, t);

  function choose(next: MoveName) {
    setName(next);
    setStarted(true);
    play();
  }

  // what each move draws under the flags: its centre, its mirror, or its step
  let guide: ReactNode = null;
  if (name === "slide") {
    const from = px(O);
    const to = px({ x: 2, y: 1 });
    guide = (
      <g>
        <g stroke={COLORS.purple} strokeWidth={2.5}>
          <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
          <line
            x1={px(P).x}
            y1={px(P).y}
            x2={px(image).x}
            y2={px(image).y}
            strokeDasharray="6 4"
          />
        </g>
        <Dot at={to} name="A" color={COLORS.purple} dx={-6} dy={-12} />
      </g>
    );
  } else if (name === "half" || name === "zoom") {
    const centre = name === "half" ? Q_HALF : Q_ZOOM;
    const c = px(centre);
    const far = px(image);
    guide = (
      <g>
        <line
          x1={px(P).x}
          y1={px(P).y}
          x2={far.x}
          y2={far.y}
          stroke={COLORS.purple}
          strokeWidth={2}
          strokeDasharray="6 4"
        />
        {name === "zoom" && (
          <line
            x1={c.x}
            y1={c.y}
            x2={px(P).x}
            y2={px(P).y}
            stroke={COLORS.purple}
            strokeWidth={2}
            strokeDasharray="6 4"
          />
        )}
        <Dot at={c} name="Q" color={COLORS.purple} dx={-12} dy={16} />
      </g>
    );
  } else if (name === "flipX") {
    guide = (
      <line
        x1={sx(X_RANGE[0])}
        y1={sy(0)}
        x2={sx(X_RANGE[1])}
        y2={sy(0)}
        stroke={COLORS.purple}
        strokeWidth={3}
      />
    );
  } else if (name === "flipDiagonal") {
    guide = (
      <g>
        <line
          x1={sx(-3)}
          y1={sy(-3)}
          x2={sx(6)}
          y2={sy(6)}
          stroke={COLORS.purple}
          strokeWidth={3}
        />
        <text
          x={sx(5.2)}
          y={sy(5.9)}
          textAnchor="end"
          fontSize={14}
          fontStyle="italic"
          fill={COLORS.purple}
          stroke="var(--color-fd-card)"
          strokeWidth={4}
          paintOrder="stroke"
        >
          y = x
        </text>
      </g>
    );
  } else {
    // the quarter turn: the right angle at O between OP and its image
    const o = px(O);
    guide = (
      <g stroke={COLORS.purple} strokeWidth={2} strokeDasharray="6 4">
        <line x1={o.x} y1={o.y} x2={px(P).x} y2={px(P).y} />
        <line x1={o.x} y1={o.y} x2={px(image).x} y2={px(image).y} />
      </g>
    );
  }

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>{move.formula}</div>
          <div className="mt-1">
            <i>P</i> = {pair(P)} ↦ {pair(image)}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {move.note}
          </div>
        </>
      }
      controls={ORDER.map((key) => (
        <Button key={key} primary={key === name} onClick={() => choose(key)}>
          {MOVES[key].button}
        </Button>
      ))}
    >
      <Grid
        x={X_RANGE}
        y={Y_RANGE}
        label={`A flag with its corner P at ${pair(P)}, and its image under the move ${MOVES[name].button}. The corner P goes to ${pair(image)}.`}
      >
        {guide}
        <Flag corners={START} px={px} color={COLORS.blue} faint />
        <Flag corners={moving} px={px} color={COLORS.orange} />
        <Dot at={px(P)} name="P" color={COLORS.blue} dx={-12} dy={16} />
        {t > 0.98 && (
          <Dot
            at={px(corner)}
            name="P′"
            color={COLORS.orange}
            dx={14}
            dy={-8}
          />
        )}
      </Grid>
    </Interactive>
  );
}
