import type { Metadata } from "next";
import { SITE_URL as MOUNT_URL } from "@/lib/mount";

/** Public origin for canonical URLs, OG, sitemap, and JSON-LD. Mounted on study.anannt.ae. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? MOUNT_URL).replace(
  /\/$/,
  ""
);

export const SITE_NAME = "Anannt Education";
export const SITE_PRODUCT = "AP Physics 1";
export const SITE_EXAM = "May 2027";

export const DEFAULT_TITLE = "AP Physics 1 — two Unit 1 motion lessons";
export const DEFAULT_DESCRIPTION =
  "Two Unit 1 motion lessons on graph-reading are open with no account. Units 2–8 are unpublished. Anannt Education does not predict an official AP score.";

export function canonicalPath(path: string) {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path.replace(/\/$/, "") : `/${path.replace(/\/$/, "")}`;
}

export function absoluteUrl(path: string) {
  const p = canonicalPath(path);
  return p === "/" ? SITE_URL : `${SITE_URL}${p}`;
}

export function pageMetadata({
  title,
  description,
  path,
  index = false,
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
    index: true,
  },
  about: {
    path: "/about",
    title: "About Anannt Education and this AP Physics 1 studio",
    description:
      "How Anannt Education coaches AP Physics 1: two public Unit 1 graph-reading lessons. Units 2–8 are unpublished. This desk does not predict an AP score.",
  },
  legal: {
    path: "/legal",
    title: "Privacy, local data, and non-affiliation",
    description:
      "How this AP Physics 1 slice stores progress in your browser, what we do not collect in this release, and a clear statement that Anannt Education is not affiliated with the College Board.",
  },
  course: {
    path: "/course",
    title: "AP Physics 1 course map — units, MCQ weights, Unit 1 slice",
    description:
      "Official AP Physics 1 unit names and MCQ weight ranges, with honest coverage: this slice builds the foundation bridge and two Unit 1 kinematics lessons. Units 2–8 are mapped, not filled.",
  },
  practice: {
    path: "/practice",
    title: "AP Physics 1 practice studio — independent motion items",
    description:
      "Untimed independent practice on motion graphs and kinematics. Hinted or solution-exposed answers do not count as mastery evidence. Protected mock items are excluded.",
  },
  onboarding: {
    path: "/onboarding",
    title: "Set up your May 2027 AP Physics 1 study plan",
    description:
      "Tell your Anannt mentor how many hours you can study, your physics background, and access needs. We will name a feasible path — we will not compress the syllabus into a promise.",
  },
  diagnostic: {
    path: "/diagnostic",
    title: "Foundation diagnostic — graph reading start",
    description:
      "Start a foundation graph-reading check for AP Physics 1 with no account. After you submit, we ask how Burjuman can help. We do not predict an AP score.",
  },
  review: {
    path: "/review",
    title: "Error notebook and delayed retrieval",
    description:
      "Each miss keeps the original response, the named misconception, a repair task, and a retest date. Delayed checks use unseen items and are capped in a session.",
  },
  reviewPlay: {
    path: "/review/play",
    title: "Delayed retrieval check",
    description:
      "An unseen delayed check for a kinematics or graph-reading concept. An unsuccessful check shortens the next interval; struggle here is expected, not a verdict.",
  },
  progress: {
    path: "/progress",
    title: "Coverage, retained concepts, and schedule honesty",
    description:
      "See what this AP Physics 1 slice has actually covered, which ideas survived delayed checks, and whether your weekly hours can support the plan. No fake AP score.",
  },
  results: {
    path: "/results",
    title: "Diagnostic report and next study priorities",
    description:
      "Strengths, gaps, and the next concrete move after diagnosis or a lesson. Anannt will not state a confident AP readiness verdict from a Unit 1 slice.",
  },
  mocks: {
    path: "/mocks",
    title: "May 2027 AP Physics 1 exam specification",
    description:
      "Versioned May 2027 format: 42 multiple-choice questions in 85 minutes and 4 free-response questions in 95 minutes. Full protected mocks are not in this Unit 1 slice.",
  },
  admin: {
    path: "/admin",
    title: "Scored-item authoring and review gates",
    description:
      "Anannt’s publish rule: a second person must publish a scored item. Withdrawing hides an item from new attempts without rewriting old ones.",
  },
  lessonMotion: {
    path: "/lesson/lesson-motion-graphs",
    title: "Reading motion from position-time graphs",
    description:
      "Read speeding up or slowing down from an x-t graph using slope, not height. Free Unit 1 AP Physics 1 lesson from Anannt in Dubai. No account needed today.",
    index: true,
  },
  lessonTurning: {
    path: "/lesson/lesson-zero-v-a",
    title: "Zero velocity with nonzero acceleration",
    description:
      "Explain why velocity can be zero while acceleration is not. Free Unit 1 AP Physics 1 turning-point lesson from Anannt Education, Dubai. No account needed.",
    index: true,
  },
  frq: {
    path: "/frq/frq-flattening-graph",
    title: "Handwritten FRQ: a flattening position-time graph",
    description:
      "Short paper-writing task for the hybrid May 2027 AP Physics 1 exam. Write on paper, upload pages, and self-mark against a reviewed rubric. Not Bluebook.",
  },
  repairSlope: {
    path: "/repair/repair-graph-slope",
    title: "Repair: graph height is not slope",
    description:
      "A short Anannt repair path for the height-as-slope mix-up. Name the misconception, separate the slope triangle from the height of a point, then try a fresh graph.",
  },
  repairTurning: {
    path: "/repair/repair-turning-point",
    title: "Repair: stopping is not zero acceleration",
    description:
      "Repair the idea that rest means acceleration is zero. At a turning point, velocity can be zero while acceleration remains nonzero.",
  },
} as const;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Office 105, Bank Street Building, Burjuman Metro Exit 2",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
    telephone: "+971585853551",
    email: "wecare@anannt.ae",
    description:
      "Anannt Education designs exam-aware physics coaching: diagnosis, graph-reading repair, and two public Unit 1 lessons. Units 2–8 are unpublished.",
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
      "Unit 1 kinematics slice: two public graph-reading lessons. Units 2–8 are unpublished. A self-study supplement — Anannt Education does not predict an official AP score.",
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

export const SITEMAP_PATHS = [ROUTES.home.path, ROUTES.lessonMotion.path, ROUTES.lessonTurning.path] as const;
