import { MASTERY_RULE_VERSION } from "@/lib/types";
import type {
  ConceptRecord,
  MasteryEvidence,
  MasteryState,
  ReviewTask,
  SkillDimension,
  StudentState,
} from "@/lib/types";
import { CONCEPTS } from "@/content/curriculum";

const PROFICIENCY_MIN_OBS = 8;
const PROFICIENCY_MIN_SESSIONS = 2;
const PROFICIENCY_MIN_FAMILIES = 3;
const PROFICIENCY_ACCURACY = 0.8;
const DIM_FLOOR = 0.6;
const RETAINED_DELAY_DAYS = 7;
const RETAINED_MIN_OBS = 3;
const RETAINED_MIN_CORRECT = 2;

export const RETRIEVAL_INTERVALS_DAYS = [1, 3, 7, 14, 30];

function independentEvidence(list: MasteryEvidence[]) {
  return list.filter(
    (e) =>
      e.independence &&
      e.firstAttempt &&
      e.grader === "auto" &&
      e.correct !== null
  );
}

function accuracy(list: MasteryEvidence[]) {
  if (list.length === 0) return 0;
  return list.filter((e) => e.correct === true).length / list.length;
}

function dimensionAccuracy(list: MasteryEvidence[], dim: SkillDimension) {
  const subset = list.filter((e) => e.dimensions.includes(dim));
  if (subset.length < 2) return null;
  return accuracy(subset);
}

export function evaluateConcept(
  conceptId: string,
  state: StudentState,
  now: Date
): ConceptRecord {
  const all = state.evidence.filter((e) => e.conceptId === conceptId);
  const independent = independentEvidence(all);
  const sessions = new Set(independent.map((e) => e.sessionId)).size;
  const families = new Set(independent.map((e) => e.itemFamilyId)).size;
  const overall = accuracy(independent);
  const dims: SkillDimension[] = [
    "conceptual",
    "representations",
    "mathematical",
    "experimental",
  ];
  const weakDim = dims.some((d) => {
    const a = dimensionAccuracy(independent, d);
    return a !== null && a < DIM_FLOOR;
  });

  const unresolvedCritical = state.notebook.some(
    (n) =>
      n.diagnosedMisconceptionId &&
      CONCEPTS.find((c) => c.id === conceptId)?.misconceptions.includes(
        n.diagnosedMisconceptionId
      ) &&
      !n.studentCorrection.trim()
  );

  const existing = state.concepts[conceptId];
  let next: MasteryState = "not_assessed";
  let reason = "No scored observations yet.";

  if (independent.length === 0 && all.length > 0) {
    next = "learning";
    reason =
      "Attempts exist, but hinted, solution-exposed, self-marked, or not-yet-learned responses cannot supply independent evidence.";
  } else if (independent.length > 0 && independent.length < PROFICIENCY_MIN_OBS) {
    next = overall >= 0.5 ? "developing" : "learning";
    reason = `Independent first-attempt observations: ${independent.length} of ${PROFICIENCY_MIN_OBS} required (rule ${MASTERY_RULE_VERSION}). Insufficient evidence is not an assumed pass.`;
  } else if (independent.length >= PROFICIENCY_MIN_OBS) {
    if (
      sessions >= PROFICIENCY_MIN_SESSIONS &&
      families >= PROFICIENCY_MIN_FAMILIES &&
      overall >= PROFICIENCY_ACCURACY &&
      !weakDim &&
      !unresolvedCritical
    ) {
      next = "proficient";
      reason = `Met initial proficiency: ${independent.length} independent observations, ${sessions} sessions, ${families} item families, ${(overall * 100).toFixed(0)}% accuracy, no unresolved critical misconception (rule ${MASTERY_RULE_VERSION}).`;
    } else {
      next = "developing";
      reason = `More evidence needed: sessions ${sessions}/${PROFICIENCY_MIN_SESSIONS}, families ${families}/${PROFICIENCY_MIN_FAMILIES}, accuracy ${(overall * 100).toFixed(0)}% (need ${PROFICIENCY_ACCURACY * 100}%), weak dimension=${weakDim}, unresolved misconception=${unresolvedCritical}.`;
    }
  }

  const proficientAt = existing?.state === "proficient" || existing?.state === "retained" || existing?.state === "review_due"
    ? existing.updatedAt
    : next === "proficient"
      ? now.toISOString()
      : null;

  if (next === "proficient" || existing?.state === "proficient" || existing?.state === "retained" || existing?.state === "review_due") {
    const due = state.reviews.find(
      (r) => r.conceptId === conceptId && (r.status === "due" || (r.status === "scheduled" && new Date(r.dueAt) <= now))
    );
    if (due && due.status !== "completed") {
      next = "review_due";
      reason = `Delayed retrieval is due (${due.id}). Retained requires an unseen check at least ${RETAINED_DELAY_DAYS} days after proficiency.`;
    } else {
      const delayed = independent.filter((e) => {
        if (!proficientAt) return false;
        const dt = (new Date(e.createdAt).getTime() - new Date(proficientAt).getTime()) / 86400000;
        return dt >= RETAINED_DELAY_DAYS;
      });
      const delayedCorrect = delayed.filter((e) => e.correct === true).length;
      if (delayed.length >= RETAINED_MIN_OBS && delayedCorrect >= RETAINED_MIN_CORRECT && !unresolvedCritical) {
        next = "retained";
        reason = `Unseen delayed checks: ${delayedCorrect}/${delayed.length} correct, ≥${RETAINED_DELAY_DAYS} days after proficiency (rule ${MASTERY_RULE_VERSION}).`;
      }
    }
  }

  const coverage =
    all.length === 0
      ? "not_covered"
      : existing?.coverage === "covered" || next === "proficient" || next === "retained"
        ? "covered"
        : "in_progress";

  return {
    conceptId,
    state: next,
    coverage,
    lastTransitionReason: reason,
    lastRuleVersion: MASTERY_RULE_VERSION,
    updatedAt: now.toISOString(),
  };
}

export function recomputeAllConcepts(state: StudentState, now: Date): StudentState {
  const concepts = { ...state.concepts };
  for (const c of CONCEPTS) {
    concepts[c.id] = evaluateConcept(c.id, { ...state, concepts }, now);
  }
  return { ...state, concepts };
}

export function scheduleRetrieval(
  state: StudentState,
  conceptId: string,
  itemId: string,
  now: Date,
  intervalIndex = 0
): StudentState {
  const days = RETRIEVAL_INTERVALS_DAYS[Math.min(intervalIndex, RETRIEVAL_INTERVALS_DAYS.length - 1)];
  const due = new Date(now.getTime() + days * 86400000);
  const task: ReviewTask = {
    id: `rev-${conceptId}-${due.getTime()}`,
    conceptId,
    itemId,
    dueAt: due.toISOString(),
    status: "scheduled",
    intervalDays: days,
  };
  return { ...state, reviews: [...state.reviews, task] };
}

export function dueReviews(state: StudentState, now: Date) {
  return state.reviews.filter((r) => {
    if (r.status === "completed" || r.status === "overridden") return false;
    return r.status === "due" || new Date(r.dueAt) <= now;
  });
}
