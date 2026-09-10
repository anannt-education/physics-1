"use client";

import { EXAM_SPEC } from "@/content/exam-spec";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MENTOR } from "@/content/mentor";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MocksPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Mocks", path: "/mocks" },
        ]}
      />
      <div>
        <h1 className="font-heading text-3xl">May 2027 exam specification</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Full protected mocks are not in this Unit 1 slice — your mentor will not pretend they
          are. The May 2027 configuration is stored as versioned data so later forms can enforce 42
          questions in 85 minutes and 4 free-response questions in 95 minutes with equal section
          weight.
        </p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-2">
            <Badge>Exam year {EXAM_SPEC.year}</Badge>
            <Badge variant="outline">Spec {EXAM_SPEC.version}</Badge>
          </div>
          <CardTitle>{EXAM_SPEC.id}</CardTitle>
          <CardDescription>
            Source verified {EXAM_SPEC.verifiedOn}. {EXAM_SPEC.approval}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {EXAM_SPEC.sections.map((s) => (
              <div key={s.id} className="rounded-lg border p-3">
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-muted-foreground">
                  {s.questionCount} questions · {s.durationMinutes} minutes · {s.weightPercent}%
                </p>
              </div>
            ))}
          </div>
          <p className="text-sm">{EXAM_SPEC.calculator}</p>
          <p className="text-sm">{EXAM_SPEC.delivery}</p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {EXAM_SPEC.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">
            Official reference:{" "}
            <a className="underline" href={EXAM_SPEC.sourceUrl} target="_blank" rel="noreferrer">
              College Board AP Physics 1 exam page
            </a>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Equipment checklist (for later timed forms)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <ul className="list-disc space-y-1 pl-5">
            <li>Approved calculator</li>
            <li>Paper and dark pen for FRQs</li>
            <li>Quiet block of at least 85 + 95 minutes plus a configured break</li>
            <li>Upload window after writing time ends — no answer editing during upload-only time</li>
          </ul>
        </CardContent>
      </Card>
      <Alert>
        <AlertTitle>Attempt history</AlertTitle>
        <AlertDescription>{MENTOR.empty.mocks}</AlertDescription>
      </Alert>
    </div>
  );
}
