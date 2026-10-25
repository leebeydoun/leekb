"use client";

/**
 * CompoundDial: £1 in a bank that pays 100% interest a year, split into n equal payments. Each
 * payment adds 1/n of what is in the account, so it multiplies the amount by 1 + 1/n, and after the
 * year's n payments £1 has become £(1 + 1/n)ⁿ. A slider on a logarithmic scale picks n from 1 to
 * 100,000, snapping at 1, 2, 4, 12, 52 and 365. The picture shows the amount through the year as a
 * staircase, one step per payment, with a dashed line at the height e that the totals settle
 * towards, and the faint curve y = eᵗ that the staircases close in on.
 */

import { useId, useState } from "react";
import { COLORS, Interactive, Slider, format } from "./kit";

const WIDTH = 640;
const HEIGHT = 300;
const LEFT = 44;
const RIGHT = 70;
const TOP = 14;
const BOTTOM = 30;
// the year runs across, the amount in pounds runs up
const T0 = 0;
const T1 = 1;
const Y0 = 0.8;
const Y1 = 3;
const px = (t: number) =>
  LEFT + ((t - T0) / (T1 - T0)) * (WIDTH - LEFT - RIGHT);
const py = (y: number) =>
  TOP + ((Y1 - y) / (Y1 - Y0)) * (HEIGHT - TOP - BOTTOM);

const SNAPS = [1, 2, 4, 12, 52, 365];
const NAMES: Record<number, string> = {
  1: "once, at the end of the year",
  2: "twice a year",
  4: "every quarter",
  12: "every month",
  52: "every week",
  365: "every day",
};
// above this many payments the steps are too small to see, so the staircase is drawn as a curve
const MOST_STEPS = 1500;

/** the number of payments for a slider position u, where n = 10ᵘ, snapping near the named ones */
function payments(u: number) {
  for (const s of SNAPS) if (Math.abs(u - Math.log10(s)) < 0.04) return s;
  return Math.max(1, Math.round(10 ** u));
}

const withCommas = (n: number) => n.toLocaleString("en-GB");

