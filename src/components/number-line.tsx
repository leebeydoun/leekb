type Jump = {
  from: number;
  to: number;
  label?: string;
};

type Label = {
  at: number;
  text: string;
};

type NumberLineProps = {
  from: number;
  to: number;
  /** pixels per whole number, widen this to show fractions clearly */
  unit?: number;
  /** number of equal pieces to split each whole step into, drawn as small ticks */
  divisions?: number;
  /** text shown above the line at any point, e.g. a fraction */
  labels?: Label[];
  /** points to mark with a filled dot */
  points?: number[];
  /** arcs drawn above the line, e.g. to show addition as movement */
  jumps?: Jump[];
  /** optional caption shown under the line */
  caption?: string;
};

const PAD_X = 28;
// how far the curve control point sits above the line; wider jumps arc higher so nested jumps never cross
function arcLift(jump: Jump) {
  return 24 + 14 * Math.abs(jump.to - jump.from);
}

function formatNumber(n: number) {
  // proper minus sign instead of a hyphen
  return n < 0 ? `−${Math.abs(n)}` : String(n);
}

function defaultJumpLabel({ from, to }: Jump) {
  const d = to - from;
  return d >= 0 ? `+${d}` : formatNumber(d);
}

export function NumberLine({
  from,
  to,
  points = [],
  jumps = [],
  unit = 48,
  divisions = 1,
  labels = [],
  caption,
}: NumberLineProps) {
  const count = to - from;
  const width = count * unit + PAD_X * 2;
  // leave room above the line for the tallest arc and its label
  const LINE_Y = Math.max(70, ...jumps.map((j) => arcLift(j) / 2 + 16));
  const height = LINE_Y + 40;
  const x = (n: number) => PAD_X + (n - from) * unit;
  const ticks = Array.from({ length: count + 1 }, (_, i) => from + i);
  const minorTicks = Array.from({ length: count * divisions + 1 }, (_, i) => from + i / divisions);

  return (
    <figure className="not-prose my-6">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto max-w-2xl mx-auto block text-fd-foreground"
        role="img"
        aria-label={`Number line from ${from} to ${to}`}
      >
        {/* the line itself, with arrowheads showing it continues forever */}
        <line
          x1={6}
          x2={width - 6}
          y1={LINE_Y}
          y2={LINE_Y}
          stroke="currentColor"
          strokeWidth={1.5}
        />
        <polygon
          points={`2,${LINE_Y} 12,${LINE_Y - 5} 12,${LINE_Y + 5}`}
          fill="currentColor"
        />
        <polygon
          points={`${width - 2},${LINE_Y} ${width - 12},${LINE_Y - 5} ${width - 12},${LINE_Y + 5}`}
          fill="currentColor"
        />

        {divisions > 1 &&
          minorTicks.map((n, i) => (
            <line
              key={`minor-${i}`}
              x1={x(n)}
              x2={x(n)}
              y1={LINE_Y - 4}
              y2={LINE_Y + 4}
              stroke="currentColor"
              strokeWidth={1}
              className="text-fd-muted-foreground"
            />
          ))}

        {ticks.map((n) => (
          <g key={n}>
            <line
              x1={x(n)}
              x2={x(n)}
              y1={LINE_Y - (n === 0 ? 9 : 6)}
              y2={LINE_Y + (n === 0 ? 9 : 6)}
              stroke="currentColor"
              strokeWidth={n === 0 ? 2 : 1.5}
            />
            <text
              x={x(n)}
              y={LINE_Y + 26}
              textAnchor="middle"
              fontSize={14}
              fontWeight={n === 0 ? 700 : 400}
              fill="currentColor"
              className={n === 0 ? undefined : "fill-fd-muted-foreground"}
            >
              {formatNumber(n)}
            </text>
          </g>
        ))}

        {jumps.map((jump, i) => {
          const x1 = x(jump.from);
          const x2 = x(jump.to);
          const mid = (x1 + x2) / 2;
          const baseY = LINE_Y - 4;
          const control = baseY - arcLift(jump);
          // arrowhead points along the curve's tangent at its end (control point -> end point)
          const dx = x2 - mid;
          const dy = baseY - control;
          const len = Math.hypot(dx, dy);
          const ux = dx / len;
          const uy = dy / len;
          const backX = x2 - ux * 10;
          const backY = baseY - uy * 10;
          const head = `${x2},${baseY} ${backX - uy * 5},${backY + ux * 5} ${backX + uy * 5},${backY - ux * 5}`;
          return (
            <g key={i} className="text-fd-primary">
              <path
                d={`M ${x1} ${baseY} Q ${mid} ${control} ${x2 - ux * 6} ${baseY - uy * 6}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              />
              <polygon points={head} fill="currentColor" />
              <text
                x={mid}
                y={(baseY + control) / 2 + 16}
                textAnchor="middle"
                fontSize={13}
                fontWeight={600}
                fill="currentColor"
              >
                {jump.label ?? defaultJumpLabel(jump)}
              </text>
            </g>
          );
        })}

        {labels.map((label, i) => (
          <text
            key={`label-${i}`}
            x={x(label.at)}
            y={LINE_Y - 14}
            textAnchor="middle"
            fontSize={14}
            fontWeight={600}
            className="fill-fd-primary"
          >
            {label.text.replace("-", "−")}
          </text>
        ))}

        {points.map((n) => (
          <circle
            key={n}
            cx={x(n)}
            cy={LINE_Y}
            r={5}
            className="fill-fd-primary"
          />
        ))}
      </svg>
      {caption && (
        <figcaption className="mt-1 text-center text-sm text-fd-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
