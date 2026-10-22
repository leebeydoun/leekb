import type { ReactNode } from "react";
import { Figure } from "../figure";
import {
  BLUE,
  FieldWords,
  GRASS,
  GRASS_DARK,
  ORANGE,
  PENCIL,
  PURPLE,
  Svg,
  WOOD,
  WOOD_DARK,
  Words,
  type Pt,
} from "../illustrations";

/**
 * Pictures of reflections at work: a walk to a river and back seen from above, a bank shot on a
 * billiard table, and light bouncing off a mirror. Each shows the same trick: the bent path is as
 * long as a straight line to a mirror image.
 */

const WATER = "#7cb9e8";
const WATER_DARK = "#3b82c4";
const ROOF = "#b45309";
const WALL = "#fde68a";
const CLOTH = "#1f8a5b";
const CLOTH_DARK = "#14593b";
const CUSHION = "#0f4a30";

/** a dashed line between two points */
function Dashed({
  from,
  to,
  color,
  width = 2.5,
}: {
  from: Pt;
  to: Pt;
  color: string;
  width?: number;
}) {
  return (
    <line
      x1={from[0]}
      y1={from[1]}
      x2={to[0]}
      y2={to[1]}
      stroke={color}
      strokeWidth={width}
      strokeDasharray="8 6"
      strokeLinecap="round"
    />
  );
}

/** a solid path through several points, with a halo so it reads over grass or cloth */
function Route({
  points,
  color,
  width = 4,
}: {
  points: Pt[];
  color: string;
  width?: number;
}) {
  const d = points.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path
        d={d}
        stroke="#ffffff"
        strokeOpacity={0.7}
        strokeWidth={width + 3}
      />
      <path d={d} stroke={color} strokeWidth={width} />
    </g>
  );
}

/** a cottage seen from above: a roof with its ridge, and a chimney */
function Cottage({ at, opacity = 1 }: { at: Pt; opacity?: number }) {
  const [x, y] = at;
  return (
    <g opacity={opacity}>
      <rect
        x={x - 22}
        y={y - 16}
        width={44}
        height={32}
        rx={2}
        fill={ROOF}
        stroke={PENCIL}
        strokeWidth={1.5}
      />
      <line
        x1={x - 22}
        y1={y}
        x2={x + 22}
        y2={y}
        stroke={PENCIL}
        strokeWidth={1.5}
      />
      <rect
        x={x + 8}
        y={y - 12}
        width={7}
        height={7}
        fill={WALL}
        stroke={PENCIL}
        strokeWidth={1}
      />
    </g>
  );
}

/**
 * The river walk from above: from the cottage down to the river to fill a bucket, then on to the
 * vegetable garden. The cottage's mirror image sits across the water, and the straight line from
 * it to the garden crosses the bank at the best place to stop.
 */
