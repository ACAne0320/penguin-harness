/**
 * State for the company-mode design prototype only. Nothing here calls the company API or Git.
 * Verification and a person's inbox are separate: reading, snoozing and archiving never merge
 * work. Once a concern has requested human review, subsequent agent checks cannot clear it.
 */
export type WorkStage = "queued" | "working" | "verifying" | "review" | "merged";
export type Verification = "pending" | "passed" | "failed" | "uncertain";
export type InboxView = "attention" | "active" | "done" | "later" | "archived" | "all";

export interface WorkflowTask {
  id: string;
  sample: "save" | "retry" | "setup" | "history" | "docs" | "custom";
  title?: string;
  stage: WorkStage;
  verification: Verification;
  needsHuman: boolean;
  revision: number;
  verifiedRevision: number | null;
  unread: boolean;
  snoozed: boolean;
  archived: boolean;
  mergedBy?: "agent" | "human";
  comments: string[];
}

export type WorkflowAction =
  | "verify-pass"
  | "verify-uncertain"
  | "verify-fail"
  | "approve"
  | "revise"
  | "read"
  | "unread"
  | "snooze"
  | "restore"
  | "archive";

export function initialCompanyTasks(): WorkflowTask[] {
  const task = (
    id: string,
    sample: WorkflowTask["sample"],
    stage: WorkStage,
    verification: Verification = "pending",
  ): WorkflowTask => ({
    id,
    sample,
    stage,
    verification,
    needsHuman: stage === "review",
    revision: 1,
    verifiedRevision: verification === "pending" ? null : 1,
    unread: stage === "review" || stage === "merged",
    snoozed: false,
    archived: false,
    comments: [],
  });
  return [
    task("WK-104", "retry", "review", "uncertain"),
    task("WK-103", "save", "verifying"),
    task("WK-102", "setup", "working"),
    { ...task("WK-101", "history", "merged", "passed"), mergedBy: "agent" },
    { ...task("WK-100", "docs", "queued"), snoozed: true },
  ];
}

export function canApprove(task: WorkflowTask): boolean {
  return (
    task.stage === "review" &&
    task.verifiedRevision === task.revision &&
    (task.verification === "passed" || task.verification === "uncertain")
  );
}

export function transitionTask(task: WorkflowTask, action: WorkflowAction): WorkflowTask {
  switch (action) {
    case "read":
      return { ...task, unread: false };
    case "unread":
      return { ...task, unread: true };
    case "snooze":
      return { ...task, snoozed: true };
    case "restore":
      return { ...task, snoozed: false, archived: false };
    case "archive":
      return { ...task, archived: true, unread: false };
    case "approve":
      return canApprove(task)
        ? { ...task, stage: "merged", mergedBy: "human", snoozed: false, archived: false }
        : task;
    case "revise":
      if (task.stage === "merged") return task;
      return {
        ...task,
        stage: "working",
        verification: "pending",
        needsHuman: true,
        revision: task.revision + 1,
        verifiedRevision: null,
        snoozed: false,
        archived: false,
      };
    case "verify-pass":
    case "verify-uncertain":
    case "verify-fail": {
      if (task.stage === "merged" || task.stage === "queued") return task;
      const verification =
        action === "verify-pass" ? "passed" : action === "verify-fail" ? "failed" : "uncertain";
      const needsHuman = task.needsHuman || verification !== "passed";
      const stage = verification === "failed" ? "working" : needsHuman ? "review" : "merged";
      return {
        ...task,
        verification,
        needsHuman,
        stage,
        verifiedRevision: task.revision,
        unread: true,
        snoozed: false,
        archived: false,
        ...(stage === "merged" ? { mergedBy: "agent" as const } : {}),
      };
    }
  }
}

export function inInbox(task: WorkflowTask, view: InboxView): boolean {
  if (view === "archived") return task.archived;
  if (task.archived) return false;
  if (view === "all") return true;
  if (view === "later") return task.snoozed;
  if (task.snoozed) return false;
  if (view === "attention") return task.stage === "review";
  if (view === "done") return task.stage === "merged";
  return task.stage === "working" || task.stage === "verifying" || task.stage === "queued";
}
