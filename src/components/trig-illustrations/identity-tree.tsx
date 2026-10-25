import { Fragment } from "react";
import { Figure } from "../figure";
import { BLUE, Svg } from "../illustrations";

/**
 * A picture for the Working with identities guide of the Trigonometry chapter: three starting
 * formulas, and arrows down to the formulas built from them, each arrow labelled with what you do.
 * On a wide screen the three starting formulas sit in a row along the top and the others hang
 * below them. On a narrow screen the same tree is drawn as an indented list, read from top to
 * bottom, so the words stay large enough to read.
 */

type Pt = readonly [number, number];

/**
 * a line of a box: a formula written out (indented when it starts with two spaces, to show it
 * carries on from the line before), or a fraction centred in the box
 */
type Line = string | { top: string; bottom: string };

/** a box: its title (on two lines when it is an array), its formulas, and whether it is a start */
type Node = { title: string | string[]; lines: Line[]; starter?: boolean };

const titleLines = (node: Node) =>
  typeof node.title === "string" ? [node.title] : node.title;

const NODES = {
  pythagoras: {
    title: ["Sine squared plus", "cosine squared"],
    lines: ["cos² x + sin² x = 1"],
    starter: true,
  },
  negative: {
    title: "Negative angles",
    lines: ["cos(−x) = cos x", "sin(−x) = −sin x"],
    starter: true,
  },
  addition: {
    title: "Addition formulas",
    lines: [
      "sin(a + b) =",
      "  sin a cos b + cos a sin b",
      "cos(a + b) =",
      "  cos a cos b − sin a sin b",
    ],
    starter: true,
  },
  secant: {
    title: "One plus tangent squared",
    lines: ["1 + tan² x = sec² x"],
  },
  double: {
    title: "Double angles",
    lines: ["sin 2x = 2 sin x cos x", "cos 2x = cos² x − sin² x"],
  },
  difference: {
    title: "Differences",
    lines: ["sin(a − b), cos(a − b):", "the middle sign flips"],
  },
  tangent: {
    title: "Tangent of a sum",
    lines: [
      "tan(a + b) =",
      { top: "tan a + tan b", bottom: "1 − tan a tan b" },
    ],
  },
  cosDouble: {
    title: "Two more forms of cos 2x",
    lines: ["cos 2x = 2 cos² x − 1", "cos 2x = 1 − 2 sin² x"],
  },
  turns: {
    title: "Right and straight angles",
    lines: ["sin(π/2 − x) = cos x", "sin(π − x) = sin x"],
  },
  half: {
    title: "Half angles",
    lines: ["cos² x = ½(1 + cos 2x)", "sin² x = ½(1 − cos 2x)"],
  },
} satisfies Record<string, Node>;

type Key = keyof typeof NODES;

const LINE = 19;
const TITLE = 13.5;
const TEXT = 13;
const LABEL = 12.5;

/** the height a box needs for its title and lines; a fraction takes the room of two lines */
function boxHeight(node: Node) {
  const rows = node.lines.reduce(
    (n, line) => n + (typeof line === "string" ? 1 : 2.2),
    0,
  );
  return 24 + 20 + (rows + titleLines(node).length - 2) * LINE + 14;
}