export function RiverWalk({ caption }: { caption?: string }) {
  const width = 560;
  const height = 330;
  const bank = 190;
  const home: Pt = [110, 70];
  const garden: Pt = [440, 110];
  const mirrored: Pt = [home[0], 2 * bank - home[1]];
  // where the line from the mirror image to the garden crosses the bank
  const t = (mirrored[1] - bank) / (mirrored[1] - garden[1]);
  const best: Pt = [mirrored[0] + (garden[0] - mirrored[0]) * t, bank];
  const worse: Pt = [150, bank];

  const tufts: Pt[] = [
    [40, 30],
    [230, 40],
    [330, 60],
    [520, 40],
    [60, 150],
    [280, 150],
    [500, 170],
    [200, 110],
  ];

  return (
    <Figure caption={caption}>
      <Svg
        width={width}
        height={height}
        label="A field seen from above with a cottage, a vegetable garden and a river along the bottom. A route runs from the cottage down to the river bank and on to the garden. Across the river is the cottage's mirror image, and a dashed straight line from it to the garden crosses the bank where the route touches it."
      >
        <rect x={0} y={0} width={width} height={bank} rx={14} fill={GRASS} />
        <rect x={0} y={bank - 14} width={width} height={14} fill={GRASS} />
        <rect
          x={0}
          y={bank}
          width={width}
          height={height - bank}
          rx={14}
          fill={WATER}
        />
        <rect x={0} y={bank} width={width} height={14} fill={WATER} />
        <line
          x1={0}
          y1={bank}
          x2={width}
          y2={bank}
          stroke={WATER_DARK}
          strokeWidth={3}
        />
        <g
          stroke={GRASS_DARK}
          strokeWidth={1.5}
          strokeLinecap="round"
          fill="none"
          opacity={0.7}
        >
          {tufts.map(([x, y], i) => (
            <path
              key={i}
              d={`M ${x - 5} ${y - 6} L ${x} ${y} L ${x + 2} ${y - 8} M ${x} ${y} L ${x + 6} ${y - 5}`}
            />
          ))}
        </g>
        {/* ripples on the water */}
        <g
          stroke="#ffffff"
          strokeOpacity={0.6}
          strokeWidth={1.5}
          fill="none"
          strokeLinecap="round"
        >
          {[
            [60, 240],
            [300, 290],
            [470, 230],
            [400, 300],
          ].map(([x, y], i) => (
            <path key={i} d={`M ${x} ${y} q 8 -5 16 0 q 8 5 16 0`} />
          ))}
        </g>

        {/* the garden: rows of plants in a wooden frame */}
        <rect
          x={garden[0] - 34}
          y={garden[1] - 24}
          width={68}
          height={48}
          fill="#8b6b45"
          stroke={WOOD_DARK}
          strokeWidth={2}
        />
        {[-12, 0, 12].map((dy) => (
          <g key={dy}>
            {[-22, -8, 6, 20].map((dx) => (
              <circle
                key={dx}
                cx={garden[0] + dx}
                cy={garden[1] + dy}
                r={4}
                fill="#4ade80"
              />
            ))}
          </g>
        ))}

        {/* the mirror image of the cottage, under the water */}
        <Cottage at={mirrored} opacity={0.35} />
        <Dashed from={mirrored} to={garden} color={PURPLE} />
        <Dashed from={home} to={mirrored} color="#ffffff" width={1.5} />

        {/* a worse place to stop, and the best one */}
        <Route points={[home, worse, garden]} color="#9ca3af" width={3} />
        <Route points={[home, best, garden]} color={ORANGE} />
        <Cottage at={home} />
        <circle
          cx={best[0]}
          cy={best[1]}
          r={6}
          fill={ORANGE}
          stroke={PENCIL}
          strokeWidth={1.5}
        />

        <FieldWords x={home[0]} y={home[1] - 26}>
          cottage
        </FieldWords>
        <FieldWords x={garden[0]} y={garden[1] - 32}>
          garden
        </FieldWords>
        <FieldWords x={best[0] + 12} y={bank - 12} anchor="start">
          fill the bucket here
        </FieldWords>
        <FieldWords x={worse[0] - 10} y={bank - 12} anchor="end">
          longer
        </FieldWords>
        <text
          x={home[0] + 32}
          y={mirrored[1] + 5}
          fontSize={15}
          fill={PENCIL}
          fillOpacity={0.8}
        >
          the cottage's mirror image
        </text>
      </Svg>
    </Figure>
  );
}

/** a billiard ball, with a soft highlight */
function Ball({
  at,
  color,
  label,
}: {
  at: Pt;
  color: string;
  label?: ReactNode;
}) {
  return (
    <g>
      <circle
        cx={at[0] + 1.5}
        cy={at[1] + 2}
        r={11}
        fill="#000"
        fillOpacity={0.25}
      />
      <circle
        cx={at[0]}
        cy={at[1]}
        r={11}
        fill={color}
        stroke={PENCIL}
        strokeWidth={1}
      />
      <circle
        cx={at[0] - 3.5}
        cy={at[1] - 3.5}
        r={3}
        fill="#ffffff"
        fillOpacity={0.7}
      />
      {label}
    </g>
  );
}

