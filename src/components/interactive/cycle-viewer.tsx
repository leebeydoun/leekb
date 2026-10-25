"use client";

/**
 * A permutation of the places 1 to 8, drawn as a row of places on top and the same row underneath,
 * with an arrow from each place to the place its card goes to. Tapping a place lights up its cycle
 * and writes it in brackets. Below, a row of eight cards shows the deck after the shuffle has been
 * applied some number of times: "apply again" shuffles once more, and the readout counts the
 * presses and says when every card is back where it started.
 */

import { useState } from "react";
import { Button, Choice, COLORS, Interactive } from "./kit";

type Preset = "out" | "in" | "mixed";

// each permutation as its bottom row: where the card at place 1, 2, ..., 8 goes
const PRESETS: Record<Preset, { name: string; bottom: number[] }> = {
  out: { name: "out-shuffle", bottom: [1, 3, 5, 7, 2, 4, 6, 8] },
  in: { name: "in-shuffle", bottom: [2, 4, 6, 8, 1, 3, 5, 7] },
  mixed: { name: "mixed permutation", bottom: [6, 8, 1, 2, 7, 3, 4, 5] },
};

const N = 8;
const PLACES = Array.from({ length: N }, (_, i) => i + 1);
const MUTED = "#9ca3af";

/** sigma as a function of the place, 1 to 8 */
const goes = (bottom: number[]) => (p: number) => bottom[p - 1]!;

/** the cycle through p: p, sigma(p), sigma(sigma(p)), ... until it comes back */
function cycleOf(bottom: number[], p: number) {
  const sigma = goes(bottom);
  const cycle = [p];
  for (let q = sigma(p); q !== p; q = sigma(q)) cycle.push(q);
  return cycle;
}

/** all the cycles, each starting from its smallest number */
function cyclesOf(bottom: number[]) {
  const seen = new Set<number>();
  const cycles: number[][] = [];
  for (const p of PLACES) {
    if (seen.has(p)) continue;
    const c = cycleOf(bottom, p);
    c.forEach((q) => seen.add(q));
    cycles.push(c);
  }
  return cycles;
}

/** where the card that started at place c is after k shuffles */
function after(bottom: number[], c: number, k: number) {
  const sigma = goes(bottom);
  let p = c;
  for (let i = 0; i < k; i++) p = sigma(p);
  return p;
}

const WIDTH = 640;
const HEIGHT = 330;
const LEFT = 92;
const STEP = 70;
const Y_TOP = 46;
const Y_BOTTOM = 166;
const Y_CARDS = 246;
const R = 17;
const px = (p: number) => LEFT + (p - 1) * STEP;

const bracket = (c: number[]) => `[${c.join(", ")}]`;

