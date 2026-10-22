"use client";

/**
 * Lines on a globe, drawn as a sphere seen from a little above its equator. GreatCircles tilts a
 * great circle away from the equator with a slider: however small the tilt, the two still cross at
 * two opposite points. GlobeTriangle shows a triangle on the globe with three right angles.
 */

import { useState } from "react";
import { COLORS, Interactive, Slider, useSmooth } from "./kit";

const SIZE = 320;
const CENTRE = SIZE / 2;
const RADIUS = 120;

type Vec3 = [number, number, number];
const radians = (degrees: number) => (degrees * Math.PI) / 180;

/**
 * The view looks at the globe from in front (the side where y < 0), raised by `elevation` degrees
 * above the equator, so the equator is seen as a flattened ellipse and the north pole is in view.
 */
function view(elevation: number) {
  const e = radians(elevation);
  return {
    // a point of the sphere as seen on the screen
    at: ([x, y, z]: Vec3) => ({
      x: CENTRE + RADIUS * x,
      y: CENTRE - RADIUS * (y * Math.sin(e) + z * Math.cos(e)),
    }),
    // whether a point is on the side of the globe facing the viewer
    front: ([, y, z]: Vec3) => -y * Math.cos(e) + z * Math.sin(e) >= -1e-9,
  };
}

/** a point at a latitude and longitude, both in degrees */
const onGlobe = (latitude: number, longitude: number): Vec3 => [
  Math.cos(radians(latitude)) * Math.cos(radians(longitude)),
  Math.cos(radians(latitude)) * Math.sin(radians(longitude)),
  Math.sin(radians(latitude)),
];

/**
 * A curve on the globe, given by a function of t from 0 to 1, split into the parts in front of the
 * globe and the parts behind it, as svg paths.
 */
function curve(
  point: (t: number) => Vec3,
  { at, front }: ReturnType<typeof view>,
  steps = 240,
) {
  const parts = { front: "", back: "" };
  let previous: boolean | null = null;
  for (let i = 0; i <= steps; i++) {
    const p = point(i / steps);
    const side = front(p) ? "front" : "back";
    const { x, y } = at(p);
    const move = previous === null || previous !== front(p) ? "M" : "L";
    // when the curve goes round the edge, start the new part where the old one stopped
    if (move === "M" && previous !== null) {
      const q = at(point((i - 1) / steps));
      parts[side] += `M ${q.x} ${q.y} L ${x} ${y} `;
    } else parts[side] += `${move} ${x} ${y} `;
    previous = front(p);
  }
  return parts;
}

/** a curve drawn solid in front of the globe and faint and dashed behind it */
function Curve({
  parts,
  color,
  width = 2,
  dashed = false,
}: {
  parts: { front: string; back: string };
  color: string;
  width?: number;
  dashed?: boolean;
}) {
  return (
    <>
      <path
        d={parts.back}
        fill="none"
        stroke={color}
        strokeWidth={width * 0.75}
        strokeOpacity={0.35}
        strokeDasharray="4 4"
      />
      <path
        d={parts.front}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeDasharray={dashed ? "7 5" : undefined}
        strokeLinecap="round"
      />
    </>
  );
}

function Label({
  x,
  y,
  children,
  color = "currentColor",
}: {
  x: number;
  y: number;
  children: string;
  color?: string;
}) {
  return (
    <text
      x={x}
      y={y + 5}
      textAnchor="middle"
      fontSize={14}
      fill={color}
      stroke="var(--color-fd-card)"
      strokeWidth={4}
      strokeLinejoin="round"
      paintOrder="stroke"
    >
      {children}
    </text>
  );
}

const Outline = () => (
  <circle
    cx={CENTRE}
    cy={CENTRE}
    r={RADIUS}
    fill="currentColor"
    fillOpacity={0.04}
    stroke="currentColor"
    strokeOpacity={0.5}
    strokeWidth={1.5}
  />
);

/** where the tilted great circle crosses the equator, in degrees of longitude */
const CROSSING = -60;
const LATITUDE = 40;

