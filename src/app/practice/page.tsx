"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { QuestionPlayer } from "@/components/question/question-player";
import { useStudent, useStudentActions } from "@/hooks/use-student";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Attempt, Difficulty, PublicItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { MENTOR } from "@/content/mentor";
import { MentorNote } from "@/components/mentor/mentor-note";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

function PracticeInner() {
  const params = useSearchParams();
  const challenge = params.get("mode") === "challenge";
  const { state } = useStudent();
  const { upsertAttempt, recordScore } = useStudentActions();
  const [filter, setFilter] = useState<"all" | Difficulty>(challenge ? "transfer" : "all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [items, setItems] = useState<PublicItem[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/items?pool=practice")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Could not load practice items.");
        setItems(data.items);
      })
      .catch((e) => setLoadError(e instanceof Error ? e.message : "Load failed"))
      .finally(() => setLoading(false));
  }, []);

  const withdrawn = state.itemOverrides;

  const attempt: Attempt = useMemo(
    () =>
      state.attempts.find((a) => a.kind === "practice" && a.status === "in_progress") ?? {
        id: `att-practice-${state.profile?.displayName ?? "local"}`,
        kind: "practice",
        formId: "practice-u1",
        itemIds: items.map((i) => i.id),
        status: "in_progress",
        startedAt: new Date().toISOString(),
        currentIndex: 0,
        sessionId: `sess-practice-${Date.now()}`,
        timingLabel: "untimed",
      },
    [state.attempts, state.profile?.displayName, items]
  );

  const answered = new Set(state.events.filter((e) => e.attemptId === attempt.id).map((e) => e.itemId));
  const visible = items.filter((i) => {
    if (withdrawn[i.id] === "withdrawn") return false;
    if (filter === "all") return true;
    return i.difficulty === filter;
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Practice", path: "/practice" },
        ]}
      />
      <div>
        <h1 className="font-heading text-3xl">Practice studio</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {challenge
            ? "Challenge route: transfer items only. You are not required to replay instruction — that is the honest next move when independent evidence is already in."
            : "Filter by difficulty. Protected mock items are excluded. Hinted or solution-exposed answers do not count as independent evidence — using a hint is allowed; it just changes what the score means."}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {(["all", "foundation", "standard", "transfer"] as const).map((f) => (
          <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>
            {f}
          </Button>
        ))}
      </div>
      {loading ? <p className="text-muted-foreground">{MENTOR.loading.practice}</p> : null}
      {loadError ? (
        <MentorNote title="Practice bank did not load" tone="error">
          {loadError}
        </MentorNote>
      ) : null}
      {!loading && visible.length === 0 ? (
        <MentorNote title="Nothing in this filter">{MENTOR.empty.practice}</MentorNote>
      ) : null}
      <Button
        variant="outline"
        onClick={() =>
          upsertAttempt({
            ...attempt,
            status: "completed",
            completedAt: new Date().toISOString(),
          })
        }
      >
        Mark this practice session complete
      </Button>
      {activeId ? (
        <div className="space-y-3">
          <Button variant="ghost" onClick={() => setActiveId(null)}>
            Back to the list
          </Button>
          <QuestionPlayer
            itemId={activeId}
            onSubmit={async (payload) => {
              upsertAttempt(attempt);
              return recordScore({ attempt, itemId: activeId, payload });
            }}
            onContinue={() => setActiveId(null)}
          />
        </div>
      ) : (
        <div className="grid gap-3">
          {visible.map((item) => (
            <Card key={item.id} size="sm">
              <CardHeader>
                <CardTitle className="flex flex-wrap items-center gap-2 text-base">
                  {item.id}
                  <Badge variant="outline">{item.difficulty}</Badge>
                  <Badge variant="secondary">{item.type}</Badge>
                  {answered.has(item.id) ? <Badge variant="secondary">Attempted</Badge> : null}
                </CardTitle>
                <CardDescription>{item.prompt}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" onClick={() => setActiveId(item.id)}>
                  Open
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">{MENTOR.loading.practice}</p>}>
      <PracticeInner />
    </Suspense>
  );
}
