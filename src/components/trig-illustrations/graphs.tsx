import type { ReactNode } from "react";
import { Figure } from "../figure";
import { BLUE, ORANGE, PURPLE, Svg, Words } from "../illustrations";

/**
 * Pictures for the guide The graphs of sine and cosine. A Ferris wheel beside a chart of a car's
 * height against time, then sine and cosine waves on axes marked in multiples of π/2. Every wave is
 * drawn with the same scale across and up, so its shape is the true one.
 */

const MUTED = "#9ca3af";
const PI = Math.PI;

type Range = readonly [number, number];
type Scale = { px: (x: number) => number; py: (y: number) => number };

type Curve = {
  f: (x: number) => number;
  color: string;
  /** a light dashed curve, for the wave the new one is compared with */
  faint?: boolean;
  /** only part of the range, from..to */
  from?: number;
  to?: number;
};

// the name of k halves of π: "π/2", "π", "3π/2", "−2π" and so on
function halfPi(k: number) {
  if (k === 0) return "0";
  const sign = k < 0 ? "−" : "";
  const n = Math.abs(k);
  if (n % 2 === 0) return `${sign}${n === 2 ? "" : n / 2}π`;
  return `${sign}${n === 1 ? "" : n}π/2`;
}

const LEFT = 34;
const RIGHT = 30;
const TOP = 22;
const BOTTOM = 34;

/**
 * Axes for x from x0 to x1 (in radians) and y from y0 to y1, one scale for both. Faint lines mark
 * each multiple of π/2 (every `every` of them) and each whole number up; their names sit along the
 * bottom and the left edge, clear of the curves.
 */
function Wave({
  x: [x0, x1],
  y: [y0, y1],
  unit,
  every = 1,
  curves,
  dots = [],
  label,
  extra,
}: {
  x: Range;
  y: Range;
  unit: number;
  every?: number;
  curves: Curve[];
  dots?: { x: number; y: number; color: string }[];
  label: string;
  extra?: (s: Scale) => ReactNode;
}) {
  const width = LEFT + (x1 - x0) * unit + RIGHT;
  const height = TOP + (y1 - y0) * unit + BOTTOM;
  const px = (x: number) => LEFT + (x - x0) * unit;
  const py = (y: number) => TOP + (y1 - y) * unit;

  const ticks: number[] = [];
  for (
    let k = Math.ceil(x0 / (PI / 2) / every) * every;
    k * (PI / 2) <= x1 + 1e-9;
    k += every
  )
    ticks.push(k);
  const levels: number[] = [];
  for (let n = Math.ceil(y0); n <= y1; n++) levels.push(n);
  const axisX = x0 <= 0 && 0 <= x1 ? 0 : x0;

  return (
    <Svg width={width} height={height} label={label}>
      <g className="text-fd-border" stroke="currentColor" strokeWidth={1}>
        {ticks.map((k) => (
          <line
            key={`v${k}`}
            x1={px((k * PI) / 2)}
            x2={px((k * PI) / 2)}
            y1={py(y0)}
            y2={py(y1)}
          />
        ))}
        {levels.map((n) => (
          <line key={`h${n}`} x1={px(x0)} x2={px(x1)} y1={py(n)} y2={py(n)} />
        ))}
      </g>

      {/* the axes, with arrowheads at the positive ends */}
      <g stroke="currentColor" strokeWidth={1.5}>
        <line x1={px(x0)} x2={px(x1) + 14} y1={py(0)} y2={py(0)} />
        <line x1={px(axisX)} x2={px(axisX)} y1={py(y0)} y2={py(y1) - 12} />
      </g>
      <polygon
        fill="currentColor"
        points={`${px(x1) + 18},${py(0)} ${px(x1) + 10},${py(0) - 4} ${px(x1) + 10},${py(0) + 4}`}
      />
      <polygon
        fill="currentColor"
        points={`${px(axisX)},${py(y1) - 16} ${px(axisX) - 4},${py(y1) - 8} ${px(axisX) + 4},${py(y1) - 8}`}
      />
      <text
        x={px(x1) + 14}
        y={py(0) - 8}
        fontSize={14}
        fontStyle="italic"
        fill="currentColor"
      >
        x
      </text>
      <text
        x={px(axisX) + 8}
        y={py(y1) - 6}
        fontSize={14}
        fontStyle="italic"
        fill="currentColor"
      >
        y
      </text>

      <g fontSize={12} className="fill-fd-muted-foreground">
        {ticks.map((k) => (
          <text
            key={`tx${k}`}
            x={px((k * PI) / 2)}
            y={py(y0) + 20}
            textAnchor="middle"
          >
            {halfPi(k)}
          </text>
        ))}
        {levels.map((n) => (
          <text key={`ty${n}`} x={LEFT - 8} y={py(n) + 4} textAnchor="end">
            {n < 0 ? `−${-n}` : n}
          </text>
        ))}
      </g>

      {curves.map((c, i) => {
        const from = c.from ?? x0;
        const to = c.to ?? x1;
        const steps = Math.ceil((to - from) * 40);
        const points = Array.from({ length: steps + 1 }, (_, j) => {
          const x = from + ((to - from) * j) / steps;
          return `${px(x).toFixed(1)},${py(c.f(x)).toFixed(1)}`;
        });
        return (
          <polyline
            key={i}
            points={points.join(" ")}
            fill="none"
            stroke={c.color}
            strokeWidth={c.faint ? 2 : 3}
            strokeOpacity={c.faint ? 0.6 : 1}
            strokeDasharray={c.faint ? "6 5" : undefined}
            strokeLinejoin="round"
          />
        );
      })}

      {extra?.({ px, py })}

      {dots.map((d, i) => (
        <circle
          key={i}
          cx={px(d.x)}
          cy={py(d.y)}
          r={5}
          fill={d.color}
          stroke="var(--color-fd-card)"
          strokeWidth={2}
        />
      ))}
    </Svg>
  );
}

