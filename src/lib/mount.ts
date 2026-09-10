/** Study host mount contract. Do not invent a second catalog or gate form. */

export const SITE_ORIGIN = "https://study.anannt.ae";
export const BASE_PATH = "/physics-1";
export const SUBJECT_SLUG = "physics-1";
export const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`;
export const SESSION_COOKIE = "anannt_study_session";
export const DEV_PORT = 43132;

export const PUBLIC_LESSONS = [
  {
    id: "lesson-motion-graphs",
    path: "/lesson/lesson-motion-graphs",
    unit: "u1",
    title: "Reading motion from position-time graphs",
  },
  {
    id: "lesson-zero-v-a",
    path: "/lesson/lesson-zero-v-a",
    unit: "u1",
    title: "Zero velocity with nonzero acceleration",
  },
] as const;

export const PUBLIC_LESSON_IDS = new Set(PUBLIC_LESSONS.map((l) => l.id));
export const LESSON_2 = PUBLIC_LESSONS[1];

export function absUrl(path = "/") {
  const p = !path || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

export function gateHref(unit = "") {
  const url = new URL("/start", SITE_ORIGIN);
  url.searchParams.set("subject", SUBJECT_SLUG);
  url.searchParams.set("unit", unit);
  return url.toString();
}

export function waitlistHref(unit = "") {
  const url = new URL("/start", SITE_ORIGIN);
  url.searchParams.set("subject", SUBJECT_SLUG);
  url.searchParams.set("unit", unit);
  url.searchParams.set("intent", "waitlist");
  return url.toString();
}

export function isPublicLessonPath(pathname: string) {
  return PUBLIC_LESSONS.some((l) => pathname === l.path || pathname.startsWith(`${l.path}/`));
}

export function isLesson2(lessonId: string) {
  return lessonId === LESSON_2.id;
}

export const LEGAL = {
  ap: "AP® is a trademark registered by the College Board, which is not affiliated with, and does not endorse, this website.",
  psat: "PSAT/NMSQT® is a registered trademark of the College Board and the National Merit Scholarship Corporation, which are not affiliated with, and do not endorse, this website.",
  supplement:
    "This studio is a self-study supplement. It does not predict an official AP score and is not Bluebook or AP Classroom.",
  nap: "Anannt Education · Office 105, Bank Street Building, Burjuman Metro Exit 2, Dubai · +971 58585 3551 · wecare@anannt.ae",
} as const;

export const ROBOTS_DISALLOW = [
  `${BASE_PATH}/mock`,
  `${BASE_PATH}/mocks`,
  `${BASE_PATH}/api`,
  `${BASE_PATH}/keys`,
  `${BASE_PATH}/practice`,
  `${BASE_PATH}/frq`,
  "/mock",
  "/mocks",
  "/api",
  "/keys",
];

export const GATED_PREFIXES = [
  "/onboarding",
  "/practice",
  "/frq",
  "/mocks",
  "/progress",
  "/results",
  "/review",
  "/admin",
];

export const PUBLIC_REPAIR_PREFIX = "/repair";
