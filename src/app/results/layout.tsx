import type { Metadata } from "next";
import { pageMetadata, ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMetadata(ROUTES.results);

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
