import { Figure } from "../figure";
import { BLUE, ORANGE, PURPLE, Svg, Words } from "../illustrations";

/**
 * Pictures for the guide Cycles. A perfect out-shuffle of eight cards, drawn as the two halves of
 * the deck and the row they interleave into, with a line from each card's old place to its new
 * one. Then permutations drawn as loops: each orbit is a ring of numbered dots with an arrow from
 * each number to the one it goes to, and a fixed point is a dot with a small loop on itself. The
 * guide Swaps and the sign of a permutation draws its loops with the same `Loops` helper.
 */

const GREEN = "#22c55e";
const MUTED = "#9ca3af";
const CARD_FACE = "#fbfaf7";

/** the colours given to the rings, in order; fixed points are always grey */
export const RING_COLORS = [BLUE, ORANGE, PURPLE, GREEN];

// a filled arrow head with its tip at (x, y), pointing along the direction (dx, dy)
function Head({
  x,
  y,
  dx,
  dy,
  color,
}: {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
}) {
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const bx = x - ux * 10;
  const by = y - uy * 10;
  return (
    <polygon
      points={`${x},${y} ${bx - uy * 5},${by + ux * 5} ${bx + uy * 5},${by - ux * 5}`}
      fill={color}
    />
  );
}

const DOT = 14;

/** how big a ring of k numbers is drawn */
const ringRadius = (k: number) =>
  k === 1 ? 0 : Math.max(38, (k * 46) / (2 * Math.PI));

/**
 * One orbit as a ring centred at (cx, cy): the numbers go clockwise from the top, each with an
 * arrow along the ring to the next, and the last back to the first. A single number is a fixed
 * point and gets a small loop above it.
 */
