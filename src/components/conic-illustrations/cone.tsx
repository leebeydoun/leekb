import { Figure } from "../figure";
import { PURPLE, STEEL, Svg, Words, type Pt } from "../illustrations";

/**
 * Pictures for the guide Slicing a cone: the double cone x² + y² = z² three times over, cut by the
 * planes z = x/2 + 1, z = x + 1 and z = 2x + 1. The cuts are an ellipse, a parabola and a hyperbola,
 * whose two branches lie on the two halves of the cone. Space is seen from in front and a little
 * above, with no perspective shrinking, so equal lengths across the page stay equal.
 */

const LIGHT = "#fde68a";
const LIGHT_EDGE = "#b45309";

// how far above level we look from, and the height of each half of the cone that is drawn
const TILT = (22 * Math.PI) / 180;
// and how far round from straight in front: we look from the side the planes slope down towards
const TURN = (-60 * Math.PI) / 180;
const H = 2.4;
const UNIT = 40;
const PANEL = 250;
const MIDDLE = 150; // where the tip of each cone sits on the page, from the top

type Pt3 = readonly [number, number, number];

/** the page position of a point of space, for a cone whose tip is drawn at (cx, MIDDLE) */
const at =
  (cx: number) =>
  ([x, y, z]: Pt3): Pt => {
    const across = x * Math.cos(TURN) + y * Math.sin(TURN);
    const back = -x * Math.sin(TURN) + y * Math.cos(TURN);
    return [
      cx + UNIT * across,
      MIDDLE - UNIT * (z * Math.cos(TILT) + back * Math.sin(TILT)),
    ];
  };

const join = (points: Pt[]) =>
  points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

/** the points of the rim circle at height z, for angles from t0 to t1 */
function rim(cx: number, z: number, t0: number, t1: number, steps = 60) {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = t0 + ((t1 - t0) * i) / steps;
    return at(cx)([Math.abs(z) * Math.cos(t), Math.abs(z) * Math.sin(t), z]);
  });
}

/**
 * The points where the plane z = mx + 1 meets the cone, in runs that are each on one half of the
 * cone and either facing us or turned away. A point on the cone at angle t round the axis and
 * distance r from it is (r cos t, r sin t, ±r).
 */
function cut(m: number) {
  const runs: { points: Pt3[]; seen: boolean }[] = [];
  for (const half of [1, -1]) {
    let run: { points: Pt3[]; seen: boolean } | undefined;
    const steps = 720;
    for (let i = 0; i <= steps; i++) {
      const t = -Math.PI + (2 * Math.PI * i) / steps;
      // on the upper half z = r, so r = mr cos t + 1; on the lower half z = −r, so −r = mr cos t + 1
      const r =
        half === 1 ? 1 / (1 - m * Math.cos(t)) : -1 / (1 + m * Math.cos(t));
      const ok = r > 0 && r <= H;
      // the cone faces us where its outward direction (cos t, sin t, ∓1) points towards the eye
      const facing = Math.sin(TURN - t);
      const seen =
        half === 1 ? facing > Math.tan(TILT) : facing > -Math.tan(TILT);
      if (!ok) {
        run = undefined;
        continue;
      }
      const p: Pt3 = [r * Math.cos(t), r * Math.sin(t), half * r];
      if (!run || run.seen !== seen) {
        // start a new run, sharing the last point so the curve has no gap
        const last = run?.points[run.points.length - 1];
        run = { points: last ? [last] : [], seen };
        runs.push(run);
      }
      run.points.push(p);
    }
  }
  return runs;
}

