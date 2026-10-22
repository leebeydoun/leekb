"use client";

import { useEffect, useState, type ReactNode } from "react";
import katex from "katex";
import { Ref } from "./ref";

const MAX_STARS = 4;

type Question = {
  id: string;
  /** how hard the question is, from 1 to MAX_STARS */
  stars: number;
  topic?: string;
  question: string;
  options: string[];
  /** index of the correct option, counting from 0 */
  answer: number;
  explanation: string;
};

/** statement id -> its label and link, e.g. { label: "Integers", href: "/maths/...#id" } */
type Targets = Record<string, { label: string; href: string }>;

type QuizData = { title: string; description?: string; questions: Question[] };

/**
 * What is kept in localStorage: the shuffled order of the questions, the chosen option for each
 * answered question (both by question id), and where the reader is in the order.
 */
type Progress = {
  order: string[];
  answers: Record<string, number>;
  current: number;
  finished: boolean;
};

type View = "start" | "question" | "results";

const primaryButton =
  "inline-flex items-center rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/85 disabled:pointer-events-none disabled:opacity-50";
const secondaryButton =
  "inline-flex items-center rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

function fresh(questions: Question[]): Progress {
  return {
    order: shuffle(questions.map((q) => q.id)),
    answers: {},
    current: 0,
    finished: false,
  };
}

// storage can be missing or blocked (private windows, previews), so every access is guarded and the
// quiz still works without it, it just won't remember
function loadProgress(key: string, questions: Question[]): Progress {
  try {
    const saved = JSON.parse(
      localStorage.getItem(key) ?? "null",
    ) as Partial<Progress> | null;
    if (!saved || !Array.isArray(saved.order)) return fresh(questions);

    // the quiz file may have changed since, so drop anything that no longer fits it
    const byId = new Map(questions.map((q) => [q.id, q]));
    const order = saved.order.filter((id) => byId.has(id));
    const added = questions
      .filter((q) => !order.includes(q.id))
      .map((q) => q.id);
    order.push(...shuffle(added));

    const answers: Record<string, number> = {};
    for (const q of questions) {
      const choice = saved.answers?.[q.id];
      if (
        Number.isInteger(choice) &&
        choice! >= 0 &&
        choice! < q.options.length
      ) {
        answers[q.id] = choice!;
      }
    }
    const current = Math.min(Math.max(saved.current ?? 0, 0), order.length - 1);
    return { order, answers, current, finished: Boolean(saved.finished) };
  } catch {
    return fresh(questions);
  }
}

function saveProgress(key: string, progress: Progress) {
  try {
    localStorage.setItem(key, JSON.stringify(progress));
  } catch {
    // not saved, but the quiz carries on
  }
}