function Ring({
  cycle,
  cx,
  cy,
  color,
}: {
  cycle: number[];
  cx: number;
  cy: number;
  color: string;
}) {
  const k = cycle.length;
  const R = ringRadius(k);
  const at = (j: number) => {
    const a = -Math.PI / 2 + (2 * Math.PI * j) / k;
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a), a };
  };
  const gap = (DOT + 4) / Math.max(R, 1);
  const point = (a: number) => ({
    x: cx + R * Math.cos(a),
    y: cy + R * Math.sin(a),
  });

  return (
    <g>
      {k === 1 ? (
        <g fill="none" stroke={color} strokeWidth={2.5}>
          <path
            d={`M ${cx - 7} ${cy - DOT + 1} C ${cx - 26} ${cy - 50}, ${cx + 26} ${cy - 50}, ${cx + 7} ${cy - DOT + 1}`}
          />
          <Head x={cx + 7} y={cy - DOT + 1} dx={-0.45} dy={1} color={color} />
        </g>
      ) : (
        cycle.map((_, j) => {
          const from = at(j).a + gap;
          const to = at(j + 1).a - gap;
          const p = point(from);
          const q = point(to);
          return (
            <g key={j}>
              <path
                d={`M ${p.x.toFixed(1)} ${p.y.toFixed(1)} A ${R} ${R} 0 0 1 ${q.x.toFixed(1)} ${q.y.toFixed(1)}`}
                fill="none"
                stroke={color}
                strokeWidth={2.5}
              />
              <Head
                x={q.x}
                y={q.y}
                dx={-Math.sin(to)}
                dy={Math.cos(to)}
                color={color}
              />
            </g>
          );
        })
      )}
      {cycle.map((n, j) => {
        const { x, y } = k === 1 ? { x: cx, y: cy } : at(j);
        return (
          <g key={n}>
            <circle
              cx={x}
              cy={y}
              r={DOT}
              fill="var(--color-fd-card)"
              stroke={color}
              strokeWidth={2.5}
            />
            <text
              x={x}
              y={y + 5}
              textAnchor="middle"
              fontSize={15}
              fontWeight={600}
              fill="currentColor"
            >
              {n}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/**
 * The orbits of a permutation as rings side by side, each with its cycle written underneath, e.g.
 * [1, 6, 2]. Rings of two or more numbers take the colours in RING_COLORS in order.
 */
export function Loops({
  cycles,
  label,
  title,
}: {
  cycles: number[][];
  label: string;
  /** a line written above the rings, e.g. the name of the permutation */
  title?: string;
}) {
  const pad = 28;
  const between = 34;
  const widths = cycles.map((c) =>
    c.length === 1 ? 2 * DOT + 30 : 2 * ringRadius(c.length) + 2 * DOT,
  );
  const width =
    widths.reduce((a, b) => a + b, 0) + between * (cycles.length - 1) + 2 * pad;
  const tallest = Math.max(...cycles.map((c) => ringRadius(c.length)), 24);
  const top = title ? 40 : 14;
  const cy = top + DOT + tallest;
  const height = cy + tallest + DOT + 44;

  let x = pad;
  const placed = cycles.map((c, i) => {
    const cx = x + widths[i]! / 2;
    x += widths[i]! + between;
    return { c, cx };
  });
  let colour = 0;

  return (
    <Svg width={Math.max(width, 260)} height={height} label={label}>
      {title && (
        <Words x={Math.max(width, 260) / 2} y={24}>
          {title}
        </Words>
      )}
      {placed.map(({ c, cx }) => {
        const color =
          c.length === 1 ? MUTED : RING_COLORS[colour++ % RING_COLORS.length]!;
        return (
          <g key={c.join("-")}>
            <Ring cycle={c} cx={cx} cy={cy} color={color} />
            <Words x={cx} y={cy + tallest + DOT + 32} color={color}>
              [{c.join(", ")}]
            </Words>
          </g>
        );
      })}
    </Svg>
  );
}

/** A card with a number on it, its top left corner at (x, y). */
function Card({
  x,
  y,
  n,
  color,
}: {
  x: number;
  y: number;
  n: number;
  color: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={44}
        height={62}
        rx={6}
        fill={CARD_FACE}
        stroke={color}
        strokeWidth={3}
      />
      <text
        x={x + 22}
        y={y + 39}
        textAnchor="middle"
        fontSize={22}
        fontWeight={700}
        fill={color}
      >
        {n}
      </text>
    </g>
  );
}

/**
 * The perfect out-shuffle of eight cards. Above, the deck cut into its top half (cards 1 to 4,
 * blue) and bottom half (5 to 8, orange), laid out in a row; below, the row after the halves are
 * interleaved, 1 5 2 6 3 7 4 8. A line joins each card's place before to its place after.
 */
export function OutShuffle({ caption }: { caption?: string }) {
  const after = [1, 5, 2, 6, 3, 7, 4, 8];
  const left = 70;
  const step = 60;
  // the halves are drawn apart, to show the cut
  const before = (p: number) => left + (p - 1) * step + (p > 4 ? 30 : 0);
  const below = (p: number) => left + 15 + (p - 1) * step;
  const yTop = 40;
  const yBottom = 210;
  const colour = (n: number) => (n <= 4 ? BLUE : ORANGE);

  return (
    <Figure caption={caption}>
      <Svg
        width={620}
        height={318}
        label="Eight numbered cards in a row, cut into a top half, cards 1 to 4 in blue, and a bottom half, cards 5 to 8 in orange. Below them is the row after a perfect out-shuffle: 1, 5, 2, 6, 3, 7, 4, 8, the halves taken one card at a time, starting with the top half. A line runs from each card's place in the first row to its place in the second, so card 2 goes to place 3, card 3 to place 5 and card 5 to place 2, while cards 1 and 8 stay where they are."
      >
        <Words x={before(1) + 2 * step - 8} y={26} color={BLUE}>
          top half
        </Words>
        <Words x={before(5) + 2 * step - 8} y={26} color={ORANGE}>
          bottom half
        </Words>
        {after.map((card, i) => {
          const from = before(card) + 22;
          const to = below(i + 1) + 22;
          return (
            <line
              key={card}
              x1={from}
              y1={yTop + 66}
              x2={to}
              y2={yBottom - 4}
              stroke={colour(card)}
              strokeWidth={2}
              strokeOpacity={0.7}
            />
          );
        })}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <Card key={n} x={before(n)} y={yTop} n={n} color={colour(n)} />
        ))}
        {after.map((n, i) => (
          <Card key={n} x={below(i + 1)} y={yBottom} n={n} color={colour(n)} />
        ))}
        {after.map((_, i) => (
          <Words
            key={i}
            x={below(i + 1) + 22}
            y={yBottom + 88}
            size={13}
            color={MUTED}
          >
            place {i + 1}
          </Words>
        ))}
        <Words x={36} y={yTop + 38} color={MUTED} size={13}>
          before
        </Words>
        <Words x={36} y={yBottom + 38} color={MUTED} size={13}>
          after
        </Words>
      </Svg>
    </Figure>
  );
}

/** The out-shuffle of eight cards as loops: [1], [2, 3, 5], [4, 7, 6] and [8]. */
export function OutShuffleLoops({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <Loops
        cycles={[[1], [2, 3, 5], [4, 7, 6], [8]]}
        label="The perfect out-shuffle of eight cards drawn as loops. Places 1 and 8 are grey dots, each with a small loop on itself, because those cards never move. A blue ring carries place 2 to 3, 3 to 5 and 5 back to 2, and an orange ring carries 4 to 7, 7 to 6 and 6 back to 4. Under the rings are the cycles [1], [2, 3, 5], [4, 7, 6] and [8]."
      />
    </Figure>
  );
}

/** The permutation of seven numbers with cycles [1, 6, 2], [3, 5], [4] and [7]. */
export function SevenLoops({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <Loops
        cycles={[[1, 6, 2], [3, 5], [4], [7]]}
        label="A permutation of the numbers 1 to 7 drawn as loops. A blue ring carries 1 to 6, 6 to 2 and 2 back to 1. An orange ring of two carries 3 to 5 and 5 back to 3. The numbers 4 and 7 are grey dots with a small loop on themselves, since they stay put. Under the rings are the cycles [1, 6, 2], [3, 5], [4] and [7]."
      />
    </Figure>
  );
}
