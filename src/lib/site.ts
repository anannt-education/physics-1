import type { Metadata } from "next";
import { BASE_PATH, STUDY_ORIGIN } from "@/lib/gate";

/** Public origin for canonical URLs, OG, sitemap, and JSON-LD. */
export const SITE_URL = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || STUDY_ORIGIN).replace(
  /\/$/,
  ""
);

export { BASE_PATH, STUDY_ORIGIN };

export const SITE_NAME = "Anannt Education";
export const SITE_PRODUCT = "AP Physics 1";
export const SITE_EXAM = "May 2027";

export const DEFAULT_TITLE = "Physics 1 · two Unit 1 motion lessons";
export const DEFAULT_DESCRIPTION =
  "Unit 1 motion is open: two graph-reading lessons, no account. Units 2–8 are unpublished. A Burjuman self-study supplement for the May 2027 exam—not a complete course.";

export const LEGAL_LINES = [
  "AP® is a trademark registered by the College Board, which is not affiliated with, and does not endorse, this website.",
  "PSAT/NMSQT® is a registered trademark of the College Board and the National Merit Scholarship Corporation, which are not affiliated with, and does not endorse, this website.",
  "This studio is a self-study supplement. It does not predict an official AP score and is not Bluebook or AP Classroom.",
] as const;

export const NAP =
  "Anannt Education · Office 105, Bank Street Building, Burjuman Metro Exit 2, Dubai · +971 58585 3551 · wecare@anannt.ae";

export function canonicalPath(path: string) {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path.replace(/\/$/, "") : `/${path.replace(/\/$/, "")}`;
}

export function absoluteUrl(path: string) {
  const p = canonicalPath(path);
  return p === "/" ? `${SITE_URL}${BASE_PATH}` : `${SITE_URL}${BASE_PATH}${p}`;
}

