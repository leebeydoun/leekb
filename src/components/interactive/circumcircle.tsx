"use client";

/**
 * The circle through a triangle's corners, built one bisector at a time. P and Q stay fixed, and two
 * sliders move M across and up. The steps add the perpendicular bisector of PQ, then that of QM,
 * then the third bisector and the circle. Wherever M goes, the bisectors meet at one point O, the
 * same distance from all three corners; the readout says whether O is inside the triangle, at the
 * middle of a side, or outside it.
 */

import { useState } from "react";
import { COLORS, Choice, Interactive, Slider, format } from "./kit";

const UNIT = 52;
const PAD = 20;
// just big enough for the largest circle the sliders allow: M at (2, 2.5) reaches highest, and M
// at (0, 1.5) lowest
const X0 = -2.7;
const X1 = 2.7;
const Y0 = -2.85;
const Y1 = 3.75;
const WIDTH = (X1 - X0) * UNIT + PAD * 2;
const HEIGHT = (Y1 - Y0) * UNIT + PAD * 2;

type Vec = { x: number; y: number };

const px = (p: Vec): Vec => ({
  x: PAD + (p.x - X0) * UNIT,
  y: PAD + (Y1 - p.y) * UNIT,
});

const distance = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);

const P: Vec = { x: -2, y: 0 };
const Q: Vec = { x: 2, y: 0 };

/** where the perpendicular bisectors of PQ and QM cross: on the line x = 0, as high as is needed */
const circumcentre = (M: Vec): Vec => ({
  x: 0,
  y: (M.x * M.x + M.y * M.y - 4) / (2 * M.y),
});

/** the angle at `at` compared with a right angle: negative is wider, zero is a right angle */
const corner = (at: Vec, a: Vec, b: Vec) =>
  (a.x - at.x) * (b.x - at.x) + (a.y - at.y) * (b.y - at.y);

/**
 * The perpendicular bisector of ab, drawn far enough to pass the midpoint and, when it is shown,
 * the point O, with a little to spare at each end.
 */
function Bisector({
  a,
  b,
  color,
  through,
}: {
  a: Vec;
  b: Vec;
  color: string;
  through?: Vec;
}) {
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const size = distance(a, b) || 1;
  const along = { x: -(b.y - a.y) / size, y: (b.x - a.x) / size };
  // how far along the bisector O lies from the midpoint, positive or negative
  const reach = through
    ? (through.x - mid.x) * along.x + (through.y - mid.y) * along.y
    : 0;
  const spare = 1.2;
  const low = Math.min(0, reach) - spare;
  const high = Math.max(0, reach) + spare;
  const from = px({ x: mid.x + along.x * low, y: mid.y + along.y * low });
  const to = px({ x: mid.x + along.x * high, y: mid.y + along.y * high });
  const m = px(mid);
  return (
    <g>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* the midpoint of the side, where the bisector crosses it */}
      <circle cx={m.x} cy={m.y} r={3.5} fill={color} />
    </g>
  );
}

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

