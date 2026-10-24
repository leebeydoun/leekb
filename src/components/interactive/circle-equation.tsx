"use client";

/**
 * A circle on a grid with sliders for its centre (a, b) and its radius r. The readout writes the
 * circle's equation as it moves, first in the form (x − a)² + (y − b)² = r² and then multiplied out
 * as x² + y² + Dx + Ey + F = 0, so you can watch each number in the equation follow the picture.
 */

import { useState } from "react";
import { Grid, gridScale } from "./grid";
import { COLORS, format, Interactive, Slider, useSmooth } from "./kit";

const RANGE: [number, number] = [-7, 7];

// (x − 2)², (x + 3)² or x², with a proper minus sign
function square(letter: string, centre: number) {
  if (centre === 0) return `${letter}²`;
  const sign = centre > 0 ? "−" : "+";
  return `(${letter} ${sign} ${format(Math.abs(centre))})²`;
}

// one term of the multiplied-out form, e.g. " − 4x" or " + 2y", or nothing when it is 0
function term(coefficient: number, letter = "") {
  if (Math.abs(coefficient) < 1e-9) return "";
  const sign = coefficient < 0 ? "−" : "+";
  const size = Math.abs(coefficient);
  const number = letter && Math.abs(size - 1) < 1e-9 ? "" : format(size);
  return ` ${sign} ${number}${letter}`;
}

export function CircleEquation({
  a: startA = 2,
  b: startB = -1,
  r: startR = 3,
}: {
  /** the starting centre (a, b) and radius r */
  a?: number;
  b?: number;
  r?: number;
}) {
  const [a, setA] = useState(startA);
  const [b, setB] = useState(startB);
  const [r, setR] = useState(startR);
  // the picture glides to each new circle; the equation uses the slider values
  const shownA = useSmooth(a);
  const shownB = useSmooth(b);
  const shownR = useSmooth(r);
  const { px, py, unit } = gridScale(RANGE, RANGE);

  const centred = `${square("x", a)} + ${square("y", b)} = ${format(r * r, 4)}`;
  const expanded = `x² + y²${term(-2 * a, "x")}${term(-2 * b, "y")}${term(a * a + b * b - r * r)} = 0`;

  const halo = {
    stroke: "var(--color-fd-card)",
    strokeWidth: 4,
    paintOrder: "stroke" as const,
  };
  const cx = px(shownA);
  const cy = py(shownB);
  const edge = px(shownA + shownR);
  // the centre's label sits below it, and moves above when the centre is near the bottom
  const labelBelow = shownB > -5;

  return (
    <Interactive
      readout={
        <>
          <div>{centred}</div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            Multiplied out: {expanded}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            Centre ({format(a)}, {format(b)}), radius {format(r)}, so the right
            side is {format(r)}² = {format(r * r, 4)}
          </div>
        </>
      }
      controls={
        <>
          <Slider
            label={
              <>
                centre <i>a</i>
              </>
            }
            value={a}
            onChange={setA}
            min={-3}
            max={3}
          />
          <Slider
            label={
              <>
                centre <i>b</i>
              </>
            }
            value={b}
            onChange={setB}
            min={-3}
            max={3}
          />
          <Slider
            label={
              <>
                radius <i>r</i>
              </>
            }
            value={r}
            onChange={setR}
            min={1}
            max={4}
            step={0.5}
          />
        </>
      }
      caption="Move the centre and change the radius. The numbers inside the brackets follow the centre, with the opposite sign, and the right side is the radius squared."
    >
      <Grid
        x={RANGE}
        y={RANGE}
        label={`The circle with centre (${format(a)}, ${format(b)}) and radius ${format(r)}, whose equation is ${centred}`}
      >
        <circle
          cx={cx}
          cy={cy}
          r={shownR * unit}
          fill={COLORS.blue}
          fillOpacity={0.06}
          stroke={COLORS.blue}
          strokeWidth={2.5}
        />
        {/* a radius, from the centre straight across to the right */}
        <line
          x1={cx}
          y1={cy}
          x2={edge}
          y2={cy}
          stroke={COLORS.orange}
          strokeWidth={2.5}
          strokeDasharray="6 4"
        />
        <text
          x={(cx + edge) / 2}
          y={cy - 8}
          textAnchor="middle"
          fontSize={14}
          fontWeight={600}
          fontStyle="italic"
          fill={COLORS.orange}
          {...halo}
        >
          r
        </text>
        <circle cx={cx} cy={cy} r={4.5} fill={COLORS.purple} />
        <text
          x={cx}
          y={labelBelow ? cy + 20 : cy - 12}
          textAnchor="middle"
          fontSize={13}
          fontWeight={600}
          fill={COLORS.purple}
          {...halo}
        >
          ({format(a)}, {format(b)})
        </text>
      </Grid>
    </Interactive>
  );
}
