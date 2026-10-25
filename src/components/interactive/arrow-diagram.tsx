"use client";

/**
 * A cloakroom drawn as an arrow picture: things handed in as dots on the left, hooks as dots on the
 * right. Tap a thing and then a hook to draw the thing's arrow; tapping another hook moves it, since
 * a thing hangs on one hook only. Each hook shows how many arrows arrive at it. With
 * `report="mapping"` the readout says whether each thing has its arrow yet, which is what makes
 * the rule a mapping. With `report="full"` it also says whether the mapping is one to one (at most
 * one arrow arrives at each hook) and onto (at least one does), and names the hook that fails.
 */

import { useState, type KeyboardEvent } from "react";
import { Button, Choice, COLORS, Interactive } from "./kit";

type Preset = {
  id: string;
  label: string;
  things: string[];
  hooks: string[];
  /** the hook each thing starts on, by position, or null for no arrow yet */
  start: (number | null)[];
};

const PRESETS: Preset[] = [
  {
    id: "four-three",
    label: "4 things, 3 hooks",
    things: ["coat", "hat", "scarf", "umbrella"],
    hooks: ["A", "B", "C"],
    start: [0, null, 0, 2],
  },
  {
    id: "three-three",
    label: "3 things, 3 hooks",
    things: ["coat", "hat", "scarf"],
    hooks: ["A", "B", "C"],
    start: [1, 1, 0],
  },
  {
    id: "three-four",
    label: "3 things, 4 hooks",
    things: ["coat", "hat", "scarf"],
    hooks: ["A", "B", "C", "D"],
    start: [0, 2, 3],
  },
];

// the frame: things in a column on the left, hooks on the right, at most four of each
const WIDTH = 520;
const HEIGHT = 290;
const THINGS_X = 170;
const HOOKS_X = 350;
const GAP = 58;
const MIDDLE = 160;
const row = (i: number, n: number) => MIDDLE + (i - (n - 1) / 2) * GAP;
const DOT = 11;

const NUMBER_WORDS = ["no", "one", "two", "three", "four"];

/** "the hat", "the hat and the scarf", "the coat, the hat and the scarf" */
function namesList(names: string[]) {
  const the = names.map((n) => `the ${n}`);
  if (the.length <= 1) return the.join("");
  return `${the.slice(0, -1).join(", ")} and ${the[the.length - 1]}`;
}

