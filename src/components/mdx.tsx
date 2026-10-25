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
import { ChordTwoWays } from "./interactive/chord-two-ways";
import { RadianWrap } from "./interactive/radian-wrap";
import { TriangleRatios } from "./interactive/triangle-ratios";
import { UnitCircle } from "./interactive/unit-circle";
import { MirrorIdentity } from "./interactive/mirror-identity";
import { HalfSquare } from "./trig-illustrations/special-angles";
import { HalfEquilateral } from "./trig-illustrations/special-angles";
import { WaveTracer } from "./interactive/wave-tracer";
import { FerrisHeights } from "./trig-illustrations/graphs";
import { SineGraph } from "./trig-illustrations/graphs";
import { CosineGraph } from "./trig-illustrations/graphs";
import { SineRepeats } from "./trig-illustrations/graphs";
import { CosineShift } from "./trig-illustrations/graphs";
import { WaveSymmetry } from "./trig-illustrations/graphs";
import { WaveTaller } from "./trig-illustrations/graphs";
import { WaveSqueezed } from "./trig-illustrations/graphs";
import { WaveWidened } from "./trig-illustrations/graphs";
import { WaveSlid } from "./trig-illustrations/graphs";
import { TrigZeros } from "./trig-illustrations/graphs";
import { TangentLine } from "./interactive/tangent-line";
import { TangentGraph } from "./trig-illustrations/tangent";
import { TriangleLaws } from "./interactive/triangle-laws";
import { RotateShape } from "./interactive/rotate-shape";
import { IdentityChecker } from "./interactive/identity-checker";
import { IdentityTree } from "./trig-illustrations/identity-tree";
import { HyperbolaTurn } from "./interactive/hyperbola-turn";
import { PizzaShares } from "./conic-illustrations/hyperbolas";
import { ProductBranches } from "./conic-illustrations/hyperbolas";
import { MovedProduct } from "./conic-illustrations/hyperbolas";
import { StandardHyperbola } from "./conic-illustrations/hyperbolas";
import { AsymptoteGap } from "./conic-illustrations/hyperbolas";
import { FocalDistances } from "./conic-illustrations/hyperbolas";
import { RadioStations } from "./conic-illustrations/hyperbolas";
import { GraphMover } from "./interactive/graph-mover";
import { SlideRight } from "./conic-illustrations/sliding-and-stretching";
import { StretchCircle } from "./conic-illustrations/sliding-and-stretching";
import { FlipParabola } from "./conic-illustrations/sliding-and-stretching";
import { TurnParabola } from "./conic-illustrations/sliding-and-stretching";
import { ParabolaFocus } from "./interactive/parabola-focus";
import { DishFocus } from "./conic-illustrations/focus-and-directrix";
import { EqualDistances } from "./conic-illustrations/focus-and-directrix";
import { ReflectionStep } from "./conic-illustrations/focus-and-directrix";
import { ParabolaTangent } from "./interactive/parabola-tangent";
import { FountainJets } from "./conic-illustrations/parabolas";
import { SlidParabola } from "./conic-illustrations/parabolas";
import { SameShape } from "./conic-illustrations/parabolas";
import { SidewaysParabola } from "./conic-illustrations/parabolas";
import { TangentOrVertical } from "./conic-illustrations/parabolas";
import { BallPath } from "./conic-illustrations/parabolas";
import { ConeSlices } from "./conic-illustrations/cone";
import { EccentricityDial } from "./interactive/eccentricity-dial";
import { EllipseString } from "./interactive/ellipse-string";
import { GardenerString } from "./conic-illustrations/ellipses";
import { StretchedCircle } from "./conic-illustrations/ellipses";
import { EllipseParts } from "./conic-illustrations/ellipses";
import { SlidEllipse } from "./conic-illustrations/ellipses";
import { EllipseFoci } from "./conic-illustrations/ellipses";
import { EllipseLines } from "./conic-illustrations/ellipses";
import { ConicSorter } from "./interactive/conic-sorter";
import { ShrinkingEllipse } from "./conic-illustrations/general-equation";
import { DegenerateCases } from "./conic-illustrations/general-equation";
import { TurnedEllipse } from "./conic-illustrations/general-equation";
import { TurnedHyperbola } from "./conic-illustrations/general-equation";
import { TurnedParabola } from "./conic-illustrations/general-equation";
import { RumourDoubling } from "./function-illustrations/logarithms";
import { EveryHeight } from "./function-illustrations/logarithms";
import { LogMirror } from "./function-illustrations/logarithms";
import { TeaCooling } from "./function-illustrations/the-number-e";
import { CarbonHalving } from "./function-illustrations/the-number-e";
import { LogChecker } from "./interactive/log-checker";
import { CompoundDial } from "./interactive/compound-dial";
import { FunctionMachine } from "./interactive/function-machine";
import { VerticalLineTest } from "./interactive/vertical-line-test";
import { VendingMachine } from "./function-illustrations/what-is-a-function";
import { ArrowDiagrams } from "./function-illustrations/what-is-a-function";
import { InverseArrows } from "./function-illustrations/what-is-a-function";
import { WeatherForecast } from "./function-illustrations/graphs-of-functions";
import { GraphShadows } from "./function-illustrations/graphs-of-functions";
import { CircleHalves } from "./function-illustrations/graphs-of-functions";
import { SignSketch } from "./function-illustrations/graphs-of-functions";
import { AbsoluteValueGraph } from "./function-illustrations/graphs-of-functions";
import { ReciprocalGraphs } from "./function-illustrations/graphs-of-functions";
import { FloorStaircase } from "./function-illustrations/graphs-of-functions";
import { RisingFalling } from "./function-illustrations/graphs-of-functions";
import { LakeReflection } from "./function-illustrations/moving-and-mirroring";
import { SlidV } from "./function-illustrations/moving-and-mirroring";
import { StretchedRoot } from "./function-illustrations/moving-and-mirroring";
import { EvenOddGraphs } from "./function-illustrations/moving-and-mirroring";
import { InverseMirror } from "./function-illustrations/moving-and-mirroring";
import { CardBox } from "./function-illustrations/polynomials";
import { BoxVolume } from "./function-illustrations/polynomials";
import { FunctionMover } from "./interactive/function-mover";
import { PolynomialRoots } from "./interactive/polynomial-roots";
import { SharingSweets } from "./function-illustrations/dividing-polynomials";
import { RationalNearLine } from "./function-illustrations/dividing-polynomials";
import { LineWithHole } from "./function-illustrations/dividing-polynomials";
import { PaperFolds } from "./function-illustrations/exponential-functions";
import { PowersOfTwoDots } from "./function-illustrations/exponential-functions";
import { DoubleAndHalve } from "./function-illustrations/exponential-functions";
import { ThreeBases } from "./function-illustrations/exponential-functions";
import { BacteriaDoubling } from "./function-illustrations/exponential-functions";
import { LongDivision } from "./interactive/long-division";
import { ExponentialBase } from "./interactive/exponential-base";
import { ArrowDiagram } from "./interactive/arrow-diagram";
import { CloakroomHooks } from "./mapping-illustrations/mappings";
import { MappingOrNot } from "./mapping-illustrations/mappings";
import { SquareStretch } from "./mapping-illustrations/mappings";
import { SquaringPreimage } from "./mapping-illustrations/mappings";
import { SharedHook } from "./mapping-illustrations/mappings";
import { TheatreSeats } from "./mapping-illustrations/one-to-one-and-onto";
import { ArrowTests } from "./mapping-illustrations/one-to-one-and-onto";
import { Pigeonholes } from "./mapping-illustrations/one-to-one-and-onto";
import { FivePoints } from "./mapping-illustrations/one-to-one-and-onto";
import { HotelRooms } from "./mapping-illustrations/one-to-one-and-onto";
import { OutShuffle } from "./mapping-illustrations/cycles";
import { OutShuffleLoops } from "./mapping-illustrations/cycles";
import { SevenLoops } from "./mapping-illustrations/cycles";
import { FourteenFifteen } from "./mapping-illustrations/swaps-and-sign";
import { GapColours } from "./mapping-illustrations/swaps-and-sign";
import { LoopCut } from "./mapping-illustrations/swaps-and-sign";
import { LoopsJoin } from "./mapping-illustrations/swaps-and-sign";
import { CycleViewer } from "./interactive/cycle-viewer";
import { SlidingPuzzle } from "./interactive/sliding-puzzle";
import { PlaylistLoop } from "./mapping-illustrations/repeating-a-mapping";
import { DoublingJumps } from "./mapping-illustrations/repeating-a-mapping";
import { TurnPowers } from "./mapping-illustrations/repeating-a-mapping";
import { CardMoves } from "./mapping-illustrations/permutations";
import { ComposeColumns } from "./mapping-illustrations/permutations";
import { CountingTree } from "./mapping-illustrations/permutations";
import { IterateMap } from "./interactive/iterate-map";
import { CardShuffle } from "./interactive/card-shuffle";
import { SparklerTrail } from "./mapping-illustrations/curves";
import { CuspCurve } from "./mapping-illustrations/curves";
import { CliffBall } from "./mapping-illustrations/curves";
import { PolarMapPicture } from "./mapping-illustrations/curves";
import { GiftWrap } from "./mapping-illustrations/combining-and-undoing";
import { PegChain } from "./mapping-illustrations/combining-and-undoing";
import { TicketArrows } from "./mapping-illustrations/combining-and-undoing";
import { CurveTracer } from "./interactive/curve-tracer";
import { UndoChain } from "./interactive/undo-chain";
import { LayerModels } from "./sum-illustrations/areas-and-volumes";
import { ParabolaStrips } from "./sum-illustrations/areas-and-volumes";
import { ConeStacks } from "./sum-illustrations/areas-and-volumes";
import { HalfBallStacks } from "./sum-illustrations/areas-and-volumes";
import { InsideTheCylinder } from "./sum-illustrations/areas-and-volumes";
import { RectangleSqueeze } from "./interactive/rectangle-squeeze";
import { BakeryReceipts } from "./determinant-illustrations/cramers-rule";
import { ReplacedColumn } from "./determinant-illustrations/cramers-rule";
import { FlatColumns } from "./determinant-illustrations/cramers-rule";
import { CramerSolver } from "./interactive/cramer-solver";
import { QuarterTurns } from "./complex-illustrations/polar-form";
import { TurnThenZoom } from "./complex-illustrations/polar-form";
import { PowersOfOnePlusI } from "./complex-illustrations/powers-and-identities";
import { ConjugateSum } from "./complex-illustrations/powers-and-identities";
import { ComplexMultiply } from "./interactive/complex-multiply";
import { PowerSpiral } from "./interactive/power-spiral";
import { FoggyLadder } from "./sum-illustrations/induction-in-practice";
import { FactorTree } from "./sum-illustrations/induction-in-practice";
import { PaintedDoors } from "./sum-illustrations/induction-in-practice";
import { CrayonBoxes } from "./sum-illustrations/induction-in-practice";
import { OrangePyramid } from "./sum-illustrations/adding-up-powers";
import { StaircaseRectangle } from "./sum-illustrations/adding-up-powers";
import { CubesSquare } from "./sum-illustrations/adding-up-powers";
import { StampMaker } from "./interactive/stamp-maker";
import { SumPictures } from "./interactive/sum-pictures";
import { BouncingBall } from "./sum-illustrations/geometric-series";
import { ZenoWalk } from "./sum-illustrations/geometric-series";
import { DoseBuildUp } from "./sum-illustrations/geometric-series";
import { BookStack } from "./sum-illustrations/sums-that-never-settle";
import { HarmonicBlocks } from "./sum-illustrations/sums-that-never-settle";
import { GeometricBars } from "./interactive/geometric-bars";
import { PartialSums } from "./interactive/partial-sums";
import { PizzaSlices } from "./complex-illustrations/roots";
import { SquareRootsHalved } from "./complex-illustrations/roots";
import { RootPolygons } from "./complex-illustrations/roots";
import { CubeRootsEightI } from "./complex-illustrations/roots";
import { ParabolaAndRoots } from "./complex-illustrations/every-quadratic";
import { RootsOfUnity } from "./interactive/roots-of-unity";
import { ChocolateBoxes } from "./determinant-illustrations/order-three";
import { CubeToBox } from "./determinant-illustrations/order-three";
import { SarrusDiagonals } from "./determinant-illustrations/order-three";
import { ShelfPush } from "./determinant-illustrations/properties";
import { ShearedBox } from "./determinant-illustrations/properties";
import { Handedness } from "./determinant-illustrations/properties";
import { ColumnsInAPlane } from "./determinant-illustrations/properties";
import { Det3Expander } from "./interactive/det3-expander";
import { SquaresNeverNegative } from "./complex-illustrations/meeting-i";
import { MultiplyPreview } from "./complex-illustrations/meeting-i";
import { TimesITurns } from "./complex-illustrations/meeting-i";
import { PowersOfI } from "./complex-illustrations/meeting-i";
import { TreasureMap } from "./complex-illustrations/complex-plane";
import { PointsInPlane } from "./complex-illustrations/complex-plane";
import { SumParallelogram } from "./complex-illustrations/complex-plane";
import { DifferenceStep } from "./complex-illustrations/complex-plane";
import { ConjugateFlip } from "./complex-illustrations/complex-plane";
import { AbsoluteCircle } from "./complex-illustrations/complex-plane";
import { ComplexPlane } from "./interactive/complex-plane";
import { MatrixGrid } from "./interactive/matrix-grid";
import { ShoppingReceipts } from "./determinant-illustrations/matrices";
import { EntryAddress } from "./determinant-illustrations/matrices";
import { ColumnSteps } from "./determinant-illustrations/matrices";
import { PhotoPrints } from "./determinant-illustrations/order-two";
import { BoxAndSubtract } from "./determinant-illustrations/order-two";
import { TurnedParallelogram } from "./determinant-illustrations/order-two";
import { TwoOrientations } from "./determinant-illustrations/order-two";
import { ShearKeepsArea } from "./determinant-illustrations/order-two";
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
  ShearKeepsArea,
  TwoOrientations,
  TurnedParallelogram,
  BoxAndSubtract,
  PhotoPrints,
  ColumnSteps,
  EntryAddress,
  ShoppingReceipts,
  MatrixGrid,
  ComplexPlane,
  AbsoluteCircle,
  ConjugateFlip,
  DifferenceStep,
  SumParallelogram,
  PointsInPlane,
  TreasureMap,
  PowersOfI,
  TimesITurns,
  MultiplyPreview,
  SquaresNeverNegative,
  Det3Expander,
  ColumnsInAPlane,
  Handedness,
  ShearedBox,
  ShelfPush,
  SarrusDiagonals,
  CubeToBox,
  ChocolateBoxes,
  RootsOfUnity,
  ParabolaAndRoots,
  CubeRootsEightI,
  RootPolygons,
  SquareRootsHalved,
  PizzaSlices,
  PartialSums,
  GeometricBars,
  HarmonicBlocks,
  BookStack,
  DoseBuildUp,
  ZenoWalk,
  BouncingBall,
  SumPictures,
  StampMaker,
  CubesSquare,
  StaircaseRectangle,
  OrangePyramid,
  CrayonBoxes,
  PaintedDoors,
  FactorTree,
  FoggyLadder,
  PowerSpiral,
  ComplexMultiply,
  ConjugateSum,
  PowersOfOnePlusI,
  TurnThenZoom,
  QuarterTurns,
  CramerSolver,
  FlatColumns,
  ReplacedColumn,
  BakeryReceipts,
  RectangleSqueeze,
  InsideTheCylinder,
  HalfBallStacks,
  ConeStacks,
  ParabolaStrips,
  LayerModels,
  UndoChain,
  CurveTracer,
  TicketArrows,
  PegChain,
  GiftWrap,
  PolarMapPicture,
  CliffBall,
  CuspCurve,
  SparklerTrail,
  CardShuffle,
  IterateMap,
  CountingTree,
  ComposeColumns,
  CardMoves,
  TurnPowers,
  DoublingJumps,
  PlaylistLoop,
  SlidingPuzzle,
  CycleViewer,
  LoopsJoin,
  LoopCut,
  GapColours,
  FourteenFifteen,
  SevenLoops,
  OutShuffleLoops,
  OutShuffle,
  HotelRooms,
  FivePoints,
  Pigeonholes,
  ArrowTests,
  TheatreSeats,
  SharedHook,
  SquaringPreimage,
  SquareStretch,
  MappingOrNot,
  CloakroomHooks,
  ArrowDiagram,
  ExponentialBase,
  LongDivision,
  BacteriaDoubling,
  ThreeBases,
  DoubleAndHalve,
  PowersOfTwoDots,
  PaperFolds,
  LineWithHole,
  RationalNearLine,
  SharingSweets,
  PolynomialRoots,
  FunctionMover,
  BoxVolume,
  CardBox,
  InverseMirror,
  EvenOddGraphs,
  StretchedRoot,
  SlidV,
  LakeReflection,
  RisingFalling,
  FloorStaircase,
  ReciprocalGraphs,
  AbsoluteValueGraph,
  SignSketch,
  CircleHalves,
  GraphShadows,
  WeatherForecast,
  InverseArrows,
  ArrowDiagrams,
  VendingMachine,
  VerticalLineTest,
  FunctionMachine,
  CompoundDial,
  LogChecker,
  CarbonHalving,
  TeaCooling,
  LogMirror,
  EveryHeight,
  RumourDoubling,
  TurnedParabola,
  TurnedHyperbola,
  TurnedEllipse,
  DegenerateCases,
  ShrinkingEllipse,
  ConicSorter,
  EllipseLines,
  EllipseFoci,
  SlidEllipse,
  EllipseParts,
  StretchedCircle,
  GardenerString,
  EllipseString,
  EccentricityDial,
  ConeSlices,
  BallPath,
  TangentOrVertical,
  SidewaysParabola,
  SameShape,
  SlidParabola,
  FountainJets,
  ParabolaTangent,
  ReflectionStep,
  EqualDistances,
  DishFocus,
  ParabolaFocus,
  TurnParabola,
  FlipParabola,
  StretchCircle,
  SlideRight,
  GraphMover,
  RadioStations,
  FocalDistances,
  AsymptoteGap,
  StandardHyperbola,
  MovedProduct,
  ProductBranches,
  PizzaShares,
  HyperbolaTurn,
  IdentityTree,
  IdentityChecker,
  RotateShape,
  TriangleLaws,
  TangentGraph,
  TangentLine,
  TrigZeros,
  WaveSlid,
  WaveWidened,
  WaveSqueezed,
  WaveTaller,
  WaveSymmetry,
  CosineShift,
  SineRepeats,
  CosineGraph,
  SineGraph,
  FerrisHeights,
  WaveTracer,
  HalfEquilateral,
  HalfSquare,
  MirrorIdentity,
  UnitCircle,
  TriangleRatios,
  RadianWrap,
  ChordTwoWays,
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
