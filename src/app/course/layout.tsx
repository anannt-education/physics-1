import type { Metadata } from "next";
import { pageMetadata, ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMetadata(ROUTES.course);

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
