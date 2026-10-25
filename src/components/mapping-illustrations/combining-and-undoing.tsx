import { Figure } from "../figure";
import {
  BLUE,
  CARDBOARD,
  CARDBOARD_EDGE,
  ERASER,
  ORANGE,
  PENCIL_YELLOW,
  PURPLE,
  Svg,
  Words,
} from "../illustrations";
import { Arrow, GREEN, MUTED } from "../function-illustrations/plot";

/**
 * Pictures for the guide Combining and undoing mappings. A present boxed and then wrapped, and
 * unwrapped and then unboxed; arrow pictures of a mapping followed by a second one, children to
 * coat pegs to peg colours, beside the single mapping they make; and the arrows of a cloakroom
 * mapping from coats to tickets beside the same arrows turned round, its inverse.
 */

const MUG = "#60a5fa";
const MUG_EDGE = "#1d4ed8";

/**
 * The opening scene: a mug, the mug in an open box, and the box wrapped in paper with a ribbon.
 * Arrows along the top go forwards (first box it, then wrap it), and arrows along the bottom go
 * back (first unwrap it, then take it out of the box).
 */
export function GiftWrap({ caption }: { caption?: string }) {
  const mid = 132;
  const mug = (cx: number, top: number, scale = 1) => (
    <g>
      <path
        d={`M ${cx + 22 * scale} ${top + 14 * scale} c ${18 * scale} 0 ${18 * scale} ${26 * scale} 0 ${26 * scale}`}
        fill="none"
        stroke={MUG_EDGE}
        strokeWidth={5 * scale}
      />
      <rect
        x={cx - 24 * scale}
        y={top}
        width={48 * scale}
        height={54 * scale}
        rx={7 * scale}
        fill={MUG}
        stroke={MUG_EDGE}
        strokeWidth={2.5}
      />
    </g>
  );
  const box = { cx: 290, w: 100, h: 72 };
  const parcel = { cx: 490, w: 100, h: 72 };
  return (
    <Figure caption={caption}>
      <Svg
        width={580}
        height={270}
        label="Three pictures in a row: a blue mug; the same mug standing in an open cardboard box; and a closed box wrapped in pink paper with a yellow ribbon and bow. Arrows along the top go from left to right, marked 1, box it, and 2, wrap it. Arrows along the bottom go from right to left, marked 1, unwrap it, and 2, take it out: undoing starts with the step that was done last."
      >
        {/* the mug */}
        {mug(90, mid - 27)}

        {/* the mug in an open box */}
        {mug(box.cx, mid - 40)}
        <polygon
          points={`${box.cx - box.w / 2},${mid - 12} ${box.cx - box.w / 2 - 22},${mid - 34} ${box.cx - box.w / 2 + 12},${mid - 34} ${box.cx - box.w / 2 + 30},${mid - 12}`}
          fill={CARDBOARD}
          stroke={CARDBOARD_EDGE}
          strokeWidth={2}
        />
        <polygon
          points={`${box.cx + box.w / 2},${mid - 12} ${box.cx + box.w / 2 + 22},${mid - 34} ${box.cx + box.w / 2 - 12},${mid - 34} ${box.cx + box.w / 2 - 30},${mid - 12}`}
          fill={CARDBOARD}
          stroke={CARDBOARD_EDGE}
          strokeWidth={2}
        />
        <rect
          x={box.cx - box.w / 2}
          y={mid - 12}
          width={box.w}
          height={box.h}
          fill={CARDBOARD}
          stroke={CARDBOARD_EDGE}
          strokeWidth={2.5}
        />

        {/* the wrapped parcel */}
        <rect
          x={parcel.cx - parcel.w / 2}
          y={mid - 12}
          width={parcel.w}
          height={parcel.h}
          rx={4}
          fill={ERASER}
          stroke="#be185d"
          strokeWidth={2.5}
        />
        <rect
          x={parcel.cx - 6}
          y={mid - 12}
          width={12}
          height={parcel.h}
          fill={PENCIL_YELLOW}
        />
        <rect
          x={parcel.cx - parcel.w / 2}
          y={mid + parcel.h / 2 - 18}
          width={parcel.w}
          height={12}
          fill={PENCIL_YELLOW}
        />
        <path
          d={`M ${parcel.cx} ${mid - 12} c -26 -24 -34 4 0 0 c 26 -24 34 4 0 0`}
          fill={PENCIL_YELLOW}
          stroke="#ca8a04"
          strokeWidth={2}
        />

        {/* forwards along the top */}
        <Arrow x1={140} y1={46} x2={222} y2={46} color={BLUE} />
        <Arrow x1={358} y1={46} x2={430} y2={46} color={BLUE} />
        <Words x={181} y={32} size={14} color={BLUE}>
          1. box it
        </Words>
        <Words x={394} y={32} size={14} color={BLUE}>
          2. wrap it
        </Words>

        {/* back along the bottom */}
        <Arrow x1={430} y1={232} x2={358} y2={232} color={ORANGE} />
        <Arrow x1={222} y1={232} x2={140} y2={232} color={ORANGE} />
        <Words x={394} y={258} size={14} color={ORANGE}>
          1. unwrap it
        </Words>
        <Words x={181} y={258} size={14} color={ORANGE}>
          2. take it out
        </Words>
      </Svg>
    </Figure>
  );
}

type Column = { title: string; items: string[] };
type Links = { pairs: [number, number][]; color: string; name?: string };

