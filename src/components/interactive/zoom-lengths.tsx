"use client";

/**
 * A house shape zoomed about a point O, like a photo enlarged on a phone. One slider sets the
 * scale factor r. The readout follows four lengths at once: a wall, a slope of the roof, a diagonal
 * across the front, and the whole perimeter. Every one of them is multiplied by the same r.
 */

import { useState } from "react";
import { COLORS, Interactive, Slider, format, useSmooth } from "./kit";
import { Dot, Flag, distance, planeScale, type Vec } from "./moving-shape";

const O: Vec = { x: 0, y: 0 };
// chosen so the lengths come out tidy: width 1.6, walls 1.2, roof slopes 1, diagonal 2
const HOUSE: Vec[] = [
  { x: 0.4, y: 0.3 },
  { x: 2, y: 0.3 },
  { x: 2, y: 1.5 },
  { x: 1.2, y: 2.1 },
  { x: 0.4, y: 1.5 },
];
const [A, B, C, D] = HOUSE as [Vec, Vec, Vec, Vec, Vec];

const zoom = (p: Vec, r: number): Vec => ({ x: r * p.x, y: r * p.y });

const perimeter = (corners: Vec[]) =>
  corners.reduce(
    (total, p, i) => total + distance(p, corners[(i + 1) % corners.length]!),
    0,
  );

export function ZoomLengths() {
  const [r, setR] = useState(1.5);
  const shown = useSmooth(r);
  const { width, height, px } = planeScale(-0.4, 4.3, -0.4, 4.5, 56);

  const lengths: [string, number][] = [
    ["wall", distance(B, C)],
    ["roof slope", distance(C, D)],
    ["diagonal", distance(A, C)],
    ["perimeter", perimeter(HOUSE)],
  ];
  const now = HOUSE.map((p) => zoom(p, shown));
  const a = px(zoom(A, shown));
  const c = px(zoom(C, shown));

  return (
    <Interactive
      readout={
        <>
          <div className="mx-auto grid w-fit grid-cols-2 gap-x-6 gap-y-1 text-left tabular-nums">
            {lengths.map(([name, before]) => (
              <span key={name}>
                {name} {format(before)} → {format(r * before)}
              </span>
            ))}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {r === 1
              ? "A zoom by 1 moves nothing, so no length changes."
              : `Every length is multiplied by ${format(r)}, so the house keeps its shape.`}
          </div>
        </>
      }
      controls={
        <Slider
          label={
            <>
              scale factor <i>r</i>
            </>
          }
          value={r}
          onChange={setR}
          min={0.5}
          max={2}
          step={0.25}
        />
      }
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto block h-auto w-full max-w-sm text-fd-foreground"
        role="img"
        aria-label={`A house shape zoomed by ${format(r)} about the point O. Its wall, roof slope, diagonal and perimeter are all multiplied by ${format(r)}.`}
      >
        {/* the rays from O through each corner: every corner slides out along its own ray */}
        <g
          stroke="currentColor"
          strokeOpacity={0.2}
          strokeWidth={1.25}
          strokeDasharray="4 5"
        >
          {HOUSE.map((p, i) => {
            const end = px(zoom(p, 2.05));
            return (
              <line key={i} x1={px(O).x} y1={px(O).y} x2={end.x} y2={end.y} />
            );
          })}
        </g>
        <Flag corners={HOUSE} px={px} color={COLORS.blue} faint />
        <Flag corners={now} px={px} color={COLORS.blue} />
        {/* the diagonal across the front, one of the lengths the readout follows */}
        <line
          x1={a.x}
          y1={a.y}
          x2={c.x}
          y2={c.y}
          stroke={COLORS.orange}
          strokeWidth={2.5}
          strokeDasharray="6 4"
          strokeLinecap="round"
        />
        {/* the roof slope, drawn over the outline so it stands out */}
        <line
          x1={c.x}
          y1={c.y}
          x2={px(zoom(D, shown)).x}
          y2={px(zoom(D, shown)).y}
          stroke={COLORS.purple}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
        <Dot at={px(O)} name="O" dx={-12} dy={12} />
      </svg>
    </Interactive>
  );
}
