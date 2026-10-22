"use client";

/**
 * A disc of radius r beside its "radius square", the square whose side is the radius. A slider
 * changes r. The disc and the square both grow by r squared, so the disc always holds the same
 * number of radius squares: a little more than 3, the number called pi.
 */

import { useState } from "react";
import { COLORS, Interactive, Slider, format, useSmooth } from "./kit";
import { Dot, planeScale } from "./moving-shape";

const MAX = 3;

export function DiscZoom() {
  const [r, setR] = useState(2);
  const shown = useSmooth(r);
  const { width, height, unit, px } = planeScale(
    -MAX - 0.3,
    MAX + 0.3,
    -MAX - 0.3,
    MAX + 0.3,
    42,
  );
  const o = px({ x: 0, y: 0 });
  const corner = px({ x: -shown, y: shown });
  const side = 2 * shown * unit;

  return (
    <Interactive
      readout={
        <>
          <div>
            Radius square: {format(r)} × {format(r)} = {format(r * r)}. Disc:
            about {format(Math.PI * r * r)}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            The disc holds {format(Math.PI, 4)} radius squares, whatever the
            radius. The outer square holds exactly 4.
          </div>
        </>
      }
      controls={
        <Slider
          label={
            <>
              radius <i>r</i>
            </>
          }
          value={r}
          onChange={setR}
          min={0.5}
          max={MAX}
          step={0.25}
        />
      }
      caption="The orange radius square has side r. Four of them make the dashed square around the disc, and the disc takes up a little more than three."
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto block h-auto w-full max-w-sm text-fd-foreground"
        role="img"
        aria-label={`A disc of radius ${format(r)} inside a square made of four radius squares. The disc has area about ${format(Math.PI * r * r)}, which is pi times the radius square's area ${format(r * r)}.`}
      >
        {/* the square around the disc, made of four radius squares */}
        <g
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.45}
          strokeWidth={1.5}
          strokeDasharray="6 5"
        >
          <rect x={corner.x} y={corner.y} width={side} height={side} />
          <line x1={o.x} y1={corner.y} x2={o.x} y2={corner.y + side} />
          <line x1={corner.x} y1={o.y} x2={corner.x + side} y2={o.y} />
        </g>

        <circle
          cx={o.x}
          cy={o.y}
          r={shown * unit}
          fill={COLORS.blue}
          fillOpacity={0.18}
          stroke={COLORS.blue}
          strokeWidth={2.5}
        />

        {/* one radius square, in the top right quarter */}
        <rect
          x={o.x}
          y={o.y - shown * unit}
          width={shown * unit}
          height={shown * unit}
          fill={COLORS.orange}
          fillOpacity={0.25}
          stroke={COLORS.orange}
          strokeWidth={2.5}
        />

        {/* the radius, along the bottom of the radius square */}
        <text
          x={o.x + (shown * unit) / 2}
          y={o.y + 20}
          textAnchor="middle"
          fontSize={16}
          fontStyle="italic"
          fill={COLORS.orange}
          stroke="var(--color-fd-card)"
          strokeWidth={4}
          paintOrder="stroke"
        >
          r
        </text>
        <Dot at={o} name="O" dx={-12} dy={12} />
      </svg>
    </Interactive>
  );
}
