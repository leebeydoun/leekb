import { Figure } from "../figure";
import {
  Corner,
  FieldWords,
  GRASS,
  GRASS_DARK,
  Svg,
  WOOD,
  WOOD_DARK,
  type Pt,
} from "../illustrations";

/**
 * Pictures for the Whole-number right triangles guide: a builder's rope, knotted into 12 equal
 * lengths and pegged out on the ground as a triangle with sides of 3, 4 and 5 lengths. The corner
 * between the 3 and the 4 is square.
 */

const ROPE = "#d6b47a";
const ROPE_DARK = "#8b6b3a";
const KNOT = "#5b4524";

/** the rope from a to b: a thick tan line with a darker edge */
function Rope({ a, b }: { a: Pt; b: Pt }) {
  return (
    <g strokeLinecap="round">
      <line
        x1={a[0]}
        y1={a[1]}
        x2={b[0]}
        y2={b[1]}
        stroke={ROPE_DARK}
        strokeWidth={7}
      />
      <line
        x1={a[0]}
        y1={a[1]}
        x2={b[0]}
        y2={b[1]}
        stroke={ROPE}
        strokeWidth={4.5}
      />
    </g>
  );
}

/** a wooden peg seen from above, with a little shadow on the grass */
function Peg({ at }: { at: Pt }) {
  return (
    <g>
      <circle cx={at[0] + 3} cy={at[1] + 4} r={11} fill="#000" opacity={0.15} />
      <circle
        cx={at[0]}
        cy={at[1]}
        r={11}
        fill={WOOD}
        stroke={WOOD_DARK}
        strokeWidth={2.5}
      />
      <circle cx={at[0]} cy={at[1]} r={4} fill={WOOD_DARK} opacity={0.5} />
    </g>
  );
}

/**
 * A rope loop with 12 knots, equally spaced, pegged out as a triangle with sides of 3, 4 and 5
 * lengths. The pegs sit at three of the knots, and a small square marks the right angle between the
 * sides of 3 and 4 lengths.
 */
export function BuilderRope({ caption }: { caption?: string }) {
  const width = 520;
  const height = 330;
  const unit = 62;
  // the square corner at the bottom left, the 4 along the bottom and the 3 up the left side
  const corner: Pt = [150, 262];
  const right: Pt = [corner[0] + 4 * unit, corner[1]];
  const top: Pt = [corner[0], corner[1] - 3 * unit];

  // the 12 knots, one at the end of each length, going round the loop
  const along = (from: Pt, to: Pt, pieces: number) =>
    Array.from({ length: pieces }, (_, i): Pt => [
      from[0] + ((to[0] - from[0]) * i) / pieces,
      from[1] + ((to[1] - from[1]) * i) / pieces,
    ]);
  const knots = [
    ...along(corner, right, 4),
    ...along(right, top, 5),
    ...along(top, corner, 3),
  ];

  // tufts of grass at fixed places, so the ground reads as a lawn
  const tufts: Pt[] = [
    [40, 40],
    [90, 150],
    [60, 300],
    [250, 40],
    [420, 70],
    [480, 170],
    [440, 300],
    [300, 305],
    [220, 190],
    [30, 220],
  ];

  // the slanting side runs up and to the left; its label sits beyond it, up and to the right
  const middle: Pt = [(right[0] + top[0]) / 2, (right[1] + top[1]) / 2];

  return (
    <Figure caption={caption}>
      <Svg
        width={width}
        height={height}
        label="A lawn seen from above. A loop of rope with 12 equally spaced knots is pegged out as a triangle: 4 lengths along the bottom, 3 lengths up the left side and 5 lengths along the slanting side. The corner between the sides of 3 and 4 lengths is marked as a right angle."
      >
        <rect x={0} y={0} width={width} height={height} rx={10} fill={GRASS} />
        <g stroke={GRASS_DARK} strokeWidth={1.5} strokeLinecap="round">
          {tufts.map(([x, y], i) => (
            <g key={i}>
              <line x1={x} y1={y} x2={x - 4} y2={y - 9} />
              <line x1={x} y1={y} x2={x} y2={y - 11} />
              <line x1={x} y1={y} x2={x + 4} y2={y - 9} />
            </g>
          ))}
        </g>

        <Rope a={corner} b={right} />
        <Rope a={right} b={top} />
        <Rope a={top} b={corner} />

        {knots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={5.5} fill={KNOT} />
        ))}

        <Corner at={[corner[0] + 12, corner[1] - 12]} u={[1, 0]} v={[0, -1]} />

        <Peg at={corner} />
        <Peg at={right} />
        <Peg at={top} />

        <FieldWords x={(corner[0] + right[0]) / 2} y={corner[1] + 36}>
          4 lengths
        </FieldWords>
        <FieldWords
          x={corner[0] - 22}
          y={(corner[1] + top[1]) / 2 + 5}
          anchor="end"
        >
          3 lengths
        </FieldWords>
        <FieldWords x={middle[0] + 26} y={middle[1] - 16} anchor="start">
          5 lengths
        </FieldWords>
      </Svg>
    </Figure>
  );
}
