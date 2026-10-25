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
import { FrameBracing, TrussBridge } from "./isometry-illustrations/congruence";
import {
  GlideFootprints,
  Kaleidoscope,
} from "./isometry-illustrations/combining-moves";
import { TracingPaper } from "./isometry-illustrations/maps";
import { HingedDoor, PinnedSheet } from "./isometry-illustrations/isometries";
import {
  ConveyorBelt,
  HalfTurnCard,
} from "./isometry-illustrations/slides-and-turns";
import {
  RiverWalk,
  BilliardBank,
  MirrorLight,
} from "./isometry-illustrations/reflections";
import { SocksAndShoes } from "./isometry-illustrations/undoing-moves";
import {
  MattressPositions,
  Snowflake,
  FanAndHubcap,
} from "./isometry-illustrations/symmetry";
import { DilationZoom } from "./interactive/dilation-zoom";
import { TranslationSlide } from "./interactive/translation-slide";
import { RotationTurn } from "./interactive/rotation-turn";
import { MirrorLine } from "./interactive/mirror-line";
import { RiverRoute } from "./interactive/river-route";
import { RigidOrNot } from "./interactive/rigid-or-not";
import { OrderMatters } from "./interactive/order-matters";
import { TwoMirrors } from "./interactive/two-mirrors";
import { PutItBack } from "./interactive/put-it-back";
import { TriangleFromSides } from "./interactive/triangle-from-sides";
import { SquareSymmetries } from "./interactive/square-symmetries";
import {
  ThreeCubes,
  PillarLoad,
  CrushedIce,
} from "./area-illustrations/volume";
import { SquareCube } from "./interactive/square-cube";
import { ZoomSquares } from "./interactive/zoom-squares";
import { DiscZoom } from "./interactive/disc-zoom";
import { PizzaCompare } from "./area-illustrations/scaling-areas";
import { GoatTether } from "./area-illustrations/disc-area";
import { InscribedPolygon } from "./interactive/inscribed-polygon";
import { StretchDisc } from "./interactive/stretch-disc";
import {
  WheelTrack,
  PizzaRearranged,
} from "./area-illustrations/circumference";
import { SlantedPlate } from "./area-illustrations/stretching";
import {
  LampShadow,
  PaperSizes,
  WindingRoad,
} from "./area-illustrations/scaling-lengths";
import { GridTriangle } from "./area-illustrations/grids";
import { ZoomLengths } from "./interactive/zoom-lengths";
import { CoordinatePlotter } from "./interactive/coordinate-plotter";
import { DistanceTriangle } from "./interactive/distance-triangle";
import { CircleEquation } from "./interactive/circle-equation";
import { RationalPoints } from "./interactive/rational-points";
import { GridReference } from "./coordinate-illustrations/coordinates";
import { DroneAndTaxi } from "./coordinate-illustrations/distance";
import { BuilderRope } from "./coordinate-illustrations/pythagorean-triples";
import { SpaceAxes, RoomDiagonal } from "./coordinate-illustrations/space";
import { ScalingSlider } from "./interactive/scaling-slider";
import { LengthDirection } from "./interactive/length-direction";
import { DroneSteps } from "./points-illustrations/space";
import { StepAdder } from "./interactive/step-adder";
import { RiverCrossing } from "./points-illustrations/adding-points";
import { HalfTurnPair } from "./interactive/half-turn-pair";
import { MoveExplorer } from "./interactive/move-explorer";
import { SpriteFrames } from "./points-illustrations/moves-as-formulas";
import { GridCount } from "./interactive/grid-count";
import { Quiz } from "./quiz";
import { RayDirection } from "./interactive/ray-direction";
import { LineThroughPoints } from "./interactive/line-through-points";
import { SegmentSlider } from "./interactive/segment-slider";
import { CrossingPaths } from "./interactive/crossing-paths";
import { SkewLines } from "./lines-illustrations/space";
import { LineCircle } from "./interactive/line-circle";
import { PerpendicularFoot } from "./interactive/perpendicular-foot";
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
  FrameBracing,
  TrussBridge,
  GlideFootprints,
  Kaleidoscope,
  TracingPaper,
  HingedDoor,
  PinnedSheet,
  ConveyorBelt,
  HalfTurnCard,
  RiverWalk,
  BilliardBank,
  MirrorLight,
  SocksAndShoes,
  MattressPositions,
  Snowflake,
  FanAndHubcap,
  DilationZoom,
  TranslationSlide,
  RotationTurn,
  MirrorLine,
  RiverRoute,
  RigidOrNot,
  OrderMatters,
  TwoMirrors,
  PutItBack,
  TriangleFromSides,
  SquareSymmetries,
  ThreeCubes,
  PillarLoad,
  CrushedIce,
  SquareCube,
  ZoomSquares,
  DiscZoom,
  PizzaCompare,
  GoatTether,
  InscribedPolygon,
  StretchDisc,
  WheelTrack,
  PizzaRearranged,
  SlantedPlate,
  LampShadow,
  WindingRoad,
  PaperSizes,
  GridTriangle,
  ZoomLengths,
  CoordinatePlotter,
  DistanceTriangle,
  CircleEquation,
  RationalPoints,
  GridReference,
  DroneAndTaxi,
  BuilderRope,
  ScalingSlider,
  LengthDirection,
  DroneSteps,
  StepAdder,
  RiverCrossing,
  HalfTurnPair,
  MoveExplorer,
  SpriteFrames,
  PerpendicularFoot,
  LineCircle,
  SkewLines,
  CrossingPaths,
  SegmentSlider,
  LineThroughPoints,
  RayDirection,
  SpaceAxes,
  RoomDiagonal,
  GridCount,
};
