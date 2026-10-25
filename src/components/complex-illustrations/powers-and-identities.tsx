import { Figure } from "../figure";
import { ComplexGrid } from "./meeting-i";
import { BLUE, ORANGE, Words } from "../illustrations";
import {
  Arrow,
  GREEN,
  MUTED,
  Spot,
  type Pt,
} from "../function-illustrations/plot";

/**
 * Pictures for the guide Powers and identities. The powers of 1 + i from the 0th to the 5th, joined
 * in order, spiralling out from 1; and the numbers eⁱᶿ and e⁻ⁱᶿ with their sum 2 cos θ on the real
 * axis. The point x + yi sits at (x, y), and every grid has one scale across and up.
 */

// the powers (1 + i)⁰ to (1 + i)⁵, with where each label goes
const POWERS: {
  at: Pt;
  name: string;
  label: Pt;
  anchor: "start" | "middle" | "end";
}[] = [
  { at: [1, 0], name: "1", label: [1.15, 0.2], anchor: "start" },
  { at: [1, 1], name: "1 + i", label: [1.15, 1.15], anchor: "start" },
  { at: [0, 2], name: "2i", label: [0.2, 2.2], anchor: "start" },
  { at: [-2, 2], name: "−2 + 2i", label: [-2, 2.3], anchor: "middle" },
  { at: [-4, 0], name: "−4", label: [-4.2, 0.25], anchor: "end" },
  { at: [-4, -4], name: "−4 − 4i", label: [-3.6, -4.5], anchor: "middle" },
];

export function PowersOfOnePlusI({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <ComplexGrid
        x={[-5, 2]}
        y={[-5, 3]}
        unit={44}
        label="The powers of 1 + i plotted and joined in order: 1, then 1 + i, 2i, −2 + 2i, −4 and −4 − 4i. Each point is a turn of π/4 and a stretch by √2 on from the one before, so the path spirals outwards anticlockwise. Faint lines join 0 to each point."
      >
        {(s) => (
          <>
            {POWERS.map(({ at: [x, y] }, k) => (
              <line
                key={k}
                x1={s.px(0)}
                y1={s.py(0)}
                x2={s.px(x)}
                y2={s.py(y)}
                stroke={MUTED}
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
            ))}
            {POWERS.slice(1).map(({ at: [x, y] }, k) => {
              const [x0, y0] = POWERS[k]!.at;
              return (
                <Arrow
                  key={k}
                  x1={s.px(x0)}
                  y1={s.py(y0)}
                  x2={s.px(x) - (s.px(x) - s.px(x0)) * 0.06}
                  y2={s.py(y) - (s.py(y) - s.py(y0)) * 0.06}
                  color={ORANGE}
                />
              );
            })}
            {POWERS.map(({ at: [x, y], name, label: [lx, ly], anchor }) => (
              <g key={name}>
                <Spot x={s.px(x)} y={s.py(y)} color={BLUE} />
                <Words
                  x={s.px(lx)}
                  y={s.py(ly)}
                  anchor={anchor}
                  color={BLUE}
                  size={14}
                >
                  {name}
                </Words>
              </g>
            ))}
          </>
        )}
      </ComplexGrid>
    </Figure>
  );
}

export function ConjugateSum({ caption }: { caption?: string }) {
  const t = Math.PI / 4;
  const up: Pt = [Math.cos(t), Math.sin(t)];
  const down: Pt = [Math.cos(t), -Math.sin(t)];
  const sum: Pt = [2 * Math.cos(t), 0];
  return (
    <Figure caption={caption}>
      <ComplexGrid
        x={[-1.5, 2]}
        y={[-1.5, 1.5]}
        unit={90}
        label="The unit circle with the number e to the i theta above the real axis and e to the minus i theta, its mirror image, below it. Dashed lines complete the parallelogram on these two numbers, and its fourth corner, their sum, lies on the real axis at 2 cos theta."
      >
        {(s) => {
          const r = s.px(1) - s.px(0);
          const arc = (sign: number, radius: number) =>
            `M ${s.px(0) + radius} ${s.py(0)} A ${radius} ${radius} 0 0 ${sign > 0 ? 0 : 1} ${s.px(0) + radius * Math.cos(t)} ${s.py(0) - sign * radius * Math.sin(t)}`;
          return (
            <>
              <circle
                cx={s.px(0)}
                cy={s.py(0)}
                r={r}
                fill="none"
                stroke={MUTED}
                strokeWidth={1.5}
                strokeDasharray="5 5"
              />
              <path d={arc(1, 34)} fill="none" stroke={BLUE} strokeWidth={2} />
              <path
                d={arc(-1, 34)}
                fill="none"
                stroke={GREEN}
                strokeWidth={2}
              />
              {[
                { p: up, c: BLUE },
                { p: down, c: GREEN },
              ].map(({ p: [x, y], c }, k) => (
                <g key={k}>
                  <line
                    x1={s.px(0)}
                    y1={s.py(0)}
                    x2={s.px(x)}
                    y2={s.py(y)}
                    stroke={c}
                    strokeWidth={2.5}
                  />
                  <line
                    x1={s.px(x)}
                    y1={s.py(y)}
                    x2={s.px(sum[0])}
                    y2={s.py(sum[1])}
                    stroke={MUTED}
                    strokeWidth={2}
                    strokeDasharray="6 4"
                  />
                  <Spot x={s.px(x)} y={s.py(y)} color={c} />
                </g>
              ))}
              <Spot x={s.px(sum[0])} y={s.py(sum[1])} color={ORANGE} />
              <Words
                x={s.px(0.82)}
                y={s.py(0.82)}
                anchor="start"
                color={BLUE}
                size={17}
              >
                eⁱᶿ
              </Words>
              <Words
                x={s.px(0.82)}
                y={s.py(-0.95)}
                anchor="start"
                color={GREEN}
                size={17}
              >
                e⁻ⁱᶿ
              </Words>
              <Words
                x={s.px(0.5)}
                y={s.py(0.12)}
                anchor="start"
                color={BLUE}
                size={14}
              >
                θ
              </Words>
              <Words
                x={s.px(0.5)}
                y={s.py(-0.25)}
                anchor="start"
                color={GREEN}
                size={14}
              >
                −θ
              </Words>
              <Words
                x={s.px(sum[0]) + 10}
                y={s.py(0) - 8}
                anchor="start"
                color={ORANGE}
              >
                2 cos θ
              </Words>
            </>
          );
        }}
      </ComplexGrid>
    </Figure>
  );
}
