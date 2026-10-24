import type { ReactNode } from "react";
import { Figure } from "../figure";
import {
  BLUE,
  CARDBOARD,
  CARDBOARD_EDGE,
  PURPLE,
  Svg,
  Words,
  type Pt,
} from "../illustrations";

/**
 * Pictures for the Points in space guide of the Adding and scaling points chapter: a drone's flight
 * plan drawn as three steps in space, with the straight line from where it starts to where it ends.
 */

type Pt3 = readonly [number, number, number];

/**
 * A slanted view of space, as in the Coordinates chapter: x runs right, z runs up, and y runs back,
 * drawn up and to the right. Returns the page position of a point.
 */
function view(unit: number, origin: Pt) {
  const back: Pt = [0.7 * Math.cos(0.7), 0.7 * Math.sin(0.7)];
  return ([x, y, z]: Pt3): Pt => [
    origin[0] + unit * (x + back[0] * y),
    origin[1] - unit * (z + back[1] * y),
  ];
}

/** an arrow on the page from `from` to `to`, its line stopping where the head begins */
function Arrow({
  from,
  to,
  color,
  width = 3,
}: {
  from: Pt;
  to: Pt;
  color: string;
  width?: number;
}) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const length = Math.hypot(x2 - x1, y2 - y1);
  const [dx, dy] = [(x2 - x1) / length, (y2 - y1) / length];
  const back = 13;
  const half = 6;
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2 - dx * (back - 2)}
        y2={y2 - dy * (back - 2)}
        stroke={color}
        strokeWidth={width}
      />
      <polygon
        points={`${x2},${y2} ${x2 - dx * back - dy * half},${y2 - dy * back + dx * half} ${x2 - dx * back + dy * half},${y2 - dy * back - dx * half}`}
        fill={color}
      />
    </g>
  );
}

/**
 * A drone's flight plan, in metres east, north and up: climb 50, fly 120 east and 40 north, then
 * drop 20. A see-through box 120 by 40 by 30 shows where it ends, at the box's far top corner, and
 * the straight line from the start to the end is the box's diagonal, 130 long.
 */
export function DroneSteps({ caption }: { caption?: string }) {
  // one unit on the page is 10 metres
  const at = view(30, [110, 232]);
  const xy = (p: Pt3) => at(p).join(",");

  const O: Pt3 = [0, 0, 0];
  const climbed: Pt3 = [0, 0, 5];
  const across: Pt3 = [12, 4, 5];
  const end: Pt3 = [12, 4, 3];

  // the box from O to the end point: the faces at the front, on top and on the right
  const faces: Pt3[][] = [
    [O, [12, 0, 0], [12, 0, 3], [0, 0, 3]],
    [[0, 0, 3], [12, 0, 3], end, [0, 4, 3]],
    [[12, 0, 0], [12, 4, 0], end, [12, 0, 3]],
  ];
  const hidden: Pt3 = [0, 4, 0];
  const edge = (p: Pt3, q: Pt3) => {
    const [x1, y1] = at(p);
    const [x2, y2] = at(q);
    return { x1, y1, x2, y2 };
  };

  const label = (
    [x, y]: Pt,
    text: ReactNode,
    anchor?: "start" | "end",
    color?: string,
  ) => (
    <Words size={16} x={x} y={y} anchor={anchor} color={color}>
      {text}
    </Words>
  );
  const [ox, oy] = at(O);
  const [ex, ey] = at(end);
  const [ax, ay] = at(across);
  const [cx, cy] = at(climbed);

  return (
    <Figure caption={caption}>
      <Svg
        width={670}
        height={262}
        label="A see-through box 120 metres east, 40 north and 30 high. A drone starts at the corner O, climbs 50 metres, flies 120 east and 40 north, then drops 20 metres onto the box's far top corner, at (120, 40, 30). A straight arrow runs through the box from O to that corner, 130 metres long."
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
          <line {...edge(hidden, O)} />
          <line {...edge(hidden, [12, 4, 0])} />
          <line {...edge(hidden, [0, 4, 3])} />
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

        {/* the straight line from start to end, then the three steps of the flight plan */}
        <Arrow from={at(O)} to={at(end)} color={PURPLE} width={3.5} />
        <Arrow from={at(O)} to={at(climbed)} color={BLUE} />
        <Arrow from={at(climbed)} to={at(across)} color={BLUE} />
        <Arrow from={at(across)} to={at(end)} color={BLUE} />

        {/* the box's sides */}
        {label(
          [(ox + at([12, 0, 0])[0]) / 2, oy + 24],
          "120",
          undefined,
          CARDBOARD_EDGE,
        )}
        {label([ox + 404, oy - 12], "40", "start", CARDBOARD_EDGE)}
        {label([ox + 368, oy - 40], "30", "start", CARDBOARD_EDGE)}

        {/* the steps and the straight line */}
        {label([cx - 12, (oy + cy) / 2 - 20], "(0, 0, 50)", "end", BLUE)}
        {label(
          [(cx + ax) / 2, (cy + ay) / 2 - 14],
          "(120, 40, 0)",
          undefined,
          BLUE,
        )}
        {label([ex + 12, (ay + ey) / 2 - 2], "(0, 0, −20)", "start", BLUE)}
        {label([ox + 262, oy - 64], "130", "start", PURPLE)}

        {label([ox - 10, oy + 20], <tspan fontStyle="italic">O</tspan>, "end")}
        {label([ex + 12, ey + 22], "(120, 40, 30)", "start")}
      </Svg>
    </Figure>
  );
}
