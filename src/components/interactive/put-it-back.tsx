"use client";

/**
 * Putting a moved flag back where it started, one step at a time. A flag has been moved by some
 * isometry; the reader picks which kind (a slide, a turn, a flip or a glide), then presses the steps
 * in order: slide its foot home, turn its top home about the foot, and flip it over the pole if its
 * tip is still on the wrong side. Whatever the move was, at most these three steps undo it, and the
 * readout says what each step fixed or why it wasn't needed.
 */

import { useState } from "react";
import { Button, COLORS, Choice, Interactive, mix, useAnimation } from "./kit";

const UNIT = 40;
const X0 = -5.7;
const X1 = 5.6;
const Y0 = -3.7;
const Y1 = 2.8;
const PAD = 16;
const WIDTH = (X1 - X0) * UNIT + PAD * 2;
const HEIGHT = (Y1 - Y0) * UNIT + PAD * 2;

type Vec = { x: number; y: number };

const px = (p: Vec) => ({
  x: PAD + (p.x - X0) * UNIT,
  y: PAD + (Y1 - p.y) * UNIT,
});

// the flag at home: a pole from its foot A up to its top B, and a pennant whose tip is C
const HOME: Vec[] = [
  { x: -2.5, y: -0.5 }, // A, the foot
  { x: -2.5, y: 2.5 }, // B, the top
  { x: -0.8, y: 2 }, // C, the tip
  { x: -2.5, y: 1.4 }, // where the pennant meets the pole again
];

const add = (p: Vec, q: Vec) => ({ x: p.x + q.x, y: p.y + q.y });
const sub = (p: Vec, q: Vec) => ({ x: p.x - q.x, y: p.y - q.y });
const turn = (p: Vec, about: Vec, degrees: number) => {
  const a = (degrees * Math.PI) / 180;
  const v = sub(p, about);
  return {
    x: about.x + v.x * Math.cos(a) - v.y * Math.sin(a),
    y: about.y + v.x * Math.sin(a) + v.y * Math.cos(a),
  };
};
// the reflection of p in the line through a and b, part way: t = 1 is the full flip
const flip = (p: Vec, a: Vec, b: Vec, t = 1) => {
  const d = sub(b, a);
  const size = Math.hypot(d.x, d.y);
  const u = { x: d.x / size, y: d.y / size };
  const v = sub(p, a);
  const along = v.x * u.x + v.y * u.y;
  const foot = { x: a.x + u.x * along, y: a.y + u.y * along };
  const off = sub(p, foot);
  return add(foot, { x: off.x * (1 - 2 * t), y: off.y * (1 - 2 * t) });
};
const angleOf = (v: Vec) => (Math.atan2(v.y, v.x) * 180) / Math.PI;
// which side of the line ab the point p is on: positive on the left going from a to b
const side = (p: Vec, a: Vec, b: Vec) =>
  (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);

type Kind = "slide" | "turn" | "flip" | "glide";

// the mystery moves, each applied to the whole flag
const MOVES: Record<Kind, (p: Vec) => Vec> = {
  slide: (p) => add(p, { x: 5.5, y: -1.2 }),
  turn: (p) => turn(p, { x: 1, y: 0.5 }, 140),
  flip: (p) => flip(p, { x: 0.5, y: -3 }, { x: 1.3, y: 3 }),
  glide: (p) =>
    add(flip(p, { x: -5, y: 0.6 }, { x: 5, y: 0.6 }), { x: 5.2, y: 0 }),
};

type Step = "slide" | "turn" | "flip";
const STEPS: Step[] = ["slide", "turn", "flip"];

/** the flag after each step of putting it back: [moved, slid, turned, flipped] */
function stages(kind: Kind) {
  const [A, B, C] = HOME as [Vec, Vec, Vec];
  const moved = HOME.map(MOVES[kind]);
  // slide the foot home
  const shift = sub(A, moved[0]!);
  const slid = moved.map((p) => add(p, shift));
  // turn about the foot until the top is home
  let degrees = angleOf(sub(B, A)) - angleOf(sub(slid[1]!, A));
  degrees = ((((degrees + 180) % 360) + 360) % 360) - 180;
  if (Math.abs(degrees) < 1e-9) degrees = 0;
  const turned = slid.map((p) => turn(p, A, degrees));
  // flip over the pole if the tip is on the wrong side of it
  const wrong = Math.sign(side(turned[2]!, A, B)) !== Math.sign(side(C, A, B));
  const flipped = wrong ? turned.map((p) => flip(p, A, B)) : turned;
  return {
    shapes: [moved, slid, turned, flipped],
    shift,
    degrees,
    wrong,
  };
}

