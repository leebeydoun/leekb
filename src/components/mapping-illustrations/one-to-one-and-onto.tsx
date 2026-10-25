import { Figure } from "../figure";
import { BLUE, ORANGE, PURPLE, Svg, Words } from "../illustrations";
import { GREEN, MUTED, Plot, Spot } from "../function-illustrations/plot";
import { ArrowSets } from "./mappings";

/**
 * Pictures for the guide One to one and onto. Three nights at a small theatre (two people in one
 * seat, an empty seat, a full house); four arrow pictures, one for each way the two tests can turn
 * out; five pigeons in four pigeonholes; five points in a 2 by 2 square, two of them close; and a
 * hotel where the guest in room n moves to room 2n.
 */

/** A person sitting down, seen from the front: a head and shoulders. */
function Person({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={10} fill={color} />
      <path
        d={`M ${x - 15} ${y + 34} L ${x - 15} ${y + 22} Q ${x - 15} ${y + 12} ${x - 5} ${y + 12} L ${x + 5} ${y + 12} Q ${x + 15} ${y + 12} ${x + 15} ${y + 22} L ${x + 15} ${y + 34} Z`}
        fill={color}
      />
    </g>
  );
}

/**
 * Three panels, each a row of three theatre seats. Night 1: two people in seat 1, one in seat 3,
 * seat 2 empty. Night 2: two people, in seats 1 and 3, seat 2 empty. Night 3: one person in each.
 */
export function TheatreSeats({ caption }: { caption?: string }) {
  const nights: {
    title: string;
    note: string;
    people: { seat: number; shift: number; clash?: boolean }[];
    empty: number[];
  }[] = [
    {
      title: "night 1",
      note: "two in one seat",
      people: [
        { seat: 0, shift: -11, clash: true },
        { seat: 0, shift: 11, clash: true },
        { seat: 2, shift: 0 },
      ],
      empty: [],
    },
    {
      title: "night 2",
      note: "an empty seat",
      people: [
        { seat: 0, shift: 0 },
        { seat: 2, shift: 0 },
      ],
      empty: [1],
    },
    {
      title: "night 3",
      note: "one in each seat",
      people: [
        { seat: 0, shift: 0 },
        { seat: 1, shift: 0 },
        { seat: 2, shift: 0 },
      ],
      empty: [],
    },
  ];
  const seatX = (panel: number, seat: number) => 54 + panel * 200 + seat * 52;
  const seatTop = 112;

  return (
    <Figure caption={caption}>
      <Svg
        width={600}
        height={230}
        label="Three panels, each showing a row of three theatre seats. Night 1: two people, drawn in orange, are squeezed into the first seat, the second seat is empty and one person sits in the third. Night 2: one person sits in the first seat and one in the third, and the empty middle seat is outlined in orange. Night 3: three people sit in the three seats, one each."
      >
        {nights.map((night, p) => (
          <g key={p}>
            <Words x={seatX(p, 1)} y={34} size={15}>
              {night.title}
            </Words>
            {/* the seat backs, behind the people */}
            {[0, 1, 2].map((s) => (
              <rect
                key={s}
                x={seatX(p, s) - 21}
                y={seatTop - 36}
                width={42}
                height={52}
                rx={7}
                fill={MUTED}
                fillOpacity={0.35}
                stroke={night.empty.includes(s) ? ORANGE : MUTED}
                strokeWidth={night.empty.includes(s) ? 3 : 1.5}
              />
            ))}
            {night.people.map((person, k) => (
              <Person
                key={k}
                x={seatX(p, person.seat) + person.shift}
                y={seatTop - 22}
                color={person.clash ? ORANGE : BLUE}
              />
            ))}
            {/* the seat cushions, in front */}
            {[0, 1, 2].map((s) => (
              <rect
                key={s}
                x={seatX(p, s) - 23}
                y={seatTop + 12}
                width={46}
                height={18}
                rx={5}
                fill={MUTED}
                stroke={night.empty.includes(s) ? ORANGE : "currentColor"}
                strokeOpacity={night.empty.includes(s) ? 1 : 0.4}
                strokeWidth={night.empty.includes(s) ? 3 : 1.5}
              />
            ))}
            {[0, 1, 2].map((s) => (
              <Words
                key={s}
                x={seatX(p, s)}
                y={seatTop + 52}
                size={12}
                color={MUTED}
              >
                {`seat ${s + 1}`}
              </Words>
            ))}
            <Words
              x={seatX(p, 1)}
              y={204}
              size={14}
              color={p === 2 ? GREEN : ORANGE}
            >
              {night.note}
            </Words>
          </g>
        ))}
      </Svg>
    </Figure>
  );
}

/**
 * Four arrow pictures: neither one to one nor onto; one to one but not onto; onto but not one to
 * one; and both. Arrows into an element with two arrows are orange, and elements of the target
 * that fail a test have an orange label.
 */
