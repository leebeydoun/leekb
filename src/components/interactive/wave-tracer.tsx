"use client";

/**
 * The unit circle beside the graph of sine (or cosine) for x from 0 to 2π. A slider turns the
 * point (cos x, sin x) round the circle, and a dashed line carries its height straight across to
 * the graph, which is drawn solid as far as it has been traced and faint beyond. For cosine the
 * across distance is turned a quarter turn about the origin, so that it stands upright on the
 * y-axis, and then carried across in the same way. Both pictures use one scale, so the circle's
 * radius is one unit on the graph.
 */

import { useEffect, useRef, useState } from "react";
import { Button, Choice, COLORS, Interactive, Slider, format } from "./kit";

const PI = Math.PI;
const TWO_PI = 2 * PI;

// one unit, in pixels, for both the circle and the graph
const R = 70;
const CX = 100;
const CY = 108;
const GX = 220; // where x = 0 sits on the graph
const WIDTH = GX + TWO_PI * R + 40;
const HEIGHT = CY + R + 44;

const gx = (x: number) => GX + x * R;
const gy = (y: number) => CY - y * R;

// the slider moves in steps of π/120, so every multiple of π/6 and π/4 is a step
const STEP = PI / 120;

type Wave = "sin" | "cos";

// the name of a multiple of π, such as "2π/3", when x is a multiple of π/6 or π/4
function piName(x: number) {
  const k = Math.round(x / (PI / 12));
  if (Math.abs(x - (k * PI) / 12) > 1e-6) return undefined;
  if (k === 0) return "0";
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const g = gcd(k, 12);
  const top = k / g;
  const bottom = 12 / g;
  if (![1, 2, 3, 4, 6].includes(bottom)) return undefined;
  const head = top === 1 ? "π" : `${top}π`;
  return bottom === 1 ? head : `${head}/${bottom}`;
}

// the name of k halves of π, for the marks along the graph
const HALVES = ["0", "π/2", "π", "3π/2", "2π"];

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

/** the curve y = f(t) on the graph, for t from `from` to `to` */
function path(f: (t: number) => number, from: number, to: number) {
  if (to - from < 1e-9) return "";
  const steps = Math.max(2, Math.ceil((to - from) * 40));
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = from + ((to - from) * i) / steps;
    return `${gx(t).toFixed(1)},${gy(f(t)).toFixed(1)}`;
  }).join(" ");
}

