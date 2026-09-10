/**
 * Study.anannt.ae mount + gate contract (Agent C).
 * Agent A owns the /start form. Copy field names only — do not ship a second form.
 */
export const STUDY_ORIGIN = "https://study.anannt.ae";
export const BASE_PATH = "/physics-1";
export const SUBJECT_SLUG = "physics-1";
export const SESSION_COOKIE = "anannt_study_session";

export const PUBLIC_LESSON_IDS = ["lesson-motion-graphs", "lesson-zero-v-a"] as const;
export const PUBLIC_LESSON_1 = "lesson-motion-graphs";
export const PUBLIC_LESSON_2 = "lesson-zero-v-a";

export const GATE_FIELDS = [
  "firstName",
  "email",
  "parentWhatsApp",
  "role",
  "ageBand",
  "sitting",
  "schoolType",
  "intent",
  "consent",
] as const;

export function isPublicLesson(id: string) {
  return (PUBLIC_LESSON_IDS as readonly string[]).includes(id);
}

export function studyStartUrl(unit = "") {
  const url = new URL("/start", STUDY_ORIGIN);
  url.searchParams.set("subject", SUBJECT_SLUG);
  url.searchParams.set("unit", unit);
  return url.toString();
}

export function waitlistUrl(unit = "") {
  const url = new URL("/start", STUDY_ORIGIN);
  url.searchParams.set("subject", SUBJECT_SLUG);
  url.searchParams.set("intent", "waitlist");
  url.searchParams.set("unit", unit);
  return url.toString();
}
