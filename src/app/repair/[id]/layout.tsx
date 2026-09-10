import type { Metadata } from "next";
import { getRepairPath, REPAIR_PATHS } from "@/content/repairs";
import { pageMetadata } from "@/lib/site";

export function generateStaticParams() {
  return REPAIR_PATHS.map((path) => ({ id: path.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const path = getRepairPath(id);
  if (!path) {
    return pageMetadata({
      title: "Repair path not in this slice",
      description: "That misconception repair is not part of the Unit 1 slice.",
      path: `/repair/${id}`,
      index: false,
    });
  }
  return pageMetadata({
    title: path.title,
    description: path.summary,
    path: `/repair/${id}`,
  });
}

export default function RepairLayout({ children }: { children: React.ReactNode }) {
  return children;
}
