"use client";

/**
 * Multiplying counting numbers as counting dots. In the grid, a rows of b dots turn on their side
 * to become b rows of a, and the count stays the same, which is ab = ba. In the box, the dots are
 * pulled apart into layers in one of three directions, and each way of counting the layers gives
 * the same total, which is the grouping rule.
 */

import { useState } from "react";
import { Button, COLORS, Choice, Interactive, Slider, useSmooth } from "./kit";

const WIDTH = 440;
const HEIGHT = 280;

type Mode = "grid" | "box";
type Axis = "x" | "y" | "z";

export function DotGrid() {
  const [mode, setMode] = useState<Mode>("grid");
  return mode === "grid" ? (
    <FlatGrid mode={mode} setMode={setMode} />
  ) : (
    <DotBox mode={mode} setMode={setMode} />
  );
}

function ModeChoice({
  mode,
  setMode,
}: {
  mode: Mode;
  setMode: (mode: Mode) => void;
}) {
  return (
    <Choice
      label="Dots in"
      value={mode}
      onChange={setMode}
      options={[
        { value: "grid", label: "A grid" },
        { value: "box", label: "A box" },
      ]}
    />
  );
}

function FlatGrid({
  mode,
  setMode,
}: {
  mode: Mode;
  setMode: (mode: Mode) => void;
}) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(4);
  const [turned, setTurned] = useState(false);
  const angle = useSmooth(turned ? 90 : 0, 900);

  // one spacing that fits the grid either way round
  const longest = Math.max(rows, cols);
  const gap = Math.min(40, (HEIGHT - 40) / longest);
  const radius = Math.min(12, gap * 0.32);
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;

  const shownRows = turned ? cols : rows;
  const shownCols = turned ? rows : cols;
  const rowWord = (n: number) => (n === 1 ? "row" : "rows");
  const settled = angle === 0 || angle === 90;

  return (
    <Interactive
      readout={
        settled
          ? `${shownRows} ${rowWord(shownRows)} of ${shownCols} is ${rows * cols} dots, and ${rows} · ${cols} = ${cols} · ${rows} = ${rows * cols}`
          : "turning…"
      }
      controls={
        <>
          <ModeChoice mode={mode} setMode={setMode} />
          <Slider
            label="rows"
            value={rows}
            onChange={setRows}
            min={1}
            max={6}
          />
          <Slider
            label="in a row"
            value={cols}
            onChange={setCols}
            min={1}
            max={6}
          />
          <Button primary onClick={() => setTurned(!turned)}>
            Turn on its side
          </Button>
        </>
      }
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-lg text-fd-foreground"
        role="img"
        aria-label={`${shownRows} rows of ${shownCols} dots, ${rows * cols} in all`}
      >
        <g transform={`rotate(${angle} ${cx} ${cy})`}>
          {/* a faint band behind each row, which turns with the dots */}
          {Array.from({ length: rows }, (_, r) => (
            <rect
              key={`band-${r}`}
              x={cx - (cols * gap) / 2 + 2}
              y={cy + (r - rows / 2) * gap + 2}
              width={cols * gap - 4}
              height={gap - 4}
              rx={(gap - 4) / 2}
              fill={COLORS.blue}
              fillOpacity={0.1}
            />
          ))}
          {Array.from({ length: rows * cols }, (_, i) => {
            const r = Math.floor(i / cols);
            const c = i % cols;
            return (
              <circle
                key={i}
                cx={cx + (c - (cols - 1) / 2) * gap}
                cy={cy + (r - (rows - 1) / 2) * gap}
                r={radius}
                fill={COLORS.blue}
              />
            );
          })}
        </g>
      </svg>
    </Interactive>
  );
}

// the box drawn at a slant: across is right, up is up, and back goes up and to the right
const SLANT_X = 0.55;
const SLANT_Y = 0.4;
// how far apart the layers are pulled, as a share of the spacing between dots
const SPREAD = 0.9;

const LAYER_WORD: Record<Axis, string> = {
  x: "left to right",
  y: "top to bottom",
  z: "front to back",
};

