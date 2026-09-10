"use client";

import { use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getLesson } from "@/content/lessons";
import { QuestionPlayer } from "@/components/question/question-player";
import { MotionDiagram } from "@/components/physics/motion-diagram";
import { useStudent, useStudentActions } from "@/hooks/use-student";
import { RETRIEVAL_ITEM_IDS } from "@/content/catalog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { MENTOR } from "@/content/mentor";
import { MentorNote } from "@/components/mentor/mentor-note";
import type { Attempt } from "@/lib/types";
import { trackEvent } from "@/lib/events";
import { continueOrStart } from "@/lib/gate-client";
import { PUBLIC_LESSON_2 } from "@/lib/mount";

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const lesson = getLesson(id);
  const router = useRouter();
  const { state } = useStudent();
  const { setState, recordScore, upsertAttempt, completeLesson } = useStudentActions();

  const progress = state.lessonProgress[id] ?? {
    activityIndex: 0,
    completedIds: [],
    status: "not_started" as const,
  };
  const activity = lesson?.activities[progress.activityIndex];

  const attempt = useMemo(() => {
    return state.attempts.find((a) => a.formId === id && a.kind === "lesson" && a.status === "in_progress");
  }, [state.attempts, id]);

  if (!lesson) {
    return (
      <MentorNote title="That lesson is not in this slice" tone="error">
        {MENTOR.error.notFound}
      </MentorNote>
    );
  }

  const pct = Math.round((progress.activityIndex / lesson.activities.length) * 100);

  function ensureAttempt(itemId: string): Attempt {
    if (attempt) return attempt;
    const next: Attempt = {
      id: `att-lesson-${id}`,
      kind: "lesson",
      formId: id,
      itemIds: lesson!.activities.filter((a) => a.itemId).map((a) => a.itemId!),
      status: "in_progress",
      startedAt: new Date().toISOString(),
      currentIndex: 0,
      sessionId: `sess-lesson-${id}`,
      timingLabel: "untimed",
    };
    upsertAttempt(next);
    return next;
  }

  function advance() {
    const nextIndex = progress.activityIndex + 1;
    const done = nextIndex >= lesson!.activities.length;
    if (done) {
      const conceptId = lesson!.conceptIds[0];
      const retrievalId =
        RETRIEVAL_ITEM_IDS[conceptId as keyof typeof RETRIEVAL_ITEM_IDS] ?? "ret-xt-slope";
      completeLesson(id, lesson!.conceptIds, retrievalId);
      if (id === PUBLIC_LESSON_2.id) {
        trackEvent("lesson2_complete", { sku: id });
        if (continueOrStart(PUBLIC_LESSON_2.unit)) return;
      }
      router.push("/results?from=lesson");
      return;
    }
    setState((s) => ({
      ...s,
      lessonProgress: {
        ...s.lessonProgress,
        [id]: {
          activityIndex: nextIndex,
          completedIds: [...new Set([...(s.lessonProgress[id]?.completedIds ?? []), activity!.id])],
          status: "in_progress",
        },
      },
    }));
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Course map", path: "/course" },
          { name: lesson.title, path: `/lesson/${id}` },
        ]}
      />
      <div>
        <p className="text-sm text-muted-foreground">
          Unit 1 · {lesson.estimatedMinutes} min target · activity {progress.activityIndex + 1} of {lesson.activities.length}
        </p>
        <h1 className="font-heading text-3xl">{lesson.title}</h1>
        <p className="mt-2 text-muted-foreground">{lesson.outcome}</p>
      </div>
      <Progress value={pct} />

      {activity ? (
        <Card>
          <CardHeader>
            <CardTitle>{activity.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.body
              ? activity.body.split("\n\n").map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))
              : null}
            {activity.diagram ? <MotionDiagram spec={activity.diagram} /> : null}
            {activity.worked ? (
              <dl className="grid gap-3 text-sm">
                <div>
                  <dt className="font-medium">System</dt>
                  <dd>{activity.worked.system}</dd>
                </div>
                <div>
                  <dt className="font-medium">Principle</dt>
                  <dd>{activity.worked.principle}</dd>
                </div>
                <div>
                  <dt className="font-medium">Assumptions</dt>
                  <dd>{activity.worked.assumptions}</dd>
                </div>
                {activity.worked.diagram ? <MotionDiagram spec={activity.worked.diagram} /> : null}
                <div>
                  <dt className="font-medium">Reasoning</dt>
                  <dd>
                    <ol className="list-decimal space-y-1 pl-5">
                      {activity.worked.reasoning.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ol>
                  </dd>
                </div>
                {activity.worked.calculation ? (
                  <div>
                    <dt className="font-medium">Calculation</dt>
                    <dd className="eq">{activity.worked.calculation}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="font-medium">Interpretation</dt>
                  <dd>{activity.worked.interpretation}</dd>
                </div>
              </dl>
            ) : null}
            {activity.partial ? (
              <ul className="list-disc pl-5 text-sm">
                {activity.partial.given.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            ) : null}
            {!activity.itemId ? (
              <Button onClick={advance}>Continue</Button>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {activity?.itemId ? (
        <QuestionPlayer
          key={activity.itemId}
          itemId={activity.itemId}
          onSubmit={async (payload) =>
            recordScore({ attempt: ensureAttempt(activity.itemId!), itemId: activity.itemId!, payload })
          }
          onContinue={advance}
        />
      ) : null}
    </div>
  );
}
