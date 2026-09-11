import type { Metadata } from "next";
import { SITE_URL as MOUNT_SITE_URL, absUrl as mountAbsUrl } from "@/lib/mount";

/** Public origin + mount path for canonical URLs, OG, sitemap, and JSON-LD. */
export const SITE_URL = MOUNT_SITE_URL;

export const SITE_NAME = "Anannt Education";
export const SITE_PRODUCT = "AP Physics 1";
export const SITE_EXAM = "May 2027";

export const DEFAULT_TITLE = "Physics 1 Unit 1 — start with motion graphs";
export const DEFAULT_DESCRIPTION =
  "Unit 1 motion is open: start with graph-reading. Units 2–8 stay unpublished. Self-study for the May 2027 Physics 1 exam taught from Dubai.";

export function canonicalPath(path: string) {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path.replace(/\/$/, "") : `/${path.replace(/\/$/, "")}`;
}

export function absoluteUrl(path: string) {
  return mountAbsUrl(canonicalPath(path));
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
    title: "How this Physics 1 desk teaches Unit 1",
    description:
      "Two public graph-reading lessons, unpublished later units, and a repair path for height-versus-slope mix-ups. A self-study supplement for May 2027 in Dubai.",
  },
  legal: {
    path: "/legal",
    title: "Privacy, local data, and College Board line",
    description:
      "Progress stays in this browser. No cart and no payment. Anannt Education is not affiliated with the College Board. Self-study supplement only in Dubai.",
  },
  course: {
    path: "/course",
    title: "Physics 1 map — Unit 1 open, units 2–8 unpublished",
    description:
      "Two Unit 1 motion and graph-reading lessons are public. Units 2–8 stay labelled unpublished. Ask to be told when lesson 1 of a later unit is ready here.",
  },
  practice: {
    path: "/practice",
    title: "Physics 1 practice studio",
    description:
      "Independent motion items after the two public lessons. This path is gated. Hinted answers do not count as mastery evidence.",
    index: false,
  },
  onboarding: {
    path: "/onboarding",
    title: "Physics 1 start gate",
    description:
      "The start form lives on study.anannt.ae. Parent WhatsApp is required. This app does not collect a second form.",
    index: false,
  },
  diagnostic: {
    path: "/diagnostic",
    title: "Physics 1 diagnostic start — graph reading",
    description:
      "Start a foundation graph-reading check with no account. Submit sends you to study.anannt.ae/start. Placement help, not a predicted Physics 1 exam score.",
  },
  review: {
    path: "/review",
    title: "Error notebook and delayed retrieval",
    description:
      "Each miss keeps the original response, the named misconception, a repair task, and a retest date. Delayed checks use unseen items and are capped in a session.",
    index: false,
  },
  reviewPlay: {
    path: "/review/play",
    title: "Delayed retrieval check",
    description:
      "An unseen delayed check for a kinematics or graph-reading concept. An unsuccessful check shortens the next interval; struggle here is expected, not a verdict.",
    index: false,
  },
  progress: {
    path: "/progress",
    title: "Coverage, retained concepts, and schedule honesty",
    description:
      "See what this AP Physics 1 slice has actually covered, which ideas survived delayed checks, and whether your weekly hours can support the plan. No fake AP score.",
    index: false,
  },
  results: {
    path: "/results",
    title: "Diagnostic report and next study priorities",
    description:
      "Strengths, gaps, and the next concrete move after diagnosis or a lesson. Anannt will not state a confident AP readiness verdict from a Unit 1 slice.",
    index: false,
  },
  mocks: {
    path: "/mocks",
    title: "May 2027 Physics 1 exam specification",
    description:
      "Versioned May 2027 format notes. Protected mocks stay noindex and need a study session. This Unit 1 desk is not a complete commercial course.",
    index: false,
  },
  admin: {
    path: "/admin",
    title: "Scored-item authoring and review gates",
    description:
      "Anannt’s publish rule: a second person must publish a scored item. Withdrawing hides an item from new attempts without rewriting old ones.",
    index: false,
  },
  lessonMotion: {
    path: "/lesson/lesson-motion-graphs",
    title: "Reading motion from position-time graphs",
    description:
      "Unit 1 public lesson: speeding up, slowing down, or constant velocity from an x-t graph using slope, not height. No account. A Dubai self-study lesson.",
  },
  lessonTurning: {
    path: "/lesson/lesson-zero-v-a",
    title: "Zero velocity with nonzero acceleration",
    description:
      "Unit 1 public lesson: rest can sit with nonzero acceleration at a turning point. Second open graph-reading lesson. No account. A Dubai self-study path.",
  },
  frq: {
    path: "/frq/frq-flattening-graph",
    title: "Handwritten FRQ: a flattening position-time graph",
    description:
      "Short paper-writing task for the hybrid May 2027 Physics 1 exam. Gated after the two public lessons. Self-study supplement only.",
    index: false,
  },
  repairSlope: {
    path: "/repair/repair-graph-slope",
    title: "Repair: graph height is not slope",
    description:
      "A short Anannt repair path for the height-as-slope mix-up. Name the misconception, separate the slope triangle from the height of a point, then retry.",
  },
  repairTurning: {
    path: "/repair/repair-turning-point",
    title: "Repair: stopping is not zero acceleration",
    description:
      "Repair the idea that rest means acceleration is zero. At a turning point, velocity can be zero while acceleration remains nonzero. Dubai self-study only.",
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
      "Guided Physics 1 preparation for the May 2027 exam. Start with Unit 1 motion graphs. Units 2–8 unpublished. A self-study supplement, not a complete commercial course.",
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
