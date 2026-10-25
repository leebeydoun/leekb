import type { ReactNode } from "react";
import { Figure } from "../figure";
import {
  BLUE,
  CARDBOARD,
  CARDBOARD_EDGE,
  ORANGE,
  PURPLE,
  STEEL,
  STEEL_LIGHT,
  Svg,
  Words,
} from "../illustrations";
import { Plot, graph } from "../function-illustrations/plot";

/**
 * Pictures for the guide Areas and volumes from sums: a model hill built from cardboard layers, the
 * strips under y = x², a cone and a half ball with stacks of cylinders inside and outside them, and
 * a cone and a ball inside the cylinder that fits around each. Solids are seen from in front and a
 * little above, with no perspective shrinking, so a level circle is drawn as an ellipse whose height
 * is its width times the sine of the tilt.
 */

const TILT = (20 * Math.PI) / 180;
const SQUASH = Math.sin(TILT);
const RISE = Math.cos(TILT);

const BLUE_SIDE = "#93c5fd";
const BLUE_TOP = "#dbeafe";
const ORANGE_SIDE = "#fdba74";
const ORANGE_TOP = "#ffedd5";
const CARD_TOP = "#f3dfbf";

const muted = "var(--color-fd-muted-foreground)";

const n2 = (v: number) => v.toFixed(1);

/** where things sit on the page: the centre of the ground circle, and pixels per unit */
type Place = { cx: number; cy: number; unit: number };

/** the page height of a level circle at height z */
const level = ({ cy, unit }: Place, z: number) => cy - unit * z * RISE;

/**
 * An upright cylinder from height z0 to z1 with radius a: its side, then its top. Drawn from the
 * bottom of a stack upwards, each one covers the hidden back of the top of the one below.
 */
function Drum({
  at,
  z0,
  z1,
  a,
  side,
  top,
  edge,
  opacity = 1,
}: {
  at: Place;
  z0: number;
  z1: number;
  a: number;
  side: string;
  top: string;
  edge: string;
  opacity?: number;
}) {
  if (a <= 0) return null;
  const rx = at.unit * a;
  const ry = rx * SQUASH;
  const b = level(at, z0);
  const t = level(at, z1);
  const { cx } = at;
  const wall = `M ${n2(cx - rx)} ${n2(t)} L ${n2(cx - rx)} ${n2(b)} A ${n2(rx)} ${n2(ry)} 0 0 0 ${n2(cx + rx)} ${n2(b)} L ${n2(cx + rx)} ${n2(t)} A ${n2(rx)} ${n2(ry)} 0 0 1 ${n2(cx - rx)} ${n2(t)} Z`;
  return (
    <g stroke={edge} strokeWidth={1.25} strokeLinejoin="round">
      <path d={wall} fill={side} fillOpacity={opacity} />
      <ellipse
        cx={cx}
        cy={t}
        rx={rx}
        ry={ry}
        fill={top}
        fillOpacity={opacity}
      />
    </g>
  );
}

/** an upright cone standing on the ground circle of radius r, with its tip at height h */
function Cone({
  at,
  r,
  h,
  fill = STEEL_LIGHT,
  edge = STEEL,
  opacity = 0.5,
  dashed = false,
}: {
  at: Place;
  r: number;
  h: number;
  fill?: string;
  edge?: string;
  opacity?: number;
  dashed?: boolean;
}) {
  const { cx } = at;
  const rx = at.unit * r;
  const ry = rx * SQUASH;
  const b = level(at, 0);
  const tip = level(at, h);
  // the sides touch the ground circle where sin θ = −ry / (drop from the tip to the circle's centre)
  const s = -ry / (b - tip);
  const c = Math.sqrt(1 - s * s);
  const right = [cx + rx * c, b + ry * s];
  const left = [cx - rx * c, b + ry * s];
  const outline = `M ${n2(cx)} ${n2(tip)} L ${n2(right[0]!)} ${n2(right[1]!)} A ${n2(rx)} ${n2(ry)} 0 1 1 ${n2(left[0]!)} ${n2(left[1]!)} Z`;
  const back = `M ${n2(left[0]!)} ${n2(left[1]!)} A ${n2(rx)} ${n2(ry)} 0 0 1 ${n2(right[0]!)} ${n2(right[1]!)}`;
  return (
    <g stroke={edge} strokeLinejoin="round" fill="none">
      <path d={back} strokeWidth={1.25} strokeDasharray="4 4" />
      <path
        d={outline}
        fill={fill}
        fillOpacity={opacity}
        strokeWidth={1.75}
        strokeDasharray={dashed ? "6 4" : undefined}
      />
    </g>
  );
}

