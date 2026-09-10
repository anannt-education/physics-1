import { MASTERY_RULE_VERSION } from "@/lib/types";
import type { Item, ResponsePayload, ScoreResult, SkillDimension } from "@/lib/types";

const UNIT_ALIASES: Record<string, string> = {
  s: "s",
  sec: "s",
  seconds: "s",
  m: "m",
  "m/s": "m/s",
  "m s^-1": "m/s",
  "m·s^-1": "m/s",
  "m/s^2": "m/s^2",
  "m/s²": "m/s^2",
  "m s^-2": "m/s^2",
};

function normalizeUnit(unit: string) {
  return UNIT_ALIASES[unit.trim()] ?? unit.trim().toLowerCase();
}

function dimensionsFor(item: Item): SkillDimension[] {
  const map: Record<string, SkillDimension> = {
    conceptual: "conceptual",
    representations: "representations",
    mathematical: "mathematical",
    experimental: "experimental",
  };
  const primary = map[item.sciencePractice] ?? "conceptual";
  return [primary];
}

function independence(payload: ResponsePayload): boolean {
  return !payload.solutionRevealed && payload.hintsUsed === 0 && !payload.notYetLearned;
}

export function scoreItem(
  item: Item,
  payload: ResponsePayload,
  firstAttempt: boolean
): ScoreResult {
  const dims = dimensionsFor(item);
  const independent = independence(payload);

  if (payload.notYetLearned) {
    return {
      correct: null,
      pointsAwarded: 0,
      pointsPossible: 1,
      grader: "auto",
      independence: false,
      firstAttempt,
      misconceptionIds: [],
      dimensions: dims,
      feedback:
        "You marked this as not yet learned — that is honest, not a failure. We will not treat it as a wrong model. The next move is instruction, not a mastery stamp. This does not count as independent evidence.",
      ruleVersion: MASTERY_RULE_VERSION,
      moreEvidenceNeeded: true,
    };
  }

  if (item.type === "mcq" && item.correctChoiceId) {
    const choice = item.choices?.find((c) => c.id === payload.choiceId);
    const correct = payload.choiceId === item.correctChoiceId;
    const misconceptionIds =
      !correct && choice?.misconceptionTag ? [choice.misconceptionTag] : [];
    return {
      correct,
      pointsAwarded: correct ? 1 : 0,
      pointsPossible: 1,
      grader: "auto",
      independence: independent,
      firstAttempt,
      misconceptionIds,
      dimensions: dims,
      feedback: correct
        ? "That matches the reviewed key. Keep the idea and try it on a new graph — repeating this wording is not the next move."
        : "A useful miss. The option you picked does not match the graph feature or definition that determines the answer. See the specific issue below; a tagged misconception names the repair.",
      issue: !correct
        ? choice?.distractorRationale ?? "The selected option is inconsistent with the graph or definition in the prompt."
        : undefined,
      ruleVersion: MASTERY_RULE_VERSION,
    };
  }

  if (item.type === "numerical" && item.numerical) {
    const value = payload.numericValue;
    const unitOk =
      payload.numericUnit !== undefined &&
      item.numerical.acceptedUnits.some(
        (u) => normalizeUnit(u) === normalizeUnit(payload.numericUnit ?? "")
      );
    const valueOk =
      value !== null &&
      value !== undefined &&
      Number.isFinite(value) &&
      Math.abs(value - item.numerical.value) <= item.numerical.tolerance;
    const correct = Boolean(valueOk && unitOk);
    return {
      correct,
      pointsAwarded: correct ? 1 : 0,
      pointsPossible: 1,
      grader: "auto",
      independence: independent,
      firstAttempt,
      misconceptionIds: !correct ? item.misconceptionTags : [],
      dimensions: dims,
      feedback: correct
        ? `Within tolerance of ${item.numerical.value} ${item.numerical.unit}. The next move is still a fresh item, not repeating this arithmetic.`
        : "Check both the number and the unit. A matching number with a missing or inverted unit is not credited — that is a physics habit, not a trick.",
      issue: !correct
        ? !unitOk
          ? "Unit missing or incompatible."
          : "Numeric value outside the accepted tolerance."
        : undefined,
      ruleVersion: MASTERY_RULE_VERSION,
    };
  }

  if (item.type === "ranking" && item.ranking) {
    const order = payload.rankingOrder ?? [];
    const correct =
      order.length === item.ranking.correctOrder.length &&
      order.every((id, i) => id === item.ranking!.correctOrder[i]);
    return {
      correct,
      pointsAwarded: correct ? 1 : 0,
      pointsPossible: 1,
      grader: "auto",
      independence: independent,
      firstAttempt,
      misconceptionIds: !correct ? item.misconceptionTags : [],
      dimensions: dims,
      feedback: correct
        ? "The order matches the reviewed ranking. Next, try the same distinction (speed vs signed velocity) on a new prompt."
        : "The ranking does not match. Re-read whether the prompt asked for speed (magnitude) or signed velocity — that mix-up is common and repairable.",
      ruleVersion: MASTERY_RULE_VERSION,
    };
  }

  if (item.type === "explanation" || item.type === "frq") {
    const possible = item.explanationRubric?.reduce((s, p) => s + p.points, 0) ?? 0;
    const awarded =
      item.explanationRubric
        ?.filter((p) => payload.selfAwardedPointIds?.includes(p.id))
        .reduce((s, p) => s + p.points, 0) ?? 0;
    return {
      correct: possible > 0 ? awarded / possible >= 0.8 : null,
      pointsAwarded: awarded,
      pointsPossible: possible,
      grader: "self",
      independence: false,
      firstAttempt,
      misconceptionIds: [],
      dimensions: dims,
      feedback:
        "Self-marked points are labelled and excluded from validated readiness. Award only what the page actually shows. A human review would be required before this contributes to a readiness claim.",
      ruleVersion: MASTERY_RULE_VERSION,
      moreEvidenceNeeded: true,
    };
  }

  return {
    correct: null,
    pointsAwarded: 0,
    pointsPossible: 1,
    grader: "auto",
    independence: false,
    firstAttempt,
    misconceptionIds: [],
    dimensions: dims,
    feedback: "This item type could not be scored automatically.",
    moreEvidenceNeeded: true,
    ruleVersion: MASTERY_RULE_VERSION,
  };
}

export function solutionFor(item: Item) {
  return item.solution;
}
