"use client";

/**
 * FunctionMachine: a rule drawn as a machine. Pick the rule f, feed in a number x with the slider,
 * and the machine shows the output f(x), or says the number is not in the domain. A second machine
 * g can be switched on after the first, to show the composite g ∘ f: the output of f is fed
 * straight into g. A table under the picture keeps the last few inputs and what came out, so the
 * reader sees that the same input always gives the same output.
 */

import { useState } from "react";
import { COLORS, Choice, Interactive, Slider, format } from "./kit";

type Rule = {
  name: string;
  /** the value, or undefined outside the domain */
  at: (x: number) => number | undefined;
  /** the working, e.g. "2·3 + 1", for an input written as a string */
  work: (x: string) => string;
  /** why a number is not in the domain */
  why: string;
};

const neg = (x: string) => (x.startsWith("−") ? `(${x})` : x);

const RULES: Record<string, Rule> = {
  double: {
    name: "2x + 1",
    at: (x) => 2 * x + 1,
    work: (x) => `2·${neg(x)} + 1`,
    why: "",
  },
  square: {
    name: "x²",
    at: (x) => x * x,
    work: (x) => `${neg(x)}²`,
    why: "",
  },
  recip: {
    name: "1/x",
    at: (x) => (x === 0 ? undefined : 1 / x),
    work: (x) => `1/${neg(x)}`,
    why: "there is no dividing by 0",
  },
  root: {
    name: "√x",
    at: (x) => (x < 0 ? undefined : Math.sqrt(x)),
    work: (x) => `√${neg(x)}`,
    why: "a negative number has no square root",
  },
};

const SECOND: Record<string, Rule> = {
  minus: {
    name: "x − 3",
    at: (x) => x - 3,
    work: (x) => `${x} − 3`,
    why: "",
  },
  square: RULES.square!,
  root: RULES.root!,
};

type FirstName = "double" | "square" | "recip" | "root";
type SecondName = "none" | "minus" | "square" | "root";

/** a value as shown: whole numbers and short decimals as they are, others to 3 places */
const show = (n: number) => format(n, 3);
/** "=" when the value shown is exact, "≈" when it has been rounded */
const eq = (n: number) =>
  Math.abs(Number(n.toFixed(3)) - n) < 1e-12 ? "=" : "≈";

type Row = { x: number; out: string };

/** what comes out at the end for the input x, as written in the table */
function outcome(x: number, first: FirstName, second: SecondName) {
  const r1 = RULES[first]!;
  const r2 = second === "none" ? undefined : SECOND[second]!;
  const v1 = r1.at(x);
  const v2 = r2 && v1 !== undefined ? r2.at(v1) : undefined;
  return v1 === undefined || (r2 && v2 === undefined)
    ? "not in the domain"
    : show(r2 ? v2! : v1);
}

const WIDTH = 640;
const HEIGHT = 190;

/** one machine: a box with the rule on its front, in the given colour */
function Machine({
  x,
  label,
  rule,
  color,
  broken,
}: {
  x: number;
  label: string;
  rule: string;
  color: string;
  broken: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={52}
        width={150}
        height={86}
        rx={12}
        fill={color}
        fillOpacity={broken ? 0.06 : 0.14}
        stroke={broken ? COLORS.red : color}
        strokeWidth={2.5}
      />
      {/* the funnel on top */}
      <polygon
        points={`${x + 55},52 ${x + 95},52 ${x + 108},34 ${x + 42},34`}
        fill="var(--color-fd-card)"
        stroke={color}
        strokeWidth={2}
      />
      <text
        x={x + 75}
        y={84}
        textAnchor="middle"
        fontSize={15}
        fontWeight={600}
        fill={color}
      >
        {label}
      </text>
      <text
        x={x + 75}
        y={112}
        textAnchor="middle"
        fontSize={18}
        fill="currentColor"
      >
        {rule}
      </text>
    </g>
  );
}

/** a number on a conveyor between machines, with an arrow to where it goes */
function Carry({
  from,
  to,
  text,
  color,
}: {
  from: number;
  to: number;
  text: string;
  color: string;
}) {
  return (
    <g>
      <line
        x1={from}
        x2={to - 8}
        y1={95}
        y2={95}
        stroke="currentColor"
        strokeOpacity={0.5}
        strokeWidth={2}
      />
      <polygon
        points={`${to},95 ${to - 10},90 ${to - 10},100`}
        fill="currentColor"
        fillOpacity={0.5}
      />
      <text
        x={(from + to) / 2}
        y={84}
        textAnchor="middle"
        fontSize={16}
        fontWeight={700}
        fill={color}
        stroke="var(--color-fd-card)"
        strokeWidth={4}
        paintOrder="stroke"
      >
        {text}
      </text>
    </g>
  );
}

