"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { MotionDiagram } from "@/components/physics/motion-diagram";
import { BASE_PATH } from "@/lib/mount";
import type { PublicItem, ResponsePayload, ScoreResult } from "@/lib/types";

type SubmitResult = { error?: string; result?: ScoreResult } | void;

export function QuestionPlayer({
  itemId,
  onSubmit,
  onContinue,
}: {
  itemId: string;
  onSubmit: (payload: ResponsePayload) => Promise<SubmitResult>;
  onContinue: () => void;
}) {
  const [item, setItem] = useState<PublicItem | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [choiceId, setChoiceId] = useState("");
  const [numericValue, setNumericValue] = useState("");
  const [numericUnit, setNumericUnit] = useState("");
  const [explanationText, setExplanationText] = useState("");
  const [notYetLearned, setNotYetLearned] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setItem(null);
    setLoadError(null);
    setChoiceId("");
    setNumericValue("");
    setNumericUnit("");
    setExplanationText("");
    setNotYetLearned(false);
    setHintsUsed(0);
    setSubmitted(false);
    setFeedback(null);
    fetch(`${BASE_PATH}/api/items/${itemId}`)
      .then((res) => res.json())
      .then((data: { ok?: boolean; item?: PublicItem; error?: string }) => {
        if (cancelled) return;
        if (!data.ok || !data.item) {
          setLoadError(data.error ?? "That question is not available.");
          return;
        }
        setItem(data.item);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Could not load this question.");
      });
    return () => {
      cancelled = true;
    };
  }, [itemId]);

  if (loadError) {
    return <p className="text-destructive">{loadError}</p>;
  }
  if (!item) {
    return <p className="text-muted-foreground">Loading the question…</p>;
  }

  async function submit() {
    if (!item || busy) return;
    setBusy(true);
    const payload: ResponsePayload = {
      choiceId: choiceId || undefined,
      numericValue: numericValue === "" ? null : Number(numericValue),
      numericUnit: numericUnit || undefined,
      explanationText: explanationText || undefined,
      notYetLearned,
      confidence: "medium",
      hintsUsed,
      solutionRevealed: false,
    };
    const res = await onSubmit(payload);
    setBusy(false);
    setSubmitted(true);
    if (res && "error" in res && res.error) {
      setFeedback(res.error);
      return;
    }
    if (res && "result" in res && res.result?.feedback) {
      setFeedback(res.result.feedback);
      return;
    }
    setFeedback("Recorded. Continue when you are ready.");
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        {item.stimulus ? <MotionDiagram spec={item.stimulus} /> : null}
        <p className="text-[15px] leading-relaxed">{item.prompt}</p>
        {item.accessibilityDescription ? (
          <p className="text-sm text-muted-foreground">{item.accessibilityDescription}</p>
        ) : null}

        {item.type === "mcq" && item.choices ? (
          <RadioGroup value={choiceId} onValueChange={setChoiceId} disabled={submitted}>
            {item.choices.map((choice) => (
              <label key={choice.id} className="flex items-start gap-2 rounded-lg border p-3">
                <RadioGroupItem value={choice.id} />
                <span>{choice.text}</span>
              </label>
            ))}
          </RadioGroup>
        ) : null}

        {item.type === "numerical" ? (
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <Label htmlFor="num">Value</Label>
              <Input
                id="num"
                value={numericValue}
                onChange={(e) => setNumericValue(e.target.value)}
                disabled={submitted}
              />
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={numericUnit}
                onChange={(e) => setNumericUnit(e.target.value)}
                placeholder={item.numericalUnitHint}
                disabled={submitted}
              />
            </div>
          </div>
        ) : null}

        {item.type === "explanation" || item.type === "ranking" ? (
          <div>
            <Label htmlFor="exp">Your explanation</Label>
            <Textarea
              id="exp"
              value={explanationText}
              onChange={(e) => setExplanationText(e.target.value)}
              disabled={submitted}
            />
          </div>
        ) : null}

        {item.allowNotYetLearned ? (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={notYetLearned}
              onChange={(e) => setNotYetLearned(e.target.checked)}
              disabled={submitted}
            />
            I have not learned this yet
          </label>
        ) : null}

        {hintsUsed < item.hints.length ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHintsUsed((n) => Math.min(n + 1, item.hints.length))}
            disabled={submitted}
          >
            Show a hint
          </Button>
        ) : null}
        {hintsUsed > 0 ? (
          <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            {item.hints.slice(0, hintsUsed).map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ol>
        ) : null}

        {feedback ? <p className="text-sm">{feedback}</p> : null}

        {!submitted ? (
          <Button onClick={submit} disabled={busy}>
            Check
          </Button>
        ) : (
          <Button onClick={onContinue}>Continue</Button>
        )}
      </CardContent>
    </Card>
  );
}
