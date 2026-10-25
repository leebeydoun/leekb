"use client";

/**
 * The point on the unit circle. A slider sets the angle x, from a full turn clockwise to a full turn
 * anticlockwise, and buttons jump to the angles met most often. The point E₁ = (1, 0) turned by x
 * about O lands at P = (cos x, sin x). The blue segment along the x-axis is how far across P is,
 * cos x, and the orange segment up to P is how far up it is, sin x. The quadrant P is in is shaded,
 * and the readout gives both numbers and their signs.
 */

import { useState } from "react";
import { Grid, gridScale } from "./grid";
import { Button, COLORS, format, Interactive, Slider, useSmooth } from "./kit";

const RANGE: [number, number] = [-1.3, 1.3];
const TAU = 2 * Math.PI;

/** the angles the buttons jump to, with their names and sizes in degrees */
const SNAPS = [
  { name: "0", value: 0, degrees: 0 },
  { name: "π/6", value: Math.PI / 6, degrees: 30 },
  { name: "π/4", value: Math.PI / 4, degrees: 45 },
  { name: "π/3", value: Math.PI / 3, degrees: 60 },
  { name: "π/2", value: Math.PI / 2, degrees: 90 },
  { name: "π", value: Math.PI, degrees: 180 },
];

const QUADRANTS = [
  "First quadrant: cos positive, sin positive.",
  "Second quadrant: cos negative, sin positive.",
  "Third quadrant: cos negative, sin negative.",
  "Fourth quadrant: cos positive, sin negative.",
];

/** the angle in degrees, to one decimal place */
const degrees = (x: number) => `${format((x * 180) / Math.PI, 1)}°`;

/** a coordinate to two places, or to three when two would round a small number to 0 */
const coordinate = (v: number) =>
  Math.abs(v) < 0.005 && Math.abs(v) > 1e-9 ? format(v, 3) : format(v);

/** where P lies: on one of the four half-axes (0 to 3, anticlockwise from E₁), or in a quadrant */
function place(x: number) {
  const quarters = x / (Math.PI / 2);
  const whole = Math.round(quarters);
  if (Math.abs(quarters - whole) < 1e-9) return { axis: ((whole % 4) + 4) % 4 };
  const w = ((x % TAU) + TAU) % TAU;
  return { quadrant: Math.floor(w / (Math.PI / 2)) };
}

const AXES = [
  "On the positive x-axis: cos x = 1, sin x = 0.",
  "On the positive y-axis: cos x = 0, sin x = 1.",
  "On the negative x-axis: cos x = −1, sin x = 0.",
  "On the negative y-axis: cos x = 0, sin x = −1.",
];

