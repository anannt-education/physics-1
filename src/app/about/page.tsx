import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { pageMetadata, programJsonLd, ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMetadata(ROUTES.about);

const METHOD = [
  {
    title: "Diagnosis before lecture",
    body: "We start with a resumable foundation check. “I have not learned this yet” is not scored as a wrong model. Placement is provisional — never a permanent mastery stamp.",
  },
  {
    title: "Why this next",
    body: "Every Continue action names the reason, the evidence, and the rule version. If a blocking graph-reading mix-up is confirmed, the planner sends you to a repair path before Unit 1 lessons.",
  },
  {
    title: "Graph-reading repair",
    body: "Height is position; slope is velocity. When a student treats a high x-t graph as “fast,” we name that misconception, separate the slope triangle from the height of a point, and try the idea on a fresh graph.",
  },
  {
    title: "Independent evidence",
    body: "Hints and worked solutions are allowed. They just do not count as independent proficiency. A correct answer after “show solution” stays Learning until a new unseen item is answered on its own.",
  },
  {
    title: "Paper writing for a hybrid exam",
    body: "May 2027 is hybrid: prompts on screen, free response on paper. This course trains that habit. We do not claim Bluebook equivalence.",
  },
  {
    title: "Scored-item authoring gates",
    body: "A second person must publish a scored item. Withdrawing hides it from new attempts and does not rewrite old ones. That craft is how Anannt keeps keys exam-aware.",
  },
];

export default function AboutPage() {
  return (
    <article className="space-y-10">
      <JsonLd data={programJsonLd()} />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "About Anannt Education", path: "/about" },
        ]}
      />
      <header className="max-w-3xl">
        <p className="text-sm font-medium tracking-wide text-primary">Anannt Education · AP Physics 1</p>
        <h1 className="mt-2 font-heading text-3xl tracking-tight sm:text-4xl">
          Exam-aware physics coaching — diagnosis first, then the next honest move
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Anannt Education is the subject-matter expert behind this course. We infer that through
          craft, not slogans: precise physics language, misconception tags on distractors, a planner
          that will not invent an AP score, and a publish gate a single author cannot bypass.
        </p>
      </header>

      <section aria-labelledby="who-we-are" className="max-w-3xl space-y-3">
        <h2 id="who-we-are" className="font-heading text-2xl">
          Who Anannt Education is
        </h2>
        <p>
          We write AP Physics 1 prep the way a careful mentor teaches: name the idea that is actually
          stuck, explain why the next task is this one, and treat struggle as expected. This product is a
          self-study supplement for the May 2027 exam. It is not a predicted AP score, not an official
          practice exam, and not affiliated with the College Board.
        </p>
        <p className="text-muted-foreground">
          We will not call ourselves “#1.” We will not imply a College Board partnership. Expertise
          here looks like a height-versus-slope repair, a handwritten flattening-graph FRQ, and a
          reviewer who has to publish the key.
        </p>
      </section>

      <section aria-labelledby="who-its-for">
        <h2 id="who-its-for" className="mb-3 font-heading text-2xl">
          Who this course is for
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Students searching AP Physics 1 prep</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              You want kinematics graphs that make sense, not another undifferentiated question bank.
              Start with placement, then a Unit 1 motion-representation slice you can finish.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Parents who want an honest plan</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Weekly hours are treated as a constraint, not a dare. If the calendar cannot hold Units
              1–8 before May, the planner says so instead of compressing the syllabus in silence.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Teachers and authors</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Scored items need a second person. The authoring console exists so keys stay reviewed —
              the same standard we would ask of any exam-aware department.
            </CardContent>
          </Card>
        </div>
      </section>

      <section aria-labelledby="method">
        <h2 id="method" className="mb-3 font-heading text-2xl">
          How your mentor works
        </h2>
        <p className="mb-4 max-w-3xl text-muted-foreground">
          Encouragement here is specific. We name the misconception, name the next move, and do not
          praise a lucky click. Empty, loading, and wrong-answer states use the same voice.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {METHOD.map((item) => (
            <Card key={item.title} size="sm">
              <CardHeader>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription>{item.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="exam" className="max-w-3xl space-y-3">
        <h2 id="exam" className="font-heading text-2xl">
          May 2027 exam framing
        </h2>
        <p>
          The public AP Physics 1 exam in May 2027 is planned as 42 multiple-choice questions in 85
          minutes and 4 free-response questions in 95 minutes, with equal section weight and a hybrid
          delivery: prompts on screen, FRQs on paper. Our mock centre stores that as versioned data so
          later timed forms can enforce it. This Unit 1 slice does not sell a complete syllabus or a
          protected full-length mock.
        </p>
        <p className="text-muted-foreground">
          Exam registration remains yours. Official unit names and MCQ weighting ranges come from the
          College Board course page; we cite them as public specification, not as an endorsement.
        </p>
      </section>

      <section aria-labelledby="slice" className="max-w-3xl space-y-3">
        <h2 id="slice" className="font-heading text-2xl">
          What is in this release
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Onboarding that asks for hours, physics background, and access needs — then names a feasible path.</li>
          <li>A foundation diagnostic that resumes after refresh.</li>
          <li>Two Unit 1 lessons: slope-as-velocity on x-t graphs, and zero velocity with nonzero acceleration.</li>
          <li>A graph-slope repair path and a turning-point repair.</li>
          <li>Independent practice (hinted answers excluded from mastery evidence).</li>
          <li>A short handwritten explanation of a flattening graph, with guided self-mark.</li>
          <li>An error notebook, delayed retrieval, and a results page that refuses a confident readiness verdict.</li>
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/onboarding" className={buttonVariants()}>
          Set up a study plan
        </Link>
        <Link href="/course" className={buttonVariants({ variant: "outline" })}>
          Open the course map
        </Link>
        <Link href="/legal" className={buttonVariants({ variant: "ghost" })}>
          Privacy and non-affiliation
        </Link>
      </div>
    </article>
  );
}
