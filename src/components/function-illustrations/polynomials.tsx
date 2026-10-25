import { Figure } from "../figure";
import {
  BLUE,
  CARDBOARD,
  CARDBOARD_EDGE,
  ORANGE,
  PURPLE,
  Svg,
  Words,
} from "../illustrations";
import { Arrow, MUTED, Plot, Spot, graph, type Pt } from "./plot";

/**
 * Pictures for the guide Polynomials: a sheet of card with squares cut from its corners and the
 * open box it folds into, and the graph of the box's volume, with its three roots and its highest
 * point between 0 and 5.
 */

/**
 * The opening scene. On the left, a 16 by 10 sheet of card with a square of side x cut from each
 * corner (drawn dashed, as removed) and the four fold lines dashed. On the right, the open box it
 * folds into, drawn at a slant: x tall, with a floor 16 − 2x by 10 − 2x.
 */
export function CardBox({ caption }: { caption?: string }) {
  // the sheet, 15 px to each cm, with its top left corner at (64, 56); the squares are 2 cm
  const s = 15;
  const x0 = 64;
  const y0 = 56;
  const w = 16 * s;
  const h = 10 * s;
  const c = 2 * s;
  const sheet: Pt[] = [
    [x0 + c, y0],
    [x0 + w - c, y0],
    [x0 + w - c, y0 + c],
    [x0 + w, y0 + c],
    [x0 + w, y0 + h - c],
    [x0 + w - c, y0 + h - c],
    [x0 + w - c, y0 + h],
    [x0 + c, y0 + h],
    [x0 + c, y0 + h - c],
    [x0, y0 + h - c],
    [x0, y0 + c],
    [x0 + c, y0 + c],
  ];
  const corners: Pt[] = [
    [x0, y0],
    [x0 + w - c, y0],
    [x0, y0 + h - c],
    [x0 + w - c, y0 + h - c],
  ];
  const pts = (p: Pt[]) => p.map(([a, b]) => `${a},${b}`).join(" ");

  // the box at a slant: 14 px to each cm across and up, and each cm of depth goes (6, −4)
  const k = 14;
  const base: Pt = [360, 236];
  const W: Pt = [12 * k, 0];
  const D: Pt = [6 * 6, -6 * 4];
  const H: Pt = [0, -2 * k];
  const add = (...v: Pt[]): Pt => [
    v.reduce((t, p) => t + p[0], 0),
    v.reduce((t, p) => t + p[1], 0),
  ];
  const A = base;
  const B = add(base, W);
  const C = add(base, W, D);
  const E = add(base, D);
  const face = (p: Pt[], fill: string, opacity: number) => (
    <polygon
      points={pts(p)}
      fill={fill}
      fillOpacity={opacity}
      stroke={CARDBOARD_EDGE}
      strokeWidth={2}
      strokeLinejoin="round"
    />
  );

  return (
    <Figure caption={caption}>
      <Svg
        width={640}
        height={300}
        label="On the left, a flat sheet of card 16 cm wide and 10 cm tall. A square of side x has been cut from each corner, shown by dashed outlines, and dashed fold lines join the inner corners of the cuts. An arrow points to the right, where the flaps have been folded up into an open box x tall, with a floor 16 − 2x long and 10 − 2x deep."
      >
        {/* the sheet with its corners cut away */}
        <polygon
          points={pts(sheet)}
          fill={CARDBOARD}
          stroke={CARDBOARD_EDGE}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {corners.map(([a, b], i) => (
          <rect
            key={i}
            x={a}
            y={b}
            width={c}
            height={c}
            fill="none"
            stroke={MUTED}
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
        ))}
        {/* the fold lines */}
        <g stroke={CARDBOARD_EDGE} strokeWidth={1.5} strokeDasharray="6 4">
          <line x1={x0 + c} x2={x0 + w - c} y1={y0 + c} y2={y0 + c} />
          <line x1={x0 + c} x2={x0 + w - c} y1={y0 + h - c} y2={y0 + h - c} />
          <line x1={x0 + c} x2={x0 + c} y1={y0 + c} y2={y0 + h - c} />
          <line x1={x0 + w - c} x2={x0 + w - c} y1={y0 + c} y2={y0 + h - c} />
        </g>
        <Words x={x0 + w / 2} y={y0 - 14}>
          16 cm
        </Words>
        <Words x={x0 - 8} y={y0 + h / 2 + 5} anchor="end">
          10 cm
        </Words>
        <Words x={x0 + c / 2} y={y0 + h + 22} color={ORANGE}>
          x
        </Words>
        <Words x={x0 - 8} y={y0 + h - c / 2 + 5} anchor="end" color={ORANGE}>
          x
        </Words>

        <Arrow x1={314} y1={136} x2={348} y2={136} color={PURPLE} />

        {/* the box: floor, the two far walls from inside, then the two near walls */}
        {face([A, B, C, E], CARDBOARD, 0.5)}
        {face([E, C, add(C, H), add(E, H)], CARDBOARD, 0.7)}
        {face([A, E, add(E, H), add(A, H)], CARDBOARD, 0.85)}
        {face([A, B, add(B, H), add(A, H)], CARDBOARD, 1)}
        {face([B, C, add(C, H), add(B, H)], CARDBOARD, 0.9)}
        <Words x={(A[0] + B[0]) / 2} y={A[1] + 24}>
          16 − 2x
        </Words>
        <Words
          x={(B[0] + C[0]) / 2 + 12}
          y={(B[1] + C[1]) / 2 + 12}
          anchor="start"
        >
          10 − 2x
        </Words>
        <Words x={A[0] - 8} y={A[1] - k + 5} anchor="end" color={ORANGE}>
          x
        </Words>
      </Svg>
    </Figure>
  );
}

