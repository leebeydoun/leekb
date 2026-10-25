"use client";

/**
 * The unit circle and the vertical line x = 1, which touches it at E₁ = (1, 0). A slider turns the
 * angle x between −1.45 and 1.45 radians. The ray from O at angle x passes through the point
 * (cos x, sin x) on the circle and meets the line x = 1 at height tan x. The picture shows the
 * cosine across, the sine up and the tangent on the line, and the readout divides one by the other.
 * Near ±π/2 the ray meets the line far off the picture, and the readout says so.
 */

import { useState } from "react";
import { Grid, gridScale } from "./grid";
import { Button, COLORS, format, Interactive, Slider, useSmooth } from "./kit";

const X: [number, number] = [-1.25, 1.75];
const Y: [number, number] = [-2.5, 2.5];
const LIMIT = 1.45;

const degrees = (x: number) => (x * 180) / Math.PI;

const SNAPS = [
  { value: -Math.PI / 3, label: "−π/3" },
  { value: Math.PI / 6, label: "π/6" },
  { value: Math.PI / 4, label: "π/4" },
  { value: Math.PI / 3, label: "π/3" },
];

/** the arc of the angle at O, from the positive x-axis round to angle x, radius r in pixels */
function arc(cx: number, cy: number, r: number, x: number) {
  const end = { x: cx + r * Math.cos(x), y: cy - r * Math.sin(x) };
  const sweep = x > 0 ? 0 : 1;
  return `M ${cx + r} ${cy} A ${r} ${r} 0 0 ${sweep} ${end.x} ${end.y}`;
}