function Panel({
  cx,
  m,
  from,
  to,
  name,
  steepness,
  plane,
  side,
}: {
  cx: number;
  /** half the width of the drawn piece of the plane, along y */
  side: number;
  m: number;
  /** the stretch of x the drawn piece of the plane covers */
  from: number;
  to: number;
  name: string;
  steepness: string;
  plane: string;
}) {
  const p = at(cx);
  const tan = Math.tan(TILT);
  // where the outline of each half touches its rim, measured round from the direction we look
  // along: sin s = −tan(tilt) above, +tan(tilt) below
  const up = TURN + Math.asin(-tan);
  const down = TURN + Math.asin(tan);
  const tip = p([0, 0, 0]);
  const upper = [tip, ...rim(cx, H, up, up + Math.PI - 2 * Math.asin(-tan))];
  const lower = [
    tip,
    ...rim(cx, -H, down, down - Math.PI - 2 * Math.asin(tan)),
  ];
  const corners: Pt3[] = [
    [from, -side, m * from + 1],
    [to, -side, m * to + 1],
    [to, side, m * to + 1],
    [from, side, m * from + 1],
  ];

  return (
    <g>
      {/* the two halves of the cone, light like a torch beam */}
      <polygon
        points={join(lower)}
        fill={LIGHT}
        fillOpacity={0.45}
        stroke={LIGHT_EDGE}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <polyline
        points={join(rim(cx, -H, down, down + Math.PI - 2 * Math.asin(tan)))}
        fill="none"
        stroke={LIGHT_EDGE}
        strokeWidth={1.25}
        strokeDasharray="4 4"
      />
      <polygon
        points={join(upper)}
        fill={LIGHT}
        fillOpacity={0.45}
        stroke={LIGHT_EDGE}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <polygon
        points={join(rim(cx, H, 0, 2 * Math.PI))}
        fill={LIGHT}
        fillOpacity={0.6}
        stroke={LIGHT_EDGE}
        strokeWidth={1.5}
      />

      {/* the slicing plane, see-through */}
      <polygon
        points={join(corners.map(p))}
        fill={STEEL}
        fillOpacity={0.2}
        stroke={STEEL}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />

      {/* the cut: dashed where it runs round the back of the cone */}
      {cut(m).map((run, i) => (
        <polyline
          key={i}
          points={join(run.points.map(p))}
          fill="none"
          stroke={PURPLE}
          strokeWidth={run.seen ? 3.5 : 2}
          strokeDasharray={run.seen ? undefined : "5 4"}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}

      <Words x={cx} y={312} size={17} color={PURPLE}>
        {name}
      </Words>
      <Words x={cx} y={334} size={14}>
        {plane}
      </Words>
      <Words x={cx} y={354} size={13} color="var(--color-fd-muted-foreground)">
        {steepness}
      </Words>
    </g>
  );
}

/**
 * Three copies of the double cone side by side, each cut by one tilted plane: less steep than the
 * cone's side (an ellipse), as steep (a parabola) and steeper (a hyperbola, one branch on each half).
 */
export function ConeSlices({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <Svg
        width={PANEL * 3}
        height={366}
        label="Three copies of a double cone, two cones meeting tip to tip, each cut by a see-through tilted plane. On the left the plane z = x/2 + 1 is less steep than the side of the cone and cuts the upper half in a closed oval, an ellipse. In the middle the plane z = x + 1 is as steep as the side and cuts the upper half in a curve that runs off the top, a parabola. On the right the plane z = 2x + 1 is steeper than the side and cuts both halves, in the two branches of a hyperbola."
      >
        <Panel
          cx={PANEL / 2}
          m={0.5}
          from={-1.4}
          to={2.5}
          side={1.7}
          name="an ellipse"
          plane="z = x/2 + 1"
          steepness="less steep than the side"
        />
        <Panel
          cx={PANEL * 1.5}
          m={1}
          from={-1.3}
          to={1.5}
          side={2.2}
          name="a parabola"
          plane="z = x + 1"
          steepness="as steep as the side"
        />
        <Panel
          cx={PANEL * 2.5}
          m={2}
          from={-1.75}
          to={0.75}
          side={2.4}
          name="a hyperbola"
          plane="z = 2x + 1"
          steepness="steeper than the side"
        />
      </Svg>
    </Figure>
  );
}
