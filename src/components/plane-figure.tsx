import { Fragment, type ReactNode } from "react";
import { Figure } from "./figure";
import type {
  LabelPosition,
  PlaneColor,
  PlanePoint,
  PlaneSpec,
  Style,
} from "../lib/plane";

/** pixels per unit of the figure's coordinates */
const UNIT = 44;
/** room around the drawing for labels, in pixels */
const PAD = 26;
/** how far a line or ray runs past its points, in units, unless the figure says otherwise */
const EXTEND = 1.2;
const ANGLE_RADIUS = 0.55;

const COLORS: Record<PlaneColor, string> = {
  ink: "currentColor",
  blue: "#3b82f6",
  orange: "#f97316",
  green: "#22c55e",
  purple: "#a855f7",
  red: "#ef4444",
  muted: "var(--color-fd-muted-foreground)",
};

type Vec = { x: number; y: number };
const sub = (a: Vec, b: Vec) => ({ x: a.x - b.x, y: a.y - b.y });
const add = (a: Vec, b: Vec) => ({ x: a.x + b.x, y: a.y + b.y });
const times = (a: Vec, k: number) => ({ x: a.x * k, y: a.y * k });
const unit = (a: Vec) => {
  const length = Math.hypot(a.x, a.y) || 1;
  return { x: a.x / length, y: a.y / length };
};

const OFFSETS: Record<LabelPosition, Vec> = {
  n: { x: 0, y: 1 },
  s: { x: 0, y: -1 },
  e: { x: 1, y: 0 },
  w: { x: -1, y: 0 },
  ne: { x: 0.75, y: 0.75 },
  nw: { x: -0.75, y: 0.75 },
  se: { x: 0.75, y: -0.75 },
  sw: { x: -0.75, y: -0.75 },
};

/**
 * Labels are written plainly, with a single letter in italics as maths would be, and P_1 or P'
 * shown as a subscript or a prime.
 */
