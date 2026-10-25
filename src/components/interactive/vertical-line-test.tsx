"use client";

/**
 * VerticalLineTest: one of five curves on a grid from −5 to 5, and a vertical line x = a that the
 * reader slides across, with the slider or by dragging on the picture. The points where the line
 * meets the curve are marked, and the readout counts them: one point is fine so far, two points
 * mean the curve is not the graph of a function, and no points mean a is not in the domain.
 */

import { useId, useRef, useState, type PointerEvent } from "react";
import { Grid, gridScale } from "./grid";
import { COLORS, Choice, Interactive, Slider, format } from "./kit";

type Range = [number, number];
type Pt = [number, number];
type CurveName = "parabola" | "circle" | "sideways" | "floor" | "cubic";

const X: Range = [-5, 5];
const Y: Range = [-5, 5];

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

const NAMES: Record<CurveName, string> = {
  parabola: "y = x² − 2",
  circle: "x² + y² = 9",
  sideways: "x = y²",
  floor: "y = ⌊x⌋",
  cubic: "y = x³ − 3x",
};

/** the curve as polylines, sampled a little past the box so it leaves cleanly */
function pieces(name: CurveName): Pt[][] {
  const line = (f: (t: number) => Pt, t0: number, t1: number, n = 300) =>
    Array.from({ length: n + 1 }, (_, i) => f(t0 + ((t1 - t0) * i) / n));
  switch (name) {
    case "parabola":
      return [line((t) => [t, t * t - 2], -2.8, 2.8)];
    case "circle":
      return [
        line((t) => [3 * Math.cos(t), 3 * Math.sin(t)], 0, 2 * Math.PI, 240),
      ];
    case "sideways":
      return [line((t) => [t * t, t], -2.4, 2.4)];
    case "cubic":
      return [line((t) => [t, t ** 3 - 3 * t], -2.5, 2.5)];
    case "floor":
      return Array.from({ length: 11 }, (_, i) => {
        const n = i - 5;
        return [
          [n, n],
          [n + 1, n],
        ] as Pt[];
      });
  }
}

/** the points of the curve on the line x = a */
function meets(name: CurveName, a: number): Pt[] {
  switch (name) {
    case "parabola":
      return [[a, a * a - 2]];
    case "cubic":
      return [[a, a ** 3 - 3 * a]];
    case "floor":
      return [[a, Math.floor(a + 1e-9)]];
    case "circle": {
      const s = 9 - a * a;
      if (s < -1e-9) return [];
      if (Math.abs(s) < 1e-9) return [[a, 0]];
      return [
        [a, Math.sqrt(s)],
        [a, -Math.sqrt(s)],
      ];
    }
    case "sideways":
      if (a < -1e-9) return [];
      if (Math.abs(a) < 1e-9) return [[0, 0]];
      return [
        [a, Math.sqrt(a)],
        [a, -Math.sqrt(a)],
      ];
  }
}

/** a coordinate as shown, to two decimal places */
const coord = (n: number) => format(n, 2);

