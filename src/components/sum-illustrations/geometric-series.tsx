import { Figure } from "../figure";
import { GREEN, MUTED, Plot, Spot } from "../function-illustrations/plot";
import { BLUE, ORANGE, Svg, Words } from "../illustrations";

/**
 * Pictures for the guide Geometric series: a ball dropped from 2 metres whose bounces each rise to
 * three quarters of the height before, a walk to a wall in strides of two thirds of the distance
 * left, and a daily medicine dose building up towards a steady level.
 */

const BALL = "#d9f99d";
const BALL_EDGE = "#65a30d";
const BRICK = "#c2410c";

/**
 * The opening scene: a ball dropped from 2 m, drawn moving steadily to the right so that the
 * bounces sit side by side. Each bounce rises to three quarters of the height before it, and the
 * width of each arc follows the time it takes, which goes with the square root of its height.
 */
export function BouncingBall({ caption }: { caption?: string }) {
  const floor = 250;
  const metre = 100;
  const left = 50;
  // pixels across per unit of √(height in metres)
  const u = 25;
  const drop = 2;
  const heights = Array.from({ length: 16 }, (_, k) => drop * 0.75 ** (k + 1));

  // the drop: half a parabola from the top down to the floor
  let x = left;
  const pts: string[] = [];
  const half = u * Math.sqrt(drop);
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    pts.push(
      `${(x + half * t).toFixed(1)},${(floor - metre * drop * (1 - t * t)).toFixed(1)}`,
    );
  }
  x += half;
  // each bounce: a whole parabola, up to its height and back down
  const apexes: { x: number; h: number }[] = [];
  for (const h of heights) {
    const w = 2 * u * Math.sqrt(h);
    for (let i = 1; i <= 30; i++) {
      const t = i / 30;
      const y = floor - metre * h * (1 - (2 * t - 1) ** 2);
      pts.push(`${(x + w * t).toFixed(1)},${y.toFixed(1)}`);
    }
    apexes.push({ x: x + w / 2, h });
    x += w;
  }
  const labels = ["1.5 m", "1.125 m", "0.84 m", "0.63 m"];

  return (
    <Figure caption={caption}>
      <Svg
        width={560}
        height={290}
        label="A tennis ball at the top left, 2 metres above a floor, and the path it follows as it falls and bounces, moving steadily to the right. The first bounce rises to 1.5 metres, the next to 1.125 metres, then about 0.84 and 0.63 metres, and the bounces keep getting lower and narrower until they are too small to see."
      >
        {/* the floor */}
        <line
          x1={20}
          x2={540}
          y1={floor + 1.5}
          y2={floor + 1.5}
          stroke="currentColor"
          strokeWidth={3}
        />
        {/* a scale up the side, in metres */}
        <g stroke={MUTED} strokeWidth={1.5}>
          <line x1={24} x2={24} y1={floor} y2={floor - metre * drop} />
          {[0, 1, 2].map((m) => (
            <line
              key={m}
              x1={18}
              x2={30}
              y1={floor - metre * m}
              y2={floor - metre * m}
            />
          ))}
        </g>
        <Words x={36} y={floor - metre + 5} anchor="start" size={13}>
          1 m
        </Words>
        {/* the path */}
        <polyline
          points={pts.join(" ")}
          fill="none"
          stroke={BLUE}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        {/* the height of each of the first few bounces */}
        {apexes.slice(0, 4).map(({ x: ax, h }, i) => (
          <g key={i}>
            <line
              x1={ax}
              x2={ax}
              y1={floor - metre * h + 4}
              y2={floor}
              stroke={ORANGE}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
            <Words x={ax} y={floor - metre * h - 10} color={ORANGE} size={13}>
              {labels[i]}
            </Words>
          </g>
        ))}
        {/* the ball, where it was dropped */}
        <circle
          cx={left}
          cy={floor - metre * drop - 11}
          r={11}
          fill={BALL}
          stroke={BALL_EDGE}
          strokeWidth={2.5}
        />
        <path
          d={`M${left - 9},${floor - metre * drop - 17} Q${left},${floor - metre * drop - 9} ${left + 9},${floor - metre * drop - 17}`}
          fill="none"
          stroke={BALL_EDGE}
          strokeWidth={1.5}
        />
        <Words
          x={left + 20}
          y={floor - metre * drop - 6}
          anchor="start"
          size={14}
        >
          dropped from 2 m
        </Words>
      </Svg>
    </Figure>
  );
}

/**
 * Walking 9 m to a wall, each stride two thirds of the distance left: 6 m, 2 m, 2/3 m and so on,
 * drawn as hops along the ground, with the distance still to go marked under the first two.
 */