export function ArrowTests({ caption }: { caption?: string }) {
  const panels = [
    {
      title: "neither",
      left: ["1", "2", "3"],
      right: ["a", "b", "c"],
      links: [
        [0, 0],
        [1, 0],
        [2, 1],
      ] as const,
      marked: [0, 1],
      flagRight: [0, 2],
      note: "two arrive at a, none at c",
      label:
        "Neither one to one nor onto: 1 and 2 both go to a, with their arrows in orange, 3 goes to b, and no arrow arrives at c.",
    },
    {
      title: "one to one, not onto",
      left: ["1", "2"],
      right: ["a", "b", "c"],
      links: [
        [0, 0],
        [1, 2],
      ] as const,
      marked: [],
      flagRight: [1],
      note: "none arrive at b",
      label:
        "One to one but not onto: 1 goes to a and 2 goes to c, so no element gets two arrows, but no arrow arrives at b.",
    },
    {
      title: "onto, not one to one",
      left: ["1", "2", "3"],
      right: ["a", "b"],
      links: [
        [0, 0],
        [1, 1],
        [2, 1],
      ] as const,
      marked: [1, 2],
      flagRight: [1],
      note: "two arrive at b",
      label:
        "Onto but not one to one: 1 goes to a, and 2 and 3 both go to b, with their arrows in orange. Every element on the right gets an arrow.",
    },
    {
      title: "one to one and onto",
      left: ["1", "2", "3"],
      right: ["a", "b", "c"],
      links: [
        [0, 1],
        [1, 2],
        [2, 0],
      ] as const,
      marked: [],
      flagRight: [],
      note: undefined,
      label:
        "One to one and onto: 1 goes to b, 2 goes to c and 3 goes to a. Exactly one arrow arrives at each element on the right.",
    },
  ];
  return (
    <Figure caption={caption} className="flex flex-wrap justify-center gap-4">
      {panels.map((panel) => (
        <div key={panel.title} className="w-full max-w-[230px]">
          <ArrowSets
            title={panel.title}
            left={panel.left}
            right={panel.right}
            links={[...panel.links]}
            marked={panel.marked}
            flagRight={panel.flagRight}
            note={panel.note ?? "exactly one arrives at each"}
            width={230}
            label={panel.label}
          />
        </div>
      ))}
    </Figure>
  );
}

/** A pigeon facing right, sitting with its body centred at (x, y). */
function Pigeon({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={17} ry={11} fill={MUTED} />
      <path
        d={`M ${x - 4} ${y - 4} Q ${x - 14} ${y + 2} ${x - 26} ${y + 6} L ${x - 10} ${y + 8} Z`}
        fill="currentColor"
        fillOpacity={0.45}
      />
      <circle cx={x + 15} cy={y - 10} r={7} fill={MUTED} />
      <circle cx={x + 17} cy={y - 11} r={1.6} fill="currentColor" />
      <polygon
        points={`${x + 21},${y - 12} ${x + 28},${y - 9} ${x + 21},${y - 7}`}
        fill={ORANGE}
      />
    </g>
  );
}

/** A row of four pigeonholes holding five pigeons: one, two, one and one. */
export function Pigeonholes({ caption }: { caption?: string }) {
  const counts = [1, 2, 1, 1];
  const holeW = 112;
  const left = 46;
  const top = 50;
  const holeH = 92;
  return (
    <Figure caption={caption}>
      <Svg
        width={560}
        height={200}
        label="A row of four pigeonholes, numbered 1 to 4, in a wooden frame. Holes 1, 3 and 4 each hold one pigeon. Hole 2, outlined in orange, holds two pigeons side by side."
      >
        {counts.map((n, k) => {
          const x = left + k * (holeW + 10);
          const crowded = n >= 2;
          return (
            <g key={k}>
              <rect
                x={x}
                y={top}
                width={holeW}
                height={holeH}
                rx={6}
                fill="currentColor"
                fillOpacity={0.06}
                stroke={crowded ? ORANGE : "currentColor"}
                strokeOpacity={crowded ? 1 : 0.5}
                strokeWidth={crowded ? 3 : 2}
              />
              {Array.from({ length: n }, (_, i) => (
                <Pigeon
                  key={i}
                  x={x + holeW / 2 - 2 + (n === 2 ? (i === 0 ? -24 : 24) : 0)}
                  y={top + holeH - 22}
                />
              ))}
              <Words x={x + holeW / 2} y={top - 14} size={15}>
                {`${k + 1}`}
              </Words>
              <Words
                x={x + holeW / 2}
                y={top + holeH + 30}
                size={13}
                color={crowded ? ORANGE : MUTED}
              >
                {n === 1 ? "1 pigeon" : `${n} pigeons`}
              </Words>
            </g>
          );
        })}
      </Svg>
    </Figure>
  );
}

/** the five points in the 2 by 2 square; the last two share the top right small square */
const POINTS = [
  [0.3, 0.4],
  [1.6, 0.3],
  [0.5, 1.5],
  [1.4, 1.7],
  [1.8, 1.2],
] as const;

/**
 * A 2 by 2 square cut into four 1 by 1 squares, with five points in it. Two of them, (1.4, 1.7)
 * and (1.8, 1.2), share the top right small square, which is shaded, and the segment between them
 * is marked with its length, about 0.64.
 */
