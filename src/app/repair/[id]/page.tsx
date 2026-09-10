"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { getRepairPath } from "@/content/repairs";
import { getMisconception } from "@/content/curriculum";
import { QuestionPlayer } from "@/components/question/question-player";
import { MotionDiagram } from "@/components/physics/motion-diagram";
import { useStudent, useStudentActions } from "@/hooks/use-student";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Attempt } from "@/lib/types";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { MENTOR } from "@/content/mentor";
import { MentorNote } from "@/components/mentor/mentor-note";
import { useState } from "react";

export default function RepairPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const path = getRepairPath(id);
  const mc = path ? getMisconception(path.misconceptionId) : undefined;
  const router = useRouter();
  const { state } = useStudent();
  const { setState, recordScore, upsertAttempt } = useStudentActions();
  const stepIndex = state.repairProgress[id]?.stepIndex ?? 0;
  const step = path?.steps[stepIndex];
  const [correction, setCorrection] = useState("");

  if (!path || !mc) {
    return (
      <MentorNote title="That repair path is not in this slice" tone="error">
        {MENTOR.error.notFound}
      </MentorNote>
    );
  }

  const attempt: Attempt = {
    id: `att-repair-${id}`,
    kind: "repair",
    formId: id,
    itemIds: path.steps.filter((s) => s.itemId).map((s) => s.itemId!),
    status: "in_progress",
    startedAt: new Date().toISOString(),
    currentIndex: stepIndex,
    sessionId: `sess-repair-${id}`,
    timingLabel: "untimed",
  };

  function next() {
    const last = stepIndex >= path!.steps.length - 1;
    if (last) {
      setState((s) => ({
        ...s,
        repairProgress: { ...s.repairProgress, [id]: { stepIndex, completed: true } },
        notebook: s.notebook.map((n) =>
          n.diagnosedMisconceptionId === path!.misconceptionId
            ? { ...n, studentCorrection: correction || n.studentCorrection }
            : n
        ),
      }));
      router.push("/");
      return;
    }
    setState((s) => ({
      ...s,
      repairProgress: { ...s.repairProgress, [id]: { stepIndex: stepIndex + 1, completed: false } },
    }));
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: path.title, path: `/repair/${id}` },
        ]}
      />
      <div>
        <p className="text-sm font-medium tracking-wide text-primary">Your mentor named the mix-up. Struggle here is expected.</p>
        <h1 className="mt-1 font-heading text-3xl">{path.title}</h1>
        <p className="mt-2 text-muted-foreground">{path.summary}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Two ideas, named plainly</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <p className="font-medium">Your previous idea</p>
            <p>{mc.studentIdea}</p>
          </div>
          <div>
            <p className="font-medium">The scientific idea</p>
            <p>{mc.scientificIdea}</p>
          </div>
        </CardContent>
      </Card>
      {step ? (
        <Card>
          <CardHeader>
            <CardTitle>
              Step {stepIndex + 1}: {step.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {step.body ? <p>{step.body}</p> : null}
            {step.diagram ? <MotionDiagram spec={step.diagram} /> : null}
            {!step.itemId ? <Button onClick={next}>Continue</Button> : null}
          </CardContent>
        </Card>
      ) : null}
      {step?.itemId ? (
        <QuestionPlayer
          key={step.itemId}
          itemId={step.itemId}
          onSubmit={async (payload) => {
            upsertAttempt(attempt);
            return recordScore({ attempt, itemId: step.itemId!, payload });
          }}
          onContinue={next}
        />
      ) : null}
      {stepIndex >= path.steps.length - 1 ? (
        <div className="grid gap-2">
          <Label htmlFor="corr">Write a one-sentence correction in your own words — name the idea you will use next time</Label>
          <Textarea id="corr" value={correction} onChange={(e) => setCorrection(e.target.value)} />
          <Button onClick={next}>Save correction and return home</Button>
        </div>
      ) : null}
    </div>
  );
}
