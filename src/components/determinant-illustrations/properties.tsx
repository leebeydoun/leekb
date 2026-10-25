import type { ReactNode } from "react";
import { Figure } from "../figure";
import {
  BLUE,
  ORANGE,
  PURPLE,
  Svg,
  WOOD,
  WOOD_DARK,
  Words,
  type Pt,
} from "../illustrations";
import {
  add,
  Arrow3,
  Col,
  edges,
  Head,
  O3,
  times,
  view,
  type Pt3,
} from "./order-three";

/**
 * Pictures for the Properties and quick calculation guide: a shelf unit pushed sideways, a box cut
 * into layers before and after the layers slide, right-handed and left-handed sets of three
 * columns, and three columns lying in one plane through O.
 */

const BOOKS = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#9333ea",
  "#ea580c",
  "#0d9488",
];

/**
 * A wooden shelf unit seen from the front, 150 wide and 180 high with three shelves of books, and
 * the same unit pushed sideways at the top by 60. Every point moves sideways in proportion to its
 * height, so each shelf slides along without changing its length, and the books lean with it.
 */
export function ShelfPush({ caption }: { caption?: string }) {
  const W = 150;
  const H = 180;
  const FLOOR = 214;
  const push = 60;
  // a point given by its distance across and its height, on the page, for a unit pushed by `by`
  const unit =
    (left: number, by: number) =>
    (x: number, h: number): Pt => [left + x + (by * h) / H, FLOOR - h];
  const draw = (left: number, by: number) => {
    const at = unit(left, by);
    const poly = (ps: Pt[]) => ps.map((p) => p.join(",")).join(" ");
    const shelf = (h: number) => (
      <polygon
        points={poly([at(0, h), at(W, h), at(W, h + 7), at(0, h + 7)])}
        fill={WOOD}
        stroke={WOOD_DARK}
        strokeWidth={1.5}
      />
    );
    // books on the shelf at height h: widths and heights in turn
    const books = (h: number, row: number) => {
      const sizes = [
        [14, 40],
        [10, 46],
        [16, 36],
        [12, 44],
        [14, 40],
        [11, 34],
      ];
      let x = 12 + row * 6;
      return sizes.map(([w, t], i) => {
        const b = (
          <polygon
            key={i}
            points={poly([
              at(x, h + 7),
              at(x + w!, h + 7),
              at(x + w!, h + 7 + t!),
              at(x, h + 7 + t!),
            ])}
            fill={BOOKS[(i + row) % BOOKS.length]}
            stroke="#1f2937"
            strokeWidth={1}
          />
        );
        x += w! + 3;
        return b;
      });
    };
    return (
      <g>
        <polygon
          points={poly([at(0, 0), at(W, 0), at(W, H), at(0, H)])}
          fill="#f3e3c8"
          stroke={WOOD_DARK}
          strokeWidth={2}
        />
        {[0, 1, 2].map((row) => (
          <g key={row}>{books(row * 58, row)}</g>
        ))}
        {[0, 58, 116, 173].map((h) => (
          <g key={h}>{shelf(h)}</g>
        ))}
        <polygon
          points={poly([at(0, 0), at(7, 0), at(7, H), at(0, H)])}
          fill={WOOD}
          stroke={WOOD_DARK}
          strokeWidth={1.5}
        />
        <polygon
          points={poly([at(W - 7, 0), at(W, 0), at(W, H), at(W - 7, H)])}
          fill={WOOD}
          stroke={WOOD_DARK}
          strokeWidth={1.5}
        />
      </g>
    );
  };
  const top = unit(330, push)(W, H + 4);
  return (
    <Figure caption={caption}>
      <Svg
        width={600}
        height={250}
        label="On the left, a wooden shelf unit standing square, with books on three shelves. On the right, the same unit pushed sideways at the top, so its sides lean. Each shelf has slid sideways, the top one furthest, but every shelf is the same length as before and the shelves are the same distance apart."
      >
        <line
          x1={20}
          x2={580}
          y1={FLOOR + 1}
          y2={FLOOR + 1}
          stroke="currentColor"
          strokeOpacity={0.4}
          strokeWidth={2}
        />
        {draw(80, 0)}
        {draw(330, push)}
        <line
          x1={top[0] - 70}
          y1={top[1] - 14}
          x2={top[0] - 18}
          y2={top[1] - 14}
          stroke={ORANGE}
          strokeWidth={3}
        />
        <Head tip={[top[0] - 8, top[1] - 14]} dir={[1, 0]} color={ORANGE} />
        <Words size={16} x={155} y={240}>
          standing square
        </Words>
        <Words size={16} x={435} y={240}>
          pushed at the top
        </Words>
      </Svg>
    </Figure>
  );
}

