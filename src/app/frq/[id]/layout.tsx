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
      "Short paper-writing task for the hybrid May 2027 Physics 1 exam. Gated after the two public lessons. Self-study supplement only.",
    path: `/frq/${id}`,
    index: false,
  });
}

export default function FrqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
