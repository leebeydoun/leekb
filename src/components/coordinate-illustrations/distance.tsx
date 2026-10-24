import { Figure } from "../figure";
import { BLUE, ORANGE, Svg, Words } from "../illustrations";

/**
 * Pictures for The distance between two points guide: a city of square blocks seen from above. A
 * taxi follows the streets 3 blocks east and 4 blocks north, 7 blocks in all, while a drone flies
 * straight over the rooftops and covers 5.
 */

const ROOF = "#9ca3af";
const ROOF_EDGE = "#6b7280";
const STREET = 14;

const UNIT = 62;
const LEFT = 56;
const BOTTOM = 330;

// the pixel position of the street corner (i, j): i blocks east and j blocks north of the start
const X = (i: number) => LEFT + i * UNIT;
const Y = (j: number) => BOTTOM - j * UNIT;

/** a drone seen from above: a body and four rotors */
function Drone({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].map(([a, b]) => (
        <g key={`${a}${b}`}>
          <line
            x1={x}
            y1={y}
            x2={x + a! * 11}
            y2={y + b! * 11}
            stroke="#374151"
            strokeWidth={3}
          />
          <circle
            cx={x + a! * 11}
            cy={y + b! * 11}
            r={6}
            fill="#e5e7eb"
            stroke="#374151"
            strokeWidth={1.5}
          />
        </g>
      ))}
      <rect x={x - 6} y={y - 6} width={12} height={12} rx={3} fill={BLUE} />
    </g>
  );
}

/**
 * The street grid with the start corner at the bottom left and the café 3 blocks east and 4 blocks
 * north. The taxi's route goes along the streets (orange); the drone's goes straight (blue).
 */
export function DroneAndTaxi({ caption }: { caption?: string }) {
  const width = X(5) + 20;
  const height = BOTTOM + 40;
  const blocks: [number, number][] = [];
  for (let i = -1; i < 5; i++) for (let j = -1; j < 5; j++) blocks.push([i, j]);

  return (
    <Figure caption={caption}>
      <Svg
        width={width}
        height={height}
        label="A city of square blocks seen from above. A taxi goes 3 blocks east along one street and then 4 blocks north along another, 7 blocks in all. A drone flies in a straight line from the same corner to the café and covers 5 blocks."
      >
        <defs>
          <clipPath id="drone-taxi-city">
            <rect
              x={X(-0.5)}
              y={Y(4.6)}
              width={X(4.6) - X(-0.5)}
              height={Y(-0.5) - Y(4.6)}
              rx={8}
            />
          </clipPath>
        </defs>

        {/* the blocks, with streets between them */}
        <g clipPath="url(#drone-taxi-city)">
          {blocks.map(([i, j]) => (
            <rect
              key={`${i},${j}`}
              x={X(i) + STREET / 2}
              y={Y(j + 1) + STREET / 2}
              width={UNIT - STREET}
              height={UNIT - STREET}
              rx={4}
              fill={ROOF}
              fillOpacity={0.55}
              stroke={ROOF_EDGE}
              strokeWidth={1}
            />
          ))}
        </g>

        {/* the taxi's route along the streets */}
        <polyline
          points={`${X(0)},${Y(0)} ${X(3)},${Y(0)} ${X(3)},${Y(4)}`}
          fill="none"
          stroke={ORANGE}
          strokeWidth={5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* the drone's straight flight */}
        <line
          x1={X(0)}
          y1={Y(0)}
          x2={X(3)}
          y2={Y(4)}
          stroke={BLUE}
          strokeWidth={4}
          strokeDasharray="10 7"
          strokeLinecap="round"
        />
        <Drone x={X(1.5)} y={Y(2)} />

        {/* the two ends */}
        <circle cx={X(0)} cy={Y(0)} r={7} fill="currentColor" />
        <circle cx={X(3)} cy={Y(4)} r={7} fill="currentColor" />
        <Words x={X(0) - 4} y={Y(0) + 28} anchor="start">
          start
        </Words>
        <Words x={X(3) + 12} y={Y(4) - 10} anchor="start">
          café
        </Words>

        <Words x={X(1.5)} y={Y(0) + 28} color={ORANGE}>
          taxi: 3 east
        </Words>
        <Words x={X(3) + 10} y={Y(1.6)} anchor="start" color={ORANGE}>
          then 4 north
        </Words>
        <Words x={X(0.55)} y={Y(2.35)} anchor="middle" color={BLUE}>
          drone: 5
        </Words>
      </Svg>
    </Figure>
  );
}
