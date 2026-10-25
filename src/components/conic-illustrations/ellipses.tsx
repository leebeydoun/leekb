import type { ReactNode } from "react";
import { Figure } from "../figure";
import {
  BLUE,
  GRASS,
  GRASS_DARK,
  ORANGE,
  PURPLE,
  Svg,
  WOOD,
  WOOD_DARK,
  Words,
} from "../illustrations";

/**
 * Pictures for the guide Ellipses. A gardener's two pegs and loop of string marking out an oval bed,
 * then ellipses on axes: the unit circle stretched into an ellipse, the parts of an ellipse, an
 * ellipse slid away from the origin, the two foci with the distances from a point, and three
 * parallel lines meeting an ellipse twice, once and not at all. Every curve on axes uses the same
 * scale across and up, so its shape is the true one.
 */

const MUTED = "#9ca3af";
const GREEN = "#22c55e";

type Range = readonly [number, number];
type Scale = { px: (x: number) => number; py: (y: number) => number };

const PAD = 30;

/**
 * Axes for x from x0 to x1 and y from y0 to y1, `unit` pixels to one unit both ways. Faint lines
 * mark the whole numbers, and small numbers sit along the axes every `every` units. Whatever
 * `children` draws goes on top, given the scale.
 */
function Plane({
  x: [x0, x1],
  y: [y0, y1],
  unit,
  every = 1,
  label,
  children,
}: {
  x: Range;
  y: Range;
  unit: number;
  every?: number;
  label: string;
  children: (s: Scale) => ReactNode;
}) {
  const width = PAD + (x1 - x0) * unit + PAD;
  const height = PAD + (y1 - y0) * unit + PAD;
  const px = (x: number) => PAD + (x - x0) * unit;
  const py = (y: number) => PAD + (y1 - y) * unit;
  const whole = (lo: number, hi: number) => {
    const out: number[] = [];
    for (let n = Math.ceil(lo); n <= Math.floor(hi); n++) out.push(n);
    return out;
  };
  const xs = whole(x0, x1);
  const ys = whole(y0, y1);
  const name = (n: number) => (n < 0 ? `−${-n}` : String(n));

  return (
    <Svg width={width} height={height} label={label}>
      <g className="text-fd-border" stroke="currentColor" strokeWidth={1}>
        {xs.map((x) => (
          <line key={`v${x}`} x1={px(x)} x2={px(x)} y1={py(y0)} y2={py(y1)} />
        ))}
        {ys.map((y) => (
          <line key={`h${y}`} x1={px(x0)} x2={px(x1)} y1={py(y)} y2={py(y)} />
        ))}
      </g>
      <g stroke="currentColor" strokeWidth={1.5}>
        <line x1={px(x0)} x2={px(x1) + 10} y1={py(0)} y2={py(0)} />
        <line x1={px(0)} x2={px(0)} y1={py(y0)} y2={py(y1) - 10} />
      </g>
      <polygon
        fill="currentColor"
        points={`${px(x1) + 14},${py(0)} ${px(x1) + 6},${py(0) - 4} ${px(x1) + 6},${py(0) + 4}`}
      />
      <polygon
        fill="currentColor"
        points={`${px(0)},${py(y1) - 14} ${px(0) - 4},${py(y1) - 6} ${px(0) + 4},${py(y1) - 6}`}
      />
      <text
        x={px(x1) + 6}
        y={py(0) - 9}
        fontSize={14}
        fontStyle="italic"
        fill="currentColor"
      >
        x
      </text>
      <text
        x={px(0) + 9}
        y={py(y1) - 6}
        fontSize={14}
        fontStyle="italic"
        fill="currentColor"
      >
        y
      </text>
      <g fontSize={11} className="fill-fd-muted-foreground">
        {xs
          .filter((x) => x !== 0 && x % every === 0)
          .map((x) => (
            <text key={`tx${x}`} x={px(x)} y={py(0) + 15} textAnchor="middle">
              {name(x)}
            </text>
          ))}
        {ys
          .filter((y) => y !== 0 && y % every === 0)
          .map((y) => (
            <text key={`ty${y}`} x={px(0) - 6} y={py(y) + 4} textAnchor="end">
              {name(y)}
            </text>
          ))}
      </g>
      {children({ px, py })}
    </Svg>
  );
}

