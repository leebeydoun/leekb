"use client";

/**
 * Two ships, each sailing a straight track at a steady speed. Ship 1 is at P + tA and ship 2 at
 * Q + tB, t hours after noon. A time slider (or the Play button) moves both dots along their
 * lines; the point where the two tracks cross is marked. The readout gives both positions and the
 * distance between the ships, and says whether they reach the crossing at the same time. Two
 * presets: the tracks cross but the ships miss, and the ships collide.
 */

import { useEffect, useRef, useState } from "react";
import { clipLine, Grid, gridScale } from "./grid";
import { Button, Choice, COLORS, format, Interactive, Slider } from "./kit";

const X_RANGE: [number, number] = [-1, 9];
const Y_RANGE: [number, number] = [-2, 6];
const T_MAX = 2.5;

type Pair = [number, number];

// ship 1 is the same in both presets; ship 2 keeps its velocity and changes its noon position
const P: Pair = [1, 2];
const A: Pair = [3, 1];
const B: Pair = [1, 2];
const PRESETS = {
  miss: { Q: [2, -1] as Pair, label: "Paths cross, they miss" },
  collide: { Q: [3, 1] as Pair, label: "They collide" },
};
type Preset = keyof typeof PRESETS;

const at = (start: Pair, step: Pair, t: number): Pair => [
  start[0] + t * step[0],
  start[1] + t * step[1],
];

/** where the lines start + t·step and other + s·dir cross, with both parameters */
function crossing(start: Pair, step: Pair, other: Pair, dir: Pair) {
  const det = step[0] * dir[1] - step[1] * dir[0];
  if (det === 0) return undefined;
  const r0 = other[0] - start[0];
  const r1 = other[1] - start[1];
  // solve t·step − s·dir = other − start by eliminating one unknown at a time
  const t = (r0 * dir[1] - r1 * dir[0]) / det;
  const s = (r0 * step[1] - r1 * step[0]) / det;
  return { t, s, point: at(start, step, t) };
}

const pair = ([x, y]: Pair) => `(${format(x)}, ${format(y)})`;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

