"use client";

/**
 * Two bars showing the fractions p/q and r/s, each cut into its own pieces with the taken pieces
 * shaded. A toggle re-cuts both into pieces of a common size, so comparing them, or seeing that
 * they are equal, becomes a matter of counting pieces.
 */

import { useState } from "react";
import { Choice, COLORS, Interactive, Slider, useAnimation } from "./kit";

type FractionBarsProps = {
  /** the first fraction p/q and the second r/s, with 0 ≤ p ≤ q and 0 ≤ r ≤ s */
  p?: number;
  q?: number;
  r?: number;
  s?: number;
  /** the common denominator: the product q·s, or the smallest one (the lcm) */
  common?: "product" | "lcm";
  /** whether to start already cut into common pieces */
  cut?: boolean;
  /** whether to show sliders for the four numbers */
  sliders?: boolean;
  /** largest denominator the sliders reach */
  most?: number;
  caption?: string;
};

const WIDTH = 600;
const LEFT = 20;
const BAR = WIDTH - LEFT * 2;
const HEIGHT = 40;

function gcd(m: number, n: number): number {
  return n === 0 ? m : gcd(n, m % n);
}

/** one bar: a label above, the shaded share, its own cuts in bold and the common cuts thin */
function Bar({
  top,
  bottom,
  pieces,
  y,
  color,
  grow,
}: {
  top: number;
  bottom: number;
  /** how many pieces to cut the bar into when re-cut, or nothing */
  pieces?: number;
  y: number;
  color: string;
  /** how far the thin cuts have grown in, 0 to 1 */
  grow: number;
}) {
  const at = (i: number, of: number) => LEFT + (BAR * i) / of;
  const fine = pieces
    ? Array.from({ length: pieces - 1 }, (_, i) => i + 1).filter(
        (i) => (i * bottom) % pieces !== 0,
      )
    : [];
  const shown = Math.round((top * (pieces ?? bottom)) / bottom);
  return (
    <g>
      <text x={LEFT} y={y - 10} fontSize={18} fontWeight={600} fill={color}>
        {top}/{bottom}
        {pieces && pieces !== bottom && (
          <tspan fill="currentColor" fontWeight={400} opacity={grow}>
            {" "}
            = {shown}/{pieces}
          </tspan>
        )}
      </text>
      <rect
        x={LEFT}
        y={y}
        width={(BAR * top) / bottom}
        height={HEIGHT}
        fill={color}
        fillOpacity={0.6}
      />
      {fine.map((i) => (
        <line
          key={`f${i}`}
          x1={at(i, pieces!)}
          x2={at(i, pieces!)}
          y1={y}
          y2={y + HEIGHT * grow}
          stroke="currentColor"
          strokeWidth={1}
          strokeOpacity={0.55}
        />
      ))}
      {Array.from({ length: bottom - 1 }, (_, i) => i + 1).map((i) => (
        <line
          key={`c${i}`}
          x1={at(i, bottom)}
          x2={at(i, bottom)}
          y1={y}
          y2={y + HEIGHT}
          stroke="currentColor"
          strokeWidth={2}
        />
      ))}
      <rect
        x={LEFT}
        y={y}
        width={BAR}
        height={HEIGHT}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      />
    </g>
  );
}

export function FractionBars({
  p: p0 = 3,
  q: q0 = 4,
  r: r0 = 5,
  s: s0 = 7,
  common = "lcm",
  cut = false,
  sliders = true,
  most = 12,
  caption,
}: FractionBarsProps) {
  const [values, setValues] = useState({ p: p0, q: q0, r: r0, s: s0 });
  const [mode, setMode] = useState<"own" | "common">(cut ? "common" : "own");
  const { progress, play, reset } = useAnimation(900);
  const { p, q, r, s } = values;

  const pieces = common === "product" ? q * s : (q * s) / gcd(q, s);
  const recut = mode === "common";
  // when starting already cut, the thin cuts are there from the start
  const grow = recut ? (cut && progress === 0 ? 1 : progress) : 0;
  const first = (p * pieces) / q;
  const second = (r * pieces) / s;

  const name = (top: number, bottom: number) => `${top}/${bottom}`;
  const recutName = (top: number, bottom: number, count: number) =>
    bottom === pieces
      ? name(top, bottom)
      : `${name(top, bottom)} = ${count}/${pieces}`;
  const verdict =
    first === second
      ? "so they are equal"
      : `so ${first > second ? name(p, q) : name(r, s)} is bigger`;

  let readout: string;
  if (recut)
    readout = `${recutName(p, q, first)} and ${recutName(r, s, second)}, ${verdict}`;
  else if (q === s)
    readout = `both in the same pieces: ${p} against ${r}, ${verdict}`;
  else
    readout = `${name(p, q)} and ${name(r, s)} are cut into different sizes of piece`;

  // changing a denominator keeps the numerator no bigger than it
  function change(key: "p" | "q" | "r" | "s", value: number) {
    const next = { ...values, [key]: value };
    next.p = Math.min(next.p, next.q);
    next.r = Math.min(next.r, next.s);
    setValues(next);
    if (recut) reset();
    setMode("own");
  }

  const swatch = (color: string, text: string) => (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block size-2.5 rounded-sm"
        style={{ background: color }}
      />
      {text}
    </span>
  );

  return (
    <Interactive
      caption={caption}
      readout={readout}
      controls={
        <>
          <Choice
            value={mode}
            onChange={(next) => {
              setMode(next);
              if (next === "common") play();
              else reset();
            }}
            options={[
              { value: "own", label: "Own pieces" },
              { value: "common", label: "Common pieces" },
            ]}
          />
          {sliders && (
            // the sliders on a row of their own under the toggle
            <div className="grid basis-full justify-center gap-x-6 gap-y-3 sm:grid-flow-col sm:grid-rows-2">
              <Slider
                label={swatch(COLORS.blue, "top")}
                value={p}
                onChange={(value) => change("p", value)}
                min={0}
                max={q}
              />
              <Slider
                label={swatch(COLORS.blue, "bottom")}
                value={q}
                onChange={(value) => change("q", value)}
                min={1}
                max={most}
              />
              <Slider
                label={swatch(COLORS.orange, "top")}
                value={r}
                onChange={(value) => change("r", value)}
                min={0}
                max={s}
              />
              <Slider
                label={swatch(COLORS.orange, "bottom")}
                value={s}
                onChange={(value) => change("s", value)}
                min={1}
                max={most}
              />
            </div>
          )}
        </>
      }
    >
      <svg
        viewBox={`0 0 ${WIDTH} 176`}
        className="mx-auto block h-auto w-full max-w-2xl text-fd-foreground"
        role="img"
        aria-label={`Bars showing ${name(p, q)} and ${name(r, s)}`}
      >
        <Bar
          top={p}
          bottom={q}
          pieces={recut ? pieces : undefined}
          y={38}
          color={COLORS.blue}
          grow={grow}
        />
        <Bar
          top={r}
          bottom={s}
          pieces={recut ? pieces : undefined}
          y={122}
          color={COLORS.orange}
          grow={grow}
        />
        {/* a guide down from the end of the first share, to compare the two by eye */}
        <line
          x1={LEFT + (BAR * p) / q}
          x2={LEFT + (BAR * p) / q}
          y1={30}
          y2={170}
          stroke="currentColor"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          className="text-fd-muted-foreground"
        />
      </svg>
    </Interactive>
  );
}
