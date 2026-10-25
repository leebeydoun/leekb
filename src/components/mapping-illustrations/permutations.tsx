import { Figure } from "../figure";
import { BLUE, ORANGE, PURPLE, Svg, Words } from "../illustrations";
import { Arrow, GREEN, MUTED } from "../function-illustrations/plot";

/**
 * Pictures for the guide Permutations. Four cards moved by the shuffle σ, which sends the card in
 * place 1 to place 3, place 2 to place 4, place 3 to place 2 and place 4 to place 1; the composite
 * στ followed through three columns of places; and the six permutations of {1, 2, 3} sorted by
 * where they send 3.
 */

/** the shuffle used in the guide: place i goes to place SIGMA[i − 1] */
const SIGMA = [3, 4, 2, 1];
const TAU = [1, 3, 4, 2];
const CARD_COLORS = [BLUE, ORANGE, GREEN, PURPLE];

/** A card face up: a rounded rectangle with its letter in the middle and in one corner. */
function Card({
  x,
  y,
  letter,
  color,
}: {
  x: number;
  y: number;
  letter: string;
  color: string;
}) {
  return (
    <g>
      <rect
        x={x - 30}
        y={y - 42}
        width={60}
        height={84}
        rx={8}
        fill="var(--color-fd-card)"
        stroke={color}
        strokeWidth={2.5}
      />
      <rect
        x={x - 24}
        y={y - 36}
        width={48}
        height={72}
        rx={5}
        fill={color}
        fillOpacity={0.12}
      />
      <text
        x={x}
        y={y + 10}
        textAnchor="middle"
        fontSize={28}
        fontWeight={700}
        fill={color}
      >
        {letter}
      </text>
      <text x={x - 20} y={y - 20} fontSize={12} fontWeight={700} fill={color}>
        {letter}
      </text>
    </g>
  );
}

/** Cards A, B, C, D in places 1 to 4, and below them the row after σ: D, C, A, B. */
export function CardMoves({ caption }: { caption?: string }) {
  const placeX = (i: number) => 150 + (i - 1) * 110;
  const top = 78;
  const bottom = 262;
  const letters = ["A", "B", "C", "D"];

  return (
    <Figure caption={caption}>
      <Svg
        width={560}
        height={350}
        label="Two rows of four places, numbered 1 to 4. In the top row, before the shuffle, the cards A, B, C and D lie in places 1, 2, 3 and 4. Arrows run from each top place to a bottom place: 1 to 3, 2 to 4, 3 to 2 and 4 to 1. In the bottom row, after the shuffle, the cards read D, C, A, B."
      >
        <Words x={30} y={top + 5} anchor="start" size={14}>
          before
        </Words>
        <Words x={30} y={bottom + 5} anchor="start" size={14}>
          after σ
        </Words>
        {[1, 2, 3, 4].map((i) => (
          <g key={i}>
            <Words x={placeX(i)} y={top - 52} size={13} color={MUTED}>
              {`place ${i}`}
            </Words>
            <Words x={placeX(i)} y={bottom + 66} size={13} color={MUTED}>
              {`place ${i}`}
            </Words>
          </g>
        ))}
        {[1, 2, 3, 4].map((i) => {
          const j = SIGMA[i - 1]!;
          return (
            <Arrow
              key={i}
              x1={placeX(i)}
              y1={top + 48}
              x2={placeX(j)}
              y2={bottom - 48}
              color={CARD_COLORS[i - 1]!}
            />
          );
        })}
        {[1, 2, 3, 4].map((i) => (
          <Card
            key={i}
            x={placeX(i)}
            y={top}
            letter={letters[i - 1]!}
            color={CARD_COLORS[i - 1]!}
          />
        ))}
        {[1, 2, 3, 4].map((i) => (
          <Card
            key={i}
            x={placeX(SIGMA[i - 1]!)}
            y={bottom}
            letter={letters[i - 1]!}
            color={CARD_COLORS[i - 1]!}
          />
        ))}
      </Svg>
    </Figure>
  );
}

/**
 * Three columns of the numbers 1 to 4. Arrows for τ run from the first column to the second, and
 * arrows for σ from the second to the third, so following both from 1 gives στ(1) = 3.
 */
