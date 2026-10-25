import type { ReactNode } from "react";
import { Figure } from "../figure";
import { BLUE, ORANGE, PURPLE, STEEL, Svg, Words } from "../illustrations";

/**
 * Pictures for the guide The focus of a parabola. A dish seen from the side, with the signal coming
 * straight down and bouncing to the receiver; the circles about a focus meeting the lines above a
 * directrix; and the three steps of the proof that a parabola reflects straight-on rays to its
 * focus. Every picture uses the same scale across and up, so the curves have their true shape.
 */

const GREEN = "#22c55e";
const RED = "#ef4444";
const MUTED = "#9ca3af";

type Range = readonly [number, number];
type Pt = readonly [number, number];

const PAD = 26;

/** the layout of a picture showing x from x0 to x1 and y from y0 to y1, `unit` pixels to 1 */
function layout([x0, x1]: Range, [y0, y1]: Range, unit: number) {
  return {
    width: (x1 - x0) * unit + 2 * PAD,
    height: (y1 - y0) * unit + 2 * PAD,
    px: (x: number) => PAD + (x - x0) * unit,
    py: (y: number) => PAD + (y1 - y) * unit,
    at: ([x, y]: Pt) => [PAD + (x - x0) * unit, PAD + (y1 - y) * unit] as Pt,
  };
}
type Layout = ReturnType<typeof layout>;

/** the curve y = f(x) for x from `from` to `to`, as svg points */
function curve(f: (x: number) => number, from: number, to: number, s: Layout) {
  const steps = 120;
  return Array.from({ length: steps + 1 }, (_, i) => {
    const x = from + ((to - from) * i) / steps;
    return `${s.px(x).toFixed(1)},${s.py(f(x)).toFixed(1)}`;
  }).join(" ");
}

/** a segment between two points given in units */
function Seg({
  from,
  to,
  s,
  color,
  width = 2.5,
  dash,
}: {
  from: Pt;
  to: Pt;
  s: Layout;
  color: string;
  width?: number;
  dash?: string;
}) {
  const [x1, y1] = s.at(from);
  const [x2, y2] = s.at(to);
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={width}
      strokeDasharray={dash}
      strokeLinecap="round"
    />
  );
}

/** an arrowhead pointing from `from` towards `to`, placed a fraction `t` of the way along */
function Head({
  from,
  to,
  s,
  color,
  t = 0.55,
}: {
  from: Pt;
  to: Pt;
  s: Layout;
  color: string;
  t?: number;
}) {
  const [x1, y1] = s.at(from);
  const [x2, y2] = s.at(to);
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const tipX = x1 + (x2 - x1) * t + ux * 6;
  const tipY = y1 + (y2 - y1) * t + uy * 6;
  const back = 12;
  const side = 6;
  const points = [
    [tipX, tipY],
    [tipX - ux * back - uy * side, tipY - uy * back + ux * side],
    [tipX - ux * back + uy * side, tipY - uy * back - ux * side],
  ]
    .map(([a, b]) => `${a!.toFixed(1)},${b!.toFixed(1)}`)
    .join(" ");
  return <polygon points={points} fill={color} />;
}

/** a dot at a point, in the card colour round the edge so it stands off the lines */
function Spot({ at, s, color }: { at: Pt; s: Layout; color: string }) {
  const [x, y] = s.at(at);
  return (
    <circle
      cx={x}
      cy={y}
      r={5}
      fill={color}
      stroke="var(--color-fd-card)"
      strokeWidth={2}
    />
  );
}

/** a label placed `dx`, `dy` pixels from a point given in units */
function Label({
  at,
  s,
  dx = 0,
  dy = 0,
  color = "currentColor",
  anchor = "middle",
  italic = true,
  children,
}: {
  at: Pt;
  s: Layout;
  dx?: number;
  dy?: number;
  color?: string;
  anchor?: "start" | "middle" | "end";
  italic?: boolean;
  children: ReactNode;
}) {
  const [x, y] = s.at(at);
  return (
    <Words x={x + dx} y={y + dy} color={color} anchor={anchor} size={15}>
      <tspan fontStyle={italic ? "italic" : undefined} fontWeight={600}>
        {children}
      </tspan>
    </Words>
  );
}

