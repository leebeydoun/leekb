"use client";

/**
 * A zoom about a point O, like a photocopier set to enlarge. One slider sets the factor r; the flag
 * spreads out from O (or shrinks towards it), and the readout compares one distance before and
 * after, to show that every distance is multiplied by r.
 */

import { useState } from "react";
import { COLORS, Interactive, Slider, format, useSmooth } from "./kit";
import {
  Dot,
  FLAG,
  Flag,
  distance,
  planeScale,
  shift,
  type Vec,
} from "./moving-shape";

const O: Vec = { x: 0, y: 0 };
// the flag sits a little way from O, so its zoomed copy moves away as well as growing
const START = FLAG.map((p) => shift(p, { x: 1, y: 0.4 }));
// two corners whose distance apart the readout follows: 1.5 to begin with
const A = START[0]!;
const B = START[8]!;

const zoom = (p: Vec, r: number): Vec => ({
  x: O.x + r * (p.x - O.x),
  y: O.y + r * (p.y - O.y),
});

export function DilationZoom() {
  const [r, setR] = useState(2);
  const shown = useSmooth(r);
  const { width, height, px } = planeScale(-0.5, 6.1, -0.5, 5.2, 50);

  const before = distance(A, B);
  const after = distance(zoom(A, r), zoom(B, r));
  const a = px(zoom(A, shown));
  const b = px(zoom(B, shown));

  return (
    <Interactive
      readout={
        <>
          <div>
            d(A, B) = {format(before)}, and after the zoom d(A′, B′) ={" "}
            {format(after)}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {r === 1
              ? "A zoom by 1 leaves every point where it was."
              : `Every distance is multiplied by ${format(r)}: ${format(r)} × ${format(before)} = ${format(after)}. The shape is the same, but ${r > 1 ? "bigger" : "smaller"}.`}
          </div>
        </>
      }
      controls={
        <Slider
          label={
            <>
              zoom factor <i>r</i>
            </>
          }
          value={r}
          onChange={setR}
          min={0.5}
          max={3}
          step={0.25}
        />
      }
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto block h-auto w-full max-w-md text-fd-foreground"
        role="img"
        aria-label={`A flag zoomed by ${format(r)} about the point O. The corners A and B move from ${format(before)} apart to ${format(after)} apart.`}
      >
        {/* the rays from O through the two marked corners: each corner slides out along its ray */}
        <g
          stroke="currentColor"
          strokeOpacity={0.3}
          strokeWidth={1.5}
          strokeDasharray="5 5"
        >
          {[A, B].map((p, i) => {
            const end = px(zoom(p, 3.2));
            return (
              <line key={i} x1={px(O).x} y1={px(O).y} x2={end.x} y2={end.y} />
            );
          })}
        </g>
        <Flag corners={START} px={px} color={COLORS.blue} faint />
        <Flag
          corners={START.map((p) => zoom(p, shown))}
          px={px}
          color={COLORS.blue}
        />
        {/* the distance the readout follows */}
        <line
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke={COLORS.orange}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <Dot at={px(O)} name="O" dx={-12} dy={12} />
        <Dot at={a} name="A′" color={COLORS.orange} dx={14} dy={10} />
        <Dot at={b} name="B′" color={COLORS.orange} dx={0} dy={-14} />
      </svg>
    </Interactive>
  );
}
