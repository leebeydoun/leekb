"use client";

/**
 * A large unit circle with a slider for an angle x from 0 to 2π. The arc from E₁ = (1, 0) round to
 * the point turned by x radians is drawn in orange, with a tick at each whole radian along it, so
 * the reader can count how many radius lengths the arc holds. The quarter turns π/2, π, 3π/2 and 2π
 * are marked round the outside, and the readout gives x in radians and degrees and the length of
 * the arc in radii.
 */

import { useState } from "react";
import { Button, COLORS, format, Interactive, Slider, useSmooth } from "./kit";

const SIZE = 440;
const C = SIZE / 2;
// the radius of the unit circle, in pixels
const R = 155;
const TAU = 2 * Math.PI;

// the screen position of the point at distance r (in radii) from O, turned by a radians
const at = (a: number, r = 1) => ({
  x: C + r * R * Math.cos(a),
  y: C - r * R * Math.sin(a),
});

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  strokeLinejoin: "round" as const,
  paintOrder: "stroke" as const,
};

// the angles with buttons, and how each is written
const NAMED = [
  { value: 1, name: "1", degrees: "≈ 57.3°" },
  { value: Math.PI / 2, name: "π/2", degrees: "= 90°" },
  { value: Math.PI, name: "π", degrees: "= 180°" },
  { value: (3 * Math.PI) / 2, name: "3π/2", degrees: "= 270°" },
  { value: TAU, name: "2π", degrees: "= 360°" },
];

// the quarter-turn marks round the outside of the circle, with where each label sits
const QUARTERS = [
  { a: Math.PI / 2, name: "π/2", dx: 0, dy: -8, anchor: "middle" },
  { a: Math.PI, name: "π", dx: -8, dy: -8, anchor: "end" },
  { a: (3 * Math.PI) / 2, name: "3π/2", dx: 0, dy: 20, anchor: "middle" },
  { a: TAU, name: "2π", dx: 8, dy: -8, anchor: "start" },
] as const;

/** the arc of the unit circle from angle 0 to angle x, as a path of short straight pieces */
function arcPath(x: number) {
  const steps = Math.max(2, Math.ceil(x * 40));
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const p = at((x * i) / steps);
    d += `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)} `;
  }
  return d;
}

