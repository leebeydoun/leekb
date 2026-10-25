"use client";

/**
 * ComplexMultiply: two complex numbers z and w, each given by a length and an angle, and their
 * product zw. Drag z or w on the grid (or use the sliders): lengths go in steps of a quarter from
 * 1/4 to 2, angles in steps of π/12 (15°). Arcs near 0 mark the angles of z, w and zw, so you can see
 * the angle of zw is the sum of the other two, and the readout multiplies the lengths and adds the
 * angles with the numbers in.
 */

import { useRef, useState, type PointerEvent } from "react";
import { Grid, gridScale } from "./grid";
import { COLORS, Interactive, Slider, format } from "./kit";

type Range = [number, number];
type Polar = { length: number; degrees: number };

const RANGE: Range = [-4, 4];
const STEP = 0.25;
const MAX = 2;

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** an angle that is a whole number of 15° steps, in radians: "0", "π/6", "5π/12", "3π/2" */
function radians(degrees: number) {
  const steps = Math.round(degrees / 15);
  if (steps === 0) return "0";
  const g = gcd(steps, 12);
  const top = steps / g;
  const bottom = 12 / g;
  const pi = `${top === 1 ? "" : top}π`;
  return bottom === 1 ? pi : `${pi}/${bottom}`;
}

/** an angle in radians with its size in degrees after it, e.g. "π/6 (30°)" */
const angle = (degrees: number) => `${radians(degrees)} (${degrees}°)`;

/** a number a + bi to two places, writing −0.5i rather than + −0.5i */
function cartesian(x: number, y: number) {
  const a = Number(x.toFixed(2));
  const b = Number(y.toFixed(2));
  if (b === 0) return format(a);
  const bi = `${Math.abs(b) === 1 ? "" : format(Math.abs(b))}i`;
  if (a === 0) return b < 0 ? `−${bi}` : bi;
  return `${format(a)} ${b < 0 ? "−" : "+"} ${bi}`;
}

const point = ({ length, degrees }: Polar) => ({
  x: length * Math.cos((degrees * Math.PI) / 180),
  y: length * Math.sin((degrees * Math.PI) / 180),
});

/** the arc near 0 from angle 0 round to `degrees`, anticlockwise, `r` pixels from 0 */
function arc(cx: number, cy: number, r: number, degrees: number) {
  const t = (degrees * Math.PI) / 180;
  if (degrees === 0) return "";
  if (degrees >= 360)
    return `M ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy}`;
  const end = { x: cx + r * Math.cos(t), y: cy - r * Math.sin(t) };
  return `M ${cx + r} ${cy} A ${r} ${r} 0 ${degrees > 180 ? 1 : 0} 0 ${end.x} ${end.y}`;
}

