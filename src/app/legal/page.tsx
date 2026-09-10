import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { pageMetadata, ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMetadata(ROUTES.legal);

export default function LegalPage() {
  return (
    <article className="max-w-3xl space-y-8">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Legal", path: "/legal" },
        ]}
      />
      <header>
        <h1 className="font-heading text-3xl tracking-tight">Privacy, local data, and non-affiliation</h1>
        <p className="mt-2 text-muted-foreground">
          This Unit 1 slice is a self-study product from Anannt Education. The notes below describe
          what this release actually does — not a future accounts platform.
        </p>
      </header>

      <section aria-labelledby="privacy" className="space-y-3">
        <h2 id="privacy" className="font-heading text-2xl">
          What is stored on this device
        </h2>
        <p>
          Progress, onboarding answers, practice attempts, notebook entries, and FRQ photos you
          upload live in this browser’s <code>localStorage</code>. Scoring runs on the Next.js
          server so answer keys are not shipped in question payloads. This slice does not create an
          account, does not take payment, and does not sell student data.
        </p>
        <p className="text-muted-foreground">
          Use Reset local progress in the header when you want a clean record. Demo students (Maya,
          Arjun, Priya) are local scenarios, not other people’s files.
        </p>
      </section>

      <section aria-labelledby="affiliation" className="space-y-3">
        <h2 id="affiliation" className="font-heading text-2xl">
          College Board and Bluebook
        </h2>
        <p>
          AP®, Advanced Placement®, and Bluebook® are trademarks of the College Board. Anannt
          Education is not affiliated with, endorsed by, or a partner of the College Board. This
          platform is not the official exam application and does not claim interface equivalence with
          Bluebook.
        </p>
        <p className="text-muted-foreground">
          Official unit names, MCQ weighting ranges, and the May 2027 section timing we cite are
          public course specifications. Exam registration remains the student’s responsibility.
        </p>
      </section>

      <section aria-labelledby="scores" className="space-y-3">
        <h2 id="scores" className="font-heading text-2xl">
          Scores and claims
        </h2>
        <p>
          Independent accuracy in this slice is first-attempt, auto-scored, no-hint evidence on a
          Unit 1 kinematics set. It is not an AP scaled score. Self-marked FRQ points stay labelled
          and out of validated readiness. The results page will not state a confident readiness
          verdict while most of the syllabus is uncovered.
        </p>
      </section>

      <p>
        Questions about this product can start from{" "}
        <Link href="/about" className="underline underline-offset-2">
          About Anannt Education
        </Link>{" "}
        or return to{" "}
        <Link href="/" className="underline underline-offset-2">
          today’s plan
        </Link>
        .
      </p>
    </article>
  );
}
