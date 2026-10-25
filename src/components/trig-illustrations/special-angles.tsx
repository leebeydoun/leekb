import { Figure } from "../figure";
import {
  CARD,
  CARD_EDGE,
  CARD_TWO,
  CARD_TWO_EDGE,
  CardTriangle,
  Corner,
  ORANGE,
  PENCIL,
  PURPLE,
  Svg,
  Words,
  type Pt,
} from "../illustrations";

/**
 * Pictures for the Special angles guide of the Trigonometry chapter: the two set squares, each cut
 * from a shape whose sides are known exactly. Half a square has sides 1, 1 and √2 and angles 45°,
 * 45° and 90°. Half an equilateral triangle of side 2 has sides 1, √3 and 2 and angles 30°, 60° and
 * 90°. The half that is kept is drawn as card, and the half that was cut away is dashed.
 */

/** the arc of an angle at `at`, turning anticlockwise on the page from `from` to `to` (degrees, y up) */
function Arc({
  at,
  r,
  from,
  to,
  color,
}: {
  at: Pt;
  r: number;
  from: number;
  to: number;
  color: string;
}) {
  const point = (deg: number) => {
    const t = (deg * Math.PI) / 180;
    return [at[0] + r * Math.cos(t), at[1] - r * Math.sin(t)] as const;
  };
  const [x1, y1] = point(from);
  const [x2, y2] = point(to);
  return (
    <path
      d={`M ${x1} ${y1} A ${r} ${r} 0 0 0 ${x2} ${y2}`}
      fill="none"
      stroke={color}
      strokeWidth={2.5}
    />
  );
}

/** a label placed out along the middle of an angle's arc */
function ArcLabel({
  at,
  r,
  from,
  to,
  color,
  children,
}: {
  at: Pt;
  r: number;
  from: number;
  to: number;
  color: string;
  children: string;
}) {
  const t = (((from + to) / 2) * Math.PI) / 180;
  return (
    <Words
      x={at[0] + r * Math.cos(t)}
      y={at[1] - r * Math.sin(t) + 5}
      color={color}
      size={16}
    >
      {children}
    </Words>
  );
}

const dashed = {
  fill: "none",
  stroke: PENCIL,
  strokeOpacity: 0.55,
  strokeWidth: 1.5,
  strokeDasharray: "6 5",
};

/**
 * A square of side 1 cut along its diagonal. The lower right half is kept: its legs are 1 and 1, its
 * long side is the diagonal √2, and the angles at the ends of the diagonal are 45°.
 */
export function HalfSquare({ caption }: { caption?: string }) {
  const unit = 170;
  const A: Pt = [70, 205];
  const B: Pt = [A[0] + unit, A[1]];
  const C: Pt = [A[0] + unit, A[1] - unit];
  const D: Pt = [A[0], A[1] - unit];

  return (
    <Figure caption={caption}>
      <Svg
        width={320}
        height={250}
        label="A square of side 1 with its diagonal drawn. The lower right half is shaded: a triangle with two sides of length 1 meeting at a right angle, and the diagonal, of length the square root of 2, opposite the right angle. The angles at the two ends of the diagonal are each marked 45 degrees. The upper left half of the square is dashed."
      >
        <polygon
          points={[A, C, D].map((p) => p.join(",")).join(" ")}
          {...dashed}
        />
        <CardTriangle corners={[A, B, C]} fill={CARD} edge={CARD_EDGE} />
        <Corner at={B} u={[-1, 0]} v={[0, -1]} />

        <Arc at={A} r={42} from={0} to={45} color={ORANGE} />
        <ArcLabel at={A} r={64} from={0} to={45} color={ORANGE}>
          45°
        </ArcLabel>
        <Arc at={C} r={42} from={225} to={270} color={ORANGE} />
        <ArcLabel at={C} r={64} from={225} to={270} color={ORANGE}>
          45°
        </ArcLabel>

        <Words x={(A[0] + B[0]) / 2} y={A[1] + 26} size={17}>
          1
        </Words>
        <Words x={B[0] + 18} y={(B[1] + C[1]) / 2 + 6} size={17}>
          1
        </Words>
        <Words
          x={(A[0] + C[0]) / 2 - 22}
          y={(A[1] + C[1]) / 2 - 10}
          size={17}
          color={PURPLE}
        >
          √2
        </Words>
      </Svg>
    </Figure>
  );
}

/**
 * An equilateral triangle of side 2 cut down the middle, from the top corner to the middle of the
 * base. The right half is kept: its sides are 1 along the base, √3 up the cut and 2 along the slope,
 * with 30° at the top, 60° at the bottom corner and a right angle at the foot of the cut.
 */
export function HalfEquilateral({ caption }: { caption?: string }) {
  const unit = 115;
  const L: Pt = [50, 232];
  const R: Pt = [L[0] + 2 * unit, L[1]];
  const F: Pt = [L[0] + unit, L[1]];
  const T: Pt = [L[0] + unit, L[1] - Math.sqrt(3) * unit];

  return (
    <Figure caption={caption}>
      <Svg
        width={340}
        height={268}
        label="An equilateral triangle of side 2, cut from its top corner straight down to the middle of its base. The right half is shaded: a triangle with a side of 1 along the base, a side of the square root of 3 up the cut, and a side of 2 along the slope. Its angles are 30 degrees at the top, 60 degrees at the bottom right corner, and a right angle where the cut meets the base. The left half is dashed."
      >
        <polygon
          points={[L, F, T].map((p) => p.join(",")).join(" ")}
          {...dashed}
        />
        <CardTriangle
          corners={[F, R, T]}
          fill={CARD_TWO}
          edge={CARD_TWO_EDGE}
        />
        <Corner at={F} u={[1, 0]} v={[0, -1]} />

        <Arc at={T} r={44} from={270} to={300} color={ORANGE} />
        <ArcLabel at={T} r={66} from={270} to={300} color={ORANGE}>
          30°
        </ArcLabel>
        <Arc at={R} r={36} from={120} to={180} color={ORANGE} />
        <ArcLabel at={R} r={58} from={120} to={180} color={ORANGE}>
          60°
        </ArcLabel>

        <Words x={(F[0] + R[0]) / 2} y={F[1] + 26} size={17}>
          1
        </Words>
        <Words x={F[0] - 12} y={(F[1] + T[1]) / 2 + 6} size={17} anchor="end">
          √3
        </Words>
        <Words
          x={(T[0] + R[0]) / 2 + 20}
          y={(T[1] + R[1]) / 2 - 6}
          size={17}
          color={PURPLE}
        >
          2
        </Words>
      </Svg>
    </Figure>
  );
}
