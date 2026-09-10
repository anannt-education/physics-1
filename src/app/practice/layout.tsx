import type { Metadata } from "next";
import { pageMetadata, ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMetadata(ROUTES.practice);

export default function PracticeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