/** one box: a rounded frame, a bold title and the formula lines under it */
function Box({
  node,
  x,
  y,
  w,
  h,
}: {
  node: Node;
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  const titles = titleLines(node);
  let baseline = y + 24 + 20 + (titles.length - 1) * LINE;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill={node.starter ? BLUE : "var(--color-fd-card)"}
        fillOpacity={node.starter ? 0.12 : 1}
        stroke={node.starter ? BLUE : "currentColor"}
        strokeOpacity={node.starter ? 1 : 0.35}
        strokeWidth={node.starter ? 2 : 1.5}
      />
      <text
        x={x + 12}
        y={y + 24}
        fontSize={TITLE}
        fontWeight={700}
        fill={node.starter ? BLUE : "currentColor"}
      >
        {titles.map((line, i) => (
          <tspan key={i} x={x + 12} dy={i === 0 ? 0 : LINE}>
            {line}
          </tspan>
        ))}
      </text>
      {node.lines.map((line, i) => {
        if (typeof line === "string") {
          const at = baseline;
          baseline += LINE;
          const carried = line.startsWith("  ");
          return (
            <text
              key={i}
              x={x + (carried ? 26 : 12)}
              y={at}
              fontSize={TEXT}
              fill="currentColor"
            >
              {line.trim()}
            </text>
          );
        }
        // the fraction is centred in the box, its bar between this line and the next
        const bar = baseline + 4;
        const centre = x + w / 2;
        baseline += 2.2 * LINE;
        return (
          <g key={i} fontSize={TEXT} fill="currentColor">
            <text x={centre} y={bar - 6} textAnchor="middle">
              {line.top}
            </text>
            <line
              x1={centre - 52}
              x2={centre + 52}
              y1={bar}
              y2={bar}
              stroke="currentColor"
              strokeWidth={1.2}
            />
            <text x={centre} y={bar + 17} textAnchor="middle">
              {line.bottom}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/** a path through the given points with an arrowhead at the last one */
function Arrow({ points }: { points: Pt[] }) {
  const end = points[points.length - 1]!;
  const before = points[points.length - 2]!;
  const dx = end[0] - before[0];
  const dy = end[1] - before[1];
  const length = Math.hypot(dx, dy);
  const ux = dx / length;
  const uy = dy / length;
  const head = 8;
  const half = 4.5;
  const base: Pt = [end[0] - ux * head, end[1] - uy * head];
  const shaft = [...points.slice(0, -1), base];
  return (
    <g className="text-fd-muted-foreground">
      <polyline
        points={shaft.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <polygon
        points={[
          end,
          [base[0] - uy * half, base[1] + ux * half],
          [base[0] + uy * half, base[1] - ux * half],
        ]
          .map((p) => p.join(","))
          .join(" ")}
        fill="currentColor"
      />
    </g>
  );
}

/** the words on an arrow, one or two lines, in italics */
function Label({
  x,
  y,
  lines,
  anchor = "start",
}: {
  x: number;
  y: number;
  lines: string[];
  anchor?: "start" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={LABEL}
      fontStyle="italic"
      textAnchor={anchor}
      className="fill-fd-muted-foreground"
    >
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : 15}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

/** the wide drawing: the starting formulas in a row on top, in columns of boxes 208 wide */
function WideTree() {
  const W = 700;
  const w = 208;
  const col = [12, 246, 480] as const;
  const mid = col.map((x) => x + w / 2);
  const gap = 64;
  const heights = [117, 79, 102, 79];
  const top: number[] = [12];
  for (let i = 1; i < heights.length; i++)
    top.push(top[i - 1]! + heights[i - 1]! + gap);
  const bottom = (row: number) => top[row]! + heights[row]!;
  const H = bottom(3) + 12;

  const place: [Key, number, number][] = [
    ["pythagoras", 0, 0],
    ["addition", 1, 0],
    ["negative", 2, 0],
    ["secant", 0, 1],
    ["double", 1, 1],
    ["difference", 2, 1],
    ["tangent", 0, 2],
    ["cosDouble", 1, 2],
    ["turns", 2, 2],
    ["half", 1, 3],
  ];

  // the label of a straight arrow down a column sits beside it, half way down the gap
  const labelY = (row: number) => bottom(row) + gap / 2 - 4;
  const elbow = col[1]! - 13;

  return (
    <Svg
      width={W}
      height={H}
      label="A tree of formulas. Along the top are three starting formulas: sine squared plus cosine squared is 1, the negative angle formulas, and the addition formulas. Dividing the first by cos² x gives 1 + tan² x = sec² x. Putting b = a in the addition formulas gives the double angles; replacing sin² x by 1 − cos² x gives two more forms of cos 2x, and solving those for cos² x and sin² x gives the half angles. Dividing sin(a + b) by cos(a + b) gives the tangent of a sum. Putting −b for b, with the negative angles, gives the differences, and putting a = π/2 or a = π in those gives the formulas for right and straight angles."
    >
      <Arrow
        points={[
          [mid[0]!, bottom(0)],
          [mid[0]!, top[1]!],
        ]}
      />
      <Label x={mid[0]! + 8} y={labelY(0)} lines={["divide by", "cos² x"]} />

      <Arrow
        points={[
          [mid[1]!, bottom(0)],
          [mid[1]!, top[1]!],
        ]}
      />
      <Label x={mid[1]! + 8} y={labelY(0)} lines={["put b = a"]} />

      <Arrow
        points={[
          [mid[2]!, bottom(0)],
          [mid[2]!, top[1]!],
        ]}
      />
      <Label x={mid[2]! + 8} y={labelY(0)} lines={["put −b", "for b"]} />
      <Arrow
        points={[
          [col[1]! + w - 16, bottom(0)],
          [col[2]! + 16, top[1]!],
        ]}
      />

      {/* from the addition formulas round the side of the double angles to the tangent */}
      <Arrow
        points={[
          [col[1]! + 16, bottom(0)],
          [col[1]! + 16, bottom(0) + 16],
          [elbow, bottom(0) + 16],
          [elbow, top[2]! + heights[2]! / 2],
          [col[0]! + w, top[2]! + heights[2]! / 2],
        ]}
      />
      <Label
        x={elbow - 8}
        y={labelY(1)}
        lines={["divide sin", "by cos"]}
        anchor="end"
      />

      <Arrow
        points={[
          [mid[1]!, bottom(1)],
          [mid[1]!, top[2]!],
        ]}
      />
      <Label
        x={mid[1]! + 8}
        y={labelY(1)}
        lines={["use sin² x =", "1 − cos² x"]}
      />

      <Arrow
        points={[
          [mid[2]!, bottom(1)],
          [mid[2]!, top[2]!],
        ]}
      />
      <Label
        x={mid[2]! + 8}
        y={labelY(1)}
        lines={["put a = π/2", "or a = π"]}
      />

      <Arrow
        points={[
          [mid[1]!, bottom(2)],
          [mid[1]!, top[3]!],
        ]}
      />
      <Label
        x={mid[1]! + 8}
        y={labelY(2)}
        lines={["solve for", "cos² x, sin² x"]}
      />

      {place.map(([key, c, row]) => (
        <Box
          key={key}
          node={NODES[key]}
          x={col[c]!}
          y={top[row]!}
          w={w}
          h={heights[row]!}
        />
      ))}
    </Svg>
  );
}

/** the narrow drawing: the same tree as an indented list, each child under its parent */
function TallTree() {
  const W = 360;
  const indent = 30;
  const items: { key: Key; level: number; parent?: Key; label?: string }[] = [
    { key: "pythagoras", level: 0 },
    {
      key: "secant",
      level: 1,
      parent: "pythagoras",
      label: "divide by cos² x",
    },
    { key: "negative", level: 0 },
    { key: "addition", level: 0 },
    { key: "double", level: 1, parent: "addition", label: "put b = a" },
    {
      key: "cosDouble",
      level: 2,
      parent: "double",
      label: "use sin² x = 1 − cos² x",
    },
    {
      key: "half",
      level: 3,
      parent: "cosDouble",
      label: "solve for cos² x and sin² x",
    },
    {
      key: "tangent",
      level: 1,
      parent: "addition",
      label: "divide sin by cos",
    },
    {
      key: "difference",
      level: 1,
      parent: "addition",
      label: "put −b for b, use negative angles",
    },
    {
      key: "turns",
      level: 2,
      parent: "difference",
      label: "put a = π/2 or a = π",
    },
  ];

  const boxes = new Map<Key, { x: number; y: number; w: number; h: number }>();
  const labels: { x: number; y: number; text: string }[] = [];
  const arrows: Pt[][] = [];
  let y = 8;
  for (const item of items) {
    const x = 8 + item.level * indent;
    const w = W - 8 - x;
    const h = boxHeight(NODES[item.key]);
    if (item.label) {
      labels.push({ x: x + 2, y: y + 13, text: item.label });
      y += 22;
    } else if (y > 8) {
      y += 10;
    }
    boxes.set(item.key, { x, y, w, h });
    if (item.parent) {
      const parent = boxes.get(item.parent)!;
      const spine = parent.x + 16;
      arrows.push([
        [spine, parent.y + parent.h],
        [spine, y + h / 2],
        [x, y + h / 2],
      ]);
    }
    y += h + 8;
  }
  const H = y + 4;

  return (
    <Svg
      width={W}
      height={H}
      label="A tree of formulas, read from top to bottom. Three starting formulas are shaded: sine squared plus cosine squared is 1, the negative angle formulas, and the addition formulas. Under each starting formula, indented, are the formulas built from it, each with a label saying what you do to get there."
    >
      {arrows.map((points, i) => (
        <Arrow key={i} points={points} />
      ))}
      {labels.map((label, i) => (
        <Label key={i} x={label.x} y={label.y} lines={[label.text]} />
      ))}
      {items.map((item) => {
        const box = boxes.get(item.key)!;
        return (
          <Fragment key={item.key}>
            <Box node={NODES[item.key]} {...box} />
          </Fragment>
        );
      })}
    </Svg>
  );
}

export function IdentityTree({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <div className="@container">
        <div className="hidden @xl:block">
          <WideTree />
        </div>
        <div className="@xl:hidden">
          <TallTree />
        </div>
      </div>
    </Figure>
  );
}
