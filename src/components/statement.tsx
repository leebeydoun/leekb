import type { CSSProperties, ReactNode } from "react";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";

type StatementProps = {
  /** anchor for linking and for :ref{#...} */
  id?: string;
  /** optional name shown after the number, e.g. "Even and odd" */
  title?: string;
  /** filled in at build time by remark-statements */
  number?: string;
  children: ReactNode;
};

// the accent colour down the left edge, by kind
const colors = {
  Definition: "var(--color-fd-info)",
  Theorem: "var(--color-fd-primary)",
  Lemma: "var(--color-fd-primary)",
  Proposition: "var(--color-fd-primary)",
  Corollary: "var(--color-fd-primary)",
  Conjecture: "var(--color-fd-warning)",
  Example: "var(--color-fd-success)",
  Remark: "var(--color-fd-muted-foreground)",
  Exercise: "var(--color-fd-foreground)",
};

function createStatement(kind: keyof typeof colors) {
  function Statement({ id, title, number, children }: StatementProps) {
    // number is missing if the remark plugin didn't run, e.g. a dev server started before it was added
    const label = number ? `${kind} ${number}` : kind;
    return (
      <div
        id={id}
        className="my-6 scroll-mt-24 rounded-lg border border-s-4 border-s-(--statement-color) bg-fd-card px-4 py-3 *:first:mt-0 *:last:mb-0"
        style={{ "--statement-color": colors[kind] } as CSSProperties}
      >
        <p className="font-semibold">
          {id ? (
            <a href={`#${id}`} className="no-underline! font-semibold!">
              {label}
            </a>
          ) : (
            label
          )}
          {title && <span className="font-normal"> ({title})</span>}.
        </p>
        {children}
      </div>
    );
  }
  Statement.displayName = kind;
  return Statement;
}

export const Definition = createStatement("Definition");
export const Theorem = createStatement("Theorem");
export const Lemma = createStatement("Lemma");
export const Proposition = createStatement("Proposition");
export const Corollary = createStatement("Corollary");
export const Conjecture = createStatement("Conjecture");
export const Example = createStatement("Example");
export const Remark = createStatement("Remark");
export const Exercise = createStatement("Exercise");

/** An unnumbered proof, ending with a ∎ and a link to an outside source for it. */
export function Proof({
  source,
  sourceTitle,
  children,
}: {
  source?: string;
  /** filled in at build time from the source URL, e.g. "Wikipedia: Euclidean division" */
  sourceTitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative my-4 border-s-2 ps-4 pe-6 *:last:mb-0">
      <p className="italic">Proof.</p>
      {children}
      {source && (
        <p className="text-sm text-fd-muted-foreground">
          See also:{" "}
          <a href={source} target="_blank" rel="noreferrer">
            {sourceTitle ?? source}
          </a>
        </p>
      )}
      <span className="absolute inset-e-0 bottom-0" aria-label="end of proof">
        ∎
      </span>
    </div>
  );
}

export { Ref } from "./ref";

/** A worked solution, collapsed until the reader opens it. Put it inside an ::::exercise. */
export function Solution({ children }: { children: ReactNode }) {
  return (
    // data-ref-skip keeps the solution out of hover previews of the exercise
    <div data-ref-skip>
      <Accordions className="my-4">
        <Accordion title="Solution">{children}</Accordion>
      </Accordions>
    </div>
  );
}
