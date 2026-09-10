/** Study host mount for AP Physics 1. Catalog slug: physics-1. */

export const STUDY_ORIGIN = "https://study.anannt.ae";
export const BASE_PATH = "/physics-1";
export const SUBJECT_SLUG = "physics-1";
export const SITE_URL = `${STUDY_ORIGIN}${BASE_PATH}`;

export const NAP =
  "Anannt Education · Office 105, Bank Street Building, Burjuman Metro Exit 2, Dubai · +971 58585 3551 · wecare@anannt.ae";

export const FOOTER_AP =
  "AP® is a trademark registered by the College Board, which is not affiliated with, and does not endorse, this website.";

export const FOOTER_PSAT =
  "PSAT/NMSQT® is a registered trademark of the College Board and the National Merit Scholarship Corporation, which are not affiliated with, and do not endorse, this website.";

export const FOOTER_STUDIO =
  "This studio is a self-study supplement. It does not predict an official AP score and is not Bluebook or AP Classroom.";

export const PUBLIC_LESSONS = [
  {
    id: "lesson-motion-graphs",
    path: "/lesson/lesson-motion-graphs",
    unit: "u1",
    title: "Reading motion from position-time graphs",
    description:
      "Read speeding up or slowing down from an x-t graph using slope, not height. Free Unit 1 AP Physics 1 lesson from Anannt in Dubai. No account needed today.",
  },
  {
    id: "lesson-zero-v-a",
    path: "/lesson/lesson-zero-v-a",
    unit: "u1",
    title: "Zero velocity, nonzero acceleration",
    description:
      "Explain why velocity can be zero while acceleration is not. Free Unit 1 AP Physics 1 turning-point lesson from Anannt Education, Dubai. No account needed.",
  },
] as const;

export const PUBLIC_LESSON_IDS = PUBLIC_LESSONS.map((l) => l.id);

export const PUBLIC_PATHS = new Set<string>([
  "/",
  "/about",
  "/legal",
  "/course",
  "/diagnostic",
  ...PUBLIC_LESSONS.map((l) => l.path),
]);

const GATED_PREFIXES = [
  "/practice",
  "/frq",
  "/mocks",
  "/onboarding",
  "/progress",
  "/results",
  "/review",
  "/admin",
];

export function gateUrl(unit = "") {
  const url = new URL("/start", STUDY_ORIGIN);
  url.searchParams.set("subject", SUBJECT_SLUG);
  url.searchParams.set("unit", unit);
  return url.toString();
}

export function whatsappUrl(sku = "doubts") {
  const text = `Hi Anannt Burjuman — I started ${SUBJECT_SLUG} on study.anannt.ae and want help with ${sku}`;
  return `https://wa.me/971585853551?text=${encodeURIComponent(text)}`;
}

export function normalizePath(pathname: string) {
  let path = pathname;
  if (path.startsWith(BASE_PATH)) {
    path = path.slice(BASE_PATH.length) || "/";
  }
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path || "/";
}

export function isPublicLesson(id: string) {
  return PUBLIC_LESSON_IDS.includes(id as (typeof PUBLIC_LESSON_IDS)[number]);
}

export function isPublicPath(pathname: string) {
  const path = normalizePath(pathname);
  if (PUBLIC_PATHS.has(path)) return true;
  if (path.startsWith("/repair/")) return true;
  return false;
}

export function isGatedPath(pathname: string) {
  const path = normalizePath(pathname);
  if (isPublicPath(path)) return false;
  if (path.startsWith("/lesson/")) {
    const id = path.slice("/lesson/".length);
    return !isPublicLesson(id);
  }
  return GATED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

export function unitForGate(pathname: string) {
  const path = normalizePath(pathname);
  const lesson = PUBLIC_LESSONS.find((l) => l.path === path);
  if (lesson) return lesson.unit;
  if (path.startsWith("/lesson/")) return "u1";
  if (path.startsWith("/practice")) return "practice";
  if (path.startsWith("/frq")) return "frq";
  if (path.startsWith("/mocks")) return "mocks";
  return "";
}

export function robotsDisallow() {
  return [
    `${BASE_PATH}/mocks`,
    `${BASE_PATH}/mock`,
    `${BASE_PATH}/api`,
    `${BASE_PATH}/practice`,
    `${BASE_PATH}/frq`,
    `${BASE_PATH}/admin`,
    `${BASE_PATH}/review`,
    `${BASE_PATH}/progress`,
    `${BASE_PATH}/results`,
    `${BASE_PATH}/onboarding`,
  ];
}

export function robotsAllow() {
  return [
    BASE_PATH,
    ...PUBLIC_LESSONS.map((l) => `${BASE_PATH}${l.path}`),
    `${BASE_PATH}/repair`,
  ];
}
