import type { Metadata } from "next";
import { pageMetadata, ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ ...ROUTES.reviewPlay, index: false });

export default function ReviewPlayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
