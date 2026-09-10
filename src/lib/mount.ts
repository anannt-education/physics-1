/** Study host mount for Physics 1. Keep this module isomorphic (no next/server). */

export const SUBJECT_SLUG = "physics-1";
export const BASE_PATH = "/physics-1";
export const SITE_ORIGIN = "https://study.anannt.ae";
export const SITE_URL = SITE_ORIGIN;
export const DEV_PORT = 43132;
export const SESSION_COOKIE = "anannt_session";

export const PUBLIC_LESSON_IDS = ["lesson-motion-graphs", "lesson-zero-v-a"] as const;
export const PUBLIC_LESSON_PATHS = [
  "/lesson/lesson-motion-graphs",
  "/lesson/lesson-zero-v-a",
] as const;

export const PUBLIC_LESSON_1 = {
  id: "lesson-motion-graphs",
  path: "/lesson/lesson-motion-graphs",
  title: "Reading motion from position-time graphs",
  unit: "u1",
} as const;

export const PUBLIC_LESSON_2 = {
  id: "lesson-zero-v-a",
  path: "/lesson/lesson-zero-v-a",
  title: "Zero velocity with nonzero acceleration",
  unit: "u1",
} as const;

export function absUrl(path = "/"): string {
  const normalized = !path || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${BASE_PATH}${normalized}`;
}

export function startUrl(unit = ""): string {
  const url = new URL(`${SITE_ORIGIN}/start`);
  url.searchParams.set("subject", SUBJECT_SLUG);
  url.searchParams.set("unit", unit);
  return url.toString();
}

export function whatsappUrl(sku: string): string {
  const text = `Hi Anannt Burjuman — I started ${SUBJECT_SLUG} on study.anannt.ae and want help with ${sku}`;
  return `https://wa.me/971585853551?text=${encodeURIComponent(text)}`;
}

export function appPath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${p}`;
}

export function isPublicLessonId(id: string): boolean {
  return (PUBLIC_LESSON_IDS as readonly string[]).includes(id);
}

export const FOOTER_AP =
  "AP® is a trademark registered by the College Board, which is not affiliated with, and does not endorse, this website.";
export const FOOTER_STUDIO =
  "This studio is a self-study supplement. It does not predict an official AP score and is not Bluebook or AP Classroom.";
export const FOOTER_CONTACT =
  "Anannt Education · Office 105, Bank Street Building, Burjuman Metro Exit 2, Dubai · +971 58585 3551 · wecare@anannt.ae";

export const EVENT_NAMES = [
  "diagnostic_start",
  "lesson2_complete",
  "otp_verified",
  "report_unlock",
  "wa_click",
  "demo_book",
] as const;
export type EventName = (typeof EVENT_NAMES)[number];

export const PUBLIC_SEO = {
  home: {
    path: "/",
    title: "Physics 1 · Unit 1 motion graphs",
    description:
      "Two Unit 1 motion and graph-reading lessons for AP Physics 1. Later units are unpublished. A self-study supplement — Anannt does not predict an AP score.",
  },
  about: {
    path: "/about",
    title: "Physics 1 exam guide · Unit 1",
    description:
      "How Anannt teaches AP Physics 1 Unit 1: graph reading first, then turning points. Units 2–8 stay unpublished. This is not a predicted official AP score.",
  },
  faq: {
    path: "/faq",
    title: "Physics 1 FAQ · Unit 1 only",
    description:
      "Two public motion lessons, unpublished later units, and the mentor gate after lesson 2. Anannt does not predict AP scores or sell a full Physics 1 course.",
  },
  privacy: {
    path: "/privacy",
    title: "Physics 1 privacy and local data",
    description:
      "How this Physics 1 slice stores progress in your browser, what we do not collect, and the Burjuman office details. No payment and no student-data sale here.",
  },
  lesson1: {
    path: "/lesson/lesson-motion-graphs",
    title: "Motion graphs · Physics 1 lesson 1",
    description:
      "Read speeding up, slowing down, or constant velocity from an x-t graph using slope, not height. Public Unit 1 lesson — Anannt does not predict an AP score.",
  },
  lesson2: {
    path: "/lesson/lesson-zero-v-a",
    title: "Turning points · Physics 1 lesson 2",
    description:
      "Explain zero velocity with nonzero acceleration at a turning point. Public Unit 1 Physics 1 lesson 2. Completing it opens the Anannt mentor gate today.",
  },
  diagnostic: {
    path: "/diagnostic",
    title: "Physics 1 diagnostic · start here",
    description:
      "Start the Unit 1 graph-reading diagnostic. “I have not learned this yet” is allowed. After you submit, continue with a mentor at study.anannt.ae in Dubai.",
  },
} as const;