/** A great circle tilted away from the equator by a slider: it always crosses the equator twice. */
export function GreatCircles({ tilt: initial = 30 }: { tilt?: number }) {
  const [tilt, setTilt] = useState(initial);
  const shown = useSmooth(tilt);
  const v = view(20);

  // the tilted circle turns about the line through its two crossing points with the equator
  const c = radians(CROSSING);
  const s = radians(shown);
  const a: Vec3 = [Math.cos(c), Math.sin(c), 0];
  const b: Vec3 = [
    -Math.sin(c) * Math.cos(s),
    Math.cos(c) * Math.cos(s),
    Math.sin(s),
  ];
  const tilted = (t: number): Vec3 => {
    const angle = 2 * Math.PI * t;
    const [ca, sa] = [Math.cos(angle), Math.sin(angle)];
    return [
      a[0] * ca + b[0] * sa,
      a[1] * ca + b[1] * sa,
      a[2] * ca + b[2] * sa,
    ];
  };
  const near = v.at(a);
  const far = v.at([-a[0], -a[1], 0]);

  return (
    <Interactive
      readout={`Tilted ${Math.round(tilt)}° from the equator, the blue great circle still crosses it at two opposite points`}
      controls={
        <Slider
          label="tilt"
          value={tilt}
          onChange={setTilt}
          min={2}
          max={90}
          show={(n) => `${n}°`}
        />
      }
      caption="The black circle is the equator. Solid lines are on the near side of the globe, faint ones on the far side. The dashed green circle of latitude never meets the equator, but it is not a great circle."
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="mx-auto block h-auto w-full max-w-80 text-fd-foreground"
        role="img"
        aria-label={`A globe with its equator and a great circle tilted ${Math.round(tilt)} degrees from it, crossing it at two opposite points`}
      >
        <Outline />
        <Curve
          parts={curve((t) => onGlobe(LATITUDE, 360 * t), v)}
          color={COLORS.green}
          width={1.75}
          dashed
        />
        <Curve
          parts={curve((t) => onGlobe(0, 360 * t), v)}
          color="currentColor"
        />
        <Curve parts={curve(tilted, v)} color={COLORS.blue} width={2.5} />
        <circle
          cx={far.x}
          cy={far.y}
          r={4}
          fill="var(--color-fd-card)"
          stroke={COLORS.orange}
          strokeWidth={2}
        />
        <circle cx={near.x} cy={near.y} r={4.5} fill={COLORS.orange} />
      </svg>
    </Interactive>
  );
}

/** A triangle on the globe, from the north pole down two lines of longitude a quarter turn apart. */
export function GlobeTriangle() {
  const v = view(28);
  const west = -140;
  const east = -50;
  const pole = v.at([0, 0, 1]);
  const A = v.at(onGlobe(0, west));
  const B = v.at(onGlobe(0, east));
  const edge = (from: (t: number) => Vec3) =>
    Array.from({ length: 61 }, (_, i) => v.at(from(i / 60)));
  // round the triangle: along the equator from A to B, up to the pole, and down to A
  const outline = [
    ...edge((t) => onGlobe(0, west + (east - west) * t)),
    ...edge((t) => onGlobe(90 * t, east)),
    ...edge((t) => onGlobe(90 - 90 * t, west)),
  ];
  const shape = outline.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <Interactive caption="On a globe, this triangle has a right angle at each of its three corners, so its angles add up to 270°">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="mx-auto block h-auto w-full max-w-80 text-fd-foreground"
        role="img"
        aria-label="A triangle on a globe with corners at the north pole and two points on the equator a quarter turn apart, with three right angles"
      >
        <Outline />
        <polygon points={shape} fill={COLORS.blue} fillOpacity={0.22} />
        <Curve
          parts={curve((t) => onGlobe(0, 360 * t), v)}
          color="currentColor"
        />
        <Curve
          parts={curve((t) => onGlobe(90 * t, west), v)}
          color={COLORS.blue}
          width={2.5}
        />
        <Curve
          parts={curve((t) => onGlobe(90 * t, east), v)}
          color={COLORS.blue}
          width={2.5}
        />
        {[pole, A, B].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill="currentColor" />
        ))}
        <Label x={pole.x} y={pole.y - 16}>
          North pole
        </Label>
        <Label x={A.x - 12} y={A.y + 16}>
          A
        </Label>
        <Label x={B.x + 12} y={B.y + 16}>
          B
        </Label>
        <Label x={pole.x + 2} y={pole.y + 26} color={COLORS.orange}>
          90°
        </Label>
        <Label x={A.x + 20} y={A.y - 18} color={COLORS.orange}>
          90°
        </Label>
        <Label x={B.x - 20} y={B.y - 18} color={COLORS.orange}>
          90°
        </Label>
      </svg>
    </Interactive>
  );
}
