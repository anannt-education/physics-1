import type { ExamSpecification } from "@/lib/types";

/** May 2027 AP Physics 1 format. Versioned so timing is never hard-coded in UI. */
export const EXAM_SPEC: ExamSpecification = {
  id: "ap-physics-1-2027",
  year: 2027,
  version: "2027.1",
  sourceUrl: "https://apcentral.collegeboard.org/courses/ap-physics-1/exam",
  verifiedOn: "2026-09-09",
  approval: "Planning baseline pending academic-lead sign-off",
  sections: [
    {
      id: "mcq",
      name: "Multiple choice",
      questionCount: 42,
      durationMinutes: 85,
      weightPercent: 50,
    },
    {
      id: "frq",
      name: "Free response",
      questionCount: 4,
      durationMinutes: 95,
      weightPercent: 50,
    },
  ],
  calculator: "Allowed on both sections",
  delivery:
    "Hybrid digital: prompts on screen; FRQs written on paper. Official application is Bluebook — this platform does not claim interface equivalence.",
  notes: [
    "FRQ point totals: mathematical routines 10, translation between representations 12, experimental design and analysis 10, qualitative/quantitative translation 8.",
    "Practice composite for internal reporting: 50 × MCQ correct/42 + 50 × FRQ points/40. This is not an official AP scaled score.",
    "Exam registration remains the student’s responsibility. Anannt does not claim College Board endorsement.",
  ],
};

export const UNIT_MCQ_WEIGHTS: Record<
  string,
  { min: number; max: number; proposedLessons: number }
> = {
  u1: { min: 10, max: 15, proposedLessons: 10 },
  u2: { min: 18, max: 23, proposedLessons: 18 },
  u3: { min: 18, max: 23, proposedLessons: 14 },
  u4: { min: 10, max: 15, proposedLessons: 10 },
  u5: { min: 10, max: 15, proposedLessons: 14 },
  u6: { min: 5, max: 8, proposedLessons: 12 },
  u7: { min: 5, max: 8, proposedLessons: 8 },
  u8: { min: 10, max: 15, proposedLessons: 10 },
  foundation: { min: 0, max: 0, proposedLessons: 8 },
};
