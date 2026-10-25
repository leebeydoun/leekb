import type { ReactNode } from "react";
import { Figure } from "../figure";
import {
  BLUE,
  CARD,
  CARD_EDGE,
  ORANGE,
  PURPLE,
  Svg,
  Words,
  type Pt,
} from "../illustrations";

/**
 * Pictures for the Determinants of order 3 guide: a box of chocolates before and after a squash,
 * the unit cube and the slanted box a matrix sends it to, and the diagonal shortcut for a 3 by 3
 * determinant. The slanted view of space is shared with the Properties guide.
 */

export type Pt3 = readonly [number, number, number];

/**
 * A slanted view of space, as in the Points in space pictures: x runs right, z runs up, and y runs
 * back, drawn up and to the right. Returns the page position of a point, given the size of a unit
 * and where the origin sits, with helpers for lines, polygons and directions on the page.
 */
export function view(unit: number, origin: Pt) {
  const back: Pt = [0.7 * Math.cos(0.7), 0.7 * Math.sin(0.7)];
  const at = ([x, y, z]: Pt3): Pt => [
    origin[0] + unit * (x + back[0] * y),
    origin[1] - unit * (z + back[1] * y),
  ];
  const line = (p: Pt3, q: Pt3) => {
    const [x1, y1] = at(p);
    const [x2, y2] = at(q);
    return { x1, y1, x2, y2 };
  };
  const points = (ps: Pt3[]) => ps.map((p) => at(p).join(",")).join(" ");
  // the direction on the page from p towards q, as a unit vector
  const toward = (p: Pt3, q: Pt3): Pt => {
    const [x1, y1] = at(p);
    const [x2, y2] = at(q);
    const length = Math.hypot(x2 - x1, y2 - y1);
    return [(x2 - x1) / length, (y2 - y1) / length];
  };
  return { at, line, points, toward };
}

export const add = (...ps: Pt3[]): Pt3 => [
  ps.reduce((s, p) => s + p[0], 0),
  ps.reduce((s, p) => s + p[1], 0),
  ps.reduce((s, p) => s + p[2], 0),
];
export const times = (c: number, [x, y, z]: Pt3): Pt3 => [c * x, c * y, c * z];
export const O3: Pt3 = [0, 0, 0];

/** the eight corners of the box on p, q and r, keyed by which edges were added */
export function corners(p: Pt3, q: Pt3, r: Pt3) {
  return {
    o: O3,
    p,
    q,
    r,
    pq: add(p, q),
    pr: add(p, r),
    qr: add(q, r),
    pqr: add(p, q, r),
  };
}

/** the twelve edges of the box on p, q and r */
export function edges(p: Pt3, q: Pt3, r: Pt3): [Pt3, Pt3][] {
  const c = corners(p, q, r);
  return [
    [c.o, c.p],
    [c.o, c.q],
    [c.o, c.r],
    [c.p, c.pq],
    [c.p, c.pr],
    [c.q, c.pq],
    [c.q, c.qr],
    [c.r, c.pr],
    [c.r, c.qr],
    [c.pq, c.pqr],
    [c.pr, c.pqr],
    [c.qr, c.pqr],
  ];
}

/** an arrowhead at `tip`, pointing along the unit vector `dir` */
export function Head({ tip, dir, color }: { tip: Pt; dir: Pt; color: string }) {
  const [x, y] = tip;
  const [dx, dy] = dir;
  const back = 12;
  const half = 5;
  return (
    <polygon
      points={`${x},${y} ${x - dx * back - dy * half},${y - dy * back + dx * half} ${x - dx * back + dy * half},${y - dy * back - dx * half}`}
      fill={color}
    />
  );
}

/** a name such as E¹ or A², with the letter in italics */
export const Col = ({ letter, n }: { letter: string; n: string }) => (
  <>
    <tspan fontStyle="italic">{letter}</tspan>
    {n}
  </>
);

