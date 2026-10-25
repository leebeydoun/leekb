import { Figure } from "../figure";
import { BLUE, ORANGE, Svg, Words } from "../illustrations";
import { Arrow, GREEN, MUTED } from "../function-illustrations/plot";

/**
 * Pictures for the guide Repeating a mapping. A playlist of five songs on repeat, where the next
 * button walks round a loop and comes home after five presses; the doubling key on a number line,
 * where the jumps grow and never come back; and the powers of a turn by 2π/5, which land on the
 * corners of a regular pentagon.
 */

/** Five songs in a ring, an arrow from each to the next and from song 5 back to song 1. */
export function PlaylistLoop({ caption }: { caption?: string }) {
  const cx = 280;
  const cy = 158;
  const ring = 104;
  const disc = 30;
  // song k sits at the top for k = 1 and then clockwise, a fifth of a turn apart
  const at = (k: number) => {
    const a = -Math.PI / 2 + ((k - 1) * 2 * Math.PI) / 5;
    return { x: cx + ring * Math.cos(a), y: cy + ring * Math.sin(a), a };
  };
  const songs = [1, 2, 3, 4, 5];

  return (
    <Figure caption={caption}>
      <Svg
        width={560}
        height={320}
        label="Five songs, numbered 1 to 5, drawn as discs in a ring with song 1 at the top and the others going round clockwise. An arrow labelled next runs from each song to the following one, and from song 5 back to song 1. Song 2 is coloured orange and marked now playing."
      >
        {songs.map((k) => {
          const p = at(k);
          const q = at((k % 5) + 1);
          const len = Math.hypot(q.x - p.x, q.y - p.y);
          const ux = (q.x - p.x) / len;
          const uy = (q.y - p.y) / len;
          // the word "next" sits outside the ring, beside the middle of the arrow
          const mid = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
          const out = Math.hypot(mid.x - cx, mid.y - cy);
          const lx = cx + ((mid.x - cx) / out) * (out + 22);
          const ly = cy + ((mid.y - cy) / out) * (out + 22);
          return (
            <g key={k}>
              <Arrow
                x1={p.x + ux * (disc + 4)}
                y1={p.y + uy * (disc + 4)}
                x2={q.x - ux * (disc + 4)}
                y2={q.y - uy * (disc + 4)}
                color={MUTED}
              />
              <Words x={lx} y={ly + 5} size={13} color={MUTED}>
                next
              </Words>
            </g>
          );
        })}
        {songs.map((k) => {
          const p = at(k);
          const playing = k === 2;
          return (
            <g key={k}>
              <circle
                cx={p.x}
                cy={p.y}
                r={disc}
                fill={playing ? ORANGE : BLUE}
                fillOpacity={playing ? 0.9 : 0.15}
                stroke={playing ? ORANGE : BLUE}
                strokeWidth={2.5}
              />
              {/* a small music note above the number */}
              <g
                fill={playing ? "white" : BLUE}
                stroke={playing ? "white" : BLUE}
              >
                <ellipse cx={p.x - 5} cy={p.y - 9} rx={4} ry={3} />
                <line
                  x1={p.x - 1.5}
                  y1={p.y - 9}
                  x2={p.x - 1.5}
                  y2={p.y - 22}
                  strokeWidth={1.8}
                />
                <line
                  x1={p.x - 1.5}
                  y1={p.y - 22}
                  x2={p.x + 6}
                  y2={p.y - 18}
                  strokeWidth={1.8}
                />
              </g>
              <text
                x={p.x}
                y={p.y + 16}
                textAnchor="middle"
                fontSize={16}
                fontWeight={700}
                fill={playing ? "white" : "currentColor"}
              >
                {k}
              </text>
            </g>
          );
        })}
        <Words x={at(2).x + 40} y={at(2).y - 30} anchor="start" color={ORANGE}>
          now playing
        </Words>
        <Words x={30} y={300} anchor="start" size={14}>
          five presses of next: 2, 3, 4, 5, 1, 2
        </Words>
      </Svg>
    </Figure>
  );
}

