"use client";

import Link from "next/link";
import { useStudent } from "@/hooks/use-student";
import { recommend, weeklyPlanCopy } from "@/lib/planner";
import { dueReviews } from "@/lib/mastery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MasteryBadge } from "@/components/mastery/status-badge";
import { CONCEPTS } from "@/content/curriculum";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MentorNote } from "@/components/mentor/mentor-note";
import { MENTOR } from "@/content/mentor";
import { ArrowRight, Clock, Flag, ListChecks } from "lucide-react";

export default function HomePage() {
  const { state, now } = useStudent();
  const rec = recommend(state);
  const reviews = dueReviews(state, now);
  const unsynced = state.events.filter((e) => e.syncState !== "acknowledged");
  const plan = state.profile ? weeklyPlanCopy(state.profile) : null;
  const named = Boolean(state.profile);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium tracking-wide text-primary">
          Anannt Education · AP Physics 1 · May 2027 exam
        </p>
        <h1 className="mt-1 font-heading text-3xl tracking-tight sm:text-4xl">
          {named
            ? `${state.profile!.displayName}, here is today’s study — and why this is next.`
            : "AP Physics 1 prep that diagnoses first, then names the next move."}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {named
            ? "One primary action, an honest reason, and the evidence behind it. Your mentor will not invent an AP score from a Unit 1 slice, and this is not College Board’s Bluebook."
            : "Two Unit 1 motion lessons are public. Units 2–8 are unpublished. A self-study supplement — Anannt does not predict an AP score."}
        </p>
      </header>

      {unsynced.length > 0 ? (
        <Alert>
          <AlertTitle>Answers waiting for acknowledgement</AlertTitle>
          <AlertDescription>
            {unsynced.length} response{unsynced.length === 1 ? "" : "s"} are in the local buffer. They
            are not lost. They are not yet marked saved on the server.
          </AlertDescription>
        </Alert>
      ) : null}

      <Card className="border-primary/20">
        <CardHeader>
          <CardDescription>Your mentor’s next move</CardDescription>
          <CardTitle className="text-2xl">{rec.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{rec.why}</p>
          <p className="text-xs text-muted-foreground">
            Rule {rec.ruleVersion}
            {rec.evidenceIds.length > 0 ? ` · evidence ${rec.evidenceIds.slice(0, 3).join(", ")}` : ""}
          </p>
          <Button nativeButton={false} render={<Link href={rec.href} />}>
            Continue <ArrowRight />
          </Button>
        </CardContent>
      </Card>

      <section aria-labelledby="method" className="grid gap-4 md:grid-cols-3">
        <h2 id="method" className="sr-only">
          How Anannt coaches AP Physics 1
        </h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Diagnosis before lecture</CardTitle>
            <CardDescription>
              Placement is provisional. “I have not learned this yet” is not a wrong model. We name
              the gap, then assign the next task.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Graph-reading repair</CardTitle>
            <CardDescription>
              Height is position; slope is velocity. A confirmed mix-up goes to a repair path before
              new Unit 1 lessons.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Exam-aware craft</CardTitle>
            <CardDescription>
              May 2027 is hybrid: prompts on screen, FRQs on paper. Scored items need a reviewer.
              Readiness stays incomplete until more of the syllabus is covered.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
      {!named ? (
        <p className="text-sm text-muted-foreground">
          New here? Open{" "}
          <Link href="/lesson/lesson-motion-graphs" className="underline underline-offset-2">
            motion graphs
          </Link>{" "}
          then{" "}
          <Link href="/lesson/lesson-zero-v-a" className="underline underline-offset-2">
            turning points
          </Link>
          , or{" "}
          <Link href="/diagnostic" className="underline underline-offset-2">
            start the diagnostic
          </Link>
          . Read{" "}
          <Link href="/about" className="underline underline-offset-2">
            the exam guide
          </Link>
          . Units 2–8 stay unpublished.
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ListChecks className="size-4" aria-hidden="true" /> Today’s plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Retrieval: about 5–8 minutes if a delayed check is due — unseen items, not a drill loop.</p>
            <p>New learning: 12–18 minutes on the next lesson activity, with a named outcome.</p>
            <p>Independent practice: 15–20 minutes when a lesson is complete. Hints are allowed; they just do not count as mastery.</p>
            <p className="text-muted-foreground">
              The planner caps daily work and will not compress the whole syllabus into eight weeks
              without saying so.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="size-4" aria-hidden="true" /> Review due
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <MentorNote title="Nothing is due yet">{MENTOR.empty.reviews}</MentorNote>
            ) : (
              <ul className="space-y-2 text-sm">
                {reviews.map((r) => (
                  <li key={r.id}>
                    <Link className="underline" href={`/review/play?task=${r.id}`}>
                      {r.conceptId}
                    </Link>
                    <span className="text-muted-foreground"> · {r.intervalDays}-day interval</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Flag className="size-4" aria-hidden="true" /> Next milestone
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>
              Finish the Unit 1 motion-representation slice: diagnostic, two lessons, practice, and
              one handwritten explanation of a flattening graph.
            </p>
            <p className="mt-2 text-muted-foreground">
              Full mocks (42/85 and 4/95) are specified for later. This slice does not sell a
              complete syllabus.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly effort</CardTitle>
          <CardDescription>
            {plan
              ? `${state.profile?.pathway} path · ${plan.weeks} weeks · ${plan.hours} h/week planning model`
              : "Complete onboarding so your mentor can name a feasible weekly commitment."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {plan ? (
            <p className={plan.feasible ? "" : "text-amber-800"}>{plan.note}</p>
          ) : (
            <Button variant="outline" nativeButton={false} render={<Link href="/onboarding" />}>
              Open onboarding
            </Button>
          )}
        </CardContent>
      </Card>

      <section aria-labelledby="concepts">
        <h2 id="concepts" className="mb-3 font-heading text-xl">
          Concept states
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {CONCEPTS.map((c) => {
            const recd = state.concepts[c.id];
            return (
              <Card key={c.id} size="sm">
                <CardHeader>
                  <CardTitle>{c.name}</CardTitle>
                  <CardDescription>{c.outcome}</CardDescription>
                </CardHeader>
                <CardContent>
                  <MasteryBadge state={recd?.state ?? "not_assessed"} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
