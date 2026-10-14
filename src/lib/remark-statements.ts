/**
 * Numbers statement blocks (Definition, Theorem, ...) and resolves Ref links to them.
 *
 * A guide is a folder of pages listed in its meta.json. Each page is a chapter numbered by its place
 * in that list (an `index` or `introduction` page doesn't count), and statements are numbered
 * "chapter.n" across the page, so the third page reads Definition 3.1, Lemma 3.2, Theorem 3.3. Exercises are counted on
 * their own as Exercise 1, 2, 3, ... A statement with an `id` can be referenced from any page of the
 * guide with `:ref{#...}`, which renders as a link labelled e.g. "Definition 3.1".
 *
 * A statement in another guide next to this one is referenced by that guide's folder name, as in
 * `:ref{#numbers/cancel-product}`, which renders as e.g. "Proposition 9.6 of Numbers".
 *
 * A page outside such a folder is numbered "section.n" instead, where section counts its `##`
 * headings, and its refs can only point within the page or to other guides.
 */

import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";

export const STATEMENT_KINDS = [
  "Definition",
  "Theorem",
  "Lemma",
  "Proposition",
  "Corollary",
  "Conjecture",
  "Example",
  "Remark",
  "Exercise",
] as const;

type Attribute = { type: string; name?: string; value?: unknown };
type Node = {
  type: string;
  name?: string | null;
  depth?: number;
  attributes?: Attribute[];
  children?: Node[];
};

/** where a statement lives and what it is called, e.g. "Definition 3.1" on /maths/numbers/addition */
type Target = { label: string; href: string };

const kinds = new Set<string>(STATEMENT_KINDS);

function isJsx(node: Node) {
  return node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement";
}

function getAttribute(node: Node, name: string) {
  const attribute = node.attributes?.find(
    (a) => a.type === "mdxJsxAttribute" && a.name === name,
  );
  return typeof attribute?.value === "string" ? attribute.value : undefined;
}

function setAttribute(node: Node, name: string, value: string) {
  node.attributes = (node.attributes ?? []).filter((a) => a.name !== name);
  node.attributes.push({ type: "mdxJsxAttribute", name, value });
}

function walk(node: Node, visit: (node: Node) => void) {
  visit(node);
  for (const child of node.children ?? []) walk(child, visit);
}

/** the site path of a content file, e.g. content/maths/numbers/index.mdx -> /maths/numbers */
function pagePath(file: string) {
  const path = relative(join(process.cwd(), "content"), file).replace(
    /\.mdx?$/,
    "",
  );
  return "/" + path.replace(/(^|\/)index$/, "");
}

// directive lines that open a statement, e.g. ":::definition[Integers]{#integers}"
const OPENING = /^:{3,}([a-z]+)(?:\[[^\]]*\])?(?:\{([^}]*)\})?\s*$/;

/**
 * The guide a page belongs to: its chapter number, and the label and link of every statement on
 * every page of the guide. Other pages are read straight from disk, since each page is compiled on
 * its own.
 */
function readGuide(file: string) {
  const guide = readFolder(dirname(file));
  if (!guide) return undefined;
  const slug = basename(file).replace(/\.mdx?$/, "");
  return { chapter: guide.chapters.indexOf(slug) + 1, targets: guide.targets };
}

