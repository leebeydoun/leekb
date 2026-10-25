"use client";

/**
 * Two complex numbers z and w as points on the complex plane, which you drag (or move with the
 * arrow keys once a point has focus). One choice at a time adds a picture: the sum z + w as the far
 * corner of a parallelogram, the difference z − w as the step from w to z, the conjugate z̄ as the
 * mirror image of z in the real axis, or the absolute value |z| as the radius of a circle about 0.
 * The readout works the choice out in numbers.
 */

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { gridScale } from "./grid";
import { COLORS, Choice, format, Interactive } from "./kit";

type Mode = "sum" | "difference" | "conjugate" | "absolute";
type Pt = [number, number];

const LO = -5;
const HI = 5;
const RANGE: [number, number] = [LO, HI];

/** a + bi written the usual way: 3 − i, 2i, −4, i */
export function complexText(a: number, b: number) {
  if (b === 0) return format(a);
  const im = Math.abs(b) === 1 ? "i" : `${format(Math.abs(b))}i`;
  if (a === 0) return b < 0 ? `−${im}` : im;
  return `${format(a)} ${b < 0 ? "−" : "+"} ${im}`;
}

// a number that is about to be added or subtracted: negatives go in brackets
const bracket = (n: number) => (n < 0 ? `(${format(n)})` : format(n));

/** √n, as a whole number when n is a perfect square */
function root(n: number) {
  const r = Math.sqrt(n);
  if (Number.isInteger(r)) return `√${n} = ${r}`;
  return `√${n} ≈ ${format(r)}`;
}

const clamp = (n: number) => Math.max(LO, Math.min(HI, n));
const inside = ([a, b]: Pt) => a >= LO && a <= HI && b >= LO && b <= HI;