function Label({ text }: { text: string }) {
  const match = /^([A-Za-zα-ω])(?:_(\w+))?(['′]*)$/.exec(text);
  if (!match) return <>{text}</>;
  const [, letter, sub, primes] = match;
  return (
    <>
      <tspan fontStyle="italic">{letter}</tspan>
      {primes && <tspan>{"′".repeat(primes.length)}</tspan>}
      {sub && (
        <tspan fontSize="0.75em" dy="0.3em">
          {sub}
        </tspan>
      )}
    </>
  );
}

/** A static figure in the plane, drawn from a ```plane fence (see src/lib/plane.ts). */
export function PlaneFigure({ points, items, caption }: PlaneSpec) {
  const byName = new Map<string, PlanePoint>(points.map((p) => [p.name, p]));
  const at = (name: string): Vec => byName.get(name)!;

  // where each line and ray stops, so the figure can be sized to hold them
  const ends = (from: Vec, to: Vec, style: Style, both: boolean) => {
    const direction = unit(sub(to, from));
    const extra = style.extend ?? EXTEND;
    return {
      start: both ? sub(from, times(direction, extra)) : from,
      end: add(to, times(direction, extra)),
    };
  };

  // the extent of everything drawn, in units
  const extent: Vec[] = points.filter((p) => !p.hidden).map((p) => p as Vec);
  for (const item of items) {
    if (item.kind === "line" || item.kind === "ray") {
      const { start, end } = ends(
        at(item.from),
        at(item.to),
        item.style,
        item.kind === "line",
      );
      extent.push(start, end);
    } else if (item.kind === "circle") {
      const c = at(item.centre);
      extent.push(
        add(c, { x: item.radius, y: item.radius }),
        sub(c, { x: item.radius, y: item.radius }),
      );
    } else if (item.kind === "text") extent.push(item);
    else if (item.kind === "segment" || item.kind === "ticks")
      extent.push(at(item.from), at(item.to));
    else if (item.kind === "polygon") extent.push(...item.corners.map(at));
    else if (item.kind === "angle") {
      // room for the arc and its label all the way round, since a large angle can face any way
      const r = (item.style.r ?? ANGLE_RADIUS) + 0.5;
      extent.push(
        add(at(item.vertex), { x: r, y: r }),
        sub(at(item.vertex), { x: r, y: r }),
      );
    } else if (item.kind === "right") extent.push(at(item.vertex));
  }
  if (extent.length === 0) extent.push(...points);
  const minX = Math.min(...extent.map((p) => p.x));
  const maxX = Math.max(...extent.map((p) => p.x));
  const minY = Math.min(...extent.map((p) => p.y));
  const maxY = Math.max(...extent.map((p) => p.y));
  const width = (maxX - minX) * UNIT + PAD * 2;
  const height = (maxY - minY) * UNIT + PAD * 2;
  // from units to pixels, with y turned to point down
  const px = (p: Vec) => ({
    x: PAD + (p.x - minX) * UNIT,
    y: PAD + (maxY - p.y) * UNIT,
  });

  const stroke = (style: Style) => ({
    stroke: COLORS[style.color],
    strokeWidth: style.color === "ink" ? 1.75 : 2.5,
    strokeDasharray: style.dashed ? "6 5" : undefined,
    strokeLinecap: "round" as const,
    fill: "none",
  });

  const text = (
    position: Vec,
    label: string,
    color: PlaneColor,
    key?: string,
  ): ReactNode => (
    <text
      key={key}
      x={position.x}
      y={position.y + 5}
      textAnchor="middle"
      fontSize={15}
      fill={color === "ink" ? "currentColor" : COLORS[color]}
      // a halo in the card's colour, so a label stays readable where it crosses a line
      stroke="var(--color-fd-card)"
      strokeWidth={4}
      strokeLinejoin="round"
      paintOrder="stroke"
    >
      <Label text={label} />
    </text>
  );

  const drawn = items.map((item, i) => {
    const s = item.style;
    switch (item.kind) {
      case "segment":
      case "line":
      case "ray": {
        const { start, end } =
          item.kind === "segment"
            ? { start: at(item.from), end: at(item.to) }
            : ends(at(item.from), at(item.to), s, item.kind === "line");
        const a = px(start);
        const b = px(end);
        let label: ReactNode = null;
        if (s.label) {
          // beside the middle of the segment, on its left going from the first point to the second
          const from = px(at(item.from));
          const to = px(at(item.to));
          const along = unit(sub(to, from));
          const normal =
            s.side === "left"
              ? { x: along.y, y: -along.x }
              : { x: -along.y, y: along.x };
          label = text(
            add(times(add(from, to), 0.5), times(normal, 14)),
            s.label,
            s.color,
          );
        }
        return (
          <g key={i}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} {...stroke(s)} />
            {label}
          </g>
        );
      }
      case "polygon": {
        const corners = item.corners.map((c) => px(at(c)));
        return (
          <polygon
            key={i}
            points={corners.map((c) => `${c.x},${c.y}`).join(" ")}
            fill={COLORS[s.color === "ink" ? "blue" : s.color]}
            fillOpacity={0.18}
            stroke="none"
          />
        );
      }
      case "circle": {
        const c = px(at(item.centre));
        const color = COLORS[s.color === "ink" && s.fill ? "blue" : s.color];
        return (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={item.radius * UNIT}
            {...stroke(s)}
            stroke={color}
            fill={s.fill ? color : "none"}
            fillOpacity={s.fill ? 0.18 : undefined}
          />
        );
      }
      case "right": {
        const v = at(item.vertex);
        const size = 0.28;
        const u = times(unit(sub(at(item.from), v)), size);
        const w = times(unit(sub(at(item.to), v)), size);
        const corners = [add(v, u), add(add(v, u), w), add(v, w)].map(px);
        return (
          <polyline
            key={i}
            points={corners.map((c) => `${c.x},${c.y}`).join(" ")}
            {...stroke({ ...s, color: s.color })}
            strokeWidth={1.5}
          />
        );
      }
      case "angle": {
        const v = at(item.vertex);
        const r = s.r ?? ANGLE_RADIUS;
        const first = Math.atan2(at(item.from).y - v.y, at(item.from).x - v.x);
        const second = Math.atan2(at(item.to).y - v.y, at(item.to).x - v.x);
        let sweep =
          (((second - first) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        if (s.full && sweep < 1e-9) sweep = 2 * Math.PI;
        // stop a full turn just short, so its arrow head can be seen
        const shown = Math.min(sweep, 2 * Math.PI - 0.12);
        const point = (angle: number, radius = r) =>
          px({
            x: v.x + radius * Math.cos(angle),
            y: v.y + radius * Math.sin(angle),
          });
        const start = point(first);
        const end = point(first + shown);
        const color = COLORS[s.color === "ink" ? "blue" : s.color];
        // y is flipped, so the picture keeps its turn: sweep flag 0 draws it anticlockwise on screen
        const arc = `A ${r * UNIT} ${r * UNIT} 0 ${shown > Math.PI ? 1 : 0} 0 ${end.x} ${end.y}`;
        const centre = px(v);
        const middle = first + sweep / 2;
        // an arrow head at the end of the arc, pointing along it
        const tip = end;
        const back = point(first + shown - 0.18 * (0.55 / r));
        const along = unit(sub(tip, back));
        const across = { x: -along.y, y: along.x };
        const head = [
          add(tip, times(across, 0)),
          sub(sub(tip, times(along, 7)), times(across, 4)),
          add(sub(tip, times(along, 7)), times(across, 4)),
        ];
        return (
          <g key={i}>
            {s.fill && (
              <path
                d={`M ${centre.x} ${centre.y} L ${start.x} ${start.y} ${arc} Z`}
                fill={color}
                fillOpacity={0.18}
              />
            )}
            {sweep > 1e-9 && (
              <path
                d={`M ${start.x} ${start.y} ${arc}`}
                stroke={color}
                strokeWidth={2}
                fill="none"
              />
            )}
            {s.arrow && sweep > 1e-9 && (
              <polygon
                points={head.map((h) => `${h.x},${h.y}`).join(" ")}
                fill={color}
              />
            )}
            {s.label &&
              text(
                point(middle, r + 0.38),
                s.label,
                s.color === "ink" ? "ink" : s.color,
              )}
          </g>
        );
      }
      case "ticks": {
        const a = px(at(item.from));
        const b = px(at(item.to));
        const middle = times(add(a, b), 0.5);
        const along = unit(sub(b, a));
        const across = { x: -along.y, y: along.x };
        return (
          <g key={i} {...stroke(s)} strokeWidth={1.5}>
            {Array.from({ length: item.count }, (_, k) => {
              const centre = add(
                middle,
                times(along, (k - (item.count - 1) / 2) * 5),
              );
              const p = add(centre, times(across, 6));
              const q = sub(centre, times(across, 6));
              return <line key={k} x1={p.x} y1={p.y} x2={q.x} y2={q.y} />;
            })}
          </g>
        );
      }
      case "text":
        return text(px(item), item.text, s.color, String(i));
    }
  });

  const shown = points.filter((p) => !p.hidden);
  const description = [`Points ${shown.map((p) => p.name).join(", ")}`, caption]
    .filter(Boolean)
    .join(". ");

  return (
    <Figure caption={caption}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto block h-auto w-full text-fd-foreground"
        style={{ maxWidth: width * 1.15 }}
        role="img"
        aria-label={description}
      >
        {drawn}
        {shown.map((p) => {
          const c = px(p);
          const offset = OFFSETS[p.at];
          return (
            <Fragment key={p.name}>
              <circle cx={c.x} cy={c.y} r={3.5} fill="currentColor" />
              {text(
                { x: c.x + offset.x * 14, y: c.y - offset.y * 14 },
                p.name,
                "ink",
              )}
            </Fragment>
          );
        })}
      </svg>
    </Figure>
  );
}
