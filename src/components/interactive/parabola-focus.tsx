"use client";

/**
 * The parabola y = x²/4, with its focus F = (0, 1) and directrix y = −1. A slider moves the point
 * P = (q, q²/4) along the curve. The picture joins P to F and straight down to N = (q, −1) on the
 * directrix, draws the tangent at P, and sends a ray straight down onto P: it bounces off along PF.
 * The readout gives both distances, which always agree.
 */

import { useState } from "react";
import { clipLine, Grid, gridScale } from "./grid";
import { COLORS, format, Interactive, Slider, useSmooth } from "./kit";

const X: [number, number] = [-5, 5];
const Y: [number, number] = [-2, 6];
const LIMIT = 4.5;

const height = (x: number) => (x * x) / 4;

// every q is a multiple of 0.5, so q²/4 and q²/4 + 1 have at most four decimal places
const exact = (n: number) => format(n, 4);

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

/** an arrowhead in pixels, pointing from (x1, y1) towards (x2, y2), a fraction t of the way */
function Head({
  x1,
  y1,
  x2,
  y2,
  t,
  color,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  t: number;
  color: string;
}) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (len < 30) return null;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const tx = x1 + (x2 - x1) * t + ux * 6;
  const ty = y1 + (y2 - y1) * t + uy * 6;
  const points = [
    [tx, ty],
    [tx - ux * 12 - uy * 6, ty - uy * 12 + ux * 6],
    [tx - ux * 12 + uy * 6, ty - uy * 12 - ux * 6],
  ]
    .map(([a, b]) => `${a!.toFixed(1)},${b!.toFixed(1)}`)
    .join(" ");
  return <polygon points={points} fill={color} />;
}

export function ParabolaFocus({
  q: start = 3,
  caption = "Slide P along the parabola y = x²/4. It is always as far from the focus F as from the directrix L, and a ray coming straight down onto P bounces off the curve towards F.",
}: {
  /** where P starts: the point (q, q²/4) */
  q?: number;
  caption?: string;
}) {
  const [q, setQ] = useState(start);
  const shown = useSmooth(q);
  const { px, py } = gridScale(X, Y);

  // the picture, drawn at the gliding value
  const P = { x: px(shown), y: py(height(shown)) };
  const F = { x: px(0), y: py(1) };
  const N = { x: px(shown), y: py(-1) };
  const top = { x: px(shown), y: py(Y[1]) };
  // the tangent at P is y = (q/2)x − q²/4, that is (q/2)x − y = q²/4
  const tangent = clipLine(shown / 2, -1, height(shown), X, Y);

  const curve: string[] = [];
  const reach = 2 * Math.sqrt(Y[1]);
  for (let i = 0; i <= 160; i++) {
    const x = -reach + (2 * reach * i) / 160;
    curve.push(`${px(x).toFixed(1)},${py(height(x)).toFixed(1)}`);
  }

  // the readout, at the value chosen
  const h = height(q);
  const pf = Math.hypot(q, h - 1);
  const pn = h + 1;
  const head = `P = (${format(q)}, ${exact(h)}): PF = ${exact(pf)}, PN = ${exact(pn)}`;
  const note =
    q === 0
      ? "P is the vertex and the tangent is the x-axis. The ray passes down through F, and bounces straight back up through it."
      : `The ray straight down would carry on to N = (${format(q)}, −1). The tangent is the perpendicular bisector of FN, so its mirror sends N to F, and the ray bounces off towards F.`;

  // labels go on the side away from the incoming ray and the tangent
  const side = shown >= 0 ? 1 : -1;

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
        <Slider
          label={
            <>
              where <i>P</i> is, <i>q</i>
            </>
          }
          value={q}
          onChange={setQ}
          min={-LIMIT}
          max={LIMIT}
          step={0.5}
        />
      }
    >
      <Grid
        x={X}
        y={Y}
        label={`The parabola y = x²/4 with focus F = (0, 1) and directrix y = −1. The point P = (${format(q)}, ${exact(h)}) is ${exact(pf)} from F and ${exact(pn)} from the directrix. A ray coming straight down onto P bounces off towards F.`}
      >
        {/* the directrix */}
        <line
          x1={px(X[0])}
          x2={px(X[1])}
          y1={py(-1)}
          y2={py(-1)}
          stroke={COLORS.red}
          strokeWidth={2.5}
        />
        <text
          x={px(X[0]) + 6}
          y={py(-1) + 18}
          fontSize={14}
          fontStyle="italic"
          fontWeight={600}
          fill={COLORS.red}
          {...halo}
        >
          L
        </text>

        <polyline
          points={curve.join(" ")}
          fill="none"
          stroke={COLORS.blue}
          strokeWidth={2.75}
          strokeLinejoin="round"
        />

        {tangent && (
          <line
            x1={px(tangent[0][0])}
            y1={py(tangent[0][1])}
            x2={px(tangent[1][0])}
            y2={py(tangent[1][1])}
            stroke={COLORS.purple}
            strokeWidth={2}
            strokeOpacity={0.85}
          />
        )}

        {/* the ray straight down to P, then P to N (the way it would have gone on) */}
        <line
          x1={top.x}
          y1={top.y}
          x2={P.x}
          y2={P.y}
          stroke={COLORS.orange}
          strokeWidth={2.5}
        />
        <Head
          x1={top.x}
          y1={top.y}
          x2={P.x}
          y2={P.y}
          t={0.5}
          color={COLORS.orange}
        />
        <line
          x1={P.x}
          y1={P.y}
          x2={N.x}
          y2={N.y}
          stroke={COLORS.green}
          strokeWidth={2.5}
          strokeDasharray="7 5"
        />
        {/* the reflected ray, from P to F and on a little */}
        <line
          x1={P.x}
          y1={P.y}
          x2={F.x}
          y2={F.y}
          stroke={COLORS.orange}
          strokeWidth={2.5}
        />
        <Head
          x1={P.x}
          y1={P.y}
          x2={F.x}
          y2={F.y}
          t={0.55}
          color={COLORS.orange}
        />

        <circle cx={F.x} cy={F.y} r={5.5} fill={COLORS.orange} />
        <text
          x={F.x - side * 10}
          y={F.y - 8}
          textAnchor={side > 0 ? "end" : "start"}
          fontSize={14}
          fontStyle="italic"
          fontWeight={600}
          fill={COLORS.orange}
          {...halo}
        >
          F
        </text>
        <circle cx={N.x} cy={N.y} r={5.5} fill={COLORS.green} />
        <text
          x={N.x}
          y={N.y + 20}
          textAnchor="middle"
          fontSize={14}
          fontStyle="italic"
          fontWeight={600}
          fill={COLORS.green}
          {...halo}
        >
          N
        </text>
        <circle
          cx={P.x}
          cy={P.y}
          r={6}
          fill="currentColor"
          stroke="var(--color-fd-card)"
          strokeWidth={2}
        />
        <text
          x={P.x - side * 10}
          y={P.y - 10}
          textAnchor={side > 0 ? "end" : "start"}
          fontSize={14}
          fontStyle="italic"
          fontWeight={600}
          fill="currentColor"
          {...halo}
        >
          P
        </text>
      </Grid>
    </Interactive>
  );
}