/** the ellipse with centre (h, k) and half-widths a across and b up, as an svg path */
function ellipsePath({ px, py }: Scale, a: number, b: number, h = 0, k = 0) {
  const steps = 160;
  return (
    Array.from({ length: steps + 1 }, (_, i) => {
      const t = (2 * Math.PI * i) / steps;
      const x = px(h + a * Math.cos(t)).toFixed(1);
      const y = py(k + b * Math.sin(t)).toFixed(1);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ") + " Z"
  );
}

function Curve({
  s,
  a,
  b,
  h = 0,
  k = 0,
  color = PURPLE,
  faint = false,
}: {
  s: Scale;
  a: number;
  b: number;
  h?: number;
  k?: number;
  color?: string;
  faint?: boolean;
}) {
  return (
    <path
      d={ellipsePath(s, a, b, h, k)}
      fill="none"
      stroke={faint ? MUTED : color}
      strokeWidth={faint ? 2 : 3}
      strokeDasharray={faint ? "6 5" : undefined}
      strokeLinejoin="round"
    />
  );
}

function Dot({
  x,
  y,
  color = "currentColor",
  hollow = false,
}: {
  x: number;
  y: number;
  color?: string;
  hollow?: boolean;
}) {
  return (
    <circle
      cx={x}
      cy={y}
      r={5}
      fill={hollow ? "var(--color-fd-card)" : color}
      stroke={hollow ? color : "var(--color-fd-card)"}
      strokeWidth={hollow ? 2.5 : 2}
    />
  );
}

function Segment({
  from,
  to,
  color,
  dashed = false,
  width = 2.5,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
  dashed?: boolean;
  width?: number;
}) {
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={color}
      strokeWidth={width}
      strokeDasharray={dashed ? "6 4" : undefined}
      strokeLinecap="round"
    />
  );
}

/**
 * The opening scene: a lawn seen from above, two pegs in the ground and a loop of string round
 * them, pulled tight by a stick. The stick has already scratched part of the oval into the soil;
 * the rest is dotted.
 */
export function GardenerString({ caption }: { caption?: string }) {
  const cx = 270;
  const cy = 150;
  const a = 200;
  const b = 112;
  const c = Math.sqrt(a * a - b * b);
  const f1 = { x: cx - c, y: cy };
  const f2 = { x: cx + c, y: cy };
  const t = 1.05;
  const p = { x: cx + a * Math.cos(t), y: cy - b * Math.sin(t) };
  const arc = (from: number, to: number) => {
    const steps = 90;
    return Array.from({ length: steps + 1 }, (_, i) => {
      const s = from + ((to - from) * i) / steps;
      return `${i === 0 ? "M" : "L"} ${(cx + a * Math.cos(s)).toFixed(1)} ${(cy - b * Math.sin(s)).toFixed(1)}`;
    }).join(" ");
  };
  // a few tufts of grass, placed the same way on every render
  const tufts = Array.from({ length: 26 }, (_, i) => ({
    x: 18 + ((i * 131) % 504),
    y: 16 + ((i * 71) % 270),
  })).filter(
    (q) => ((q.x - cx) / (a + 14)) ** 2 + ((q.y - cy) / (b + 14)) ** 2 > 1,
  );

  return (
    <Figure caption={caption}>
      <Svg
        width={540}
        height={300}
        label="A lawn seen from above. Two wooden pegs stand in the ground on a level line, with a loop of string round both of them. A stick pulls the string tight into a triangle with the pegs, and as the stick moves round it scratches an oval into the soil. Part of the oval is drawn; the rest is dotted."
      >
        <rect
          x={4}
          y={4}
          width={532}
          height={292}
          rx={14}
          fill={GRASS}
          stroke={GRASS_DARK}
          strokeWidth={2}
        />
        {tufts.map((q, i) => (
          <path
            key={i}
            d={`M ${q.x - 4} ${q.y + 4} L ${q.x - 1} ${q.y - 4} M ${q.x + 1} ${q.y + 4} L ${q.x + 4} ${q.y - 3}`}
            stroke={GRASS_DARK}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        ))}
        {/* the part of the bed already marked, and the rest still to come */}
        <path
          d={arc(t, 2 * Math.PI)}
          fill="none"
          stroke={WOOD_DARK}
          strokeWidth={2}
          strokeDasharray="3 6"
          strokeLinecap="round"
        />
        <path
          d={arc(0, t)}
          fill="none"
          stroke={WOOD_DARK}
          strokeWidth={4}
          strokeLinecap="round"
        />
        {/* the loop of string: peg to peg, and round the stick */}
        <g stroke="#f8fafc" strokeWidth={2.5} strokeLinejoin="round">
          <line x1={f1.x} y1={f1.y} x2={f2.x} y2={f2.y} />
          <line x1={f1.x} y1={f1.y} x2={p.x} y2={p.y} />
          <line x1={f2.x} y1={f2.y} x2={p.x} y2={p.y} />
        </g>
        {/* the pegs and the stick, seen from above */}
        {[f1, f2].map((f, i) => (
          <circle
            key={i}
            cx={f.x}
            cy={f.y}
            r={8}
            fill={WOOD}
            stroke={WOOD_DARK}
            strokeWidth={2.5}
          />
        ))}
        <circle
          cx={p.x}
          cy={p.y}
          r={7}
          fill={ORANGE}
          stroke={WOOD_DARK}
          strokeWidth={2}
        />
        <Words x={f1.x} y={f1.y + 30}>
          peg
        </Words>
        <Words x={f2.x} y={f2.y + 30}>
          peg
        </Words>
        <Words x={p.x + 14} y={p.y - 14} anchor="start">
          stick
        </Words>
        <Words x={cx} y={cy - 12}>
          loop of string
        </Words>
      </Svg>
    </Figure>
  );
}

/**
 * The unit circle, faint, and the ellipse x²/9 + y²/4 = 1 it stretches into: the point (0.6, 0.8)
 * of the circle is carried to (1.8, 1.6), and the four points on the axes to (±3, 0) and (0, ±2).
 */
export function StretchedCircle({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <Plane
        x={[-3.6, 3.6]}
        y={[-2.6, 2.6]}
        unit={56}
        label="The unit circle drawn dashed, and around it the ellipse x²/9 + y²/4 = 1. An arrow carries the point (0.6, 0.8) of the circle to the point (1.8, 1.6) of the ellipse. The ellipse crosses the axes at (3, 0), (−3, 0), (0, 2) and (0, −2)."
      >
        {(s) => {
          const { px, py } = s;
          const from = { x: px(0.6), y: py(0.8) };
          const to = { x: px(1.8), y: py(1.6) };
          const len = Math.hypot(to.x - from.x, to.y - from.y);
          const ux = (to.x - from.x) / len;
          const uy = (to.y - from.y) / len;
          const tip = { x: to.x - ux * 8, y: to.y - uy * 8 };
          return (
            <>
              <Curve s={s} a={1} b={1} faint />
              <Curve s={s} a={3} b={2} />
              <Segment
                from={from}
                to={{ x: tip.x - ux * 6, y: tip.y - uy * 6 }}
                color={ORANGE}
                width={2}
              />
              <polygon
                points={`${tip.x},${tip.y} ${tip.x - ux * 10 - uy * 5},${tip.y - uy * 10 + ux * 5} ${tip.x - ux * 10 + uy * 5},${tip.y - uy * 10 - ux * 5}`}
                fill={ORANGE}
              />
              <Dot x={from.x} y={from.y} color={BLUE} />
              <Dot x={to.x} y={to.y} color={PURPLE} />
              {[
                [3, 0],
                [-3, 0],
                [0, 2],
                [0, -2],
              ].map(([x, y]) => (
                <Dot key={`${x},${y}`} x={px(x!)} y={py(y!)} color={PURPLE} />
              ))}
              <Words x={from.x - 6} y={from.y + 22} color={BLUE} size={14}>
                (0.6, 0.8)
              </Words>
              <Words
                x={to.x + 12}
                y={to.y - 24}
                color={PURPLE}
                anchor="start"
                size={14}
              >
                (1.8, 1.6)
              </Words>
              <Words x={px(3) + 6} y={py(0) - 12} anchor="start" size={13}>
                (3, 0)
              </Words>
              <Words x={px(0) + 8} y={py(2) - 10} anchor="start" size={13}>
                (0, 2)
              </Words>
            </>
          );
        }}
      </Plane>
    </Figure>
  );
}

/**
 * The parts of the ellipse x²/25 + y²/9 = 1: the centre O, the major axis from (−5, 0) to (5, 0)
 * and the minor axis from (0, −3) to (0, 3), with the half-widths a = 5 and b = 3 marked.
 */
export function EllipseParts({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <Plane
        x={[-6, 6]}
        y={[-4, 4]}
        unit={36}
        label="The ellipse x²/25 + y²/9 = 1, with centre O. The major axis runs along the x-axis from (−5, 0) to (5, 0), and half of it, from O to (5, 0), is marked a = 5. The minor axis runs up the y-axis from (0, −3) to (0, 3), and half of it, from O to (0, 3), is marked b = 3."
      >
        {(s) => {
          const { px, py } = s;
          return (
            <>
              <Curve s={s} a={5} b={3} />
              <Segment
                from={{ x: px(-5), y: py(0) }}
                to={{ x: px(5), y: py(0) }}
                color={BLUE}
                width={4}
              />
              <Segment
                from={{ x: px(0), y: py(-3) }}
                to={{ x: px(0), y: py(3) }}
                color={ORANGE}
                width={4}
              />
              {[
                [5, 0],
                [-5, 0],
                [0, 3],
                [0, -3],
              ].map(([x, y]) => (
                <Dot key={`${x},${y}`} x={px(x!)} y={py(y!)} />
              ))}
              <Dot x={px(0)} y={py(0)} />
              <Words x={px(2.5)} y={py(0) - 10} color={BLUE} size={15}>
                a = 5
              </Words>
              <Words
                x={px(0) + 10}
                y={py(1.5) + 5}
                color={ORANGE}
                anchor="start"
              >
                b = 3
              </Words>
              <Words x={px(0) - 10} y={py(0) + 20} anchor="end" size={13}>
                O
              </Words>
              <Words x={px(-3.2)} y={py(0) - 10} color={BLUE} size={13}>
                major axis
              </Words>
              <Words
                x={px(0) - 10}
                y={py(-1.9)}
                color={ORANGE}
                anchor="end"
                size={13}
              >
                minor axis
              </Words>
              <Words x={px(5) + 8} y={py(0) + 30} anchor="start" size={13}>
                (5, 0)
              </Words>
              <Words x={px(-5) - 8} y={py(0) + 30} anchor="end" size={13}>
                (−5, 0)
              </Words>
              <Words x={px(0) + 10} y={py(3) - 10} anchor="start" size={13}>
                (0, 3)
              </Words>
              <Words x={px(0) + 10} y={py(-3) + 20} anchor="start" size={13}>
                (0, −3)
              </Words>
            </>
          );
        }}
      </Plane>
    </Figure>
  );
}

/**
 * The ellipse x²/9 + y²/4 = 1 at the origin, dashed, and the same curve slid by (2, −1), solid,
 * with an arrow from O to the new centre (2, −1).
 */
export function SlidEllipse({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <Plane
        x={[-3.6, 5.6]}
        y={[-3.6, 2.6]}
        unit={40}
        label="Two copies of the same ellipse, 3 across and 2 up from its centre. The dashed one has its centre at O. The solid one has its centre at (2, −1), and an arrow runs from O to (2, −1). It crosses the line y = −1 at (−1, −1) and (5, −1), and the line x = 2 at (2, 1) and (2, −3)."
      >
        {(s) => {
          const { px, py } = s;
          const from = { x: px(0), y: py(0) };
          const to = { x: px(2), y: py(-1) };
          const len = Math.hypot(to.x - from.x, to.y - from.y);
          const ux = (to.x - from.x) / len;
          const uy = (to.y - from.y) / len;
          const tip = { x: to.x - ux * 7, y: to.y - uy * 7 };
          return (
            <>
              <Curve s={s} a={3} b={2} faint />
              <Curve s={s} a={3} b={2} h={2} k={-1} />
              <Segment
                from={from}
                to={{ x: tip.x - ux * 6, y: tip.y - uy * 6 }}
                color={ORANGE}
                width={2}
              />
              <polygon
                points={`${tip.x},${tip.y} ${tip.x - ux * 10 - uy * 5},${tip.y - uy * 10 + ux * 5} ${tip.x - ux * 10 + uy * 5},${tip.y - uy * 10 - ux * 5}`}
                fill={ORANGE}
              />
              {[
                [5, -1],
                [-1, -1],
                [2, 1],
                [2, -3],
              ].map(([x, y]) => (
                <Dot key={`${x},${y}`} x={px(x!)} y={py(y!)} color={PURPLE} />
              ))}
              <Dot x={to.x} y={to.y} color={ORANGE} />
              <Words
                x={to.x + 8}
                y={to.y + 20}
                color={ORANGE}
                anchor="start"
                size={14}
              >
                (2, −1)
              </Words>
              <Words x={px(5) + 8} y={py(-1) + 5} anchor="start" size={13}>
                (5, −1)
              </Words>
              <Words x={px(2) + 8} y={py(1) - 10} anchor="start" size={13}>
                (2, 1)
              </Words>
              <Words x={px(2) + 8} y={py(-3) + 20} anchor="start" size={13}>
                (2, −3)
              </Words>
            </>
          );
        }}
      </Plane>
    </Figure>
  );
}

/**
 * The ellipse x²/25 + y²/9 = 1 with its foci F₁ = (−4, 0) and F₂ = (4, 0). From P = (3, 2.4) the
 * distances to the foci are 7.4 and 2.6; from Q = (0, −3) they are 5 and 5. Both pairs add to 10.
 */
export function EllipseFoci({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <Plane
        x={[-6, 6]}
        y={[-4, 4]}
        unit={36}
        label="The ellipse x²/25 + y²/9 = 1 with two marked points on the x-axis, the foci F₁ at (−4, 0) and F₂ at (4, 0). Segments join the point P = (3, 2.4) of the ellipse to the foci, with lengths 7.4 to F₁ and 2.6 to F₂. Dashed segments join the point Q = (0, −3) to the foci, each of length 5."
      >
        {(s) => {
          const { px, py } = s;
          const f1 = { x: px(-4), y: py(0) };
          const f2 = { x: px(4), y: py(0) };
          const p = { x: px(3), y: py(2.4) };
          const q = { x: px(0), y: py(-3) };
          return (
            <>
              <Curve s={s} a={5} b={3} />
              <Segment from={f1} to={p} color={BLUE} />
              <Segment from={f2} to={p} color={ORANGE} />
              <Segment from={f1} to={q} color={BLUE} dashed width={2} />
              <Segment from={f2} to={q} color={ORANGE} dashed width={2} />
              <Dot x={f1.x} y={f1.y} color={GREEN} />
              <Dot x={f2.x} y={f2.y} color={GREEN} />
              <Dot x={p.x} y={p.y} />
              <Dot x={q.x} y={q.y} />
              <Words x={f1.x} y={f1.y + 30} color={GREEN} size={14}>
                F₁
              </Words>
              <Words x={f2.x + 4} y={f2.y + 30} color={GREEN} size={14}>
                F₂
              </Words>
              <Words x={p.x + 8} y={p.y - 10} anchor="start" size={14}>
                P
              </Words>
              <Words x={q.x} y={q.y + 22} size={14}>
                Q
              </Words>
              <Words x={px(-0.6)} y={py(1.6)} color={BLUE} size={14}>
                7.4
              </Words>
              <Words
                x={px(3.85)}
                y={py(1.25)}
                color={ORANGE}
                anchor="start"
                size={14}
              >
                2.6
              </Words>
              <Words x={px(-2.6)} y={py(-1.9)} color={BLUE} size={14}>
                5
              </Words>
              <Words x={px(2.6)} y={py(-1.9)} color={ORANGE} size={14}>
                5
              </Words>
            </>
          );
        }}
      </Plane>
    </Figure>
  );
}

/**
 * The ellipse x²/4 + y² = 1 and three parallel lines x + 2y = k: k = 2 crosses it at (2, 0) and
 * (0, 1), k = 2√2 touches it at (√2, √2/2), and k = 3.5 misses it.
 */
export function EllipseLines({ caption }: { caption?: string }) {
  const lines = [
    { k: 2, color: BLUE, name: "k = 2" },
    { k: 2 * Math.SQRT2, color: GREEN, name: "k = 2√2" },
    { k: 3.5, color: ORANGE, name: "k = 3.5" },
  ];
  const X: Range = [-2.6, 5];
  const Y: Range = [-1.6, 2.6];
  // every line stops at x = 4.2, and its name sits just beyond that end
  const END = 4.2;
  return (
    <Figure caption={caption}>
      <Plane
        x={X}
        y={Y}
        unit={64}
        label="The ellipse x²/4 + y² = 1 and three parallel lines x + 2y = k. The line with k = 2 crosses the ellipse at (2, 0) and (0, 1). The line with k = 2√2 touches it at one point, about (1.41, 0.71). The line with k = 3.5 misses it."
      >
        {(s) => {
          const { px, py } = s;
          const ends = (k: number) => {
            const yTop = Math.min(Y[1] - 0.1, (k - X[0] - 0.05) / 2);
            return [
              { x: px(k - 2 * yTop), y: py(yTop) },
              { x: px(END), y: py((k - END) / 2) },
            ] as const;
          };
          return (
            <>
              <Curve s={s} a={2} b={1} />
              {lines.map((l) => {
                const [from, to] = ends(l.k);
                return (
                  <Segment
                    key={l.name}
                    from={from}
                    to={to}
                    color={l.color}
                    width={2.5}
                  />
                );
              })}
              <Dot x={px(2)} y={py(0)} color={BLUE} />
              <Dot x={px(0)} y={py(1)} color={BLUE} />
              <Dot x={px(Math.SQRT2)} y={py(Math.SQRT2 / 2)} color={GREEN} />
              {lines.map((l) => (
                <Words
                  key={l.name}
                  x={px(END) + 8}
                  y={py((l.k - END) / 2) + 5}
                  color={l.color}
                  anchor="start"
                  size={14}
                >
                  {l.name}
                </Words>
              ))}
            </>
          );
        }}
      </Plane>
    </Figure>
  );
}