/** the top half of a ball of radius r whose centre is at the centre of the ground circle */
function Dome({
  at,
  r,
  fill = STEEL_LIGHT,
  edge = STEEL,
  opacity = 0.5,
}: {
  at: Place;
  r: number;
  fill?: string;
  edge?: string;
  opacity?: number;
}) {
  const { cx } = at;
  const R = at.unit * r;
  const ry = R * SQUASH;
  const c = level(at, 0);
  const outline = `M ${n2(cx - R)} ${n2(c)} A ${n2(R)} ${n2(R)} 0 0 1 ${n2(cx + R)} ${n2(c)} A ${n2(R)} ${n2(ry)} 0 0 1 ${n2(cx - R)} ${n2(c)} Z`;
  const back = `M ${n2(cx - R)} ${n2(c)} A ${n2(R)} ${n2(ry)} 0 0 1 ${n2(cx + R)} ${n2(c)}`;
  return (
    <g stroke={edge} strokeLinejoin="round" fill="none">
      <path d={back} strokeWidth={1.25} strokeDasharray="4 4" />
      <path d={outline} fill={fill} fillOpacity={opacity} strokeWidth={1.75} />
    </g>
  );
}

/** a whole ball of radius r centred at height z0 above the ground circle's centre */
function Ball({ at, r, z0 }: { at: Place; r: number; z0: number }) {
  const R = at.unit * r;
  const c = level(at, z0);
  const ry = R * SQUASH;
  return (
    <g stroke={STEEL} fill="none">
      <circle
        cx={at.cx}
        cy={c}
        r={R}
        fill={STEEL_LIGHT}
        fillOpacity={0.6}
        strokeWidth={1.75}
      />
      <path
        d={`M ${n2(at.cx - R)} ${n2(c)} A ${n2(R)} ${n2(ry)} 0 0 1 ${n2(at.cx + R)} ${n2(c)}`}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <path
        d={`M ${n2(at.cx + R)} ${n2(c)} A ${n2(R)} ${n2(ry)} 0 0 1 ${n2(at.cx - R)} ${n2(c)}`}
        strokeWidth={1}
      />
    </g>
  );
}

/** a see-through glass cylinder of radius a from height 0 to h, drawn over what it holds */
function Glass({ at, a, h }: { at: Place; a: number; h: number }) {
  const { cx } = at;
  const rx = at.unit * a;
  const ry = rx * SQUASH;
  const b = level(at, 0);
  const t = level(at, h);
  return (
    <g stroke={PURPLE} fill="none" strokeWidth={1.75}>
      <path
        d={`M ${n2(cx - rx)} ${n2(b)} A ${n2(rx)} ${n2(ry)} 0 0 1 ${n2(cx + rx)} ${n2(b)}`}
        strokeWidth={1.25}
        strokeDasharray="4 4"
      />
      <path
        d={`M ${n2(cx - rx)} ${n2(t)} L ${n2(cx - rx)} ${n2(b)} A ${n2(rx)} ${n2(ry)} 0 0 0 ${n2(cx + rx)} ${n2(b)} L ${n2(cx + rx)} ${n2(t)}`}
        fill={PURPLE}
        fillOpacity={0.06}
      />
      <ellipse cx={cx} cy={t} rx={rx} ry={ry} />
    </g>
  );
}

/** n slabs of equal height from 0 to h, each with the radius `radius(k)` for k = 1, …, n */
const slabs = (n: number, h: number, radius: (k: number) => number) =>
  Array.from({ length: n }, (_, i) => ({
    z0: (i * h) / n,
    z1: ((i + 1) * h) / n,
    a: radius(i + 1),
  }));

function Stack({
  at,
  n,
  h,
  radius,
  side,
  top,
  edge,
  opacity,
}: {
  at: Place;
  n: number;
  h: number;
  radius: (k: number) => number;
  side: string;
  top: string;
  edge: string;
  opacity?: number;
}) {
  return (
    <g>
      {slabs(n, h, radius).map((s, i) => (
        <Drum
          key={i}
          at={at}
          {...s}
          side={side}
          top={top}
          edge={edge}
          opacity={opacity}
        />
      ))}
    </g>
  );
}

const PANEL = 270;

/** one picture of a pair, with a title and a note under it, drawn centred at x = PANEL / 2 */
function Panel({
  title,
  note,
  label,
  children,
}: {
  title: string;
  note: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <Svg width={PANEL} height={310} label={label}>
      {children}
      <Words x={PANEL / 2} y={282} size={15}>
        {title}
      </Words>
      <Words x={PANEL / 2} y={301} size={13} color={muted}>
        {note}
      </Words>
    </Svg>
  );
}

