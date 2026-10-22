/**
 * The little language of ```plane fences, which draw static geometry figures. One item per line,
 * with coordinates in units and y pointing up:
 *
 *   point P 0 0 sw          a dot labelled P at (0, 0), label to the south west (default ne);
 *                           add `hidden` for a point that is only used to place other things
 *   segment P Q             the segment PQ          line P Q    the whole line through P and Q
 *   ray P Q                 the ray from P through Q
 *   polygon P Q M           a shaded region with these corners
 *   angle Q P M             the angle at P turning anticlockwise from ray PQ to ray PM
 *   right Q P M             the square mark for a right angle at P
 *   circle P 2              the circle with centre P and radius 2 (add `fill` for the disc)
 *   ticks P Q 1             equal-length marks on the segment PQ (1, 2 or 3 of them)
 *   text 1 2 "c = 5"        a label at (1, 2)
 *   caption "Words under the figure"
 *
 * Options after an item: label="a", color=orange (blue, orange, green, purple, red, muted),
 * dashed, fill, arrow (on an angle's arc), full (an angle all the way round), r=0.8 (an angle's
 * arc radius), side=right (put a segment's label on its other side), extend=2 (how far a line or
 * ray runs past its points).
 */

export type PlaneColor =
  "blue" | "orange" | "green" | "purple" | "red" | "muted" | "ink";
export const PLANE_COLORS: PlaneColor[] = [
  "blue",
  "orange",
  "green",
  "purple",
  "red",
  "muted",
];
const POSITIONS = ["n", "s", "e", "w", "ne", "nw", "se", "sw"] as const;
export type LabelPosition = (typeof POSITIONS)[number];

export type PlanePoint = {
  name: string;
  x: number;
  y: number;
  at: LabelPosition;
  hidden: boolean;
};

export type PlaneItem =
  | { kind: "segment" | "line" | "ray"; from: string; to: string; style: Style }
  | { kind: "polygon"; corners: string[]; style: Style }
  | {
      kind: "angle" | "right";
      from: string;
      vertex: string;
      to: string;
      style: Style;
    }
  | { kind: "circle"; centre: string; radius: number; style: Style }
  | { kind: "ticks"; from: string; to: string; count: number; style: Style }
  | { kind: "text"; x: number; y: number; text: string; style: Style };

export type Style = {
  label?: string;
  color: PlaneColor;
  dashed: boolean;
  fill: boolean;
  arrow: boolean;
  full: boolean;
  r?: number;
  side: "left" | "right";
  extend?: number;
};

export type PlaneSpec = {
  points: PlanePoint[];
  items: PlaneItem[];
  caption?: string;
};

// split a line into words, keeping "quoted text" (and key="quoted text") together
function words(line: string) {
  return [...line.matchAll(/(?:[^\s"]+="[^"]*"|"[^"]*"|\S+)/g)].map(
    (m) => m[0],
  );
}

const unquote = (text: string) => text.replace(/^"(.*)"$/, "$1");

export function parsePlane(source: string): PlaneSpec {
  const points = new Map<string, PlanePoint>();
  const items: PlaneItem[] = [];
  let caption: string | undefined;

  for (const [index, raw] of source.split("\n").entries()) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const problem = (message: string): never => {
      throw new Error(
        `plane figure, line ${index + 1} ("${line}"): ${message}`,
      );
    };
    const [command, ...rest] = words(line);
    const args = rest.filter((w) => !isFlag(w) && !w.includes("="));
    const style = readStyle(rest, problem);

    const number = (text: string | undefined, what: string) => {
      const n = Number(text);
      if (text === undefined || !Number.isFinite(n))
        problem(`${what} should be a number`);
      return n;
    };
    const point = (name: string | undefined) => {
      if (!name || !points.has(name))
        problem(`unknown point "${name ?? ""}"; add a point line first`);
      return name!;
    };

    switch (command) {
      case "point": {
        const [name, x, y, at = "ne"] = args;
        if (!name) problem("a point needs a name, e.g. point P 0 0");
        if (!POSITIONS.includes(at as LabelPosition))
          problem(`label position should be one of ${POSITIONS.join(", ")}`);
        points.set(name!, {
          name: name!,
          x: number(x, "x"),
          y: number(y, "y"),
          at: at as LabelPosition,
          hidden: rest.includes("hidden"),
        });
        break;
      }
      case "segment":
      case "line":
      case "ray":
        items.push({
          kind: command,
          from: point(args[0]),
          to: point(args[1]),
          style,
        });
        break;
      case "polygon":
        if (args.length < 3) problem("a polygon needs at least three corners");
        items.push({ kind: "polygon", corners: args.map(point), style });
        break;
      case "angle":
      case "right":
        items.push({
          kind: command,
          from: point(args[0]),
          vertex: point(args[1]),
          to: point(args[2]),
          style,
        });
        break;
      case "circle": {
        const radius = number(args[1], "the radius");
        if (radius <= 0) problem("the radius should be positive");
        items.push({ kind: "circle", centre: point(args[0]), radius, style });
        break;
      }
      case "ticks": {
        const count = number(args[2] ?? "1", "the number of ticks");
        if (![1, 2, 3].includes(count)) problem("ticks should be 1, 2 or 3");
        items.push({
          kind: "ticks",
          from: point(args[0]),
          to: point(args[1]),
          count,
          style,
        });
        break;
      }
      case "text": {
        const text = rest.find((w) => w.startsWith('"'));
        if (text === undefined)
          problem('text needs words in quotes, e.g. text 1 2 "c"');
        items.push({
          kind: "text",
          x: number(args[0], "x"),
          y: number(args[1], "y"),
          text: unquote(text!),
          style,
        });
        break;
      }
      case "caption": {
        const text = rest.find((w) => w.startsWith('"'));
        if (text === undefined) problem("caption needs words in quotes");
        caption = unquote(text!);
        break;
      }
      default:
        problem(`unknown item "${command}"`);
    }
  }
  if (points.size === 0)
    throw new Error("plane figure: add at least one point");
  return { points: [...points.values()], items, caption };
}

const FLAGS = ["dashed", "fill", "arrow", "full", "hidden"];
const isFlag = (word: string) => FLAGS.includes(word) || word.startsWith('"');

function readStyle(
  words: string[],
  problem: (message: string) => never,
): Style {
  const style: Style = {
    color: "ink",
    dashed: words.includes("dashed"),
    fill: words.includes("fill"),
    arrow: words.includes("arrow"),
    full: words.includes("full"),
    side: "left",
  };
  for (const word of words) {
    if (word.startsWith('"')) continue;
    const [key, value] = word.split(/=(.*)/s);
    if (value === undefined) continue;
    const text = unquote(value);
    if (key === "label") style.label = text;
    else if (key === "color") {
      if (!PLANE_COLORS.includes(text as PlaneColor))
        problem(`color should be one of ${PLANE_COLORS.join(", ")}`);
      style.color = text as PlaneColor;
    } else if (key === "r" || key === "extend") {
      const n = Number(text);
      if (!Number.isFinite(n) || n <= 0)
        problem(`${key} should be a positive number`);
      style[key] = n;
    } else if (key === "side") {
      if (text !== "left" && text !== "right")
        problem("side should be left or right");
      style.side = text;
    } else problem(`unknown option "${key}"`);
  }
  return style;
}