/** a see-through box on p, q and r, cut into `layers` slices parallel to the face on p and q */
function LayeredBox({
  v,
  p,
  q,
  r,
  layers,
}: {
  v: ReturnType<typeof view>;
  p: Pt3;
  q: Pt3;
  r: Pt3;
  layers: number;
}) {
  const shades = [BLUE, PURPLE];
  return (
    <g>
      {Array.from({ length: layers }, (_, i) => {
        const low = times(i / layers, r);
        const high = times((i + 1) / layers, r);
        const c = shades[i % 2]!;
        return (
          <g key={i}>
            <polygon
              points={v.points([low, add(low, p), add(high, p), high])}
              fill={c}
              fillOpacity={0.16}
            />
            <polygon
              points={v.points([
                add(low, p),
                add(low, p, q),
                add(high, p, q),
                add(high, p),
              ])}
              fill={c}
              fillOpacity={0.24}
            />
            <polygon
              points={v.points([
                high,
                add(high, p),
                add(high, p, q),
                add(high, q),
              ])}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.35}
              strokeWidth={1}
            />
          </g>
        );
      })}
      <g stroke="currentColor" strokeOpacity={0.6} strokeWidth={1.5}>
        {edges(p, q, r).map(([a, b], i) => (
          <line key={i} {...v.line(a, b)} />
        ))}
      </g>
    </g>
  );
}

/**
 * The box on P = (2.4, 0, 0), Q = (0, 1.6, 0) and R = (0, 0, 2), cut into four layers parallel to the
 * face on P and Q, and the box on P, Q and R + cP with c = 0.5, where each layer has slid along P.
 */
export function ShearedBox({ caption }: { caption?: string }) {
  const left = view(56, [40, 230]);
  const right = view(56, [300, 230]);
  const p: Pt3 = [2.4, 0, 0];
  const q: Pt3 = [0, 1.6, 0];
  const r: Pt3 = [0, 0, 2];
  const slid: Pt3 = add(r, times(0.5, p));
  const name = (
    v: ReturnType<typeof view>,
    at: Pt3,
    text: ReactNode,
    shift: Pt,
    color: string,
  ) => (
    <Words
      size={17}
      x={v.at(at)[0] + shift[0]}
      y={v.at(at)[1] + shift[1]}
      color={color}
    >
      {text}
    </Words>
  );
  const P = <tspan fontStyle="italic">P</tspan>;
  const Q = <tspan fontStyle="italic">Q</tspan>;
  const R = <tspan fontStyle="italic">R</tspan>;
  return (
    <Figure caption={caption}>
      <Svg
        width={600}
        height={270}
        label="On the left, an upright box with edges P, Q and R from O, cut into four layers parallel to its bottom face. On the right, the box with edges P, Q and R + cP: the same four layers, each slid along P, the higher layers further, so the box leans to the right."
      >
        <LayeredBox v={left} p={p} q={q} r={r} layers={4} />
        <LayeredBox v={right} p={p} q={q} r={slid} layers={4} />
        {[left, right].map((v, i) => (
          <g key={i}>
            <Arrow3 v={v} from={O3} to={p} color={BLUE} />
            <Arrow3 v={v} from={O3} to={q} color={ORANGE} />
            <Arrow3 v={v} from={O3} to={i ? slid : r} color={PURPLE} />
            {name(v, p, P, [-4, 24], BLUE)}
            {name(v, q, Q, [-14, -6], ORANGE)}
            <circle
              cx={v.at(O3)[0]}
              cy={v.at(O3)[1]}
              r={3.5}
              fill="currentColor"
            />
            {name(
              v,
              O3,
              <tspan fontStyle="italic">O</tspan>,
              [-12, 20],
              "currentColor",
            )}
          </g>
        ))}
        {name(left, r, R, [-14, 2], PURPLE)}
        {name(
          right,
          slid,
          <>
            {R} + <tspan fontStyle="italic">cP</tspan>
          </>,
          [-34, -10],
          PURPLE,
        )}
      </Svg>
    </Figure>
  );
}

