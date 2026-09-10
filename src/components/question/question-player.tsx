"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { MotionDiagram } from "@/components/physics/motion-diagram";
import { apiPath } from "@/lib/mount";
import type { PublicItem, ResponsePayload, ScoreResult } from "@/lib/types";

type ScoreReturn =
  | { score: ScoreResult }
  | { error: string; withdrawn?: boolean };

export function QuestionPlayer({
  itemId,
  onSubmit,
  onContinue,
}: {
  itemId: string;
  onSubmit: (payload: ResponsePayload) => Promise<ScoreReturn | void>;
  onContinue?: () => void;
}) {
  const [item, setItem] = useState<PublicItem | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [choiceId, setChoiceId] = useState("");
  const [numericValue, setNumericValue] = useState("");
  const [numericUnit, setNumericUnit] = useState("");
  const [explanationText, setExplanationText] = useState("");
  const [rankingOrder, setRankingOrder] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [notYetLearned, setNotYetLearned] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setItem(null);
    setResult(null);
    setChoiceId("");
    setNumericValue("");
    setNumericUnit("");
    setExplanationText("");
    setRankingOrder([]);
    setHintsUsed(0);
    setNotYetLearned(false);
    setLoadError(null);
    fetch(apiPath(`/api/items/${itemId}`))
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok || !data.item) throw new Error(data.error ?? "Could not load the item.");
        setItem(data.item as PublicItem);
        if (data.item.ranking?.options) {
          setRankingOrder(data.item.ranking.options.map((o: { id: string }) => o.id));
        }
      })
      .catch((e) => setLoadError(e instanceof Error ? e.message : "Load failed"));
  }, [itemId]);

  if (loadError) return <p className="text-destructive">{loadError}</p>;
  if (!item) return <p className="text-muted-foreground">Loading the item…</p>;

  async function submit(extra?: Partial<ResponsePayload>) {
    if (!item || busy) return;
    setBusy(true);
    const payload: ResponsePayload = {
      choiceId: choiceId || undefined,
      numericValue: numericValue === "" ? null : Number(numericValue),
      numericUnit,
      rankingOrder: item.type === "ranking" ? rankingOrder : undefined,
      explanationText: explanationText || undefined,
      notYetLearned,
      confidence: "medium",
      hintsUsed,
      solutionRevealed: false,
      ...extra,
    };
    const res = await onSubmit(payload);
    if (res && "score" in res) setResult(res.score);
    if (res && "error" in res) setLoadError(res.error);
    setBusy(false);
  }

  return (
    <div className="space-y-4 rounded-xl border bg-card p-4">
      <p className="text-[15px] leading-relaxed">{item.prompt}</p>
      {item.stimulus ? <MotionDiagram spec={item.stimulus} /> : null}
      <p className="sr-only">{item.accessibilityDescription}</p>

      {item.type === "mcq" && item.choices ? (
        <RadioGroup value={choiceId} onValueChange={setChoiceId}>
          {item.choices.map((c) => (
            <label key={c.id} className="flex items-start gap-3 rounded-lg border p-3">
              <RadioGroupItem value={c.id} />
              <span>{c.text}</span>
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
              inputMode="decimal"
            />
          </div>
          <div>
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              value={numericUnit}
              onChange={(e) => setNumericUnit(e.target.value)}
              placeholder={item.numericalUnitHint}
            />
          </div>
        </div>
      ) : null}

      {item.type === "explanation" ? (
        <Textarea rows={5} value={explanationText} onChange={(e) => setExplanationText(e.target.value)} />
      ) : null}

      {item.type === "ranking" && item.ranking ? (
        <ol className="list-decimal space-y-2 pl-5">
          {rankingOrder.map((id, index) => {
            const opt = item.ranking?.options.find((o) => o.id === id);
            return (
              <li key={id} className="flex items-center gap-2">
                <span className="flex-1">{opt?.text}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={index === 0}
                  onClick={() => {
                    const next = [...rankingOrder];
                    [next[index - 1], next[index]] = [next[index], next[index - 1]];
                    setRankingOrder(next);
                  }}
                >
                  Up
                </Button>
              </li>
            );
          })}
        </ol>
      ) : null}

      {item.allowNotYetLearned ? (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={notYetLearned}
            onChange={(e) => setNotYetLearned(e.target.checked)}
          />
          I have not learned this yet
        </label>
      ) : null}

      {hintsUsed < item.hints.length ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setHintsUsed((n) => Math.min(n + 1, item.hints.length))}
        >
          Show hint {hintsUsed + 1}
        </Button>
      ) : null}
      {item.hints.slice(0, hintsUsed).map((h) => (
        <p key={h} className="text-sm text-muted-foreground">
          Hint: {h}
        </p>
      ))}

      {result ? (
        <div className="space-y-2 rounded-lg bg-muted/50 p-3 text-sm">
          <p>{result.feedback}</p>
          {result.issue ? <p className="text-muted-foreground">{result.issue}</p> : null}
          {onContinue ? (
            <Button onClick={onContinue}>Continue</Button>
          ) : null}
        </div>
      ) : (
        <Button disabled={busy} onClick={() => submit()}>
          Check
        </Button>
      )}
    </div>
  );
}