/**
 * An arrow picture with two or more columns of elements side by side, and a set of arrows from
 * each column to the next one. Shorter columns are centred against the longest.
 */
function ArrowColumns({
  columns,
  links,
  label,
  width,
}: {
  columns: Column[];
  links: Links[];
  label: string;
  width: number;
}) {
  const gap = 36;
  const top = 64;
  const rows = Math.max(...columns.map((c) => c.items.length));
  const height = top + rows * gap + 10;
  const margin = 50;
  const colX = (k: number) =>
    margin + ((width - 2 * margin) * k) / (columns.length - 1);
  const rowY = (k: number, i: number) =>
    top + (i + (rows - columns[k]!.items.length) / 2) * gap + gap / 2;

  return (
    <Svg width={width} height={height} label={label}>
      {columns.map((c, k) => (
        <g key={k}>
          <Words x={colX(k)} y={24} size={14} color={MUTED}>
            {c.title}
          </Words>
          <rect
            x={colX(k) - 34}
            y={top + ((rows - c.items.length) / 2) * gap}
            width={68}
            height={c.items.length * gap}
            rx={26}
            fill="currentColor"
            fillOpacity={0.05}
            stroke="currentColor"
            strokeOpacity={0.4}
          />
        </g>
      ))}
      {links.map((l, k) => (
        <g key={k}>
          {l.name && (
            <Words
              x={(colX(k) + colX(k + 1)) / 2}
              y={48}
              size={15}
              color={l.color}
            >
              {l.name}
            </Words>
          )}
          {l.pairs.map(([i, j]) => (
            <Arrow
              key={`${i}-${j}`}
              x1={colX(k) + 26}
              y1={rowY(k, i)}
              x2={colX(k + 1) - 28}
              y2={rowY(k + 1, j)}
              color={l.color}
            />
          ))}
        </g>
      ))}
      {columns.map((c, k) =>
        c.items.map((t, i) => (
          <Words key={`${k}-${i}`} x={colX(k)} y={rowY(k, i) + 5} size={15}>
            {t}
          </Words>
        )),
      )}
    </Svg>
  );
}

/**
 * Children to coat pegs (f), then pegs to the colour of the peg (g), beside the composite g ∘ f
 * from children straight to colours.
 */
export function PegChain({ caption }: { caption?: string }) {
  const children = { title: "children", items: ["Ana", "Ben", "Cal"] };
  const colours = { title: "colours", items: ["red", "blue"] };
  return (
    <Figure caption={caption} className="flex flex-wrap justify-center gap-6">
      <div className="w-full max-w-[380px]">
        <ArrowColumns
          width={380}
          columns={[
            children,
            { title: "pegs", items: ["1", "2", "3", "4"] },
            colours,
          ]}
          links={[
            {
              name: "f",
              color: BLUE,
              pairs: [
                [0, 1],
                [1, 3],
                [2, 0],
              ],
            },
            {
              name: "g",
              color: ORANGE,
              pairs: [
                [0, 0],
                [1, 0],
                [2, 1],
                [3, 1],
              ],
            },
          ]}
          label="Three columns. Children Ana, Ben and Cal; pegs 1, 2, 3 and 4; colours red and blue. Blue arrows labelled f go from Ana to peg 2, Ben to peg 4 and Cal to peg 1. Orange arrows labelled g go from pegs 1 and 2 to red and from pegs 3 and 4 to blue."
        />
      </div>
      <div className="w-full max-w-[240px]">
        <ArrowColumns
          width={240}
          columns={[children, colours]}
          links={[
            {
              name: "g ∘ f",
              color: PURPLE,
              pairs: [
                [0, 0],
                [1, 1],
                [2, 0],
              ],
            },
          ]}
          label="Two columns, children and colours, with purple arrows labelled g after f: Ana goes to red, Ben to blue and Cal to red."
        />
      </div>
    </Figure>
  );
}

/**
 * The cloakroom mapping f from coat, hat and scarf to tickets 1, 2 and 3, beside the same arrows
 * turned round: the inverse f⁻¹ from tickets back to things.
 */
export function TicketArrows({ caption }: { caption?: string }) {
  const things = { title: "things", items: ["coat", "hat", "scarf"] };
  const tickets = { title: "tickets", items: ["1", "2", "3"] };
  return (
    <Figure caption={caption} className="flex flex-wrap justify-center gap-6">
      <div className="w-full max-w-[250px]">
        <ArrowColumns
          width={250}
          columns={[things, tickets]}
          links={[
            {
              name: "f",
              color: BLUE,
              pairs: [
                [0, 1],
                [1, 2],
                [2, 0],
              ],
            },
          ]}
          label="Arrows labelled f from things to tickets: the coat goes to ticket 2, the hat to ticket 3 and the scarf to ticket 1. Each ticket has exactly one arrow arriving."
        />
      </div>
      <div className="w-full max-w-[250px]">
        <ArrowColumns
          width={250}
          columns={[tickets, things]}
          links={[
            {
              name: "f⁻¹",
              color: GREEN,
              pairs: [
                [0, 2],
                [1, 0],
                [2, 1],
              ],
            },
          ]}
          label="The same arrows turned round, labelled f inverse, from tickets to things: ticket 1 goes to the scarf, ticket 2 to the coat and ticket 3 to the hat."
        />
      </div>
    </Figure>
  );
}
