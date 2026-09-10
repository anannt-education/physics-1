"use client";

import Link from "next/link";
import { UNITS, TOPICS, CONCEPTS } from "@/content/curriculum";
import { LESSONS } from "@/content/lessons";
import { UNIT_MCQ_WEIGHTS } from "@/content/exam-spec";
import { useStudent } from "@/hooks/use-student";
import { MasteryBadge, CoverageBadge } from "@/components/mastery/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { waitlistUrl } from "@/lib/gate";

export default function CoursePage() {
  const { state } = useStudent();

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Course map", path: "/course" },
        ]}
      />
      <div>
        <h1 className="font-heading text-3xl">AP Physics 1 course map</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Unit 1 kinematics is open. Units 2–8 are unpublished — we will not invent those
          lessons. Official unit names and MCQ weighting ranges come from the College Board course
          page. Ask to be told when a later unit is ready.
        </p>
      </div>
      <div className="grid gap-4">
        {UNITS.map((unit) => {
          const topics = TOPICS.filter((t) => t.unitId === unit.id);
          const concepts = CONCEPTS.filter((c) => c.unitId === unit.id);
          const lessons = LESSONS.filter((l) => l.unitId === unit.id);
          const remaining = unit.inThisSlice
            ? `${lessons.filter((l) => state.lessonProgress[l.id]?.status !== "completed").length} lesson(s) remaining in the slice`
            : `${UNIT_MCQ_WEIGHTS[unit.id]?.proposedLessons ?? unit.proposedLessons} proposed lessons — unpublished`;
          return (
            <Card key={unit.id}>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={unit.official ? "default" : "secondary"}>
                    {unit.official ? `Unit ${unit.number}` : "Foundation"}
                  </Badge>
                  <Badge variant="outline">{unit.mcqWeight}</Badge>
                  {!unit.inThisSlice ? <Badge variant="outline">Unpublished</Badge> : null}
                </div>
                <CardTitle>{unit.name}</CardTitle>
                <CardDescription>{unit.emphasis}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{remaining}</p>
                {topics.length > 0 ? (
                  <p className="text-sm">
                    Topics: {topics.map((t) => t.name).join(" · ")}
                  </p>
                ) : null}
                {concepts.map((c) => {
                  const rec = state.concepts[c.id];
                  return (
                    <div key={c.id} className="flex flex-wrap items-center gap-2 rounded-lg border p-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{c.name}</p>
                        <p className="text-sm text-muted-foreground">{c.outcome}</p>
                        {c.prerequisites.length > 0 ? (
                          <p className="text-xs text-muted-foreground">Prerequisites: {c.prerequisites.join(", ")}</p>
                        ) : null}
                      </div>
                      <MasteryBadge state={rec?.state ?? "not_assessed"} />
                      <CoverageBadge coverage={rec?.coverage ?? "not_covered"} />
                    </div>
                  );
                })}
                {lessons.map((l) => (
                  <Button key={l.id} variant="outline" size="sm" nativeButton={false} render={<Link href={`/lesson/${l.id}`} />}>
                    {state.lessonProgress[l.id]?.status === "completed" ? "Review" : "Open"} {l.title}
                  </Button>
                ))}
                {!unit.inThisSlice ? (
                  <a className="inline-block text-sm underline" href={waitlistUrl(unit.id)}>
                    Ask to be told when Unit {unit.number} lesson 1 is ready
                  </a>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
