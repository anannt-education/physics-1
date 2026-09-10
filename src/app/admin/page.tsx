"use client";

import { useEffect, useState } from "react";
import { useStudent, useStudentActions } from "@/hooks/use-student";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MENTOR } from "@/content/mentor";
import { MentorNote } from "@/components/mentor/mentor-note";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import type { PublicationState } from "@/lib/types";
import { appPath } from "@/lib/mount";

interface AdminItem {
  id: string;
  version: number;
  prompt: string;
  type: string;
  exposurePool: string;
  publicationState: PublicationState;
  authorId: string;
  reviewerId?: string;
  familyId: string;
  unitId: string;
  solution: string;
}

export default function AdminPage() {
  const { state } = useStudent();
  const { setState } = useStudentActions();
  const [items, setItems] = useState<AdminItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("Diagram axis label corrected after independent review.");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch(appPath("/api/admin/items"))
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Could not load the CMS queue.");
        setItems(data.items);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Load failed"))
      .finally(() => setLoading(false));
  }, []);

  const effective = (item: AdminItem): PublicationState =>
    state.itemOverrides[item.id] ?? item.publicationState;

  function transition(item: AdminItem, to: PublicationState, action: "publish" | "withdraw" | "submit_review") {
    if (action === "publish" && state.role !== "reviewer") {
      setError("An author cannot independently publish their own scored item. Switch to the reviewer role — that two-person gate is Anannt’s standard, not a suggestion.");
      return;
    }
    const from = effective(item);
    setState((s) => ({
      ...s,
      itemOverrides: { ...s.itemOverrides, [item.id]: to },
      cmsEvents: [
        ...s.cmsEvents,
        {
          id: `cms-${Date.now()}`,
          at: new Date().toISOString(),
          actorId: s.actorId,
          action: action === "submit_review" ? "submit_review" : action,
          itemId: item.id,
          fromState: from,
          toState: to,
          reason,
          version: item.version,
        },
      ],
    }));
    setError(null);
  }

  const affected = (itemId: string) =>
    state.events.filter((e) => e.itemId === itemId).map((e) => e.attemptId);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Authoring", path: "/admin" },
        ]}
      />
      <div>
        <h1 className="font-heading text-3xl">Author / reviewer console</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Signed-in role: {state.role} ({state.actorId}). Anannt’s publish rule: a second person must
          publish a scored item. Withdrawing hides it from new student attempts. Prior attempts pin
          the item version they used and are not rescored. That gate is how keys stay exam-aware.
        </p>
      </div>
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Action blocked</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {loading ? <p className="text-muted-foreground">{MENTOR.loading.admin}</p> : null}
      <div className="grid gap-1.5">
        <label className="text-sm font-medium" htmlFor="reason">
          Audit reason (required for publish or withdraw)
        </label>
        <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} />
      </div>
      <div className="grid gap-3">
        {items
          .filter((i) => i.publicationState !== "published" || i.exposurePool === "practice")
          .sort((a, b) => {
            const rank = (item: AdminItem) => (item.publicationState === "published" ? 1 : 0);
            return rank(a) - rank(b);
          })
          .slice(0, 12)
          .map((item) => {
            const pub = effective(item);
            const attempts = affected(item.id);
            return (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{pub}</Badge>
                    <Badge variant="secondary">v{item.version}</Badge>
                    <Badge variant="outline">{item.exposurePool}</Badge>
                  </div>
                  <CardTitle className="text-base">{item.id}</CardTitle>
                  <CardDescription>
                    Author {item.authorId}
                    {item.reviewerId ? ` · reviewer ${item.reviewerId}` : " · no reviewer yet"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>{item.prompt}</p>
                  {selected === item.id ? <p className="eq text-muted-foreground">{item.solution}</p> : null}
                  <Button size="sm" variant="ghost" onClick={() => setSelected(selected === item.id ? null : item.id)}>
                    {selected === item.id ? "Hide key" : "Show key (reviewer)"}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Affected attempts if withdrawn: {attempts.length === 0 ? "none yet" : attempts.join(", ")}. Those records keep version {item.version}.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pub === "draft" || pub === "in_review" ? (
                      <Button size="sm" onClick={() => transition(item, "published", "publish")}>
                        Publish as reviewer
                      </Button>
                    ) : null}
                    {pub === "published" ? (
                      <Button size="sm" variant="destructive" onClick={() => transition(item, "withdrawn", "withdraw")}>
                        Withdraw
                      </Button>
                    ) : null}
                    {pub === "withdrawn" ? (
                      <Button size="sm" variant="outline" onClick={() => transition(item, "in_review", "submit_review")}>
                        Return to review
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Audit log</CardTitle>
        </CardHeader>
        <CardContent>
          {state.cmsEvents.length === 0 ? (
            <MentorNote title="No CMS actions yet">{MENTOR.empty.cms}</MentorNote>
          ) : (
            <ul className="space-y-2 text-sm">
              {state.cmsEvents
                .slice()
                .reverse()
                .map((e) => (
                  <li key={e.id}>
                    {new Date(e.at).toLocaleString()} · {e.actorId} · {e.action} · {e.itemId} · {e.fromState} → {e.toState} · {e.reason}
                  </li>
                ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