export function VerticalLineTest({
  curve: initialCurve = "circle",
  a: initialA = 1,
}: {
  /** the curve shown first */
  curve?: CurveName;
  /** where the line starts */
  a?: number;
}) {
  const [curve, setCurve] = useState<CurveName>(initialCurve);
  const [a, setA] = useState(initialA);
  const clip = useId();
  const svgBox = useRef<SVGRectElement>(null);
  const { px, py } = gridScale(X, Y);

  const points = meets(curve, a);
  const shown = points.filter(([, y]) => y >= Y[0] - 1e-9 && y <= Y[1] + 1e-9);
  const toPath = (p: Pt[]) =>
    p.map(([x, y]) => `${px(x).toFixed(1)},${py(y).toFixed(1)}`).join(" ");

  // dragging on the picture moves the line to the pointer, to the nearest tenth
  function drag(e: PointerEvent<SVGRectElement>) {
    if (e.type !== "pointerdown" && e.buttons === 0) return;
    const rect = svgBox.current;
    const svg = rect?.ownerSVGElement;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return;
    if (e.type === "pointerdown") rect!.setPointerCapture(e.pointerId);
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    const x = X[0] + ((p.x - px(X[0])) / (px(X[1]) - px(X[0]))) * (X[1] - X[0]);
    setA(Math.max(X[0], Math.min(X[1], Math.round(x * 10) / 10)));
  }

  const list = points
    .map(([x, y]) => `(${coord(x)}, ${coord(y)})`)
    .join(" and ");
  let verdict: string;
  if (points.length === 0)
    verdict = `The line x = ${format(a)} misses the curve: no points, so ${format(a)} would not be in the domain. Fine so far.`;
  else if (points.length === 1)
    verdict = `One point, ${list}${shown.length === 0 ? `, ${points[0]![1] > Y[1] ? "above" : "below"} the picture` : ""}: fine so far.`;
  else
    verdict = `Two points, ${list}: this curve is not the graph of a function.`;

  const bad = points.length > 1;

  return (
    <Interactive
      readout={verdict}
      controls={
        <>
          <Choice
            label="curve"
            value={curve}
            onChange={setCurve}
            options={(Object.keys(NAMES) as CurveName[]).map((k) => ({
              value: k,
              label: NAMES[k],
            }))}
          />
          <Slider
            label={
              <>
                vertical line <i>x</i> =
              </>
            }
            value={a}
            onChange={(v) => setA(Math.round(v * 10) / 10)}
            min={-5}
            max={5}
            step={0.1}
          />
        </>
      }
      caption="Slide the dashed line across, or drag it on the grid. A curve is the graph of a function exactly when no position of the line meets it twice."
    >
      <Grid
        x={X}
        y={Y}
        label={`The curve ${NAMES[curve]} on a grid from −5 to 5, and the vertical line x = ${format(a)}. ${verdict}`}
      >
        <clipPath id={clip}>
          <rect
            x={px(X[0])}
            y={py(Y[1])}
            width={px(X[1]) - px(X[0])}
            height={py(Y[0]) - py(Y[1])}
          />
        </clipPath>
        <g clipPath={`url(#${clip})`} fill="none" strokeLinejoin="round">
          {pieces(curve).map((p, i) => (
            <polyline
              key={i}
              points={toPath(p)}
              stroke={COLORS.blue}
              strokeWidth={2.75}
            />
          ))}
        </g>
        {curve === "floor" &&
          Array.from({ length: 11 }, (_, i) => i - 5).map((n) => (
            <g key={n}>
              {n + 1 <= X[1] && (
                <circle
                  cx={px(n + 1)}
                  cy={py(n)}
                  r={4.5}
                  fill="var(--color-fd-card)"
                  stroke={COLORS.blue}
                  strokeWidth={2.25}
                />
              )}
              <circle cx={px(n)} cy={py(n)} r={4.5} fill={COLORS.blue} />
            </g>
          ))}
        <line
          x1={px(a)}
          x2={px(a)}
          y1={py(Y[0])}
          y2={py(Y[1])}
          stroke={bad ? COLORS.red : COLORS.purple}
          strokeWidth={2.5}
          strokeDasharray="6 4"
        />
        {shown.map(([x, y], i) => (
          <g key={i}>
            <circle
              cx={px(x)}
              cy={py(y)}
              r={6.5}
              fill={bad ? COLORS.red : COLORS.green}
              stroke="var(--color-fd-card)"
              strokeWidth={2}
            />
            <text
              x={px(x) + (x > 2.5 ? -10 : 10)}
              y={py(y) + (i === 1 ? 18 : -9)}
              textAnchor={x > 2.5 ? "end" : "start"}
              fontSize={13}
              fontWeight={600}
              fill={bad ? COLORS.red : COLORS.green}
              {...halo}
            >
              ({coord(x)}, {coord(y)})
            </text>
          </g>
        ))}
        <text
          x={px(X[0]) + 6}
          y={py(Y[1]) + 16}
          fontSize={13}
          fontWeight={600}
          fill={COLORS.blue}
          {...halo}
        >
          {NAMES[curve]}
        </text>
        {/* a clear layer on top that catches the pointer */}
        <rect
          ref={svgBox}
          x={px(X[0])}
          y={py(Y[1])}
          width={px(X[1]) - px(X[0])}
          height={py(Y[0]) - py(Y[1])}
          fill="transparent"
          style={{ touchAction: "none", cursor: "ew-resize" }}
          onPointerDown={drag}
          onPointerMove={drag}
        />
      </Grid>
    </Interactive>
  );
}
