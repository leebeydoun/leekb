import { Figure } from "../figure";
import { BLUE, ORANGE, PURPLE, Svg, Words } from "../illustrations";
import { Arrow, GREEN, MUTED } from "./plot";

/**
 * Pictures for the guide What a function is. A vending machine, where each button gives one snack
 * every time; arrow pictures of a rule that gives one output for each input beside one that gives
 * two; and the arrows of x ↦ 3x − 5 next to the same arrows turned round, its inverse.
 */

/** A vending machine with a window of snacks in rows A to C, and the snack from B4 in the tray. */
export function VendingMachine({ caption }: { caption?: string }) {
  const left = 150;
  const top = 38;
  const slotW = 52;
  const slotH = 46;
  const rows = ["A", "B", "C"];
  // a colour for each snack, so the window looks stocked
  const snacks = [
    ["#ef4444", "#f59e0b", GREEN, BLUE],
    ["#a855f7", "#14b8a6", "#ec4899", ORANGE],
    [BLUE, "#ef4444", "#f59e0b", GREEN],
  ];
  const slot = (r: number, c: number) => ({
    x: left + 22 + c * (slotW + 10),
    y: top + 22 + r * (slotH + 16),
  });
  const chosen = slot(1, 3);
  const tray = { x: left + 40, y: top + 222, w: 220, h: 34 };

  return (
    <Figure caption={caption}>
      <Svg
        width={560}
        height={310}
        label="A vending machine. Its window holds three rows of snacks, labelled A, B and C, with four snacks in each row, numbered 1 to 4. The snack in slot B4 is outlined, and a dashed arrow runs from it down to the tray, where the same orange bag lies. The keypad on the right shows B4 on its display. Beside the machine it says: B4 gives this bag, every time."
      >
        {/* the cabinet */}
        <rect
          x={left}
          y={top - 10}
          width={360}
          height={270}
          rx={14}
          fill="var(--color-fd-card)"
          stroke="currentColor"
          strokeWidth={2.5}
        />
        {/* the window */}
        <rect
          x={left + 12}
          y={top + 6}
          width={262}
          height={196}
          rx={6}
          fill={BLUE}
          fillOpacity={0.06}
          stroke="currentColor"
          strokeWidth={1.5}
        />
        {rows.map((row, r) => (
          <g key={row}>
            <Words x={left + 21} y={slot(r, 0).y + 28} size={14}>
              {row}
            </Words>
            {snacks[r]!.map((color, c) => {
              const { x, y } = slot(r, c);
              return (
                <g key={c}>
                  <rect
                    x={x + 6}
                    y={y}
                    width={slotW - 12}
                    height={slotH - 8}
                    rx={6}
                    fill={color}
                    fillOpacity={0.75}
                  />
                  {/* the shelf under the snack */}
                  <line
                    x1={x}
                    x2={x + slotW}
                    y1={y + slotH - 2}
                    y2={y + slotH - 2}
                    stroke="currentColor"
                    strokeOpacity={0.5}
                    strokeWidth={2}
                  />
                </g>
              );
            })}
          </g>
        ))}
        {[1, 2, 3, 4].map((n, c) => (
          <Words
            key={n}
            x={slot(0, c).x + slotW / 2}
            y={top - 18}
            size={14}
            color={MUTED}
          >
            {n}
          </Words>
        ))}
        {/* the chosen slot, outlined */}
        <rect
          x={chosen.x + 1}
          y={chosen.y - 5}
          width={slotW - 2}
          height={slotH + 4}
          rx={8}
          fill="none"
          stroke={PURPLE}
          strokeWidth={3}
        />
        {/* the keypad and its display */}
        <rect
          x={left + 288}
          y={top + 10}
          width={60}
          height={30}
          rx={4}
          fill="currentColor"
          fillOpacity={0.85}
        />
        <text
          x={left + 318}
          y={top + 31}
          textAnchor="middle"
          fontSize={16}
          fontWeight={700}
          fill={GREEN}
        >
          B4
        </text>
        {Array.from({ length: 9 }, (_, i) => (
          <rect
            key={i}
            x={left + 290 + (i % 3) * 20}
            y={top + 52 + Math.floor(i / 3) * 20}
            width={14}
            height={14}
            rx={3}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          />
        ))}
        {/* the tray, with the bag that dropped */}
        <rect
          x={tray.x}
          y={tray.y}
          width={tray.w}
          height={tray.h}
          rx={6}
          fill="currentColor"
          fillOpacity={0.08}
          stroke="currentColor"
          strokeWidth={2}
        />
        <rect
          x={tray.x + 120}
          y={tray.y + 6}
          width={slotW - 12}
          height={tray.h - 12}
          rx={6}
          fill={ORANGE}
          fillOpacity={0.75}
        />
        <Arrow
          x1={chosen.x + slotW / 2}
          y1={chosen.y + slotH + 4}
          x2={tray.x + 140}
          y2={tray.y + 4}
          color={PURPLE}
          dashed
        />
        <Words x={left - 26} y={top + 150} anchor="end" color={PURPLE}>
          B4 gives
        </Words>
        <Words x={left - 26} y={top + 172} anchor="end" color={PURPLE}>
          this bag,
        </Words>
        <Words x={left - 26} y={top + 194} anchor="end" color={PURPLE}>
          every time
        </Words>
      </Svg>
    </Figure>
  );
}

type Link = readonly [number, number];

