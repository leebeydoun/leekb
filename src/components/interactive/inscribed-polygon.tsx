"use client";

/**
 * A regular polygon inside a circle of radius 1, with one slider for the number of sides. One
 * slice is picked out, with its height. The readout compares the polygon with the circle twice:
 * its perimeter divided by the diameter, and its area divided by r². Both creep up towards the
 * same number, π.
 */

import { useState } from "react";
import { COLORS, Interactive, Slider, format } from "./kit";
import { Dot, planeScale, polygonPoints, type Vec } from "./moving-shape";

const R = 1;
const { width, height, unit, px } = planeScale(-1.15, 1.15, -1.15, 1.15, 120);

const corner = (i: number, n: number): Vec => {
  // the first corner straight to the right, the rest anticlockwise
  const a = (2 * Math.PI * i) / n;
  return { x: R * Math.cos(a), y: R * Math.sin(a) };
};

export function InscribedPolygon() {
  const [n, setN] = useState(6);

  const corners = Array.from({ length: n }, (_, i) => corner(i, n));
  const perimeter = 2 * n * R * Math.sin(Math.PI / n);
  const area = (n / 2) * R * R * Math.sin((2 * Math.PI) / n);
  const h = R * Math.cos(Math.PI / n);

  // the picked-out slice, between the first two corners, and the foot of its height
  const A = corners[0]!;
  const B = corners[1]!;
  const M = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
  const O = { x: 0, y: 0 };
  const o = px(O);

  return (
    <Interactive
      readout={
        <>
          <div>
            perimeter ÷ diameter = {format(perimeter / (2 * R), 4)}, area ÷ r² ={" "}
            {format(area / (R * R), 4)}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {`With ${n} sides, the slice height is ${format(h, 4)} of the radius. Both numbers are a little below π = 3.1416, and climb towards it as the sides get shorter.`}
          </div>
        </>
      }
      controls={
        <Slider
          label={
            <>
              sides <i>n</i>
            </>
          }
          value={n}
          onChange={setN}
          min={3}
          max={60}
          step={1}
          show={(v) => String(v)}
        />
      }
      caption="Add sides with the slider. The polygon hugs the circle more closely, its perimeter approaches the circumference, and its area approaches the area of the disc."
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto block h-auto w-full max-w-xs text-fd-foreground"
        role="img"
        aria-label={`A regular polygon with ${n} sides inside a circle of radius 1. Its perimeter divided by the diameter is ${format(perimeter / 2, 4)}, and its area is ${format(area, 4)}.`}
      >
        <circle
          cx={o.x}
          cy={o.y}
          r={R * unit}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.45}
          strokeWidth={2}
        />
        <polygon
          points={polygonPoints(corners, px)}
          fill={COLORS.blue}
          fillOpacity={0.15}
          stroke={COLORS.blue}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        {/* the picked-out slice and its height */}
        <polygon
          points={polygonPoints([O, A, B], px)}
          fill={COLORS.orange}
          fillOpacity={0.3}
          stroke={COLORS.orange}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <line
          x1={o.x}
          y1={o.y}
          x2={px(M).x}
          y2={px(M).y}
          stroke={COLORS.purple}
          strokeWidth={2.5}
          strokeDasharray="5 4"
        />
        <Dot at={o} name="O" dx={-14} dy={14} />
      </svg>
    </Interactive>
  );
}
