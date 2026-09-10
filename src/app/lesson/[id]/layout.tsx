import type { Metadata } from "next";
import { getLesson, LESSONS } from "@/content/lessons";
import { pageMetadata } from "@/lib/site";
import { PUBLIC_SEO } from "@/lib/mount";

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
  const publicCopy =
    id === "lesson-motion-graphs"
      ? PUBLIC_SEO.lesson1
      : id === "lesson-zero-v-a"
        ? PUBLIC_SEO.lesson2
        : null;
  if (publicCopy) {
    return pageMetadata({
      title: publicCopy.title,
      description: publicCopy.description,
      path: publicCopy.path,
    });
  }
  return pageMetadata({
    title: lesson.title,
    description: lesson.outcome,
    path: `/lesson/${id}`,
    index: false,
  });
}

export default function LessonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
