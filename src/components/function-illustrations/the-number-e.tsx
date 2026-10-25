import { Figure } from "../figure";
import { BLUE, ORANGE, Svg, Words } from "../illustrations";
import { GREEN, Plot, Spot, graph } from "./plot";

/**
 * Pictures for the guide The number e and using logarithms. A cup of tea cooling, as the graph of
 * how far it is above room temperature; and carbon-14 in an old bone, as the graph of the share
 * left, halving every 5730 years.
 */

const TEA_K = Math.log(5 / 7) / 10;
const TEA_T = Math.log(2 / 7) / TEA_K;

/**
 * How far a cup of tea is above room temperature, 70 degrees at the start, 50 after 10 minutes, as
 * the graph of 70·e^(Kt) with K = ln(5/7)/10. The two measurements are blue dots, and the moment it
 * is 20 degrees above room temperature, after about 37 minutes, is a green dot with dashed lines to
 * the axes. Each step up of 10 degrees is drawn half as long as each step across of 10 minutes.
 */
export function TeaCooling({ caption }: { caption?: string }) {
  return (
    <Figure caption={caption}>
      <Plot
        id="tea-cooling"
        x={[0, 60]}
        y={[0, 80]}
        unit={8}
        unitY={4}
        step={10}
        every={10}
        curves={[
          {
            points: graph((t) => 70 * Math.exp(TEA_K * t), 0, 60),
            color: BLUE,
          },
        ]}
        label="A graph with minutes from 0 to 60 across and degrees above room temperature from 0 to 80 up. A falling curve starts at 70 degrees at minute 0 and flattens as it goes. Blue dots mark the two measurements, 70 degrees at the start and 50 degrees after 10 minutes. A green dot on the curve at 20 degrees, about 37 minutes in, has dashed lines across to the vertical axis and down to the horizontal axis."
      >
        {({ px, py }) => (
          <>
            <line
              x1={px(0)}
              x2={px(TEA_T)}
              y1={py(20)}
              y2={py(20)}
              stroke={GREEN}
              strokeWidth={2}
              strokeDasharray="5 4"
            />
            <line
              x1={px(TEA_T)}
              x2={px(TEA_T)}
              y1={py(20)}
              y2={py(0)}
              stroke={GREEN}
              strokeWidth={2}
              strokeDasharray="5 4"
            />
            <Spot x={px(0)} y={py(70)} color={BLUE} />
            <Spot x={px(10)} y={py(50)} color={BLUE} />
            <Spot x={px(TEA_T)} y={py(20)} color={GREEN} />
            <Words x={px(1.5)} y={py(70) - 9} anchor="start" size={13}>
              70° above at the start
            </Words>
            <Words x={px(11.5)} y={py(50) - 8} anchor="start" size={13}>
              50° above after 10 minutes
            </Words>
            <Words
              x={px(TEA_T) + 8}
              y={py(20) - 9}
              anchor="start"
              size={13}
              color={GREEN}
            >
              20° after about 37 min
            </Words>
          </>
        )}
      </Plot>
    </Figure>
  );
}

/**
 * The share of carbon-14 left in a bone, as a percentage, over 18,000 years: 100·2^(−t/5730), with
 * t in thousands of years across. Dots mark each halving, at 5730, 11,460 and 17,190 years, and a
 * green dot marks 30% left, at about 9950 years. Each step up of 10% is drawn 24 pixels and each
 * step across of 1000 years 22 pixels.
 */
export function CarbonHalving({ caption }: { caption?: string }) {
  const half = 5.73;
  const share = (t: number) => 100 * 2 ** (-t / half);
  const age = (half * Math.log(0.3)) / -Math.log(2);
  return (
    <Figure caption={caption}>
      <Plot
        id="carbon-halving"
        x={[0, 18]}
        y={[0, 100]}
        unit={22}
        unitY={2.4}
        step={2}
        every={2}
        stepY={10}
        everyY={20}
        curves={[{ points: graph(share, 0, 18), color: BLUE }]}
        label="A graph with thousands of years from 0 to 18 across and the percentage of carbon-14 left from 0 to 100 up. A falling curve starts at 100% and halves every 5730 years: dots mark 50% at 5.73 thousand years, 25% at 11.46 thousand and 12.5% at 17.19 thousand. A green dot on the curve at 30%, about 9.95 thousand years, has dashed lines across to the vertical axis and down to the horizontal axis."
      >
        {({ px, py }) => (
          <>
            <line
              x1={px(0)}
              x2={px(age)}
              y1={py(30)}
              y2={py(30)}
              stroke={GREEN}
              strokeWidth={2}
              strokeDasharray="5 4"
            />
            <line
              x1={px(age)}
              x2={px(age)}
              y1={py(30)}
              y2={py(0)}
              stroke={GREEN}
              strokeWidth={2}
              strokeDasharray="5 4"
            />
            {[1, 2, 3].map((k) => (
              <Spot
                key={k}
                x={px(k * half)}
                y={py(share(k * half))}
                color={ORANGE}
              />
            ))}
            <Spot x={px(age)} y={py(30)} color={GREEN} />
            <Words
              x={px(half) + 8}
              y={py(50) - 8}
              anchor="start"
              size={13}
              color={ORANGE}
            >
              half left after 5730 years
            </Words>
            <Words
              x={px(2 * half) + 8}
              y={py(25) - 8}
              anchor="start"
              size={13}
              color={ORANGE}
            >
              a quarter after 11,460
            </Words>
            <Words
              x={px(age) - 8}
              y={py(30) + 18}
              anchor="end"
              size={13}
              color={GREEN}
            >
              30% after about 9950 years
            </Words>
          </>
        )}
      </Plot>
    </Figure>
  );
}
