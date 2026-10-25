import { Figure } from "../figure";
import { BLUE, ORANGE, Words } from "../illustrations";
import { MUTED, Plot, Spot, graph } from "../function-illustrations/plot";
import { ComplexPlot } from "./roots";

/**
 * Pictures for the guide Every quadratic has solutions: the graph of y = x² + 2x + 5 hovering
 * above the x-axis, beside the complex plane with the two solutions −1 + 2i and −1 − 2i of
 * x² + 2x + 5 = 0, mirror images in the real axis. Both grids use one scale across and up.
 */

/**
 * Two panels, side by side on a wide screen. First, the parabola y = x² + 2x + 5 with its lowest point (−1, 4), four
 * squares above the x-axis, which it never meets. Second, the complex plane with the
 * solutions −1 + 2i and −1 − 2i joined by a dashed segment that crosses the real axis at −1.
 */
export function ParabolaAndRoots({ caption }: { caption?: string }) {
  return (
    <Figure
      caption={caption}
      className="flex flex-wrap items-end justify-center gap-6"
    >
      <div className="w-full max-w-[200px]">
        <Plot
          id="every-quadratic-parabola"
          x={[-4, 2]}
          y={[-1, 10]}
          unit={22}
          every={2}
          curves={[
            { points: graph((x) => x * x + 2 * x + 5, -4, 2), color: BLUE },
          ]}
          label="On a grid, the U-shaped graph of y = x² + 2x + 5. Its lowest point is (−1, 4), four squares above the x-axis, and the curve rises on both sides of it without ever touching the x-axis."
        >
          {({ px, py }) => (
            <>
              <Spot x={px(-1)} y={py(4)} color={BLUE} />
              <Words x={px(-1) - 8} y={py(4) + 18} anchor="end" size={14}>
                (−1, 4)
              </Words>
            </>
          )}
        </Plot>
      </div>
      <div className="w-full max-w-[230px]">
        <ComplexPlot
          x={[-3, 2]}
          y={[-3, 3]}
          unit={34}
          label="The complex plane with the two solutions of x² + 2x + 5 = 0: the point −1 + 2i, one to the left and two up, and the point −1 − 2i, one to the left and two down. A dashed segment joins them, crossing the real axis at −1, so each is the mirror image of the other in the real axis."
        >
          {({ px, py }) => (
            <>
              <line
                x1={px(-1)}
                y1={py(2)}
                x2={px(-1)}
                y2={py(-2)}
                stroke={MUTED}
                strokeWidth={2}
                strokeDasharray="5 4"
              />
              <Spot x={px(-1)} y={py(2)} color={BLUE} />
              <Spot x={px(-1)} y={py(-2)} color={ORANGE} />
              <Words x={px(-1) - 9} y={py(2) - 9} anchor="end" color={BLUE}>
                −1 + 2i
              </Words>
              <Words x={px(-1) - 9} y={py(-2) + 20} anchor="end" color={ORANGE}>
                −1 − 2i
              </Words>
            </>
          )}
        </ComplexPlot>
      </div>
    </Figure>
  );
}
