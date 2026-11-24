# Rebuild basic proofs around learner actions

The Basic Proofs section is mathematically careful and contains unusually strong examples, but it
currently asks a beginner to absorb too many distinctions before practising any one of them. Its
central teaching asset is already present: **Given → Want → Bridge** turns proof construction into a
repeatable activity rather than a mysterious performance. The redesign should make that routine the
spine of the section, teach logical language just before it is needed, and separate four abilities
that the current sequence sometimes treats as one: reading a claim, comprehending a proof,
validating an argument, and constructing a proof. Research supports that separation: recent
assessment work found proof construction distinct from proof comprehension and validation, while
transition-to-proof research repeatedly identifies language, definitions, proof beginnings,
examples, and theorem structure as learner obstacles
([Sommerhoff et al.](https://link.springer.com/article/10.1007/s10763-025-10621-3);
[MAA, _Transitions to Proof_](https://maa.org/wp-content/uploads/2024/06/Transitions-to-Proof.pdf)).
Most existing examples should remain; the high-impact work is to reorder them, add immediate checks,
reveal the planning behind finished proofs, and fade support toward independent writing. The
multiple-choice quiz should be presented as a concept diagnostic, not evidence that a learner can
prove anything. **No Basic Proofs lesson, quiz, metadata, or exercise content was changed during
this review; this document contains findings and recommendations only.**

## The current order hides the dependency chain

The current path is Introduction → Statements → What a proof is → Implications → Induction → Sets →
Notation → Test yourself → Exercises
([current metadata](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/meta.json:1)). It
is broadly coherent, especially in placing Implications before Induction, but three dependencies
work against the learner. Variable roles and scope are taught late in Notation even though proofs
already rely on arbitrary variables and witnesses; elementary set/domain language arrives after
Statements and Induction even though it would clarify both; and the final concept quiz appears
before the comprehensive practice bank. Authoritative texts vary on whether sets or logic comes
first, but they agree more strongly on the dependency principle: language and definitions precede
the relevant proof form, direct implication proofs precede contrapositive and contradiction, and
induction comes after ordinary direct proof
([Hammack, _Book of Proof_](https://richardhammack.github.io/BookOfProof/Main.pdf);
[Sundstrom, _Mathematical Reasoning: Writing and Proof_](https://scholarworks.gvsu.edu/books/9/);
[MIT Mathematics for Computer Science](https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/download/)).

The recommended order is therefore a dependency path rather than a list of topics:

| Phase | Recommended guide or unit                                 | Learner action unlocked                                                         | Reason for placement                                                              |
| ----- | --------------------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| 1     | Introduction: why proof?                                  | Distinguish evidence from certainty                                             | Creates the intellectual need before terminology                                  |
| 2     | Statements and essential set/domain language              | Identify domain, quantifier, property, and negation                             | A learner cannot prove a claim they cannot parse                                  |
| 3     | Essential notation and variable roles                     | Distinguish arbitrary variables, witnesses, unknowns, and indices               | Prevents later proofs from silently changing what letters mean                    |
| 4     | Implications                                              | Identify hypothesis and conclusion; form converse, contrapositive, and negation | Supplies the logical shape used by most early proofs                              |
| 5     | What a proof is: direct proof first                       | Build a justified chain with Given → Want → Bridge                              | Establishes the default construction method                                       |
| 6     | Counterexamples, cases, contrapositive, and contradiction | Select a method based on claim shape                                            | Adds alternatives after direct proof is secure                                    |
| 7     | Proof-oriented sets                                       | Prove inclusion and equality; connect “and/or” to intersection/union            | Applies implication and two-direction reasoning in a new setting                  |
| 8     | Induction                                                 | Prove an indexed implication from one case to the next                          | Depends on quantifiers, direct proof, and implication semantics                   |
| 9     | Summation notation just in time for indexed proofs        | Expand, compress, and manipulate finite sums                                    | Keeps sigma notation close to its use rather than as a late inventory             |
| 10    | Mixed Exercises, then Test yourself                       | Construct, repair, choose, and finally retrieve concepts                        | Practice should prepare assessment; recognition should not substitute for writing |

This does not require nine new pages. A low-disruption implementation can keep the current
filenames, move Exercises before Test yourself, pull letter roles and essential domain notation
forward, and use clear “first pass” and “deeper proof” layers within longer pages. The more
ambitious implementation would split foundational set language from set proofs and split direct
proof from the later proof methods.

## Each guide has a specific teaching repair

### Introduction should promise a journey, not display the destination

**Intended outcome.** The learner should understand why checking examples is not proof and see the
chapter as a progression from reading a claim to writing a checkable argument. The odd-plus-odd
opening already makes the evidence/proof distinction efficiently and should remain
([Introduction, lines 6–15](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/introduction.mdx:6)).

**Why it becomes confusing.** After eleven lines of orientation, the summary exposes the learner to
quantifiers, equivalence, converse, contrapositive, biconditionals, sets, summation, contradiction,
and induction before those ideas have meaning. Hiding this in an accordion reduces visual pressure
but not conceptual pressure once opened
([Introduction, lines 36–98](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/introduction.mdx:36)).
The roadmap also presents guides as equally independent destinations rather than a dependency chain,
and the Converse and Contrapositive entries appear to share the same target link
([Introduction, lines 48–52](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/introduction.mdx:48)).

**Prioritized improvement.** Preserve the opening, replace the early definition wall with four
observable learner actions—**read a claim → identify its shape → choose a method → write and audit
an argument**—and move the large summary to the end as a reference sheet. Label core material and
extensions, show prerequisites, and give one short diagnostic in which a plausible pattern fails
after several successful examples. This recommendation is editorial, supported by research that
learners develop an intellectual need for proof more effectively when they experience the limitation
of empirical evidence rather than merely being told that examples are insufficient
([Stylianides & Stylianides](https://eric.ed.gov/?id=EJ838948)).

| Revised outline            | Purpose                                                     |
| -------------------------- | ----------------------------------------------------------- |
| A convincing pattern       | Let examples create evidence                                |
| The example that breaks it | Create the need for proof                                   |
| What a proof guarantees    | Define certainty and audience                               |
| The four learner actions   | Preview the section as capabilities                         |
| How to use the guides      | Show core path, stopping points, and extensions             |
| Reference summary          | Keep the current table, but make it a return-later resource |

### Statements should teach one fixed meaning before symbolic compression

**Intended outcome.** A learner should be able to turn an ambiguous sentence into a claim with a
fixed domain, quantifier, and property; decide whether a sentence is a statement; and negate it
precisely. The ambiguous “square of a number” opening, the domain comparisons, full-sentence
example, equality/equivalence distinction, and distinct-variable warning all expose real ambiguities
and are worth preserving
([Statements, lines 8–14](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/statements.mdx:8);
[Statements, lines 101–209](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/statements.mdx:101)).

**Why it becomes confusing.** The guide introduces `P(x)`, `∀`, `∃`, three verbal quantifiers,
negation, domains, mathematical prose, equivalence, and variable conventions in one long pass before
any exercise
([Statements, lines 61–209](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/statements.mdx:61)).
Formal equivalence arrives before the dedicated implications guide even though proving “exactly
when” requires two implications
([Statements, lines 147–166](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/statements.mdx:147)).
The `x²=9` prose example should also name its domain explicitly after teaching that domains change
truth
([Statements, lines 101–134](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/statements.mdx:101)).

**Prioritized improvement.** Teach words before symbols. Start with complete verbal claims, identify
**domain / quantifier / property**, and practise “every,” “some,” and “none” in finite, inspectable
domains. Introduce `P(x)`, `∀`, and `∃` only after the verbal meanings are secure. Teach negation as
a change in what evidence would settle the statement: “not every” means “there is at least one that
does not,” not “none.” Move formal equivalence after Implications, or leave only an informal preview
here. Interleave one or two checks after each distinction rather than placing all seven exercise
sets after the entire exposition
([Statements exercises, lines 211–386](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/statements.mdx:211)).

| Revised outline                                | Learner product                                      |
| ---------------------------------------------- | ---------------------------------------------------- |
| Ambiguity and fixed meaning                    | Rewrite a vague sentence precisely                   |
| Statement versus open sentence                 | Classify complete and incomplete claims              |
| Domain, quantifier, property                   | Annotate the three parts of a claim                  |
| Every, some, none                              | Translate between words and finite examples          |
| Negation                                       | State exactly what would refute a claim              |
| Optional symbolic shorthand                    | Translate words ↔ `P(x)`, `∀`, `∃`                   |
| Mathematical sentences and variable boundaries | Write complete prose and avoid silent domain changes |

### Notation should separate letter roles from sigma techniques

**Intended outcome.** The learner should decode notation into ordinary language and arithmetic, then
compress ordinary patterns back into notation. The score-list motivation, the warning that `x₂` is a
label rather than `2x`, and the reminder that differently indexed terms can still be equal are
strong and should remain
([Notation, lines 7–28](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/notation.mdx:7)).

**Why it becomes confusing.** The page combines subscripts, sequences, sigma notation, sum laws,
proofs of those laws, variable conventions, scope, and telescoping. The four parts of a
summation—index, start, end, and summand—are not isolated visually before they are used together
([Notation, lines 56–80](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/notation.mdx:56)).
The subtle claim that an index has no meaning outside the sum appears separately from the later rule
that introduced letters retain meaning, leaving bound and free variables insufficiently contrasted
([Notation, lines 69–80 and 147–173](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/notation.mdx:69)).
Formal sum laws then follow introductory decoding quickly, and the final telescoping task combines
too many new moves at once
([Notation, lines 99–145 and 299–320](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/notation.mdx:99)).

**Prioritized improvement.** Pull variable roles forward into the proof-language phase: arbitrary
object, unknown, existential witness, and bound index. Then retain Notation as the sequence-and-sum
guide. Diagram the anatomy of `Σ`; count its terms; expand every general law with three terms before
stating it; alternate expand/compress exercises; and show that renaming a bound index changes no
value. Move telescoping to an extension block after one fully worked cancellation example. Keep the
existing misconception exercises on subscripts, repeated constants, reused witnesses, and brackets
([Notation exercises, lines 179–197 and 242–295](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/notation.mdx:179)).

| Revised outline            | Learner product                                       |
| -------------------------- | ----------------------------------------------------- |
| Roles and scope of letters | Label arbitrary variable, witness, unknown, and index |
| Subscripts                 | Distinguish `x₂`, `2x`, and `x²`                      |
| Sequences                  | Expand a rule and reconstruct a rule from terms       |
| Anatomy of `Σ`             | Point to index, bounds, and summand                   |
| Expand and compress        | Translate both directions repeatedly                  |
| Bound-index renaming       | Explain why `i` and `j` can name the same sum         |
| Sum laws from three terms  | See the pattern before the general theorem            |
| Telescoping extension      | Study cancellation only after routine sums are fluent |

### Implications should stabilise the promise before transforming it

**Intended outcome.** A learner should know exactly when an if–then statement fails, distinguish the
converse from the contrapositive, use contraposition as a proof strategy, and prove an “if and only
if” statement in two directions. The rain example, broken-promise model, multiple-of-four
example/counterexample, awkward direct proof, and labelled two-direction proof form a strong
concrete-to-formal arc
([Implications, lines 6–24, 40–56, 85–106, and 135–169](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/implications.mdx:6)).

**Why it becomes confusing.** In one 327-line guide, the learner meets implication semantics,
converse, contrapositive, an abstract equivalence proof, proof by contrapositive, “if” versus “only
if,” and biconditionals before any short in-place practice. The proof that a conditional agrees with
its contrapositive moves rapidly into nested negation and “the contrapositive of the
contrapositive,” demanding metareasoning before the basic transformation is fluent
([Implications, lines 58–81](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/implications.mdx:58)).
Four English constructions involving “only if” then arrive together after that demanding proof
([Implications, lines 112–133](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/implications.mdx:112)).

**Prioritized improvement.** Keep the promise model visible and add a four-situation table in
ordinary language before naming truth values. Use one permanent diagram: original `P → Q`; converse
`Q → P`; contrapositive `not Q → not P`. Track “swap” and “negate” separately. Explain the
original/contrapositive equivalence first through their shared bad case; retain the abstract proof
as a deeper layer. Make “only if” a compact translation panel. After each transformation, ask two
low-stakes questions before proceeding. The final exercises already progress well from
promise-breaking through translation, construction, biconditional proof, and half-proof diagnosis;
distribute some of them through the guide
([Implications exercises, lines 171–325](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/implications.mdx:171)).

| Revised outline                     | Learner product                                      |
| ----------------------------------- | ---------------------------------------------------- |
| A conditional as a promise          | Identify the single breaking situation               |
| Four `P/Q` situations               | Decide which cases support or refute the claim       |
| Original and converse               | Reverse direction and test it independently          |
| Contrapositive                      | Swap, negate, and explain the shared bad case        |
| Contrapositive proof routine        | Identify `P/Q` → negate → translate → prove → return |
| “If,” “only if,” and “exactly when” | Translate language without proving yet               |
| Biconditional proof                 | Label and prove both directions separately           |

### What a proof is should make direct construction the core skill

**Intended outcome.** The learner should understand a proof as a justified argument for every
permitted case and be able to construct a simple direct proof. The page's **Claim / Given / Want /
Bridge** examples are the clearest operational teaching in the section and should become the shared
scaffold across all guides
([Proofs, lines 70–116](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/proofs.mdx:70)).
The counterexample discussion and missing-case exercise are also excellent because they distinguish
a false claim from a flawed proof
([Proofs, lines 118–154 and 393–406](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/proofs.mdx:118)).

**Why it becomes confusing.** Direct proof, counterexample, contradiction, and cases occupy one
412-line page, so the learner can finish four proof methods before attempting one
([Proofs, lines 70–262](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/proofs.mdx:70)).
Both direct examples are divisibility arguments, making it unclear how the scaffold transfers to
equality, inequality, or existence. The discussion of letters compresses an arbitrary value and an
existential witness into one passage even though they have different logical roles
([Proofs, lines 51–61](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/proofs.mdx:51)).
“Nothing else is allowed” usefully stresses justification, but risks making proof feel like citation
bookkeeping rather than reasoned connection
([Proofs, lines 22–38](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/proofs.mdx:22)).

**Prioritized improvement.** Make direct proof a complete first learning cycle: read the claim,
label domain/quantifier/given/target, unpack definitions, sketch first and last lines, fill the
bridge, and audit the result. Follow one annotated example with a partially completed near-transfer
problem immediately. Add one non-divisibility example. Move contradiction after Implications and
formal negation; keep cases and counterexamples as separate, visible strategies. In contradiction
examples, label both the exact assumed negation and the exact impossible pair. Research on worked
examples supports fully worked models followed by partial models and faded guidance, while
proof-comprehension research supports prompts about both local justifications and the global
strategy
([EEF worked examples](https://educationendowmentfoundation.org.uk/news/supporting-pupils-with-worked-examples/p2);
[Hodds, Alcock & Inglis](https://mjinglis.github.io/files/JRME_SelfExpl_Paper.pdf)).

| Revised outline                  | Learner product                                                        |
| -------------------------------- | ---------------------------------------------------------------------- |
| Evidence, explanation, and proof | Distinguish their logical reach                                        |
| Read the claim                   | Label domain, quantifier, given, and target                            |
| Given → Want → Bridge            | Build a direct proof in visible stages                                 |
| Faded direct-proof practice      | Fill reasons, then steps, then plan independently                      |
| Counterexample                   | Refute a universal claim with the right object                         |
| Choose a method                  | Match claim structure to direct, cases, or indirect proof              |
| Cases                            | Show that the list covers every possibility                            |
| Contradiction                    | Negate precisely and identify the contradiction                        |
| Audit a proof                    | Find missing cases, circularity, unjustified steps, and witness errors |

### Sets should be visited twice: language first, proofs later

**Intended outcome.** The learner should read and write membership, distinguish elements from
subsets, and prove inclusion and set equality. The guest-list model, set-builder notation as a
membership test, domain comparison, `2` versus `{2}`, and solution-set interpretation of double
inclusion are particularly effective
([Sets, lines 7–69, 121–124, and 169–216](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/sets.mdx:7)).

**Why it becomes confusing.** The guide combines foundational language that would help Statements
with later applications of contradiction, implication, vacuous truth, and biconditional reasoning.
The empty-set proof introduces contradiction while the learner is still processing the surprising
distinction between `∅` and `{0}`
([Sets, lines 126–167](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/sets.mdx:126)).
Union and intersection arrive without a visual or membership table explicitly linking `∩` to “and”
and `∪` to inclusive “or”
([Sets, lines 218–240](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/sets.mdx:218)).
The bag analogy can also become misleading once sets themselves are elements because physical
containment does not encode element-versus-subset cleanly.

**Prioritized improvement.** Create an early “sets as language” layer containing membership,
roster/set-builder form, domain, empty set, and element versus subset. Return after proof methods
for inclusion, non-inclusion, double inclusion, vacuous truth, union, and intersection. Use a
two-column symbolic statement/membership-test translation throughout: `A⊆B` means “if `x∈A`, then
`x∈B`”; `A=B` means both directions. Add a membership truth table or Venn diagram for
union/intersection while stating that a diagram illustrates rather than proves a general identity.
Keep the existing exercises that diagnose `{2}∈A` versus `{2}⊆A`
([Sets exercises, lines 242–422](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/sets.mdx:242)).

| Early language visit         | Later proof visit                               |
| ---------------------------- | ----------------------------------------------- |
| Membership and roster form   | Inclusion as a direct implication proof         |
| Set-builder form and domains | Non-inclusion by counterexample                 |
| Empty set versus `{0}`       | Empty subset and vacuous truth                  |
| Element versus subset        | Equality by double inclusion                    |
| Number systems as reference  | Union/intersection as “or/and” membership tests |

### Induction needs earlier structure and faster fading, not a conceptual rewrite

**Intended outcome.** The learner should recognise when a theorem forms a chain of indexed claims,
prove a base case, and prove the implication from one arbitrary case to the next. This is the
strongest existing guide. The domino analogy explains why both parts are necessary; the “assuming
`P(k)` is cheating” section directly addresses the central circularity misconception; “Know / Want”
makes the inductive step operational; and the sum and divisibility examples show genuine strategy
([Induction, lines 6–70 and 72–160](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/induction.mdx:6)).
These should remain.

**Why it becomes confusing.** The concise four-step writing template appears only after three
substantial examples and a long delayed-start inequality proof
([Induction, lines 162–272](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/induction.mdx:162)).
That inequality requires secondary estimation, so difficulty with algebra can masquerade as
difficulty with induction. The reader can also consume more than 200 lines of worked material
without producing even a `P(k+1)` statement
([Induction, lines 72–274](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/induction.mdx:72)).

**Prioritized improvement.** Move the four-step template immediately after the first slow example
and reuse it visibly. Mark the inductive step with three points: the expression for `P(k+1)`, the
exact line where `P(k)` is used, and the target form. Fade support intentionally across examples.
Teach delayed starting with an easier example first and move `2^n>n²` to an advanced block. Add an
early broken-chain comparison: valid step with no base; valid base with broken step. MIT likewise
emphasises a clearly stated predicate and separates definition of `P(n)`, base case, universally
quantified step, and conclusion
([MIT MCS, §5.1.3](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/mit6_042js15_textbook.pdf)).

| Revised outline                      | Learner product                                                |
| ------------------------------------ | -------------------------------------------------------------- |
| Infinite claims and the domino model | Explain why both obligations are necessary                     |
| Why the hypothesis is not circular   | State the conditional nature of the step                       |
| First slow example                   | Label `P(n)`, base, Know, Want, hypothesis use, conclusion     |
| Four-step template                   | Use a stable checklist immediately                             |
| Faded second and third examples      | Supply progressively more of the proof                         |
| Broken induction                     | Diagnose missing base, missing hypothesis use, or invalid step |
| Delayed start                        | Choose and verify the correct first index                      |
| Advanced algebraic induction         | Separate method mastery from manipulation challenge            |

### Exercises should become a practice route rather than an archive

**Intended outcome.** The exercise bank should take a learner from recognition through guided
construction to independent method choice. Its 781 lines already contain excellent breadth, detailed
solutions, counterexample search, proof repair, failed directions, and missing-case diagnosis
([Exercises, lines 11–370](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/exercises.mdx:11)).
Induction, sets, and notation also progress from foundational tasks toward proofs, although some
induction problems demand enough inequality algebra to confound what is being assessed
([Exercises, lines 372–781](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/exercises.mdx:372)).

**Why it becomes confusing.** The page duplicates topic-level exercise accordions without explaining
whether it is review, extra practice, or the canonical pathway. It supplies complete solutions but
no hint layers, difficulty map, prerequisite map, or proof-completeness rubric. Topic headings
reveal the intended method, so the learner receives little mixed practice in choosing a strategy.
Its current position after Test yourself also turns practice into an epilogue rather than
preparation
([metadata, lines 10–12](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/meta.json:10)).

**Prioritized improvement.** Divide practice into three passes: foundational fluency, guided proof
construction/repair, and mixed independent problems. Add a map naming topic, prerequisite,
difficulty, and target action—translate, explain, complete, repair, construct, or choose. Give two
hints before the full solution: first the proof obligation, then a relevant definition or method.
Label algebra-heavy extensions. Either keep only short checks in guides and make this the canonical
synthesis bank, or remove duplication from this page and link to the guide exercises; do not
maintain two unexplained versions.

| Practice stage          | Typical task                                                          | Feedback                                               |
| ----------------------- | --------------------------------------------------------------------- | ------------------------------------------------------ |
| Recognise and translate | Mark domain, quantifier, hypothesis, target                           | Immediate explanation                                  |
| Explain                 | Justify one line or summarise a proof's plan                          | Local reason plus global strategy                      |
| Complete                | Fill a missing reason or final step                                   | Hint to obligation, then hint to definition            |
| Repair                  | Diagnose circularity, converse error, missing case, or witness misuse | Name error and show minimal repair                     |
| Construct               | Write a near-transfer proof from a frame                              | Checklist/rubric before model proof                    |
| Choose                  | Select a method in mixed practice                                     | Explain why the method fits, not only whether it works |

### Test yourself should diagnose concepts, not certify proof writing

**Intended outcome.** The quiz is well designed as retrieval practice: it says it tests ideas, saves
progress, explains answers, links back to guides, and uses misconception-based distractors
([Test yourself, lines 6–10](/Users/leebeydoun/Workspace/leekb/content/maths/basic-proofs/test-yourself.mdx:6)).
Its 42 items cover the six topics, with most questions at one- to three-star difficulty, and
distractors target converse/contrapositive confusion, induction circularity, element/subset
confusion, and proof-by-examples
([quiz data](/Users/leebeydoun/Workspace/leekb/public/quizzes/basic-proofs.json:1)).

**Why it becomes confusing.** All items are fixed-option recognition tasks. Even the hardest
questions ask learners to select an analysis rather than generate, complete, or repair an argument.
Random order prevents an instructional progression, and its title/position can imply that a strong
score demonstrates proof competence when it demonstrates conceptual recognition.

**Prioritized improvement.** Rename or frame it as “Concept check” or “Diagnostic quiz.” Offer a
short balanced mode and topic/difficulty filters if the component supports them. After an error,
link to an exact subsection and matched exercise; after completion, recommend a practice route by
weak topic. Keep proof-writing assessment in free-response exercises, including at least one
translation, Given/Want identification, missing-line completion, and short construction per topic.
This distinction is evidence-backed: proof construction and comprehension/validation do not collapse
into one measured skill
([Sommerhoff et al.](https://link.springer.com/article/10.1007/s10763-025-10621-3)).

## Misconceptions should drive the examples and feedback

The table below distinguishes documented or source-supported learner difficulties from editorial
placements recommended for this repository. The placements are design recommendations, not
experimentally tested interventions for this particular audience.

| Misconception                                             | What the learner is doing                                    | Where to confront it            | Recommended contrast or task                                                                                                                                       |
| --------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Many examples prove a universal statement                 | Confuses evidence with logical coverage                      | Introduction; Proofs; Exercises | A long successful pattern followed by one counterexample; label what examples can and cannot establish                                                             |
| A different letter means a different number               | Treats notation as naming distinct objects automatically     | Statements; Notation            | Compare `x+y` with cases where `x=y`; distinguish role from value                                                                                                  |
| “Not every” means “none”                                  | Negates vocabulary rather than truth conditions              | Statements                      | Finite-domain sorting: one failure is enough to negate “every”                                                                                                     |
| A conditional implies its converse                        | Reads “if” as a two-way causal link                          | Implications                    | Original/converse pair with one counterexample to the converse                                                                                                     |
| The negation of `P→Q` is `P→not Q`                        | Changes the conclusion but not the whole claim               | Statements; Implications        | Use the promise-breaking case: `P` true **and** `Q` false ([Virginia Tech Proofs Project](https://math.vt.edu/proofs-project/Instructional_Modules/Module_3.html)) |
| A proof is a sequence of algebra lines                    | Ignores warrants, scope, and overall plan                    | What a proof is                 | Annotate every line's role, then ask for a one-sentence strategy summary                                                                                           |
| Assuming `P(k)` in induction assumes the theorem          | Misses that the step proves an implication for arbitrary `k` | Induction                       | Separate “temporary assumption” from “all cases true”; use broken chains                                                                                           |
| If the base and several cases work, induction is complete | Treats checked cases as the chain                            | Induction                       | Compare missing-base and missing-step arguments                                                                                                                    |
| `x∈A` and `{x}⊆A` are interchangeable in every context    | Blurs element and set levels                                 | Sets                            | Membership checklist with nested sets, not only a bag picture                                                                                                      |
| `∅` and `{0}` are both “nothing”                          | Confuses no elements with one element whose value is zero    | Sets                            | Count members explicitly and ask which object could be a subset counterexample                                                                                     |
| A finished proof reveals how it was invented              | Mistakes polished exposition for construction process        | All proof guides                | Show discovery/annotated and polished versions side by side                                                                                                        |

Examples and counterexamples have a dual role: learners often misuse them as proof, yet examples can
expose definitions, support conjecturing, and reveal a proof's central idea. The correct editorial
response is not to remove examples but to label their logical role every time: one example can
establish existence; one counterexample can refute a universal statement; examples can suggest but
do not prove a universal claim
([Buchbinder & Zaslavsky](https://www.sciencedirect.com/science/article/pii/S0732312318300130);
[Antonini on counterexamples](https://www.sfu.ca/~zazkis/publications/counterexample.pdf)).

## One repeated template can unify every guide

The chapter should reuse a small number of stable page patterns. These are editorial syntheses from
explicit instruction, worked-example fading, proof-comprehension research, and the strongest
structures already present in the repository; the exact templates have not been experimentally
tested as a package.

| Content type    | Repeated teaching sequence                                                                                                                                                                                                                                             |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Definition      | **Need:** what ambiguity or problem requires the term? → **Plain language:** one sentence → **Examples/non-examples:** a paired contrast → **Formal form:** notation and domain → **Boundary:** what it does not mean → **Check:** classify or create one instance     |
| Logical concept | **Situation:** concrete promise or finite domain → **Meaning:** what would make it fail? → **Translation:** words and symbols side by side → **Transformation:** one change at a time → **Misconception:** tempting wrong form → **Check:** explain rather than select |
| Worked proof    | **Question** → **Read the claim:** domain, quantifier, shape → **Given** → **Want** → **Plan:** method and reason → **Bridge:** one justified move per line → **Translate back** → **Audit:** domain, variable roles, cases, warrants → **Near-transfer problem**      |
| Proof exercise  | **Attempt without help** → **Hint 1:** state the proof obligation → **Hint 2:** name a definition or method → **Frame:** first/last lines if needed → **Model reasoning:** annotated construction → **Polished proof** → **Self-check rubric**                         |

For important proofs, show both an annotated discovery version and a clean final version. The
learner needs to see that scratch work can proceed from both ends: unpack the given forward, unpack
the target backward, and search for a connecting definition or earlier result. Hammack explicitly
models direct proof by sketching first and last lines before filling the gap, while MIT
distinguishes explanatory induction from the polished write-up
([Hammack, direct proof chapter](https://richardhammack.github.io/BookOfProof/Main.pdf);
[MIT MCS, §5.1.3–5.1.4](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/mit6_042js15_textbook.pdf)).
Self-explanation prompts should cover both local and global comprehension: “What permits this
line?”, “Why introduce this expression?”, “Where is arbitrariness used?”, and “What is the whole
strategy?” Self-explanation training has improved proof comprehension in controlled research
([Hodds, Alcock & Inglis](https://mjinglis.github.io/files/JRME_SelfExpl_Paper.pdf)).

## Three implementation phases protect the strongest material

| Phase                           | Changes                                                                                                                                                                                             | Why this comes first                                                        | Completion test                                                                                       |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1. Repair the learning path     | Move Exercises before Test yourself; add observable outcomes/readiness checks; move variable roles earlier; distribute short checks; move the Induction template forward; label the quiz diagnostic | High impact with limited rewriting; fixes dependencies and delayed practice | A learner can state what each guide enables and practise within minutes of a new idea                 |
| 2. Re-layer the long guides     | Split first-pass/deeper material in Statements, Proofs, Implications, Sets, and Notation; show annotated and polished proofs; introduce hint layers and fading                                      | Reduces simultaneous novelty while preserving current examples              | Every new symbol or method follows plain language → example → formal form → immediate check           |
| 3. Build synthesis and feedback | Convert the exercise archive into staged mixed practice; add proof rubric, method-choice tasks, targeted quiz links, and learner testing                                                            | Requires the structure from phases 1–2 and may need component work          | Learners progress from recognition to independent proof and receive feedback before the full solution |

The highest-value external models are complementary.
[Hammack's _Book of Proof_](https://richardhammack.github.io/BookOfProof/Main.pdf) provides a clear
dependency tree and reusable direct-proof frames.
[Sundstrom's _Mathematical Reasoning: Writing and Proof_](https://scholarworks.gvsu.edu/books/9/)
models preview activities, progress checks, proof evaluation, study guides, and hints rather than
relying only on finished exposition.
[MIT Mathematics for Computer Science](https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/download/)
is especially useful for stable proof templates and the separation between explanatory and polished
proofs. The
[Virginia Tech Proofs Project](https://math.vt.edu/proofs-project/Instructional_Modules/Module_3.html)
is valuable for quantifier-negation obstacles, while the
[MAA _Transitions to Proof_ digest](https://maa.org/wp-content/uploads/2024/06/Transitions-to-Proof.pdf)
provides a concise research base for proof comprehension, validation, language, example use, and
construction difficulties. These should guide structure and task design; they should not replace the
repository's plainer voice or its effective existing examples.

## Conclusion

The section does not need more proof methods. It needs a clearer separation between **learning the
language, seeing the structure, practising the construction, and auditing the result**. Once Given →
Want → Bridge becomes the recurring action, notation and logic stop looking like preliminary
bureaucracy: each becomes a tool for deciding what the proof must start with and where it must
finish.

The most responsible first prototype is the direct-proof portion of _What a proof is_. Rework one
example into annotated discovery, faded completion, and independent near transfer; then test whether
a learner can identify the given, target, bridge, and justification without reopening the model.
That prototype will reveal how much scaffolding the site actually needs before the same pattern is
propagated through Implications, Sets, and Induction.
