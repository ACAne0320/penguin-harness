/**
 * /company — the executable design spec for the proposed company workflow.
 * Keep the page's composition here; copy is in company-strings.ts, transitions in
 * company-workflow.ts and responsive appearance in company.css. All state is local to this
 * prototype. No company API, LLM request, repository write or real merge is performed.
 */
import { useRef, useState } from "react";
import type { ButtonHTMLAttributes, FormEvent, ReactNode } from "react";
import { ArrowRightIcon, CheckIcon, SiteGlyph, SitePill } from "@prismshadow/penguin-ui/site";
import { S } from "../lib/strings";
import { useDocumentMeta } from "../lib/document-meta";
import { canApprove, initialCompanyTasks, inInbox, transitionTask } from "../lib/company-workflow";
import type { InboxView, WorkflowAction, WorkflowTask } from "../lib/company-workflow";
import "./company.css";

type Surface = "inbox" | "personal" | "goals";
type DetailTab = "overview" | "evidence" | "session";
const FILTERS: InboxView[] = ["all", "attention", "active", "done", "later", "archived"];

function Action({
  children,
  primary = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean }) {
  return (
    <button
      type="button"
      className={`company-button${primary ? " company-button-primary" : ""}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Status({ task }: { task: WorkflowTask }) {
  return (
    <span className="company-status" data-stage={task.stage}>
      {task.stage === "merged" && <CheckIcon />}
      {S.company.stages[task.stage]}
    </span>
  );
}

function Field({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="company-field">
      <h4>{title}</h4>
      <p>{children}</p>
    </div>
  );
}

function TaskOutcome({ task }: { task: WorkflowTask }) {
  const c = S.company;
  const text =
    task.stage === "merged"
      ? task.mergedBy === "human"
        ? c.mergedHuman
        : c.mergedAgent
      : task.verification === "failed"
        ? c.failedText
        : task.stage === "review"
          ? task.verification === "passed"
            ? c.reviewText
            : c.uncertainText
          : task.stage === "queued"
            ? c.queuedText
            : c.pendingText;
  return (
    <div className="company-outcome" data-stage={task.stage}>
      <div className="company-outcome-icon">
        <SiteGlyph
          name={task.stage === "merged" ? "check" : task.stage === "review" ? "user" : "search"}
        />
      </div>
      <div>
        <p>{text}</p>
        {task.stage === "merged" && <p className="company-muted">{c.mergedNote}</p>}
      </div>
    </div>
  );
}

function VerificationPanel({
  task,
  act,
}: {
  task: WorkflowTask;
  act: (action: WorkflowAction) => void;
}) {
  const c = S.company;
  return (
    <div className="company-evidence">
      <h3>{c.checksTitle}</h3>
      <p className="company-muted">{c.checksNote}</p>
      <ol className="company-checks">
        {c.checks.map((check, index) => {
          const result =
            task.verifiedRevision !== task.revision
              ? "pending"
              : task.verification === "uncertain" && index !== 3
                ? "passed"
                : task.verification === "failed" && index !== 0
                  ? "pending"
                  : task.verification;
          return (
            <li key={check.title}>
              <div className="company-check-heading">
                <span className="company-step-number">{String(index + 1).padStart(2, "0")}</span>
                <h4>{check.title}</h4>
                <span className="company-check-result" data-result={result}>
                  {c.verification[result]}
                </span>
              </div>
              <dl>
                <dt>{c.checkOperation}</dt>
                <dd>{check.action}</dd>
                <dt>{c.checkExpected}</dt>
                <dd>
                  {result === "pending"
                    ? c.notRun
                    : result === "uncertain"
                      ? c.uncertainty
                      : result === "failed"
                        ? c.failure
                        : check.result}
                </dd>
              </dl>
            </li>
          );
        })}
      </ol>
      {task.stage !== "merged" && task.stage !== "queued" && (
        <div className="company-simulator">
          <h4>{c.simulation}</h4>
          <p className="company-muted">{c.simulationHint}</p>
          <div className="company-actions">
            <Action primary onClick={() => act("verify-pass")}>
              {c.simulatePass}
            </Action>
            <Action onClick={() => act("verify-uncertain")}>{c.simulateConcern}</Action>
            <Action onClick={() => act("verify-fail")}>{c.simulateFail}</Action>
          </div>
        </div>
      )}
    </div>
  );
}

function SessionPanel({
  task,
  addComment,
}: {
  task: WorkflowTask;
  addComment: (text: string) => void;
}) {
  const c = S.company;
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(false);
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.trim()) return;
    addComment(draft.trim());
    setDraft("");
    setSaved(true);
  }
  return (
    <div>
      <h3>{c.sessionTitle}</h3>
      <p className="company-muted">{c.sessionText}</p>
      <ol className="company-sessions">
        {c.sessionKinds.map((name, i) => (
          <li key={name}>
            <span className="company-step-number">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h4>{name}</h4>
              <p>{c.sessionDetails[i]}</p>
            </div>
          </li>
        ))}
      </ol>
      <h3>{c.conversation}</h3>
      {task.comments.length === 0 ? (
        <p className="company-muted">{c.noComments}</p>
      ) : (
        <ol className="company-comments">
          {task.comments.map((comment, i) => (
            <li key={i}>
              <strong>{c.you}</strong>
              <p>{comment}</p>
            </li>
          ))}
        </ol>
      )}
      <form onSubmit={submit} className="company-form">
        <label className="sr-only" htmlFor="company-comment">
          {c.commentLabel}
        </label>
        <textarea
          id="company-comment"
          rows={3}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setSaved(false);
          }}
          placeholder={c.commentPlaceholder}
        />
        <Action type="submit" primary disabled={!draft.trim()}>
          {c.addComment}
        </Action>
        {saved && (
          <p role="status" className="company-muted">
            {c.commentSaved}
          </p>
        )}
      </form>
    </div>
  );
}

export function CompanyPage() {
  const c = S.company;
  useDocumentMeta(c.title, c.description);
  const [tasks, setTasks] = useState(initialCompanyTasks);
  const [surface, setSurface] = useState<Surface>("inbox");
  const [view, setView] = useState<InboxView>("all");
  const [selected, setSelected] = useState<string | null>("WK-104");
  const [tab, setTab] = useState<DetailTab>("overview");
  const [newTask, setNewTask] = useState("");
  const [lastCreated, setLastCreated] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const detail = useRef<HTMLElement>(null);
  const task = tasks.find((t) => t.id === selected);
  const visible = tasks.filter((t) => inInbox(t, view));
  const needsReview = tasks.filter((t) => t.stage === "review").length;
  const active = tasks.filter((t) => t.stage === "working" || t.stage === "verifying").length;
  const done = tasks.filter((t) => t.stage === "merged").length;

  function selectTask(id: string) {
    setSelected(id);
    setSurface("inbox");
    setTab("overview");
    setTasks((current) => current.map((t) => (t.id === id ? transitionTask(t, "read") : t)));
    if (window.matchMedia("(max-width: 760px)").matches) {
      requestAnimationFrame(() =>
        detail.current?.scrollIntoView({ block: "start", behavior: "instant" }),
      );
    }
  }
  function act(action: WorkflowAction) {
    if (!task) return;
    const updated = transitionTask(task, action);
    setTasks((current) => current.map((t) => (t.id === task.id ? updated : t)));
    const outcome =
      updated.stage === "merged"
        ? updated.mergedBy === "human"
          ? c.mergedHuman
          : c.mergedAgent
        : action === "snooze"
          ? c.snoozedHint
          : action === "archive"
            ? c.archivedHint
            : c.stages[updated.stage];
    setAnnouncement(outcome);
  }
  function changeView(next: InboxView) {
    setView(next);
    const first = tasks.find((t) => inInbox(t, next));
    setSelected(first?.id ?? null);
    setTab("overview");
  }
  function recordTask(event: FormEvent) {
    event.preventDefault();
    if (!newTask.trim()) return;
    const id = `WK-${105 + tasks.filter((t) => t.sample === "custom").length}`;
    setTasks((current) => [
      {
        id,
        sample: "custom",
        title: newTask.trim(),
        stage: "queued",
        verification: "pending",
        needsHuman: false,
        revision: 1,
        verifiedRevision: null,
        unread: true,
        snoozed: false,
        archived: false,
        comments: [],
      },
      ...current,
    ]);
    setNewTask("");
    setLastCreated(id);
    setAnnouncement(c.taskSaved);
  }
  function reset() {
    setTasks(initialCompanyTasks());
    setSurface("inbox");
    setView("all");
    setSelected("WK-104");
    setTab("overview");
    setLastCreated(null);
    setNewTask("");
    setAnnouncement("");
  }
  const sample = task ? c.samples[task.sample] : null;

  return (
    <div className="company-page">
      <section className="company-hero">
        <div>
          <div className="company-page-name">
            <span>{c.name}</span>
            <SitePill tone="neutral">{c.prototype}</SitePill>
          </div>
          <h1>{c.headline}</h1>
          <p className="company-intro">{c.intro}</p>
          <div className="company-actions">
            <a className="company-button company-button-primary" href="#company-workbench">
              {c.openDemo}
              <ArrowRightIcon />
            </a>
            <a className="company-text-link" href="#company-verification">
              {c.readRules}
            </a>
          </div>
        </div>
        <aside className="company-hero-rule">
          <SiteGlyph name="check" />
          <h2>{c.coreTitle}</h2>
          <p>{c.coreText}</p>
        </aside>
      </section>

      <ol className="company-flow" aria-label={c.title}>
        {c.steps.map((step, i) => (
          <li key={step}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <strong>{step}</strong>
            {i < c.steps.length - 1 && <ArrowRightIcon />}
          </li>
        ))}
      </ol>

      <section
        id="company-workbench"
        className="company-workbench section-anchor"
        aria-labelledby="company-workbench-title"
      >
        <div className="company-workbench-heading">
          <div>
            <h2 id="company-workbench-title">{c.demoTitle}</h2>
            <p>{c.demoNote}</p>
          </div>
          <Action onClick={reset}>{c.reset}</Action>
        </div>
        <div className="company-app">
          <div className="company-app-bar">
            <div className="company-agent-id">
              <img src={`${import.meta.env.BASE_URL}penguin-logo.svg`} alt="" />
              <strong>PenguinHarness</strong>
            </div>
            <span>{c.repo}</span>
          </div>
          <div className="company-app-nav" role="group" aria-label={c.demoTitle}>
            {(["inbox", "personal", "goals"] as const).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={surface === key}
                onClick={() => setSurface(key)}
              >
                {c[key]}
                {key === "inbox" && needsReview > 0 && (
                  <span className="company-count">{needsReview}</span>
                )}
              </button>
            ))}
          </div>
          <div className="company-goal-strip">
            <div>
              <span>{c.goalLabel}</span>
              <strong>{c.goalTitle}</strong>
            </div>
            <button type="button" className="company-text-link" onClick={() => setSurface("goals")}>
              {c.goalLink}
              <ArrowRightIcon />
            </button>
          </div>

          {surface === "inbox" && (
            <>
              <div className="company-inbox-heading">
                <h3>{c.attention(needsReview)}</h3>
                <p>{c.background}</p>
              </div>
              <div className="company-inbox-layout">
                <aside className="company-inbox-list" aria-label={c.inbox}>
                  <div className="company-filter-row" role="group" aria-label={c.inbox}>
                    {FILTERS.map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        aria-pressed={view === filter}
                        onClick={() => changeView(filter)}
                      >
                        {c.filters[filter]}
                        <span>{tasks.filter((t) => inInbox(t, filter)).length}</span>
                      </button>
                    ))}
                  </div>
                  <div className="company-list-heading">{c.count(visible.length)}</div>
                  {visible.length === 0 ? (
                    <div className="company-empty">
                      <p>{c.empty}</p>
                      <p>{c.emptyDetail}</p>
                    </div>
                  ) : (
                    <ul>
                      {visible.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            className="company-task"
                            aria-current={selected === item.id ? "true" : undefined}
                            onClick={() => selectTask(item.id)}
                          >
                            <span className="company-task-meta">
                              <code>{item.id}</code>
                              {item.unread && <span className="company-unread">{c.unread}</span>}
                            </span>
                            <strong>{item.title ?? c.samples[item.sample].title}</strong>
                            <span className="company-task-bottom">
                              <Status task={item} />
                              <ArrowRightIcon />
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </aside>
                <article
                  className="company-task-detail"
                  ref={detail}
                  aria-label={task ? (task.title ?? sample!.title) : c.empty}
                >
                  {task && sample ? (
                    <>
                      <div className="company-detail-top">
                        <code>{task.id}</code>
                        <span>{c.revision(task.revision)}</span>
                        <Status task={task} />
                      </div>
                      <h2>{task.title ?? sample.title}</h2>
                      <div className="company-detail-tools">
                        <button type="button" onClick={() => act(task.unread ? "read" : "unread")}>
                          {task.unread ? c.read : c.markUnread}
                        </button>
                        {task.snoozed || task.archived ? (
                          <button type="button" onClick={() => act("restore")}>
                            {c.restore}
                          </button>
                        ) : (
                          <>
                            <button type="button" onClick={() => act("snooze")}>
                              {c.snooze}
                            </button>
                            <button type="button" onClick={() => act("archive")}>
                              {c.archive}
                            </button>
                          </>
                        )}
                      </div>
                      {task.snoozed && <p className="company-inbox-note">{c.snoozedHint}</p>}
                      {task.archived && <p className="company-inbox-note">{c.archivedHint}</p>}
                      <TaskOutcome task={task} />
                      <div
                        className="company-detail-tabs"
                        role="group"
                        aria-label={task.title ?? sample.title}
                      >
                        {(["overview", "evidence", "session"] as const).map((key) => (
                          <button
                            key={key}
                            type="button"
                            aria-pressed={tab === key}
                            onClick={() => setTab(key)}
                          >
                            {c.tabs[key]}
                          </button>
                        ))}
                      </div>
                      <div className="company-detail-body">
                        {tab === "overview" && (
                          <>
                            <Field title={c.source}>{sample.source}</Field>
                            <Field title={c.purpose}>{sample.purpose}</Field>
                            <Field title={c.acceptance}>{sample.acceptance}</Field>
                            <Field title={c.deliverable}>{sample.deliverable}</Field>
                            <div className="company-actions">
                              <Action onClick={() => setTab("evidence")}>
                                {c.viewEvidence}
                                <ArrowRightIcon />
                              </Action>
                              <Action onClick={() => setTab("session")}>{c.discuss}</Action>
                            </div>
                          </>
                        )}
                        {tab === "evidence" && <VerificationPanel task={task} act={act} />}
                        {tab === "session" && (
                          <SessionPanel
                            key={`${task.id}/${task.revision}`}
                            task={task}
                            addComment={(text) =>
                              setTasks((current) =>
                                current.map((t) =>
                                  t.id === task.id ? { ...t, comments: [...t.comments, text] } : t,
                                ),
                              )
                            }
                          />
                        )}
                      </div>
                      {task.stage === "review" && (
                        <div className="company-review-actions">
                          <p>{c.humanHint}</p>
                          <div className="company-actions">
                            <Action
                              primary
                              disabled={!canApprove(task)}
                              onClick={() => act("approve")}
                            >
                              {c.approve}
                            </Action>
                            <Action
                              onClick={() => {
                                act("revise");
                                setTab("evidence");
                              }}
                            >
                              {c.revise}
                            </Action>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="company-empty">
                      <h3>{c.empty}</h3>
                      <p>{c.emptyDetail}</p>
                    </div>
                  )}
                </article>
              </div>
            </>
          )}

          {surface === "personal" && (
            <div className="company-personal">
              <div className="company-personal-heading">
                <img src={`${import.meta.env.BASE_URL}penguin-logo.svg`} alt="" />
                <div>
                  <h2>{c.personalTitle}</h2>
                  <p>{c.personalText}</p>
                </div>
              </div>
              <section className="company-personal-summary">
                <h3>{c.summaryTitle}</h3>
                <p>{c.summaryLive(active, needsReview, done)}</p>
                <ul>
                  {tasks
                    .filter((t) => t.stage === "review" || t.stage === "verifying")
                    .map((t) => (
                      <li key={t.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setView("all");
                            selectTask(t.id);
                          }}
                        >
                          {t.title ?? c.samples[t.sample].title}
                          <Status task={t} />
                          <ArrowRightIcon />
                        </button>
                      </li>
                    ))}
                </ul>
              </section>
              <form className="company-form" onSubmit={recordTask}>
                <h3>
                  <label htmlFor="company-new-task">{c.newTask}</label>
                </h3>
                <textarea
                  id="company-new-task"
                  aria-label={c.newTaskLabel}
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  rows={3}
                  placeholder={c.newTaskPlaceholder}
                />
                <div className="company-actions">
                  <Action type="submit" primary disabled={!newTask.trim()}>
                    {c.recordTask}
                  </Action>
                  {lastCreated && (
                    <Action
                      onClick={() => {
                        setView("all");
                        selectTask(lastCreated);
                      }}
                    >
                      {c.savedTask}
                      <ArrowRightIcon />
                    </Action>
                  )}
                </div>
              </form>
            </div>
          )}

          {surface === "goals" && (
            <div className="company-goals">
              <div className="company-goal-intro">
                <h2>{c.goalTitle}</h2>
                <p>{c.goalText}</p>
                <div className="company-goal-feedback">
                  <h3>{c.feedbackTitle}</h3>
                  <p>{c.feedbackText}</p>
                </div>
              </div>
              <div>
                <h3>{c.planTitle}</h3>
                <p className="company-muted">{c.planText}</p>
                <ol className="company-plan">
                  {tasks.map((t) => (
                    <li key={t.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setView("all");
                          selectTask(t.id);
                        }}
                      >
                        <span>
                          <code>{t.id}</code>
                          <strong>{t.title ?? c.samples[t.sample].title}</strong>
                        </span>
                        <Status task={t} />
                        <ArrowRightIcon />
                      </button>
                      <p>{c.samples[t.sample].purpose}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
          <div className="company-app-status" role="status" aria-live="polite">
            {announcement || c.goalProgress}
          </div>
        </div>
      </section>

      <section id="company-verification" className="company-rules section-anchor">
        <div>
          <h2>{c.rulesTitle}</h2>
          <p>{c.rulesIntro}</p>
        </div>
        <ol>
          {c.rules.map((rule, i) => (
            <li key={rule.title}>
              <span className="company-step-number">{String(i + 1).padStart(2, "0")}</span>
              <h3>{rule.title}</h3>
              <p>{rule.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="company-context">
        <h2>{c.contextTitle}</h2>
        <p>{c.contextText}</p>
      </section>
    </div>
  );
}