const KIND_LABELS: Record<Kind, string> = {
  slide: "A slide",
  turn: "A turn",
  flip: "A flip",
  glide: "A glide",
};

export function PutItBack() {
  const [kind, setKind] = useState<Kind>("glide");
  const [done, setDone] = useState(0);
  const animation = useAnimation(900);
  const { shapes, shift, degrees, wrong } = stages(kind);
  const [A, B] = HOME as [Vec, Vec];

  // what the step that was just pressed did, so the readout can say it
  const report = (step: Step) => {
    if (step === "slide")
      return Math.hypot(shift.x, shift.y) < 1e-9
        ? "The foot was already home, so no slide was needed."
        : "Slid back: the foot of the pole is home. Every point moved by the same arrow.";
    if (step === "turn")
      return degrees === 0
        ? "The top was already home, so no turn was needed."
        : `Turned back ${Math.round(Math.abs(degrees))}° about the foot: the whole pole is home now.`;
    return wrong
      ? "Flipped over the pole: the tip was on the wrong side, and now the flag is home."
      : "The tip was already on the right side, so no flip was needed. The flag is home.";
  };

  const press = () => {
    if (done >= 3) return;
    setDone(done + 1);
    animation.play();
  };
  const restart = (next: Kind = kind) => {
    setKind(next);
    setDone(0);
    animation.reset();
  };

  // the flag as drawn: between the last two stages while a step plays
  const t = done === 0 ? 1 : animation.progress;
  const from = shapes[Math.max(0, done - 1)]!;
  const to = shapes[done]!;
  const step = STEPS[done - 1];
  const shown = to.map((end, i) => {
    const start = from[i]!;
    if (!step || step === "slide")
      return { x: mix(start.x, end.x, t), y: mix(start.y, end.y, t) };
    if (step === "turn") return turn(start, A, degrees * t);
    return wrong ? flip(start, A, B, t) : end;
  });

  const draw = (shape: Vec[], color: string, faint = false) => {
    const [a, b, c, d] = shape.map(px) as [Vec, Vec, Vec, Vec];
    return (
      <g opacity={faint ? 0.35 : 1}>
        <polygon
          points={`${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y}`}
          fill={color}
          fillOpacity={faint ? 0.25 : 0.55}
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeDasharray={faint ? "5 4" : undefined}
        />
        <line
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={faint ? "5 4" : undefined}
        />
        <circle cx={a.x} cy={a.y} r={4} fill="currentColor" />
      </g>
    );
  };

  const readout =
    done === 0 ? (
      <>
        <div>The flag has been moved by {KIND_LABELS[kind].toLowerCase()}</div>
        <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
          Press the steps in order to bring it home: slide, then turn, then flip
          if needed.
        </div>
      </>
    ) : (
      <>
        <div>
          {done === 3
            ? "Home, in at most three steps"
            : `Step ${done} of 3: ${STEPS[done - 1]}`}
        </div>
        <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
          {report(STEPS[done - 1]!)}
        </div>
      </>
    );

  return (
    <Interactive
      readout={readout}
      controls={
        <>
          <Choice
            label="The flag was moved by"
            value={kind}
            onChange={(next) => restart(next)}
            options={(Object.keys(KIND_LABELS) as Kind[]).map((k) => ({
              value: k,
              label: KIND_LABELS[k],
            }))}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              primary
              onClick={press}
              disabled={done >= 3 || animation.playing}
            >
              {done < 3 ? `${["Slide", "Turn", "Flip"][done]} back` : "Done"}
            </Button>
            <Button onClick={() => restart()}>Start again</Button>
          </div>
        </>
      }
      caption="The dashed flag is home. Whatever rigid move was used, sliding the foot home, turning the top home and flipping if the tip is on the wrong side always puts the flag back."
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-lg text-fd-foreground"
        role="img"
        aria-label={`A flag moved away from its home position, after ${done} of the three steps that put it back`}
      >
        {draw(HOME, COLORS.blue, true)}
        {draw(shown, COLORS.orange)}
      </svg>
    </Interactive>
  );
}
