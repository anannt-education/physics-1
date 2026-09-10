"use client";

import Link from "next/link";
import { useStudent, useStudentActions } from "@/hooks/use-student";
import { getMisconception } from "@/content/curriculum";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MENTOR } from "@/content/mentor";
import { MentorNote } from "@/components/mentor/mentor-note";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { dueReviews } from "@/lib/mastery";

export default function ReviewPage() {
  const { state, now } = useStudent();
  const { setState } = useStudentActions();
  const due = dueReviews(state, now);

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Notebook", path: "/review" },
        ]}
      />
      <div>
        <h1 className="font-heading text-3xl">Review notebook</h1>
        <p className="mt-2 text-muted-foreground">
          Each entry keeps the original response, the diagnosed idea, a repair task, and a retest
          date. You can correct an inaccurate diagnosis — naming the mix-up is the method, not a
          permanent label.
        </p>
      </div>
      <section>
        <h2 className="mb-3 font-heading text-xl">Retrieval due</h2>
        {due.length === 0 ? (
          <MentorNote title="Nothing is due">{MENTOR.empty.reviews}</MentorNote>
        ) : (
          <ul className="grid gap-3">
            {due.map((t) => (
              <Card key={t.id} size="sm">
                <CardHeader>
                  <CardTitle>{t.conceptId}</CardTitle>
                  <CardDescription>
                    {t.intervalDays}-day interval · due {new Date(t.dueAt).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button size="sm" nativeButton={false} render={<Link href={`/review/play?task=${t.id}`} />}>
                    Open delayed check
                  </Button>
                </CardContent>
              </Card>
            ))}
          </ul>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="font-heading text-xl">Error log</h2>
        {state.notebook.length === 0 ? (
          <MentorNote title="No recorded errors yet">{MENTOR.empty.notebook}</MentorNote>
        ) : (
          state.notebook.map((n) => {
            const mc = n.diagnosedMisconceptionId ? getMisconception(n.diagnosedMisconceptionId) : undefined;
            return (
              <Card key={n.id}>
                <CardHeader>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{n.category.replace("_", " ")}</Badge>
                    {n.diagnosisOverridden ? <Badge variant="secondary">Diagnosis overridden</Badge> : null}
                  </div>
                  <CardTitle className="text-base">{n.promptSnapshot}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>
                    <span className="font-medium">Original response: </span>
                    {n.originalResponse}
                  </p>
                  <p>
                    <span className="font-medium">Diagnosed idea: </span>
                    {mc?.name ?? "Untagged"}
                  </p>
                  <p>{n.explanation}</p>
                  {n.repairTaskId ? (
                    <Button size="sm" variant="outline" nativeButton={false} render={<Link href={`/repair/${n.repairTaskId}`} />}>
                      Open repair
                    </Button>
                  ) : null}
                  <Textarea
                    value={n.studentCorrection}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        notebook: s.notebook.map((x) =>
                          x.id === n.id ? { ...x, studentCorrection: e.target.value } : x
                        ),
                      }))
                    }
                    placeholder="One-sentence correction in your own words — name the idea you will use next time"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      setState((s) => ({
                        ...s,
                        notebook: s.notebook.map((x) =>
                          x.id === n.id ? { ...x, diagnosisOverridden: true, diagnosedMisconceptionId: undefined } : x
                        ),
                      }))
                    }
                  >
                    This diagnosis is inaccurate
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </section>
    </div>
  );
}