export function WaveTracer({
  x: start = (2 * PI) / 3,
  wave: startWave = "sin",
  caption = "Turn the point round the circle and watch its height trace the wave. Switch to cosine to trace how far across the point is instead.",
}: {
  /** the angle at the start, in radians */
  x?: number;
  wave?: Wave;
  caption?: string;
}) {
  const [x, setX] = useState(start);
  const [wave, setWave] = useState<Wave>(startWave);
  const [playing, setPlaying] = useState(false);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => () => cancelAnimationFrame(frame.current ?? 0), []);

  function stop() {
    cancelAnimationFrame(frame.current ?? 0);
    setPlaying(false);
  }

  // turn steadily from the current angle (or from 0, if already at the end) round to 2π
  function play() {
    stop();
    const from = x >= TWO_PI - 1e-6 ? 0 : x;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setX(TWO_PI);
      return;
    }
    const seconds = ((TWO_PI - from) / TWO_PI) * 8;
    const begin = performance.now();
    setPlaying(true);
    const tick = (now: number) => {
      const t = Math.min(1, (now - begin) / 1000 / seconds);
      setX(from + (TWO_PI - from) * t);
      if (t < 1) frame.current = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    frame.current = requestAnimationFrame(tick);
  }

  const f = wave === "sin" ? Math.sin : Math.cos;
  const c = Math.cos(x);
  const s = Math.sin(x);
  const value = f(x);
  const color = wave === "sin" ? COLORS.blue : COLORS.orange;
  const p = { x: CX + c * R, y: CY - s * R };
  // the start of the dashed line: the point itself, or for cosine the across distance stood upright
  const carried =
    wave === "sin" ? { x: p.x, y: p.y } : { x: CX, y: CY - c * R };
  const on = { x: gx(x), y: gy(value) };

  const name = piName(x);
  const shown = `x = ${format(x)}${name && name !== format(x) ? ` (${name})` : ""}`;
  const readout =
    wave === "sin" ? (
      <>
        {shown}: height <i>sin x</i> = {format(s)}
      </>
    ) : (
      <>
        {shown}: across <i>cos x</i> = {format(c)}
        <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
          A quarter turn about O stands the across distance upright on the
          y-axis, and the dashed line carries it over as the height of the
          graph.
        </div>
      </>
    );

  // the small arc for the turn from E₁ to the point, drawn the short way while x is under 2π
  const turnArc = (() => {
    const r = 20;
    if (x < 1e-6) return "";
    const end = { x: CX + r * Math.cos(x), y: CY - r * Math.sin(x) };
    const large = x > PI ? 1 : 0;
    return `M ${CX + r} ${CY} A ${r} ${r} 0 ${large} 0 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
  })();

  // for cosine: the quarter turn taking (cos x, 0) to (0, cos x), as a dotted arc of radius |cos x|
  const quarterArc = (() => {
    const r = Math.abs(c) * R;
    if (wave !== "cos" || r < 4) return "";
    const from = { x: CX + c * R, y: CY };
    const to = { x: CX, y: CY - c * R };
    return `M ${from.x} ${from.y} A ${r} ${r} 0 0 0 ${to.x} ${to.y}`;
  })();

  return (
    <Interactive
      caption={caption}
      readout={readout}
      controls={
        <>
          <Slider
            label={
              <>
                turn <i>x</i>
              </>
            }
            value={x}
            onChange={(v) => {
              stop();
              setX(v);
            }}
            min={0}
            max={TWO_PI}
            step={STEP}
          />
          <Choice
            value={wave}
            onChange={(w) => setWave(w)}
            options={[
              { value: "sin", label: "sine" },
              { value: "cos", label: "cosine" },
            ]}
          />
          <Button onClick={playing ? stop : play}>
            {playing ? "Stop" : "Turn steadily"}
          </Button>
        </>
      }
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-3xl text-fd-foreground"
        role="img"
        aria-label={`The unit circle with the point turned by x = ${format(x)} radians, at (${format(c)}, ${format(s)}), beside the graph of y = ${wave} x for x from 0 to 2π, traced as far as x = ${format(x)}, where its height is ${format(value)}.`}
      >
        {/* faint grid on the graph: a line at each multiple of π/2 and at heights 1 and −1 */}
        <g className="text-fd-border" stroke="currentColor" strokeWidth={1}>
          {HALVES.map((_, k) => (
            <line
              key={k}
              x1={gx((k * PI) / 2)}
              x2={gx((k * PI) / 2)}
              y1={gy(-1)}
              y2={gy(1)}
            />
          ))}
          {[1, -1].map((n) => (
            <line
              key={n}
              x1={CX - R}
              x2={gx(TWO_PI)}
              y1={gy(n)}
              y2={gy(n)}
              strokeDasharray="2 4"
            />
          ))}
        </g>

        {/* axes of the circle */}
        <g stroke="currentColor" strokeWidth={1.5}>
          <line x1={CX - R - 16} x2={CX + R + 16} y1={CY} y2={CY} />
          <line x1={CX} x2={CX} y1={CY + R + 16} y2={CY - R - 16} />
          {/* axes of the graph */}
          <line x1={GX} x2={gx(TWO_PI) + 18} y1={CY} y2={CY} />
          <line x1={GX} x2={GX} y1={CY + R + 16} y2={CY - R - 16} />
        </g>
        <polygon
          fill="currentColor"
          points={`${gx(TWO_PI) + 22},${CY} ${gx(TWO_PI) + 14},${CY - 4} ${gx(TWO_PI) + 14},${CY + 4}`}
        />
        <text
          x={gx(TWO_PI) + 16}
          y={CY - 9}
          fontSize={14}
          fontStyle="italic"
          fill="currentColor"
        >
          x
        </text>
        <text
          x={GX - 8}
          y={gy(1) + 4}
          fontSize={12}
          textAnchor="end"
          className="fill-fd-muted-foreground"
        >
          1
        </text>
        <text
          x={GX - 8}
          y={gy(-1) + 4}
          fontSize={12}
          textAnchor="end"
          className="fill-fd-muted-foreground"
        >
          −1
        </text>
        <g fontSize={12} className="fill-fd-muted-foreground">
          {HALVES.slice(1).map((label, i) => (
            <text
              key={label}
              x={gx(((i + 1) * PI) / 2)}
              y={gy(-1) + 34}
              textAnchor="middle"
            >
              {label}
            </text>
          ))}
        </g>

        {/* the unit circle, the radius to the point and the turn */}
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill={COLORS.blue}
          fillOpacity={0.05}
          stroke="currentColor"
          strokeOpacity={0.6}
          strokeWidth={2}
        />
        <line
          x1={CX}
          y1={CY}
          x2={p.x}
          y2={p.y}
          stroke="currentColor"
          strokeWidth={2}
        />
        {turnArc && (
          <path
            d={turnArc}
            fill="none"
            stroke={COLORS.purple}
            strokeWidth={2}
          />
        )}

        {/* what is carried across: the height of the point, or its across distance stood upright */}
        {wave === "sin" ? (
          <line
            x1={p.x}
            x2={p.x}
            y1={CY}
            y2={p.y}
            stroke={color}
            strokeWidth={4}
            strokeLinecap="round"
          />
        ) : (
          <>
            <line
              x1={CX}
              x2={p.x}
              y1={CY}
              y2={CY}
              stroke={color}
              strokeWidth={4}
              strokeLinecap="round"
            />
            {quarterArc && (
              <path
                d={quarterArc}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                strokeDasharray="2 4"
              />
            )}
            <line
              x1={CX}
              x2={CX}
              y1={CY}
              y2={carried.y}
              stroke={color}
              strokeWidth={4}
              strokeLinecap="round"
              strokeOpacity={0.6}
            />
            <line
              x1={p.x}
              x2={p.x}
              y1={CY}
              y2={p.y}
              stroke="currentColor"
              strokeOpacity={0.4}
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
          </>
        )}
        <line
          x1={carried.x}
          x2={on.x}
          y1={carried.y}
          y2={on.y}
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray="6 5"
        />

        {/* the graph: faint all the way, solid as far as it has been traced */}
        <polyline
          points={path(f, 0, TWO_PI)}
          fill="none"
          stroke={color}
          strokeOpacity={0.3}
          strokeWidth={2}
          strokeDasharray="5 5"
        />
        <polyline
          points={path(f, 0, x)}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <line
          x1={on.x}
          x2={on.x}
          y1={CY}
          y2={on.y}
          stroke={color}
          strokeWidth={4}
          strokeOpacity={0.6}
          strokeLinecap="round"
        />

        <circle
          cx={p.x}
          cy={p.y}
          r={6}
          fill="currentColor"
          stroke="var(--color-fd-card)"
          strokeWidth={2}
        />
        <circle
          cx={on.x}
          cy={on.y}
          r={6}
          fill={color}
          stroke="var(--color-fd-card)"
          strokeWidth={2}
        />
        <text
          x={p.x + (c >= 0 ? 10 : -10)}
          y={p.y + (s >= 0 ? -8 : 18)}
          textAnchor={c >= 0 ? "start" : "end"}
          fontSize={14}
          fontWeight={700}
          fill="currentColor"
          {...halo}
        >
          P
        </text>
        <text
          x={CX - 8}
          y={CY + 16}
          textAnchor="end"
          fontSize={13}
          fill="currentColor"
          {...halo}
        >
          O
        </text>
        <text
          x={on.x}
          y={value >= 0 ? on.y - 12 : on.y + 22}
          textAnchor="middle"
          fontSize={13}
          fontWeight={600}
          fill={color}
          {...halo}
        >
          {format(value)}
        </text>
      </svg>
    </Interactive>
  );
}
