"use client";

/**
 * Multiplying every point by a number c. One slider sets c from −3 to 3; a small flag with its
 * corner at A = (2, 1) moves to its image under P ↦ cP, sliding along lines through the origin.
 * The readout names what the map does for that c (a zoom, a shrink, a half turn, a squash onto O)
 * and the factor |c| by which every distance changes.
 */

import { useState } from "react";
import { Grid, gridScale } from "./grid";
import { COLORS, Interactive, Slider, format, useSmooth } from "./kit";
import { Dot, FLAG, Flag, type Vec } from "./moving-shape";

const X: [number, number] = [-8, 8];
const Y: [number, number] = [-6, 6];

const A: Vec = { x: 2, y: 1 };
// the "F" flag at three fifths of its usual size, with its bottom-left corner at A, so that even
// its triple (or its triple turned round) stays inside the grid
const SHAPE = FLAG.map((p) => ({ x: A.x + 0.6 * p.x, y: A.y + 0.6 * p.y }));

const scale = (p: Vec, c: number): Vec => ({ x: c * p.x, y: c * p.y });

/** the multiple cA written the way the guide writes it: A, −A, 2A, 0.5A */
function multipleName(c: number) {
  if (c === 1) return "A";
  if (c === -1) return "−A";
  return `${format(c)}A`;
}

/** what the map P ↦ cP does, in words */
function describe(c: number) {
  const k = format(Math.abs(c));
  if (c > 1)
    return `c > 1: a zoom by ${k} about O. Every point moves straight out from O, and every distance is multiplied by ${k}.`;
  if (c === 1) return "c = 1: nothing moves, so every distance stays the same.";
  if (c > 0)
    return `0 < c < 1: everything shrinks towards O. Every distance is multiplied by ${k}.`;
  if (c === 0)
    return "c = 0: everything lands on O, so every distance becomes 0.";
  if (c === -1)
    return "c = −1: a half turn about O. Each point goes straight through O to the other side, as far out, and every distance stays the same.";
  return `c < 0: a half turn about O and a zoom by |c| = ${k}. Every distance is multiplied by ${k}.`;
}

export function ScalingSlider() {
  const [c, setC] = useState(2);
  const shown = useSmooth(c);
  const { px, py } = gridScale(X, Y);
  const at = (p: Vec): Vec => ({ x: px(p.x), y: py(p.y) });

  const image = scale(A, c);
  const o = at({ x: 0, y: 0 });
  const a = at(A);
  const ca = at(scale(A, shown));
  // the line through O and A, across the whole grid: y = x / 2
  const lineStart = at({ x: X[0], y: X[0] / 2 });
  const lineEnd = at({ x: X[1], y: X[1] / 2 });

  return (
    <Interactive
      readout={
        <>
          <div>
            A = (2, 1) goes to {multipleName(c)} = ({format(image.x)},{" "}
            {format(image.y)})
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {describe(c)}
          </div>
        </>
      }
      controls={
        <Slider
          label={
            <>
              multiply by <i>c</i>
            </>
          }
          value={c}
          onChange={setC}
          min={-3}
          max={3}
          step={0.25}
        />
      }
    >
      <Grid
        x={X}
        y={Y}
        label={`A flag with its corner at A = (2, 1), and its image when every point is multiplied by ${format(c)}. The corner A goes to (${format(image.x)}, ${format(image.y)}). ${describe(c)}`}
      >
        {/* every multiple of A lies on this line through O and A */}
        <line
          x1={lineStart.x}
          y1={lineStart.y}
          x2={lineEnd.x}
          y2={lineEnd.y}
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={1.5}
          strokeDasharray="5 5"
        />
        <Flag corners={SHAPE} px={at} color={COLORS.blue} faint />
        <Flag
          corners={SHAPE.map((p) => scale(p, shown))}
          px={at}
          color={COLORS.blue}
        />
        <Dot at={o} name="O" dx={-12} dy={14} />
        <Dot at={a} name="A" color={COLORS.orange} dx={12} dy={10} />
        {c !== 1 && (
          <Dot
            at={ca}
            name={multipleName(c)}
            color={COLORS.orange}
            // the flag stretches away from O from this corner, so the name sits on the far side of
            // the corner from the flag, and off the dashed line
            dx={c < 0 ? -22 : 24}
            dy={c < 0 ? -16 : 8}
          />
        )}
      </Grid>
    </Interactive>
  );
}
