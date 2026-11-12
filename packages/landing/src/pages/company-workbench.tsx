/**
 * Interactive company workflow specimen. The shell, navigation, typography, controls and
 * ticket dialog use the same UI primitives and Frost theme as packages/web. The existing
 * overview-page.tsx, sidebar-mode.tsx, tickets-page.tsx and ticket-dialog.tsx are its baseline.
 * Only fixture state lives here; no company API or repository mutation is performed.
 */
import { useState } from "react";
import type { ButtonHTMLAttributes, FormEvent, ReactNode } from "react";
import {
  AppShell,
  Badge,
  Button,
  CloseButton,
  Drawer,
  GlyphIcon,
  Heading,
  ICONS,
  MobileTopBar,
  Modal,
  NavRow,
  PageFrame,
  PageHeader,
  RuledSection,
  SidebarFrame,
  SidebarListHeader,
  SidebarNavArea,
  SidebarNavGroup,
  Text,
} from "@prismshadow/penguin-ui";
import { S } from "../lib/strings";
import { canApprove, initialCompanyTasks, inInbox, transitionTask } from "../lib/company-workflow";
import type { InboxView, WorkflowAction, WorkflowTask } from "../lib/company-workflow";

type Surface = "overview" | "tickets" | "personal" | "goals" | "session";
const FILTERS: InboxView[] = ["attention", "all", "active", "done", "later", "archived"];

