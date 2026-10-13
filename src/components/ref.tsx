"use client";

import { useState, type ReactNode } from "react";
import { PreviewCard } from "@base-ui/react/preview-card";

type RefProps = {
  id: string;
  /** filled in at build time by remark-statements, e.g. "Definition 4.1" */
  label?: string;
  children?: ReactNode;
};

// copy the statement's rendered content (KaTeX included) from the page, without its ids so anchors
// stay unique, and without solutions so an exercise preview doesn't give the answer away
function previewHtml(id: string) {
  const statement = document.getElementById(id);
  if (!statement) return "";
  const clone = statement.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("[data-ref-skip]").forEach((el) => el.remove());
  clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  return clone.innerHTML;
}

/**
 * A link to a statement on the same page. Shows "Definition 4.1" unless children are given, and
 * previews the statement in a card on hover.
 */
export function Ref({ id, label, children }: RefProps) {
  const [html, setHtml] = useState("");

  return (
    <PreviewCard.Root
      onOpenChange={(open) => {
        if (open) setHtml(previewHtml(id));
      }}
    >
      {/* a dotted underline sets these apart from ordinary links and hints at the preview; not-prose
          opts out of the typography link styles so these apply */}
      <PreviewCard.Trigger
        href={`#${id}`}
        delay={300}
        className="not-prose font-medium text-fd-foreground underline decoration-fd-muted-foreground decoration-dotted decoration-[1.5px] underline-offset-[3.5px] transition-colors hover:decoration-fd-primary data-popup-open:decoration-fd-primary"
      >
        {children ?? label}
      </PreviewCard.Trigger>
      <PreviewCard.Portal>
        <PreviewCard.Positioner
          side="top"
          sideOffset={8}
          collisionPadding={16}
          className="z-50"
        >
          <PreviewCard.Popup className="max-h-[min(24rem,var(--available-height))] w-[min(36rem,92vw)] origin-(--transform-origin) overflow-y-auto rounded-xl border bg-fd-popover px-4 py-3 text-sm text-fd-popover-foreground shadow-lg data-closed:animate-fd-popover-out data-open:animate-fd-popover-in">
            <div
              className="prose prose-sm *:first:mt-0 *:last:mb-0"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  );
}
