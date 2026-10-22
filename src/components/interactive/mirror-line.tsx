"use client";

/**
 * A flag and its reflection in a mirror line through the middle of the picture. One slider tilts
 * the mirror. Dashed segments join three points of the flag to their images, and each one crosses
 * the mirror at its midpoint and square on: the mirror is the perpendicular bisector of every
 * segment from a point to its image. The readout gives the distance from the flag's tip to the
 * mirror, and from the tip's image, which are always the same.
 */

import { useState } from "react";
import { COLORS, Interactive, Slider, format, useSmooth } from "./kit";

const UNIT = 46;
// everything stays within this distance of the centre, so nothing leaves the frame as the mirror
// turns: a reflection keeps every point's distance from a point of the mirror
const REACH = 3.4;
const PAD = 22;
const SIZE = 2 * REACH * UNIT + PAD * 2;

type Vec = { x: number; y: number };

const px = (p: Vec): Vec => ({
  x: PAD + (p.x + REACH) * UNIT,
  y: PAD + (REACH - p.y) * UNIT,
});

/** the flag: a pole from (-2.4, -1.6) up to (-2.4, 1.6), with a pennant pointing right */
const BASE: Vec = { x: -2.4, y: -1.6 };
const TOP: Vec = { x: -2.4, y: 1.6 };
const TIP: Vec = { x: -0.9, y: 1.05 };
const LOW: Vec = { x: -2.4, y: 0.5 };

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

export function MirrorLine() {
  const [tilt, setTilt] = useState(0);
  const shown = useSmooth(tilt);

  // the mirror runs through the centre; a tilt of 0 is upright, positive leans to the right
  const angle = ((90 - shown) * Math.PI) / 180;
  const along = { x: Math.cos(angle), y: Math.sin(angle) };
  // the image of p: keep its part along the mirror, reverse its part across it
  const reflect = (p: Vec): Vec => {
    const k = p.x * along.x + p.y * along.y;
    return { x: 2 * k * along.x - p.x, y: 2 * k * along.y - p.y };
  };
  // how far p is from the mirror (the size of its part across it)
  const away = (p: Vec) => Math.abs(p.x * along.y - p.y * along.x);

  const flag = (points: Vec[]) =>
    points.map((p) => `${px(p).x},${px(p).y}`).join(" ");
  const pole = (a: Vec, b: Vec, color: string, opacity = 1) => (
    <line
      x1={px(a).x}
      y1={px(a).y}
      x2={px(b).x}
      y2={px(b).y}
      stroke={color}
      strokeOpacity={opacity}
      strokeWidth={3}
      strokeLinecap="round"
    />
  );

  const ends = [-REACH * 1.2, REACH * 1.2].map((t) =>
    px({ x: along.x * t, y: along.y * t }),
  );
  const marked = [TIP, TOP, BASE];
  const tipImage = reflect(TIP);
  const label = (p: Vec, text: string, color: string, dx = 0, dy = -12) => (
    <text
      x={px(p).x + dx}
      y={px(p).y + dy}
      textAnchor="middle"
      fontSize={16}
      fontStyle="italic"
      fill={color}
      {...halo}
    >
      {text}
    </text>
  );

  return (
    <Interactive
      readout={
        <>
          <div>
            The tip <i>A</i> is {format(away(TIP))} from the mirror, and its
            image <i>A′</i> is {format(away(tipImage))} from it
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            Each dashed segment crosses the mirror at its midpoint, square on.
          </div>
        </>
      }
      controls={
        <Slider
          label="Tilt of the mirror"
          value={tilt}
          onChange={setTilt}
          min={-60}
          max={60}
          step={5}
          show={(v) => `${format(v)}°`}
        />
      }
      caption="Tilt the mirror. The image of every point is as far behind the mirror as the point is in front of it."
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="mx-auto block h-auto w-full max-w-sm text-fd-foreground"
        role="img"
        aria-label={`A flag and its reflection in a mirror line tilted by ${format(tilt)} degrees`}
      >
        {/* the mirror */}
        <line
          x1={ends[0]!.x}
          y1={ends[0]!.y}
          x2={ends[1]!.x}
          y2={ends[1]!.y}
          stroke={COLORS.purple}
          strokeWidth={3}
        />

        {/* from each marked point to its image */}
        <g
          stroke="currentColor"
          strokeOpacity={0.5}
          strokeWidth={1.5}
          strokeDasharray="5 4"
        >
          {marked.map((p, i) => {
            const q = reflect(p);
            return (
              <line
                key={i}
                x1={px(p).x}
                y1={px(p).y}
                x2={px(q).x}
                y2={px(q).y}
              />
            );
          })}
        </g>
        {marked.map((p, i) => {
          const q = reflect(p);
          const mid = px({ x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 });
          return (
            <circle
              key={i}
              cx={mid.x}
              cy={mid.y}
              r={3.5}
              fill={COLORS.purple}
            />
          );
        })}

        {/* the flag, and its image */}
        <polygon
          points={flag([TOP, TIP, LOW])}
          fill={COLORS.blue}
          fillOpacity={0.35}
          stroke={COLORS.blue}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {pole(BASE, TOP, COLORS.blue)}
        <polygon
          points={flag([TOP, TIP, LOW].map(reflect))}
          fill={COLORS.orange}
          fillOpacity={0.35}
          stroke={COLORS.orange}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {pole(reflect(BASE), reflect(TOP), COLORS.orange)}

        <circle cx={px(TIP).x} cy={px(TIP).y} r={4} fill={COLORS.blue} />
        <circle
          cx={px(tipImage).x}
          cy={px(tipImage).y}
          r={4}
          fill={COLORS.orange}
        />
        {label(TIP, "A", COLORS.blue, 4, -12)}
        {label(tipImage, "A′", COLORS.orange, -4, -12)}
      </svg>
    </Interactive>
  );
}
