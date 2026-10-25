"use client";

/**
 * PartialSums: the partial sums s₁, s₂, …, sₙ of a chosen series plotted as dots against n, for n up
 * to 60. Four series to choose from: the harmonic series, which keeps growing; the reciprocal
 * squares, which settle towards π²/6; the geometric series 1 + ½ + ¼ + ⋯, which settles towards 2;
 * and 1 − 1 + 1 − ⋯, whose sums jump between 1 and 0. A dashed line marks the limit when there is
 * one, and the readout gives sₙ and, when there is a limit, the gap to it.
 */

import { useState } from "react";
import { COLORS, Choice, Interactive, Slider } from "./kit";

const WIDTH = 640;
const HEIGHT = 300;
const LEFT = 44;
const RIGHT = 70;
const TOP = 16;
const BOTTOM = 30;
const MOST = 60;

type Series = "harmonic" | "squares" | "geometric" | "alternating";

const SERIES: Record<
  Series,
  {
    label: string;
    term: (k: number) => number;
    limit?: number;
    limitName?: string;
    top: number;
    gap: number;
    places: number;
  }
> = {
  harmonic: {
    label: "1 + ½ + ⅓ + ⋯",
    term: (k) => 1 / k,
    top: 5,
    gap: 1,
    places: 2,
  },
  squares: {
    label: "1 + ¼ + ⅑ + ⋯",
    term: (k) => 1 / (k * k),
    limit: Math.PI ** 2 / 6,
    limitName: "π²/6",
    top: 2,
    gap: 0.5,
    places: 3,
  },
  geometric: {
    label: "1 + ½ + ¼ + ⋯",
    term: (k) => 0.5 ** (k - 1),
    limit: 2,
    limitName: "2",
    top: 2.5,
    gap: 0.5,
    places: 3,
  },
  alternating: {
    label: "1 − 1 + 1 − ⋯",
    term: (k) => (k % 2 ? 1 : -1),
    top: 1.5,
    gap: 0.5,
    places: 0,
  },
};

/** a gap to the limit, to three decimal places when it is that big, and to two figures below */
function showGap(g: number) {
  if (g >= 0.0005) return g.toFixed(3);
  if (g >= 1e-6) return String(Number(g.toPrecision(2)));
  return "less than 0.000001";
}

export function PartialSums({
  caption = "Each dot is a partial sum: the total of the first n terms. Some lists of dots close in on a dashed line and settle, and others climb forever or keep jumping.",
}: {
  caption?: string;
}) {
  const [which, setWhich] = useState<Series>("harmonic");
  const [n, setN] = useState(MOST);
  const s = SERIES[which];

  const sums: number[] = [];
  let total = 0;
  for (let k = 1; k <= MOST; k++) {
    total += s.term(k);
    sums.push(total);
  }
  const sn = sums[n - 1]!;
  const px = (k: number) => LEFT + (k / MOST) * (WIDTH - LEFT - RIGHT);
  const py = (y: number) =>
    TOP + ((s.top - y) / s.top) * (HEIGHT - TOP - BOTTOM);
  const levels = Array.from(
    { length: Math.round(s.top / s.gap) + 1 },
    (_, i) => i * s.gap,
  );

  let comment: string;
  if (which === "harmonic")
    comment = `still growing: the next term adds only 1/${n + 1}, but the sums pass every number in the end`;
  else if (which === "alternating")
    comment =
      n === 1
        ? ": the sums go 1, 0, 1, 0, … and never settle"
        : ` and s${toSub(n - 1)} = ${sums[n - 2]}: the sums jump between 1 and 0 and never settle`;
  else
    comment = `the limit is ${s.limitName}${which === "squares" ? ` ≈ ${s.limit!.toFixed(3)}` : ""}, and the gap is ${showGap(Math.abs(s.limit! - sn))}`;

  return (
    <Interactive
      caption={caption}
      readout={
        <div>
          <span style={{ color: COLORS.blue }}>
            s{toSub(n)} = {sn.toFixed(s.places)}
          </span>
          {which === "alternating" ? "" : ", "}
          {comment}
        </div>
      }
      controls={
        <>
          <Choice
            label="series"
            value={which}
            onChange={setWhich}
            options={(Object.keys(SERIES) as Series[]).map((key) => ({
              value: key,
              label: SERIES[key].label,
            }))}
          />
          <Slider
            label="number of terms n"
            value={n}
            onChange={setN}
            min={1}
            max={MOST}
          />
        </>
      }
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-2xl text-fd-foreground"
        role="img"
        aria-label={`The partial sums of ${s.label} for n from 1 to ${n}, plotted as dots against n. The last one is ${sn.toFixed(s.places)}.${s.limit ? ` A dashed line marks the limit ${s.limitName}.` : ""}`}
      >
        <g className="text-fd-border" stroke="currentColor" strokeWidth={1}>
          {[10, 20, 30, 40, 50, 60].map((k) => (
            <line key={k} x1={px(k)} x2={px(k)} y1={py(0)} y2={py(s.top)} />
          ))}
          {levels.map((y) => (
            <line key={y} x1={px(0)} x2={px(MOST)} y1={py(y)} y2={py(y)} />
          ))}
        </g>
        <g stroke="currentColor" strokeWidth={1.5}>
          <line x1={px(0)} x2={px(MOST)} y1={py(0)} y2={py(0)} />
          <line x1={px(0)} x2={px(0)} y1={py(0)} y2={py(s.top)} />
        </g>
        <g fontSize={12} className="fill-fd-muted-foreground">
          {[0, 10, 20, 30, 40, 50, 60].map((k) => (
            <text key={k} x={px(k)} y={py(0) + 18} textAnchor="middle">
              {k}
            </text>
          ))}
          {levels.map((y) => (
            <text key={y} x={px(0) - 6} y={py(y) + 4} textAnchor="end">
              {y}
            </text>
          ))}
          <text x={px(MOST) + 10} y={py(0) + 4}>
            n
          </text>
        </g>

        {s.limit !== undefined && (
          <>
            <line
              x1={px(0)}
              x2={px(MOST)}
              y1={py(s.limit)}
              y2={py(s.limit)}
              stroke={COLORS.green}
              strokeWidth={2}
              strokeDasharray="7 5"
            />
            <text
              x={px(MOST) + 8}
              y={py(s.limit) + 4}
              fontSize={13}
              fontWeight={600}
              fill={COLORS.green}
            >
              {s.limitName}
            </text>
          </>
        )}

        {sums.slice(0, n).map((y, i) => (
          <circle
            key={i}
            cx={px(i + 1)}
            cy={py(y)}
            r={i === n - 1 ? 6 : 3.5}
            fill={i === n - 1 ? COLORS.orange : COLORS.blue}
            stroke={i === n - 1 ? "var(--color-fd-card)" : "none"}
            strokeWidth={2}
          />
        ))}
      </svg>
    </Interactive>
  );
}

/** a whole number written with subscript digits, as in s₆₀ */
function toSub(n: number) {
  return String(n).replace(/\d/g, (d) => "₀₁₂₃₄₅₆₇₈₉"[Number(d)]!);
}
