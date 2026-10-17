"use client";

/**
 * The line y = mx + k with sliders for m and k. Step triangles along the line, each 1 to the right
 * and then m up or down, show that a straight line climbs by the same amount wherever you start.
 */

import { useState } from "react";
import { clipLine, Grid, gridScale } from "./grid";
import { COLORS, format, Interactive, Slider } from "./kit";

type SlopeExplorerProps = {
  /** starting slope and crossing point on the y-axis */
  m?: number;
  k?: number;
  /** slider ranges, and the step both sliders move in */
  slopes?: [number, number];
  crossings?: [number, number];
  step?: number;
  /** smallest and largest x and y shown */
  x?: [number, number];
  y?: [number, number];
  caption?: string;
};

// y = mx + k written the usual way: no 1s, no 0 terms, minus signs joined in
function equation(m: number, k: number) {
  const slope =
    m === 0
      ? ""
      : `${m < 0 ? "−" : ""}${Math.abs(m) === 1 ? "" : format(Math.abs(m))}x`;
  if (!slope) return `y = ${format(k)}`;
  if (k === 0) return `y = ${slope}`;
  return `y = ${slope} ${k < 0 ? "−" : "+"} ${format(Math.abs(k))}`;
}

export function SlopeExplorer({
  m: m0 = 2,
  k: k0 = -1,
  slopes = [-3, 3],
  crossings = [-4, 4],
  step = 0.5,
  x: xRange = [-5, 5],
  y: yRange = [-5, 5],
  caption,
}: SlopeExplorerProps) {
  const [m, setM] = useState(m0);
  const [k, setK] = useState(k0);
  const { px, py, unit } = gridScale(xRange, yRange);
  const [y0, y1] = yRange;

  // y = mx + k is the line mx − y = −k
  const ends = clipLine(m, -1, -k, xRange, yRange);
  const at = (x: number) => m * x + k;
  const inside = (y: number) => y >= y0 - 1e-9 && y <= y1 + 1e-9;

  // one step triangle for each whole-number x whose step stays inside the picture
  const steps: number[] = [];
  if (m !== 0)
    for (let i = Math.ceil(xRange[0]); i + 1 <= xRange[1]; i++)
      if (inside(at(i)) && inside(at(i + 1))) steps.push(i);

  // the "1" goes on one step only, right of the y-axis and away from its numbers if possible;
  // the climb goes on every step when there is room
  const middle =
    steps.find((i) => i >= 1 && i + 1 < xRange[1]) ??
    steps[Math.floor((steps.length - 1) / 2)];
  const roomy = Math.abs(m) * unit >= 28;

  const rise = m > 0 ? COLORS.green : COLORS.red;
  const halo = {
    stroke: "var(--color-fd-card)",
    strokeWidth: 4,
    paintOrder: "stroke" as const,
  };

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          {equation(m, k)}:{" "}
          {m > 0
            ? `each step right climbs ${format(m)}`
            : m < 0
              ? `each step right drops ${format(-m)}`
              : "each step right climbs 0, so the line is flat"}
          {m !== 0 && ", wherever you start"}
        </>
      }
      controls={
        <>
          <Slider
            label={
              <>
                slope <i>m</i>
              </>
            }
            value={m}
            onChange={setM}
            min={slopes[0]}
            max={slopes[1]}
            step={step}
          />
          <Slider
            label={
              <>
                crossing <i>k</i>
              </>
            }
            value={k}
            onChange={setK}
            min={crossings[0]}
            max={crossings[1]}
            step={step}
          />
        </>
      }
    >
      <Grid x={xRange} y={yRange} label={`Graph of ${equation(m, k)}`}>
        {/* the step triangles, under the line */}
        {steps.map((i) => {
          const left = px(i);
          const right = px(i + 1);
          const low = py(at(i));
          const high = py(at(i + 1));
          return (
            <g key={i}>
              <polygon
                points={`${left},${low} ${right},${low} ${right},${high}`}
                fill={rise}
                fillOpacity={0.15}
              />
              <line
                x1={left}
                x2={right}
                y1={low}
                y2={low}
                stroke="currentColor"
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
              <line
                x1={right}
                x2={right}
                y1={low}
                y2={high}
                stroke={rise}
                strokeWidth={2.5}
              />
              {i === middle && (
                <text
                  x={(left + right) / 2}
                  y={m > 0 ? low + 14 : low - 6}
                  textAnchor="middle"
                  fontSize={11}
                  className="fill-fd-muted-foreground"
                  {...halo}
                >
                  1
                </text>
              )}
              {(roomy || i === middle) && (
                <text
                  // at the right edge the climb goes inside the step instead
                  x={i + 1 >= xRange[1] ? right - 5 : right + 5}
                  textAnchor={i + 1 >= xRange[1] ? "end" : "start"}
                  y={(low + high) / 2 + 4}
                  fontSize={12}
                  fontWeight={600}
                  fill={rise}
                  {...halo}
                >
                  {m > 0 ? `+${format(m)}` : format(m)}
                </text>
              )}
            </g>
          );
        })}

        {ends && (
          <line
            x1={px(ends[0][0])}
            y1={py(ends[0][1])}
            x2={px(ends[1][0])}
            y2={py(ends[1][1])}
            stroke={COLORS.blue}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        )}

        {/* where the line crosses the y-axis */}
        {inside(k) && xRange[0] <= 0 && 0 <= xRange[1] && (
          <circle cx={px(0)} cy={py(k)} r={4.5} fill="currentColor" />
        )}
      </Grid>
    </Interactive>
  );
}
