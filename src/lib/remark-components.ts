/**
 * Turns markdown directives (from remark-directive) into the site's components, so content files
 * need no JSX or imports. Runs before remark-statements, which numbers the statements it creates.
 *
 * Blocks:     :::definition[Title]{#id} ... :::     (any statement kind, also proof and solution)
 *             :::proof{source="https://en.wikipedia.org/wiki/..."} ... :::     (source required)
 *             :::accordion[Title] ... :::
 *             :::area-model{row-sizes="3 2" col-sizes="3 2"} with a table inside, see below
 * One line:   ::number-line{from=-4 to=6 points="-2, 4" jumps="-2>4" intervals="(-2, 3]; [5, oo)"}
 *             ::graph{lines="2x + y = 1; 3x - 2y = 4" points="6/7, -5/7" x="-4 4" y="-4 4"}
 *             ::diagonal-square     (the tilted square of area 2 inside a 2 by 2 square)
 *             ::quiz{src="numbers"}     (questions from public/quizzes/numbers.json, checked here)
 *             ::see-also{src="https://en.wikipedia.org/wiki/..."}     (a source for an unproved
 *             statement, placed inside it)
 * Fence:      ```plane ... ``` draws a static geometry figure, see src/lib/plane.ts
 * Inline:     :ref{#id} or :ref[custom text]{#id}, or :ref{#numbers/id} for another guide
 *
 * A block must have blank lines after its opening line and before its closing `:::`, otherwise
 * Prettier joins the lines and breaks it. A block nested inside another needs one colon fewer than
 * its parent, e.g. `:::solution` inside `::::exercise`.
 */

import type { Node, Parent, PhrasingContent, RootContent, Table } from "mdast";
import type {
  ContainerDirective,
  LeafDirective,
  TextDirective,
} from "mdast-util-directive";
import type {
  MdxJsxAttribute,
  MdxJsxFlowElement,
  MdxJsxTextElement,
} from "mdast-util-mdx-jsx";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import katex from "katex";
import { toString } from "mdast-util-to-string";
import { valueToEstree } from "estree-util-value-to-estree";
import { STATEMENT_KINDS } from "./remark-statements";
import { parsePlane } from "./plane";

type File = { path?: string; value?: unknown };
type Directive = ContainerDirective | LeafDirective | TextDirective;
type Value = string | number | boolean | object;

// container directive name -> component name, e.g. definition -> Definition
const blocks = new Map<string, string>([
  ...STATEMENT_KINDS.map((kind) => [kind.toLowerCase(), kind] as const),
  ["proof", "Proof"],
  ["solution", "Solution"],
]);

function fail(file: File, node: Node, message: string): never {
  const line = node.position?.start.line;
  throw new Error(`${message} in ${file.path}${line ? `:${line}` : ""}`);
}

// a prop value, as a plain string or as a JS expression for numbers, arrays and objects
function attribute(name: string, value: Value): MdxJsxAttribute {
  if (typeof value === "string")
    return { type: "mdxJsxAttribute", name, value };
  const expression = valueToEstree(value);
  return {
    type: "mdxJsxAttribute",
    name,
    value: {
      type: "mdxJsxAttributeValueExpression",
      value: JSON.stringify(value),
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [{ type: "ExpressionStatement", expression }],
        },
      },
    },
  };
}

function element(
  type: "mdxJsxFlowElement",
  name: string,
  props: Record<string, Value | undefined>,
  children: RootContent[],
): MdxJsxFlowElement;
function element(
  type: "mdxJsxTextElement",
  name: string,
  props: Record<string, Value | undefined>,
  children: PhrasingContent[],
): MdxJsxTextElement;
function element(
  type: "mdxJsxFlowElement" | "mdxJsxTextElement",
  name: string,
  props: Record<string, Value | undefined>,
  children: RootContent[],
) {
  const attributes = Object.entries(props)
    .filter((entry): entry is [string, Value] => entry[1] !== undefined)
    .map(([key, value]) => attribute(key, value));
  return { type, name, attributes, children } as
    MdxJsxFlowElement | MdxJsxTextElement;
}

