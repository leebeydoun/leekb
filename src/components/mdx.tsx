import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { AreaModel } from "./area-model";
import { DiagonalSquare } from "./diagonal-square";
import { Graph } from "./graph";
import { NumberLine } from "./number-line";
import { PlaneFigure } from "./plane-figure";
import {
  BoxDiagonal,
  CardTriangles,
  FenceWalk,
  TornCorners,
  PaperFold,
  CarpenterBoard,
  ClockHands,
  RailwayTrack,
} from "./illustrations";
import { NumberLineWalk } from "./interactive/walk";
import {
  InequalityScale,
  InequalityShift,
} from "./interactive/inequality-moves";
import { ReciprocalSlider } from "./interactive/reciprocal";
import { TriangleInequality } from "./interactive/triangle-inequality";
import { SolutionScanner } from "./interactive/solution-scanner";
import { GrowingSquare } from "./interactive/growing-square";
import { RectangleFence } from "./interactive/rectangle-fence";
import { ClockArithmetic } from "./interactive/clock";
import { RowsOfDots } from "./interactive/dots";
import { TwoLines } from "./interactive/two-lines";
import { SlopeExplorer } from "./interactive/slope";
import { FractionBars } from "./interactive/fraction-bars";
import { CompletingSquare } from "./interactive/completing-square";
import { ParabolaCrossings, ParabolaVertex } from "./interactive/parabola";
import { SegmentDistances } from "./interactive/segment-distances";
import { AngleTurn } from "./interactive/angle-turn";
import { GlobeTriangle, GreatCircles } from "./interactive/great-circles";
import { PythagorasSquares } from "./interactive/pythagoras-squares";
import {
  BisectorDistances,
  ShortestDistance,
} from "./interactive/bisector-distances";
import { Circumcircle } from "./interactive/circumcircle";
import { Quiz } from "./quiz";
import {
  Conjecture,
  Corollary,
  Definition,
  Example,
  Exercise,
  Lemma,
  Proof,
  Proposition,
  Ref,
  Remark,
  SeeAlso,
  Solution,
  Theorem,
} from "./statement";

/**
 * Components available on every page: most are created from directives by remark-components, and
 * the interactive diagrams are written as JSX straight into the content.
 */
export const mdxComponents = {
  Accordion,
  Accordions,
  AreaModel,
  DiagonalSquare,
  Graph,
  NumberLine,
  PlaneFigure,
  BoxDiagonal,
  CardTriangles,
  TornCorners,
  FenceWalk,
  PaperFold,
  CarpenterBoard,
  ClockHands,
  RailwayTrack,
  Quiz,
  Conjecture,
  Corollary,
  Definition,
  Example,
  Exercise,
  Lemma,
  Proof,
  Proposition,
  Ref,
  Remark,
  SeeAlso,
  Solution,
  Theorem,
  // interactive diagrams
  NumberLineWalk,
  InequalityScale,
  InequalityShift,
  ReciprocalSlider,
  TriangleInequality,
  SolutionScanner,
  GrowingSquare,
  RectangleFence,
  ClockArithmetic,
  RowsOfDots,
  TwoLines,
  SlopeExplorer,
  FractionBars,
  CompletingSquare,
  ParabolaCrossings,
  ParabolaVertex,
  SegmentDistances,
  AngleTurn,
  GreatCircles,
  GlobeTriangle,
  PythagorasSquares,
  BisectorDistances,
  ShortestDistance,
  Circumcircle,
};
