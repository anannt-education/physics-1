import { MASTERY_RULE_VERSION, STATE_VERSION } from "@/lib/types";
import type {
  OnboardingProfile,
  Recommendation,
  StudentState,
} from "@/lib/types";
import { LESSONS } from "@/content/lessons";
import { getMisconception } from "@/content/curriculum";
import { dueReviews } from "@/lib/mastery";

export function emptyState(): StudentState {
  return {
    version: STATE_VERSION,
    role: "student",
    actorId: "student.local",
    profile: null,
    clockOffsetMs: 0,
    attempts: [],
    events: [],
    scores: {},
    evidence: [],
    concepts: {},
    reviews: [],
    notebook: [],
    recommendations: [],
    lessonProgress: {},
    repairProgress: {},
    cmsEvents: [],
    itemOverrides: {},
    itemVersions: {},
    frq: {},
  };
}

export function nowFrom(state: StudentState) {
  return new Date(Date.now() + state.clockOffsetMs);
}

function lessonDone(state: StudentState, id: string) {
  return state.lessonProgress[id]?.status === "completed";
}

function diagnosticComplete(state: StudentState) {
  const attempt = state.attempts.find((a) => a.kind === "diagnostic");
  return attempt?.status === "completed";
}

function confirmedMisconceptions(state: StudentState) {
  const latestByMc = new Map<string, { repaired: boolean }>();
  for (const n of state.notebook) {
    if (!n.diagnosedMisconceptionId) continue;
    latestByMc.set(n.diagnosedMisconceptionId, {
      repaired: n.studentCorrection.trim().length > 0 && Boolean(state.repairProgress[getMisconception(n.diagnosedMisconceptionId)?.repairPathId ?? ""]?.completed),
    });
  }
  return [...latestByMc.entries()].filter(([, v]) => !v.repaired).map(([id]) => id);
}