export function CrossingPaths({
  caption = "Move the time t, or press Play. The tracks always cross at X, but the ships collide only if they reach X at the same time.",
}: {
  caption?: string;
}) {
  const [preset, setPreset] = useState<Preset>("miss");
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => () => cancelAnimationFrame(frame.current ?? 0), []);

  function play() {
    cancelAnimationFrame(frame.current ?? 0);
    if (prefersReducedMotion()) {
      setT(T_MAX);
      return;
    }
    // two seconds of animation for each hour of sailing
    const start = performance.now();
    setPlaying(true);
    const tick = (now: number) => {
      const hours = Math.min(T_MAX, (now - start) / 2000);
      setT(Math.round(hours * 100) / 100);
      if (hours < T_MAX) frame.current = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    frame.current = requestAnimationFrame(tick);
  }

  function choose(next: Preset) {
    cancelAnimationFrame(frame.current ?? 0);
    setPlaying(false);
    setPreset(next);
    setT(0);
  }

  function slide(value: number) {
    cancelAnimationFrame(frame.current ?? 0);
    setPlaying(false);
    setT(value);
  }

  const { Q } = PRESETS[preset];
  const { px, py } = gridScale(X_RANGE, Y_RANGE);
  const ship1 = at(P, A, t);
  const ship2 = at(Q, B, t);
  const gap = Math.hypot(ship1[0] - ship2[0], ship1[1] - ship2[1]);
  const together = gap < 0.005;
  const cross = crossing(P, A, Q, B)!;
  const X = cross.point;

  // each track drawn across the whole grid, faint, with the part sailed since noon on top
  const track = (start: Pair, step: Pair) =>
    clipLine(
      step[1],
      -step[0],
      step[1] * start[0] - step[0] * start[1],
      X_RANGE,
      Y_RANGE,
    );
  const halo = {
    stroke: "var(--color-fd-card)",
    strokeWidth: 5,
    strokeLinejoin: "round" as const,
    paintOrder: "stroke" as const,
  };

  const ships = [
    { start: P, step: A, now: ship1, color: COLORS.blue, name: "1", dy: -14 },
    { start: Q, step: B, now: ship2, color: COLORS.orange, name: "2", dy: 24 },
  ];

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>
            t = {format(t)} h: ship 1 at {pair(ship1)}, ship 2 at {pair(ship2)}
          </div>
          <div className="mt-1">
            {together
              ? "Both ships are at the same point: they collide."
              : `The ships are ${format(gap)} km apart.`}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {preset === "miss"
              ? `The tracks cross at X = ${pair(X)}. Ship 1 passes X at t = ${format(cross.t)} and ship 2 at t = ${format(cross.s)}, so they never meet.`
              : `The tracks cross at X = ${pair(X)}, and both ships pass X at t = ${format(cross.t)}, so they collide there.`}
          </div>
        </>
      }
      controls={
        <>
          <Choice
            value={preset}
            onChange={choose}
            options={(Object.keys(PRESETS) as Preset[]).map((key) => ({
              value: key,
              label: PRESETS[key].label,
            }))}
          />
          <Slider
            label="time t (hours after noon)"
            value={t}
            onChange={slide}
            min={0}
            max={T_MAX}
            step={0.05}
          />
          <Button onClick={play} primary disabled={playing}>
            Play
          </Button>
        </>
      }
    >
      <Grid
        x={X_RANGE}
        y={Y_RANGE}
        label={`Two ships on straight tracks crossing at ${pair(X)}. At t = ${format(t)}, ship 1 is at ${pair(ship1)} and ship 2 at ${pair(ship2)}.`}
      >
        {ships.map((ship) => {
          const ends = track(ship.start, ship.step);
          return (
            <g key={ship.name}>
              {ends && (
                <line
                  x1={px(ends[0][0])}
                  y1={py(ends[0][1])}
                  x2={px(ends[1][0])}
                  y2={py(ends[1][1])}
                  stroke={ship.color}
                  strokeOpacity={0.45}
                  strokeWidth={2}
                  strokeDasharray="6 5"
                />
              )}
              <line
                x1={px(ship.start[0])}
                y1={py(ship.start[1])}
                x2={px(ship.now[0])}
                y2={py(ship.now[1])}
                stroke={ship.color}
                strokeWidth={3}
                strokeLinecap="round"
              />
              {/* where the ship was at noon */}
              <circle
                cx={px(ship.start[0])}
                cy={py(ship.start[1])}
                r={3.5}
                fill="var(--color-fd-card)"
                stroke={ship.color}
                strokeWidth={2}
              />
            </g>
          );
        })}

        {/* the crossing point of the two tracks */}
        <circle
          cx={px(X[0])}
          cy={py(X[1])}
          r={10}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        />
        <text
          x={px(X[0]) - 14}
          y={py(X[1]) - 10}
          textAnchor="end"
          fontSize={15}
          fontWeight={700}
          fill="currentColor"
          {...halo}
        >
          X
        </text>

        {/* the gap between the ships */}
        {!together && (
          <line
            x1={px(ship1[0])}
            y1={py(ship1[1])}
            x2={px(ship2[0])}
            y2={py(ship2[1])}
            stroke="currentColor"
            strokeOpacity={0.6}
            strokeWidth={1.5}
            strokeDasharray="3 4"
          />
        )}

        {ships.map((ship) => (
          <g key={ship.name}>
            <circle
              cx={px(ship.now[0])}
              cy={py(ship.now[1])}
              r={7}
              fill={ship.color}
              stroke="var(--color-fd-card)"
              strokeWidth={2}
            />
            <text
              x={px(ship.now[0])}
              y={py(ship.now[1]) + ship.dy}
              textAnchor="middle"
              fontSize={14}
              fontWeight={700}
              fill={ship.color}
              {...halo}
            >
              {ship.name}
            </text>
          </g>
        ))}
      </Grid>
    </Interactive>
  );
}
