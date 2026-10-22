"use client";

/**
 * Shared pieces for the interactive diagrams, so they all look and behave the same: a frame with
 * controls under the picture, sliders, a choice of buttons, a button, an animation hook, and
 * the parts of a number line.
 */

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/** colours that read on light and dark backgrounds, in the order diagrams should use them */
export const COLORS = {
  blue: "#3b82f6",
  orange: "#f97316",
  green: "#22c55e",
  purple: "#a855f7",
  red: "#ef4444",
};

/** a number as it should be shown: a proper minus sign, and at most two decimal places */
export function format(n: number, places = 2) {
  const rounded = Number(n.toFixed(places));
  const text = String(Math.abs(rounded));
  return rounded < 0 ? `−${text}` : text;
}

/**
 * A diagram scales down as a whole on a narrow screen, which would leave its labels too small to
 * read. So each label in an svg is enlarged about its own centre, by as much as the picture shrank
 * (up to 1.6 times), keeping text near the size it has on a wide screen.
 */
function useReadableText() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = ref.current;
    if (!box || typeof ResizeObserver === "undefined") return;
    const update = () => {
      for (const svg of box.querySelectorAll("svg")) {
        const drawn = svg.getBoundingClientRect().width;
        const width = svg.viewBox.baseVal?.width;
        if (!drawn || !width) continue;
        const scale = Math.min(1.6, Math.max(1, (0.8 * width) / drawn));
        svg.style.setProperty("--text-scale", String(scale));
      }
    };
    const observer = new ResizeObserver(update);
    observer.observe(box);
    update();
    return () => observer.disconnect();
  }, []);
  return ref;
}

/**
 * Keeps a readout from shrinking while somebody drags a control. A sentence that wraps onto one line
 * fewer would pull up everything below it, including the slider under the pointer. So the box keeps
 * the tallest height it has needed, and starts again only when its width changes.
 */
function useSteadyHeight() {
  const ref = useRef<HTMLDivElement>(null);
  const tallest = useRef({ width: 0, height: 0 });
  // after every render, before it is painted: measure the natural height and hold the largest
  useLayoutEffect(() => {
    const box = ref.current;
    if (!box) return;
    box.style.minHeight = "";
    const width = box.clientWidth;
    const height = box.offsetHeight;
    const seen = tallest.current;
    if (width !== seen.width) tallest.current = { width, height };
    else if (height > seen.height) seen.height = height;
    box.style.minHeight = `${tallest.current.height}px`;
  });
  return ref;
}

/**
 * A framed interactive figure: the picture, then an optional readout (the sentence saying what the picture currently shows, e.g. "2 < 5 becomes −4 > −10"), then a row of controls and an optional caption.
 */