// a block's [label] arrives as its first child, a paragraph marked as the directive label
function splitLabel(node: ContainerDirective) {
  const [first, ...rest] = node.children;
  if (first?.type === "paragraph" && first.data?.directiveLabel) {
    return { label: toString(first), children: rest };
  }
  return { label: undefined, children: node.children };
}

// "3/2" -> 1.5, "-2" -> -2
function parseNumber(text: string, file: File, node: Node) {
  const [top, bottom = "1"] = text.trim().split("/");
  const value = Number(top) / Number(bottom);
  if (!Number.isFinite(value)) fail(file, node, `"${text}" is not a number`);
  return value;
}

// "4>0: label" split at the first ":" -> ["4>0", "label"]
function splitOnce(
  text: string,
  separator: string,
): [string, string | undefined] {
  const i = text.indexOf(separator);
  if (i === -1) return [text.trim(), undefined];
  return [text.slice(0, i).trim(), text.slice(i + 1).trim()];
}

function parseList(text: string | null | undefined) {
  return (text ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function numberLine(node: LeafDirective, file: File): MdxJsxFlowElement {
  const a = node.attributes ?? {};
  const num = (text: string) => parseNumber(text, file, node);
  if (!a.from || !a.to) fail(file, node, "::number-line needs from and to");

  const points = parseList(a.points);
  // "4>0" is a jump from 4 to 0, and "4>0: +(−4)" also gives it a label
  const jumps = parseList(a.jumps).map((jump) => {
    const [path, label] = splitOnce(jump, ":");
    const [from, to] = splitOnce(path, ">");
    if (to === undefined)
      fail(file, node, `jump "${jump}" should look like "from>to"`);
    return label
      ? { from: num(from), to: num(to), label }
      : { from: num(from), to: num(to) };
  });
  // "1/2" labels the point 1/2 with its own text, and "1/2: 1/2 = 2/4" gives the text explicitly;
  // the bare `labelled` flag labels every point
  const labelTexts = "labelled" in a ? points : parseList(a.labels);
  // "(-2, 3]" shades the numbers from -2 to 3, leaving out -2 and including 3; "[1, oo)" runs on
  // forever to the right and "(-oo, 0)" to the left. Several are separated by ";"
  const intervals = (a.intervals ?? "")
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const match = /^([[(])\s*([^,]+?)\s*,\s*([^\])]+?)\s*([\])])$/.exec(item);
      if (!match)
        fail(file, node, `interval "${item}" should look like "(-2, 3]"`);
      const [, open, lo, hi, close] = match as unknown as string[];
      const start = lo === "-oo" ? null : num(lo!);
      const end = hi === "oo" ? null : num(hi!);
      if ((start === null && open === "[") || (end === null && close === "]"))
        fail(file, node, `interval "${item}" can't include an endless end`);
      if (start !== null && end !== null && start >= end)
        fail(file, node, `interval "${item}" should go from smaller to larger`);
      return {
        start,
        end,
        startClosed: open === "[",
        endClosed: close === "]",
      };
    });
  const labels = labelTexts.map((item) => {
    const [at, text] = splitOnce(item, ":");
    return { at: num(at), text: text ?? at };
  });

  return element(
    "mdxJsxFlowElement",
    "NumberLine",
    {
      from: num(a.from),
      to: num(a.to),
      unit: a.unit ? num(a.unit) : undefined,
      divisions: a.divisions ? num(a.divisions) : undefined,
      points: points.length ? points.map(num) : undefined,
      jumps: jumps.length ? jumps : undefined,
      labels: labels.length ? labels : undefined,
      intervals: intervals.length ? intervals : undefined,
      caption: a.caption ?? undefined,
    },
    [],
  );
}

