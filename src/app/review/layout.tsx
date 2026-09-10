import type { Metadata } from "next";
import { pageMetadata, ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMetadata(ROUTES.review);

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
