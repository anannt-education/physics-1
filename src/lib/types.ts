export const MASTERY_RULE_VERSION = "v1.0-pilot";
export const CURRICULUM_VERSION = "CED-2026-slice";
export const STATE_VERSION = 1;

export type Role = "student" | "author" | "reviewer";

export type MasteryState =
  | "not_assessed"
  | "learning"
  | "developing"
  | "proficient"
  | "retained"
  | "review_due";

export type CoverageState = "not_covered" | "in_progress" | "covered";

export type SkillDimension =
  | "conceptual"
  | "representations"
  | "mathematical"
  | "experimental";

export type ItemType =
  | "mcq"
  | "numerical"
  | "explanation"
  | "ranking"
  | "frq";

export type Difficulty = "foundation" | "standard" | "transfer";

export type PublicationState = "draft" | "in_review" | "published" | "withdrawn";

export type ExposurePool =
  | "diagnostic"
  | "lesson"
  | "practice"
  | "repair"
  | "retrieval"
  | "frq"
  | "protected";

export type Pathway = "foundation" | "consolidation" | "revision";

export interface ExamSpecification {
  id: string;
  year: number;
  version: string;
  sourceUrl: string;
  verifiedOn: string;
  approval: string;
  sections: {
    id: "mcq" | "frq";
    name: string;
    questionCount: number;
    durationMinutes: number;
    weightPercent: number;
  }[];
  calculator: string;
  delivery: string;
  notes: string[];
}

export interface RubricPoint {
  id: string;
  points: number;
  criterion: string;
  evidenceHint: string;
}

export interface Choice {
  id: string;
  text: string;
  distractorRationale?: string;
  misconceptionTag?: string;
}

export interface NumericalSpec {
  value: number;
  unit: string;
  tolerance: number;
  acceptedUnits: string[];
  significantFigures?: number;
}

export interface DiagramSpec {
  kind:
    | "position-time"
    | "velocity-time"
    | "strobe"
    | "slope-compare"
    | "dual-xt";
  caption: string;
  alt: string;
  points?: { t: number; x?: number; v?: number }[];
  series?: { label: string; points: { t: number; x?: number; v?: number }[] }[];
  highlightT?: number;
  showSlope?: boolean;
  showHeight?: boolean;
  strobe?: { y: number; label: string }[];
}

export interface Item {
  id: string;
  version: number;
  curriculumVersion: string;
  unitId: string;
  topicId: string;
  objectiveId: string;
  primaryConceptId: string;
  secondaryConceptIds: string[];
  sciencePractice: string;
  type: ItemType;
  difficulty: Difficulty;
  familyId: string;
  calculator: "allowed" | "not_needed";
  expectedTimeSec: number;
  prompt: string;
  stimulus?: DiagramSpec;
  choices?: Choice[];
  correctChoiceId?: string;
  numerical?: NumericalSpec;
  ranking?: { options: { id: string; text: string }[]; correctOrder: string[] };
  explanationRubric?: RubricPoint[];
  solution: string;
  hints: [string, string, string];
  misconceptionTags: string[];
  exposurePool: ExposurePool;
  accessibilityDescription: string;
  publicationState: PublicationState;
  authorId: string;
  reviewerId?: string;
  source: "original";
  allowNotYetLearned?: boolean;
}

export interface PublicItem {
  id: string;
  version: number;
  curriculumVersion: string;
  unitId: string;
  topicId: string;
  objectiveId: string;
  primaryConceptId: string;
  sciencePractice: string;
  type: ItemType;
  difficulty: Difficulty;
  familyId: string;
  calculator: "allowed" | "not_needed";
  expectedTimeSec: number;
  prompt: string;
  stimulus?: DiagramSpec;
  choices?: { id: string; text: string }[];
  ranking?: { options: { id: string; text: string }[] };
  explanationRubric?: RubricPoint[];
  hints: [string, string, string];
  exposurePool: ExposurePool;
  accessibilityDescription: string;
  publicationState: PublicationState;
  allowNotYetLearned?: boolean;
  numericalUnitHint?: string;
}

export interface Concept {
  id: string;
  name: string;
  outcome: string;
  unitId: string;
  topicId: string;
  objectiveId: string;
  prerequisites: string[];
  misconceptions: string[];
}

export interface Misconception {
  id: string;
  name: string;
  studentIdea: string;
  scientificIdea: string;
  repairPathId: string;
  critical: boolean;
}

export interface LessonActivity {
  id: string;
  kind:
    | "outcome"
    | "prereq"
    | "prediction"
    | "explanation"
    | "worked"
    | "partial"
    | "independent"
    | "representation"
    | "exit"
    | "retrieval_schedule";
  title: string;
  body?: string;
  itemId?: string;
  diagram?: DiagramSpec;
  worked?: {
    system: string;
    principle: string;
    assumptions: string;
    diagram?: DiagramSpec;
    reasoning: string[];
    calculation?: string;
    interpretation: string;
  };
  partial?: {
    given: string[];
    prompt: string;
    itemId: string;
  };
}

export interface Lesson {
  id: string;
  title: string;
  unitId: string;
  conceptIds: string[];
  estimatedMinutes: number;
  outcome: string;
  activities: LessonActivity[];
  status: PublicationState;
}

export interface RepairPath {
  id: string;
  misconceptionId: string;
  title: string;
  summary: string;
  steps: LessonActivity[];
}

export interface FrqTask {
  id: string;
  title: string;
  minutes: number;
  prompt: string;
  writingInstructions: string[];
  rubric: RubricPoint[];
  exemplar: string;
  conceptIds: string[];
  version: number;
}