/** two panels side by side on a wide screen, one above the other on a phone */
function Pair({ children }: { children: ReactNode }) {
  return <div className="grid items-end gap-6 sm:grid-cols-2">{children}</div>;
}

// the cone drawn in the cone pictures: radius 1 and height 1.6, in units of the panel
const CONE_R = 1;
const CONE_H = 1.6;
const CONE_UNIT = 95;

/**
 * The opening scene: a model hill built from flat cardboard layers, once with 4 thick layers and
 * once with 12 thin ones, each over the faint outline of the smooth cone it copies.
 */
export function LayerModels({ caption }: { caption?: string }) {
  const model = (n: number) => {
    const at = { cx: PANEL / 2, cy: 225, unit: CONE_UNIT };
    return (
      <g>
        <Stack
          at={at}
          n={n}
          h={CONE_H}
          radius={(k) => (CONE_R * (n - k + 1)) / n}
          side={CARDBOARD}
          top={CARD_TOP}
          edge={CARDBOARD_EDGE}
        />
        <Cone at={at} r={CONE_R} h={CONE_H} opacity={0} edge={STEEL} dashed />
      </g>
    );
  };
  return (
    <Figure caption={caption}>
      <Pair>
        <Panel
          title="4 layers"
          note="each step sticks out"
          label="A model hill made of 4 thick cardboard discs, each smaller than the one below, drawn over the dashed outline of a smooth cone. It looks like a set of steps."
        >
          {model(4)}
        </Panel>
        <Panel
          title="12 layers"
          note="close to the smooth cone"
          label="The same model hill made of 12 thin cardboard discs over the dashed outline of the same cone. The steps are so small that it is already close to the smooth cone."
        >
          {model(12)}
        </Panel>
      </Pair>
    </Figure>
  );
}

/**
 * The region under y = x² from 0 to 1 cut into 4 strips, drawn twice: once with the rectangles that
 * fit under the curve, once with the rectangles that reach up to it at the right edge of each strip.
 */
export function ParabolaStrips({ caption }: { caption?: string }) {
  const n = 4;
  const strips = Array.from({ length: n }, (_, i) => i);
  const panel = (id: string, outer: boolean) => (
    <Plot
      id={id}
      x={[0, 1]}
      y={[0, 1]}
      unit={220}
      step={0.25}
      every={0.25}
      curves={[{ points: graph((x) => x * x, 0, 1), color: PURPLE }]}
      label={
        outer
          ? "The curve y = x² from 0 to 1 with four rectangles of width 1/4 reaching above it. Their heights are 1/16, 4/16, 9/16 and 16/16: each rectangle is as tall as the curve at the right edge of its strip, so together they cover the whole region under the curve."
          : "The curve y = x² from 0 to 1 with four rectangles of width 1/4 lying under it. Their heights are 0, 1/16, 4/16 and 9/16: each rectangle is as tall as the curve at the left edge of its strip, so the first one is flat and they all fit under the curve."
      }
    >
      {({ px, py }) => (
        <g>
          {strips.map((i) => {
            const height = outer ? ((i + 1) / n) ** 2 : (i / n) ** 2;
            return (
              <rect
                key={i}
                x={px(i / n)}
                y={py(height)}
                width={px((i + 1) / n) - px(i / n)}
                height={py(0) - py(height)}
                fill={outer ? ORANGE : BLUE}
                fillOpacity={0.35}
                stroke={outer ? ORANGE : BLUE}
                strokeWidth={1.5}
              />
            );
          })}
          <polyline
            points={graph((x) => x * x, 0, 1)
              .map(([x, y]) => `${n2(px(x))},${n2(py(y))}`)
              .join(" ")}
            fill="none"
            stroke={PURPLE}
            strokeWidth={3}
          />
          <Words
            x={px(0.3)}
            y={py(0.8)}
            size={14}
            color={outer ? ORANGE : BLUE}
          >
            {outer ? "outer: 30/64" : "inner: 14/64"}
          </Words>
        </g>
      )}
    </Plot>
  );
  return (
    <Figure caption={caption}>
      <div className="grid items-center gap-6 sm:grid-cols-2">
        {panel("aav-inner", false)}
        {panel("aav-outer", true)}
      </div>
    </Figure>
  );
}

