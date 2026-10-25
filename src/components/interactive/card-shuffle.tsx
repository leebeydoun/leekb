"use client";

/**
 * CardShuffle: a row of five cards (A, 2, 3, 4, 5) and two fixed shuffles σ and τ, each shown in
 * two rows. Pressing "apply σ" or "apply τ" moves every card to its new place, and the readout
 * writes the shuffle done so far, from the starting row, as one permutation in two rows, with the
 * presses written as a product (the last press on the left). A second view lays out στ and τσ
 * from the starting row side by side, to show that the order of two shuffles matters.
 */

import { useState } from "react";
import { Button, COLORS, Choice, Interactive } from "./kit";

type Perm = number[];

/** the card in place i goes to place SIGMA[i − 1] */
const SIGMA: Perm = [2, 4, 1, 5, 3];
const TAU: Perm = [5, 2, 3, 4, 1];
const IDENTITY: Perm = [1, 2, 3, 4, 5];
const CARDS = [
  { rank: "A", suit: "♥", red: true },
  { rank: "2", suit: "♠", red: false },
  { rank: "3", suit: "♥", red: true },
  { rank: "4", suit: "♠", red: false },
  { rank: "5", suit: "♥", red: true },
];

/** p after q: first q, then p */
const after = (p: Perm, q: Perm) => q.map((v) => p[v - 1]!);

const CARD_W = 76;
const CARD_H = 106;
const GAP = 18;
const LEFT = 20;
const placeX = (place: number) => LEFT + (place - 1) * (CARD_W + GAP);

/** A permutation in two rows, top row 1 to 5 and bottom row where each goes. */
function TwoRows({ perm, name }: { perm: Perm; name?: string }) {
  return (
    <span className="inline-flex items-center gap-2 align-middle">
      {name && <span className="font-semibold">{name} =</span>}
      <span className="inline-flex items-stretch">
        <span className="w-1.5 rounded-l border-y border-l border-current" />
        <span className="inline-grid grid-cols-5 gap-x-2 px-1 text-center leading-tight tabular-nums">
          {IDENTITY.map((i) => (
            <span key={`t${i}`}>{i}</span>
          ))}
          {perm.map((v, i) => (
            <span key={`b${i}`} className="font-semibold">
              {v}
            </span>
          ))}
        </span>
        <span className="w-1.5 rounded-r border-y border-r border-current" />
      </span>
    </span>
  );
}

