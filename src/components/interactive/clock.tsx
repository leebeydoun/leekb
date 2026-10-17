"use client";

/**
 * A clock face with `hours` places, numbered 0 upwards from the top. A number's hand lands on its
 * remainder, so numbers that are congruent land in the same place. "Add" moves the hand round,
 * one place at a time.
 */

import { useState } from "react";
import { Button, COLORS, Interactive, Slider, mix, useAnimation } from "./kit";

type ClockArithmeticProps = {
  /** how many places round the clock, 12 unless given */
  hours?: number;
  /** the number to start on */
  value?: number;
  /** how much "add" adds, 5 unless given */
  step?: number;
  /** the largest number on the slider, 40 unless given */
  max?: number;
  caption?: string;
};

const SIZE = 280;
const C = SIZE / 2;
const R = 110;

// the point at distance r from the centre, for position p round a clock of n places
function at(p: number, n: number, r: number) {
  const angle = (p / n) * 2 * Math.PI - Math.PI / 2;
  return { x: C + r * Math.cos(angle), y: C + r * Math.sin(angle) };
}

// n = q·d + r written out, e.g. "17 = 12 + 5" or "29 = 2 · 12 + 5"
function split(n: number, d: number) {
  const q = Math.floor(n / d);
  const r = n - q * d;
  if (q === 0) return `${n} = ${r}`;
  const turns = q === 1 ? `${d}` : `${q} · ${d}`;
  return r === 0 ? `${n} = ${turns}` : `${n} = ${turns} + ${r}`;
}

export function ClockArithmetic({
  hours = 12,
  value = 17,
  step = 5,
  max = 40,
  caption,
}: ClockArithmeticProps) {
  const [n, setN] = useState(value);
  const [k, setK] = useState(step);
  // the last "add", so the hand can be drawn moving from one number to the next
  const [move, setMove] = useState<{ from: number; to: number } | null>(null);
  const turn = useAnimation(400 + 120 * k);

  const shown = move ? mix(move.from, move.to, turn.progress) : n;
  const r = n % hours;
  const hand = at(shown, hours, R - 28);

  // the numbers up to max that land in the same place as n
  const same: number[] = [];
  for (let m = r; m <= max; m += hours) same.push(m);

  // the path the hand has swept during an "add", as a polyline just inside the numbers
  const path: string[] = [];
  if (move && turn.progress > 0) {
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const p = mix(move.from, shown, i / steps);
      const { x, y } = at(p, hours, R - 46);
      path.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
  }

  const places = Array.from({ length: hours }, (_, i) => i);

  return (
    <Interactive
      readout={
        <>
          <div>
            {move && turn.playing
              ? `${move.from} + ${move.to - move.from} = …`
              : move
                ? `${move.from} + ${move.to - move.from} = ${n} lands on ${r}, since ${split(n, hours)}`
                : `${n} lands on ${r}, since ${split(n, hours)}`}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {turn.playing
              ? "\u00a0"
              : `Also landing on ${r}: ${same.join(", ")}, …`}
          </div>
        </>
      }
      controls={
        <>
          <Slider
            label="number"
            value={n}
            onChange={(v) => {
              turn.reset();
              setMove(null);
              setN(v);
            }}
            min={0}
            max={max}
          />
          <Slider label="add" value={k} onChange={setK} min={1} max={hours} />
          <Button
            primary
            disabled={turn.playing || n + k > max}
            onClick={() => {
              setMove({ from: n, to: n + k });
              setN(n + k);
              turn.reset();
              turn.play();
            }}
          >
            Add {k}
          </Button>
        </>
      }
      caption={caption}
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="mx-auto block h-auto w-full max-w-xs text-fd-foreground"
        aria-label={`A clock with ${hours} places, numbered 0 to ${hours - 1}. The hand for ${n} points at ${r}.`}
      >
        <circle
          cx={C}
          cy={C}
          r={R + 18}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        />
        {places.map((p) => {
          const tick = at(p, hours, R + 10);
          const tickEnd = at(p, hours, R + 18);
          const label = at(p, hours, R - 8);
          const here = p === r && !turn.playing;
          return (
            <g key={p}>
              <line
                x1={tick.x}
                y1={tick.y}
                x2={tickEnd.x}
                y2={tickEnd.y}
                stroke="currentColor"
                strokeWidth={1.5}
              />
              {here && (
                <circle cx={label.x} cy={label.y} r={14} fill={COLORS.blue} />
              )}
              <text
                x={label.x}
                y={label.y + 5}
                textAnchor="middle"
                fontSize={hours > 16 ? 11 : 15}
                fontWeight={here ? 700 : 400}
                fill={here ? "white" : "currentColor"}
                className={here ? undefined : "fill-fd-muted-foreground"}
              >
                {p}
              </text>
            </g>
          );
        })}
        {path.length > 0 && (
          <polyline
            points={path.join(" ")}
            fill="none"
            stroke={COLORS.orange}
            strokeWidth={3}
            strokeLinecap="round"
            strokeOpacity={0.8}
          />
        )}
        <line
          x1={C}
          y1={C}
          x2={hand.x}
          y2={hand.y}
          stroke={COLORS.blue}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <circle cx={C} cy={C} r={6} fill={COLORS.blue} />
        {/* the number the hand is on, counting up as it moves */}
        <text x={6} y={22} fontSize={18} fontWeight={700} fill={COLORS.blue}>
          {Math.round(shown)}
        </text>
      </svg>
    </Interactive>
  );
}
