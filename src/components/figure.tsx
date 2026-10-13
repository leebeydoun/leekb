import type { ReactNode } from "react";

/** A framed figure with an optional caption, so diagrams stand apart from the text around them. */
export function Figure({
  caption,
  className,
  children,
}: {
  caption?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <figure className="not-prose my-8 rounded-xl border bg-fd-card px-4 py-8">
      <div className={className}>{children}</div>
      {caption && (
        <figcaption className="mt-4 text-center text-sm text-fd-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
