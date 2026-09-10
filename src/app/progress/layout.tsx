import type { Metadata } from "next";
import { pageMetadata, ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMetadata(ROUTES.progress);

export default function ProgressLayout({ children }: { children: React.ReactNode }) {
  return children;
}
