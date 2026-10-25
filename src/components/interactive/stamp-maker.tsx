"use client";

/**
 * Strong induction with stamps. A slider picks an amount from 12p to 40p, and the picture makes it
 * from 4p and 5p stamps the way the proof does: an amount from 12p to 15p is a base case, made by
 * hand, and any larger amount is the amount 4p smaller with one more 4p stamp. The stamps carried
 * over from the smaller amount are blue and the new 4p stamp is orange. Below, the amounts from 12
 * to 40 sit in four rows, one for each base case, each amount 4p more than the one before it, so
 * the chain of steps back to a base case runs along one row.
 */

import { useState } from "react";
import { COLORS, Interactive, Slider } from "./kit";

const BASE: Record<number, number[]> = {
  12: [4, 4, 4],
  13: [4, 4, 5],
  14: [4, 5, 5],
  15: [5, 5, 5],
};

/** the base case an amount goes back to, in steps of 4 */
const baseOf = (n: number) => 12 + ((n - 12) % 4);

/** the stamps for an amount, built as in the proof: the base case, then 4p stamps */
function stampsFor(n: number) {
  const b = baseOf(n);
  return [...BASE[b]!, ...Array<number>((n - b) / 4).fill(4)];
}

const count = (k: number, value: number) =>
  `${k} stamp${k === 1 ? "" : "s"} of ${value}p`;

const WIDTH = 640;
const HEIGHT = 296;
const STAMP_W = 46;
const STAMP_H = 58;
const GAP = 8;
const CELL_W = 56;
const CELL_H = 28;
const GRID_X = (WIDTH - 8 * CELL_W) / 2;
const GRID_Y = 176;

function Stamp({
  x,
  value,
  color,
}: {
  x: number;
  value: number;
  color: string;
}) {
  const y = 40;
  // the perforated edge: little bites out of each side
  const bites = [];
  for (let i = 0; i < 6; i++) {
    bites.push(
      <circle key={`t${i}`} cx={x + 5 + i * 7.2} cy={y} r={2.2} />,
      <circle key={`b${i}`} cx={x + 5 + i * 7.2} cy={y + STAMP_H} r={2.2} />,
    );
  }
  for (let i = 0; i < 8; i++) {
    bites.push(
      <circle key={`l${i}`} cx={x} cy={y + 4 + i * 7.1} r={2.2} />,
      <circle key={`r${i}`} cx={x + STAMP_W} cy={y + 4 + i * 7.1} r={2.2} />,
    );
  }
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={STAMP_W}
        height={STAMP_H}
        fill={color}
        fillOpacity={0.2}
        stroke={color}
        strokeWidth={2.5}
      />
      <g fill="var(--color-fd-card)">{bites}</g>
      <text
        x={x + STAMP_W / 2}
        y={y + STAMP_H / 2 + 6}
        textAnchor="middle"
        fontSize={17}
        fontWeight={700}
        fill={color}
      >
        {value}p
      </text>
    </g>
  );
}

export function StampMaker({
  caption = "Move the amount. Every amount from 16p on is the amount 4p smaller with one more 4p stamp, so the chain of steps always runs back to one of the four amounts from 12p to 15p made by hand. In the grid, each row starts at one of those four and goes up 4p at a time.",
}: {
  caption?: string;
}) {
  const [n, setN] = useState(29);
  const stamps = stampsFor(n);
  const base = n <= 15;
  const b = baseOf(n);
  const chain: number[] = [];
  for (let m = n; m >= 12; m -= 4) chain.push(m);

  const fours = stamps.filter((s) => s === 4).length;
  const fives = stamps.length - fours;
  const made = [fours && count(fours, 4), fives && count(fives, 5)]
    .filter(Boolean)
    .join(" and ");

  const readout = base
    ? `${n}p is a base case, made by hand: ${BASE[n]!.map((s) => `${s}p`).join(" + ")}.`
    : `${n}p is ${n - 4}p plus one 4p stamp. Going back in steps of 4: ${chain.join(", ")}, and ${b}p is ${BASE[b]!.map((s) => `${s}p`).join(" + ")} by hand. So ${n}p is ${made}.`;

  const rowWidth = stamps.length * STAMP_W + (stamps.length - 1) * GAP;
  const start = (WIDTH - rowWidth) / 2;

  return (
    <Interactive
      caption={caption}
      readout={readout}
      controls={
        <Slider
          label="amount (pence)"
          value={n}
          onChange={setN}
          min={12}
          max={40}
          show={(v) => `${v}p`}
        />
      }
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-2xl text-fd-foreground"
        role="img"
        aria-label={`${n}p made from ${made}. ${readout}`}
      >
        <text
          x={WIDTH / 2}
          y={22}
          textAnchor="middle"
          fontSize={15}
          fill="currentColor"
        >
          {base ? `${n}p, made by hand` : `${n - 4}p, then one more 4p stamp`}
        </text>
        {stamps.map((value, i) => {
          const isNew = !base && i === stamps.length - 1;
          return (
            <Stamp
              key={i}
              x={start + i * (STAMP_W + GAP)}
              value={value}
              color={base ? COLORS.green : isNew ? COLORS.orange : COLORS.blue}
            />
          );
        })}

        <text
          x={WIDTH / 2}
          y={GRID_Y - 12}
          textAnchor="middle"
          fontSize={13}
          className="fill-fd-muted-foreground"
        >
          each row starts at a base case and adds 4p a step
        </text>
        {Array.from({ length: 29 }, (_, i) => {
          const m = 12 + i;
          // the row is the base case the amount goes back to, the column the number of steps
          const row = (m - 12) % 4;
          const col = Math.floor((m - 12) / 4);
          const inChain = chain.includes(m);
          const color =
            m === n
              ? COLORS.orange
              : m === b
                ? COLORS.green
                : inChain
                  ? COLORS.blue
                  : undefined;
          return (
            <g key={m}>
              <rect
                x={GRID_X + col * CELL_W}
                y={GRID_Y + row * CELL_H}
                width={CELL_W}
                height={CELL_H}
                // the first column, the base cases, keeps a faint green even when not in use
                fill={color ?? (col === 0 ? COLORS.green : "none")}
                fillOpacity={color ? 0.3 : col === 0 ? 0.1 : 0}
                stroke="currentColor"
                strokeOpacity={0.35}
              />
              <text
                x={GRID_X + col * CELL_W + CELL_W / 2}
                y={GRID_Y + row * CELL_H + 19}
                textAnchor="middle"
                fontSize={14}
                fontWeight={inChain ? 700 : 400}
                fill="currentColor"
              >
                {m}
              </text>
            </g>
          );
        })}
      </svg>
    </Interactive>
  );
}