// the table's header row labels the columns, its first column labels the rows, and the rest of the
// cells are the areas
function areaModel(node: ContainerDirective, file: File): MdxJsxFlowElement {
  const table = node.children.find(
    (child): child is Table => child.type === "table",
  );
  if (!table) fail(file, node, ":::area-model needs a table inside");
  const [header = [], ...body] = table.children.map((row) =>
    row.children.map((cell) => toString(cell)),
  );
  const a = node.attributes ?? {};
  const sizes = (text?: string | null) =>
    text
      ? text
          .trim()
          .split(/\s+/)
          .map((size) => parseNumber(size, file, node))
      : undefined;

  return element(
    "mdxJsxFlowElement",
    "AreaModel",
    {
      cols: header.slice(1),
      rows: body.map((row) => row[0] ?? ""),
      cells: body.map((row) => row.slice(1)),
      rowSizes: sizes(a["row-sizes"]),
      colSizes: sizes(a["col-sizes"]),
      caption: a.caption ?? undefined,
    },
    [],
  );
}

// "2x - 3y = 4" -> ax + by = c with a = 2, b = -3, c = 4; terms may sit on either side and use
// fractions, e.g. "y = 1/2x + 1"
function parseLinear(text: string, file: File, node: Node) {
  const sides = text.replace(/−/g, "-").replace(/\s+/g, "").split("=");
  if (sides.length !== 2) fail(file, node, `"${text}" needs exactly one "="`);
  const totals = { x: 0, y: 0, c: 0 };
  sides.forEach((side, i) => {
    const sign = i === 0 ? 1 : -1;
    const terms = side.match(/[+-]?[^+-]+/g);
    if (!terms) fail(file, node, `"${text}" has an empty side`);
    for (const term of terms) {
      const match = /^([+-]?)(\d+(?:\.\d+)?(?:\/\d+)?)?([xy])?$/.exec(term);
      if (!match || (!match[2] && !match[3]))
        fail(file, node, `Can't read "${term}" in "${text}"`);
      const size = match[2] ? parseNumber(match[2], file, node) : 1;
      const value = (match[1] === "-" ? -1 : 1) * size * sign;
      totals[(match[3] as "x" | "y" | undefined) ?? "c"] += value;
    }
  });
  // the constant moves to the right-hand side
  const { x: a, y: b, c } = totals;
  if (a === 0 && b === 0) fail(file, node, `"${text}" has no x or y`);
  return { a, b, c: -c, label: text.trim() };
}

function graph(node: LeafDirective, file: File): MdxJsxFlowElement {
  const a = node.attributes ?? {};
  if (!a.lines)
    fail(file, node, '::graph needs lines, e.g. lines="x + y = 2; x - y = 0"');
  const list = (text?: string | null) =>
    (text ?? "")
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean);
  const range = (text: string | null | undefined, name: string) => {
    if (!text) return undefined;
    const [min, max] = text
      .trim()
      .split(/\s+/)
      .map((n) => parseNumber(n, file, node));
    if (min === undefined || max === undefined || min >= max)
      fail(
        file,
        node,
        `${name} should be two numbers, smallest first, e.g. ${name}="-4 4"`,
      );
    return [min, max];
  };
  // "6/7, -5/7" marks the point (6/7, -5/7), labelled as written
  const points = list(a.points).map((point) => {
    const [x, y] = splitOnce(point, ",");
    if (y === undefined)
      fail(file, node, `Point "${point}" needs an x and a y`);
    return {
      x: parseNumber(x, file, node),
      y: parseNumber(y, file, node),
      label: `(${x}, ${y})`.replace(/-/g, "−"),
    };
  });
  return element(
    "mdxJsxFlowElement",
    "Graph",
    {
      lines: list(a.lines).map((line) => parseLinear(line, file, node)),
      points,
      x: range(a.x, "x"),
      y: range(a.y, "y"),
      caption: a.caption ?? undefined,
    },
    [],
  );
}