export function pageMetadata({
  title,
  description,
  path,
  index = true,
}: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export const ROUTES = {
  home: {
    path: "/",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  about: {
    path: "/about",
    title: "Physics 1 exam guide · graph reading",
    description:
      "How Anannt coaches Unit 1 motion: diagnose first, repair height-as-slope mix-ups, then two public lessons. Units 2–8 stay unpublished.",
  },
  legal: {
    path: "/legal",
    title: "Privacy, local data, and non-affiliation",
    description:
      "Progress stays in this browser. No payment. Anannt Education is not affiliated with the College Board. Self-study supplement from Burjuman, Dubai.",
  },
  course: {
    path: "/course",
    title: "Physics 1 map · Unit 1 open",
    description:
      "Unit 1 kinematics is open with two motion lessons. Units 2–8 are labelled unpublished—ask to be told when they are ready. No invented content.",
  },
  practice: {
    path: "/practice",
    title: "AP Physics 1 practice studio",
    description:
      "Independent motion items after the two public lessons. Hinted answers do not count as mastery. Gated after the study desk.",
    index: false,
  },
  onboarding: {
    path: "/onboarding",
    title: "Set up your May 2027 AP Physics 1 study plan",
    description:
      "Tell a Burjuman mentor how many hours you can study. The live gate lives on study.anannt.ae/start with a required parent WhatsApp.",
    index: false,
  },
  diagnostic: {
    path: "/diagnostic",
    title: "Physics 1 diagnostic start",
    description:
      "Start a foundation graph-reading check with no account. After you submit, we ask for email and a required parent WhatsApp.",
  },
  review: {
    path: "/review",
    title: "Error notebook and delayed retrieval",
    description:
      "Each miss keeps the original response and a repair task. Gated after two public lessons. No fake AP score from a Unit 1 slice.",
    index: false,
  },
  reviewPlay: {
    path: "/review/play",
    title: "Delayed retrieval check",
    description:
      "An unseen delayed check for a kinematics or graph-reading concept. Gated. Struggle here is expected, not a verdict.",
    index: false,
  },
  progress: {
    path: "/progress",
    title: "Coverage, retained concepts, and schedule honesty",
    description:
      "See what this Physics 1 slice has covered. Gated after two lessons. No fake AP score from Unit 1 alone.",
    index: false,
  },
  results: {
    path: "/results",
    title: "Diagnostic report and next study priorities",
    description:
      "Strengths and gaps after diagnosis. Gated after submit. Anannt will not state a confident AP readiness verdict from Unit 1.",
    index: false,
  },
  mocks: {
    path: "/mocks",
    title: "May 2027 AP Physics 1 exam specification",
    description:
      "Format notes for the May 2027 exam. Full protected mocks are gated and noindex. This Unit 1 slice is not a complete course.",
    index: false,
  },
  admin: {
    path: "/admin",
    title: "Scored-item authoring and review gates",
    description:
      "A second person must publish a scored item. Authoring is gated and noindex. Keys stay server-side.",
    index: false,
  },
  lessonMotion: {
    path: "/lesson/lesson-motion-graphs",
    title: "Reading motion from position-time graphs",
    description:
      "Lesson 1, free and no account: decide speeding up, slowing down, or constant velocity from slope, not from graph height.",
  },
  lessonTurning: {
    path: "/lesson/lesson-zero-v-a",
    title: "Zero velocity with nonzero acceleration",
    description:
      "Lesson 2, free and no account: an object can be instantly at rest while velocity is still changing—the turning-point idea.",
  },
  frq: {
    path: "/frq/frq-flattening-graph",
    title: "Handwritten FRQ: a flattening position-time graph",
    description:
      "Short paper-writing task for the hybrid May 2027 exam. Gated after two public lessons. Keys stay server-side.",
    index: false,
  },
  repairSlope: {
    path: "/repair/repair-graph-slope",
    title: "Repair: graph height is not slope",
    description:
      "Public repair path: name the height-as-slope mix-up, separate the slope triangle from the height of a point, then try a fresh graph.",
  },
  repairTurning: {
    path: "/repair/repair-turning-point",
    title: "Repair: stopping is not zero acceleration",
    description:
      "Public repair path: at a turning point, velocity can be zero while acceleration remains nonzero. Graph-reading, not a score claim.",
  },
} as const;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Anannt Education designs exam-aware physics coaching: diagnosis, graph-reading repair, and scored items that require a second-person publish gate.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Office 105, Bank Street Building, Burjuman Metro Exit 2",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
    telephone: "+971 58585 3551",
    email: "wecare@anannt.ae",
    knowsAbout: ["AP Physics 1", "Kinematics", "Motion graphs", "Physics education"],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${SITE_NAME} ${SITE_PRODUCT}`,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: { "@type": "EducationalOrganization", name: SITE_NAME, url: SITE_URL },
    inLanguage: "en-US",
  };
}

export function courseJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "AP Physics 1 exam preparation",
    description:
      "A self-study Unit 1 kinematics slice: two public motion lessons. Units 2–8 are unpublished. Not a complete course and not a predicted AP score.",
    url: SITE_URL,
    provider: {
      "@type": "EducationalOrganization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    educationalLevel: "High school",
    teaches: [
      "Reading slope as velocity on position-time graphs",
      "Distinguishing graph height from rate of change",
      "Zero instantaneous velocity with nonzero acceleration",
      "Paper-based free-response writing for a hybrid digital exam",
    ],
    hasCourseInstance: {
      "@type": "CourseInstance",
      name: "May 2027 exam cohort — Unit 1 slice",
      courseMode: "online",
      location: { "@type": "VirtualLocation", url: SITE_URL },
    },
    isAccessibleForFree: true,
    inLanguage: "en-US",
  };
}

export function programJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    name: "AP Physics 1 exam preparation",
    description:
      "A self-study supplement that places students, repairs graph-reading misconceptions, and assigns the next evidence-based task for the May 2027 AP Physics 1 exam.",
    url: absoluteUrl("/about"),
    provider: { "@type": "EducationalOrganization", name: SITE_NAME, url: SITE_URL },
    educationalProgramMode: "online",
    timeToComplete: "P16W",
    occupationalCategory: "35-0000",
    educationalCredentialAwarded:
      "Preparation for the AP Physics 1 exam. Anannt does not award an official AP score.",
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export const SITEMAP_PATHS = [
  ROUTES.home.path,
  ROUTES.about.path,
  ROUTES.legal.path,
  ROUTES.course.path,
  ROUTES.diagnostic.path,
  ROUTES.lessonMotion.path,
  ROUTES.lessonTurning.path,
  ROUTES.repairSlope.path,
  ROUTES.repairTurning.path,
] as const;
