import type { ReactNode } from "react";
import { Figure } from "../figure";
import { ORANGE, PENCIL, Svg, Words } from "../illustrations";

/**
 * Pictures for the Volume guide: cubes of side 1, 2 and 3 built from unit cubes, a load on a pillar
 * beside the same thing three times as big, and one block of ice beside the same ice crushed.
 */

// three shades of one material, for the front, top and side faces of a block
type Shades = { front: string; top: string; side: string; edge: string };

const WOODEN: Shades = {
  front: "#e9c99a",
  top: "#f5e1bf",
  side: "#d1a874",
  edge: "#8b5e34",
};
const ICE: Shades = {
  front: "#bae6fd",
  top: "#e0f2fe",
  side: "#7dd3fc",
  edge: "#0369a1",
};
const STONE: Shades = {
  front: "#d6d3d1",
  top: "#e7e5e4",
  side: "#a8a29e",
  edge: "#57534e",
};
const BONE: Shades = {
  front: "#fef3c7",
  top: "#fffbeb",
  side: "#fde68a",
  edge: "#a16207",
};

/** how far one unit of depth reaches on the page, across and up, as a share of a unit across */
const DEPTH = { x: 0.5, y: 0.32 };

/**
 * A box drawn at a slant, so its front, top and right side all show. (x, y) is the bottom-left
 * corner of the front face on the page; w, h and d are its width, height and depth in pixels.
 * With `grid`, lines split every face into squares of that size, showing the unit cubes.
 */
function Block({
  x,
  y,
  w,
  h,
  d,
  shades,
  grid,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  d: number;
  shades: Shades;
  grid?: number;
}) {
  const dx = d * DEPTH.x;
  const dy = d * DEPTH.y;
  const pts = (list: [number, number][]) =>
    list.map(([a, b]) => `${a},${b}`).join(" ");
  const front = pts([
    [x, y],
    [x + w, y],
    [x + w, y - h],
    [x, y - h],
  ]);
  const top = pts([
    [x, y - h],
    [x + w, y - h],
    [x + w + dx, y - h - dy],
    [x + dx, y - h - dy],
  ]);
  const side = pts([
    [x + w, y],
    [x + w + dx, y - dy],
    [x + w + dx, y - h - dy],
    [x + w, y - h],
  ]);

  const lines: ReactNode[] = [];
  if (grid) {
    const steps = (size: number) =>
      Array.from(
        { length: Math.round(size / grid) - 1 },
        (_, i) => (i + 1) * grid,
      );
    for (const s of steps(w)) {
      // down the front, and back across the top
      lines.push(
        <line key={`fw${s}`} x1={x + s} y1={y} x2={x + s} y2={y - h} />,
        <line
          key={`tw${s}`}
          x1={x + s}
          y1={y - h}
          x2={x + s + dx}
          y2={y - h - dy}
        />,
      );
    }
    for (const s of steps(h)) {
      // across the front, and back along the side
      lines.push(
        <line key={`fh${s}`} x1={x} y1={y - s} x2={x + w} y2={y - s} />,
        <line
          key={`sh${s}`}
          x1={x + w}
          y1={y - s}
          x2={x + w + dx}
          y2={y - s - dy}
        />,
      );
    }
    for (const s of steps(d)) {
      // across the top, and up the side, at each step of depth
      const ox = s * DEPTH.x;
      const oy = s * DEPTH.y;
      lines.push(
        <line
          key={`td${s}`}
          x1={x + ox}
          y1={y - h - oy}
          x2={x + w + ox}
          y2={y - h - oy}
        />,
        <line
          key={`sd${s}`}
          x1={x + w + ox}
          y1={y - oy}
          x2={x + w + ox}
          y2={y - h - oy}
        />,
      );
    }
  }

  return (
    <g strokeLinejoin="round">
      <polygon points={front} fill={shades.front} />
      <polygon points={top} fill={shades.top} />
      <polygon points={side} fill={shades.side} />
      <g stroke={shades.edge} strokeWidth={1} strokeOpacity={0.7}>
        {lines}
      </g>
      <g fill="none" stroke={shades.edge} strokeWidth={1.75}>
        <polygon points={front} />
        <polygon points={top} />
        <polygon points={side} />
      </g>
    </g>
  );
}

/**
 * Cubes of side 1, 2 and 3, each split into unit cubes, with their surface and volume underneath.
 * The surface grows 1, 4, 9 times; the volume 1, 8, 27 times.
 */
