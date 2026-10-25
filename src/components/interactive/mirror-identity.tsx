"use client";

/**
 * The point P = (cos x, sin x) on a large unit circle, and its image P′ under one of five moves
 * with known formulas: the flip in the x-axis, the half turn, the quarter turn, the flip in the
 * y-axis and the flip in y = x. A slider sets x. Each image is again a point of the unit circle,
 * the point for a new angle (−x, x + π, x + π/2, π − x or π/2 − x), and the readout states the
 * identity that the move shows, with the numbers.
 */

import { useState, type ReactNode } from "react";
import { Button, COLORS, Interactive, Slider, format } from "./kit";

const UNIT = 150;
const PAD = 22;
const SIZE = 1.38;
const WIDTH = 2 * SIZE * UNIT + PAD * 2;

type Vec = { x: number; y: number };

const px = (p: Vec): Vec => ({
  x: PAD + (p.x + SIZE) * UNIT,
  y: PAD + (SIZE - p.y) * UNIT,
});

const polar = (angle: number, r = 1): Vec => ({
  x: r * Math.cos(angle),
  y: r * Math.sin(angle),
});

/**
 * An svg path for the arc about O of radius r, from one angle to another in radians, going
 * anticlockwise when `to` is larger and clockwise when it is smaller. It is drawn in pieces of at
 * most a half turn, so a whole turn still draws.
 */
function arc(from: number, to: number, r: number) {
  const pieces = Math.max(1, Math.ceil(Math.abs(to - from) / Math.PI));
  const start = px(polar(from, r));
  let d = `M ${start.x} ${start.y}`;
  for (let i = 1; i <= pieces; i++) {
    const end = px(polar(from + ((to - from) * i) / pieces, r));
    // anticlockwise on the page is sweep 0, since the page's y points down
    d += ` A ${r * UNIT} ${r * UNIT} 0 0 ${to > from ? 0 : 1} ${end.x} ${end.y}`;
  }
  return d;
}

/** a small arrowhead at the end of an arc of radius r that finishes at `angle` */
function ArcHead({
  angle,
  r,
  forwards,
  color,
}: {
  angle: number;
  r: number;
  forwards: boolean;
  color: string;
}) {
  const tip = px(polar(angle, r));
  // the direction of travel on the page: along the tangent, flipped for a clockwise arc
  const s = forwards ? 1 : -1;
  const t = { x: -Math.sin(angle) * s, y: -Math.cos(angle) * s };
  const n = { x: -t.y, y: t.x };
  const back = { x: tip.x - t.x * 10, y: tip.y - t.y * 10 };
  return (
    <polygon
      points={`${tip.x},${tip.y} ${back.x + n.x * 5},${back.y + n.y * 5} ${back.x - n.x * 5},${back.y - n.y * 5}`}
      fill={color}
    />
  );
}

const halo = {
  stroke: "var(--color-fd-card)",
  strokeWidth: 4,
  paintOrder: "stroke" as const,
};

type MoveName = "flipX" | "half" | "quarter" | "flipY" | "diagonal";

type Move = {
  button: string;
  /** what the move is called in the readout */
  name: string;
  /** the angle whose point the image is, in radians, and how the readout writes it */
  angle: (x: number) => number;
  of: string;
  kind: "flip" | "turn";
  /** the two identities, with the numbers for cos x = c and sin x = s */
  identity: (c: number, s: number) => ReactNode;
};

