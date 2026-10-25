"use client";

/**
 * One rule for all three curves: the points P whose distance to a focus F is e times their distance
 * to a line L. F sits at the origin and L is the line x = −2. A slider sets e (snapping to 1), and
 * the curve changes from an ellipse through a parabola to a hyperbola. A second slider moves a
 * point P along the curve, with its distance to F and its distance to L drawn and measured.
 */

import { useId, useState } from "react";
import { clipLine, Grid, gridScale } from "./grid";
import { COLORS, format, Interactive, Slider } from "./kit";

const X: [number, number] = [-6, 8];
const Y: [number, number] = [-6, 6];
const D = 2; // the distance from F to L
const { px, py } = gridScale(X, Y);

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

// a little past the edges of the grid, so the curve runs off the picture instead of stopping short
const inBox = (x: number, y: number) =>
  x > X[0] - 1 && x < X[1] + 1 && y > Y[0] - 1 && y < Y[1] + 1;

/**
 * The curve as svg path data. A point at angle θ from F, at distance r, is (r cos θ, r sin θ), and
 * its distance to L is r cos θ + 2 on the right of L and −(r cos θ + 2) on the left. So
 * r = 2e / (1 − e cos θ) on the right of L, and r = −2e / (1 + e cos θ) on the left, which only
 * happens when e > 1: that is the second branch.
 */
function curve(e: number) {
  const parts: string[] = [];
  for (const far of [false, true]) {
    let open = false;
    const steps = 1440;
    for (let i = 0; i <= steps; i++) {
      const t = (2 * Math.PI * i) / steps;
      const below = far ? 1 + e * Math.cos(t) : 1 - e * Math.cos(t);
      const r = far ? (-2 * e) / below : (2 * e) / below;
      const ok = far ? below < -1e-6 : below > 1e-6;
      const x = r * Math.cos(t);
      const y = r * Math.sin(t);
      if (!ok || !inBox(x, y)) {
        open = false;
        continue;
      }
      parts.push(`${open ? "L" : "M"} ${px(x).toFixed(1)} ${py(y).toFixed(1)}`);
      open = true;
    }
  }
  return parts.join(" ");
}

/** the kind of curve, for the readout */
function kind(e: number) {
  if (Math.abs(e - 1) < 1e-9) return "a parabola";
  if (e < 1) return "an ellipse";
  return "a hyperbola (two branches)";
}

export function EccentricityDial({
  e: start = 0.6,
  caption = "Set the ratio e and watch the curve change from an ellipse through a parabola to a hyperbola. Move P along the curve: its distance to F is always e times its distance to the line L.",
}: {
  e?: number;
  caption?: string;
}) {
  const [e, setE] = useState(start);
  const [s, setS] = useState(0.5);
  const clip = useId();

  // P on the branch round F, at angle θ from F. Turning θ away from π (straight left) makes r
  // grow, so the slider covers the angles from π out to where P would leave the grid.
  const reach = (() => {
    let best = 0;
    for (let k = 1; k <= 360; k++) {
      const t = Math.PI - (Math.PI * k) / 360;
      const below = 1 - e * Math.cos(t);
      if (below <= 1e-9) break;
      const rr = (2 * e) / below;
      const x = rr * Math.cos(t);
      const y = rr * Math.sin(t);
      if (x < X[0] || x > X[1] || y < Y[0] || y > Y[1]) break;
      best = (Math.PI * k) / 360;
    }
    return best;
  })();
  const theta = Math.PI + s * reach;
  const r = (2 * e) / (1 - e * Math.cos(theta));
  const P = { x: r * Math.cos(theta), y: r * Math.sin(theta) };
  const toL = P.x + D;
  const shown = inBox(P.x, P.y);

  const directrix = clipLine(1, 0, -D, X, Y)!;

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          e = {format(e)}: {kind(e)}
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            PF = {format(r)}, distance from P to L = {format(toL)}, and{" "}
            {format(r)} ÷ {format(toL)} = {format(r / toL)}
          </div>
        </>
      }
      controls={
        <>
          <Slider
            label={
              <>
                ratio <i>e</i>
              </>
            }
            value={e}
            onChange={(v) => setE(Math.abs(v - 1) < 0.04 ? 1 : v)}
            min={0.2}
            max={2.5}
            step={0.05}
          />
          <Slider
            label={
              <>
                move <i>P</i>
              </>
            }
            value={s}
            onChange={setS}
            min={-1}
            max={1}
            step={0.01}
            show={() => ""}
          />
        </>
      }
    >
      <Grid
        x={X}
        y={Y}
        label={`The focus F at the origin, the line L: x = −2, and the points whose distance to F is ${format(e)} times their distance to L, which make ${kind(e)}. The point P = (${format(P.x)}, ${format(P.y)}) is ${format(r)} from F and ${format(toL)} from L.`}
      >
        {/* the directrix */}
        <line
          x1={px(directrix[0][0])}
          y1={py(directrix[0][1])}
          x2={px(directrix[1][0])}
          y2={py(directrix[1][1])}
          stroke={COLORS.orange}
          strokeWidth={2.5}
        />
        <text
          x={px(-D) - 8}
          y={py(Y[1]) + 18}
          textAnchor="end"
          fontSize={15}
          fontWeight={700}
          fontStyle="italic"
          fill={COLORS.orange}
          {...halo}
        >
          L
        </text>

        <defs>
          <clipPath id={clip}>
            <rect
              x={px(X[0])}
              y={py(Y[1])}
              width={px(X[1]) - px(X[0])}
              height={py(Y[0]) - py(Y[1])}
            />
          </clipPath>
        </defs>
        <path
          clipPath={`url(#${clip})`}
          d={curve(e)}
          fill="none"
          stroke={COLORS.purple}
          strokeWidth={3}
          strokeLinejoin="round"
        />

        {shown && (
          <>
            {/* the two distances */}
            <line
              x1={px(0)}
              y1={py(0)}
              x2={px(P.x)}
              y2={py(P.y)}
              stroke={COLORS.blue}
              strokeWidth={2.5}
            />
            <line
              x1={px(-D)}
              y1={py(P.y)}
              x2={px(P.x)}
              y2={py(P.y)}
              stroke={COLORS.green}
              strokeWidth={2.5}
              strokeDasharray="6 4"
            />
            <circle
              cx={px(P.x)}
              cy={py(P.y)}
              r={6}
              fill="currentColor"
              stroke="var(--color-fd-card)"
              strokeWidth={2}
            />
            <text
              x={px(P.x) + (P.x >= 0 ? 10 : -10)}
              y={py(P.y) + (P.y >= 0 ? -10 : 20)}
              textAnchor={P.x >= 0 ? "start" : "end"}
              fontSize={15}
              fontWeight={700}
              fill="currentColor"
              {...halo}
            >
              P
            </text>
          </>
        )}

        <circle
          cx={px(0)}
          cy={py(0)}
          r={5}
          fill={COLORS.blue}
          stroke="var(--color-fd-card)"
          strokeWidth={2}
        />
        <text
          x={px(0) + 8}
          y={py(0) + 18}
          fontSize={15}
          fontWeight={700}
          fill={COLORS.blue}
          {...halo}
        >
          F
        </text>
      </Grid>
    </Interactive>
  );
}