export function FivePoints({ caption }: { caption?: string }) {
  const [p, q] = [POINTS[3], POINTS[4]];
  return (
    <Figure caption={caption}>
      <Plot
        id="five-points"
        x={[0, 2]}
        y={[0, 2]}
        unit={130}
        step={0.5}
        every={0.5}
        curves={[]}
        label="A square from (0, 0) to (2, 2), cut by lines at x = 1 and y = 1 into four 1 by 1 squares. Five points lie in it: (0.3, 0.4) and (1.6, 0.3) in the bottom squares, (0.5, 1.5) in the top left square, and (1.4, 1.7) and (1.8, 1.2) in the top right square, which is shaded. A segment joins those last two points, marked 0.64."
      >
        {({ px, py }) => (
          <g>
            <rect
              x={px(1)}
              y={py(2)}
              width={px(2) - px(1)}
              height={py(1) - py(2)}
              fill={ORANGE}
              fillOpacity={0.15}
            />
            <rect
              x={px(0)}
              y={py(2)}
              width={px(2) - px(0)}
              height={py(0) - py(2)}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            />
            <g stroke={PURPLE} strokeWidth={2.5}>
              <line x1={px(1)} x2={px(1)} y1={py(0)} y2={py(2)} />
              <line x1={px(0)} x2={px(2)} y1={py(1)} y2={py(1)} />
            </g>
            <line
              x1={px(p[0])}
              y1={py(p[1])}
              x2={px(q[0])}
              y2={py(q[1])}
              stroke={ORANGE}
              strokeWidth={3}
            />
            {POINTS.map(([x, y], k) => (
              <Spot
                key={k}
                x={px(x)}
                y={py(y)}
                color={k >= 3 ? ORANGE : BLUE}
              />
            ))}
            <Words
              x={px(1.72)}
              y={py(1.62)}
              anchor="start"
              color={ORANGE}
              size={14}
            >
              0.64
            </Words>
          </g>
        )}
      </Plot>
    </Figure>
  );
}

/** an arc from (x1, y) up and over to (x2, y), with its head at the second end */
function Hop({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const lift = Math.min(110, 18 + Math.abs(x2 - x1) * 0.42);
  const cx = (x1 + x2) / 2;
  const cy = y - lift;
  // the direction the curve arrives in, from the control point to the end
  const dx = x2 - cx;
  const dy = y - cy;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const bx = x2 - ux * 11;
  const by = y - uy * 11;
  return (
    <g>
      <path
        d={`M ${x1} ${y} Q ${cx} ${cy} ${x2 - ux * 8} ${y - uy * 8}`}
        fill="none"
        stroke={BLUE}
        strokeWidth={2.5}
      />
      <polygon
        points={`${x2},${y} ${bx - uy * 5},${by + ux * 5} ${bx + uy * 5},${by - ux * 5}`}
        fill={BLUE}
      />
    </g>
  );
}

/**
 * Rooms 1 to 10 of a hotel with a room for every positive integer. Arcs show the guests in rooms 1
 * to 5 moving to rooms 2, 4, 6, 8 and 10. Afterwards the even rooms are full and the odd rooms are
 * empty.
 */
export function HotelRooms({ caption }: { caption?: string }) {
  const left = 26;
  const w = 50;
  const gap = 4;
  const top = 132;
  const h = 46;
  const mid = (n: number) => left + (n - 1) * (w + gap) + w / 2;
  return (
    <Figure caption={caption}>
      <Svg
        width={600}
        height={240}
        label="A row of hotel rooms numbered 1 to 10, with dots after them for the rooms that go on for ever. Arcs above the rooms show the guest in room 1 moving to room 2, 2 to 4, 3 to 6, 4 to 8 and 5 to 10. After the move, the even rooms are shaded green as full and the odd rooms are outlined in orange as empty."
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <Hop key={n} x1={mid(n) - 6} x2={mid(2 * n) + 6} y={top - 4} />
        ))}
        {Array.from({ length: 10 }, (_, k) => {
          const n = k + 1;
          const full = n % 2 === 0;
          return (
            <g key={n}>
              <rect
                x={left + k * (w + gap)}
                y={top}
                width={w}
                height={h}
                rx={4}
                fill={full ? GREEN : "var(--color-fd-card)"}
                fillOpacity={full ? 0.35 : 1}
                stroke={full ? GREEN : ORANGE}
                strokeWidth={full ? 2 : 2.5}
              />
              <Words x={mid(n)} y={top + 29} size={15}>
                {`${n}`}
              </Words>
              <Words
                x={mid(n)}
                y={top + h + 22}
                size={11}
                color={full ? MUTED : ORANGE}
              >
                {full ? "full" : "empty"}
              </Words>
            </g>
          );
        })}
        <Words
          x={left + 10 * (w + gap) + 6}
          y={top + 29}
          size={18}
          anchor="start"
        >
          …
        </Words>
        <Words x={300} y={top + h + 50} size={13} color={MUTED}>
          the guests from rooms 6 to 10 move on to rooms 12 to 20, further along
        </Words>
      </Svg>
    </Figure>
  );
}
