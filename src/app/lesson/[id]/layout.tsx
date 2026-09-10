import type { Metadata } from "next";
import { getLesson, LESSONS } from "@/content/lessons";
import { pageMetadata, ROUTES } from "@/lib/site";

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
      description: "That Physics 1 lesson is not part of the public Unit 1 pair. Later units stay unpublished.",
      path: `/lesson/${id}`,
      index: false,
    });
  }
  const publicSeo =
    id === "lesson-motion-graphs"
      ? ROUTES.lessonMotion
      : id === "lesson-zero-v-a"
        ? ROUTES.lessonTurning
        : null;
  const publicLesson = Boolean(publicSeo);
  return pageMetadata({
    title: publicSeo?.title ?? lesson.title,
    description: publicSeo?.description ?? lesson.outcome,
    path: `/lesson/${id}`,
    index: publicLesson,
  });
}

export default function LessonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
