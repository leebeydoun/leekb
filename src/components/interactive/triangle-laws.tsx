"use client";

/**
 * A triangle built from two sides and the angle between them. Sliders set the sides a and b and
 * the angle γ at the corner C between them. The diagram draws the triangle with C on the left of a
 * fixed base line, the height from B down to the line CA, and a faint copy of where B would be
 * with a right angle at C. The readout works out the third side with the law of cosines, the area
 * as ½ab sin γ, and the length the Pythagoras theorem would give.
 */

import { useState } from "react";
import { COLORS, format, Interactive, Slider } from "./kit";

const WIDTH = 600;
const HEIGHT = 340;
// pixels per unit; sides go up to 6, so B can sit up to 6 units left, right or above C
const UNIT = 42;
const C_SCREEN = { x: WIDTH / 2, y: 292 };

const sx = (x: number) => C_SCREEN.x + x * UNIT;
const sy = (y: number) => C_SCREEN.y - y * UNIT;

// a number inside a product in the readout: negatives go in brackets
const bracket = (n: number) => (n < 0 ? `(${format(n)})` : format(n));

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 5,
  strokeLinejoin: "round" as const,
  paintOrder: "stroke" as const,
};

export function TriangleLaws({
  caption = "Set the two sides a and b and the angle γ between them. The third side c comes from the law of cosines, and the dashed height gives the area. The faint point shows where B would be with a right angle at C.",
}: {
  caption?: string;
}) {
  const [a, setA] = useState(5);
  const [b, setB] = useState(4);
  const [degrees, setDegrees] = useState(120);

  const gamma = (degrees * Math.PI) / 180;
  const cos = Math.cos(gamma);
  const sin = Math.sin(gamma);

  // C at the origin, A along the base line, B at distance a and angle γ
  const A = { x: b, y: 0 };
  const B = { x: a * cos, y: a * sin };
  const cSquared = a * a + b * b - 2 * a * b * cos;
  const c = Math.sqrt(cSquared);
  const area = 0.5 * a * b * sin;
  const pythagoras = Math.sqrt(a * a + b * b);
  const right = degrees === 90;

  const Cs = C_SCREEN;
  const As = { x: sx(A.x), y: sy(A.y) };
  const Bs = { x: sx(B.x), y: sy(B.y) };
  // where B would be with a right angle at C
  const Rs = { x: sx(0), y: sy(a) };
  // the foot of the height from B, on the line CA
  const Fs = { x: sx(B.x), y: Cs.y };

  // the centre of the triangle, so side labels can be pushed away from it
  const middle = {
    x: (Cs.x + As.x + Bs.x) / 3,
    y: (Cs.y + As.y + Bs.y) / 3,
  };
  function sideLabel(
    p: { x: number; y: number },
    q: { x: number; y: number },
    gap = 16,
  ) {
    const mx = (p.x + q.x) / 2;
    const my = (p.y + q.y) / 2;
    const dx = q.x - p.x;
    const dy = q.y - p.y;
    const length = Math.hypot(dx, dy) || 1;
    let nx = -dy / length;
    let ny = dx / length;
    // point the label away from the middle of the triangle
    if (nx * (mx - middle.x) + ny * (my - middle.y) < 0) {
      nx = -nx;
      ny = -ny;
    }
    return { x: mx + nx * gap, y: my + ny * gap + 5 };
  }

  const aLabel = sideLabel(Cs, Bs);
  const cLabel = sideLabel(Bs, As);

  // the arc for γ at C, from the base line round to the side CB
  const arcR = 30;
  const arcEnd = { x: Cs.x + arcR * cos, y: Cs.y - arcR * sin };
  const arc = `M ${Cs.x + arcR} ${Cs.y} A ${arcR} ${arcR} 0 0 0 ${arcEnd.x} ${arcEnd.y}`;
  const gammaLabel = {
    x: Cs.x + (arcR + 16) * Math.cos(gamma / 2),
    y: Cs.y - (arcR + 16) * Math.sin(gamma / 2) + 5,
  };

  // the right-angle mark at the foot, on the side towards C
  const mark = 10;
  const toward = B.x > 0 ? -1 : 1;
  const footMark = `${Fs.x + toward * mark},${Fs.y} ${Fs.x + toward * mark},${Fs.y - mark} ${Fs.x},${Fs.y - mark}`;

  // the base line runs past C when the foot falls outside the side CA
  const baseFrom = Math.min(0, B.x) - 0.4;
  const baseTo = Math.max(b, B.x) + 0.4;

  const comparison = right
    ? "γ is a right angle, so cos γ = 0 and this is the Pythagoras theorem."
    : `With a right angle at C, c would be √(a² + b²) ≈ ${format(pythagoras)}, so this third side is ${degrees > 90 ? "longer" : "shorter"}.`;

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>
            c² = a² + b² − 2ab cos γ = {format(a * a)} + {format(b * b)} −{" "}
            {format(2 * a * b)} × {bracket(cos)} = {format(cSquared)}, so c ≈{" "}
            {format(c)}
          </div>
          <div className="mt-1">
            Area = ½ab sin γ = ½ × {format(a)} × {format(b)} × {format(sin)} ≈{" "}
            {format(area)}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {comparison}
          </div>
        </>
      }
      controls={
        <>
          <Slider
            label="side a"
            value={a}
            onChange={setA}
            min={1}
            max={6}
            step={0.5}
          />
          <Slider
            label="side b"
            value={b}
            onChange={setB}
            min={1}
            max={6}
            step={0.5}
          />
          <Slider
            label="angle γ"
            value={degrees}
            onChange={setDegrees}
            min={10}
            max={170}
            show={(v) => `${v}° (${format((v * Math.PI) / 180)})`}
          />
        </>
      }
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-xl text-fd-foreground"
        role="img"
        aria-label={`A triangle with sides a = ${format(a)} and b = ${format(b)} and an angle of ${degrees} degrees between them at C. The third side c is about ${format(c)} and the area is about ${format(area)}.`}
      >
        {/* the line through C and A, dashed where it runs past the side CA */}
        <line
          x1={sx(baseFrom)}
          x2={sx(baseTo)}
          y1={Cs.y}
          y2={Cs.y}
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={1.5}
          strokeDasharray="5 5"
        />

        {/* where B would be with a right angle at C */}
        {!right && (
          <g opacity={0.45}>
            <line
              x1={Cs.x}
              y1={Cs.y}
              x2={Rs.x}
              y2={Rs.y}
              stroke="currentColor"
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
            <line
              x1={Rs.x}
              y1={Rs.y}
              x2={As.x}
              y2={As.y}
              stroke="currentColor"
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
            <circle cx={Rs.x} cy={Rs.y} r={3.5} fill="currentColor" />
          </g>
        )}

        {/* the triangle */}
        <polygon
          points={`${Cs.x},${Cs.y} ${As.x},${As.y} ${Bs.x},${Bs.y}`}
          fill={COLORS.blue}
          fillOpacity={0.1}
        />
        <line
          x1={Cs.x}
          y1={Cs.y}
          x2={As.x}
          y2={As.y}
          stroke={COLORS.blue}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <line
          x1={Cs.x}
          y1={Cs.y}
          x2={Bs.x}
          y2={Bs.y}
          stroke={COLORS.blue}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <line
          x1={Bs.x}
          y1={Bs.y}
          x2={As.x}
          y2={As.y}
          stroke={COLORS.orange}
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* the height from B to the line CA */}
        <line
          x1={Bs.x}
          y1={Bs.y}
          x2={Fs.x}
          y2={Fs.y}
          stroke={COLORS.purple}
          strokeWidth={2}
          strokeDasharray="6 4"
        />
        <polyline
          points={footMark}
          fill="none"
          stroke={COLORS.purple}
          strokeWidth={1.5}
        />

        {/* the angle γ at C */}
        <path d={arc} fill="none" stroke={COLORS.green} strokeWidth={2.5} />
        <text
          x={gammaLabel.x}
          y={gammaLabel.y}
          textAnchor="middle"
          fontSize={15}
          fontWeight={700}
          fill={COLORS.green}
          {...halo}
        >
          γ
        </text>

        {/* side labels */}
        <text
          x={aLabel.x}
          y={aLabel.y}
          textAnchor="middle"
          fontSize={14}
          fontWeight={700}
          fill={COLORS.blue}
          {...halo}
        >
          a = {format(a)}
        </text>
        <text
          x={(Cs.x + As.x) / 2}
          y={Cs.y + 26}
          textAnchor="middle"
          fontSize={14}
          fontWeight={700}
          fill={COLORS.blue}
          {...halo}
        >
          b = {format(b)}
        </text>
        <text
          x={cLabel.x}
          y={cLabel.y}
          textAnchor="middle"
          fontSize={14}
          fontWeight={700}
          fill={COLORS.orange}
          {...halo}
        >
          c ≈ {format(c)}
        </text>

        {/* corners */}
        {[
          { p: Cs, name: "C", dx: -14, dy: 20 },
          { p: As, name: "A", dx: 14, dy: 20 },
          { p: Bs, name: "B", dx: 0, dy: -12 },
        ].map(({ p, name, dx, dy }) => (
          <g key={name}>
            <circle cx={p.x} cy={p.y} r={5} fill="currentColor" />
            <text
              x={p.x + dx}
              y={p.y + dy}
              textAnchor="middle"
              fontSize={15}
              fontWeight={700}
              fill="currentColor"
              {...halo}
            >
              {name}
            </text>
          </g>
        ))}
      </svg>
    </Interactive>
  );
}
