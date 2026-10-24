import type { ReactNode } from "react";
import { Figure } from "../figure";
import {
  CARD,
  CARD_EDGE,
  CARD_TWO,
  CARD_TWO_EDGE,
  CARDBOARD,
  CARDBOARD_EDGE,
  Corner,
  PENCIL,
  PURPLE,
  Svg,
  Words,
  type Pt,
} from "../illustrations";

/**
 * Pictures for the Points in space guide: three axes with a drone placed by its east, north and
 * height coordinates, and a room 5 by 4 by 3 with the diagonal across its floor and the diagonal
 * through it from corner to corner.
 */

type Pt3 = readonly [number, number, number];

/**
 * A slanted view of space: x runs right, z runs up, and y runs back, drawn up and to the right.
 * Returns the page position of a point, given the size of a unit and where the origin sits.
 */
function view(unit: number, origin: Pt) {
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
  // the direction on the page from p towards q, as a unit vector
  const toward = (p: Pt3, q: Pt3): Pt => {
    const [x1, y1] = at(p);
    const [x2, y2] = at(q);
    const length = Math.hypot(x2 - x1, y2 - y1);
    return [(x2 - x1) / length, (y2 - y1) / length];
  };
  return { at, line, toward };
}

// where the drone's four rotors sit, from the middle of its body
const ROTORS: Pt[] = [
  [-16, -8],
  [16, -8],
  [-16, 8],
  [16, 8],
];

const italic = (letter: string) => <tspan fontStyle="italic">{letter}</tspan>;

/** an arrowhead at `tip`, pointing along the unit vector `dir` */
function Head({ tip, dir }: { tip: Pt; dir: Pt }) {
  const [x, y] = tip;
  const [dx, dy] = dir;
  const back = 11;
  const half = 5;
  return (
    <polygon
      points={`${x},${y} ${x - dx * back - dy * half},${y - dy * back + dx * half} ${x - dx * back + dy * half},${y - dy * back - dx * half}`}
      fill="currentColor"
    />
  );
}

/**
 * Three axes through O, and a drone 40 m east, 30 m north and 25 m up. A dashed path walks out to it
 * one coordinate at a time: along the x-axis, then parallel to the y-axis, then straight up.
 */
export function SpaceAxes({ caption }: { caption?: string }) {
  // one unit on the page is 10 metres
  const { at, line, toward } = view(50, [70, 236]);
  const O: Pt3 = [0, 0, 0];
  const ends: {
    tip: Pt3;
    name: ReactNode;
    anchor: "start" | "end";
    shift: Pt;
  }[] = [
    {
      tip: [6, 0, 0],
      name: <>{italic("x")}, east</>,
      anchor: "start",
      shift: [-30, 26],
    },
    {
      tip: [0, 4.6, 0],
      name: <>{italic("y")}, north</>,
      anchor: "start",
      shift: [10, 4],
    },
    {
      tip: [0, 0, 3.8],
      name: <>{italic("z")}, up</>,
      anchor: "start",
      shift: [10, 6],
    },
  ];
  const east: Pt3 = [4, 0, 0];
  const ground: Pt3 = [4, 3, 0];
  const drone: Pt3 = [4, 3, 2.5];
  const [dx, dy] = at(drone);
  const path = { stroke: PURPLE, strokeWidth: 2.5, strokeDasharray: "7 5" };

  return (
    <Figure caption={caption}>
      <Svg
        width={520}
        height={290}
        label="Three axes meet at the origin O: x points east, y points north and z points up. A dashed path goes 40 along the x-axis, then 30 parallel to the y-axis, then 25 straight up, to a drone at (40, 30, 25)."
      >
        <g stroke="currentColor" strokeWidth={1.75}>
          {ends.map(({ tip }, i) => (
            <line key={i} {...line(O, tip)} />
          ))}
        </g>
        {ends.map(({ tip, name, anchor, shift }, i) => (
          <g key={i}>
            <Head tip={at(tip)} dir={toward(O, tip)} />
            <Words
              size={16}
              x={at(tip)[0] + shift[0]}
              y={at(tip)[1] + shift[1]}
              anchor={anchor}
            >
              {name}
            </Words>
          </g>
        ))}

        <g {...path} fill="none">
          <line {...line(O, east)} />
          <line {...line(east, ground)} />
          <line {...line(ground, drone)} />
        </g>
        <circle cx={at(ground)[0]} cy={at(ground)[1]} r={4} fill={PURPLE} />

        <Words
          size={16}
          x={(at(O)[0] + at(east)[0]) / 2}
          y={at(O)[1] + 24}
          color={PURPLE}
        >
          40
        </Words>
        <Words
          size={16}
          x={(at(east)[0] + at(ground)[0]) / 2 + 12}
          y={(at(east)[1] + at(ground)[1]) / 2 + 14}
          anchor="start"
          color={PURPLE}
        >
          30
        </Words>
        <Words
          size={16}
          x={at(ground)[0] + 10}
          y={(at(ground)[1] + at(drone)[1]) / 2 + 5}
          anchor="start"
          color={PURPLE}
        >
          25
        </Words>

        {/* the drone: a body with four rotors */}
        <g stroke={PENCIL} strokeWidth={1.5}>
          {ROTORS.map(([ox, oy], i) => (
            <g key={i}>
              <line
                x1={dx}
                y1={dy}
                x2={dx + ox}
                y2={dy + oy}
                strokeWidth={2.5}
              />
              <ellipse
                cx={dx + ox}
                cy={dy + oy}
                rx={9}
                ry={3.5}
                fill="#cbd5e1"
              />
            </g>
          ))}
          <rect
            x={dx - 7}
            y={dy - 5}
            width={14}
            height={10}
            rx={3}
            fill="#475569"
          />
        </g>
        <Words size={16} x={dx + 30} y={dy + 5} anchor="start">
          (40, 30, 25)
        </Words>

        <Words size={16} x={at(O)[0] - 10} y={at(O)[1] + 20} anchor="end">
          {italic("O")}
        </Words>
      </Svg>
    </Figure>
  );
}

