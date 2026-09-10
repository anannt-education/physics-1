"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { QuestionPlayer } from "@/components/question/question-player";
import { useStudent, useStudentActions } from "@/hooks/use-student";
import { DIAGNOSTIC_ITEM_IDS } from "@/content/catalog";
import { Progress } from "@/components/ui/progress";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Button } from "@/components/ui/button";
import type { Attempt } from "@/lib/types";
import { redirectToGate } from "@/lib/gate-client";

const FORM = "foundation-diagnostic-v1";

export default function DiagnosticPage() {
  const router = useRouter();
  const { state } = useStudent();
  const { upsertAttempt, recordScore } = useStudentActions();

  const attempt = useMemo(() => {
    return (
      state.attempts.find((a) => a.kind === "diagnostic" && a.status !== "abandoned") ?? null
    );
  }, [state.attempts]);

  useEffect(() => {
    if (!attempt) {
      const next: Attempt = {
        id: `att-diag-${Date.now()}`,
        kind: "diagnostic",
        formId: FORM,
        itemIds: [...DIAGNOSTIC_ITEM_IDS],
        status: "in_progress",
        startedAt: new Date().toISOString(),
        currentIndex: 0,
        sessionId: `sess-diag-${Date.now()}`,
        timingLabel: "untimed",
      };
      upsertAttempt(next);
    }
  }, [attempt, upsertAttempt]);

  useEffect(() => {
    if (attempt?.status === "completed") {
      redirectToGate("u1");
    }
  }, [attempt?.status]);

  if (!attempt) {
    return (
      <div className="space-y-4">
        <h1 className="font-heading text-3xl">Foundation diagnostic</h1>
        <p className="text-muted-foreground">Preparing a resumable diagnostic attempt. We will pick up here if you refresh.</p>
      </div>
    );
  }

  if (attempt.status === "completed") {
    return (
      <div className="space-y-4">
        <h1 className="font-heading text-3xl">Foundation diagnostic</h1>
        <p className="text-muted-foreground">Opening your diagnostic report — placement, not a verdict.</p>
      </div>
    );
  }

  const itemId = attempt.itemIds[attempt.currentIndex];
  const pct = Math.round((attempt.currentIndex / attempt.itemIds.length) * 100);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Diagnostic", path: "/diagnostic" },
        ]}
      />
      <div>
        <h1 className="font-heading text-3xl">Foundation diagnostic</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          About 20–30 minutes. Choose “I have not learned this yet” when the idea is new — that is not
          the same as an incorrect model, and it is not a failure. Answers save locally immediately and
          are acknowledged by the scoring service. Refreshing restores this attempt.
        </p>
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">
          Item {attempt.currentIndex + 1} of {attempt.itemIds.length}
        </p>
        <Progress value={pct} />
      </div>
      <QuestionPlayer
        key={itemId}
        itemId={itemId}
        onSubmit={async (payload) => {
          const res = await recordScore({ attempt, itemId, payload });
          return res;
        }}
        onContinue={() => {
          const nextIndex = attempt.currentIndex + 1;
          if (nextIndex >= attempt.itemIds.length) {
            upsertAttempt({
              ...attempt,
              currentIndex: nextIndex,
              status: "completed",
              completedAt: new Date().toISOString(),
            });
            redirectToGate("u1");
          } else {
            upsertAttempt({ ...attempt, currentIndex: nextIndex });
          }
        }}
      />
      <Button
        variant="ghost"
        onClick={() => router.push("/")}
      >
        Save and exit — resume from today’s plan
      </Button>
    </div>
  );
}
