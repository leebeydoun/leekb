"use client";

/**
 * RootsOfUnity: the n-th roots of a complex number z, for n from 2 to 12. You drag z on the
 * complex plane (or set it with the sliders), to the nearest tenth, and the n solutions of wⁿ = z
 * appear on the circle of radius |z|^(1/n), joined in order into a regular polygon, with the unit
 * circle drawn faintly for comparison. With z = 1 they are the n-th roots of unity. The readout
 * gives z in polar form, lists every root in polar form and as a + bi (rounded), and checks the
 * root w₁ by multiplying n copies of it together.
 */

import { useRef, useState, type PointerEvent } from "react";
import { COLORS, Interactive, Slider, format } from "./kit";

type Range = [number, number];

const R: Range = [-2, 2];
const SIZE = 400;
const PAD = 28;
const UNIT = SIZE / (R[1] - R[0]);
const px = (x: number) => PAD + (x - R[0]) * UNIT;
const py = (y: number) => PAD + (R[1] - y) * UNIT;
const WIDTH = SIZE + PAD * 2;
const MUTED = "#9ca3af";
const SUB = "₀₁₂₃₄₅₆₇₈₉";

const sub = (k: number) =>
  String(k)
    .split("")
    .map((d) => SUB[Number(d)])
    .join("");

/** a + bi with a proper minus sign, rounded to two places */
function complex(a: number, b: number) {
  const im = Number(b.toFixed(2));
  return `${format(a)} ${im < 0 ? "−" : "+"} ${format(Math.abs(im))}i`;
}

/** an angle in radians, with degrees in brackets */
const angle = (t: number) =>
  `${format(t)} (${format((t * 180) / Math.PI, 1)}°)`;

const ORDINALS = [
  "",
  "",
  "square",
  "cube",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
  "ninth",
  "tenth",
  "eleventh",
  "twelfth",
];

/** "square roots", "cube roots", "fifth roots" */
const roots = (n: number) => `${ORDINALS[n]} roots`;

