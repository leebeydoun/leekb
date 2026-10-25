import type { ReactNode } from "react";
import { Figure } from "../figure";
import {
  BLUE,
  CARDBOARD,
  CARDBOARD_EDGE,
  ORANGE,
  PURPLE,
  Svg,
  Words,
  type Pt,
} from "../illustrations";

/**
 * Pictures for the Lines in space guide of the Segments, rays and lines chapter: a see-through room
 * with two lines running along edges that don't share a wall, the floor or the ceiling, so the lines
 * never meet and are not parallel.
 */

type Pt3 = readonly [number, number, number];

/**
 * A slanted view of space, as in the Coordinates chapter: x runs right, z runs up, and y runs back,
 * drawn up and to the right. Returns the page position of a point.
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
  return { at, line };
}

const italic = (letter: string) => <tspan fontStyle="italic">{letter}</tspan>;

/**
 * A see-through room 6 long, 4 deep and 3 high, with a corner at O. The line L runs along the floor
 * edge at the front, the x-axis, and the line K runs along the ceiling edge above the left wall,
 * through (0, 0, 3) with direction (0, 1, 0). Both are drawn past the room to show they go on. The
 * upright edge from O to (0, 0, 3) shows the gap of 3 between them.
 */
export function SkewLines({ caption }: { caption?: string }) {
  const { at, line } = view(46, [104, 292]);
  const xy = (p: Pt3) => at(p).join(",");

  const O: Pt3 = [0, 0, 0];
  const above: Pt3 = [0, 0, 3];
  const hidden: Pt3 = [0, 4, 0];
  // the faces at the front, on top and on the right
  const faces: Pt3[][] = [
    [O, [6, 0, 0], [6, 0, 3], above],
    [above, [6, 0, 3], [6, 4, 3], [0, 4, 3]],
    [
      [6, 0, 0],
      [6, 4, 0],
      [6, 4, 3],
      [6, 0, 3],
    ],
  ];

  const lEnds: [Pt3, Pt3] = [
    [-1.4, 0, 0],
    [7.4, 0, 0],
  ];
  const kEnds: [Pt3, Pt3] = [
    [0, -1.4, 3],
    [0, 5.6, 3],
  ];

  const label = (
    [x, y]: Pt,
    text: ReactNode,
    anchor?: "start" | "end",
    color?: string,
  ) => (
    <Words size={17} x={x} y={y} anchor={anchor} color={color}>
      {text}
    </Words>
  );
  const [ox, oy] = at(O);
  const [ax, ay] = at(above);
  const [lx, ly] = at(lEnds[1]);
  const [kx, ky] = at(kEnds[1]);

  return (
    <Figure caption={caption}>
      <Svg
        width={540}
        height={322}
        label="A see-through room 6 long, 4 deep and 3 high, with a corner at O. A blue line L runs along the floor edge at the front, through O, and on past the room both ways. An orange line K runs along the ceiling edge above the left wall, through the point (0, 0, 3) straight above O, and on past the room. The two lines never meet: L stays on the floor and K stays at height 3, and the upright edge from O to (0, 0, 3), of length 3, joins them."
      >
        {faces.map((face, i) => (
          <polygon
            key={i}
            points={face.map(xy).join(" ")}
            fill={CARDBOARD}
            fillOpacity={[0.12, 0.2, 0.28][i]}
          />
        ))}
        <g stroke={CARDBOARD_EDGE} strokeWidth={1.5} strokeDasharray="5 4">
          <line {...line(hidden, O)} />
          <line {...line(hidden, [6, 4, 0])} />
          <line {...line(hidden, [0, 4, 3])} />
        </g>
        <g
          stroke={CARDBOARD_EDGE}
          strokeWidth={2}
          strokeLinejoin="round"
          fill="none"
        >
          {faces.map((face, i) => (
            <polygon key={i} points={face.map(xy).join(" ")} />
          ))}
        </g>

        {/* the gap between the lines, up the corner of the room */}
        <line
          {...line(O, above)}
          stroke={PURPLE}
          strokeWidth={3}
          strokeDasharray="7 5"
        />

        {/* the two lines, drawn on past the room */}
        <line
          {...line(...lEnds)}
          stroke={BLUE}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
        <line
          {...line(...kEnds)}
          stroke={ORANGE}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
        <circle cx={ox} cy={oy} r={4.5} fill="currentColor" />
        <circle cx={ax} cy={ay} r={4.5} fill="currentColor" />

        {label([lx + 10, ly + 6], italic("L"), "start", BLUE)}
        {label([kx + 10, ky + 6], italic("K"), "start", ORANGE)}
        {label([ox - 12, (oy + ay) / 2 + 6], "3", "end", PURPLE)}
        {label([ox + 4, oy + 24], italic("O"), "start")}
        {label([ax - 12, ay - 12], "(0, 0, 3)", "end")}
      </Svg>
    </Figure>
  );
}
