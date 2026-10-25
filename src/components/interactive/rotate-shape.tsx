"use client";

/**
 * A flag with its marked corner P = (3, 1), and its image under the turn G_φ about the origin. A
 * slider sets φ from −π to π. The diagram draws the circle through P centred at O and an arc from
 * the ray OP to the ray OP′ showing the turn, and the readout gives the matrix of G_φ with its
 * numbers and where P lands.
 */

import { useState } from "react";
import { Grid, gridScale } from "./grid";
import { Button, COLORS, Interactive, Slider, format } from "./kit";
import { Dot, FLAG, Flag, type Vec } from "./moving-shape";

const X_RANGE: [number, number] = [-5, 5];
const Y_RANGE: [number, number] = [-5, 5];

// the flag, enlarged a little, with its bottom-left corner P at (3, 1)
const P: Vec = { x: 3, y: 1 };
const START = FLAG.map((c) => ({ x: P.x + 1.25 * c.x, y: P.y + 1.25 * c.y }));
const P_ANGLE = Math.atan2(P.y, P.x);
const P_LENGTH = Math.hypot(P.x, P.y);

/** the turn by phi radians about the origin, from the formula */
const turn = (p: Vec, phi: number): Vec => ({
  x: p.x * Math.cos(phi) - p.y * Math.sin(phi),
  y: p.x * Math.sin(phi) + p.y * Math.cos(phi),
});

/** a number to exactly two decimal places, with a proper minus sign and no "−0.00" */
const fixed = (n: number) => {
  const text = Math.abs(n).toFixed(2);
  return n < 0 && text !== "0.00" ? `−${text}` : text;
};

const pair = (p: Vec) => `(${fixed(p.x)}, ${fixed(p.y)})`;

/** an angle in radians, with its size in degrees beside it */
const showAngle = (phi: number) =>
  `${format(phi)} (${format((phi * 180) / Math.PI, 0)}°)`;

const SNAPS: { label: string; value: number }[] = [
  { label: "π/6", value: Math.PI / 6 },
  { label: "π/2", value: Math.PI / 2 },
  { label: "π", value: Math.PI },
  { label: "−π/3", value: -Math.PI / 3 },
];

/** a 2 × 2 matrix of numbers between two tall brackets */
function MatrixView({
  entries,
}: {
  entries: [number, number, number, number];
}) {
  return (
    <span className="mx-1 inline-flex items-stretch align-middle">
      <span className="w-1.5 rounded-l-sm border-y-2 border-l-2 border-current" />
      <span className="grid grid-cols-2 gap-x-3 px-1.5 py-0.5 text-end">
        {entries.map((n, i) => (
          <span key={i} className="min-w-[5ch]">
            {fixed(n)}
          </span>
        ))}
      </span>
      <span className="w-1.5 rounded-r-sm border-y-2 border-r-2 border-current" />
    </span>
  );
}

