# Rebuild Numbers around meaning before proof

The Numbers section is mathematically careful, visually rich, and already contains most of the
ingredients of an excellent course, but **its longest guides repeatedly ask one page to teach an
intuitive model, an operating procedure, a formal construction, several proofs, and advanced
applications without a pause for learner production**. The result is not widespread mathematical
error; it is a mismatch between the order in which ideas are justified and the order in which a
novice can absorb them. The strongest internal pattern is now the revised Congruence page: establish
a familiar phenomenon, name it, give a reliable procedure, and only then prove why the procedure
works. That pattern should become section-wide. The core revision is therefore progressive
disclosure rather than simplification: every guide needs a usable first pass, immediate checks, a
clearly marked deeper proof layer, explicit boundary cases, and mixed transfer after fluency. The
operation and number-system spine should remain, while Powers, formal order, rational foundations,
rational expressions, and combinatorics should be visibly separated as second lessons or extensions.
The assessment bank should become a routed progression from recognition through explanation and
repair to independent construction, with the fixed-choice quiz labelled as a diagnostic. The
recommendations below synthesize repository evidence and authoritative teaching resources; proposed
outlines and implementation priorities are editorial recommendations, not results of learner
testing. **No lesson, metadata, exercise, or quiz content was changed during this review.**

## A dependency map should replace thirteen equal destinations

The current order is Introduction → Integers → Addition → Multiplication → Identities → Divisibility
→ Congruence → Rational numbers → Inverses → Irrational numbers → Factorials → Test yourself →
Exercises ([current metadata](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/meta.json:1)).
Its broad dependencies are sound: integers support the operations, divisibility supports congruence
and lowest terms, and rational numbers support inverses and irrationality. Three signals are
misleading, however. The roadmap gives every destination equal weight; Factorials looks like the
next step in the number-system story although it begins a counting/combinatorics branch; and
cumulative assessment appears before cumulative practice.

The recommended architecture keeps familiar URLs where possible while showing a core path and three
branches. Splitting a file is a product decision; “split” below can instead mean a strong internal
reset with **Core route** and **Deeper/extension** labels.

| Phase                   | Recommended unit                                           | Capability unlocked                                                                  | Structural action                                                                                          |
| ----------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Orientation             | Introduction                                               | See the number-system spine, operation spine, and application branches               | Reframe the long summary as a return-later reference                                                       |
| Integer foundation      | Integers → Addition → Multiplication                       | Interpret signed numbers and operate with them                                       | Keep Integers; layer Addition; split or strongly separate Powers from Multiplication                       |
| Algebra application     | Identities                                                 | Recognise and reverse distributive patterns                                          | Keep square patterns core; mark cubes and longer products as extensions                                    |
| Number-theory branch    | Divisibility → Congruence                                  | Translate multiples/remainders and calculate modulo a number                         | Re-layer Divisibility; retain Congruence's new macro-order                                                 |
| Number-system extension | Rational numbers → Inverses/equations → Irrational numbers | Treat fractions as numbers, undo multiplication, and locate the gap in the rationals | Layer Rational Numbers; split Inverses after equation solving if possible; expose Irrational prerequisites |
| Counting extension      | Factorials and counting → Pascal/binomial ideas            | Count ordered and unordered selections and explain coefficients                      | Prefer two guides or a separately labelled Counting branch                                                 |
| Practice and diagnosis  | Structured Exercises → mixed review → Concept check        | Execute, explain, repair, choose, and construct                                      | Put practice before the fixed-choice diagnostic                                                            |

