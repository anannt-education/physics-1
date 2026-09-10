"use client";

import { useStudent } from "@/hooks/use-student";
import { CONCEPTS, UNITS } from "@/content/curriculum";
import { MasteryBadge, CoverageBadge } from "@/components/mastery/status-badge";
import { weeklyPlanCopy } from "@/lib/planner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ProgressPage() {
  const { state } = useStudent();
  const independent = state.evidence.filter((e) => e.independence && e.grader === "auto" && e.correct !== null);
  const accuracy = independent.length
    ? Math.round((independent.filter((e) => e.correct).length / independent.length) * 100)
    : null;
  const retained = CONCEPTS.filter((c) => state.concepts[c.id]?.state === "retained").length;
  const plan = state.profile ? weeklyPlanCopy(state.profile) : null;
  const sliceUnits = UNITS.filter((u) => u.inThisSlice).length;

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Progress", path: "/progress" },
        ]}
      />
      <div>
        <h1 className="font-heading text-3xl">Progress</h1>
        <p className="mt-2 text-muted-foreground">
          Coverage, retained concepts, independent accuracy, effort, and schedule feasibility.
          Streaks and video minutes are not treated as learning success. Your mentor will not read a
          composite percent as an AP score.
        </p>
      </div>
      <Alert>
        <AlertTitle>Readiness assessment incomplete</AlertTitle>
        <AlertDescription>
          {sliceUnits} of 9 map rows are in this slice (foundation + Unit 1). Do not read a
          composite percent as an AP score — that restraint is Anannt’s method.
        </AlertDescription>
      </Alert>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card size="sm">
          <CardHeader>
            <CardTitle>Coverage</CardTitle>
            <CardDescription>Required material studied or challenged</CardDescription>
          </CardHeader>
          <CardContent>
            {CONCEPTS.filter((c) => state.concepts[c.id]?.coverage === "covered").length}/{CONCEPTS.length} slice concepts
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle>Retained</CardTitle>
            <CardDescription>Delayed unseen checks</CardDescription>
          </CardHeader>
          <CardContent>{retained}</CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle>Independent accuracy</CardTitle>
            <CardDescription>First-attempt auto scores, no hints</CardDescription>
          </CardHeader>
          <CardContent>{accuracy === null ? "Insufficient evidence — expected this early" : `${accuracy}% (${independent.length})`}</CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle>Effort</CardTitle>
            <CardDescription>Planned weekly hours</CardDescription>
          </CardHeader>
          <CardContent>{state.profile ? `${state.profile.weeklyHours} h/week` : "Not set"}</CardContent>
        </Card>
      </div>
      {plan ? (
        <Card>
          <CardHeader>
            <CardTitle>Schedule feasibility</CardTitle>
          </CardHeader>
          <CardContent>{plan.note}</CardContent>
        </Card>
      ) : null}
      <div className="grid gap-3">
        {CONCEPTS.map((c) => {
          const rec = state.concepts[c.id];
          return (
            <Card key={c.id} size="sm">
              <CardHeader>
                <CardTitle className="text-base">{c.name}</CardTitle>
                <CardDescription>{rec?.lastTransitionReason ?? "Not assessed."}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <MasteryBadge state={rec?.state ?? "not_assessed"} />
                <CoverageBadge coverage={rec?.coverage ?? "not_covered"} />
                <span className="text-xs text-muted-foreground">Rule {rec?.lastRuleVersion ?? "—"}</span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
