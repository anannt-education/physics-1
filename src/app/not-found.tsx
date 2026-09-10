import Link from "next/link";
import { MENTOR } from "@/content/mentor";
import { MentorNote } from "@/components/mentor/mentor-note";

export default function NotFound() {
  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl">Page not found</h1>
      <MentorNote title="That screen is not in this slice">{MENTOR.error.notFound}</MentorNote>
      <Link href="/" className="underline underline-offset-2">
        Return to today’s plan
      </Link>
    </div>
  );
}
