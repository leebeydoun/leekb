import type { ReactNode } from "react";
import { Figure } from "../figure";
import {
  BLUE,
  ORANGE,
  PURPLE,
  STEEL,
  STEEL_LIGHT,
  Svg,
  WOOD,
  WOOD_DARK,
  Words,
  type Pt,
} from "../illustrations";

/**
 * Pictures for the Congruence guide: why a frame of triangles is rigid. Four wooden bars bolted
 * into a square fold over when pushed, since four side lengths allow many shapes. One diagonal
 * brace splits the square into two triangles, and three side lengths allow only one triangle.
 */

/** a wooden bar from a to b, with rounded ends */
function Bar({ a, b, width = 12 }: { a: Pt; b: Pt; width?: number }) {
  return (
    <g strokeLinecap="round">
      <line
        x1={a[0]}
        y1={a[1]}
        x2={b[0]}
        y2={b[1]}
        stroke={WOOD_DARK}
        strokeWidth={width + 3}
      />
      <line
        x1={a[0]}
        y1={a[1]}
        x2={b[0]}
        y2={b[1]}
        stroke={WOOD}
        strokeWidth={width}
      />
    </g>
  );
}

/** a bolt through two bars, which lets them pivot */
function Bolt({ at }: { at: Pt }) {
  return (
    <circle
      cx={at[0]}
      cy={at[1]}
      r={5}
      fill={STEEL_LIGHT}
      stroke={STEEL}
      strokeWidth={2}
    />
  );
}

function Frame({ corners, brace }: { corners: Pt[]; brace?: boolean }) {
  const [a, b, c, d] = corners as [Pt, Pt, Pt, Pt];
  return (
    <g>
      <Bar a={a} b={b} />
      <Bar a={b} b={c} />
      <Bar a={c} b={d} />
      <Bar a={d} b={a} />
      {brace && <Bar a={a} b={c} width={10} />}
      {corners.map((p, i) => (
        <Bolt key={i} at={p} />
      ))}
    </g>
  );
}

/** an arrow showing a push, from `from` to `to` */
function Push({ from, to }: { from: Pt; to: Pt }) {
  const angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
  const head = (turn: number) =>
    `${to[0] - Math.cos(angle + turn) * 12},${to[1] - Math.sin(angle + turn) * 12}`;
  return (
    <g>
      <line
        x1={from[0]}
        y1={from[1]}
        x2={to[0]}
        y2={to[1]}
        stroke={ORANGE}
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      <polygon
        points={`${to[0]},${to[1]} ${head(0.45)} ${head(-0.45)}`}
        fill={ORANGE}
      />
    </g>
  );
}

const panel = (label: string, title: ReactNode, children: ReactNode) => (
  <div style={{ flex: "1 1 220px", maxWidth: 300 }}>
    <Svg width={280} height={250} label={label}>
      {children}
      <Words x={140} y={238}>
        {title}
      </Words>
    </Svg>
  </div>
);

/**
 * Two square frames of wooden bars bolted at the corners. Pushed sideways, the plain one folds into
 * a leaning shape with the same four side lengths; the one with a diagonal brace keeps its shape.
 */
export function FrameBracing({ caption }: { caption?: string }) {
  const side = 130;
  const left = 60;
  const base = 196;
  const square: Pt[] = [
    [left, base],
    [left + side, base],
    [left + side, base - side],
    [left, base - side],
  ];
  // the plain frame after a push: the top slides over, every bar keeps its length
  const lean = 50;
  const drop = side - Math.sqrt(side * side - lean * lean);
  const leaning: Pt[] = [
    [left, base],
    [left + side, base],
    [left + side + lean, base - side + drop],
    [left + lean, base - side + drop],
  ];

  return (
    <Figure caption={caption}>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-4">
        {panel(
          "A square frame of four wooden bars bolted at the corners. Pushed at the top, it folds over into a leaning shape whose four bars have the same lengths as before.",
          "Four bars: it folds over",
          <>
            {/* where the frame started, faintly */}
            <g opacity={0.25}>
              <Frame corners={square} />
            </g>
            <Frame corners={leaning} />
            <Push
              from={[left - 30, base - side + 10]}
              to={[left + 20, base - side + 10]}
            />
          </>,
        )}
        {panel(
          "The same square frame with a diagonal bar bolted across it. Pushed at the top, it keeps its square shape, because it is made of two triangles.",
          "Add a brace: it stays square",
          <>
            <Frame corners={square} brace />
            <Push
              from={[left - 30, base - side + 10]}
              to={[left + 20, base - side + 10]}
            />
          </>,
        )}
      </div>
    </Figure>
  );
}

/**
 * A bridge whose sides are built from triangles: a deck, a top chord, and diagonal bars between
 * them. Each triangle has three fixed sides, so none of them can change shape under a load.
 */
export function TrussBridge({ caption }: { caption?: string }) {
  const width = 560;
  const deck = 150;
  const top = 70;
  const start = 40;
  const bays = 6;
  const bay = (width - start * 2) / bays;
  const low = Array.from({ length: bays + 1 }, (_, i): Pt => [
    start + i * bay,
    deck,
  ]);
  const high = Array.from({ length: bays }, (_, i): Pt => [
    start + (i + 0.5) * bay,
    top,
  ]);
  // one triangle shaded, to show what the frame is made of
  const shaded = [low[2]!, low[3]!, high[2]!];

  return (
    <Figure caption={caption}>
      <Svg
        width={width}
        height={230}
        label="A bridge seen from the side. Its frame is a row of triangles between a straight deck and a straight top bar, standing on two banks over a river."
      >
        {/* the river and its banks */}
        <rect
          x={0}
          y={deck + 30}
          width={width}
          height={50}
          fill={BLUE}
          fillOpacity={0.25}
        />
        <polygon
          points={`0,${deck + 6} ${start + 10},${deck + 6} ${start - 10},230 0,230`}
          fill={WOOD_DARK}
          fillOpacity={0.55}
        />
        <polygon
          points={`${width},${deck + 6} ${width - start - 10},${deck + 6} ${width - start + 10},230 ${width},230`}
          fill={WOOD_DARK}
          fillOpacity={0.55}
        />

        <polygon
          points={shaded.map((p) => p.join(",")).join(" ")}
          fill={PURPLE}
          fillOpacity={0.25}
        />

        <g stroke={STEEL} strokeWidth={7} strokeLinecap="round">
          {/* the deck and the top bar */}
          <line x1={low[0]![0]} y1={deck} x2={low[bays]![0]} y2={deck} />
          <line x1={high[0]![0]} y1={top} x2={high[bays - 1]![0]} y2={top} />
          {/* the diagonals, zigzagging between them */}
          {high.map((h, i) => (
            <g key={i}>
              <line x1={low[i]![0]} y1={deck} x2={h[0]} y2={top} />
              <line x1={h[0]} y1={top} x2={low[i + 1]![0]} y2={deck} />
            </g>
          ))}
        </g>
        {[...low, ...high].map((p, i) => (
          <circle
            key={i}
            cx={p[0]}
            cy={p[1]}
            r={4.5}
            fill={STEEL_LIGHT}
            stroke={STEEL}
            strokeWidth={2}
          />
        ))}

        <Words
          x={(shaded[0]![0] + shaded[1]![0]) / 2}
          y={top - 18}
          color={PURPLE}
        >
          every panel is a triangle
        </Words>
      </Svg>
    </Figure>
  );
}
