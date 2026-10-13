import { Figure } from "./figure";

type AreaModelProps = {
  /** labels down the left side (the parts of one factor) */
  rows: string[];
  /** labels across the top (the parts of the other factor) */
  cols: string[];
  /** the area of each piece, cells[row][col] */
  cells: string[][];
  /** relative heights of the rows, defaults to equal */
  rowSizes?: number[];
  /** relative widths of the columns, defaults to equal */
  colSizes?: number[];
  /** optional caption shown under the diagram */
  caption?: string;
};

const UNIT = 44;

/**
 * A rectangle split into pieces, showing a product of sums as a sum of areas.
 * Labels are plain text, so use unicode for powers, e.g. "a²".
 */
export function AreaModel({
  rows,
  cols,
  cells,
  rowSizes = rows.map(() => 2),
  colSizes = cols.map(() => 2),
  caption,
}: AreaModelProps) {
  return (
    <Figure caption={caption} className="flex flex-col items-center">
      <div
        className="grid font-serif italic text-fd-foreground"
        style={{
          gridTemplateColumns: `2rem ${colSizes.map((s) => `${s * UNIT}px`).join(" ")}`,
          gridTemplateRows: `2rem ${rowSizes.map((s) => `${s * UNIT}px`).join(" ")}`,
        }}
      >
        <div />
        {cols.map((label, j) => (
          <div
            key={j}
            className="flex items-end justify-center pb-1 text-fd-muted-foreground"
          >
            {label}
          </div>
        ))}
        {rows.map((rowLabel, i) => (
          <div key={i} className="contents">
            <div className="flex items-center justify-end pr-2 text-fd-muted-foreground">
              {rowLabel}
            </div>
            {cols.map((_, j) => (
              <div
                key={j}
                className="flex items-center justify-center border border-fd-primary bg-fd-primary/10 text-lg"
                style={{
                  marginTop: i > 0 ? -1 : 0,
                  marginLeft: j > 0 ? -1 : 0,
                }}
              >
                {cells[i]?.[j]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Figure>
  );
}
