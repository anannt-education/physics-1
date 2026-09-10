"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStudent, useStudentActions } from "@/hooks/use-student";
import { QuestionPlayer } from "@/components/question/question-player";
import { RETRIEVAL_ITEM_IDS } from "@/content/catalog";
import type { Attempt } from "@/lib/types";
import { MENTOR } from "@/content/mentor";
import { MentorNote } from "@/components/mentor/mentor-note";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { RETRIEVAL_INTERVALS_DAYS } from "@/lib/mastery";

function PlayInner() {
  const params = useSearchParams();
  const router = useRouter();
  const taskId = params.get("task");
  const { state } = useStudent();
  const { setState, recordScore, upsertAttempt } = useStudentActions();
  const task = state.reviews.find((r) => r.id === taskId);

  if (!task) {
    return (
      <MentorNote title="That delayed check is missing">
        {MENTOR.error.notFound} It may have been completed, or the link is stale. Open the notebook
        for what is actually due.
      </MentorNote>
    );
  }

  const itemId =
    task.itemId ||
    RETRIEVAL_ITEM_IDS[task.conceptId as keyof typeof RETRIEVAL_ITEM_IDS] ||
    "ret-xt-slope";

  const attempt: Attempt = {
    id: `att-ret-${task.id}`,
    kind: "retrieval",
    formId: task.id,
    itemIds: [itemId],
    status: "in_progress",
    startedAt: new Date().toISOString(),
    currentIndex: 0,
    sessionId: `sess-ret-${task.id}`,
    timingLabel: "untimed",
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Notebook", path: "/review" },
          { name: "Delayed retrieval", path: "/review/play" },
        ]}
      />
      <div>
        <h1 className="font-heading text-3xl">Delayed retrieval</h1>
        <p className="mt-2 text-muted-foreground">
          Unseen check for {task.conceptId}. An unsuccessful check shortens the next interval. Struggle
          on a later-day item is expected. This is not an endless loop: after two failed repair cycles a
          mentor option would appear in a full release.
        </p>
      </div>
      <QuestionPlayer
        itemId={itemId}
        onSubmit={async (payload) => {
          upsertAttempt(attempt);
          return recordScore({ attempt, itemId, payload });
        }}
        onContinue={() => {
          const last = [...state.evidence].reverse().find((e) => e.itemId === itemId);
          const ok = last?.correct === true;
          const nextInterval = ok
            ? Math.min(
                RETRIEVAL_INTERVALS_DAYS.indexOf(task.intervalDays) + 1,
                RETRIEVAL_INTERVALS_DAYS.length - 1
              )
            : Math.max(RETRIEVAL_INTERVALS_DAYS.indexOf(task.intervalDays) - 1, 0);
          const days = RETRIEVAL_INTERVALS_DAYS[nextInterval];
          setState((s) => ({
            ...s,
            reviews: s.reviews.map((r) =>
              r.id === task.id
                ? { ...r, status: "completed" as const }
                : r
            ).concat({
              id: `rev-${task.conceptId}-${Date.now()}`,
              conceptId: task.conceptId,
              itemId,
              dueAt: new Date(Date.now() + s.clockOffsetMs + days * 86400000).toISOString(),
              status: "scheduled",
              intervalDays: days,
              triggeringEvidenceId: last?.id,
            }),
          }));
          router.push("/review");
        }}
      />
    </div>
  );
}

export default function ReviewPlayPage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">{MENTOR.loading.retrieval}</p>}>
      <PlayInner />
    </Suspense>
  );
}
