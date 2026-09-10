import type { Metadata } from "next";
import { FRQ_TASKS, getFrq } from "@/content/frq";
import { pageMetadata } from "@/lib/site";

export function generateStaticParams() {
  return FRQ_TASKS.map((task) => ({ id: task.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const task = getFrq(id);
  if (!task) {
    return pageMetadata({
      title: "FRQ not in this slice",
      description: "That handwritten AP Physics 1 task is not part of this Unit 1 slice.",
      path: `/frq/${id}`,
      index: false,
    });
  }
  return pageMetadata({
    title: task.title,
    description:
      "Handwritten free-response practice for the hybrid May 2027 AP Physics 1 exam. Write on paper, upload pages, and self-mark. Not Bluebook.",
    path: `/frq/${id}`,
  });
}

export default function FrqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
