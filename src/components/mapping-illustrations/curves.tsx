import { Figure } from "../figure";
import { BLUE, ORANGE, PURPLE, Svg, Words } from "../illustrations";
import { GREEN, MUTED, Plot, Spot } from "../function-illustrations/plot";

/**
 * Pictures for the guide Curves traced by mappings. A long-exposure photo of a sparkler beside the
 * same path logged with times, the curve t ↦ (t², t³) with its sharp point, a ball thrown from a
 * cliff with a dot every half second, and the polar map sending a grid of lines onto circles and
 * lines through O. Every grid uses one scale across and up, so each curve has its true shape.
 */

const NIGHT = "#111827";
const SPARK = "#fde68a";
const GLOW = "#f59e0b";
const ROCK = "#a8a29e";
const ROCK_EDGE = "#78716c";

/**
 * The opening scene: on the left, a dark photo with the glowing figure-eight a sparkler left; on
 * the right, the same figure-eight with the place marked every second, from 0 s to 7 s. The middle
 * of the eight is passed twice, at 0 s and at 4 s.
 */
export function SparklerTrail({ caption }: { caption?: string }) {
  const w = 270;
  const h = 200;
  const gap = 20;
  // the path in pixels about the centre of a panel: (sin t, sin 2t), t from 0 to 2π
  const at = (cx: number, cy: number, t: number) => ({
    x: cx + 92 * Math.sin(t),
    y: cy - 58 * Math.sin(2 * t),
  });
  const path = (cx: number, cy: number) =>
    Array.from({ length: 241 }, (_, i) => {
      const p = at(cx, cy, (2 * Math.PI * i) / 240);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(" ");
  const left = { cx: w / 2, cy: h / 2 + 6 };
  const right = { cx: w + gap + w / 2, cy: h / 2 + 6 };
  // where each time label sits, as an offset from its dot
  const offsets: [number, number, "start" | "middle" | "end"][] = [
    [0, 0, "middle"],
    [8, -12, "start"],
    [12, 5, "start"],
    [8, 22, "start"],
    [0, 0, "middle"],
    [-8, -12, "end"],
    [-12, 5, "end"],
    [-8, 22, "end"],
  ];

  return (
    <Figure caption={caption}>
      <Svg
        width={2 * w + gap}
        height={h + 44}
        label="Two panels. On the left, a dark photograph with a glowing figure-eight drawn by a sparkler, and the sparkler itself at the middle of the eight: the photo shows only the shape. On the right, the same figure-eight drawn on a light background with a dot at each second, labelled 0 s to 7 s, going up and right first, round the right loop, back through the middle at 4 s, and round the left loop. The middle of the eight carries two times, 0 s and 4 s."
      >
        {/* the photo */}
        <rect x={0} y={10} width={w} height={h} rx={10} fill={NIGHT} />
        <polyline
          points={path(left.cx, left.cy)}
          fill="none"
          stroke={GLOW}
          strokeOpacity={0.35}
          strokeWidth={10}
          strokeLinejoin="round"
        />
        <polyline
          points={path(left.cx, left.cy)}
          fill="none"
          stroke={SPARK}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        {/* the sparkler: a stick held from below, with a bright head at the middle of the eight */}
        <line
          x1={left.cx}
          y1={left.cy}
          x2={left.cx + 40}
          y2={h + 6}
          stroke={ROCK}
          strokeWidth={3}
          strokeLinecap="round"
        />
        {Array.from({ length: 8 }, (_, k) => {
          const a = (k * Math.PI) / 4 + 0.3;
          return (
            <line
              key={k}
              x1={left.cx}
              y1={left.cy}
              x2={left.cx + 13 * Math.cos(a)}
              y2={left.cy + 13 * Math.sin(a)}
              stroke={SPARK}
              strokeWidth={2}
              strokeLinecap="round"
            />
          );
        })}
        <circle cx={left.cx} cy={left.cy} r={5} fill="#fff" />
        <Words x={left.cx} y={h + 36} size={14}>
          the photo: a shape
        </Words>

        {/* the log */}
        <rect
          x={w + gap}
          y={10}
          width={w}
          height={h}
          rx={10}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.4}
        />
        <polyline
          points={path(right.cx, right.cy)}
          fill="none"
          stroke={BLUE}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        {offsets.map(([dx, dy, anchor], k) => {
          const p = at(right.cx, right.cy, (k * Math.PI) / 4);
          return (
            <g key={k}>
              <Spot x={p.x} y={p.y} color={ORANGE} />
              {k !== 0 && k !== 4 && (
                <Words
                  x={p.x + dx}
                  y={p.y + dy}
                  anchor={anchor}
                  size={13}
                  color={ORANGE}
                >
                  {k} s
                </Words>
              )}
            </g>
          );
        })}
        <Words x={right.cx} y={right.cy - 46} size={13} color={ORANGE}>
          0 s and 4 s
        </Words>
        <Words x={right.cx} y={h + 36} size={14}>
          the log: a place at each time
        </Words>
      </Svg>
    </Figure>
  );
}

/**
 * The curve t ↦ (t², t³) for t from −1.6 to 1.6, with dots at t = ±1.5, ±1, ±0.5 and 0. The lower
 * branch is traced first, coming in to the origin, and the upper branch after, going out again.
 */
export function CuspCurve({ caption }: { caption?: string }) {
  const points = Array.from({ length: 241 }, (_, i) => {
    const t = -1.6 + (3.2 * i) / 240;
    return [t * t, t * t * t] as const;
  });
  const marks: [number, number, number, "start" | "end"][] = [
    [-1.5, -10, 4, "end"],
    [-1, 10, 6, "start"],
    // the three labels near O sit left of the y-axis, clear of the axis line
    [-0.5, -20, 26, "end"],
    [0, -9, -6, "end"],
    [0.5, -20, -22, "end"],
    [1, 10, 2, "start"],
    [1.5, -10, 4, "end"],
  ];
  const name = (t: number) => (t < 0 ? `t = −${-t}` : `t = ${t}`);
  return (
    <Figure caption={caption}>
      <Plot
        id="cusp-curve"
        x={[-1.5, 3]}
        y={[-3.5, 3.5]}
        unit={46}
        curves={[{ points, color: BLUE }]}
        label="The curve traced by t ↦ (t², t³) for t from −1.6 to 1.6, on a square grid. It comes in from the lower right, below the x-axis, to a sharp point at the origin, and leaves again above the x-axis, to the upper right, mirroring the lower half in the x-axis. Dots mark t = −1.5 at (2.25, −3.375), t = −1 at (1, −1), t = −0.5 at (0.25, −0.125), t = 0 at the origin, t = 0.5 at (0.25, 0.125), t = 1 at (1, 1) and t = 1.5 at (2.25, 3.375)."
      >
        {({ px, py }) => (
          <>
            {marks.map(([t, dx, dy, anchor]) => (
              <g key={t}>
                <Spot x={px(t * t)} y={py(t * t * t)} color={ORANGE} />
                <Words
                  x={px(t * t) + dx}
                  y={py(t * t * t) + dy}
                  anchor={anchor}
                  size={13}
                  color={ORANGE}
                >
                  {name(t)}
                </Words>
              </g>
            ))}
          </>
        )}
      </Plot>
    </Figure>
  );
}

/**
 * A ball thrown level from the top of a 20 m cliff at 6 m/s: the path (6t, 20 − 4.9t²) from t = 0
 * until it lands at about t = 2.02, with a dot every half second and the half-height point marked.
 */
export function CliffBall({ caption }: { caption?: string }) {
  const land = Math.sqrt(20 / 4.9);
  const half = Math.sqrt(10 / 4.9);
  const ball = (t: number) => [6 * t, 20 - 4.9 * t * t] as const;
  const points = Array.from({ length: 121 }, (_, i) => ball((land * i) / 120));
  return (
    <Figure caption={caption}>
      <Plot
        id="cliff-ball"
        x={[-3, 15]}
        y={[0, 22]}
        unit={17}
        step={2}
        every={4}
        everyY={6}
        curves={[{ points, color: BLUE }]}
        label="A grid in metres with a cliff 20 m high standing to the left of the y-axis. A ball leaves the top of the cliff level, at (0, 20), and curves down to land on the ground at about (12.1, 0). Dots mark the ball every half second: (0, 20) at 0 s, (3, 18.8) at 0.5 s, (6, 15.1) at 1 s, (9, 9.0) at 1.5 s and (12, 0.4) at 2 s; the dots get further apart as the ball speeds up downwards. A dashed line at height 10 meets the path at about (8.6, 10), after about 1.43 s."
      >
        {({ px, py }) => (
          <>
            {/* the cliff */}
            <rect
              x={px(-3)}
              y={py(20)}
              width={px(0) - px(-3)}
              height={py(0) - py(20)}
              fill={ROCK}
              fillOpacity={0.5}
              stroke={ROCK_EDGE}
              strokeWidth={2}
            />
            <line
              x1={px(-3)}
              x2={px(15)}
              y1={py(0)}
              y2={py(0)}
              stroke={GREEN}
              strokeWidth={3}
            />
            <line
              x1={px(0)}
              x2={px(15)}
              y1={py(10)}
              y2={py(10)}
              stroke={PURPLE}
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
            <Spot x={px(6 * half)} y={py(10)} color={PURPLE} />
            <Words
              x={px(6 * half) + 10}
              y={py(10) - 10}
              anchor="start"
              size={13}
              color={PURPLE}
            >
              half height, 1.43 s
            </Words>
            {[0, 0.5, 1, 1.5, 2].map((t) => {
              const [x, y] = ball(t);
              return (
                <g key={t}>
                  <Spot x={px(x)} y={py(y)} color={ORANGE} />
                  {t > 0 && t < 2 && (
                    <Words
                      x={px(x) + (t === 1.5 ? -9 : 9)}
                      y={py(y) + (t === 1.5 ? 5 : -8)}
                      anchor={t === 1.5 ? "end" : "start"}
                      size={13}
                      color={ORANGE}
                    >
                      {t} s
                    </Words>
                  )}
                </g>
              );
            })}
            <Words
              x={px(0) + 8}
              y={py(20) - 9}
              anchor="start"
              size={13}
              color={ORANGE}
            >
              0 s
            </Words>
            <Words
              x={px(12) - 8}
              y={py(0.4) - 10}
              anchor="end"
              size={13}
              color={ORANGE}
            >
              2 s
            </Words>
            <Spot x={px(6 * land)} y={py(0)} color={BLUE} />
          </>
        )}
      </Plot>
    </Figure>
  );
}

/**
 * The polar map P(r, θ) = (r cos θ, r sin θ). Left: the plane of pairs (r, θ), with the vertical
 * line r = 2.5 (blue), the horizontal line θ = π/4 (orange) and the rectangle 1 ≤ r ≤ 2,
 * π/2 ≤ θ ≤ π (purple). Right: their images, the circle of radius 2.5, the line y = x through O
 * and a quarter of the ring between radii 1 and 2.
 */
export function PolarMapPicture({ caption }: { caption?: string }) {
  const u = 40;
  // the (r, θ) panel: r from −3 to 3 across, θ from −3.4 to 3.4 up
  const L = { x0: 30, top: 30 };
  const lx = (r: number) => L.x0 + (r + 3) * u;
  const ly = (th: number) => L.top + (3.4 - th) * u;
  // the plane panel: x and y from −3 to 3
  const R = { x0: 380, top: 46 };
  const rx = (x: number) => R.x0 + (x + 3) * u;
  const ry = (y: number) => R.top + (3 - y) * u;
  const PI = Math.PI;

  // the quarter ring, as a path
  const ring = (() => {
    const pt = (r: number, th: number) =>
      `${rx(r * Math.cos(th)).toFixed(1)} ${ry(r * Math.sin(th)).toFixed(1)}`;
    return `M ${pt(1, PI / 2)} L ${pt(2, PI / 2)} A ${2 * u} ${2 * u} 0 0 0 ${pt(2, PI)} L ${pt(1, PI)} A ${u} ${u} 0 0 1 ${pt(1, PI / 2)} Z`;
  })();
  const d = 3 / Math.SQRT2;

  const thetaMarks: [number, string][] = [
    [-PI, "−π"],
    [-PI / 2, "−π/2"],
    [PI / 2, "π/2"],
    [PI, "π"],
  ];

  const drawing = (
    <>
      {/* left panel: light grid */}
      <g className="text-fd-border" stroke="currentColor" strokeWidth={1}>
        {[-3, -2, -1, 0, 1, 2, 3].map((r) => (
          <line key={r} x1={lx(r)} x2={lx(r)} y1={ly(-3.4)} y2={ly(3.4)} />
        ))}
        {thetaMarks.map(([th]) => (
          <line key={th} x1={lx(-3)} x2={lx(3)} y1={ly(th)} y2={ly(th)} />
        ))}
      </g>
      <g stroke="currentColor" strokeWidth={1.5}>
        <line x1={lx(-3)} x2={lx(3) + 10} y1={ly(0)} y2={ly(0)} />
        <line x1={lx(0)} x2={lx(0)} y1={ly(-3.4)} y2={ly(3.4) - 10} />
      </g>
      <polygon
        fill="currentColor"
        points={`${lx(3) + 14},${ly(0)} ${lx(3) + 6},${ly(0) - 4} ${lx(3) + 6},${ly(0) + 4}`}
      />
      <polygon
        fill="currentColor"
        points={`${lx(0)},${ly(3.4) - 14} ${lx(0) - 4},${ly(3.4) - 6} ${lx(0) + 4},${ly(3.4) - 6}`}
      />
      <text
        x={lx(3) + 6}
        y={ly(0) - 9}
        fontSize={14}
        fontStyle="italic"
        fill="currentColor"
      >
        r
      </text>
      <text
        x={lx(0) + 9}
        y={ly(3.4) - 6}
        fontSize={14}
        fontStyle="italic"
        fill="currentColor"
      >
        θ
      </text>
      <g
        fontSize={11}
        className="fill-fd-muted-foreground"
        stroke="var(--color-fd-card)"
        strokeWidth={3}
        paintOrder="stroke"
      >
        {[-3, -2, -1, 1, 2, 3].map((r) => (
          <text key={r} x={lx(r)} y={ly(0) + 15} textAnchor="middle">
            {r < 0 ? `−${-r}` : r}
          </text>
        ))}
        {thetaMarks.map(([th, name]) => (
          <text key={th} x={lx(0) - 6} y={ly(th) + 4} textAnchor="end">
            {name}
          </text>
        ))}
      </g>
      <rect
        x={lx(1)}
        y={ly(PI)}
        width={u}
        height={ly(PI / 2) - ly(PI)}
        fill={PURPLE}
        fillOpacity={0.3}
        stroke={PURPLE}
        strokeWidth={2.5}
      />
      <line
        x1={lx(2.5)}
        x2={lx(2.5)}
        y1={ly(-3.4)}
        y2={ly(3.4)}
        stroke={BLUE}
        strokeWidth={3}
      />
      <line
        x1={lx(-3)}
        x2={lx(3)}
        y1={ly(PI / 4)}
        y2={ly(PI / 4)}
        stroke={ORANGE}
        strokeWidth={3}
      />
      <Words x={lx(2.5) - 6} y={ly(-2.6)} anchor="end" size={13} color={BLUE}>
        r = 2.5
      </Words>
      <Words
        x={lx(-2.9)}
        y={ly(PI / 4) - 8}
        anchor="start"
        size={13}
        color={ORANGE}
      >
        θ = π/4
      </Words>

      {/* the arrow between the panels */}
      <line
        x1={316}
        x2={352}
        y1={170}
        y2={170}
        stroke="currentColor"
        strokeWidth={2.5}
      />
      <polygon points="362,170 350,164 350,176" fill="currentColor" />
      <Words x={337} y={158} size={16}>
        P
      </Words>

      {/* right panel: light grid */}
      <g className="text-fd-border" stroke="currentColor" strokeWidth={1}>
        {[-3, -2, -1, 0, 1, 2, 3].map((n) => (
          <g key={n}>
            <line x1={rx(n)} x2={rx(n)} y1={ry(-3)} y2={ry(3)} />
            <line x1={rx(-3)} x2={rx(3)} y1={ry(n)} y2={ry(n)} />
          </g>
        ))}
      </g>
      <g stroke="currentColor" strokeWidth={1.5}>
        <line x1={rx(-3)} x2={rx(3) + 10} y1={ry(0)} y2={ry(0)} />
        <line x1={rx(0)} x2={rx(0)} y1={ry(-3)} y2={ry(3) - 10} />
      </g>
      <polygon
        fill="currentColor"
        points={`${rx(3) + 14},${ry(0)} ${rx(3) + 6},${ry(0) - 4} ${rx(3) + 6},${ry(0) + 4}`}
      />
      <polygon
        fill="currentColor"
        points={`${rx(0)},${ry(3) - 14} ${rx(0) - 4},${ry(3) - 6} ${rx(0) + 4},${ry(3) - 6}`}
      />
      <text
        x={rx(3) + 6}
        y={ry(0) - 9}
        fontSize={14}
        fontStyle="italic"
        fill="currentColor"
      >
        x
      </text>
      <text
        x={rx(0) + 9}
        y={ry(3) - 6}
        fontSize={14}
        fontStyle="italic"
        fill="currentColor"
      >
        y
      </text>
      <g
        fontSize={11}
        className="fill-fd-muted-foreground"
        stroke="var(--color-fd-card)"
        strokeWidth={3}
        paintOrder="stroke"
      >
        {[-3, -2, -1, 1, 2, 3].map((n) => (
          <g key={n}>
            <text x={rx(n)} y={ry(0) + 15} textAnchor="middle">
              {n < 0 ? `−${-n}` : n}
            </text>
            <text x={rx(0) - 6} y={ry(n) + 4} textAnchor="end">
              {n < 0 ? `−${-n}` : n}
            </text>
          </g>
        ))}
      </g>
      <path
        d={ring}
        fill={PURPLE}
        fillOpacity={0.3}
        stroke={PURPLE}
        strokeWidth={2.5}
      />
      <circle
        cx={rx(0)}
        cy={ry(0)}
        r={2.5 * u}
        fill="none"
        stroke={BLUE}
        strokeWidth={3}
      />
      <line
        x1={rx(-d)}
        y1={ry(-d)}
        x2={rx(d)}
        y2={ry(d)}
        stroke={ORANGE}
        strokeWidth={3}
      />
      <Words x={rx(1.6)} y={ry(-2.75)} anchor="start" size={13} color={BLUE}>
        radius 2.5
      </Words>
      <Words x={rx(2.2)} y={ry(2.25)} anchor="end" size={13} color={ORANGE}>
        y = x
      </Words>
      <circle cx={rx(0)} cy={ry(0)} r={3} fill={MUTED} />
    </>
  );
  const label =
    "Two panels joined by an arrow labelled P. The left panel is the plane of pairs (r, θ), with r across from −3 to 3 and θ up from about −3.4 to 3.4, marked at −π, −π/2, π/2 and π. On it: a blue vertical line at r = 2.5, an orange horizontal line at θ = π/4, and a purple rectangle with r from 1 to 2 and θ from π/2 to π. The right panel is the usual plane, x and y from −3 to 3. On it: the blue circle of radius 2.5 about the origin, the orange line y = x through the origin, and a purple quarter of a ring in the top left quarter, between the circles of radius 1 and 2.";

  // On a wide screen the two panels sit side by side in one picture. On a phone that picture
  // would shrink to about half size, so the same drawing is shown as two pictures, one above the
  // other: the (r, θ) panel, then the arrow P and the plane.
  const panel = (x: number, w: number, text: string) => (
    <svg
      viewBox={`${x} 0 ${w} 330`}
      className="mx-auto block h-auto w-full text-fd-foreground"
      style={{ maxWidth: w }}
      role="img"
      aria-label={text}
    >
      {drawing}
    </svg>
  );
  return (
    <Figure caption={caption}>
      <div className="hidden sm:block">
        <Svg width={640} height={330} label={label}>
          {drawing}
        </Svg>
      </div>
      <div className="grid gap-2 sm:hidden">
        {panel(0, 300, label)}
        {panel(
          306,
          334,
          "The arrow P leads to the plane with the images described above.",
        )}
      </div>
    </Figure>
  );
}
