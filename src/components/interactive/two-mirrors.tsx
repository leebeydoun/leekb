"use client";

/**
 * Two mirrors crossing at O. The slider sets the angle θ from the first mirror L to the second
 * mirror K. A point P is flipped in L to P', and P' is flipped in K to P''. Wherever K is, P'' is
 * the same distance from O as P, turned anticlockwise by 2θ: two crossing flips make a turn by twice
 * the angle between the mirrors.
 */

import { useState } from "react";
import { COLORS, Interactive, Slider, format } from "./kit";

const UNIT = 52;
const PAD = 20;
const SIZE = 3.3;
const WIDTH = 2 * SIZE * UNIT + PAD * 2;
// P sits a little below the first mirror, so its flip lands a little above it
const RADIUS = 2.5;
const START = -25;

type Vec = { x: number; y: number };

const px = (p: Vec): Vec => ({
  x: PAD + (p.x + SIZE) * UNIT,
  y: PAD + (SIZE - p.y) * UNIT,
});

const polar = (degrees: number, r: number): Vec => ({
  x: r * Math.cos((degrees * Math.PI) / 180),
  y: r * Math.sin((degrees * Math.PI) / 180),
});

/** an arc about O, anticlockwise from one angle to another, in degrees */
function arc(from: number, to: number, r: number) {
  const a = px(polar(from, r));
  const b = px(polar(to, r));
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  const sweep = to > from ? 0 : 1;
  return `M ${a.x} ${a.y} A ${r * UNIT} ${r * UNIT} 0 ${large} ${sweep} ${b.x} ${b.y}`;
}

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

function Mirror({ angle, name }: { angle: number; name: string }) {
  const a = px(polar(angle, -SIZE * 1.2));
  const b = px(polar(angle, SIZE * 1.2));
  const label = px(polar(angle, SIZE * 0.92));
  return (
    <g>
      <line
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke={COLORS.blue}
        strokeWidth={5}
        strokeOpacity={0.35}
        strokeLinecap="round"
      />
      <text
        x={label.x}
        y={label.y - 10}
        textAnchor="middle"
        fontSize={17}
        fontStyle="italic"
        fill={COLORS.blue}
        {...halo}
      >
        {name}
      </text>
    </g>
  );
}

function Dot({
  at,
  name,
  color = "currentColor",
  dx = 14,
  dy = 0,
}: {
  at: Vec;
  name: string;
  color?: string;
  dx?: number;
  dy?: number;
}) {
  const p = px(at);
  return (
    <g>
      <circle cx={p.x} cy={p.y} r={5} fill={color} />
      <text
        x={p.x + dx}
        y={p.y + dy + 6}
        textAnchor="middle"
        fontSize={17}
        fontStyle="italic"
        fill={color}
        {...halo}
      >
        {name}
      </text>
    </g>
  );
}

export function TwoMirrors() {
  const [theta, setTheta] = useState(40);

  const P = polar(START, RADIUS);
  // flipping in L (along the angle 0) sends the angle a to −a; flipping in K sends a to 2θ − a
  const first = polar(-START, RADIUS);
  const second = polar(2 * theta + START, RADIUS);
  const o = px({ x: 0, y: 0 });

  // where each name sits: straight out from O, past the dot
  const out = (degrees: number) => {
    const d = polar(degrees, 1);
    return { dx: d.x * 18, dy: -d.y * 18 };
  };

  return (
    <Interactive
      readout={
        <>
          <div>
            The mirrors meet at {format(theta)}°, and P has turned{" "}
            {format(2 * theta)}° about O
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {theta === 0
              ? "The two mirrors are the same line, so the second flip undoes the first and P comes back to itself."
              : theta === 90
                ? "Mirrors square to each other make a half turn, which sends P to the opposite side of O."
                : "Flipping in L and then in K is a turn about O by twice the angle between them."}
          </div>
        </>
      }
      controls={
        <Slider
          label={
            <>
              angle from <i>L</i> to <i>K</i>
            </>
          }
          value={theta}
          onChange={setTheta}
          min={0}
          max={90}
          step={5}
          show={(v) => `${v}°`}
        />
      }
      caption="P is flipped in the mirror L to P′, and then in the mirror K to P″. The purple arc shows the turn from P to P″, which is always twice the angle from L to K."
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${WIDTH}`}
        className="mx-auto block h-auto w-full max-w-sm text-fd-foreground"
        role="img"
        aria-label={`Two mirrors through O at an angle of ${theta} degrees. Flipping P in both turns it by ${2 * theta} degrees about O.`}
      >
        {/* the circle every image stays on, since flips in lines through O keep the distance from O */}
        <circle
          cx={o.x}
          cy={o.y}
          r={RADIUS * UNIT}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.15}
          strokeWidth={1.5}
        />

        <Mirror angle={0} name="L" />
        <Mirror angle={theta} name="K" />

        {/* the angle between the mirrors, and the turn it makes */}
        {theta > 0 && (
          <path
            d={arc(0, theta, 0.75)}
            fill="none"
            stroke={COLORS.blue}
            strokeWidth={2}
          />
        )}
        {theta > 0 && (
          <path
            d={arc(START, START + 2 * theta, RADIUS + 0.35)}
            fill="none"
            stroke={COLORS.purple}
            strokeWidth={2.5}
            strokeDasharray="7 5"
          />
        )}

        {/* each flip moves a point straight across its mirror */}
        <g
          stroke="currentColor"
          strokeOpacity={0.5}
          strokeWidth={1.5}
          strokeDasharray="5 4"
        >
          <line x1={px(P).x} y1={px(P).y} x2={px(first).x} y2={px(first).y} />
          <line
            x1={px(first).x}
            y1={px(first).y}
            x2={px(second).x}
            y2={px(second).y}
          />
        </g>

        <Dot at={P} name="P" {...out(START)} />
        <Dot at={first} name="P′" color={COLORS.orange} {...out(-START)} />
        {/* at 0° the second flip undoes the first, and P″ is P itself */}
        {theta > 0 && (
          <Dot
            at={second}
            name="P″"
            color={COLORS.purple}
            {...out(START + 2 * theta)}
          />
        )}
        <circle cx={o.x} cy={o.y} r={4.5} fill="currentColor" />
        <text
          x={o.x - 12}
          y={o.y + 22}
          fontSize={17}
          fontStyle="italic"
          fill="currentColor"
          {...halo}
        >
          O
        </text>
      </svg>
    </Interactive>
  );
}