export function ZenoWalk({ caption }: { caption?: string }) {
  const ground = 160;
  const start = 52;
  const metre = 50;
  const wall = start + 9 * metre;
  const ends: number[] = [];
  let left = 9;
  let at = 0;
  for (let k = 0; k < 8; k++) {
    at += (2 / 3) * left;
    left /= 3;
    ends.push(at);
  }
  const strideLabels = ["6 m", "2 m", "⅔ m"];

  return (
    <Figure caption={caption}>
      <Svg
        width={560}
        height={220}
        label="A person standing on the ground at the left, 9 metres from a brick wall at the right. Arcs along the ground show the strides: the first, 6 metres long, ends 3 metres from the wall; the second, 2 metres, ends 1 metre from the wall; then strides of two thirds of a metre and less, crowding up against the wall."
      >
        <line
          x1={20}
          x2={wall}
          y1={ground}
          y2={ground}
          stroke="currentColor"
          strokeWidth={3}
        />
        {/* the wall */}
        <g stroke={BRICK} strokeWidth={2}>
          <rect
            x={wall}
            y={ground - 120}
            width={24}
            height={120}
            fill={BRICK}
            fillOpacity={0.25}
          />
          {[1, 2, 3, 4, 5].map((r) => (
            <line
              key={r}
              x1={wall}
              x2={wall + 24}
              y1={ground - 20 * r}
              y2={ground - 20 * r}
            />
          ))}
        </g>
        {/* the walker */}
        <g
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
        >
          <circle cx={start} cy={ground - 62} r={9} />
          <line x1={start} x2={start} y1={ground - 53} y2={ground - 24} />
          <line x1={start} x2={start - 9} y1={ground - 24} y2={ground} />
          <line x1={start} x2={start + 9} y1={ground - 24} y2={ground} />
          <line x1={start} x2={start - 11} y1={ground - 45} y2={ground - 32} />
          <line x1={start} x2={start + 11} y1={ground - 45} y2={ground - 32} />
        </g>
        {/* the strides */}
        {ends.map((e, k) => {
          const a = start + (k === 0 ? 0 : ends[k - 1]!) * metre;
          const b = start + e * metre;
          const h = Math.min(70, 8 + (b - a) * 0.2);
          return (
            <path
              key={k}
              d={`M${a.toFixed(1)},${ground - 2} Q${((a + b) / 2).toFixed(1)},${(ground - 2 - 2 * h).toFixed(1)} ${b.toFixed(1)},${ground - 2}`}
              fill="none"
              stroke={k % 2 ? ORANGE : BLUE}
              strokeWidth={2.5}
            />
          );
        })}
        {strideLabels.map((t, k) => {
          const a = start + (k === 0 ? 0 : ends[k - 1]!) * metre;
          const b = start + ends[k]! * metre;
          const h = Math.min(70, 8 + (b - a) * 0.2);
          return (
            <Words
              key={t}
              x={(a + b) / 2}
              y={ground - h - 8}
              color={k % 2 ? ORANGE : BLUE}
              size={13}
            >
              {t}
            </Words>
          );
        })}
        {/* the distance still to go after the first two strides */}
        {[0, 1].map((k) => (
          <g key={k}>
            <line
              x1={start + ends[k]! * metre}
              x2={start + ends[k]! * metre}
              y1={ground}
              y2={ground + 10}
              stroke="currentColor"
              strokeWidth={2}
            />
            <Words x={start + ends[k]! * metre} y={ground + 28} size={13}>
              {k === 0 ? "3 m to go" : "1 m to go"}
            </Words>
          </g>
        ))}
        <Words x={start} y={ground + 28} size={13}>
          9 m to go
        </Words>
      </Svg>
    </Figure>
  );
}

/**
 * The amount of a medicine in the body over six days: 100 mg is taken each morning, and by the
 * next morning a fifth of what was there is left. The peaks are 100, 120, 124, 124.8, … mg,
 * settling towards the dashed level of 125 mg.
 */
export function DoseBuildUp({ caption }: { caption?: string }) {
  const days = 6;
  const peaks = Array.from(
    { length: days },
    (_, k) => 125 * (1 - 0.2 ** (k + 1)),
  );
  const points: [number, number][] = [[0, 0]];
  peaks.forEach((p, k) => {
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      points.push([k + t, p * 0.2 ** t]);
    }
  });

  return (
    <Figure caption={caption}>
      <Plot
        id="dose-build-up"
        x={[0, days]}
        y={[0, 140]}
        unit={80}
        unitY={2}
        stepY={20}
        everyY={20}
        curves={[{ points, color: BLUE }]}
        label="A graph with days from 0 to 6 across and milligrams of medicine from 0 to 140 up. The amount jumps up by 100 mg each morning and then falls through the day to a fifth of its value. The peaks, marked with dots, are 100, 120, 124, 124.8, 124.96 and 124.99 mg, closing in on a dashed green line at 125 mg."
      >
        {({ px, py }) => (
          <>
            <line
              x1={px(0)}
              x2={px(days)}
              y1={py(125)}
              y2={py(125)}
              stroke={GREEN}
              strokeWidth={2}
              strokeDasharray="6 5"
            />
            <Words
              x={px(days) - 4}
              y={py(125) - 8}
              anchor="end"
              color={GREEN}
              size={13}
            >
              125 mg
            </Words>
            {peaks.map((p, k) => (
              <Spot key={k} x={px(k)} y={py(p)} color={BLUE} />
            ))}
            {[0, 1, 2].map((k) => (
              <Words
                key={k}
                x={px(k) + 10}
                y={py(peaks[k]!) + 17}
                anchor="start"
                size={13}
              >
                {`${Number(peaks[k]!.toFixed(1))} mg`}
              </Words>
            ))}
          </>
        )}
      </Plot>
    </Figure>
  );
}