/** an arrow in space from p to q, drawn in the given view, with its head at q */
export function Arrow3({
  v,
  from,
  to,
  color,
  width = 3,
}: {
  v: ReturnType<typeof view>;
  from: Pt3;
  to: Pt3;
  color: string;
  width?: number;
}) {
  const [x2, y2] = v.at(to);
  const dir = v.toward(from, to);
  const [x1, y1] = v.at(from);
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2 - dir[0] * 8}
        y2={y2 - dir[1] * 8}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
      <Head tip={[x2, y2]} dir={dir} color={color} />
    </g>
  );
}

const LID = "#7c4a2d";
const LID_DARK = "#5a3420";
const LID_SIDE = "#9a5f3b";

/** a closed box of chocolates on the edges p, q and r, with a gold ribbon and a bow on its lid */
function ChocolateBox({
  v,
  p,
  q,
  r,
}: {
  v: ReturnType<typeof view>;
  p: Pt3;
  q: Pt3;
  r: Pt3;
}) {
  const c = corners(p, q, r);
  const mid = (a: Pt3, b: Pt3) => times(0.5, add(a, b));
  const face = {
    stroke: LID_DARK,
    strokeWidth: 2,
    strokeLinejoin: "round" as const,
  };
  const ribbon = {
    stroke: CARD,
    strokeWidth: 7,
    strokeLinecap: "butt" as const,
  };
  const centre = v.at(mid(c.r, c.pqr));
  return (
    <g>
      <polygon points={v.points([c.o, c.p, c.pr, c.r])} fill={LID} {...face} />
      <polygon
        points={v.points([c.p, c.pq, c.pqr, c.pr])}
        fill={LID_DARK}
        {...face}
      />
      <polygon
        points={v.points([c.r, c.pr, c.pqr, c.qr])}
        fill={LID_SIDE}
        {...face}
      />
      {/* the ribbon: once round the lid each way, and down the front */}
      <line {...v.line(mid(c.r, c.qr), mid(c.pr, c.pqr))} {...ribbon} />
      <line {...v.line(mid(c.r, c.pr), mid(c.qr, c.pqr))} {...ribbon} />
      <line {...v.line(mid(c.r, c.pr), mid(O3, c.p))} {...ribbon} />
      <line {...v.line(mid(c.pr, c.pqr), mid(c.p, c.pq))} {...ribbon} />
      <g fill={CARD} stroke={CARD_EDGE} strokeWidth={1.5}>
        <ellipse
          cx={centre[0] - 11}
          cy={centre[1] - 4}
          rx={12}
          ry={6}
          transform={`rotate(-20 ${centre[0] - 11} ${centre[1] - 4})`}
        />
        <ellipse
          cx={centre[0] + 11}
          cy={centre[1] - 4}
          rx={12}
          ry={6}
          transform={`rotate(20 ${centre[0] + 11} ${centre[1] - 4})`}
        />
        <circle cx={centre[0]} cy={centre[1] - 2} r={5} />
      </g>
    </g>
  );
}

/**
 * A box of chocolates 3.2 wide, 2.2 deep and 1.4 high, and the same box after a squash: its lid has
 * been pushed 0.9 to the left and pressed down to height 0.95, so the box leans.
 */
export function ChocolateBoxes({ caption }: { caption?: string }) {
  const before = view(48, [40, 196]);
  const after = view(48, [350, 196]);
  const p: Pt3 = [3.2, 0, 0];
  const q: Pt3 = [0, 2.2, 0];
  return (
    <Figure caption={caption}>
      <Svg
        width={600}
        height={240}
        label="On the left, a closed box of chocolates with square corners, tied with a gold ribbon and a bow. On the right, the same box after a squash: the lid has been pushed sideways and pressed down, so the front and sides are slanted parallelograms and the box is lower."
      >
        <ChocolateBox v={before} p={p} q={q} r={[0, 0, 1.4]} />
        <ChocolateBox v={after} p={p} q={q} r={[-0.9, 0, 0.95]} />
        <Words size={16} x={before.at([1.6, 0, 0])[0]} y={226}>
          before
        </Words>
        <Words size={16} x={after.at([1.6, 0, 0])[0]} y={226}>
          after the squash
        </Words>
      </Svg>
    </Figure>
  );
}