export function ComplexPlane({
  z: z0 = [3, 1],
  w: w0 = [-1, 2],
  caption,
}: {
  /** where z and w start, as [real part, imaginary part] */
  z?: Pt;
  w?: Pt;
  caption?: string;
}) {
  const [z, setZ] = useState<Pt>(z0);
  const [w, setW] = useState<Pt>(w0);
  const [mode, setMode] = useState<Mode>("sum");
  const [held, setHeld] = useState<"z" | "w" | null>(null);
  const box = useRef<SVGRectElement>(null);
  const clip = useId();
  const { unit, width, height, px, py } = gridScale(RANGE, RANGE);

  const usesW = mode === "sum" || mode === "difference";
  const [a, b] = z;
  const [c, d] = w;

  // the pointer's position on the grid, to the nearest whole number
  function pointer(e: PointerEvent<SVGRectElement>): Pt | undefined {
    const ctm = box.current?.ownerSVGElement?.getScreenCTM();
    if (!ctm) return undefined;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    const x = LO + (p.x - px(LO)) / unit;
    const y = HI - (p.y - py(HI)) / unit;
    return [clamp(Math.round(x)), clamp(Math.round(y))];
  }

  // pressing picks up the nearer of the two points (only z, when w isn't drawn)
  function down(e: PointerEvent<SVGRectElement>) {
    const p = pointer(e);
    if (!p) return;
    const far = (q: Pt) => (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2;
    const which = usesW && far(w) < far(z) ? "w" : "z";
    box.current!.setPointerCapture(e.pointerId);
    setHeld(which);
    (which === "z" ? setZ : setW)(p);
  }
  function move(e: PointerEvent<SVGRectElement>) {
    if (held === null || e.buttons === 0) return;
    const p = pointer(e);
    if (p) (held === "z" ? setZ : setW)(p);
  }

  // the arrow keys move a point that has focus by one step
  function keys(set: (p: Pt) => void, [x, y]: Pt) {
    return (e: KeyboardEvent<SVGGElement>) => {
      const step: Record<string, Pt> = {
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        ArrowUp: [0, 1],
        ArrowDown: [0, -1],
      };
      const s = step[e.key];
      if (!s) return;
      e.preventDefault();
      set([clamp(x + s[0]), clamp(y + s[1])]);
    };
  }

  // what the choice adds to the picture
  const sum: Pt = [a + c, b + d];
  const diff: Pt = [a - c, b - d];
  const bar: Pt = [a, -b];
  const size2 = a * a + b * b;

  const off = " It lies off the edge of the grid.";
  let work: string;
  let note: string;
  if (mode === "sum") {
    work = `z + w = (${format(a)} + ${bracket(c)}) + (${format(b)} + ${bracket(d)})i = ${complexText(...sum)}`;
    note =
      "Taking the step z and then the step w lands at the far corner of the parallelogram." +
      (inside(sum) ? "" : off);
  } else if (mode === "difference") {
    work = `z − w = (${format(a)} − ${bracket(c)}) + (${format(b)} − ${bracket(d)})i = ${complexText(...diff)}`;
    note =
      diff[0] === 0 && diff[1] === 0
        ? "z and w are the same point, so the step from w to z is 0."
        : "z − w is the step from w to z, drawn again starting at 0." +
          (inside(diff) ? "" : off);
  } else if (mode === "conjugate") {
    work = `z = ${complexText(a, b)}, so z̄ = ${complexText(...bar)}`;
    note =
      b === 0
        ? "z is real, so it sits on the mirror and z̄ = z."
        : "z̄ is the mirror image of z in the real axis: same real part, imaginary part with its sign changed.";
  } else {
    work = `|z| = √(${bracket(a)}² + ${bracket(b)}²) = ${root(size2)}`;
    note =
      size2 === 0
        ? "z = 0, so its absolute value is 0 and the circle shrinks to a point."
        : "Every point on the circle is this distance from 0, so every one of them has this absolute value.";
  }

  // a dot with its name, which can take focus and be moved with the arrow keys
  const dot = (p: Pt, name: string, color: string, set?: (p: Pt) => void) => (
    <g
      key={name}
      tabIndex={set ? 0 : undefined}
      role={set ? "button" : undefined}
      aria-label={
        set
          ? `${name} = ${complexText(...p)}. Use the arrow keys to move it.`
          : undefined
      }
      onKeyDown={set ? keys(set, p) : undefined}
      className={
        set
          ? "outline-none [&:focus-visible>circle]:stroke-fd-primary"
          : undefined
      }
    >
      <circle
        cx={px(p[0])}
        cy={py(p[1])}
        r={set ? 7 : 6}
        fill={color}
        stroke="var(--color-fd-card)"
        strokeWidth={2}
      />
      <text
        x={px(p[0]) + 10}
        y={py(p[1]) - 10}
        fontSize={14}
        fontWeight={700}
        fill={color}
        stroke="var(--color-fd-card)"
        strokeWidth={4}
        strokeLinejoin="round"
        paintOrder="stroke"
      >
        {name}
      </text>
    </g>
  );

  const line = (p: Pt, q: Pt, color: string, dashed = false, arrow = false) => {
    const x1 = px(p[0]);
    const y1 = py(p[1]);
    const x2 = px(q[0]);
    const y2 = py(q[1]);
    const len = Math.hypot(x2 - x1, y2 - y1);
    if (len < 1) return null;
    const ux = (x2 - x1) / len;
    const uy = (y2 - y1) / len;
    const bx = x2 - ux * 11;
    const by = y2 - uy * 11;
    return (
      <g>
        <line
          x1={x1}
          y1={y1}
          x2={arrow ? x2 - ux * 8 : x2}
          y2={arrow ? y2 - uy * 8 : y2}
          stroke={color}
          strokeWidth={2.5}
          strokeDasharray={dashed ? "6 4" : undefined}
        />
        {arrow && (
          <polygon
            points={`${x2},${y2} ${bx - uy * 5},${by + ux * 5} ${bx + uy * 5},${by - ux * 5}`}
            fill={color}
          />
        )}
      </g>
    );
  };

  const O: Pt = [0, 0];
  const whole = Array.from({ length: HI - LO + 1 }, (_, i) => LO + i);
  const axisName = (n: number) =>
    n === 1 ? "i" : n === -1 ? "−i" : `${format(n)}i`;

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>{work}</div>
          <div className="mt-1 min-h-10 text-sm font-normal text-fd-muted-foreground">
            {note}
          </div>
        </>
      }
      controls={
        <Choice
          label="Show"
          value={mode}
          onChange={setMode}
          options={[
            { value: "sum", label: "z + w" },
            { value: "difference", label: "z − w" },
            { value: "conjugate", label: "z̄" },
            { value: "absolute", label: "|z|" },
          ]}
        />
      }
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto block h-auto w-full max-w-md text-fd-foreground"
        role="img"
        aria-label={`The complex plane with z = ${complexText(a, b)}${usesW ? ` and w = ${complexText(c, d)}` : ""}. ${work}.`}
      >
        <defs>
          <clipPath id={clip}>
            <rect
              x={px(LO)}
              y={py(HI)}
              width={px(HI) - px(LO)}
              height={py(LO) - py(HI)}
            />
          </clipPath>
        </defs>

        {/* the grid, the real and imaginary axes, and their numbers */}
        <g className="text-fd-border" stroke="currentColor" strokeWidth={1}>
          {whole.map((n) => (
            <g key={n}>
              <line x1={px(n)} x2={px(n)} y1={py(LO)} y2={py(HI)} />
              <line x1={px(LO)} x2={px(HI)} y1={py(n)} y2={py(n)} />
            </g>
          ))}
        </g>
        <g stroke="currentColor" strokeWidth={1.5}>
          <line x1={px(LO)} x2={px(HI) + 10} y1={py(0)} y2={py(0)} />
          <line x1={px(0)} x2={px(0)} y1={py(LO)} y2={py(HI) - 10} />
        </g>
        <polygon
          fill="currentColor"
          points={`${px(HI) + 14},${py(0)} ${px(HI) + 6},${py(0) - 4} ${px(HI) + 6},${py(0) + 4}`}
        />
        <polygon
          fill="currentColor"
          points={`${px(0)},${py(HI) - 14} ${px(0) - 4},${py(HI) - 6} ${px(0) + 4},${py(HI) - 6}`}
        />
        <g fontSize={11} className="fill-fd-muted-foreground">
          {whole
            .filter((n) => n !== 0)
            .map((n) => (
              <g key={n}>
                <text x={px(n)} y={py(0) + 15} textAnchor="middle">
                  {format(n)}
                </text>
                <text x={px(0) - 6} y={py(n) + 4} textAnchor="end">
                  {axisName(n)}
                </text>
              </g>
            ))}
        </g>

        <g clipPath={`url(#${clip})`}>
          {mode === "sum" && (
            <>
              <polygon
                points={[O, z, sum, w]
                  .map(([x, y]) => `${px(x)},${py(y)}`)
                  .join(" ")}
                fill={COLORS.purple}
                fillOpacity={0.08}
              />
              {line(z, sum, COLORS.orange, true)}
              {line(w, sum, COLORS.blue, true)}
              {line(O, sum, COLORS.purple, false, true)}
            </>
          )}
          {mode === "difference" && (
            <>
              {line(w, z, COLORS.purple, false, true)}
              {line(O, diff, COLORS.purple, true, true)}
            </>
          )}
          {mode === "conjugate" && (
            <>
              <line
                x1={px(LO)}
                x2={px(HI)}
                y1={py(0)}
                y2={py(0)}
                stroke={COLORS.purple}
                strokeWidth={3}
              />
              {line(z, bar, COLORS.purple, true)}
            </>
          )}
          {mode === "absolute" && size2 > 0 && (
            <circle
              cx={px(0)}
              cy={py(0)}
              r={Math.sqrt(size2) * unit}
              fill={COLORS.green}
              fillOpacity={0.06}
              stroke={COLORS.green}
              strokeWidth={2.5}
            />
          )}
          {(mode === "sum" || mode === "conjugate") &&
            line(O, z, COLORS.blue, false, true)}
          {mode === "absolute" && line(O, z, COLORS.green)}
          {usesW && line(O, w, COLORS.orange, false, true)}

          {mode === "sum" && inside(sum) && dot(sum, "z + w", COLORS.purple)}
          {mode === "difference" &&
            inside(diff) &&
            dot(diff, "z − w", COLORS.purple)}
          {mode === "conjugate" && b !== 0 && dot(bar, "z̄", COLORS.purple)}
        </g>
        {usesW && dot(w, "w", COLORS.orange, setW)}
        {dot(z, "z", COLORS.blue, setZ)}

        {/* the surface you drag on, over everything */}
        <rect
          ref={box}
          x={px(LO) - unit / 2}
          y={py(HI) - unit / 2}
          width={px(HI) - px(LO) + unit}
          height={py(LO) - py(HI) + unit}
          fill="transparent"
          style={{ touchAction: "none", cursor: held ? "grabbing" : "grab" }}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={() => setHeld(null)}
          onPointerCancel={() => setHeld(null)}
        />
      </svg>
    </Interactive>
  );
}