/**
 * A see-through room 5 long, 4 wide and 3 high. The floor diagonal runs from the corner P to the
 * opposite floor corner R, and the diagonal through the room runs from P up to Q, straight above R.
 * The two right triangles are shaded: one on the floor, one standing upright on the floor diagonal.
 */
export function RoomDiagonal({ caption }: { caption?: string }) {
  const { at, line, toward } = view(50, [40, 270]);
  const xy = (p: Pt3) => at(p).join(",");

  const P: Pt3 = [0, 0, 0];
  const B: Pt3 = [5, 0, 0];
  const R: Pt3 = [5, 4, 0];
  const Q: Pt3 = [5, 4, 3];
  const hidden: Pt3 = [0, 4, 0];
  const faces: Pt3[][] = [
    [P, B, [5, 0, 3], [0, 0, 3]],
    [[0, 0, 3], [5, 0, 3], Q, [0, 4, 3]],
    [B, R, Q, [5, 0, 3]],
  ];

  const middle = (p: Pt3, q: Pt3, dx: number, dy: number): Pt => {
    const [x1, y1] = at(p);
    const [x2, y2] = at(q);
    return [(x1 + x2) / 2 + dx, (y1 + y2) / 2 + dy];
  };
  const label = (
    [x, y]: Pt,
    text: ReactNode,
    anchor?: "start" | "end",
    color?: string,
  ) => (
    <Words size={18} x={x} y={y} anchor={anchor} color={color}>
      {text}
    </Words>
  );

  return (
    <Figure caption={caption}>
      <Svg
        width={470}
        height={320}
        label="A see-through room 5 long, 4 wide and 3 high. A shaded right triangle on the floor has legs 5 and 4 and runs from the corner P to the opposite floor corner R; its long side is the floor diagonal, of length the square root of 41. A second shaded right triangle stands upright on the floor diagonal, with the upright edge of 3 from R to Q, the far top corner. Its long side runs from P to Q, of length the square root of 50."
      >
        {/* the room, see-through: light walls first, then the edges hidden behind them dashed */}
        {faces.map((face, i) => (
          <polygon
            key={i}
            points={face.map(xy).join(" ")}
            fill={CARDBOARD}
            fillOpacity={[0.12, 0.2, 0.28][i]}
          />
        ))}
        <g stroke={CARDBOARD_EDGE} strokeWidth={1.5} strokeDasharray="5 4">
          <line {...line(hidden, P)} />
          <line {...line(hidden, R)} />
          <line {...line(hidden, [0, 4, 3])} />
        </g>

        {/* the first triangle, on the floor */}
        <polygon
          points={[P, B, R].map(xy).join(" ")}
          fill={CARD}
          fillOpacity={0.75}
          stroke={CARD_EDGE}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <Corner at={at(B)} u={toward(B, P)} v={toward(B, R)} />

        {/* the second triangle, standing on the floor diagonal */}
        <polygon
          points={[P, R, Q].map(xy).join(" ")}
          fill={CARD_TWO}
          fillOpacity={0.6}
          stroke={CARD_TWO_EDGE}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <Corner at={at(R)} u={toward(R, P)} v={toward(R, Q)} />

        <g
          stroke={CARDBOARD_EDGE}
          strokeWidth={2.5}
          strokeLinejoin="round"
          fill="none"
        >
          {faces.map((face, i) => (
            <polygon key={i} points={face.map(xy).join(" ")} />
          ))}
        </g>
        <line {...line(P, R)} stroke={CARD_EDGE} strokeWidth={3.5} />
        <line {...line(P, Q)} stroke={PURPLE} strokeWidth={3.5} />

        {label(middle(P, B, 0, 26), "5")}
        {label(middle(B, R, 14, 18), "4", "start")}
        {label(middle(R, Q, 12, 6), "3", "start")}
        {label(middle(P, R, 20, 30), "√41", "start", CARD_EDGE)}
        {label(middle(P, Q, -60, 12), "√50", "end", PURPLE)}

        {label([at(P)[0] - 8, at(P)[1] + 22], italic("P"), "end")}
        {label([at(R)[0] + 12, at(R)[1] + 18], italic("R"), "start")}
        {label([at(Q)[0] + 12, at(Q)[1] + 2], italic("Q"), "start")}
      </Svg>
    </Figure>
  );
}