const MOVES: Record<MoveName, Move> = {
  flipX: {
    button: "flip in x-axis",
    name: "the flip in the x-axis",
    angle: (x) => -x,
    of: "−x",
    kind: "flip",
    identity: (c, s) => (
      <>
        cos(−<i>x</i>) = cos <i>x</i> = {format(c)}, and sin(−<i>x</i>) = −sin{" "}
        <i>x</i> = {format(-s)}
      </>
    ),
  },
  half: {
    button: "half turn",
    name: "the half turn",
    angle: (x) => x + Math.PI,
    of: "x + π",
    kind: "turn",
    identity: (c, s) => (
      <>
        cos(<i>x</i> + π) = −cos <i>x</i> = {format(-c)}, and sin(<i>x</i> + π)
        = −sin <i>x</i> = {format(-s)}
      </>
    ),
  },
  quarter: {
    button: "quarter turn",
    name: "the quarter turn",
    angle: (x) => x + Math.PI / 2,
    of: "x + π/2",
    kind: "turn",
    identity: (c, s) => (
      <>
        cos(<i>x</i> + π/2) = −sin <i>x</i> = {format(-s)}, and sin(<i>x</i> +
        π/2) = cos <i>x</i> = {format(c)}
      </>
    ),
  },
  flipY: {
    button: "flip in y-axis",
    name: "the flip in the y-axis",
    angle: (x) => Math.PI - x,
    of: "π − x",
    kind: "flip",
    identity: (c, s) => (
      <>
        cos(π − <i>x</i>) = −cos <i>x</i> = {format(-c)}, and sin(π − <i>x</i>)
        = sin <i>x</i> = {format(s)}
      </>
    ),
  },
  diagonal: {
    button: "flip in y = x",
    name: "the flip in y = x",
    angle: (x) => Math.PI / 2 - x,
    of: "π/2 − x",
    kind: "flip",
    identity: (c, s) => (
      <>
        cos(π/2 − <i>x</i>) = sin <i>x</i> = {format(s)}, and sin(π/2 − <i>x</i>
        ) = cos <i>x</i> = {format(c)}
      </>
    ),
  },
};

const ORDER: MoveName[] = ["flipX", "half", "quarter", "flipY", "diagonal"];

/** the mirror of each flip, as an angle of the line through O */
const MIRROR: Partial<Record<MoveName, number>> = {
  flipX: 0,
  flipY: Math.PI / 2,
  diagonal: Math.PI / 4,
};

const degrees = (x: number) => `${format((x * 180) / Math.PI, 1)}°`;
const pair = (p: Vec) => `(${format(p.x)}, ${format(p.y)})`;

function Dot({
  at,
  name,
  color,
  outwards,
}: {
  at: Vec;
  name: string;
  color: string;
  /** which way the label sits from the dot: away from O, or towards it */
  outwards: boolean;
}) {
  const p = px(at);
  const length = Math.hypot(at.x, at.y) || 1;
  const d = (outwards ? 22 : -24) / length;
  return (
    <g>
      <circle
        cx={p.x}
        cy={p.y}
        r={6}
        fill={color}
        stroke="var(--color-fd-card)"
        strokeWidth={2}
      />
      <text
        x={p.x + at.x * d}
        y={p.y - at.y * d + 6}
        textAnchor="middle"
        fontSize={17}
        fontStyle="italic"
        fontWeight={600}
        fill={color}
        {...halo}
      >
        {name}
      </text>
    </g>
  );
}

