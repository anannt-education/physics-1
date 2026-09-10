"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStudentActions } from "@/hooks/use-student";
import { pathwayFromProfile } from "@/lib/planner";
import type { OnboardingProfile } from "@/lib/types";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function OnboardingPage() {
  const router = useRouter();
  const { setState } = useStudentActions();
  const [name, setName] = useState("Labhesh");
  const [hours, setHours] = useState(6);
  const [physics, setPhysics] = useState<OnboardingProfile["schoolPhysics"]>("current");
  const [math, setMath] = useState<OnboardingProfile["mathConfidence"]>("medium");
  const [days, setDays] = useState<string[]>(["Mon", "Wed", "Sat"]);
  const [timezone, setTimezone] = useState("America/New_York");
  const [reduced, setReduced] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  function save() {
    if (!name.trim()) {
      setError("Enter a name so reports can address you. No account is created in this slice — progress stays in this browser.");
      return;
    }
    const draft: OnboardingProfile = {
      displayName: name.trim(),
      examYear: 2027,
      weeklyHours: hours,
      schoolPhysics: physics,
      mathConfidence: math,
      preferredDays: days,
      timezone,
      reducedMotion: reduced,
      targetScoreNote: note,
      pathway: "consolidation",
    };
    draft.pathway = pathwayFromProfile(draft);
    setState((s) => ({ ...s, profile: draft }));
    router.push("/diagnostic");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Onboarding", path: "/onboarding" },
        ]}
      />
      <div>
        <h1 className="font-heading text-3xl">Set up how your mentor will plan</h1>
        <p className="mt-2 text-muted-foreground">
          We will not compress the syllabus into a promise. Tell us your hours and physics background
          so the next move is diagnosis, not a lecture. Account creation is separate from optional
          marketing consent. This slice stores preferences only on this device. A target-score note
          is motivational context, not evidence of ability.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>May 2027 plan inputs</CardTitle>
          <CardDescription>
            Diagnosis comes next. You can save and resume at any time — interrupted setup is expected.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="name">What should we call you?</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="hours">Hours you can study in a typical week</Label>
            <Input
              id="hours"
              type="number"
              min={1}
              max={20}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
            />
          </div>
          <fieldset className="grid gap-2">
            <legend className="text-sm font-medium">School physics exposure</legend>
            {(
              [
                ["none", "I have not learned this yet / little classroom coverage"],
                ["current", "I am taking physics now"],
                ["completed", "I already had substantial classroom coverage"],
              ] as const
            ).map(([id, label]) => (
              <label key={id} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="physics"
                  checked={physics === id}
                  onChange={() => setPhysics(id)}
                />
                {label}
              </label>
            ))}
          </fieldset>
          <fieldset className="grid gap-2">
            <legend className="text-sm font-medium">Mathematics confidence (Algebra II / geometry)</legend>
            {(["low", "medium", "high"] as const).map((id) => (
              <label key={id} className="flex items-center gap-2 text-sm">
                <input type="radio" name="math" checked={math === id} onChange={() => setMath(id)} />
                {id}
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Preferred study days</legend>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((d) => (
                <Button
                  key={d}
                  type="button"
                  size="sm"
                  variant={days.includes(d) ? "default" : "outline"}
                  onClick={() =>
                    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]))
                  }
                >
                  {d}
                </Button>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-1.5">
            <Label htmlFor="tz">Timezone</Label>
            <Input id="tz" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
          </div>
          <label className="flex items-center gap-3 text-sm">
            <Switch checked={reduced} onCheckedChange={setReduced} />
            Prefer reduced motion
          </label>
          <div className="grid gap-1.5">
            <Label htmlFor="note">Optional target-score note (not used as ability evidence)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. I want structured practice before May. I am not asking the product to promise a 5."
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button onClick={save}>Save and start the diagnostic</Button>
        </CardContent>
      </Card>
    </div>
  );
}