/** a row of the five cards, the card that started in place i drawn in place perm[i − 1] */
function CardRow({
  perm,
  y,
  label,
}: {
  perm: Perm;
  y: number;
  label?: string;
}) {
  return (
    <g>
      {label && (
        <text
          x={LEFT}
          y={y - 10}
          fontSize={14}
          fontWeight={600}
          fill="currentColor"
        >
          {label}
        </text>
      )}
      {IDENTITY.map((place) => (
        <g key={`slot${place}`}>
          <rect
            x={placeX(place)}
            y={y}
            width={CARD_W}
            height={CARD_H}
            rx={9}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.25}
            strokeDasharray="4 4"
          />
          <text
            x={placeX(place) + CARD_W / 2}
            y={y + CARD_H + 20}
            textAnchor="middle"
            fontSize={12}
            className="fill-fd-muted-foreground"
          >
            place {place}
          </text>
        </g>
      ))}
      {CARDS.map((card, i) => {
        const color = card.red ? COLORS.red : "currentColor";
        return (
          <g
            key={card.rank}
            style={{
              transform: `translate(${placeX(perm[i]!)}px, ${y}px)`,
              transition: "transform 450ms ease-in-out",
            }}
          >
            <rect
              width={CARD_W}
              height={CARD_H}
              rx={9}
              fill="var(--color-fd-card)"
              stroke="currentColor"
              strokeWidth={1.5}
            />
            <text x={9} y={22} fontSize={16} fontWeight={700} fill={color}>
              {card.rank}
            </text>
            <text x={9} y={40} fontSize={14} fill={color}>
              {card.suit}
            </text>
            <text
              x={CARD_W / 2}
              y={CARD_H / 2 + 14}
              textAnchor="middle"
              fontSize={36}
              fill={color}
            >
              {card.suit}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export function CardShuffle({
  caption = "Apply σ and τ in any order. The two rows under the cards give the shuffle done so far: the card that started in each place on the top row has gone to the place under it.",
}: {
  caption?: string;
}) {
  const [view, setView] = useState<"play" | "compare">("play");
  // the shuffle done so far, and the presses that made it, first press first
  const [perm, setPerm] = useState<Perm>(IDENTITY);
  const [presses, setPresses] = useState<("σ" | "τ")[]>([]);

  const press = (name: "σ" | "τ") => {
    setPerm((p) => after(name === "σ" ? SIGMA : TAU, p));
    setPresses((list) => [...list, name]);
  };
  const reset = () => {
    setPerm(IDENTITY);
    setPresses([]);
  };

  // the product, last press on the left; a long product shows only its last ten presses, which
  // are its first ten letters
  const product = [...presses].reverse().join("");
  const shownProduct =
    product.length > 10 ? `${product.slice(0, 10)}…` : product;
  const shownList =
    presses.length > 10
      ? `…, ${presses.slice(-10).join(", ")}`
      : presses.join(", ");
  const home = presses.length > 0 && perm.every((v, i) => v === i + 1);

  const st = after(SIGMA, TAU);
  const ts = after(TAU, SIGMA);
  const width = LEFT * 2 + 5 * CARD_W + 4 * GAP;

  const playReadout = (
    <>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {presses.length === 0 ? (
          <span>No shuffles yet: the identity</span>
        ) : (
          <span>
            Shuffles so far: {shownList}, so in all {shownProduct}
          </span>
        )}
        <TwoRows perm={perm} />
      </div>
      <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
        {home
          ? "Every card is back in its starting place: the shuffles so far make the identity."
          : `The card that started in place 1 is now in place ${perm[0]}. In a product the right-hand shuffle is the one done first.`}
      </div>
    </>
  );

  const compareReadout = (
    <>
      <div className="flex flex-wrap items-center justify-center gap-6">
        <TwoRows perm={st} name="στ" />
        <TwoRows perm={ts} name="τσ" />
      </div>
      <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
        στ (τ first) sends the card in place 1 to place {st[0]}, while τσ (σ
        first) sends it to place {ts[0]}. Different rows, so στ ≠ τσ.
      </div>
    </>
  );

  return (
    <Interactive
      caption={caption}
      readout={view === "play" ? playReadout : compareReadout}
      controls={
        <>
          <Choice
            label="view"
            value={view}
            onChange={setView}
            options={[
              { value: "play", label: "shuffle" },
              { value: "compare", label: "στ and τσ" },
            ]}
          />
          {view === "play" && (
            <>
              <Button primary onClick={() => press("σ")}>
                apply σ
              </Button>
              <Button primary onClick={() => press("τ")}>
                apply τ
              </Button>
              <Button onClick={reset} disabled={presses.length === 0}>
                reset
              </Button>
            </>
          )}
          <div className="flex w-full flex-wrap justify-center gap-6 text-sm">
            <TwoRows perm={SIGMA} name="σ" />
            <TwoRows perm={TAU} name="τ" />
          </div>
        </>
      }
    >
      <svg
        viewBox={`0 0 ${width} ${2 * CARD_H + 110}`}
        className="mx-auto block h-auto w-full max-w-lg text-fd-foreground"
        role="img"
        aria-label={
          view === "play"
            ? `Five cards, A, 2, 3, 4 and 5, in places 1 to 5. After the shuffles so far, the card from place 1 is in place ${perm[0]}, from place 2 in place ${perm[1]}, from place 3 in place ${perm[2]}, from place 4 in place ${perm[3]} and from place 5 in place ${perm[4]}.`
            : `Two rows of the five cards. The top row is the starting row after στ, with τ done first: the cards from places 1 to 5 are in places ${st.join(", ")}. The bottom row is after τσ, with σ done first: the cards are in places ${ts.join(", ")}.`
        }
      >
        {view === "play" ? (
          <CardRow perm={perm} y={95} />
        ) : (
          <>
            <CardRow perm={st} y={24} label="στ: τ first, then σ" />
            <CardRow perm={ts} y={CARD_H + 84} label="τσ: σ first, then τ" />
          </>
        )}
      </svg>
    </Interactive>
  );
}