export function Interactive({
  children,
  controls,
  readout,
  caption,
}: {
  children: ReactNode;
  controls?: ReactNode;
  readout?: ReactNode;
  caption?: string;
}) {
  const ref = useReadableText();
  const steady = useSteadyHeight();
  return (
    <figure className="not-prose my-8 rounded-xl border bg-fd-card px-2 py-6 sm:px-4">
      <div
        ref={ref}
        className="[&_svg_text]:origin-center [&_svg_text]:[transform-box:fill-box] [&_svg_text]:[scale:var(--text-scale,1)]"
      >
        {children}
      </div>
      {readout && (
        <div
          ref={steady}
          className="mt-3 text-center text-base font-medium tabular-nums"
          aria-live="polite"
        >
          {readout}
        </div>
      )}
      {controls && (
        <div className="mt-4 flex flex-wrap items-end justify-center gap-x-6 gap-y-3 px-2">
          {controls}
        </div>
      )}
      {caption && (
        <figcaption className="mt-4 text-center text-sm text-fd-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  show = format,
}: {
  label: ReactNode;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  /** how the current value is written next to the label */
  show?: (value: number) => string;
}) {
  return (
    <label className="flex min-w-40 flex-col gap-1 text-sm">
      <span className="flex justify-between gap-3 text-fd-muted-foreground">
        <span>{label}</span>
        {/* a minimum width, so the slider beside it does not shift as the value gets longer or shorter */}
        <span className="min-w-[5ch] text-end font-medium text-fd-foreground tabular-nums">
          {show(value)}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-fd-primary"
      />
    </label>
  );
}

/** a row of buttons where exactly one is chosen, e.g. add / subtract / multiply */
export function Choice<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label?: ReactNode;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: ReactNode }[];
}) {
  return (
    <div className="flex flex-col gap-1 text-sm">
      {label && <span className="text-fd-muted-foreground">{label}</span>}
      <div
        className="inline-flex overflow-hidden rounded-lg border"
        role="group"
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
            className={`px-3 py-1.5 font-medium transition-colors not-first:border-l ${
              option.value === value
                ? "bg-fd-primary text-fd-primary-foreground"
                : "hover:bg-fd-accent hover:text-fd-accent-foreground"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Button({
  children,
  onClick,
  primary = false,
  disabled = false,
}: {
  children: ReactNode;
  onClick: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        primary
          ? "inline-flex items-center rounded-lg bg-fd-primary px-4 py-1.5 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/85 disabled:pointer-events-none disabled:opacity-50"
          : "inline-flex items-center rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground disabled:pointer-events-none disabled:opacity-50"
      }
    >
      {children}
    </button>
  );
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/**
 * Animates from 0 to 1. `play()` runs it from the start, `reset()` returns to 0, and `progress`
 * is the eased position for drawing. With reduced motion it jumps straight to the end.
 */
export function useAnimation(duration = 1200) {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => () => cancelAnimationFrame(frame.current ?? 0), []);

  function play() {
    cancelAnimationFrame(frame.current ?? 0);
    if (prefersReducedMotion()) {
      setProgress(1);
      return;
    }
    const start = performance.now();
    setPlaying(true);
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(ease(t));
      if (t < 1) frame.current = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    frame.current = requestAnimationFrame(tick);
  }

  function reset() {
    cancelAnimationFrame(frame.current ?? 0);
    setPlaying(false);
    setProgress(0);
  }

  return { progress, playing, play, reset, done: progress === 1 };
}

/**
 * Follows `value` smoothly, so a picture glides to its new state when a slider moves instead of
 * jumping. With reduced motion it follows straight away.
 */
export function useSmooth(value: number, duration = 300) {
  const [shown, setShown] = useState(value);
  const current = useRef(value);
  useEffect(() => {
    if (prefersReducedMotion()) {
      current.current = value;
      setShown(value);
      return;
    }
    const from = current.current;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      current.current = mix(from, value, ease(t));
      setShown(current.current);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);
  return shown;
}

/** linear interpolation, for drawing a value part way through an animation */
export const mix = (from: number, to: number, t: number) =>
  from + (to - from) * t;

/** the horizontal layout of a number line from `from` to `to` drawn `width` pixels wide */
export function lineScale(from: number, to: number, width = 600, pad = 28) {
  const unit = (width - pad * 2) / (to - from);
  return { x: (n: number) => pad + (n - from) * unit, unit, width };
}

/**
 * A number line axis: the line with arrowheads, a tick and number at each integer (every `every`
 * integers), 0 in bold. Draw it inside an <svg> and put points and arrows on top.
 */
export function Axis({
  from,
  to,
  y,
  width = 600,
  every = 1,
}: {
  from: number;
  to: number;
  y: number;
  width?: number;
  every?: number;
}) {
  const { x } = lineScale(from, to, width);
  const ticks: number[] = [];
  for (let n = Math.ceil(from / every) * every; n <= to; n += every)
    ticks.push(n);
  return (
    <g className="text-fd-foreground">
      <line
        x1={6}
        x2={width - 6}
        y1={y}
        y2={y}
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <polygon points={`2,${y} 12,${y - 5} 12,${y + 5}`} fill="currentColor" />
      <polygon
        points={`${width - 2},${y} ${width - 12},${y - 5} ${width - 12},${y + 5}`}
        fill="currentColor"
      />
      {ticks.map((n) => (
        <g key={n}>
          <line
            x1={x(n)}
            x2={x(n)}
            y1={y - (n === 0 ? 9 : 6)}
            y2={y + (n === 0 ? 9 : 6)}
            stroke="currentColor"
            strokeWidth={n === 0 ? 2 : 1.5}
          />
          <text
            x={x(n)}
            y={y + 26}
            textAnchor="middle"
            fontSize={14}
            fontWeight={n === 0 ? 700 : 400}
            fill="currentColor"
            className={n === 0 ? undefined : "fill-fd-muted-foreground"}
          >
            {format(n)}
          </text>
        </g>
      ))}
    </g>
  );
}

/** an arrow along a horizontal line at height y, from x1 to x2, in the given colour */
export function HArrow({
  x1,
  x2,
  y,
  color,
  label,
}: {
  x1: number;
  x2: number;
  y: number;
  color: string;
  label?: string;
}) {
  const dir = x2 >= x1 ? 1 : -1;
  const long = Math.abs(x2 - x1) > 10;
  return (
    <g>
      {long && (
        <>
          <line
            x1={x1}
            x2={x2 - dir * 8}
            y1={y}
            y2={y}
            stroke={color}
            strokeWidth={2.5}
          />
          <polygon
            points={`${x2},${y} ${x2 - dir * 10},${y - 5} ${x2 - dir * 10},${y + 5}`}
            fill={color}
          />
        </>
      )}
      {label && (
        <text
          x={(x1 + x2) / 2}
          y={y - 8}
          textAnchor="middle"
          fontSize={13}
          fontWeight={600}
          fill={color}
        >
          {label}
        </text>
      )}
    </g>
  );
}

/** a labelled dot on a number line */
export function Dot({
  cx,
  cy,
  color,
  label,
  below = false,
  hollow = false,
}: {
  cx: number;
  cy: number;
  color: string;
  label?: string;
  below?: boolean;
  hollow?: boolean;
}) {
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={hollow ? "var(--color-fd-card)" : color}
        stroke={color}
        strokeWidth={2.5}
      />
      {label && (
        <text
          x={cx}
          y={below ? cy + 44 : cy - 14}
          textAnchor="middle"
          fontSize={14}
          fontWeight={600}
          fill={color}
        >
          {label}
        </text>
      )}
    </g>
  );
}
