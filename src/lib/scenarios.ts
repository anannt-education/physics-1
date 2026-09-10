import { MASTERY_RULE_VERSION } from "@/lib/types";
import type { StudentState } from "@/lib/types";
import { emptyState } from "@/lib/planner";

function isoDaysAgo(days: number) {
  return new Date(Date.now() - days * 86400000).toISOString();
}

export function scenarioFresh(): StudentState {
  return emptyState();
}

export function scenarioGraphConfusion(): StudentState {
  const state = emptyState();
  state.profile = {
    displayName: "Maya",
    examYear: 2027,
    weeklyHours: 6,
    schoolPhysics: "current",
    mathConfidence: "medium",
    preferredDays: ["Mon", "Wed", "Sat"],
    timezone: "America/New_York",
    reducedMotion: false,
    targetScoreNote: "Motivational only — not evidence of ability.",
    pathway: "consolidation",
  };
  state.attempts = [
    {
      id: "att-diag-maya",
      kind: "diagnostic",
      formId: "foundation-diagnostic-v1",
      itemIds: ["diag-height-vs-slope"],
      status: "completed",
      startedAt: isoDaysAgo(0),
      completedAt: isoDaysAgo(0),
      currentIndex: 9,
      sessionId: "sess-diag",
      timingLabel: "untimed",
    },
  ];
  state.notebook = [
    {
      id: "nb-maya-slope",
      itemId: "diag-height-vs-slope",
      promptSnapshot: "Cart A higher, cart B steeper — who is faster?",
      originalResponse: "Cart A, because it is higher on the graph.",
      category: "representation",
      diagnosedMisconceptionId: "mc-height-as-slope",
      explanation: "Height is position; slope is velocity.",
      repairTaskId: "repair-graph-slope",
      studentCorrection: "",
      diagnosisOverridden: false,
      createdAt: new Date().toISOString(),
    },
  ];
  state.lastRecommendation = {
    id: "rec-repair",
    title: "Repair graph reading (height vs slope)",
    why: "Maya selected the height-as-slope option on the diagnostic. Rule 1: blocking prerequisite before Unit 1 lessons.",
    href: "/repair/repair-graph-slope",
    kind: "repair",
    ruleVersion: MASTERY_RULE_VERSION,
    evidenceIds: ["nb-maya-slope"],
    priority: 2,
  };
  return state;
}

export function scenarioAlreadyProficient(): StudentState {
  const state = emptyState();
  state.profile = {
    displayName: "Arjun",
    examYear: 2027,
    weeklyHours: 7,
    schoolPhysics: "completed",
    mathConfidence: "high",
    preferredDays: ["Tue", "Thu", "Sun"],
    timezone: "America/Chicago",
    reducedMotion: false,
    targetScoreNote: "Challenge route without replaying all instruction.",
    pathway: "revision",
  };
  const families = ["fam-slope-read", "fam-height-slope", "fam-xt-shape", "fam-turning"];
  const items = [
    "p-mcq-slope-meaning",
    "p-mcq-height-not-speed",
    "p-mcq-rest-graph",
    "p-mcq-speeding-up-xt",
    "p-num-average-v",
    "p-mcq-negative-v",
    "p-mcq-zero-v-a",
    "p-num-from-graph",
    "p-mcq-tangent",
    "p-transfer-incline",
  ];
  state.attempts = [
    {
      id: "att-a1",
      kind: "diagnostic",
      formId: "foundation-diagnostic-v1",
      itemIds: items,
      status: "completed",
      startedAt: isoDaysAgo(3),
      completedAt: isoDaysAgo(3),
      currentIndex: items.length,
      sessionId: "sess-a",
      timingLabel: "untimed",
    },
    {
      id: "att-a2",
      kind: "practice",
      formId: "practice-u1",
      itemIds: items,
      status: "completed",
      startedAt: isoDaysAgo(1),
      completedAt: isoDaysAgo(1),
      currentIndex: items.length,
      sessionId: "sess-b",
      timingLabel: "untimed",
    },
  ];
  state.evidence = items.map((itemId, i) => ({
    id: `ev-arjun-${i}`,
    conceptId: i < 6 ? "c-xt-velocity" : "c-zero-v-nonzero-a",
    attemptId: i < 5 ? "att-a1" : "att-a2",
    itemId,
    itemFamilyId: families[i % families.length],
    sessionId: i < 5 ? "sess-a" : "sess-b",
    independence: true,
    firstAttempt: true,
    correct: true,
    dimensions: i % 2 === 0 ? ["conceptual"] : ["representations"],
    createdAt: isoDaysAgo(i < 5 ? 3 : 1),
    ruleVersion: MASTERY_RULE_VERSION,
    grader: "auto",
  }));
  state.lessonProgress = {
    "lesson-motion-graphs": { activityIndex: 9, completedIds: ["all"], status: "completed" },
    "lesson-zero-v-a": { activityIndex: 9, completedIds: ["all"], status: "completed" },
  };
  state.lastRecommendation = {
    id: "rec-challenge",
    title: "Challenge ahead",
    why: "Arjun already has independent evidence across families and sessions. Recommended progression uses a challenge route rather than replaying instruction.",
    href: "/practice?mode=challenge",
    kind: "challenge",
    ruleVersion: MASTERY_RULE_VERSION,
    evidenceIds: state.evidence.map((e) => e.id),
    priority: 5,
  };
  return state;
}

