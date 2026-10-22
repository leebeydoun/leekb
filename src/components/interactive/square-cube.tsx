"use client";

/**
 * The square-cube law on a cube. One slider zooms a cube of side 1 by r; the unit cube stays
 * drawn faintly in the corner for comparison. The readout gives the surface (× r²), the volume
 * (× r³) and the surface for each unit of volume (× 1/r), which falls as the cube grows.
 */

import { useState } from "react";
import { COLORS, Interactive, Slider, format, useSmooth } from "./kit";

const UNIT = 46;
const MAX = 4;
// how far one unit of depth reaches across and up the page, as a share of a unit across
const DEPTH = { x: 0.5, y: 0.32 };
const PAD = 16;
const WIDTH = MAX * UNIT * (1 + DEPTH.x) + PAD * 2;
const HEIGHT = MAX * UNIT * (1 + DEPTH.y) + PAD * 2;
// the bottom-left front corner of every cube
const X0 = PAD;
const Y0 = HEIGHT - PAD;

/** the three faces of a cube of side `s` units that show, as polygons */
function faces(s: number) {
  const w = s * UNIT;
  const dx = w * DEPTH.x;
  const dy = w * DEPTH.y;
  const pts = (list: [number, number][]) =>
    list.map(([a, b]) => `${X0 + a},${Y0 - b}`).join(" ");
  return {
    front: pts([
      [0, 0],
      [w, 0],
      [w, w],
      [0, w],
    ]),
    top: pts([
      [0, w],
      [w, w],
      [w + dx, w + dy],
      [dx, w + dy],
    ]),
    side: pts([
      [w, 0],
      [w + dx, dy],
      [w + dx, w + dy],
      [w, w],
    ]),
  };
}

/** lines splitting the front, top and side of a cube of side `s` into unit squares */
function gridLines(s: number) {
  const w = s * UNIT;
  const lines: [number, number, number, number][] = [];
  for (let k = 1; k < s - 1e-9; k++) {
    const a = k * UNIT;
    const ox = a * DEPTH.x;
    const oy = a * DEPTH.y;
    lines.push(
      [a, 0, a, w], // up the front
      [a, w, a + w * DEPTH.x, w + w * DEPTH.y], // back across the top
      [0, a, w, a], // across the front
      [w, a, w + w * DEPTH.x, a + w * DEPTH.y], // back along the side
      [ox, w + oy, w + ox, w + oy], // across the top
      [w + ox, oy, w + ox, w + oy], // up the side
    );
  }
  return lines;
}

export function SquareCube() {
  const [r, setR] = useState(2);
  const shown = useSmooth(r);

  const surface = 6 * r * r;
  const volume = r ** 3;
  const big = faces(shown);
  const unit = faces(1);

  return (
    <Interactive
      readout={
        <>
          <div>
            surface 6 × {format(r)}² = {format(surface)}, volume {format(r)}³ ={" "}
            {format(volume)}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {r === 1
              ? "The cube of side 1 has 6 units of surface for its 1 unit of volume."
              : `Surface × ${format(r * r)}, volume × ${format(volume)}. Each unit of volume now has ${format(surface / volume)} units of surface, which is 6 ÷ ${format(r)}: ${r > 1 ? "less" : "more"} surface for each unit of inside.`}
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
          max={MAX}
          step={0.5}
        />
      }
      caption="A cube of side 1 (faint, in the corner) zoomed by r. Its surface grows by r², but its volume grows by r³."
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-sm text-fd-foreground"
        role="img"
        aria-label={`A cube of side ${format(r)}, with surface ${format(surface)} and volume ${format(volume)}.`}
      >
        <g strokeLinejoin="round">
          <polygon points={big.front} fill={COLORS.blue} fillOpacity={0.22} />
          <polygon points={big.top} fill={COLORS.blue} fillOpacity={0.12} />
          <polygon points={big.side} fill={COLORS.blue} fillOpacity={0.34} />
          <g stroke={COLORS.blue} strokeOpacity={0.45} strokeWidth={1}>
            {gridLines(shown).map(([x1, y1, x2, y2], i) => (
              <line
                key={i}
                x1={X0 + x1}
                y1={Y0 - y1}
                x2={X0 + x2}
                y2={Y0 - y2}
              />
            ))}
          </g>
          <g fill="none" stroke={COLORS.blue} strokeWidth={2.25}>
            <polygon points={big.front} />
            <polygon points={big.top} />
            <polygon points={big.side} />
          </g>
          {/* the cube of side 1, for comparison */}
          <g
            fill="none"
            stroke={COLORS.orange}
            strokeWidth={2.25}
            strokeDasharray="5 4"
          >
            <polygon points={unit.front} />
            <polygon points={unit.top} />
            <polygon points={unit.side} />
          </g>
        </g>
      </svg>
    </Interactive>
  );
}