export function RotateShape({
  caption = "Move the slider to turn the flag about the origin by φ. The marked corner P stays on the dashed circle, and the matrix holds the four numbers of the formula.",
}: {
  caption?: string;
}) {
  const [phi, setPhi] = useState(Math.PI / 6);
  const { px: sx, py: sy, unit } = gridScale(X_RANGE, Y_RANGE);
  const px = (p: Vec): Vec => ({ x: sx(p.x), y: sy(p.y) });

  const c = Math.cos(phi);
  const s = Math.sin(phi);
  const image = turn(P, phi);
  const turned = START.map((corner) => turn(corner, phi));
  const o = px({ x: 0, y: 0 });

  // the arc from the ray OP to the ray OP′, drawn as many short pieces, with an arrowhead at its end
  const ARC_R = 1.4;
  const steps = 48;
  const arc = Array.from({ length: steps + 1 }, (_, i) => {
    const a = P_ANGLE + (phi * i) / steps;
    return px({ x: ARC_R * Math.cos(a), y: ARC_R * Math.sin(a) });
  });
  const showArc = Math.abs(phi) > 0.08;
  const end = arc[steps]!;
  const before = arc[steps - 4]!;
  const heading = Math.atan2(end.y - before.y, end.x - before.x);
  const head = [0, 2.5, -2.5].map((da, i) => {
    const back = i === 0 ? 0 : 10;
    return {
      x: end.x - back * Math.cos(heading + (da * Math.PI) / 18),
      y: end.y - back * Math.sin(heading + (da * Math.PI) / 18),
    };
  });
  const middle = P_ANGLE + phi / 2;
  const labelAt = px({
    x: (ARC_R + 0.45) * Math.cos(middle),
    y: (ARC_R + 0.45) * Math.sin(middle),
  });

  // each name sits just below its flag's foot, in the flag's own frame, so the flag never covers it
  const below = (angle: number) => {
    const d = turn({ x: 0.4, y: -1 }, angle);
    const l = Math.hypot(d.x, d.y);
    return { dx: (18 * d.x) / l, dy: (-18 * d.y) / l };
  };
  const pOff = below(0);
  const iOff = below(phi);

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>
            φ = {showAngle(phi)}: matrix of <i>G</i>
            <sub>φ</sub>
            <MatrixView entries={[c, -s, s, c]} />
          </div>
          <div className="mt-1">
            <i>P</i> = (3, 1) ↦ <i>P</i>′ = {pair(image)}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            Both points are √10 ≈ {format(P_LENGTH)} from O. The first column of
            the matrix, ({fixed(c)}, {fixed(s)}), is where E₁ = (1, 0) lands.
          </div>
        </>
      }
      controls={
        <>
          <Slider
            label="turn φ"
            value={phi}
            onChange={setPhi}
            min={-Math.PI}
            max={Math.PI}
            step={0.01}
            show={showAngle}
          />
          <div className="flex flex-wrap gap-2">
            {SNAPS.map((snap) => (
              <Button
                key={snap.label}
                primary={Math.abs(phi - snap.value) < 1e-9}
                onClick={() => setPhi(snap.value)}
              >
                {snap.label}
              </Button>
            ))}
          </div>
        </>
      }
    >
      <Grid
        x={X_RANGE}
        y={Y_RANGE}
        label={`A flag with its corner P at (3, 1), and the same flag turned about the origin by φ = ${showAngle(phi)}. The corner P goes to ${pair(image)}.`}
      >
        <circle
          cx={o.x}
          cy={o.y}
          r={P_LENGTH * unit}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={1.5}
          strokeDasharray="5 5"
        />
        <g stroke={COLORS.purple} strokeWidth={2} strokeDasharray="6 4">
          <line x1={o.x} y1={o.y} x2={px(P).x} y2={px(P).y} />
          <line x1={o.x} y1={o.y} x2={px(image).x} y2={px(image).y} />
        </g>
        {showArc && (
          <g>
            <polyline
              points={arc.map((q) => `${q.x},${q.y}`).join(" ")}
              fill="none"
              stroke={COLORS.purple}
              strokeWidth={2.5}
            />
            <polygon
              points={head.map((q) => `${q.x},${q.y}`).join(" ")}
              fill={COLORS.purple}
            />
            <text
              x={labelAt.x}
              y={labelAt.y + 5}
              textAnchor="middle"
              fontSize={16}
              fontStyle="italic"
              fill={COLORS.purple}
              stroke="var(--color-fd-card)"
              strokeWidth={4}
              paintOrder="stroke"
            >
              φ
            </text>
          </g>
        )}
        <Flag corners={START} px={px} color={COLORS.blue} faint />
        <Flag corners={turned} px={px} color={COLORS.orange} />
        <Dot
          at={px(P)}
          name="P"
          color={COLORS.blue}
          dx={pOff.dx}
          dy={pOff.dy}
        />
        <Dot
          at={px(image)}
          name="P′"
          color={COLORS.orange}
          dx={iOff.dx}
          dy={iOff.dy}
        />
      </Grid>
    </Interactive>
  );
}