export function recommend(state: StudentState): Recommendation {
  const now = nowFrom(state);
  const make = (
    partial: Omit<Recommendation, "id" | "ruleVersion">
  ): Recommendation => ({
    ...partial,
    id: `rec-${partial.kind}-${partial.priority}`,
    ruleVersion: MASTERY_RULE_VERSION,
  });

  if (!state.profile) {
    return make({
      title: "Tell us how you actually study",
      why: "Your mentor needs exam year, weekly hours, and access needs before diagnosing. This is planning, not a lecture — and not an account.",
      href: "/onboarding",
      kind: "onboarding",
      evidenceIds: [],
      priority: 0,
    });
  }

  if (!diagnosticComplete(state)) {
    const attempt = state.attempts.find((a) => a.kind === "diagnostic");
    return make({
      title: attempt ? "Resume the foundation diagnostic" : "Start the foundation diagnostic",
      why: attempt
        ? "Interrupted diagnosis is expected. We resume at the last acknowledged item. Provisional placement is not permanent mastery."
        : "A 10-item foundation check names strengths, gaps, and the next concrete task. Choosing “I have not learned this yet” is honest, not a miss.",
      href: "/diagnostic",
      kind: "diagnostic",
      evidenceIds: attempt ? [attempt.id] : [],
      priority: 1,
    });
  }

  const blocking = confirmedMisconceptions(state);
  if (blocking.includes("mc-height-as-slope") && !state.repairProgress["repair-graph-slope"]?.completed) {
    const evidence = state.notebook
      .filter((n) => n.diagnosedMisconceptionId === "mc-height-as-slope")
      .map((n) => n.id);
    return make({
      title: "Repair graph reading (height vs slope)",
      why: "A blocking mix-up is confirmed: graph height was treated as slope. That is a common kinematics error, not a character judgement. Rule 1 sends you to the graph-reading bridge before Unit 1 lessons.",
      href: "/repair/repair-graph-slope",
      kind: "repair",
      evidenceIds: evidence,
      priority: 2,
    });
  }

  if (blocking.includes("mc-stop-means-a-zero") && lessonDone(state, "lesson-motion-graphs") && !state.repairProgress["repair-turning-point"]?.completed) {
    return make({
      title: "Repair: stopping is not zero acceleration",
      why: "A confirmed turning-point mix-up is still open: rest was treated as zero acceleration. Struggle here is expected. Rule 2: a short repair path before new material.",
      href: "/repair/repair-turning-point",
      kind: "repair",
      evidenceIds: state.notebook.filter((n) => n.diagnosedMisconceptionId === "mc-stop-means-a-zero").map((n) => n.id),
      priority: 3,
    });
  }

  const overdue = dueReviews(state, now);
  if (overdue.length > 0) {
    const task = overdue[0];
    return make({
      title: "A delayed check is due — unseen on purpose",
      why: `Overdue delayed check for ${task.conceptId} (due ${new Date(task.dueAt).toLocaleString()}). Retrieval is capped at about one-third of a session and uses unseen items. A miss here shortens the interval; it is not a verdict.`,
      href: `/review/play?task=${task.id}`,
      kind: "retrieval",
      evidenceIds: [task.id],
      priority: 4,
    });
  }

  for (const lesson of LESSONS) {
    if (!lessonDone(state, lesson.id)) {
      const progress = state.lessonProgress[lesson.id];
      return make({
        title: progress ? `Continue: ${lesson.title}` : `Next lesson: ${lesson.title}`,
        why: progress
          ? `Resume at activity ${progress.activityIndex + 1} of ${lesson.activities.length}. Picking up mid-lesson is expected. Video completion is not used; this slice has no video.`
          : `Next planned concept in the Unit 1 slice. Estimated ${lesson.estimatedMinutes} minutes. The outcome is named before the first click.`,
        href: `/lesson/${lesson.id}`,
        kind: "lesson",
        evidenceIds: [],
        priority: 5,
      });
    }
  }

  const practiceAttempted = state.attempts.some((a) => a.kind === "practice" && a.status === "completed");
  if (!practiceAttempted) {
    return make({
      title: "Independent practice studio",
      why: "Both motion-representation lessons are complete. Practice uses a different scenario family so we are not replaying the same graph. Protected mock items are excluded.",
      href: "/practice",
      kind: "practice",
      evidenceIds: [],
      priority: 6,
    });
  }

  const frq = state.frq["frq-flattening-graph"];
  if (!frq || frq.status === "draft") {
    return make({
      title: "Handwritten explanation task",
      why: "A short FRQ trains paper writing for the hybrid May 2027 exam. Write on paper; self-marked points stay labelled and out of validated readiness.",
      href: "/frq/frq-flattening-graph",
      kind: "frq",
      evidenceIds: [],
      priority: 7,
    });
  }

  return make({
    title: "Review your evidence",
    why: "The Unit 1 slice loop is complete. Open results for topic and skill evidence, unanswered items, and the next three priorities. Readiness remains incomplete until more of the syllabus is covered — that honesty is the method.",
    href: "/results",
    kind: "results",
    evidenceIds: state.evidence.slice(-5).map((e) => e.id),
    priority: 8,
  });
}

export function pathwayFromProfile(profile: OnboardingProfile) {
  if (profile.schoolPhysics === "none" || profile.mathConfidence === "low") return "foundation" as const;
  if (profile.schoolPhysics === "completed" && profile.mathConfidence === "high") return "revision" as const;
  return "consolidation" as const;
}

export function weeklyPlanCopy(profile: OnboardingProfile) {
  const map = {
    foundation: { weeks: 28, hours: "5–7" },
    consolidation: { weeks: 16, hours: "5–7" },
    revision: { weeks: 8, hours: "6–8" },
  }[profile.pathway];
  const feasible = profile.weeklyHours >= 5;
  return {
    ...map,
    feasible,
    note: feasible
      ? `Your ${profile.weeklyHours} h/week can support the ${map.weeks}-week ${profile.pathway} path without pretending Units 2–8 are already built.`
      : `You listed ${profile.weeklyHours} h/week, below the 5–7 h planning assumption. Calendar tension is expected — we will keep daily work capped and will not claim the full syllabus fits before May ${profile.examYear}. A human mentor is the honest alternative to compressing everything.`,
  };
}