function Action({
  children,
  primary = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean }) {
  return (
    <Button size="sm" variant={primary ? "primary" : "secondary"} {...props}>
      {children}
    </Button>
  );
}
function Status({ task }: { task: WorkflowTask }) {
  return (
    <Badge
      tone={task.stage === "review" ? "attention" : task.stage === "merged" ? "success" : "neutral"}
    >
      {S.company.stages[task.stage]}
    </Badge>
  );
}
function Field({ title, children }: { title: string; children: ReactNode }) {
  return (
    <RuledSection level={3} title={title}>
      <p className="text-sm leading-relaxed">{children}</p>
    </RuledSection>
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
        <GlyphIcon
          d={
            task.stage === "merged"
              ? ICONS.check
              : task.stage === "review"
                ? ICONS.user
                : ICONS.search
          }
          size={18}
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

export function CompanyWorkbench() {
  const c = S.company;
  const u = c.ui;
  const [tasks, setTasks] = useState(initialCompanyTasks);
  const [surface, setSurface] = useState<Surface>("overview");
  const [view, setView] = useState<InboxView>("attention");
  const [selected, setSelected] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [navFolded, setNavFolded] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [lastCreated, setLastCreated] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const task = tasks.find((t) => t.id === selected);
  const sessionTask = tasks.find((t) => t.id === sessionId);
  const visible = tasks.filter((t) => inInbox(t, view));
  const needsReview = tasks.filter((t) => t.stage === "review").length;
  const activeTasks = tasks.filter((t) => t.stage === "working" || t.stage === "verifying");
  const done = tasks.filter((t) => t.stage === "merged").length;
  const title = (t: WorkflowTask) => t.title ?? c.samples[t.sample].title;

  function navigate(next: Surface) {
    setSurface(next);
    setMobileNav(false);
  }
  function selectTask(id: string) {
    setSelected(id);
    setTasks((current) => current.map((t) => (t.id === id ? transitionTask(t, "read") : t)));
  }
  function act(action: WorkflowAction) {
    if (!task) return;
    const updated = transitionTask(task, action);
    setTasks((current) => current.map((t) => (t.id === task.id ? updated : t)));
    setAnnouncement(
      updated.stage === "merged"
        ? updated.mergedBy === "human"
          ? c.mergedHuman
          : c.mergedAgent
        : c.stages[updated.stage],
    );
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
    setSurface("overview");
    setView("attention");
    setSelected(null);
    setSessionId(null);
    setLastCreated(null);
    setNewTask("");
    setAnnouncement("");
  }
  const nav = (key: Surface, label: string, glyph: string, badge?: ReactNode) => (
    <NavRow
      key={key}
      surface="muted"
      label={label}
      glyph={glyph}
      active={surface === key}
      badge={badge}
      onClick={() => navigate(key)}
    />
  );
  const sidebar = (
    <SidebarFrame
      modeSwitch={{
        label: u.workMode,
        control: (
          <div className="company-mode">
            <span>{u.dev}</span>
            <span aria-current="true">
              {u.company}
              <Badge size="sm">{c.prototype}</Badge>
            </span>
          </div>
        ),
      }}
      switcher={
        <div className="company-org-switcher">
          <GlyphIcon d={ICONS.building} size={18} />
          <div>
            <strong>PenguinHarness</strong>
            <span>{u.organization}</span>
          </div>
          <Badge tone="success" size="sm">
            {u.running}
          </Badge>
        </div>
      }
      pinned={
        <SidebarNavArea>
          {nav("personal", c.personal, ICONS.user)}
          {nav(
            "overview",
            u.overview,
            ICONS.dashboard,
            needsReview ? (
              <Badge tone="attention" size="sm">
                {needsReview}
              </Badge>
            ) : undefined,
          )}
        </SidebarNavArea>
      }
      account={
        <div className="company-account">
          <span className="company-avatar">{c.you.slice(0, 1)}</span>
          <span>{u.demoUser}</span>
          <Button size="xs" variant="ghost" onClick={reset}>
            {c.reset}
          </Button>
        </div>
      }
    >
      <SidebarNavGroup
        collapsed={navFolded}
        onToggle={() => setNavFolded(!navFolded)}
        expandLabel={u.expandNav}
        collapseLabel={u.collapseNav}
      >
        <SidebarNavArea>
          {nav("goals", c.goals, ICONS.target)}
          <NavRow
            surface="muted"
            label={u.chart}
            glyph={ICONS.network}
            disabled
            tooltip={u.retained}
          />
          <NavRow
            surface="muted"
            label={u.calendar}
            glyph={ICONS.calendar}
            disabled
            tooltip={u.retained}
          />
          {nav("tickets", u.tickets, ICONS.kanban)}
          <NavRow
            surface="muted"
            label={u.finance}
            glyph={ICONS.dollarCircle}
            disabled
            tooltip={u.retained}
          />
          <NavRow
            surface="muted"
            label={u.handbook}
            glyph={ICONS.bookOpen}
            disabled
            tooltip={u.retained}
          />
        </SidebarNavArea>
      </SidebarNavGroup>
      <div className="company-background-nav">
        <details>
          <summary>
            {u.channels} <span>1</span>
          </summary>
          <NavRow
            surface="muted"
            label={u.allHands}
            glyph={ICONS.users}
            disabled
            tooltip={u.retained}
          />
        </details>
        <details>
          <summary>
            {u.desks} <span>3</span>
          </summary>
          {[u.ceo, u.developer, u.verifier].map((name) => (
            <NavRow
              key={name}
              surface="muted"
              label={name}
              glyph={ICONS.user}
              disabled
              tooltip={u.retained}
            />
          ))}
        </details>
      </div>
      {sessionTask && (
        <>
          <SidebarListHeader label={u.temporary}>{null}</SidebarListHeader>
          {nav("session", title(sessionTask), ICONS.kanban)}
        </>
      )}
      <p className="company-scope-note">{u.retained}</p>
    </SidebarFrame>
  );
  const rows = (items: WorkflowTask[]) =>
    items.length ? (
      <ul className="company-inbox-rows">
        {items.map((item) => (
          <li key={item.id} data-task-id={item.id}>
            <GlyphIcon d={ICONS.kanban} size={16} />
            <div className="company-row-title">
              <button type="button" onClick={() => selectTask(item.id)}>
                {title(item)}
              </button>
              <span>
                {item.stage === "review" ? u.reviewReason : c.samples[item.sample].source}
              </span>
            </div>
            <Status task={item} />
            {item.unread && (
              <span className="company-unread" aria-label={c.unread} title={c.unread} />
            )}
            <code>{item.id}</code>
          </li>
        ))}
      </ul>
    ) : (
      <div className="company-empty">
        <p>{c.empty}</p>
        <p>{c.emptyDetail}</p>
      </div>
    );
  const surfaceTitle =
    surface === "overview"
      ? u.overview
      : surface === "tickets"
        ? u.tickets
        : surface === "session"
          ? u.taskSession
          : c[surface];
  const openSession = (id: string) => {
    setSessionId(id);
    setSelected(null);
    navigate("session");
  };
  const addComment = (id: string, text: string) =>
    setTasks((current) =>
      current.map((t) => (t.id === id ? { ...t, comments: [...t.comments, text] } : t)),
    );

  return (
    <AppShell
      nav={sidebar}
      overlays={
        <>
          <Drawer
            open={mobileNav}
            title={c.name}
            closeLabel={u.close}
            onClose={() => setMobileNav(false)}
          >
            {sidebar}
          </Drawer>
          {task && (
            <Modal
              open
              title={title(task)}
              headerless
              bare
              widthClass="sm:max-w-3xl"
              onClose={() => setSelected(null)}
            >
              <div className="company-ticket-dialog">
                <div data-slot="head" className="company-ticket-head">
                  <h2>{title(task)}</h2>
                  <Badge tone="attention">P1</Badge>
                  <CloseButton label={u.close} onClose={() => setSelected(null)} />
                </div>
                <div data-slot="body" className="company-ticket-body">
                  <div className="company-detail-meta">
                    <Status task={task} />
                    <code>{task.id}</code>
                    <span>{c.revision(task.revision)}</span>
                  </div>
                  <TaskOutcome task={task} />
                  <RuledSection level={3} title={u.summary}>
                    <dl className="company-summary-fields">
                      <dt>{u.owner}</dt>
                      <dd>{u.developer}</dd>
                      <dt>{c.goalLabel}</dt>
                      <dd>{c.goalTitle}</dd>
                      <dt>{c.source}</dt>
                      <dd>{c.samples[task.sample].source}</dd>
                    </dl>
                  </RuledSection>
                  <RuledSection level={3} title={c.tabs.evidence}>
                    <p className="company-verification-summary">
                      {task.verifiedRevision === task.revision
                        ? c.verification[task.verification]
                        : c.notRun}
                    </p>
                    <details className="company-evidence-fold" key={`${task.id}/${task.revision}`}>
                      <summary>{c.viewEvidence}</summary>
                      <VerificationPanel task={task} act={act} />
                    </details>
                  </RuledSection>
                  <Field title={u.goal}>{c.samples[task.sample].purpose}</Field>
                  <Field title={c.acceptance}>{c.samples[task.sample].acceptance}</Field>
                  <Field title={u.result}>{c.samples[task.sample].deliverable}</Field>
                  <RuledSection level={3} title={u.linkedSessions}>
                    <p className="company-muted">{c.sessionText}</p>
                    <div className="company-actions">
                      <Action onClick={() => openSession(task.id)}>{c.discuss}</Action>
                    </div>
                  </RuledSection>
                  <RuledSection level={3} title={u.notification}>
                    <div className="company-actions">
                      <Action onClick={() => act(task.unread ? "read" : "unread")}>
                        {task.unread ? c.read : c.markUnread}
                      </Action>
                      {task.snoozed || task.archived ? (
                        <Action onClick={() => act("restore")}>{c.restore}</Action>
                      ) : (
                        <>
                          <Action onClick={() => act("snooze")}>{c.snooze}</Action>
                          <Action onClick={() => act("archive")}>{c.archive}</Action>
                        </>
                      )}
                    </div>
                    <p className="company-muted">
                      {task.archived
                        ? c.archivedHint
                        : task.snoozed
                          ? c.snoozedHint
                          : u.notificationHint}
                    </p>
                  </RuledSection>
                </div>
                <div data-slot="foot" className="company-ticket-foot">
                  {task.stage === "review" ? (
                    <>
                      <p>{c.humanHint}</p>
                      <div className="company-actions">
                        <Action onClick={() => act("revise")}>{c.revise}</Action>
                        <Action primary disabled={!canApprove(task)} onClick={() => act("approve")}>
                          {c.approve}
                        </Action>
                      </div>
                    </>
                  ) : (
                    <>
                      <span>{c.stages[task.stage]}</span>
                      <Action onClick={() => setSelected(null)}>{u.close}</Action>
                    </>
                  )}
                </div>
              </div>
            </Modal>
          )}
        </>
      }
    >
      <MobileTopBar title={surfaceTitle} menuLabel={u.openNav} onMenu={() => setMobileNav(true)} />
      <PageFrame width={surface === "tickets" ? "full" : "xl"} contentClassName="company-surface">
        <PageHeader
          title={surfaceTitle}
          actions={
            surface === "overview" ? (
              <Action onClick={() => navigate("personal")}>{u.openPersonal}</Action>
            ) : undefined
          }
        />
        {surface === "overview" && (
          <>
            <header className="company-org-heading">
              <div>
                <Heading level={1} as="h2">
                  PenguinHarness
                </Heading>
                <Badge tone="success">{u.running}</Badge>
              </div>
              <p>{c.repo}</p>
              <Text variant="eyebrow">{u.mission}</Text>
              <p className="company-mission">{c.goalTitle}</p>
            </header>
            <div className="company-kpis">
              {[
                {
                  label: u.needsYou,
                  value: needsReview,
                  detail: u.reviewOnly,
                  filter: "attention" as const,
                },
                {
                  label: u.autonomous,
                  value: activeTasks.length,
                  detail: u.backgroundWork,
                  filter: "active" as const,
                },
                {
                  label: u.delivered,
                  value: done,
                  detail: u.verifiedDelivery,
                  filter: "done" as const,
                },
              ].map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <p>{item.detail}</p>
                  <Button variant="link" size="sm" onClick={() => setView(item.filter)}>
                    {u.viewTasks}
                  </Button>
                </div>
              ))}
            </div>
            <RuledSection title={c.inbox} count={visible.length}>
              <div className="company-filters" role="group" aria-label={c.inbox}>
                {FILTERS.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    aria-pressed={view === filter}
                    onClick={() => setView(filter)}
                  >
                    {c.filters[filter]}{" "}
                    <span>{tasks.filter((t) => inInbox(t, filter)).length}</span>
                  </button>
                ))}
              </div>
              {rows(visible)}
            </RuledSection>
            {view === "attention" && (
              <RuledSection title={u.autonomous} count={activeTasks.length}>
                <p className="company-muted">{c.background}</p>
                {rows(activeTasks)}
              </RuledSection>
            )}
            <RuledSection
              title={c.goals}
              actions={
                <Button variant="link" size="sm" onClick={() => navigate("goals")}>
                  {c.goalLink}
                </Button>
              }
            >
              <p className="text-sm">{c.goalTitle}</p>
              <p className="company-muted">{c.goalProgress}</p>
            </RuledSection>
            <RuledSection title={u.today}>
              <div className="company-loop-row">
                <GlyphIcon d={ICONS.clock} size={16} />
                <div>
                  <strong>{u.loopTitle}</strong>
                  <p className="company-muted">{u.loopText}</p>
                </div>
                <Badge>{u.loopSchedule}</Badge>
              </div>
            </RuledSection>
          </>
        )}
        {surface === "tickets" && (
          <>
            <p className="company-muted">{u.boardNote}</p>
            <div className="company-board">
              {(["proposed", "in_progress", "review", "done", "rejected"] as const).map(
                (column) => {
                  const items = tasks.filter((t) =>
                    column === "proposed"
                      ? t.stage === "queued"
                      : column === "in_progress"
                        ? t.stage === "working" || t.stage === "verifying"
                        : column === "review"
                          ? t.stage === "review"
                          : column === "done"
                            ? t.stage === "merged"
                            : false,
                  );
                  return (
                    <section key={column} data-column={column}>
                      <header>
                        <h2>{u.columns[column]}</h2>
                        <Badge size="sm">{items.length}</Badge>
                      </header>
                      {items.length ? (
                        items.map((item) => (
                          <button
                            className="company-board-card"
                            key={item.id}
                            onClick={() => selectTask(item.id)}
                          >
                            <strong>{title(item)}</strong>
                            <Status task={item} />
                            <span>
                              <GlyphIcon d={ICONS.user} size={14} />
                              {u.developer}
                            </span>
                          </button>
                        ))
                      ) : (
                        <p className="company-board-empty">{u.emptyColumn}</p>
                      )}
                    </section>
                  );
                },
              )}
            </div>
          </>
        )}
        {surface === "personal" && (
          <div className="company-chat">
            <div className="company-chat-intro">
              <span className="company-avatar">
                <GlyphIcon d={ICONS.user} size={18} />
              </span>
              <div>
                <Heading level={2}>{c.personalTitle}</Heading>
                <p className="company-muted">{c.personalText}</p>
              </div>
            </div>
            <RuledSection title={c.summaryTitle}>
              <p>{c.summaryLive(activeTasks.length, needsReview, done)}</p>
              {rows(tasks.filter((t) => t.stage === "review" || t.stage === "verifying"))}
            </RuledSection>
            {lastCreated && (
              <div className="company-chat-reply">
                <p>{c.taskSaved}</p>
                <Button variant="link" onClick={() => selectTask(lastCreated)}>
                  {c.savedTask}
                </Button>
              </div>
            )}
            <form onSubmit={recordTask} className="company-form company-composer">
              <label htmlFor="company-new-task">{c.newTask}</label>
              <textarea
                id="company-new-task"
                aria-label={c.newTaskLabel}
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                rows={3}
                placeholder={c.newTaskPlaceholder}
              />
              <Action type="submit" primary disabled={!newTask.trim()}>
                {c.recordTask}
              </Action>
            </form>
          </div>
        )}
        {surface === "goals" && (
          <div className="company-goals">
            <div>
              <Heading level={1} as="h2">
                {c.goalTitle}
              </Heading>
              <p>{c.goalText}</p>
            </div>
            <RuledSection title={c.planTitle} count={tasks.length}>
              <p className="company-muted">{c.planText}</p>
              <ol className="company-plan">
                {tasks.map((item) => (
                  <li key={item.id}>
                    <div>
                      <code>{item.id}</code>
                      <Button variant="link" onClick={() => selectTask(item.id)}>
                        {title(item)}
                      </Button>
                      <Status task={item} />
                    </div>
                    <p>{c.samples[item.sample].purpose}</p>
                  </li>
                ))}
              </ol>
            </RuledSection>
            <RuledSection title={c.feedbackTitle}>
              <p>{c.feedbackText}</p>
            </RuledSection>
          </div>
        )}
        {surface === "session" && sessionTask && (
          <div className="company-session">
            <div className="company-session-heading">
              <code>{sessionTask.id}</code>
              <Heading level={2}>{title(sessionTask)}</Heading>
              <Action onClick={() => selectTask(sessionTask.id)}>{u.backToTicket}</Action>
            </div>
            <SessionPanel
              key={sessionTask.id}
              task={sessionTask}
              addComment={(text) => addComment(sessionTask.id, text)}
            />
          </div>
        )}
      </PageFrame>
      <div className="company-app-status" role="status" aria-live="polite">
        {announcement || u.statusLine}
      </div>
    </AppShell>
  );
}