/** The doubling key from 3: jumps to 6, 12, 24 and 48 on a number line, each twice as long. */
export function DoublingJumps({ caption }: { caption?: string }) {
  const left = 30;
  const unit = 10.4;
  const base = 170;
  const px = (n: number) => left + n * unit;
  const values = [3, 6, 12, 24, 48];
  const ticks = [0, 10, 20, 30, 40, 50];

  return (
    <Figure caption={caption}>
      <Svg
        width={590}
        height={220}
        label="A number line from 0 to 50 with dots at 3, 6, 12, 24 and 48. An arc labelled times 2 jumps from each dot to the next: from 3 to 6, 6 to 12, 12 to 24 and 24 to 48. Each jump is twice as long as the one before, and none of them comes back towards 3."
      >
        <line
          x1={px(0) - 10}
          x2={px(50) + 14}
          y1={base}
          y2={base}
          stroke="currentColor"
          strokeWidth={1.5}
        />
        <polygon
          points={`${px(50) + 20},${base} ${px(50) + 10},${base - 5} ${px(50) + 10},${base + 5}`}
          fill="currentColor"
        />
        {ticks.map((n) => (
          <g key={n}>
            <line
              x1={px(n)}
              x2={px(n)}
              y1={base - 6}
              y2={base + 6}
              stroke="currentColor"
              strokeWidth={1.5}
            />
            <text
              x={px(n)}
              y={base + 40}
              textAnchor="middle"
              fontSize={12}
              className="fill-fd-muted-foreground"
            >
              {n}
            </text>
          </g>
        ))}
        {values.slice(0, -1).map((v, i) => {
          const w = values[i + 1]!;
          const x1 = px(v);
          const x2 = px(w);
          const h = Math.min(120, 22 + (x2 - x1) * 0.5);
          const mid = (x1 + x2) / 2;
          // the arrowhead points along the curve where it lands, from the control point to the end
          const tip = { x: x2, y: base - 9 };
          const dx = tip.x - mid;
          const dy = tip.y - (base - 8 - 2 * h);
          const len = Math.hypot(dx, dy);
          const ux = dx / len;
          const uy = dy / len;
          const bx = tip.x - ux * 11;
          const by = tip.y - uy * 11;
          return (
            <g key={v}>
              <path
                d={`M${x1},${base - 9} Q${mid},${base - 8 - 2 * h} ${bx + ux * 3},${by + uy * 3}`}
                fill="none"
                stroke={BLUE}
                strokeWidth={2.5}
              />
              <polygon
                points={`${tip.x},${tip.y} ${bx - uy * 5},${by + ux * 5} ${bx + uy * 5},${by - ux * 5}`}
                fill={BLUE}
              />
              <Words x={mid} y={base - 9 - h - 8} size={13} color={BLUE}>
                ×2
              </Words>
            </g>
          );
        })}
        {values.map((v, i) => (
          <g key={v}>
            <circle
              cx={px(v)}
              cy={base}
              r={5.5}
              fill={i === 0 ? ORANGE : BLUE}
              stroke="var(--color-fd-card)"
              strokeWidth={2}
            />
            <Words
              x={px(v)}
              y={base + 22}
              size={14}
              color={i === 0 ? ORANGE : BLUE}
            >
              {String(v)}
            </Words>
          </g>
        ))}
      </Svg>
    </Figure>
  );
}

/**
 * The point X = (3, 0) and its images under the powers of the turn G by 2π/5 about O: five points
 * on the circle of radius 3, a fifth of a turn apart, joined in order and back to X.
 */
export function TurnPowers({ caption }: { caption?: string }) {
  const size = 420;
  const c = size / 2;
  const unit = 46;
  const r = 3;
  const px = (x: number) => c + x * unit;
  const py = (y: number) => c - y * unit;
  const pts = Array.from({ length: 5 }, (_, k) => {
    const a = (2 * Math.PI * k) / 5;
    return { x: r * Math.cos(a), y: r * Math.sin(a), a };
  });
  const names = ["X", "G(X)", "G²(X)", "G³(X)", "G⁴(X)"];
  // the arc of the first turn, from X round to G(X), at radius 1.1
  const arcR = 1.1 * unit;
  const a1 = (2 * Math.PI) / 5;

  return (
    <Figure caption={caption}>
      <Svg
        width={size}
        height={size}
        label="The origin O with a dashed circle of radius 3 around it. The point X = (3, 0) is in orange on the right of the circle. Going anticlockwise round the circle, a fifth of a turn apart, are G(X), G²(X), G³(X) and G⁴(X) in blue. Segments join the points in this order and then G⁴(X) back to X, making a regular pentagon. A small arc at O marks the angle 2π/5 from X to G(X)."
      >
        <line
          x1={px(-4)}
          x2={px(4)}
          y1={py(0)}
          y2={py(0)}
          stroke={MUTED}
          strokeWidth={1}
        />
        <line
          x1={px(0)}
          x2={px(0)}
          y1={py(-4)}
          y2={py(4)}
          stroke={MUTED}
          strokeWidth={1}
        />
        <circle
          cx={c}
          cy={c}
          r={r * unit}
          fill="none"
          stroke={MUTED}
          strokeDasharray="5 5"
          strokeWidth={1.5}
        />
        <polygon
          points={pts.map((p) => `${px(p.x)},${py(p.y)}`).join(" ")}
          fill={BLUE}
          fillOpacity={0.08}
          stroke={BLUE}
          strokeWidth={2}
        />
        <line
          x1={c}
          y1={c}
          x2={px(pts[0]!.x)}
          y2={py(pts[0]!.y)}
          stroke={GREEN}
          strokeWidth={2}
        />
        <line
          x1={c}
          y1={c}
          x2={px(pts[1]!.x)}
          y2={py(pts[1]!.y)}
          stroke={GREEN}
          strokeWidth={2}
        />
        <path
          d={`M${c + arcR},${c} A${arcR},${arcR} 0 0 0 ${c + arcR * Math.cos(a1)},${c - arcR * Math.sin(a1)}`}
          fill="none"
          stroke={GREEN}
          strokeWidth={2}
        />
        <Words x={c + 62} y={c - 30} anchor="start" size={14} color={GREEN}>
          2π/5
        </Words>
        <circle cx={c} cy={c} r={4} fill="currentColor" />
        <Words x={c - 10} y={c + 20} anchor="end" size={14}>
          O
        </Words>
        {pts.map((p, k) => {
          const lx = c + (r + 0.62) * unit * Math.cos(p.a);
          const ly = c - (r + 0.62) * unit * Math.sin(p.a);
          return (
            <g key={k}>
              <circle
                cx={px(p.x)}
                cy={py(p.y)}
                r={6}
                fill={k === 0 ? ORANGE : BLUE}
                stroke="var(--color-fd-card)"
                strokeWidth={2}
              />
              <Words
                x={lx}
                y={ly + 5}
                size={15}
                color={k === 0 ? ORANGE : BLUE}
              >
                {names[k]}
              </Words>
            </g>
          );
        })}
      </Svg>
    </Figure>
  );
}
