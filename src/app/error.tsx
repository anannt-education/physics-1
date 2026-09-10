"use client";

import { MENTOR } from "@/content/mentor";
import { MentorNote } from "@/components/mentor/mentor-note";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl">This screen failed to render</h1>
      <MentorNote title="Your local progress is still here" tone="error">
        <p>{error.message || MENTOR.error.page}</p>
      </MentorNote>
      <button type="button" className="underline underline-offset-2" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
