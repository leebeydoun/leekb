"use client";

/**
 * The gardener's string on a grid. Two pegs F₁ and F₂ sit on the x-axis at −c and c, and a string
 * of fixed length runs from one peg to the point P and back to the other, so PF₁ + PF₂ = 2a with
 * a = 5. One slider moves the pegs apart, another moves P round the curve (or a button walks it
 * round). The curve is drawn solid as far as P has traced it and faint beyond, and the readout adds
 * the two lengths of string and gives b = √(a² − c²) and the eccentricity e = c/a.
 */

import { useEffect, useRef, useState } from "react";
import { Grid, gridScale } from "./grid";
import { Button, COLORS, Interactive, Slider, format } from "./kit";

const A = 5;
const X: [number, number] = [-6, 6];
const Y: [number, number] = [-6, 6];
const TWO_PI = 2 * Math.PI;

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

// "= 3" when two decimal places are exact, otherwise "≈ 2.18"
function equals(n: number) {
  const exact = Math.abs(Number(n.toFixed(2)) - n) < 1e-9;
  return `${exact ? "=" : "≈"} ${format(n)}`;
}

export function EllipseString({
  c: startC = 4,
  caption = "Move the pegs apart or together, then walk P round. However the string bends, its two pieces always add up to 10, the length 2a.",
}: {
  /** how far each peg is from the centre at the start */
  c?: number;
  caption?: string;
}) {
  const [c, setC] = useState(startC);
  // where P is round the curve, in degrees of the turn t in P = (a cos t, b sin t)
  const [turn, setTurn] = useState(53);
  const [playing, setPlaying] = useState(false);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => () => cancelAnimationFrame(frame.current ?? 0), []);

  function stop() {
    cancelAnimationFrame(frame.current ?? 0);
    setPlaying(false);
  }

  // walk P steadily from where it is (or from the start, if it is already all the way round) to 360
  function play() {
    stop();
    const from = turn >= 359.5 ? 0 : turn;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setTurn(360);
      return;
    }
    const seconds = ((360 - from) / 360) * 7;
    const begin = performance.now();
    setPlaying(true);
    const tick = (now: number) => {
      const t = Math.min(1, (now - begin) / 1000 / seconds);
      setTurn(from + (360 - from) * t);
      if (t < 1) frame.current = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    frame.current = requestAnimationFrame(tick);
  }

  const { px, py } = gridScale(X, Y);
  const b = Math.sqrt(A * A - c * c);
  const t = (turn * Math.PI) / 180;
  const p = { x: A * Math.cos(t), y: b * Math.sin(t) };
  const r1 = Math.hypot(p.x + c, p.y);
  // the second piece is written as 10 minus the first as shown, so the two always add to 10 exactly
  const r1Shown = Number(r1.toFixed(2));
  const r2Shown = Number((2 * A - r1Shown).toFixed(2));

  // the curve from the start up to P, and all the way round
  const sample = (to: number) => {
    const steps = Math.max(2, Math.ceil((to / TWO_PI) * 160));
    return Array.from({ length: steps + 1 }, (_, i) => {
      const s = (to * i) / steps;
      return `${px(A * Math.cos(s)).toFixed(1)},${py(b * Math.sin(s)).toFixed(1)}`;
    }).join(" ");
  };

  const P = { x: px(p.x), y: py(p.y) };
  const F1 = { x: px(-c), y: py(0) };
  const F2 = { x: px(c), y: py(0) };
  // P's label sits outside the curve, straight out from the centre
  const out = Math.hypot(p.x, p.y) || 1;
  const pLabel = { x: P.x + (p.x / out) * 18, y: P.y - (p.y / out) * 18 + 5 };
  const together = c < 0.05;

  const second = together ? (
    <>
      The pegs meet at the centre, so P stays 5 from it: a circle, with b = 5
      and e = 0.
    </>
  ) : (
    <>
      Pegs at ±{format(c)}: b = √(25 − {format(c * c)}) {equals(b)}, e = c/a{" "}
      {equals(c / A)}, loop length 2a + 2c = {format(2 * A + 2 * c)}.
    </>
  );

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>
            PF₁ + PF₂ = {format(r1Shown)} + {format(r2Shown)} = 10 = 2a
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {second}
          </div>
        </>
      }
      controls={
        <>
          <Slider
            label={
              <>
                pegs at ±<i>c</i>
              </>
            }
            value={c}
            onChange={setC}
            min={0}
            max={4.5}
            step={0.1}
          />
          <Slider
            label="move P round"
            value={turn}
            onChange={(v) => {
              stop();
              setTurn(v);
            }}
            min={0}
            max={360}
            step={1}
            show={() => `(${format(p.x, 1)}, ${format(p.y, 1)})`}
          />
          <Button onClick={playing ? stop : play}>
            {playing ? "Stop" : "Walk round"}
          </Button>
        </>
      }
    >
      <Grid
        x={X}
        y={Y}
        label={`Two pegs at (${format(-c)}, 0) and (${format(c)}, 0), and a string from one peg to the point P = (${format(p.x)}, ${format(p.y)}) and on to the other. The pieces are ${format(r1Shown)} and ${format(r2Shown)} long, adding up to 10. The curve P traces is the ellipse with half-widths 5 and ${format(b)}.`}
      >
        {/* the whole curve, faint, and the part P has traced, solid */}
        <polyline
          points={sample(TWO_PI)}
          fill="none"
          stroke={COLORS.purple}
          strokeOpacity={0.35}
          strokeWidth={1.75}
          strokeDasharray="6 5"
        />
        {t > 1e-6 && (
          <polyline
            points={sample(t)}
            fill="none"
            stroke={COLORS.purple}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
        )}

        {/* the string: one piece to each peg */}
        <line
          x1={F1.x}
          y1={F1.y}
          x2={P.x}
          y2={P.y}
          stroke={COLORS.blue}
          strokeWidth={2.5}
        />
        <line
          x1={F2.x}
          y1={F2.y}
          x2={P.x}
          y2={P.y}
          stroke={COLORS.orange}
          strokeWidth={2.5}
        />

        {/* the pegs, labelled below the axis */}
        {(together ? [F1] : [F1, F2]).map((f, i) => (
          <circle
            key={i}
            cx={f.x}
            cy={f.y}
            r={5.5}
            fill="var(--color-fd-card)"
            stroke="currentColor"
            strokeWidth={2.5}
          />
        ))}
        {together ? (
          <text
            x={F1.x}
            y={F1.y + 34}
            textAnchor="middle"
            fontSize={14}
            fontWeight={700}
            fill="currentColor"
            {...halo}
          >
            F₁ = F₂
          </text>
        ) : (
          <>
            <text
              x={F1.x}
              y={F1.y + 34}
              textAnchor="middle"
              fontSize={14}
              fontWeight={700}
              fill={COLORS.blue}
              {...halo}
            >
              F₁
            </text>
            <text
              x={F2.x}
              y={F2.y + 34}
              textAnchor="middle"
              fontSize={14}
              fontWeight={700}
              fill={COLORS.orange}
              {...halo}
            >
              F₂
            </text>
          </>
        )}

        {/* P, the stick that pulls the string tight */}
        <circle cx={P.x} cy={P.y} r={6} fill="currentColor" />
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
      </Grid>
    </Interactive>
  );
}