const MAX_STARS = 4;
const REF = /:ref(?:\[[^\]]*\])?\{#([\w/-]+)\}/g;
const MATH = /\$\$([\s\S]+?)\$\$/g;

// read a quiz file and check it, so a mistake fails the build rather than showing up in the browser;
// returns the statement ids its text links to, for remark-statements to check and label
function checkQuiz(src: string, file: File, node: Node) {
  const path = join(process.cwd(), "public", "quizzes", `${src}.json`);
  let data: unknown;
  try {
    data = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    fail(
      file,
      node,
      `Could not read quiz ${path}: ${(error as Error).message}`,
    );
  }
  const quiz = data as { title?: unknown; questions?: unknown };
  if (typeof quiz.title !== "string")
    fail(file, node, `${path} needs a "title"`);
  if (!Array.isArray(quiz.questions) || quiz.questions.length === 0)
    fail(file, node, `${path} needs a non-empty "questions" list`);

  const ids = new Set<string>();
  const refs = new Set<string>();
  for (const [i, raw] of quiz.questions.entries()) {
    const q = raw as Record<string, unknown>;
    const where = `${path}, question ${i + 1}${typeof q.id === "string" ? ` (${q.id})` : ""}`;
    const problem: (message: string) => never = (message) =>
      fail(file, node, `${where}: ${message}`);

    if (typeof q.id !== "string" || !/^[a-z0-9-]+$/.test(q.id))
      problem(`"id" must be lowercase letters, digits and dashes`);
    if (ids.has(q.id)) problem(`duplicate id`);
    ids.add(q.id);
    if (
      !Number.isInteger(q.stars) ||
      (q.stars as number) < 1 ||
      (q.stars as number) > MAX_STARS
    )
      problem(`"stars" must be a whole number from 1 to ${MAX_STARS}`);
    if (
      !Array.isArray(q.options) ||
      q.options.length < 2 ||
      q.options.some((o) => typeof o !== "string")
    )
      problem(`"options" must be a list of at least two strings`);
    if (
      !Number.isInteger(q.answer) ||
      (q.answer as number) < 0 ||
      (q.answer as number) >= q.options.length
    )
      problem(`"answer" must be the index (from 0) of the correct option`);

    if (typeof q.question !== "string") problem(`"question" must be text`);
    if (typeof q.explanation !== "string")
      problem(`"explanation" must be text`);
    if (q.topic !== undefined && typeof q.topic !== "string")
      problem(`"topic" must be text`);

    // options are buttons, and a link inside a button is not allowed
    if (
      q.options.some(
        (option) => option.includes(":ref") || option.includes("](#"),
      )
    )
      problem(
        `options cannot contain links; put them in the explanation instead`,
      );

    for (const text of [
      q.question,
      q.explanation,
      q.topic ?? "",
      ...q.options,
    ]) {
      for (const [, tex] of text.matchAll(MATH)) {
        try {
          katex.renderToString(tex!, { throwOnError: true });
        } catch (error) {
          problem(`bad maths $$${tex}$$: ${(error as Error).message}`);
        }
      }
      for (const [, id] of text.matchAll(REF)) refs.add(id!);
    }
  }
  return [...refs];
}

// sites a proof can cite, by host, so the link reads e.g. "Wikipedia: Euclidean division"
const SOURCE_SITES: Record<string, string> = {
  "en.wikipedia.org": "Wikipedia",
  "proofwiki.org": "ProofWiki",
  "mathworld.wolfram.com": "MathWorld",
  "brilliant.org": "Brilliant",
  "www.khanacademy.org": "Khan Academy",
  "math.libretexts.org": "LibreTexts",
  "artofproblemsolving.com": "Art of Problem Solving",
  "www.mathsisfun.com": "Maths Is Fun",
  "www.cut-the-knot.org": "Cut the Knot",
  "nrich.maths.org": "NRICH",
  "www.bbc.co.uk": "BBC Bitesize",
  "openstax.org": "OpenStax",
  "en.wikibooks.org": "Wikibooks",
  "www.purplemath.com": "Purplemath",
  "betterexplained.com": "BetterExplained",
  "math.stackexchange.com": "Math Stack Exchange",
  "www.cuemath.com": "Cuemath",
};

// every proof links to an outside source a reader can check it against
function proofSource(url: string | null | undefined, file: File, node: Node) {
  if (!url)
    fail(
      file,
      node,
      ':::proof needs a source, e.g. :::proof{source="https://en.wikipedia.org/..."}',
    );
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    fail(file, node, `"${url}" is not a valid source URL`);
  }
  if (parsed.protocol !== "https:")
    fail(file, node, `Source "${url}" must use https`);
  const site = SOURCE_SITES[parsed.hostname];
  if (!site)
    fail(file, node, `Add ${parsed.hostname} to SOURCE_SITES to cite it`);
  // the page name is the last part of the path, e.g. /wiki/Euclidean_division -> "Euclidean
  // division", or /questions/123/why-is-it-true -> "Why is it true"
  const page = decodeURIComponent(
    parsed.pathname.split("/").filter(Boolean).pop() ?? "",
  )
    .replace(/\.(html?|php|asp|shtml)$/, "")
    // wiki titles use _ for spaces and keep real hyphens; other sites use - for spaces
    .replace(parsed.hostname.includes("wiki") ? /_+/g : /[_-]+/g, " ")
    .trim();
  const name = page.charAt(0).toUpperCase() + page.slice(1);
  return name ? `${site}: ${name}` : site;
}

