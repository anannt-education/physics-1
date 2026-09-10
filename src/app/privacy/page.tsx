import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { PUBLIC_SEO } from "@/lib/mount";

export const metadata: Metadata = pageMetadata({
  title: PUBLIC_SEO.privacy.title,
  description: PUBLIC_SEO.privacy.description,
  path: PUBLIC_SEO.privacy.path,
});

export default function PrivacyPage() {
  return (
    <article className="max-w-3xl space-y-6">
      <h1 className="font-heading text-3xl">Privacy and local data</h1>
      <p>
        Progress, diagnostic answers, and notebook notes for this Physics 1 slice live in this browser. Scoring for
        items runs on the server so keys are not shipped in public payloads. This slice does not take payment.
      </p>
      <p className="text-muted-foreground">
        After lesson 2 or a diagnostic submit, study.anannt.ae may ask for contact details so a Burjuman mentor can
        follow up. Under 13, a parent completes that form.
      </p>
      <p className="text-muted-foreground">
        Anannt Education · Office 105, Bank Street Building, Burjuman Metro Exit 2, Dubai · +971 58585 3551 ·
        wecare@anannt.ae
      </p>
    </article>
  );
}
