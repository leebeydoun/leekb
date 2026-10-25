"use client";

/**
 * IterateMap: one mapping of the plane, applied again and again to a starting point X. Each press
 * of "apply again" adds the next point f^k(X) to the picture, joined to the one before, so the
 * powers of the mapping leave a trail. Two of the mappings come back to X (the turn by 2π/5 after
 * five presses, the quarter turn (x, y) ↦ (y, −x) after four), and the readout says so when it
 * happens; the turn by 1 radian, the slide and the zoom by ½ never come back, and the readout says
 * how far from home the trail has got.
 */

import { useState } from "react";
import { Grid, gridScale } from "./grid";
import { Button, COLORS, Interactive, format } from "./kit";

type Pt = [number, number];
type MapName = "turn-fifth" | "turn-radian" | "slide" | "zoom" | "quarter";

const X: [number, number] = [-5, 5];
const Y: [number, number] = [-5, 5];

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

const turn =
  (a: number) =>
  ([x, y]: Pt): Pt => [
    x * Math.cos(a) - y * Math.sin(a),
    x * Math.sin(a) + y * Math.cos(a),
  ];

const MAPS: {
  id: MapName;
  name: string;
  /** the mapping's letter, so the readout can write F³(X) */
  letter: string;
  start: Pt;
  apply: (p: Pt) => Pt;
  /** how many presses bring every point home, for the two that come back */
  period?: number;
  /** whether the trail goes round a circle about O, drawn faintly */
  circle?: boolean;
  /** the most presses allowed, so the readout's numbers stay readable */
  max: number;
}[] = [
  {
    id: "turn-fifth",
    name: "turn by 2π/5 about O",
    letter: "G",
    start: [3, 1],
    apply: turn((2 * Math.PI) / 5),
    period: 5,
    circle: true,
    max: 40,
  },
  {
    id: "turn-radian",
    name: "turn by 1 radian about O",
    letter: "G",
    start: [3, 1],
    apply: turn(1),
    circle: true,
    max: 100,
  },
  {
    id: "slide",
    name: "slide by (1, 0.5)",
    letter: "T",
    start: [-4, -2],
    apply: ([x, y]) => [x + 1, y + 0.5],
    max: 40,
  },
  {
    id: "zoom",
    name: "zoom by ½ toward O",
    letter: "Z",
    start: [4, 3],
    apply: ([x, y]) => [x / 2, y / 2],
    max: 10,
  },
  {
    id: "quarter",
    name: "(x, y) ↦ (y, −x)",
    letter: "F",
    start: [3, 1],
    apply: ([x, y]) => [y, -x],
    period: 4,
    circle: true,
    max: 40,
  },
];

const SUPERSCRIPT = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const power = (k: number) =>
  String(k)
    .split("")
    .map((d) => SUPERSCRIPT[Number(d)])
    .join("");

/** a point written with proper minus signs and at most two decimal places */
const point = ([x, y]: Pt) => `(${format(x)}, ${format(y)})`;

const inside = ([x, y]: Pt) =>
  x >= X[0] - 1e-9 && x <= X[1] + 1e-9 && y >= Y[0] - 1e-9 && y <= Y[1] + 1e-9;

