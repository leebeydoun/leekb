"use client";

/**
 * Two rays from one point P: the ray in direction A (blue) and the ray in direction cA (orange).
 * Sliders set A and the number c. For every c > 0 the orange ray lies on top of the blue one,
 * however long cA is; for c < 0 it points the other way and the two rays share only P; at c = 0
 * the step cA is the origin, which gives no ray at all.
 */

import { useId, useState } from "react";
import { Grid, gridScale } from "./grid";
import { COLORS, format, Interactive, Slider } from "./kit";

const RANGE: [number, number] = [-5, 5];
const P = { x: -1, y: -1 };

type Vec = { x: number; y: number };

/** an arrow from one screen point to another, with a filled head at the far end */
function Arrow({
  from,
  to,
  color,
  width = 3,
}: {
  from: Vec;
  to: Vec;
  color: string;
  width?: number;
}) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const size = Math.hypot(dx, dy);
  if (size < 1e-6) return null;
  const ux = dx / size;
  const uy = dy / size;
  const head = Math.min(12, size / 2);
  const base = { x: to.x - ux * head, y: to.y - uy * head };
  const side = { x: -uy * head * 0.45, y: ux * head * 0.45 };
  return (
    <g>
      <line
        x1={from.x}
        y1={from.y}
        x2={base.x}
        y2={base.y}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
      <polygon
        points={`${to.x},${to.y} ${base.x + side.x},${base.y + side.y} ${base.x - side.x},${base.y - side.y}`}
        fill={color}
      />
    </g>
  );
}

const point = (x: number, y: number) => `(${format(x)}, ${format(y)})`;

export function RayDirection({
  caption = "Set A and c with the sliders. The blue ray goes from P in direction A and the orange ray from P in direction cA. For every c > 0 they are the same ray.",
}: {
  caption?: string;
}) {
  const [a1, setA1] = useState(2);
  const [a2, setA2] = useState(1);
  const [c, setC] = useState(2);
  const clip = useId();
  const { px, py, unit } = gridScale(RANGE, RANGE);

  const isOrigin = a1 === 0 && a2 === 0;
  const b1 = c * a1;
  const b2 = c * a2;
  const noDirection = isOrigin || c === 0;

  const start = { x: px(P.x), y: py(P.y) };
  const tip = (x: number, y: number) => ({
    x: px(P.x + x),
    y: py(P.y + y),
  });
  // far enough along to leave the grid, which is 10 units across; the tips P + A and P + cA stay
  // inside it, since P = (−1, −1), each coordinate of A is at most 2 in size and |c| ≤ 2
  const far = (x: number, y: number) => {
    const length = Math.hypot(x, y);
    return tip((x / length) * 20, (y / length) * 20);
  };

  const halo = {
    stroke: "var(--color-fd-card)",
    strokeWidth: 5,
    strokeLinejoin: "round" as const,
    paintOrder: "stroke" as const,
  };

  // each label sits to one side of its arrow's tip: A on the left of the ray, cA on the right
  const sideLabel = (x: number, y: number, flip: number) => {
    const length = Math.hypot(x, y);
    const end = tip(x, y);
    // the screen y axis points down, so the left normal of (x, y) on screen is (−y, −x) / length
    return {
      x: end.x + (-y / length) * 18 * flip,
      y: end.y + (-x / length) * 18 * flip + 5,
    };
  };

  let readout;
  if (isOrigin) {
    readout = (
      <>
        <div>A = (0, 0)</div>
        <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
          The origin is not a direction: P + tO = P for every t, so there is no
          ray.
        </div>
      </>
    );
  } else if (c === 0) {
    readout = (
      <>
        <div>A = {point(a1, a2)} and cA = 0A = (0, 0)</div>
        <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
          cA is the origin, which is not a direction, so it gives no ray.
        </div>
      </>
    );
  } else {
    readout = (
      <>
        <div>
          A = {point(a1, a2)} and cA = {point(b1, b2)}
        </div>
        <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
          {c > 0
            ? `c = ${format(c)} is positive, so cA has the same direction as A, and the two rays from P are the same ray.`
            : `c = ${format(c)} is negative, so cA has the opposite direction to A. The two rays point opposite ways and share only P.`}
        </div>
      </>
    );
  }

  // P's label sits behind P, on the side away from A, where neither ray runs when c > 0
  const lengthA = Math.hypot(a1, a2);
  const labelP = isOrigin
    ? { x: start.x - 14, y: start.y + 20 }
    : {
        x: start.x - (a1 / lengthA) * 20,
        y: start.y + (a2 / lengthA) * 20 + 5,
      };
  const labelA = isOrigin ? undefined : sideLabel(a1, a2, 1);
  const labelB = noDirection ? undefined : sideLabel(b1, b2, -1);

  return (
    <Interactive
      caption={caption}
      readout={readout}
      controls={
        <>
          <Slider label="A: a₁" value={a1} onChange={setA1} min={-2} max={2} />
          <Slider label="A: a₂" value={a2} onChange={setA2} min={-2} max={2} />
          <Slider
            label="c"
            value={c}
            onChange={setC}
            min={-2}
            max={2}
            step={0.25}
          />
        </>
      }
    >
      <Grid
        x={RANGE}
        y={RANGE}
        label={
          noDirection
            ? "The point P = (−1, −1) with no ray drawn, because the direction is the origin."
            : `Rays from P = (−1, −1) in direction A = ${point(a1, a2)} and in direction cA = ${point(b1, b2)}. ${c > 0 ? "They are the same ray." : "They point opposite ways."}`
        }
      >
        <defs>
          <clipPath id={clip}>
            <rect
              x={px(RANGE[0])}
              y={py(RANGE[1])}
              width={(RANGE[1] - RANGE[0]) * unit}
              height={(RANGE[1] - RANGE[0]) * unit}
            />
          </clipPath>
        </defs>

        <g clipPath={`url(#${clip})`}>
          {!isOrigin && (
            <line
              x1={start.x}
              y1={start.y}
              x2={far(a1, a2).x}
              y2={far(a1, a2).y}
              stroke={COLORS.blue}
              strokeOpacity={0.35}
              strokeWidth={9}
              strokeLinecap="round"
            />
          )}
          {!noDirection && (
            <line
              x1={start.x}
              y1={start.y}
              x2={far(b1, b2).x}
              y2={far(b1, b2).y}
              stroke={COLORS.orange}
              strokeWidth={2.5}
              strokeDasharray="7 5"
            />
          )}
          {!isOrigin && (
            <Arrow from={start} to={tip(a1, a2)} color={COLORS.blue} />
          )}
          {!noDirection && (
            <Arrow
              from={start}
              to={tip(b1, b2)}
              color={COLORS.orange}
              width={2.5}
            />
          )}
        </g>

        {labelA && (
          <text
            x={labelA.x}
            y={labelA.y}
            textAnchor="middle"
            fontSize={15}
            fontWeight={700}
            fill={COLORS.blue}
            {...halo}
          >
            A
          </text>
        )}
        {labelB && (
          <text
            x={labelB.x}
            y={labelB.y}
            textAnchor="middle"
            fontSize={15}
            fontWeight={700}
            fill={COLORS.orange}
            {...halo}
          >
            cA
          </text>
        )}

        <circle cx={start.x} cy={start.y} r={5} fill="currentColor" />
        <text
          x={labelP.x}
          y={labelP.y}
          textAnchor="middle"
          fontSize={15}
          fontWeight={700}
          fill="currentColor"
          {...halo}
        >
          P
        </text>
      </Grid>
    </Interactive>
  );
}
