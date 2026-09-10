import type { Metadata } from "next";
import { getLesson, LESSONS } from "@/content/lessons";
import { pageMetadata } from "@/lib/site";

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ id: lesson.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const lesson = getLesson(id);
  if (!lesson) {
    return pageMetadata({
      title: "Lesson not in this slice",
      description: "That AP Physics 1 lesson is not part of the Unit 1 kinematics slice.",
      path: `/lesson/${id}`,
      index: false,
    });
  }
  const publicLesson = id === "lesson-motion-graphs" || id === "lesson-zero-v-a";
  return pageMetadata({
    title: lesson.title,
    description: lesson.outcome,
    path: `/lesson/${id}`,
    index: publicLesson,
  });
}

export default function LessonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
