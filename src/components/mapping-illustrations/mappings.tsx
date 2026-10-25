import { Figure } from "../figure";
import { BLUE, ORANGE, PURPLE, Svg, Words } from "../illustrations";
import {
  Arrow,
  GREEN,
  MUTED,
  Plot,
  Spot,
  graph,
} from "../function-illustrations/plot";

/**
 * Pictures for the guide Mappings. A cloakroom where three things share a hook and one hook is
 * empty; arrow pictures of a mapping beside two rules that are not mappings; the stretch
 * (x, y) ↦ (2x, y) sending the unit square to a 2 by 1 rectangle; the preimage of the heights
 * y ≥ 4 under squaring; and two different things whose arrows end at one hook.
 */

/** the cloakroom from the opening, with its four things and three hooks */
export const THINGS = ["coat", "hat", "scarf", "umbrella"];
export const HOOKS = ["A", "B", "C"];
/** where each thing hangs: coat, scarf and umbrella on A, the hat on C */
export const CLOAKROOM: Link[] = [
  [0, 0],
  [1, 2],
  [2, 0],
  [3, 0],
];

export type Link = readonly [number, number];

/**
 * One arrow picture: the elements of the domain as dots in a column on the left, the target on the
 * right, and an arrow along each link. Arrows listed in `marked` are orange, dots listed in
 * `flagLeft` or `flagRight` get an orange ring, and `note` is written underneath in orange.
 */
export function ArrowSets({
  title,
  left,
  right,
  links,
  marked = [],
  flagLeft = [],
  flagRight = [],
  note,
  label,
  width = 260,
}: {
  title?: string;
  left: string[];
  right: string[];
  links: Link[];
  marked?: number[];
  flagLeft?: number[];
  flagRight?: number[];
  note?: string;
  label: string;
  width?: number;
}) {
  const gap = 40;
  const top = title ? 48 : 16;
  const rows = Math.max(left.length, right.length);
  const height = top + rows * gap + (note ? 40 : 12);
  const inX = width / 2 - 44;
  const outX = width / 2 + 44;
  const yIn = (i: number) =>
    top + (i + (rows - left.length) / 2) * gap + gap / 2;
  const yOut = (j: number) =>
    top + (j + (rows - right.length) / 2) * gap + gap / 2;

  return (
    <Svg width={width} height={height} label={label}>
      {title && (
        <Words x={width / 2} y={26} size={15}>
          {title}
        </Words>
      )}
      {[
        [inX, left.length],
        [outX, right.length],
      ].map(([x, n]) => (
        <rect
          key={x}
          x={x! - 20}
          y={top + ((rows - n!) / 2) * gap + 2}
          width={40}
          height={n! * gap - 4}
          rx={20}
          fill="currentColor"
          fillOpacity={0.05}
          stroke="currentColor"
          strokeOpacity={0.35}
        />
      ))}
      {links.map(([i, j], k) => (
        <Arrow
          key={k}
          x1={inX + 9}
          y1={yIn(i)}
          x2={outX - 10}
          y2={yOut(j)}
          color={marked.includes(k) ? ORANGE : BLUE}
        />
      ))}
      {left.map((t, i) => (
        <g key={`l${i}`}>
          <circle
            cx={inX}
            cy={yIn(i)}
            r={6}
            fill={flagLeft.includes(i) ? "var(--color-fd-card)" : BLUE}
            stroke={flagLeft.includes(i) ? ORANGE : BLUE}
            strokeWidth={2.5}
          />
          <Words
            x={inX - 28}
            y={yIn(i) + 5}
            anchor="end"
            color={flagLeft.includes(i) ? ORANGE : "currentColor"}
          >
            {t}
          </Words>
        </g>
      ))}
      {right.map((t, j) => (
        <g key={`r${j}`}>
          <circle
            cx={outX}
            cy={yOut(j)}
            r={6}
            fill={GREEN}
            stroke={flagRight.includes(j) ? ORANGE : GREEN}
            strokeWidth={flagRight.includes(j) ? 3 : 2.5}
          />
          <Words
            x={outX + 28}
            y={yOut(j) + 5}
            anchor="start"
            color={flagRight.includes(j) ? ORANGE : "currentColor"}
          >
            {t}
          </Words>
        </g>
      ))}
      {note && (
        <Words x={width / 2} y={height - 14} size={13} color={ORANGE}>
          {note}
        </Words>
      )}
    </Svg>
  );
}

