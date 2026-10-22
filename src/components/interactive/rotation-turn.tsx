"use client";

/**
 * A turn of the plane about a point O. One slider sets the angle, from a whole clockwise turn to two
 * anticlockwise turns. The flag turns about O, and the readout writes the angle as whole turns plus
 * a turn from 0° up to 360°, which is all that decides where the flag ends up.
 */

import { useState } from "react";
import { COLORS, Interactive, Slider, format, useSmooth } from "./kit";
import {
  Dot,
  FLAG,
  Flag,
  planeScale,
  shift,
  turn,
  type Vec,
} from "./moving-shape";

const O: Vec = { x: 0, y: 0 };
const START = FLAG.map((p) => shift(p, { x: 0.9, y: 0.2 }));
const P = START[0]!;

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

/** x written as 360n + w, with n a whole number and w from 0 up to 360 */
function split(x: number) {
  const n = Math.floor(x / 360);
  return { n, w: x - 360 * n };
}

export function RotationTurn() {
  const [x, setX] = useState(500);
  const shown = useSmooth(x, 500);
  const { width, height, px } = planeScale(-2.7, 2.7, -2.7, 2.7, 56);
  const { n, w } = split(x);
  const o = px(O);

  // the arc from the ray OP round to the ray OP', anticlockwise through w degrees
  const radius = 0.55;
  const start = px(
    turn(
      { x: O.x + radius, y: O.y },
      O,
      (Math.atan2(P.y, P.x) * 180) / Math.PI,
    ),
  );
  const end = px(
    turn(
      { x: O.x + radius, y: O.y },
      O,
      (Math.atan2(P.y, P.x) * 180) / Math.PI + w,
    ),
  );
  const middle = px(
    turn(
      { x: O.x + radius + 0.35, y: O.y },
      O,
      (Math.atan2(P.y, P.x) * 180) / Math.PI + w / 2,
    ),
  );
  const pixels = radius * 56;

  const sentence =
    x >= 0 && x < 360
      ? `Turning anticlockwise by ${format(x)}°.`
      : x < 0
        ? `A negative turn goes clockwise: turning ${format(-x)}° clockwise ends where turning ${format(w)}° anticlockwise does.`
        : `${format(x)} = 360 × ${n} + ${format(w)}, so after ${n === 1 ? "a whole turn" : `${n} whole turns`} the flag ends where a turn of ${format(w)}° leaves it.`;

  return (
    <Interactive
      readout={
        <>
          <div>
            Turning by {format(x)}° ends where turning by {format(w)}° does
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {sentence}
          </div>
        </>
      }
      controls={
        <Slider
          label="angle of the turn"
          value={x}
          onChange={setX}
          min={-360}
          max={720}
          step={15}
          show={(v) => `${format(v)}°`}
        />
      }
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto block h-auto w-full max-w-sm text-fd-foreground"
        role="img"
        aria-label={`A flag turned about the point O by ${format(x)} degrees, which ends in the same place as a turn by ${format(w)} degrees.`}
      >
        {/* the circle the corner P travels round */}
        <circle
          cx={o.x}
          cy={o.y}
          r={Math.hypot(P.x, P.y) * 56}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.25}
          strokeWidth={1.5}
          strokeDasharray="5 5"
        />
        <Flag corners={START} px={px} color={COLORS.blue} faint />
        <Flag
          corners={START.map((p) => turn(p, O, shown))}
          px={px}
          color={COLORS.blue}
        />
        <g stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.5}>
          <line x1={o.x} y1={o.y} x2={px(P).x} y2={px(P).y} />
          <line
            x1={o.x}
            y1={o.y}
            x2={px(turn(P, O, shown)).x}
            y2={px(turn(P, O, shown)).y}
          />
        </g>
        {w > 0 && (
          <path
            d={`M ${start.x} ${start.y} A ${pixels} ${pixels} 0 ${w > 180 ? 1 : 0} 0 ${end.x} ${end.y}`}
            fill="none"
            stroke={COLORS.orange}
            strokeWidth={2.5}
          />
        )}
        {w > 0 && (
          <text
            x={middle.x}
            y={middle.y + 5}
            textAnchor="middle"
            fontSize={14}
            fontWeight={600}
            fill={COLORS.orange}
            {...halo}
          >
            {format(w)}°
          </text>
        )}
        <Dot at={o} name="O" dx={-12} dy={14} />
        <Dot at={px(P)} name="P" dx={10} dy={14} color={COLORS.purple} />
        <Dot
          at={px(turn(P, O, shown))}
          name="P′"
          dx={0}
          dy={-14}
          color={COLORS.purple}
        />
      </svg>
    </Interactive>
  );
}
