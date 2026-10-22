"use client";

/**
 * Measuring a lake by counting squares. A choice of grid sizes lays squares over the lake: the ones
 * wholly inside are blue, the ones the lake only partly covers are orange. The readout gives the
 * inner count, the outer count and the gap between them, which shrinks as the squares get smaller.
 * A second choice shows the band around the shore that every orange square lies in.
 */

import { useMemo, useState } from "react";
import { COLORS, Choice, Interactive, format } from "./kit";
import { planeScale, type Vec } from "./moving-shape";

// the shore, as a distance from the lake's middle in each direction: a wobbly circle
const CENTRE: Vec = { x: 0.13, y: 0.07 };
const reach = (angle: number) =>
  2.2 +
  0.35 * Math.sin(2 * angle) +
  0.25 * Math.cos(3 * angle) +
  0.12 * Math.sin(5 * angle + 1);

const inLake = (p: Vec) => {
  const dx = p.x - CENTRE.x;
  const dy = p.y - CENTRE.y;
  return Math.hypot(dx, dy) < reach(Math.atan2(dy, dx));
};

// points along the shore, for drawing it and for finding the squares it passes through
const SHORE: Vec[] = Array.from({ length: 720 }, (_, i) => {
  const angle = (i / 720) * 2 * Math.PI;
  const d = reach(angle);
  return {
    x: CENTRE.x + d * Math.cos(angle),
    y: CENTRE.y + d * Math.sin(angle),
  };
});

// the lake's area and the shore's length, worked out from many thin slices and short steps
const AREA = (() => {
  const n = 4000;
  let total = 0;
  for (let i = 0; i < n; i++) total += reach((i / n) * 2 * Math.PI) ** 2;
  return (total / n) * Math.PI;
})();
const SHORE_LENGTH = SHORE.reduce((total, p, i) => {
  const q = SHORE[(i + 1) % SHORE.length]!;
  return total + Math.hypot(p.x - q.x, p.y - q.y);
}, 0);

const LIMIT = 3;
type Kind = "inner" | "edge";

/** every square of side c that the lake covers wholly (inner) or partly (edge) */
function cover(c: number) {
  const n = Math.ceil(LIMIT / c);
  const found: { x: number; y: number; kind: Kind }[] = [];
  const k = 6;
  for (let i = -n; i < n; i++)
    for (let j = -n; j < n; j++) {
      const x = i * c;
      const y = j * c;
      // points spread over the square and round its edge
      let some = false;
      let all = true;
      for (let s = 0; s <= k; s++)
        for (let t = 0; t <= k; t++) {
          const hit = inLake({ x: x + (c * s) / k, y: y + (c * t) / k });
          some ||= hit;
          all &&= hit;
        }
      // a square the shore passes through has some of the lake in it, even if no sample showed it
      if (!some)
        some = SHORE.some(
          (p) => p.x > x && p.x < x + c && p.y > y && p.y < y + c,
        );
      if (some) found.push({ x, y, kind: all ? "inner" : "edge" });
    }
  return found;
}

const SIZES = ["1", "0.5", "0.25", "0.125"] as const;
type Size = (typeof SIZES)[number];

export function GridCount() {
  const [size, setSize] = useState<Size>("0.5");
  const [band, setBand] = useState<"hide" | "show">("hide");
  const c = Number(size);
  const squares = useMemo(() => cover(c), [c]);
  // room round the grid for the widest band, which reaches c√2 past the shore
  const VIEW = LIMIT + Math.SQRT2;
  const { width, height, px, unit } = planeScale(
    -VIEW,
    VIEW,
    -VIEW,
    VIEW,
    44,
    12,
  );

  const inner = squares.filter((s) => s.kind === "inner").length * c * c;
  const outer = squares.length * c * c;
  const shore = SHORE.map((p) => {
    const q = px(p);
    return `${q.x},${q.y}`;
  }).join(" ");
  const width2 = c * Math.SQRT2;

  return (
    <Interactive
      readout={
        <>
          <div>
            inner count {format(inner, 3)} ≤ area ≤ outer count{" "}
            {format(outer, 3)}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {band === "show"
              ? `Every orange square lies within ${format(width2, 3)} (the square's diagonal) of the shore, so inside the shaded band, whose area is about 2 × ${format(width2, 3)} × ${format(SHORE_LENGTH, 1)} = ${format(2 * width2 * SHORE_LENGTH, 2)}.`
              : `The gap between the counts is ${format(outer - inner, 3)}. The lake's area is about ${format(AREA, 2)}, and it always lies between the counts.`}
          </div>
        </>
      }
      controls={
        <>
          <Choice
            label="Side of each square"
            value={size}
            onChange={setSize}
            options={SIZES.map((s) => ({
              value: s,
              label: { "1": "1", "0.5": "½", "0.25": "¼", "0.125": "⅛" }[s],
            }))}
          />
          <Choice
            label="Band around the shore"
            value={band}
            onChange={setBand}
            options={[
              { value: "hide", label: "Hide" },
              { value: "show", label: "Show" },
            ]}
          />
        </>
      }
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto block h-auto w-full max-w-md text-fd-foreground"
        role="img"
        aria-label={`A lake on a grid of squares of side ${size}. The squares wholly inside add up to ${format(inner, 3)}, and with the squares the shore passes through the total is ${format(outer, 3)}.`}
      >
        <polygon
          points={shore}
          fill="#38bdf8"
          fillOpacity={0.18}
          stroke="none"
        />
        {squares.map(({ x, y, kind }) => {
          const p = px({ x, y: y + c });
          return (
            <rect
              key={`${x},${y}`}
              x={p.x}
              y={p.y}
              width={c * unit}
              height={c * unit}
              fill={kind === "inner" ? COLORS.blue : COLORS.orange}
              fillOpacity={kind === "inner" ? 0.3 : 0.45}
              stroke="currentColor"
              strokeOpacity={0.25}
              strokeWidth={c < 0.2 ? 0.5 : 1}
            />
          );
        })}
        {band === "show" && (
          <polygon
            points={shore}
            fill="none"
            stroke={COLORS.purple}
            strokeOpacity={0.3}
            strokeWidth={2 * width2 * unit}
            strokeLinejoin="round"
          />
        )}
        <polygon
          points={shore}
          fill="none"
          stroke="#0369a1"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
      </svg>
    </Interactive>
  );
}