/** A coat hook: a short stem down from the rail, curling up at the end. */
function Hook({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M ${x} ${y} L ${x} ${y + 30} Q ${x} ${y + 44} ${x + 11} ${y + 44} Q ${x + 20} ${y + 44} ${x + 20} ${y + 33}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={4}
      strokeLinecap="round"
    />
  );
}

/**
 * The cloakroom from the opening: a rail with hooks A, B and C. A coat, a striped scarf and a
 * furled umbrella hang on hook A, a hat on hook C, and hook B is empty.
 */
export function CloakroomHooks({ caption }: { caption?: string }) {
  const rail = 64;
  const xs = [130, 290, 450];
  const [a, , c] = xs as [number, number, number];
  return (
    <Figure caption={caption}>
      <Svg
        width={580}
        height={330}
        label="A cloakroom rail with three hooks, labelled A, B and C. On hook A hang a blue coat, an orange striped scarf draped over it, and a furled umbrella. Hook B is empty. A purple hat hangs on hook C. Under the hooks it says: coat, scarf and umbrella under A, nothing under B, and hat under C."
      >
        {/* the wall and the rail */}
        <rect
          x={20}
          y={20}
          width={540}
          height={260}
          rx={10}
          fill="currentColor"
          fillOpacity={0.04}
        />
        <rect x={40} y={rail - 6} width={500} height={10} rx={4} fill={MUTED} />
        {xs.map((x, k) => (
          <g key={k}>
            <Hook x={x} y={rail + 4} />
            <Words x={x} y={44} size={17}>
              {HOOKS[k]}
            </Words>
          </g>
        ))}

        {/* hook A: the coat, hanging from its collar */}
        <path
          d={`M ${a + 8} ${rail + 46} L ${a - 38} ${rail + 74} L ${a - 50} ${rail + 196} L ${a + 66} ${rail + 196} L ${a + 54} ${rail + 74} Z`}
          fill={BLUE}
          fillOpacity={0.75}
          stroke={BLUE}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <line
          x1={a + 8}
          x2={a + 8}
          y1={rail + 60}
          y2={rail + 196}
          stroke="var(--color-fd-card)"
          strokeOpacity={0.7}
          strokeWidth={2}
        />
        {/* the scarf, draped over the hook in front of the coat */}
        {[
          [a - 6, 120],
          [a + 12, 96],
        ].map(([x, len], k) => (
          <g key={k}>
            <rect
              x={x}
              y={rail + 44}
              width={12}
              height={len}
              rx={3}
              fill={ORANGE}
            />
            {[30, 60, 90].map(
              (d) =>
                d < len! && (
                  <rect
                    key={d}
                    x={x}
                    y={rail + 44 + d}
                    width={12}
                    height={6}
                    fill="var(--color-fd-card)"
                    fillOpacity={0.8}
                  />
                ),
            )}
          </g>
        ))}
        {/* the umbrella, hanging by its curved handle */}
        <path
          d={`M ${a + 20} ${rail + 37} Q ${a + 34} ${rail + 30} ${a + 36} ${rail + 46} L ${a + 38} ${rail + 70}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
        />
        <path
          d={`M ${a + 38} ${rail + 70} L ${a + 50} ${rail + 92} L ${a + 46} ${rail + 196} L ${a + 30} ${rail + 92} Z`}
          fill={GREEN}
          stroke={GREEN}
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* hook C: the hat, hanging by its crown */}
        <rect
          x={c - 26}
          y={rail + 48}
          width={56}
          height={44}
          rx={8}
          fill={PURPLE}
          fillOpacity={0.85}
        />
        <ellipse
          cx={c + 2}
          cy={rail + 94}
          rx={52}
          ry={10}
          fill={PURPLE}
          stroke={PURPLE}
          strokeWidth={2}
        />

        {/* what each hook holds */}
        <Words x={a} y={302} size={14}>
          coat, scarf, umbrella
        </Words>
        <Words x={xs[1]!} y={302} size={14} color={MUTED}>
          nothing
        </Words>
        <Words x={c} y={302} size={14}>
          hat
        </Words>
      </Svg>
    </Figure>
  );
}

/**
 * Three arrow pictures from the coat, the hat and the scarf to hooks A, B and C. The first is a
 * mapping; in the second the hat has no arrow; in the third the scarf has two.
 */
export function MappingOrNot({ caption }: { caption?: string }) {
  const things = ["coat", "hat", "scarf"];
  return (
    <Figure caption={caption} className="flex flex-wrap justify-center gap-4">
      <div className="w-full max-w-[260px]">
        <ArrowSets
          title="a mapping"
          left={things}
          right={HOOKS}
          links={[
            [0, 0],
            [1, 2],
            [2, 0],
          ]}
          note="one arrow out of each thing"
          label="A mapping: the coat goes to A, the hat to C and the scarf to A. Each thing has exactly one arrow leaving it, and hook B gets none, which is allowed."
        />
      </div>
      <div className="w-full max-w-[260px]">
        <ArrowSets
          title="not a mapping"
          left={things}
          right={HOOKS}
          links={[
            [0, 0],
            [2, 1],
          ]}
          flagLeft={[1]}
          note="the hat has no arrow"
          label="Not a mapping: the coat goes to A and the scarf to B, but the hat, drawn as a hollow orange dot, has no arrow."
        />
      </div>
      <div className="w-full max-w-[260px]">
        <ArrowSets
          title="not a mapping"
          left={things}
          right={HOOKS}
          links={[
            [0, 1],
            [1, 2],
            [2, 0],
            [2, 2],
          ]}
          marked={[2, 3]}
          note="the scarf has two arrows"
          label="Not a mapping: the coat goes to B and the hat to C, but the scarf has two arrows, in orange, one to A and one to C."
        />
      </div>
    </Figure>
  );
}

/**
 * The unit square Q and its image under F(x, y) = (2x, y), the rectangle 2 wide and 1 tall, with
 * two points and the points they go to.
 */
export function SquareStretch({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <Plot
        id="square-stretch"
        x={[-0.5, 2.5]}
        y={[-0.5, 1.5]}
        unit={110}
        step={0.5}
        every={0.5}
        curves={[]}
        label="A grid with the unit square Q, from (0, 0) to (1, 1), shaded blue, and the rectangle F(Q), from (0, 0) to (2, 1), outlined with a dashed orange line, so the square is its left half. Arrows go from the corner (1, 1) to (2, 1), and from the point (0.5, 0.5) to (1, 0.5)."
      >
        {({ px, py }) => (
          <g>
            <rect
              x={px(0)}
              y={py(1)}
              width={px(2) - px(0)}
              height={py(0) - py(1)}
              fill={ORANGE}
              fillOpacity={0.12}
              stroke={ORANGE}
              strokeWidth={2.5}
              strokeDasharray="7 5"
            />
            <rect
              x={px(0)}
              y={py(1)}
              width={px(1) - px(0)}
              height={py(0) - py(1)}
              fill={BLUE}
              fillOpacity={0.22}
              stroke={BLUE}
              strokeWidth={2.5}
            />
            <Arrow
              x1={px(1) + 8}
              y1={py(1) - 12}
              x2={px(2) - 8}
              y2={py(1) - 12}
              color={PURPLE}
            />
            <Arrow
              x1={px(0.5) + 8}
              y1={py(0.5)}
              x2={px(1) - 8}
              y2={py(0.5)}
              color={PURPLE}
            />
            <Spot x={px(1)} y={py(1)} color={BLUE} />
            <Spot x={px(2)} y={py(1)} color={ORANGE} />
            <Spot x={px(0.5)} y={py(0.5)} color={BLUE} />
            <Spot x={px(1)} y={py(0.5)} color={ORANGE} />
            <Words x={px(0.5)} y={py(0.78)} color={BLUE} size={16}>
              Q
            </Words>
            <Words x={px(1.5)} y={py(0.78)} color={ORANGE} size={16}>
              F(Q)
            </Words>
            <Words x={px(1)} y={py(1) - 20} size={13}>
              (1, 1)
            </Words>
            <Words x={px(2)} y={py(1) - 20} size={13}>
              (2, 1)
            </Words>
            <Words x={px(0.5)} y={py(0.5) + 24} size={13}>
              (0.5, 0.5)
            </Words>
            <Words x={px(1) + 40} y={py(0.5) + 24} size={13}>
              (1, 0.5)
            </Words>
          </g>
        )}
      </Plot>
    </Figure>
  );
}

/**
 * The graph of y = x², with the heights y ≥ 4 marked on the y-axis and their preimage, x ≤ −2 and
 * x ≥ 2, marked on the x-axis. The parts of the graph above the preimage are orange.
 */
export function SquaringPreimage({ caption }: { caption?: string }) {
  const square = (x: number) => x * x;
  return (
    <Figure caption={caption}>
      <Plot
        id="squaring-preimage"
        x={[-3.5, 3.5]}
        y={[-1, 10]}
        unit={46}
        unitY={23}
        everyY={2}
        curves={[
          { points: graph(square, -3.5, 3.5), color: BLUE },
          { points: graph(square, -3.5, -2), color: ORANGE },
          { points: graph(square, 2, 3.5), color: ORANGE },
        ]}
        label="The graph of y = x² for x from −3.5 to 3.5. A dashed line runs across at height 4. The y-axis is drawn thick in orange from 4 upwards, the heights y ≥ 4. The x-axis is drawn thick in green from −2 leftwards and from 2 rightwards, the inputs whose squares are at least 4, and the graph above those inputs is orange. Each step up the grid is drawn half as long as each step across."
      >
        {({ px, py }) => (
          <g>
            <line
              x1={px(-3.5)}
              x2={px(3.5)}
              y1={py(4)}
              y2={py(4)}
              stroke={ORANGE}
              strokeWidth={1.5}
              strokeDasharray="6 5"
            />
            <line
              x1={px(0)}
              x2={px(0)}
              y1={py(4)}
              y2={py(10)}
              stroke={ORANGE}
              strokeWidth={6}
              strokeOpacity={0.7}
            />
            {[
              [-3.5, -2],
              [2, 3.5],
            ].map(([a, b]) => (
              <line
                key={a}
                x1={px(a!)}
                x2={px(b!)}
                y1={py(0)}
                y2={py(0)}
                stroke={GREEN}
                strokeWidth={6}
                strokeOpacity={0.8}
              />
            ))}
            <Spot x={px(-2)} y={py(0)} color={GREEN} />
            <Spot x={px(2)} y={py(0)} color={GREEN} />
            <Spot x={px(-2)} y={py(4)} color={ORANGE} />
            <Spot x={px(2)} y={py(4)} color={ORANGE} />
            <Words
              x={px(0) + 30}
              y={py(7.2)}
              anchor="start"
              color={ORANGE}
              size={14}
            >
              y ≥ 4
            </Words>
            <Words x={px(-2.75)} y={py(0) - 12} color={GREEN} size={14}>
              x ≤ −2
            </Words>
            <Words x={px(2.75)} y={py(0) - 12} color={GREEN} size={14}>
              x ≥ 2
            </Words>
          </g>
        )}
      </Plot>
    </Figure>
  );
}

/**
 * The cloakroom's arrows, with the arrows from the coat and the scarf in orange: two different
 * things, one hook.
 */
export function SharedHook({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <div className="mx-auto w-full max-w-[300px]">
        <ArrowSets
          left={THINGS}
          right={HOOKS}
          links={CLOAKROOM}
          marked={[0, 2]}
          flagRight={[0]}
          note="coat and scarf both arrive at A"
          width={300}
          label="The cloakroom's arrows: the coat, the scarf and the umbrella go to hook A and the hat to hook C. The arrows from the coat and the scarf are orange, and both end at hook A."
        />
      </div>
    </Figure>
  );
}