export function ComplexMultiply() {
  const [z, setZ] = useState<Polar>({ length: 2, degrees: 30 });
  const [w, setW] = useState<Polar>({ length: 1.5, degrees: 45 });
  const [held, setHeld] = useState<"z" | "w" | null>(null);
  const box = useRef<SVGRectElement>(null);
  const { px, py, unit } = gridScale(RANGE, RANGE);

  const sum = z.degrees + w.degrees;
  const turned = sum % 360;
  const product: Polar = { length: z.length * w.length, degrees: sum };
  const pz = point(z);
  const pw = point(w);
  const pp = point(product);

  // the pointer's position, snapped to a length in quarters and an angle in 15° steps
  function pointer(e: PointerEvent<SVGRectElement>): Polar | undefined {
    const svg = box.current?.ownerSVGElement;
    const ctm = svg?.getScreenCTM();
    if (!ctm) return undefined;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    const x = RANGE[0] + (p.x - px(RANGE[0])) / unit;
    const y = RANGE[1] - (p.y - py(RANGE[1])) / unit;
    const length = Math.min(
      MAX,
      Math.max(STEP, Math.round(Math.hypot(x, y) / STEP) * STEP),
    );
    const raw = (Math.atan2(y, x) * 180) / Math.PI;
    const degrees = (((Math.round(raw / 15) * 15) % 360) + 360) % 360;
    return { length, degrees };
  }

  function down(e: PointerEvent<SVGRectElement>) {
    const at = pointer(e);
    if (!at) return;
    const p = point(at);
    const near =
      Math.hypot(p.x - pz.x, p.y - pz.y) <= Math.hypot(p.x - pw.x, p.y - pw.y)
        ? "z"
        : "w";
    box.current!.setPointerCapture(e.pointerId);
    setHeld(near);
    (near === "z" ? setZ : setW)(at);
  }
  function move(e: PointerEvent<SVGRectElement>) {
    if (held === null || e.buttons === 0) return;
    const at = pointer(e);
    if (at) (held === "z" ? setZ : setW)(at);
  }

  const o = { x: px(0), y: py(0) };
  const numbers = [
    { name: "z", at: pz, color: COLORS.blue, degrees: z.degrees, r: 0.45 },
    { name: "w", at: pw, color: COLORS.green, degrees: w.degrees, r: 0.75 },
    {
      name: "zw",
      at: pp,
      color: COLORS.orange,
      degrees: turned,
      r: 1.05,
    },
  ];

  const lengthLine = `length ${format(z.length)} × ${format(w.length)} = ${format(product.length, 4)}`;
  const angleLine =
    sum >= 360
      ? `angle ${radians(z.degrees)} + ${radians(w.degrees)} = ${angle(sum)}, the same direction as ${angle(turned)}`
      : `angle ${radians(z.degrees)} + ${radians(w.degrees)} = ${angle(sum)}`;

  const slider = (label: string, value: Polar, set: (p: Polar) => void) => (
    <>
      <Slider
        label={
          <>
            length of <i>{label}</i>
          </>
        }
        value={value.length}
        onChange={(length) => set({ ...value, length })}
        min={STEP}
        max={MAX}
        step={STEP}
      />
      <Slider
        label={
          <>
            angle of <i>{label}</i>
          </>
        }
        value={value.degrees}
        onChange={(degrees) => set({ ...value, degrees })}
        min={0}
        max={345}
        step={15}
        show={(d) => `${d}°`}
      />
    </>
  );

  return (
    <Interactive
      readout={
        <div className="min-h-24">
          <div>
            |z| = {format(z.length)}, angle {angle(z.degrees)}; |w| ={" "}
            {format(w.length)}, angle {angle(w.degrees)}
          </div>
          <div>
            zw: {lengthLine}, {angleLine}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            z ≈ {cartesian(pz.x, pz.y)}, w ≈ {cartesian(pw.x, pw.y)}, and zw ≈{" "}
            {cartesian(pp.x, pp.y)}
          </div>
        </div>
      }
      controls={
        <>
          {slider("z", z, setZ)}
          {slider("w", w, setW)}
        </>
      }
      caption="Drag z (blue) or w (green), or use the sliders. The product zw (orange) has length |z| times |w|, and its angle is the angle of z plus the angle of w. The dashed circle has radius 1."
    >
      <Grid
        x={RANGE}
        y={RANGE}
        label={`z has length ${format(z.length)} and angle ${angle(z.degrees)}, w has length ${format(w.length)} and angle ${angle(w.degrees)}, and their product zw has length ${format(product.length, 4)} and angle ${angle(sum)}.`}
      >
        <circle
          cx={o.x}
          cy={o.y}
          r={unit}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={1.5}
          strokeDasharray="5 5"
        />
        {numbers.map(({ name, at, color, degrees, r }) => (
          <g key={name}>
            <path
              d={arc(o.x, o.y, r * unit, degrees)}
              fill="none"
              stroke={color}
              strokeWidth={2.5}
            />
            <line
              x1={o.x}
              y1={o.y}
              x2={px(at.x)}
              y2={py(at.y)}
              stroke={color}
              strokeWidth={2.5}
            />
          </g>
        ))}
        {numbers.map(({ name, at, color }) => {
          const d = Math.hypot(at.x, at.y) || 1;
          return (
            <g key={name}>
              <circle
                cx={px(at.x)}
                cy={py(at.y)}
                r={name === "zw" ? 6 : 8}
                fill={color}
                stroke="var(--color-fd-card)"
                strokeWidth={2}
              />
              <text
                x={px(at.x) + (at.x / d) * 18}
                y={py(at.y) - (at.y / d) * 18 + 5}
                textAnchor="middle"
                fontSize={15}
                fontWeight={700}
                fontStyle="italic"
                fill={color}
                stroke="var(--color-fd-card)"
                strokeWidth={4}
                paintOrder="stroke"
              >
                {name}
              </text>
            </g>
          );
        })}
        <rect
          ref={box}
          x={px(RANGE[0])}
          y={py(RANGE[1])}
          width={px(RANGE[1]) - px(RANGE[0])}
          height={py(RANGE[0]) - py(RANGE[1])}
          fill="transparent"
          className="cursor-grab touch-none"
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={() => setHeld(null)}
        />
      </Grid>
    </Interactive>
  );
}