export function scenarioSolutionExposed(): StudentState {
  const state = emptyState();
  state.profile = {
    displayName: "Priya",
    examYear: 2027,
    weeklyHours: 6,
    schoolPhysics: "current",
    mathConfidence: "medium",
    preferredDays: ["Mon", "Thu"],
    timezone: "America/Los_Angeles",
    reducedMotion: false,
    targetScoreNote: "Wants explanations first.",
    pathway: "consolidation",
  };
  state.attempts = [
    {
      id: "att-p-diag",
      kind: "diagnostic",
      formId: "foundation-diagnostic-v1",
      itemIds: ["diag-slope-line"],
      status: "completed",
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      currentIndex: 1,
      sessionId: "sess-p-diag",
      timingLabel: "untimed",
    },
    {
      id: "att-p",
      kind: "lesson",
      formId: "lesson-motion-graphs",
      itemIds: ["l1-independent"],
      status: "in_progress",
      startedAt: new Date().toISOString(),
      currentIndex: 0,
      sessionId: "sess-p",
      timingLabel: "untimed",
    },
  ];
  state.evidence = [
    {
      id: "ev-priya-1",
      conceptId: "c-xt-velocity",
      attemptId: "att-p",
      itemId: "l1-independent",
      itemFamilyId: "fam-height-slope",
      sessionId: "sess-p",
      independence: false,
      firstAttempt: true,
      correct: true,
      dimensions: ["representations"],
      createdAt: new Date().toISOString(),
      ruleVersion: MASTERY_RULE_VERSION,
      grader: "auto",
    },
  ];
  state.concepts = {
    "c-xt-velocity": {
      conceptId: "c-xt-velocity",
      state: "learning",
      coverage: "in_progress",
      lastTransitionReason:
        "Priya revealed the solution on the independent check. Hinted or solution-exposed answers cannot supply independent evidence (rule v1.0-pilot).",
      lastRuleVersion: MASTERY_RULE_VERSION,
      updatedAt: new Date().toISOString(),
    },
  };
  state.lastRecommendation = {
    id: "rec-priya",
    title: "A fresh independent item",
    why: "The revealed solution was scored for feedback but excluded from independent mastery evidence. A new transfer item is required.",
    href: "/practice",
    kind: "practice",
    ruleVersion: MASTERY_RULE_VERSION,
    evidenceIds: ["ev-priya-1"],
    priority: 6,
  };
  return state;
}

export const SCENARIOS = [
  {
    id: "fresh",
    name: "New student",
    description: "Empty local record. Start at onboarding.",
    load: scenarioFresh,
  },
  {
    id: "maya",
    name: "Maya — graph confusion",
    description: "Diagnostic already shows height treated as slope. Next action is the repair bridge.",
    load: scenarioGraphConfusion,
  },
  {
    id: "arjun",
    name: "Arjun — already understands",
    description: "Independent evidence across sessions. Challenge route, not a full replay.",
    load: scenarioAlreadyProficient,
  },
  {
    id: "priya",
    name: "Priya — asked for the solution",
    description: "Correct after revealing the solution. Mastery stays Learning; independent evidence excluded.",
    load: scenarioSolutionExposed,
  },
] as const;