export function UnitCircle({
  start = 2.5,
  caption = "Move the slider to turn the point E₁ = (1, 0) about O by x. It lands at P = (cos x, sin x): the blue segment is how far across P is, and the orange segment is how far up.",
}: {
  /** the angle x the diagram starts at, in radians */
  start?: number;
  caption?: string;
}) {
  const [x, setX] = useState(start);
  const shown = useSmooth(x, 400);
  const { px, py, unit } = gridScale(RANGE, RANGE);

  const c = Math.cos(shown);
  const s = Math.sin(shown);
  const o = { x: px(0), y: py(0) };
  const p = { x: px(c), y: py(s) };
  const foot = { x: px(c), y: py(0) };

  // the arc of the turn from E₁, anticlockwise for x > 0 and clockwise for x < 0
  const arcRadius = 0.26;
  const steps = Math.max(2, Math.ceil(Math.abs(shown) * 20));
  const arc = Array.from({ length: steps + 1 }, (_, i) => {
    const t = (shown * i) / steps;
    return `${px(arcRadius * Math.cos(t))},${py(arcRadius * Math.sin(t))}`;
  }).join(" ");
  // an arrowhead at the end of the arc, pointing the way the turn goes
  const dir = shown >= 0 ? 1 : -1;
  const tip = { x: px(arcRadius * c), y: py(arcRadius * s) };
  const along = { x: -s * dir, y: -c * dir }; // the direction of travel on screen
  const across = { x: c, y: -s }; // outwards from O on screen
  const head = 8;
  const arrow = `${tip.x + along.x * 2},${tip.y + along.y * 2} ${tip.x - along.x * head + across.x * 4.5},${tip.y - along.y * head + across.y * 4.5} ${tip.x - along.x * head - across.x * 4.5},${tip.y - along.y * head - across.y * 4.5}`;
  const middle = shown / 2;
  const arcLabel = {
    x: px(0.43 * Math.cos(middle)),
    y: py(0.43 * Math.sin(middle)) + 5,
  };

  // the shaded quadrant, the quarter of the picture that P is in
  const where = place(x);
  const shade =
    where.quadrant === undefined
      ? undefined
      : {
          x: [0, 3].includes(where.quadrant) ? o.x : px(RANGE[0]),
          y: [0, 1].includes(where.quadrant) ? py(RANGE[1]) : o.y,
          size: 1.3 * unit,
        };

  // labels: cos x on the far side of the x-axis from P, sin x on the far side of its segment from O
  const cosLabel = { x: (o.x + foot.x) / 2, y: o.y + (s >= 0 ? 20 : -10) };
  const sinLabel = {
    x: foot.x + (c >= 0 ? 10 : -10),
    y: (foot.y + p.y) / 2 + 5,
  };
  const pLabel = { x: px(1.13 * c), y: py(1.13 * s) + 5 };

  const halo = {
    stroke: "var(--color-fd-card)",
    strokeWidth: 4,
    strokeLinejoin: "round" as const,
    paintOrder: "stroke" as const,
  };

  const snap = SNAPS.find((a) => Math.abs(a.value - x) < 1e-9);
  const name = snap
    ? snap.name === "0"
      ? "x = 0 (0°)"
      : `x = ${snap.name} ≈ ${format(x)} (${snap.degrees}°)`
    : `x = ${format(x)} (${degrees(x)})`;

  const cosText = coordinate(Math.cos(x));
  const sinText = coordinate(Math.sin(x));
  const position =
    where.axis !== undefined ? AXES[where.axis] : QUADRANTS[where.quadrant];

  let turnNote: string | undefined;
  if (x < 0)
    turnNote = `A negative x turns clockwise. P is the same point as for x + 2π = ${format(x + TAU)} (${degrees(x + TAU)}).`;
  else if (x >= TAU - 0.05)
    turnNote = `Nearly a full turn: P is close to where it started, at E₁.`;

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>
            {name}: cos x = {cosText}, sin x = {sinText}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {position}
            {turnNote && ` ${turnNote}`}
          </div>
        </>
      }
      controls={
        <>
          <Slider
            label="angle x"
            value={x}
            onChange={setX}
            min={-6.28}
            max={6.28}
            step={0.01}
            show={(v) => `${format(v)} (${degrees(v)})`}
          />
          <div className="flex flex-wrap justify-center gap-2">
            {SNAPS.map((a) => (
              <Button key={a.name} onClick={() => setX(a.value)}>
                {a.name}
              </Button>
            ))}
          </div>
        </>
      }
    >
      <Grid
        x={RANGE}
        y={RANGE}
        label={`The unit circle with the point P = (cos x, sin x) for x = ${format(x)}, which is (${cosText}, ${sinText}).`}
      >
        {shade && (
          <rect
            x={shade.x}
            y={shade.y}
            width={shade.size}
            height={shade.size}
            fill={COLORS.green}
            fillOpacity={0.08}
          />
        )}

        {/* the unit circle */}
        <circle
          cx={o.x}
          cy={o.y}
          r={unit}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.45}
          strokeWidth={1.5}
        />

        {/* the turn from E₁ */}
        {Math.abs(shown) > 0.02 && (
          <polyline
            points={arc}
            fill="none"
            stroke={COLORS.purple}
            strokeWidth={2.5}
          />
        )}
        {Math.abs(shown) > 0.2 && (
          <polygon points={arrow} fill={COLORS.purple} />
        )}
        {Math.abs(shown) > 0.45 && (
          <text
            x={arcLabel.x}
            y={arcLabel.y}
            textAnchor="middle"
            fontSize={15}
            fontStyle="italic"
            fontWeight={600}
            fill={COLORS.purple}
            {...halo}
          >
            x
          </text>
        )}

        {/* the radius from O to P */}
        <line
          x1={o.x}
          y1={o.y}
          x2={p.x}
          y2={p.y}
          stroke="currentColor"
          strokeWidth={1.5}
        />

        {/* the dashed line across to the y-axis, at height sin x */}
        <line
          x1={p.x}
          y1={p.y}
          x2={o.x}
          y2={p.y}
          stroke={COLORS.orange}
          strokeOpacity={0.7}
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />
        <circle cx={o.x} cy={p.y} r={3.5} fill={COLORS.orange} />

        {/* how far across: cos x, along the x-axis */}
        <line
          x1={o.x}
          y1={o.y}
          x2={foot.x}
          y2={foot.y}
          stroke={COLORS.blue}
          strokeWidth={5}
          strokeLinecap="round"
        />
        {/* how far up: sin x, from the x-axis to P */}
        <line
          x1={foot.x}
          y1={foot.y}
          x2={p.x}
          y2={p.y}
          stroke={COLORS.orange}
          strokeWidth={5}
          strokeLinecap="round"
        />

        {Math.abs(c) > 0.18 && (
          <text
            x={cosLabel.x}
            y={cosLabel.y}
            textAnchor="middle"
            fontSize={14}
            fontWeight={700}
            fill={COLORS.blue}
            {...halo}
          >
            cos x
          </text>
        )}
        {Math.abs(s) > 0.12 && (
          <text
            x={sinLabel.x}
            y={sinLabel.y}
            textAnchor={c >= 0 ? "start" : "end"}
            fontSize={14}
            fontWeight={700}
            fill={COLORS.orange}
            {...halo}
          >
            sin x
          </text>
        )}

        {/* E₁, where the point starts */}
        <circle
          cx={px(1)}
          cy={o.y}
          r={4}
          fill="var(--color-fd-card)"
          stroke="currentColor"
          strokeWidth={2}
        />

        {/* the point P */}
        <circle cx={p.x} cy={p.y} r={6} fill="currentColor" />
        <text
          x={pLabel.x}
          y={pLabel.y}
          textAnchor="middle"
          fontSize={15}
          fontWeight={700}
          fill="currentColor"
          {...halo}
        >
          P
        </text>
        <circle cx={o.x} cy={o.y} r={3} fill="currentColor" />
      </Grid>
    </Interactive>
  );
}