export interface OnboardingProfile {
  displayName: string;
  examYear: number;
  weeklyHours: number;
  schoolPhysics: "none" | "current" | "completed";
  mathConfidence: "low" | "medium" | "high";
  preferredDays: string[];
  timezone: string;
  reducedMotion: boolean;
  targetScoreNote: string;
  pathway: Pathway;
}

export interface ResponsePayload {
  choiceId?: string;
  numericValue?: number | null;
  numericUnit?: string;
  rankingOrder?: string[];
  explanationText?: string;
  notYetLearned?: boolean;
  confidence: "low" | "medium" | "high";
  hintsUsed: number;
  solutionRevealed: boolean;
  selfAwardedPointIds?: string[];
}

export interface ResponseEvent {
  id: string;
  attemptId: string;
  itemId: string;
  itemVersion: number;
  sequence: number;
  payload: ResponsePayload;
  createdAt: string;
  localSavedAt: string;
  acknowledgedAt?: string;
  syncState: "pending" | "acknowledged" | "failed";
}

export interface ScoreResult {
  correct: boolean | null;
  pointsAwarded: number;
  pointsPossible: number;
  grader: "auto" | "self" | "human";
  independence: boolean;
  firstAttempt: boolean;
  misconceptionIds: string[];
  dimensions: SkillDimension[];
  feedback: string;
  issue?: string;
  ruleVersion: string;
  moreEvidenceNeeded?: boolean;
}

export interface Attempt {
  id: string;
  kind:
    | "diagnostic"
    | "lesson"
    | "practice"
    | "repair"
    | "retrieval"
    | "frq";
  formId: string;
  itemIds: string[];
  status:
    | "created"
    | "in_progress"
    | "completed"
    | "abandoned";
  startedAt: string;
  completedAt?: string;
  currentIndex: number;
  sessionId: string;
  timingLabel: "untimed" | "practice_pause" | "standard_mock";
}

export interface MasteryEvidence {
  id: string;
  conceptId: string;
  attemptId: string;
  itemId: string;
  itemFamilyId: string;
  sessionId: string;
  independence: boolean;
  firstAttempt: boolean;
  correct: boolean | null;
  dimensions: SkillDimension[];
  createdAt: string;
  ruleVersion: string;
  grader: ScoreResult["grader"];
}

export interface ConceptRecord {
  conceptId: string;
  state: MasteryState;
  coverage: CoverageState;
  lastTransitionReason: string;
  lastRuleVersion: string;
  updatedAt: string;
}

export interface ReviewTask {
  id: string;
  conceptId: string;
  itemId: string;
  dueAt: string;
  status: "scheduled" | "due" | "completed" | "missed" | "overridden";
  intervalDays: number;
  triggeringEvidenceId?: string;
}

export interface ErrorNotebookEntry {
  id: string;
  itemId: string;
  promptSnapshot: string;
  originalResponse: string;
  category:
    | "concept"
    | "representation"
    | "model_selection"
    | "algebra"
    | "units_sign"
    | "reading"
    | "experiment_design"
    | "time_management";
  diagnosedMisconceptionId?: string;
  explanation: string;
  repairTaskId?: string;
  retestDate?: string;
  studentCorrection: string;
  diagnosisOverridden: boolean;
  createdAt: string;
}

export interface Recommendation {
  id: string;
  title: string;
  why: string;
  href: string;
  kind:
    | "onboarding"
    | "diagnostic"
    | "repair"
    | "retrieval"
    | "lesson"
    | "practice"
    | "frq"
    | "challenge"
    | "results";
  ruleVersion: string;
  evidenceIds: string[];
  priority: number;
}

export interface CmsEvent {
  id: string;
  at: string;
  actorId: string;
  action: "submit_review" | "publish" | "withdraw" | "revise";
  itemId: string;
  fromState: PublicationState;
  toState: PublicationState;
  reason: string;
  version: number;
}

export interface FrqUploadPage {
  id: string;
  name: string;
  dataUrl: string;
}

export interface FrqAttemptState {
  taskId: string;
  pages: FrqUploadPage[];
  typedAlternative: string;
  submittedAt?: string;
  selfMarkedPointIds: string[];
  status: "draft" | "submitted" | "self_marked";
}

export interface StudentState {
  version: number;
  role: Role;
  actorId: string;
  profile: OnboardingProfile | null;
  clockOffsetMs: number;
  diagnosticAttemptId?: string;
  attempts: Attempt[];
  events: ResponseEvent[];
  scores: Record<string, ScoreResult>;
  evidence: MasteryEvidence[];
  concepts: Record<string, ConceptRecord>;
  reviews: ReviewTask[];
  notebook: ErrorNotebookEntry[];
  recommendations: Recommendation[];
  lessonProgress: Record<
    string,
    { activityIndex: number; completedIds: string[]; status: "not_started" | "in_progress" | "completed" }
  >;
  repairProgress: Record<string, { stepIndex: number; completed: boolean }>;
  cmsEvents: CmsEvent[];
  itemOverrides: Record<string, PublicationState>;
  itemVersions: Record<string, number>;
  frq: Record<string, FrqAttemptState>;
  lastRecommendation?: Recommendation;
}

export interface ScoreRequest {
  itemId: string;
  itemVersion: number;
  payload: ResponsePayload;
  firstAttempt: boolean;
}

export interface ScoreResponse {
  ok: boolean;
  error?: string;
  code?: string;
  result?: ScoreResult;
  acknowledgedAt?: string;
  withdrawn?: boolean;
}
