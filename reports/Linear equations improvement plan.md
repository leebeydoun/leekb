# Rebuild linear equations around preserved meaning

The Linear Equations section is mathematically sound and unusually careful about why algebraic moves
preserve solutions, but **it often makes the general justification interrupt the first useful
experience of the method**. The strongest local idea is already present: an equation may change its
appearance while its solution set stays fixed. That invariant should become the section's spine,
connecting balance, rearrangement, elimination, substitution, graphs and three-variable systems. The
core redesign is progressive disclosure: establish meaning, model one small case, let the learner
act, then reveal the general proof and boundary cases. Move the graphical core before the
determinant-heavy classification, teach method choice through structural cues, and show the
triangular destination before beginning a 3×3 elimination. Practice should progress from checking
and completing to explaining, repairing, choosing, modelling and constructing; the fixed-choice quiz
should diagnose concepts rather than certify solving competence. These recommendations combine
repository evidence with authoritative algebra-teaching guidance; the proposed order, splits and
templates are editorial recommendations that still require learner testing. **No Linear Equations
lesson, metadata, exercise or quiz content was changed during this review.**

## Put representations before determinant classification

The current order is Introduction → Equations → Two unknowns/elimination → Substitution → Special
cases → Lines → Three unknowns → Test yourself → Exercises
([current metadata](/Users/leebeydoun/Workspace/leekb/content/maths/linear-equations/meta.json:1)).
It is mathematically coherent, but it explains no/one/infinitely-many solutions through determinants
before presenting their clearest picture—parallel, crossing and coincident lines—and it places a
recognition quiz before cumulative written practice. Illustrative Mathematics introduces system
solutions through simultaneous truth and intersections, then develops algebraic methods and asks
learners to compare them; IES likewise recommends explicit links among symbolic, graphical and
contextual representations
([Illustrative Mathematics, Integrated Math 1 Unit 4](https://cms-assets.illustrativemathematics.org/kn6q9ggbremgko8ke88w6p9pj2w5);
[IES algebra practice guide](https://ies.ed.gov/ncee/wwc/Docs/PracticeGuide/wwc_algebra_040715.pdf)).

| Phase          | Recommended unit                                     | Learner capability                                                             | Structural action                                                          |
| -------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Orientation    | Introduction                                         | See the one-equation, systems and extension routes                             | Turn the rule inventory into a return-later reference; add prerequisites   |
| Meaning        | Equations and solutions                              | Distinguish expression, equation, identity and solution set; preserve equality | Give a practical solving pass before the general equivalence proof         |
| Constraints    | One equation with two unknowns                       | Read an ordered pair and see one constraint leave many possibilities           | Add a value table and graph preview before elimination                     |
| Core methods   | Elimination → Substitution                           | Preserve the same pair while reducing two equations to one                     | Model → fade → choose; move general proofs behind practice                 |
| Representation | Equations as lines                                   | Connect table → ordered pairs → points → line → intersection                   | Move the graphical core before Special Cases; keep determinant proof later |
| Classification | No, one or infinitely many solutions                 | Link `x=c`, `0=c`, `0=0` to crossing, parallel and coincident lines            | End the core guide before Cramer/null-direction material                   |
| Extension      | Determinants and system structure                    | Predict uniqueness and study formulas, homogeneous systems and null directions | Prefer a separate advanced guide; preserve its rigorous proofs             |
| Generalisation | Three unknowns                                       | Reduce a 3×3 system to triangular form and back-substitute                     | Show the target shape first; stage fractions and degeneracy later          |
| Synthesis      | Structured Exercises → Concept check → written check | Execute, explain, repair, choose, model and construct                          | Put practice before diagnosis; do not equate quiz score with mastery       |

This order does not require new URLs. A low-disruption version can keep the current files, move
`lines` before `special-cases`, put a strong **Core / Deeper extension** reset inside both pages,
and move `exercises` before `test-yourself`. If the files can be split, the highest-value split is
**Special cases** versus **Determinants and Cramer's rule**. OpenStax places Cramer's rule after
ordinary two- and three-variable system methods and describes it as a final method, supporting its
status as an extension rather than the conceptual entrance
([OpenStax Precalculus §9.8](https://openstax.org/books/precalculus-2e/pages/9-8-solving-systems-with-cramers-rule)).

## Each guide needs one specific teaching repair

### Introduction should reveal routes, not finished formulas

**Intended outcome.** The learner should understand that a system asks for values satisfying all
conditions simultaneously, see the section's core and extension routes, and know the prerequisites.
The ticket problem already provides an effective organising context and should remain
([Introduction, lines 6–14](/Users/leebeydoun/Workspace/leekb/content/maths/linear-equations/introduction.mdx:6)).

**What confuses.** The page presents every destination at the same level, then exposes determinants,
closed formulas, slope and graph terminology before the learner has met them
([Introduction, lines 21–81](/Users/leebeydoun/Workspace/leekb/content/maths/linear-equations/introduction.mdx:21)).
It gives no readiness check for rational arithmetic, expanding brackets, collecting terms, ordered
pairs or relational equality.

**Prioritized improvement and revised outline.** Preserve the ticket problem, then show three
routes: **one equation**, **two-equation systems**, and **deeper structure/three unknowns**. Preview
the recurring contract—interpret the solution, preserve it, solve, check, represent—and add a
five-item prerequisite gate with exact refresher links. Describe the guide sequence through learner
actions, move Exercises before Concept check, and label the existing formula summary
**Reference—return after learning**.

### Equations and solutions should teach a usable invariant before proving every boundary

**Intended outcome.** Learners should distinguish equations from expressions and identities, find
the complete solution set, solve a linear equation through reversible transformations, and check the
result. Preserve the marble-balance opening, definition of solution, contrasting zero/one/two/all
solution examples, solution-set meaning of equivalence and substitution checks
([Equations, lines 6–70](/Users/leebeydoun/Workspace/leekb/content/maths/linear-equations/equations.mdx:6)).

**What confuses.** The page never places **expression / equation / identity / solution set** side by
side. Its abstract safe-step proposition, two-direction proof, zero multiplier, variable multiplier,
squaring and rational cancellation all arrive before a sustained multi-step solving routine
([Equations, lines 72–139](/Users/leebeydoun/Workspace/leekb/content/maths/linear-equations/equations.mdx:72)).
The first practice begins only at line 219
([Equations exercises](/Users/leebeydoun/Workspace/leekb/content/maths/linear-equations/equations.mdx:219)).
Research links a relational interpretation of `=` with equation-solving performance, and IES
explicitly recommends precise “subtract from both sides” language instead of “move it across”
([Knuth et al., 2006](https://alibali.psych.wisc.edu/wp-content/uploads/sites/371/2018/02/KnuthStephensMcNeilAlibali2006.pdf);
[IES Algebra Toolkit Module 2](https://ies.ed.gov/ncee/rel/algebra-middle-and-high-school/pdf/Module_2_PW.pdf)).

**Prioritized improvement and revised outline.** Start with a four-way classification table and read
`=` aloud as “has the same value as.” Then use this core routine: **simplify each side → choose an
inverse operation → apply it to both sides → repeat until isolated → check in the original**.
Annotate one model with both the operation and the invariant: “the appearance changes; the solution
set does not.” Follow immediately with a faded example and a “move/change-sign” repair. Continue to
unknowns on both sides, `0=c` versus `0=0`, fractions and checking. Only then add **Why every safe
step is reversible**, the general `ax=c` classification, and a boundary table distinguishing safe,
conditionally safe and irreversible operations. Require excluded values before any rational
expression cancellation.

### Two equations in two unknowns should turn one constraint into a visible family

**Intended outcome.** Learners should understand ordered-pair solutions, simultaneous constraints
and elimination as replacing one equation without discarding information. Preserve the café context,
multiple pairs for one equation, exact system definition, intuitive first cancellation,
action-labelled six-step method, checks in both originals and excellent
lost-equation/zero-multiplier error tasks
([Two unknowns, lines 6–81 and 136–156](/Users/leebeydoun/Workspace/leekb/content/maths/linear-equations/two-unknowns.mdx:6);
[Two unknowns, lines 375–410](/Users/leebeydoun/Workspace/leekb/content/maths/linear-equations/two-unknowns.mdx:375)).

**What confuses.** A general `L₁,R₁,L₂,R₂` row-operation proof interrupts the movement from the
first cancellation to the reusable algorithm
([Two unknowns, lines 83–128](/Users/leebeydoun/Workspace/leekb/content/maths/linear-equations/two-unknowns.mdx:83)).
The learner receives several completed examples before producing a first step, fraction work
competes with the new method, and the motivating café is not resolved until lines 276–289. One
equation's many ordered pairs are described but not tabulated or graphed.

**Prioritized improvement and revised outline.** Use the café to build a table of candidate pairs,
mark which satisfy each condition, and preview each equation as a line of possibilities. Define a
system as the overlap. Stage elimination in three rounds: coefficients already opposite; multiply
one equation; multiply both. After each model, ask which variable to remove and why before doing
arithmetic. Put the structural warning beside the first example: **keep one equation and replace the
other**. Return to the café immediately, then give a partial and independent near-transfer. Move
fractions and the full reversibility proof into a second pass. OpenStax and Illustrative Mathematics
use the same progression from adding equations to coefficient matching and explanation
([OpenStax, elimination](https://openstax.org/books/elementary-algebra/pages/5-3-solve-systems-of-equations-by-elimination);
[Illustrative Mathematics Unit 4](https://cms-assets.illustrativemathematics.org/kn6q9ggbremgko8ke88w6p9pj2w5)).

### Substitution should preserve “two names for one value” through practice

**Intended outcome.** Learners should replace an unknown by an equal expression, solve the resulting
one-variable equation, recover the second value and choose substitution when the structure favours
it. Preserve the price context, five-step routine, fully labelled first example, brackets warning,
checks in both originals and structural method-choice table
([Substitution, lines 6–62 and 133–147](/Users/leebeydoun/Workspace/leekb/content/maths/linear-equations/substitution.mdx:6)).

**What confuses.** The abstract preservation proof introduces four metasyntactic letters after only
one numerical example and before learner production
([Substitution, lines 64–97](/Users/leebeydoun/Workspace/leekb/content/maths/linear-equations/substitution.mdx:64)).
The page's title tells learners which method to use, while its strongest choice cues are not tested
in mixed practice. The vital warning that the linking equation `y=E` must remain in the system is
mainly protected by a late exercise.

**Prioritized improvement and revised outline.** Keep the semantic opening and five-step card. Show
one complete model, then a bracket-repair check and a faded example before the general proof.
Display the old and new systems side by side with the invariant **the same ordered pairs solve
both**. State early that substitution replaces an occurrence of `y`; it does not permit discarding
`y=E`. Teach an **inspect first** routine across methods: isolated variable? coefficient `±1`?
opposite or multiple coefficients? fraction risk? need an exact or visual answer? Add paired systems
solved both ways and mixed unnamed-method tasks. Keep nonlinear and three-variable substitutions as
extensions.

### Equations as lines should move earlier in a core-and-extension split

**Intended outcome.** Learners should connect a solution pair with a point, understand a graph as
the complete solution set, interpret a system as an intersection, and understand slope as constant
change. Preserve the concise coordinate refresher, exact graph definition, verification of points,
visual/algebra precision comparison, three line arrangements, slope interactive and vertical-line
boundary
([Lines, lines 13–116](/Users/leebeydoun/Workspace/leekb/content/maths/linear-equations/lines.mdx:13)).

**What confuses.** The page assumes rather than displays the complete bridge **table → ordered pair
→ point → line**. Its last third then combines slope, vertical exceptions, cross-multiplication,
determinants and a general proof before any exercise
([Lines, lines 118–143](/Users/leebeydoun/Workspace/leekb/content/maths/linear-equations/lines.mdx:118)).
If Lines moves before Special Cases, that determinant proposition becomes a forward dependency.

**Prioritized improvement and revised outline.** Move the page's graphical core before Special
Cases. Begin with a readiness check, generate a small value table, label every row as a solution and
point, then show the whole line as the solution set. Use the same two equations and persistent
labels across tables, graph and algebra; identify their common row before naming the intersection.
Compare crossing, parallel and coincident cases and the roles of graphing versus exact algebra, then
give immediate translation practice. Reset for an extension on slope, `y=mx+k`, vertical lines and
the parallel test. Move the slope/determinant equivalence proof after determinants are introduced or
make it an optional forward-linked result. IES recommends requiring learners to name quantities in
each representation and explain the correspondence and advantage of each
([IES multiple-representations materials](https://ies.ed.gov/ncee/rel/algebra-middle-and-high-school/pdf/Module_2_PW.pdf)).

### Special cases / No solution, or infinitely many should stop before becoming an advanced linear-algebra guide

**Intended outcome.** The core page should distinguish contradiction, redundancy and unique
determination, describe infinite families exactly, and connect each algebraic outcome to a graph.
Preserve the concrete `0=2` and `0=0` examples, free-parameter form, determinant mnemonic, careful
existence-versus-uniqueness proof and final classification table
([Special cases, lines 13–140 and 279–296](/Users/leebeydoun/Workspace/leekb/content/maths/linear-equations/special-cases.mdx:13)).

**What confuses.** After the accessible cases, the guide becomes a substantial extension: Cramer
formulas with a two-direction proof, zero-determinant null directions, three coefficient cases,
parameterised translated solutions and homogeneous systems
([Special cases, lines 142–326](/Users/leebeydoun/Workspace/leekb/content/maths/linear-equations/special-cases.mdx:142)).
This material is correct and valuable, but it is not required to understand the page title and
competes with the basic distinction among none, one and infinitely many.

**Prioritized improvement and revised outline.** Build the core from three familiar elimination
outcomes and the matching line arrangements. Reuse one table:

| Elimination result | Graph                   | Solution set                                      |
| ------------------ | ----------------------- | ------------------------------------------------- |
| `x=c` or `y=c`     | crossing lines          | one ordered pair                                  |
| `0=c`, `c≠0`       | distinct parallel lines | none                                              |
| `0=0`              | the same line           | infinitely many pairs, described with a parameter |

Then add a clear stopping point: “You can solve and classify systems without the rest of this
guide.” In the extension, introduce the determinant first only as zero/non-zero structural
information; then present Cramer's formulas, proof map, null-direction result and homogeneous
corollary. Explain that a zero determinant does not by itself decide none versus infinitely many;
elimination still does. Preserve the advanced rigor rather than deleting it, preferably in a new
**Determinants and systems** guide.

### Three equations in three unknowns should show the staircase before the bookkeeping

**Intended outcome.** Learners should generalise elimination by removing the same variable from two
different equation pairs, solve the resulting 2×2 system, back-substitute twice and check all three
original equations. Preserve the five-step method, same-variable/different-pairs warning,
recoverability explanation, fractional-answer normalisation, fraction clearing and algebraic special
cases
([Three unknowns, lines 37–102 and 106–213](/Users/leebeydoun/Workspace/leekb/content/maths/linear-equations/three-unknowns.mdx:37)).

**What confuses.** Saying there is “no new idea” understates a real coordination burden: three
original labels, two derived equations, pair choice, nested 2×2 solving and two back-substitutions.
The first complete computation arrives before the triangular target is named, and three substantial
models precede the first learner exercise
([Three unknowns, lines 57–217](/Users/leebeydoun/Workspace/leekb/content/maths/linear-equations/three-unknowns.mdx:57)).

**Prioritized improvement and revised outline.** Begin with a two-variable readiness gate and say
“the same idea, with more bookkeeping.” Show the destination first:

```math
\begin{aligned}
ax+by+cz&=p,\\
\phantom{ax+{}}b'y+c'z&=q,\\
\phantom{ax+by+{}}c''z&=r.
\end{aligned}
```

Use action labels beside arithmetic: remove the same variable using pairs (1,2) and (1,3), box the
new 2×2 system, solve it, then climb upward. Follow the first model with faded practice: prescribed
pairs, then only a target variable, then an independent plan. Move the full recoverability proof
behind this practice. Stage complexity as integer solution → fractional answer → fraction
coefficients/preprocessing → contradiction/redundancy and free parameters. Explain that `0=0`
removes one condition but the number of free parameters depends on how many independent conditions
remain. Keep the matrices/Gaussian reference as a later bridge; OpenStax explicitly presents upper
triangular form as the computational goal
([OpenStax College Algebra §7.2](https://openstax.org/books/college-algebra/pages/7-2-systems-of-linear-equations-three-variables)).

### Exercises should become a routed competence path

**Intended outcome.** The cumulative bank should demonstrate equation interpretation, execution,
explanation, repair, method and representation choice, modelling and independent construction. Its
949 lines already offer strong breadth: safe/unsafe transformations, both 2×2 methods, nonlinear
boundaries, special cases, graph interpretation, varied contexts and 3×3 systems
([Exercises, lines 10–722](/Users/leebeydoun/Workspace/leekb/content/maths/linear-equations/exercises.mdx:10)).

**What confuses.** Method-labelled headings make the strategic choice for the learner, support jumps
directly from prompt to full solution, and topic progression substitutes for an action-based
learning progression. Word problems are generally shown as finished translations rather than using
one explicit modelling routine. The page's role relative to each guide's own exercises is not
stated.

**Prioritized improvement and revised outline.** Retain the problem bank but route it through:
**recognise/check → complete → execute → explain → repair → choose → model → construct → mixed
extension**. Give Hint 1 as the obligation, Hint 2 as a structural cue, then the full solution. Add
an unlabelled mixed set containing a substitution-friendly system, an elimination-friendly system, a
graphical classification, a special case and a context. Teach every context through the same
routine: quantities/units → variables → one annotated relationship at a time → enough independent
equations → choose method → solve → interpret → check equations and contextual constraints. Include
tasks that ask only for variables/equations, repair a plausible model, and compare two valid models.
Add construction tasks such as “create dependent equations” and “create a 3×3 system with this
solution.” Keep determinant and parameter proofs visibly marked Extension.

### Test yourself / quiz should diagnose concepts, not certify solving

**Intended outcome.** The quiz should reveal conceptual misconceptions and route the learner to
review. Preserve its explanations, guide links, progress saving and strong distractors about
reversibility, checking and free parameters
([Test yourself, lines 6–11](/Users/leebeydoun/Workspace/leekb/content/maths/linear-equations/test-yourself.mdx:6);
[quiz data](/Users/leebeydoun/Workspace/leekb/public/quizzes/linear-equations.json:1)).

**What confuses.** All 46 items are selected response, topic weight is uneven, random order obscures
instructional progression, and a total score cannot demonstrate sustained transformation,
representation, modelling or checking. Eleven questions concern no/infinite solutions while
substitution and 3×3 systems have five each. Constructed response is necessary when learners must
model, justify, explain or demonstrate procedure
([NAEP 2026 mathematics specifications](https://www.nagb.gov/content/dam/nagb/en/documents/publications/frameworks/mathematics/naep-2026-mathematics-specifications.pdf)).

**Prioritized improvement and revised outline.** Rename or subtitle the page **Concept check:
diagnose what to review**. Offer a short pre-check and topic-grouped post-check if the component
allows it; report topic signals and link each weakness to an exact subsection and matched exercise.
State that a strong score demonstrates recognition, not independent solving. Place it after
structured practice and pair it with a short written check: justify one equation move, solve and
check a 2×2 system with a chosen method, classify one system algebraically and graphically, model
one context, begin a 3×3 reduction, and repair one erroneous solution.

## Planned contrasts should drive every misconception repair

The documented and source-supported difficulties below identify high-probability risks; their
placements and tasks are editorial recommendations for this repository, not measured error rates for
its users.

| Misconception                                            | What is being confused                                | Where to confront it     | Required contrast or task                                              |
| -------------------------------------------------------- | ----------------------------------------------------- | ------------------------ | ---------------------------------------------------------------------- |
| `=` means “now calculate” or “the answer comes next”     | operation signal versus relation between equal values | Equations opening        | read varied forms aloud; include `11=3x+5` and equations on both sides |
| An expression, equation and identity are interchangeable | object, claim and universally true claim              | Equations opening        | four-way classification with solution set                              |
| Finding one working value means solving                  | witness versus complete solution set                  | Equations                | compare one check with proof that no values are missing                |
| Changing symbols is the goal                             | appearance versus invariant solution set              | Every method             | annotate each step with operation and preserved solution meaning       |
| “Move across and change sign” is a rule                  | hidden same-operation transformation                  | Equations                | repair shorthand by writing the operation on both sides                |
| Inverse operations are always reversible                 | division by zero, squaring and domain loss            | Equations boundary       | safe/conditional/unsafe table; identify first invalid line             |
| Cancelling an unknown never changes solutions            | discarded zero case or excluded domain                | Equations                | state restrictions first and compare old/new solution sets             |
| One equation in two unknowns has one answer              | value solution versus family of ordered pairs         | Two unknowns / Lines     | make a table and plot several solution pairs                           |
| Elimination means throw an equation away                 | replacement versus loss of information                | Two unknowns             | retain one equation; recover the discarded original algebraically      |
| Any two combinations are safe                            | duplicate derived equations or zero multiplier        | Two unknowns             | repair “replace both by the same sum” and “multiply by zero”           |
| Substitution means erase the linking equation            | replacing an occurrence versus retaining equivalence  | Substitution             | show old/new systems side by side and keep `y=E`                       |
| Brackets are optional in substitution                    | expression replacement versus term replacement        | Substitution             | compare `3(2x-3)` with `3·2x-3`                                        |
| Method choice is preference only                         | surface habit versus structural efficiency            | Methods / mixed practice | justify from isolated variables, coefficients, fractions and goal      |
| `0=0` is an answer                                       | redundant condition versus solution family            | Special cases            | ask what information remains; parameterise the family                  |
| `0=c` means an arithmetic mistake                        | contradictory conditions versus no solution           | Special cases            | pair algebraic contradiction with parallel distinct lines              |
| Every pair of non-crossing lines is “the same”           | parallel distinct versus coincident                   | Lines                    | compare tables, equations and graphs for both cases                    |
| Slope exists for every line                              | finite rate versus vertical exception                 | Lines                    | contrast horizontal, sloped and vertical lines                         |
| Determinant zero means no solution                       | non-uniqueness versus the none/infinite split         | Determinants             | require elimination after the zero test                                |
| Cramer's formulas are the meaning of a system            | diagnostic/formula versus simultaneous constraints    | Determinant extension    | introduce only after algebra/graph classification                      |
| 3×3 elimination is just more arithmetic                  | structural target versus bookkeeping                  | Three unknowns           | show triangular destination and label every pair choice                |
| Any two equation pairs work in 3×3 elimination           | different removed variables or duplicate information  | Three unknowns           | require same variable, different pairs, independent derived equations  |
| A word problem starts by manipulating numbers            | modelling versus calculation                          | Exercises/modelling      | quantities and units before variables; equations before solving        |
| An algebraically valid answer always fits the context    | equation solution versus contextual feasibility       | Modelling                | check positivity, integrality, totals, capacity and units              |

## Five repeated templates can unify the section

These templates synthesize the best local practices, IES representation/strategy guidance and the
worked-example principle of fading support. They are editorial designs, not a tested intervention
package.

| Content type                | Repeated learning sequence                                                                                                                                                                                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Equation-solving method** | **Meaning of a solution** → **invariant to preserve** → **smallest useful case** → **predict the first move** → **annotated transformation** → **check in the original** → **faded near-transfer** → **unsafe boundary** → **mixed choice**                                     |
| **Worked system**           | **Interpret each equation** → **candidate pair/triple** → **choose method and reason** → **state the target elimination/isolation** → **one action per line** → **retain enough information** → **recover all variables** → **check every original** → **translate the answer** |
| **Algebra/graph bridge**    | **Value table** → **ordered pairs** → **points** → **complete graph as solution set** → **common row/point** → **intersection classification** → **exact algebraic check** → **what each representation reveals**                                                               |
| **Modelling problem**       | **Quantities and units** → **define variables** → **translate one relationship at a time** → **test the model on a simple case** → **choose representation/method** → **solve** → **interpret in a sentence** → **check equations and context**                                 |
| **Staged practice**         | **attempt** → **Hint 1: obligation** → **Hint 2: structural cue** → **partial frame** → **annotated reasoning** → **full solution** → **self-check rubric** → **mixed task with method unnamed**                                                                                |

Every important method should follow **complete model → partial model → independent near-transfer →
mixed choice**. IES recommends comparing correct, incomplete and incorrect solved examples and
asking what was done, why it was valid and whether another route works
([IES algebra practice guide](https://ies.ed.gov/ncee/WWC/Docs/PracticeGuide/WWC_Algebra_PG_Revised_02022018.pdf)).
This also carries the site's revised Basic Proofs frame into algebra: **Given → Want → Bridge** can
become **Current system → target form → reversible transformation**.

## Three phases preserve rigor while fixing the route

| Phase                                 | Changes                                                                                                                                                                                                                | Why now                                                                                    | Completion test                                                                                                                         |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Repair routing and feedback**    | Reframe Introduction; move Lines core before Special Cases; move Exercises before Concept check; add outcomes/readiness gates; distribute immediate checks; add method-choice and modelling routines                   | High impact without changing mathematics; fixes delayed production and hidden dependencies | A learner acts within minutes of each new idea and can state what the next transformation must preserve                                 |
| **2. Re-layer overloaded pages**      | Practical-first/deeper-proof split in Equations, Two unknowns and Substitution; core/extension split in Lines and Special Cases; triangular target and faded examples in Three unknowns                                | These locations create the greatest simultaneous novelty                                   | The core route can be completed without determinant/Cramer/null-direction proofs, but all rigor remains accessible                      |
| **3. Rebuild synthesis and validate** | Route/tag the exercise bank; add two-level hints, mixed method choice, modelling and construction; rebalance diagnostic feedback; add written rubric; render-test graphs/interactives and conduct learner think-alouds | Requires stable guide structure and may need component work                                | Learners demonstrate execution, explanation, repair, representation choice, modelling and independent construction—not only recognition |

The safest first prototype is **Equations and solutions**: the balance model, equivalence language,
examples and boundary cases already exist, so the experiment is about order and feedback rather than
new mathematics. Build one practical sequence—classify → solve → check → repair—then test whether a
learner can explain why each transformation preserves the solution set. The second prototype is the
**Lines core** using one system across a table, graph and algebra; it tests the proposed reorder
before the determinant material is moved. The third is a single **3×3 triangular example** with
faded practice.

The most useful external models are complementary.
[Illustrative Mathematics Algebra 1](https://tasks.illustrativemathematics.org/blueprints/A1)
foregrounds simultaneous truth, method comparison and contextual meaning;
[OpenStax Elementary Algebra](https://openstax.org/books/elementary-algebra/pages/preface) provides
a stable verify → equality properties → strategy → applications sequence;
[OpenStax Intermediate Algebra §4.1](https://openstax.org/books/intermediate-algebra-2e/pages/4-1-solve-systems-of-linear-equations-with-two-variables)
compares graphing, substitution and elimination through structural convenience;
[IES algebra guidance](https://ies.ed.gov/ncee/WWC/Docs/PracticeGuide/WWC_Algebra_PG_Revised_02022018.pdf)
supports linked representations, worked-example analysis and strategy comparison; and
[OpenStax College Algebra §7.2](https://openstax.org/books/college-algebra/pages/7-2-systems-of-linear-equations-three-variables)
makes triangular organisation visible in 3×3 solving. These resources should guide sequence and task
design without replacing the repository's plain-language proofs, exact solution-set focus or
interactive visual strengths.

## Conclusion

Linear-equation solving is not fundamentally a collection of symbol-moving recipes. It is the study
of **changing a representation without changing what counts as a solution**. Making that invariant
visible at every step unifies balance, equivalent equations, elimination, substitution, graphs,
special cases and three-variable systems; the proofs then explain a method the learner already
understands rather than delaying access to it.

The section's most ambitious material should remain, but rigor needs a route. A clear core path can
end with confident 2×2 solving, graphical classification and modelling; determinants, Cramer
formulas, null directions and homogeneous systems can then function as genuine structural insight.
That distinction lets beginners succeed without flattening the mathematics and lets advanced readers
see exactly where elementary algebra becomes linear algebra.