export function IterateMap({
  start = "turn-fifth",
  caption = "Choose a mapping and press apply again. Each press adds the next point of the trail X, f(X), f²(X), …, joined to the one before.",
}: {
  /** the id of the mapping shown first */
  start?: MapName;
  caption?: string;
}) {
  const [id, setId] = useState<MapName>(start);
  const [presses, setPresses] = useState(0);
  const map = MAPS.find((m) => m.id === id) ?? MAPS[0]!;
  const { px, py } = gridScale(X, Y);

  // the trail X, f(X), …, f^presses(X)
  const trail: Pt[] = [map.start];
  for (let k = 1; k <= presses; k++) trail.push(map.apply(trail[k - 1]!));
  const last = trail[presses]!;
  const next = map.apply(last);
  const canPress = presses < map.max && inside(next);

  const f = map.letter;
  const now = presses === 0 ? "X" : `${f}${power(presses)}(X)`;
  const where = `After ${presses} ${presses === 1 ? "press" : "presses"}: ${now} = ${point(last)}.`;

  let verdict: string;
  if (presses === 0) {
    verdict = `Start at X = ${point(map.start)}, and press apply again.`;
  } else if (map.period) {
    const left = map.period - (presses % map.period);
    verdict =
      left === map.period
        ? `Back at the start. ${map.period} presses bring every point home, so ${f}${power(map.period)} = I.`
        : `Not home yet: ${left} more ${left === 1 ? "press brings" : "presses bring"} it back to X.`;
  } else if (map.id === "turn-radian") {
    // the press that has come closest to X so far, and how close
    let best = 1;
    let gap = Infinity;
    for (let k = 1; k <= presses; k++) {
      const d = Math.hypot(
        trail[k]![0] - map.start[0],
        trail[k]![1] - map.start[1],
      );
      if (d < gap) {
        gap = d;
        best = k;
      }
    }
    verdict = `Never returns: the points spread around the circle. Closest to X so far: after ${best} ${best === 1 ? "press" : "presses"}, ${format(gap, 3)} away.`;
  } else if (map.id === "slide") {
    verdict = `Never returns: each press moves the point a further (1, 0.5), so it is now ${format(presses * Math.hypot(1, 0.5))} from X.`;
  } else {
    verdict = `Never returns: each press halves the distance to O, which is now ${format(5 / 2 ** presses, 3)}, and it never reaches 0.`;
  }
  if (!canPress && presses > 0 && presses < map.max)
    verdict += " The next point is off the grid.";

  // back at X: the orange start marks the spot, so the newest dot isn't drawn over it
  const home = !!map.period && presses > 0 && presses % map.period === 0;
  const r = Math.hypot(map.start[0], map.start[1]);
  const shown = trail.filter(inside);

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>{where}</div>
          <div className="mt-1 min-h-10 text-sm font-normal text-fd-muted-foreground">
            {verdict}
          </div>
        </>
      }
      controls={
        <>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-fd-muted-foreground">mapping</span>
            <select
              value={id}
              onChange={(e) => {
                setId(e.target.value as MapName);
                setPresses(0);
              }}
              className="rounded-lg border bg-fd-card px-3 py-1.5 font-medium"
            >
              {MAPS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
          <Button
            primary
            onClick={() => setPresses((k) => k + 1)}
            disabled={!canPress}
          >
            apply again
          </Button>
          <Button onClick={() => setPresses(0)} disabled={presses === 0}>
            start again
          </Button>
        </>
      }
    >
      <Grid
        x={X}
        y={Y}
        label={`A grid from −5 to 5 in both directions, with the starting point X = ${point(map.start)} in orange and the trail of the ${map.name} after ${presses} presses, the points joined in order. ${where} ${verdict}`}
      >
        {map.circle && (
          <circle
            cx={px(0)}
            cy={py(0)}
            r={r * (px(1) - px(0))}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.35}
            strokeDasharray="5 5"
          />
        )}
        <circle cx={px(0)} cy={py(0)} r={3.5} fill="currentColor" />
        <text
          x={px(0) - 8}
          y={py(0) + 16}
          textAnchor="end"
          fontSize={13}
          fill="currentColor"
          {...halo}
        >
          O
        </text>
        {shown.length > 1 && (
          <polyline
            points={shown.map(([x, y]) => `${px(x)},${py(y)}`).join(" ")}
            fill="none"
            stroke={COLORS.blue}
            strokeWidth={1.5}
            strokeOpacity={0.7}
            strokeLinejoin="round"
          />
        )}
        {shown.slice(1).map(([x, y], i) => (
          <circle key={i} cx={px(x)} cy={py(y)} r={3.5} fill={COLORS.blue} />
        ))}
        <circle
          cx={px(map.start[0])}
          cy={py(map.start[1])}
          r={7}
          fill={COLORS.orange}
          stroke="var(--color-fd-card)"
          strokeWidth={2}
        />
        <text
          x={px(map.start[0]) + 10}
          y={py(map.start[1]) - 10}
          fontSize={14}
          fontWeight={600}
          fill={COLORS.orange}
          {...halo}
        >
          X
        </text>
        {presses > 0 && inside(last) && !home && (
          <circle
            cx={px(last[0])}
            cy={py(last[1])}
            r={6}
            fill={COLORS.blue}
            stroke="var(--color-fd-card)"
            strokeWidth={2}
          />
        )}
      </Grid>
    </Interactive>
  );
}
