"use client";

/**
 * The picture behind the cosine of a difference. Sliders set two angles a and b. The unit circle
 * carries P = (cos a, sin a) and Q = (cos b, sin b), joined by the blue chord PQ, and the orange
 * chord from E₁ = (1, 0) to R = (cos(a − b), sin(a − b)), which is PQ turned by −b. A button plays
 * that turn, so the blue chord can be seen swinging down onto the orange one. The readout shows
 * that the two chords have the same length, and that cos(a − b) and cos a cos b + sin a sin b agree.
 */

import { useState } from "react";
import { Grid, gridScale } from "./grid";
import {
  Button,
  COLORS,
  format,
  Interactive,
  Slider,
  useAnimation,
} from "./kit";

const RANGE: [number, number] = [-1.3, 1.3];

type Vec = { x: number; y: number };

const onCircle = (angle: number): Vec => ({
  x: Math.cos(angle),
  y: Math.sin(angle),
});

const degrees = (angle: number) => Math.round((angle * 180) / Math.PI);

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

export function ChordTwoWays({
  a: startA = 2.79,
  b: startB = 1.75,
  caption = "The blue chord joins the points at angles a and b. Turning it by −b moves Q to E₁ and P to R, at angle a − b, so the orange chord is the blue one turned and has the same length. Writing both lengths with the distance formula gives the cosine of a difference.",
}: {
  /** the starting angle of P, in radians */
  a?: number;
  /** the starting angle of Q, in radians */
  b?: number;
  caption?: string;
}) {
  const [a, setA] = useState(startA);
  const [b, setB] = useState(startB);
  const turn = useAnimation(1600);
  const { px, py, unit } = gridScale(RANGE, RANGE);

  const P = onCircle(a);
  const Q = onCircle(b);
  const R = onCircle(a - b);
  const E1 = { x: 1, y: 0 };

  const blue = Math.hypot(P.x - Q.x, P.y - Q.y);
  const orange = Math.hypot(R.x - E1.x, R.y - E1.y);
  const left = Math.cos(a - b);
  const right = Math.cos(a) * Math.cos(b) + Math.sin(a) * Math.sin(b);

  // the copy of the chord part of the way through the turn by −b
  const moving = turn.playing || (turn.progress > 0 && !turn.done);
  const shift = -b * turn.progress;
  const P1 = onCircle(a + shift);
  const Q1 = onCircle(b + shift);

  /** an arc along the unit circle from one angle to another, as a path of short steps */
  const arc = (from: number, to: number) => {
    const steps = Math.max(2, Math.ceil(Math.abs(to - from) * 30));
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const p = onCircle(from + ((to - from) * i) / steps);
      d += `${i === 0 ? "M" : "L"}${px(p.x)},${py(p.y)}`;
    }
    return d;
  };

  const label = (p: Vec, text: string, color: string) => (
    <text
      x={px(p.x * 1.17)}
      y={py(p.y * 1.17) + 5}
      textAnchor="middle"
      fontSize={15}
      fontWeight={700}
      fill={color}
      {...halo}
    >
      {text}
    </text>
  );

  const dot = (p: Vec, color: string) => (
    <circle
      cx={px(p.x)}
      cy={py(p.y)}
      r={5.5}
      fill={color}
      stroke="var(--color-fd-card)"
      strokeWidth={2}
    />
  );

  const radius = (p: Vec) => (
    <line
      x1={px(0)}
      y1={py(0)}
      x2={px(p.x)}
      y2={py(p.y)}
      stroke="currentColor"
      strokeOpacity={0.35}
      strokeWidth={1.5}
      strokeDasharray="4 4"
    />
  );

  const show = (angle: number) => `${format(angle)} (${degrees(angle)}°)`;
  const change = (set: (value: number) => void) => (value: number) => {
    turn.reset();
    set(value);
  };

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>
            chord PQ = {format(blue)}, chord E₁R = {format(orange)}
          </div>
          <div className="mt-1">
            cos(a − b) = {format(left)}; cos a cos b + sin a sin b ={" "}
            {format(right)}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            a − b = {format(a - b)}, so R is the point at angle {format(a - b)}
            {a - b < 0 ? ", turned clockwise from E₁" : ""}
          </div>
        </>
      }
      controls={
        <>
          <Slider
            label={
              <>
                angle <i>a</i> of P
              </>
            }
            value={a}
            onChange={change(setA)}
            min={0}
            max={6.28}
            step={0.01}
            show={show}
          />
          <Slider
            label={
              <>
                angle <i>b</i> of Q
              </>
            }
            value={b}
            onChange={change(setB)}
            min={0}
            max={6.28}
            step={0.01}
            show={show}
          />
          <Button onClick={turn.play} disabled={turn.playing}>
            Turn PQ by −b
          </Button>
        </>
      }
    >
      <Grid
        x={RANGE}
        y={RANGE}
        label={`The unit circle with P at angle ${format(a)} and Q at angle ${format(b)}. The chord PQ and the chord from E₁ to R, at angle ${format(a - b)}, are both ${format(blue)} long.`}
      >
        <circle
          cx={px(0)}
          cy={py(0)}
          r={unit}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.5}
          strokeWidth={1.5}
        />

        {/* the arcs from Q to P and from E₁ to R, both a − b long */}
        <path
          d={arc(b, a)}
          fill="none"
          stroke={COLORS.blue}
          strokeOpacity={0.3}
          strokeWidth={8}
          strokeLinecap="round"
        />
        <path
          d={arc(0, a - b)}
          fill="none"
          stroke={COLORS.orange}
          strokeOpacity={0.3}
          strokeWidth={8}
          strokeLinecap="round"
        />

        {radius(P)}
        {radius(Q)}
        {radius(R)}

        <line
          x1={px(P.x)}
          y1={py(P.y)}
          x2={px(Q.x)}
          y2={py(Q.y)}
          stroke={COLORS.blue}
          strokeWidth={3}
        />
        <line
          x1={px(E1.x)}
          y1={py(E1.y)}
          x2={px(R.x)}
          y2={py(R.y)}
          stroke={COLORS.orange}
          strokeWidth={3}
        />

        {moving && (
          <g>
            <line
              x1={px(P1.x)}
              y1={py(P1.y)}
              x2={px(Q1.x)}
              y2={py(Q1.y)}
              stroke={COLORS.purple}
              strokeWidth={3}
              strokeDasharray="6 4"
            />
            {dot(P1, COLORS.purple)}
            {dot(Q1, COLORS.purple)}
          </g>
        )}

        <circle cx={px(0)} cy={py(0)} r={3.5} fill="currentColor" />
        {dot(P, COLORS.blue)}
        {dot(Q, COLORS.blue)}
        {dot(E1, COLORS.orange)}
        {dot(R, COLORS.orange)}
        {label(P, "P", COLORS.blue)}
        {label(Q, "Q", COLORS.blue)}
        {label(E1, "E₁", COLORS.orange)}
        {label(R, "R", COLORS.orange)}
      </Grid>
    </Interactive>
  );
}