export function Circumcircle() {
  const [across, setAcross] = useState(0.5);
  const [up, setUp] = useState(2.25);
  const [step, setStep] = useState<"one" | "two" | "three">("two");

  const M: Vec = { x: across, y: up };
  const O = circumcentre(M);
  const radius = distance(O, P);

  // where O sits: inside for a triangle whose angles are all smaller than a right angle, at the
  // middle of the side opposite a right angle, and outside, beyond the longest side, otherwise
  const angles: ["P" | "Q" | "M", number, string][] = [
    ["P", corner(P, Q, M), "QM"],
    ["Q", corner(Q, P, M), "PM"],
    ["M", corner(M, P, Q), "PQ"],
  ];
  const right = angles.find(([, value]) => Math.abs(value) < 1e-9);
  const wide = angles.find(([, value]) => value < -1e-9);
  const where = right
    ? `The angle at ${right[0]} is a right angle, so O is the midpoint of the side ${right[2]}.`
    : wide
      ? `The angle at ${wide[0]} is wider than a right angle, so O lies outside the triangle, beyond the side ${wide[2]}.`
      : "Every angle is smaller than a right angle, so O lies inside the triangle.";

  const readout =
    step === "one" ? (
      <>
        <div>Every point of the blue line is as far from P as from Q</div>
        <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
          So the centre is somewhere on this line, but one line isn't enough to
          say where.
        </div>
      </>
    ) : (
      <>
        <div>
          d(O, P) = {format(distance(O, P))}, d(O, Q) = {format(distance(O, Q))}
          , d(O, M) = {format(distance(O, M))}
        </div>
        <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
          {step === "two"
            ? "O is on both bisectors, so it is as far from P as from Q, and as far from Q as from M."
            : `The third bisector passes through O as well. ${where}`}
        </div>
      </>
    );

  // each corner's name sits on the side away from the middle of the triangle
  const centre = px({ x: (P.x + Q.x + M.x) / 3, y: (P.y + Q.y + M.y) / 3 });
  const dot = (at: Vec, name: string, color = "currentColor") => {
    const p = px(at);
    // O can sit right at the middle, so its name always goes up and to the right
    const away = name === "O" ? { x: p.x - 12, y: p.y + 10 } : centre;
    const size = Math.hypot(p.x - away.x, p.y - away.y) || 1;
    return (
      <g>
        <circle cx={p.x} cy={p.y} r={5} fill={color} />
        <text
          x={p.x + ((p.x - away.x) / size) * 17}
          y={p.y + ((p.y - away.y) / size) * 17 + 6}
          textAnchor="middle"
          fontSize={17}
          fontStyle="italic"
          fill={color}
          {...halo}
        >
          {name}
        </text>
      </g>
    );
  };

  const o = px(O);
  const shown = step !== "one";

  return (
    <Interactive
      readout={readout}
      controls={
        <>
          <Slider
            label={
              <>
                <i>M</i> across
              </>
            }
            value={across}
            onChange={setAcross}
            min={-2}
            max={2}
            step={0.25}
          />
          <Slider
            label={
              <>
                <i>M</i> up
              </>
            }
            value={up}
            onChange={setUp}
            min={1.5}
            max={2.5}
            step={0.25}
          />
          <Choice
            label="Show"
            value={step}
            onChange={setStep}
            options={[
              { value: "one", label: "One bisector" },
              { value: "two", label: "Two bisectors" },
              { value: "three", label: "All three, with the circle" },
            ]}
          />
        </>
      }
      caption="Move M with the sliders. The perpendicular bisectors always meet at one point O, the centre of a circle through all three corners."
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-sm text-fd-foreground"
        role="img"
        aria-label={`A triangle PQM with the perpendicular bisectors of its sides. ${step === "one" ? "" : `They meet at O, at distance ${format(radius)} from each corner.`}`}
      >
        {step === "three" && (
          <circle
            cx={o.x}
            cy={o.y}
            r={radius * UNIT}
            fill={COLORS.purple}
            fillOpacity={0.06}
            stroke={COLORS.purple}
            strokeWidth={2.5}
          />
        )}

        <polygon
          points={[P, Q, M].map((p) => `${px(p).x},${px(p).y}`).join(" ")}
          fill="currentColor"
          fillOpacity={0.05}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinejoin="round"
        />

        <Bisector
          a={P}
          b={Q}
          color={COLORS.blue}
          through={shown ? O : undefined}
        />
        {shown && <Bisector a={Q} b={M} color={COLORS.orange} through={O} />}
        {step === "three" && (
          <Bisector a={P} b={M} color={COLORS.green} through={O} />
        )}

        {/* from O to each corner: the three equal distances */}
        {shown && (
          <g
            stroke="currentColor"
            strokeOpacity={0.55}
            strokeWidth={1.75}
            strokeDasharray="6 5"
          >
            {[P, Q, M].map((p, i) => (
              <line key={i} x1={o.x} y1={o.y} x2={px(p).x} y2={px(p).y} />
            ))}
          </g>
        )}

        {dot(P, "P")}
        {dot(Q, "Q")}
        {dot(M, "M")}
        {shown && dot(O, "O", COLORS.purple)}
      </svg>
    </Interactive>
  );
}