/** three arrows from O along the unit directions, each named, with the faint unit cube behind */
function Triple({
  v,
  names,
}: {
  v: ReturnType<typeof view>;
  names: ReactNode[];
}) {
  const tips: Pt3[] = [
    [1.6, 0, 0],
    [0, 1.9, 0],
    [0, 0, 1.6],
  ];
  const colors = [BLUE, ORANGE, PURPLE];
  const shifts: Pt[] = [
    [10, 22],
    [16, 2],
    [0, -12],
  ];
  return (
    <g>
      <g stroke="currentColor" strokeOpacity={0.25} strokeWidth={1}>
        {edges([1, 0, 0], [0, 1, 0], [0, 0, 1]).map(([a, b], i) => (
          <line key={i} {...v.line(a, b)} />
        ))}
      </g>
      {tips.map((tip, i) => (
        <Arrow3 key={i} v={v} from={O3} to={tip} color={colors[i]!} />
      ))}
      {tips.map((tip, i) => (
        <Words
          key={i}
          size={17}
          x={v.at(tip)[0] + shifts[i]![0]}
          y={v.at(tip)[1] + shifts[i]![1]}
          color={colors[i]}
          anchor={i === 1 ? "start" : "middle"}
        >
          {names[i]}
        </Words>
      ))}
      <circle cx={v.at(O3)[0]} cy={v.at(O3)[1]} r={3.5} fill="currentColor" />
    </g>
  );
}

/**
 * On the left, E¹, E² and E³ as a right-handed set: first along x, second back along y, third up.
 * On the right, the same three directions in the order E², E¹, E³, which is left-handed: the first
 * column points back, the second right, the third up.
 */
export function Handedness({ caption }: { caption?: string }) {
  const left = view(70, [60, 210]);
  const right = view(70, [340, 210]);
  return (
    <Figure caption={caption}>
      <Svg
        width={600}
        height={270}
        label="Two sets of three arrows from O. On the left, the first arrow E¹ points right, the second E² points back and the third E³ points up: a right-handed set, with determinant 1. On the right, the first column A¹ = E² points back, the second A² = E¹ points right and the third A³ = E³ points up: a left-handed set, with determinant −1."
      >
        <Triple
          v={left}
          names={[
            <Col key="1" letter="E" n="¹" />,
            <Col key="2" letter="E" n="²" />,
            <Col key="3" letter="E" n="³" />,
          ]}
        />
        <Triple
          v={right}
          names={[
            <>
              <Col letter="A" n="²" /> = <Col letter="E" n="¹" />
            </>,
            <>
              <Col letter="A" n="¹" /> = <Col letter="E" n="²" />
            </>,
            <>
              <Col letter="A" n="³" /> = <Col letter="E" n="³" />
            </>,
          ]}
        />
        <Words size={16} x={130} y={256}>
          right-handed, determinant 1
        </Words>
        <Words size={16} x={410} y={256}>
          left-handed, determinant −1
        </Words>
      </Svg>
    </Figure>
  );
}