export function MirrorIdentity({
  x: start = 0.7,
  move: startMove = "flipX",
  caption = "P is the point for x on the unit circle, and P′ is where the chosen move sends it. P′ is on the unit circle too, so it is the point for another angle, and comparing coordinates gives an identity.",
}: {
  /** the angle x to start at, in radians */
  x?: number;
  move?: MoveName;
  caption?: string;
}) {
  const [x, setX] = useState(start);
  const [name, setName] = useState<MoveName>(startMove);
  const move = MOVES[name];

  const c = Math.cos(x);
  const s = Math.sin(x);
  const P = { x: c, y: s };
  const imageAngle = move.angle(x);
  const image = polar(imageAngle);
  const close = Math.hypot(image.x - P.x, image.y - P.y) < 0.3;
  const o = px({ x: 0, y: 0 });

  let guide: ReactNode;
  const mirror = MIRROR[name];
  if (mirror !== undefined) {
    const a = px(polar(mirror, -SIZE * 1.1));
    const b = px(polar(mirror, SIZE * 1.1));
    guide = (
      <g>
        <line
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke={COLORS.purple}
          strokeWidth={6}
          strokeOpacity={0.3}
          strokeLinecap="round"
        />
        {name === "diagonal" && (
          <text
            x={px(polar(mirror, 1.28)).x - 10}
            y={px(polar(mirror, 1.28)).y + 4}
            textAnchor="end"
            fontSize={15}
            fontStyle="italic"
            fill={COLORS.purple}
            {...halo}
          >
            y = x
          </text>
        )}
        {!close && (
          <line
            x1={px(P).x}
            y1={px(P).y}
            x2={px(image).x}
            y2={px(image).y}
            stroke={COLORS.purple}
            strokeWidth={2}
            strokeDasharray="6 4"
          />
        )}
      </g>
    );
  } else {
    // a turn: the arc from P round to its image, a little outside the circle
    const turn = name === "half" ? Math.PI : Math.PI / 2;
    guide = (
      <g>
        <path
          d={arc(x, x + turn, 1.13)}
          fill="none"
          stroke={COLORS.purple}
          strokeWidth={2.5}
          strokeDasharray="7 5"
        />
        <ArcHead angle={x + turn} r={1.13} forwards color={COLORS.purple} />
        <g stroke={COLORS.purple} strokeWidth={1.5} strokeOpacity={0.6}>
          <line x1={o.x} y1={o.y} x2={px(P).x} y2={px(P).y} />
          <line x1={o.x} y1={o.y} x2={px(image).x} y2={px(image).y} />
        </g>
      </g>
    );
  }

  const ticks = [-1, 1];

  return (
    <Interactive
      caption={caption}
      readout={
        <>
          <div>
            <i>x</i> = {format(x)} ({degrees(x)}): {move.name} sends <i>P</i> ={" "}
            {pair(P)} to <i>P</i>′ = {pair(image)}, the point for {move.of}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            So {move.identity(c, s)}
          </div>
        </>
      }
      controls={
        <>
          <Slider
            label={<i>x</i>}
            value={x}
            onChange={setX}
            min={0}
            max={6.28}
            step={0.01}
            show={(v) => `${format(v)} (${degrees(v)})`}
          />
          <div className="flex flex-wrap justify-center gap-2">
            {ORDER.map((key) => (
              <Button
                key={key}
                primary={key === name}
                onClick={() => setName(key)}
              >
                {MOVES[key].button}
              </Button>
            ))}
          </div>
        </>
      }
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${WIDTH}`}
        className="mx-auto block h-auto w-full max-w-md text-fd-foreground"
        role="img"
        aria-label={`The unit circle with P = ${pair(P)} for x = ${format(x)}. ${move.name} sends P to ${pair(image)}, the point for ${move.of}.`}
      >
        {/* the axes, with the numbers ±1 where they cross the circle */}
        <g stroke="currentColor" strokeWidth={1.5} strokeOpacity={0.55}>
          <line
            x1={px({ x: -SIZE, y: 0 }).x}
            x2={px({ x: SIZE, y: 0 }).x}
            y1={o.y}
            y2={o.y}
          />
          <line
            x1={o.x}
            x2={o.x}
            y1={px({ x: 0, y: SIZE }).y}
            y2={px({ x: 0, y: -SIZE }).y}
          />
        </g>
        <g fontSize={12} className="fill-fd-muted-foreground">
          {ticks.map((t) => (
            <g key={t}>
              <text
                x={px({ x: t, y: 0 }).x + (t > 0 ? 8 : -8)}
                y={o.y + 16}
                textAnchor={t > 0 ? "start" : "end"}
              >
                {format(t)}
              </text>
              <text
                x={o.x - 8}
                y={px({ x: 0, y: t }).y + (t > 0 ? -6 : 16)}
                textAnchor="end"
              >
                {format(t)}
              </text>
            </g>
          ))}
        </g>

        <circle
          cx={o.x}
          cy={o.y}
          r={UNIT}
          fill={COLORS.blue}
          fillOpacity={0.04}
          stroke="currentColor"
          strokeOpacity={0.45}
          strokeWidth={2}
        />

        {guide}

        {/* the turn by x from E₁ to P, and for a flip the turn from E₁ to the image */}
        {x > 0.02 && (
          <>
            <path
              d={arc(0, x, 0.2)}
              fill="none"
              stroke={COLORS.blue}
              strokeWidth={2.5}
            />
            <ArcHead angle={x} r={0.2} forwards color={COLORS.blue} />
          </>
        )}
        {move.kind === "flip" && Math.abs(imageAngle) > 0.02 && (
          <>
            <path
              d={arc(0, imageAngle, 0.32)}
              fill="none"
              stroke={COLORS.orange}
              strokeWidth={2.5}
            />
            <ArcHead
              angle={imageAngle}
              r={0.32}
              forwards={imageAngle > 0}
              color={COLORS.orange}
            />
          </>
        )}

        <Dot at={P} name="P" color={COLORS.blue} outwards />
        <Dot at={image} name="P′" color={COLORS.orange} outwards={!close} />
        <circle cx={o.x} cy={o.y} r={4} fill="currentColor" />
        <text
          x={o.x - 10}
          y={o.y + 18}
          textAnchor="end"
          fontSize={15}
          fontStyle="italic"
          fill="currentColor"
          {...halo}
        >
          O
        </text>
      </svg>
    </Interactive>
  );
}