/**
 * The graph of the box volume V(x) = 4x(x − 5)(x − 8) for x from 0 to 9, with one step up for each
 * unit of volume against 50 pixels across for each cm (so heights are drawn much smaller). The roots
 * 0, 5 and 8 are marked, and the highest point (2, 144) between 0 and 5, with a dashed line at 144.
 */
export function BoxVolume({ caption }: { caption?: string }) {
  const V = (x: number) => 4 * x * (x - 5) * (x - 8);
  return (
    <Figure caption={caption}>
      <Plot
        id="box-volume"
        x={[0, 9]}
        y={[-80, 160]}
        unit={50}
        unitY={1}
        stepY={20}
        everyY={40}
        curves={[{ points: graph(V, 0, 9), color: BLUE }]}
        label="The graph of the box volume V(x) = 4x(x − 5)(x − 8) for x from 0 to 9. Across, each step is 1 cm; up, the numbers go in steps of 40 cubic centimetres. The curve starts at 0, climbs to its highest point (2, 144), falls through 5, dips below the axis to about −59 near x = 6.7, and climbs back through 8 to 144 at x = 9. A dashed line marks the height 144. Only the part from 0 to 5 is a real box."
      >
        {({ px, py }) => (
          <>
            <line
              x1={px(0)}
              x2={px(9)}
              y1={py(144)}
              y2={py(144)}
              stroke={ORANGE}
              strokeWidth={2}
              strokeDasharray="5 4"
            />
            <rect
              x={px(0)}
              y={py(160)}
              width={px(5) - px(0)}
              height={py(0) - py(160)}
              fill={BLUE}
              fillOpacity={0.07}
            />
            {[0, 5, 8].map((r) => (
              <Spot key={r} x={px(r)} y={py(0)} color={PURPLE} />
            ))}
            <Spot x={px(2)} y={py(144)} color={ORANGE} />
            <Words x={px(2)} y={py(144) - 10} color={ORANGE} size={14}>
              (2, 144)
            </Words>
            <Words x={px(2.5)} y={py(40)} color={BLUE} size={14}>
              real boxes
            </Words>
            <Words
              x={px(6.3)}
              y={py(110)}
              anchor="middle"
              color={BLUE}
              size={14}
            >
              V(x) = 4x(x − 5)(x − 8)
            </Words>
          </>
        )}
      </Plot>
    </Figure>
  );
}