/**
 * A cone with 5 cylinders stacked inside it (each as wide as the cone at the top of its slab) and
 * with 5 cylinders stacked around it (each as wide as the cone at the bottom of its slab).
 */
export function ConeStacks({ caption }: { caption?: string }) {
  const n = 5;
  const inner = { cx: PANEL / 2, cy: 225, unit: CONE_UNIT };
  const outer = inner;
  return (
    <Figure caption={caption}>
      <Pair>
        <Panel
          title="cylinders inside"
          note="each as wide as the slab's top"
          label="A cone cut into 5 slabs of equal height, with blue cylinders inside it, one in each slab, each as wide as the cone at the top of its slab, so the top slab holds nothing."
        >
          <Stack
            at={inner}
            n={n}
            h={CONE_H}
            radius={(k) => (CONE_R * (n - k)) / n}
            side={BLUE_SIDE}
            top={BLUE_TOP}
            edge={BLUE}
          />
          <Cone at={inner} r={CONE_R} h={CONE_H} opacity={0.2} />
        </Panel>
        <Panel
          title="cylinders outside"
          note="each as wide as the slab's bottom"
          label="The same cone with 5 orange cylinders standing around it, each as wide as the cone at the bottom of its slab, so the cone sits wholly inside them."
        >
          <Cone at={outer} r={CONE_R} h={CONE_H} opacity={0.7} />
          <Stack
            at={outer}
            n={n}
            h={CONE_H}
            radius={(k) => (CONE_R * (n - k + 1)) / n}
            side={ORANGE_SIDE}
            top={ORANGE_TOP}
            edge={ORANGE}
            opacity={0.45}
          />
        </Panel>
      </Pair>
    </Figure>
  );
}

const BALL_R = 1.15;

/**
 * The top half of a ball with 5 cylinders stacked inside it and 5 stacked around it. A slice at
 * height z is a disc of radius √(r² − z²).
 */
export function HalfBallStacks({ caption }: { caption?: string }) {
  const n = 5;
  const inner = { cx: PANEL / 2, cy: 215, unit: CONE_UNIT };
  const outer = inner;
  const width = (k: number) => BALL_R * Math.sqrt(1 - (k / n) ** 2);
  return (
    <Figure caption={caption}>
      <Pair>
        <Panel
          title="cylinders inside"
          note="each as wide as the slab's top"
          label="The top half of a ball cut into 5 slabs of equal height from the flat face up, with blue cylinders inside it, each as wide as the ball at the top of its slab, so the top slab holds nothing."
        >
          <Stack
            at={inner}
            n={n}
            h={BALL_R}
            radius={(k) => width(k)}
            side={BLUE_SIDE}
            top={BLUE_TOP}
            edge={BLUE}
          />
          <Dome at={inner} r={BALL_R} opacity={0.2} />
        </Panel>
        <Panel
          title="cylinders outside"
          note="each as wide as the slab's bottom"
          label="The same half ball with 5 orange cylinders standing around it, each as wide as the ball at the bottom of its slab, so the bottom one is as wide as the flat face."
        >
          <Dome at={outer} r={BALL_R} opacity={0.7} />
          <Stack
            at={outer}
            n={n}
            h={BALL_R}
            radius={(k) => width(k - 1)}
            side={ORANGE_SIDE}
            top={ORANGE_TOP}
            edge={ORANGE}
            opacity={0.45}
          />
        </Panel>
      </Pair>
    </Figure>
  );
}

/**
 * A cone and a ball, each inside the glass cylinder that fits round it: the cone fills a third of
 * its cylinder and the ball two thirds of its.
 */
export function InsideTheCylinder({ caption }: { caption?: string }) {
  const r = 0.85;
  const left = { cx: PANEL / 2, cy: 230, unit: 100 };
  const right = left;
  return (
    <Figure caption={caption}>
      <Pair>
        <Panel
          title="a third of the cylinder"
          note="cone: same base, same height"
          label="A cone inside a purple glass cylinder with the same base and the same height: the cone fills a third of the cylinder."
        >
          <Cone at={left} r={r} h={2 * r} opacity={0.6} />
          <Glass at={left} a={r} h={2 * r} />
        </Panel>
        <Panel
          title="two thirds of the cylinder"
          note="ball: touching all round"
          label="A ball inside a glass cylinder just wide enough and tall enough to hold it, touching the top, the bottom and the side all round: the ball fills two thirds of the cylinder."
        >
          <Ball at={right} r={r} z0={r} />
          <Glass at={right} a={r} h={2 * r} />
        </Panel>
      </Pair>
    </Figure>
  );
}