/** a short mark across the middle of a segment, the sign for equal lengths */
function Tick({
  from,
  to,
  s,
  color,
  count = 1,
}: {
  from: Pt;
  to: Pt;
  s: Layout;
  color: string;
  count?: number;
}) {
  const [x1, y1] = s.at(from);
  const [x2, y2] = s.at(to);
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g stroke={color} strokeWidth={2.5} strokeLinecap="round">
      {Array.from({ length: count }, (_, i) => {
        const shift = (i - (count - 1) / 2) * 6;
        const cx = mx + ux * shift;
        const cy = my + uy * shift;
        return (
          <line
            key={i}
            x1={cx - uy * 7}
            y1={cy + ux * 7}
            x2={cx + uy * 7}
            y2={cy - ux * 7}
          />
        );
      })}
    </g>
  );
}

/** the square mark for a right angle at `corner`, between the directions u and v (in units) */
function RightMark({
  corner,
  u,
  v,
  s,
}: {
  corner: Pt;
  u: Pt;
  v: Pt;
  s: Layout;
}) {
  const size = 12;
  const [cx, cy] = s.at(corner);
  // directions on screen: y points down there
  const nu = Math.hypot(u[0], u[1]);
  const nv = Math.hypot(v[0], v[1]);
  const a = [(u[0] / nu) * size, (-u[1] / nu) * size];
  const b = [(v[0] / nv) * size, (-v[1] / nv) * size];
  return (
    <polyline
      points={`${cx + a[0]!},${cy + a[1]!} ${cx + a[0]! + b[0]!},${cy + a[1]! + b[1]!} ${cx + b[0]!},${cy + b[1]!}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    />
  );
}

/** faint x and y axes through the origin, across the whole picture */
function Axes({
  x: [x0, x1],
  y: [y0, y1],
  s,
}: {
  x: Range;
  y: Range;
  s: Layout;
}) {
  return (
    <g stroke="currentColor" strokeOpacity={0.35} strokeWidth={1.25}>
      <line x1={s.px(x0)} x2={s.px(x1)} y1={s.py(0)} y2={s.py(0)} />
      <line x1={s.px(0)} x2={s.px(0)} y1={s.py(y0)} y2={s.py(y1)} />
    </g>
  );
}

/**
 * The opening scene: a dish pointed straight up, seen from the side, with the receiver held on
 * three struts above the middle of the bowl. Four rays of signal come straight down, bounce off the
 * bowl and all pass through the receiver. The bowl is the parabola y = x²/9 for x from −3 to 3: a
 * dish 60 cm across and 10 cm deep drawn at 1 unit to 10 cm, with its focus 22.5 cm above the
 * bottom.
 */
export function DishFocus({ caption }: { caption?: string }) {
  const X: Range = [-4, 4];
  const Y: Range = [-1.5, 4.4];
  const s = layout(X, Y, 62);
  const f = (x: number) => (x * x) / 9;
  const F: Pt = [0, 2.25];
  const rays = [-2.5, -1.5, 1.5, 2.5];
  return (
    <Figure caption={caption}>
      <Svg
        width={s.width}
        height={s.height}
        label="A dish seen from the side, pointed straight up, on a post. A small receiver is held above the middle of the bowl by struts from the rim. Four parallel rays of signal come straight down, hit the bowl at different places, and every one bounces back up through the receiver."
      >
        {/* the post and its foot */}
        <g stroke={STEEL} strokeWidth={6} strokeLinecap="round">
          <line x1={s.px(0)} y1={s.py(-0.05)} x2={s.px(0)} y2={s.py(-1.15)} />
          <line
            x1={s.px(-0.8)}
            y1={s.py(-1.15)}
            x2={s.px(0.8)}
            y2={s.py(-1.15)}
          />
        </g>
        {/* the struts from the rim to the receiver */}
        <g stroke={STEEL} strokeWidth={2.5} strokeLinecap="round">
          <line {...xy(s, [-3, 1], F)} />
          <line {...xy(s, [3, 1], F)} />
        </g>
        {/* the bowl */}
        <polyline
          points={curve(f, -3, 3, s)}
          fill="none"
          stroke={STEEL}
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points={curve(f, -3, 3, s)}
          fill="none"
          stroke={BLUE}
          strokeWidth={3}
          strokeLinecap="round"
        />
        {/* the rays: straight down to the bowl, then up to the receiver */}
        {rays.map((x) => {
          const top: Pt = [x, Y[1] - 0.2];
          const hit: Pt = [x, f(x)];
          return (
            <g key={x}>
              <Seg from={top} to={hit} s={s} color={ORANGE} width={2} />
              <Head from={top} to={hit} s={s} color={ORANGE} t={0.4} />
              <Seg from={hit} to={F} s={s} color={ORANGE} width={2} />
              <Head from={hit} to={F} s={s} color={ORANGE} t={0.5} />
            </g>
          );
        })}
        {/* the receiver */}
        <rect
          x={s.px(0) - 16}
          y={s.py(2.25) - 10}
          width={32}
          height={20}
          rx={4}
          fill={STEEL}
        />
        <Label at={F} s={s} dy={-18} italic={false}>
          receiver at the focus
        </Label>
        <Label at={[0, Y[1] - 0.2]} s={s} dy={2} italic={false} color={ORANGE}>
          signal from the satellite
        </Label>
      </Svg>
    </Figure>
  );
}

// the x1, y1, x2, y2 of an svg line between two points given in units
function xy(s: Layout, from: Pt, to: Pt) {
  const [x1, y1] = s.at(from);
  const [x2, y2] = s.at(to);
  return { x1, y1, x2, y2 };
}

/**
 * Finding points equally far from F = (0, 1) and the line y = −1. The circle of radius r about F
 * and the line r above the directrix meet at points r from both, for r = 1, 2, 3 and 4. The points
 * found all lie on the faint curve y = x²/4.
 */
export function EqualDistances({ caption }: { caption?: string }) {
  const X: Range = [-4.6, 5.6];
  const Y: Range = [-1.6, 5.2];
  const s = layout(X, Y, 46);
  const F: Pt = [0, 1];
  const colors = [BLUE, ORANGE, GREEN, PURPLE];
  const id = "equal-distances-clip";
  return (
    <Figure caption={caption}>
      <Svg
        width={s.width}
        height={s.height}
        label="A point F one unit above the x-axis and a line L one unit below it. Circles of radius 1, 2, 3 and 4 are drawn about F, and dashed lines 1, 2, 3 and 4 units above L, each line in the colour of the circle with the same number. Each circle meets its line at dots that are equally far from F and from L, and the dots lie on a U-shaped curve."
      >
        <defs>
          <clipPath id={id}>
            <rect
              x={s.px(X[0])}
              y={s.py(Y[1])}
              width={s.px(4.6) - s.px(X[0])}
              height={s.py(Y[0]) - s.py(Y[1])}
            />
          </clipPath>
        </defs>
        <Axes x={[X[0], 4.6]} y={Y} s={s} />
        <polyline
          points={curve((x) => (x * x) / 4, -4.4, 4.4, s)}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.45}
          strokeWidth={2}
          strokeDasharray="6 5"
          clipPath={`url(#${id})`}
        />
        {/* the directrix */}
        <Seg from={[X[0], -1]} to={[4.6, -1]} s={s} color={RED} width={3} />
        <Label at={[4.6, -1]} s={s} dx={10} dy={5} anchor="start" color={RED}>
          L
        </Label>
        {[1, 2, 3, 4].map((r, i) => {
          const color = colors[i]!;
          const h = r - 1; // the line r above L
          const half = Math.sqrt(Math.max(0, r * r - (h - 1) ** 2));
          return (
            <g key={r}>
              <circle
                cx={s.px(0)}
                cy={s.py(1)}
                r={r * 46}
                fill="none"
                stroke={color}
                strokeWidth={1.75}
                strokeOpacity={0.8}
                clipPath={`url(#${id})`}
              />
              <Seg
                from={[X[0], h]}
                to={[4.6, h]}
                s={s}
                color={color}
                width={1.75}
                dash="6 5"
              />
              <Label
                at={[4.6, h]}
                s={s}
                dx={10}
                dy={5}
                anchor="start"
                italic={false}
                color={color}
              >
                {`r = ${r}`}
              </Label>
              {(half < 1e-9 ? [0] : [-half, half]).map((x) => (
                <Spot key={x} at={[x, h]} s={s} color={color} />
              ))}
            </g>
          );
        })}
        <Spot at={F} s={s} color="currentColor" />
        <Label at={F} s={s} dx={-12} dy={-8} anchor="end">
          F
        </Label>
      </Svg>
    </Figure>
  );
}

// the setting of the proof: y = x²/4, focus (0, 1), directrix y = −1, the point P over x = 3
const PF = {
  X: [-3, 5.4] as Range,
  Y: [-1.9, 5] as Range,
  F: [0, 1] as Pt,
  P: [3, 2.25] as Pt,
  N: [3, -1] as Pt,
  M: [1.5, 0] as Pt,
  // two points of the tangent y = 1.5x − 2.25 at the edges of the picture
  T1: [0.1, -2.1] as Pt,
  T2: [4.8, 4.95] as Pt,
};

/** the parabola, its directrix and its focus, shared by the pictures of the proof */
function ParabolaSetting({ s }: { s: Layout }) {
  const { X, Y, F } = PF;
  return (
    <>
      <Axes x={X} y={Y} s={s} />
      <polyline
        points={curve((x) => (x * x) / 4, -3, 4.47, s)}
        fill="none"
        stroke={BLUE}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <Seg
        from={[X[0], -1]}
        to={[X[1] - 0.3, -1]}
        s={s}
        color={RED}
        width={2.5}
      />
      <Label at={[X[0], -1]} s={s} dx={4} dy={20} anchor="start" color={RED}>
        L
      </Label>
      <Spot at={F} s={s} color={ORANGE} />
      <Label at={F} s={s} dx={-12} dy={-6} anchor="end" color={ORANGE}>
        F
      </Label>
    </>
  );
}

function Tangent({ s }: { s: Layout }) {
  return (
    <>
      <Seg from={PF.T1} to={PF.T2} s={s} color={PURPLE} width={2.5} />
      <Label at={PF.T2} s={s} dx={-10} dy={4} anchor="end" color={PURPLE}>
        T
      </Label>
    </>
  );
}

/** the points P and N and their labels */
function PandN({ s }: { s: Layout }) {
  return (
    <>
      <Spot at={PF.P} s={s} color="currentColor" />
      <Label at={PF.P} s={s} dx={12} dy={-4} anchor="start">
        P
      </Label>
      <Spot at={PF.N} s={s} color={GREEN} />
      <Label at={PF.N} s={s} dx={12} dy={18} anchor="start" color={GREEN}>
        N
      </Label>
    </>
  );
}

/**
 * The law of reflection on a curved mirror. A ray comes in to the point P of a mirror shaped like
 * the bottom of a bowl. Had there been no mirror, it would have carried on to X. The reflected ray
 * leaves P through X′, the mirror image of X in the tangent line at P.
 */
function LawPicture({ caption }: { caption?: string }) {
  const X: Range = [-3.4, 5];
  const Y: Range = [-1.6, 4.2];
  const s = layout(X, Y, 50);
  const C: Pt = [0, 3.4];
  const R = 3.4;
  const angle = (-65 * Math.PI) / 180;
  const P: Pt = [C[0] + R * Math.cos(angle), C[1] + R * Math.sin(angle)];
  // the tangent at P is square to the radius CP
  const t: Pt = [-Math.sin(angle), Math.cos(angle)];
  // the ray comes in heading down and to the right
  const len = Math.hypot(1, 0.8);
  const d: Pt = [1 / len, -0.8 / len];
  const start: Pt = [P[0] - 4.2 * d[0], P[1] - 4.2 * d[1]];
  const Xp: Pt = [P[0] + 2 * d[0], P[1] + 2 * d[1]];
  // mirror X in the tangent: keep the part along t, reverse the rest
  const w: Pt = [Xp[0] - P[0], Xp[1] - P[1]];
  const along = w[0] * t[0] + w[1] * t[1];
  const X2: Pt = [
    P[0] + 2 * along * t[0] - w[0],
    P[1] + 2 * along * t[1] - w[1],
  ];
  const out: Pt = [P[0] + 1.5 * (X2[0] - P[0]), P[1] + 1.5 * (X2[1] - P[1])];
  const mid: Pt = [(Xp[0] + X2[0]) / 2, (Xp[1] + X2[1]) / 2];
  const bowl = Array.from({ length: 81 }, (_, i) => {
    const a = (-150 + (120 * i) / 80) * (Math.PI / 180);
    return `${s.px(C[0] + R * Math.cos(a)).toFixed(1)},${s.py(C[1] + R * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  const T1: Pt = [P[0] - 3 * t[0], P[1] - 3 * t[1]];
  const T2: Pt = [P[0] + 2.3 * t[0], P[1] + 2.3 * t[1]];
  return (
    <Figure caption={caption}>
      <Svg
        width={s.width}
        height={s.height}
        label="A curved mirror shaped like the bottom of a bowl, with its tangent line at a point P. A ray comes in from the upper left and hits the mirror at P. A dashed line shows where it would have carried on, down to a point X below the mirror. The point X prime is the mirror image of X in the tangent line, and the reflected ray leaves P through X prime."
      >
        <polyline
          points={bowl}
          fill="none"
          stroke={BLUE}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <Seg from={T1} to={T2} s={s} color={PURPLE} width={2.5} />
        <Label at={T1} s={s} dx={0} dy={20} color={PURPLE}>
          T
        </Label>
        <Seg from={start} to={P} s={s} color={ORANGE} width={2.5} />
        <Head from={start} to={P} s={s} color={ORANGE} />
        <Seg from={P} to={Xp} s={s} color={ORANGE} width={2} dash="6 5" />
        <Seg from={Xp} to={X2} s={s} color={MUTED} width={1.5} dash="2 4" />
        <RightMark
          corner={mid}
          u={t}
          v={[X2[0] - Xp[0], X2[1] - Xp[1]]}
          s={s}
        />
        <Seg from={P} to={out} s={s} color={ORANGE} width={2.5} />
        <Head from={P} to={out} s={s} color={ORANGE} t={0.4} />
        <Spot at={P} s={s} color="currentColor" />
        <Label at={P} s={s} dx={-4} dy={22}>
          P
        </Label>
        <Spot at={Xp} s={s} color={MUTED} />
        <Label at={Xp} s={s} dx={12} dy={6} anchor="start">
          X
        </Label>
        <Spot at={X2} s={s} color={MUTED} />
        <Label at={X2} s={s} dx={12} dy={4} anchor="start">
          X′
        </Label>
      </Svg>
    </Figure>
  );
}

/**
 * The three pictures for the proof of the reflecting property, on y = x²/4 with P = (3, 2.25).
 * Step 1: PF = PN, and the tangent T is the perpendicular bisector of FN. Step 2: the law of
 * reflection on any curved mirror. Step 3: the ray straight down would carry on to N, the flip in
 * T sends N to F, so the reflected ray goes to F.
 */
export function ReflectionStep({
  step,
  caption,
}: {
  step: 1 | 2 | 3;
  caption?: string;
}) {
  if (step === 2) return <LawPicture caption={caption} />;
  const s = layout(PF.X, PF.Y, 48);
  const { F, P, N, M } = PF;
  const top: Pt = [3, PF.Y[1] - 0.1];
  return (
    <Figure caption={caption}>
      <Svg
        width={s.width}
        height={s.height}
        label={
          step === 1
            ? "The parabola y = x²/4 with focus F and directrix L. A point P on it is joined to F and straight down to N on L, and the two segments have equal tick marks. The tangent T at P crosses the dashed segment from F to N at its midpoint, square on."
            : "The parabola y = x²/4 with focus F, directrix L and the tangent T at P. A ray comes straight down to P. A dashed line shows it carrying on to N on the directrix. A dotted segment from N to F crosses T square on at its midpoint, so F is the mirror image of N in T, and the reflected ray goes from P to F."
        }
      >
        <ParabolaSetting s={s} />
        {step === 1 ? (
          <>
            <Seg from={F} to={N} s={s} color={MUTED} width={1.75} dash="6 5" />
            <Tick from={F} to={M} s={s} color={MUTED} count={2} />
            <Tick from={M} to={N} s={s} color={MUTED} count={2} />
            <Tangent s={s} />
            <RightMark corner={M} u={[1, 1.5]} v={[3, -2]} s={s} />
            <Seg from={P} to={F} s={s} color={ORANGE} width={2.5} />
            <Seg from={P} to={N} s={s} color={GREEN} width={2.5} />
            <Tick from={P} to={F} s={s} color={ORANGE} />
            <Tick from={P} to={N} s={s} color={GREEN} />
            <Spot at={M} s={s} color={MUTED} />
            <Label at={M} s={s} dx={-12} dy={-6} anchor="end">
              M
            </Label>
          </>
        ) : (
          <>
            <Seg from={F} to={N} s={s} color={MUTED} width={1.5} dash="2 4" />
            <Tangent s={s} />
            <RightMark corner={M} u={[1, 1.5]} v={[3, -2]} s={s} />
            <Seg from={top} to={P} s={s} color={ORANGE} width={2.5} />
            <Head from={top} to={P} s={s} color={ORANGE} t={0.45} />
            <Seg from={P} to={N} s={s} color={ORANGE} width={2} dash="6 5" />
            <Seg from={P} to={F} s={s} color={ORANGE} width={2.5} />
            <Head from={P} to={F} s={s} color={ORANGE} t={0.5} />
          </>
        )}
        <PandN s={s} />
      </Svg>
    </Figure>
  );
}
