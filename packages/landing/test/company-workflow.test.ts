/**
 * The proposed workflow's user-visible merge rules.
 * - Given work without concerns, a successful verification merges it automatically.
 * - Given a concern, later successful agent verification still requires human approval.
 * - Given failed verification, approval cannot merge the task; repair invalidates old evidence.
 * - Given stale verification evidence, human approval cannot merge a newer revision.
 * - Given queued or merged work, simulated results cannot start it or rewrite its outcome.
 * - Given a required review, inbox actions never dismiss it or change the work's progress.
 * - Given an archived or snoozed review, new verification brings it back to the inbox.
 */
import { describe, expect, it } from "vitest";
import {
  canApprove,
  initialCompanyTasks,
  inInbox,
  transitionTask,
} from "../src/lib/company-workflow";

describe("company workflow prototype", () => {
  it("automatically merges a verified task with no concerns", () => {
    const task = initialCompanyTasks().find((t) => t.sample === "save")!;
    const result = transitionTask(task, "verify-pass");
    expect(result.stage).toBe("merged");
    expect(result.mergedBy).toBe("agent");
    expect(inInbox(result, "done")).toBe(true);
    expect(canApprove(result)).toBe(false);
  });

  it("keeps a concern for a person even after the agent's checks pass", () => {
    const task = initialCompanyTasks().find((t) => t.sample === "save")!;
    const concern = transitionTask(task, "verify-uncertain");
    const rechecked = transitionTask(concern, "verify-pass");
    expect(inInbox(rechecked, "attention")).toBe(true);
    expect(rechecked.mergedBy).toBeUndefined();
    const approved = transitionTask(rechecked, "approve");
    expect(approved.stage).toBe("merged");
    expect(approved.mergedBy).toBe("human");
  });

  it("returns a failed check to repair and cannot merge before rechecking", () => {
    const task = initialCompanyTasks()[0]!;
    const failed = transitionTask(task, "verify-fail");
    expect(failed.stage).toBe("working");
    expect(transitionTask(failed, "approve").mergedBy).toBeUndefined();
    const repair = transitionTask(failed, "revise");
    expect(repair.verifiedRevision).toBeNull();
    expect(canApprove(repair)).toBe(false);
    const rechecked = transitionTask(repair, "verify-pass");
    expect(rechecked.stage).toBe("review");
    expect(transitionTask(rechecked, "approve").stage).toBe("merged");
  });

  it("rejects approval when evidence belongs to an earlier revision", () => {
    const task = initialCompanyTasks()[0]!;
    const newer = { ...task, revision: task.revision + 1 };
    expect(canApprove(newer)).toBe(false);
    expect(transitionTask(newer, "approve").stage).toBe("review");
  });

  it("does not execute queued work or rewrite an existing merge", () => {
    const tasks = initialCompanyTasks();
    for (const sample of ["docs", "history"] as const) {
      const task = tasks.find((t) => t.sample === sample)!;
      for (const action of ["verify-pass", "verify-fail", "verify-uncertain", "approve"] as const) {
        expect(transitionTask(task, action).stage).toBe(task.stage);
      }
    }
    const merged = tasks.find((t) => t.sample === "history")!;
    expect(transitionTask(merged, "revise").stage).toBe("merged");
  });

  it("keeps execution and required review separate from inbox housekeeping", () => {
    const task = initialCompanyTasks()[0]!;
    const read = transitionTask(task, "read");
    expect(read.unread).toBe(false);
    expect(inInbox(read, "attention")).toBe(true);
    expect(transitionTask(read, "unread").unread).toBe(true);
    const snoozed = transitionTask(read, "snooze");
    expect(inInbox(snoozed, "attention")).toBe(false);
    expect(inInbox(snoozed, "later")).toBe(true);
    expect(snoozed.stage).toBe("review");
    const archived = transitionTask(snoozed, "archive");
    expect(inInbox(archived, "archived")).toBe(true);
    expect(inInbox(archived, "all")).toBe(false);
    expect(archived.needsHuman).toBe(true);
    const restored = transitionTask(archived, "restore");
    expect(inInbox(restored, "attention")).toBe(true);
    expect(inInbox(restored, "active")).toBe(false);
    expect(inInbox(restored, "all")).toBe(true);
  });

  it("returns updated verification to the inbox without clearing human review", () => {
    const task = initialCompanyTasks()[0]!;
    const hidden = transitionTask(transitionTask(task, "snooze"), "archive");
    const updated = transitionTask(hidden, "verify-pass");
    expect(inInbox(updated, "attention")).toBe(true);
    expect(updated.unread).toBe(true);
    expect(updated.mergedBy).toBeUndefined();
  });
});
