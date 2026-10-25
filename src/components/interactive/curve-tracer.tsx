"use client";

/**
 * CurveTracer: a mapping t ↦ (x(t), y(t)) from an interval of times into the plane, chosen from a
 * line, a circle, an ellipse, the curve (t², t³), a ball thrown from a cliff and the figure
 * (sin 2t, sin 3t). A time slider (or the play button) moves a dot, which leaves a trail behind it:
 * the part of the curve traced so far. Small dots on the trail mark equal steps of time, so the
 * reader sees where the point moves fast and where it slows down. The readout gives the time and
 * the point. Each mapping has its own square window, so the picture stays the same size.
 */

import { useEffect, useRef, useState } from "react";
import { Button, COLORS, Choice, Interactive, Slider, format } from "./kit";

type Name = "line" | "circle" | "ellipse" | "cusp" | "ball" | "figure";

type Preset = {
  label: string;
  formula: string;
  x: (t: number) => number;
  y: (t: number) => number;
  /** the interval of times */
  t: [number, number];
  /** the window, the same span across and up */
  view: { x: [number, number]; y: [number, number] };
  /** grid lines every `step`, numbers every `every` */
  step: number;
  every: number;
  /** a small dot on the trail every `mark` units of time */
  mark: number;
  /** how a time is written */
  time?: (t: number) => string;
};

const PI = Math.PI;
const LAND = Math.sqrt(20 / 4.9);

const PRESETS: Record<Name, Preset> = {
  line: {
    label: "line",
    formula: "t ↦ (−1 + 2t, 3 − t)",
    x: (t) => -1 + 2 * t,
    y: (t) => 3 - t,
    t: [-1, 3],
    view: { x: [-4, 6], y: [-3, 7] },
    step: 1,
    every: 2,
    mark: 1,
  },
  circle: {
    label: "circle",
    formula: "t ↦ (2 + 3 cos t, 1 + 3 sin t)",
    x: (t) => 2 + 3 * Math.cos(t),
    y: (t) => 1 + 3 * Math.sin(t),
    t: [0, 2 * PI],
    view: { x: [-2, 6], y: [-3, 5] },
    step: 1,
    every: 1,
    mark: PI / 4,
  },
  ellipse: {
    label: "ellipse",
    formula: "t ↦ (5 cos t, 2 sin t)",
    x: (t) => 5 * Math.cos(t),
    y: (t) => 2 * Math.sin(t),
    t: [0, 2 * PI],
    view: { x: [-6, 6], y: [-6, 6] },
    step: 1,
    every: 2,
    mark: PI / 4,
  },
  cusp: {
    label: "(t², t³)",
    formula: "t ↦ (t², t³)",
    x: (t) => t * t,
    y: (t) => t * t * t,
    t: [-1.5, 1.5],
    view: { x: [-2, 5], y: [-3.5, 3.5] },
    step: 1,
    every: 1,
    mark: 0.25,
  },
  ball: {
    label: "ball",
    formula: "t ↦ (6t, 20 − 4.9t²), in metres after t seconds",
    x: (t) => 6 * t,
    y: (t) => 20 - 4.9 * t * t,
    t: [0, LAND],
    view: { x: [-2, 22], y: [-1, 23] },
    step: 2,
    every: 4,
    mark: 0.25,
    time: (t) => `${format(t)} s`,
  },
  figure: {
    label: "(sin 2t, sin 3t)",
    formula: "t ↦ (sin 2t, sin 3t)",
    x: (t) => Math.sin(2 * t),
    y: (t) => Math.sin(3 * t),
    t: [0, 2 * PI],
    view: { x: [-1.5, 1.5], y: [-1.5, 1.5] },
    step: 0.5,
    every: 0.5,
    mark: PI / 12,
  },
};

const SIZE = 400;
const PAD = 26;
const WIDTH = SIZE + 2 * PAD;

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

// the multiples of `gap` from lo to hi
function marks(lo: number, hi: number, gap: number) {
  const out: number[] = [];
  for (let k = Math.ceil(lo / gap - 1e-9); k * gap <= hi + 1e-9; k++)
    out.push(Number((k * gap).toFixed(6)));
  return out;
}

