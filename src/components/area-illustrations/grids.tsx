import { Figure } from "../figure";
import { BLUE, ORANGE, PENCIL, Svg, Words } from "../illustrations";

/**
 * Measuring a triangle by counting squares. The triangle has legs 6 and 4 along two grid lines, so
 * its area is 12. Three grids, each with squares half the size of the last, show the squares wholly
 * inside (blue) and the squares the triangle only partly covers (orange). The area always lies
 * between the blue total and the blue and orange total, and the gap halves each time.
 */

const LEG_X = 6;
const LEG_Y = 4;
const UNIT = 38;
const PAD = 14;

const inside = (x: number, y: number) =>
  x >= 0 && y >= 0 && LEG_Y * x + LEG_X * y <= LEG_X * LEG_Y + 1e-9;
const strictlyInside = (x: number, y: number) =>
  x > 0 && y > 0 && LEG_Y * x + LEG_X * y < LEG_X * LEG_Y;

/** every square of side c in the grid, sorted into wholly inside, partly covered, or outside */
function squares(c: number) {
  const n = Math.round(Math.max(LEG_X, LEG_Y) / c);
  const result: { x: number; y: number; kind: "inner" | "edge" }[] = [];
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) {
      const x = i * c;
      const y = j * c;
      const corners = [
        [x, y],
        [x + c, y],
        [x, y + c],
        [x + c, y + c],
      ] as const;
      if (corners.every(([a, b]) => inside(a, b))) {
        result.push({ x, y, kind: "inner" });
        continue;
      }
      // the triangle covers some of the square's area when a point well inside the square is
      // strictly inside the triangle
      const k = 12;
      let covered = false;
      for (let s = 0; s < k && !covered; s++)
        for (let t = 0; t < k && !covered; t++)
          covered = strictlyInside(
            x + (c * (2 * s + 1)) / (2 * k),
            y + (c * (2 * t + 1)) / (2 * k),
          );
      if (covered) result.push({ x, y, kind: "edge" });
    }
  return result;
}

function Panel({ c, name }: { c: number; name: string }) {
  const width = LEG_X * UNIT + PAD * 2;
  const height = LEG_Y * UNIT + PAD * 2 + 58;
  const px = (x: number, y: number) => ({
    x: PAD + x * UNIT,
    y: PAD + (LEG_Y - y) * UNIT,
  });
  const all = squares(c);
  const inner = all.filter((s) => s.kind === "inner").length * c * c;
  const outer = all.length * c * c;
  const lines = Math.round(LEG_X / c);
  return (
    <div style={{ flex: "1 1 200px", maxWidth: 270 }}>
      <Svg
        width={width}
        height={height}
        label={`A right triangle with legs 6 and 4 on a grid of squares of side ${name}. The squares wholly inside add up to ${inner}, and with the partly covered squares the total is ${outer}.`}
      >
        {all.map(({ x, y, kind }) => {
          const p = px(x, y + c);
          return (
            <rect
              key={`${x},${y}`}
              x={p.x}
              y={p.y}
              width={c * UNIT}
              height={c * UNIT}
              fill={kind === "inner" ? BLUE : ORANGE}
              fillOpacity={kind === "inner" ? 0.35 : 0.4}
            />
          );
        })}
        {/* the grid lines */}
        <g stroke="currentColor" strokeOpacity={0.25} strokeWidth={1}>
          {Array.from({ length: lines + 1 }, (_, i) => {
            const a = px(i * c, 0);
            const b = px(i * c, LEG_Y);
            return <line key={`v${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
          })}
          {Array.from({ length: Math.round(LEG_Y / c) + 1 }, (_, i) => {
            const a = px(0, i * c);
            const b = px(LEG_X, i * c);
            return <line key={`h${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
          })}
        </g>
        <polygon
          points={[px(0, 0), px(LEG_X, 0), px(0, LEG_Y)]
            .map((p) => `${p.x},${p.y}`)
            .join(" ")}
          fill="none"
          stroke={PENCIL}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <Words x={width / 2} y={LEG_Y * UNIT + PAD * 2 + 20}>
          {`squares of side ${name}`}
        </Words>
        <Words x={width / 2} y={LEG_Y * UNIT + PAD * 2 + 44}>
          {`${inner} ≤ area ≤ ${outer}`}
        </Words>
      </Svg>
    </div>
  );
}

export function GridTriangle({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-6">
        <Panel c={1} name="1" />
        <Panel c={0.5} name="½" />
        <Panel c={0.25} name="¼" />
      </div>
    </Figure>
  );
}
