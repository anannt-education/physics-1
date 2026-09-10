import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { PUBLIC_LESSON_1, PUBLIC_LESSON_2, PUBLIC_SEO, whatsappUrl } from "@/lib/mount";

export const metadata: Metadata = pageMetadata({
  title: PUBLIC_SEO.faq.title,
  description: PUBLIC_SEO.faq.description,
  path: PUBLIC_SEO.faq.path,
});

export default function FaqPage() {
  return (
    <article className="max-w-3xl space-y-6">
      <h1 className="font-heading text-3xl">Physics 1 FAQ</h1>
      <p className="text-muted-foreground">
        Unit 1 only: two motion and graph-reading lessons. Units 2–8 are unpublished. Anannt does not predict an AP
        score.
      </p>
      <dl className="space-y-5 text-[15px] leading-7">
        <div>
          <dt className="font-medium">What can I study without an account?</dt>
          <dd className="mt-1 text-muted-foreground">
            <Link className="underline" href={PUBLIC_LESSON_1.path}>
              {PUBLIC_LESSON_1.title}
            </Link>{" "}
            and{" "}
            <Link className="underline" href={PUBLIC_LESSON_2.path}>
              {PUBLIC_LESSON_2.title}
            </Link>
            , plus the diagnostic start.
          </dd>
        </div>
        <div>
          <dt className="font-medium">Where are Units 2–8?</dt>
          <dd className="mt-1 text-muted-foreground">
            Labelled unpublished. We will not generate a fake full Physics 1 course to fill the map.
          </dd>
        </div>
        <div>
          <dt className="font-medium">Will this predict my AP score?</dt>
          <dd className="mt-1 text-muted-foreground">
            No. This studio does not predict AP 1–5, is not Bluebook, and is not AP Classroom.
          </dd>
        </div>
        <div>
          <dt className="font-medium">How do I reach a mentor?</dt>
          <dd className="mt-1 text-muted-foreground">
            <a className="underline" href={whatsappUrl("physics-1-faq")}>
              WhatsApp +971 58585 3551
            </a>
          </dd>
        </div>
      </dl>
    </article>
  );
}