/** a see-through box on p, q and r: faint faces, thin edges, and its three edges from O as arrows */
function SeeThroughBox({
  v,
  p,
  q,
  r,
  names,
}: {
  v: ReturnType<typeof view>;
  p: Pt3;
  q: Pt3;
  r: Pt3;
  names: { text: ReactNode; shift: Pt }[];
}) {
  const c = corners(p, q, r);
  const colors = [BLUE, ORANGE, PURPLE];
  return (
    <g>
      <polygon
        points={v.points([c.o, c.p, c.pr, c.r])}
        fill={BLUE}
        fillOpacity={0.08}
      />
      <polygon
        points={v.points([c.r, c.pr, c.pqr, c.qr])}
        fill={PURPLE}
        fillOpacity={0.1}
      />
      <polygon
        points={v.points([c.p, c.pq, c.pqr, c.pr])}
        fill={ORANGE}
        fillOpacity={0.08}
      />
      <g stroke="currentColor" strokeOpacity={0.55} strokeWidth={1.5}>
        {edges(p, q, r)
          .slice(3)
          .map(([a, b], i) => (
            <line key={i} {...v.line(a, b)} />
          ))}
      </g>
      {[p, q, r].map((tip, i) => (
        <Arrow3 key={i} v={v} from={O3} to={tip} color={colors[i]!} />
      ))}
      {[p, q, r].map((tip, i) => {
        const [x, y] = v.at(tip);
        const { text, shift } = names[i]!;
        return (
          <Words
            key={i}
            size={17}
            x={x + shift[0]}
            y={y + shift[1]}
            color={colors[i]}
          >
            {text}
          </Words>
        );
      })}
      <circle cx={v.at(O3)[0]} cy={v.at(O3)[1]} r={3.5} fill="currentColor" />
    </g>
  );
}

/**
 * The unit cube with edges E¹, E² and E³ from O, an arrow, and the slanted box on the columns
 * A¹ = (2.2, 0, 0.3), A² = (0.5, 1.8, 0) and A³ = (0.7, 0.4, 1.6) that a matrix sends it to.
 */
export function CubeToBox({ caption }: { caption?: string }) {
  const cube = view(64, [44, 226]);
  const box = view(64, [262, 236]);
  const a1: Pt3 = [2.2, 0, 0.3];
  const a2: Pt3 = [0.5, 1.8, 0];
  const a3: Pt3 = [0.7, 0.4, 1.6];
  const [ax, ay] = [190, 160];
  return (
    <Figure caption={caption}>
      <Svg
        width={600}
        height={270}
        label="On the left, the unit cube, with its three edges from O drawn as arrows: E¹ to the right, E² going back and E³ going up. An arrow labelled X ↦ AX points to the right, to a slanted box whose three edges from O are the columns A¹, A² and A³. Every face of the slanted box is a parallelogram."
      >
        <SeeThroughBox
          v={cube}
          p={[1, 0, 0]}
          q={[0, 1, 0]}
          r={[0, 0, 1]}
          names={[
            { text: <Col letter="E" n="¹" />, shift: [4, 24] },
            { text: <Col letter="E" n="²" />, shift: [-4, -12] },
            { text: <Col letter="E" n="³" />, shift: [-16, -6] },
          ]}
        />
        <Words size={17} x={cube.at(O3)[0] - 12} y={cube.at(O3)[1] + 20}>
          <tspan fontStyle="italic">O</tspan>
        </Words>

        <line
          x1={ax}
          y1={ay}
          x2={ax + 54}
          y2={ay}
          stroke="currentColor"
          strokeWidth={2}
        />
        <Head tip={[ax + 62, ay]} dir={[1, 0]} color="currentColor" />
        <Words size={16} x={ax + 30} y={ay - 14}>
          <tspan fontStyle="italic">X</tspan> ↦{" "}
          <tspan fontStyle="italic">AX</tspan>
        </Words>

        <SeeThroughBox
          v={box}
          p={a1}
          q={a2}
          r={a3}
          names={[
            { text: <Col letter="A" n="¹" />, shift: [6, 26] },
            { text: <Col letter="A" n="²" />, shift: [24, 20] },
            { text: <Col letter="A" n="³" />, shift: [-18, -6] },
          ]}
        />
        <Words size={17} x={box.at(O3)[0] - 12} y={box.at(O3)[1] + 20}>
          <tspan fontStyle="italic">O</tspan>
        </Words>
      </Svg>
    </Figure>
  );
}

