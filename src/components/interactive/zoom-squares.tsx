"use client";

/**
 * Why a zoom by r multiplies area by r squared. A shape made of three unit squares is zoomed by r
 * about its corner O, over a grid of unit squares. Each of the three squares becomes a square of
 * side r, so each holds r × r unit squares' worth of area, and the readout adds them up.
 */

import { useState } from "react";
import { COLORS, Interactive, Slider, format, useSmooth } from "./kit";
import { Dot, planeScale, type Vec } from "./moving-shape";

// the three unit squares of the shape, by their bottom-left corners: an L on its side
const SQUARES: { at: Vec; color: string }[] = [
  { at: { x: 0, y: 0 }, color: COLORS.blue },
  { at: { x: 1, y: 0 }, color: COLORS.orange },
  { at: { x: 0, y: 1 }, color: COLORS.green },
];
const MAX = 3;
// the shape is 2 wide and 2 tall, so at the largest zoom it reaches 6 each way
const REACH = 2 * MAX;

export function ZoomSquares() {
  const [r, setR] = useState(2);
  const shown = useSmooth(r);
  const { width, height, unit, px } = planeScale(
    -0.4,
    REACH + 0.4,
    -0.4,
    REACH + 0.4,
    46,
  );

  const each = r * r;
  const grid = Array.from({ length: REACH + 1 }, (_, i) => i);

  const square = (at: Vec, side: number) => {
    const corner = px({ x: at.x, y: at.y + side });
    return {
      x: corner.x,
      y: corner.y,
      width: side * unit,
      height: side * unit,
    };
  };

  return (
    <Interactive
      readout={
        <>
          <div>
            Each square has side {format(r)} and area {format(r)} × {format(r)}{" "}
            = {format(each)}, so the shape has area 3 × {format(each)} ={" "}
            {format(3 * each)}
          </div>
          <div className="mt-1 text-sm font-normal text-fd-muted-foreground">
            {r === 1
              ? "A zoom by 1 changes nothing: the shape still covers 3 unit squares."
              : `Lengths are multiplied by ${format(r)}, but the area is multiplied by ${format(r)} × ${format(r)} = ${format(each)}.`}
          </div>
        </>
      }
      controls={
        <Slider
          label={
            <>
              zoom factor <i>r</i>
            </>
          }
          value={r}
          onChange={setR}
          min={1}
          max={MAX}
          step={0.5}
        />
      }
      caption="Count the faint unit squares under each coloured square: a square of side r covers r × r of them."
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto block h-auto w-full max-w-sm text-fd-foreground"
        role="img"
        aria-label={`A shape made of three unit squares, zoomed by ${format(r)} about its corner O. Each square becomes a square of side ${format(r)}, so the area goes from 3 to ${format(3 * each)}.`}
      >
        {/* the grid of unit squares, for counting */}
        <g stroke="currentColor" strokeOpacity={0.15} strokeWidth={1}>
          {grid.map((i) => (
            <g key={i}>
              <line
                x1={px({ x: i, y: 0 }).x}
                y1={px({ x: i, y: 0 }).y}
                x2={px({ x: i, y: REACH }).x}
                y2={px({ x: i, y: REACH }).y}
              />
              <line
                x1={px({ x: 0, y: i }).x}
                y1={px({ x: 0, y: i }).y}
                x2={px({ x: REACH, y: i }).x}
                y2={px({ x: REACH, y: i }).y}
              />
            </g>
          ))}
        </g>

        {/* the zoomed shape: each unit square becomes a square of side r */}
        {SQUARES.map(({ at, color }, i) => (
          <rect
            key={i}
            {...square({ x: at.x * shown, y: at.y * shown }, shown)}
            fill={color}
            fillOpacity={0.22}
            stroke={color}
            strokeWidth={2.5}
          />
        ))}

        {/* the shape before the zoom, drawn on top so it stays visible */}
        {SQUARES.map(({ at, color }, i) => (
          <rect
            key={i}
            {...square(at, 1)}
            fill={color}
            fillOpacity={0.35}
            stroke={color}
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
        ))}

        <Dot at={px({ x: 0, y: 0 })} name="O" dx={-12} dy={12} />
      </svg>
    </Interactive>
  );
}