export function ThreeCubes({ caption }: { caption?: string }) {
  const unit = 34;
  const base = 196;
  const cubes = [
    { n: 1, x: 30, surface: 6, volume: 1 },
    { n: 2, x: 150, surface: 24, volume: 8 },
    { n: 3, x: 320, surface: 54, volume: 27 },
  ];
  return (
    <Figure caption={caption}>
      <Svg
        width={500}
        height={290}
        label="Three cubes built from small unit cubes. The first has side 1, surface 6 and volume 1. The second has side 2, surface 24 and volume 8. The third has side 3, surface 54 and volume 27."
      >
        {cubes.map(({ n, x, surface, volume }) => {
          const size = n * unit;
          const middle = x + (size + size * DEPTH.x) / 2;
          return (
            <g key={n}>
              <Block
                x={x}
                y={base}
                w={size}
                h={size}
                d={size}
                shades={WOODEN}
                grid={unit}
              />
              <Words x={middle} y={base + 30}>
                side {n}
              </Words>
              <Words x={middle} y={base + 54}>
                surface {surface}
              </Words>
              <Words x={middle} y={base + 78} color={ORANGE}>
                volume {volume}
              </Words>
            </g>
          );
        })}
      </Svg>
    </Figure>
  );
}

/**
 * A heavy block resting on a pillar, beside the same thing zoomed by 3. The load grows 27 times but
 * the top of the pillar only 9 times, so each square centimetre of the big pillar carries 3 times
 * as much.
 */
export function PillarLoad({ caption }: { caption?: string }) {
  const ground = 290;
  const panel = (
    x: number,
    r: number,
    lines: { text: string; color?: string }[],
  ) => {
    const pillar = { w: 12 * r, h: 46 * r, d: 12 * r };
    const load = { w: 30 * r, h: 22 * r, d: 30 * r };
    const px = x - pillar.w / 2 - (pillar.d * DEPTH.x) / 2;
    const lx = x - load.w / 2 - (load.d * DEPTH.x) / 2;
    // the load sits centred on the pillar's top, so it starts a little further back
    const back = (load.d - pillar.d) / 2;
    return (
      <g>
        <Block
          x={px}
          y={ground}
          w={pillar.w}
          h={pillar.h}
          d={pillar.d}
          shades={BONE}
        />
        <Block
          x={lx}
          y={ground - pillar.h + back * DEPTH.y}
          w={load.w}
          h={load.h}
          d={load.d}
          shades={STONE}
        />
        {lines.map((line, i) => (
          <Words key={i} x={x} y={ground + 32 + i * 24} color={line.color}>
            {line.text}
          </Words>
        ))}
      </g>
    );
  };
  return (
    <Figure caption={caption}>
      <Svg
        width={520}
        height={384}
        label="On the left, a stone block resting on a thin pillar. On the right, the same thing three times as wide, deep and tall. The big block weighs 27 times as much, but the top of the big pillar has only 9 times the area, so each square centimetre carries 3 times the load."
      >
        {panel(110, 1, [
          { text: "load 1" },
          { text: "top of pillar 1" },
          { text: "load per cm²: 1", color: ORANGE },
        ])}
        {panel(350, 3, [
          { text: "load × 27" },
          { text: "top of pillar × 9" },
          { text: "load per cm²: × 3", color: ORANGE },
        ])}
        <line
          x1={20}
          y1={ground}
          x2={500}
          y2={ground}
          stroke={PENCIL}
          strokeWidth={1.5}
        />
      </Svg>
    </Figure>
  );
}

/**
 * One block of ice 4 cm on a side, beside the same ice crushed into 64 cubes of 1 cm. The volume
 * is the same, but the crushed ice has 4 times the surface for warm drink to touch.
 */
export function CrushedIce({ caption }: { caption?: string }) {
  const unit = 18;
  const base = 186;
  // the 64 small cubes, set out in 4 rows of 16 a little apart, the back rows drawn first
  const pieces: ReactNode[] = [];
  for (let row = 3; row >= 0; row--) {
    for (let col = 0; col < 16; col++) {
      const depth = row * unit * 2.4;
      pieces.push(
        <Block
          key={`${row}-${col}`}
          x={170 + col * unit * 1.12 + depth * DEPTH.x}
          y={base - depth * DEPTH.y}
          w={unit}
          h={unit}
          d={unit}
          shades={ICE}
        />,
      );
    }
  }
  return (
    <Figure caption={caption}>
      <Svg
        width={580}
        height={270}
        label="On the left, one ice cube 4 cm on a side, with surface 96 square centimetres. On the right, the same ice crushed into 64 cubes of 1 cm, with surface 384 square centimetres in all, four times as much."
      >
        <Block
          x={24}
          y={base}
          w={4 * unit}
          h={4 * unit}
          d={4 * unit}
          shades={ICE}
          grid={unit}
        />
        <Words x={24 + (4 * unit * (1 + DEPTH.x)) / 2} y={base + 34}>
          one 4 cm cube
        </Words>
        <Words
          x={24 + (4 * unit * (1 + DEPTH.x)) / 2}
          y={base + 58}
          color={ORANGE}
        >
          surface 96 cm²
        </Words>
        {pieces}
        <Words x={365} y={base + 34}>
          64 cubes of 1 cm
        </Words>
        <Words x={365} y={base + 58} color={ORANGE}>
          surface 64 × 6 = 384 cm²
        </Words>
      </Svg>
    </Figure>
  );
}