/**
 * One arrow picture: the inputs in a column on the left, the outputs on the right, and an arrow
 * from each input to each output the rule gives it. Arrows listed in `marked` are drawn in orange.
 */
function ArrowPicture({
  title,
  inputs,
  outputs,
  links,
  marked = [],
  note,
  color = BLUE,
  label,
}: {
  title: string;
  inputs: string[];
  outputs: string[];
  links: Link[];
  marked?: number[];
  note?: string;
  color?: string;
  label: string;
}) {
  const width = 270;
  const gap = 34;
  const top = 64;
  const rows = Math.max(inputs.length, outputs.length);
  const height = top + rows * gap + (note ? 34 : 6);
  const inX = 62;
  const outX = 208;
  // centre the shorter column against the longer one
  const yIn = (i: number) =>
    top + (i + (rows - inputs.length) / 2) * gap + gap / 2;
  const yOut = (j: number) =>
    top + (j + (rows - outputs.length) / 2) * gap + gap / 2;

  return (
    <Svg width={width} height={height} label={label}>
      <Words x={width / 2} y={24} size={15}>
        {title}
      </Words>
      <Words x={inX} y={50} size={13} color={MUTED}>
        inputs
      </Words>
      <Words x={outX} y={50} size={13} color={MUTED}>
        outputs
      </Words>
      {[
        [inX, inputs.length],
        [outX, outputs.length],
      ].map(([x, n]) => (
        <rect
          key={x}
          x={x! - 30}
          y={top + ((rows - n!) / 2) * gap}
          width={60}
          height={n! * gap}
          rx={26}
          fill="currentColor"
          fillOpacity={0.05}
          stroke="currentColor"
          strokeOpacity={0.4}
        />
      ))}
      {links.map(([i, j], k) => (
        <Arrow
          key={k}
          x1={inX + 18}
          y1={yIn(i)}
          x2={outX - 20}
          y2={yOut(j)}
          color={marked.includes(k) ? ORANGE : color}
        />
      ))}
      {inputs.map((t, i) => (
        <Words key={`i${i}`} x={inX} y={yIn(i) + 5} size={15}>
          {t}
        </Words>
      ))}
      {outputs.map((t, j) => (
        <Words key={`o${j}`} x={outX} y={yOut(j) + 5} size={15}>
          {t}
        </Words>
      ))}
      {note && (
        <Words x={width / 2} y={height - 12} size={13} color={ORANGE}>
          {note}
        </Words>
      )}
    </Svg>
  );
}

/**
 * Two arrow pictures. Squaring sends −3, −1, 0, 1 and 3 to 9, 1, 0, 1 and 9: one arrow from each
 * input. "The square roots of x" sends 9 to both 3 and −3, so 9 has two arrows (in orange).
 */
export function ArrowDiagrams({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption} className="flex flex-wrap justify-center gap-6">
      <div className="w-full max-w-[270px]">
        <ArrowPicture
          title="x ↦ x²"
          inputs={["−3", "−1", "0", "1", "3"]}
          outputs={["0", "1", "9"]}
          links={[
            [0, 2],
            [1, 1],
            [2, 0],
            [3, 1],
            [4, 2],
          ]}
          label="Arrows from the inputs −3, −1, 0, 1 and 3 to the outputs 0, 1 and 9: −3 and 3 go to 9, −1 and 1 go to 1, and 0 goes to 0. Each input has exactly one arrow leaving it."
        />
      </div>
      <div className="w-full max-w-[270px]">
        <ArrowPicture
          title="the square roots of x"
          inputs={["0", "1", "9"]}
          outputs={["−3", "−1", "0", "1", "3"]}
          links={[
            [0, 2],
            [1, 3],
            [1, 1],
            [2, 4],
            [2, 0],
          ]}
          marked={[1, 2, 3, 4]}
          note="1 and 9 have two outputs each"
          label="Arrows from the inputs 0, 1 and 9 to their square roots: 0 goes to 0, 1 goes to both 1 and −1, and 9 goes to both 3 and −3. The inputs 1 and 9 each have two arrows leaving them, drawn in orange."
        />
      </div>
    </Figure>
  );
}

/**
 * The arrows of f(x) = 3x − 5 from 0, 1, 2, 3, 4 to −5, −2, 1, 4, 7, and beside them the same
 * arrows turned round, which are the arrows of the inverse y ↦ (y + 5)/3.
 */
export function InverseArrows({ caption }: { caption?: string }) {
  const ins = ["0", "1", "2", "3", "4"];
  const outs = ["−5", "−2", "1", "4", "7"];
  const straight: Link[] = [
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
  ];
  return (
    <Figure caption={caption} className="flex flex-wrap justify-center gap-6">
      <div className="w-full max-w-[270px]">
        <ArrowPicture
          title="f(x) = 3x − 5"
          inputs={ins}
          outputs={outs}
          links={straight}
          label="Arrows for f(x) = 3x − 5: 0 goes to −5, 1 to −2, 2 to 1, 3 to 4 and 4 to 7. No two arrows land on the same output."
        />
      </div>
      <div className="w-full max-w-[270px]">
        <ArrowPicture
          title="f⁻¹(y) = (y + 5)/3"
          inputs={outs}
          outputs={ins}
          links={straight}
          color={GREEN}
          label="The same arrows turned round, for the inverse f⁻¹(y) = (y + 5)/3: −5 goes to 0, −2 to 1, 1 to 2, 4 to 3 and 7 to 4."
        />
      </div>
    </Figure>
  );
}