export function TangentLine({
  x: start = 0.79,
  caption = "Turn the ray. It passes through the point (cos x, sin x) on the unit circle and meets the line x = 1 at height tan x. The small triangle under the point and the large triangle under the line have the same shape.",
}: {
  /** the angle the ray starts at, in radians */
  x?: number;
  caption?: string;
}) {
  const [x, setX] = useState(start);
  const shown = useSmooth(x);
  const { px, py, unit } = gridScale(X, Y);

  const c = Math.cos(shown);
  const s = Math.sin(shown);
  const t = Math.tan(shown);
  // the tangent segment and the ray stop at the edge of the picture when tan x is too large
  const tTop = Math.max(Y[0], Math.min(Y[1], t));
  const offPicture = Math.abs(t) > Y[1];
  // the far end of the ray: the right edge of the picture, or the top or bottom if it leaves first
  const clippedRayEnd =
    Math.abs(t * X[1]) > Y[1]
      ? { x: (Math.sign(t) * Y[1]) / t, y: Math.sign(t) * Y[1] }
      : { x: X[1], y: t * X[1] };

  const cosX = Math.cos(x);
  const sinX = Math.sin(x);
  const tanX = Math.tan(x);
  const head = `x = ${format(x)} (${format(degrees(x), 1)}°): tan x = sin x ÷ cos x = ${format(sinX)} ÷ ${format(cosX)} = ${format(tanX)}`;
  let note: string;
  if (Math.abs(x) < 0.005)
    note =
      "The ray runs along the x-axis and meets the line x = 1 at E₁, at height 0.";
  else if (Math.abs(tanX) > Y[1])
    note =
      x > 0
        ? "The ray meets the line x = 1 far up, off the picture: as x nears π/2, tan x grows without bound."
        : "The ray meets the line x = 1 far down, off the picture: as x nears −π/2, tan x falls without bound.";
  else
    note = `That is the height where the ray meets the line x = 1, ${x > 0 ? "above" : "below"} E₁.`;

  const halo = {
    stroke: "var(--color-fd-card)",
    strokeWidth: 4,
    paintOrder: "stroke" as const,
  };
  const below = s >= 0;

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>{head}</div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {note}
          </div>
        </>
      }
      controls={
        <>
          <Slider
            label={
              <>
                angle <i>x</i>
              </>
            }
            value={x}
            onChange={setX}
            min={-LIMIT}
            max={LIMIT}
            step={0.01}
            show={(v) => `${format(v)} (${format(degrees(v), 1)}°)`}
          />
          <div className="flex flex-wrap gap-2">
            {SNAPS.map((snap) => (
              <Button key={snap.label} onClick={() => setX(snap.value)}>
                {snap.label}
              </Button>
            ))}
          </div>
        </>
      }
    >
      <Grid
        x={X}
        y={Y}
        label={`The unit circle and the line x = 1. The ray from O at angle ${format(x)} passes through (${format(cosX)}, ${format(sinX)}) and meets the line x = 1 at height ${format(tanX)}.`}
      >
        {/* the unit circle */}
        <circle
          cx={px(0)}
          cy={py(0)}
          r={unit}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.55}
          strokeWidth={2}
        />

        {/* the line x = 1, which touches the circle at E₁ */}
        <line
          x1={px(1)}
          x2={px(1)}
          y1={py(Y[0])}
          y2={py(Y[1])}
          stroke={COLORS.purple}
          strokeWidth={2}
        />
        <text
          x={px(1) + 6}
          y={py(Y[0]) - 6}
          fontSize={13}
          fill={COLORS.purple}
          {...halo}
        >
          x = 1
        </text>

        {/* the ray from O at angle x */}
        <line
          x1={px(0)}
          y1={py(0)}
          x2={px(clippedRayEnd.x)}
          y2={py(clippedRayEnd.y)}
          stroke="currentColor"
          strokeWidth={2}
        />

        {/* the angle at O */}
        <path
          d={arc(px(0), py(0), 22, shown)}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        />

        {/* the two triangles: the small one under the point, the large one under the line */}
        <polygon
          points={`${px(0)},${py(0)} ${px(1)},${py(0)} ${px(1)},${py(tTop)}`}
          fill={COLORS.green}
          fillOpacity={0.08}
        />
        <polygon
          points={`${px(0)},${py(0)} ${px(c)},${py(0)} ${px(c)},${py(s)}`}
          fill={COLORS.orange}
          fillOpacity={0.12}
        />

        {/* cos x across, sin x up, tan x on the line */}
        <line
          x1={px(0)}
          y1={py(0)}
          x2={px(c)}
          y2={py(0)}
          stroke={COLORS.blue}
          strokeWidth={4}
        />
        <line
          x1={px(c)}
          y1={py(0)}
          x2={px(c)}
          y2={py(s)}
          stroke={COLORS.orange}
          strokeWidth={4}
          strokeDasharray="6 4"
        />
        <line
          x1={px(1)}
          y1={py(0)}
          x2={px(1)}
          y2={py(tTop)}
          stroke={COLORS.green}
          strokeWidth={5}
        />

        {c > 0.35 && (
          <text
            x={px(c / 2)}
            y={below ? py(0) + 18 : py(0) - 8}
            textAnchor="middle"
            fontSize={13}
            fontWeight={600}
            fill={COLORS.blue}
            {...halo}
          >
            cos x
          </text>
        )}
        {Math.abs(s) > 0.15 && (
          <text
            x={px(c) - 6}
            y={py(s / 2) + 4}
            textAnchor="end"
            fontSize={13}
            fontWeight={600}
            fill={COLORS.orange}
            {...halo}
          >
            sin x
          </text>
        )}
        {Math.abs(tTop) > 0.15 && (
          <text
            x={px(1) + 8}
            y={py(tTop / 2) + 4}
            fontSize={13}
            fontWeight={600}
            fill={COLORS.green}
            {...halo}
          >
            tan x
          </text>
        )}

        {/* the point on the circle, E₁, and where the ray meets the line */}
        <circle
          cx={px(c)}
          cy={py(s)}
          r={5}
          fill={COLORS.orange}
          stroke="var(--color-fd-card)"
          strokeWidth={2}
        />
        <circle cx={px(1)} cy={py(0)} r={4} fill="currentColor" />
        <text
          x={px(1) + 6}
          y={below ? py(0) + 16 : py(0) - 8}
          fontSize={13}
          fontWeight={700}
          fill="currentColor"
          {...halo}
        >
          E₁
        </text>
        {!offPicture && (
          <circle
            cx={px(1)}
            cy={py(t)}
            r={5}
            fill={COLORS.green}
            stroke="var(--color-fd-card)"
            strokeWidth={2}
          />
        )}
        <text
          x={px(0) - 6}
          y={below ? py(0) + 16 : py(0) - 8}
          textAnchor="end"
          fontSize={13}
          fontWeight={700}
          fill="currentColor"
          {...halo}
        >
          O
        </text>
      </Grid>
    </Interactive>
  );
}
