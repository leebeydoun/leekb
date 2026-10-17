"use client";

/**
 * What a move does to an inequality a < b, one move per diagram. InequalityShift adds the same
 * number to both sides: the points slide together and the gap between them stays the same.
 * InequalityScale multiplies both sides by the same number: dragging it below 0 sends the points
 * through 0 to the other side, and the order turns round.
 */

import { useState, type ReactNode } from "react";
import {
  Axis,
  COLORS,
  Dot,
  Interactive,
  Slider,
  format,
  lineScale,
  useSmooth,
} from "./kit";

const WIDTH = 600;

// halves written as ½, so −0.5 reads −½ and 2.5 reads 2½
function show(n: number) {
  const whole = Math.trunc(n);
  if (Math.abs(n - whole) !== 0.5) return format(n);
  const sign = n < 0 ? "−" : "";
  return `${sign}${whole === 0 ? "" : Math.abs(whole)}½`;
}

const relation = (p: number, q: number) => (p < q ? "<" : p > q ? ">" : "=");

/** the inequality before and after the move, with the sign coloured by whether it changed */
function Change({
  a,
  b,
  move,
  p,
  q,
}: {
  a: number;
  b: number;
  move: string;
  p: number;
  q: number;
}) {
  const after = relation(p, q);
  const kept = after === "<";
  return (
    <span className="inline-flex flex-wrap items-baseline justify-center gap-x-2">
      <span>
        <span style={{ color: COLORS.blue }}>{show(a)}</span> &lt;{" "}
        <span style={{ color: COLORS.orange }}>{show(b)}</span>
      </span>
      <span className="text-fd-muted-foreground">→ {move} →</span>
      <span>
        <span style={{ color: COLORS.blue }}>{show(p)}</span>{" "}
        <span
          className="rounded px-1 font-bold"
          style={{
            color: kept ? COLORS.green : COLORS.red,
            background: kept ? "#22c55e1f" : "#ef44441f",
          }}
        >
          {after}
        </span>{" "}
        <span style={{ color: COLORS.orange }}>{show(q)}</span>
      </span>
    </span>
  );
}

function Readout({ change, note }: { change: ReactNode; note: string }) {
  return (
    <>
      {change}
      <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
        {note}
      </div>
    </>
  );
}

/** the two moved points, with the starting points left behind as hollow dots */
function Points({
  a,
  b,
  p,
  q,
  x,
  y,
}: {
  a: number;
  b: number;
  p: number;
  q: number;
  x: (n: number) => number;
  y: number;
}) {
  // when the points come close, lift one label so the two don't overlap
  const close = Math.abs(x(p) - x(q)) < 30;
  return (
    <>
      <Dot cx={x(a)} cy={y} color={COLORS.blue} hollow />
      <Dot cx={x(b)} cy={y} color={COLORS.orange} hollow />
      <Dot cx={x(p)} cy={y} color={COLORS.blue} label={show(p)} />
      <g transform={close ? "translate(0 -18)" : undefined}>
        <text
          x={x(q)}
          y={y - 14}
          textAnchor="middle"
          fontSize={14}
          fontWeight={600}
          fill={COLORS.orange}
        >
          {show(q)}
        </text>
      </g>
      <circle cx={x(q)} cy={y} r={6} fill={COLORS.orange} />
    </>
  );
}

/** Adding the same number to both sides of a < b: both points slide together. */
export function InequalityShift({
  a = 1,
  b = 3,
  c: initialC = 0,
  max = 4,
}: {
  a?: number;
  b?: number;
  /** the number added at the start */
  c?: number;
  /** the slider runs from −max to max */
  max?: number;
}) {
  const [c, setC] = useState(initialC);
  const shown = useSmooth(c);
  const from = Math.min(a, 0) - max - 1;
  const to = Math.max(b, 0) + max + 1;
  const { x } = lineScale(from, to, WIDTH);
  const AXIS_Y = 84;
  const p = a + shown;
  const q = b + shown;
  // a bracket over the moved points, showing that the gap between them doesn't change
  const bracketY = AXIS_Y - 46;

  return (
    <Interactive
      readout={
        <Readout
          change={
            <Change a={a} b={b} move={`add ${show(c)}`} p={a + c} q={b + c} />
          }
          note={`Both points slide the same distance, so the gap between them stays ${show(b - a)} and the order is kept.`}
        />
      }
      controls={
        <Slider
          label="add to both sides"
          value={c}
          onChange={setC}
          min={-max}
          max={max}
          show={show}
        />
      }
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${AXIS_Y + 36}`}
        className="mx-auto block h-auto w-full max-w-2xl text-fd-foreground"
        role="img"
        aria-label={`Two points, ${show(a)} and ${show(b)}, both moved by adding ${show(c)}`}
      >
        <Axis from={from} to={to} y={AXIS_Y} width={WIDTH} />
        <g
          className="text-fd-muted-foreground"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <line x1={x(p)} x2={x(q)} y1={bracketY} y2={bracketY} />
          <line x1={x(p)} x2={x(p)} y1={bracketY - 5} y2={bracketY + 5} />
          <line x1={x(q)} x2={x(q)} y1={bracketY - 5} y2={bracketY + 5} />
        </g>
        <text
          x={(x(p) + x(q)) / 2}
          y={bracketY - 9}
          textAnchor="middle"
          fontSize={13}
          className="fill-fd-muted-foreground"
        >
          gap {show(b - a)}
        </text>
        <Points a={a} b={b} p={p} q={q} x={x} y={AXIS_Y} />
      </svg>
    </Interactive>
  );
}

/** Multiplying both sides of a < b by the same number: a negative one turns the order round. */
export function InequalityScale({
  a = 1,
  b = 3,
  k: initialK = 1,
  max = 3,
  halves = true,
}: {
  a?: number;
  b?: number;
  /** the number multiplied by at the start */
  k?: number;
  /** the slider runs from −max to max */
  max?: number;
  /** whether the multiplier can be a half, like −½, or only a whole number */
  halves?: boolean;
}) {
  const [k, setK] = useState(initialK);
  const shown = useSmooth(k);
  const reach = Math.ceil(Math.max(Math.abs(a), Math.abs(b)) * max);
  const { x } = lineScale(-reach, reach, WIDTH);
  const AXIS_Y = 64;
  const p = a * shown;
  const q = b * shown;

  const note =
    k > 0
      ? "Multiplying by a positive number stretches or squashes the line from 0. Nothing crosses 0, so the order is kept."
      : k < 0
        ? "Multiplying by a negative number also flips the line over at 0, so left and right swap and the order turns round."
        : "Multiplying by 0 sends both points to 0, so they become equal.";

  return (
    <Interactive
      readout={
        <Readout
          change={
            <Change a={a} b={b} move={`times ${show(k)}`} p={a * k} q={b * k} />
          }
          note={note}
        />
      }
      controls={
        <Slider
          label="multiply both sides by"
          value={k}
          onChange={setK}
          min={-max}
          max={max}
          step={halves ? 0.5 : 1}
          show={show}
        />
      }
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${AXIS_Y + 36}`}
        className="mx-auto block h-auto w-full max-w-2xl text-fd-foreground"
        role="img"
        aria-label={`Two points, ${show(a)} and ${show(b)}, both multiplied by ${show(k)}`}
      >
        <Axis
          from={-reach}
          to={reach}
          y={AXIS_Y}
          width={WIDTH}
          every={reach > 6 ? 2 : 1}
        />
        <Points a={a} b={b} p={p} q={q} x={x} y={AXIS_Y} />
      </svg>
    </Interactive>
  );
}