/**
 * The columns A¹ = (1, 2, 0), A² = (3, −1, 1) and A³ = (7, 0, 2) = A¹ + 2A², drawn in the plane through
 * O that holds them, with a dashed path from O along A¹ and then twice along A² to reach A³.
 */
export function ColumnsInAPlane({ caption }: { caption?: string }) {
  // seen from a side that shows the plane face on: the second and third coordinates are drawn
  // the other way round, so the plane, which is close to level, stands up in the picture
  const seen = view(40, [110, 150]);
  const v = { ...seen, at: ([x, y, z]: Pt3) => seen.at([x, z, y]) };
  v.line = (a: Pt3, b: Pt3) => {
    const [x1, y1] = v.at(a);
    const [x2, y2] = v.at(b);
    return { x1, y1, x2, y2 };
  };
  v.points = (ps: Pt3[]) => ps.map((q) => v.at(q).join(",")).join(" ");
  v.toward = (a: Pt3, b: Pt3): Pt => {
    const [x1, y1] = v.at(a);
    const [x2, y2] = v.at(b);
    const length = Math.hypot(x2 - x1, y2 - y1);
    return [(x2 - x1) / length, (y2 - y1) / length];
  };
  const a1: Pt3 = [1, 2, 0];
  const a2: Pt3 = [3, -1, 1];
  const a3: Pt3 = add(a1, times(2, a2));
  // a patch of the plane: sA¹ + tA² for s from −0.4 to 1.4 and t from −0.4 to 2.3
  const patch = [
    [-0.4, -0.4],
    [1.4, -0.4],
    [1.4, 2.3],
    [-0.4, 2.3],
  ].map(([s, t]) => add(times(s!, a1), times(t!, a2)));
  const path = {
    stroke: "currentColor",
    strokeWidth: 2,
    strokeDasharray: "6 5",
    strokeOpacity: 0.7,
  };
  const label = (at: Pt3, text: ReactNode, shift: Pt, color: string) => (
    <Words
      size={17}
      x={v.at(at)[0] + shift[0]}
      y={v.at(at)[1] + shift[1]}
      color={color}
    >
      {text}
    </Words>
  );
  return (
    <Figure caption={caption}>
      <Svg
        width={600}
        height={250}
        label="A tilted flat sheet, part of a plane through O. Three arrows from O lie in the sheet: A¹, A² and a longer A³. A dashed path runs from O to the tip of A¹, then along A² twice, ending at the tip of A³."
      >
        <polygon
          points={v.points(patch)}
          fill={BLUE}
          fillOpacity={0.1}
          stroke={BLUE}
          strokeOpacity={0.4}
          strokeWidth={1.5}
        />
        <g {...path} fill="none">
          <line {...v.line(a1, add(a1, a2))} />
          <line {...v.line(add(a1, a2), a3)} />
        </g>
        <circle
          cx={v.at(add(a1, a2))[0]}
          cy={v.at(add(a1, a2))[1]}
          r={3}
          fill="currentColor"
          fillOpacity={0.7}
        />
        <Arrow3 v={v} from={O3} to={a1} color={BLUE} />
        <Arrow3 v={v} from={O3} to={a2} color={ORANGE} />
        <Arrow3 v={v} from={O3} to={a3} color={PURPLE} />
        {label(a1, <Col letter="A" n="¹" />, [-8, -12], BLUE)}
        {label(a2, <Col letter="A" n="²" />, [8, 24], ORANGE)}
        {label(a3, <Col letter="A" n="³" />, [22, 4], PURPLE)}
        <circle cx={v.at(O3)[0]} cy={v.at(O3)[1]} r={3.5} fill="currentColor" />
        {label(
          O3,
          <tspan fontStyle="italic">O</tspan>,
          [-14, 6],
          "currentColor",
        )}
      </Svg>
    </Figure>
  );
}