/**
 * A bank shot on a billiard table, from above. To hit the red ball off the top cushion, aim the
 * white ball at the red ball's mirror image beyond the cushion: the path that bounces is as long as
 * that straight aim.
 */
export function BilliardBank({ caption }: { caption?: string }) {
  const width = 560;
  const height = 340;
  const rail = 22;
  const top = 120;
  const left = 30;
  const right = width - 30;
  const bottom = height - 20;
  const cushion = top + rail;
  const white: Pt = [110, 280];
  const red: Pt = [460, 230];
  const ghost: Pt = [red[0], 2 * cushion - red[1]];
  const t = (white[1] - cushion) / (white[1] - ghost[1]);
  const bounce: Pt = [white[0] + (ghost[0] - white[0]) * t, cushion];

  return (
    <Figure caption={caption}>
      <Svg
        width={width}
        height={height}
        label="A billiard table seen from above. The white ball travels to the top cushion, bounces, and hits the red ball. Beyond the cushion is the red ball's mirror image, and the white ball's first leg points straight at it."
      >
        {/* the space beyond the cushion, where the mirror image sits */}
        <rect
          x={left}
          y={10}
          width={right - left}
          height={top - 10}
          rx={8}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.25}
          strokeDasharray="6 6"
        />
        <rect
          x={left - 10}
          y={top - 10}
          width={right - left + 20}
          height={bottom - top + 20}
          rx={14}
          fill={WOOD}
          stroke={WOOD_DARK}
          strokeWidth={2}
        />
        <rect
          x={left}
          y={top}
          width={right - left}
          height={bottom - top}
          rx={6}
          fill={CUSHION}
        />
        <rect
          x={left + rail}
          y={cushion}
          width={right - left - 2 * rail}
          height={bottom - top - 2 * rail}
          fill={CLOTH}
        />
        {[left + rail, (left + right) / 2, right - rail].map((x) => (
          <circle key={x} cx={x} cy={cushion} r={10} fill={CLOTH_DARK} />
        ))}

        <Dashed from={bounce} to={ghost} color="#ffffff" width={2} />
        <Route points={[white, bounce, red]} color="#fef9c3" width={3} />
        <g opacity={0.45}>
          <Ball at={ghost} color="#ef4444" />
        </g>
        <Ball at={white} color="#f8fafc" />
        <Ball at={red} color="#ef4444" />

        <Words x={ghost[0] - 20} y={ghost[1] + 5} anchor="end">
          the red ball's mirror image
        </Words>
        <Words x={left + 6} y={top - 18} anchor="start">
          beyond the cushion
        </Words>
        {/* written on the green cloth, so white with a dark green outline rather than the page halo */}
        <text
          x={white[0] + 18}
          y={white[1] + 5}
          fontSize={15}
          fill="#ffffff"
          stroke="#14532d"
          strokeWidth={3}
          strokeLinejoin="round"
          paintOrder="stroke"
        >
          white ball
        </text>
      </Svg>
    </Figure>
  );
}

/** an angle mark at `at`, between the directions towards `from` and `to`, drawn the short way */
function Arc({ at, from, to }: { at: Pt; from: Pt; to: Pt }) {
  const r = 30;
  const unit = ([x, y]: Pt): Pt => {
    const l = Math.hypot(x - at[0], y - at[1]);
    return [(x - at[0]) / l, (y - at[1]) / l];
  };
  const [ax, ay] = unit(from);
  const [bx, by] = unit(to);
  // the sign of the cross product says which way round is the short way
  const sweep = ax * by - ay * bx > 0 ? 1 : 0;
  return (
    <path
      d={`M ${at[0] + ax * r} ${at[1] + ay * r} A ${r} ${r} 0 0 ${sweep} ${at[0] + bx * r} ${at[1] + by * r}`}
      fill="none"
      stroke={ORANGE}
      strokeWidth={2}
    />
  );
}

