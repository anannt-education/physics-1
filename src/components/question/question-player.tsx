"use client";

import { useEffect, useMemo, useState } from "react";
import type { PublicItem, ResponsePayload, ScoreResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { MotionDiagram } from "@/components/physics/motion-diagram";
import { MENTOR } from "@/content/mentor";
import { MentorNote } from "@/components/mentor/mentor-note";
import { ArrowDown, ArrowUp, Flag, Lightbulb, Loader2, Lock } from "lucide-react";

interface PlayerProps {
  itemId: string;
  onSubmit: (payload: ResponsePayload) => Promise<{
    score?: ScoreResult;
    error?: string;
    withdrawn?: boolean;
    solution?: string;
  } | void>;
  onContinue?: () => void;
  learningMode?: boolean;
  disabled?: boolean;
}

export function QuestionPlayer({
  itemId,
  onSubmit,
  onContinue,
  learningMode = true,
  disabled,
}: PlayerProps) {
  const [item, setItem] = useState<PublicItem | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [choiceId, setChoiceId] = useState<string>("");
  const [numericValue, setNumericValue] = useState("");
  const [numericUnit, setNumericUnit] = useState("");
  const [ranking, setRanking] = useState<string[]>([]);
  const [explanation, setExplanation] = useState("");
  const [confidence, setConfidence] = useState<ResponsePayload["confidence"]>("medium");
  const [hintsUsed, setHintsUsed] = useState(0);
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const [solutionText, setSolutionText] = useState<string | null>(null);
  const [selfAwarded, setSelfAwarded] = useState<string[]>([]);
  const [notYet, setNotYet] = useState(false);
  const [busy, setBusy] = useState(false);
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportNote, setReportNote] = useState("");
  const [reported, setReported] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setItem(null);
    setScore(null);
    setSubmitError(null);
    setChoiceId("");
    setNumericValue("");
    setNumericUnit("");
    setExplanation("");
    setHintsUsed(0);
    setSolutionRevealed(false);
    setSolutionText(null);
    setSelfAwarded([]);
    setNotYet(false);
    fetch(`/api/items/${itemId}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Could not load this question.");
        if (!cancelled) setItem(data.item);
      })
      .catch((e) => {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : "Load failed.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [itemId]);

  useEffect(() => {
    if (item?.ranking) setRanking(item.ranking.options.map((o) => o.id));
  }, [item]);

  const payload = useMemo<ResponsePayload>(
    () => ({
      choiceId: choiceId || undefined,
      numericValue: numericValue === "" ? null : Number(numericValue),
      numericUnit,
      rankingOrder: ranking,
      explanationText: explanation,
      notYetLearned: notYet,
      confidence,
      hintsUsed,
      solutionRevealed,
      selfAwardedPointIds: selfAwarded,
    }),
    [choiceId, numericValue, numericUnit, ranking, explanation, notYet, confidence, hintsUsed, solutionRevealed, selfAwarded]
  );

  async function submit() {
    setBusy(true);
    setSubmitError(null);
    try {
      const res = await onSubmit(payload);
      if (res?.error) {
        setSubmitError(res.error);
        return;
      }
      if (res?.score) setScore(res.score);
      if (res?.solution) setSolutionText(res.solution);
    } finally {
      setBusy(false);
    }
  }

  async function revealSolution() {
    setSolutionRevealed(true);
    const r = await fetch(`/api/items/${itemId}?solution=1`);
    const data = await r.json();
    if (data.solution) setSolutionText(data.solution);
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 py-10 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          {MENTOR.loading.question}
        </CardContent>
      </Card>
    );
  }

  if (loadError || !item) {
    return (
      <MentorNote title="Question unavailable" tone="error">
        {loadError ?? MENTOR.error.question}
      </MentorNote>
    );
  }

  const independentWillCount = hintsUsed === 0 && !solutionRevealed && !notYet && item.type !== "explanation";

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{item.type.toUpperCase()}</Badge>
          <Badge variant="secondary">{item.difficulty}</Badge>
          <Badge variant="outline">{item.sciencePractice}</Badge>
          {item.calculator === "allowed" ? (
            <Badge variant="outline">Calculator allowed</Badge>
          ) : null}
        </div>
        <CardTitle className="text-lg leading-relaxed">{item.prompt}</CardTitle>
        <p className="text-xs text-muted-foreground">{item.accessibilityDescription}</p>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        {item.stimulus ? <MotionDiagram spec={item.stimulus} /> : null}

        {item.type === "mcq" && item.choices ? (
          <RadioGroup value={choiceId} onValueChange={setChoiceId} disabled={disabled || Boolean(score)}>
            <div className="grid gap-2">
              {item.choices.map((c) => (
                <Label
                  key={c.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 has-[[data-checked]]:border-primary has-[[data-checked]]:bg-primary/5"
                >
                  <RadioGroupItem value={c.id} className="mt-0.5" />
                  <span>{c.text}</span>
                </Label>
              ))}
            </div>
          </RadioGroup>
        ) : null}

        {item.type === "numerical" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="num">Value</Label>
              <Input
                id="num"
                inputMode="decimal"
                value={numericValue}
                onChange={(e) => setNumericValue(e.target.value)}
                disabled={Boolean(score)}
                placeholder="e.g. 2.0"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={numericUnit}
                onChange={(e) => setNumericUnit(e.target.value)}
                disabled={Boolean(score)}
                placeholder={item.numericalUnitHint ?? "m/s"}
              />
            </div>
          </div>
        ) : null}

        {item.type === "ranking" && item.ranking ? (
          <ol className="grid gap-2">
            {ranking.map((id, index) => {
              const opt = item.ranking!.options.find((o) => o.id === id);
              return (
                <li key={id} className="flex items-center gap-2 rounded-lg border p-2">
                  <span className="w-6 text-muted-foreground">{index + 1}.</span>
                  <span className="flex-1">{opt?.text}</span>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    disabled={index === 0 || Boolean(score)}
                    onClick={() => {
                      const next = [...ranking];
                      [next[index - 1], next[index]] = [next[index], next[index - 1]];
                      setRanking(next);
                    }}
                    aria-label="Move up"
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    disabled={index === ranking.length - 1 || Boolean(score)}
                    onClick={() => {
                      const next = [...ranking];
                      [next[index + 1], next[index]] = [next[index], next[index + 1]];
                      setRanking(next);
                    }}
                    aria-label="Move down"
                  >
                    <ArrowDown />
                  </Button>
                </li>
              );
            })}
          </ol>
        ) : null}

        {item.type === "explanation" || item.type === "frq" ? (
          <div className="grid gap-2">
            <Label htmlFor="exp">Your explanation</Label>
            <Textarea
              id="exp"
              rows={5}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              disabled={Boolean(score)}
              placeholder="Write the physical reasoning, not only a number."
            />
            {item.explanationRubric ? (
              <div className="rounded-lg border bg-muted/40 p-3">
                <p className="mb-2 text-sm font-medium">Guided self-mark (labelled; not validated readiness)</p>
                {item.explanationRubric.map((p) => (
                  <label key={p.id} className="mb-2 flex items-start gap-2 text-sm">
                    <Checkbox
                      checked={selfAwarded.includes(p.id)}
                      onCheckedChange={(v) => {
                        setSelfAwarded((s) =>
                          v ? [...s, p.id] : s.filter((id) => id !== p.id)
                        );
                      }}
                    />
                    <span>
                      <span className="font-medium">{p.points} pt.</span> {p.criterion}
                    </span>
                  </label>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {item.allowNotYetLearned ? (
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={notYet} onCheckedChange={(v) => setNotYet(Boolean(v))} />
            I have not learned this yet
          </label>
        ) : null}

        <div className="grid gap-2">
          <p className="text-sm font-medium">How sure are you?</p>
          <div className="flex flex-wrap gap-2">
            {(["low", "medium", "high"] as const).map((c) => (
              <Button
                key={c}
                type="button"
                size="sm"
                variant={confidence === c ? "default" : "outline"}
                onClick={() => setConfidence(c)}
              >
                {c}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Confidence is a supporting signal only. It does not award mastery.
          </p>
        </div>

        {learningMode ? (
          <div className="rounded-lg border p-3">
            <p className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Lightbulb className="size-4" /> Hint ladder
            </p>
            <p className="mb-2 text-xs text-muted-foreground">
              Using a hint or the solution excludes this response from independent proficiency evidence.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => setHintsUsed((n) => Math.max(n, 1))}>
                Conceptual hint
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setHintsUsed((n) => Math.max(n, 2))}>
                Representation hint
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setHintsUsed(3)}>
                Nudge
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={revealSolution}>
                Show solution
              </Button>
            </div>
            {hintsUsed >= 1 ? <p className="mt-3 text-sm">{item.hints[0]}</p> : null}
            {hintsUsed >= 2 ? <p className="mt-2 text-sm">{item.hints[1]}</p> : null}
            {hintsUsed >= 3 ? <p className="mt-2 text-sm">{item.hints[2]}</p> : null}
            {solutionText ? (
              <Alert className="mt-3">
                <Lock />
                <AlertTitle>{MENTOR.score.solutionTitle}</AlertTitle>
                <AlertDescription>{solutionText}</AlertDescription>
              </Alert>
            ) : null}
          </div>
        ) : null}

        <p className="text-xs text-muted-foreground">
          {independentWillCount
            ? "If this is a first attempt, a correct auto-scored response can count as independent evidence."
            : "This response will not count as independent mastery evidence."}
        </p>
 mar
        {submitError ? (
          <Alert variant="destructive">
            <AlertTitle>Could not save the score</AlertTitle>
            <AlertDescription>
              {submitError} {MENTOR.error.score}
            </AlertDescription>
          </Alert>
        ) : null}

        {score ? (
          <Alert>
            <AlertTitle>
              {score.correct === true
                ? MENTOR.score.correctTitle
                : score.correct === false
                  ? MENTOR.score.incorrectTitle
                  : MENTOR.score.unknownTitle}
            </AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{score.feedback}</p>
              {score.issue ? <p>Specific issue: {score.issue}</p> : null}
              <p className="text-xs">
                Grader: {score.grader}. Independent: {score.independence ? "yes" : "no"}. Rule {score.ruleVersion}.
              </p>
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {!score ? (
            <Button onClick={submit} disabled={busy || disabled}>
              {busy ? "Saving…" : "Submit and save"}
            </Button>
          ) : (
            <Button onClick={onContinue}>Continue</Button>
          )}
          <Button type="button" variant="ghost" size="sm" onClick={() => setReportOpen((v) => !v)}>
            <Flag /> Report an error
          </Button>
        </div>
        {reportOpen ? (
          <div className="grid gap-2">
            <Textarea
              value={reportNote}
              onChange={(e) => setReportNote(e.target.value)}
              placeholder="Describe the issue. Content errors are routed to academic review."
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setReported(true);
                setReportOpen(false);
              }}
            >
              Send to review queue
            </Button>
          </div>
        ) : null}
        {reported ? (
          <p className="text-sm text-muted-foreground">
            Report recorded locally for this slice. In production it would open an academic ticket without changing your attempt.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