function convert(node: Directive, file: File): RootContent {
  const a = node.attributes ?? {};

  if (node.type === "textDirective") {
    if (node.name === "ref") {
      if (!a.id) fail(file, node, ":ref needs an id, e.g. :ref{#even-odd}");
      return element("mdxJsxTextElement", "Ref", { id: a.id }, node.children);
    }
    // not meant as a directive, e.g. the ":30" in "3:30", so put the original text back
    const start = node.position?.start.offset;
    const end = node.position?.end.offset;
    const source =
      typeof file.value === "string" ? file.value : String(file.value ?? "");
    if (start === undefined || end === undefined)
      fail(file, node, `Unknown directive :${node.name}`);
    return { type: "text", value: source.slice(start, end) };
  }

  if (node.type === "leafDirective") {
    if (node.name === "number-line") return numberLine(node, file);
    if (node.name === "graph") return graph(node, file);
    if (node.name === "diagonal-square")
      return element("mdxJsxFlowElement", "DiagonalSquare", {}, []);
    // a source for a statement taken without proof, e.g. a remark
    if (node.name === "see-also") {
      if (!a.src)
        fail(
          file,
          node,
          '::see-also needs a src, e.g. ::see-also{src="https://..."}',
        );
      return element(
        "mdxJsxFlowElement",
        "SeeAlso",
        {
          source: a.src ?? undefined,
          sourceTitle: proofSource(a.src, file, node),
        },
        [],
      );
    }
    if (node.name === "quiz") {
      if (!a.src)
        fail(file, node, '::quiz needs a src, e.g. ::quiz{src="numbers"}');
      const refs = checkQuiz(a.src, file, node);
      return element(
        "mdxJsxFlowElement",
        "Quiz",
        { src: a.src, refs: refs.join(",") },
        [],
      );
    }
    fail(file, node, `Unknown directive ::${node.name}`);
  }

  if (node.name === "area-model") return areaModel(node, file);

  const { label, children } = splitLabel(node);
  if (node.name === "accordion") {
    const accordion = element(
      "mdxJsxFlowElement",
      "Accordion",
      { title: label },
      children,
    );
    return element("mdxJsxFlowElement", "Accordions", {}, [accordion]);
  }

  if (node.name === "proof")
    return element(
      "mdxJsxFlowElement",
      "Proof",
      {
        source: a.source ?? undefined,
        sourceTitle: proofSource(a.source, file, node),
      },
      children,
    );

  const name = blocks.get(node.name);
  if (!name) fail(file, node, `Unknown directive :::${node.name}`);
  return element(
    "mdxJsxFlowElement",
    name,
    { id: a.id ?? undefined, title: label },
    children,
  );
}

function isDirective(node: Node): node is Directive {
  return (
    node.type === "containerDirective" ||
    node.type === "leafDirective" ||
    node.type === "textDirective"
  );
}

export function remarkComponents() {
  return (tree: Parent, file: File) => {
    // depth first, so nested directives are converted before their parents
    const walk = (parent: Parent) => {
      parent.children = parent.children.map((child) => {
        if ("children" in child) walk(child as Parent);
        if (child.type === "code" && child.lang === "plane") {
          try {
            return element(
              "mdxJsxFlowElement",
              "PlaneFigure",
              { ...parsePlane(child.value) },
              [],
            );
          } catch (error) {
            fail(file, child, (error as Error).message);
          }
        }
        return isDirective(child) ? convert(child, file) : child;
      }) as Parent["children"];
    };
    walk(tree);
  };
}
