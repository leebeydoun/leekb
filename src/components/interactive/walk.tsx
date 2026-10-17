"use client";

/**
 * Adding and subtracting as a walk on the number line: a dot hops one step at a time from the
 * start, right for adding a positive number and left for adding a negative one. Subtracting is
 * shown as the same walk as adding the opposite.
 */

import { useState } from "react";
import {
  Axis,
  Button,
  COLORS,
  Choice,
  Dot,
  HArrow,
  Interactive,
  Slider,
  format,
  lineScale,
  useAnimation,
} from "./kit";

type Op = "+" | "-";

const WIDTH = 600;
const LINE_Y = 104;
// how high each single-step hop rises above the line
const HOP = 15;

// a number inside a sum, bracketed when negative: 3 + (−5)
const term = (n: number) => (n < 0 ? `(${format(n)})` : format(n));

export function NumberLineWalk({
  start: initialStart = 3,
  amount: initialAmount = 5,
  op: initialOp = "+",
  max = 5,
}: {
  start?: number;
  amount?: number;
  op?: Op;
  /** the sliders run from −max to max, and the line from −2·max to 2·max */
  max?: number;
}) {
  const [start, setStart] = useState(initialStart);
  const [amount, setAmount] = useState(initialAmount);
  const [op, setOp] = useState<Op>(initialOp);
  // subtracting is adding the opposite, so the walk is always "add step"
  const step = op === "+" ? amount : -amount;
  const end = start + step;
  const count = Math.abs(step);
  const dir = Math.sign(step);
  const anim = useAnimation(Math.max(600, count * 380));

  const from = -2 * max;
  const to = 2 * max;
  const { x } = lineScale(from, to, WIDTH);

  // how many steps have been walked so far, and where the dot is part way through a hop
  const walked = anim.progress * count;
  const whole = Math.min(Math.floor(walked), count);
  const part = walked - whole;
  const dotX = x(start + dir * walked);
  const dotY = LINE_Y - 4 * HOP * part * (1 - part);

  // any change starts the walk again from the beginning
  const change =
    <T,>(set: (value: T) => void) =>
    (value: T) => {
      set(value);
      anim.reset();
    };

  const move = op === "+" ? `+${term(amount)}` : `−${term(amount)}`;
  const sum = `${format(start)} ${op === "+" ? "+" : "−"} ${term(amount)} = ${format(end)}`;
  // the same walk written the other way: subtracting as adding the opposite, or the reverse
  const same =
    op === "-"
      ? `Taking away ${format(amount)} is the same walk as adding ${format(-amount)}: ${format(start)} + ${term(-amount)} = ${format(end)}.`
      : amount < 0
        ? `Adding ${format(amount)} is the same walk as taking away ${format(-amount)}: ${format(start)} − ${format(-amount)} = ${format(end)}.`
        : undefined;

  const odd: number[] = [];
  for (let n = from + 1; n < to; n += 2) odd.push(n);

  return (
    <Interactive
      readout={
        <>
          <div>{sum}</div>
          {same && (
            <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
              {same}
            </div>
          )}
        </>
      }
      controls={
        <>
          <Slider
            label="start"
            value={start}
            onChange={change(setStart)}
            min={-max}
            max={max}
          />
          <Choice
            value={op}
            onChange={change(setOp)}
            options={[
              { value: "+", label: "+ add" },
              { value: "-", label: "− take away" },
            ]}
          />
          <Slider
            label="amount"
            value={amount}
            onChange={change(setAmount)}
            min={-max}
            max={max}
          />
          <Button primary onClick={anim.play} disabled={anim.playing}>
            {anim.done ? "Walk again" : "Walk"}
          </Button>
        </>
      }
    >
      <svg
        viewBox={`0 0 ${WIDTH} 140`}
        className="mx-auto block h-auto w-full max-w-2xl text-fd-foreground"
        role="img"
        aria-label={`Number line walk: ${sum}`}
      >
        {/* numbers are written at every even integer, with a smaller tick at the odd ones */}
        <Axis from={from} to={to} y={LINE_Y} width={WIDTH} every={2} />
        {odd.map((n) => (
          <line
            key={n}
            x1={x(n)}
            x2={x(n)}
            y1={LINE_Y - 4}
            y2={LINE_Y + 4}
            stroke="currentColor"
            strokeWidth={1.25}
          />
        ))}

        {/* the hops already made, one arc per step */}
        {Array.from({ length: whole }, (_, i) => {
          const x1 = x(start + dir * i);
          const x2 = x(start + dir * (i + 1));
          return (
            <path
              key={i}
              d={`M ${x1} ${LINE_Y} Q ${(x1 + x2) / 2} ${LINE_Y - 2 * HOP} ${x2} ${LINE_Y}`}
              fill="none"
              stroke={COLORS.orange}
              strokeWidth={1.75}
              opacity={0.7}
            />
          );
        })}

        {/* the whole move, once the walk is over */}
        {anim.done && count > 0 && (
          <HArrow
            x1={x(start)}
            x2={x(end)}
            y={LINE_Y - 52}
            color={COLORS.orange}
            label={move}
          />
        )}

        <Dot cx={x(start)} cy={LINE_Y} color={COLORS.blue} hollow />
        <Dot cx={dotX} cy={dotY} color={COLORS.orange} />
      </svg>
    </Interactive>
  );
}