/** "hook B", "hooks B and D" */
function hooksList(names: string[]) {
  if (names.length === 1) return `hook ${names[0]}`;
  return `hooks ${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/** an arrow in pixels from (x1, y1) to (x2, y2), its head at the second point */
function ArrowLine({
  x1,
  y1,
  x2,
  y2,
  color,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const bx = x2 - ux * 12;
  const by = y2 - uy * 12;
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2 - ux * 9}
        y2={y2 - uy * 9}
        stroke={color}
        strokeWidth={3}
      />
      <polygon
        points={`${x2},${y2} ${bx - uy * 6},${by + ux * 6} ${bx + uy * 6},${by - ux * 6}`}
        fill={color}
      />
    </g>
  );
}

export function ArrowDiagram({
  report = "mapping",
  start,
  caption,
}: {
  /** "mapping": say whether each thing has an arrow; "full": also report one to one and onto */
  report?: "mapping" | "full";
  /** the id of the preset shown first */
  start?: string;
  caption?: string;
}) {
  const first =
    PRESETS.find((p) => p.id === start) ??
    (report === "full" ? PRESETS[1]! : PRESETS[0]!);
  const [presetId, setPresetId] = useState(first.id);
  const preset = PRESETS.find((p) => p.id === presetId) ?? first;
  const [arrows, setArrows] = useState<(number | null)[]>(first.start);
  const [chosen, setChosen] = useState<number | null>(null);
  const [nudge, setNudge] = useState(false);

  const full = report === "full";
  const { things, hooks } = preset;

  function pickPreset(id: string) {
    const next = PRESETS.find((p) => p.id === id) ?? first;
    setPresetId(next.id);
    setArrows(next.start);
    setChosen(null);
    setNudge(false);
  }

  function tapThing(i: number) {
    setChosen(chosen === i ? null : i);
    setNudge(false);
  }

  function tapHook(j: number) {
    if (chosen === null) {
      setNudge(true);
      return;
    }
    setArrows(arrows.map((h, i) => (i === chosen ? j : h)));
    setChosen(null);
    setNudge(false);
  }

  // how many arrows arrive at each hook
  const arriving = hooks.map((_, j) => arrows.filter((h) => h === j).length);
  const missing = things.filter((_, i) => arrows[i] === null);
  const isMapping = missing.length === 0;
  const crowded = hooks.map((_, j) => j).filter((j) => arriving[j]! >= 2);
  const empty = hooks.map((_, j) => j).filter((j) => arriving[j] === 0);

  let verdict: string;
  if (!isMapping) {
    verdict = `Not yet a mapping: ${namesList(missing)} ${missing.length === 1 ? "has" : "have"} no arrow.`;
  } else if (!full) {
    verdict =
      "A mapping: each thing has exactly one arrow leaving it, wherever the arrows arrive.";
  } else if (crowded.length === 0 && empty.length === 0) {
    verdict =
      "One to one: yes. Onto: yes. Exactly one arrow arrives at each hook.";
  } else {
    const c = crowded[0]!;
    const one =
      crowded.length === 0
        ? "One to one: yes, no hook gets two arrows."
        : `One to one: no, ${NUMBER_WORDS[arriving[c]!]} arrows arrive at hook ${hooks[c]}.`;
    const onto =
      empty.length === 0
        ? "Onto: yes, every hook gets an arrow."
        : `Onto: no, ${hooksList(empty.map((j) => hooks[j]!))} ${empty.length === 1 ? "gets" : "get"} no arrow.`;
    verdict = `${one} ${onto}`;
  }

  let hint: string;
  if (chosen !== null) hint = `Now tap the hook for the ${things[chosen]}.`;
  else if (nudge) hint = "Tap a thing on the left first, then its hook.";
  else if (full && isMapping && things.length > hooks.length)
    hint = `With ${things.length} things and ${hooks.length} hooks, some hook always gets two arrows.`;
  else hint = "Tap a thing on the left, then a hook on the right.";

  const arrowColor = (h: number) =>
    full && arriving[h]! >= 2 ? COLORS.orange : COLORS.blue;

  const keyed = (action: () => void) => (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  const arrowText = things
    .map((t, i) =>
      arrows[i] === null
        ? `the ${t} has no arrow`
        : `the ${t} goes to hook ${hooks[arrows[i]!]}`,
    )
    .join(", ");

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>{verdict}</div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {hint}
          </div>
        </>
      }
      controls={
        <>
          <Choice
            label="cloakroom"
            value={presetId}
            onChange={pickPreset}
            options={PRESETS.map((p) => ({ value: p.id, label: p.label }))}
          />
          <Button
            onClick={() => {
              setArrows(things.map(() => null));
              setChosen(null);
              setNudge(false);
            }}
          >
            clear arrows
          </Button>
        </>
      }
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-xl text-fd-foreground"
        role="group"
        aria-label={`An arrow picture of a cloakroom with ${things.length} things and ${hooks.length} hooks: ${arrowText}. ${verdict}`}
      >
        <text
          x={THINGS_X}
          y={30}
          textAnchor="middle"
          fontSize={14}
          className="fill-fd-muted-foreground"
        >
          things
        </text>
        <text
          x={HOOKS_X}
          y={30}
          textAnchor="middle"
          fontSize={14}
          className="fill-fd-muted-foreground"
        >
          hooks
        </text>

        {/* the two sets, as rounded outlines round each column */}
        {[
          [THINGS_X, things.length],
          [HOOKS_X, hooks.length],
        ].map(([x, n]) => (
          <rect
            key={x}
            x={x! - 32}
            y={row(0, n!) - 30}
            width={64}
            height={(n! - 1) * GAP + 60}
            rx={30}
            fill="currentColor"
            fillOpacity={0.04}
            stroke="currentColor"
            strokeOpacity={0.35}
          />
        ))}

        {arrows.map((h, i) =>
          h === null ? null : (
            <ArrowLine
              key={i}
              x1={THINGS_X + DOT + 4}
              y1={row(i, things.length)}
              x2={HOOKS_X - DOT - 4}
              y2={row(h, hooks.length)}
              color={arrowColor(h)}
            />
          ),
        )}

        {things.map((t, i) => {
          const y = row(i, things.length);
          const none = arrows[i] === null;
          const picked = chosen === i;
          return (
            <g
              key={t}
              role="button"
              tabIndex={0}
              aria-label={`${t}${none ? ", no arrow yet" : `, on hook ${hooks[arrows[i]!]}`}`}
              aria-pressed={picked}
              onClick={() => tapThing(i)}
              onKeyDown={keyed(() => tapThing(i))}
              className="cursor-pointer outline-none"
            >
              <circle cx={THINGS_X} cy={y} r={24} fill="transparent" />
              {picked && (
                <circle
                  cx={THINGS_X}
                  cy={y}
                  r={DOT + 7}
                  fill="none"
                  stroke={COLORS.purple}
                  strokeWidth={3}
                />
              )}
              <circle
                cx={THINGS_X}
                cy={y}
                r={DOT}
                fill={none ? "var(--color-fd-card)" : COLORS.blue}
                stroke={none ? COLORS.orange : COLORS.blue}
                strokeWidth={3}
              />
              <text
                x={THINGS_X - 46}
                y={y + 5}
                textAnchor="end"
                fontSize={16}
                fontWeight={picked ? 700 : 500}
                fill={none ? COLORS.orange : "currentColor"}
              >
                {t}
              </text>
            </g>
          );
        })}

        {hooks.map((name, j) => {
          const y = row(j, hooks.length);
          const count = arriving[j]!;
          const flag = full && (count === 0 || count >= 2);
          return (
            <g
              key={name}
              role="button"
              tabIndex={0}
              aria-label={`hook ${name}, ${count} ${count === 1 ? "arrow arrives" : "arrows arrive"}`}
              onClick={() => tapHook(j)}
              onKeyDown={keyed(() => tapHook(j))}
              className="cursor-pointer outline-none"
            >
              <circle cx={HOOKS_X} cy={y} r={24} fill="transparent" />
              <circle
                cx={HOOKS_X}
                cy={y}
                r={DOT}
                fill={count === 0 ? "var(--color-fd-card)" : COLORS.green}
                stroke={flag ? COLORS.orange : COLORS.green}
                strokeWidth={3}
              />
              <text
                x={HOOKS_X + 46}
                y={y}
                fontSize={16}
                fontWeight={500}
                fill="currentColor"
              >
                hook {name}
              </text>
              <text
                x={HOOKS_X + 46}
                y={y + 18}
                fontSize={13}
                fill={flag ? COLORS.orange : "currentColor"}
                className={flag ? undefined : "fill-fd-muted-foreground"}
              >
                {count === 1 ? "1 arrow in" : `${count} arrows in`}
              </text>
            </g>
          );
        })}
      </svg>
    </Interactive>
  );
}
