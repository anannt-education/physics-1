"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useStudent } from "@/hooks/use-student";
import { recommend } from "@/lib/planner";
import { CONCEPTS, getMisconception } from "@/content/curriculum";
import { MasteryBadge } from "@/components/mastery/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { MENTOR } from "@/content/mentor";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { DIAGNOSTIC_ITEM_IDS } from "@/content/catalog";

function ResultsInner() {
  const from = useSearchParams().get("from");
  const { state } = useStudent();
  const rec = recommend(state);
  const diagAttempt = state.attempts.find((a) => a.kind === "diagnostic");
  const scoredEvents = state.events.filter((e) => e.syncState === "acknowledged");
  const independent = state.evidence.filter((e) => e.independence && e.firstAttempt && e.grader === "auto");
  const unanswered =
    from === "diagnostic" && diagAttempt
      ? DIAGNOSTIC_ITEM_IDS.filter((id) => !state.events.some((e) => e.itemId === id))
      : [];

  const nextThree = [rec];

  const diagnosticSummary =
    from === "diagnostic"
      ? CONCEPTS.map((c) => {
          const ev = independent.filter((e) => e.conceptId === c.id);
          const wrong = state.notebook.filter((n) =>
            c.misconceptions.includes(n.diagnosedMisconceptionId ?? "")
          );
          return { c, ev, wrong };
        })
      : [];

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: from === "diagnostic" ? "Diagnostic report" : "Results", path: "/results" },
        ]}
      />
      <div>
        <h1 className="font-heading text-3xl">
          {from === "diagnostic" ? "Diagnostic report" : "Results and next actions"}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Diagnosis is provisional placement, never permanent mastery. Your mentor will not state a
          confident AP readiness verdict while evidence is incomplete — that restraint is the craft.
        </p>
      </div>

      <Alert>
        <AlertTitle>Readiness assessment incomplete — on purpose</AlertTitle>
        <AlertDescription>
          Strong preparation evidence would require all units covered, two full unseen mocks, and
          reviewed FRQ points. This slice covers foundation plus two Unit 1 lessons only. A blank
          here is not a failure; it is an honest map.
        </AlertDescription>
      </Alert>

      {from === "diagnostic" ? (
        <Card>
          <CardHeader>
            <CardTitle>Strengths and gaps</CardTitle>
            <CardDescription>
              Linked to actual responses. “I have not learned this yet” is listed as unknown content, not as an incorrect model.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {diagnosticSummary.map(({ c, ev, wrong }) => (
              <div key={c.id} className="rounded-lg border p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{c.name}</p>
                  <MasteryBadge state={state.concepts[c.id]?.state ?? "not_assessed"} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Independent observations: {ev.length}. Latest misconception flags:{" "}
                  {wrong.length === 0
                    ? "none"
                    : wrong
                        .map((w) => getMisconception(w.diagnosedMisconceptionId ?? "")?.name)
                        .join(", ")}
                </p>
              </div>
            ))}
            {unanswered.length > 0 ? (
              <p className="text-sm">Unanswered diagnostic items: {unanswered.join(", ")}</p>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evidence by skill</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {(["conceptual", "representations", "mathematical", "experimental"] as const).map((d) => {
              const list = independent.filter((e) => e.dimensions.includes(d));
              const acc = list.length ? Math.round((list.filter((e) => e.correct).length / list.length) * 100) : null;
              return (
                <p key={d}>
                  {d}: {acc === null ? "insufficient evidence" : `${acc}% on ${list.length} independent items`}
                </p>
              );
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Timing</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            This slice is untimed practice. Standard-condition mock timing (85 and 95 minutes) is configured in the mock centre and is not mixed into these scores.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Acknowledged saves</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {scoredEvents.length} acknowledged event{scoredEvents.length === 1 ? "" : "s"}.{" "}
            {state.events.filter((e) => e.syncState === "pending").length} pending.{" "}
            {state.events.filter((e) => e.syncState === "failed").length} failed.
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Three next priorities</CardTitle>
          <CardDescription>
            Every recommendation names a reason, source evidence, and rule version — that is how
            Anannt coaches, not a generic LMS queue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {nextThree.map((r) => (
            <div key={r.id} className="rounded-lg border p-3">
              <p className="font-medium">{r.title}</p>
              <p className="text-sm">{r.why}</p>
              <p className="text-xs text-muted-foreground">Rule {r.ruleVersion}</p>
              <Button className="mt-2" size="sm" nativeButton={false} render={<Link href={r.href} />}>
                Go
              </Button>
            </div>
          ))}
          <p className="text-sm text-muted-foreground">
            After the required work you may open a challenge set in the practice studio. Challenge is never a prerequisite to completion.
          </p>
          <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/practice?mode=challenge" />}>
            Optional challenge
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">{MENTOR.loading.evidence}</p>}>
      <ResultsInner />
    </Suspense>
  );
}