/**
 * Light from a lamp bouncing off a wall mirror into an eye. The light seems to come from the lamp's
 * image behind the mirror, along a straight line, and it meets the mirror at equal angles on the way
 * in and on the way out.
 */
export function MirrorLight({ caption }: { caption?: string }) {
  const width = 560;
  const height = 300;
  const wall = 300;
  const lamp: Pt = [110, 90];
  const eye: Pt = [140, 230];
  const image: Pt = [2 * wall - lamp[0], lamp[1]];
  const t = (wall - eye[0]) / (image[0] - eye[0]);
  const hit: Pt = [wall, eye[1] + (image[1] - eye[1]) * t];

  return (
    <Figure caption={caption}>
      <Svg
        width={width}
        height={height}
        label="Light from a lamp travels to a wall mirror and bounces into an eye. Behind the mirror, a faint copy of the lamp sits as far back as the real lamp is in front, and the eye's line of sight runs straight to it."
      >
        {/* the room, and the space behind the mirror */}
        <rect
          x={wall}
          y={20}
          width={width - wall - 20}
          height={height - 40}
          fill="currentColor"
          fillOpacity={0.04}
        />
        <rect
          x={wall - 6}
          y={40}
          width={8}
          height={height - 80}
          rx={2}
          fill="#bfdbfe"
          stroke={BLUE}
          strokeWidth={2}
        />

        {/* the lamp: a shade on a stand, with its glow */}
        <g>
          <circle
            cx={lamp[0]}
            cy={lamp[1]}
            r={26}
            fill="#fde68a"
            fillOpacity={0.45}
          />
          <polygon
            points={`${lamp[0] - 16},${lamp[1] + 6} ${lamp[0] + 16},${lamp[1] + 6} ${lamp[0] + 9},${lamp[1] - 12} ${lamp[0] - 9},${lamp[1] - 12}`}
            fill="#f59e0b"
            stroke={PENCIL}
            strokeWidth={1.5}
          />
        </g>
        <g opacity={0.3}>
          <circle
            cx={image[0]}
            cy={image[1]}
            r={26}
            fill="#fde68a"
            fillOpacity={0.45}
          />
          <polygon
            points={`${image[0] - 16},${image[1] + 6} ${image[0] + 16},${image[1] + 6} ${image[0] + 9},${image[1] - 12} ${image[0] - 9},${image[1] - 12}`}
            fill="#f59e0b"
            stroke={PENCIL}
            strokeWidth={1.5}
          />
        </g>

        {/* an eye looking at the mirror */}
        <g>
          <ellipse
            cx={eye[0]}
            cy={eye[1]}
            rx={18}
            ry={10}
            fill="#ffffff"
            stroke={PENCIL}
            strokeWidth={1.5}
          />
          <circle cx={eye[0] + 6} cy={eye[1]} r={6} fill="#2563eb" />
          <circle cx={eye[0] + 7} cy={eye[1]} r={2.5} fill={PENCIL} />
        </g>

        <Dashed from={hit} to={image} color={PURPLE} width={2} />
        <Route
          points={[lamp, hit, [eye[0] + 20, eye[1] - 2]]}
          color={ORANGE}
          width={3}
        />

        {/* the two equal angles with the mirror */}
        <Arc at={hit} from={lamp} to={[hit[0], hit[1] - 50]} />
        <Arc at={hit} from={[hit[0], hit[1] + 50]} to={eye} />

        <Words x={lamp[0]} y={lamp[1] - 36}>
          lamp
        </Words>
        <Words x={eye[0]} y={eye[1] + 32}>
          eye
        </Words>
        <Words x={wall - 12} y={34} anchor="end" color={BLUE}>
          mirror
        </Words>
        <Words x={image[0]} y={image[1] - 36}>
          the lamp's image
        </Words>
        <Words x={hit[0] - 46} y={hit[1] + 5} anchor="end" color={ORANGE}>
          equal angles
        </Words>
      </Svg>
    </Figure>
  );
}