This sequence is consistent with comparison texts that place divisibility before modular arithmetic
and direct operational knowledge before more abstract extensions
([MIT Mathematics for Computer Science, Lectures 8–9](https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/resources/lecture-notes/)).
It also respects a broader evidence-based principle: conceptual understanding, procedural fluency,
strategic competence, and adaptive reasoning develop as intertwined strands rather than a theory
block followed much later by practice
([National Academies, _Adding It Up_, Chapter 4](https://nap.nationalacademies.org/skim.php?chap=115-156&record_id=9822)).

## Five foundation guides need shorter feedback loops

### Introduction should reveal routes, not answers

**Intended outcome.** A learner should understand why the integers, rationals, and irrationals are
introduced; see how the operation guides relate; and know how to study a proof-oriented guide. The
present “each new number system fills a gap” narrative is an excellent organising idea and should
remain
([Introduction, lines 6–28](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/introduction.mdx:6)).

**What confuses.** Twelve destinations are presented as a flat list, then more than 150 lines of
finished definitions and rules appear before their motivating questions
([Introduction, lines 30–205](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/introduction.mdx:30)).
The page also gives no readiness check for variables, implication, or following a derivation, and it
does not explain whether the quiz is a pre-test or final assessment.

**Prioritized improvement and revised outline.** Preserve the gap narrative, then show three visible
routes: **number systems** (counting → integers → rationals → irrationals), **operations and
undoing** (addition → multiplication → inverses), and **applications** (identities,
divisibility/congruence, counting). Add one miniature example of the section's teaching method, a
three-question Basic Proofs readiness check, and a “how to use first pass/deeper pass” panel. Keep
the existing summary, but label it **Reference—return after learning** and place it after the
roadmap.

### Integers needs refinement, not reconstruction

**Intended outcome.** The learner should classify and order integers, understand opposites and the
minus sign, and interpret addition as directed movement. The lift context, continuous number line,
mirror image, interactive walk, explicit natural-number convention, and warning that `-a` need not
be negative form the section's strongest-scoped concrete-to-symbolic sequence
([Integers, lines 6–112](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/integers.mdx:6)).

**What confuses.** “Whole numbers” can momentarily suggest non-negative numbers where “integers” is
intended, and the three jobs of `−` are not yet consolidated: a negative numeral in `-3`, the
opposite operator in `-a`, and the subtraction operation in `a-b`. Research identifies these roles
as persistent sources of negative-number difficulty, supporting explicit contrast rather than the
slogan “two minuses make a plus”
([Bishop et al., BSRLM proceedings](https://bsrlm.org.uk/wp-content/uploads/2017/08/BSRLM-CP-37-2-24.pdf)).
All practice is delayed until the end
([Integers exercises, lines 114–234](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/integers.mdx:114)).

**Prioritized improvement and revised outline.** Keep the existing page and order it as need below
zero → position/order/distance from zero → integer classifications → opposite as reflection →
**three jobs of the minus sign** → directed addition → boundary cases `0`, `-0`, `-(-a)`, and
positive `-a`. Insert a two-question check after opposites and another after the number-line walk;
retain the varied contextual end exercises.

### Addition should expose a practical pass before its axiomatic pass

**Intended outcome.** Learners should calculate and interpret integer sums and differences, use the
additive laws, solve simple additive equations, and understand order through differences. The
number-line comparisons, compact set of laws, proof-plan prose, substitution checks, and
difference-based approach to order are worth preserving
([Addition, lines 13–64 and 220–339](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/addition.mdx:13)).

**What confuses.** The 475-line guide combines structural laws, subtraction/opposites, sign
reasoning, equation rearrangement, and formal order before its first exercise at line 341
([Addition exercises](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/addition.mdx:341)).
After two concrete examples, several arbitrary-letter proofs make formal derivation the only visible
route to fluency. The proof of the order laws is correct but prerequisite-heavy. “Additive
identity,” “additive inverse,” and “inverse operation” also need an explicit comparison with their
multiplicative counterparts, not scattered encounters.

**Prioritized improvement and revised outline.** Build a first pass around movement/combination →
subtraction as adding an opposite → a typed mixed-sign routine based on magnitude and direction →
laws as calculation tools → immediate execution, explanation, and error-repair tasks. Follow with a
**Why these rules fit together** pass: identity/inverse, uniqueness of opposites, double opposite,
opposite of a sum, and rearranging equations. Treat formal order as a final deeper lesson or
separate guide. Use the recurring proof frame **Given → Want → Bridge**, now established in Basic
Proofs, and add a side-by-side addition/multiplication identity map.

### Multiplication is three lessons hiding in one file

**Intended outcome.** Learners should understand multiplication laws and signs, scale inequalities
correctly, and use powers. The DotGrid, area model for distributivity, numerical sign pattern, proof
dependency chain, InequalityScale, and repeated-growth application are high-value assets
([Multiplication, lines 18–93, 189–300](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/multiplication.mdx:18)).

**What confuses.** Integer multiplication, inequality scaling, and exponentiation are distinct
learning arcs packed into 503 lines
([Multiplication, lines 95–367](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/multiplication.mdx:95)).
More than 120 lines separate the first sign idea from its consolidated rule, and `(-2)^4` versus
`-2^4` remains mainly an exercise despite documented persistence of negative-sign errors in
exponential notation
([Cangelosi et al., _Journal of Mathematical Behavior_](https://www.sciencedirect.com/science/article/pii/S0732312312000570)).

**Prioritized improvement and revised outline.** First teach arrays/laws → area/distributivity → one
negative factor → two negative factors → sign table → immediate checks. Then show the rigorous
dependency map: zero product → multiplication by `-1` → moving one minus → moving two. Put
inequality scaling in its own reset/deeper section. Prefer a separate Powers guide; otherwise create
a clearly signposted second lesson covering base/exponent, copy-count laws, zero exponent,
parentheses/negative bases, and growth. Every visual needs an explicit bridge: which part of the
picture corresponds to which symbol and what the picture suggests versus what the algebra proves,
consistent with IES guidance on linked representations
([What Works Clearinghouse](https://ies.ed.gov/ncee/wwc/Docs/PracticeGuide/wwc_mps_pg_vr.pdf)).

### Identities should teach pattern choice before pattern volume

**Intended outcome.** Learners should derive, recognise, expand, factor, and apply common
distributive patterns. Preserve the mental-arithmetic hook, area derivation, forward/backward use,
false sum-of-squares contrast, and numerical checking
([Identities, lines 6–91 and 158–208](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/identities.mdx:6)).

**What confuses.** Seven named identities, three-term expansions, cubes, and long products compete
for recognition before square-pattern fluency is checked. A zero-product exercise also reaches
forward to a later theorem
([Identities, lines 326–338](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/identities.mdx:326)).

**Prioritized improvement and revised outline.** Keep ordinary distributivity first; make square of
a sum, square of a difference, and conjugate/difference of squares the core. Use a recognition
routine: identify the form → name `a,b` → apply the identity → expand to check. After each pattern,
pair one expansion, one factorisation, and one “no special pattern” item. Mark cubes, three-term
squares, and long products as extensions. Move the forward-dependent zero-product task or supply the
required result locally. OpenStax provides a useful model by developing special products from
ordinary multiplication and immediately contrasting which pattern fits
([OpenStax, Special Products](https://openstax.org/books/elementary-algebra-2e/pages/6-4-special-products)).

## Number theory needs one re-layering and one light refinement

### Divisibility should become the clean bridge to remainders

**Intended outcome.** Learners should translate divisibility into an integer witness, reason about
parity, combine multiples, and use division with remainder. The sweets/pairs model, marked number
line, parity proofs, rows-of-seven intuition, quotient table, and definition–unpack–factor proof
pattern are excellent foundations
([Divisibility, lines 6–126 and 236–322](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/divisibility.mdx:6)).

**What confuses.** The page behaves like four joined guides: parity, divisibility proofs, division
with remainder, and gcd. General divisibility appears only after three parity propositions, a
converse uses “every integer is even or odd” before that result is established, and a roughly
70-line existence/uniqueness proof arrives before sustained use of `n=dq+r`
([Divisibility, lines 159–208 and 324–424](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/divisibility.mdx:159)).
One negative-dividend example is not enough for a known conceptual boundary
([Divisibility, lines 396–398](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/divisibility.mdx:396)).
All exercises again wait until after 458 lines.

**Prioritized improvement and revised outline.** Reorder as why exact division matters →
`d|n ⇔ n=dk` with positive/zero/negative examples → parity as divisibility by 2 → parity
calculations → combining multiples using **Given `d|n` → write `n=dk` → factor `d`** → use `n=dq+r`
with several positive and negative cases → deeper existence and uniqueness proof → classify by
remainder → gcd/lowest-terms bridge. This removes the forward dependency and makes confident use of
quotient/remainder precede its foundational proof. Keep gcd, but label it preparation for Rational
Numbers rather than part of the minimum route to Congruence.

### Congruence now needs targeted checks, not another overhaul

**Intended outcome.** Learners should understand congruence as same remainder, distinguish the
relation from the remainder operation, use **reduce → calculate → reduce**, understand the
divisible-difference test, and apply residue patterns. The revised page now succeeds at the
macro-order: weekday/clock/remainder classes → notation → procedure → proof → applications
([Congruence, lines 6–220](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/congruence.mdx:6)).
The distinction between `a mod d` and `a ≡ b (mod d)`, standard remainder and negative
representative, and equality and congruence should be preserved.

**What confuses.** The second “Try the routine” is still another fully solved example, not a genuine
retrieval check
([Congruence, lines 152–163](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/congruence.mdx:152)).
The general arithmetic theorem introduces four changing values at once and proves three operations
before a subtraction example
([Congruence, lines 222–294](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/congruence.mdx:222)).
Mixed `=` and `≡` chains can be read too quickly, and the boundary panel covers cancellation but not
the invalid reduction of exponents. End exercises still supply nearly all unaided practice
([Congruence, lines 537–705](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/congruence.mdx:537)).

**Prioritized improvement and revised outline.** Preserve the existing sequence. Turn “Try” into an
actual pause with hidden solution, add a readiness gate before the equivalence proof, and
demonstrate one-factor replacement separately for addition, subtraction, and multiplication before
compressing them into the general theorem. Split equality computation and modular conclusion across
display lines. Add one safe/unsafe table: bases of positive powers may be replaced; exponents
generally may not; cancellation/division need conditions. Visually mark equivalence, arithmetic,
structural, and induction proofs as **Why this works / deeper pass**, and add one mixed problem that
does not announce reduction, residue-table, or cycle method. MIT's notation and boundary warnings
are a particularly apt formal model
([MIT Lecture 9](https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec09.pdf)).

## The number-system arc should separate concept from construction

### Rational numbers should make “one number, many names” the spine

**Intended outcome.** Learners should treat fractions as numbers, recognise equivalent
representations, reduce, compare and operate, and connect rationals to terminating/repeating
decimals. The sharing context, number line, fraction bars, common-unit explanation of addition, area
interpretation of multiplication, integer embedding, and cancellation-error task are strong
([Rational Numbers, lines 6–123 and 261–450](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/rational-numbers.mdx:6)).
They align with IES recommendations to teach fractions as numbers using number lines and linked
representations
([IES Fractions practice guide](https://ies.ed.gov/ncee/wwc/Docs/PracticeGuide/fractions_pg_093010.pdf)).

**What confuses.** The 718-line page alternates meaning, procedure, formal construction, and proof.
Cross-multiplication is presented as a definition soon after visual equality, risking the impression
that equality means performing a test; cancellation well-definedness arrives before equivalence
fluency; the lowest-form existence proof interrupts the operational route; exact order is proved
before benchmark comparison; and all seven exercises follow the full theory
([Rational Numbers, lines 49–260 and 451–555](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/rational-numbers.mdx:49)).
The decimal characterization also needs a clearer “informal preview versus proved theorem” boundary.

**Prioritized improvement and revised outline.** Organise as fractions are numbers
(sharing/measure/quotient/ratio) → one number, many names (visual coincidence before cross-product
test) → lowest form as a convenient name → magnitude and benchmarks `0, 1/2, 1` →
addition/subtraction as common units → multiplication as “of” → decimals → deeper formal
foundations. Interleave locating/drawing, matching, estimating, explaining, and repairing tasks
after each stage. Put equality well-definedness, lowest-form existence, formal order, and decimal
foundations in a second-pass layer so rigor supports rather than interrupts the number concept.

### Inverses should pay off “undoing” before expanding into algebra

**Intended outcome.** Learners should distinguish additive and multiplicative inverses, understand
reciprocals and the zero exception, interpret fraction division, solve equations, and respect domain
restrictions. Preserve the undoing metaphor, explicit zero exception, “how many halves are in 3?”
question, restriction checks, cancellation warning, and diagnostic applications
([Inverses, lines 6–35, 176–334 and 508–690](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/inverses.mdx:6)).

**What confuses.** The practical thread is interrupted by uniqueness, negative powers, and
zero-product proofs before fraction division. The guide then becomes a broad algebra chapter
containing rational expressions, geometric sums, rates, and mixtures. “Hidden conditions” risks
modelling omission instead of repeatedly stating exclusions
([Inverses, lines 69–175 and 335–451](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/inverses.mdx:69)).
Learners also need a direct contrast between `-a`, `1/a`, and `a-1`.

**Prioritized improvement and revised outline.** Begin with a parallel table: addition / identity
`0` / inverse `-a`; multiplication / identity `1` / inverse `a^{-1}` for nonzero `a`. Continue
reciprocal/zero → sharing and measurement meanings of division → tape or double-number-line model →
derive invert-and-multiply → solve `ax=b` and check. Then reset for domain/cancellation/zero product
→ rational equations/expressions. Mark uniqueness, negative powers, sums of quotients, and geometric
sums as deeper or extension material; preferably split after equation solving. IES specifically
recommends deriving fraction procedures through meaning and representation rather than memorising
“invert and multiply”
([IES computational-procedures guide](https://ies.ed.gov/ncee/wwc/Docs/PracticeGuide/wwc_fr_pg_rec03.pdf)).

### Irrational numbers needs a visible proof-readiness map

**Intended outcome.** Learners should understand that the rationals have a gap and follow or
construct a contradiction proof that no rational squares to 2. The unit-square motivation, decimal
bracketing, proof plan, lowest-form contradiction, “where the proof fails for `√4`” audit, and
transfer exercises are excellent
([Irrational Numbers, lines 6–164](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/irrational-numbers.mdx:6)).

**What confuses.** The plain definition of irrational arrives after the principal proof; the
Pythagorean theorem is used before its later proof without a clear assumption label; and the
argument silently depends on lowest form, fraction powers, parity converse, cancellation, and
contradiction. Approximation, proof that no rational works, and existence of the real number `√2`
are three different claims that need sharper separation. The full `√3` proof repeats rather than
fades the first scaffold
([Irrational Numbers, lines 100–164](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/irrational-numbers.mdx:100)).

**Prioritized improvement and revised outline.** Start with the geometric gap and an early plain
definition, then state the exact theorem: **no fraction of integers squares to 2**. Add a readiness
panel linking lowest form, even-square converse, fraction algebra, and contradiction. Explain the
infinite-simplification idea before a two-column **statement / why allowed** proof. Audit where each
prerequisite is used; keep `√4` as the boundary case; fade prompts for `√3` and require more
independence for `√5` or `√6`. End with a clearly labelled preview distinguishing decimal
characterization from the construction of the real numbers.

### Factorials should be reframed as counting and binomial coefficients

**Intended outcome.** The current guide actually teaches staged counting, arrangements,
combinations, Pascal identities, Pascal's triangle, and the binomial theorem. Preserve the
pizza/coefficient hook, four-object pair listing, “with/without the chosen object” intuition, Pascal
triangle, and bracket-choice proof of the binomial theorem
([Factorials, lines 7–12, 60–103 and 105–282](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/factorials.mdx:7)).

**What confuses.** The multiplication principle underlying every arrangement count is used but never
named. `0!` receives two separated motivations. Pascal's accessible counting story is followed by a
roughly 50-line algebraic verification that can appear to be the real proof. All practice waits
until after factorials, combinations, two identities, Pascal's triangle, and the binomial theorem
([Factorials, lines 14–51 and 105–300](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/factorials.mdx:14)).
Its metadata location after irrationality communicates no dependency.

**Prioritized improvement and revised outline.** Prefer two guides: **Factorials and counting**
(multiplication principle → factorial → `0!` → ordered selections → “does order matter?” →
combinations) and **Pascal and binomial coefficients** (symmetry/Pascal counting proofs → triangle →
bracket-choice theorem → coefficient extraction). If one file remains, make those two units and
their roadmap explicit. Put ordered and unordered versions of the same small problem side by side;
ask “does order matter?” before any formula. Make the combinatorial proof of Pascal's rule primary
and the common-denominator derivation optional. State the binomial theorem for non-negative
exponents, including row 0. Hammack and OpenStax both place the multiplication principle before
factorials and combinations
([Hammack, _Book of Proof_](https://richardhammack.github.io/BookOfProof/);
[OpenStax, Contemporary Mathematics Chapter 7](https://openstax.org/books/contemporary-mathematics/pages/7-key-concepts)).

## Assessment should reveal action, not only recognition

### Exercises should become a route before remaining a random bank

**Intended outcome and strengths.** The 60-problem bank offers broad transfer, contextual work,
counterexamples, proof, and complete solutions. Strong tasks include constructing a rational between
two rationals and independently adapting an irrationality proof
([Exercises, lines 933–1022](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/exercises.mdx:933)).
Random order is valuable mixed retrieval after all topics have been learned.

**What confuses.** The file explicitly says the problems are in no particular order; advanced rate
and geometric-sum problems precede a number-line walk, and there are no topic, prerequisite,
difficulty, or action labels
([Exercises, lines 1–67](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/exercises.mdx:1)).
A learner gets either no help or the complete solution, and the bank does not distinguish
foundational practice from mixed challenge.

**Prioritized improvement and revised outline.** Preserve every worthwhile problem, but add a route
map and filtered/staged views: recognise/represent → execute with estimate → explain → repair first
invalid line → guided construction → independent construction → mixed retrieval. Tag each item by
topic, prerequisite, difficulty, and target action. Give Hint 1 (“what must you find/show?”), Hint 2
(the relevant representation/definition), then the full solution. Keep the current random order
under a separate **Mixed challenge** mode. IES algebra materials similarly recommend related
examples arranged from simple to complex and prompts that focus attention on common structure and
changing steps
([IES Algebra toolkit](https://ies.ed.gov/ncee/rel/algebra-middle-and-high-school/teacher-facilitator-materials)).

### Test yourself should remain a diagnostic, not a mastery claim

**Intended outcome and strengths.** The quiz explicitly checks ideas rather than arithmetic, saves
progress, explains answers, and links to guides
([Test yourself, lines 1–10](/Users/leebeydoun/Workspace/leekb/content/maths/numbers/test-yourself.mdx:1)).
Its 79 fixed-choice items use plausible misconception-based distractors and cover all topics
([quiz data](/Users/leebeydoun/Workspace/leekb/public/quizzes/numbers.json:1)).

**What confuses.** Topic coverage is uneven, every item is selected response, and a total score
cannot show computational fluency, representation, explanation, strategy choice, or proof
construction. Random order also prevents an instructional progression. Selected-response reasoning
can be valuable, but explanation tasks provide evidence of reasoning and communication that options
alone cannot
([NCES assessment-framework comparison](https://ies.ed.gov/international-activities-program-iap/2025/12/working-paper-series-2001)).

**Prioritized improvement and revised outline.** Rename or frame the page as **Concept check /
diagnostic**. Offer topic selection or a short balanced mode if supported; report topic-level
signals rather than unqualified mastery; link each error to an exact subsection and matched
explanation/repair/construction task. Place it after structured practice, or explicitly offer a
pre-test mode. Keep free-response evidence in the exercise path.

## Misconceptions should determine where contrasts appear

The evidence identifies recurring difficulties, while the placements below are editorial
recommendations for this repository. The distinction matters: without learner analytics, these are
high-probability design targets rather than measured error rates for this audience.

| Misconception                                                    | What is being merged or overgeneralised                  | Where to confront it        | Required contrast or task                                        |
| ---------------------------------------------------------------- | -------------------------------------------------------- | --------------------------- | ---------------------------------------------------------------- |
| Every minus sign does the same job                               | negative numeral, opposite, subtraction                  | Integers → Addition         | classify `-3`, `-a`, `a-b`; explain each in words                |
| `(-a)^n` and `-a^n` are the same                                 | negative base and external negation                      | Multiplication/Powers       | compare parenthesised values before power laws                   |
| Identity and inverse are interchangeable                         | neutral element, inverse element, inverse operation      | Addition → Inverses         | side-by-side operation / identity / inverse / undoing table      |
| Division with remainder is ordinary fractional division          | quotient/leftover classification and rational quotient   | Divisibility                | translate `n=dq+r`; require `0≤r<d`; include negative dividends  |
| A fraction is two whole numbers, not one number                  | numerator/denominator parts and a single magnitude       | Rational Numbers            | locate on number line before operating; compare to benchmarks    |
| Equivalent fractions are made equal by a trick                   | same quantity and cross-product test                     | Rational Numbers            | visual coincidence first; cross-multiplication second            |
| Any matching symbols may be cancelled                            | common factor and term within a sum; zero restrictions   | Rational Numbers → Inverses | repair cancellation across addition; state excluded values first |
| Congruent numbers are equal                                      | exact equality and same remainder for fixed modulus      | Congruence                  | compare `=`, `mod`, and `≡`; keep modulus visible                |
| Modular rules apply to exponents and division unchanged          | safe base replacement and unsafe operations              | Congruence                  | safe/unsafe table with counterexamples                           |
| A decimal approximation proves irrationality or existence        | approximation, non-rationality, real-number construction | Irrational Numbers          | state the exact theorem and what it does not prove               |
| `n!` distributes or is “multiply by `!`”                         | factorial as a function/compressed product               | Factorials                  | expand small values; disprove `(a+b)!=a!+b!`                     |
| A formula should be chosen before deciding whether order matters | permutations and combinations                            | Factorials                  | solve the same small selection ordered and unordered             |
| A proof is readable because every algebra line is correct        | local calculation and global proof obligation            | Every proposition           | Given → Want → Bridge, final translation, proof audit            |

## Four repeated templates can unify the rewrite

These templates are editorial syntheses of the strongest local pages, explicit-instruction guidance,
linked-representation guidance, and worked-example research. The exact package has not been
experimentally tested on this site.

| Content type                      | Repeated sequence                                                                                                                                                                                                                                                             |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Operation guide**               | **Need/context** → **representation explicitly linked to symbols** → **plain-language invariant** → **usable routine** → **annotated example with estimate/check** → **immediate near transfer** → **why it works/deeper proof** → **boundary error** → **mixed application** |
| **Structural law or proposition** | **What this lets you do** → **small example and non-example** → **formal statement with conditions** → **proof obligation** → **Given / Want / Bridge** → **one justified move per line** → **translate the final line** → **boundary** → **faded check**                     |
| **Worked proof**                  | **Read the claim:** domain/quantifier/shape → **Given** → **Want** → **plan and reason for method** → **annotated discovery version** → **polished proof** → **audit prerequisites, cases, restrictions, and final target** → **near-transfer construction**                  |
| **Practice**                      | **attempt** → **Hint 1: obligation** → **Hint 2: definition/representation** → **partial frame** → **annotated reasoning** → **full solution** → **self-check rubric** → **mixed problem where method is unnamed**                                                            |

Worked examples support initial acquisition when they make solution steps available for study, but
support should fade into learner completion and problem solving rather than remain permanent
([Barbieri et al., 2023 meta-analysis](https://www.danamillercotto.com/uploads/4/7/7/2/47725475/barbieri_et_al__2023__we_meta-analysis.pdf)).
The section should therefore use the same progression inside every major skill: complete model →
partial model → independent near transfer → mixed choice.

## Three phases protect the strongest existing material

| Phase                                 | Changes                                                                                                                                                                                                                                       | Why first                                                                                 | Completion test                                                                                                                         |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Repair routing and feedback**    | Reframe Introduction; label core/deeper/extension routes; move Exercises before Concept check; add outcomes/readiness checks; distribute existing short exercises; add identity/inverse and symbol-role panels                                | High impact with low mathematical risk; fixes delayed practice and invisible dependencies | Every new idea receives learner production within a few minutes, and every guide says what prior skill it assumes                       |
| **2. Re-layer overloaded guides**     | Create first/deeper passes in Addition, Multiplication, Divisibility, Rational Numbers, and Inverses; isolate Powers/formal Order/rational foundations/rational expressions; refine Congruence locally; expose Irrational proof prerequisites | These pages create most simultaneous novelty                                              | A learner can complete the core route without traversing every foundational proof or extension, while all rigor remains accessible      |
| **3. Rebuild synthesis and validate** | Split/reframe Factorials; route/tag the 60 exercises; add hint layers and topic feedback; add mixed method-choice tasks; conduct rendered mobile/accessibility review and learner think-aloud tests                                           | Requires stable guide structure and may require component work                            | Learners demonstrate representation, execution, explanation, repair, strategy choice, and independent construction—not only recognition |

The safest prototypes are **Addition's first practical pass** and **Rational Numbers' “one number,
many names” opening**: both already contain the necessary representations and examples, so the
prototype tests ordering and feedback rather than new mathematics. Divisibility is the next
high-value dependency repair. Congruence should not be the first prototype because its recent
rewrite has already fixed the largest structural fault; use it as a model and refine it after
upstream remainder instruction is stable.

The most useful external models are complementary rather than interchangeable.
[NRICH's positive/negative work](https://nrich.maths.org/articles/making-sense-positives-and-negatives)
models learner exploration across representations;
[OpenStax Prealgebra](https://openstax.org/books/prealgebra-2e/pages/3-4-multiply-and-divide-integers)
gives a repeatable objective → example → immediate practice rhythm;
[IES visual-representation guidance](https://ies.ed.gov/ncee/wwc/Docs/PracticeGuide/wwc_mps_pg_vr.pdf)
stresses explicit bridges from models to symbols; the
[IES fractions guide](https://ies.ed.gov/ncee/wwc/Docs/PracticeGuide/fractions_pg_093010.pdf) treats
fractions as numbers and connects operations to units and models;
[MIT Mathematics for Computer Science](https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/resources/lecture-notes/)
supplies a rigorous divisibility-to-modular-arithmetic second pass;
[Hammack's _Book of Proof_](https://richardhammack.github.io/BookOfProof/Main.pdf) models proof and
counting dependencies; and
[Virginia Tech's proof text](https://intranet.math.vt.edu/people/day/ProofsBook/IPaMV.pdf) is a
useful model for exposing proof ideas and reader objections. These sources should guide sequence and
task design without replacing the repository's unusually clear plain-language voice, visual
components, or proof-oriented identity.

## Conclusion

The Numbers section does not need less mathematics. It needs each kind of mathematics to arrive at
the moment it answers a learner's question: a representation before a rule, a usable routine before
its general proof, a boundary before overgeneralisation, and a construction task before a mastery
claim. This preserves the site's distinctive rigor while making rigor feel like an explanation of
successful reasoning rather than an entrance requirement.

The deepest design opportunity is consistency. If every page repeats the same learning
contract—**see it, say it, use it, check it, justify it, test its boundary, transfer it**—the
section's many current strengths stop competing for attention and begin reinforcing one another. The
resulting curriculum would not merely make individual pages shorter or friendlier; it would teach
the learner how to learn the next mathematical structure.