export function FunctionMachine({
  rule: initialRule = "double",
  then: initialThen = "none",
  x: initialX = 3,
}: {
  /** the first rule shown */
  rule?: FirstName;
  /** a second machine after the first, or "none" */
  then?: SecondName;
  /** the first input */
  x?: number;
}) {
  const [first, setFirst] = useState<FirstName>(initialRule);
  const [second, setSecond] = useState<SecondName>(initialThen);
  const [x, setX] = useState(initialX);
  const [rows, setRows] = useState<Row[]>(() => [
    { x: initialX, out: outcome(initialX, initialRule, initialThen) },
  ]);

  const f = RULES[first]!;
  const g = second === "none" ? undefined : SECOND[second]!;
  const fx = f.at(x);
  const gfx = g && fx !== undefined ? g.at(fx) : undefined;

  const xs = format(x);
  // what comes out at the end, as text for the picture and the table
  const result = outcome(x, first, second);

  function record(nx: number, nf: FirstName, ns: SecondName) {
    const out = outcome(nx, nf, ns);
    // the same input moves to the top, with the same output as before
    setRows((old) =>
      [{ x: nx, out }, ...old.filter((r) => r.x !== nx)].slice(0, 6),
    );
  }

  const changeX = (v: number) => {
    setX(v);
    record(v, first, second);
  };
  // a new rule is a new machine, so the table starts again
  const changeFirst = (v: FirstName) => {
    setFirst(v);
    setRows([{ x, out: outcome(x, v, second) }]);
  };
  const changeSecond = (v: SecondName) => {
    setSecond(v);
    setRows([{ x, out: outcome(x, first, v) }]);
  };

  const fName = `f(x) = ${f.name}`;
  const ruleName = g ? `g(f(x)), with g(x) = ${g.name}` : fName;

  let readout: string;
  if (fx === undefined)
    readout = `x = ${xs} is not in the domain of f(x) = ${f.name}: ${f.why}.`;
  else if (!g) readout = `f(${xs}) = ${f.work(xs)} ${eq(fx)} ${show(fx)}`;
  else if (gfx === undefined)
    readout = `f(${xs}) = ${show(fx)}, but ${show(fx)} is not in the domain of g(x) = ${g.name}: ${g.why}. So ${xs} is not in the domain of g ∘ f.`;
  else
    readout = `f(${xs}) = ${f.work(xs)} ${eq(fx)} ${show(fx)}, then g(${show(fx)}) ${eq(gfx)} ${show(gfx)}. So (g ∘ f)(${xs}) ${eq(gfx)} ${show(gfx)}.`;

  // where things sit across the picture
  const m1 = g ? 150 : 245;
  const m2 = 400;
  const outStart = g ? m2 + 150 : m1 + 150;
  const color2 = COLORS.purple;

  return (
    <Interactive
      readout={readout}
      controls={
        <>
          <Choice
            label="the rule f"
            value={first}
            onChange={changeFirst}
            options={(Object.keys(RULES) as FirstName[]).map((k) => ({
              value: k,
              label: RULES[k]!.name,
            }))}
          />
          <Choice
            label="then g"
            value={second}
            onChange={changeSecond}
            options={[
              { value: "none", label: "none" },
              ...(["minus", "square", "root"] as const).map((k) => ({
                value: k,
                label: SECOND[k]!.name,
              })),
            ]}
          />
          <Slider
            label={
              <>
                input <i>x</i>
              </>
            }
            value={x}
            onChange={changeX}
            min={-4}
            max={4}
            step={0.5}
          />
        </>
      }
      caption="Move the slider to feed a number into the machine. The table keeps the last few inputs and what came out: feed in the same number twice and the same output comes out."
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-2xl text-fd-foreground"
        role="img"
        aria-label={`A machine for ${ruleName}. The input ${xs} goes in and ${result} comes out.`}
      >
        <Carry from={20} to={m1} text={xs} color={COLORS.blue} />
        <Machine
          x={m1}
          label="f"
          rule={f.name}
          color={COLORS.blue}
          broken={fx === undefined}
        />
        {g && (
          <>
            <Carry
              from={m1 + 150}
              to={m2}
              text={fx === undefined ? "nothing" : show(fx)}
              color={fx === undefined ? COLORS.red : COLORS.blue}
            />
            <Machine
              x={m2}
              label="g"
              rule={g.name}
              color={color2}
              broken={fx === undefined || gfx === undefined}
            />
          </>
        )}
        {(() => {
          const ok = result !== "not in the domain";
          return (
            <>
              <line
                x1={outStart}
                x2={WIDTH - 20}
                y1={95}
                y2={95}
                stroke="currentColor"
                strokeOpacity={0.5}
                strokeWidth={2}
              />
              <polygon
                points={`${WIDTH - 12},95 ${WIDTH - 22},90 ${WIDTH - 22},100`}
                fill="currentColor"
                fillOpacity={0.5}
              />
              {ok ? (
                <text
                  x={(outStart + WIDTH - 12) / 2}
                  y={84}
                  textAnchor="middle"
                  fontSize={16}
                  fontWeight={700}
                  fill={g ? color2 : COLORS.blue}
                  stroke="var(--color-fd-card)"
                  strokeWidth={4}
                  paintOrder="stroke"
                >
                  {result}
                </text>
              ) : (
                <text
                  x={(outStart + WIDTH - 12) / 2}
                  y={130}
                  textAnchor="middle"
                  fontSize={13}
                  fontWeight={600}
                  fill={COLORS.red}
                >
                  <tspan x={(outStart + WIDTH - 12) / 2}>not in</tspan>
                  <tspan x={(outStart + WIDTH - 12) / 2} dy={16}>
                    the domain
                  </tspan>
                </text>
              )}
            </>
          );
        })()}
        <text x={20} y={114} fontSize={13} className="fill-fd-muted-foreground">
          in
        </text>
        <text
          x={WIDTH - 12}
          y={114}
          textAnchor="end"
          fontSize={13}
          className="fill-fd-muted-foreground"
        >
          out
        </text>
      </svg>
      <div className="mx-auto mt-3 max-w-md">
        <table className="w-full text-center text-sm tabular-nums">
          <thead>
            <tr className="text-fd-muted-foreground">
              <th className="px-2 py-1 font-medium">input x</th>
              <th className="px-2 py-1 font-medium">
                {g ? "(g ∘ f)(x)" : "f(x)"}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.x} className="border-t">
                <td className="px-2 py-1">{format(r.x)}</td>
                <td
                  className="px-2 py-1"
                  style={{
                    color:
                      r.out === "not in the domain" ? COLORS.red : undefined,
                  }}
                >
                  {r.out}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Interactive>
  );
}