const SARRUS: number[][] = [
  [2, 1, -2],
  [3, -1, -2],
  [1, 0, 2],
];

const minus = (n: number) => (n < 0 ? `−${-n}` : `${n}`);

/**
 * The diagonal shortcut on the matrix A of the guide: A with its first two columns copied again on
 * the right, the three diagonals running down to the right in blue (each a product with a plus
 * sign) and the three running up to the right in orange (each a product with a minus sign).
 */
export function SarrusDiagonals({ caption }: { caption?: string }) {
  const X0 = 70;
  const Y0 = 62;
  const DX = 64;
  const DY = 54;
  const x = (c: number) => X0 + c * DX;
  const y = (r: number) => Y0 + r * DY;
  const reach = 0.32;
  const diagonal = (c: number, down: boolean) => {
    const [r0, r1] = down ? [0, 2] : [2, 0];
    return {
      x1: x(c - reach),
      y1: y(r0 + (down ? -reach : reach)),
      x2: x(c + 2 + reach),
      y2: y(r1 + (down ? reach : -reach)),
    };
  };
  return (
    <Figure caption={caption}>
      <Svg
        width={440}
        height={236}
        label="The matrix with rows 2, 1, −2; 3, −1, −2; and 1, 0, 2, written between bars, with its first two columns copied again to its right in grey. Three blue lines run down to the right through three entries each, marked plus at their lower ends. Three orange lines run up to the right through three entries each, marked minus at their upper ends."
      >
        <g strokeWidth={7} strokeLinecap="round" strokeOpacity={0.3}>
          {[0, 1, 2].map((c) => (
            <line key={`d${c}`} {...diagonal(c, true)} stroke={BLUE} />
          ))}
          {[0, 1, 2].map((c) => (
            <line key={`u${c}`} {...diagonal(c, false)} stroke={ORANGE} />
          ))}
        </g>
        <g stroke="currentColor" strokeWidth={2}>
          <line x1={x(-0.5)} x2={x(-0.5)} y1={y(-0.45)} y2={y(2.45)} />
          <line x1={x(2.5)} x2={x(2.5)} y1={y(-0.45)} y2={y(2.45)} />
        </g>
        {[0, 1, 2].map((r) =>
          [0, 1, 2, 3, 4].map((c) => (
            <Words
              key={`${r}${c}`}
              size={20}
              x={x(c)}
              y={y(r) + 7}
              color={c < 3 ? "currentColor" : "#9ca3af"}
            >
              {minus(SARRUS[r]![c % 3]!)}
            </Words>
          )),
        )}
        {[0, 1, 2].map((c) => (
          <g key={c}>
            <Words
              size={20}
              x={x(c + 2 + reach) + 12}
              y={y(2 + reach) + 16}
              color={BLUE}
            >
              +
            </Words>
            <Words
              size={20}
              x={x(c + 2 + reach) + 12}
              y={y(-reach) - 6}
              color={ORANGE}
            >
              −
            </Words>
          </g>
        ))}
      </Svg>
    </Figure>
  );
}