export function RadianWrap({
  x: start = 1.5,
  caption = "Move the slider to turn the radius from E₁. The orange arc is the distance the end of the radius travels, and each tick along it marks one more radius length, so the number of radii in the arc is the angle in radians.",
}: {
  /** the angle the diagram starts at, in radians */
  x?: number;
  caption?: string;
}) {
  const [x, setX] = useState(start);
  const shown = useSmooth(x);
  const end = at(shown);
  const e1 = at(0);

  const named = NAMED.find((n) => Math.abs(n.value - x) < 1e-9);
  const radii = named?.value === 1 ? "1 radius" : `${format(x)} radii`;
  const angle = named
    ? `x = ${named.name}${named.value === 1 ? " radian" : ` ≈ ${format(x)} radians`} ${named.degrees}`
    : `x = ${format(x)} ${x === 1 ? "radian" : "radians"} ≈ ${format((x * 180) / Math.PI, 1)}°`;
  const whole = Math.floor(x + 1e-9);
  const left = x - whole;
  const fit = `${whole} whole ${whole === 1 ? "radius fits" : "radii fit"} along the arc`;
  const count =
    whole === 0
      ? "Less than one radius of arc so far."
      : left < 0.005
        ? `${fit}, with nothing left over.`
        : `${fit}, with ${format(left)} of a radius left over.`;

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>
            {angle}; the arc is {radii} long
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {count}
          </div>
        </>
      }
      controls={
        <>
          <Slider
            label={
              <>
                angle <i>x</i> in radians
              </>
            }
            value={x}
            onChange={setX}
            min={0}
            max={TAU}
            step={0.01}
          />
          <div className="flex flex-wrap justify-center gap-2">
            {NAMED.map((n) => (
              <Button key={n.name} onClick={() => setX(n.value)}>
                {n.name}
              </Button>
            ))}
          </div>
        </>
      }
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="mx-auto block h-auto w-full max-w-md text-fd-foreground"
        role="img"
        aria-label={`The unit circle, with an arc from E₁ of length ${format(x)}, which is the angle ${format(x)} radians, about ${format((x * 180) / Math.PI, 1)} degrees.`}
      >
        {/* axes */}
        <g className="text-fd-border" stroke="currentColor" strokeWidth={1.5}>
          <line x1={C - 1.35 * R} x2={C + 1.35 * R} y1={C} y2={C} />
          <line x1={C} x2={C} y1={C - 1.35 * R} y2={C + 1.35 * R} />
        </g>

        {/* the unit circle */}
        <circle
          cx={C}
          cy={C}
          r={R}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={2}
        />

        {/* the quarter turns, marked across the circle and named outside it */}
        {QUARTERS.map((q) => {
          const inner = at(q.a, 0.93);
          const outer = at(q.a, 1.07);
          const label = at(q.a, 1.07);
          return (
            <g key={q.name}>
              <line
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke="currentColor"
                strokeWidth={2}
              />
              <text
                x={label.x + q.dx}
                y={label.y + q.dy}
                textAnchor={q.anchor}
                fontSize={15}
                fontWeight={600}
                fill="currentColor"
                {...halo}
              >
                {q.name}
              </text>
            </g>
          );
        })}

        {/* the arc, from E₁ round to the turned point */}
        {shown > 0.005 && (
          <path
            d={arcPath(shown)}
            fill="none"
            stroke={COLORS.orange}
            strokeWidth={6}
            strokeLinecap="round"
          />
        )}

        {/* a tick at each whole radian: bold once the arc reaches it, faint until then */}
        {[1, 2, 3, 4, 5, 6].map((k) => {
          const reached = k <= shown + 1e-9;
          const inner = at(k, 0.9);
          const outer = at(k, 1.1);
          return (
            <line
              key={k}
              opacity={reached ? 1 : 0.3}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke={reached ? COLORS.orange : "currentColor"}
              strokeWidth={3}
            />
          );
        })}

        {/* the two radii: to E₁, and to the turned point */}
        <line
          x1={C}
          y1={C}
          x2={e1.x}
          y2={e1.y}
          stroke={COLORS.blue}
          strokeWidth={3}
        />
        <line
          x1={C}
          y1={C}
          x2={end.x}
          y2={end.y}
          stroke={COLORS.blue}
          strokeWidth={3}
        />
        <text
          x={C + R / 2}
          y={C + 20}
          textAnchor="middle"
          fontSize={14}
          fontWeight={600}
          fill={COLORS.blue}
          {...halo}
        >
          1
        </text>

        {/* the number of each whole-radian tick, drawn over the radii so it stays readable */}
        {[1, 2, 3, 4, 5, 6].map((k) => {
          const reached = k <= shown + 1e-9;
          const label = at(k, 0.78);
          return (
            <text
              key={k}
              opacity={reached ? 1 : 0.3}
              x={label.x}
              y={label.y + 5}
              textAnchor="middle"
              fontSize={14}
              fontWeight={700}
              fill={reached ? COLORS.orange : "currentColor"}
              {...halo}
            >
              {k}
            </text>
          );
        })}

        <circle cx={C} cy={C} r={4} fill="currentColor" />
        <text
          x={C - 8}
          y={C + 18}
          textAnchor="end"
          fontSize={14}
          fontWeight={700}
          fill="currentColor"
          {...halo}
        >
          O
        </text>
        <circle cx={e1.x} cy={e1.y} r={5} fill={COLORS.blue} />
        <text
          x={e1.x + 8}
          y={e1.y + 20}
          fontSize={14}
          fontWeight={700}
          fill={COLORS.blue}
          {...halo}
        >
          E₁
        </text>
        <circle
          cx={end.x}
          cy={end.y}
          r={7}
          fill={COLORS.orange}
          stroke="var(--color-fd-card)"
          strokeWidth={2}
        />
      </svg>
    </Interactive>
  );
}
