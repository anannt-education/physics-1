import type { Metadata } from "next";

/** Public origin for canonical URLs, OG, sitemap, and JSON-LD. Override in production. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://anannt.education").replace(
  /\/$/,
  ""
);

export const SITE_NAME = "Anannt Education";
export const SITE_PRODUCT = "AP Physics 1";
export const SITE_EXAM = "May 2027";

export const DEFAULT_TITLE = "AP Physics 1 prep for the May 2027 exam";
export const DEFAULT_DESCRIPTION =
  "Anannt Education coaches AP Physics 1 for the May 2027 exam: diagnose the stuck idea, name why this task is next, repair graph reading, and keep scored items behind a second-person publish gate. A self-study supplement — not a predicted AP score and not College Board.";

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
    alternates: { canonical: canonicalPath(path) },
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
    title: "About Anannt Education and this AP Physics 1 course",
    description:
      "How Anannt Education coaches AP Physics 1: diagnosis before lecture, why-this-next planning, graph-reading repair, handwritten FRQ for the hybrid May 2027 exam, and scored-item authoring gates. Not affiliated with the College Board.",
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
    title: "Foundation diagnostic — graph reading and kinematics placement",
    description:
      "A resumable 10-item foundation diagnostic. “I have not learned this yet” is not scored as a wrong model. Placement is provisional, never permanent mastery.",
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
      "Unit 1 lesson: determine speeding up, slowing down, or constant velocity from an x-t graph using slope, not height.",
  },
  lessonTurning: {
    path: "/lesson/lesson-zero-v-a",
    title: "Zero velocity with nonzero acceleration",
    description:
      "Unit 1 lesson: explain why an object can be instantaneously at rest while its velocity is still changing — the turning-point idea on the May 2027 exam.",
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
      "Guided AP Physics 1 preparation for the May 2027 exam. The current release is a Unit 1 kinematics slice: foundation diagnostic, motion-graph lessons, practice, misconception repair, and a handwritten free-response task.",
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
  ROUTES.practice.path,
  ROUTES.onboarding.path,
  ROUTES.diagnostic.path,
  ROUTES.review.path,
  ROUTES.progress.path,
  ROUTES.results.path,
  ROUTES.mocks.path,
  ROUTES.lessonMotion.path,
  ROUTES.lessonTurning.path,
  ROUTES.frq.path,
  ROUTES.repairSlope.path,
  ROUTES.repairTurning.path,
] as const;
