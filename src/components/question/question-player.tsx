"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, ChevronRight, Lightbulb } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { gradeItem, type ItemResult } from "@/lib/scoring";
import { getStimulusFigure } from "@/components/question/stimulus-figures";
import { DiagramRenderer } from "@/components/question/diagrams";
import { trackEvent } from "@/lib/analytics";
import type { AnswerValue, Item, ItemChoice } from "@/types";

function letters(i: number) {
  return String.fromCharCode(65 + i);
}

function cloneAnswer(value: AnswerValue): AnswerValue {
  if (Array.isArray(value)) return [...value];
  return value;
}

export function QuestionPlayer({
  item,
  index,
  total,
  onSubmit,
  onNext,
  onSkip,
  lastResult,
  disabled,
}: {
  item: Item;
  index: number;
  total: number;
  onSubmit: (result: ItemResult, answer: AnswerValue) => void;
  onNext?: () => void;
  onSkip?: () => void;
  lastResult?: ItemResult;
  disabled?: boolean;
}) {
  const [answer, setAnswer] = useState<AnswerValue>(item.kind === "msq" ? [] : "");
  const [result, setResult] = useState<ItemResult | undefined>(lastResult);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submitted = Boolean(result);
  const start = useRef(Date.now());

  useEffect(() => {
    setAnswer(item.kind === "msq" ? [] : "");
    setResult(lastResult);
    setSubmitError(null);
    start.current = Date.now();
    trackEvent("item_view", { itemId: item.id, unit: item.unit, skill: item.skill });
  }, [item.id, item.kind, item.unit, item.skill, lastResult]);

  const StimulusFigure = getStimulusFigure(item.id);
  const showStimulusFigure = Boolean(StimulusFigure) && !item.diagram;

  const submit = useCallback(() => {
    if (disabled) return;
    const graded = gradeItem(item, answer);
    if (!graded) {
      setSubmitError("Choose an answer before checking.");
      return;
    }
    setSubmitError(null);
    const withTime = { ...graded, timeMs: Date.now() - start.current };
    setResult(withTime);
    onSubmit(withTime, cloneAnswer(answer));
    trackEvent("item_submit", {
      itemId: item.id,
      correct: withTime.correct,
      unit: item.unit,
    });
  }, [answer, disabled, item, onSubmit]);

  const choices = item.choices ?? [];
  const correctSet = new Set(item.correct);
  const selected = useMemo(() => {
    if (Array.isArray(answer)) return new Set(answer);
    return new Set(answer ? [String(answer)] : []);
  }, [answer]);

  return (
    <Card className="overflow-hidden border-border/70 shadow-none">
      <CardContent className="space-y-5 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <span>
            Question {index + 1} of {total}
          </span>
          <span className="rounded-full bg-muted px-2 py-1 text-[11px]">{item.difficulty}</span>
        </div>
        <div>
          {item.stimulus ? (
            <p className="mb-3 text-sm leading-6 text-muted-foreground">{item.stimulus}</p>
          ) : null}
          <p className="text-base leading-7 text-foreground">{item.prompt}</p>
          {showStimulusFigure && StimulusFigure ? (
            <div className="mt-4 overflow-x-auto rounded-xl border border-border/70 bg-muted/20 p-3">
              <StimulusFigure />
            </div>
          ) : null}
          {item.diagram ? (
            <div className="mt-4 overflow-x-auto rounded-xl border border-border/70 bg-muted/20 p-3">
              <DiagramRenderer diagram={item.diagram} />
            </div>
          ) : null}
        </div>

        {item.kind === "mcq" || item.kind === "msq" ? (
          <div className="space-y-2">
            {item.kind === "mcq" ? (
              <RadioGroup
                value={typeof answer === "string" ? answer : ""}
                onValueChange={(value) => {
                  if (!submitted) setAnswer(value);
                }}
                disabled={submitted || disabled}
              >
                {choices.map((choice, i) => (
                  <ChoiceRow
                    key={choice.id}
                    letter={letters(i)}
                    choice={choice}
                    selected={selected.has(choice.id)}
                    submitted={submitted}
                    correct={correctSet.has(choice.id)}
                    control={
                      <RadioGroupItem value={choice.id} className="mt-0.5" />
                    }
                  />
                ))}
              </RadioGroup>
            ) : (
              choices.map((choice, i) => (
                <ChoiceRow
                  key={choice.id}
                  letter={letters(i)}
                  choice={choice}
                  selected={selected.has(choice.id)}
                  submitted={submitted}
                  correct={correctSet.has(choice.id)}
                  control={
                    <Checkbox
                      checked={selected.has(choice.id)}
                      disabled={submitted || disabled}
                      onCheckedChange={(checked) => {
                        if (submitted) return;
                        const next = new Set(selected);
                        if (checked) next.add(choice.id);
                        else next.delete(choice.id);
                        setAnswer([...next]);
                      }}
                    />
                  }
                />
              ))
            )}
          </div>
        ) : null}

        {item.kind === "numeric" ? (
          <div className="max-w-xs space-y-2">
            <Label htmlFor={`num-${item.id}`}>Numeric answer</Label>
            <Input
              id={`num-${item.id}`}
              type="number"
              step="any"
              value={typeof answer === "number" || typeof answer === "string" ? answer : ""}
              disabled={submitted || disabled}
              onChange={(e) => setAnswer(e.target.value === "" ? "" : Number(e.target.value))}
            />
            {item.unitLabel ? <p className="text-xs text-muted-foreground">{item.unitLabel}</p> : null}
          </div>
        ) : null}

        {item.kind === "frq" ? (
          <div className="space-y-2">
            <Label htmlFor={`frq-${item.id}`}>Written response</Label>
            <textarea
              id={`frq-${item.id}`}
              className="min-h-40 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring"
              value={typeof answer === "string" ? answer : ""}
              disabled={submitted || disabled}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Show your reasoning, substitutions, and final claim."
            />
          </div>
        ) : null}

        {!submitted ? (
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={submit} disabled={disabled}>
              Check answer
            </Button>
            {onSkip ? (
              <Button type="button" variant="ghost" onClick={onSkip}>
                Skip for now
              </Button>
            ) : null}
          </div>
        ) : null}

        {submitError ? (
          <p className="text-sm text-destructive" role="alert">
            {submitError}
          </p>
        ) : null}

        {result ? (
          <div
            className={cn(
              "rounded-xl border p-4",
              result.correct ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50",
            )}
          >
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              {result.correct ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              ) : (
                <Lightbulb className="h-4 w-4 text-amber-700" />
              )}
              {result.correct ? "Correct" : "Not yet"}
              {item.kind === "frq" ? (
                <span className="font-normal text-muted-foreground">
                  · {result.earned} / {result.max} points
                </span>
              ) : null}
            </div>
            <p className="text-sm leading-6 text-foreground/90">{item.rationale}</p>
            {item.solutionSteps?.length ? (
              <Accordion type="single" collapsible className="mt-3">
                <AccordionItem value="steps">
                  <AccordionTrigger>Worked solution</AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal space-y-2 pl-4 text-sm">
                      {item.solutionSteps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : null}
            {onNext ? (
              <Button type="button" className="mt-4" onClick={onNext}>
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function ChoiceRow({
  letter,
  choice,
  selected,
  submitted,
  correct,
  control,
}: {
  letter: string;
  choice: ItemChoice;
  selected: boolean;
  submitted: boolean;
  correct: boolean;
  control: React.ReactNode;
}) {
  return (
    <Label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border p-3",
        selected ? "border-primary bg-primary/5" : "border-border",
        submitted && correct && "border-emerald-400 bg-emerald-50",
        submitted && selected && !correct && "border-destructive/50 bg-destructive/5",
      )}
    >
      {control}
      <span className="mt-0.5 text-xs font-semibold text-muted-foreground">{letter}</span>
      <span className="text-sm leading-6">{choice.text}</span>
    </Label>
  );
}
