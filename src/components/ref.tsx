"use client";

import { useState, type ReactNode } from "react";
import { PreviewCard } from "@base-ui/react/preview-card";

type RefProps = {
  id: string;
  /** filled in at build time by remark-statements, e.g. "Definition 4.1" */
  label?: string;
  /**
   * filled in at build time: "#id" for a statement on this page, or "/maths/numbers/addition#id"
   * for one on another page of the guide
   */
  href?: string;
  children?: ReactNode;
};

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

// other pages are fetched once and kept, so hovering several links to one page costs one request
const pages = new Map<string, Promise<Document | null>>();

function fetchPage(path: string) {
  let page = pages.get(path);
  if (!page) {
    page = fetch(BASE + path)
      .then((response) => (response.ok ? response.text() : Promise.reject()))
      .then((html) => new DOMParser().parseFromString(html, "text/html"))
      .catch(() => null);
    pages.set(path, page);
  }
  return page;
}

// copy the statement's rendered content (KaTeX included), without its ids so anchors stay unique,
// and without solutions so an exercise preview doesn't give the answer away
function previewHtml(statement: Element | null) {
  if (!statement) return "";
  const clone = statement.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("[data-ref-skip]").forEach((el) => el.remove());
  clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  return clone.innerHTML;
}

/**
 * A link to a statement in the guide. Shows "Definition 4.1" unless children are given, and
 * previews the statement in a card on hover, fetching it from its page if it lives elsewhere.
 */
export function Ref({ id, label, href = `#${id}`, children }: RefProps) {
  const [html, setHtml] = useState("");
  const [path, hash] = href.split("#");
  const elsewhere = Boolean(path);

  return (
    <PreviewCard.Root
      onOpenChange={(open) => {
        if (!open) return;
        if (!elsewhere) {
          setHtml(previewHtml(document.getElementById(id)));
          return;
        }
        setHtml(`<p>${label ?? ""}…</p>`);
        void fetchPage(path!).then((page) =>
          setHtml(page ? previewHtml(page.getElementById(hash ?? id)) : ""),
        );
      }}
    >
      {/* a dotted underline sets these apart from ordinary links and hints at the preview; not-prose
          opts out of the typography link styles so these apply */}
      <PreviewCard.Trigger
        href={elsewhere ? BASE + href : href}
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
