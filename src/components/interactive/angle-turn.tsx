"use client";

/**
 * One ray stays put while a slider turns a second ray anticlockwise from 0° to 360°, shading the
 * sector the angle cuts from a disc. The readout says what fraction of a full turn the angle is,
 * and that its sector is the same fraction of the disc.
 */

import { useState } from "react";
import { COLORS, Interactive, Slider, format, useSmooth } from "./kit";

const SIZE = 320;
const CENTRE = SIZE / 2;
/** radius of the disc, and how far the rays reach past it */
const RADIUS = 110;
const REACH = 145;

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

// a point at a distance and an angle (in degrees, anticlockwise from the right) from the centre
function polar(distance: number, degrees: number) {
  const t = (degrees * Math.PI) / 180;
  return {
    x: CENTRE + distance * Math.cos(t),
    y: CENTRE - distance * Math.sin(t),
  };
}

/** An angle turned by a slider: x° is x/360 of a full turn, and its sector x/360 of the disc. */
export function AngleTurn({
  degrees: initial = 120,
  step = 5,
}: {
  /** the angle at the start, in degrees */
  degrees?: number;
  /** the slider moves in steps of this many degrees */
  step?: number;
}) {
  const [degrees, setDegrees] = useState(initial);
  const shown = useSmooth(degrees);

  const end = polar(RADIUS, shown);
  const tip = polar(REACH, shown);
  // the sector from the fixed ray round to the turning ray; sweep flag 0 is anticlockwise on screen
  const sector =
    shown >= 359.99
      ? null
      : `M ${CENTRE} ${CENTRE} L ${CENTRE + RADIUS} ${CENTRE} A ${RADIUS} ${RADIUS} 0 ${
          shown > 180 ? 1 : 0
        } 0 ${end.x} ${end.y} Z`;

  const divisor = gcd(degrees, 360) || 360;
  const top = degrees / divisor;
  const bottom = 360 / divisor;
  const fraction = bottom === 1 ? String(top) : `${top}/${bottom}`;
  const readout =
    degrees === 0
      ? "0° is no turn at all, and its sector is empty"
      : degrees === 360
        ? "360° is one full turn, and its sector is the whole disc"
        : `${degrees}° is ${degrees}/360${
            fraction === `${degrees}/360` ? "" : ` = ${fraction}`
          } of a full turn, and its sector is ${fraction} of the disc`;

  return (
    <Interactive
      readout={readout}
      controls={
        <Slider
          label="angle"
          value={degrees}
          onChange={setDegrees}
          min={0}
          max={360}
          step={step}
          show={(n) => `${format(n)}°`}
        />
      }
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="mx-auto block h-auto w-full max-w-80 text-fd-foreground"
        role="img"
        aria-label={`An angle of ${degrees} degrees at the centre of a disc, with its sector shaded`}
      >
        <circle
          cx={CENTRE}
          cy={CENTRE}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={1.5}
        />
        {sector === null ? (
          <circle
            cx={CENTRE}
            cy={CENTRE}
            r={RADIUS}
            fill={COLORS.blue}
            fillOpacity={0.22}
          />
        ) : (
          <path d={sector} fill={COLORS.blue} fillOpacity={0.22} />
        )}
        {/* the fixed ray, then the ray that turns */}
        <line
          x1={CENTRE}
          y1={CENTRE}
          x2={CENTRE + REACH}
          y2={CENTRE}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <line
          x1={CENTRE}
          y1={CENTRE}
          x2={tip.x}
          y2={tip.y}
          stroke={COLORS.orange}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <circle cx={CENTRE} cy={CENTRE} r={3.5} fill="currentColor" />
      </svg>
    </Interactive>
  );
}
