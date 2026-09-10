"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type {
  Attempt,
  ErrorNotebookEntry,
  FrqAttemptState,
  MasteryEvidence,
  PublicItem,
  ResponseEvent,
  ResponsePayload,
  ScoreResult,
  StudentState,
} from "@/lib/types";
import { nowFrom } from "@/lib/planner";
import { scheduleRetrieval } from "@/lib/mastery";
import { appPath } from "@/lib/mount";
import {
  commitStudentState,
  getClientReady,
  getClientStudentState,
  getServerReady,
  getServerStudentState,
  subscribeReady,
  subscribeStudent,
  updateStudentState,
} from "@/lib/student-store";
import { getMisconception } from "@/content/curriculum";
import { LESSONS } from "@/content/lessons";

interface StudentContextValue {
  state: StudentState;
  ready: boolean;
  error: string | null;
  now: Date;
  setState: (updater: (s: StudentState) => StudentState) => void;
  replaceState: (next: StudentState) => void;
}

const StudentContext = createContext<StudentContextValue | null>(null);

export function StudentProvider({ children }: { children: ReactNode }) {
  const ready = useSyncExternalStore(subscribeReady, getClientReady, getServerReady);
  const state = useSyncExternalStore(subscribeStudent, getClientStudentState, getServerStudentState);
  const error = null;

  const setState = useCallback((updater: (s: StudentState) => StudentState) => {
    updateStudentState(updater);
  }, []);

  const replaceState = useCallback((next: StudentState) => {
    commitStudentState(next);
  }, []);

  const value = useMemo(
    () => ({
      state,
      ready,
      error,
      now: nowFrom(state),
      setState,
      replaceState,
    }),
    [state, ready, error, setState, replaceState]
  );

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudent() {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error("useStudent must be used within StudentProvider");
  return ctx;
}

let seq = 0;
function nid(prefix: string) {
  seq += 1;
  return `${prefix}-${Date.now()}-${seq}`;
}

export function useStudentActions() {
  const { state, setState, replaceState } = useStudent();

  const recordScore = useCallback(
    async (opts: {
      attempt: Attempt;
      itemId: string;
      payload: ResponsePayload;
      eventId?: string;
    }) => {
      const firstAttempt = !state.events.some(
        (e) => e.itemId === opts.itemId && e.attemptId === opts.attempt.id
      );
      const event: ResponseEvent = {
        id: opts.eventId ?? nid("evt"),
        attemptId: opts.attempt.id,
        itemId: opts.itemId,
        itemVersion: state.itemVersions[opts.itemId] ?? 1,
        sequence: opts.attempt.currentIndex,
        payload: opts.payload,
        createdAt: new Date().toISOString(),
        localSavedAt: new Date().toISOString(),
        syncState: "pending" as const,
      };

      setState((s) => ({
        ...s,
        events: [...s.events.filter((e) => e.id !== event.id), event],
      }));

      try {
        const res = await fetch(appPath("/api/score"), {
          method: "POST",
          headers: { "Content-Type": "application/json", "Idempotency-Key": event.id },
          body: JSON.stringify({
            itemId: opts.itemId,
            itemVersion: event.itemVersion,
            payload: opts.payload,
            firstAttempt,
            overrideState: state.itemOverrides[opts.itemId],
          }),
        });
        const data = (await res.json()) as {
          ok: boolean;
          error?: string;
          result?: ScoreResult;
          acknowledgedAt?: string;
          withdrawn?: boolean;
          publicItem?: PublicItem;
        };
        if (!res.ok || !data.ok || !data.result || !data.publicItem) {
          setState((s) => ({
            ...s,
            events: s.events.map((e) =>
              e.id === event.id ? { ...e, syncState: "failed" as const } : e
            ),
          }));
          return { error: data.error ?? "Scoring failed", withdrawn: data.withdrawn };
        }

        const score = data.result;
        const pub = data.publicItem;
        const evidence: MasteryEvidence = {
          id: nid("ev"),
          conceptId: pub.primaryConceptId,
          attemptId: opts.attempt.id,
          itemId: pub.id,
          itemFamilyId: pub.familyId,
          sessionId: opts.attempt.sessionId,
          independence: score.independence,
          firstAttempt: score.firstAttempt,
          correct: score.correct,
          dimensions: score.dimensions,
          createdAt: data.acknowledgedAt ?? new Date().toISOString(),
          ruleVersion: score.ruleVersion,
          grader: score.grader,
        };

        const notebookAdds: ErrorNotebookEntry[] = [];
        if (score.correct === false && score.misconceptionIds[0]) {
          const mc = getMisconception(score.misconceptionIds[0]);
          notebookAdds.push({
            id: nid("nb"),
            itemId: pub.id,
            promptSnapshot: pub.prompt,
            originalResponse: JSON.stringify(opts.payload),
            category: "representation",
            diagnosedMisconceptionId: score.misconceptionIds[0],
            explanation: mc?.scientificIdea ?? score.issue ?? score.feedback,
            repairTaskId: mc?.repairPathId,
            studentCorrection: "",
            diagnosisOverridden: false,
            createdAt: new Date().toISOString(),
          });
        }

        setState((s) => ({
          ...s,
          events: s.events.map((e) =>
            e.id === event.id
              ? { ...e, syncState: "acknowledged" as const, acknowledgedAt: data.acknowledgedAt }
              : e
          ),
          scores: { ...s.scores, [event.id]: score },
          evidence: [...s.evidence, evidence],
          notebook: [...s.notebook, ...notebookAdds],
        }));
        return { score, event, evidence };
      } catch (e) {
        setState((s) => ({
          ...s,
          events: s.events.map((ev) =>
            ev.id === event.id ? { ...ev, syncState: "failed" as const } : ev
          ),
        }));
        return { error: e instanceof Error ? e.message : "Network error" };
      }
    },
    [setState, state.events, state.itemOverrides, state.itemVersions]
  );

  const upsertAttempt = useCallback(
    (attempt: Attempt) => {
      setState((s) => ({
        ...s,
        attempts: [...s.attempts.filter((a) => a.id !== attempt.id), attempt],
      }));
    },
    [setState]
  );

  const completeLesson = useCallback(
    (lessonId: string, conceptIds: string[], retrievalItemId: string) => {
      setState((s) => {
        const lesson = LESSONS.find((l) => l.id === lessonId);
        let next = {
          ...s,
          lessonProgress: {
            ...s.lessonProgress,
            [lessonId]: {
              activityIndex: Math.max((lesson?.activities.length ?? 1) - 1, 0),
              completedIds: s.lessonProgress[lessonId]?.completedIds ?? [],
              status: "completed" as const,
            },
          },
        };
        for (const cid of conceptIds) {
          next = scheduleRetrieval(next, cid, retrievalItemId, nowFrom(next), 0);
        }
        return next;
      });
    },
    [setState]
  );

  const saveFrq = useCallback(
    (taskId: string, patch: Partial<FrqAttemptState>) => {
      setState((s) => ({
        ...s,
        frq: {
          ...s.frq,
          [taskId]: {
            taskId,
            pages: s.frq[taskId]?.pages ?? [],
            typedAlternative: s.frq[taskId]?.typedAlternative ?? "",
            selfMarkedPointIds: s.frq[taskId]?.selfMarkedPointIds ?? [],
            status: s.frq[taskId]?.status ?? "draft",
            ...patch,
          },
        },
      }));
    },
    [setState]
  );

  return { recordScore, upsertAttempt, completeLesson, saveFrq, setState, replaceState, state };
}
