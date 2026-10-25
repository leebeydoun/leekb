"use client";

/**
 * PowerSpiral: the powers 1, z, z², …, z¹² of a complex number z = r e^{iθ}, joined in order. Sliders
 * set the length r (from 0.9 to 1.1) and the angle θ (in steps of π/12), and a third slider picks
 * one power zⁿ to mark. The powers spiral out when r > 1, spiral in when r < 1, and step round the
 * unit circle when r = 1. The readout gives zⁿ with its length rⁿ and its angle nθ, numbers in.
 */

import { useState } from "react";
import { Grid, gridScale } from "./grid";
import { COLORS, Interactive, Slider, format } from "./kit";

type Range = [number, number];

const RANGE: Range = [-3.5, 3.5];
const MOST = 12;

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** k twelfths of π, simplified: "0", "π/6", "5π/12", "2π", "25π/12" */
function twelfths(k: number) {
  if (k === 0) return "0";
  const g = gcd(k, 12);
  const top = k / g;
  const bottom = 12 / g;
  const pi = `${top === 1 ? "" : top}π`;
  return bottom === 1 ? pi : `${pi}/${bottom}`;
}

/** k twelfths of π with its size in degrees after it */
const angle = (k: number) => `${twelfths(k)} (${15 * k}°)`;

const SUPERSCRIPT = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const power = (n: number) =>
  String(n)
    .split("")
    .map((d) => SUPERSCRIPT[Number(d)])
    .join("");

/** a number a + bi to two places */
function cartesian(x: number, y: number) {
  const a = Number(x.toFixed(2));
  const b = Number(y.toFixed(2));
  if (b === 0) return format(a);
  const bi = `${Math.abs(b) === 1 ? "" : format(Math.abs(b))}i`;
  if (a === 0) return b < 0 ? `−${bi}` : bi;
  return `${format(a)} ${b < 0 ? "−" : "+"} ${bi}`;
}

export function PowerSpiral() {
  const [r, setR] = useState(1.06);
  const [k, setK] = useState(2);
  const [n, setN] = useState(5);
  const { px, py, unit } = gridScale(RANGE, RANGE);
  const theta = (k * Math.PI) / 12;
  const powers = Array.from({ length: MOST + 1 }, (_, m) => ({
    x: r ** m * Math.cos(m * theta),
    y: r ** m * Math.sin(m * theta),
  }));
  const zn = powers[n]!;
  const one = Math.abs(r - 1) < 1e-9;

  // the angle nθ, in twelfths of π, and the same direction within one turn
  const turns = n * k;
  const within = turns % 24;
  const angleText =
    turns >= 24
      ? `${angle(turns)}, the same direction as ${angle(within)}`
      : angle(turns);

  // on the unit circle, the first power after the 0th that lands back on 1
  const back = Array.from({ length: MOST }, (_, i) => i + 1).find(
    (m) => (m * k) % 24 === 0,
  );
  const behaviour = one
    ? back
      ? `r = 1, so every power is on the unit circle. z${power(back)} = 1, so the powers come back to 1 after ${back} steps${back >= 3 ? ` and mark the corners of a regular polygon with ${back} sides` : ""}.`
      : "r = 1, so every power is on the unit circle, one step of θ round from the last."
    : r > 1
      ? `r = ${format(r)} is more than 1, so each power is further from 0 than the last: the powers spiral outwards.`
      : `r = ${format(r)} is less than 1, so each power is closer to 0 than the last: the powers spiral in.`;

  return (
    <Interactive
      readout={
        <>
          <div>
            z{power(n)} ≈ {cartesian(zn.x, zn.y)}: length r{power(n)} ={" "}
            {format(r)}
            {power(n)} {one ? "=" : "≈"} {format(r ** n)}, angle {n}θ = {n} ×{" "}
            {twelfths(k)} = {angleText}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {behaviour}
          </div>
        </>
      }
      controls={
        <>
          <Slider
            label={
              <>
                length <i>r</i>
              </>
            }
            value={r}
            onChange={setR}
            min={0.9}
            max={1.1}
            step={0.02}
          />
          <Slider
            label={
              <>
                angle <i>θ</i>
              </>
            }
            value={k}
            onChange={setK}
            min={1}
            max={24}
            show={(v) => twelfths(v)}
          />
          <Slider
            label={
              <>
                power <i>n</i>
              </>
            }
            value={n}
            onChange={setN}
            min={0}
            max={MOST}
          />
        </>
      }
      caption="The powers 1, z, z², …, z¹² of z = r(cos θ + i sin θ), joined in order. Each step turns by θ and multiplies the length by r. The dashed circle has radius 1, and the orange point is the power you pick."
    >
      <Grid
        x={RANGE}
        y={RANGE}
        label={`The powers of z, with length ${format(r)} and angle ${twelfths(k)}, from the 0th to the 12th, joined in order. ${behaviour}`}
      >
        <circle
          cx={px(0)}
          cy={py(0)}
          r={unit}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={1.5}
          strokeDasharray="5 5"
        />
        <polyline
          points={powers.map((p) => `${px(p.x)},${py(p.y)}`).join(" ")}
          fill="none"
          stroke={COLORS.blue}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <line
          x1={px(0)}
          y1={py(0)}
          x2={px(zn.x)}
          y2={py(zn.y)}
          stroke={COLORS.orange}
          strokeWidth={2.5}
        />
        {powers.map((p, m) => (
          <circle
            key={m}
            cx={px(p.x)}
            cy={py(p.y)}
            r={m === 0 || m === 1 ? 5 : 3.5}
            fill={COLORS.blue}
            stroke="var(--color-fd-card)"
            strokeWidth={1.5}
          />
        ))}
        <circle
          cx={px(zn.x)}
          cy={py(zn.y)}
          r={7}
          fill={COLORS.orange}
          stroke="var(--color-fd-card)"
          strokeWidth={2}
        />
        <text
          x={px(zn.x) + (zn.x / (Math.hypot(zn.x, zn.y) || 1)) * 20}
          y={py(zn.y) - (zn.y / (Math.hypot(zn.x, zn.y) || 1)) * 20 + 5}
          textAnchor="middle"
          fontSize={15}
          fontWeight={700}
          fill={COLORS.orange}
          stroke="var(--color-fd-card)"
          strokeWidth={4}
          paintOrder="stroke"
        >
          z{power(n)}
        </text>
      </Grid>
    </Interactive>
  );
}