/** an arrow from (x1, y) to (x2, y) in pixels, with a label above its middle */
function Arrow({
  x1,
  x2,
  y,
  color,
  label,
}: {
  x1: number;
  x2: number;
  y: number;
  color: string;
  label: string;
}) {
  const dir = x2 > x1 ? 1 : -1;
  return (
    <g>
      <line
        x1={x1}
        x2={x2 - dir * 8}
        y1={y}
        y2={y}
        stroke={color}
        strokeWidth={2.5}
      />
      <polygon
        points={`${x2},${y} ${x2 - dir * 10},${y - 5} ${x2 - dir * 10},${y + 5}`}
        fill={color}
      />
      <Words x={(x1 + x2) / 2} y={y - 9} color={color} size={14}>
        {label}
      </Words>
    </g>
  );
}

/**
 * The opening scene: a Ferris wheel turning anticlockwise, and beside it the height of one car above
 * the centre, marked every twelfth of a turn. The dots climb, fall and climb again in a wave. The
 * chart uses the same scale up as the wheel, so a dashed line carries the car's height straight
 * across to its dot.
 */
export function FerrisHeights({ caption }: { caption?: string }) {
  const cx = 120;
  const cy = 130;
  const r = 90;
  const left = 260;
  const step = 28;
  const car = 2; // the car marked, two twelfths of a turn from the right
  const at = (k: number) => ({
    x: cx + r * Math.cos((k * PI) / 6),
    y: cy - r * Math.sin((k * PI) / 6),
  });
  const dot = (k: number) => ({
    x: left + k * step,
    y: cy - r * Math.sin((k * PI) / 6),
  });
  const wave = Array.from({ length: 121 }, (_, j) => {
    const k = j / 10;
    const p = dot(k);
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(" ");
  const end = left + 12 * step;

  return (
    <Figure caption={caption}>
      <Svg
        width={640}
        height={270}
        label="A Ferris wheel with twelve cars, turning anticlockwise. One car, a sixth of a turn up from the right, is marked. Beside the wheel, a chart shows the car's height above the centre after each twelfth of a turn: the dots rise to the height of the radius, fall through zero to minus the radius, and rise again, making a wave."
      >
        {/* the stand */}
        <g stroke="currentColor" strokeWidth={4} strokeLinecap="round">
          <line x1={cx} y1={cy} x2={cx - 60} y2={250} />
          <line x1={cx} y1={cy} x2={cx + 60} y2={250} />
          <line x1={cx - 90} y1={250} x2={cx + 90} y2={250} />
        </g>
        {/* the wheel, its spokes and the cars */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
        />
        {Array.from({ length: 12 }, (_, k) => {
          const p = at(k);
          return (
            <line
              key={k}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="currentColor"
              strokeOpacity={0.35}
              strokeWidth={1.5}
            />
          );
        })}
        {Array.from({ length: 12 }, (_, k) => {
          const p = at(k);
          const marked = k === car;
          return (
            <rect
              key={k}
              x={p.x - 8}
              y={p.y - 6}
              width={16}
              height={13}
              rx={3}
              fill={marked ? ORANGE : "var(--color-fd-card)"}
              stroke={marked ? ORANGE : "currentColor"}
              strokeWidth={2}
            />
          );
        })}
        <circle cx={cx} cy={cy} r={5} fill="currentColor" />
        {/* the turning direction */}
        <path
          d={`M ${cx + 40} ${cy + 22} A 46 46 0 0 0 ${cx + 22} ${cy - 40}`}
          fill="none"
          stroke={BLUE}
          strokeWidth={2.5}
        />
        <polygon
          points={`${cx + 22},${cy - 40} ${cx + 34},${cy - 40} ${cx + 26},${cy - 30}`}
          fill={BLUE}
        />

        {/* the chart: the centre's height is 0 */}
        <g stroke="currentColor" strokeWidth={1.5}>
          <line x1={left} x2={end + 18} y1={cy} y2={cy} />
          <line x1={left} x2={left} y1={cy + r + 12} y2={cy - r - 18} />
        </g>
        <polygon
          fill="currentColor"
          points={`${end + 22},${cy} ${end + 14},${cy - 4} ${end + 14},${cy + 4}`}
        />
        <polygon
          fill="currentColor"
          points={`${left},${cy - r - 22} ${left - 4},${cy - r - 14} ${left + 4},${cy - r - 14}`}
        />
        <polyline
          points={wave}
          fill="none"
          stroke={BLUE}
          strokeOpacity={0.5}
          strokeWidth={2}
          strokeDasharray="6 5"
        />
        <line
          x1={at(car).x + 10}
          x2={dot(car).x}
          y1={at(car).y}
          y2={dot(car).y}
          stroke={ORANGE}
          strokeWidth={2}
          strokeDasharray="5 4"
        />
        {Array.from({ length: 13 }, (_, k) => {
          const p = dot(k);
          return (
            <circle
              key={k}
              cx={p.x}
              cy={p.y}
              r={5}
              fill={k === car ? ORANGE : BLUE}
              stroke="var(--color-fd-card)"
              strokeWidth={2}
            />
          );
        })}
        <Words x={left + 10} y={22} anchor="start" size={14}>
          height above the centre
        </Words>
        <Words x={end + 4} y={cy + 24} anchor="end" size={14}>
          time
        </Words>
      </Svg>
    </Figure>
  );
}

/** a wave from 0 to 2π with a dot at each multiple of π/6 */
function TableWave({
  f,
  color,
  name,
  caption,
}: {
  f: (x: number) => number;
  color: string;
  name: string;
  caption?: string;
}) {
  const dots = Array.from({ length: 13 }, (_, k) => ({
    x: (k * PI) / 6,
    y: f((k * PI) / 6),
    color,
  }));
  return (
    <Figure caption={caption}>
      <Wave
        x={[0, 2 * PI]}
        y={[-1, 1]}
        unit={70}
        curves={[{ f, color }]}
        dots={dots}
        label={`The graph of y = ${name} x for x from 0 to 2π, with a dot at each multiple of π/6 from the table of values.`}
      />
    </Figure>
  );
}

/** the sine wave from 0 to 2π, through the thirteen values in the table */
export function SineGraph({ caption }: { caption?: string }) {
  return <TableWave f={Math.sin} color={BLUE} name="sin" caption={caption} />;
}

/** the cosine wave from 0 to 2π, through the thirteen values in the table */
export function CosineGraph({ caption }: { caption?: string }) {
  return <TableWave f={Math.cos} color={ORANGE} name="cos" caption={caption} />;
}

/** the sine wave from −2π to 4π: the piece from 0 to 2π in full colour, its copies lighter */
export function SineRepeats({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <Wave
        x={[-2 * PI, 4 * PI]}
        y={[-1, 1.6]}
        unit={42}
        every={2}
        curves={[
          { f: Math.sin, color: BLUE, faint: true, to: 0 },
          { f: Math.sin, color: BLUE, from: 0, to: 2 * PI },
          { f: Math.sin, color: BLUE, faint: true, from: 2 * PI },
        ]}
        label="The graph of y = sin x from −2π to 4π. The piece from 0 to 2π is drawn solid, and the pieces from −2π to 0 and from 2π to 4π are copies of it, slid sideways by 2π."
        extra={({ px, py }) => (
          <>
            <Arrow
              x1={px(PI / 2)}
              x2={px(PI / 2 + 2 * PI)}
              y={py(1.3)}
              color={PURPLE}
              label="2π"
            />
            <Arrow
              x1={px(PI / 2)}
              x2={px(PI / 2 - 2 * PI)}
              y={py(1.3)}
              color={PURPLE}
              label="2π"
            />
          </>
        )}
      />
    </Figure>
  );
}

/** sine and cosine on the same axes, with an arrow sliding the top of sine back to the top of cosine */
export function CosineShift({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <Wave
        x={[-PI, 2 * PI]}
        y={[-1, 1.6]}
        unit={64}
        curves={[
          { f: Math.sin, color: BLUE },
          { f: Math.cos, color: ORANGE },
        ]}
        dots={[
          { x: PI / 2, y: 1, color: BLUE },
          { x: 0, y: 1, color: ORANGE },
          { x: (3 * PI) / 2, y: -1, color: BLUE },
          { x: PI, y: -1, color: ORANGE },
        ]}
        label="The graphs of y = sin x in blue and y = cos x in orange, from −π to 2π. Cosine reaches its top at 0 and sine at π/2; cosine reaches its bottom at π and sine at 3π/2. An arrow slides the top of the sine wave left by π/2 onto the top of the cosine wave."
        extra={({ px, py }) => (
          <>
            <Arrow
              x1={px(PI / 2)}
              x2={px(0)}
              y={py(1.3)}
              color={PURPLE}
              label="π/2"
            />
            <Words
              x={px(-PI) + 8}
              y={py(1.3) + 5}
              anchor="start"
              color={ORANGE}
            >
              y = cos x
            </Words>
            <Words x={px(2 * PI) - 8} y={py(1.3) + 5} anchor="end" color={BLUE}>
              y = sin x
            </Words>
          </>
        )}
      />
    </Figure>
  );
}

/**
 * Two panels. The cosine wave with the y-axis as a mirror: the points at π/3 and −π/3 are at the
 * same height. The sine wave with the origin as the centre of a half turn: the points at π/3 and
 * −π/3 are at opposite heights, and the segment joining them has the origin as its midpoint.
 */
export function WaveSymmetry({ caption }: { caption?: string }) {
  const a = PI / 3;
  return (
    <Figure caption={caption} className="flex flex-col gap-6">
      <Wave
        x={[-2 * PI, 2 * PI]}
        y={[-1, 1]}
        unit={46}
        every={2}
        curves={[{ f: Math.cos, color: ORANGE }]}
        dots={[
          { x: a, y: Math.cos(a), color: PURPLE },
          { x: -a, y: Math.cos(a), color: PURPLE },
        ]}
        label="The graph of y = cos x from −2π to 2π, with the y-axis drawn as a mirror. The points at x = π/3 and x = −π/3 are both at height 1/2, mirror images of each other."
        extra={({ px, py }) => (
          <>
            <line
              x1={px(0)}
              x2={px(0)}
              y1={py(-1)}
              y2={py(1)}
              stroke={PURPLE}
              strokeWidth={3}
            />
            <line
              x1={px(-a)}
              x2={px(a)}
              y1={py(Math.cos(a))}
              y2={py(Math.cos(a))}
              stroke={PURPLE}
              strokeWidth={2}
              strokeDasharray="5 4"
            />
          </>
        )}
      />
      <Wave
        x={[-2 * PI, 2 * PI]}
        y={[-1, 1]}
        unit={46}
        every={2}
        curves={[{ f: Math.sin, color: BLUE }]}
        dots={[
          { x: a, y: Math.sin(a), color: PURPLE },
          { x: -a, y: -Math.sin(a), color: PURPLE },
          { x: 0, y: 0, color: PURPLE },
        ]}
        label="The graph of y = sin x from −2π to 2π. The points at x = π/3 and x = −π/3 are at heights about 0.87 and −0.87, and the dashed segment joining them has its midpoint at the origin, the centre of a half turn."
        extra={({ px, py }) => (
          <line
            x1={px(-a)}
            x2={px(a)}
            y1={py(-Math.sin(a))}
            y2={py(Math.sin(a))}
            stroke={PURPLE}
            strokeWidth={2}
            strokeDasharray="5 4"
          />
        )}
      />
    </Figure>
  );
}

/** a new wave in blue over an old one, faint, each named in its own colour */
function Compare({
  x,
  y,
  unit,
  every,
  old,
  wave,
  names,
  label,
  caption,
  extra,
}: {
  x: Range;
  y: Range;
  unit: number;
  every?: number;
  old: (x: number) => number;
  wave: (x: number) => number;
  names: [string, string];
  label: string;
  caption?: string;
  extra?: (s: Scale) => ReactNode;
}) {
  return (
    <Figure caption={caption}>
      <Wave
        x={x}
        y={y}
        unit={unit}
        every={every}
        curves={[
          { f: old, color: MUTED, faint: true },
          { f: wave, color: BLUE },
        ]}
        label={label}
        extra={(s) => (
          <>
            {extra?.(s)}
            <Words
              x={s.px(x[1]) - 4}
              y={s.py(y[1]) + 4}
              anchor="end"
              color={BLUE}
              size={14}
            >
              {names[1]}
            </Words>
            <Words
              x={s.px(x[1]) - 4}
              y={s.py(y[1]) + 22}
              anchor="end"
              color={MUTED}
              size={14}
            >
              {names[0]}
            </Words>
          </>
        )}
      />
    </Figure>
  );
}

/** y = 3 sin x over y = sin x: three times as tall, crossing zero at the same places */
export function WaveTaller({ caption }: { caption?: string }) {
  return (
    <Compare
      x={[0, 2 * PI]}
      y={[-3, 3.6]}
      unit={48}
      old={Math.sin}
      wave={(x) => 3 * Math.sin(x)}
      names={["y = sin x", "y = 3 sin x"]}
      caption={caption}
      label="The graph of y = 3 sin x in blue over the graph of y = sin x, dashed, from 0 to 2π. The blue wave rises to 3 and falls to −3, and crosses zero at the same places, 0, π and 2π."
    />
  );
}

/** y = sin 2x over y = sin x: two whole waves between 0 and 2π */
export function WaveSqueezed({ caption }: { caption?: string }) {
  return (
    <Compare
      x={[0, 2 * PI]}
      y={[-1, 1.6]}
      unit={70}
      old={Math.sin}
      wave={(x) => Math.sin(2 * x)}
      names={["y = sin x", "y = sin 2x"]}
      caption={caption}
      label="The graph of y = sin 2x in blue over the graph of y = sin x, dashed, from 0 to 2π. The blue wave makes two whole waves in that stretch, each π long, with tops at π/4 and 5π/4."
    />
  );
}

/** y = cos(x/2) over y = cos x, from 0 to 4π: the new wave is twice as long */
export function WaveWidened({ caption }: { caption?: string }) {
  return (
    <Compare
      x={[0, 4 * PI]}
      y={[-1, 1.95]}
      unit={40}
      every={2}
      old={Math.cos}
      wave={(x) => Math.cos(x / 2)}
      names={["y = cos x", "y = cos(x/2)"]}
      caption={caption}
      label="The graph of y = cos(x/2) in blue over the graph of y = cos x, dashed, from 0 to 4π. The blue wave makes one whole wave in that stretch: it falls from 1 at 0 to −1 at 2π and climbs back to 1 at 4π."
    />
  );
}

/** y = sin(x − π/3) over y = sin x: the same wave, slid right by π/3 */
export function WaveSlid({ caption }: { caption?: string }) {
  return (
    <Compare
      x={[0, 2 * PI]}
      y={[-1, 1.6]}
      unit={70}
      old={Math.sin}
      wave={(x) => Math.sin(x - PI / 3)}
      names={["y = sin x", "y = sin(x − π/3)"]}
      caption={caption}
      label="The graph of y = sin(x − π/3) in blue over the graph of y = sin x, dashed, from 0 to 2π. The blue wave is the dashed one slid right by π/3: its top is at 5π/6 instead of π/2."
      extra={({ px, py }) => (
        <>
          <Arrow
            x1={px(PI / 2)}
            x2={px((5 * PI) / 6)}
            y={py(1.25)}
            color={PURPLE}
            label="π/3"
          />
          <circle cx={px(PI / 2)} cy={py(1)} r={4} fill={MUTED} />
          <circle cx={px((5 * PI) / 6)} cy={py(1)} r={5} fill={BLUE} />
        </>
      )}
    />
  );
}

/** the two waves with their zeros marked: sine's at multiples of π, cosine's halfway between */
export function TrigZeros({ caption }: { caption?: string }) {
  const sineZeros = [-2, -1, 0, 1, 2].map((n) => n * PI);
  const cosineZeros = [-1.5, -0.5, 0.5, 1.5].map((n) => n * PI);
  return (
    <Figure caption={caption}>
      <Wave
        x={[-2 * PI, 2 * PI]}
        y={[-1, 1]}
        unit={46}
        curves={[
          { f: Math.sin, color: BLUE },
          { f: Math.cos, color: ORANGE },
        ]}
        dots={[
          ...sineZeros.map((x) => ({ x, y: 0, color: BLUE })),
          ...cosineZeros.map((x) => ({ x, y: 0, color: ORANGE })),
        ]}
        label="The graphs of y = sin x in blue and y = cos x in orange from −2π to 2π, with the points where each crosses the x-axis marked. Sine crosses at −2π, −π, 0, π and 2π; cosine crosses at −3π/2, −π/2, π/2 and 3π/2."
      />
    </Figure>
  );
}