export function CurveTracer({
  curve: startCurve = "line",
  caption = "Pick a mapping and move the time. The dot is the point at time t, and the trail behind it is the part of the curve traced so far, with a small dot at equal steps of time.",
}: {
  curve?: Name;
  caption?: string;
}) {
  const [name, setName] = useState<Name>(startCurve);
  const preset = PRESETS[name];
  const [t0, t1] = preset.t;
  const [t, setT] = useState(t0 + (t1 - t0) / 2);
  const [playing, setPlaying] = useState(false);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => () => cancelAnimationFrame(frame.current ?? 0), []);

  function stop() {
    cancelAnimationFrame(frame.current ?? 0);
    setPlaying(false);
  }

  function choose(next: Name) {
    stop();
    setName(next);
    const [a, b] = PRESETS[next].t;
    setT(a + (b - a) / 2);
  }

  // run the time steadily from where it is (or from the start, if at the end) to the end
  function play() {
    stop();
    const from = t >= t1 - 1e-6 ? t0 : t;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setT(t1);
      return;
    }
    const seconds = ((t1 - from) / (t1 - t0)) * 7;
    const begin = performance.now();
    setPlaying(true);
    const tick = (now: number) => {
      const s = Math.min(1, (now - begin) / 1000 / seconds);
      setT(from + (t1 - from) * s);
      if (s < 1) frame.current = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    frame.current = requestAnimationFrame(tick);
  }

  const {
    view: {
      x: [x0, x1],
      y: [y0, y1],
    },
  } = preset;
  const unit = SIZE / (x1 - x0);
  const px = (x: number) => PAD + (x - x0) * unit;
  const py = (y: number) => PAD + (y1 - y) * unit;
  const axisX = x0 <= 0 && 0 <= x1 ? 0 : x0;
  const axisY = y0 <= 0 && 0 <= y1 ? 0 : y0;

  // the trail: the curve from the start time up to t
  const steps = Math.max(2, Math.ceil(((t - t0) / (t1 - t0)) * 360));
  const trail =
    t - t0 < 1e-9
      ? ""
      : Array.from({ length: steps + 1 }, (_, i) => {
          const s = t0 + ((t - t0) * i) / steps;
          return `${px(preset.x(s)).toFixed(1)},${py(preset.y(s)).toFixed(1)}`;
        }).join(" ");
  const ticks: number[] = [];
  for (let k = 0; t0 + k * preset.mark <= t + 1e-9; k++)
    ticks.push(t0 + k * preset.mark);

  const x = preset.x(t);
  const y = preset.y(t);
  const shownTime = preset.time ? preset.time(t) : format(t);

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div className="text-sm font-normal text-fd-muted-foreground">
            {preset.formula}
          </div>
          <div>
            <i>t</i> = {shownTime}: (<i>x</i>, <i>y</i>) = ({format(x)},{" "}
            {format(y)})
          </div>
        </>
      }
      controls={
        <>
          <Choice
            value={name}
            onChange={choose}
            options={(Object.keys(PRESETS) as Name[]).map((key) => ({
              value: key,
              label: PRESETS[key].label,
            }))}
          />
          <Slider
            label={
              <>
                time <i>t</i>
              </>
            }
            value={t}
            onChange={(v) => {
              stop();
              setT(v);
            }}
            min={t0}
            max={t1}
            step={(t1 - t0) / 240}
          />
          <Button onClick={playing ? stop : play}>
            {playing ? "Stop" : "Play"}
          </Button>
        </>
      }
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${WIDTH}`}
        className="mx-auto block h-auto w-full max-w-md text-fd-foreground"
        role="img"
        aria-label={`The mapping ${preset.formula}, traced from t = ${format(t0)} up to t = ${format(t)}. The moving point is now at (${format(x)}, ${format(y)}).`}
      >
        <g className="text-fd-border" stroke="currentColor" strokeWidth={1}>
          {marks(x0, x1, preset.step).map((v) => (
            <line key={`v${v}`} x1={px(v)} x2={px(v)} y1={py(y0)} y2={py(y1)} />
          ))}
          {marks(y0, y1, preset.step).map((v) => (
            <line key={`h${v}`} x1={px(x0)} x2={px(x1)} y1={py(v)} y2={py(v)} />
          ))}
        </g>
        <g stroke="currentColor" strokeWidth={1.5}>
          <line x1={px(x0)} x2={px(x1) + 10} y1={py(axisY)} y2={py(axisY)} />
          <line x1={px(axisX)} x2={px(axisX)} y1={py(y0)} y2={py(y1) - 10} />
        </g>
        <polygon
          fill="currentColor"
          points={`${px(x1) + 14},${py(axisY)} ${px(x1) + 6},${py(axisY) - 4} ${px(x1) + 6},${py(axisY) + 4}`}
        />
        <polygon
          fill="currentColor"
          points={`${px(axisX)},${py(y1) - 14} ${px(axisX) - 4},${py(y1) - 6} ${px(axisX) + 4},${py(y1) - 6}`}
        />
        <text
          x={px(x1) + 4}
          y={py(axisY) - 10}
          fontSize={14}
          fontStyle="italic"
          fill="currentColor"
        >
          x
        </text>
        <text
          x={px(axisX) + 10}
          y={py(y1) - 4}
          fontSize={14}
          fontStyle="italic"
          fill="currentColor"
        >
          y
        </text>
        <g fontSize={11} className="fill-fd-muted-foreground" {...halo}>
          {marks(x0, x1, preset.every)
            .filter((v) => v !== axisX)
            .map((v) => (
              <text
                key={`tx${v}`}
                x={px(v)}
                y={py(axisY) + 15}
                textAnchor="middle"
              >
                {format(v)}
              </text>
            ))}
          {marks(y0, y1, preset.every)
            .filter((v) => v !== axisY)
            .map((v) => (
              <text
                key={`ty${v}`}
                x={px(axisX) - 6}
                y={py(v) + 4}
                textAnchor="end"
              >
                {format(v)}
              </text>
            ))}
        </g>

        {name === "ball" && (
          <>
            {/* the cliff, left of the y-axis, and the ground */}
            <rect
              x={px(-2)}
              y={py(20)}
              width={px(0) - px(-2)}
              height={py(0) - py(20)}
              fill="#a8a29e"
              fillOpacity={0.45}
              stroke="#78716c"
              strokeWidth={1.5}
            />
            <line
              x1={px(x0)}
              x2={px(x1)}
              y1={py(0)}
              y2={py(0)}
              stroke={COLORS.green}
              strokeWidth={3}
            />
          </>
        )}

        {trail && (
          <polyline
            points={trail}
            fill="none"
            stroke={COLORS.blue}
            strokeWidth={3}
            strokeLinejoin="round"
          />
        )}
        {ticks.map((s) => (
          <circle
            key={s}
            cx={px(preset.x(s))}
            cy={py(preset.y(s))}
            r={3}
            fill={COLORS.blue}
          />
        ))}
        <circle
          cx={px(x)}
          cy={py(y)}
          r={7}
          fill={COLORS.orange}
          stroke="var(--color-fd-card)"
          strokeWidth={2}
        />
      </svg>
    </Interactive>
  );
}