export function CycleViewer({
  start = "out",
  caption = "Each arrow runs from a place to the place its card goes to in one shuffle. Tap a place to light up its cycle, and press apply again to shuffle the cards in the bottom row once more.",
}: {
  start?: Preset;
  caption?: string;
}) {
  const [preset, setPreset] = useState<Preset>(start);
  const [chosen, setChosen] = useState<number | null>(2);
  const [presses, setPresses] = useState(0);

  const { bottom, name } = PRESETS[preset];
  const sigma = goes(bottom);
  const cycles = cyclesOf(bottom);
  const lit = chosen === null ? [] : cycleOf(bottom, chosen);
  const isLit = (p: number) => lit.includes(p);

  // the card on each place after the presses so far
  const cardAt = new Map<number, number>();
  for (const c of PLACES) cardAt.set(after(bottom, c, presses), c);
  const home = PLACES.filter((c) => after(bottom, c, presses) === c).length;

  const choose = (p: number) => setChosen(p);
  const switchTo = (next: Preset) => {
    setPreset(next);
    setPresses(0);
    setChosen(2);
  };

  let status: string;
  if (presses === 0) {
    status = "No presses yet: every card is in its starting place.";
  } else if (home === N) {
    status = `After ${presses} ${presses === 1 ? "press" : "presses"} every card is back where it started.`;
  } else {
    status = `After ${presses} ${presses === 1 ? "press" : "presses"}: ${home} of the 8 cards ${home === 1 ? "is" : "are"} back in ${home === 1 ? "its" : "their"} starting place.`;
  }

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>
            {chosen === null ? (
              "Tap a place to see its cycle."
            ) : (
              <>
                The cycle of {chosen} is{" "}
                <span style={{ color: COLORS.orange }}>{bracket(lit)}</span>, of
                length {lit.length}.
              </>
            )}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            The {name} has cycles {cycles.map(bracket).join("")}. {status}
          </div>
        </>
      }
      controls={
        <>
          <Choice
            label="permutation"
            value={preset}
            onChange={switchTo}
            options={[
              { value: "out", label: "out-shuffle" },
              { value: "in", label: "in-shuffle" },
              { value: "mixed", label: "mixed" },
            ]}
          />
          <Button primary onClick={() => setPresses((k) => k + 1)}>
            apply again
          </Button>
          <Button onClick={() => setPresses(0)}>reset</Button>
        </>
      }
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-2xl text-fd-foreground"
        role="img"
        aria-label={`The ${name} of eight places, with an arrow from each place to where its card goes. The cycles are ${cycles.map(bracket).join(", ")}. ${status}`}
      >
        <g fontSize={13} className="fill-fd-muted-foreground">
          <text x={18} y={Y_TOP + 5}>
            place
          </text>
          {/* two short lines, so the label stays clear of place 1 when phones enlarge the text */}
          <text x={18} y={Y_BOTTOM - 3}>
            goes
          </text>
          <text x={18} y={Y_BOTTOM + 13}>
            to
          </text>
          <text x={18} y={Y_CARDS + 2}>
            cards
          </text>
          <text x={18} y={Y_CARDS + 18}>
            now
          </text>
        </g>

        {/* an arrow from each place on top to where its card goes, the lit cycle drawn on top */}
        {[...PLACES]
          .sort((a, b) => Number(isLit(a)) - Number(isLit(b)))
          .map((p) => {
            const x1 = px(p);
            const x2 = px(sigma(p));
            const y1 = Y_TOP + R + 2;
            const y2 = Y_BOTTOM - R - 3;
            const len = Math.hypot(x2 - x1, y2 - y1);
            const ux = (x2 - x1) / len;
            const uy = (y2 - y1) / len;
            const bx = x2 - ux * 11;
            const by = y2 - uy * 11;
            const color = isLit(p) ? COLORS.orange : MUTED;
            return (
              <g key={p}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2 - ux * 8}
                  y2={y2 - uy * 8}
                  stroke={color}
                  strokeWidth={isLit(p) ? 3.5 : 2}
                  strokeOpacity={isLit(p) ? 1 : 0.7}
                />
                <polygon
                  points={`${x2},${y2} ${bx - uy * 5},${by + ux * 5} ${bx + uy * 5},${by - ux * 5}`}
                  fill={color}
                />
              </g>
            );
          })}

        {/* the two rows of places; the top ones can be tapped */}
        {PLACES.map((p) => (
          <g
            key={`top-${p}`}
            role="button"
            tabIndex={0}
            aria-label={`show the cycle of ${p}`}
            aria-pressed={chosen === p}
            onClick={() => choose(p)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                choose(p);
              }
            }}
            className="cursor-pointer"
          >
            <circle cx={px(p)} cy={Y_TOP} r={R + 6} fill="transparent" />
            <circle
              cx={px(p)}
              cy={Y_TOP}
              r={R}
              fill={isLit(p) ? COLORS.orange : "var(--color-fd-card)"}
              fillOpacity={isLit(p) ? 0.2 : 1}
              stroke={isLit(p) ? COLORS.orange : "currentColor"}
              strokeWidth={chosen === p ? 3.5 : 2}
            />
            <text
              x={px(p)}
              y={Y_TOP + 5}
              textAnchor="middle"
              fontSize={16}
              fontWeight={600}
              fill="currentColor"
            >
              {p}
            </text>
          </g>
        ))}
        {PLACES.map((p) => (
          <g key={`bottom-${p}`}>
            <circle
              cx={px(p)}
              cy={Y_BOTTOM}
              r={R}
              fill={isLit(p) ? COLORS.orange : "var(--color-fd-card)"}
              fillOpacity={isLit(p) ? 0.2 : 1}
              stroke={isLit(p) ? COLORS.orange : "currentColor"}
              strokeWidth={2}
            />
            <text
              x={px(p)}
              y={Y_BOTTOM + 5}
              textAnchor="middle"
              fontSize={16}
              fontWeight={600}
              fill="currentColor"
            >
              {p}
            </text>
          </g>
        ))}

        {/* the cards after the presses so far: a card back in its own place is outlined green */}
        {PLACES.map((p) => {
          const c = cardAt.get(p)!;
          const atHome = c === p;
          return (
            <g key={`card-${p}`}>
              <rect
                x={px(p) - 22}
                y={Y_CARDS - 30}
                width={44}
                height={60}
                rx={6}
                fill={isLit(c) ? COLORS.orange : "var(--color-fd-card)"}
                fillOpacity={isLit(c) ? 0.2 : 1}
                stroke={atHome ? COLORS.green : "currentColor"}
                strokeWidth={atHome ? 3.5 : 1.5}
              />
              <text
                x={px(p)}
                y={Y_CARDS + 7}
                textAnchor="middle"
                fontSize={20}
                fontWeight={700}
                fill="currentColor"
              >
                {c}
              </text>
            </g>
          );
        })}
        <text
          x={WIDTH / 2}
          y={HEIGHT - 12}
          textAnchor="middle"
          fontSize={13}
          className="fill-fd-muted-foreground"
        >
          presses: {presses} · green outline: card back in its starting place
        </text>
      </svg>
    </Interactive>
  );
}