// the small subset of markdown that quiz text uses: $$maths$$, :ref links, **bold**, _italic_ and
// [links](#anchor)
const TOKEN =
  /\$\$([\s\S]+?)\$\$|:ref(?:\[([^\]]*)\])?\{#([\w/-]+)\}|\*\*(.+?)\*\*|(?<!\w)_(.+?)_(?!\w)|\[([^\]]+)\]\((#[\w-]+)\)/g;

function RichText({
  text,
  targets,
  plain = false,
}: {
  text: string;
  targets: Targets;
  /** show links as plain text, for use inside buttons where links aren't allowed */
  plain?: boolean;
}) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(TOKEN)) {
    const [whole, tex, refText, refId, bold, italic, linkText, href] = match;
    if (match.index > last) parts.push(text.slice(last, match.index));
    const key = match.index;
    if (tex !== undefined) {
      const html = katex.renderToString(tex, { throwOnError: false });
      parts.push(<span key={key} dangerouslySetInnerHTML={{ __html: html }} />);
    } else if (refId !== undefined && plain) {
      parts.push(refText ?? targets[refId]?.label ?? refId);
    } else if (refId !== undefined) {
      parts.push(
        <Ref
          key={key}
          id={refId}
          label={targets[refId]?.label ?? refId}
          href={targets[refId]?.href}
        >
          {refText}
        </Ref>,
      );
    } else if (bold !== undefined) {
      parts.push(<strong key={key}>{bold}</strong>);
    } else if (italic !== undefined) {
      parts.push(<em key={key}>{italic}</em>);
    } else if (linkText !== undefined && plain) {
      parts.push(linkText);
    } else if (linkText !== undefined) {
      parts.push(
        <a
          key={key}
          href={href}
          className="font-medium underline underline-offset-[3.5px]"
        >
          {linkText}
        </a>,
      );
    }
    last = match.index + whole.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

/** Difficulty as filled and empty stars, e.g. ★★☆☆ for two out of four. */
function Stars({ count }: { count: number }) {
  return (
    <span
      className="tracking-wider whitespace-nowrap"
      role="img"
      aria-label={`Difficulty ${count} out of ${MAX_STARS}`}
      title={`Difficulty ${count} out of ${MAX_STARS}`}
    >
      <span className="text-fd-primary">{"★".repeat(count)}</span>
      <span className="text-fd-muted-foreground/40">
        {"★".repeat(MAX_STARS - count)}
      </span>
    </span>
  );
}

/**
 * A multiple choice review, one question at a time in a random order, loaded from
 * public/quizzes/<src>.json. Progress is kept in localStorage so a reader can leave and come back.
 */
export function Quiz({
  src,
  targets: targetsJson = "{}",
}: {
  src: string;
  /** where each statement the quiz links to lives, filled in at build time by remark-statements */
  targets?: string;
}) {
  const targets = JSON.parse(targetsJson) as Targets;
  // every site on the same github.io domain shares storage, so include the base path in the key
  const storageKey = `quiz:${import.meta.env.BASE_URL}${src}`;
  const [data, setData] = useState<QuizData | null>(null);
  const [failed, setFailed] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [view, setView] = useState<View>("start");
  const [selected, setSelected] = useState<number | null>(null);

  // load on the client only, so the random order never differs between server and browser
  useEffect(() => {
    let cancelled = false;
    fetch(`${import.meta.env.BASE_URL}quizzes/${src}.json`)
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json() as Promise<QuizData>;
      })
      .then((quiz) => {
        if (cancelled) return;
        setData(quiz);
        setProgress(loadProgress(storageKey, quiz.questions));
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [src, storageKey]);

  const frame =
    "not-prose my-8 rounded-xl border bg-fd-card p-5 text-fd-card-foreground sm:p-6";

  if (failed) {
    return (
      <div className={frame} data-quiz={src}>
        <p className="text-sm text-fd-muted-foreground">
          The review could not be loaded.
        </p>
      </div>
    );
  }
  if (!data || !progress) {
    return (
      <div className={frame} data-quiz={src}>
        <p className="text-sm text-fd-muted-foreground">Loading the review…</p>
      </div>
    );
  }

  const byId = new Map(data.questions.map((q) => [q.id, q]));
  const questions = progress.order.map((id) => byId.get(id)!);
  const answeredCount = questions.filter(
    (q) => q.id in progress.answers,
  ).length;
  const correctCount = questions.filter(
    (q) => progress.answers[q.id] === q.answer,
  ).length;
  const starLevels = [...new Set(questions.map((q) => q.stars))].sort(
    (a, b) => a - b,
  );

  function update(next: Progress) {
    setProgress(next);
    saveProgress(storageKey, next);
  }

  function goTo(index: number) {
    setSelected(null);
    update({ ...progress!, current: index });
    setView("question");
  }

  function restart() {
    setSelected(null);
    update(fresh(data!.questions));
    setView("question");
  }

  if (view === "start") {
    return (
      <div className={frame} data-quiz={src}>
        <p className="text-xs font-medium tracking-wide text-fd-muted-foreground uppercase">
          Test yourself
        </p>
        <h3 className="mt-1 text-lg font-semibold">{data.title}</h3>
        {data.description && (
          <p className="mt-2 text-sm text-fd-muted-foreground">
            {data.description}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-fd-muted-foreground">
          <span>{questions.length} questions</span>
          {starLevels.map((stars) => (
            <span key={stars} className="flex items-center gap-1.5">
              <Stars count={stars} />
              {questions.filter((q) => q.stars === stars).length}
            </span>
          ))}
        </div>
        <p className="mt-3 text-sm text-fd-muted-foreground">
          {answeredCount === 0
            ? "Your answers are saved in this browser, so you can stop and come back later."
            : `You have answered ${answeredCount} of ${questions.length}, with ${correctCount} correct.`}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {answeredCount === 0 ? (
            <button
              type="button"
              className={primaryButton}
              onClick={() => goTo(0)}
            >
              Start
            </button>
          ) : (
            <>
              {answeredCount < questions.length && (
                <button
                  type="button"
                  className={primaryButton}
                  onClick={() => {
                    const next = questions.findIndex(
                      (q) => !(q.id in progress.answers),
                    );
                    goTo(next === -1 ? 0 : next);
                  }}
                >
                  Continue
                </button>
              )}
              {progress.finished && (
                <button
                  type="button"
                  className={secondaryButton}
                  onClick={() => setView("results")}
                >
                  See results
                </button>
              )}
              <button
                type="button"
                className={secondaryButton}
                onClick={restart}
              >
                Start again
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (view === "results") {
    const missed = questions
      .map((q, index) => ({ q, index }))
      .filter(({ q }) => progress.answers[q.id] !== q.answer);
    return (
      <div className={frame} data-quiz={src}>
        <p className="text-xs font-medium tracking-wide text-fd-muted-foreground uppercase">
          Results
        </p>
        <h3 className="mt-1 text-lg font-semibold">
          {correctCount} out of {questions.length} correct
        </h3>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {starLevels.map((stars) => {
            const ofLevel = questions.filter((q) => q.stars === stars);
            const right = ofLevel.filter(
              (q) => progress.answers[q.id] === q.answer,
            ).length;
            return (
              <div key={stars} className="rounded-lg border p-3">
                <Stars count={stars} />
                <p className="mt-1 text-sm font-medium">
                  {right} / {ofLevel.length}
                </p>
              </div>
            );
          })}
        </div>
        {missed.length > 0 && (
          <>
            <p className="mt-5 text-sm font-medium">
              {missed.length === 1
                ? "One question to look at again"
                : "Questions to look at again"}
            </p>
            <ul className="mt-2 divide-y rounded-lg border">
              {missed.map(({ q, index }) => (
                <li key={q.id}>
                  <button
                    type="button"
                    className="flex w-full items-start gap-3 px-3 py-2 text-start text-sm transition-colors hover:bg-fd-accent"
                    onClick={() => goTo(index)}
                  >
                    <span className="shrink-0 text-fd-muted-foreground">
                      {index + 1}.
                    </span>
                    <span className="flex-1">
                      <RichText text={q.question} targets={targets} plain />
                      {!(q.id in progress.answers) && (
                        <span className="text-fd-muted-foreground">
                          {" "}
                          (not answered)
                        </span>
                      )}
                    </span>
                    <Stars count={q.stars} />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" className={primaryButton} onClick={restart}>
            Start again
          </button>
          <button
            type="button"
            className={secondaryButton}
            onClick={() => setView("start")}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const index = progress.current;
  const question = questions[index]!;
  const chosen = progress.answers[question.id];
  const answered = chosen !== undefined;
  const isLast = index === questions.length - 1;
  const letter = (i: number) => String.fromCharCode(65 + i);

  function check() {
    if (selected === null) return;
    update({
      ...progress!,
      answers: { ...progress!.answers, [question.id]: selected },
    });
  }

  function next() {
    setSelected(null);
    if (isLast) {
      update({ ...progress!, finished: true });
      setView("results");
    } else {
      update({ ...progress!, current: index + 1 });
    }
  }

  return (
    <div className={frame} data-quiz={src}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span className="font-medium">
          Question {index + 1} of {questions.length}
        </span>
        <Stars count={question.stars} />
        {question.topic && (
          <span className="text-fd-muted-foreground">{question.topic}</span>
        )}
        <button
          type="button"
          className="ms-auto text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
          onClick={() => setView("start")}
        >
          Close
        </button>
      </div>

      {/* one segment per question, coloured by result, and clickable to jump around */}
      <div className="mt-3 flex gap-0.5" aria-label="Progress">
        {questions.map((q, i) => {
          const choice = progress.answers[q.id];
          const color =
            choice === undefined
              ? "bg-fd-muted"
              : choice === q.answer
                ? "bg-fd-success"
                : "bg-fd-error";
          return (
            <button
              key={q.id}
              type="button"
              aria-label={`Question ${i + 1}`}
              aria-current={i === index ? "step" : undefined}
              className={`h-1.5 flex-1 rounded-full ${color} ${i === index ? "outline-2 outline-offset-1 outline-fd-primary" : ""}`}
              onClick={() => goTo(i)}
            />
          );
        })}
      </div>

      <p className="mt-5 text-base leading-relaxed">
        <RichText text={question.question} targets={targets} />
      </p>

      <div className="mt-4 grid gap-2" role="group" aria-label="Options">
        {question.options.map((option, i) => {
          let state = "border hover:bg-fd-accent";
          if (answered) {
            if (i === question.answer)
              state = "border border-fd-success bg-fd-success/10";
            else if (i === chosen)
              state = "border border-fd-error bg-fd-error/10";
            else state = "border opacity-60";
          } else if (i === selected) {
            state = "border border-fd-primary bg-fd-accent";
          }
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              aria-pressed={answered ? i === chosen : i === selected}
              className={`flex items-start gap-3 rounded-lg px-3 py-2.5 text-start text-sm transition-colors ${state}`}
              onClick={() => setSelected(i)}
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium">
                {letter(i)}
              </span>
              <span className="pt-0.5">
                <RichText text={option} targets={targets} />
              </span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className="mt-4 rounded-lg border border-s-4 px-4 py-3 text-sm leading-relaxed"
          style={{
            borderInlineStartColor:
              chosen === question.answer
                ? "var(--color-fd-success)"
                : "var(--color-fd-error)",
          }}
        >
          <p className="font-medium">
            {chosen === question.answer
              ? "Correct."
              : `Not quite. The answer is ${letter(question.answer)}.`}
          </p>
          <p className="mt-1">
            <RichText text={question.explanation} targets={targets} />
          </p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {answered ? (
          <button type="button" className={primaryButton} onClick={next}>
            {isLast ? "See results" : "Next question"}
          </button>
        ) : (
          <button
            type="button"
            className={primaryButton}
            disabled={selected === null}
            onClick={check}
          >
            Check answer
          </button>
        )}
        {index > 0 && (
          <button
            type="button"
            className={secondaryButton}
            onClick={() => goTo(index - 1)}
          >
            Previous
          </button>
        )}
        <span className="ms-auto text-sm text-fd-muted-foreground">
          {correctCount} correct of {answeredCount} answered
        </span>
      </div>
    </div>
  );
}
