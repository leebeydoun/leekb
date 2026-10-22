import { Figure } from "../figure";
import { Svg, Words } from "../illustrations";

/**
 * Pictures for the Zooming and area guide: one large pizza beside two small ones, drawn to the same
 * scale, so you can see that the single large pizza has more to eat.
 */

const CRUST = "#e9b872";
const CRUST_EDGE = "#b7791f";
const CHEESE = "#fcd34d";
const PEPPERONI = "#b91c1c";

// pepperoni slices, as fractions of the pizza's radius, so every pizza is topped the same way
const TOPPINGS: [number, number][] = [
  [0, 0],
  [0.5, 0.15],
  [-0.45, 0.3],
  [0.15, -0.55],
  [-0.3, -0.45],
  [0.2, 0.6],
  [0.62, -0.32],
  [-0.65, -0.05],
];

/** a pizza seen from above, centred at (cx, cy), with radius r in pixels */
function Pizza({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx + 3} cy={cy + 4} r={r} fill="#000" fillOpacity={0.12} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={CRUST}
        stroke={CRUST_EDGE}
        strokeWidth={2}
      />
      <circle cx={cx} cy={cy} r={r * 0.86} fill={CHEESE} />
      {/* the cuts, eight slices */}
      <g stroke={CRUST_EDGE} strokeOpacity={0.55} strokeWidth={1.5}>
        {[0, 45, 90, 135].map((a) => {
          const dx = Math.cos((a * Math.PI) / 180) * r * 0.86;
          const dy = Math.sin((a * Math.PI) / 180) * r * 0.86;
          return (
            <line key={a} x1={cx - dx} y1={cy - dy} x2={cx + dx} y2={cy + dy} />
          );
        })}
      </g>
      {TOPPINGS.map(([x, y], i) => (
        <circle
          key={i}
          cx={cx + x * r}
          cy={cy + y * r}
          r={r * 0.12}
          fill={PEPPERONI}
          fillOpacity={0.9}
        />
      ))}
    </g>
  );
}

/**
 * One 12-inch pizza and two 8-inch pizzas at the same scale. The large one is the small one zoomed
 * by 1.5, so it has 1.5 × 1.5 = 2.25 times the area: more than the two small ones together.
 */
export function PizzaCompare({ caption }: { caption?: string }) {
  // 7.5 pixels to the inch: a 12-inch pizza has radius 6 inches, an 8-inch one radius 4
  const inch = 7.5;
  return (
    <Figure caption={caption}>
      <Svg
        width={580}
        height={270}
        label="One 12-inch pizza beside two 8-inch pizzas, drawn to the same scale. The large pizza has 2.25 times the area of a small one, so it has more than the two small ones together."
      >
        <Pizza cx={130} cy={118} r={6 * inch} />
        <Pizza cx={340} cy={118} r={4 * inch} />
        <Pizza cx={480} cy={118} r={4 * inch} />
        <Words x={130} y={232}>
          one 12-inch pizza
        </Words>
        <Words x={130} y={254} size={14}>
          2.25 small pizzas of food
        </Words>
        <Words x={410} y={232}>
          two 8-inch pizzas
        </Words>
        <Words x={410} y={254} size={14}>
          2 small pizzas of food
        </Words>
      </Svg>
    </Figure>
  );
}