function readFolder(dir: string) {
  const metaFile = join(dir, "meta.json");
  if (!existsSync(metaFile)) return undefined;
  const meta = JSON.parse(readFileSync(metaFile, "utf8")) as {
    title?: string;
    pages?: string[];
  };
  const pages = meta.pages && [...meta.pages];
  if (!pages) return undefined;

  const chapters = pages.filter(
    (page) => page !== "index" && page !== "introduction",
  );
  // a folder's index page is usually left out of meta.json, but its links still need resolving
  if (!pages.includes("index")) pages.unshift("index");
  const targets = new Map<string, Target>();

  for (const page of pages) {
    const path = join(dir, `${page}.mdx`);
    if (!existsSync(path)) continue;
    const chapter = chapters.indexOf(page) + 1;
    let statements = 0;
    let exercises = 0;
    for (const line of readFileSync(path, "utf8").split("\n")) {
      const match = OPENING.exec(line);
      const kind =
        match && STATEMENT_KINDS.find((k) => k.toLowerCase() === match[1]);
      if (!kind) continue;
      const number =
        kind === "Exercise"
          ? String(++exercises)
          : `${chapter}.${++statements}`;
      const id = /#([\w-]+)/.exec(match[2] ?? "")?.[1];
      if (!id) continue;
      if (targets.has(id))
        throw new Error(`Duplicate statement id "${id}" in ${dir}`);
      targets.set(id, {
        label: `${kind} ${number}`,
        href: `${pagePath(path)}#${id}`,
      });
    }
  }
  return { title: meta.title ?? basename(dir), chapters, targets };
}

// a statement in a neighbouring guide, from an id like "numbers/cancel-product"
function findInOtherGuide(id: string, file: string): Target | undefined {
  const slash = id.lastIndexOf("/");
  const folder = id.slice(0, slash);
  // guides sit side by side, so look next to the folder this page's guide lives in
  const guide = readFolder(join(dirname(dirname(file)), folder));
  const target = guide?.targets.get(id.slice(slash + 1));
  return target && { ...target, label: `${target.label} of ${guide!.title}` };
}

export function remarkStatements() {
  return (tree: Node, file: { path?: string }) => {
    const guide = file.path ? readGuide(file.path) : undefined;
    const local = new Map<string, Target>();
    let section = guide?.chapter ?? 0;
    let statements = 0;
    let exercises = 0;

    walk(tree, (node) => {
      if (!guide && node.type === "heading" && node.depth === 2) {
        section++;
        statements = 0;
        return;
      }
      if (!isJsx(node) || !node.name || !kinds.has(node.name)) return;

      let number: string;
      if (guide && node.name === "Exercise") number = String(++exercises);
      else
        number =
          section > 0 ? `${section}.${++statements}` : String(++statements);
      setAttribute(node, "number", number);

      const id = getAttribute(node, "id");
      if (!id) return;
      const label = `${node.name} ${number}`;
      if (local.has(id))
        throw new Error(`Duplicate statement id "${id}" in ${file.path}`);
      local.set(id, { label, href: `#${id}` });
      // the guide's numbers come from a quick scan of each file, so make sure it agrees with the page
      const scanned = guide?.targets.get(id);
      if (guide && scanned?.label !== label)
        throw new Error(
          `Statement "${id}" is ${label} on the page but ${scanned?.label ?? "missing"} in the guide scan, in ${file.path}`,
        );
    });

    // a statement on this page links by its anchor alone; one on another page by its full path
    const find = (id: string) =>
      id.includes("/")
        ? file.path && findInOtherGuide(id, file.path)
        : (local.get(id) ?? guide?.targets.get(id));

    // second pass, so a Ref can point forwards as well as backwards
    walk(tree, (node) => {
      // a quiz's text links to statements too, so look up their labels for it
      if (isJsx(node) && node.name === "Quiz") {
        const ids = (getAttribute(node, "refs") ?? "")
          .split(",")
          .filter(Boolean);
        const targets = Object.fromEntries(
          ids.map((id) => {
            const target = find(id);
            if (!target)
              throw new Error(
                `Quiz ${getAttribute(node, "src")} links to :ref{#${id}}, which has no matching statement for ${file.path}`,
              );
            return [id, target];
          }),
        );
        node.attributes = node.attributes?.filter((a) => a.name !== "refs");
        setAttribute(node, "targets", JSON.stringify(targets));
        return;
      }
      if (!isJsx(node) || node.name !== "Ref") return;
      const id = getAttribute(node, "id");
      const target = id ? find(id) : undefined;
      if (!target)
        throw new Error(
          `:ref{#${id}} has no matching statement for ${file.path}`,
        );
      setAttribute(node, "label", target.label);
      setAttribute(node, "href", target.href);
    });
  };
}
