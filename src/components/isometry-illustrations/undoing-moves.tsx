import { Figure } from "../figure";
import { ORANGE, PENCIL, Svg, Words } from "../illustrations";

/**
 * Socks and shoes: putting them on is "first the sock, then the shoe", and taking them off undoes
 * the two steps in the reverse order, shoe first. Two rows of three feet, seen from the side.
 */

const SKIN = "#f2c9a0";
const SKIN_EDGE = "#b98a5e";
const SOCK = "#ef4444";
const SOCK_STRIPE = "#fca5a5";
const SHOE = "#5b3a29";
const SOLE = "#2b1a12";

// a foot seen from the side, toes to the right, inside a box about 100 wide and 75 high
const FOOT =
  "M 22 0 L 46 0 L 50 40 Q 70 45 90 52 Q 102 58 97 70 L 20 70 Q 8 67 11 52 Z";
const SOCK_SHAPE =
  "M 19 12 L 49 12 L 53 38 Q 72 43 92 50 Q 106 57 100 73 L 18 73 Q 5 69 8 51 Z";
const SHOE_SHAPE =
  "M 5 40 Q 30 30 54 34 Q 78 38 96 48 Q 110 56 104 74 L 6 74 Q 0 60 5 40 Z";

/** a foot at (x, y), bare, in a sock, or in a sock and a shoe */
function Foot({ x, y, wearing }: { x: number; y: number; wearing: 0 | 1 | 2 }) {
  return (
    <g transform={`translate(${x} ${y})`} strokeLinejoin="round">
      <path d={FOOT} fill={SKIN} stroke={SKIN_EDGE} strokeWidth={1.5} />
      {wearing >= 1 && (
        <g>
          <path d={SOCK_SHAPE} fill={SOCK} stroke="#991b1b" strokeWidth={1.5} />
          <line
            x1={19}
            y1={20}
            x2={50}
            y2={20}
            stroke={SOCK_STRIPE}
            strokeWidth={3}
          />
          <line
            x1={20}
            y1={27}
            x2={51}
            y2={27}
            stroke={SOCK_STRIPE}
            strokeWidth={3}
          />
        </g>
      )}
      {wearing === 2 && (
        <g>
          <path d={SHOE_SHAPE} fill={SHOE} stroke={SOLE} strokeWidth={1.5} />
          <rect x={4} y={70} width={102} height={7} rx={3} fill={SOLE} />
          <line
            x1={40}
            y1={36}
            x2={58}
            y2={42}
            stroke="#d6b48a"
            strokeWidth={2}
          />
        </g>
      )}
    </g>
  );
}

/** a short arrow from x1 to x2 at height y, with the step written above it */
function Step({
  x1,
  x2,
  y,
  text,
}: {
  x1: number;
  x2: number;
  y: number;
  text: string;
}) {
  return (
    <g>
      <line
        x1={x1}
        y1={y}
        x2={x2 - 10}
        y2={y}
        stroke={ORANGE}
        strokeWidth={3}
      />
      <polygon
        points={`${x2},${y} ${x2 - 12},${y - 7} ${x2 - 12},${y + 7}`}
        fill={ORANGE}
      />
      <Words x={(x1 + x2) / 2} y={y - 14}>
        {text}
      </Words>
    </g>
  );
}

export function SocksAndShoes({ caption }: { caption?: string }) {
  const columns = [20, 250, 480];
  const top = 46;
  const bottom = 206;
  return (
    <Figure caption={caption}>
      <Svg
        width={600}
        height={300}
        label="Top row: a bare foot, then the sock goes on, then the shoe goes on. Bottom row: the shoe comes off first, then the sock, back to a bare foot."
      >
        <Words x={8} y={22} anchor="start">
          Putting on
        </Words>
        <Foot x={columns[0]!} y={top} wearing={0} />
        <Step x1={135} x2={240} y={top + 40} text="first the sock" />
        <Foot x={columns[1]!} y={top} wearing={1} />
        <Step x1={365} x2={470} y={top + 40} text="then the shoe" />
        <Foot x={columns[2]!} y={top} wearing={2} />

        <Words x={8} y={182} anchor="start">
          Taking off
        </Words>
        <Foot x={columns[0]!} y={bottom} wearing={2} />
        <Step x1={135} x2={240} y={bottom + 40} text="first the shoe" />
        <Foot x={columns[1]!} y={bottom} wearing={1} />
        <Step x1={365} x2={470} y={bottom + 40} text="then the sock" />
        <Foot x={columns[2]!} y={bottom} wearing={0} />

        <line
          x1={0}
          y1={160}
          x2={600}
          y2={160}
          stroke={PENCIL}
          strokeOpacity={0.15}
        />
      </Svg>
    </Figure>
  );
}
