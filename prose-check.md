# Prose check

The rules for every piece of writing on the site: guides, introductions, exercises, solutions,
quizzes, captions and diagram readouts. Check each new or changed passage against this list before
it is published. Each rule has a code so a review can name the rule a passage breaks.

The test behind every rule: a learner meeting the idea for the first time should understand each
sentence on one reading, and see how it follows from the one before.

## Flow: how sentences connect

- **F1. One thread per paragraph.** A paragraph makes one point. Every sentence serves that point,
  and a reader could say in a few words what the paragraph is for.
- **F2. Link each sentence to the last.** Each sentence picks up something from the one before: its
  subject, a consequence ("so"), a contrast ("but", "instead") or a reason ("because"). A sentence
  that starts a new topic with no link is a cold open; move it, link it or cut it. Prefer everyday
  joining words ("now", "instead", "so", "but") to colons, and use "similarly" only when the two
  things really are alike.
- **F11. Sound like a person talking.** Read the passage aloud: it should sound like someone
  explaining at a whiteboard, not a table of contents. Warning signs: two lists of three examples in
  a row, abstract verbs ("makes each one exact", "formalises"), and announcements of structure ("it
  ends with", "this guide makes"). One example the reader can picture, with what they'd notice in
  it, beats three examples named in passing.
- **F3. Lead with the point.** Put the main idea, the one the reader most needs, first or second in
  the paragraph. Don't bury it after background or a side remark.
- **F4. Familiar before abstract.** Start from what the reader knows (the tracing paper, a pizza, a
  photocopier) and arrive at the new term or category. Write "Moving the tracing paper never changes
  a distance. Maps like this are called isometries", not "The maps that keep every distance are the
  moves of the tracing paper".
- **F5. Say it positively and directly.** Write "a zoom changes distances", not "a zoom by anything
  other than 1 doesn't keep distances". Handle exceptions in their own sentence after the main
  claim.
- **F6. One job per sentence.** Don't make a claim and give directions in the same sentence. Links
  to other guides go in their own sentence or a list, not tacked onto a maths claim.
- **F7. Keep digressions out of the way.** A side remark (how something is proved later, a
  historical note, a caveat) goes after the main point is complete, or in its own paragraph. Never
  put one between an observation and its consequence.
- **F8. Name things, don't gesture.** Avoid vague pointers: "something more", "the figure above",
  "this", "it" when the antecedent is unclear, "as before". Say what the thing is: "the triangle
  figure under [The image of a shape](#the-image-of-a-shape)", "the distance between any two
  points".
- **F9. Concrete before general.** Give a picture or worked example with numbers before or right
  after a general statement, so the reader has something to hold.
- **F10. Don't recap the last paragraph.** Carry its subject forward instead ("Because...",
  "So...").

## Clarity: each sentence

- **C1. One reading.** Every sentence must parse on the first reading. If it doesn't, name the
  subject, the action and the consequence, in that order.
- **C2. Short sentences, but not fragments.** Aim for under 20 words. Don't chop one connected idea
  into stop-start fragments or one-sentence paragraphs that each begin "Also"; that reads worse.
- **C3. Ideas before symbols.** Say each idea in words first, then give the symbols. Keep symbols to
  what the passage needs, and read new notation aloud the first time ("$$F(P)$$, read "F of P"").
- **C4. Define before use.** Every term is defined, or described in plain words, before or where it
  first appears. This includes background words like "the plane".
- **C5. Accurate claims.** Every claim, number and cross-reference is correct and checked. A
  description of a figure must match the figure exactly.
- **C6. Honest about what is assumed.** Say plainly when a step is taken from the picture, taken as
  given, or proved later, and say where it is proved. Keep forward references current: don't say "a
  later chapter" when a chapter already covers it.
- **C7. Specific, not vague.** Replace weasel words (often, many, generally, a lot) with a specific
  claim: "a turn has one fixed point", not "fixed points say a lot about a map".

## Voice and words

- **V1. "You" for the reader, "we" for working together.** Use "you" when the reader does
  something themselves ("imagine", "you've seen"). Use "we" when the writer and reader work through
  something side by side ("in this guide we'll get a feel for both"), as a person explaining at a
  whiteboard would. Don't use "we" for what the reader alone does.
- **V2. Active voice, present tense.** Contractions are fine. No rhetorical questions.
- **V3. Banned words:** easy, simple, quick (about what the reader does), very, just, really,
  simply. Also avoid "surprising" and "obvious" as judgements.
- **V4. No em dashes**, and no hyphens used as dashes. Use a colon, a comma, a full stop, or
  rephrase.
- **V5. "Exactly when", never "only if"** on its own.
- **V6. Literal verbs.** No metaphor or filler where a literal step exists.
- **V7. Own words and own examples.** Never mention the source book or its author, and never reuse
  its distinctive examples, numbering or phrasing.

## Structure

- **S1. Paragraphs of 2 to 4 sentences**, each with one idea (see F1).
- **S2. Every guide opens with a scene, not a summary.** No heading. Ask the reader to imagine
  something real they can picture, and say what they'd notice in it. Then name the idea, and finish
  with one plain sentence about what the guide does ("In this guide we'll get a feel for both, and
  then describe them exactly"). Don't list the sections or say how the guide "ends with" something.
  See [How an opening should sound](#how-an-opening-should-sound).
- **S3. Every section opens with an intuition paragraph** in plain English: the picture, why it
  should be true and what it's for, readable without symbols.
- **S4. Headings in sentence case**, and descriptive (not one generic word like "Overview").
- **S5. Three or more items in a sentence become a list.** Introduce every list with a colon. No
  full stop after list items unless they are full sentences. Bold-led items use
  `**Term**: description`.
- **S6. Bold only for a term being defined or a critical fact**, never for tone.
- **S7. Assumed facts go in a box**: `:::remark[Rules for ...]{#id}`, ending "These are taken as
  given." with a `::see-also` link.
- **S8. No "Common mistakes" or "In short" sections.**
- **S9. Every guide ends with its exercises**: `## Exercises`, then a collapsed accordion "Exercises
  on <topic>, with solutions", each exercise with a full worked solution.

## Statements, proofs and exercises

- **P1. Use the statement kind that fits:** theorem for a central result, proposition for a lesser
  one, lemma for a tool, corollary for a quick consequence, definition, example, remark.
- **P2. Every proof cites an outside source** that proves the same fact (`source=` on the proof),
  checked to load.
- **P3. Refer to statements by name** with `:ref{#id}`, never by "the theorem above".
- **P4. No circular proofs.** A proof uses only statements that don't themselves depend on it.
- **P5. Exercises are new and aimed at understanding.** Every number in a solution is checked by
  calculation before publishing.
- **P6. Quiz questions test ideas, not arithmetic.** Wrong options are real misconceptions, and
  every explanation links back to the statement it is about.

## Captions, readouts and figures

- **R1. A caption or readout says what the reader is looking at** and what it shows, in one or two
  sentences, under the same voice and word rules.
- **R2. The text and the figure agree** on every label, number and direction.
- **R3. Every label sits inside the figure** and clear of lines and other labels.

## How an opening should sound

Not like this, which lists examples and announces structure:

> A box riding a conveyor belt, a rook moving along a chessboard and a character walking across a
> screen all slide without turning. The hands of a clock, a steering wheel and a door on its hinges
> all turn about one point that stays still. These are two of the three ways to move the sheet of
> tracing paper from Maps of the plane, and this guide makes each one exact.

Like this, which puts the reader in a scene and then names what they saw:

> Imagine pushing a book across a table without letting it twist. Every corner moves the same way,
> by the same amount. Now imagine opening a door instead: the hinges stay put and the rest of the
> door swings round them. Mathematicians call the first move a translation and the second a
> rotation. In this guide we'll get a feel for both, and then describe them exactly.

## How to check a passage

1. Read it once, as a learner who has only read the earlier guides. Note every place you had to
   reread (C1), and every term you hadn't met (C4).
2. For each paragraph, say its point in a few words (F1), and check the point comes first (F3).
3. Check how each sentence links to the one before (F2), and look for detours (F7) and vague
   pointers (F8).
4. Read it aloud (F11), and search for the banned words, em dashes and "only if" (V3, V4, V5).
5. Check every number, figure reference and cross-reference (C5, R2).