export function RootsOfUnity({
  n: startN = 5,
  re: startRe = 1,
  im: startIm = 0,
}: {
  /** how many roots at the start, from 2 to 12 */
  n?: number;
  /** the starting z = re + im·i, each between −2 and 2 */
  re?: number;
  im?: number;
}) {
  const [n, setN] = useState(startN);
  const [re, setRe] = useState(startRe);
  const [im, setIm] = useState(startIm);
  const [held, setHeld] = useState(false);
  const box = useRef<SVGRectElement>(null);

  const length = Math.hypot(re, im);
  const zero = length < 1e-9;
  // the angle of z, from 0 up to a full turn
  let theta = Math.atan2(im, re);
  if (theta < 0) theta += 2 * Math.PI;
  const radius = Math.pow(length, 1 / n);
  const ws = Array.from({ length: n }, (_, k) => {
    const t = (theta + 2 * Math.PI * k) / n;
    return { t, a: radius * Math.cos(t), b: radius * Math.sin(t) };
  });

  // n copies of w₁ multiplied together, one multiplication at a time
  const w1 = ws[1]!;
  let pa = 1;
  let pb = 0;
  for (let i = 0; i < n; i++)
    [pa, pb] = [pa * w1.a - pb * w1.b, pa * w1.b + pb * w1.a];

  function pointer(e: PointerEvent<SVGRectElement>) {
    const svg = box.current?.ownerSVGElement;
    const ctm = svg?.getScreenCTM();
    if (!ctm) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    const snap = (v: number) =>
      Math.max(R[0], Math.min(R[1], Math.round(v * 10) / 10));
    setRe(snap(R[0] + (p.x - PAD) / UNIT));
    setIm(snap(R[1] - (p.y - PAD) / UNIT));
  }
  function down(e: PointerEvent<SVGRectElement>) {
    box.current!.setPointerCapture(e.pointerId);
    setHeld(true);
    pointer(e);
  }
  function move(e: PointerEvent<SVGRectElement>) {
    if (held && e.buttons !== 0) pointer(e);
  }

  const zText = complex(re, im);
  const halo = {
    stroke: "var(--color-fd-card)",
    strokeWidth: 4,
    paintOrder: "stroke" as const,
  };
  const ticks = [-2, -1, 1, 2];

  return (
    <Interactive
      readout={
        zero ? (
          <div>
            z = 0, and the only solution of w<sup>{n}</sup> = 0 is w = 0.
          </div>
        ) : (
          <>
            <div>
              z = {zText}: length {format(length)}, angle {angle(theta)}
            </div>
            <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
              The {n} {roots(n)} of z have length {format(length)}
              <sup>1/{n}</sup> = {format(radius)} and angles (θ + 2πk)/{n}:
            </div>
            <ul
              className="mx-auto mt-2 grid max-w-xl grid-cols-1 gap-x-6 text-left text-sm font-normal sm:grid-cols-2"
              style={{ minHeight: "7.5rem" }}
            >
              {ws.map((w, k) => (
                <li key={k}>
                  w{sub(k)} = {complex(w.a, w.b)}, angle {angle(w.t)}
                </li>
              ))}
            </ul>
            <div className="mt-2 text-sm font-normal text-fd-muted-foreground">
              Check: multiplying {n} copies of w₁ together gives{" "}
              {complex(pa, pb)}, which is z.
            </div>
          </>
        )
      }
      controls={
        <>
          <Slider
            label={
              <>
                how many roots, <i>n</i>
              </>
            }
            value={n}
            onChange={setN}
            min={2}
            max={12}
          />
          <Slider
            label="Re z"
            value={re}
            onChange={setRe}
            min={R[0]}
            max={R[1]}
            step={0.1}
          />
          <Slider
            label="Im z"
            value={im}
            onChange={setIm}
            min={R[0]}
            max={R[1]}
            step={0.1}
          />
        </>
      }
      caption="Drag the purple point z, or set it with the sliders. The n solutions of wⁿ = z always sit at the corners of a regular polygon centred at 0. With z = 1 they are the n-th roots of unity, on the unit circle with a corner at 1."
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${WIDTH}`}
        className="mx-auto block h-auto w-full max-w-md text-fd-foreground"
        role="img"
        aria-label={
          zero
            ? "The complex plane with z at 0."
            : `The complex plane with z = ${zText} and its ${n} ${roots(n)}, which lie on the circle of radius ${format(radius)} about 0 and are joined into a regular polygon with ${n} corners.`
        }
      >
        <g className="text-fd-border" stroke="currentColor" strokeWidth={1}>
          {[-2, -1, 0, 1, 2].map((v) => (
            <g key={v}>
              <line x1={px(v)} x2={px(v)} y1={py(R[0])} y2={py(R[1])} />
              <line x1={px(R[0])} x2={px(R[1])} y1={py(v)} y2={py(v)} />
            </g>
          ))}
        </g>
        <g stroke="currentColor" strokeWidth={1.5}>
          <line x1={px(R[0])} x2={px(R[1]) + 10} y1={py(0)} y2={py(0)} />
          <line x1={px(0)} x2={px(0)} y1={py(R[0])} y2={py(R[1]) - 10} />
        </g>
        <polygon
          fill="currentColor"
          points={`${px(R[1]) + 14},${py(0)} ${px(R[1]) + 6},${py(0) - 4} ${px(R[1]) + 6},${py(0) + 4}`}
        />
        <polygon
          fill="currentColor"
          points={`${px(0)},${py(R[1]) - 14} ${px(0) - 4},${py(R[1]) - 6} ${px(0) + 4},${py(R[1]) - 6}`}
        />
        <text x={px(R[1]) - 6} y={py(0) - 9} fontSize={13} fill="currentColor">
          Re
        </text>
        <text x={px(0) + 9} y={py(R[1]) - 6} fontSize={13} fill="currentColor">
          Im
        </text>
        <g fontSize={11} className="fill-fd-muted-foreground">
          {ticks.map((v) => (
            <g key={v}>
              <text x={px(v)} y={py(0) + 15} textAnchor="middle">
                {format(v)}
              </text>
              <text x={px(0) - 6} y={py(v) + 4} textAnchor="end">
                {v === 1 ? "i" : v === -1 ? "−i" : `${format(v)}i`}
              </text>
            </g>
          ))}
        </g>

        {/* the unit circle, faint, and the circle the roots lie on */}
        <circle
          cx={px(0)}
          cy={py(0)}
          r={UNIT}
          fill="none"
          stroke={MUTED}
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
        {!zero && (
          <>
            <circle
              cx={px(0)}
              cy={py(0)}
              r={radius * UNIT}
              fill="none"
              stroke={COLORS.blue}
              strokeOpacity={0.35}
              strokeWidth={1.5}
            />
            <polygon
              points={ws.map((w) => `${px(w.a)},${py(w.b)}`).join(" ")}
              fill={COLORS.blue}
              fillOpacity={0.08}
              stroke={COLORS.blue}
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
            {ws.map((w, k) => (
              <g key={k}>
                <circle
                  cx={px(w.a)}
                  cy={py(w.b)}
                  r={6}
                  fill={k === 1 ? COLORS.orange : COLORS.blue}
                  stroke="var(--color-fd-card)"
                  strokeWidth={2}
                />
                {n <= 8 && (
                  <text
                    x={px(w.a * (1 + 0.32 / radius))}
                    y={py(w.b * (1 + 0.32 / radius)) + 5}
                    textAnchor="middle"
                    fontSize={13}
                    fontWeight={600}
                    fill={k === 1 ? COLORS.orange : COLORS.blue}
                    {...halo}
                  >
                    w{sub(k)}
                  </text>
                )}
              </g>
            ))}
          </>
        )}
        <circle
          cx={px(re)}
          cy={py(im)}
          r={held ? 9 : 7}
          fill={COLORS.purple}
          stroke="var(--color-fd-card)"
          strokeWidth={2}
        />
        <text
          x={px(re) + (re < -1.4 ? 12 : -12)}
          y={py(im) + (im > 1.6 ? 20 : -10)}
          textAnchor={re < -1.4 ? "start" : "end"}
          fontSize={14}
          fontWeight={600}
          fill={COLORS.purple}
          {...halo}
        >
          z
        </text>
        <rect
          ref={box}
          x={px(R[0])}
          y={py(R[1])}
          width={SIZE}
          height={SIZE}
          fill="transparent"
          style={{ touchAction: "none", cursor: "crosshair" }}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={() => setHeld(false)}
          onPointerCancel={() => setHeld(false)}
        />
      </svg>
    </Interactive>
  );
}