function DotBox({
  mode,
  setMode,
}: {
  mode: Mode;
  setMode: (mode: Mode) => void;
}) {
  const [wide, setWide] = useState(4);
  const [tall, setTall] = useState(3);
  const [deep, setDeep] = useState(2);
  const [axis, setAxis] = useState<Axis>("z");
  const ex = useSmooth(axis === "x" ? SPREAD : 0, 600);
  const ey = useSmooth(axis === "y" ? SPREAD : 0, 600);
  const ez = useSmooth(axis === "z" ? SPREAD : 0, 600);

  // a spacing that fits the box with any one direction pulled apart
  const across =
    (wide - 1) * (1 + SPREAD) + (deep - 1) * SLANT_X * (1 + SPREAD);
  const upward =
    (tall - 1) * (1 + SPREAD) + (deep - 1) * SLANT_Y * (1 + SPREAD);
  const gap = Math.min(
    34,
    (WIDTH - 40) / Math.max(across, 1),
    (HEIGHT - 40) / Math.max(upward, 1),
  );
  const radius = Math.min(9, gap * 0.3);

  const place = (i: number, j: number, k: number) => {
    const x = i * (1 + ex) + k * (1 + ez) * SLANT_X;
    const y = j * (1 + ey) + k * (1 + ez) * SLANT_Y;
    return { x: x * gap, y: -y * gap };
  };

  type Spot = { key: string; x: number; y: number; k: number; layer: number };
  const spots: Spot[] = [];
  for (let k = 0; k < deep; k++)
    for (let j = 0; j < tall; j++)
      for (let i = 0; i < wide; i++) {
        const p = place(i, j, k);
        const layer = axis === "x" ? i : axis === "y" ? tall - 1 - j : k;
        spots.push({ key: `${i}-${j}-${k}`, ...p, k, layer });
      }
  // the back of the box first, so the front dots are drawn over it
  spots.sort((a, b) => b.k - a.k);

  const xs = spots.map((s) => s.x);
  const ys = spots.map((s) => s.y);
  const shiftX = WIDTH / 2 - (Math.min(...xs) + Math.max(...xs)) / 2;
  const shiftY = HEIGHT / 2 - (Math.min(...ys) + Math.max(...ys)) / 2;

  const total = wide * tall * deep;
  const [layers, a, b] =
    axis === "x"
      ? [wide, tall, deep]
      : axis === "y"
        ? [tall, wide, deep]
        : [deep, wide, tall];
  const layerWord = layers === 1 ? "layer" : "layers";

  return (
    <Interactive
      readout={
        <>
          <div>
            {layers} {layerWord} of {a} · {b} = {a * b}, so {layers} · {a * b} ={" "}
            {total} dots
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            A box {wide} wide, {tall} tall and {deep} deep, counted in layers
            from {LAYER_WORD[axis]}
          </div>
        </>
      }
      controls={
        <>
          <ModeChoice mode={mode} setMode={setMode} />
          <Slider
            label="wide"
            value={wide}
            onChange={setWide}
            min={1}
            max={5}
          />
          <Slider
            label="tall"
            value={tall}
            onChange={setTall}
            min={1}
            max={5}
          />
          <Slider
            label="deep"
            value={deep}
            onChange={setDeep}
            min={1}
            max={5}
          />
          <Choice
            label="Layers"
            value={axis}
            onChange={setAxis}
            options={[
              { value: "z", label: "Front to back" },
              { value: "y", label: "Top to bottom" },
              { value: "x", label: "Left to right" },
            ]}
          />
        </>
      }
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-lg text-fd-foreground"
        role="img"
        aria-label={`A box of dots ${wide} wide, ${tall} tall and ${deep} deep, pulled apart into ${layers} ${layerWord} of ${a * b}, ${total} dots in all`}
      >
        {spots.map((s) => (
          <circle
            key={s.key}
            cx={s.x + shiftX}
            cy={s.y + shiftY}
            r={radius}
            fill={s.layer % 2 === 0 ? COLORS.blue : COLORS.orange}
            fillOpacity={1 - (0.45 * s.k) / Math.max(deep, 2)}
            stroke="var(--color-fd-card)"
            strokeWidth={1.5}
          />
        ))}
      </svg>
    </Interactive>
  );
}