export function ComposeColumns({ caption }: { caption?: string }) {
  const colX = [110, 280, 450];
  const rowY = (i: number) => 70 + (i - 1) * 62;
  const path = [1, 2, 3, 4].map((i) => {
    const mid = TAU[i - 1]!;
    return [i, mid, SIGMA[mid - 1]!] as const;
  });
  const highlight = 1;

  return (
    <Figure caption={caption}>
      <Svg
        width={560}
        height={330}
        label="Three columns of the numbers 1 to 4. Arrows labelled τ go from the first column to the second: 1 to 1, 2 to 3, 3 to 4 and 4 to 2. Arrows labelled σ go from the second column to the third: 1 to 3, 2 to 4, 3 to 2 and 4 to 1. The path from 1 is drawn in orange: 1 goes to 1 under τ, and then 1 goes to 3 under σ, so στ sends 1 to 3. Following the other paths, στ sends 2 to 2, 3 to 1 and 4 to 4."
      >
        <Words x={(colX[0]! + colX[1]!) / 2} y={30} size={16} color={BLUE}>
          τ first
        </Words>
        <Words x={(colX[1]! + colX[2]!) / 2} y={30} size={16} color={GREEN}>
          then σ
        </Words>
        {path.map(([i, mid, end]) => (
          <g key={i}>
            <Arrow
              x1={colX[0]! + 16}
              y1={rowY(i)}
              x2={colX[1]! - 16}
              y2={rowY(mid)}
              color={i === highlight ? ORANGE : BLUE}
            />
            <Arrow
              x1={colX[1]! + 16}
              y1={rowY(mid)}
              x2={colX[2]! - 16}
              y2={rowY(end)}
              color={i === highlight ? ORANGE : GREEN}
            />
          </g>
        ))}
        {colX.map((x) =>
          [1, 2, 3, 4].map((i) => (
            <g key={`${x}-${i}`}>
              <circle
                cx={x}
                cy={rowY(i)}
                r={14}
                fill="var(--color-fd-card)"
                stroke="currentColor"
                strokeWidth={1.5}
              />
              <text
                x={x}
                y={rowY(i) + 5}
                textAnchor="middle"
                fontSize={15}
                fontWeight={600}
                fill="currentColor"
              >
                {i}
              </text>
            </g>
          )),
        )}
        <Words x={280} y={318} size={14}>
          στ: 1 → 3, 2 → 2, 3 → 1, 4 → 4
        </Words>
      </Svg>
    </Figure>
  );
}

/**
 * The six permutations of {1, 2, 3}, grouped into three branches by σ(3), with two leaves on each
 * branch: the two ways of sending 1 and 2 to the two places that are left.
 */
export function CountingTree({ caption }: { caption?: string }) {
  const rootX = 280;
  const rootY = 40;
  const branchY = 130;
  const leafY = 250;
  const branches: { value: number; leaves: [number, number, number][] }[] = [
    {
      value: 3,
      leaves: [
        [1, 2, 3],
        [2, 1, 3],
      ],
    },
    {
      value: 2,
      leaves: [
        [1, 3, 2],
        [3, 1, 2],
      ],
    },
    {
      value: 1,
      leaves: [
        [2, 3, 1],
        [3, 2, 1],
      ],
    },
  ];
  const branchX = (b: number) => 100 + b * 180;
  const leafX = (b: number, l: number) => branchX(b) - 44 + l * 88;

  return (
    <Figure caption={caption}>
      <Svg
        width={560}
        height={300}
        label="A tree. From the top, three branches split by where 3 goes: σ(3) = 3, σ(3) = 2 and σ(3) = 1. Each branch splits again into two leaves, the two ways to send 1 and 2 to the two places left. The leaves, read as the bottom rows of two-row permutations, are 1 2 3 and 2 1 3 under σ(3) = 3; 1 3 2 and 3 1 2 under σ(3) = 2; and 2 3 1 and 3 2 1 under σ(3) = 1. That is 3 times 2, or 6, permutations."
      >
        <circle cx={rootX} cy={rootY} r={6} fill="currentColor" />
        {branches.map((b, bi) => (
          <g key={b.value}>
            <line
              x1={rootX}
              y1={rootY}
              x2={branchX(bi)}
              y2={branchY - 16}
              stroke={MUTED}
              strokeWidth={2}
            />
            <Words x={branchX(bi)} y={branchY + 5} size={15} color={ORANGE}>
              {`σ(3) = ${b.value}`}
            </Words>
            {b.leaves.map((leaf, li) => (
              <g key={li}>
                <line
                  x1={branchX(bi)}
                  y1={branchY + 14}
                  x2={leafX(bi, li)}
                  y2={leafY - 40}
                  stroke={MUTED}
                  strokeWidth={2}
                />
                <rect
                  x={leafX(bi, li) - 34}
                  y={leafY - 36}
                  width={68}
                  height={52}
                  rx={6}
                  fill={BLUE}
                  fillOpacity={0.1}
                  stroke={BLUE}
                  strokeWidth={1.5}
                />
                <text
                  x={leafX(bi, li)}
                  y={leafY - 16}
                  textAnchor="middle"
                  fontSize={13}
                  className="fill-fd-muted-foreground"
                >
                  1 2 3
                </text>
                <text
                  x={leafX(bi, li)}
                  y={leafY + 6}
                  textAnchor="middle"
                  fontSize={15}
                  fontWeight={700}
                  fill={BLUE}
                >
                  {leaf.join(" ")}
                </text>
              </g>
            ))}
          </g>
        ))}
        <Words x={rootX} y={290} size={14}>
          3 choices for σ(3), then 2 for the rest: 3 · 2 = 6
        </Words>
      </Svg>
    </Figure>
  );
}
