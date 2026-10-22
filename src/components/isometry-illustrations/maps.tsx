import type { ReactNode } from "react";
import { Figure } from "../figure";
import { PAPER, PAPER_EDGE, PENCIL, Svg, Words } from "../illustrations";

/**
 * Tracing paper over a page, the picture the whole chapter leans on. A letter F is drawn on the
 * page and traced onto the sheet; then the sheet is slid, turned about a pin, or flipped over, and
 * the traced F shows where every point of the page has been sent.
 */

const SHEET = "#dbeafe";
const SHEET_EDGE = "#60a5fa";
const TRACED = "#2563eb";
const PIN = "#dc2626";

// the letter F in pixels, with its bottom-left corner at (x, y), 36 wide and 48 tall
const letter = (x: number, y: number) =>
  [
    [0, 0],
    [12, 0],
    [12, -18],
    [28, -18],
    [28, -28],
    [12, -28],
    [12, -36],
    [36, -36],
    [36, -48],
    [0, -48],
  ]
    .map(([dx, dy]) => `${x + dx!},${y + dy!}`)
    .join(" ");

// the page and the F drawn on it, the same in every panel
const PAGE = { x: 24, y: 22, width: 172, height: 132 };
const F_AT = { x: 70, y: 112 };

function Page() {
  return (
    <>
      <rect
        x={PAGE.x + 3}
        y={PAGE.y + 4}
        width={PAGE.width}
        height={PAGE.height}
        fill="#000"
        fillOpacity={0.12}
      />
      <rect {...PAGE} fill={PAPER} stroke={PAPER_EDGE} strokeWidth={1.5} />
      <polygon
        points={letter(F_AT.x, F_AT.y)}
        fill="none"
        stroke={PENCIL}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </>
  );
}

/** the tracing sheet with the traced F, moved by an svg transform */
function Sheet({
  transform,
  back = false,
}: {
  transform: string;
  back?: boolean;
}) {
  return (
    <g transform={transform}>
      <rect
        {...PAGE}
        fill={back ? "#bfdbfe" : SHEET}
        fillOpacity={0.6}
        stroke={SHEET_EDGE}
        strokeWidth={1.5}
      />
      <polygon
        points={letter(F_AT.x, F_AT.y)}
        fill={TRACED}
        fillOpacity={0.25}
        stroke={TRACED}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
    </g>
  );
}

function Panel({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div style={{ flex: "1 1 170px", maxWidth: 240 }}>
      <Svg width={230} height={250} label={label}>
        {/* room above and around the page, so a turned sheet stays inside the panel */}
        <g transform="translate(0 22)">{children}</g>
        <Words x={115} y={240}>
          {title}
        </Words>
      </Svg>
    </div>
  );
}

export function TracingPaper({ caption }: { caption?: string }) {
  // the middle of the page, so the turned sheet reaches out about as far on every side
  const pin = { x: 110, y: 88 };
  const mirror = 110;
  return (
    <Figure caption={caption}>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-6">
        <Panel
          label="A letter F drawn on a page, with a sheet of tracing paper slid up and to the right. The traced F has moved the same way without turning."
          title="Slide it"
        >
          <Page />
          <Sheet transform="translate(26 -14)" />
        </Panel>
        <Panel
          label="The tracing sheet turned about a pin pushed through it. The pin stays put and the traced F has turned around it."
          title="Turn it about a pin"
        >
          <Page />
          <Sheet transform={`rotate(-28 ${pin.x} ${pin.y})`} />
          <circle
            cx={pin.x}
            cy={pin.y}
            r={6}
            fill={PIN}
            stroke={PENCIL}
            strokeWidth={1.5}
          />
          <circle
            cx={pin.x - 2}
            cy={pin.y - 2}
            r={2}
            fill="#fff"
            fillOpacity={0.8}
          />
        </Panel>
        <Panel
          label="The tracing sheet lifted and laid down the other way up. The traced F now faces the other way, like a mirror image."
          title="Flip it over"
        >
          <Page />
          <Sheet transform={`matrix(-1 0 0 1 ${2 * mirror} 0)`} back />
          <line
            x1={mirror}
            y1={12}
            x2={mirror}
            y2={166}
            stroke={PENCIL}
            strokeWidth={1.5}
            strokeDasharray="5 4"
          />
        </Panel>
      </div>
    </Figure>
  );
}
