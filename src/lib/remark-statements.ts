/**
 * Numbers statement blocks (<Definition>, <Theorem>, ...) and resolves <Ref> elements to them.
 *
 * Statements are numbered "section.n", where section counts the `##` headings on the page and n
 * counts statements of every kind within that section, so a page reads Definition 4.1, Lemma 4.2,
 * Theorem 4.3. A statement with an `id` can be referenced from anywhere on the page with
 * `<Ref id="..." />`, which renders as a link labelled e.g. "Definition 4.1".
 */

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

const kinds = new Set<string>(STATEMENT_KINDS);

function isJsx(node: Node) {
  return node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement";
}

function getAttribute(node: Node, name: string) {
  const attribute = node.attributes?.find((a) => a.type === "mdxJsxAttribute" && a.name === name);
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

export function remarkStatements() {
  return (tree: Node, file: { path?: string }) => {
    const labels = new Map<string, string>();
    let section = 0;
    let count = 0;

    walk(tree, (node) => {
      if (node.type === "heading" && node.depth === 2) {
        section++;
        count = 0;
        return;
      }
      if (!isJsx(node) || !node.name || !kinds.has(node.name)) return;

      count++;
      const number = section > 0 ? `${section}.${count}` : String(count);
      setAttribute(node, "number", number);

      const id = getAttribute(node, "id");
      if (!id) return;
      if (labels.has(id)) throw new Error(`Duplicate statement id "${id}" in ${file.path}`);
      labels.set(id, `${node.name} ${number}`);
    });

    // second pass, so a Ref can point forwards as well as backwards
    walk(tree, (node) => {
      if (!isJsx(node) || node.name !== "Ref") return;
      const id = getAttribute(node, "id");
      const label = id && labels.get(id);
      if (!label) throw new Error(`<Ref id="${id}" /> has no matching statement in ${file.path}`);
      setAttribute(node, "label", label);
    });
  };
}