export function CompoundDial({
  caption = "Each payment adds 1/n of what is in the account, so the amount climbs in n steps through the year. Paying more often gives more, but the totals settle towards e and never pass it.",
}: {
  caption?: string;
}) {
  const [u, setU] = useState(Math.log10(12));
  const clip = useId();
  const n = payments(u);
  const factor = 1 + 1 / n;
  const total = factor ** n;

  // the staircase: level during each period, then up at each payment
  let stairs = `M${px(0).toFixed(1)},${py(1).toFixed(1)}`;
  if (n <= MOST_STEPS) {
    let amount = 1;
    for (let k = 1; k <= n; k++) {
      stairs += `L${px(k / n).toFixed(1)},${py(amount).toFixed(1)}`;
      amount *= factor;
      stairs += `L${px(k / n).toFixed(1)},${py(amount).toFixed(1)}`;
    }
  } else {
    for (let i = 1; i <= 400; i++) {
      const t = i / 400;
      stairs += `L${px(t).toFixed(1)},${py(factor ** (n * t)).toFixed(1)}`;
    }
  }
  const limit = Array.from({ length: 201 }, (_, i) => {
    const t = i / 200;
    return `${i ? "L" : "M"}${px(t).toFixed(1)},${py(Math.exp(t)).toFixed(1)}`;
  }).join("");

  const how = NAMES[n] ?? `${withCommas(n)} times a year`;
  const paid = n === 1 ? "paid once" : `paid ${withCommas(n)} times`;
  const short = Math.E - total;

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>
            {paid}:{" "}
            <span style={{ color: COLORS.blue }}>£{total.toFixed(6)}</span>;{" "}
            <span style={{ color: COLORS.orange }}>
              e ≈ {Math.E.toFixed(6)}
            </span>
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            Paying {how}, each payment multiplies the amount by 1 + 1/
            {withCommas(n)} ≈ {factor.toFixed(6)}, so £1 becomes (1 + 1/
            {withCommas(n)})<sup>{withCommas(n)}</sup> ≈ £{total.toFixed(6)}.
            That is £{short.toFixed(6)} short of e.
          </div>
        </>
      }
      controls={
        <Slider
          label="payments in the year"
          value={u}
          onChange={setU}
          min={0}
          max={5}
          step={0.005}
          show={() => withCommas(n)}
        />
      }
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-2xl text-fd-foreground"
        role="img"
        aria-label={`The amount in the account through one year, starting at £1, as a staircase with ${withCommas(n)} steps, ending at £${total.toFixed(6)}. A dashed line marks the height e ≈ 2.718282, and a faint curve shows y = e to the power t.`}
      >
        <defs>
          <clipPath id={clip}>
            <rect
              x={LEFT}
              y={TOP}
              width={WIDTH - LEFT - RIGHT}
              height={HEIGHT - TOP - BOTTOM}
            />
          </clipPath>
        </defs>

        {/* light lines at each quarter of the year and each 50p */}
        <g className="text-fd-border" stroke="currentColor" strokeWidth={1}>
          {[0.25, 0.5, 0.75, 1].map((t) => (
            <line key={t} x1={px(t)} x2={px(t)} y1={py(Y0)} y2={py(Y1)} />
          ))}
          {[1, 1.5, 2, 2.5, 3].map((y) => (
            <line key={y} x1={px(T0)} x2={px(T1)} y1={py(y)} y2={py(y)} />
          ))}
        </g>
        <g stroke="currentColor" strokeWidth={1.5}>
          <line x1={px(T0)} x2={px(T1)} y1={py(Y0)} y2={py(Y0)} />
          <line x1={px(T0)} x2={px(T0)} y1={py(Y0)} y2={py(Y1)} />
        </g>
        <g fontSize={12} className="fill-fd-muted-foreground">
          {(
            [
              [0, "start"],
              [0.25, "3 months"],
              [0.5, "6 months"],
              [0.75, "9 months"],
              [1, "1 year"],
            ] as const
          ).map(([t, text]) => (
            <text key={t} x={px(t)} y={py(Y0) + 18} textAnchor="middle">
              {text}
            </text>
          ))}
          {[1, 1.5, 2, 2.5, 3].map((y) => (
            <text key={y} x={px(T0) - 6} y={py(y) + 4} textAnchor="end">
              £{format(y)}
            </text>
          ))}
        </g>

        {/* the height e, and the curve the staircases close in on */}
        <line
          x1={px(T0)}
          x2={px(T1)}
          y1={py(Math.E)}
          y2={py(Math.E)}
          stroke={COLORS.orange}
          strokeWidth={2}
          strokeDasharray="7 5"
        />
        <text
          x={px(T1) + 8}
          y={py(Math.E) + 4}
          fontSize={13}
          fontWeight={600}
          fill={COLORS.orange}
        >
          e
        </text>
        <g clipPath={`url(#${clip})`} fill="none">
          <path
            d={limit}
            stroke="currentColor"
            strokeOpacity={0.35}
            strokeWidth={2}
            strokeDasharray="4 4"
          />
          <path
            d={stairs}
            stroke={COLORS.blue}
            strokeWidth={3}
            strokeLinejoin="round"
          />
        </g>
        <circle
          cx={px(T1)}
          cy={py(total)}
          r={6}
          fill={COLORS.blue}
          stroke="var(--color-fd-card)"
          strokeWidth={2}
        />
        <text
          x={px(T1) + 8}
          y={py(total) + (total > Math.E - 0.25 ? 18 : 4)}
          fontSize={13}
          fontWeight={600}
          fill={COLORS.blue}
        >
          £{total.toFixed(2)}
        </text>
      </svg>
    </Interactive>
  );
}
